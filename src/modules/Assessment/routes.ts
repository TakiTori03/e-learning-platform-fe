import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const MyAssignmentsPage = lazy(() => import("./pages/MyAssignmentsPage"));
const QuizExamPage = lazy(() => import("./pages/QuizExamPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.quizTake,
    page: createElement(QuizExamPage),
    layout: "none",
    isProtected: true,
  },
  {
    path: pathRoutes.assignments,
    page: createElement(MyAssignmentsPage),
    layout: "client",
    isProtected: true,
  },
];
