import type { RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";
import { pathRoutes } from "@/constants/routes";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AccountSettingsPage = lazy(() => import("./pages/AccountSettingsPage"));
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.profile,
    page: createElement(ProfilePage),
    layout: "client",
    isProtected: true,
  },
  {
    path: "/public-profile/:id",
    page: createElement(ProfilePage),
    layout: "client",
    isProtected: true,
  },
  {
    path: pathRoutes.accountSettings,
    page: createElement(AccountSettingsPage),
    layout: "client",
    isProtected: true,
  },
  {
    path: pathRoutes.changePassword,
    page: createElement(ChangePasswordPage),
    layout: "client",
    isProtected: true,
  },
];

