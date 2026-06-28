import CButton from "@/components/UI/Button";
import { For, Show } from "@/components/UI/Template";
import { courseApi } from "@/modules/Courses/services";
import { useOrder } from "@/modules/Order/hooks/useOrder";
import { useAuthStore } from "@/store/useAuthStore";
import type { ICourse } from "@/type";
import { formatFullName } from "@/utils/format";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useQueries } from "@tanstack/react-query";
import {
  Card,
  Col,
  Empty,
  List,
  Row,
  Skeleton,
  Space,
  Typography,
  notification,
} from "antd";
import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../store/useCartStore";

const { Title, Text } = Typography;

export const CartPage = () => {
  const { courseIds, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  const { createOrder, isCreatingOrder } = useOrder();

  // Fetch course details for all IDs in the cart
  const cartQueries = useQueries({
    queries: courseIds.map((id) => ({
      queryKey: ["course-detail", id],
      queryFn: () => courseApi.getCourseDetail(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const isLoading = cartQueries.some((q) => q.isLoading);

  // Extract successfully fetched courses
  const items = useMemo(() => {
    return cartQueries
      .map((q) => q.data)
      .filter((course): course is ICourse => course !== undefined);
  }, [cartQueries]);

  const originalPrice = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + (item.finalPrice ?? item.price ?? 0),
    0
  );

  // Auto-remove courses that are not found (404) from cart
  useEffect(() => {
    cartQueries.forEach((q, index) => {
      if (q.isError) {
        const err = q.error as any;
        if (
          err?.status === 404 ||
          err?.statusCode === 404 ||
          err?.response?.status === 404 ||
          err?.message?.includes("404")
        ) {
          removeFromCart(courseIds[index]);
        }
      }
    });
  }, [cartQueries, courseIds, removeFromCart]);

  const handleCheckout = () => {
    if (!isAuth) {
      notification.warning({
        message: "Vui lòng đăng nhập để tiếp tục thanh toán",
      });
      navigate("/login?redirect=/cart");
      return;
    }
    const validCourseIds = items.map((item) => item.id);
    if (validCourseIds.length === 0) return;
    createOrder(validCourseIds);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="flex items-center gap-4 mb-8">
        <CButton
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="text-gray-500 border-gray-300 rounded-full flex items-center justify-center w-10 h-10"
        />
        <Title level={2} className="!m-0 font-bold">
          Giỏ hàng ({courseIds.length})
        </Title>
      </div>

      <Show>
        <Show.When isTrue={courseIds.length === 0}>
          <Card className="text-center py-20 border-dashed border-2 rounded-2xl bg-gray-50">
            <Empty
              image={
                <ShoppingCartOutlined
                  style={{ fontSize: 72, color: "#d9d9d9" }}
                />
              }
              description={
                <Space direction="vertical" size="large" className="mt-4">
                  <Text type="secondary" className="text-lg">
                    Giỏ hàng của bạn đang trống
                  </Text>
                  <Link to="/courses">
                    <CButton
                      type="primary"
                      size="large"
                      className="rounded-full px-8 font-bold text-white shadow-md"
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
          <Row gutter={[32, 32]}>
            <Col xs={24} lg={16}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Show>
                  <Show.When isTrue={isLoading}>
                    <div className="p-6 space-y-6">
                      <For
                        array={[1, 2]}
                        render={(i) => (
                          <Skeleton
                            key={i}
                            active
                            avatar={{ shape: "square", size: 80 }}
                            paragraph={{ rows: 2 }}
                          />
                        )}
                      />
                    </div>
                  </Show.When>
                  <Show.Else>
                    <List
                      itemLayout="horizontal"
                      dataSource={items}
                      renderItem={(item) => (
                        <List.Item
                          className="p-6 hover:bg-gray-50/50 transition-colors border-b last:border-b-0"
                          actions={[
                            <CButton
                              danger
                              type="text"
                              icon={<DeleteOutlined />}
                              onClick={() => removeFromCart(item.id)}
                              className="hover:bg-red-50 rounded-lg flex items-center gap-1"
                            >
                              Xóa
                            </CButton>,
                          ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <div className="w-36 h-24 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                <img
                                  src={
                                    item.thumbnail ||
                                    "https://via.placeholder.com/150"
                                  }
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            }
                            title={
                              <Link
                                to={`/courses/${item.id}`}
                                className="text-lg font-bold hover:text-primary transition-colors line-clamp-2 mb-1.5 block"
                              >
                                {item.name}
                              </Link>
                            }
                            description={
                              <div className="mt-2 flex items-center gap-3">
                                {item.finalPrice !== undefined &&
                                item.price !== undefined &&
                                item.price > item.finalPrice ? (
                                  <>
                                    <Text className="text-primary font-black text-xl m-0 leading-none">
                                      {item.finalPrice.toLocaleString()}đ
                                    </Text>
                                    <Text delete className="text-gray-400 text-sm font-medium m-0 leading-none">
                                      {item.price.toLocaleString()}đ
                                    </Text>
                                    <span className="bg-rose-50 text-rose-600 font-black text-[10px] px-1.5 py-0.5 rounded border border-rose-100 uppercase tracking-wide leading-none shrink-0">
                                      -{Math.round(((item.price - item.finalPrice) / item.price) * 100)}%
                                    </span>
                                  </>
                                ) : (
                                  <Text className="text-primary font-black text-xl m-0 leading-none">
                                    {(item.price ?? 0).toLocaleString()}đ
                                  </Text>
                                )}
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Show.Else>
                </Show>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <Card
                title={<span className="text-xl font-bold">Tổng cộng</span>}
                className="shadow-sm border-gray-100 rounded-2xl sticky top-24"
                styles={{
                  header: {
                    borderBottom: "1px solid #f0f0f0",
                    padding: "16px 24px",
                  },
                  body: {
                    padding: "24px",
                  },
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <Text type="secondary" className="text-base">
                    Giá gốc:
                  </Text>
                  <Text delete className="text-base text-gray-400">
                    {originalPrice.toLocaleString()}đ
                  </Text>
                </div>
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                  <Text className="text-lg font-bold text-gray-800">
                    Thành tiền:
                  </Text>
                  <Text className="text-3xl font-extrabold text-primary">
                    {totalPrice.toLocaleString()}đ
                  </Text>
                </div>
                <CButton
                  type="primary"
                  block
                  size="large"
                  className="h-14 rounded-xl font-bold text-lg mb-4 shadow-md bg-primary text-white"
                  disabled={isLoading || items.length === 0}
                  loading={isCreatingOrder}
                  onClick={handleCheckout}
                >
                  Thanh toán ngay
                </CButton>
                <Text type="secondary" className="text-center block text-xs px-4">
                  Bằng cách hoàn tất giao dịch, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
                </Text>
              </Card>
            </Col>
          </Row>
        </Show.Else>
      </Show>
    </div>
  );
};

export default CartPage;
