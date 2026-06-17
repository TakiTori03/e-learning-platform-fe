import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const WelcomePage = lazy(() => import("./pages/shared/WelcomePage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminReportPage = lazy(() => import("./pages/admin/AdminReportPage"));
const InstructorReportPage = lazy(() => import("./pages/instructor/InstructorReportPage"));
const SettingsPage = lazy(() => import("./pages/shared/SettingsPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.instructor.welcome, // "/author/welcome"
    page: createElement(WelcomePage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN", "INSTRUCTOR"],
  },
  {
    path: pathRoutes.admin.dashboard, // "/admin/dashboard"
    page: createElement(AdminDashboardPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.admin.report, // "/admin/report"
    page: createElement(AdminReportPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.instructor.report, // "/author/author-report"
    page: createElement(InstructorReportPage),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },

  {
    path: pathRoutes.admin.settings, // "/admin/settings"
    page: createElement(SettingsPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.instructor.settings, // "/author/settings"
    page: createElement(SettingsPage),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },
];

export default routes;
