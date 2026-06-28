import { Popconfirm, type PopconfirmProps } from "antd";
import React, { type FC, type ReactNode } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";

interface CPopconfirmProps extends PopconfirmProps {
  children?: ReactNode;
}

export const CPopconfirm: FC<CPopconfirmProps> = React.memo(({
  children,
  title,
  description,
  okText = "Xác nhận",
  cancelText = "Hủy",
  icon = <QuestionCircleOutlined style={{ color: "var(--ant-color-warning, #f59e0b)" }} />,
  okButtonProps,
  cancelButtonProps,
  ...rest
}) => {
  // Merge default premium button props to match our design system
  const mergedOkButtonProps = {
    danger: rest.okType === "danger",
    style: { borderRadius: "6px" },
    ...okButtonProps,
  };

  const mergedCancelButtonProps = {
    style: { borderRadius: "6px" },
    ...cancelButtonProps,
  };

  return (
    <Popconfirm
      title={title}
      description={description}
      okText={okText}
      cancelText={cancelText}
      icon={icon}
      okButtonProps={mergedOkButtonProps}
      cancelButtonProps={mergedCancelButtonProps}
      {...rest}
    >
      {children}
    </Popconfirm>
  );
});

CPopconfirm.displayName = "CPopconfirm";

export default CPopconfirm;
