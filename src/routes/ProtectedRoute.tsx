import { useEffect, Suspense, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import { useAuthStore } from "@/store/useAuthStore";
import { pathRoutes } from "@/constants/routes";

import LoadingLazy from "@/components/UI/LoadingLazy";

export interface RouterConfig {
  path: string;
  page: React.ReactNode;
  layout?: "client" | "admin" | "none";
  isProtected?: boolean;
  roles?: string[];
}

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleGoBack = () => {
    if (user?.role === "ADMIN") {
      navigate(pathRoutes.admin.dashboard);
    } else if (user?.role === "INSTRUCTOR") {
      navigate(pathRoutes.instructor.welcome);
    } else {
      navigate(pathRoutes.home);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Result
        status="403"
        title="403"
        subTitle="Bạn không có quyền truy cập vào chức năng này."
        extra={
          <Button type="primary" onClick={handleGoBack} className="rounded-lg h-10 px-6 font-semibold">
            Quay lại trang chủ
          </Button>
        }
      />
    </div>
  );
};

const ProtectedRoute = ({ element, allowedRoles }: { element: ReactNode; allowedRoles?: string[] }) => {
  const { isAuth, isLoading, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      navigate("/login", { replace: true });
    }
  }, [isAuth, isLoading, navigate]);

  if (isLoading) {
    return <LoadingLazy />;
  }

  if (!isAuth) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    return <ForbiddenPage />;
  }

  return <Suspense fallback={<LoadingLazy />}>{element}</Suspense>;
};

export default ProtectedRoute;

export const ProtectedEmptyLayoutRoute = ({ element }: { element: ReactNode }) => {
  const { isAuth, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuth) {
      navigate("/login", { replace: true });
    }
  }, [isAuth, isLoading, navigate]);

  if (isLoading) {
    return <LoadingLazy />;
  }

  if (!isAuth) {
    return null;
  }

  return <>{element}</>;
};
