import React, { type FC } from "react";
import { type TagProps } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { StyledTag } from "./styles";
import { TypeTagEnum } from "./enums";
import BaseTag from "./BaseTag";

export { TypeTagEnum, BaseTag };

interface Props extends TagProps {
  children?: React.ReactNode;
  type: TypeTagEnum;
}

const IconType = {
  [TypeTagEnum.SUCCESS]: <CheckCircleOutlined />,
  [TypeTagEnum.PROCESSING]: <SyncOutlined spin />,
  [TypeTagEnum.ERROR]: <CloseCircleOutlined />,
  [TypeTagEnum.WARNING]: <ExclamationCircleOutlined />,
  [TypeTagEnum.WAITING]: <ClockCircleOutlined />,
  [TypeTagEnum.DRAFT]: <FileTextOutlined />,
};

const ColorType = {
  [TypeTagEnum.SUCCESS]: "success",
  [TypeTagEnum.PROCESSING]: "processing",
  [TypeTagEnum.ERROR]: "error",
  [TypeTagEnum.WARNING]: "warning",
  [TypeTagEnum.WAITING]: "default",
  [TypeTagEnum.DRAFT]: "default",
};

export const CTag: FC<Props> = React.memo(({ children, type, ...rest }) => {
  return (
    <StyledTag
      variant="filled"
      color={ColorType[type]}
      icon={IconType[type]}
      {...rest}
    >
      {children}
    </StyledTag>
  );
});

export default CTag;
