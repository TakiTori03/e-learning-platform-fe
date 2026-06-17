import { type ModalProps } from "antd";
import React, { type FC, type ReactNode } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { StyledModal } from "./styles";

interface Props extends ModalProps {
  children?: ReactNode;
}

export const CModal: FC<Props> = React.memo(({ children, styles: userStyles, className = "", ...rest }) => {
  const hasTitle = !!rest.title;
  const combinedClassName = `${hasTitle ? "has-header" : "no-header"} ${className}`;

  // Định nghĩa layout style chuẩn khít theo UI mẫu
  const defaultStyles = {
    container: {
      padding: 0,
      overflow: "hidden",
      borderRadius: "12px",
    },
    header: hasTitle ? {
      padding: "16px 24px",
      marginBottom: 0,
      background: "var(--ant-color-primary, #2563eb)",
      height: "56px",
      display: "flex",
      alignItems: "center",
      borderBottom: "none",
    } : undefined,
    body: {
      padding: "24px",
    },
    footer: {
      padding: "12px 24px 20px 24px",
      margin: 0,
    }
  };

  const userStylesObj = typeof userStyles === "object" ? userStyles : undefined;
  const mergedStyles = {
    ...defaultStyles,
    ...userStylesObj,
    container: { ...defaultStyles.container, ...userStylesObj?.container },
    header: defaultStyles.header ? { ...defaultStyles.header, ...userStylesObj?.header } : userStylesObj?.header,
    body: { ...defaultStyles.body, ...userStylesObj?.body },
    footer: { ...defaultStyles.footer, ...userStylesObj?.footer },
  };

  return (
    <StyledModal
      centered
      closeIcon={<CloseOutlined style={{ fontSize: "16px" }} />} // Định kích thước icon X vừa vặn
      styles={mergedStyles}
      className={combinedClassName}
      mask={{ closable: false }}
      {...rest}
    >
      {children}
    </StyledModal>
  );
});

CModal.displayName = "CModal";

export default CModal;