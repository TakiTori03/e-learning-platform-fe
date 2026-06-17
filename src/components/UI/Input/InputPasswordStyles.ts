import { Input } from "antd";
import styled from "styled-components";

export const StyledInputPass = styled(Input.Password)`
  height: 40px !important; /* Chiều cao đồng bộ 40px */
  border-radius: 8px !important; /* Bo góc 8px */
  border-color: #cbd5e1;

  &:hover {
    border-color: #2563eb !important;
  }

  &:focus,
  &.ant-input-affix-wrapper-focused {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
  }
`;
