import React, { type FC } from "react";
import { BaseTag } from "@/components/UI/Tag/BaseTag";
import { CourseStatus, CourseStatusLabels } from "@/constants/enums";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface Props {
  status: CourseStatus | string;
  variant?: "solid" | "card-overlay";
  className?: string;
}

const CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [CourseStatus.PUBLISHED]: {
    label: CourseStatusLabels.PUBLISHED,
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  [CourseStatus.PENDING]: {
    label: CourseStatusLabels.PENDING,
    color: "warning",
    icon: <ExclamationCircleOutlined />,
  },
  [CourseStatus.REJECTED]: {
    label: CourseStatusLabels.REJECTED,
    color: "error",
    icon: <CloseCircleOutlined />,
  },
  [CourseStatus.DRAFT]: {
    label: CourseStatusLabels.DRAFT,
    color: "default",
    icon: <FileTextOutlined />,
  },
  [CourseStatus.ARCHIVED]: {
    label: CourseStatusLabels.ARCHIVED,
    color: "purple",
    icon: <FileTextOutlined />,
  },
};

export const CourseStatusTag: FC<Props> = ({ status, variant = "solid", className }) => {
  const cfg = CONFIG[status] || { label: status, color: "default", icon: null };

  const cardOverlayStyle = variant === "card-overlay" ? {
    backgroundColor: "#ffffff",
    border: `1px solid var(--ant-${cfg.color}-color-border, #d9d9d9)`,
    color: `var(--ant-${cfg.color}-color, #595959)`
  } : undefined;

  return (
    <BaseTag
      color={variant === "solid" ? cfg.color : undefined}
      icon={cfg.icon}
      style={cardOverlayStyle}
      className={className}
    >
      {cfg.label}
    </BaseTag>
  );
};

export default CourseStatusTag;
