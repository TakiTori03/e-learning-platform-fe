import { Controller, useFormContext } from "react-hook-form";
import { Input, Form } from "antd";
import { type FC } from "react";

interface FormInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  disabled?: boolean;
}

export const FormInput: FC<FormInputProps> = ({ name, label, placeholder, type = "text", disabled }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          validateStatus={error ? "error" : ""}
          help={error?.message}
          className="mb-4 w-full"
        >
          {type === "password" ? (
            <Input.Password
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              size="large"
              className="rounded-lg"
            />
          ) : (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              size="large"
              className="rounded-lg"
            />
          )}
        </Form.Item>
      )}
    />
  );
};
