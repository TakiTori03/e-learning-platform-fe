import CButton from "@/components/UI/Button";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { useWishlist } from "@/modules/Wishlist/queryHooks";
import type { ICourse } from "@/type";
import { formatFullName, formatStudyTime, formatCurrency } from "@/utils/format";
import {
  HeartFilled,
  HeartOutlined,
  BookOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EyeOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { Card, Divider, Rate, Typography, notification } from "antd";
import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrder } from "@/modules/Order/hooks/useOrder";

const { Title, Text } = Typography;

interface CourseCardProps {
  item: Partial<ICourse> & { isNew?: boolean };
  loading: boolean;
}

const CourseCard = ({ item, loading }: CourseCardProps) => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);
  const { createOrder, isCreatingOrder } = useOrder();
  const [localFavorite, setLocalFavorite] = React.useState<boolean>(!!item?.isFavorite);

  React.useEffect(() => {
    setLocalFavorite(!!item?.isFavorite);
  }, [item?.isFavorite, item?.id]);

  const { addToWishlist, removeFromWishlist } = useWishlist(item?.id, {
    enabledQuery: false,
  });

  const price = item?.price ?? 0;
  const finalPrice = item?.finalPrice ?? item?.price ?? 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item?.id) return;
    if (localFavorite) {
      removeFromWishlist(item.id);
      setLocalFavorite(false);
    } else {
      addToWishlist(item.id);
      setLocalFavorite(true);
    }
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item?.id) return;
    if (!isAuth) {
      notification.warning({
        message: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập tài khoản để thực hiện đăng ký khóa học.",
      });
      navigate(`/login?redirect=${window.location.pathname}`);
      return;
    }
    createOrder([item.id]);
  };

  return (
    <Card
      hoverable
      loading={loading}
      cover={
        <div className="relative h-48 overflow-hidden bg-gray-100 rounded-t-2xl">
          <img
            alt={item?.name}
            src={item?.thumbnail}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/300x200?text=Course";
            }}
          />
          {price > finalPrice && (
            <div className="absolute top-2 right-2">
              <CTag
                type={TypeTagEnum.ERROR}
                icon={null}
                className="m-0 border-none font-extrabold px-2 text-[10px] shadow-sm"
              >
                -{Math.round((1 - finalPrice / price) * 100)}% OFF
              </CTag>
            </div>
          )}
          {item?.isNew && (
            <div className="absolute top-2 left-2">
              <CTag
                type={TypeTagEnum.SUCCESS}
                className="m-0 border-none font-semibold px-2"
              >
                Mới
              </CTag>
            </div>
          )}
        </div>
      }
      className="overflow-hidden h-full flex flex-col border border-gray-100 hover:border-transparent hover:shadow-md transition-all duration-300 rounded-2xl bg-white"
      styles={{
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "16px",
        },
      }}
    >
      <div className="flex-1">
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
            className="text-[15px] font-bold text-gray-800 mb-2 leading-snug min-h-[3rem] hover:text-primary transition-colors"
            ellipsis={{ rows: 2 }}
          >
            {item?.name}
          </Title>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <Rate
            disabled
            allowHalf
            defaultValue={item?.avgRatingStars || 5}
            style={{ fontSize: 12, color: "#fadb14" }}
          />
          <Text type="secondary" className="text-[11px]">
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

        <Divider className="my-3 border-gray-100" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={
                item?.instructor?.avatar || "https://i.pravatar.cc/150?u=admin"
              }
              className="w-7 h-7 rounded-full object-cover shadow-sm bg-gray-200"
              alt="avatar"
            />
            <Text className="text-[11px] text-gray-600 font-medium">
              {item?.instructor
                && formatFullName(item?.instructor)}
            </Text>
          </div>
          {isAuth && (
            <CButton
              type="text"
              onClick={handleFavoriteClick}
              icon={
                localFavorite ? (
                  <HeartFilled className="text-primary hover:scale-110 transition-transform duration-200" />
                ) : (
                  <HeartOutlined className="text-gray-300 hover:text-primary hover:scale-110 transition-transform duration-200" />
                )
              }
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-gray-50">
        {item?.isBought ? (
          <CButton
            onClick={() => navigate(`/learning/${item?.id}`)}
            className="h-9 flex-1 rounded-lg font-bold border-none transition-all bg-[#16a34a] hover:bg-[#15803d] text-white text-xs"
          >
            Vào học
          </CButton>
        ) : (
          <CButton
            onClick={handleActionClick}
            loading={isCreatingOrder}
            className={`h-9 flex-1 rounded-lg font-bold border-none transition-all text-xs text-white ${
            finalPrice === 0
              ? "bg-[#162742] hover:bg-[#1a2b4b]"
              : "bg-[#2563eb] hover:bg-[#1d4ed8]"
          }`}
        >
          {finalPrice === 0 ? "Đăng ký" : "Mua ngay"}
        </CButton>
        )}

        <div className="flex flex-col items-end">
          {finalPrice === 0 ? (
            <div className="flex flex-col items-end">
              <Text className="text-xs font-bold text-green-600">
                Miễn phí
              </Text>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1">
                {price > finalPrice && (
                  <Text delete className="text-gray-400 text-[10px]">
                    {formatCurrency(price)}
                  </Text>
                )}
                <Text className="text-xs font-bold text-gray-800">
                  {formatCurrency(finalPrice)}
                </Text>
              </div>
            </div>
          )}
          {item?.level && (
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              {item.level}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default memo(CourseCard);
