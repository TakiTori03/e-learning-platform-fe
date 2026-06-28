import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { For } from "@/components/UI/Template";
import type { AnyElement, ICourse } from "@/type";
import { formatStudyTime } from "@/utils/format";
import {
  BookOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Rate, Row, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;



interface PopularCoursesProps {
  courses: ICourse[];
  loading: boolean;
}

const PopularCourses = ({ courses, loading }: PopularCoursesProps) => {
  const displayList = loading ? Array.from({ length: 4 }) : courses;

  return (
    <div className="py-12 bg-white rounded-3xl px-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <Title level={2}>Khóa học Phổ biến</Title>
        <Link to="/courses" className="text-primary font-medium cursor-pointer hover:underline">
          Xem tất cả →
        </Link>
      </div>
      <Row gutter={[24, 24]}>
        <For
          array={displayList}
          render={(item: AnyElement, index) => (
            <Col xs={24} sm={12} md={6} key={item?.id || index}>
              <Card
                hoverable
                loading={loading}
                cover={
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      alt={item?.name}
                      src={item?.thumbnail}
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/300x200?text=Course";
                      }}
                    />
                    {item?.price > item?.finalPrice && (
                      <div className="absolute top-2 left-2">
                        <CTag
                          type={TypeTagEnum.ERROR}
                          icon={null}
                          className="m-0 border-none font-extrabold px-2 text-[10px] shadow-sm"
                        >
                          -{Math.round((1 - item.finalPrice / item.price) * 100)}% OFF
                        </CTag>
                      </div>
                    )}
                  </div>
                }
                className="overflow-hidden h-full flex flex-col justify-between"
                styles={{ body: { padding: "16px", display: "flex", flexDirection: "column", flex: 1 } }}
              >
                <div>
                  {/* Category */}
                  <div className="mb-2">
                    <Text type="secondary" className="text-[11px] flex items-center gap-1 font-semibold">
                      <FolderOpenOutlined className="text-gray-400" />
                      {item?.category?.name || "Danh mục khác"}
                    </Text>
                  </div>

                  <Link to={`/courses/${item?.id}`}>
                    <Title
                      level={4}
                      ellipsis={{ rows: 2 }}
                      className="min-h-[3rem] hover:text-primary transition-colors text-[15px] leading-snug mb-2 font-bold"
                    >
                      {item?.name}
                    </Title>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={item?.avgRatingStars || 5}
                      style={{ fontSize: 13 }}
                    />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      ({item?.numOfReviews || 0})
                    </Text>
                  </div>

                  {/* Metadata Grid */}
                  <div className="border-t border-gray-100 pt-3 mt-3 space-y-1.5 text-[11px] text-gray-500 font-medium mb-3">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <BookOutlined className="text-gray-400" />
                        {item?.lessonCount || 0} bài học
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockCircleOutlined className="text-gray-400" />
                        {formatStudyTime(item?.totalVideosLength)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <UserOutlined className="text-gray-400" />
                        {item?.studentCount || 0} học viên
                      </span>
                      <span className="flex items-center gap-1">
                        <EyeOutlined className="text-gray-400" />
                        {item?.views || 0} lượt xem
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-3">
                  <div className="flex items-baseline gap-2">
                    <Text className="text-lg font-bold text-primary">
                      {item?.finalPrice?.toLocaleString()}đ
                    </Text>
                    {item?.price > item?.finalPrice && (
                      <Text delete type="secondary" style={{ fontSize: 11 }}>
                        {item?.price?.toLocaleString()}đ
                      </Text>
                    )}
                  </div>
                  {item?.level && (
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                      {item.level}
                    </span>
                  )}
                </div>
              </Card>
            </Col>
          )}
        />
      </Row>
    </div>
  );
};

export default PopularCourses;
