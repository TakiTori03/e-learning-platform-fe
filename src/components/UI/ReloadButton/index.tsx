import React, { type FC } from "react";
import { Tooltip } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import styled, { keyframes, css } from "styled-components";

interface Props {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  loading?: boolean;
  tooltip?: string;
}

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledReloadContainer = styled.span<{ $loading?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    color: #2563eb;
    border-color: #2563eb;
    background-color: #eff6ff;
  }

  .anticon {
    font-size: 16px;
    ${({ $loading }) =>
      $loading &&
      css`
        animation: ${spin} 1s linear infinite;
      `}
  }

  ${({ $loading }) =>
    $loading &&
    css`
      pointer-events: none;
      opacity: 0.6;
      background-color: #f1f5f9;
    `}
`;

export const CReloadButton: FC<Props> = React.memo(({ onClick, loading = false, tooltip = "Làm mới dữ liệu" }) => {
  return (
    <Tooltip title={tooltip} placement="top">
      <StyledReloadContainer onClick={onClick} $loading={loading}>
        <RedoOutlined />
      </StyledReloadContainer>
    </Tooltip>
  );
});

export default CReloadButton;
