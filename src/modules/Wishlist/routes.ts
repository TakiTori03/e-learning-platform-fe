import type { RouterConfig } from "@/routes/ProtectedRoute";
import { createElement, lazy } from "react";

const WishlistPage = lazy(() => import("./pages/WishlistPage"));

export const routes: RouterConfig[] = [
  {
    path: "/wishlist",
    page: createElement(WishlistPage),
    layout: "client",
    isProtected: true,
  },
];
