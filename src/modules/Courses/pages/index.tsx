import { Col, Row } from "antd";
import FilterSidebar from "../components/FilterSidebar";
import CourseList from "../components/CourseList";
import { useCourses } from "../queryHooks";

// Reusable Sub-components
import CatalogToolbar from "../components/CatalogToolbar";

const CoursesPage = () => {
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
          {/* 2. Sidebar Filters */}
          <Col xs={24} md={8} lg={6}>
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
    </div>
  );
};

export default CoursesPage;
