import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";

const CartPage = lazy(() => import("./pages/CartPage"));

export const routes: RouterConfig[] = [
  {
    path: "/cart",
    page: createElement(CartPage),
    layout: "client",
    isProtected: false,
  },
];
