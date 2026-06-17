import { Steps } from "antd";
import styled from "styled-components";

export const StyledSteps = styled(Steps)`
  /* Căn lại vị trí của đường kẻ nối giữa các bước */
  .ant-steps-item-tail {
    top: unset !important;
  }

  /* Nâng kích thước chữ của tiêu đề bước cho thoáng và rõ ràng */
  .ant-steps-item-title {
    font-size: 16px !important;
    font-weight: 600 !important;
  }
`;
