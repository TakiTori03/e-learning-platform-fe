import React, { memo } from "react";
import { Info, Settings, ShieldAlert, CheckSquare } from "lucide-react";
import For from "@/components/UI/Template/For";

interface ICookieType {
  title: string;
  purpose: string;
  examples: string;
}

const CookiePage: React.FC = () => {
  const cookieTypes: ICookieType[] = [
    {
      title: "1. Cookie Thiết Yếu (Strictly Necessary)",
      purpose: "Bắt buộc phải có để trang web vận hành ổn định. Chúng cho phép bạn đăng nhập tài khoản, ghi nhớ trạng thái giỏ hàng (Cart) qua Zustand và truy cập các vùng an toàn của trang web.",
      examples: "Session tokens, Cart state cookies.",
    },
    {
      title: "2. Cookie Hiệu Suất & Phân Tích (Performance & Analytics)",
      purpose: "Thu thập thông tin ẩn danh về cách học viên tương tác với hệ thống (các bài học được xem nhiều nhất, thời gian ở lại trang). Nhờ đó chúng tôi liên tục tối ưu hóa tốc độ tải trang và trải nghiệm người dùng.",
      examples: "Google Analytics cookies, Speed testing cookies.",
    },
    {
      title: "3. Cookie Chức Năng (Functional)",
      purpose: "Ghi nhớ các lựa chọn của bạn như ngôn ngữ hiển thị ưu tiên, tùy chọn âm lượng trình phát video, hoặc giao diện tối/sáng.",
      examples: "Theme setting state, Player custom volume memory.",
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-4">
            <Info className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Chính sách Cookie
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto">
            Trang này giải thích cách chúng tôi sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm học tập và cá nhân hóa dịch vụ dành riêng cho bạn.
          </p>
          <div className="mt-4 text-xs text-slate-400">
            Cập nhật lần cuối: Ngày 04 tháng 06 năm 2026
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <CheckSquare size={20} className="text-slate-500" />
              Cookie là gì?
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Cookie là một tệp văn bản nhỏ được lưu trữ trên máy tính hoặc thiết bị di động của bạn khi bạn truy cập một trang web. Nó giúp trang web ghi nhớ các thông tin đăng nhập, trạng thái giỏ hàng cũng như tùy chọn cài đặt của bạn trong một khoảng thời gian nhất định, để bạn không cần phải nhập lại mỗi khi chuyển trang hoặc quay lại lần sau.
            </p>
          </div>

          {/* Cookie Types Table / List */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Settings size={20} className="text-slate-500" />
              Các loại Cookie chúng tôi sử dụng
            </h2>
            <div className="space-y-6">
              <For
                array={cookieTypes}
                render={(type, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      <span className="font-semibold text-slate-700">Mục đích:</span> {type.purpose}
                    </p>
                    <p className="text-slate-500 text-xs italic">
                      <span className="font-semibold text-slate-600 not-italic">Ví dụ:</span> {type.examples}
                    </p>
                  </div>
                )}
              />
            </div>
          </div>

          {/* How to manage */}
          <div className="border-t border-slate-100 pt-8">
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <ShieldAlert size={20} className="text-slate-500" />
              Cách quản lý và tắt Cookie
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Hầu hết các trình duyệt web đều cho phép bạn kiểm soát cookie thông qua phần cài đặt tùy chỉnh. Bạn có thể chọn chặn tất cả cookie hoặc nhận cảnh báo trước khi một cookie được ghi lại.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-amber-800 text-xs leading-relaxed">
              <strong>⚠️ Lưu ý quan trọng:</strong> Nếu bạn tắt hoàn toàn các cookie thiết yếu, một số chức năng cốt lõi trên trang web như đăng nhập tài khoản học viên, duy trì giỏ hàng mua khóa học hoặc tiến trình làm bài test tự động có thể không hoạt động chính xác.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CookiePage);
