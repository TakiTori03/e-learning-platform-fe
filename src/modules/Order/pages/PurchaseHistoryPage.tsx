import React, { useState } from "react";
import { Pagination, Card, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useMyOrders } from "../hooks/useOrder";
import OrderDetailsModal from "./OrderDetailsModal";
import { ShoppingBag, Receipt } from "lucide-react";
import CTable from "@/components/UI/Table";
import CButton from "@/components/UI/Button";
import { getColumnsTableOrder } from "../constants";
import type { AnyElement } from "@/type";

export const PurchaseHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: response, isLoading } = useMyOrders(currentPage, 10);
  const orders = response?.content || [];
  const totalElements = response?.totalElements || 0;

  const showModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDownloadReceipt = (orderId: string) => {
    navigate(`/cart-receipt/${orderId}`);
  };

  const columns = getColumnsTableOrder(showModal, handleDownloadReceipt);

  const tabsItems = [
    {
      label: (
        <span className="flex items-center gap-2 text-base font-semibold px-2 py-1">
          <Receipt className="w-4 h-4" /> Khóa học đã mua
        </span>
      ),
      key: "1",
      children: (
        <div className="mt-4">
          <CTable
            dataSource={orders as AnyElement[]}
            columns={columns}
            rowKey="id"
            pagination={false}
            loading={isLoading}
            className="border border-gray-100 rounded-xl overflow-hidden shadow-sm"
          />
          <div className="flex justify-end mt-6">
            <Pagination
              current={currentPage}
              onChange={(page) => setCurrentPage(page)}
              total={totalElements}
              pageSize={10}
              showSizeChanger={false}
              className="custom-pagination"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <CButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-gray-500 border-gray-300 rounded-full flex items-center justify-center w-10 h-10 shrink-0 shadow-sm"
          />
          <div className="bg-primary bg-opacity-10 p-3 rounded-2xl">
            <ShoppingBag className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Lịch sử giao dịch
            </h1>
            <p className="text-gray-500 mt-1">
              Quản lý và xem lại các hóa đơn, khóa học bạn đã thanh toán.
            </p>
          </div>
        </div>

        <Card className="shadow-sm rounded-2xl border-none p-4">
          <Tabs
            defaultActiveKey="1"
            items={tabsItems}
            className="purchase-history-tabs"
          />
        </Card>

        <OrderDetailsModal
          orderId={selectedOrderId}
          isOpen={isModalOpen}
          onClose={handleCancel}
        />
      </div>
    </div>
  );
};

export default PurchaseHistoryPage;
