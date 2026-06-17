import React, { type FC } from "react";
import { Upload, message, type UploadProps } from "antd";
import { 
  InboxOutlined, 
  PlaySquareOutlined, 
  FilePdfOutlined, 
  PictureOutlined 
} from "@ant-design/icons";
import { StyledWrapUpload } from "./styles";

const { Dragger } = Upload;

export type UploadType = "video" | "image" | "document" | "all";

interface Props extends UploadProps {
  uploadType?: UploadType;
  maxSizeMB?: number; // Override giới hạn mặc định nếu cần
  children?: React.ReactNode;
}

// Cấu hình giới hạn loại file & dung lượng mặc định cho E-learning
const DEFAULT_LIMITS = {
  video: {
    maxSize: 500, // 500MB
    accepts: ["video/mp4", "video/quicktime", "video/x-matroska", "video/avi"],
    acceptsText: ".mp4, .mov, .mkv, .avi",
  },
  image: {
    maxSize: 5, // 5MB
    accepts: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    acceptsText: ".jpg, .jpeg, .png, .webp, .gif",
  },
  document: {
    maxSize: 50, // 50MB
    accepts: [
      "application/pdf",
      "application/zip",
      "application/x-zip-compressed",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ],
    acceptsText: ".pdf, .zip, .docx, .pptx",
  },
  all: {
    maxSize: 100,
    accepts: [] as string[],
    acceptsText: "*",
  }
};

export const CUpload: FC<Props> = React.memo(({ 
  uploadType = "all", 
  maxSizeMB, 
  children, 
  beforeUpload: customBeforeUpload, 
  ...rest 
}) => {

  // Tự động kiểm tra file trước khi cho phép upload
  const handleBeforeUpload = (file: any) => {
    if (uploadType !== "all") {
      const limits = DEFAULT_LIMITS[uploadType];
      
      // 1. Kiểm tra định dạng file
      const isAccepted = limits.accepts.includes(file.type) || 
        limits.accepts.some(type => file.type.startsWith(type.replace("/*", ""))) ||
        limits.acceptsText.split(", ").some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (!isAccepted) {
        message.error(`Định dạng file không hợp lệ! Vui lòng chọn file: ${limits.acceptsText}`);
        return Upload.LIST_IGNORE;
      }

      // 2. Kiểm tra dung lượng file
      const limitSize = maxSizeMB || limits.maxSize;
      const isLt = file.size / 1024 / 1024 < limitSize;
      if (!isLt) {
        message.error(`Kích thước file quá lớn! Giới hạn tối đa là ${limitSize}MB`);
        return Upload.LIST_IGNORE;
      }
    }
    
    // Nếu lập trình viên truyền thêm callback beforeUpload riêng, gọi tiếp tục
    if (customBeforeUpload) {
      return customBeforeUpload(file, [] as any);
    }
    
    return true;
  };

  // Tạo giao diện khung kéo thả mặc định tuỳ theo loại file
  const renderDefaultContent = () => {
    switch (uploadType) {
      case "video":
        return (
          <div className="flex flex-col items-center justify-center p-6 text-slate-500">
            <PlaySquareOutlined className="text-4xl text-blue-500 mb-2" />
            <p className="font-semibold text-slate-700 text-sm">Kéo thả video bài giảng hoặc bấm để chọn</p>
            <p className="text-xs text-slate-400 mt-1">Hỗ trợ định dạng MP4, MOV, MKV (Tối đa {maxSizeMB || 500}MB)</p>
          </div>
        );
      case "image":
        return (
          <div className="flex flex-col items-center justify-center p-6 text-slate-500">
            <PictureOutlined className="text-4xl text-emerald-500 mb-2" />
            <p className="font-semibold text-slate-700 text-sm">Tải lên ảnh bìa khóa học / avatar</p>
            <p className="text-xs text-slate-400 mt-1">Hỗ trợ PNG, JPG, WEBP (Tối đa {maxSizeMB || 5}MB)</p>
          </div>
        );
      case "document":
        return (
          <div className="flex flex-col items-center justify-center p-6 text-slate-500">
            <FilePdfOutlined className="text-4xl text-amber-500 mb-2" />
            <p className="font-semibold text-slate-700 text-sm">Tải lên tài liệu học tập đính kèm (Slide, PDF...)</p>
            <p className="text-xs text-slate-400 mt-1">Hỗ trợ PDF, ZIP, DOCX, PPTX (Tối đa {maxSizeMB || 50}MB)</p>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-6 text-slate-500">
            <InboxOutlined className="text-4xl text-slate-400 mb-2" />
            <p className="font-semibold text-slate-700 text-sm">Bấm hoặc kéo thả file vào khu vực này</p>
            <p className="text-xs text-slate-400 mt-1">Hỗ trợ tải lên tài nguyên khóa học</p>
          </div>
        );
    }
  };

  return (
    <StyledWrapUpload>
      <Dragger 
        beforeUpload={handleBeforeUpload} 
        accept={uploadType !== "all" ? DEFAULT_LIMITS[uploadType].acceptsText : undefined}
        {...rest}
      >
        {children || renderDefaultContent()}
      </Dragger>
    </StyledWrapUpload>
  );
});

export default CUpload;
