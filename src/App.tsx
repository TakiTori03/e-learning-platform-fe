import React, { memo, useEffect, useMemo } from "react";
import { ThemeProvider } from "styled-components";
import { ConfigProvider, Spin, App as AntdApp } from "antd";

// Cập nhật đường dẫn chuẩn theo cấu trúc mới
import { theme } from "@/configs/theme";
import { useAuthStore } from "@/store/useAuthStore";
import { authApi } from "@/modules/Auth/services";
import { AppRoutes } from "@/routes";

function App() {
  const configTheme = useMemo(
    () => ({
      token: {
        fontFamily: "Inter, system-ui, sans-serif",
        colorPrimary: theme.primary,
      },
    }),
    []
  );

  const setUser = useAuthStore((state) => state.setUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Khôi phục phiên đăng nhập khi F5
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await authApi.getMe();
        setUser(response);
      } catch {
        setUser(null);
      }
    };
    initAuth();
  }, [setUser]);

  // Reload trang khi gặp lỗi preload dynamic import của Vite
  useEffect(() => {
    const handlePreloadError = () => {
      window.location.reload();
    };
    window.addEventListener("vite:preloadError", handlePreloadError);
    return () => {
      window.removeEventListener("vite:preloadError", handlePreloadError);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen gap-4 bg-gray-50">
        <Spin size="large" />
        <p className="text-gray-500 font-medium">Đang chuẩn bị dữ liệu...</p>
      </div>
    );
  }

  const StyledThemeProvider = ThemeProvider as React.ComponentType<any>;

  return (
    <StyledThemeProvider theme={theme}>
      <ConfigProvider theme={configTheme}>
        <AntdApp>
          <AppRoutes />
        </AntdApp>
      </ConfigProvider>
    </StyledThemeProvider>
  );
}

export default memo(App);
