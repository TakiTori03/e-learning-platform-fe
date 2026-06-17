import React, { type FC } from "react";
import { BaseTag } from "@/components/UI/Tag/BaseTag";
import { FeedbackType, FeedbackTypeLabels } from "@/constants/enums";
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

interface Props {
  type: FeedbackType | string;
  className?: string;
}

const CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [FeedbackType.BUG]: {
    label: FeedbackTypeLabels.BUG,
    color: "error",
    icon: <CloseCircleOutlined />,
  },
  [FeedbackType.FEATURE]: {
    label: FeedbackTypeLabels.FEATURE,
    color: "warning",
    icon: <ExclamationCircleOutlined />,
  },
  [FeedbackType.GENERAL]: {
    label: FeedbackTypeLabels.GENERAL,
    color: "processing",
    icon: <SyncOutlined spin />,
  },
};

export const FeedbackTypeTag: FC<Props> = ({ type, className }) => {
  const cfg = CONFIG[type] || { label: type, color: "default", icon: null };
  return (
    <BaseTag color={cfg.color} icon={cfg.icon} className={className}>
      {cfg.label}
    </BaseTag>
  );
};

export default FeedbackTypeTag;
