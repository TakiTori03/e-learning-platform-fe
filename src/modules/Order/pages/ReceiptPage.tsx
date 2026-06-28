import CButton from "@/components/UI/Button";
import LoadingLazy from "@/components/UI/LoadingLazy";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate, formatFullName } from "@/utils/format";
import { ArrowLeftOutlined, PrinterOutlined } from "@ant-design/icons";
import { Card, Divider, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrderDetail } from "../hooks/useOrder";

const { Title, Text, Paragraph } = Typography;

interface TableDataType {
  key: string;
  name: string;
  price: number;
  quantity: number;
}

export const ReceiptPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: orderDetails, isLoading } = useOrderDetail(orderId || "");
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return <LoadingLazy />;
  }

  if (!orderDetails) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
        <Title level={4} className="text-gray-500 italic">
          Không tìm thấy thông tin hóa đơn.
        </Title>
        <CButton onClick={() => navigate(-1)} className="mt-4">
          Quay lại
        </CButton>
      </div>
    );
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const columns: ColumnsType<TableDataType> = [
    {
      title: "Tên khóa học (Item)",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Số lượng (Qty)",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      render: () => 1,
    },
    {
      title: "Đơn giá (Price)",
      dataIndex: "price",
      key: "price",
      align: "right",
      render: (value: number) => formatPrice(value),
    },
    {
      title: "Thành tiền (Amount)",
      dataIndex: "price",
      key: "amount",
      align: "right",
      render: (value: number) => formatPrice(value),
    },
  ];

  const dataSource: TableDataType[] = orderDetails.items.map((item) => ({
    key: item.courseId,
    name: item.name,
    price: item.finalPrice,
    quantity: 1,
  }));

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-8 print:bg-white print:py-0 print:px-0 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between gap-4 mb-8 print:hidden">
          <CButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-gray-500 border-gray-300 rounded-full flex items-center justify-center w-10 h-10 shrink-0 shadow-sm bg-white"
          />
          <CButton
            type="primary"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
            className="rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200"
          >
            In hóa đơn
          </CButton>
        </div>

        {/* Invoice Card */}
        <Card className="shadow-md rounded-2xl border-none p-6 md:p-12 bg-white print:shadow-none print:p-0">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-6 mb-10 pb-6 border-b">
            <div>
              <Title level={2} className="!m-0 font-extrabold text-slate-900 tracking-tight">
                HÓA ĐƠN THANH TOÁN
              </Title>
              <Text type="secondary" className="text-xs tracking-[0.1em] uppercase font-mono block mt-1">
                Receipt / Invoice
              </Text>
            </div>
            <div className="text-right md:text-right w-full md:w-auto">
              <Paragraph className="!m-0 text-slate-800 text-sm font-semibold">
                E-Learning, Inc.
              </Paragraph>
              <Paragraph className="!m-0 text-slate-400 text-xs font-light">
                Hai Ba Trung, Ha Noi
              </Paragraph>
              <Paragraph className="!m-0 text-slate-400 text-xs font-light">
                support@elearning.com
              </Paragraph>
            </div>
          </div>

          {/* Details Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <Title level={5} className="text-slate-500 uppercase tracking-wider !m-0 !mb-3 text-[11px] font-bold">
                Khách hàng mua (Sold To):
              </Title>
              <Paragraph className="!m-0 font-semibold text-slate-800">
                {user ? formatFullName(user) : "Khách hàng mua khóa học"}
              </Paragraph>
              <Paragraph className="!m-0 text-slate-500 text-sm">
                {user?.email}
              </Paragraph>
            </div>
            <div className="md:text-right">
              <Title level={5} className="text-slate-500 uppercase tracking-wider !m-0 !mb-3 text-[11px] font-bold md:text-right">
                Thông tin đơn hàng (Order info):
              </Title>
              <Paragraph className="!m-0 text-sm">
                <strong>Đơn hàng #:</strong> <span className="font-mono text-xs bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">{orderDetails.id}</span>
              </Paragraph>
              <Paragraph className="!m-0 text-sm mt-1">
                <strong>Ngày tạo:</strong> {formatDate(orderDetails.createdAt)}
              </Paragraph>
              <Paragraph className="!m-0 text-sm mt-1">
                <strong>Trạng thái:</strong>{" "}
                <span className="font-semibold text-green-600 uppercase text-xs">
                  {orderDetails.status}
                </span>
              </Paragraph>
            </div>
          </div>

          {/* Items Table */}
          <Table
            className="mb-8"
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            rowKey="key"
            bordered
            summary={() => (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2} className="font-semibold text-slate-600">
                    Thuế (VAT):
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={2} className="text-right font-medium text-slate-800">
                    {formatPrice(orderDetails.vatFee)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row className="bg-slate-50/50">
                  <Table.Summary.Cell index={0} colSpan={2} className="font-bold text-slate-900 text-base">
                    Tổng tiền thanh toán (Total Paid):
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={2} className="text-right font-extrabold text-primary text-base">
                    {formatPrice(orderDetails.totalPrice)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            )}
          />

          <Divider />

          {/* Tax Notes / Sign off */}
          <div className="text-slate-400 text-xs space-y-2 mt-6">
            <p>* Đối với các học viên cần xuất hóa đơn tài chính trực tiếp, số thuế được tính toán dựa trên trị giá gốc của dịch vụ.</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào liên quan đến hóa đơn thanh toán này, vui lòng liên hệ bộ phận hỗ trợ của chúng tôi tại support@elearning.com.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReceiptPage;
