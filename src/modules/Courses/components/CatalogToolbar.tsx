import CButton from "@/components/UI/Button";
import CSelect from "@/components/UI/Select";
import { CloseCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { memo } from "react";

const { Text } = Typography;

interface CatalogToolbarProps {
  sortValue: string;
  onSortChange: (value: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  totalResults: number;
  onShowFilters?: () => void;
}

const sortOptions = [
  { label: "Đánh giá cao nhất", value: "mostReviews" },
  { label: "Đăng ký nhiều nhất", value: "mostEnrolled" },
  { label: "Mới nhất", value: "newest" },
];

export const CatalogToolbar = ({
  sortValue,
  onSortChange,
  isFiltered,
  onClearFilters,
  totalResults,
  onShowFilters,
}: CatalogToolbarProps) => {
  return (
    <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-4">
      <div className="flex flex-wrap items-center gap-3">
        <CButton
          icon={<FilterOutlined />}
          onClick={onShowFilters}
          className="md:hidden rounded-md bg-gray-50 border-gray-200 text-gray-600 flex items-center justify-center font-semibold"
        >
          Bộ lọc
        </CButton>
        <CSelect
          value={sortValue}
          style={{ width: 220 }}
          onChange={onSortChange}
          className="custom-select"
          options={sortOptions}
        />

        {isFiltered && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm ml-2 cursor-pointer border-none bg-transparent self-center h-[32px]"
          >
            <span>Xóa bộ lọc</span>
            <CloseCircleOutlined style={{ fontSize: 12 }} />
          </button>
        )}
      </div>

      <Text className="text-gray-500 text-sm self-start sm:self-center font-medium">
        Tìm thấy {totalResults} kết quả
      </Text>
    </div>
  );
};

export default memo(CatalogToolbar);
