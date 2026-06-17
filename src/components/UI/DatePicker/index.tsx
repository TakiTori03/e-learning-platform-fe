import { DatePicker, DatePickerProps, Form } from "antd";
import { RangePickerProps } from "antd/es/date-picker/generatePicker/interface";
import dayjs from "dayjs";
import React, { FC, FocusEvent, MouseEvent } from "react";

const { RangePicker } = DatePicker;

const CDatePicker: FC<DatePickerProps> = React.memo(
  ({ id, onClick, format, style, ...rest }) => {
    const form = Form.useFormInstance();
    const field = id as string;

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      if (form && (e.target as HTMLInputElement).value) {
        form?.validateFields([field]);
        form?.setFieldValue(
          field,
          dayjs((e.target as HTMLInputElement).value, format as string)
        );
      }
      onClick && onClick(e);
    };

    return (
      <DatePicker
        style={{ minHeight: "36px", ...style }}
        onClick={handleClick}
        format={format}
        {...rest}
      />
    );
  }
);

export default CDatePicker;

export const CRangePicker: FC<RangePickerProps> = React.memo(
  ({ id, children, onBlur, style, ...rest }) => {
    const form = Form.useFormInstance();
    const field = id as string;
    const handleBlur = (
      e: FocusEvent<HTMLElement>,
      info: {
        range?: "start" | "end";
      }
    ) => {
      form && form?.validateFields([field]);
      onBlur && onBlur(e, info);
    };
    return (
      <RangePicker
        onBlur={handleBlur}
        style={{ minHeight: "36px", ...style }}
        {...rest}
      >
        {children}
      </RangePicker>
    );
  }
);
