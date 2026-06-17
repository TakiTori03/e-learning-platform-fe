import CButton from "@/components/UI/Button";
import LoadingLazy from "@/components/UI/LoadingLazy";
import { For, Show } from "@/components/UI/Template";
import { useCartStore } from "@/modules/Cart/store/useCartStore";
import { formatFullName } from "@/utils/format";
import {
  ArrowLeftOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Card,
  Col,
  Empty,
  Rate,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "../queryHooks";

const { Title, Text } = Typography;

export const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { wishlistCourses, isLoading, removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCartStore();

  if (isLoading) {
    return <LoadingLazy />;
  }

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="min-h-[80vh] bg-gray-50/30 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <CButton
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="text-gray-500 border-gray-300 rounded-full flex items-center justify-center w-10 h-10 shrink-0 shadow-sm"
          />
          <div className="bg-red-500/10 p-3.5 rounded-2xl">
            <HeartFilled className="text-red-500 text-3xl" />
          </div>
          <div>
            <Title level={2} className="!m-0 font-extrabold text-gray-900">
              Danh sách yêu thích
            </Title>
            <p className="text-gray-500 mt-1">
              Lưu trữ những khóa học bạn quan tâm và muốn sở hữu trong tương lai.
            </p>
          </div>
        </div>

        {/* Content Section */}
        <Show>
          <Show.When isTrue={wishlistCourses.length === 0}>
            <Card className="text-center py-20 border-dashed border-2 rounded-3xl bg-white shadow-sm max-w-2xl mx-auto">
              <Empty
                image={<HeartFilled style={{ fontSize: 72, color: "#fca5a5" }} />}
                description={
                  <Space direction="vertical" size="large" className="mt-4 w-full">
                    <Text type="secondary" className="text-lg">
                      Chưa có khóa học nào trong danh sách yêu thích
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
                array={wishlistCourses}
                render={(item) => {
                  const isAddedToCart = isInCart(item.id);
                  const originalPrice = item.price ?? 0;
                  const salePrice = item.finalPrice ?? originalPrice;
                  const hasDiscount = salePrice < originalPrice;

                  return (
                    <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
                      <Card
                        hoverable
                        className="h-full rounded-2xl overflow-hidden border-gray-100 hover:border-red-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col bg-white"
                        styles={{
                          body: {
                            padding: "16px",
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          },
                        }}
                        cover={
                          <div className="relative aspect-video w-full overflow-hidden bg-gray-100 border-b">
                            <img
                              src={item.thumbnail || "https://via.placeholder.com/400x225"}
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 cursor-pointer"
                              onClick={() => navigate(`/courses/${item.id}`)}
                            />
                            {/* Remove favorite button (absolute) */}
                            <Tooltip title="Xóa khỏi yêu thích">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFromWishlist(item.id);
                                }}
                                className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow-md text-red-500 hover:text-red-600 hover:bg-white hover:scale-110 transition-all duration-200 border-none cursor-pointer"
                              >
                                <HeartFilled className="text-base" />
                              </button>
                            </Tooltip>
                            <Show>
                              <Show.When isTrue={hasDiscount}>
                                <Badge.Ribbon
                                  text="GIẢM GIÁ"
                                  color="red"
                                  className="font-bold text-[10px]"
                                />
                              </Show.When>
                            </Show>
                          </div>
                        }
                      >
                        <div className="flex-1 flex flex-col gap-2">
                          {/* Course Title */}
                          <Title
                            level={5}
                            className="!m-0 font-bold text-gray-800 line-clamp-2 hover:text-primary transition-colors cursor-pointer min-h-[44px]"
                            onClick={() => navigate(`/courses/${item.id}`)}
                          >
                            {item.name}
                          </Title>

                          {/* Instructor Info */}
                          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                            <UserOutlined className="text-[10px]" />
                            <span className="line-clamp-1">
                              <Show>
                                <Show.When isTrue={!!item.instructor}>
                                  {formatFullName(item.instructor)}
                                </Show.When>
                                <Show.Else>E-Learning Team</Show.Else>
                              </Show>
                            </span>
                          </div>

                          {/* Ratings */}
                          <div className="flex items-center gap-1.5 mt-1">
                            <Rate
                              disabled
                              allowHalf
                              defaultValue={item.avgRatingStars || 0}
                              className="text-xs text-yellow-500"
                            />
                            <span className="text-gray-400 text-[10px] font-medium">
                              ({item.numOfReviews || 0})
                            </span>
                          </div>

                          {/* Pricing */}
                          <div className="flex flex-wrap items-baseline gap-2 mt-2">
                            <span className="text-primary font-extrabold text-sm">
                              <Show>
                                <Show.When isTrue={salePrice === 0}>Miễn phí</Show.When>
                                <Show.Else>{formatPrice(salePrice)}</Show.Else>
                              </Show>
                            </span>
                            <Show>
                              <Show.When isTrue={hasDiscount}>
                                <span className="text-gray-400 line-through text-[11px]">
                                  {formatPrice(originalPrice)}
                                </span>
                              </Show.When>
                            </Show>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="mt-4 border-t pt-3">
                          <Show>
                            <Show.When isTrue={isAddedToCart}>
                              <CButton
                                type="dashed"
                                block
                                icon={<ShoppingCartOutlined />}
                                className="rounded-xl font-bold flex items-center justify-center gap-1.5 border-primary text-primary hover:text-primary/90"
                                onClick={() => navigate("/cart")}
                              >
                                Xem giỏ hàng
                              </CButton>
                            </Show.When>
                            <Show.Else>
                              <CButton
                                type="primary"
                                block
                                icon={<ShoppingCartOutlined />}
                                className="rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200"
                                onClick={() => addToCart(item.id)}
                              >
                                Thêm vào giỏ hàng
                              </CButton>
                            </Show.Else>
                          </Show>
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

export default WishlistPage;
