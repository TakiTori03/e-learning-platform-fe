import { useParams, Link } from "react-router-dom";
import { Typography, Row, Col, Tabs } from "antd";
import { useCourseDetail } from "../queryHooks";
import Syllabus from "../components/Syllabus";
import { memo, useEffect } from "react";
import { courseApi } from "../services";

import LoadingLazy from "@/components/UI/LoadingLazy";

// Reusable Modular Sub-components
import CourseHero from "../components/CourseHero";
import CourseWillLearn from "../components/CourseWillLearn";
import CourseRequirements from "../components/CourseRequirements";
import InstructorProfile from "../components/InstructorProfile";
import CourseReviewsSection from "../components/CourseReviewsSection";

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
      children: <Syllabus sections={sections} />,
    },
    {
      key: "description",
      label: "Mô tả chi tiết",
      children: (
        <div className="py-6">
          <Paragraph className="text-lg leading-relaxed whitespace-pre-wrap text-gray-600">
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
      {/* 1. Dark Top Banner (Hero & Pricing Card) */}
      <CourseHero course={course} />

      {/* 2. Course Body Content */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <Row gutter={[64, 64]}>
          <Col xs={24} lg={16}>
            {/* 2.1. Objectives / What you will learn */}
            <CourseWillLearn willLearns={course.willLearns} />

            {/* 2.2. Requirements */}
            <CourseRequirements requirements={course.requirements} />

            {/* 2.3. Core Curriculum / Syllabus / Bio Tabs */}
            <div className="detail-tabs-container mb-12">
              <Tabs
                items={tabItems}
                defaultActiveKey="syllabus"
                className="premium-tabs"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default memo(CourseDetailPage);
