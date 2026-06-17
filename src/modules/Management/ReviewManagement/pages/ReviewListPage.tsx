import { formatDateTime, formatDateTimeFull, formatFullName } from "@/utils/format";
import {
  FileTextOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  SearchOutlined,
  SendOutlined,
  StarOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  Divider,
  Form,
  Rate,
  Row,
  Statistic,
  Tag,
  Typography,
} from "antd";
import React, { useCallback, useMemo, useState } from "react";

// Custom UI Components & Wrappers
import CButton from "@/components/UI/Button";
import CInput from "@/components/UI/Input";
import CModal from "@/components/UI/Modal";
import PageHeader from "@/components/UI/PageHeader";
import CSelect from "@/components/UI/Select";
import CTable from "@/components/UI/Table";
import { For, Show, TotalTableMessage } from "@/components/UI/Template";
import CTextArea from "@/components/UI/TextArea";

// Hooks & Types
import { useAdminCourses, useAllInstructorCourses } from "@/modules/Management/CourseManagement/queryHooks/useCourseHooks";
import { useAuthStore } from "@/store/useAuthStore";
import type { IReview, IReviewReply } from "@/type";
import { getColumnsTableReview } from "../constants";
import {
  useAdminReviews,
  useInstructorReviews,
  useReplyReviewMutation,
} from "../hooks/useAdminReview";

const { Text, Paragraph } = Typography;

const ReviewListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [courseIdFilter, setCourseIdFilter] = useState<string | undefined>(undefined);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);

  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [replyReview, setReplyReview] = useState<IReview | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  const [replyForm] = Form.useForm();

  const currentUser = useAuthStore((state) => state.user);
  const isInstructor = currentUser?.role === "INSTRUCTOR";

  // Queries & Mutations
  const { data: adminReviewsData, isLoading: loadingAdmin } = useAdminReviews(
    page,
    size,
    search || undefined,
    courseIdFilter,
    ratingFilter,
    !isInstructor
  );

  const { data: instructorReviewsData, isLoading: loadingInstructor } = useInstructorReviews(
    page,
    size,
    search || undefined,
    courseIdFilter,
    ratingFilter,
    isInstructor
  );

  const reviewsData = isInstructor ? instructorReviewsData : adminReviewsData;
  const isLoading = isInstructor ? loadingInstructor : loadingAdmin;

  // Fetch all courses to populate filter options
  const { data: adminCoursesData } = useAdminCourses(1, 100, undefined, undefined, undefined, !isInstructor);
  const { data: instructorCoursesData } = useAllInstructorCourses(isInstructor);

  const courseOptions = useMemo(() => {
    const courses = isInstructor
      ? (instructorCoursesData || [])
      : (adminCoursesData?.content || []);
    return courses.map((c) => ({
      value: c.id,
      label: c.name,
    }));
  }, [instructorCoursesData, adminCoursesData, isInstructor]);

  // Auto-select first course for instructor (render-phase)
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  if (isInstructor && courseOptions.length > 0 && !courseIdFilter && !hasAutoSelected) {
    setHasAutoSelected(true);
    setCourseIdFilter(courseOptions[0].value);
  }

  const { mutate: sendReply, isPending: sendingReply } = useReplyReviewMutation();


  const handleOpenDetail = useCallback((review: IReview) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedReview(null);
    setIsDetailOpen(false);
  }, []);

  const handleOpenReply = useCallback((review: IReview) => {
    setReplyReview(review);
    replyForm.resetFields();
    setIsReplyOpen(true);
  }, [replyForm]);

  const handleCloseReply = useCallback(() => {
    setReplyReview(null);
    setIsReplyOpen(false);
  }, []);

  const handleReplySubmit = useCallback(
    (values: { content: string }) => {
      if (replyReview) {
        sendReply(
          { reviewId: replyReview.id, content: values.content },
          {
            onSuccess: (newReply: IReviewReply) => {
              setIsReplyOpen(false);
              replyForm.resetFields();
              // If the detail modal is open and displaying this review, update its replies
              if (selectedReview && selectedReview.id === replyReview.id) {
                setSelectedReview((prev) => {
                  if (!prev) return null;
                  const currentReplies = prev.replies || [];
                  const enrichedReply = {
                    ...newReply,
                    user: currentUser
                      ? {
                          firstName: currentUser.firstName,
                          lastName: currentUser.lastName,
                          avatar: currentUser.avatar,
                          role: currentUser.role,
                        }
                      : undefined,
                  };
                  return {
                    ...prev,
                    replies: [...currentReplies, enrichedReply],
                  };
                });
              }
            },
          }
        );
      }
    },
    [replyReview, sendReply, replyForm, selectedReview, currentUser]
  );

  // Stats computed from backend content or returned global stats
  const stats = useMemo(() => {
    const totalCount = reviewsData?.stats?.totalCount ?? reviewsData?.totalElements ?? 0;
    const avgRating = reviewsData?.stats?.avgRating
      ? Number(reviewsData.stats.avgRating).toFixed(1)
      : "0.0";

    return { totalCount, avgRating };
  }, [reviewsData]);

  const columns = useMemo(
    () => getColumnsTableReview(handleOpenDetail, handleOpenReply),
    [handleOpenDetail, handleOpenReply]
  );

  // Rating select options
  const ratingOptions = [
    { value: 5, label: "5 Sao" },
    { value: 4, label: "4 Sao" },
    { value: 3, label: "3 Sao" },
    { value: 2, label: "2 Sao" },
    { value: 1, label: "1 Sao" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={isInstructor ? "Đánh giá Khóa học của tôi" : "Trung tâm Quản lý Đánh giá"}
        subtitle={
          isInstructor
            ? "Xem và phản hồi trực tiếp các nhận xét, đánh giá từ học viên tham gia khóa học của bạn"
            : "Quản lý các nhận xét, đánh giá chất lượng khóa học từ học viên và ẩn/hiện hoặc phản hồi trực tiếp"
        }
      />


      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Tổng Đánh Giá</span>}
              value={stats.totalCount}
              prefix={<FileTextOutlined className="text-blue-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Điểm Đánh Giá TB</span>}
              value={stats.avgRating}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<StarOutlined className="text-amber-500 mr-2" />}
            />
          </div>
        </Col>
      </Row>

      {/* Filters and List */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <CInput
            id="review-search"
            placeholder="Tìm theo tiêu đề, nội dung nhận xét..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="rounded-xl max-w-md h-11 border-gray-200"
            allowClear
          />
          <CSelect
            showSearch
            placeholder={isInstructor ? "Chọn Khóa học (Bắt buộc)" : "Lọc theo Khóa học"}
            optionFilterProp="label"
            value={courseIdFilter}
            onChange={(val) => {
              setCourseIdFilter(val);
              setPage(1);
            }}
            className="w-64 h-11"
            style={{ height: "44px" }}
            allowClear={!isInstructor}
            options={courseOptions}
          />
          <CSelect
            placeholder="Số sao đánh giá"
            value={ratingFilter}
            onChange={(val) => {
              setRatingFilter(val);
              setPage(1);
            }}
            className="w-48 h-11 custom-select"
            style={{ height: "44px" }}
            allowClear
            options={ratingOptions}
          />
        </div>

        <Show>
          <Show.When isTrue={!isInstructor || !!courseIdFilter}>
            <CTable
              columns={columns}
              dataSource={reviewsData?.content}
              rowKey="id"
              loading={isLoading}
              className="custom-table"
              scroll={{ x: "max-content" }}
              pagination={{
                current: page,
                pageSize: size,
                total: reviewsData?.totalElements || 0,
                onChange: (p) => setPage(p),
                showTotal: TotalTableMessage,
                showSizeChanger: false,
              }}
            />
          </Show.When>
          <Show.Else>
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-center space-y-3">
              <div className="p-3 bg-amber-50 rounded-full text-amber-500 shrink-0">
                <InfoCircleOutlined style={{ fontSize: "24px" }} />
              </div>
              <div className="space-y-1">
                <Text strong className="text-slate-800 text-sm block">Yêu cầu chọn khóa học</Text>
                <Text type="secondary" className="text-xs max-w-sm block">
                  Vui lòng lựa chọn một khóa học từ danh sách phía trên để xem các đánh giá và phản hồi của học viên.
                </Text>
              </div>
            </div>
          </Show.Else>
        </Show>
      </div>


      {/* Detail Modal */}
      <CModal
        title={
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <InfoCircleOutlined className="text-white" /> Chi tiết Đánh giá #{selectedReview?.id?.substring(0, 8)}
          </span>
        }
        open={isDetailOpen && selectedReview !== null}
        onCancel={handleCloseDetail}
        footer={null}
        width={640}
      >
        <Show>
          <Show.When isTrue={selectedReview !== null}>
            <div className="space-y-6 pt-4">
              {/* Header info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={selectedReview?.user?.avatar} style={{ backgroundColor: "#1890ff" }} size={48}>
                    {(selectedReview?.user?.firstName || "H").charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-base">
                      {selectedReview?.user && formatFullName(selectedReview.user)}
                    </span>
                    <span className="text-xs text-gray-400">ID học viên: {selectedReview?.userId}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Rate disabled value={selectedReview?.ratingStar} className="text-xs text-amber-400" />
                  <span className="text-[10px] text-gray-400">
                    {formatDateTimeFull(selectedReview?.createdAt)}
                  </span>
                </div>
              </div>

              <Divider className="my-0" />

              {/* Content box */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                {selectedReview?.title && (
                  <div className="font-bold text-gray-800 text-sm mb-1">
                    {selectedReview.title}
                  </div>
                )}
                <Paragraph className="text-sm text-gray-600 m-0 whitespace-pre-line leading-relaxed">
                  {selectedReview?.content}
                </Paragraph>
              </div>

              {/* Replies Thread */}
              <div className="space-y-3">
                <span className="text-xs text-gray-400 font-semibold uppercase block">
                  Danh sách phản hồi ({selectedReview?.replies?.length || 0})
                </span>
                <Show>
                  <Show.When isTrue={!!selectedReview?.replies && selectedReview.replies.length > 0}>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      <For
                        array={selectedReview?.replies || []}
                        render={(reply: IReviewReply, index: number) => (
                          <div key={reply.id || index} className="flex gap-3 bg-blue-50/30 p-3 rounded-xl border border-blue-100/50 justify-between items-start">
                            <div className="flex gap-3 flex-1">
                              <Avatar src={reply.user?.avatar} style={{ backgroundColor: "#52c41a" }} size="small">
                                {(reply.user?.firstName || "G").charAt(0).toUpperCase()}
                              </Avatar>
                              <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-semibold text-gray-800">
                                    {reply.user && formatFullName(reply.user)}
                                  </span>
                                  {reply.user?.role ? (
                                    <Tag color={reply.user.role === "ADMIN" ? "red" : reply.user.role === "INSTRUCTOR" ? "blue" : "gray"} className="text-[10px] py-0 px-1.5 font-bold uppercase rounded leading-none border-none">
                                      {reply.user.role === "ADMIN" ? "Quản trị viên" : reply.user.role === "INSTRUCTOR" ? "Giảng viên" : "Học viên"}
                                    </Tag>
                                  ) : (
                                    <Tag color="blue" className="text-[10px] py-0 px-1.5 font-bold uppercase rounded leading-none border-none">
                                      Giảng viên
                                    </Tag>
                                  )}
                                  <span className="text-[10px] text-gray-400">
                                    {formatDateTime(reply.createdAt)}
                                  </span>
                                </div>
                                <Paragraph className="text-xs text-gray-600 mt-1 m-0 leading-relaxed">
                                  {reply.content}
                                </Paragraph>
                              </div>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </Show.When>
                  <Show.Else>
                    <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <Text type="secondary" className="text-xs">Chưa có phản hồi nào cho đánh giá này.</Text>
                    </div>
                  </Show.Else>
                </Show>
              </div>

              {/* Action toggles inside detail */}
              <div className="flex justify-end pt-2 border-t">
                <CButton
                  type="primary"
                  icon={<MessageOutlined />}
                  onClick={() => handleOpenReply(selectedReview!)}
                  className="bg-blue-600 hover:bg-blue-500 border-0 rounded-lg h-10 font-semibold text-white"
                >
                  Gửi câu trả lời
                </CButton>
              </div>
            </div>
          </Show.When>
        </Show>
      </CModal>

      {/* Reply Modal */}
      <CModal
        title={
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <MessageOutlined className="text-white" /> Trả lời đánh giá từ học viên
          </span>
        }
        open={isReplyOpen && replyReview !== null}
        onCancel={handleCloseReply}
        footer={null}
        width={480}
      >
        <Form form={replyForm} layout="vertical" onFinish={handleReplySubmit} className="pt-4">
          {replyReview && (
            <div className="bg-slate-50 p-4 rounded-xl border mb-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800 text-xs">
                  {replyReview.user && formatFullName(replyReview.user)}
                </span>
                <Rate disabled value={replyReview.ratingStar} className="text-[10px] text-amber-400" />
              </div>
              {replyReview.title && (
                <div className="font-semibold text-gray-700 text-xs">
                  {replyReview.title}
                </div>
              )}
              <Paragraph className="text-xs text-gray-600 m-0 italic leading-relaxed">
                "{replyReview.content}"
              </Paragraph>
            </div>
          )}
          <Form.Item
            name="content"
            label={<span className="font-semibold text-gray-700">Nội dung phản hồi</span>}
            rules={[{ required: true, message: "Vui lòng nhập nội dung trả lời!" }]}
          >
            <CTextArea rows={6} placeholder="Nhập nội dung phản hồi học viên..." className="rounded-lg" />
          </Form.Item>
          <Form.Item className="mb-0 flex justify-end">
            <div className="flex items-center gap-3">
              <CButton onClick={handleCloseReply} className="rounded-lg h-10 font-semibold">
                Hủy
              </CButton>
              <CButton
                type="primary"
                htmlType="submit"
                loading={sendingReply}
                icon={<SendOutlined />}
                className="bg-primary hover:bg-primary/95 border-0 rounded-lg h-10 px-6 font-semibold flex items-center text-white"
              >
                Gửi phản hồi
              </CButton>
            </div>
          </Form.Item>
        </Form>
      </CModal>
    </div>
  );
};

export default ReviewListPage;
