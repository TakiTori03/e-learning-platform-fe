import { create } from "zustand";

/**
 * ThemesType định nghĩa hệ thống Design Tokens màu sắc cho nền tảng E-Learning.
 * Sử dụng bảng màu hiện đại, hài hòa giữa xanh học tập (Royal Blue) và xám Slate cao cấp.
 */
export interface ThemesType {
  // 1. Màu sắc thương hiệu (Brand Colors)
  primary: string;         // Màu chủ đạo (Xanh dương học tập cao cấp)
  secondary: string;       // Màu phụ (Slate tối lịch lãm)
  primaryHover: string;    // Màu primary khi hover
  textGray: string;        // Màu chữ xám thường dùng cho phụ đề

  // 2. Màu sắc điều hướng & Menu (Navigation & Menu)
  menuDefault: string;
  menuColor: string;
  menuDisableDark: string;
  menuBackground: string;

  // 3. Màu sắc tương tác & Button (Interactive & Button Colors)
  actionActive: string;
  actionActive2: string;
  activeButton: string;
  buttonPrimary: string;
  buttonInput: string;
  buttonInActive: string;
  buttonWhite: string;
  buttonOutline: string;

  // 4. Màu sắc Typography (Typography Colors)
  titleDefault: string;       // Màu tiêu đề chính (Slate 900)
  titleTable: string;         // Màu tiêu đề bảng (Slate 700)
  contentTable: string;       // Màu nội dung bảng (Slate 600)
  contentTableDisable: string;// Nội dung bảng bị vô hiệu hóa (Slate 400)
  contentPlaceholder: string; // Chữ giữ chỗ (Slate 400)
  contentDropdown13: string;

  // 5. Đường kẻ & Khung viền (Borders & Dividers)
  strokeLineLight: string;    // Đường viền nhẹ tinh tế (Slate 100)
  strokeLightDark: string;    // Đường viền tối nhẹ (Slate 700)
  strokeCheckbox: string;     // Đường viền ô checkbox (Slate 300)

  // 6. Trạng thái phản hồi (Semantic/Status Colors)
  statusGreen: string;        // Thành công (Emerald 500)
  statusGreenHover: string;
  statusRed: string;          // Lỗi/Hủy (Red 500)
  statusRedHover: string;
  statusYellow: string;       // Cảnh báo/Chờ (Amber 500 - ví dụ: đánh giá sao)
  statusBlue: string;         // Thông tin/Tiến trình (Blue 500)
  statusNotSync: string;      // Chưa đồng bộ

  // 7. Màu nền Layout & Table (Layout & Table Backgrounds)
  tableSelectedActive: string;  // Dòng bảng được chọn/hover (Slate 50/100)
  tableTitleBackground: string; // Nền tiêu đề bảng
  backGroundContent: string;    // Nền trang chính (Slate 50)
  backGroundWhite: string;      // Nền trắng
}

export const theme: ThemesType = {
  // Brand Colors (Sử dụng bảng màu Tailwind Slate + Indigo/Royal Blue tinh tế)
  primary: "rgba(37, 99, 235, 1)",      // Xanh Royal Blue hiện đại (#2563eb)
  secondary: "#1e293b",                 // Slate 800 lịch lãm chuyên nghiệp
  textGray: "#475569",                  // Slate 600 cho body text dễ đọc
  buttonPrimary: "rgba(37, 99, 235, 1)",
  primaryHover: "#3b82f6",              // Xanh dương sáng hơn khi hover (#3b82f6)

  // Navigation & Menu
  menuDefault: "rgba(15, 23, 42, 0.8)", // Slate 900 với độ mờ nhẹ
  menuColor: "rgba(15, 23, 42, 1)",     // Slate 900 sắc nét
  menuDisableDark: "#64748b",           // Slate 500
  menuBackground: "rgba(245, 158, 11, 0.1)", // Nền cam nhạt ấm áp cho highlight

  // Interactive & Button
  actionActive: "#4f46e5",              // Indigo 600 cho các nút hành động đặc biệt
  actionActive2: "#ffffff",
  activeButton: "#3b82f6",
  buttonInput: "#f8fafc",               // Slate 50 tạo cảm giác phẳng cao cấp
  buttonInActive: "#cbd5e1",            // Slate 300
  buttonWhite: "#ffffff",
  buttonOutline: "#e2e8f0",             // Slate 200 cho viền nút outline

  // Typography (Sử dụng tỷ lệ tương phản chuẩn WCAG)
  titleDefault: "#0f172a",              // Slate 900 cho tiêu đề lớn/đậm
  titleTable: "#334155",                // Slate 700 cho tiêu đề cột
  contentTable: "#475569",              // Slate 600 cho dữ liệu chữ chính
  contentTableDisable: "#94a3b8",       // Slate 400
  contentPlaceholder: "#94a3b8",        // Slate 400
  contentDropdown13: "#334155",

  // Borders & Dividers
  strokeLineLight: "#f1f5f9",           // Slate 100 cho đường kẻ bảng nhẹ nhàng
  strokeLightDark: "#334155",           // Slate 700
  strokeCheckbox: "#cbd5e1",            // Slate 300

  // Semantic Status
  statusGreen: "#10b981",               // Emerald 500 tươi tắn và tích cực
  statusGreenHover: "rgba(16, 185, 129, 0.2)",
  statusRed: "#ef4444",                 // Red 500 báo lỗi rõ ràng
  statusRedHover: "rgba(239, 68, 68, 0.2)",
  statusYellow: "#f59e0b",              // Amber 500 lý tưởng cho Star Rating
  statusBlue: "#3b82f6",                // Blue 500 cho thông báo/tiến độ học tập
  statusNotSync: "#818cf8",             // Indigo 400

  // Layout & Table Backgrounds
  tableSelectedActive: "#f1f5f9",       // Slate 100 cho hover/dòng chọn sang trọng
  tableTitleBackground: "#f8fafc",      // Slate 50 nhẹ nhàng làm nổi bật tiêu đề
  backGroundContent: "#f8fafc",         // Slate 50 cho nền tổng thể nền nã
  backGroundWhite: "#ffffff",
};

const useThemeStore = create(() => ({
  ...theme,
}));

export default useThemeStore;
