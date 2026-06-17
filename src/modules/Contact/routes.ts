import { type RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";
import { pathRoutes } from "@/constants/routes";

const ContactPage = lazy(() => import("./pages/ContactPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.contact,
    page: createElement(ContactPage),
    layout: "client",
  },
];
