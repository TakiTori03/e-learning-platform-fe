import React, { type FC } from "react";
import { type TagProps } from "antd";
import { StyledTag } from "./styles";

export interface BaseTagProps extends TagProps {
  icon?: React.ReactNode;
}

export const BaseTag: FC<BaseTagProps> = React.memo(({ children, ...rest }) => {
  return (
    <StyledTag variant="filled" {...rest}>
      {children}
    </StyledTag>
  );
});

export default BaseTag;
