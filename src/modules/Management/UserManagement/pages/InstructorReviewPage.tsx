import React, { useState, useMemo, useCallback } from "react";
import { Card, Row, Col, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Briefcase, FileText } from "lucide-react";
import type { IUserInfo } from "@/type";

// UI Wrappers & Template Components
import CInput from "@/components/UI/Input";
import CTable from "@/components/UI/Table";
import PageHeader from "@/components/UI/PageHeader";
import { TotalTableMessage } from "@/components/UI/Template";

// Hooks, Constants & Store
import { useAdminUsers, useApproveInstructor, useUpdateUserStatus } from "../queryHooks";
import { getColumnsTableInstructorReview } from "../constants";
import { UserRole, UserStatus } from "@/constants/enums";

const { Text, Paragraph } = Typography;

export const InstructorReviewPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");

  // Fetch queries and mutations
  const { data: usersData, isLoading: loadingUsers } = useAdminUsers(
    page,
    size,
    search || undefined,
    UserRole.INSTRUCTOR,
    UserStatus.PENDING
  );
  const { mutate: approveInstructor, isPending: approving } = useApproveInstructor();
  const { mutate: rejectInstructor, isPending: rejecting } = useUpdateUserStatus();

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
  }, []);

  const handleApprove = useCallback((id: string) => {
    approveInstructor(id);
  }, [approveInstructor]);

  const handleReject = useCallback((id: string) => {
    rejectInstructor({ id, status: UserStatus.REJECTED });
  }, [rejectInstructor]);

  // Decoupled Table Columns (Rule 5)
  const columns = useMemo(
    () =>
      getColumnsTableInstructorReview({
        onApprove: handleApprove,
        onReject: handleReject,
        approving,
        rejecting,
      }),
    [handleApprove, handleReject, approving, rejecting]
  );

  const renderExpandedRow = useCallback((record: IUserInfo) => (
    <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100/50 space-y-4">
      <Row gutter={[24, 16]}>
        <Col xs={24} md={8}>
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" /> Headline chuyên môn
            </span>
            <div className="bg-white p-3 rounded-lg border border-gray-200/60">
              <Text strong className="text-gray-800 text-sm">
                {record.headline || "Chưa cập nhật"}
              </Text>
            </div>
          </div>
        </Col>
        <Col xs={24} md={16}>
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Tiểu sử tự thuật (Biography)
            </span>
            <div className="bg-white p-3 rounded-lg border border-gray-200/60">
              <Paragraph className="text-gray-700 text-sm mb-0 leading-relaxed">
                {record.biography || "Chưa cập nhật tiểu sử giảng dạy."}
              </Paragraph>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  ), []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Duyệt hồ sơ giảng viên"
        subtitle="Xem xét thông tin chuyên môn, tiểu sử tự thuật và xét duyệt các giảng viên ứng tuyển mới"
      />

      {/* Filter Bar */}
      <Card className="border border-gray-100 rounded-xl shadow-sm" styles={{ body: { padding: "16px" } }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={10} lg={8}>
            <CInput
              id="search"
              placeholder="Tìm kiếm ứng viên theo Tên hoặc Email..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={handleSearchChange}
              style={{
                height: "38px",
                borderRadius: "8px",
              }}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      {/* Table Card */}
      <Card className="border border-gray-100 rounded-xl shadow-sm" styles={{ body: { padding: 0 } }}>
        <CTable
          dataSource={usersData?.content || []}
          columns={columns}
          rowKey="id"
          loading={loadingUsers || approving || rejecting}
          pagination={{
            current: page,
            pageSize: size,
            total: usersData?.totalElements || 0,
            onChange: handlePageChange,
            showTotal: TotalTableMessage,
            showSizeChanger: false,
          }}
          expandable={{
            expandedRowRender: renderExpandedRow,
            rowExpandable: () => true,
          }}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
};

export default InstructorReviewPage;
