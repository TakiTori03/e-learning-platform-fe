import React from "react";
import { Card, Row, Col } from "antd";
import { Search } from "lucide-react";
import type { ICategory } from "@/type";
import { CourseStatus, CourseStatusLabels } from "@/constants/enums";
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";

interface CourseFilterBarProps {
  searchText: string;
  onSearchChange: (value: string) => void;
  statusFilter: string | undefined;
  onStatusFilterChange: (value: string | undefined) => void;
  categoryFilter: string | undefined;
  onCategoryFilterChange: (value: string | undefined) => void;
  categories: ICategory[];
  extraFilters?: React.ReactNode;
}

const CourseFilterBar: React.FC<CourseFilterBarProps> = ({
  searchText,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  extraFilters,
}) => {
  return (
    <Card className="border border-gray-100 rounded-2xl shadow-sm bg-white/80 backdrop-blur-md p-0 mb-6">
      <Row gutter={[16, 16]} align="middle" className="p-4">
        <Col xs={24} md={extraFilters ? 8 : 10}>
          <CInput
            placeholder="Tìm kiếm theo tên khóa học..."
            prefix={<Search className="w-4 h-4 text-gray-400 mr-2" />}
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="rounded-xl h-11 border-gray-200"
            allowClear
          />
        </Col>
        <Col xs={12} md={extraFilters ? 5 : 7}>
          <CSelect
            placeholder="Lọc theo trạng thái"
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="w-full h-11 custom-select"
            allowClear
            style={{ height: "44px" }}
            options={Object.values(CourseStatus).map((status) => ({
              value: status,
              label: CourseStatusLabels[status],
            }))}
          />
        </Col>
        <Col xs={12} md={extraFilters ? 5 : 7}>
          <CSelect
            showSearch
            allowClear
            placeholder="Lọc theo danh mục"
            value={categoryFilter}
            onChange={onCategoryFilterChange}
            className="w-full h-11 custom-select"
            style={{ height: "44px" }}
            options={categories.map((cat) => ({
              value: cat.id,
              label: cat.name,
            }))}
          />
        </Col>
        {extraFilters && (
          <Col xs={24} md={6}>
            {extraFilters}
          </Col>
        )}
      </Row>
    </Card>
  );
};

export default CourseFilterBar;
