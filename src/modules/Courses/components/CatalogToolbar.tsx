import { memo } from "react";
import { Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import CButton from "@/components/UI/Button";
import CSelect from "@/components/UI/Select";

const { Text } = Typography;

interface CatalogToolbarProps {
  sortValue: string;
  onSortChange: (value: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  totalResults: number;
}

const sortOptions = [
  { label: "Most Reviews", value: "mostReviews" },
  { label: "Most Enrolled", value: "mostEnrolled" },
  { label: "Newest", value: "newest" },
];

export const CatalogToolbar = ({
  sortValue,
  onSortChange,
  isFiltered,
  onClearFilters,
  totalResults,
}: CatalogToolbarProps) => {
  return (
    <div className="mb-6 flex justify-between items-center border-b border-gray-100 pb-4">
      <div className="flex items-center gap-4">
        <CButton className="rounded-md bg-gray-50 border-gray-200 text-gray-600">
          Sort
        </CButton>
        <CSelect
          value={sortValue}
          style={{ width: 220 }}
          onChange={onSortChange}
          className="custom-select"
          options={sortOptions}
        />

        {isFiltered && (
          <CButton
            type="link"
            onClick={onClearFilters}
            className="text-gray-400 hover:text-gray-600 p-0 flex items-center gap-1 text-sm ml-2"
          >
            Clear Filters <CloseCircleOutlined style={{ fontSize: 12 }} />
          </CButton>
        )}
      </div>

      <Text className="text-gray-500 text-sm">
        {totalResults} results
      </Text>
    </div>
  );
};

export default memo(CatalogToolbar);
