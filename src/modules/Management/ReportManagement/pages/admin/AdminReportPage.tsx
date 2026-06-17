import React, { useState, useMemo } from "react";
import { Row, Col, Space, Typography, Spin, Alert, Card, Radio, Tooltip, Badge } from "antd";
import {
  UsergroupAddOutlined,
  DollarOutlined,
  ReadOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  DownloadOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import Chart from "react-apexcharts";
import {
  useSummaryReport,
  useNewSignupsReport,
  useRevenuesReport,
  useCourseSalesReport,
  useTopOrdersReport,
  useUsersProgressReport,
} from "../../hooks/useAdminReport";
import StatCard from "../../components/StatCard";
import PageHeader from "@/components/UI/PageHeader";
import CButton from "@/components/UI/Button";
import CSelect from "@/components/UI/Select";
import CTable from "@/components/UI/Table";
import { Show } from "@/components/UI/Template";
import { getColumnsTableProgress, getColumnsTableSales, getColumnsTableOrders } from "../../constants";
import { theme as globalTheme } from "@/configs/theme";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const AdminReportPage: React.FC = () => {
  const [dateRangePreset, setDateRangePreset] = useState<string>("30days");
  const [groupBy, setGroupBy] = useState<"day" | "month">("day");

  // Calculate dates based on preset
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

  // React Query Hooks
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
    data: topOrders, 
    isLoading: loadingOrders, 
    isError: errorOrders, 
    refetch: refetchOrders 
  } = useTopOrdersReport(10);

  const { 
    data: progressReport, 
    isLoading: loadingProgress, 
    isError: errorProgress, 
    refetch: refetchProgress 
  } = useUsersProgressReport();

  // Calculations
  const totalUsers = summaryData?.signupData?.totalSignups || 0;
  const totalRevenue = summaryData?.revenueData?.totalRevenue || 0;
  const totalCourses = summaryData?.courseData?.totalActiveCourses || 0;
  
  const avgProgress = useMemo(() => {
    if (!progressReport || progressReport.length === 0) return 0;
    const total = progressReport.reduce((acc, curr) => acc + (curr.averageProgress || 0), 0);
    return parseFloat((total / progressReport.length).toFixed(1));
  }, [progressReport]);

  const totalEnrollmentsCount = useMemo(() => {
    if (!progressReport) return 0;
    return progressReport.reduce((acc, curr) => acc + (curr.totalEnrollments || 0), 0);
  }, [progressReport]);

  const totalCompletedEnrollmentsCount = useMemo(() => {
    if (!progressReport) return 0;
    return progressReport.reduce((acc, curr) => acc + (curr.completedEnrollments || 0), 0);
  }, [progressReport]);

  const completionRate = useMemo(() => {
    if (totalEnrollmentsCount === 0) return 0;
    return parseFloat(((totalCompletedEnrollmentsCount / totalEnrollmentsCount) * 100).toFixed(1));
  }, [totalEnrollmentsCount, totalCompletedEnrollmentsCount]);

  // Export handlers
  const handleExportCSV = (type: "revenue" | "sales" | "progress") => {
    let exportData: any[] = [];
    let filename = "";

    if (type === "revenue" && revenuesData?.dataPoints) {
      exportData = revenuesData.dataPoints.map(dp => ({
        "Thời gian": dp.period,
        "Doanh thu (VND)": dp.revenue
      }));
      filename = `bao-cao-doanh-thu-${dateRangePreset}.csv`;
    } else if (type === "sales" && salesData) {
      exportData = salesData.map(c => ({
        "Mã khóa học": c.courseId,
        "Tên khóa học": c.courseName,
        "Số lượng bán": c.totalSales,
        "Tổng doanh thu (VND)": c.totalRevenue
      }));
      filename = "bao-cao-doanh-so-khoa-hoc.csv";
    } else if (type === "progress" && progressReport) {
      exportData = progressReport.map(p => ({
        "Mã khóa học": p.courseId,
        "Tổng lượt đăng ký": p.totalEnrollments,
        "Lượt hoàn thành": p.completedEnrollments,
        "Tiến độ trung bình (%)": p.averageProgress
      }));
      filename = "bao-cao-tien-do-hoc-vien.csv";
    }

    if (exportData.length === 0) return;
    
    const headers = Object.keys(exportData[0]);
    const rows = exportData.map(row => 
      headers.map(header => {
        const val = row[header];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(",")
    );
    
    // Add BOM for UTF-8 compatibility with Excel
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Chart configs
  const mainChartOptions = useMemo(() => {
    const categories = revenuesData?.dataPoints?.map(dp => dp.period) || [];
    return {
      chart: {
        id: "admin-revenue-chart",
        toolbar: { show: true },
        fontFamily: "Inter, system-ui, sans-serif",
      },
      colors: [globalTheme.primary, globalTheme.statusGreen],
      stroke: { curve: "smooth" as const, width: [3, 3] },
      fill: {
        type: "gradient" as const,
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.05,
          stops: [0, 100]
        }
      },
      xaxis: {
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: [
        {
          title: { text: "Doanh thu (VND)" },
          labels: { formatter: (val: number) => `${val.toLocaleString("vi-VN")}đ` }
        },
        {
          opposite: true,
          title: { text: "Học viên đăng ký" },
          labels: { formatter: (val: number) => Math.round(val).toString() }
        }
      ],
      grid: { borderColor: "#f3f4f6" },
      tooltip: { shared: true, intersect: false }
    };
  }, [revenuesData, signupsData]);

  const mainChartSeries = useMemo(() => {
    const revenueDataPoints = revenuesData?.dataPoints?.map(dp => dp.revenue) || [];
    const signupDataPoints = signupsData?.dataPoints?.map(dp => dp.count) || [];
    return [
      { name: "Doanh thu (VND)", type: "area", data: revenueDataPoints },
      { name: "Đăng ký mới", type: "line", data: signupDataPoints }
    ];
  }, [revenuesData, signupsData]);

  const donutChartOptions = useMemo(() => {
    const labels = salesData?.slice(0, 5).map(c => c.courseName) || [];
    return {
      chart: { type: "donut" as const },
      labels,
      colors: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ec4899"],
      legend: { position: "bottom" as const },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            labels: {
              show: true,
              total: {
                show: true,
                label: "Doanh thu",
                formatter: (w: any) => {
                  const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                  return `${total.toLocaleString("vi-VN")}đ`;
                }
              }
            }
          }
        }
      },
      dataLabels: { enabled: false }
    };
  }, [salesData]);

  const donutChartSeries = useMemo(() => {
    return salesData?.slice(0, 5).map(c => c.totalRevenue) || [];
  }, [salesData]);

  // Table columns
  const progressColumns = useMemo(() => getColumnsTableProgress(), []);
  const salesColumns = useMemo(() => getColumnsTableSales(), []);
  const orderColumns = useMemo(() => getColumnsTableOrders(), []);

  const isAnyError = errorSummary || errorRevenues || errorSignups || errorSales || errorOrders || errorProgress;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4 print:hidden">
        <PageHeader
          title="Báo cáo & Phân tích (Admin)"
          subtitle="Phân tích tình hình tài chính doanh thu, lượt mua khóa học, tiến độ học tập và mức độ tương tác của học viên."
        />
        <Space>
          <CButton icon={<DownloadOutlined />} onClick={() => handleExportCSV("revenue")}>Xuất CSV Doanh thu</CButton>
          <CButton type="primary" icon={<FileTextOutlined />} onClick={handlePrintPDF}>In Báo cáo (PDF)</CButton>
        </Space>
      </div>

      <Show>
        <Show.When isTrue={isAnyError}>
          <Alert
            message="Một số dữ liệu lỗi"
            description="Có lỗi xảy ra khi tải dữ liệu từ các microservices. Vui lòng bấm nút tải lại."
            type="warning"
            showIcon
            action={
              <CButton size="small" type="primary" icon={<ReloadOutlined />} onClick={() => {
                refetchSummary();
                refetchRevenues();
                refetchSignups();
                refetchSales();
                refetchOrders();
                refetchProgress();
              }}>Tải lại</CButton>
            }
            className="rounded-2xl"
          />
        </Show.When>
      </Show>

      {/* KPI Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng doanh thu hệ thống"
            value={errorSummary ? "Lỗi tải" : `${totalRevenue.toLocaleString("vi-VN")}đ`}
            loading={loadingSummary}
            prefix={<DollarOutlined className="text-emerald-500 mr-2" />}
            trend={{ value: 9.3, isUp: true, text: "so với tháng trước" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số học viên đăng ký"
            value={errorSummary ? "Lỗi tải" : totalUsers}
            loading={loadingSummary}
            prefix={<UsergroupAddOutlined className="text-blue-500 mr-2" />}
            trend={{ value: 14.2, isUp: true, text: "trong tuần này" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tỷ lệ hoàn thành khóa học"
            value={errorProgress ? "Lỗi tải" : `${completionRate}%`}
            loading={loadingProgress}
            prefix={<CheckCircleOutlined className="text-green-500 mr-2" />}
            trend={{ value: 2.1, isUp: true, text: "tăng tương tác" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tiến độ học tập trung bình"
            value={errorProgress ? "Lỗi tải" : `${avgProgress}%`}
            loading={loadingProgress}
            prefix={<ReadOutlined className="text-indigo-500 mr-2" />}
          />
        </Col>
      </Row>

      {/* Chart Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <div className="flex justify-between items-center flex-wrap gap-2 py-1">
                <span>Phân tích Doanh thu & Tăng trưởng Học viên</span>
                <div className="flex items-center gap-2 print:hidden">
                  <Radio.Group 
                    value={dateRangePreset} 
                    onChange={(e) => setDateRangePreset(e.target.value)}
                    size="small"
                  >
                    <Radio.Button value="7days">7 ngày</Radio.Button>
                    <Radio.Button value="30days">30 ngày</Radio.Button>
                    <Radio.Button value="thisMonth">Tháng này</Radio.Button>
                    <Radio.Button value="thisYear">Năm nay</Radio.Button>
                  </Radio.Group>
                  <CSelect
                    value={groupBy}
                    onChange={(val) => setGroupBy(val as "day" | "month")}
                    size="small"
                    options={[
                      { label: "Theo ngày", value: "day" },
                      { label: "Theo tháng", value: "month" }
                    ]}
                    style={{ width: 110 }}
                  />
                </div>
              </div>
            }
            className="border border-gray-100 rounded-2xl shadow-sm"
          >
            <Show>
              <Show.When isTrue={loadingRevenues || loadingSignups}>
                <div className="flex justify-center items-center h-80"><Spin size="large" /></div>
              </Show.When>
              <Show.Else>
                <Chart options={mainChartOptions} series={mainChartSeries} type="line" height={320} />
              </Show.Else>
            </Show>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="Cơ cấu Doanh thu (Top 5 khóa học)" 
            className="border border-gray-100 rounded-2xl shadow-sm h-full"
          >
            <Show>
              <Show.When isTrue={loadingSales}>
                <div className="flex justify-center items-center h-80"><Spin size="large" /></div>
              </Show.When>
              <Show.Else>
                <div className="flex flex-col justify-between h-80 pt-4">
                  <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={260} />
                </div>
              </Show.Else>
            </Show>
          </Card>
        </Col>
      </Row>

      {/* Tables Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card 
            title="Bảng theo dõi Tiến độ học tập & Đăng ký" 
            extra={<CButton size="small" icon={<DownloadOutlined />} onClick={() => handleExportCSV("progress")}>Tải CSV</CButton>}
            className="border border-gray-100 rounded-2xl shadow-sm"
          >
            <CTable
              dataSource={progressReport || []}
              columns={progressColumns}
              loading={loadingProgress}
              pagination={{ pageSize: 5 }}
              rowKey="courseId"
              size="middle"
              className="border-none"
            />
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card 
            title="Báo cáo Doanh số bán ra từng Khóa học" 
            extra={<CButton size="small" icon={<DownloadOutlined />} onClick={() => handleExportCSV("sales")}>Tải CSV</CButton>}
            className="border border-gray-100 rounded-2xl shadow-sm"
          >
            <CTable
              dataSource={salesData || []}
              columns={salesColumns}
              loading={loadingSales}
              pagination={{ pageSize: 5 }}
              rowKey="courseId"
              size="middle"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Danh sách Hóa đơn giao dịch gần đây" className="border border-gray-100 rounded-2xl shadow-sm">
        <CTable
          dataSource={topOrders || []}
          columns={orderColumns}
          loading={loadingOrders}
          pagination={{ pageSize: 5 }}
          rowKey="id"
          size="middle"
        />
      </Card>
    </div>
  );
};

export default AdminReportPage;
