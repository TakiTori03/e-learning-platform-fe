import {
  DashboardOutlined,
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
  CommentOutlined,
  MessageOutlined,
  BarChartOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { pathRoutes } from "@/constants/routes";
import { AdminMenuKey, AdminMenuGroupKey } from "@/constants/enums";

export interface SidebarItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  roles?: string[];
  path?: (role: string) => string;
  activePatterns?: string[];
  children?: SidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    key: AdminMenuKey.DASHBOARD,
    label: "Dashboard",
    icon: <DashboardOutlined />,
    path: (role) => role === "ADMIN" ? pathRoutes.admin.dashboard : pathRoutes.instructor.welcome,
    activePatterns: [pathRoutes.instructor.dashboard, pathRoutes.admin.dashboard, pathRoutes.instructor.welcome],
  },
  {
    key: AdminMenuGroupKey.COURSES_GROUP,
    label: "Quản lý Khóa học",
    icon: <BookOutlined />,
    roles: ["ADMIN", "INSTRUCTOR"],
    children: [
      {
        key: AdminMenuKey.COURSES,
        label: "Danh sách Khóa học",
        path: (role) => role === "ADMIN" ? pathRoutes.admin.courses : pathRoutes.instructor.courses,
        activePatterns: [
          pathRoutes.instructor.courses,
          pathRoutes.admin.courses,
          "/author/courses/",
          "/admin/courses/",
        ],
      },
      {
        key: AdminMenuKey.CATEGORIES,
        label: "Danh mục Khóa học",
        roles: ["ADMIN"],
        path: () => pathRoutes.admin.categories,
        activePatterns: [pathRoutes.admin.categories],
      },
    ],
  },
  {
    key: AdminMenuGroupKey.CONTENT_GROUP,
    label: "Quản lý Nội dung",
    icon: <EditOutlined />,
    roles: ["ADMIN", "INSTRUCTOR"],
    children: [
      {
        key: AdminMenuKey.BLOG_MANAGEMENT,
        label: "Bài viết Blog",
        path: (role) => (role === "ADMIN" ? pathRoutes.admin.blogList : pathRoutes.instructor.blogs),
        activePatterns: [pathRoutes.instructor.blogs, pathRoutes.admin.blogList],
      },
    ],
  },
  {
    key: AdminMenuKey.ASSESSMENTS,
    label: "Ngân hàng Đề thi",
    icon: <FileTextOutlined />,
    roles: ["INSTRUCTOR"],
    path: () => pathRoutes.instructor.assessments,
    activePatterns: [pathRoutes.instructor.assessments, pathRoutes.instructor.assessmentBuilder],
  },
  {
    key: AdminMenuGroupKey.INTERACTION_GROUP,
    label: "Tương tác học viên",
    icon: <MessageOutlined />,
    roles: ["ADMIN", "INSTRUCTOR"],
    children: [
      {
        key: AdminMenuKey.DISCUSS,
        label: "Thảo luận bài học",
        path: (role) => role === "ADMIN" ? pathRoutes.admin.discuss : pathRoutes.instructor.discuss,
        activePatterns: [pathRoutes.instructor.discuss, pathRoutes.admin.discuss],
      },
      {
        key: AdminMenuKey.REVIEWS,
        label: "Đánh giá khóa học",
        path: (role) => role === "ADMIN" ? pathRoutes.admin.reviewsCenter : pathRoutes.admin.reports.reviewsCenter,
        activePatterns: [pathRoutes.admin.reports.reviewsCenter, pathRoutes.admin.reviewsCenter],
      },
    ],
  },
  {
    key: AdminMenuKey.REPORT,
    label: "Báo cáo & Thống kê",
    icon: <BarChartOutlined />,
    roles: ["ADMIN", "INSTRUCTOR"],
    path: (role) => role === "ADMIN" ? pathRoutes.admin.report : pathRoutes.instructor.report,
    activePatterns: [pathRoutes.instructor.report, pathRoutes.admin.report],
  },
  {
    key: AdminMenuGroupKey.USERS_GROUP,
    label: "Quản lý Thành viên",
    icon: <UserOutlined />,
    roles: ["ADMIN"],
    children: [
      {
        key: AdminMenuKey.USERS,
        label: "Danh sách người dùng",
        path: () => pathRoutes.admin.users,
        activePatterns: [pathRoutes.admin.users],
      },
      {
        key: AdminMenuKey.INSTRUCTOR_REVIEW,
        label: "Duyệt hồ sơ giảng viên",
        path: () => pathRoutes.admin.instructorReview,
        activePatterns: [pathRoutes.admin.instructorReview],
      },
    ],
  },
  {
    key: AdminMenuGroupKey.ORDERS_GROUP,
    label: "Giao dịch & Đơn hàng",
    icon: <ShoppingCartOutlined />,
    roles: ["ADMIN"],
    children: [
      {
        key: AdminMenuKey.ORDERS,
        label: "Quản lý Đơn hàng",
        path: () => pathRoutes.admin.orders,
        activePatterns: [pathRoutes.admin.orders],
      },
      {
        key: AdminMenuKey.TRANSACTIONS,
        label: "Đối soát Giao dịch",
        path: () => pathRoutes.admin.transactions,
        activePatterns: [pathRoutes.admin.transactions],
      },
    ],
  },
  {
    key: AdminMenuKey.FEEDBACKS,
    label: "Ý kiến & Phản hồi",
    icon: <CommentOutlined />,
    roles: ["ADMIN"],
    path: () => pathRoutes.admin.feedbacks,
    activePatterns: [pathRoutes.admin.feedbacks],
  },
  {
    key: AdminMenuKey.SETTINGS,
    label: "Cài đặt tài khoản",
    icon: <SettingOutlined />,
    roles: ["ADMIN", "INSTRUCTOR"],
    path: (role) => role === "ADMIN" ? pathRoutes.admin.settings : pathRoutes.instructor.settings,
    activePatterns: [pathRoutes.admin.settings],
  },
];

export const getSelectedKey = (pathname: string): string => {
  const findActiveKey = (items: SidebarItem[]): string | null => {
    for (const item of items) {
      if (item.children) {
        const activeChildKey = findActiveKey(item.children);
        if (activeChildKey) return activeChildKey;
      } else {
        const matches = item.activePatterns?.some((pattern) => {
          if (pattern.endsWith("/")) {
            return pathname.startsWith(pattern);
          }
          return pathname === pattern;
        });
        if (matches) return item.key;
      }
    }
    return null;
  };

  return findActiveKey(sidebarItems) || AdminMenuKey.DASHBOARD;
};

export const getParentKey = (key: string): string => {
  for (const group of sidebarItems) {
    if (group.children) {
      const found = group.children.some((child) => child.key === key);
      if (found) return group.key;
    }
  }
  return "";
};
