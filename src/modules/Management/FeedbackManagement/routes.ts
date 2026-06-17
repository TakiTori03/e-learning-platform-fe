import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const FeedbackListPage = lazy(() => import("./pages/FeedbackListPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.admin.feedbacks,
    page: createElement(FeedbackListPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
];

export default routes;
