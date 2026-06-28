import { For } from "@/components/UI/Template";
import type { AnyElement, ICourse } from "@/type";
import { Col, Empty, Pagination, Row } from "antd";
import { memo } from "react";
import CourseCard from "./CourseCard";

interface CourseListProps {
  courses: ICourse[];
  loading: boolean;
  pagination?: {
    limit: number;
    totalRows: number;
    page: number;
  };
  onPageChange: (page: number) => void;
}

const CourseList = ({
  courses,
  loading,
  pagination,
  onPageChange,
}: CourseListProps) => {
  if (!loading && courses.length === 0) {
    return (
      <div className="bg-white p-20 rounded-2xl shadow-sm text-center">
        <Empty description="Không tìm thấy khóa học nào khớp với bộ lọc của bạn" />
      </div>
    );
  }

  const items = loading ? Array.from({ length: 8 }) : courses;

  return (
    <div className="flex flex-col gap-8">
      <Row gutter={[24, 32]}>
        <For
          array={items}
          render={(item: AnyElement, index) => (
            <Col xs={24} sm={12} lg={8} key={item?.id || index}>
              <CourseCard item={item} loading={loading} />
            </Col>
          )}
        />
      </Row>

      {pagination && pagination.totalRows > 0 && (
        <div className="flex justify-center py-8">
          <Pagination
            current={pagination.page}
            pageSize={pagination.limit}
            total={pagination.totalRows}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default memo(CourseList);
