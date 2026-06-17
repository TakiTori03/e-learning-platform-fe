import React from "react";
import { Typography } from "antd";
import { Plus, ArrowLeft } from "lucide-react";
import CButton from "@/components/UI/Button";

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle: string;
  showCreateButton?: boolean;
  createButtonText?: string;
  onCreateClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  extra?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showCreateButton = false,
  createButtonText = "Tạo mới",
  onCreateClick,
  showBackButton = false,
  onBackClick,
  extra,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-1">
      <div className="flex items-center gap-3.5 min-w-0">
        {showBackButton && (
          <CButton
            type="text"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={onBackClick}
            className="flex items-center justify-center w-10 h-10 shrink-0 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
          />
        )}
        <div className="flex flex-col min-w-0">
          <Title level={4} className="!m-0 text-gray-800 font-bold leading-tight break-words">
            {title}
          </Title>
          <Text type="secondary" className="text-xs mt-1 text-gray-500 line-clamp-2">
            {subtitle}
          </Text>
        </div>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto justify-start sm:justify-end shrink-0">
        {extra}
        {showCreateButton && (
          <CButton
            type="primary"
            icon={<Plus className="w-4 h-4 mr-1.5" />}
            onClick={onCreateClick}
            className="bg-primary hover:bg-primary/95 border-0 h-10 px-5 rounded-xl flex items-center justify-center shadow-md font-semibold text-white transition-all transform hover:scale-[1.01] w-full sm:w-auto"
            style={{
              height: "40px",
              borderRadius: "12px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
            }}
          >
            {createButtonText}
          </CButton>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
