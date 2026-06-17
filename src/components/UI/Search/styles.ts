import { Input } from "antd";
import styled from "styled-components";
import {type  PropsCustomSearch } from "./types";

export const StyledSearch = styled(Input.Search)<PropsCustomSearch>`
  width: ${({ width }) => (width ? `${width} !important` : "100%")};
  
  .ant-input-wrapper {
    border-radius: 8px !important;
    display: flex;
    align-items: center;

    .ant-input-affix-wrapper {
      height: 40px;
      border-radius: 8px 0 0 8px !important;
      border-color: #cbd5e1;

      &:hover, &-focused {
        border-color: #2563eb !important;
      }

      .ant-input-prefix {
        margin-right: 8px;
        color: #64748b;
      }
    }

    .ant-input-group-addon {
      background-color: transparent;
      border: none;
      padding: 0;

      button {
        height: 40px !important;
        border-radius: 0 8px 8px 0 !important;
        background-color: #2563eb !important;
        border-color: #2563eb !important;
        color: #ffffff !important;
        font-weight: 500;
        box-shadow: none !important;

        &:hover {
          background-color: #1d4ed8 !important;
          border-color: #1d4ed8 !important;
        }

        &:disabled {
          background-color: #f1f5f9 !important;
          border-color: #e2e8f0 !important;
          color: #94a3b8 !important;
        }
      }
    }
    
    .ant-input {
      font-weight: 400;
      color: #1e293b;
      
      &::placeholder {
        color: #94a3b8;
      }
    }
  }
`;
