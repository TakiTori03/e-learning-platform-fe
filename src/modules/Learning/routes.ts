import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";

const PathPlayerPage = lazy(() => import("./pages/PathPlayerPage"));
const MyLearningPage = lazy(() => import("./pages/MyLearningPage"));

export const routes: RouterConfig[] = [
  {
    path: "/learning/:courseId/:lessonId?",
    page: createElement(PathPlayerPage),
    layout: "none",
    isProtected: true,
  },
  {
    path: "/start",
    page: createElement(MyLearningPage),
    layout: "client",
    isProtected: true,
  },
];
