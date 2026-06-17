import { Modal } from "antd";
import styled from "styled-components";

export const StyledModal = styled(Modal)`
  /* Khung nội dung chính */
  && .ant-modal-content {
    padding: 0 !important; /* Đảm bảo loại bỏ padding mặc định của content để header/footer tràn viền */
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }

  /* Nút Close (X): Đặt ở vị trí góc trên bên phải */
  && .ant-modal-close {
    top: 0 !important;
    inset-inline-end: 0 !important; /* Dùng logical property và !important để ghi đè Antd v5 */
    width: 56px;
    height: 56px;
    margin: 0 !important;
    padding: 0 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    transition: background-color 0.2s, color 0.2s;
  }

  /* Khi có Header (has-header) */
  &&.has-header .ant-modal-close {
    color: rgba(255, 255, 255, 0.8) !important;
    
    &:hover, &:focus {
      color: #ffffff !important;
      background-color: rgba(255, 255, 255, 0.15) !important;
    }
  }

  /* Khi không có Header (no-header) */
  &&.no-header .ant-modal-close {
    color: rgba(15, 23, 42, 0.55) !important; /* Màu xám đậm */
    
    &:hover, &:focus {
      color: #0f172a !important;
      background-color: rgba(15, 23, 42, 0.08) !important;
    }
  }

  /* Cấu hình tiêu đề chữ trắng */
  && .ant-modal-header {
    .ant-modal-title {
      color: #ffffff !important;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.2;
    }
    .ant-modal-title * {
      color: #ffffff !important; /* Ghi đè tất cả các thẻ con bên trong tiêu đề thành chữ trắng */
    }
  }

  /* Tối ưu hóa footer */
  && .ant-modal-footer {
    padding: 16px 24px 20px 24px;
    margin-top: 0;
    border-top: 1px solid #f1f5f9;
    background-color: #f8fafc;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .ant-btn {
      border-radius: 8px;
      padding: 6px 16px;
      font-weight: 500;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
`;