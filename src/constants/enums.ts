export const CourseLevel = {
  ALL: "ALL",
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  ADVANCED: "ADVANCED",
  EXPERT: "EXPERT",
} as const;
export type CourseLevel = (typeof CourseLevel)[keyof typeof CourseLevel];

export const CourseLevelLabels: Record<CourseLevel, string> = {
  [CourseLevel.ALL]: "Mọi cấp độ",
  [CourseLevel.BEGINNER]: "Người mới bắt đầu",
  [CourseLevel.INTERMEDIATE]: "Trung bình",
  [CourseLevel.ADVANCED]: "Nâng cao",
  [CourseLevel.EXPERT]: "Chuyên gia",
};

export const CourseStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
  REJECTED: "REJECTED",
} as const;
export type CourseStatus = (typeof CourseStatus)[keyof typeof CourseStatus];

export const CourseStatusLabels: Record<CourseStatus, string> = {
  [CourseStatus.DRAFT]: "Bản nháp",
  [CourseStatus.PENDING]: "Chờ duyệt",
  [CourseStatus.PUBLISHED]: "Đã xuất bản",
  [CourseStatus.ARCHIVED]: "Đã lưu trữ",
  [CourseStatus.REJECTED]: "Bị từ chối",
};

export const LessonType = {
  VIDEO: "VIDEO",
  DOCUMENT: "DOCUMENT",
  QUIZ: "QUIZ",
  ASSIGNMENT: "ASSIGNMENT",
} as const;
export type LessonType = (typeof LessonType)[keyof typeof LessonType];

export const LessonTypeLabels: Record<LessonType, string> = {
  [LessonType.VIDEO]: "Video bài giảng",
  [LessonType.DOCUMENT]: "Tài liệu đọc",
  [LessonType.QUIZ]: "Trắc nghiệm",
  [LessonType.ASSIGNMENT]: "Bài tập",
};

export const AdminMenuKey = {
  DASHBOARD: "dashboard",
  COURSES: "courses",
  CATEGORIES: "categories",
  DISCUSS: "discuss",
  REVIEWS: "reviews",
  ASSESSMENTS: "assessments",
  REPORT: "author_report",
  USERS: "users",
  INSTRUCTOR_REVIEW: "instructor_review",
  ORDERS: "orders",
  TRANSACTIONS: "transactions",
  FEEDBACKS: "feedbacks",
  SETTINGS: "settings",
  BLOG_MANAGEMENT: "blog_management",
} as const;
export type AdminMenuKey = (typeof AdminMenuKey)[keyof typeof AdminMenuKey];

export const AdminMenuGroupKey = {
  COURSES_GROUP: "courses_group",
  INTERACTION_GROUP: "interaction_group",
  CONTENT_GROUP: "content_group",
  USERS_GROUP: "users_group",
  ORDERS_GROUP: "orders_group",
} as const;
export type AdminMenuGroupKey = (typeof AdminMenuGroupKey)[keyof typeof AdminMenuGroupKey];

export const FeedbackType = {
  BUG: "BUG",
  FEATURE: "FEATURE",
  GENERAL: "GENERAL",
} as const;
export type FeedbackType = (typeof FeedbackType)[keyof typeof FeedbackType];

export const FeedbackTypeLabels: Record<FeedbackType, string> = {
  [FeedbackType.BUG]: "Báo lỗi hệ thống",
  [FeedbackType.FEATURE]: "Đóng góp tính năng mới",
  [FeedbackType.GENERAL]: "Góp ý & Thắc mắc chung",
};

export const FeedbackStatus = {
  PENDING: "PENDING",
  RESPONDED: "RESPONDED",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
} as const;
export type FeedbackStatus = (typeof FeedbackStatus)[keyof typeof FeedbackStatus];

export const FeedbackStatusLabels: Record<FeedbackStatus, string> = {
  [FeedbackStatus.PENDING]: "Đang chờ xử lý",
  [FeedbackStatus.RESPONDED]: "Đã phản hồi",
  [FeedbackStatus.RESOLVED]: "Đã giải quyết",
  [FeedbackStatus.CLOSED]: "Đã đóng",
};

export const UserRole = {
  STUDENT: "STUDENT",
  INSTRUCTOR: "INSTRUCTOR",
  ADMIN: "ADMIN",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.STUDENT]: "Student",
  [UserRole.INSTRUCTOR]: "Instructor",
  [UserRole.ADMIN]: "Admin",
};

export const UserStatus = {
  ACTIVE: "ACTIVE",
  PENDING: "PENDING",
  LOCKED: "LOCKED",
  REJECTED: "REJECTED",
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const UserStatusLabels: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: "Đang hoạt động",
  [UserStatus.PENDING]: "Chờ duyệt",
  [UserStatus.LOCKED]: "Bị khóa",
  [UserStatus.REJECTED]: "Bị từ chối",
};

export const OrderStatus = {
  PENDING: "PENDING",
  PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Đang chờ thanh toán",
  [OrderStatus.PAYMENT_SUCCESS]: "Chờ kích hoạt",
  [OrderStatus.COMPLETED]: "Hoàn tất",
  [OrderStatus.CANCELLED]: "Đã hủy",
  [OrderStatus.FAILED]: "Thất bại",
  [OrderStatus.REFUNDED]: "Đã hoàn tiền",
};

export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.SUCCESS]: "Thành công",
  [PaymentStatus.FAILED]: "Thất bại",
  [PaymentStatus.REFUNDED]: "Đã hoàn tiền",
};

export const ActionsType = {
  CREATE: "CREATE",
  READ: "READ",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  APPROVED: "APPROVED",
  REJECT: "REJECT",
  HISTORY: "HISTORY",
  VERIFY: "VERIFY",
} as const;
export type ActionsType = (typeof ActionsType)[keyof typeof ActionsType];

export const ActionsTypeLabels: Record<ActionsType, string> = {
  [ActionsType.CREATE]: "Tạo mới",
  [ActionsType.READ]: "Đọc/Xem",
  [ActionsType.UPDATE]: "Cập nhật",
  [ActionsType.DELETE]: "Xóa",
  [ActionsType.APPROVED]: "Phê duyệt",
  [ActionsType.REJECT]: "Từ chối",
  [ActionsType.HISTORY]: "Xem lịch sử",
  [ActionsType.VERIFY]: "Xác minh",
};
