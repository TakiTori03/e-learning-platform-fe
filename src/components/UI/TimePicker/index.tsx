import { TimePicker, TimePickerProps } from "antd";
import React, { FC } from "react";
import { StyledTimePicker } from "./style";

const CTimePicker: FC<TimePickerProps> = React.memo(({ ...rest }) => {
  return <StyledTimePicker {...(rest as any)} />;
});

export const CRangeTimePicker: FC<any> = React.memo(({ ...rest }) => {
  return <TimePicker.RangePicker style={{ minHeight: 36 }} {...rest} />;
});

export default CTimePicker;
