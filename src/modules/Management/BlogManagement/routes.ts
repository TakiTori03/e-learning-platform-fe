import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const InstructorBlogList = lazy(() => import("./pages/InstructorBlogList"));
const AdminBlogList = lazy(() => import("./pages/AdminBlogList"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.instructor.blogs,
    page: createElement(InstructorBlogList),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },
  {
    path: pathRoutes.admin.blogList,
    page: createElement(AdminBlogList),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
];

export default routes;
