import CButton from "@/components/UI/Button";
import LoadingLazy from "@/components/UI/LoadingLazy";
import { For, Show } from "@/components/UI/Template";
import {
  BookOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Card, Col, Empty, Progress, Row, Space } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyLearning } from "../queryHooks";
import dayjs from "dayjs";
import { formatDate, formatStudyTime } from "@/utils/format";

export const MyLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const { enrolledCourses, isLoading } = useMyLearning();

  if (isLoading) {
    return <LoadingLazy />;
  }

  // Calculate statistics
  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (c) => c.isCompleted || c.progress === 100
  ).length;
  const inProgressCourses = totalCourses - completedCourses;

  return (
    <div className="min-h-[85vh] bg-slate-50/50 pb-16">
      {/* Stats Header Section */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-6 md:px-12 mb-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
              Khóa học của tôi
            </h1>
            <p className="text-slate-500 text-sm mt-1.5 m-0 font-medium">
              Quản lý và theo dõi tiến độ học tập của bạn
            </p>
          </div>
          <div className="flex items-center bg-slate-50/80 border border-slate-100 rounded-2xl p-4 shadow-inner divide-x divide-slate-200">
            <div className="px-6 text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-600">
                {totalCourses}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Khóa học
              </div>
            </div>
            <div className="px-6 text-center">
              <div className="text-xl md:text-2xl font-bold text-emerald-600">
                {completedCourses}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Hoàn thành
              </div>
            </div>
            <div className="px-6 text-center">
              <div className="text-xl md:text-2xl font-bold text-orange-600">
                {inProgressCourses}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                Đang học
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Content Section */}
        <Show>
          <Show.When isTrue={enrolledCourses.length === 0}>
            <Card className="text-center py-20 border-dashed border-2 rounded-3xl bg-white shadow-sm max-w-2xl mx-auto border-slate-200">
              <Empty
                image={
                  <BookOutlined style={{ fontSize: 72, color: "#cbd5e1" }} />
                }
                description={
                  <Space direction="vertical" size="large" className="mt-4 w-full">
                    <span className="text-slate-500 text-lg font-semibold block">
                      Bạn chưa đăng ký khóa học nào
                    </span>
                    <Link to="/courses">
                      <CButton
                        type="primary"
                        size="large"
                        className="rounded-full px-8 font-bold text-white shadow-md transition-all duration-200"
                      >
                        Khám phá khóa học ngay
                      </CButton>
                    </Link>
                  </Space>
                }
              />
            </Card>
          </Show.When>
          <Show.Else>
            <Row gutter={[24, 24]}>
              <For
                array={enrolledCourses}
                render={(item) => {
                  const progressPercent = Math.round(item.progress || 0);
                  const isCompleted = item.isCompleted || progressPercent === 100;
                  const totalLessons = item.lessonCount || 0;
                  const completedLessons = Math.round(
                    (progressPercent / 100) * totalLessons
                  );

                  // Formatting dates and durations using utils/format
                  const formattedRegDate = formatDate(item.createdAt) || "15/01/2026";
                  const studyTimeStr = formatStudyTime(item.totalVideosLength || 36000); // 36000s = 10 hours fallback

                  // Level mapping
                  let levelLabel = "Cơ bản";
                  let levelClass = "bg-blue-50 text-blue-600 border-blue-100";
                  if (item.level === "INTERMEDIATE") {
                    levelLabel = "Trung cấp";
                    levelClass = "bg-amber-50 text-amber-600 border-amber-100";
                  } else if (item.level === "ADVANCED" || item.level === "EXPERT") {
                    levelLabel = "Nâng cao";
                    levelClass = "bg-rose-50 text-rose-500 border-rose-100";
                  }

                  return (
                    <Col xs={24} md={12} lg={8} key={item.id}>
                      <Card
                        hoverable
                        className="h-full rounded-2xl overflow-hidden border-slate-100 hover:border-blue-500/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white"
                        styles={{
                          body: {
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          },
                        }}
                        cover={
                          <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                            <img
                              src={
                                item.thumbnail ||
                                "https://via.placeholder.com/400x225"
                              }
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                            />
                            {/* Top Left Status Badge */}
                            <span
                              className={`absolute top-3 left-3 text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${
                                isCompleted
                                  ? "bg-emerald-500 text-white"
                                  : "bg-blue-600 text-white"
                              }`}
                            >
                              {isCompleted ? "Hoàn thành" : "Đang học"}
                            </span>
                          </div>
                        }
                      >
                        <div className="flex-1 flex flex-col gap-3">
                          {/* Badges & Date Row */}
                          <div className="flex items-center justify-between mt-1">
                            <span
                              className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${levelClass}`}
                            >
                              {levelLabel}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                              <CalendarOutlined className="text-slate-350" />
                              Đăng ký: {formattedRegDate}
                            </span>
                          </div>

                          {/* Course Title */}
                          <h3
                            className="text-base font-bold text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer m-0 mt-1 leading-snug"
                            onClick={() => navigate(`/learning/${item.id}`)}
                          >
                            {item.name}
                          </h3>

                          {/* Course Description */}
                          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 m-0 font-medium">
                            {item.description ||
                              "Khóa học giúp bạn làm chủ các kiến thức thực tế End-to-End từ căn bản đến nâng cao để áp dụng trực tiếp vào dự án."}
                          </p>

                          {/* Progress section */}
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1 text-[11px] text-slate-500 font-bold">
                              <span>Tiến độ</span>
                              <span className="text-orange-500">
                                {progressPercent}%
                              </span>
                            </div>
                            <Progress
                              percent={progressPercent}
                              showInfo={false}
                              strokeColor="#f97316" // Premium Orange Progress Bar
                              railColor="#f1f5f9"
                              strokeWidth={6}
                              className="m-0"
                            />
                          </div>

                          {/* Info row */}
                          <div className="flex justify-between items-center text-xs text-slate-400 font-medium mt-1">
                            <span className="flex items-center gap-1">
                              <BookOutlined />
                              {completedLessons}/{totalLessons} bài học
                            </span>
                            <span className="flex items-center gap-1">
                              <ClockCircleOutlined />
                              {studyTimeStr}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-5 pt-4 border-t border-slate-100">
                          <CButton
                            type="primary"
                            block
                            size="large"
                            icon={<PlayCircleOutlined />}
                            className="rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5 bg-blue-600 border-none text-white hover:bg-blue-700"
                            onClick={() =>
                              navigate(
                                item.lastAccessedLessonId
                                  ? `/learning/${item.id}/${item.lastAccessedLessonId}`
                                  : `/learning/${item.id}`
                              )
                            }
                          >
                            Tiếp tục học
                          </CButton>
                        </div>
                      </Card>
                    </Col>
                  );
                }}
              />
            </Row>
          </Show.Else>
        </Show>
      </div>
    </div>
  );
};

export default MyLearningPage;

