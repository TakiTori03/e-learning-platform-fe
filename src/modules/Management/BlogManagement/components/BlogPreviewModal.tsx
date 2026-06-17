import { Show } from "@/components/UI/Template";
import { BlogCommentSection } from "@/modules/Blog/components/BlogCommentSection";
import { useBlogDetail } from "@/modules/Blog/hooks/useBlogQueries";
import { formatDate, formatFullName } from "@/utils/format";
import { CalendarOutlined, EyeOutlined, HeartOutlined, ReadOutlined } from "@ant-design/icons";
import { Avatar, Divider, Modal, Spin, Tag, Typography } from "antd";
import React from "react";

const { Title, Paragraph, Text } = Typography;

interface BlogPreviewModalProps {
  open: boolean;
  onCancel: () => void;
  blogId: string | null;
}

export const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({ open, onCancel, blogId }) => {
  const { data: blog, isLoading } = useBlogDetail(blogId || "", { staleTime: 0 });

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      styles={{ body: { maxHeight: "80vh", overflowY: "auto", padding: "24px" } }}
      destroyOnClose
      centered
    >
      <Show>
        <Show.When isTrue={isLoading}>
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Spin size="large" tip="Đang tải chi tiết bài viết..." />
          </div>
        </Show.When>
        <Show.When isTrue={!blog && !isLoading}>
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <ReadOutlined className="text-slate-300 text-6xl" />
            <h3 className="text-lg font-bold text-slate-700">Bài viết không tồn tại hoặc đã bị ẩn</h3>
          </div>
        </Show.When>
        <Show.Else>
          {blog && (
            <div className="space-y-6 font-sans">
              {/* Cover Image */}
              {blog.thumbnailUrl && (
                <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0">
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>
              )}

              {/* Title & Tags */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {blog.tags?.map((tag) => (
                    <Tag
                      key={tag}
                      className="text-[10px] px-2.5 py-0.5 border-gray-200 text-gray-500 bg-gray-50 rounded font-semibold m-0 uppercase tracking-wider"
                    >
                      {tag}
                    </Tag>
                  ))}
                </div>
                <Title level={2} className="!font-bold !text-slate-900 !m-0 font-serif leading-tight">
                  {blog.title}
                </Title>
              </div>

              {/* Author & Stats bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar src={blog.author?.avatar} size={40} className="border border-gray-200 bg-gray-50">
                    {blog.author?.firstName?.charAt(0) || <ReadOutlined />}
                  </Avatar>
                  <div className="flex flex-col">
                    <Text strong className="text-slate-800 text-xs">
                      {blog.author
                        && formatFullName(blog.author)
                       }
                    </Text>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-0.5">
                      <span className="flex items-center gap-1">
                        <CalendarOutlined /> {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded">
                    <EyeOutlined /> {blog.viewsCount || 0} lượt xem
                  </span>
                  <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded">
                    <HeartOutlined /> {blog.likedUserIds?.length || 0} lượt thích
                  </span>
                </div>
              </div>

              {/* Summary & Content */}
              <div className="space-y-4">
                <Paragraph className="text-slate-500 text-sm font-medium leading-relaxed italic border-l-2 border-slate-700 pl-4 mb-4">
                  {blog.summary}
                </Paragraph>
                <div
                  className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-6 blog-content-body font-serif border border-gray-100 bg-gray-50/30 rounded-xl p-6"
                  dangerouslySetInnerHTML={{ __html: blog.content || "" }}
                />
              </div>

              <Divider className="border-gray-100 m-0" />

              {/* Comment Section inside the Modal */}
              <div className="comment-section-wrapper">
                <BlogCommentSection postId={blog.id} />
              </div>
            </div>
          )}
        </Show.Else>
      </Show>
    </Modal>
  );
};

export default BlogPreviewModal;
