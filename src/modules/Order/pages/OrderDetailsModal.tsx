import React from "react";
import { Image, Divider } from "antd";
import { formatDateTimeFull } from "@/utils/format";
import { useOrderDetail } from "../hooks/useOrder";
import type { IOrderItem } from "../api/orderApi";
import { ShoppingBag, Calendar, CreditCard, DollarSign } from "lucide-react";
import CModal from "@/components/UI/Modal";
import CTable from "@/components/UI/Table";
import OrderStatusTag from "@/modules/Management/OrderManagement/components/OrderStatusTag";
import type { AnyElement } from "@/type";

interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const { data: order, isLoading } = useOrderDetail(orderId || "", isOpen);

  const getStatusTag = (status?: string) => {
    if (!status) return null;
    return (
      <OrderStatusTag
        status={status}
        className="px-3 py-1 text-sm font-medium rounded-full"
      />
    );
  };

  const columns = [
    {
      title: "Khóa học",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: IOrderItem) => (
        <div className="flex items-center gap-4">
          <Image
            src={record.thumbnail || "https://placehold.co/120x80?text=No+Image"}
            alt={text}
            width={80}
            height={50}
            className="rounded object-cover"
            fallback="https://placehold.co/120x80?text=No+Image"
          />
          <span className="font-semibold text-gray-800 line-clamp-2">{text}</span>
        </div>
      ),
    },
    {
      title: "Giá bán",
      dataIndex: "finalPrice",
      key: "finalPrice",
      align: "right" as const,
      render: (price: number) => (
        <span className="font-bold text-primary text-base">
          {price === 0 ? "Miễn phí" : `${price.toLocaleString()}đ`}
        </span>
      ),
    },
  ];

  return (
    <CModal
      title={
        <div className="flex items-center gap-2 text-xl font-bold text-gray-800 border-b pb-3">
          <ShoppingBag className="text-primary w-6 h-6" /> Chi tiết đơn hàng
        </div>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose={true}
    >
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          <span className="text-gray-500 font-medium">Đang tải chi tiết đơn hàng...</span>
        </div>
      ) : order ? (
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Ngày đặt hàng:</span>
                <span className="font-semibold text-gray-800">
                  {formatDateTimeFull(order.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <CreditCard className="w-4 h-4" />
                <span>Trạng thái:</span>
                <span>{getStatusTag(order.status)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <span className="font-bold">Mã đơn hàng:</span>
                <span className="font-mono text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                  {order.id}
                </span>
              </div>
              {order.note && (
                <div className="text-gray-500 text-sm">
                  <span className="font-bold">Ghi chú:</span>{" "}
                  <span className="text-gray-700">{order.note}</span>
                </div>
              )}
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-3">Danh sách khóa học</h3>
          <CTable
            dataSource={order.items as AnyElement[]}
            columns={columns}
            rowKey="courseId"
            pagination={false}
            bordered={false}
            className="mb-6 order-items-table"
          />

          <Divider className="my-4" />

          <div className="flex flex-col items-end gap-3 px-4">
            <div className="flex justify-between w-64 text-gray-500 text-sm">
              <span>Phí VAT (10%):</span>
              <span className="font-medium text-gray-800">
                {order.vatFee > 0 ? `${order.vatFee.toLocaleString()}đ` : "0đ"}
              </span>
            </div>
            <div className="flex justify-between w-64 text-gray-800 font-bold text-lg border-t pt-2">
              <span className="flex items-center gap-1">
                <DollarSign className="w-5 h-5 text-primary" /> Tổng tiền:
              </span>
              <span className="text-primary text-xl">
                {order.totalPrice === 0 ? "Miễn phí" : `${order.totalPrice.toLocaleString()}đ`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy thông tin đơn hàng.
        </div>
      )}
    </CModal>
  );
};

export default OrderDetailsModal;
