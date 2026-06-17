import React from "react";
import { Card, Typography, Tag } from "antd";
import { Eye, Heart, Calendar } from "lucide-react";
import type { IBlogPost } from "@/modules/Blog/types";
import BlogStatusTag from "./BlogStatusTag";
import { formatDateTime } from "@/utils/format";
import { For } from "@/components/UI/Template";

const { Title, Paragraph } = Typography;

export interface BlogCardProps {
  blog: IBlogPost;
  actions: React.ReactNode[];
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, actions }) => {
  return (
    <Card
      hoverable
      cover={
        <div className="relative h-44 overflow-hidden rounded-t-xl bg-gray-100">
          <img
            alt={blog.title}
            src={
              blog.thumbnailUrl ||
              "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80"
            }
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {blog.status && (
            <BlogStatusTag
              status={blog.status}
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
        {/* Tags */}
        <div className="flex flex-wrap gap-1 min-h-[22px] items-center">
          <For
            array={(blog.tags || []).slice(0, 3)}
            render={(tag: string) => (
              <Tag
                key={tag}
                className="text-[10px] px-1.5 py-0 border-gray-200 text-gray-500 bg-gray-50 rounded m-0 leading-tight"
              >
                {tag}
              </Tag>
            )}
          />
          {(blog.tags || []).length > 3 && (
            <Tag className="text-[10px] px-1.5 py-0 border-gray-200 text-gray-400 bg-gray-50 rounded m-0 leading-tight">
              +{blog.tags.length - 3}
            </Tag>
          )}
        </div>

        {/* Title */}
        <Title
          level={5}
          className="!m-0 line-clamp-2 text-gray-800 font-bold h-12 leading-tight flex-none"
        >
          {blog.title}
        </Title>

        {/* Summary */}
        <Paragraph className="text-xs text-gray-400 line-clamp-2 mb-2 leading-relaxed h-8 flex-none">
          {blog.summary}
        </Paragraph>

        {/* Date and Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-gray-400 text-[11px] mt-auto flex-none">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {formatDateTime(blog.createdAt)}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-gray-400" /> {blog.viewsCount || 0}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-gray-400" /> {blog.likedUserIds?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BlogCard;
