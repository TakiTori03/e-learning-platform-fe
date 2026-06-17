import React, { type FC } from "react";
import { BaseTag } from "@/components/UI/Tag/BaseTag";
import { UserStatus, UserStatusLabels } from "@/constants/enums";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

interface Props {
  status: UserStatus | string;
  className?: string;
}

const CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  [UserStatus.ACTIVE]: {
    label: UserStatusLabels.ACTIVE,
    color: "success",
    icon: <CheckCircleOutlined />,
  },
  [UserStatus.PENDING]: {
    label: UserStatusLabels.PENDING,
    color: "warning",
    icon: <ExclamationCircleOutlined />,
  },
  [UserStatus.LOCKED]: {
    label: UserStatusLabels.LOCKED,
    color: "error",
    icon: <CloseCircleOutlined />,
  },
  [UserStatus.REJECTED]: {
    label: UserStatusLabels.REJECTED,
    color: "error",
    icon: <CloseCircleOutlined />,
  },
};

export const UserStatusTag: FC<Props> = ({ status, className }) => {
  const cfg = CONFIG[status] || { label: status, color: "default", icon: null };
  return (
    <BaseTag color={cfg.color} icon={cfg.icon} className={className}>
      {cfg.label}
    </BaseTag>
  );
};

export default UserStatusTag;
