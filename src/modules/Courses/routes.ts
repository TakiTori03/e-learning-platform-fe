/* eslint-disable react-refresh/only-export-components */
import { type RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";

const CoursesPage = lazy(() => import("./pages"));
const DetailPage = lazy(() => import("./pages/Detail"));

export const routes: RouterConfig[] = [
  {
    path: "/courses",
    page: createElement(CoursesPage),
    layout: "client",
  },
  {
    path: "/courses/:courseId",
    page: createElement(DetailPage),
    layout: "client",
  },
];
