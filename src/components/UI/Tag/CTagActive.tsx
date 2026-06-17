import React, { type FC } from "react";
import { Tooltip, type TagProps } from "antd";
import CTag from "./index";
import { TypeTagEnum, StatusEnum } from "./enums";

interface Props extends TagProps {
  value: number;
}

export const CTagActive: FC<Props> = React.memo(({ value, ...rest }) => {
  const isActive = value === StatusEnum.ACTIVE;
  
  return (
    <Tooltip title={isActive ? "Đang hoạt động trên hệ thống" : "Đã tạm dừng hoạt động"} placement="top">
      <CTag
        type={isActive ? TypeTagEnum.SUCCESS : TypeTagEnum.ERROR}
        {...rest}
      >
        {isActive ? "Hoạt động" : "Tạm dừng"}
      </CTag>
    </Tooltip>
  );
});

export default CTagActive;
