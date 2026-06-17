import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout, App } from "antd";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/modules/Auth/services";
import AdminHeader from "./components/AdminHeader";
import AdminSider from "./components/AdminSider";
import ScrollToTopManager from "@/routes/ScrollToTopManager";

const { Content } = Layout;

const AdminLayout: React.FC = () => {
  const { user, logout: clearStore } = useAuthStore();
  const navigate = useNavigate();
  const { notification } = App.useApp();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      clearStore();
      notification.success({
        message: "Đăng xuất thành công",
        description: "Hẹn gặp lại bạn!",
      });
      navigate('/login', { replace: true });
    } catch {
      clearStore();
      navigate('/login', { replace: true });
    }
  };

  if (!user) {
    return null; // Failsafe Guard: Tránh flash giao diện lỗi khi chưa tải xong user hoặc đang logout
  }

  return (
    <Layout style={{ height: "100vh", overflow: "hidden" }}>
      <AdminSider userRole={user?.role || "GUEST"} />
      <Layout style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <AdminHeader
          user={user}
          handleLogout={handleLogout}
        />
        <Content
          style={{
            padding: "24px",
            flex: 1,
            overflowY: "auto",
            background: "#f8fafc",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      {/* Tự động lưu và khôi phục vị trí cuộn cho giao diện Admin */}
      <ScrollToTopManager />
    </Layout>
  );
};

export default React.memo(AdminLayout);
