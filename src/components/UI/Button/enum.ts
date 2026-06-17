export const TypeSizeCustom = {
  Medium: "medium", // Dùng chữ thường chuẩn CSS/JS
  Small: "small",
} as const;

export type TypeSizeCustom = typeof TypeSizeCustom[keyof typeof TypeSizeCustom];

export const TypeCustom = {
  Primary: "primary",      // Đại diện cho các nút hành động chính (Ví dụ: "Học ngay", "Mua khóa học", "Thanh toán")
  Secondary: "secondary",  // Nút phụ (Ví dụ: "Xem thử", "Thêm vào giỏ hàng")
  Action: "outline",       // Thay chữ "Action" bằng giá trị "outline" (Ví dụ: "Lưu bản nháp", "Hủy bỏ")
  DANGER: "danger",        // Nút cảnh báo (Ví dụ: "Xóa khóa học", "Hủy đăng ký")
} as const;

export type TypeCustom = typeof TypeCustom[keyof typeof TypeCustom];
