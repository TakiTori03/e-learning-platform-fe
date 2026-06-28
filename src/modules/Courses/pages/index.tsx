import { useState } from "react";
import { Col, Row, Drawer } from "antd";
import CourseList from "../components/CourseList";
import FilterSidebar from "../components/FilterSidebar";
import { useCourses } from "../queryHooks";

// Reusable Sub-components
import CatalogToolbar from "../components/CatalogToolbar";

const CoursesPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    courses,
    pagination,
    isLoading,
    filters,
    handleFilterChange,
    handlePageChange,
    clearFilters,
    meta,
  } = useCourses();

  const isFiltered = !!(
    filters.q ||
    filters.topics?.length > 0 ||
    filters.prices?.length > 0 ||
    filters.levels?.length > 0 ||
    filters.authors?.length > 0 ||
    filters.rating
  );

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="container mx-auto px-4 pt-8">
        <Row gutter={[48, 48]}>
          {/* 2. Sidebar Filters (Desktop only) */}
          <Col xs={0} md={8} lg={6} className="hidden md:block">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              aggregations={meta?.aggregations}
            />
          </Col>

          {/* 3. Catalog Toolbar & Grid list */}
          <Col xs={24} md={16} lg={18}>
            <CatalogToolbar
              sortValue={filters.sort || "mostReviews"}
              onSortChange={(value) => handleFilterChange({ sort: value })}
              isFiltered={isFiltered}
              onClearFilters={clearFilters}
              totalResults={pagination?.totalRows || 0}
              onShowFilters={() => setIsDrawerOpen(true)}
            />

            <CourseList
              courses={courses}
              loading={isLoading}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>
      </div>

      {/* Mobile/Tablet Drawer for Filters */}
      <Drawer
        title="Bộ lọc tìm kiếm"
        placement="left"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={320}
        styles={{ body: { padding: '24px 16px' } }}
      >
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          aggregations={meta?.aggregations}
          className="h-full overflow-y-auto"
        />
      </Drawer>
    </div>
  );
};

export default CoursesPage;
