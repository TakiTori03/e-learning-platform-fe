import React, { useCallback, memo, type FC } from "react";
import { Form } from "antd";
import { type TextAreaProps } from "antd/es/input";
import { StyledTextArea } from "./styles";

interface Props extends TextAreaProps {
  children?: React.ReactElement | React.ReactElement[] | React.ReactNode;
  ref?: React.Ref<any>;
}

export const CTextArea: FC<Props> = memo(({ id, children, onBlur, ref, autoSize = { minRows: 3, maxRows: 6 }, ...rest }) => {
  const form = Form.useFormInstance();
  const field = id as string;

  const handleBlur = useCallback(
    (e: any) => {
      if (onBlur) {
        onBlur(e);
      } else {
        if (form && field) {
          // Tự động cắt khoảng trắng thừa (trim) khi người dùng ra khỏi ô nhập
          form.setFieldValue(field, e.target.value.trim());
          form.validateFields([field]);
        }
      }
    },
    [field, form, onBlur]
  );

  return (
    <StyledTextArea
      onBlur={handleBlur}
      autoSize={autoSize}
      {...rest}
      ref={ref}
    >
      {children}
    </StyledTextArea>
  );
});

export default CTextArea;
