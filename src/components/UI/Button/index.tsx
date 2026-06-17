import React, { type FC } from "react";
import type { ButtonProps } from "antd";
import { StyledButton } from "./styles";
import { TypeCustom, TypeSizeCustom } from "./enum";

interface Props extends ButtonProps {
  children?: React.ReactElement | React.ReactElement[] | React.ReactNode;
  typeCustom?: TypeCustom;
  sizeCustom?: TypeSizeCustom;
  disabledCustom?: boolean;
  activeCustom?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement> &
    React.MouseEventHandler<HTMLButtonElement>;
}

export const CButton: FC<Props> = React.memo(
  ({
    children,
    typeCustom,
    sizeCustom,
    disabledCustom,
    activeCustom,
    onClick,
    ...rest
  }) => {
    const onPress = (e: any) => {
      if (disabledCustom) return;
      if (onClick) onClick(e);
    };

    return (
      <StyledButton
        $disabledCustom={disabledCustom}
        $typeCustom={typeCustom}
        $sizeCustom={sizeCustom}
        $activeCustom={activeCustom}
        onClick={onPress}
        {...rest}
      >
        {children}
      </StyledButton>
    );
  }
);

export default CButton;
