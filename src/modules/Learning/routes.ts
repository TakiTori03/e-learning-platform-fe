import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const PathPlayerPage = lazy(() => import("./pages/PathPlayerPage"));
const MyLearningPage = lazy(() => import("./pages/MyLearningPage"));
const QuizExamPage = lazy(() => import("./pages/QuizExamPage"));

export const routes: RouterConfig[] = [
  {
    path: "/learning/:courseId/:lessonId?",
    page: createElement(PathPlayerPage),
    layout: "none",
    isProtected: true,
  },
  {
    path: pathRoutes.quizTake,
    page: createElement(QuizExamPage),
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
