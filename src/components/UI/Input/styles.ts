import { Input } from "antd";
import styled from "styled-components";

export const StyledInput = styled(Input)`
  height: 40px !important; /* Tăng chiều cao lên 40px tạo cảm giác cao cấp */
  font-weight: 400;
  line-height: 24px;
  border-radius: 8px !important; /* Bo góc 8px hiện đại */
  border-color: #cbd5e1; /* Viền slate-300 dịu mắt */

  &:hover {
    border-color: #2563eb !important; /* Đổi màu xanh học tập khi hover */
  }

  &:focus,
  &.ant-input-focused {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
  }

  &:disabled {
    background-color: #f8fafc !important; /* Màu nền xám nhẹ slate-50 */
    color: #475569 !important; /* Chữ xám đậm slate-600 dễ nhìn */
    cursor: not-allowed;
  }
`;
