import type { RouterConfig } from "./ProtectedRoute";
import { routes as authRoutes } from "@/modules/Auth/routes";
import { routes as courseRoutes } from "@/modules/Management/CourseManagement/routes";
import { routes as assessmentManagementRoutes } from "@/modules/Management/AssessmentManagement/routes";
import { routes as homeRoutes } from "@/modules/Home/routes";
import { routes as adminRoutes } from "@/modules/Management/ReportManagement/routes";
import { routes as userRoutes } from "@/modules/Management/UserManagement/routes";
import { routes as orderRoutes } from "@/modules/Management/OrderManagement/routes";
import { routes as feedbackRoutes } from "@/modules/Management/FeedbackManagement/routes";
import { routes as reviewRoutes } from "@/modules/Management/ReviewManagement/routes";
import { routes as blogManagementRoutes } from "@/modules/Management/BlogManagement/routes";

import { routes as clientCourseRoutes } from "@/modules/Courses/routes";
import { routes as profileRoutes } from "@/modules/Profile/routes";
import { routes as wishlistRoutes } from "@/modules/Wishlist/routes";
import { routes as cartRoutes } from "@/modules/Cart/routes";
import { routes as clientOrderRoutes } from "@/modules/Order/routes";
import { routes as contactRoutes } from "@/modules/Contact/routes";
import { routes as learningRoutes } from "@/modules/Learning/routes";
import { routes as staticRoutes } from "@/modules/StaticPages/routes";
import { routes as socialRoutes } from "@/modules/Social/routes";
import { routes as inboxRoutes } from "@/modules/Inbox/routes";
import { routes as blogRoutes } from "@/modules/Blog/routes";
import { routes as assessmentRoutes } from "@/modules/Assessment/routes";

export const mainRoutes: RouterConfig[] = [
  ...homeRoutes,
  ...authRoutes,
  ...courseRoutes,
  ...assessmentManagementRoutes,
  ...adminRoutes,
  ...userRoutes,
  ...orderRoutes,
  ...feedbackRoutes,
  ...reviewRoutes,
  ...clientCourseRoutes,
  ...profileRoutes,
  ...wishlistRoutes,
  ...cartRoutes,
  ...clientOrderRoutes,
  ...contactRoutes,
  ...learningRoutes,
  ...assessmentRoutes,
  ...staticRoutes,
  ...socialRoutes,
  ...inboxRoutes,
  ...blogRoutes,
  ...blogManagementRoutes,
];

export const routes: RouterConfig[] = [...mainRoutes];





