import { Table } from "antd";
import styled from "styled-components";

export const StyledCommonTable = styled(Table)`
  .ant-table {
    border-left: 1px solid ${({ theme }) => theme.strokeLineLight};
    border-right: 1px solid ${({ theme }) => theme.strokeLineLight};
    border-radius: 8px;
  }
  .ant-table-header {
    .ant-table-cell {
      background-color: ${({ theme }) => theme.strokeLineLight};
      .ant-typography {
        color: ${({ theme }) => theme.titleTable} !important;
      }
      .ant-typography.ant-typography-disabled {
        color: ${({ theme }) => theme.contentTableDisable} !important;
      }
    }
  }
  .ant-table-body {
    overflow: scroll !important;
  }
  .ant-table-cell {
    color: ${({ theme }) => theme.contentTable};
    height: 53px;
    padding: 14px 16px !important;
  }

  .ant-table-row-selected {
    .ant-table-cell {
      background-color: ${({ theme }) => theme.tableSelectedActive} !important;
    }
  }

  .ant-pagination {
    margin-bottom: 11px !important;
    width: 100%;
    &-total-text {
      font-weight: 500;
      line-height: 22px;
      font-size: 14px;
      color: ${({ theme }) => theme.contentPlaceholder};
      margin-right: auto;
    }
  }
  .ant-table-row.row-has-color {
    background-color: ${({ theme }) => theme.tableSelectedActive};
    .ant-table-cell-fix-right,
    .ant-table-cell-fix-left {
      background-color: ${({ theme }) => theme.tableSelectedActive};
    }
  }
  .ant-table-row {
    .ant-table-cell-row-hover {
      background-color: #f1f5f9 !important; /* Dùng slate-100 nhẹ nhàng cho hover dòng */
      .ant-table-cell-fix-right,
      .ant-table-cell-fix-left {
        background-color: #f1f5f9 !important;
      }
    }
  }
  .ant-select-dropdown {
    top: -110px !important;
  }
`;
