import CButton from "@/components/UI/Button";
import type { IReview } from "@/type";
import { formatDateTime, formatFullName } from "@/utils/format";
import {
  EyeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Rate, Space, Tag, Tooltip, Typography } from "antd";

const { Text, Paragraph } = Typography;

export const getColumnsTableReview = (
  handleOpenDetail: (record: IReview) => void,
  handleOpenReply: (record: IReview) => void
) => [
  {
    title: "Học viên",
    key: "user",
    width: 220,
    render: (_: unknown, record: IReview) => {
      const name = formatFullName(record.user) || "Học viên ẩn danh";
      const initial = name.charAt(0).toUpperCase();
      return (
        <Space size="middle">
          <Avatar src={record.user?.avatar} style={{ backgroundColor: "#1890ff" }}>
            {initial}
          </Avatar>
          <div className="flex flex-col">
            <Text strong className="text-gray-800 text-sm">
              {name}
            </Text>
            <Text type="secondary" className="text-xs">
              ID: {record.userId?.substring(0, 8) || "N/A"}
            </Text>
          </div>
        </Space>
      );
    },
  },
  {
    title: "Khóa học",
    key: "course",
    width: 220,
    render: (_: unknown, record: IReview) => (
      <Space size="small">
        <Avatar
          shape="square"
          size={36}
          src={record.course?.thumbnail || "https://api.dicebear.com/7.x/identicon/svg"}
          className="bg-slate-100 flex-none"
        />
        <Text strong ellipsis={{ tooltip: true }} className="text-xs text-gray-700 block max-w-[150px]">
          {record.course?.name || "Khóa học không xác định"}
        </Text>
      </Space>
    ),
  },
  {
    title: "Đánh giá khóa học",
    key: "content",
    width: 300,
    render: (_: unknown, record: IReview) => (
      <div className="flex flex-col gap-1 py-0.5">
        {/* Rating and Title Row */}
        <div className="flex items-center gap-2 flex-wrap">
          <Rate disabled value={record.ratingStar} className="text-[10px] text-amber-500 shrink-0" allowHalf />
          <Text className="text-amber-600 text-xs font-bold shrink-0">
            {record.ratingStar ? record.ratingStar.toFixed(1) : "0.0"}
          </Text>
          {record.title && (
            <>
              <span className="text-slate-300 text-xs shrink-0">|</span>
              <Text strong className="text-xs text-slate-800 truncate" style={{ maxWidth: 220 }}>
                {record.title}
              </Text>
            </>
          )}
        </div>

        {/* Content */}
        <Paragraph
          ellipsis={{ rows: 1, tooltip: true }}
          className="text-xs text-slate-500 m-0 leading-tight"
          style={{ maxWidth: 400 }}
        >
          {record.content || <span className="text-slate-300 italic">Không có nội dung nhận xét</span>}
        </Paragraph>
      </div>
    ),
  },



  {
    title: "Phản hồi",
    key: "replies",
    width: 100,
    align: "center" as const,
    render: (_: unknown, record: IReview) => {
      const count = record.replies?.length || 0;
      return count > 0 ? (
        <Badge count={count} color="#52c41a">
          <Tag color="success" bordered={false} className="m-0 font-medium">Đã phản hồi</Tag>
        </Badge>
      ) : (
        <Tag color="default" bordered={false} className="m-0 text-gray-400">Chưa phản hồi</Tag>
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
    width: 120,
    align: "center" as const,
    render: (_: unknown, record: IReview) => (
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
        <Tooltip title="Gửi phản hồi">
          <CButton
            type="text"
            size="small"
            icon={<MessageOutlined className="text-green-600" />}
            onClick={() => handleOpenReply(record)}
            className="flex items-center justify-center p-0 border-none shadow-none"
          />
        </Tooltip>
      </Space>
    ),
  },
];
