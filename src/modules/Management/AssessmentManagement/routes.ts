import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const InstructorAssessments = lazy(() => import("./pages/InstructorAssessments"));
const QuizBuilder = lazy(() => import("./pages/QuizBuilder"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.instructor.assessments, // "/author/assessments"
    page: createElement(InstructorAssessments),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },
  {
    path: pathRoutes.instructor.assessmentBuilder,
    page: createElement(QuizBuilder),
    layout: "admin",
    isProtected: true,
    roles: ["INSTRUCTOR"],
  },
];

export default routes;
