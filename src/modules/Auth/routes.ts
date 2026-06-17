import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const AuthorRegisterPage = lazy(() => import("./pages/AuthorRegisterPage"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage"));

export const routes: RouterConfig[] = [
  {
    path: "/login",
    page: createElement(LoginPage),
    layout: "none",
  },
  {
    path: "/auth-callback",
    page: createElement(AuthCallbackPage),
    layout: "none",
  },
  {
    path: "/register",
    page: createElement(RegisterPage),
    layout: "none",
  },
  {
    path: "/author-signup",
    page: createElement(AuthorRegisterPage),
    layout: "none",
  },
];
export default routes;
