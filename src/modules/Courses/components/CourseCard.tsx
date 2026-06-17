import CButton from "@/components/UI/Button";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { useWishlist } from "@/modules/Wishlist/queryHooks";
import type { ICourse } from "@/type";
import { formatFullName } from "@/utils/format";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Card, Divider, Rate, Typography } from "antd";
import React, { memo } from "react";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface CourseCardProps {
  item: Partial<ICourse> & { isNew?: boolean };
  loading: boolean;
}

const CourseCard = ({ item, loading }: CourseCardProps) => {
  const navigate = useNavigate();
  const { isFavorite, addToWishlist, removeFromWishlist } = useWishlist(
    item?.id
  );

  const price = item?.price ?? 0;
  const finalPrice = item?.finalPrice ?? item?.price ?? 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item?.id) return;
    if (isFavorite) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item.id);
    }
  };

  return (
    <Card
      loading={loading}
      cover={
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <img
            alt={item?.name}
            src={item?.thumbnail}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/300x200?text=Course";
            }}
          />
          <div className="absolute top-2 right-2">
            <CTag
              type={TypeTagEnum.PROCESSING}
              className="m-0 border-none font-semibold px-2"
            >
              Special Offer
            </CTag>
          </div>
          {item?.isNew && (
            <div className="absolute top-2 left-2">
              <CTag
                type={TypeTagEnum.SUCCESS}
                className="m-0 border-none font-semibold px-2"
              >
                new
              </CTag>
            </div>
          )}
        </div>
      }
      className="overflow-hidden h-full flex flex-col border-gray-100 shadow-sm rounded-none"
      styles={{
        body: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "20px",
        },
      }}
    >
      <div className="flex-1">
        <Link to={`/courses/${item?.id}`}>
          <Title
            level={4}
            className="text-lg font-bold text-gray-800 mb-2 leading-tight min-h-[3rem]"
            ellipsis={{ rows: 2 }}
          >
            {item?.name}
          </Title>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          <Text className="text-sm font-semibold">
            {item?.avgRatingStars || 0}
          </Text>
          <Rate
            disabled
            allowHalf
            defaultValue={item?.avgRatingStars || 0}
            style={{ fontSize: 13, color: "#fadb14" }}
          />
          <Text className="text-gray-400 text-xs">
            ({item?.numOfReviews || 0})
          </Text>
        </div>

        <Text className="text-gray-500 text-xs line-clamp-2 mb-4 block h-8">
          {item?.description || item?.subTitle}
        </Text>

        <Divider className="my-4 border-gray-100" />

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <img
              src={
                item?.instructor?.avatar || "https://i.pravatar.cc/150?u=admin"
              }
              className="w-8 h-8 rounded-full object-cover shadow-sm bg-gray-200"
              alt="avatar"
            />
            <Text className="text-xs text-gray-600 font-medium">
              {item?.instructor
                && formatFullName(item?.instructor)}
            </Text>
          </div>
          <CButton
            type="text"
            onClick={handleFavoriteClick}
            icon={
              isFavorite ? (
                <HeartFilled className="text-primary hover:scale-110 transition-transform duration-200" />
              ) : (
                <HeartOutlined className="text-gray-300 hover:text-primary hover:scale-110 transition-transform duration-200" />
              )
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mt-auto">
        {item?.isBought ? (
          <CButton
            onClick={() => navigate(`/learning/${item?.id}`)}
            className="h-11 flex-1 rounded-lg font-bold border-none transition-all bg-primary text-white hover:bg-secondary"
          >
            Learn
          </CButton>
        ) : (
          <CButton
            onClick={() => navigate(`/courses/${item?.id}`)}
            className={`h-11 flex-1 rounded-lg font-bold border-none transition-all ${
              finalPrice === 0
                ? "bg-[#162742] text-white hover:bg-[#1a2b4b]"
                : "bg-[#ffb347] text-white hover:bg-[#ffa62b]"
            }`}
          >
            {finalPrice === 0 ? "Enroll" : "Buy"}
          </CButton>
        )}

        <div className="flex flex-col items-end">
          {finalPrice === 0 ? (
            <Text className="text-sm font-bold text-gray-500 uppercase">
              FREE
            </Text>
          ) : (
            <div className="flex items-center gap-2">
              {price > finalPrice && (
                <Text delete className="text-gray-400 text-xs">
                  ${price.toLocaleString()}
                </Text>
              )}
              <Text className="text-sm font-bold text-gray-700">
                ${finalPrice.toLocaleString()}
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default memo(CourseCard);
