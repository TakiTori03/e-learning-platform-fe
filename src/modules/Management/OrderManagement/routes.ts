import { createElement, lazy } from "react";
import type { RouterConfig } from "@/routes/ProtectedRoute";
import { pathRoutes } from "@/constants/routes";

const OrderListPage = lazy(() => import("./pages/OrderListPage"));
const TransactionListPage = lazy(() => import("./pages/TransactionListPage"));

export const routes: RouterConfig[] = [
  {
    path: pathRoutes.admin.orders,
    page: createElement(OrderListPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
  {
    path: pathRoutes.admin.transactions,
    page: createElement(TransactionListPage),
    layout: "admin",
    isProtected: true,
    roles: ["ADMIN"],
  },
];

export default routes;
