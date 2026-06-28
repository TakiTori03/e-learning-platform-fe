import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { CourseLevel, type ICourse } from "@/type";
import { formatFullName } from "@/utils/format";
import {
  CalendarOutlined,
  GlobalOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Col, Rate, Row, Typography } from "antd";
import { memo, useMemo } from "react";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph } = Typography;

interface CourseHeroProps {
  course: ICourse;
}

export const CourseHero = ({ course }: CourseHeroProps) => {
  const levelTagType = useMemo(() => {
    switch (course.level) {
      case CourseLevel.BEGINNER:
        return TypeTagEnum.SUCCESS;
      case CourseLevel.INTERMEDIATE:
        return TypeTagEnum.WARNING;
      case CourseLevel.ADVANCED:
        return TypeTagEnum.ERROR;
      default:
        return TypeTagEnum.SUCCESS;
    }
  }, [course.level]);

  const levelLabel = useMemo(() => {
    const map: Record<string, string> = {
      [CourseLevel.BEGINNER]: "Cơ bản",
      [CourseLevel.INTERMEDIATE]: "Trung cấp",
      [CourseLevel.ADVANCED]: "Nâng cao",
      [CourseLevel.EXPERT]: "Chuyên gia",
    };
    return map[course.level || ""] || course.level;
  }, [course.level]);

  return (
    <div className="bg-[#1c1d1f] text-white py-12 lg:py-16 font-sans">
      <div className="container mx-auto px-4">
        <Row gutter={[48, 48]}>
          <Col xs={24} lg={16}>
            <Breadcrumb
              className="mb-6 flex items-center"
              separator={
                <span style={{ color: "rgba(255,255,255,0.45)" }}>/</span>
              }
              items={[
                {
                  title: (
                    <Link
                      to="/"
                      className="!text-blue-400 hover:!text-blue-300 font-bold"
                      style={{ color: "#60a5fa" }}
                    >
                      Trang chủ
                    </Link>
                  ),
                },
                {
                  title: (
                    <Link
                      to="/courses"
                      className="!text-blue-400 hover:!text-blue-300 font-bold"
                      style={{ color: "#60a5fa" }}
                    >
                      Khóa học
                    </Link>
                  ),
                },
                {
                  title: (
                    <span
                      className="font-bold text-white/90"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {course.category?.name}
                    </span>
                  ),
                },
              ]}
            />

            <Title
              level={1}
              className="!text-white mb-6 text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight"
            >
              {course.name}
            </Title>

            <div className="flex gap-3 mb-6">
              <CTag
                type={TypeTagEnum.SUCCESS}
                className="px-3 py-1 font-bold"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#fff" }}
              >
                {course.category?.name}
              </CTag>
              <CTag
                type={levelTagType}
                className="px-3 py-1 font-bold"
                style={{
                  backgroundColor:
                    course.level === CourseLevel.BEGINNER
                      ? "rgba(46,125,50,0.15)"
                      : course.level === CourseLevel.INTERMEDIATE
                      ? "rgba(237,108,2,0.15)"
                      : "rgba(211,47,47,0.15)",
                  color:
                    course.level === CourseLevel.BEGINNER
                      ? "#81c784"
                      : course.level === CourseLevel.INTERMEDIATE
                      ? "#ffb74d"
                      : "#e57373",
                }}
              >
                {levelLabel}
              </CTag>
            </div>

            <Paragraph className="!text-white text-xl opacity-90 mb-10 max-w-3xl leading-relaxed font-medium italic">
              {course.subTitle ||
                (course.description &&
                  course.description.slice(0, 180) + "...")}
            </Paragraph>

            <div className="flex flex-wrap items-center gap-6 mb-8 text-sm lg:text-base">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded border border-white/10">
                <span className="text-yellow-400 font-bold text-lg">
                  {course.avgRatingStars || 5.0}
                </span>
                <Rate
                  disabled
                  defaultValue={course.avgRatingStars || 5}
                  className="text-xs"
                />
                <Link
                  to="#reviews"
                  className="text-blue-300 underline decoration-blue-300/30 ml-1"
                >
                  ({course.numOfReviews || 0} đánh giá)
                </Link>
              </div>
              <Text className="!text-white font-medium">
                {course.studentCount?.toLocaleString() || 0} học viên đã tham gia
              </Text>
            </div>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 mb-4 text-sm">
              <span className="flex items-center gap-2 !text-white opacity-90">
                <UserOutlined className="text-[#a435f0] text-lg" /> Giảng viên:{" "}
                <Text
                  strong
                  className="cursor-pointer underline decoration-white/30 hover:text-blue-300 transition-colors"
                  style={{ color: "#60a5fa" }}
                >
                  {course.instructor && formatFullName(course.instructor)}
                </Text>
              </span>
              <span className="flex items-center gap-3 !text-white opacity-90">
                <CalendarOutlined className="text-[#a435f0] text-lg" /> Cập nhật mới nhất:{" "}
                <span style={{ color: "white" }}>
                  {new Date(course.updatedAt || "").toLocaleDateString("vi-VN")}
                </span>
              </span>
              <span className="flex items-center gap-2 !text-white opacity-90">
                <GlobalOutlined className="text-[#a435f0] text-lg" />
                <span style={{ color: "white" }}> Tiếng Việt</span>
              </span>
            </div>
          </Col>

          <Col xs={24} lg={8} className="relative mt-8 lg:mt-0">
            {/* Empty column on desktop, placeholder for the absolute pricing card */}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default memo(CourseHero);
