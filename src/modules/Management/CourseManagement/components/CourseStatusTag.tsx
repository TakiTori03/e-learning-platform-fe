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

const CONFIG: Record<
  string,
  { label: string; color: string; textColor: string; borderColor: string; icon: React.ReactNode }
> = {
  [CourseStatus.PUBLISHED]: {
    label: CourseStatusLabels.PUBLISHED,
    color: "success",
    textColor: "#16a34a",
    borderColor: "#bbf7d0",
    icon: <CheckCircleOutlined />,
  },
  [CourseStatus.PENDING]: {
    label: CourseStatusLabels.PENDING,
    color: "warning",
    textColor: "#d97706",
    borderColor: "#fef3c7",
    icon: <ExclamationCircleOutlined />,
  },
  [CourseStatus.REJECTED]: {
    label: CourseStatusLabels.REJECTED,
    color: "error",
    textColor: "#dc2626",
    borderColor: "#fee2e2",
    icon: <CloseCircleOutlined />,
  },
  [CourseStatus.DRAFT]: {
    label: CourseStatusLabels.DRAFT,
    color: "default",
    textColor: "#4b5563",
    borderColor: "#e5e7eb",
    icon: <FileTextOutlined />,
  },
  [CourseStatus.ARCHIVED]: {
    label: CourseStatusLabels.ARCHIVED,
    color: "purple",
    textColor: "#7c3aed",
    borderColor: "#e9d5ff",
    icon: <FileTextOutlined />,
  },
};

export const CourseStatusTag: FC<Props> = ({ status, variant = "solid", className }) => {
  const cfg = CONFIG[status] || {
    label: status,
    color: "default",
    textColor: "#4b5563",
    borderColor: "#e5e7eb",
    icon: null,
  };

  const cardOverlayStyle = variant === "card-overlay" ? {
    backgroundColor: "#ffffff",
    border: `1px solid ${cfg.borderColor}`,
    color: cfg.textColor,
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
