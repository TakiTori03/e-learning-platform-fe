import { Tag } from "antd";
import styled from "styled-components";

export const StyledTag = styled(Tag)`
  font-weight: 500;
  font-size: 13px;
  line-height: 20px;
  padding: 2px 8px;
  border-radius: 6px !important;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  /* Reset antd custom icons size */
  .anticon {
    font-size: 12px;
  }
`;
