import React, { useMemo } from "react";
import { Row, Col, Space, Typography, Spin, Alert, Card, Badge, Avatar } from "antd";
import {
  UsergroupAddOutlined,
  EyeOutlined,
  StarOutlined,
  BookOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useAuthorReport } from "../../hooks/useAdminReport";
import { useInstructorCourses } from "@/modules/Management/CourseManagement/queryHooks/useCourseHooks";
import StatCard from "../../components/StatCard";
import PageHeader from "@/components/UI/PageHeader";
import CButton from "@/components/UI/Button";
import CTable from "@/components/UI/Table";
import { Show } from "@/components/UI/Template";
import { getColumnsTablePerformance } from "../../constants";
import { useAuthStore } from "@/store/useAuthStore";

const { Title, Text } = Typography;

const InstructorReportPage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  
  // React Query Hooks
  const {
    data: authorReport,
    isLoading: loadingReport,
    isError: errorReport,
    refetch: refetchReport
  } = useAuthorReport(user?.id);

  const {
    data: courseListResponse,
    isLoading: loadingCourses,
    isError: errorCourses,
    refetch: refetchCourses
  } = useInstructorCourses(1, 50); // Get top 50 courses of this instructor

  const courses = courseListResponse?.content || [];

  // Exporters
  const handleExportCSV = () => {
    if (courses.length === 0) return;
    
    const exportData = courses.map((c: any) => ({
      "Tên khóa học": c.name,
      "Lượt xem": c.views || 0,
      "Số học viên": c.studentCount || 0,
      "Đánh giá trung bình": c.avgRatingStars || 0,
      "Số bài học": c.lessonCount || 0,
      "Trạng thái": c.status || "DRAFT"
    }));

    const headers = Object.keys(exportData[0]);
    const rows = exportData.map((row: any) => 
      headers.map((header: string) => {
        const val = row[header];
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      }).join(",")
    );
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bao-cao-hieu-suat-giang-day.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Performance Table Columns
  const performanceColumns = useMemo(() => getColumnsTablePerformance(), []);

  const hasAnyError = errorReport || errorCourses;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <PageHeader
          title="Báo cáo Giảng dạy & Hiệu suất"
          subtitle="Theo dõi chỉ số tăng trưởng học viên, đánh giá và hiệu năng của các khóa học của bạn."
        />
        <CButton icon={<DownloadOutlined />} onClick={handleExportCSV} disabled={courses.length === 0}>
          Xuất báo cáo (CSV)
        </CButton>
      </div>

      <Show>
        <Show.When isTrue={hasAnyError}>
          <Alert
            message="Lỗi kết nối dữ liệu"
            description="Có lỗi khi đồng bộ báo cáo từ hệ thống. Vui lòng bấm nút tải lại."
            type="warning"
            showIcon
            action={
              <CButton size="small" type="primary" icon={<ReloadOutlined />} onClick={() => {
                refetchReport();
                refetchCourses();
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
            title="Số lượng đăng ký"
            value={loadingReport ? 0 : authorReport?.studentCount || 0}
            loading={loadingReport}
            prefix={<UsergroupAddOutlined className="text-blue-500 mr-2" />}
            trend={{ value: 11.5, isUp: true, text: "tăng trưởng tuần này" }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Lượt xem bài giảng"
            value={loadingReport ? 0 : authorReport?.totalViews || 0}
            loading={loadingReport}
            prefix={<EyeOutlined className="text-indigo-500 mr-2" />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Đánh giá trung bình"
            value={loadingReport ? "0.0" : authorReport?.averageRating ? authorReport.averageRating.toFixed(1) : "0.0"}
            suffix="/ 5.0★"
            loading={loadingReport}
            prefix={<StarOutlined className="text-yellow-500 mr-2" />}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số khóa học"
            value={loadingReport ? 0 : authorReport?.totalCourses || 0}
            loading={loadingReport}
            prefix={<BookOutlined className="text-amber-500 mr-2" />}
          />
        </Col>
      </Row>

      {/* Courses Performance Table */}
      <Card title="Hiệu suất chi tiết từng Khóa học" className="border border-gray-100 rounded-2xl shadow-sm">
        <CTable
          dataSource={courses}
          columns={performanceColumns}
          loading={loadingCourses}
          pagination={{ pageSize: 5 }}
          rowKey="id"
          size="middle"
        />
      </Card>
    </div>
  );
};

export default InstructorReportPage;
