export const TypeTagEnum = {
  SUCCESS: "success",       // Đã duyệt, Hoàn thành, Đã thanh toán
  PROCESSING: "processing", // Đang học, Đang xử lý
  ERROR: "error",           // Bị từ chối, Hủy bỏ, Không hoạt động
  WARNING: "warning",       // Chờ duyệt
  WAITING: "waiting",       // Chưa bắt đầu, Chờ thanh toán
  DRAFT: "draft",           // Bản nháp
} as const;

export type TypeTagEnum = typeof TypeTagEnum[keyof typeof TypeTagEnum];

export const StatusEnum = {
  ACTIVE: 1,
  INACTIVE: 0,
} as const;

export type StatusEnum = typeof StatusEnum[keyof typeof StatusEnum];
