import { Form, Select, type SelectProps } from "antd";
import React, { type FC } from "react";
import { StyledWrapSelect } from "./styles";

interface Props extends SelectProps {
  children?: React.ReactNode;
  maxCount?: number;
  maxRow?: number;
}

const filterSelect = (input: string, option: any) => {
  const searchText = input?.toLowerCase() ?? "";
  const label = option?.label?.toLowerCase() ?? "";
  const value = option?.value?.toString().toLowerCase() ?? "";
  // Tìm kiếm thông minh trên cả nhãn hiển thị lẫn giá trị thực tế của option
  return label.includes(searchText) || value.includes(searchText);
};

export const CSelect: FC<Props> = React.memo(
  ({ id, onBlur, children, filterOption, maxRow, ...rest }) => {
    const form = Form?.useFormInstance();
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
    
    return (
      <StyledWrapSelect $maxRow={maxRow}>
        <Select
          onBlur={handleBlur}
          filterOption={filterOption || filterSelect}
          {...rest}
        >
          {children}
        </Select>
      </StyledWrapSelect>
    );
  }
);

export default CSelect;
