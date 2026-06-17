import React, { useCallback, memo, type FC } from "react";
import { Form, type InputProps } from "antd";
import { StyledInput } from "./styles";

interface Props extends InputProps {
  children?: React.ReactElement | React.ReactElement[] | React.ReactNode;
  ref?: React.Ref<any>;
}

export const CInput: FC<Props> = memo(({ id, children, onBlur, ref, ...rest }) => {
  const form = Form.useFormInstance();
  const field = id as string;

  const handleBlur = useCallback(
    (e: any) => {
      if (onBlur) {
        onBlur(e);
      } else {
        if (form) {
          // Tự động cắt khoảng trắng thừa (trim) khi người dùng ra khỏi ô nhập
          form.setFieldValue(field, e.target.value.trim());
          form.validateFields([field]);
        }
      }
    },
    [field, form, onBlur]
  );

  return (
    <StyledInput onBlur={handleBlur} {...rest} ref={ref}>
      {children}
    </StyledInput>
  );
});

export default CInput;
export { default as CInputPassword } from "./InputPassword";
