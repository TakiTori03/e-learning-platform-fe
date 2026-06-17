import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const UserListPage = lazy(() => import("./pages/UserListPage"));
const InstructorReviewPage = lazy(() => import("./pages/InstructorReviewPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.admin.users, // "/admin/users"
    page: createElement(UserListPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.admin.instructorReview, // "/admin/instructor-review"
    page: createElement(InstructorReviewPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
];

export default routes;
