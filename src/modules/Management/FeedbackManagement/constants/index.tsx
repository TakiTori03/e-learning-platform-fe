import { Space, Avatar, Tooltip, Tag, Badge, Typography } from "antd";
import type { IFeedback } from "@/type";
import {
  EyeOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import CButton from "@/components/UI/Button";
import { FeedbackStatus } from "@/constants/enums";
import { formatDateTime } from "@/utils/format";
import FeedbackStatusTag from "../components/FeedbackStatusTag";
import FeedbackTypeTag from "../components/FeedbackTypeTag";

const { Text, Paragraph } = Typography;

export const getColumnsTableFeedback = (
  handleOpenDetail: (record: IFeedback) => void,
  handleOpenReply: (id: string) => void,
  updateStatus: (variables: { id: string; status: string }) => void
) => [
  {
    title: "Người gửi",
    key: "user",
    width: 220,
    render: (_: unknown, record: IFeedback) => {
      const name = record.name || "Người dùng ẩn danh";
      return (
        <Space size="middle">
          <Avatar style={{ backgroundColor: "#87d068" }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col">
            <Text strong className="text-gray-800 text-sm">
              {name}
            </Text>
            <Text type="secondary" className="text-xs">
              {record.email || "N/A"}
            </Text>
          </div>
        </Space>
      );
    },
  },
  {
    title: "Ý kiến phản hồi",
    key: "content",
    render: (_: unknown, record: IFeedback) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FeedbackTypeTag type={record.type} className="text-[10px] uppercase font-bold m-0" />
          <Text strong className="text-sm text-gray-800">
            {record.title}
          </Text>
        </div>
        <Paragraph
          ellipsis={{ rows: 2, tooltip: true }}
          className="text-xs text-gray-500 m-0"
          style={{ maxWidth: 450 }}
        >
          {record.content}
        </Paragraph>
      </div>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    align: "center" as const,
    render: (status: string) => (
      <FeedbackStatusTag
        status={status}
        className="rounded-full px-3 py-0.5 m-0 font-medium"
      />
    ),
  },
  {
    title: "Phản hồi",
    key: "replies",
    width: 100,
    align: "center" as const,
    render: (_: unknown, record: IFeedback) => {
      const count = record.replies?.length || 0;
      return count > 0 ? (
        <Badge count={count} color="#52c41a">
          <Tag color="success" bordered={false} className="m-0 font-medium">Đã trả lời</Tag>
        </Badge>
      ) : (
        <Tag color="default" bordered={false} className="m-0 text-gray-400">Chưa trả lời</Tag>
      );
    },
  },
  {
    title: "Ngày gửi",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 140,
    render: (date: string) => (
      <Text className="text-xs text-gray-500">
        {formatDateTime(date)}
      </Text>
    ),
  },
  {
    title: "Thao tác",
    key: "actions",
    width: 160,
    align: "center" as const,
    render: (_: unknown, record: IFeedback) => (
      <Space size="small">
        <Tooltip title="Xem chi tiết">
          <CButton
            type="text"
            size="small"
            icon={<EyeOutlined className="text-blue-500" />}
            onClick={() => handleOpenDetail(record)}
            className="flex items-center justify-center p-0 border-none shadow-none"
          />
        </Tooltip>
        {record.status !== FeedbackStatus.CLOSED && (
          <Tooltip title="Trả lời">
            <CButton
              type="text"
              size="small"
              icon={<MessageOutlined className="text-green-600" />}
              onClick={() => handleOpenReply(record.id)}
              className="flex items-center justify-center p-0 border-none shadow-none"
            />
          </Tooltip>
        )}
        {(record.status === FeedbackStatus.PENDING || record.status === FeedbackStatus.RESPONDED) && (
          <>
            <Tooltip title="Giải quyết ý kiến">
              <CButton
                type="text"
                size="small"
                icon={<CheckCircleOutlined className="text-green-500" />}
                onClick={() => updateStatus({ id: record.id, status: FeedbackStatus.RESOLVED })}
                className="flex items-center justify-center p-0 border-none shadow-none"
              />
            </Tooltip>
            <Tooltip title="Đóng ý kiến">
              <CButton
                type="text"
                size="small"
                icon={<CloseCircleOutlined className="text-gray-400" />}
                onClick={() => updateStatus({ id: record.id, status: FeedbackStatus.CLOSED })}
                className="flex items-center justify-center p-0 border-none shadow-none"
              />
            </Tooltip>
          </>
        )}
        {record.status === FeedbackStatus.RESOLVED && (
          <Tooltip title="Đóng ý kiến">
            <CButton
              type="text"
              size="small"
              icon={<CloseCircleOutlined className="text-gray-400" />}
              onClick={() => updateStatus({ id: record.id, status: FeedbackStatus.CLOSED })}
              className="flex items-center justify-center p-0 border-none shadow-none"
            />
          </Tooltip>
        )}
        {record.status === FeedbackStatus.CLOSED && (
          <Tooltip title="Mở lại ý kiến">
            <CButton
              type="text"
              size="small"
              icon={<SendOutlined className="text-orange-500" />}
              onClick={() => updateStatus({ id: record.id, status: FeedbackStatus.PENDING })}
              className="flex items-center justify-center p-0 border-none shadow-none"
            />
          </Tooltip>
        )}
      </Space>
    ),
  },
];
