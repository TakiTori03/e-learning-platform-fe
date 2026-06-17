import { For, Show } from "@/components/UI/Template";
import { formatDate, formatFullName } from "@/utils/format";
import { Avatar, Card, Skeleton } from "antd";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import React, { memo } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

// Fix react-slick default export issue in Vite/ESM
const SliderComponent = (Slider as any).default || Slider;

interface Props {
  blogs: any[];
  isLoading: boolean;
}

const SlickPrevArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} !flex items-center justify-center !w-9 !h-9 !bg-slate-100 border border-slate-200 rounded-full hover:!bg-slate-200 !text-slate-600 transition-colors z-10`}
      style={{ ...style, left: "-45px" }}
      onClick={onClick}
    >
      <ChevronLeft size={18} className="text-slate-600" />
    </button>
  );
};

const SlickNextArrow = (props: any) => {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} !flex items-center justify-center !w-9 !h-9 !bg-slate-100 border border-slate-200 rounded-full hover:!bg-slate-200 !text-slate-600 transition-colors z-10`}
      style={{ ...style, right: "-45px" }}
      onClick={onClick}
    >
      <ChevronRight size={18} className="text-slate-600" />
    </button>
  );
};

export const BlogsSlider: React.FC<Props> = ({ blogs, isLoading }) => {
  const settings = {
    prevArrow: <SlickPrevArrow />,
    nextArrow: <SlickNextArrow />,
    dots: false,
    infinite: false,
    arrows: true,
    speed: 300,
    slidesToShow: Math.min(4, blogs.length || 1),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, blogs.length || 1),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(2, blogs.length || 1),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  const hasBlogs = blogs.length > 0;

  return (
    <div className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-12 flex items-center gap-2">
          <FileText size={28} className="text-blue-600" />
          Bài viết nổi bật
        </h2>

        <Show>
          <Show.When isTrue={isLoading}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <For
                array={[1, 2, 3, 4]}
                render={(_, idx) => (
                  <Card key={idx} style={{ width: "100%", height: 380 }}>
                    <Skeleton active />
                  </Card>
                )}
              />
            </div>
          </Show.When>

          <Show.When isTrue={!isLoading && !hasBlogs}>
            <div className="text-center py-12 text-slate-400 text-xs">
              Chưa có bài viết blog nào.
            </div>
          </Show.When>

          <Show.Else>
            <SliderComponent {...settings} className="blogs-slider">
              <For
                array={blogs}
                render={(blog) => {
                  const blogId = blog.id || blog._id;
                  return (
                    <div key={blogId} className="px-3 py-1">
                      <Link to={`/blog-detail/${blogId}`}>
                        <Card
                          hoverable
                          className="overflow-hidden h-[410px] flex flex-col [&_.ant-card-body]:flex-1 [&_.ant-card-body]:flex [&_.ant-card-body]:flex-col"
                          cover={
                            <div className="h-44 overflow-hidden relative">
                              <div className="absolute top-2.5 left-2.5 z-10 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 uppercase tracking-wider">
                                <span>📌</span> Nổi bật
                              </div>
                              <img
                                alt={blog.title}
                                src={blog.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80";
                                }}
                              />
                            </div>
                          }
                        >
                          <Card.Meta
                            title={
                              <span className="font-bold text-xs text-slate-800 line-clamp-2 block leading-snug">
                                {blog.title}
                              </span>
                            }
                            description={
                              <div
                                className="text-[11px] text-slate-500 line-clamp-3 mt-2"
                                dangerouslySetInnerHTML={{
                                  __html: blog.content || "",
                                }}
                              ></div>
                            }
                          />

                          {/* Author Info footer */}
                          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-gray-100 shrink-0">
                            <Avatar src={blog.author?.avatar} size={24} className="border border-gray-100 bg-gray-50 shrink-0">
                              {blog.author?.firstName?.charAt(0) || "U"}
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-bold text-slate-700 truncate m-0 leading-tight">
                                {blog.author && formatFullName(blog.author)}
                              </p>
                              <p className="text-[9px] text-slate-400 m-0 leading-none mt-0.5">
                                {blog.createdAt ? formatDate(blog.createdAt) : ""}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </div>
                  );
                }}
              />
            </SliderComponent>
          </Show.Else>
        </Show>
      </div>
    </div>
  );
};

export default memo(BlogsSlider);
