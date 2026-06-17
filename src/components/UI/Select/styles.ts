import styled from "styled-components";

export const StyledWrapSelect = styled("div")<{ $maxRow?: number }>`
  min-height: 40px; /* Tăng từ 36px lên 40px đồng bộ với Input */
  
  .ant-select {
    box-shadow: none !important;
    width: 100%;
  }
  
  .ant-select-selector {
    padding: 0 16px 0 8px !important;
    min-height: 40px !important;
    border-radius: 8px !important; /* Bo góc 8px đồng bộ */
    border-color: #cbd5e1 !important;
    display: flex;
    align-items: center;

    input {
      height: 36px !important;
    }
  }

  .ant-select-focused .ant-select-selector {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
  }

  .ant-select-selection-item {
    color: #1e293b !important; /* Chữ tối slate-800 */
    font-weight: 500;
    display: flex;
    align-items: center;
  }

  .ant-select-selection-placeholder {
    display: flex;
    align-items: center;
    color: #94a3b8 !important; /* Placeholder màu slate-400 */
  }

  ${({ $maxRow }) =>
    $maxRow &&
    $maxRow > 1 &&
    `
    .ant-select-selection-overflow {
      max-height: ${$maxRow * 34}px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
  `}
`;
