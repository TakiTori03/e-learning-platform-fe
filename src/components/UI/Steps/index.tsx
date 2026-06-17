import React, { type FC } from "react";
import type { StepsProps } from "antd";
import { StyledSteps } from "./styles";

interface Props extends StepsProps {
  children?: React.ReactNode;
}

export const CSteps: FC<Props> = React.memo(({ children, ...rest }) => {
  return <StyledSteps {...rest}>{children}</StyledSteps>;
});

export default CSteps;
