import React, { memo } from "react";
import { Form, Divider } from "antd";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type * as z from "zod";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { useRegister } from "../queryHooks";
import { studentRegisterSchema } from "../constants";

// Common UI Components
import CInput, { CInputPassword } from "@/components/UI/Input";
import CButton from "@/components/UI/Button";

type RegisterFormData = z.infer<typeof studentRegisterSchema>;

const RegisterPage: React.FC = () => {
  const { mutate: register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    register(data);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen w-full overflow-hidden bg-gray-50">
      {/* CỘT TRÁI: Giao diện nội dung thông tin thương hiệu */}
      <div className="hidden md:flex md:col-span-6 lg:col-span-7 xl:col-span-8 bg-gradient-to-b from-[#0575e6] via-[#02298a] to-[#021b79] text-white flex-col justify-center relative overflow-hidden">
        <div className="pl-[15%] pr-[10%] xl:pl-[20%] xl:pr-[15%] z-10">
          <h1 className="text-5xl xl:text-6xl font-bold tracking-tight mb-4 text-white flex items-center gap-3">
            <BookOpen className="w-12 h-12 xl:w-16 xl:h-16 text-white" />
            E-Learning
          </h1>
          <p className="text-lg xl:text-xl font-light mb-8 text-white/90 leading-relaxed max-w-md">
            Learn, grow, and succeed with our interactive online courses.
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
            <span>Read More</span>
          </CButton>
        </div>

        {/* Các hình tròn trang trí */}
        <div className="w-[557px] h-[557px] border border-[#0575e6]/40 rounded-full absolute bottom-0 left-0 -translate-x-[37%] translate-y-[48%]" />
        <div className="w-[557px] h-[557px] border border-[#0575e6]/40 rounded-full absolute bottom-0 left-0 -translate-x-[23%] translate-y-[54%]" />
      </div>

      {/* CỘT PHẢI: Giao diện Đăng ký */}
      <div className="col-span-12 md:col-span-6 lg:col-span-5 xl:col-span-4 flex items-center justify-center px-4 sm:px-8 md:px-4 lg:px-8 xl:px-12 bg-gray-50 py-12 relative">
        <div className="w-full max-w-[420px] bg-white p-8 rounded-3xl shadow-xl border border-gray-100 z-10">
          <div className="mb-6 text-left">
            <h2 className="text-3xl font-extrabold text-[#222] mb-1 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-[#0575e6]" /> Create Account
            </h2>
            <p className="text-sm text-gray-500">
              Đăng ký tài khoản Học viên mới
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Họ & Tên */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Họ</span>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors.firstName ? "error" : ""}
                      help={errors.firstName?.message}
                      className="mb-0"
                    >
                      <CInput
                        {...field}
                        prefix={<User size={16} className="text-gray-400 mr-1" />}
                        placeholder="Nguyễn"
                        style={{
                          height: "50px",
                          borderRadius: "12px",
                          fontSize: "14px",
                        }}
                        className="border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                      />
                    </Form.Item>
                  )}
                />
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Tên</span>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <Form.Item
                      validateStatus={errors.lastName ? "error" : ""}
                      help={errors.lastName?.message}
                      className="mb-0"
                    >
                      <CInput
                        {...field}
                        placeholder="Văn An"
                        style={{
                          height: "50px",
                          borderRadius: "12px",
                          fontSize: "14px",
                        }}
                        className="border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                      />
                    </Form.Item>
                  )}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Email</span>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    validateStatus={errors.email ? "error" : ""}
                    help={errors.email?.message}
                    className="mb-0"
                  >
                    <CInput
                      {...field}
                      prefix={<Mail size={16} className="text-gray-400 mr-2" />}
                      placeholder="example@email.com"
                      style={{
                        height: "50px",
                        borderRadius: "12px",
                        fontSize: "14px",
                      }}
                      className="border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    />
                  </Form.Item>
                )}
              />
            </div>

            {/* Password */}
            <div>
              <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Mật khẩu</span>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    validateStatus={errors.password ? "error" : ""}
                    help={errors.password?.message}
                    className="mb-0"
                  >
                    <CInputPassword
                      {...field}
                      prefix={<Lock size={16} className="text-gray-400 mr-2" />}
                      placeholder="••••••••"
                      style={{
                        height: "50px",
                        borderRadius: "12px",
                        fontSize: "14px",
                      }}
                      className="border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    />
                  </Form.Item>
                )}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <span className="text-xs font-semibold text-gray-500 mb-1 block uppercase tracking-wider">Xác nhận mật khẩu</span>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <Form.Item
                    validateStatus={errors.confirmPassword ? "error" : ""}
                    help={errors.confirmPassword?.message}
                    className="mb-0"
                  >
                    <CInputPassword
                      {...field}
                      prefix={<ShieldCheck size={16} className="text-gray-400 mr-2" />}
                      placeholder="••••••••"
                      style={{
                        height: "50px",
                        borderRadius: "12px",
                        fontSize: "14px",
                      }}
                      className="border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                    />
                  </Form.Item>
                )}
              />
            </div>

            <div className="pt-3">
              <CButton
                type="primary"
                htmlType="submit"
                loading={isPending}
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
                Đăng ký tài khoản
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </CButton>
            </div>

            <Divider className="my-5">
              <span className="text-gray-400 text-xs uppercase tracking-widest font-semibold">
                Đã có tài khoản?
              </span>
            </Divider>

            <div className="text-center text-sm text-gray-500 flex flex-col gap-3">
              <div>
                Đã có tài khoản học viên?{" "}
                <Link
                  to="/login"
                  className="text-[#0575e6] font-bold hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-3 mt-1">
                Bạn muốn làm giảng viên?{" "}
                <Link
                  to="/author-signup"
                  className="text-gray-600 font-bold hover:text-[#0575e6] hover:underline"
                >
                  Đăng ký giảng dạy
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(RegisterPage);
