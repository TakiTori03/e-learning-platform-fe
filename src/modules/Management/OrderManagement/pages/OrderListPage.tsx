import { formatDateTimeFull, formatFullName } from "@/utils/format";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Col,
  Descriptions,
  Row,
  Statistic,
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
import OrderStatusTag from "../components/OrderStatusTag";

// Hooks, Constants & Types
import { ActionsType, OrderStatus, OrderStatusLabels } from "@/constants/enums";
import type { IOrder, IOrderItem } from "@/type";
import { getColumnsTableOrder } from "../constants";
import { useAdminOrders, useUpdateOrderStatusMutation } from "../queryHooks";
import { useLocalStore } from "../store/useLocalStore";

const OrderListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);

  // Zustand Store (Rule 4)
  const {
    actionMode,
    selectedOrder,
    setActionMode,
    setSelectedOrder,
    resetStore,
  } = useLocalStore();

  // Queries & Mutations
  const { data: ordersData, isLoading } = useAdminOrders(page, size, search || undefined);
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateOrderStatusMutation();

  const handleOpenDetail = useCallback((order: IOrder) => {
    setSelectedOrder(order);
    setActionMode(ActionsType.READ);
  }, [setSelectedOrder, setActionMode]);

  const handleCloseDetail = useCallback(() => {
    resetStore();
  }, [resetStore]);

  const handleUpdateStatus = useCallback(
    (id: string, status: string) => {
      updateStatus(
        { id, status },
        {
          onSuccess: (updated) => {
            if (selectedOrder && selectedOrder.id === id) {
              setSelectedOrder({
                ...selectedOrder,
                status: (updated?.status || status) as OrderStatus,
              });
            }
          },
        }
      );
    },
    [updateStatus, selectedOrder, setSelectedOrder]
  );

  // Compute stats based on the orders fetched
  const stats = useMemo(() => {
    const list = ordersData?.content || [];
    const totalCount = ordersData?.totalElements || 0;
    const completedCount = list.filter((o) => o.status === OrderStatus.COMPLETED).length;
    const totalRevenue = list
      .filter((o) => o.status === OrderStatus.COMPLETED)
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    return {
      totalCount,
      completedCount,
      totalRevenue,
    };
  }, [ordersData]);

  // Decoupled Columns (Rule 5)
  const columns = useMemo(
    () => getColumnsTableOrder(handleOpenDetail, handleUpdateStatus),
    [handleOpenDetail, handleUpdateStatus]
  );

  // Filter content locally based on dropdown status selection
  const filteredOrders = useMemo(() => {
    const list = ordersData?.content || [];
    if (!statusFilter) return list;
    return list.filter((o) => o.status === statusFilter);
  }, [ordersData, statusFilter]);



  return (
    <div className="space-y-6">
      {/* Header section */}
      <PageHeader
        title="Quản lý Đơn hàng"
        subtitle="Theo dõi hóa đơn mua khóa học, phê duyệt hoặc hủy giao dịch từ học viên"
        showCreateButton={false}
      />

      {/* Summary statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Tổng Đơn Hàng</span>}
              value={stats.totalCount}
              prefix={<FileTextOutlined className="text-blue-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Đơn Hoàn Tất</span>}
              value={stats.completedCount}
              valueStyle={{ color: "#10b981" }}
              prefix={<CheckCircleOutlined className="text-emerald-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Doanh Thu Ghi Nhận</span>}
              value={stats.totalRevenue}
              valueStyle={{ color: "#2563eb" }}
              prefix={<DollarOutlined className="text-blue-600 mr-2" />}
              suffix="đ"
            />
          </div>
        </Col>
      </Row>

      {/* Filters and List */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <CInput
            placeholder="Tìm theo Mã đơn hàng, học viên, tên khóa học..."
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
            options={Object.values(OrderStatus).map((status) => ({
              value: status,
              label: OrderStatusLabels[status],
            }))}
          />
        </div>

        <CTable
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={isLoading || updatingStatus}
          className="custom-table"
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            pageSize: size,
            total: ordersData?.totalElements || 0,
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
            <InfoCircleOutlined className="text-white" /> Chi tiết Đơn hàng #{selectedOrder?.id?.substring(0, 8)}
          </span>
        }
        open={actionMode === ActionsType.READ && selectedOrder !== null}
        onCancel={handleCloseDetail}
        footer={null}
        width={640}
      >
        <Show>
          <Show.When isTrue={selectedOrder !== null}>
            {selectedOrder && (
              <div className="space-y-6 pt-4">
                {/* Main Info */}
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Học viên</span>
                      <span className="font-semibold text-gray-800 mt-1">
                        {formatFullName(selectedOrder.user)}
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5">{selectedOrder.user?.email}</span>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-400 font-semibold uppercase">Trạng thái</span>
                      <OrderStatusTag
                        status={selectedOrder.status}
                        className="rounded-full px-3 py-0.5 mt-1 font-medium"
                      />
                    </div>
                  </Col>
                </Row>

                <Descriptions bordered column={1} size="small" className="custom-descriptions bg-gray-50/50">
                  <Descriptions.Item label="Mã Giao dịch ID">{selectedOrder.id}</Descriptions.Item>
                  <Descriptions.Item label="Thời gian tạo">
                    {formatDateTimeFull(selectedOrder.createdAt)}
                  </Descriptions.Item>
                </Descriptions>

                {/* Items Table */}
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase block mb-3">Sản phẩm đăng ký</span>
                  <div className="space-y-3">
                    <For
                      array={selectedOrder.items || []}
                      render={(item: IOrderItem, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
                          <div className="flex items-center gap-3">
                            <Avatar src={item.thumbnail} shape="square" size={48} className="border" />
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-gray-800 max-w-[320px] truncate">{item.courseName}</span>
                              <span className="text-xs text-gray-400">ID: {item.courseId}</span>
                            </div>
                          </div>
                          <span className="font-semibold text-gray-700">{item.price ? `${item.price.toLocaleString()}đ` : "0đ"}</span>
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Note */}
                <Show>
                  <Show.When isTrue={!!selectedOrder.note}>
                    <div>
                      <span className="text-xs text-gray-400 font-semibold uppercase block mb-1">Ghi chú của học viên</span>
                      <p className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 text-blue-800 text-xs italic m-0">
                        "{selectedOrder.note}"
                      </p>
                    </div>
                  </Show.When>
                </Show>

                {/* Financial Summary */}
                <div className="flex flex-col space-y-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Tạm tính</span>
                    <span>{selectedOrder.totalPrice && selectedOrder.vatFee ? `${(selectedOrder.totalPrice - selectedOrder.vatFee).toLocaleString()}đ` : `${(selectedOrder.totalPrice || 0).toLocaleString()}đ`}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Thuế / Phí VAT (5%)</span>
                    <span>{selectedOrder.vatFee ? `${selectedOrder.vatFee.toLocaleString()}đ` : "0đ"}</span>
                  </div>
                  <div className="border-t border-gray-200 my-1.5" />
                  <div className="flex justify-between font-bold text-sm text-gray-800">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">{selectedOrder.totalPrice ? `${selectedOrder.totalPrice.toLocaleString()}đ` : "0đ"}</span>
                  </div>
                </div>

                {/* Quick Actions inside Detail */}
                <Show>
                  <Show.When isTrue={selectedOrder.status === OrderStatus.PENDING}>
                    <div className="flex gap-3 justify-end pt-2">
                      <CButton
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => handleUpdateStatus(selectedOrder.id, OrderStatus.CANCELLED)}
                        loading={updatingStatus}
                        style={{ height: "40px", borderRadius: "10px" }}
                      >
                        Từ chối & Hủy đơn
                      </CButton>
                      <CButton
                        type="primary"
                        icon={<CheckCircleOutlined />}
                        onClick={() => handleUpdateStatus(selectedOrder.id, OrderStatus.COMPLETED)}
                        loading={updatingStatus}
                        style={{ height: "40px", borderRadius: "10px", fontWeight: 600 }}
                      >
                        Phê duyệt đơn hàng
                      </CButton>
                    </div>
                  </Show.When>
                </Show>
              </div>
            )}
          </Show.When>
        </Show>
      </CModal>
    </div>
  );
};

export default OrderListPage;
