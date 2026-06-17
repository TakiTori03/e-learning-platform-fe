import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Đăng ký plugin UTC cho dayjs
dayjs.extend(utc);

// Format tiền VND
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

// Format thời gian của video (ví dụ: 125 giây -> 02:05)
export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const mStr = m.toString().padStart(2, "0");
  const sStr = s.toString().padStart(2, "0");

  if (h > 0) {
    const hStr = h.toString().padStart(2, "0");
    return `${hStr}:${mStr}:${sStr}`;
  }
  return `${mStr}:${sStr}`;
};

// Format ngày tháng hiển thị theo giờ địa phương từ chuỗi UTC (DD/MM/YYYY)
export const formatDate = (date: string | Date | null | undefined, pattern = "DD/MM/YYYY"): string => {
  if (!date) return "";
  return dayjs.utc(date).local().format(pattern);
};

// Format ngày giờ hiển thị theo giờ địa phương từ chuỗi UTC (DD/MM/YYYY HH:mm)
export const formatDateTime = (date: string | Date | null | undefined, pattern = "DD/MM/YYYY HH:mm"): string => {
  if (!date) return "";
  return dayjs.utc(date).local().format(pattern);
};

// Format ngày giờ đầy đủ hiển thị theo giờ địa phương từ chuỗi UTC (DD/MM/YYYY HH:mm:ss)
export const formatDateTimeFull = (date: string | Date | null | undefined, pattern = "DD/MM/YYYY HH:mm:ss"): string => {
  if (!date) return "";
  return dayjs.utc(date).local().format(pattern);
};

// Format tên đầy đủ (firstName + lastName)
export const formatFullName = (
  user?: { firstName?: string | null; lastName?: string | null } | null,
  fallback = ""
): string => {
  if (!user) return fallback;
  const f = user.firstName?.trim() || "";
  const l = user.lastName?.trim() || "";
  if (!f && !l) return fallback;
  return `${f} ${l}`.trim();
};
