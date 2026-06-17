import CButton from "@/components/UI/Button";
import CInput from "@/components/UI/Input";
import CSelect from "@/components/UI/Select";
import { For, Show } from "@/components/UI/Template";
import { useAllInstructors } from "@/modules/Courses/queryHooks/useCourseQueries";
import { formatDate, formatFullName } from "@/utils/format";
import { CloseCircleOutlined, EyeOutlined, HeartOutlined, ReadOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Col, Empty, Pagination, Row, Typography } from "antd";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBlogList } from "../hooks/useBlogQueries";
import type { IBlogPost } from "../types";

const { Title, Paragraph, Text } = Typography;

export const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [search, setSearch] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState("newest");

  // Query instructors from identity-service via useAllInstructors
  const { data: instructorData } = useAllInstructors();
  const instructors = instructorData || [];

  // Queries
  const { data: blogsData, isLoading } = useBlogList({
    page: page - 1,
    size: pageSize,
    q: search || undefined,
    authorId: selectedAuthor || undefined,
    status: "PUBLISHED",
    sort,
  });

  const blogs = blogsData?.content || [];
  const totalElements = blogsData?.totalElements || 0;

  // Extract featured blog (first blog in list on first page)
  const featuredBlog = useMemo(() => {
    if (page === 1 && blogs.length > 0 && !search && !selectedAuthor) {
      return blogs[0];
    }
    return null;
  }, [blogs, page, search, selectedAuthor]);

  // Blogs list excluding featured blog
  const regularBlogs = useMemo(() => {
    if (featuredBlog) {
      return blogs.slice(1);
    }
    return blogs;
  }, [blogs, featuredBlog]);

  const handleCardClick = (id: string) => {
    navigate(`/blog-detail/${id}`);
  };

  const isFiltered = !!selectedAuthor;

  const handleClearFilters = () => {
    setSelectedAuthor(undefined);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white pb-16 font-sans">
      <div className="container mx-auto px-4 max-w-5xl pt-8 space-y-8">
        {/* 2. Basic Minimal Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          {/* Search Box */}
          <div className="w-full md:max-w-xs">
            <CInput
              placeholder="Tìm kiếm bài viết..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="rounded border-gray-300 w-full h-10 font-sans"
              allowClear
            />
          </div>

          {/* Filters and Sorting Group */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4 w-full md:w-auto">
            {/* Author filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide font-sans shrink-0">Tác giả:</span>
              <CSelect
                placeholder="Chọn tác giả..."
                value={selectedAuthor}
                onChange={(value) => {
                  setSelectedAuthor(value || undefined);
                  setPage(1);
                }}
                allowClear
                className="h-10 rounded text-xs w-full sm:w-[180px]"
                options={instructors.map((inst: any) => ({
                  label: formatFullName(inst),
                  value: inst.id,
                }))}
              />
            </div>

            {/* Sort Select & Clear Filters Group */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2 flex-1 sm:flex-none">
                <CButton className="rounded-md bg-gray-50 border-gray-200 text-gray-600 h-10 hover:bg-gray-100 transition-colors shrink-0">
                  Sắp xếp
                </CButton>
                <CSelect
                  value={sort}
                  style={{ width: 160 }}
                  onChange={(value) => {
                    setSort(value);
                    setPage(1);
                  }}
                  className="h-10 rounded text-xs w-full sm:w-[160px]"
                  options={[
                    { label: "Mới nhất", value: "newest" },
                    { label: "Xem nhiều nhất", value: "mostViews" },
                    { label: "Yêu thích nhất", value: "mostLikes" },
                  ]}
                />
              </div>

              {/* Clear Filters */}
              <div className={`${isFiltered ? "visible" : "invisible"} shrink-0`}>
                <CButton
                  type="link"
                  onClick={handleClearFilters}
                  className="text-gray-400 hover:text-gray-600 p-0 flex items-center gap-1 text-sm h-10 font-sans transition-colors font-medium ml-2"
                >
                  Clear Filters <CloseCircleOutlined style={{ fontSize: 12 }} />
                </CButton>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Featured Post (Classic Split View) */}
        <Show>
          <Show.When isTrue={!!featuredBlog}>
            {featuredBlog && (
              <div
                onClick={() => handleCardClick(featuredBlog.id)}
                className="border border-gray-200 rounded-md overflow-hidden hover:border-slate-400 transition-colors cursor-pointer grid grid-cols-1 md:grid-cols-12 bg-white"
              >
                {/* Thumbnail */}
                <div className="relative md:col-span-5 h-64 md:h-full min-h-[260px] overflow-hidden bg-gray-50 border-r border-gray-100">
                  <img
                    src={featuredBlog.thumbnailUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-red-600 text-white text-[9px] font-bold py-0.5 px-2 rounded uppercase tracking-wider">
                      Nổi bật
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 md:col-span-7 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {featuredBlog.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-slate-500 border border-gray-200 bg-gray-50 text-[10px] font-semibold px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Title level={2} className="!text-slate-900 !font-bold text-xl md:text-2xl leading-tight font-serif hover:text-slate-700">
                        {featuredBlog.title}
                      </Title>
                      <Paragraph className="text-slate-500 text-sm line-clamp-3 leading-relaxed font-sans m-0">
                        {featuredBlog.summary}
                      </Paragraph>
                    </div>
                  </div>

                  {/* Author & Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-6">
                    <div className="flex items-center gap-2.5">
                      <Avatar src={featuredBlog.author?.avatar} size={36} className="border border-gray-200 bg-gray-50 text-[10px]">
                        {featuredBlog.author?.firstName?.charAt(0) || <ReadOutlined />}
                      </Avatar>
                      <div className="flex flex-col">
                        <Text strong className="text-slate-800 text-xs font-sans">
                          {featuredBlog.author && formatFullName(featuredBlog.author)}
                        </Text>
                        <Text type="secondary" className="text-[10px] font-sans">
                          {formatDate(featuredBlog.createdAt)}
                        </Text>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-xs font-sans">
                      <span className="flex items-center gap-1">
                        <EyeOutlined className="text-xs" /> {featuredBlog.viewsCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <HeartOutlined className="text-xs" /> {featuredBlog.likedUserIds?.length || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Show.When>
        </Show>

        {/* 4. Regular Posts Grid (Classic Editorial Layout) */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
              <span className="text-slate-500 text-xs font-medium font-sans">Đang tải các bài viết...</span>
            </div>
          ) : regularBlogs.length === 0 && !featuredBlog ? (
            <Empty description="Không tìm thấy bài viết nào phù hợp" className="py-16 bg-white border border-gray-200 rounded" />
          ) : (
            <>
              <Row gutter={[24, 24]}>
                <For
                  array={regularBlogs}
                  render={(blog: IBlogPost) => (
                    <Col xs={24} md={12} lg={8} key={blog.id}>
                      <div
                        onClick={() => handleCardClick(blog.id)}
                        className="bg-white border border-gray-200 rounded overflow-hidden hover:border-slate-400 transition-colors cursor-pointer flex flex-col h-full"
                      >
                        {/* Thumbnail */}
                        <div className="relative h-44 overflow-hidden bg-gray-50 shrink-0 border-b border-gray-100">
                          <img
                            src={blog.thumbnailUrl || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80"}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                          <div className="space-y-3">
                            <div className="flex gap-1 flex-wrap">
                              {blog.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="text-slate-500 border border-gray-200 bg-gray-50 text-[9px] font-semibold px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="space-y-1">
                              <Title level={4} className="!text-slate-900 !font-bold text-base line-clamp-2 leading-snug font-serif hover:text-slate-700 m-0">
                                {blog.title}
                              </Title>
                              <Paragraph className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-0 font-sans">
                                {blog.summary}
                              </Paragraph>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between border-t border-gray-100 pt-3 shrink-0">
                            <div className="flex items-center gap-2">
                              <Avatar src={blog.author?.avatar} size={26} className="border border-gray-200 bg-gray-50 text-[10px]">
                                {blog.author?.firstName?.charAt(0) || <ReadOutlined />}
                              </Avatar>
                              <span className="font-semibold text-slate-700 text-xs truncate max-w-[100px] font-sans">
                                {blog.author && formatFullName(blog.author)}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-slate-400 text-[11px] font-sans">
                              <span className="flex items-center gap-0.5">
                                <EyeOutlined className="text-xs" /> {blog.viewsCount || 0}
                              </span>
                              <span className="flex items-center gap-0.5">
                                <HeartOutlined className="text-xs" /> {blog.likedUserIds?.length || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  )}
                />
              </Row>

              {/* 5. Pagination */}
              {totalElements > pageSize && (
                <div className="flex justify-center pt-8 border-t border-gray-100 mt-6">
                  <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={totalElements}
                    onChange={(p) => setPage(p)}
                    showSizeChanger={false}
                    className="font-sans"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogListPage;
