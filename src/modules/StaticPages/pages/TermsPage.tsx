import React, { memo } from "react";
import { FileText, User, HelpCircle, GraduationCap, CreditCard, RefreshCw } from "lucide-react";
import For from "@/components/UI/Template/For";

interface ITermSection {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
}

const TermsPage: React.FC = () => {
  const termSections: ITermSection[] = [
    {
      icon: <User className="text-blue-500" size={20} />,
      title: "1. Đăng ký & Bảo mật tài khoản",
      description: "Khi đăng ký tài khoản học viên tại nền tảng của chúng tôi, bạn đồng ý tuân thủ các quy tắc sau:",
      points: [
        "Cung cấp thông tin đăng ký chính xác, đầy đủ và cập nhật thường xuyên.",
        "Chịu trách nhiệm bảo mật mật khẩu cá nhân và tất cả các hoạt động diễn ra dưới tài khoản của bạn.",
        "Không chia sẻ hoặc bán tài khoản cho bất kỳ bên thứ ba nào học chung. Mọi phát hiện vi phạm sẽ bị khóa tài khoản vĩnh viễn không bồi hoàn."
      ],
    },
    {
      icon: <GraduationCap className="text-purple-500" size={20} />,
      title: "2. Quyền sử dụng nội dung khóa học",
      description: "Các khóa học của chúng tôi được cung cấp cho mục đích học tập cá nhân phi thương mại:",
      points: [
        "Bạn được cấp quyền truy cập trọn đời (trừ khi có quy định khác) vào các khóa học đã mua hợp pháp.",
        "Không sao chép, tải xuống trái phép, ghi hình lại bài giảng, hoặc phân phối lại tài liệu khóa học dưới bất kỳ hình thức nào.",
        "Quyền sở hữu trí tuệ đối với toàn bộ video, mã nguồn mẫu và tài liệu thuộc về giảng viên biên soạn và nền tảng của chúng tôi."
      ],
    },
    {
      icon: <CreditCard className="text-emerald-500" size={20} />,
      title: "3. Thanh toán & Chính sách học phí",
      description: "Quy định giao dịch tài chính mua khóa học trên hệ thống:",
      points: [
        "Học phí hiển thị trên trang web là học phí trọn gói và được thanh toán một lần qua cổng VNPay hoặc phương thức được hỗ trợ.",
        "Nền tảng thường xuyên có các chương trình khuyến mãi, giá trị áp dụng là giá tại thời điểm giao dịch hoàn tất.",
        "Hỗ trợ hoàn học phí trong vòng 7 ngày kể từ lúc thanh toán nếu bạn chưa học quá 10% tổng số thời lượng bài học và có lý do chính đáng."
      ],
    },
    {
      icon: <RefreshCw className="text-amber-500" size={20} />,
      title: "4. Thay đổi điều khoản dịch vụ",
      description: "Quy định về việc cập nhật và điều chỉnh các điều khoản:",
      points: [
        "Chúng tôi có quyền sửa đổi hoặc thay thế các điều khoản dịch vụ này bất cứ lúc nào để phù hợp với quy định pháp luật và nâng cấp hệ thống.",
        "Các thay đổi lớn sẽ được thông báo trực tiếp qua Email hoặc tin nhắn Inbox hệ thống cho học viên ít nhất 3 ngày trước khi có hiệu lực."
      ],
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl mb-4">
            <FileText className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Điều khoản dịch vụ
          </h1>
          <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto">
            Vui lòng đọc kỹ các quy định sử dụng dưới đây để đảm bảo quyền lợi của bạn cũng như duy trì môi trường học tập văn minh, công bằng.
          </p>
          <div className="mt-4 text-xs text-slate-400">
            Cập nhật lần cuối: Ngày 04 tháng 06 năm 2026
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
              <HelpCircle size={20} className="text-slate-500" />
              Quy ước chung
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Chào mừng bạn đến với nền tảng giáo dục số của chúng tôi. Khi sử dụng các dịch vụ, đăng ký tài khoản hoặc mua các khóa học trực tuyến do chúng tôi cung cấp, bạn được xem là đã đồng ý và tuân thủ toàn bộ các điều khoản được mô tả dưới đây. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản này, vui lòng ngừng sử dụng dịch vụ của chúng tôi.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-8">
            <For
              array={termSections}
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
        </div>
      </div>
    </div>
  );
};

export default memo(TermsPage);
