import { memo } from "react";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import { useErrorBoundary } from "react-error-boundary";
import CButton from "@/components/UI/Button";

export const ErrorPage = memo(() => {
  const { resetBoundary } = useErrorBoundary();
  const navigate = useNavigate();

  const handleGoHome = () => {
    resetBoundary();
    navigate("/");
  };

  const handleReload = () => {
    resetBoundary();
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Result
        status="500"
        title="500"
        subTitle="Đã xảy ra sự cố hiển thị hệ thống không mong muốn."
        extra={[
          <CButton type="primary" key="home" onClick={handleGoHome}>
            Về trang chủ
          </CButton>,
          <CButton key="reload" onClick={handleReload} className="ml-3">
            Tải lại trang
          </CButton>
        ]}
      />
    </div>
  );
});

export default ErrorPage;
