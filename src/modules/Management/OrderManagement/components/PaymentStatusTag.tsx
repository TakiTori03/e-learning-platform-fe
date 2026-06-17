import React, { type FC } from "react";
import { BaseTag } from "@/components/UI/Tag/BaseTag";
import { PaymentStatus, PaymentStatusLabels } from "@/constants/enums";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface Props {
  status: PaymentStatus | string;
  className?: string;
}

const CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [PaymentStatus.SUCCESS]: {
    label: PaymentStatusLabels.SUCCESS,
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  [PaymentStatus.PENDING]: {
    label: PaymentStatusLabels.PENDING,
    color: "default",
    icon: <ClockCircleOutlined />,
  },
  [PaymentStatus.FAILED]: {
    label: PaymentStatusLabels.FAILED,
    color: "error",
    icon: <CloseCircleOutlined />,
  },
  [PaymentStatus.REFUNDED]: {
    label: PaymentStatusLabels.REFUNDED,
    color: "default",
    icon: <FileTextOutlined />,
  },
};

export const PaymentStatusTag: FC<Props> = ({ status, className }) => {
  const cfg = CONFIG[status] || { label: status, color: "default", icon: null };
  return (
    <BaseTag color={cfg.color} icon={cfg.icon} className={className}>
      {cfg.label}
    </BaseTag>
  );
};

export default PaymentStatusTag;
