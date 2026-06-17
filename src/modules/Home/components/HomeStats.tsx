import React, { memo } from "react";
import { Users, ClipboardCheck, Award } from "lucide-react";
import For from "@/components/UI/Template/For";

interface IStat {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconBgClass: string;
  iconColorClass: string;
}

export const HomeStats: React.FC = () => {
  const stats: IStat[] = [
    {
      icon: <Users size={24} />,
      value: "19,200",
      label: "HỌC VIÊN",
      iconBgClass: "bg-blue-50",
      iconColorClass: "text-blue-600",
    },
    {
      icon: <ClipboardCheck size={24} />,
      value: "92,000",
      label: "BÀI HỌC HOÀN THÀNH",
      iconBgClass: "bg-indigo-50",
      iconColorClass: "text-indigo-600",
    },
    {
      icon: <Award size={24} />,
      value: "80%",
      label: "TỶ LỆ HOÀN THÀNH KHÓA HỌC",
      iconBgClass: "bg-emerald-50",
      iconColorClass: "text-emerald-600",
    },
  ];

  return (
    <div className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <For
            array={stats}
            render={(stat, index) => (
              <div
                key={index}
                className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col items-center text-center shadow-sm space-y-3"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.iconBgClass} ${stat.iconColorClass}`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-extrabold text-slate-800">
                  {stat.value}
                </div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  {stat.label}
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(HomeStats);
