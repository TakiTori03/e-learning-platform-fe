import { For, Show } from "@/components/UI/Template";
import { useMyLearning } from "@/modules/Learning/queryHooks/useMyLearning";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate, formatFullName } from "@/utils/format";
import { PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Empty, Form, Input, message, Modal, Pagination, Progress, Rate, Tag } from "antd";
import React, { useState } from "react";
import { useCourseRatingSummary, useCourseReviews, useCreateReviewMutation } from "../queryHooks";

const { TextArea } = Input;

interface Props {
  courseId: string;
  avgRating?: number;
  totalReviews?: number;
  isBought?: boolean;
}

export const CourseReviewsSection: React.FC<Props> = ({
  courseId,
  avgRating = 0,
  totalReviews = 0,
  isBought = false,
}) => {
  const { isAuth, user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Queries
  const { reviews, totalReviews: fetchedTotal, isLoading } = useCourseReviews(courseId, page, 5);
  const { data: ratingSummary } = useCourseRatingSummary(courseId);
  const { enrolledCourses } = useMyLearning();
  const createReviewMutation = useCreateReviewMutation();

  // Check if enrolled
  const isEnrolled = isBought || enrolledCourses.some((c) => c.id === courseId);

  // Check if current user has already reviewed (based on fetched reviews list)
  const hasReviewed = user && reviews.some((r) => r.userId === user.id);

  const displayAvgRating = ratingSummary !== undefined ? ratingSummary.averageRating : avgRating;
  const displayTotalReviews = ratingSummary !== undefined ? Number(ratingSummary.totalReviews) : totalReviews;

  const handleOpenModal = () => {
    if (!isAuth) {
      message.warning("Vui lòng đăng nhập để thực hiện đánh giá khóa học!");
      return;
    }
    if (!isEnrolled) {
      message.warning("Bạn chỉ có thể đánh giá khóa học sau khi đã mua hoặc đăng ký học!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values: { ratingStar: number; title?: string; content: string }) => {
    createReviewMutation.mutate(
      {
        courseId,
        ratingStar: values.ratingStar,
        title: values.title,
        content: values.content,
      },
      {
        onSuccess: () => {
          message.success("Cảm ơn bạn đã gửi đánh giá cho khóa học này!");
          handleCloseModal();
        },
        onError: (err: any) => {
          message.error(err?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại!");
        },
      }
    );
  };

  return (
    <div className="py-8 space-y-10">
      {/* 1. Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50/50 p-8 rounded-2xl border border-slate-100/80">
        {/* Avg rating score card */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 border-r border-slate-100 md:pr-8">
          <span className="text-6xl font-extrabold text-slate-800 leading-none">
            {displayAvgRating.toFixed(1)}
          </span>
          <Rate disabled allowHalf value={displayAvgRating} className="text-amber-400 text-xl" />
          <span className="text-slate-500 font-medium text-sm">
            {displayTotalReviews} xếp hạng từ học viên
          </span>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="col-span-1 md:col-span-2 flex flex-col justify-center gap-2.5">
          <For
            array={[5, 4, 3, 2, 1]}
            render={(star) => {
              const pctStr = ratingSummary?.ratingPercentages?.[star.toString()] || "0%";
              const pct = parseFloat(pctStr.replace("%", "")) || 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <Rate disabled count={5} value={star} className="text-[10px] text-amber-400 w-20 flex-none" />
                  <Progress
                    percent={pct}
                    strokeColor="#fadb14"
                    railColor="#e2e8f0"
                    size="small"
                    showInfo={false}
                    className="flex-1 m-0"
                  />
                  <span className="text-slate-400 text-xs w-10 text-right flex-none">
                    {pctStr}
                  </span>
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* 2. List Header & Action Button */}
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-lg font-bold text-slate-800 m-0">
          Phản hồi của học viên
        </h3>
        <Show>
          <Show.When isTrue={isEnrolled && !hasReviewed}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
              className="h-10 rounded-lg font-semibold px-5"
            >
              Viết đánh giá
            </Button>
          </Show.When>
          <Show.When isTrue={isEnrolled && !!hasReviewed}>
            <span className="text-slate-400 text-xs italic font-medium">
              Bạn đã gửi đánh giá cho khóa học này
            </span>
          </Show.When>
        </Show>
      </div>

      {/* 3. Review List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="text-slate-500 text-sm">Đang tải các đánh giá...</span>
          </div>
        ) : reviews.length === 0 ? (
          <Empty
            description={
              <div className="text-slate-400">
                Chưa có đánh giá nào cho khóa học này.
                {isEnrolled && " Hãy là người đầu tiên đánh giá!"}
              </div>
            }
            className="py-12"
          />
        ) : (
          <div className="space-y-6">
            <For
              array={reviews}
              render={(review) => (
                <div key={review.id} className="flex gap-4 border-b border-slate-50 pb-6 last:border-none last:pb-0">
                  {/* User Avatar */}
                  <Avatar
                    src={review.user?.avatar}
                    icon={<UserOutlined />}
                    className="bg-slate-200 text-slate-500 flex-none"
                    size={44}
                  />

                  {/* Review Content Box */}
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {review.user && formatFullName(review.user)}
                        </span>
                        <div className="flex items-center gap-2.5 mt-0.5">
                          <Rate disabled value={review.ratingStar} className="text-[10px] text-amber-400" />
                          <span className="text-slate-400 text-xs font-medium">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="text-slate-800 font-semibold text-sm m-0">
                        {review.title}
                      </h4>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed m-0 whitespace-pre-line">
                      {review.content}
                    </p>

                    {/* Instructor Reply rendering if exists */}
                    <Show>
                      <Show.When isTrue={!!review.replies && review.replies.length > 0}>
                        <div className="mt-4 pl-4 border-l-2 border-slate-200 space-y-3">
                          <For
                            array={review.replies || []}
                            render={(reply) => (
                              <div key={reply.id} className="bg-slate-50 p-3 rounded-xl flex gap-3 items-start border border-slate-100/50">
                                <Avatar
                                  src={reply.user?.avatar}
                                  icon={<UserOutlined />}
                                  className="bg-slate-200 text-slate-500 flex-none"
                                  size={28}
                                >
                                  {!reply.user?.avatar && (reply.user?.firstName || "G").charAt(0).toUpperCase()}
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-semibold text-slate-800 text-xs">
                                      {reply.user && formatFullName(reply.user)}
                                    </span>
                                    {reply.user?.role ? (
                                      <Tag
                                        color={
                                          reply.user.role === "ADMIN"
                                            ? "red"
                                            : reply.user.role === "INSTRUCTOR"
                                            ? "blue"
                                            : "default"
                                        }
                                        className="text-[10px] font-bold px-1.5 py-0 rounded leading-none border-none m-0 uppercase"
                                      >
                                        {reply.user.role === "ADMIN"
                                          ? "Quản trị viên"
                                          : reply.user.role === "INSTRUCTOR"
                                          ? "Giảng viên"
                                          : "Học viên"}
                                      </Tag>
                                    ) : (
                                      <Tag color="blue" className="text-[10px] font-bold px-1.5 py-0 rounded leading-none border-none m-0 uppercase">
                                        Giảng viên
                                      </Tag>
                                    )}
                                    <span className="text-slate-400 text-[10px] font-medium ml-auto sm:ml-0">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-slate-600 text-xs leading-relaxed m-0 whitespace-pre-line">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            )}
                          />
                        </div>
                      </Show.When>
                    </Show>
                  </div>
                </div>
              )}
            />

            {/* Pagination */}
            <Show>
              <Show.When isTrue={fetchedTotal > 5}>
                <div className="flex justify-center pt-6">
                  <Pagination
                    current={page}
                    pageSize={5}
                    total={fetchedTotal}
                    onChange={(p) => setPage(p)}
                    showSizeChanger={false}
                  />
                </div>
              </Show.When>
            </Show>
          </div>
        )}
      </div>

      {/* 4. Write Review Modal */}
      <Modal
        title={
          <div className="text-lg font-bold text-slate-800 border-b pb-3">
            Đánh giá khóa học
          </div>
        }
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        destroyOnClose
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="pt-4 space-y-4"
        >
          {/* Star Rating Selection */}
          <Form.Item
            name="ratingStar"
            label={<span className="font-bold text-slate-700">Mức độ hài lòng của bạn</span>}
            rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá!" }]}
          >
            <Rate className="text-amber-400 text-2xl" />
          </Form.Item>

          {/* Title (Optional) */}
          <Form.Item
            name="title"
            label={<span className="font-bold text-slate-700">Tiêu đề đánh giá (Tùy chọn)</span>}
          >
            <Input
              placeholder="Tóm tắt nhận xét của bạn..."
              className="h-10 rounded-lg border-slate-200 focus:border-primary"
            />
          </Form.Item>

          {/* Review Text Area */}
          <Form.Item
            name="content"
            label={<span className="font-bold text-slate-700">Nội dung nhận xét</span>}
            rules={[
              { required: true, message: "Vui lòng nhập nội dung nhận xét!" },
              { min: 10, message: "Nội dung nhận xét cần ít nhất 10 ký tự!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Chia sẻ trải nghiệm học tập của bạn về nội dung, chất lượng bài giảng, cách truyền đạt..."
              className="rounded-lg border-slate-200 focus:border-primary"
            />
          </Form.Item>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t">
            <Button
              onClick={handleCloseModal}
              className="h-10 rounded-lg font-medium px-5"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createReviewMutation.isPending}
              className="h-10 rounded-lg font-semibold px-6"
            >
              Gửi đánh giá
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseReviewsSection;
