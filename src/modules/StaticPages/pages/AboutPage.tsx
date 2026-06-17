import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import CButton from "@/components/UI/Button";
import { pathRoutes } from "@/constants/routes";

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartLearning = () => {
    navigate(pathRoutes.courses);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans text-slate-800 selection:bg-slate-200">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-8 pt-32 pb-24">
        <div className="space-y-8 max-w-3xl">
          <div className="text-xs tracking-[0.2em] uppercase text-slate-400 font-medium">
            // VỀ CHÚNG TÔI
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-slate-900 tracking-tight leading-[1.15]">
            Kiến tạo tương lai số <br />
            <span className="font-normal text-slate-950">thông qua tri thức mở.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-light max-w-2xl pt-2">
            Nền tảng e-learning thế hệ mới kết nối bạn với những kiến thức thực tế, nâng tầm sự nghiệp và kiến tạo những cơ hội bứt phá trong kỷ nguyên số.
          </p>
          <div className="pt-4">
            <button
              onClick={handleStartLearning}
              className="group inline-flex items-center gap-2 text-sm font-semibold tracking-wider uppercase text-slate-900 hover:text-slate-600 transition-colors duration-300"
              id="btn-hero-courses"
            >
              <span>Khám phá khóa học</span>
              <ArrowUpRight size={18} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-slate-200/60 bg-white">
        <div className="max-w-5xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            <div className="group space-y-2">
              <div className="text-4xl md:text-5xl font-light text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                150,000+
              </div>
              <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Học viên active
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Học viên trên khắp cả nước tin tưởng đồng hành cùng chúng tôi.
              </p>
            </div>
            <div className="group space-y-2 md:border-l md:border-slate-200/60 md:pl-8">
              <div className="text-4xl md:text-5xl font-light text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                1,200+
              </div>
              <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Khóa học chất lượng
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Đa dạng chủ đề từ lập trình, thiết kế, kinh doanh tới kỹ năng mềm.
              </p>
            </div>
            <div className="group space-y-2 md:border-l md:border-slate-200/60 md:pl-8">
              <div className="text-4xl md:text-5xl font-light text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                350+
              </div>
              <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Chuyên gia hàng đầu
              </div>
              <p className="text-sm text-slate-400 leading-relaxed font-light">
                Giảng viên là các chuyên gia có nhiều năm kinh nghiệm thực tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Content Section */}
      <section className="max-w-5xl mx-auto px-8 py-24 space-y-20">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 font-mono">
              01 / SỨ MỆNH
            </h2>
          </div>
          <div className="md:col-span-8 space-y-6">
            <p className="text-slate-600 leading-relaxed text-base font-light">
              Chúng tôi tin rằng cơ hội học tập chất lượng cao là quyền lợi cơ bản của mỗi cá nhân trong thế giới hiện đại. Được thành lập vào năm 2024, dự án hướng tới việc xóa bỏ mọi rào cản về địa lý, tài chính và công nghệ, giúp mọi người có thể học tập từ những chuyên gia giỏi nhất vào bất cứ lúc nào.
            </p>
            <p className="text-slate-600 leading-relaxed text-base font-light">
              Không chỉ là những video bài học khô khan, chúng tôi xây dựng một hệ sinh thái học tập tương tác toàn diện bao gồm: bài thực hành thực tế, thảo luận trực tiếp cùng cộng đồng, hỗ trợ giải đáp trực tiếp và hệ thống kiểm tra đánh giá năng lực minh bạch.
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-200/60" />

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400 font-mono">
              02 / GIÁ TRỊ CỐT LÕI
            </h2>
          </div>
          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900 text-sm tracking-wide uppercase">
                  Chất lượng hàng đầu
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  Tất cả bài học đều được biên soạn kỹ lưỡng và kiểm duyệt nghiêm ngặt bởi ban cố vấn chuyên môn trước khi xuất bản.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900 text-sm tracking-wide uppercase">
                  Tận tâm đồng hành
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  Đội ngũ trợ giảng hỗ trợ 24/7 giải đáp mọi thắc mắc của học viên trong suốt quá trình tiếp thu kiến thức.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium text-slate-900 text-sm tracking-wide uppercase">
                  Đáng tin & Minh bạch
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  Chính sách rõ ràng và chứng chỉ hoàn thành khóa học được công nhận rộng rãi bởi nhiều đối tác doanh nghiệp uy tín.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-200/60 bg-white py-24">
        <div className="max-w-5xl mx-auto px-8 text-center space-y-6">
          <h2 className="text-3xl font-light text-slate-900 tracking-tight">
            Sẵn sàng để bắt đầu hành trình mới?
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto font-light">
            Đăng ký ngay tài khoản miễn phí để nhận quyền truy cập vào các khóa học thử nghiệm của chúng tôi.
          </p>
          <div className="pt-4">
            <CButton
              onClick={() => navigate("/register")}
              className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 rounded-full font-semibold border-none shadow-sm transition-all duration-300"
              id="btn-register-cta"
            >
              Đăng ký ngay
            </CButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(AboutPage);

