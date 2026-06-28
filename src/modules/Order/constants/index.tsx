import { formatDate } from "@/utils/format";
import { Calendar, Eye, Download } from "lucide-react";
import type { IOrderResponse, IOrderItem } from "../api/orderApi";
import OrderStatusTag from "@/modules/Management/OrderManagement/components/OrderStatusTag";
import CButton from "@/components/UI/Button";
import type { AnyElement } from "@/type";

const getStatusTag = (status: string) => (
  <OrderStatusTag
    status={status}
    className="px-2.5 py-0.5 text-xs font-semibold rounded-full"
  />
);

export const getColumnsTableOrder = (
  showModal: (id: string) => void,
  downloadReceipt: (id: string) => void
) => [
  {
    title: "Mã đơn hàng",
    dataIndex: "id",
    key: "id",
    render: (id: string) => (
      <span className="font-mono text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
        {id}
      </span>
    ),
  },
  {
    title: "Mã giao dịch",
    key: "transactionId",
    render: (_: any, record: IOrderResponse) => (
      <span className="font-mono text-xs text-slate-500">
        {record.totalPrice > 0 ? `VNP${record.id.slice(-8).toUpperCase()}` : `FREE${record.id.slice(-8).toUpperCase()}`}
      </span>
    ),
  },
  {
    title: "Khóa học",
    dataIndex: "items",
    key: "items",
    render: (items: IOrderItem[]) => {
      if (!items || items.length === 0)
        return <span className="text-gray-400">Không có khóa học</span>;
      if (items.length === 1) {
        return (
          <span className="font-medium text-gray-800 line-clamp-1">
            {items[0].name}
          </span>
        );
      }
      return (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-primary">
            {items.length} khóa học
          </span>
          <span className="text-xs text-gray-500 line-clamp-1">
            {items.map((i) => i.name).join(", ")}
          </span>
        </div>
      );
    },
  },
  {
    title: "Phương thức",
    key: "paymentMethod",
    render: (_: any, record: IOrderResponse) => (
      <span className="text-slate-600 text-xs">
        {record.totalPrice > 0 ? "VNPay" : "Miễn phí"}
      </span>
    ),
  },
  {
    title: "Ngày đặt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) => (
      <div className="flex items-center gap-1 text-gray-600 text-xs">
        <Calendar className="w-3.5 h-3.5 text-gray-400" />
        <span>{formatDate(date)}</span>
      </div>
    ),
  },
  {
    title: "Tổng tiền",
    dataIndex: "totalPrice",
    key: "totalPrice",
    render: (price: number) => (
      <span className="font-bold text-gray-800 text-xs">
        {price === 0 ? (
          <span className="text-green-600">Miễn phí</span>
        ) : (
          `${price.toLocaleString()}đ`
        )}
      </span>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => getStatusTag(status),
  },
  {
    title: "Chi tiết",
    key: "actions",
    render: (_: AnyElement, record: IOrderResponse) => (
      <CButton
        onClick={() => showModal(record.id)}
        icon={<Eye className="w-4 h-4" />}
        className="flex items-center gap-1 hover:text-primary/80 font-medium text-xs text-primary border-none bg-transparent shadow-none"
        id={`btn-order-detail-${record.id}`}
      >
        Chi tiết
      </CButton>
    ),
  },
  {
    title: "Hóa đơn",
    key: "invoice",
    render: (_: any, record: IOrderResponse) => (
      <CButton
        disabled={!["COMPLETED", "PAID"].includes(record.status as string)}
        onClick={() => downloadReceipt(record.id)}
        className="h-8 w-8 p-0 rounded-lg flex items-center justify-center border-slate-200 hover:text-blue-600 hover:border-blue-200"
        id={`btn-download-receipt-${record.id}`}
      >
        <Download size={14} />
      </CButton>
    ),
  },
];
