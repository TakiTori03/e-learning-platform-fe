import { formatFullName } from "@/utils/format";
import { Checkbox, Space, Typography, Rate, Radio } from "antd";
import type { AnyElement } from "@/type";
import { memo } from "react";
import CSelect from "@/components/UI/Select";
import { For } from "@/components/UI/Template";
import { useAllCategories, useAllInstructors } from "../queryHooks/useCourseQueries";

const { Text } = Typography;

interface FilterSidebarProps {
  filters: AnyElement;
  onFilterChange: (filters: AnyElement) => void;
  aggregations?: {
    levels?: Record<string, number>;
    categories?: Record<string, number>;
    prices?: Record<string, number>;
  };
}

const FilterSidebar = ({ filters, onFilterChange, aggregations }: FilterSidebarProps) => {
  const { data: catData } = useAllCategories();
  const { data: instructorData } = useAllInstructors();

  const categories = catData?.content || [];
  const instructors = instructorData || [];

  return (
    <div className="h-fit sticky top-24 pr-4">
      {/* Authors */}
      <div className="mb-8">
        <Text strong className="block mb-3 text-[1.1rem]">
          Authors
        </Text>
        <CSelect
          mode="multiple"
          className="w-full h-10"
          placeholder="Select authors to filter!"
          value={filters.authors}
          onChange={(values) => onFilterChange({ authors: values })}
          options={instructors.map((inst: AnyElement) => ({
            label: formatFullName(inst),
            value: inst.id,
          }))}
        />
      </div>

      {/* Level */}
      <div className="mb-8 font-serif">
        <Text strong className="block mb-3 text-[1.1rem]">
          Level
        </Text>
        <Checkbox.Group
          className="w-full"
          value={filters.levels}
          onChange={(values) => onFilterChange({ levels: values })}
        >
          <Space
            direction="vertical"
            className="w-full text-gray-500 font-normal"
          >
            <Checkbox value="ALL">All Level</Checkbox>
            <Checkbox value="BEGINNER">Beginner {aggregations?.levels?.BEGINNER !== undefined ? `(${aggregations.levels.BEGINNER})` : ""}</Checkbox>
            <Checkbox value="INTERMEDIATE">Intermediate {aggregations?.levels?.INTERMEDIATE !== undefined ? `(${aggregations.levels.INTERMEDIATE})` : ""}</Checkbox>
            <Checkbox value="ADVANCED">Advanced {aggregations?.levels?.ADVANCED !== undefined ? `(${aggregations.levels.ADVANCED})` : ""}</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* Price */}
      <div className="mb-8">
        <Text strong className="block mb-3 text-[1.1rem]">
          Price
        </Text>
        <Checkbox.Group
          className="w-full"
          value={filters.prices}
          onChange={(values) => onFilterChange({ prices: values })}
        >
          <Space
            direction="vertical"
            className="w-full text-gray-500 font-normal"
          >
            <Checkbox value="free">Free {aggregations?.prices?.free !== undefined ? `(${aggregations.prices.free})` : ""}</Checkbox>
            <Checkbox value="paid">Paid {aggregations?.prices?.paid !== undefined ? `(${aggregations.prices.paid})` : ""}</Checkbox>
          </Space>
        </Checkbox.Group>
      </div>

      {/* Topic course */}
      <div className="mb-8">
        <Text strong className="block mb-3 text-[1.1rem]">
          Topic course
        </Text>
        <CSelect
          mode="multiple"
          className="w-full h-10"
          placeholder="Select topics to filter!"
          value={filters.topics}
          onChange={(values) => onFilterChange({ topics: values })}
          options={categories.map((cat: AnyElement) => {
            const count = aggregations?.categories?.[cat.id];
            return {
              label: count !== undefined ? `${cat.name} (${count})` : cat.name,
              value: cat.id,
            };
          })}
        />
      </div>

      {/* Course Ratings */}
      <div className="mb-8">
        <Text strong className="block mb-3 text-[1.1rem]">
          Course Ratings
        </Text>
        <Radio.Group
          className="w-full"
          value={filters.rating}
          onChange={(e) =>
            onFilterChange({ rating: (e.target as AnyElement).value })
          }
        >
          <Space direction="vertical" className="w-full">
            <For
              array={[4.5, 4.0, 3.5, 3.0]}
              render={(r) => (
                <Radio
                  key={r}
                  value={r.toString()}
                  className="flex items-center text-sm text-gray-400"
                >
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={r}
                    style={{ fontSize: 13, marginRight: 8 }}
                  />
                  <span className="text-gray-600">{r} & up</span>
                </Radio>
              )}
            />
          </Space>
        </Radio.Group>
      </div>
    </div>
  );
};

export default memo(FilterSidebar);
