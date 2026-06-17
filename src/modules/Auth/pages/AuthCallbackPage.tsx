import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";
import { useAuthStore } from "@/store/useAuthStore";
import { pathRoutes } from "@/constants/routes";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      if (isAuth && user) {
        const role = user.role || "";
        if (role === "ADMIN") {
          navigate(pathRoutes.admin.dashboard, { replace: true });
        } else if (role === "INSTRUCTOR") {
          navigate(pathRoutes.instructor.welcome, { replace: true });
        } else {
          navigate(pathRoutes.home, { replace: true });
        }
      } else {
        // Nếu không xác thực thành công (lỗi session/keycloak), đẩy về login
        navigate("/login", { replace: true });
      }
    }
  }, [isLoading, isAuth, user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-4 bg-slate-50">
      <Spin size="large" />
      <p className="text-slate-500 font-medium text-sm">
        Đang xác thực tài khoản và chuyển hướng...
      </p>
    </div>
  );
};

export default AuthCallbackPage;
