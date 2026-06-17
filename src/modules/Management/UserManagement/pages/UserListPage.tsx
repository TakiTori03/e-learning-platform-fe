import React, { useState, useMemo, useCallback } from "react";
import { Card, Row, Col } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { IUserInfo } from "@/type";

// UI Wrappers & Template Components
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";
import CTable from "@/components/UI/Table";
import PageHeader from "@/components/UI/PageHeader";
import { TotalTableMessage } from "@/components/UI/Template";
import RoleAssignModal from "../components/RoleAssignModal";

// Hooks, Constants & Store
import { useAdminUsers, useUpdateUserStatus } from "../queryHooks";
import { getColumnsTableUserManagement } from "../constants";
import { useLocalStore } from "../store/useLocalStore";
import { UserRole, UserRoleLabels, UserStatus, UserStatusLabels, ActionsType } from "@/constants/enums";

export const UserListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  // Zustand Local Store
  const { setActionMode, setSelectedUser } = useLocalStore();

  // React Query queries and mutations
  const { data: usersData, isLoading: loadingUsers } = useAdminUsers(
    page,
    size,
    search || undefined,
    roleFilter,
    statusFilter
  );
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateUserStatus();

  // Decoupled Table Columns (Rule 5)
  const columns = useMemo(
    () =>
      getColumnsTableUserManagement({
        onChangeRole: (record: IUserInfo) => {
          setSelectedUser(record);
          setActionMode(ActionsType.UPDATE);
        },
        onToggleStatus: (record: IUserInfo, newStatus: string) => {
          updateStatus({ id: record.id, status: newStatus });
        },
        updatingStatus,
      }),
    [setSelectedUser, setActionMode, updateStatus, updatingStatus]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleRoleFilterChange = useCallback((value: string | undefined) => {
    setRoleFilter(value);
    setPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string | undefined) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((p: number) => {
    setPage(p);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Danh sách người dùng"
        subtitle="Quản lý vai trò, trạng thái kích hoạt hoặc khóa tài khoản của học viên & giảng viên"
      />

      {/* Filter Bar */}
      <Card className="border border-gray-100 rounded-xl shadow-sm" styles={{ body: { padding: "16px" } }}>
        <Row gutter={[16, 16]} align="middle">
          {/* Search bar */}
          <Col xs={24} md={10} lg={8}>
            <CInput
              id="search"
              placeholder="Tìm kiếm theo Tên hoặc Email..."
              prefix={<SearchOutlined className="text-gray-400" />}
              onChange={handleSearchChange}
              style={{
                height: "38px",
                borderRadius: "8px",
              }}
              allowClear
            />
          </Col>

          {/* Role Filter */}
          <Col xs={12} md={5} lg={4}>
            <CSelect
              id="roleFilter"
              placeholder="Chọn vai trò"
              value={roleFilter}
              onChange={handleRoleFilterChange}
              style={{ width: "100%", height: "38px" }}
              allowClear
              options={Object.values(UserRole).map((role) => ({
                value: role,
                label: UserRoleLabels[role as UserRole],
              }))}
            />
          </Col>

          {/* Status Filter */}
          <Col xs={12} md={5} lg={4}>
            <CSelect
              id="statusFilter"
              placeholder="Chọn trạng thái"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              style={{ width: "100%", height: "38px" }}
              allowClear
              options={Object.values(UserStatus).map((status) => ({
                value: status,
                label: UserStatusLabels[status as UserStatus],
              }))}
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
          loading={loadingUsers || updatingStatus}
          pagination={{
            current: page,
            pageSize: size,
            total: usersData?.totalElements || 0,
            onChange: handlePageChange,
            showTotal: TotalTableMessage,
            showSizeChanger: false,
          }}
          className="custom-table"
          scroll={{ x: "max-content" }}
        />
      </Card>

      {/* Role Assignment Modal (CModal Wrapper inside) */}
      <RoleAssignModal />
    </div>
  );
};

export default UserListPage;
