import * as z from "zod";

export const studentRegisterSchema = z
  .object({
    firstName: z.string().min(1, "Vui lòng nhập họ!"),
    lastName: z.string().min(1, "Vui lòng nhập tên!"),
    email: z
      .string()
      .min(1, "Vui lòng nhập email!")
      .email("Email không hợp lệ!"),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự!"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp!",
    path: ["confirmPassword"],
  });

export const instructorRegisterSchema = z
  .object({
    firstName: z.string().min(1, "Vui lòng nhập họ!"),
    lastName: z.string().min(1, "Vui lòng nhập tên!"),
    email: z
      .string()
      .min(1, "Vui lòng nhập email!")
      .email("Email không hợp lệ!"),
    headline: z.string().min(1, "Vui lòng nhập tiêu đề chuyên môn!"),
    biography: z.string().min(1, "Vui lòng nhập tiểu sử giảng dạy!"),
    password: z.string().min(6, "Mật khẩu phải từ 6 ký tự!"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu!"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp!",
    path: ["confirmPassword"],
  });
