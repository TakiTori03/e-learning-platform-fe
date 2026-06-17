import { pathRoutes } from "@/constants/routes";
import { type RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";

const HomePage = lazy(() => import("./pages"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.home,
    page: createElement(HomePage),
    layout: "client",
  },
];
