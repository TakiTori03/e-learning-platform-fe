import React from "react";
import { Card, Typography, Rate } from "antd";
import { Eye, Users, FolderOpen } from "lucide-react";
import type { ICourse } from "@/type";
import CourseStatusTag from "./CourseStatusTag";
import { formatPrice } from "../constants";

const { Title, Text, Paragraph } = Typography;

export interface CourseCardProps {
  course: ICourse;
  actions: React.ReactNode[];
}

const CourseCard: React.FC<CourseCardProps> = ({ course, actions }) => {
  const isDiscounted = course.price && course.finalPrice && course.finalPrice < course.price;

  return (
    <Card
      hoverable
      cover={
        <div className="relative h-44 overflow-hidden rounded-t-xl bg-gray-100">
          <img
            alt={course.name}
            src={
              course.thumbnail ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"
            }
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {course.status && (
            <CourseStatusTag
              status={course.status}
              variant="card-overlay"
              className="absolute top-3 right-3 z-10 font-semibold text-[10px] shadow-sm uppercase tracking-wide"
            />
          )}
        </div>
      }
      actions={actions}
      className="rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full bg-white"
      styles={{ body: { padding: "16px", flex: 1, display: "flex", flexDirection: "column" } }}
    >
      <div className="space-y-2 flex flex-col flex-1">
        {/* Category */}
        <Text type="secondary" className="text-xs flex items-center gap-1">
          <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
          {course.category?.name || "Danh mục khác"}
        </Text>

        {/* Title */}
        <Title
          level={5}
          className="!m-0 line-clamp-2 text-gray-800 font-bold h-12 leading-tight flex-none"
        >
          {course.name}
        </Title>

        {/* Rating */}
        <div className="flex items-center gap-1.5 py-0.5 flex-none">
          <span className="text-xs font-semibold text-gray-700">
            {course.avgRatingStars || 0}
          </span>
          <Rate
            disabled
            allowHalf
            defaultValue={course.avgRatingStars || 0}
            style={{ fontSize: 11, color: "#fadb14" }}
          />
          <span className="text-[10px] text-gray-400">
            ({course.numOfReviews || 0} đánh giá)
          </span>
        </div>

        {/* Subtitle / Description */}
        <Paragraph className="text-xs text-gray-400 line-clamp-2 mb-2 leading-relaxed h-10 flex-none">
          {course.subTitle}
        </Paragraph>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-400 text-xs mt-auto flex-none">
          <span className="flex items-center gap-1 font-medium">
            <Users className="w-3.5 h-3.5 text-gray-400" /> {course.studentCount || 0} học viên
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-3.5 h-3.5 text-gray-400" /> {course.views || 0} lượt xem
          </span>
        </div>

        {/* Price & Level Access */}
        <div className="pt-2.5 flex items-center justify-between flex-none">
          {isDiscounted ? (
            <div className="space-x-1.5 flex items-baseline">
              <span className="text-primary font-bold text-base">
                {formatPrice(course.finalPrice)}
              </span>
              <span className="text-gray-400 line-through text-xs">
                {formatPrice(course.price)}
              </span>
            </div>
          ) : (
            <span className="text-primary font-bold text-base">
              {formatPrice(course.finalPrice ?? course.price)}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
              {course.level}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseCard;
