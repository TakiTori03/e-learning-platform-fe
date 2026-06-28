import React, { useState, useMemo, memo } from "react";
import { Row, Col, Space, Typography, Spin, Alert, Empty } from "antd";
import {
  UsergroupAddOutlined,
  DollarOutlined,
  ReadOutlined,
  ShoppingOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Chart from "react-apexcharts";
import {
  useSummaryReport,
  useNewSignupsReport,
  useRevenuesReport,
  useCourseSalesReport,
  useTopUsersReport,
  useTopOrdersReport,
} from "../../hooks/useAdminReport";
import StatCard from "../../components/StatCard";
import PageHeader from "@/components/UI/PageHeader";
import CButton from "@/components/UI/Button";
import CSelect from "@/components/UI/Select";
import CTable from "@/components/UI/Table";
import { Show } from "@/components/UI/Template";
import { getColumnsTableUsers, getColumnsTableOrders } from "../../constants";
import { theme as globalTheme } from "@/configs/theme";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const AdminDashboardPage: React.FC = () => {
  const [activeChart, setActiveChart] = useState<"signups" | "revenues" | "sales">("revenues");
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");
  const [dateRangePreset, setDateRangePreset] = useState<string>("7days");

  // Calculate startDate and endDate based on selected preset
  const { startDate, endDate } = useMemo(() => {
    let start = "";
    const end = dayjs().format("YYYY-MM-DD");
    if (dateRangePreset === "7days") {
      start = dayjs().subtract(7, "day").format("YYYY-MM-DD");
    } else if (dateRangePreset === "30days") {
      start = dayjs().subtract(30, "day").format("YYYY-MM-DD");
    } else if (dateRangePreset === "thisMonth") {
      start = dayjs().startOf("month").format("YYYY-MM-DD");
    } else if (dateRangePreset === "thisYear") {
      start = dayjs().startOf("year").format("YYYY-MM-DD");
    }
    return { startDate: start, endDate: end };
  }, [dateRangePreset]);

  // Consume custom React Query hooks with loading, error, and refetch handlers
  const { 
    data: summaryData, 
    isLoading: loadingSummary, 
    isError: errorSummary, 
    refetch: refetchSummary 
  } = useSummaryReport();

  const { 
    data: signupsData, 
    isLoading: loadingSignups, 
    isError: errorSignups, 
    refetch: refetchSignups 
  } = useNewSignupsReport({ groupBy, startDate, endDate });

  const { 
    data: revenuesData, 
    isLoading: loadingRevenues, 
    isError: errorRevenues, 
    refetch: refetchRevenues 
  } = useRevenuesReport({ groupBy, startDate, endDate });

  const { 
    data: salesData, 
    isLoading: loadingSales, 
    isError: errorSales, 
    refetch: refetchSales 
  } = useCourseSalesReport();

  const { 
    data: topUsers, 
    isLoading: loadingTopUsers, 
    isError: errorTopUsers, 
    refetch: refetchTopUsers 
  } = useTopUsersReport(5);

  const { 
    data: topOrders, 
    isLoading: loadingTopOrders, 
    isError: errorTopOrders, 
    refetch: refetchTopOrders 
  } = useTopOrdersReport(5);

  // Calculate aggregated stats from summary API
  const totalUsers = summaryData?.signupData?.totalSignups || 0;
  const totalRevenue = summaryData?.revenueData?.totalRevenue || 0;
  const totalCourses = summaryData?.courseData?.totalActiveCourses || 0;
  const totalSalesCount = useMemo(() => {
    const list = salesData || [];
    return list.reduce((acc, curr) => acc + (curr.totalSales || 0), 0);
  }, [salesData]);

  // Dynamic Chart Selection Helpers
  const isChartLoading = useMemo(() => {
    if (activeChart === "revenues") return loadingRevenues;
    if (activeChart === "signups") return loadingSignups;
    return loadingSales;
  }, [activeChart, loadingRevenues, loadingSignups, loadingSales]);

  const isChartError = useMemo(() => {
    if (activeChart === "revenues") return errorRevenues;
    if (activeChart === "signups") return errorSignups;
    return errorSales;
  }, [activeChart, errorRevenues, errorSignups, errorSales]);

  const handleChartRetry = () => {
    if (activeChart === "revenues") refetchRevenues();
    else if (activeChart === "signups") refetchSignups();
    else refetchSales();
  };

  // Chart configuration options based on active tab
  const chartOptions = useMemo(() => {
    let categories: string[] = [];
    if (activeChart === "signups" && signupsData?.dataPoints) {
      categories = signupsData.dataPoints.map((dp) => dp.period);
    } else if (activeChart === "revenues" && revenuesData?.dataPoints) {
      categories = revenuesData.dataPoints.map((dp) => dp.period);
    } else if (activeChart === "sales" && salesData) {
      categories = salesData.map((dp) => dp.courseName);
    }

    return {
      chart: {
        id: "admin-analytics-chart",
        toolbar: { show: false },
        fontFamily: "Inter, system-ui, sans-serif",
        animations: {
          enabled: true,
          easing: "easeinout" as const,
          speed: 800,
        },
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        strokeColors: "#fff",
        hover: { size: 6 },
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            if (activeChart === "revenues") return `${value.toLocaleString('vi-VN')}đ`;
            return value.toString();
          },
        },
      },
      stroke: {
        curve: "smooth" as const,
        width: 3,
      },
      colors: [activeChart === "revenues" ? globalTheme.primary : activeChart === "signups" ? globalTheme.statusGreen : globalTheme.actionActive],
      fill: {
        type: "gradient" as const,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [0, 100],
        },
      },
      grid: {
        borderColor: "#f1f1f1",
      },
      dataLabels: { enabled: false },
      tooltip: {
        y: {
          formatter: (val: number) => {
            if (activeChart === "revenues") return `${val.toLocaleString('vi-VN')}đ`;
            return `${val}`;
          },
        },
      },
    };
  }, [activeChart, signupsData, revenuesData, salesData]);

  const chartSeries = useMemo(() => {
    if (activeChart === "signups" && signupsData?.dataPoints) {
      return [
        {
          name: "Lượt đăng ký mới",
          data: signupsData.dataPoints.map((dp) => dp.count),
        },
      ];
    } else if (activeChart === "revenues" && revenuesData?.dataPoints) {
      return [
        {
          name: "Doanh thu",
          data: revenuesData.dataPoints.map((dp) => dp.revenue),
        },
      ];
    } else if (activeChart === "sales" && salesData) {
      return [
        {
          name: "Số lượng bán ra",
          data: salesData.map((dp) => dp.totalSales),
        },
      ];
    }
    return [];
  }, [activeChart, signupsData, revenuesData, salesData]);

  // Table Columns
  const userColumns = useMemo(() => getColumnsTableUsers(), []);
  const orderColumns = useMemo(() => getColumnsTableOrders(), []);

  const hasAnyError = errorSummary || errorSignups || errorRevenues || errorSales || errorTopUsers || errorTopOrders;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tổng quan Hệ thống (Admin)"
        subtitle="Theo dõi doanh thu, tăng trưởng người dùng và tình hình học tập toàn hệ thống."
      />

      {/* Global Error Banner for Graceful Degradation notification */}
      <Show>
        <Show.When isTrue={hasAnyError}>
          <Alert
            message="Kết nối gián đoạn"
            description="Một số dữ liệu báo cáo không thể đồng bộ từ hệ thống. Hãy thử tải lại các bảng lỗi hoặc bấm nút Tải lại toàn bộ."
            type="warning"
            showIcon
            action={
              <CButton 
                size="small" 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={() => {
                  refetchSummary();
                  refetchSignups();
                  refetchRevenues();
                  refetchSales();
                  refetchTopUsers();
                  refetchTopOrders();
                }}
              >
                Tải lại toàn bộ
              </CButton>
            }
            className="mb-6 rounded-xl border-amber-200 bg-amber-50"
          />
        </Show.When>
      </Show>

      {/* Khối Thẻ Chỉ Số Báo Cáo */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số học viên"
            value={errorSummary ? "Lỗi tải" : totalUsers}
            loading={loadingSummary}
            prefix={<UsergroupAddOutlined className="text-blue-500 mr-2" />}
            trend={errorSummary ? undefined : { value: 12, isUp: true, text: "tăng trưởng tuần này" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng doanh thu"
            value={errorSummary ? "Lỗi tải" : totalRevenue}
            loading={loadingSummary}
            prefix={<DollarOutlined className="text-emerald-500 mr-2" />}
            suffix="VNĐ"
            trend={errorSummary ? undefined : { value: 8.5, isUp: true, text: "so với tháng trước" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Khóa học phát hành"
            value={errorSummary ? "Lỗi tải" : totalCourses}
            loading={loadingSummary}
            prefix={<ReadOutlined className="text-indigo-500 mr-2" />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng lượt đăng ký học"
            value={errorSales ? "Lỗi tải" : totalSalesCount}
            loading={loadingSales}
            prefix={<ShoppingOutlined className="text-violet-500 mr-2" />}
            trend={errorSales ? undefined : { value: 15, isUp: true, text: "tăng trưởng học tập" }}
          />
        </Col>
      </Row>

      {/* Khối Biểu Đồ */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <CButton
              type={activeChart === "revenues" ? "primary" : "default"}
              onClick={() => setActiveChart("revenues")}
              className="rounded-lg h-9 font-medium"
            >
              Doanh thu
            </CButton>
            <CButton
              type={activeChart === "signups" ? "primary" : "default"}
              onClick={() => setActiveChart("signups")}
              className="rounded-lg h-9 font-medium"
            >
              Đăng ký mới
            </CButton>
            <CButton
              type={activeChart === "sales" ? "primary" : "default"}
              onClick={() => setActiveChart("sales")}
              className="rounded-lg h-9 font-medium"
            >
              Tỷ lệ bán khóa học
            </CButton>
          </div>

          {activeChart !== "sales" && (
            <Space>
              <CSelect
                value={dateRangePreset}
                onChange={(value: any) => setDateRangePreset(value)}
                style={{ width: 144 }}
                className="rounded-lg"
                options={[
                  { value: "7days", label: "7 ngày qua" },
                  { value: "30days", label: "30 ngày qua" },
                  { value: "thisMonth", label: "Tháng này" },
                  { value: "thisYear", label: "Năm nay" },
                ]}
              />
              <CSelect
                value={groupBy}
                onChange={(value: any) => setGroupBy(value)}
                style={{ width: 128 }}
                className="rounded-lg"
                options={[
                  { value: "day", label: "Theo ngày" },
                  { value: "month", label: "Theo tháng" },
                ]}
              />
            </Space>
          )}
        </div>

        <div className="w-full min-h-[350px] flex items-center justify-center">
          <Show>
            <Show.When isTrue={isChartLoading}>
              <div className="h-[350px] flex flex-col items-center justify-center gap-3">
                <Spin size="large" />
                <Text type="secondary">Đang tải dữ liệu biểu đồ...</Text>
              </div>
            </Show.When>
            <Show.When isTrue={isChartError}>
              <Empty
                description={
                  <div className="text-center">
                    <Text type="danger" strong>Không thể tải dữ liệu biểu đồ</Text>
                    <br />
                    <Text type="secondary" className="text-xs">Kết nối máy chủ bị gián đoạn</Text>
                  </div>
                }
              >
                <CButton type="primary" icon={<ReloadOutlined />} onClick={handleChartRetry}>
                  Tải lại biểu đồ
                </CButton>
              </Empty>
            </Show.When>
            <Show.Else>
              <div className="w-full h-[350px]">
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type={activeChart === "sales" ? "bar" : "area"}
                  height={350}
                />
              </div>
            </Show.Else>
          </Show>
        </div>
      </div>

      {/* Bảng Chi Tiết (Top Users & Orders) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm h-full p-6">
            <Title level={5} className="!mb-4 !mt-0 font-bold">Học viên mới hoạt động</Title>
            <CTable
              dataSource={errorTopUsers ? [] : topUsers}
              columns={userColumns}
              rowKey="id"
              pagination={false}
              loading={loadingTopUsers}
              locale={{
                emptyText: errorTopUsers ? (
                  <Empty description="Không thể tải danh sách học viên">
                    <CButton size="small" type="primary" icon={<ReloadOutlined />} onClick={() => refetchTopUsers()}>
                      Thử lại
                    </CButton>
                  </Empty>
                ) : undefined
              }}
              className="custom-table"
            />
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm h-full p-6">
            <Title level={5} className="!mb-4 !mt-0 font-bold">Giao dịch gần đây</Title>
            <CTable
              dataSource={errorTopOrders ? [] : topOrders}
              columns={orderColumns}
              rowKey="id"
              pagination={false}
              loading={loadingTopOrders}
              locale={{
                emptyText: errorTopOrders ? (
                  <Empty description="Không thể tải danh sách đơn hàng">
                    <CButton size="small" type="primary" icon={<ReloadOutlined />} onClick={() => refetchTopOrders()}>
                      Thử lại
                    </CButton>
                  </Empty>
                ) : undefined
              }}
              className="custom-table"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default memo(AdminDashboardPage);
