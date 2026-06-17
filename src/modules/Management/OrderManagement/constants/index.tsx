import CButton from "@/components/UI/Button";
import { OrderStatus, PaymentStatus } from "@/constants/enums";
import type { IOrder, IPayment } from "@/type";
import { formatDateTime, formatFullName } from "@/utils/format";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Avatar, Space, Tag } from "antd";
import OrderStatusTag from "../components/OrderStatusTag";
import PaymentStatusTag from "../components/PaymentStatusTag";

export const getColumnsTableOrder = (
  handleOpenDetail: (record: IOrder) => void,
  handleUpdateStatus: (id: string, status: string) => void
) => [
  {
    title: "Mã đơn hàng",
    dataIndex: "id",
    key: "id",
    width: 150,
    render: (id: string) => (
      <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
        {id.substring(0, 8)}...
      </span>
    ),
  },
  {
    title: "Học viên",
    key: "user",
    render: (_: unknown, record: IOrder) => {
      const user = record.user;
      const fullName = formatFullName(user) || "Học viên ẩn danh";
      return (
        <Space size="middle">
          <Avatar
            src={user?.avatar}
            style={{ backgroundColor: "#2563eb", verticalAlign: "middle" }}
          >
            {fullName.charAt(0).toUpperCase()}
          </Avatar>
          <div className="flex flex-col">
            <span className="text-gray-800 text-sm font-semibold">
              {fullName}
            </span>
            <span className="text-gray-400 text-xs">
              {user?.email || "N/A"}
            </span>
          </div>
        </Space>
      );
    },
  },
  {
    title: "Khóa học",
    key: "items",
    render: (_: unknown, record: IOrder) => {
      const items = record.items || [];
      return (
        <div className="flex items-center gap-2">
          <Avatar.Group max={{ count: 2 }} size="small">
            {items.map((item, idx) => (
              <Avatar key={idx} src={item.thumbnail} shape="square" />
            ))}
          </Avatar.Group>
          <span className="text-xs text-gray-600 truncate max-w-[200px]">
            {items[0]?.courseName}
            {items.length > 1 && ` (+${items.length - 1} khác)`}
          </span>
        </div>
      );
    },
  },
  {
    title: "Thành tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
    width: 120,
    align: "right" as const,
    render: (price: number) => (
      <span className="font-semibold text-blue-600">
        {price ? `${price.toLocaleString()}đ` : "0đ"}
      </span>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 130,
    align: "center" as const,
    render: (status: OrderStatus) => (
      <OrderStatusTag
        status={status}
        className="rounded-full px-3 py-0.5 m-0 font-medium"
      />
    ),
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 140,
    render: (date: string) => (
      <span className="text-xs text-gray-500">
        {formatDateTime(date)}
      </span>
    ),
  },
  {
    title: "Thao tác",
    key: "actions",
    width: 120,
    align: "center" as const,
    render: (_: unknown, record: IOrder) => (
      <Space size="small">
        <CButton
          type="text"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleOpenDetail(record)}
          className="hover:text-blue-500 flex items-center justify-center p-1"
        />
        {record.status === OrderStatus.PENDING && (
          <>
            <CButton
              type="text"
              size="small"
              icon={<CheckCircleOutlined className="text-green-500" />}
              onClick={() => handleUpdateStatus(record.id, OrderStatus.COMPLETED)}
              className="flex items-center justify-center p-1"
            />
            <CButton
              type="text"
              size="small"
              icon={<CloseCircleOutlined className="text-red-500" />}
              onClick={() => handleUpdateStatus(record.id, OrderStatus.CANCELLED)}
              className="flex items-center justify-center p-1"
            />
          </>
        )}
      </Space>
    ),
  },
];

export const getColumnsTableTransaction = (
  handleOpenDetail: (record: IPayment) => void
) => [
  {
    title: "Mã giao dịch",
    dataIndex: "transactionId",
    key: "transactionId",
    render: (txId: string) => (
      <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
        {txId || "N/A"}
      </span>
    ),
  },
  {
    title: "Mã đơn hàng",
    dataIndex: "orderId",
    key: "orderId",
    render: (ordId: string) => (
      <span className="font-mono text-xs text-gray-500">
        {ordId.substring(0, 8)}...
      </span>
    ),
  },
  {
    title: "Cổng thanh toán",
    dataIndex: "method",
    key: "method",
    width: 130,
    align: "center" as const,
    render: (method: string) => (
      <Tag color="processing" bordered={false} className="font-semibold m-0">
        {method}
      </Tag>
    ),
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    width: 130,
    align: "right" as const,
    render: (amount: number) => (
      <span className="font-semibold text-green-600">
        {amount ? `${amount.toLocaleString()}đ` : "0đ"}
      </span>
    ),
  },
  {
    title: "Ngân hàng / Thẻ",
    key: "bankInfo",
    render: (_: unknown, record: IPayment) => (
      <div className="flex flex-col text-xs">
        <span className="font-semibold text-gray-700">{record.bankCode || "N/A"}</span>
        <span className="text-gray-400">{record.cardType || "N/A"}</span>
      </div>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    align: "center" as const,
    render: (status: PaymentStatus) => (
      <PaymentStatusTag
        status={status}
        className="rounded-full px-3 py-0.5 m-0 font-medium"
      />
    ),
  },
  {
    title: "Ngày thanh toán",
    key: "payDate",
    width: 150,
    render: (_: unknown, record: IPayment) => {
      const date = record.payDate || record.createdAt;
      return (
        <span className="text-xs text-gray-500">
          {date ? formatDateTime(date) : "—"}
        </span>
      );
    },
  },
  {
    title: "Chi tiết",
    key: "action",
    width: 80,
    align: "center" as const,
    render: (_: unknown, record: IPayment) => (
      <CButton
        type="text"
        size="small"
        icon={<EyeOutlined />}
        onClick={() => handleOpenDetail(record)}
        className="hover:text-blue-500 flex items-center justify-center p-1"
      />
    ),
  },
];
