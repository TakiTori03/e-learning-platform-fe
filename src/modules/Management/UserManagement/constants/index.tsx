import CButton from "@/components/UI/Button";
import { UserRole, UserRoleLabels, UserStatus } from "@/constants/enums";
import type { IUserInfo } from "@/type";
import { formatDate, formatDateTime, formatFullName } from "@/utils/format";
import {
  CheckCircleOutlined,
  StopOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import type { Breakpoint } from "antd";
import { Avatar, Popconfirm, Space, Tag, Tooltip, Typography } from "antd";
import UserStatusTag from "../components/UserStatusTag";

const { Text } = Typography;



// Factory function for User Management table columns
export const getColumnsTableUserManagement = ({
  onChangeRole,
  onToggleStatus,
  updatingStatus,
}: {
  onChangeRole: (record: IUserInfo) => void;
  onToggleStatus: (record: IUserInfo, newStatus: string) => void;
  updatingStatus: boolean;
}) => [
  {
    title: "Thành viên / Người dùng",
    key: "userInfo",
    render: (_: unknown, record: IUserInfo) => (
      <Space size="middle">
        <Avatar src={record.avatar || undefined}>
          {record.lastName?.charAt(0) || record.email?.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex flex-col min-w-0">
          <Text strong className="text-sm truncate leading-tight" style={{ maxWidth: 180 }}>
            {formatFullName(record)}
          </Text>
          <Text type="secondary" className="text-xs truncate" style={{ maxWidth: 180 }}>
            {record.email}
          </Text>
        </div>
      </Space>
    ),
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    responsive: ["sm"] as Breakpoint[],
    render: (phone: string) => phone || <span className="text-gray-300">—</span>,
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    key: "role",
    width: 120,
    render: (role: string) => {
      let tagColor: string | undefined = undefined;
      if (role === UserRole.ADMIN) tagColor = "purple";
      if (role === UserRole.INSTRUCTOR) tagColor = "cyan";
      if (role === UserRole.STUDENT) tagColor = "blue";

      return (
        <Tag
          color={tagColor}
          bordered={false}
          className="rounded-full px-2.5 py-0.5 font-semibold text-[10px] uppercase m-0"
        >
          {UserRoleLabels[role as UserRole] || role}
        </Tag>
      );
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 140,
    render: (status: string) => (
      <UserStatusTag
        status={status}
        className="rounded-full px-2.5 py-0.5 text-[10px] uppercase font-semibold"
      />
    ),
  },
  {
    title: "Ngày đăng ký",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 130,
    responsive: ["md"] as Breakpoint[],
    render: (date: string) =>
      date ? (
        <Text className="text-xs text-gray-500">
          {formatDate(date)}
        </Text>
      ) : (
        <Text className="text-xs text-gray-300">—</Text>
      ),
  },
  {
    title: "Thao tác",
    key: "actions",
    width: 120,
    align: "center" as const,
    render: (_: unknown, record: IUserInfo) => {
      const isLocked = record.status === UserStatus.LOCKED;

      return (
        <Space size="small">
          {/* Change Role Button */}
          <Tooltip title="Đổi vai trò">
            <CButton
              type="text"
              size="small"
              icon={<UserSwitchOutlined />}
              onClick={() => onChangeRole(record)}
              className="hover:text-blue-500"
            />
          </Tooltip>

          {/* Toggle Lock / Unlock Account */}
          {isLocked ? (
            <Popconfirm
              title="Mở khóa tài khoản?"
              description={`Bạn có chắc muốn mở khóa cho tài khoản "${record.email}"?`}
              onConfirm={() => onToggleStatus(record, UserStatus.ACTIVE)}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ loading: updatingStatus }}
            >
              <Tooltip title="Mở khóa">
                <CButton
                  type="text"
                  size="small"
                  icon={<CheckCircleOutlined className="text-green-500" />}
                />
              </Tooltip>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Khóa tài khoản này?"
              description={`Tài khoản "${record.email}" sẽ không thể đăng nhập cho tới khi được mở khóa.`}
              onConfirm={() => onToggleStatus(record, UserStatus.LOCKED)}
              okButtonProps={{ danger: true, loading: updatingStatus }}
              okText="Khóa"
              cancelText="Hủy"
            >
              <Tooltip title="Khóa tài khoản">
                <CButton
                  type="text"
                  size="small"
                  icon={<StopOutlined className="text-red-500" />}
                  danger
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      );
    },
  },
];

// Factory function for Instructor Review table columns
import { Check, X } from "lucide-react";

export const getColumnsTableInstructorReview = ({
  onApprove,
  onReject,
  approving,
  rejecting,
}: {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  approving: boolean;
  rejecting: boolean;
}) => [
  {
    title: "Ứng cử viên giảng viên",
    key: "instructor",
    render: (_: unknown, record: IUserInfo) => (
      <Space size="middle">
        <Avatar src={record.avatar || undefined}>
          {record.lastName?.charAt(0) || record.email?.charAt(0).toUpperCase()}
        </Avatar>
        <div className="flex flex-col min-w-0">
          <Text strong className="text-sm truncate leading-tight" style={{ maxWidth: 200 }}>
            {formatFullName(record)}
          </Text>
          <Text type="secondary" className="text-xs truncate" style={{ maxWidth: 200 }}>
            {record.email}
          </Text>
        </div>
      </Space>
    ),
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    key: "phone",
    responsive: ["sm"] as Breakpoint[],
    render: (phone: string) => phone || <span className="text-gray-300">—</span>,
  },
  {
    title: "Ngày gửi yêu cầu",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 170,
    responsive: ["md"] as Breakpoint[],
    render: (date: string) =>
      date ? (
        <Text className="text-xs text-gray-500">
          {formatDateTime(date)}
        </Text>
      ) : (
        <Text className="text-xs text-gray-300">—</Text>
      ),
  },
  {
    title: "Trạng thái hồ sơ",
    key: "status",
    width: 140,
    render: () => (
      <UserStatusTag
        status={UserStatus.PENDING}
        className="rounded-full px-2.5 py-0.5 text-[10px] uppercase font-semibold"
      />
    ),
  },
  {
    title: "Xét duyệt",
    key: "actions",
    width: 220,
    align: "center" as const,
    render: (_: unknown, record: IUserInfo) => (
      <Space size="small">
        {/* Approve Button */}
        <Popconfirm
          title="Duyệt giảng viên này?"
          description="Tài khoản giảng viên sẽ được kích hoạt hoạt động và gửi thông báo qua email."
          onConfirm={() => onApprove(record.id)}
          okText="Duyệt"
          cancelText="Hủy"
          okButtonProps={{ loading: approving }}
        >
          <CButton
            type="primary"
            size="small"
            icon={<Check className="w-4 h-4" />}
            className="bg-green-600 hover:bg-green-700 border-0 rounded-lg flex items-center"
          >
            Duyệt hồ sơ
          </CButton>
        </Popconfirm>

        {/* Reject Button */}
        <Popconfirm
          title="Từ chối hồ sơ này?"
          description="Ứng viên sẽ bị chuyển về trạng thái Không hoạt động."
          onConfirm={() => onReject(record.id)}
          okButtonProps={{ danger: true, loading: rejecting }}
          okText="Từ chối"
          cancelText="Hủy"
        >
          <CButton
            type="default"
            danger
            size="small"
            icon={<X className="w-4 h-4" />}
            className="rounded-lg flex items-center"
          >
            Từ chối
          </CButton>
        </Popconfirm>
      </Space>
    ),
  },
];
