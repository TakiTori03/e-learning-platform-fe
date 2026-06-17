import React, { type FC } from "react";
import { BaseTag } from "@/components/UI/Tag/BaseTag";
import { OrderStatus, OrderStatusLabels } from "@/constants/enums";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

interface Props {
  status: OrderStatus | "PAID" | string;
  className?: string;
}

const CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [OrderStatus.COMPLETED]: {
    label: OrderStatusLabels.COMPLETED,
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  [OrderStatus.PENDING]: {
    label: OrderStatusLabels.PENDING,
    color: "warning",
    icon: <ClockCircleOutlined />,
  },
  [OrderStatus.CANCELLED]: {
    label: OrderStatusLabels.CANCELLED,
    color: "error",
    icon: <CloseCircleOutlined />,
  },
  [OrderStatus.PAYMENT_SUCCESS]: {
    label: OrderStatusLabels.PAYMENT_SUCCESS,
    color: "processing",
    icon: <SyncOutlined spin />,
  },
  [OrderStatus.FAILED]: {
    label: OrderStatusLabels.FAILED,
    color: "error",
    icon: <CloseCircleOutlined />,
  },
  [OrderStatus.REFUNDED]: {
    label: OrderStatusLabels.REFUNDED,
    color: "default",
    icon: <FileTextOutlined />,
  },
  PAID: {
    label: "Đã thanh toán",
    color: "success",
    icon: <CheckCircleOutlined />,
  },
};

export const OrderStatusTag: FC<Props> = ({ status, className }) => {
  const cfg = CONFIG[status] || { label: status, color: "default", icon: null };
  return (
    <BaseTag color={cfg.color} icon={cfg.icon} className={className}>
      {cfg.label}
    </BaseTag>
  );
};

export default OrderStatusTag;
