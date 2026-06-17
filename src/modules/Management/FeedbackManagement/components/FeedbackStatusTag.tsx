import React, { type FC } from "react";
import { BaseTag } from "@/components/UI/Tag/BaseTag";
import { FeedbackStatus, FeedbackStatusLabels } from "@/constants/enums";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

interface Props {
  status: FeedbackStatus | string;
  className?: string;
}

const CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [FeedbackStatus.RESOLVED]: {
    label: FeedbackStatusLabels.RESOLVED,
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  [FeedbackStatus.PENDING]: {
    label: FeedbackStatusLabels.PENDING,
    color: "warning",
    icon: <ExclamationCircleOutlined />,
  },
  [FeedbackStatus.RESPONDED]: {
    label: FeedbackStatusLabels.RESPONDED,
    color: "processing",
    icon: <SyncOutlined spin />,
  },
  [FeedbackStatus.CLOSED]: {
    label: FeedbackStatusLabels.CLOSED,
    color: "default",
    icon: <CloseCircleOutlined />,
  },
};

export const FeedbackStatusTag: FC<Props> = ({ status, className }) => {
  const cfg = CONFIG[status] || { label: status, color: "default", icon: null };
  return (
    <BaseTag color={cfg.color} icon={cfg.icon} className={className}>
      {cfg.label}
    </BaseTag>
  );
};

export default FeedbackStatusTag;
