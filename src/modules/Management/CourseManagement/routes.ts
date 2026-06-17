import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const CategoryList = lazy(() => import("./pages/CategoryList"));
const AdminCourseList = lazy(() => import("./pages/AdminCourseList"));
const InstructorCourseList = lazy(() => import("./pages/InstructorCourseList"));
const AdminCurriculumView = lazy(() => import("./pages/AdminCurriculumView"));
const InstructorCurriculumEdit = lazy(() => import("./pages/InstructorCurriculumEdit"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.admin.categories,
    page: createElement(CategoryList),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.admin.courses,
    page: createElement(AdminCourseList),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.instructor.courses,
    page: createElement(InstructorCourseList),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },
  {
    path: pathRoutes.admin.courseDetail,
    page: createElement(AdminCurriculumView),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.instructor.courseDetail,
    page: createElement(InstructorCurriculumEdit),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },
];

export default routes;
