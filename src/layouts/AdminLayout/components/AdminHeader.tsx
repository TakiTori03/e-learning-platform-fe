import { pathRoutes } from "@/constants/routes";
import { useConfigStore } from "@/store/useConfigStore";
import type { IUserInfo } from "@/type";
import { formatFullName } from "@/utils/format";
import {
  AppstoreOutlined,
  BellOutlined,
  BookOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Breadcrumb, Button, Card, Dropdown, Layout, Menu, Space, Tag, Tooltip, Typography } from "antd";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SidebarItem } from "./menuConfig";
import { sidebarItems } from "./menuConfig";

const { Header } = Layout;
const { Text } = Typography;

interface AdminHeaderProps {
  user: IUserInfo | null;
  handleLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsedMenu = useConfigStore((state) => state.collapsedMenu);
  const toggleCollapsedMenu = useConfigStore((state) => state.toggleCollapsedMenu);

  const breadcrumbItems = React.useMemo(() => {
    const currentPath = location.pathname;
    const items = [{ title: "Hệ thống" }];

    const findTrail = (itemsList: SidebarItem[], parentLabel?: string): boolean => {
      for (const item of itemsList) {
        if (item.children) {
          if (findTrail(item.children, item.label)) {
            return true;
          }
        } else {
          const matches = item.activePatterns?.some((pattern) => {
            if (pattern.endsWith("/")) {
              return currentPath.startsWith(pattern);
            }
            return currentPath === pattern;
          });
          if (matches) {
            if (parentLabel) {
              items.push({ title: parentLabel });
            }
            items.push({ title: item.label });
            if (currentPath.startsWith("/author/courses/") || currentPath.startsWith("/admin/courses/")) {
              items.push({ title: "Giáo trình khóa học" });
            }
            return true;
          }
        }
      }
      return false;
    };

    findTrail(sidebarItems);
    return items;
  }, [location.pathname]);

  const notificationMenu = React.useMemo(() => (
    <Card
      className="shadow-xl border border-gray-100 rounded-xl"
      style={{ width: 320 }}
      styles={{ body: { padding: "12px" } }}
    >
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
        <span className="font-bold text-gray-800 text-sm">Thông báo mới</span>
        <Tag color="blue" className="rounded-full">3 mới</Tag>
      </div>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        <div className="flex gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <Badge status="processing" className="mt-1" />
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-gray-800">Đơn hàng mới chờ duyệt</span>
            <span className="text-gray-400 mt-0.5">Học viên Văn An vừa mua khóa học ReactJS</span>
          </div>
        </div>
        <div className="flex gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <Badge status="warning" className="mt-1" />
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-gray-800">Yêu cầu giảng viên mới</span>
            <span className="text-gray-400 mt-0.5">Minh Hoàng đã nộp hồ sơ xét duyệt</span>
          </div>
        </div>
        <div className="flex gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
          <Badge status="default" className="mt-1" />
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-gray-800">Góp ý từ người dùng</span>
            <span className="text-gray-400 mt-0.5">Về lỗi kết nối thanh toán VNPAY</span>
          </div>
        </div>
      </div>
    </Card>
  ), []);

  const quickActionsMenu = React.useMemo(() => {
    const items = [];
    if (user?.role === "INSTRUCTOR") {
      items.push({
        key: "add_course",
        icon: <BookOutlined />,
        label: "Thêm khóa học mới",
        onClick: () => navigate(pathRoutes.instructor.courses),
      });
    }
    if (user?.role === "ADMIN") {
      items.push({
        key: "add_category",
        icon: <AppstoreOutlined />,
        label: "Thêm danh mục",
        onClick: () => navigate(pathRoutes.admin.categories),
      });
    }
    items.push({
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt tài khoản",
      onClick: () => navigate(user?.role === "ADMIN" ? pathRoutes.admin.settings : pathRoutes.instructor.settings),
    });

    return (
      <Menu
        className="shadow-lg border border-gray-100 rounded-xl p-1"
        items={items}
      />
    );
  }, [navigate, user]);

  return (
    <Header className="bg-white px-4 md:px-6 flex items-center justify-between shadow-sm h-16">
      <div className="flex items-center gap-4 min-w-0">
        {collapsedMenu ? (
          <MenuUnfoldOutlined
            className="text-lg cursor-pointer hover:text-blue-600 transition-colors flex-shrink-0"
            onClick={toggleCollapsedMenu}
          />
        ) : (
          <MenuFoldOutlined
            className="text-lg cursor-pointer hover:text-blue-600 transition-colors flex-shrink-0"
            onClick={toggleCollapsedMenu}
          />
        )}

        <Breadcrumb
          items={breadcrumbItems}
          className="hidden lg:flex text-xs text-gray-500 font-medium whitespace-nowrap"
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
        {/* Quick Actions Dropdown */}
        <Dropdown popupRender={() => quickActionsMenu} placement="bottomRight" trigger={["click"]}>
          <Tooltip title="Thao tác nhanh">
            <Button
              type="text"
              shape="circle"
              icon={<PlusOutlined className="text-gray-500" />}
              className="hover:bg-gray-100 flex items-center justify-center h-9 w-9"
            />
          </Tooltip>
        </Dropdown>

        {/* Notification Dropdown */}
        <Dropdown popupRender={() => notificationMenu} placement="bottomRight" trigger={["click"]}>
          <Tooltip title="Thông báo">
            <Badge count={3} size="small" offset={[-2, 2]}>
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined className="text-gray-500 text-lg" />}
                className="hover:bg-gray-100 flex items-center justify-center h-9 w-9"
              />
            </Badge>
          </Tooltip>
        </Dropdown>

        {/* User Profile */}
        <Space
          className="flex border-l border-gray-100 pl-2 sm:pl-4 py-1 cursor-pointer hover:opacity-80 transition-all shrink-0 whitespace-nowrap"
          onClick={() => navigate(user?.role === "ADMIN" ? pathRoutes.admin.settings : pathRoutes.instructor.settings)}
        >
          <Avatar
            icon={<UserOutlined />}
            src={user?.avatar}
            className="border border-gray-200 flex-shrink-0"
          />
          <div className="hidden md:flex flex-col leading-tight shrink-0 whitespace-nowrap">
            <Text strong className="text-sm text-gray-800 whitespace-nowrap">
              {formatFullName(user)}
            </Text>
            <Text type="secondary" className="text-[10px] uppercase font-bold text-gray-400 whitespace-nowrap">
              {user?.role}
            </Text>
          </div>
        </Space>

        <Button
          type="text"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="flex items-center font-medium rounded-lg h-9 hover:bg-red-50 px-2 sm:px-3 shrink-0 whitespace-nowrap"
        >
          <span className="hidden sm:inline">Đăng xuất</span>
        </Button>
      </div>
    </Header>
  );
};

export default React.memo(AdminHeader);
