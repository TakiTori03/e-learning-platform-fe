import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const ReviewListPage = lazy(() => import("./pages/ReviewListPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.admin.reviewsCenter,
    page: createElement(ReviewListPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.admin.reports.reviewsCenter,
    page: createElement(ReviewListPage),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },
];

export default routes;
