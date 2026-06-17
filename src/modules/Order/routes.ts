import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";

const VNPayReturnPage = lazy(() => import("./pages/VNPayReturnPage"));
const PurchaseHistoryPage = lazy(() => import("./pages/PurchaseHistoryPage"));

export const routes: RouterConfig[] = [
  {
    path: "/order/vnpay-return",
    page: createElement(VNPayReturnPage),
    layout: "client",
    isProtected: true,
  },
  {
    path: "/purchase-history",
    page: createElement(PurchaseHistoryPage),
    layout: "client",
    isProtected: true,
  },
];
