import React from "react";
import { Card, Empty } from "antd";
import type { IBlogPost } from "@/modules/Blog/types";
import BlogCard from "./BlogCard";
import { For } from "@/components/UI/Template";

interface BlogGridProps {
  blogs: IBlogPost[];
  isLoading: boolean;
  /** Function that receives a blog and returns an array of action ReactNodes for the card footer */
  renderActions: (blog: IBlogPost) => React.ReactNode[];
  onCreateNewClick?: () => void;
}

const BlogGrid: React.FC<BlogGridProps> = ({
  blogs,
  isLoading,
  renderActions,
  onCreateNewClick,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <For
          array={[1, 2, 3, 4]}
          render={(i) => (
            <Card
              key={i}
              loading={true}
              className="rounded-xl border border-gray-100 h-[380px]"
            />
          )}
        />
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <Card className="rounded-xl border border-gray-100 py-12 text-center">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <div className="space-y-1">
              <p className="text-gray-500 font-medium">
                Không tìm thấy bài viết nào
              </p>
              <p className="text-gray-400 text-xs">
                Hãy thử thay đổi bộ lọc hoặc thêm một bài viết mới
              </p>
            </div>
          }
        >
          {onCreateNewClick && (
            <button
              onClick={onCreateNewClick}
              className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Viết bài mới
            </button>
          )}
        </Empty>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <For
        array={blogs}
        render={(blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            actions={renderActions(blog)}
          />
        )}
      />
    </div>
  );
};

export default BlogGrid;
