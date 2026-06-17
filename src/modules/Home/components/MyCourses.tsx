import React, { memo } from "react";
import { Card, Col, Row, Typography, Rate } from "antd";
import { Link, useNavigate } from "react-router-dom";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import CButton from "@/components/UI/Button";
import { For, Show } from "@/components/UI/Template";
import type { AnyElement, ICourse } from "@/type";

const { Title, Text } = Typography;

interface Props {
  courses: ICourse[];
  loading: boolean;
}

export const MyCourses: React.FC<Props> = ({ courses, loading }) => {
  const navigate = useNavigate();
  const displayList = loading ? Array.from({ length: 4 }) : courses;
  const hasCourses = courses.length > 0;

  return (
    <div className="py-12 bg-white rounded-3xl px-8 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <Title level={2}>Khóa học của tôi</Title>
        <Link to="/start" className="text-primary font-medium cursor-pointer hover:underline text-xs">
          Trang học tập →
        </Link>
      </div>

      <Show>
        <Show.When isTrue={!loading && !hasCourses}>
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-xs mb-4">Bạn chưa đăng ký khóa học nào.</p>
            <CButton
              type="primary"
              onClick={() => navigate("/courses")}
              className="rounded-xl bg-blue-600 border-none hover:bg-blue-500 text-xs h-10 px-6 font-semibold"
              id="btn-explore-first-course"
            >
              Khám phá khóa học ngay
            </CButton>
          </div>
        </Show.When>

        <Show.Else>
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
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/300x200?text=Course";
                          }}
                        />
                      </div>
                    }
                    className="overflow-hidden h-full flex flex-col justify-between"
                  >
                    <div>
                      <CTag type={TypeTagEnum.WAITING} icon={null} className="mb-2">
                        {item?.categoryId?.name || "General"}
                      </CTag>
                      <Link to={`/courses/${item?.id}`}>
                        <Title
                          level={4}
                          ellipsis={{ rows: 2 }}
                          className="min-h-[3rem] hover:text-primary transition-colors text-[14px] leading-snug"
                        >
                          {item?.name}
                        </Title>
                      </Link>
                      <div className="flex items-center gap-2 mb-3">
                        <Rate
                          disabled
                          defaultValue={item?.avgRatings || 5}
                          style={{ fontSize: 12 }}
                        />
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          ({item?.numberUsersOfCourse || 0})
                        </Text>
                      </div>
                    </div>
                    <div className="mt-4 border-t border-slate-100 pt-4 flex justify-between items-center">
                      <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">
                        Đã sở hữu
                      </span>
                      <CButton
                        size="small"
                        type="primary"
                        onClick={() => navigate(`/courses/${item?.id}`)}
                        className="rounded-lg text-[10px] font-bold bg-blue-600 border-none hover:bg-blue-500"
                        id={`btn-learn-more-${item?.id || index}`}
                      >
                        Vào học
                      </CButton>
                    </div>
                  </Card>
                </Col>
              )}
            />
          </Row>
        </Show.Else>
      </Show>
    </div>
  );
};

export default memo(MyCourses);
