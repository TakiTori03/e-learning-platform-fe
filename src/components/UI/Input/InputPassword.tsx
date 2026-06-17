import { type PasswordProps } from "antd/es/input";
import React, { type FC } from "react";
import { StyledInputPass } from "./InputPasswordStyles";
import { Form } from "antd";

interface Props extends PasswordProps {
  children?: React.ReactElement | React.ReactElement[] | React.ReactNode;
}

export const CInputPassword: FC<Props> = React.memo(({ id, onBlur, ...rest }) => {
  const form = Form.useFormInstance();
  const field = id as string;
  
  const handleBlur = (e: any) => {
    if (onBlur) {
      onBlur(e);
    } else {
      if (form) {
        form.validateFields([field]);
      }
    }
  };
  
  return <StyledInputPass {...rest} onBlur={handleBlur} />;
});

export default CInputPassword;
