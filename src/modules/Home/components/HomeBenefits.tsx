import React, { memo } from "react";
import { Edit3, Globe, Briefcase } from "lucide-react";
import For from "@/components/UI/Template/For";

interface IBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColorClass: string;
  iconBgClass: string;
}

export const HomeBenefits: React.FC = () => {
  const benefits: IBenefit[] = [
    {
      icon: <Edit3 size={22} />,
      title: "Phương pháp thực chiến",
      description: "Chương trình đào tạo chú trọng thực hành dự án thực tế. Sự thành công của học viên là thước đo giá trị chính xác nhất cho chất lượng giảng dạy.",
      iconColorClass: "text-blue-600",
      iconBgClass: "bg-blue-50",
    },
    {
      icon: <Globe size={22} />,
      title: "Định hướng toàn cầu",
      description: "Kiến thức thực tiễn giúp học viên nhanh chóng bắt nhịp thị trường và tự tin cung cấp dịch vụ chuyên môn trên môi trường toàn cầu.",
      iconColorClass: "text-indigo-600",
      iconBgClass: "bg-indigo-50",
    },
    {
      icon: <Briefcase size={22} />,
      title: "Bứt phá sự nghiệp",
      description: "Dù mục tiêu của bạn là thăng tiến trong tổ chức hay tối ưu hóa hoạt động kinh doanh bằng các mô hình số hóa hiện đại, đây chính là lộ trình lý tưởng.",
      iconColorClass: "text-emerald-600",
      iconBgClass: "bg-emerald-50",
    },
  ];

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Lợi ích từ các chương trình đào tạo
          </h2>
          <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
            Đội ngũ giảng viên hàng đầu thiết lập các lộ trình học tập truyền cảm hứng dành riêng cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <For
            array={benefits}
            render={(benefit, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-100 rounded-3xl p-8 hover:shadow-lg hover:border-slate-200 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${benefit.iconBgClass} ${benefit.iconColorClass}`}>
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(HomeBenefits);
