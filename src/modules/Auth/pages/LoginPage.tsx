import React, { useEffect, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Key, ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import CButton from "@/components/UI/Button";
import { Divider } from "antd";
import { pathRoutes } from "@/constants/routes";

const LoginPage: React.FC = () => {
  const { isAuth, user } = useAuthStore();
  const navigate = useNavigate();

  // Tự động điều hướng theo Role sau khi đăng nhập thành công từ Keycloak
  useEffect(() => {
    if (isAuth && user) {
      const role = user.role || "";
      if (role === "ADMIN") {
        navigate(pathRoutes.admin.dashboard, { replace: true });
      } else if (role === "INSTRUCTOR") {
        navigate(pathRoutes.instructor.welcome, { replace: true });
      } else {
        navigate(pathRoutes.home, { replace: true });
      }
    }
  }, [isAuth, user, navigate]);

  const handleLogin = () => {
    // Chuyển hướng tới Gateway để đăng nhập qua Keycloak
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8080"}/oauth2/authorization/keycloak`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen w-full overflow-hidden bg-gray-50">
      {/* CỘT TRÁI: Giao diện nội dung thông tin thương hiệu */}
      <div className="hidden md:flex md:col-span-6 lg:col-span-7 xl:col-span-8 bg-gradient-to-b from-[#0575e6] via-[#02298a] to-[#021b79] text-white flex-col justify-center relative overflow-hidden">
        <div className="pl-[15%] pr-[10%] xl:pl-[20%] xl:pr-[15%] z-10">
          <h1 className="text-5xl xl:text-6xl font-bold tracking-tight mb-4 text-white flex items-center gap-3">
            <BookOpen className="w-12 h-12 xl:w-16 xl:h-16 text-white" />
            E-Learning Portal
          </h1>
          <p className="text-lg xl:text-xl font-light mb-8 text-white/90 leading-relaxed max-w-md">
            Learn, teach, and manage online education on our unified platform.
          </p>
          <CButton
            type="primary"
            style={{
              height: "46px",
              borderRadius: "23px",
              backgroundColor: "#0575e6",
              color: "#ffffff",
              border: "none",
              fontWeight: 500,
              fontSize: "14px",
            }}
            className="px-8 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center"
          >
            <span>Explore Platform</span>
          </CButton>
        </div>

        {/* Các hình tròn trang trí */}
        <div className="w-[557px] h-[557px] border border-[#0575e6]/40 rounded-full absolute bottom-0 left-0 -translate-x-[37%] translate-y-[48%]" />
        <div className="w-[557px] h-[557px] border border-[#0575e6]/40 rounded-full absolute bottom-0 left-0 -translate-x-[23%] translate-y-[54%]" />
      </div>

      {/* CỘT PHẢI: Giao diện Đăng nhập */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4 flex items-center justify-center px-4 sm:px-8 md:px-4 lg:px-8 xl:px-12 bg-gray-50 py-12 relative">
        <div className="w-full max-w-[400px] bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-gray-100 animate-fade-in z-10">
          <div className="mb-8 text-left">
            <h2 className="text-3xl font-extrabold text-[#222] mb-1 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-[#0575e6]" /> Single Sign-On
            </h2>
            <p className="text-sm text-gray-500">
              Đăng nhập cổng dùng chung hệ thống
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center py-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 px-4">
              <p className="text-sm text-gray-600 mb-0">
                Chào mừng bạn đến với E-Learning. Vui lòng đăng nhập qua tài khoản Keycloak dùng chung (dành cho Học viên, Giảng viên và Quản trị viên).
              </p>
            </div>

            <CButton
              type="primary"
              onClick={handleLogin}
              style={{
                height: "50px",
                borderRadius: "12px",
                backgroundColor: "#0575e6",
                color: "#ffffff",
                border: "none",
                fontWeight: "bold",
                fontSize: "14px",
              }}
              className="w-full transition-colors shadow-md flex items-center justify-center gap-2 group"
            >
              <Key className="w-4 h-4" />
              Đăng nhập qua Keycloak
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </CButton>

            <Divider className="my-5">
              <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                Đăng ký tài khoản mới
              </span>
            </Divider>

            <div className="text-center text-sm text-gray-500 flex flex-col gap-3">
              <div>
                Đăng ký tài khoản học tập?{" "}
                <Link
                  to="/register"
                  className="text-[#0575e6] font-bold hover:underline"
                >
                  Đăng ký Học viên
                </Link>
              </div>
              
              <div className="border-t border-gray-100 pt-3 mt-1">
                Đăng ký giảng dạy?{" "}
                <Link
                  to="/author-signup"
                  className="text-gray-600 font-bold hover:text-[#0575e6] hover:underline"
                >
                  Đăng ký Giảng viên
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(LoginPage);
