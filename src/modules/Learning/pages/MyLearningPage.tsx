import CButton from "@/components/UI/Button";
import LoadingLazy from "@/components/UI/LoadingLazy";
import { For, Show } from "@/components/UI/Template";
import { formatFullName } from "@/utils/format";
import {
  BookOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Empty, Progress, Row, Space, Typography } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyLearning } from "../queryHooks";

const { Title, Text } = Typography;

export const MyLearningPage: React.FC = () => {
  const navigate = useNavigate();

  // Use the custom hook that fetches from aggregator-service (BFF)
  const { enrolledCourses, isLoading } = useMyLearning();

  if (isLoading) {
    return <LoadingLazy />;
  }

  return (
    <div className="min-h-[80vh] bg-gray-50/30 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-primary/10 p-3.5 rounded-2xl">
            <BookOutlined className="text-primary text-3xl" />
          </div>
          <div>
            <Title level={2} className="!m-0 font-extrabold text-gray-900">
              Khóa học của tôi
            </Title>
            <p className="text-gray-500 mt-1">
              Xem tiến độ học tập và tiếp tục các bài học của bạn.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <Show>
          <Show.When isTrue={enrolledCourses.length === 0}>
            <Card className="text-center py-20 border-dashed border-2 rounded-3xl bg-white shadow-sm max-w-2xl mx-auto">
              <Empty
                image={
                  <BookOutlined style={{ fontSize: 72, color: "#d9d9d9" }} />
                }
                description={
                  <Space direction="vertical" size="large" className="mt-4 w-full">
                    <Text type="secondary" className="text-lg">
                      Bạn chưa đăng ký khóa học nào
                    </Text>
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
                  const totalLessons = item.lessonCount || 0;
                  const completedLessons = Math.round(
                    (progressPercent / 100) * totalLessons
                  );

                  return (
                    <Col xs={24} md={12} lg={8} key={item.id}>
                      <Card
                        hoverable
                        className="h-full rounded-2xl overflow-hidden border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white"
                        styles={{
                          body: {
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          },
                        }}
                        cover={
                          <div className="relative aspect-video w-full overflow-hidden bg-gray-100 border-b">
                            <img
                              src={
                                item.thumbnail ||
                                "https://via.placeholder.com/400x225"
                              }
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        }
                      >
                        <div className="flex-1 flex flex-col gap-3">
                          {/* Course Title */}
                          <Title
                            level={4}
                            className="!m-0 font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors cursor-pointer"
                            onClick={() => navigate(`/learning/${item.id}`)}
                          >
                            {item.name}
                          </Title>

                          {/* Instructor Info */}
                          <div className="flex items-center gap-2 text-gray-500 text-xs">
                            <UserOutlined />
                            <span>
                              Giảng viên:{" "}
                              <Show>
                                <Show.When isTrue={!!item.instructor}>
                                  {formatFullName(item.instructor)}
                                </Show.When>
                                <Show.Else>E-Learning Team</Show.Else>
                              </Show>
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1.5 text-xs text-gray-500 font-medium">
                              <span>Tiến độ học tập</span>
                              <span className="text-primary font-bold">
                                {progressPercent}%
                              </span>
                            </div>
                            <Progress
                              percent={progressPercent}
                              showInfo={false}
                              strokeColor="var(--ant-color-primary, #2272eb)"
                              railColor="#f3f4f6"
                              strokeWidth={6}
                              className="m-0"
                            />
                            <div className="text-[11px] text-gray-400 mt-1 font-medium">
                              {totalLessons > 0
                                ? `Đã hoàn thành ${completedLessons}/${totalLessons} bài học`
                                : `Đã hoàn thành ${progressPercent}% khóa học`}
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-5 border-t pt-4">
                          <CButton
                            type="primary"
                            block
                            size="large"
                            icon={<PlayCircleOutlined />}
                            className="rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                            onClick={() =>
                              navigate(
                                item.lastAccessedLessonId
                                  ? `/learning/${item.id}/${item.lastAccessedLessonId}`
                                  : `/learning/${item.id}`
                              )
                            }
                          >
                            Học tiếp
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
