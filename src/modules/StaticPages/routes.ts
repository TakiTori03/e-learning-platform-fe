import type { RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";
import { pathRoutes } from "@/constants/routes";

const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const CookiePage = lazy(() => import("./pages/CookiePage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.aboutUs,
    page: createElement(AboutPage),
    layout: "client",
  },
  {
    path: pathRoutes.privacy,
    page: createElement(PrivacyPage),
    layout: "client",
  },
  {
    path: pathRoutes.terms,
    page: createElement(TermsPage),
    layout: "client",
  },
  {
    path: pathRoutes.cookies,
    page: createElement(CookiePage),
    layout: "client",
  },
];
