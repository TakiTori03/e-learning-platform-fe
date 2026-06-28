import { Button, Col, Row, Typography } from "antd";
import { memo, useState } from "react";
import { useRelatedCourses } from "../queryHooks";
import CourseCard from "./CourseCard";

const { Title, Paragraph } = Typography;

interface RelatedCoursesProps {
  courseId: string;
}

const RelatedCourses = ({ courseId }: RelatedCoursesProps) => {
  const [visibleCount, setVisibleCount] = useState(3);
  const { data: relatedCourses, isLoading: isRelatedLoading } = useRelatedCourses(courseId, 12);

  if (!isRelatedLoading && (!relatedCourses || relatedCourses.length === 0)) {
    return null;
  }

  return (
    <div className="border-t border-gray-100 py-12 mt-8 font-sans">
      <div className="mb-8">
        <Title level={2} className="m-0 text-xl lg:text-2xl font-black text-gray-800 tracking-tight">
          Khóa học liên quan
        </Title>
        <Paragraph className="text-gray-500 mt-1.5 text-xs lg:text-sm">
          Các khóa học cùng danh mục hấp dẫn dành cho bạn
        </Paragraph>
      </div>

      <Row gutter={[20, 20]}>
        {isRelatedLoading
          ? Array.from({ length: visibleCount }).map((_, idx) => (
              <Col xs={24} sm={12} md={8} key={idx}>
                <CourseCard item={{}} loading={true} />
              </Col>
            ))
          : relatedCourses?.slice(0, visibleCount).map((item) => (
              <Col xs={24} sm={12} md={8} key={item.id}>
                <CourseCard item={item} loading={false} />
              </Col>
            ))}
      </Row>

      {relatedCourses && relatedCourses.length > visibleCount && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="h-10 px-8 rounded-full border border-gray-300 text-gray-700 hover:text-blue-500 hover:border-blue-500 font-bold transition-all"
          >
            Tải thêm {Math.min(6, relatedCourses.length - visibleCount)} khóa học
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(RelatedCourses);
