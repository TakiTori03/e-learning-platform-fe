import styled from "styled-components";

export const StyledWrapUpload = styled.div`
  width: 100%;

  /* Ẩn các nút tải xuống thừa trong danh sách file */
  .ant-upload-list-item-actions > a {
    display: none !important;
  }
  
  /* Style cho khung kéo thả (Dragger/Drag Area) */
  .ant-upload-wrapper {
    width: 100%;
  }

  .ant-upload-select {
    width: 100% !important;
  }

  .ant-upload-drag {
    border: 2px dashed #cbd5e1 !important; /* Viền nét đứt slate-300 */
    border-radius: 12px !important; /* Bo góc 12px mềm mại */
    background: #f8fafc !important; /* Nền slate-50 sạch sẽ */
    transition: all 0.25s ease !important;

    &:hover {
      border-color: #2563eb !important; /* Đổi sang màu xanh thương hiệu khi rê chuột */
      background: #eff6ff !important; /* Nền xanh lam nhạt */
    }
  }
`;
