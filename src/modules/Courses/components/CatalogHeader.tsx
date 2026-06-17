import { memo } from "react";
import { Typography } from "antd";

const { Title } = Typography;

export const CatalogHeader = () => {
  return (
    <div className="py-5">
      <div className="container mx-auto px-4 text-center">
        <Title level={1} className="m-0 text-5xl font-bold text-[#1a2b4b]">
          Find your best courses
        </Title>
      </div>
    </div>
  );
};

export default memo(CatalogHeader);
