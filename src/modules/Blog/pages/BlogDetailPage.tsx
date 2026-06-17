import { For, Show } from "@/components/UI/Template";
import CourseCard from "@/modules/Courses/components/CourseCard";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate, formatFullName } from "@/utils/format";
import {
  ArrowLeftOutlined,
  BookOutlined,
  CalendarOutlined,
  CopyOutlined,
  EyeOutlined,
  FlagFilled,
  FlagOutlined,
  HeartFilled,
  HeartOutlined,
  ReadOutlined,
  ShareAltOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Divider, message, Space, Spin, Tooltip, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BlogCommentSection } from "../components/BlogCommentSection";
import { useBlogDetail, useBlogList, useBlogRelatedCourses, useLikeBlogMutation, useReportBlogMutation } from "../hooks/useBlogQueries";

const { Title, Paragraph, Text } = Typography;

export const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);

  // Queries
  const { data: blog, isLoading } = useBlogDetail(id || "");
  const likeMutation = useLikeBlogMutation();
  const reportMutation = useReportBlogMutation();

  // Query related blogs
  const { data: relatedBlogsData } = useBlogList({
    page: 0,
    size: 5,
    status: "PUBLISHED",
  });

  const relatedBlogs = useMemo(() => {
    return (relatedBlogsData?.content || []).filter((b: any) => b.id !== id).slice(0, 3);
  }, [relatedBlogsData, id]);

  // Query popular/recommended courses for the sidebar
  const { data: coursesData, isLoading: isCoursesLoading } = useBlogRelatedCourses(id || "");

  const courses = coursesData || [];

  const handleLike = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để thích bài viết!");
      return;
    }
    try {
      await likeMutation.mutateAsync(id!);
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleReport = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập để báo cáo bài viết vi phạm!");
      return;
    }
    try {
      await reportMutation.mutateAsync(id!);
      message.success("Báo cáo bài viết thành công!");
    } catch {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    message.success("Đã sao chép liên kết bài viết!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 gap-3">
        <Spin size="large" tip="Đang tải bài viết..." />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center py-24 gap-4">
        <ReadOutlined className="text-slate-300 text-6xl" />
        <h2 className="text-xl font-bold text-slate-700 font-serif">Bài viết không tồn tại hoặc đã bị xóa</h2>
        <button
          onClick={() => navigate("/blog")}
          className="text-slate-700 font-semibold hover:underline flex items-center gap-1.5 font-sans"
        >
          <ArrowLeftOutlined /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const isLiked = blog.likedUserIds?.includes(user?.id || "");
  const likesCount = blog.likedUserIds?.length || 0;
  const isReported = blog.reportedUserIds?.includes(user?.id || "") || false;

  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      {/* Container */}
      <div className="container mx-auto px-4 max-w-5xl pt-8 space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-semibold text-xs uppercase tracking-wide font-sans"
          >
            <ArrowLeftOutlined /> Quay lại danh sách
          </button>

          <Space size="middle">
            <Tooltip title={copied ? "Đã sao chép!" : "Sao chép liên kết"}>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
              >
                {copied ? <CopyOutlined /> : <ShareAltOutlined />}
              </button>
            </Tooltip>
          </Space>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main content column (Left) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header info */}
            <div className="space-y-4">
              <div className="flex gap-1.5 flex-wrap">
                <For
                  array={blog.tags || []}
                  render={(tag) => (
                    <span key={tag} className="text-slate-600 border border-gray-200 bg-gray-50 text-[10px] font-bold px-2.5 py-0.5 rounded">
                      {tag}
                    </span>
                  )}
                />
              </div>

              <Title level={1} className="!text-slate-900 !font-bold text-2xl md:text-3xl leading-tight font-serif !m-0">
                {blog.title}
              </Title>

              {/* Author & Stats bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <Avatar src={blog.author?.avatar} size={40} className="border border-gray-200 bg-gray-50">
                    {blog.author?.firstName?.charAt(0) || <ReadOutlined />}
                  </Avatar>
                  <div className="flex flex-col">
                    <Text strong className="text-slate-800 text-xs font-sans">
                      {blog.author && formatFullName(blog.author)}
                    </Text>
                    <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-0.5 font-sans">
                      <span className="flex items-center gap-1">
                        <CalendarOutlined /> {formatDate(blog.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-slate-400 text-xs font-sans">
                  <span className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded">
                    <EyeOutlined /> {blog.viewsCount || 0}
                  </span>
                  <button
                    onClick={handleLike}
                    disabled={likeMutation.isPending}
                    className={`flex items-center gap-1 border px-3 py-1 rounded transition-all cursor-pointer ${
                      isLiked
                        ? "bg-red-50 border-red-200 text-red-600 font-semibold"
                        : "bg-white border-gray-300 text-slate-500 hover:text-red-600 hover:border-red-300"
                    }`}
                  >
                    {isLiked ? <HeartFilled className="text-red-600" /> : <HeartOutlined />}
                    {likesCount}
                  </button>
                  <button
                    onClick={handleReport}
                    disabled={reportMutation.isPending || isReported}
                    className={`flex items-center gap-1 border px-3 py-1 rounded transition-all cursor-pointer ${
                      isReported
                        ? "bg-orange-50 border-orange-200 text-orange-600 font-semibold cursor-not-allowed"
                        : "bg-white border-gray-300 text-slate-500 hover:text-orange-600 hover:border-orange-300"
                    }`}
                  >
                    {isReported ? <FlagFilled className="text-orange-600" /> : <FlagOutlined />}
                    {isReported ? "Đã báo cáo" : "Báo cáo"}
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <Show>
              <Show.When isTrue={!!blog.thumbnailUrl}>
                <div className="border border-gray-200 rounded overflow-hidden aspect-[21/9] bg-gray-50">
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
              </Show.When>
            </Show>

            {/* Content Article */}
            <article className="bg-white border border-gray-200 rounded p-6 md:p-8 bg-white font-serif">
              <Paragraph className="text-slate-500 text-sm md:text-base font-medium leading-relaxed italic border-l-2 border-slate-700 pl-4 mb-6 font-sans">
                {blog.summary}
              </Paragraph>

              <div
                className="prose max-w-none text-slate-800 text-sm md:text-base leading-relaxed space-y-6 blog-content-body"
                dangerouslySetInnerHTML={{ __html: blog.content || "" }}
              />
            </article>

            <Divider className="border-gray-100 m-0" />

            {/* Comments block */}
            <BlogCommentSection postId={blog.id} />
          </div>

          {/* Sidebar Column (Right) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6 font-sans">
            {/* Author Profile block */}
            <Card className="rounded border border-gray-200 shadow-none bg-gray-50/50">
              <div className="flex flex-col items-center text-center space-y-3">
                <Avatar src={blog.author?.avatar} size={64} className="border border-gray-300 bg-gray-50">
                  {blog.author?.firstName?.charAt(0) || <UserOutlined />}
                </Avatar>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-800 text-sm block font-serif">
                    {blog.author && formatFullName(blog.author)}
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 border border-gray-300 bg-gray-100 px-2 py-0.5 rounded uppercase tracking-wider inline-block">
                    {blog.author?.role === "ADMIN" ? "Quản trị viên" : "Giảng viên"}
                  </span>
                </div>
                <Paragraph className="text-slate-500 text-xs leading-relaxed max-w-xs m-0">
                  Giảng viên tâm huyết tại E-Learning Platform, chuyên môn cao trong giảng dạy công nghệ và truyền động lực cho học viên tự học lập trình hiệu quả.
                </Paragraph>
              </div>
            </Card>

            {/* Related Articles Card */}
            <Show>
              <Show.When isTrue={relatedBlogs.length > 0}>
                <Card title={<span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Bài viết liên quan</span>} className="rounded border border-gray-200 shadow-none">
                  <div className="space-y-4">
                    <For
                      array={relatedBlogs}
                      render={(rel: any) => (
                        <div key={rel.id} className="flex gap-2.5 items-start group cursor-pointer" onClick={() => navigate(`/blog-detail/${rel.id}`)}>
                          <div className="w-14 h-10 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-200">
                            <img
                              src={rel.thumbnailUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=150&auto=format&fit=crop&q=80"}
                              alt={rel.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <span className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug group-hover:underline">
                              {rel.title}
                            </span>
                            <span className="text-[9px] text-slate-400 flex items-center gap-1">
                              <CalendarOutlined /> {formatDate(rel.createdAt)}
                            </span>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </Card>
              </Show.When>
            </Show>

            {/* Recommended Courses Card */}
            <Show>
              <Show.When isTrue={courses.length > 0}>
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1 px-1 m-0">
                    <BookOutlined className="text-slate-700" />
                    Khóa học gợi ý
                  </h3>
                  <div className="space-y-4">
                    <For
                      array={courses}
                      render={(course: any) => (
                        <div key={course.id} className="sidebar-course-card classic-course-card">
                          <CourseCard item={course} loading={isCoursesLoading} />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </Show.When>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
