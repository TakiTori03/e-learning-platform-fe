import React, { useState, useMemo, useCallback } from "react";
import {
  Row,
  Col,
  Statistic,
  Descriptions,
} from "antd";
import {
  DollarOutlined,
  CheckCircleOutlined,
  TransactionOutlined,
  InfoCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { formatDateTimeFull } from "@/utils/format";

// Custom UI Components & Wrappers
import CTable from "@/components/UI/Table";
import CModal from "@/components/UI/Modal";
import PaymentStatusTag from "../components/PaymentStatusTag";
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";
import CButton from "@/components/UI/Button";
import PageHeader from "@/components/UI/PageHeader";
import { TotalTableMessage, Show } from "@/components/UI/Template";

// Hooks, Constants & Types
import { useAdminTransactions } from "../queryHooks";
import { PaymentStatus, PaymentStatusLabels, ActionsType } from "@/constants/enums";
import { getColumnsTableTransaction } from "../constants";
import { useLocalStore } from "../store/useLocalStore";
import type { IPayment } from "@/type";

const TransactionListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | undefined>(undefined);

  // Zustand Store (Rule 4)
  const {
    actionMode,
    selectedTx,
    setActionMode,
    setSelectedTx,
    resetStore,
  } = useLocalStore();

  // Queries
  const { data: txData, isLoading } = useAdminTransactions(page, size, search || undefined);

  const handleOpenDetail = useCallback((tx: IPayment) => {
    setSelectedTx(tx);
    setActionMode(ActionsType.READ);
  }, [setSelectedTx, setActionMode]);

  const handleCloseDetail = useCallback(() => {
    resetStore();
  }, [resetStore]);

  // Compute stats based on the data
  const stats = useMemo(() => {
    const list = txData?.content || [];
    const totalCount = txData?.totalElements || 0;
    const successCount = list.filter((p) => p.status === PaymentStatus.SUCCESS).length;
    const totalVolume = list
      .filter((p) => p.status === PaymentStatus.SUCCESS)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const successRate = totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 100;

    return {
      totalCount,
      successRate,
      totalVolume,
    };
  }, [txData]);

  // Decoupled Columns (Rule 5)
  const columns = useMemo(
    () => getColumnsTableTransaction(handleOpenDetail),
    [handleOpenDetail]
  );

  const filteredTx = useMemo(() => {
    const list = txData?.content || [];
    if (!statusFilter) return list;
    return list.filter((p) => p.status === statusFilter);
  }, [txData, statusFilter]);



  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Đối soát Giao dịch"
        subtitle="Xem lịch sử các luồng thanh toán từ cổng ngân hàng, mã tham chiếu ngân hàng và thông tin kỹ thuật"
        showCreateButton={false}
      />

      {/* Summary statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Tổng Giao Dịch</span>}
              value={stats.totalCount}
              prefix={<TransactionOutlined className="text-blue-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Tỷ Lệ Thành Công</span>}
              value={stats.successRate}
              suffix="%"
              valueStyle={{ color: stats.successRate >= 80 ? "#10b981" : "#ef4444" }}
              prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <Statistic
              title={<span className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Dòng Tiền Thực Nhận</span>}
              value={stats.totalVolume}
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
            placeholder="Tìm theo Mã GD, Mã đơn hàng, Ngân hàng..."
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
            options={Object.values(PaymentStatus).map((status) => ({
              value: status,
              label: PaymentStatusLabels[status],
            }))}
          />
        </div>

        <CTable
          columns={columns}
          dataSource={filteredTx}
          rowKey="id"
          loading={isLoading}
          className="custom-table"
          scroll={{ x: "max-content" }}
          pagination={{
            current: page,
            pageSize: size,
            total: txData?.totalElements || 0,
            onChange: (p) => setPage(p),
            showTotal: TotalTableMessage,
            showSizeChanger: false,
          }}
        />
      </div>

      {/* Details Modal */}
      <CModal
        title={
          <span className="text-white font-bold text-lg flex items-center gap-2">
            <InfoCircleOutlined className="text-white" /> Chi tiết Kỹ thuật Giao dịch
          </span>
        }
        open={actionMode === ActionsType.READ && selectedTx !== null}
        onCancel={handleCloseDetail}
        footer={null}
        width={600}
      >
        <Show>
          <Show.When isTrue={selectedTx !== null}>
            {selectedTx && (
              <div className="pt-4 space-y-4">
                <Descriptions bordered column={1} size="small" className="custom-descriptions bg-gray-50/50">
                  <Descriptions.Item label="Mã Giao Dịch Gateway">{selectedTx.id}</Descriptions.Item>
                  <Descriptions.Item label="Mã Đơn Hàng">{selectedTx.orderId}</Descriptions.Item>
                  <Descriptions.Item label="Mã Giao Dịch Ngân Hàng (TranNo)">
                    {selectedTx.bankTranNo || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mã Tham Chiếu Giao Dịch (vnpTxnRef)">
                    {selectedTx.vnpTxnRef || "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương Thức Thanh Toán">{selectedTx.method}</Descriptions.Item>
                  <Descriptions.Item label="Cổng Ngân Hàng">{selectedTx.bankCode || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Loại Thẻ">{selectedTx.cardType || "N/A"}</Descriptions.Item>
                  <Descriptions.Item label="Số Tiền Giao Dịch">
                    <span className="font-bold text-green-600">{selectedTx.amount ? `${selectedTx.amount.toLocaleString()}đ` : "0đ"}</span>
                  </Descriptions.Item>
                  <Descriptions.Item label="Nội Dung Đơn Hàng">{selectedTx.orderInfo}</Descriptions.Item>
                  <Descriptions.Item label="Thời Gian Phản Hồi Gateway">
                    {selectedTx.payDate ? formatDateTimeFull(selectedTx.payDate) : "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trạng Thái Thanh Toán">
                    <PaymentStatusTag
                      status={selectedTx.status}
                      className="rounded-full px-3 py-0.5 m-0 font-medium"
                    />
                  </Descriptions.Item>
                </Descriptions>

                <div className="flex justify-end pt-2">
                  <CButton onClick={handleCloseDetail} style={{ height: "40px", borderRadius: "10px" }}>
                    Đóng
                  </CButton>
                </div>
              </div>
            )}
          </Show.When>
        </Show>
      </CModal>
    </div>
  );
};

export default TransactionListPage;
