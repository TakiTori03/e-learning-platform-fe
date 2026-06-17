import React, { memo } from "react";
import { Result } from "antd";
import { useNavigate } from "react-router-dom";
import CButton from "@/components/UI/Button";

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Xin lỗi, trang bạn đang tìm kiếm không tồn tại."
        extra={
          <CButton type="primary" onClick={() => navigate("/")}>
            Về trang chủ
          </CButton>
        }
      />
    </div>
  );
};

export default memo(NotFoundPage);
