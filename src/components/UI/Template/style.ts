import { Pagination, Row, Slider } from "antd";
import Typography from "antd/es/typography";
import styled from "styled-components";
import CModal from "../Modal";

// 1. Text và Link hiển thị chuẩn trong bảng
export const Text = styled(Typography.Text)<{ width?: string; color?: string; disabled?: boolean }>`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  line-height: 22px;
  cursor: revert !important;
  width: ${({ width }) => (width ? width : undefined)};
  color: ${({ disabled, theme, color }) =>
    disabled
      ? theme.contentTableDisable
      : color
      ? color
      : theme.titleTable} !important;
`;

export const TextLink = styled(Typography.Text)`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  cursor: pointer !important;
  white-space: pre;
  a {
    color: ${({ theme }) => theme.primary} !important;
  }
`;

// 2. Định dạng Header & Nút bấm trang danh sách/quản lý
export const TitleHeader = styled.div`
  font-size: 24px;
  font-weight: 700;
  line-height: 29px;
  color: ${({ theme }) => theme.titleDefault};
  margin-bottom: 30px;
`;

export const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const WrapperButton = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const RowButton = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;

  button {
    min-width: 120px;
  }
`;

// 3. Form Bộ lọc (Filter)
export const WrapperFormFilter = styled(Row)`
  min-width: 50%;
`;

export const WrapperContentPopoverFilter = styled.div`
  min-width: 537px;
  max-width: 537px;
  padding: 16px 0;
`;

export const WrapperTitlePopoverFilter = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.01em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 4. Modal Chi Tiết & Các bảng điều khiển
export const TitleModal = styled.div`
  font-weight: 600;
  font-size: 18px;
`;

export const StyledModalDetail = styled(CModal)`
  .ant-divider {
    margin: 20px 0;
  }

  .titleTree {
    margin: 0px 0 20px;
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
  }

  .treeWrap {
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.strokeLineLight};
    border-radius: 8px;
    max-height: 350px;
    overflow: scroll;
    margin-bottom: 25px;

    .ant-tree-title {
      color: ${({ theme }) => theme.contentTable};
      line-height: 30px;
    }

    .ant-tree-switcher-icon {
      margin-top: 10px;
    }
  }

  .ant-tree-node-content-wrapper {
    color: ${({ theme }) => theme.buttonInput};
  }

  .clr-validate {
    color: ${({ theme }) => theme.statusRed};
  }

  .switchActive {
    margin-top: 12px;

    .ant-row {
      flex-direction: row;
    }

    .ant-form-item-label {
      padding-bottom: 0;

      label {
        padding-bottom: 0;
        line-height: 2.3;
      }
    }

    .spanActive {
      padding-left: 10px;
    }
  }

  .ant-form-item-label label {
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: ${({ theme }) => theme.contentTable} !important;
  }

  .ant-tree-checkbox-disabled {
    .ant-tree-checkbox-inner::after {
      border-color: #2d394b !important;
    }
  }
`;

export const BtnGroupFooter = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: wrap;
  button {
    min-width: 120px;
  }
`;

// 5. Thao tác trên bảng dữ liệu & Phân trang
export const WrapperActionTable = styled.div`
  .ant-btn {
    margin: 0 2.5px;
  }

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;

  .iconMore {
    cursor: pointer;
  }
`;

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;

  .iconReload {
    cursor: pointer;
    transition: all 0.25s linear;
    &:hover {
      opacity: 0.7;
    }
  }
`;

export const CPagination = styled(Pagination)`
  display: flex;
  justify-content: flex-end;
  position: relative;
  .ant-pagination-options {
    position: absolute;
    left: 0;
  }
`;

export const CButtonDownloadFile = styled.button`
  background-color: unset;
  color: #2437b1;
  cursor: pointer;
`;

// 6. Slider Tùy Chỉnh
export const CSlider = styled(Slider)`
  .ant-slider-handle {
    box-shadow: ${({ value }) => {
      const valArray = Array.isArray(value) ? value : [value];
      return valArray.includes(0)
        ? ""
        : "rgb(255, 204, 99) 0px 0px 0px 6px";
    }};
    border-radius: 50%;
    &::after {
      box-shadow: ${({ disabled }) => {
        return disabled
          ? "none !important"
          : "rgb(255, 204, 99) 0px 0px 0px 6px";
      }};
    }
  }
  .ant-slider-mark {
    top: -30px;
  }
`;

// 7. Bố cục Flex & Grid tiện dụng cho Form
interface FlexBoxType {
  gap?: number;
  vertical?: boolean;
  justify?:
    | "start"
    | "center"
    | "right"
    | "left"
    | "flex-end"
    | "end"
    | "flex-start"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch";
  align?:
    | "start"
    | "center"
    | "right"
    | "left"
    | "flex-end"
    | "end"
    | "flex-start"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch";
}

export const FlexBox = styled.div<FlexBoxType>`
  display: flex;
  justify-content: ${(props) => props.justify ?? "start"};
  align-items: ${(props) => props.align ?? "start"};
  gap: ${(props) => props.gap ?? 0}px;
  flex-direction: ${(props) => (props.vertical ? "column" : "row")};
`;

export const StyledFormInfor = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px 40px;
`;
