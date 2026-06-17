import React, { memo } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import CButton from "@/components/UI/Button";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export const HomeHero: React.FC = () => {
  const navigate = useNavigate();
  const isAuth = useAuthStore((state) => state.isAuth);

  const handleStartNow = () => {
    if (isAuth) {
      navigate("/start");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-300 border border-blue-400/20 uppercase tracking-widest inline-block mb-2">
          EdTech E-Learning
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent leading-[1.2]">
          Học tập chuyên nghiệp, tương tác lớp học thực tế và giáo trình đạt chuẩn quốc tế
        </h1>
        <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Hệ thống quản lý học tập thế hệ mới giúp bạn nâng cấp kỹ năng nhanh chóng.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <CButton
            type="primary"
            onClick={handleStartNow}
            className="h-12 px-8 font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 border-none flex items-center gap-2 shadow-lg shadow-blue-500/20"
            id="btn-hero-start-now"
          >
            <span>Bắt đầu ngay</span>
            <ArrowRight size={16} />
          </CButton>
          <CButton
            onClick={() => navigate("/courses")}
            className="h-12 px-6 font-semibold rounded-xl bg-slate-950/40 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
            id="btn-hero-view-courses"
          >
            Khám phá khóa học
          </CButton>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeHero);
