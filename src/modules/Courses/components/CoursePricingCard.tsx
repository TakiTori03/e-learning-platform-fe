import { memo, useState, useMemo } from "react";
import { Card, Typography, Space } from "antd";
import {
  PlayCircleOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import CButton from "@/components/UI/Button";
import { TypeCustom } from "@/components/UI/Button/enum";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import CModal from "@/components/UI/Modal";
import { useCartStore } from "@/modules/Cart/store/useCartStore";
import { useWishlist } from "@/modules/Wishlist/queryHooks";
import type { ICourse } from "@/type";

const { Title, Text } = Typography;

// Helper to format YouTube Embed URL
const getYoutubeEmbedUrl = (url?: string) => {
  if (!url) return "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const embedUrl = url.replace("watch?v=", "embed/").split("&")[0];
    return `${embedUrl}?autoplay=1`;
  }
  return url;
};

const StyledTrailerModal = styled(CModal)`
  .ant-modal-close {
    color: white !important;
  }
`;

interface CoursePricingCardProps {
  course: ICourse;
}

const CoursePricingCard = ({ course }: CoursePricingCardProps) => {
  const navigate = useNavigate();
  const { addToCart, courseIds } = useCartStore();
  const { isFavorite, addToWishlist, removeFromWishlist } = useWishlist(
    course.id
  );
  const [isOpenTrailer, setIsOpenTrailer] = useState(false);

  const isFree = useMemo(() => course.finalPrice === 0, [course.finalPrice]);

  const isInCart = useMemo(() => {
    return courseIds.includes(course.id);
  }, [courseIds, course.id]);

  const trailerUrl = useMemo(
    () => getYoutubeEmbedUrl(course.coursePreview),
    [course.coursePreview]
  );

  const discountPercentage = useMemo(() => {
    if (
      !course.price ||
      !course.finalPrice ||
      course.price <= course.finalPrice
    )
      return 0;
    return Math.round((1 - course.finalPrice / course.price) * 100);
  }, [course.price, course.finalPrice]);

  const handleBuyNow = () => {
    if (!isInCart) addToCart(course.id);
    navigate("/cart");
  };

  return (
    <>
      <Card
        className="shadow-[0_32px_64px_rgba(0,0,0,0.15)] border-none overflow-hidden rounded-xl bg-white"
        cover={
          <div
            className="relative group cursor-pointer aspect-video bg-gray-900 overflow-hidden shadow-inner"
            onClick={() => setIsOpenTrailer(true)}
          >
            <img
              alt={course.name}
              src={course.thumbnail}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
              <div className="bg-white/10 p-5 rounded-full backdrop-blur-sm mb-4 border border-white/20 group-hover:scale-110 transition-transform">
                <PlayCircleOutlined style={{ fontSize: 48, color: "white" }} />
              </div>
              <Text
                strong
                className="!text-white text-lg tracking-widest uppercase font-black"
              >
                Xem Trailer
              </Text>
            </div>
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-t-xl" />
          </div>
        }
      >
        <div className="p-5">
          <div className="flex items-center gap-4 mb-8">
            <Title
              level={2}
              className="m-0 text-3xl font-black text-[#1c1d1f] tracking-tight"
            >
              {isFree ? "MIỄN PHÍ" : `${course.finalPrice?.toLocaleString()}₫`}
            </Title>
            {discountPercentage > 0 && (
              <div className="flex flex-col">
                <Text delete type="secondary" className="text-xs opacity-50">
                  {course.price?.toLocaleString()}₫
                </Text>
                <CTag
                  type={TypeTagEnum.ERROR}
                  className="mt-0.5 font-bold text-[10px]"
                >
                  -{discountPercentage}%
                </CTag>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {course.isBought ? (
              <CButton
                typeCustom={TypeCustom.Primary}
                className="w-full h-14 text-base font-black bg-[#1c1d1f] hover:bg-black border-none rounded-none transition-all shadow-lg active:scale-[0.98]"
                onClick={() => navigate(`/learning/${course.id}`)}
              >
                VÀO HỌC NGAY
              </CButton>
            ) : (
              <>
                <CButton
                  typeCustom={TypeCustom.Primary}
                  className="h-14 text-base font-black rounded-none bg-[#a435f0] hover:bg-[#8710d8] border-none shadow-lg active:scale-[0.98] transition-all"
                  onClick={handleBuyNow}
                >
                  MUA NGAY
                </CButton>
                <CButton
                  typeCustom={TypeCustom.Secondary}
                  className="h-14 font-black rounded-none border border-gray-200 text-[#1c1d1f] hover:bg-gray-50 transition-all uppercase shadow-sm"
                  onClick={() =>
                    isInCart ? navigate("/cart") : addToCart(course.id)
                  }
                >
                  {isInCart ? "Xem giỏ hàng" : "Thêm vào giỏ hàng"}
                </CButton>
              </>
            )}
          </div>

          <div className="text-center my-6">
            <Text className="text-[10px] uppercase font-bold tracking-widest text-gray-400 opacity-80 block">
              Cam kết hoàn tiền trong 30 ngày
            </Text>
          </div>

          <div className="flex gap-2">
            <CButton
              block
              typeCustom={
                isFavorite ? TypeCustom.Primary : TypeCustom.Secondary
              }
              className="rounded-xl h-11 text-xs font-bold"
              onClick={() =>
                isFavorite
                  ? removeFromWishlist(course.id)
                  : addToWishlist(course.id)
              }
            >
              {isFavorite ? (
                <>
                  <HeartFilled className="mr-1" /> Đã thích
                </>
              ) : (
                <>
                  <HeartOutlined className="mr-1" /> Yêu thích
                </>
              )}
            </CButton>
            <CButton
              block
              typeCustom={TypeCustom.Secondary}
              className="rounded-xl h-11 text-xs font-bold"
            >
              <ShareAltOutlined className="mr-1" /> Chia sẻ
            </CButton>
          </div>

          <div className="mt-10 border-t border-gray-100 pt-8">
            <Text
              strong
              className="block mb-6 text-[#1c1d1f] text-sm uppercase font-black tracking-wider"
            >
              Khóa học này bao gồm:
            </Text>
            <Space
              direction="vertical"
              className="w-full text-[#4a4d53]"
              size="large"
            >
              <div className="flex items-center gap-4 text-xs font-semibold">
                <PlayCircleOutlined className="text-base opacity-40" />
                <span>
                  {Math.round((course.totalVideosLength || 0) / 3600)} giờ video
                  nén chất lượng cao
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <CheckCircleOutlined className="text-base opacity-40" />
                <span>{course.lessonCount || 0} bài giảng chuyên sâu</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <CheckCircleOutlined className="text-base opacity-40" />
                <span>Quyền truy cập trọn đời vĩnh viễn</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <GlobalOutlined className="text-base opacity-40" />
                <span>Chứng chỉ xác nhận từ ứng dụng</span>
              </div>
            </Space>
          </div>
        </div>
      </Card>

      <StyledTrailerModal
        open={isOpenTrailer}
        onCancel={() => setIsOpenTrailer(false)}
        footer={null}
        width={800}
        title="Giới thiệu khóa học"
        destroyOnClose={true}
      >
        {isOpenTrailer && (
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={trailerUrl}
              title="Course Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </StyledTrailerModal>
    </>
  );
};

export default memo(CoursePricingCard);
