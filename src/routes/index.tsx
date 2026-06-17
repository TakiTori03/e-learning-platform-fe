import { memo, lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "@/modules/NotFound/page/ErrorPage";
import ClientLayout from "@/layouts/ClientLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import { routes } from "./routes";
import CLoadingLazy from "@/components/UI/LoadingLazy";

const NotFoundPage = lazy(() => import("../modules/NotFound/page/index"));

// Phân loại danh sách routes theo Layout
const clientRoutesList = routes.filter((r) => r.layout === "client");
const adminRoutesList = routes.filter((r) => r.layout === "admin");
const noLayoutRoutesList = routes.filter((r) => r.layout === "none" || !r.layout);

const buildReactRoute = (item: any) => ({
  path: item.path,
  element: item.isProtected ? (
    createElement(ProtectedRoute, { element: item.page, allowedRoles: item.roles })
  ) : (
    item.page
  ),
});

// react-router-dom v6 data route config expects elements, not createElement helper unless necessary, but we can do it directly.
// Wait! Let's import 'createElement' from 'react' to keep it safe.
import { createElement } from "react";

const router = createBrowserRouter([
  {
    // Nhóm Client Layout
    element: createElement(ClientLayout),
    children: clientRoutesList.map(buildReactRoute),
  },
  {
    // Nhóm Admin Layout
    element: createElement(AdminLayout),
    children: adminRoutesList.map(buildReactRoute),
  },
  // Nhóm các trang không có Layout (Login, Register...)
  ...noLayoutRoutesList.map(buildReactRoute),
  {
    path: "*",
    element: createElement(Suspense, { fallback: createElement(CLoadingLazy) }, createElement(NotFoundPage)),
  },
]);

export const AppRouter = () => {
  return (
    <ErrorBoundary fallback={createElement(ErrorPage)}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export const AppRoutes = AppRouter;
export default memo(AppRouter);
