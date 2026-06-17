import { Card, Col, Row, Typography, Rate } from "antd";
import { Link } from "react-router-dom";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { For } from "@/components/UI/Template";
import type { AnyElement, ICourse } from "@/type";

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
                  <div className="h-48 overflow-hidden">
                    <img
                      alt={item?.name}
                      src={item?.thumbnail}
                      className="w-full h-full object-cover transition-transform hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/300x200?text=Course";
                      }}
                    />
                  </div>
                }
                className="overflow-hidden"
              >
                <CTag type={TypeTagEnum.WAITING} icon={null} className="mb-2">
                  {item?.categoryId?.name || "General"}
                </CTag>
                <Link to={`/courses/${item?.id}`}>
                  <Title
                    level={4}
                    ellipsis={{ rows: 2 }}
                    className="min-h-[3rem] hover:text-primary transition-colors text-[16px] leading-snug"
                  >
                    {item?.name}
                  </Title>
                </Link>
                <div className="flex items-center gap-2 mb-3">
                  <Rate
                    disabled
                    defaultValue={item?.avgRatings || 5}
                    style={{ fontSize: 13 }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    ({item?.numberUsersOfCourse || 0})
                  </Text>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Text className="text-lg font-bold text-primary">
                    {item?.finalPrice?.toLocaleString()}đ
                  </Text>
                  {item?.price > item?.finalPrice && (
                    <Text delete type="secondary" style={{ fontSize: 12 }}>
                      {item?.price?.toLocaleString()}đ
                    </Text>
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
