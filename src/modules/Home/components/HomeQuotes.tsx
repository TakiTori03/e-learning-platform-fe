import React, { memo } from "react";

export const HomeQuotes: React.FC = () => {
  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Author image cover */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative rounded-[32px] overflow-hidden shadow-lg aspect-square w-full max-w-md bg-slate-100">
            <img
              src="https://i.imgur.com/osnehcc.jpg"
              alt="Get Closer To Your Goals"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>
        </div>

        {/* Right Side: Quote content */}
        <div className="space-y-6">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
            Tầm nhìn & Sứ mệnh
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tiến Gần Hơn Đến Mục Tiêu Của Bạn
          </h2>
          <p className="text-slate-600 text-xs leading-relaxed">
            Bạn có đang cảm thấy quá tải trước sự bùng nổ của các nền tảng và kênh truyền thông kỹ thuật số? Bạn chưa biết cách định hướng hiệu quả nhất trong môi trường mới này để tương tác thành công hơn nữa với đồng nghiệp của mình?
          </p>
          <p className="text-slate-600 text-xs leading-relaxed">
            Học tập cùng chúng tôi sẽ giúp bạn nắm bắt cách tạo dựng, tiếp thu và truyền tải giá trị thực tế trong kỷ nguyên số. Bạn sẽ sở hữu những chiến lược thông minh để tối ưu hóa hiệu suất công việc cũng như sự hài lòng của bản thân cả khi học trực tuyến lẫn thực tế.
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeQuotes);
