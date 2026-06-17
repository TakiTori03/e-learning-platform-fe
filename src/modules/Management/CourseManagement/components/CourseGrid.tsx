import React from "react";
import { Card, Empty } from "antd";
import type { ICourse } from "@/type";
import CourseCard from "./CourseCard";
import { For } from "@/components/UI/Template";

interface CourseGridProps {
  courses: ICourse[];
  isLoading: boolean;
  /** Function that receives a course and returns an array of action ReactNodes for the card footer */
  renderActions: (course: ICourse) => React.ReactNode[];
}

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading,
  renderActions,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <For
          array={[1, 2, 3, 4]}
          render={(i) => (
            <Card
              key={i}
              loading={true}
              className="rounded-xl border border-gray-100 h-[380px]"
            />
          )}
        />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <Card className="rounded-xl border border-gray-100 py-12 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="space-y-1">
              <p className="text-gray-500 font-medium">
                Không tìm thấy khóa học nào
              </p>
              <p className="text-gray-400 text-xs">
                Hãy thử đổi bộ lọc hoặc thêm một khóa học mới
              </p>
            </div>
          }
        />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <For
        array={courses}
        render={(course) => (
          <CourseCard
            key={course.id}
            course={course}
            actions={renderActions(course)}
          />
        )}
      />
    </div>
  );
};

export default CourseGrid;
