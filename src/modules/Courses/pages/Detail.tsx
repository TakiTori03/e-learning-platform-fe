import { Col, Row, Tabs, Typography } from "antd";
import { memo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Syllabus from "../components/Syllabus";
import { useCourseDetail } from "../queryHooks";
import { courseApi } from "../services";

import LoadingLazy from "@/components/UI/LoadingLazy";

// Reusable Modular Sub-components
import CourseHero from "../components/CourseHero";
import CourseRequirements from "../components/CourseRequirements";
import CourseReviewsSection from "../components/CourseReviewsSection";
import CourseWillLearn from "../components/CourseWillLearn";
import InstructorProfile from "../components/InstructorProfile";
import CoursePricingCard from "../components/CoursePricingCard";
import RelatedCourses from "../components/RelatedCourses";

const { Title, Paragraph } = Typography;

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();

  const { course, sections, isLoading } = useCourseDetail(courseId || "");

  useEffect(() => {
    if (courseId) {
      courseApi.recordCourseView(courseId)
        .catch((err) => console.error("Failed to record course view:", err));
    }
  }, [courseId]);

  if (isLoading) {
    return <LoadingLazy />;
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Title level={2}>Không tìm thấy khóa học</Title>
        <Link to="/courses" className="text-primary hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const tabItems = [
    {
      key: "syllabus",
      label: "Nội dung khóa học",
      children: <Syllabus sections={sections} isBought={course.isBought} courseId={course.id} />,
    },
    {
      key: "description",
      label: "Mô tả chi tiết",
      children: (
        <div className="py-6 font-sans">
          <Paragraph className="text-base leading-relaxed whitespace-pre-wrap text-gray-600">
            {course.description}
          </Paragraph>
        </div>
      ),
    },
    {
      key: "instructor",
      label: "Giảng viên",
      children: <InstructorProfile instructor={course.instructor} />,
    },
    {
      key: "reviews",
      label: `Đánh giá (${course.numOfReviews || 0})`,
      children: (
        <CourseReviewsSection
          courseId={course.id}
          avgRating={course.avgRatingStars}
          totalReviews={course.numOfReviews}
          isBought={course.isBought}
        />
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Header chi tiết khóa học - Dải đen full width */}
      <CourseHero course={course} />

      <div className="container mx-auto px-4 py-8 lg:py-12">
        <Row gutter={[48, 48]}>
          {/* Cột trái (Nội dung chính) */}
          <Col xs={24} lg={16}>
            {/* Mobile-only Pricing Card (Chỉ hiện dưới màn hình lg) */}
            <div className="block lg:hidden my-6">
              <CoursePricingCard course={course} />
            </div>

            {/* 2. Bạn sẽ học được gì */}
            <CourseWillLearn willLearns={course.willLearns} />

            {/* 3. Yêu cầu khóa học */}
            <CourseRequirements requirements={course.requirements} />

            {/* 4. Nội dung chi tiết các tab */}
            <div className="detail-tabs-container mb-12">
              <Tabs
                items={tabItems}
                defaultActiveKey="syllabus"
                className="premium-tabs font-sans"
              />
            </div>

            {/* 5. Khóa học liên quan */}
            <RelatedCourses courseId={course.id} />
          </Col>

          <Col xs={24} lg={8} className="hidden lg:block">
            <div className="sticky top-[calc(50%+34px)] transform -translate-y-1/2 z-30 flex justify-center lg:-mt-[180px]">
              <div className="w-full max-w-[390px]">
                <CoursePricingCard course={course} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default memo(CourseDetailPage);
