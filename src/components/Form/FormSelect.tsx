import { Controller, useFormContext } from "react-hook-form";
import { Select, Form } from "antd";
import { type FC } from "react";

interface FormSelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: { label: string; value: any }[];
  disabled?: boolean;
  mode?: "multiple" | "tags";
}

export const FormSelect: FC<FormSelectProps> = ({ name, label, placeholder, options, disabled, mode }) => {
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
          <Select
            {...field}
            options={options}
            placeholder={placeholder}
            disabled={disabled}
            mode={mode}
            size="large"
            className="w-full rounded-lg"
          />
        </Form.Item>
      )}
    />
  );
};
