import React, { memo } from "react";
import { Shield, Eye, Lock, FileText, UserCheck, MessageSquare } from "lucide-react";
import For from "@/components/UI/Template/For";

interface IPolicySection {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
}

const PrivacyPage: React.FC = () => {
  const policySections: IPolicySection[] = [
    {
      icon: <Eye className="text-blue-500" size={20} />,
      title: "1. Thu thập thông tin cá nhân",
      description: "Chúng tôi thu thập thông tin để cung cấp dịch vụ tốt hơn cho mọi học viên. Các loại thông tin bao gồm:",
      points: [
        "Thông tin tài khoản: Họ tên, email, số điện thoại, mật khẩu được mã hóa.",
        "Thông tin học tập: Lịch sử xem bài giảng, điểm số các bài kiểm tra, bài nộp thực hành.",
        "Thông tin thanh toán: Lịch sử giao dịch (chúng tôi không lưu thông tin thẻ ngân hàng trực tiếp mà qua cổng VNPay an toàn)."
      ],
    },
    {
      icon: <Lock className="text-purple-500" size={20} />,
      title: "2. Cách thức sử dụng thông tin",
      description: "Thông tin cá nhân của bạn được sử dụng cho các mục đích hợp pháp sau:",
      points: [
        "Cá nhân hóa trải nghiệm học tập, gợi ý khóa học phù hợp với nhu cầu và trình độ.",
        "Xử lý các giao dịch thanh toán mua khóa học và gửi biên lai điện tử.",
        "Cung cấp hỗ trợ kỹ thuật và giải đáp thắc mắc thông qua hệ thống Inbox hoặc Feedback.",
        "Gửi các thông báo quan trọng về tài khoản và cập nhật nội dung học tập mới."
      ],
    },
    {
      icon: <Shield className="text-emerald-500" size={20} />,
      title: "3. Bảo mật thông tin học viên",
      description: "Bảo mật dữ liệu của học viên là ưu tiên hàng đầu của chúng tôi:",
      points: [
        "Mọi dữ liệu truyền tải giữa thiết bị của bạn và máy chủ đều được mã hóa SSL/TLS chuẩn quốc tế.",
        "Mật khẩu tài khoản được băm (hash) bằng thuật toán mã hóa một chiều hiện đại trước khi lưu vào cơ sở dữ liệu.",
        "Giới hạn quyền truy cập thông tin cá nhân: Chỉ nhân viên được phân quyền hỗ trợ trực tiếp mới có quyền xem thông tin cần thiết."
      ],
    },
    {
      icon: <UserCheck className="text-amber-500" size={20} />,
      title: "4. Quyền của bạn đối với dữ liệu cá nhân",
      description: "Bạn có toàn quyền kiểm soát thông tin cá nhân của mình trên hệ thống của chúng tôi:",
      points: [
        "Quyền truy cập và cập nhật: Bạn có thể sửa đổi thông tin cá nhân trực tiếp tại trang cài đặt tài khoản.",
        "Quyền yêu cầu xóa: Bạn có quyền yêu cầu hỗ trợ kỹ thuật xóa vĩnh viễn tài khoản và toàn bộ dữ liệu liên quan.",
        "Quyền rút lại sự đồng ý: Bạn có thể chọn ngừng nhận email thông báo tiếp thị bất kỳ lúc nào."
      ],
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-4">
            <Shield className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Chính sách bảo mật
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto">
            Chúng tôi cam kết bảo mật tuyệt đối thông tin cá nhân và tạo ra môi trường học tập trực tuyến an toàn, đáng tin cậy nhất cho bạn.
          </p>
          <div className="mt-4 text-xs text-slate-400">
            Cập nhật lần cuối: Ngày 04 tháng 06 năm 2026
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <FileText size={20} className="text-slate-500" />
              Lời mở đầu
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Cảm ơn bạn đã lựa chọn nền tảng học tập của chúng tôi. Chính sách bảo mật này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và chia sẻ thông tin cá nhân khi bạn truy cập trang web và đăng ký các khóa học trực tuyến. Bằng cách đăng ký tài khoản, bạn đồng ý với các điều khoản được quy định trong chính sách này.
            </p>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8">
            <For
              array={policySections}
              render={(section, index) => (
                <div key={index} className="border-t border-slate-100 pt-8 first:border-0 first:pt-0">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-50 rounded-xl">
                      {section.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {section.description}
                  </p>
                  <ul className="space-y-2.5">
                    <For
                      array={section.points}
                      render={(point, ptIdx) => (
                        <li key={ptIdx} className="flex gap-2.5 text-sm text-slate-600 items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      )}
                    />
                  </ul>
                </div>
              )}
            />
          </div>

          {/* Contact Section */}
          <div className="border-t border-slate-100 pt-8">
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <MessageSquare size={16} className="text-blue-500" />
                  Bạn có bất kỳ câu hỏi nào?
                </h4>
                <p className="text-xs text-slate-500">
                  Đừng ngần ngại liên hệ với ban quản trị nếu bạn cần làm rõ thêm các điều khoản bảo mật.
                </p>
              </div>
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-10 px-6 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 rounded-xl font-semibold text-xs shadow-sm hover:border-slate-300 transition-colors"
              >
                Gửi câu hỏi của bạn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PrivacyPage);
