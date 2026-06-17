import React, { useState } from "react";
import { FolderOpenOutlined } from "@ant-design/icons";

interface CategoryIconProps {
  src?: string | null;
  alt: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ src, alt, size = 40 }) => {
  const [prevSrc, setPrevSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const isValidUrl = src && (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/"));

  return (
    <div
      className="flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: size <= 40 ? 10 : 16,
        background: "linear-gradient(135deg, #f0f5ff 0%, #e8ecf4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {isValidUrl && !hasError ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover p-1.5"
          onError={() => setHasError(true)}
        />
      ) : (
        <FolderOpenOutlined style={{ fontSize: size <= 40 ? 20 : 28, color: "#2563eb" }} />
      )}
    </div>
  );
};

export default CategoryIcon;
