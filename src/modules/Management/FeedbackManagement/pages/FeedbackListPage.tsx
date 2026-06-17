import React, { useState, useMemo, useCallback } from "react";
import {
  Row,
  Col,
  Statistic,
  Avatar,
  Form,
  Typography,
  Divider,
  Tag,
} from "antd";
import {
  SearchOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { formatDateTime, formatDateTimeFull } from "@/utils/format";

// Custom UI Components & Wrappers (Rule 2)
import CTable from "@/components/UI/Table";
import CModal from "@/components/UI/Modal";
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";
import CButton from "@/components/UI/Button";
import CTextArea from "@/components/UI/TextArea";
import PageHeader from "@/components/UI/PageHeader";
import FeedbackStatusTag from "../components/FeedbackStatusTag";
import FeedbackTypeTag from "../components/FeedbackTypeTag";
import { TotalTableMessage, Show, For } from "@/components/UI/Template";

// Hooks, Constants, Store & Types
import {
  useAdminFeedbacks,
  useUpdateFeedbackStatusMutation,
  useReplyFeedbackMutation,
} from "../hooks/useAdminFeedback";
import {
  FeedbackType,
  FeedbackTypeLabels,
  FeedbackStatus,
  FeedbackStatusLabels,
  ActionsType,
} from "@/constants/enums";
import { getColumnsTableFeedback } from "../constants";
import { useLocalStore } from "../store/useLocalStore";
import type { IFeedback, IFeedbackReply } from "@/type";

const { Text, Paragraph } = Typography;

const FeedbackListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  // Zustand Store (Rule 4)
  const {
    actionMode,
    selectedFeedback,
    replyFeedbackId,
    setActionMode,
    setSelectedFeedback,
    setReplyFeedbackId,
    resetStore,
  } = useLocalStore();

  const [replyForm] = Form.useForm();

  // Queries & Mutations
  const { data: feedbackData, isLoading } = useAdminFeedbacks(
    page,
    size,
    search || undefined,
    statusFilter,
    typeFilter
  );
  const { mutate: updateStatus } = useUpdateFeedbackStatusMutation();
  const { mutate: sendReply, isPending: sendingReply } = useReplyFeedbackMutation();

  const handleOpenDetail = useCallback((feedback: IFeedback) => {
    setSelectedFeedback(feedback);
    setActionMode(ActionsType.READ);
  }, [setSelectedFeedback, setActionMode]);

  const handleCloseDetail = useCallback(() => {
    resetStore();
  }, [resetStore]);

  const handleOpenReply = useCallback((feedbackId: string) => {
    setReplyFeedbackId(feedbackId);
    replyForm.resetFields();
    setActionMode(ActionsType.UPDATE);
  }, [replyForm, setReplyFeedbackId, setActionMode]);

  const handleCloseReply = useCallback(() => {
    setReplyFeedbackId(null);
    setActionMode(selectedFeedback ? ActionsType.READ : "");
  }, [setReplyFeedbackId, setActionMode, selectedFeedback]);

  const handleReplySubmit = useCallback(
    (values: { content: string }) => {
      if (replyFeedbackId) {
        sendReply(
          { id: replyFeedbackId, content: values.content },
          {
            onSuccess: () => {
              resetStore();
            },
          }
        );
      }
    },
    [replyFeedbackId, sendReply, resetStore]
  );

  // Stats computed from backend content
  const stats = useMemo(() => {
    const list = feedbackData?.content || [];
    const totalCount = feedbackData?.totalElements || 0;
    const pendingCount = list.filter((f: IFeedback) => f.status === FeedbackStatus.PENDING).length;
    const respondedCount = list.filter((f: IFeedback) => f.status === FeedbackStatus.RESPONDED).length;
    const resolvedCount = list.filter((f: IFeedback) => f.status === FeedbackStatus.RESOLVED).length;

    return { totalCount, pendingCount, respondedCount, resolvedCount };
  }, [feedbackData]);

  const columns = useMemo(
    () => getColumnsTableFeedback(handleOpenDetail, handleOpenReply, updateStatus),
    [handleOpenDetail, handleOpenReply, updateStatus]
  );

  // CSelect options (Rule 2)
  const statusOptions = useMemo(
    () =>
      Object.values(FeedbackStatus).map((status) => ({
        value: status,
        label: FeedbackStatusLabels[status],
      })),
    []
  );

  const typeOptions = useMemo(
    () =>
      Object.values(FeedbackType).map((type) => ({
        value: type,
        label: FeedbackTypeLabels[type],
      })),
    []
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Ý kiến & Phản hồi từ Người dùng"
        subtitle="Xem các liên hệ, góp ý, thắc mắc hệ thống từ học viên và gửi phản hồi giải đáp trực tiếp"
      />

      {/* Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Tổng Ý Kiến</span>}
              value={stats.totalCount}
              prefix={<FileTextOutlined className="text-blue-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Chờ Xử Lý</span>}
              value={stats.pendingCount}
              valueStyle={{ color: "#fa8c16" }}
              prefix={<InfoCircleOutlined className="text-orange-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Đã Phản Hồi</span>}
              value={stats.respondedCount}
              valueStyle={{ color: "#1677ff" }}
              prefix={<MessageOutlined className="text-blue-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Đã Giải Quyết</span>}
              value={stats.resolvedCount}
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
            />
          </div>
        </Col>
      </Row>

      {/* Filters and List */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <CInput
            id="feedback-search"
            placeholder="Tìm theo tiêu đề, nội dung, email, tên..."
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
            placeholder="Trạng thái"
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            className="w-48 h-11 custom-select"
            style={{ height: "44px" }}
            allowClear
            options={statusOptions}
          />
          <CSelect
            placeholder="Loại ý kiến"
            value={typeFilter}
            onChange={(val) => {
              setTypeFilter(val);
              setPage(1);
            }}
            className="w-48 h-11 custom-select"
            style={{ height: "44px" }}
            allowClear
            options={typeOptions}
          />
        </div>

        <CTable
          columns={columns}
          dataSource={feedbackData?.content}
          rowKey="id"
          loading={isLoading}
          className="custom-table"
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            pageSize: size,
            total: feedbackData?.totalElements || 0,
            onChange: (p) => setPage(p),
            showTotal: TotalTableMessage,
            showSizeChanger: false,
          }}
        />
      </div>

      {/* Detail Modal */}
      <CModal
        title={
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <InfoCircleOutlined className="text-white" /> Chi tiết Phản hồi #{selectedFeedback?.id?.substring(0, 8)}
          </span>
        }
        open={actionMode === ActionsType.READ && selectedFeedback !== null}
        onCancel={handleCloseDetail}
        footer={null}
        width={640}
      >
        <Show>
          <Show.When isTrue={selectedFeedback !== null}>
            <div className="space-y-6 pt-4">
              {/* Header info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar style={{ backgroundColor: "#87d068" }} size={48}>
                    {(selectedFeedback?.name || "U").charAt(0).toUpperCase()}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-base">
                      {selectedFeedback?.name || "Người dùng ẩn danh"}
                    </span>
                    <span className="text-xs text-gray-500">{selectedFeedback?.email || "N/A"}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <FeedbackStatusTag
                    status={selectedFeedback?.status || FeedbackStatus.PENDING}
                    className="rounded-full px-3 py-0.5 m-0 font-medium"
                  />
                  <span className="text-[10px] text-gray-400">
                    {formatDateTimeFull(selectedFeedback?.createdAt)}
                  </span>
                </div>
              </div>

              <Divider className="my-0" />

              {/* Content box */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <FeedbackTypeTag
                    type={selectedFeedback?.type || FeedbackType.GENERAL}
                    className="text-[10px] uppercase font-bold m-0"
                  />
                  <span className="font-bold text-gray-800">{selectedFeedback?.title}</span>
                </div>
                <Paragraph className="text-sm text-gray-600 m-0 whitespace-pre-line leading-relaxed">
                  {selectedFeedback?.content}
                </Paragraph>
              </div>

              {/* Conversation/Replies Thread */}
              <div className="space-y-3">
                <span className="text-xs text-gray-400 font-semibold uppercase block">
                  Luồng Trả Lời ({selectedFeedback?.replies?.length || 0})
                </span>
                <Show>
                  <Show.When isTrue={!!selectedFeedback?.replies && selectedFeedback.replies.length > 0}>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      <For
                        array={selectedFeedback?.replies || []}
                        render={(reply: IFeedbackReply, index: number) => (
                          <div key={reply.id || index} className="flex gap-3 bg-blue-50/30 p-3 rounded-xl border border-blue-100/50">
                            <Avatar style={{ backgroundColor: "#1677ff" }} size="small">
                              A
                            </Avatar>
                            <div className="flex flex-col flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-800">
                                  Quản trị viên
                                  <Tag color="processing" bordered={false} className="ml-2 text-[9px] scale-90 m-0 font-bold">ADMIN</Tag>
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  {formatDateTime(reply.createdAt)}
                                </span>
                              </div>
                              <Paragraph className="text-xs text-gray-600 mt-1 m-0 leading-relaxed">
                                {reply.content}
                              </Paragraph>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  </Show.When>
                  <Show.Else>
                    <div className="text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                      <Text type="secondary" className="text-xs">Chưa có trả lời nào cho ý kiến này.</Text>
                    </div>
                  </Show.Else>
                </Show>
              </div>

              {/* Quick Actions inside detail */}
              <div className="flex justify-end gap-3 pt-2">
                <Show>
                  <Show.When isTrue={selectedFeedback?.status === FeedbackStatus.PENDING || selectedFeedback?.status === FeedbackStatus.RESPONDED}>
                    <CButton
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => {
                        updateStatus({ id: selectedFeedback!.id, status: FeedbackStatus.CLOSED });
                        setSelectedFeedback({ ...selectedFeedback!, status: FeedbackStatus.CLOSED });
                      }}
                      className="rounded-lg h-10 font-semibold"
                    >
                      Đóng phản hồi
                    </CButton>
                    <CButton
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      onClick={() => {
                        updateStatus({ id: selectedFeedback!.id, status: FeedbackStatus.RESOLVED });
                        setSelectedFeedback({ ...selectedFeedback!, status: FeedbackStatus.RESOLVED });
                      }}
                      className="bg-green-600 hover:bg-green-500 border-0 rounded-lg h-10 font-semibold text-white"
                    >
                      Giải quyết ý kiến
                    </CButton>
                  </Show.When>
                </Show>

                <Show>
                  <Show.When isTrue={selectedFeedback?.status === FeedbackStatus.RESOLVED}>
                    <CButton
                      danger
                      icon={<CloseCircleOutlined />}
                      onClick={() => {
                        updateStatus({ id: selectedFeedback!.id, status: FeedbackStatus.CLOSED });
                        setSelectedFeedback({ ...selectedFeedback!, status: FeedbackStatus.CLOSED });
                      }}
                      className="rounded-lg h-10 font-semibold"
                    >
                      Đóng phản hồi
                    </CButton>
                  </Show.When>
                </Show>

                <Show>
                  <Show.When isTrue={selectedFeedback?.status === FeedbackStatus.CLOSED}>
                    <CButton
                      type="primary"
                      icon={<SendOutlined />}
                      onClick={() => {
                        updateStatus({ id: selectedFeedback!.id, status: FeedbackStatus.PENDING });
                        setSelectedFeedback({ ...selectedFeedback!, status: FeedbackStatus.PENDING });
                      }}
                      className="bg-orange-500 hover:bg-orange-400 border-0 rounded-lg h-10 font-semibold text-white"
                    >
                      Mở lại ý kiến
                    </CButton>
                  </Show.When>
                </Show>

                <Show>
                  <Show.When isTrue={selectedFeedback?.status !== FeedbackStatus.CLOSED}>
                    <CButton
                      type="primary"
                      icon={<MessageOutlined />}
                      onClick={() => handleOpenReply(selectedFeedback!.id)}
                      className="bg-blue-600 hover:bg-blue-500 border-0 rounded-lg h-10 font-semibold text-white"
                    >
                      Gửi câu trả lời
                    </CButton>
                  </Show.When>
                </Show>
              </div>
            </div>
          </Show.When>
        </Show>
      </CModal>

      {/* Reply Modal */}
      <CModal
        title={
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <MessageOutlined className="text-white" /> Trả lời Ý kiến phản hồi
          </span>
        }
        open={actionMode === ActionsType.UPDATE && replyFeedbackId !== null}
        onCancel={handleCloseReply}
        footer={null}
        width={480}
      >
        <Form form={replyForm} layout="vertical" onFinish={handleReplySubmit} className="pt-4">
          <Form.Item
            name="content"
            label={<span className="font-semibold text-gray-700">Nội dung phản hồi</span>}
            rules={[{ required: true, message: "Vui lòng nhập nội dung trả lời!" }]}
          >
            <CTextArea rows={6} placeholder="Nhập nội dung trả lời người dùng..." className="rounded-lg" />
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

export default FeedbackListPage;
