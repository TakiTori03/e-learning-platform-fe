import { useMutation } from "@tanstack/react-query";
import { App } from "antd";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services";
import type { IRegisterRequest, IRegisterInstructorRequest } from "../types";

// Hook đăng ký tài khoản học viên (Student)
export const useRegister = () => {
  const navigate = useNavigate();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (data: IRegisterRequest) => authApi.register(data),
    onSuccess: () => {
      notification.success({
        message: "Đăng ký thành công!",
        description: "Tài khoản học viên của bạn đã được tạo. Vui lòng đăng nhập.",
      });
      navigate("/login");
    },
    onError: (error: any) => {
      notification.error({
        message: "Đăng ký thất bại",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Đã có lỗi xảy ra vui lòng thử lại sau.",
      });
    },
  });
};

// Hook đăng ký ứng tuyển giảng viên (Instructor)
export const useRegisterInstructor = () => {
  const navigate = useNavigate();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (data: IRegisterInstructorRequest) => authApi.registerInstructor(data),
    onSuccess: () => {
      notification.success({
        message: "Gửi yêu cầu đăng ký thành công!",
        description: "Hồ sơ giảng viên đang chờ duyệt. Vui lòng kiểm tra email sớm nhất từ chúng tôi.",
        duration: 8,
      });
      navigate("/login");
    },
    onError: (error: any) => {
      notification.error({
        message: "Đăng ký thất bại",
        description:
          error?.response?.data?.message ||
          error?.message ||
          "Đã xảy ra lỗi khi tạo yêu cầu ứng tuyển giảng viên.",
      });
    },
  });
};
