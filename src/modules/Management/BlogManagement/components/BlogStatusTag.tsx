import React from "react";
import { BaseTag } from "@/components/UI/Tag/BaseTag";
import {
  CheckCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface Props {
  status: "DRAFT" | "PUBLISHED" | string;
  className?: string;
}

const CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PUBLISHED: {
    label: "Đã xuất bản",
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  DRAFT: {
    label: "Bản nháp",
    color: "default",
    icon: <FileTextOutlined />,
  },
};

export const BlogStatusTag: React.FC<Props> = ({ status, className }) => {
  const cfg = CONFIG[status] || { label: status, color: "default", icon: null };

  return (
    <BaseTag color={cfg.color} icon={cfg.icon} className={className}>
      {cfg.label}
    </BaseTag>
  );
};

export default BlogStatusTag;
