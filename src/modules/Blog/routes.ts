/* eslint-disable react-refresh/only-export-components */
import { pathRoutes } from "@/constants/routes";
import { type RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";

const BlogListPage = lazy(() => import("./pages/BlogListPage"));
const BlogDetailPage = lazy(() => import("./pages/BlogDetailPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.blog,
    page: createElement(BlogListPage),
    layout: "client",
  },
  {
    path: pathRoutes.blogDetail,
    page: createElement(BlogDetailPage),
    layout: "client",
  },
];
