import type { RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";
import { pathRoutes } from "@/constants/routes";

const SocialPage = lazy(() => import("./pages/SocialPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.social,
    page: createElement(SocialPage),
    layout: "client",
  },
];
