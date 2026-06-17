import type { RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";
import { pathRoutes } from "@/constants/routes";

const InboxPage = lazy(() => import("./pages/InboxPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.inbox,
    page: createElement(InboxPage),
    layout: "client",
    isProtected: true,
  },
];
