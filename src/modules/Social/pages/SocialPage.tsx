import React, { memo } from "react";
import { MessageSquare, ExternalLink, Sparkles, Heart } from "lucide-react";
import { YoutubeOutlined, FacebookOutlined, GithubOutlined, LinkedinOutlined } from "@ant-design/icons";
import For from "@/components/UI/Template/For";

interface ISocialChannel {
  name: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  bgColorClass: string;
  iconColorClass: string;
  badgeText?: string;
}

const SocialPage: React.FC = () => {
  const socialChannels: ISocialChannel[] = [
    {
      name: "YouTube Channel",
      description: "Hơn 500+ video bài giảng lập trình miễn phí, livestream chia sẻ kinh nghiệm hàng tuần từ các chuyên gia hàng đầu.",
      icon: <YoutubeOutlined style={{ fontSize: 28 }} />,
      url: "https://youtube.com/c/example_elearning",
      bgColorClass: "hover:bg-red-50 hover:border-red-200",
      iconColorClass: "text-red-600 bg-red-50",
      badgeText: "Nổi bật",
    },
    {
      name: "Discord Community",
      description: "Cộng đồng hơn 20,000+ học viên thảo luận, hỏi đáp lập trình, hỗ trợ lẫn nhau 24/7 và nhận giải đáp từ Mentor.",
      icon: <MessageSquare size={28} />,
      url: "https://discord.gg/example_elearning",
      bgColorClass: "hover:bg-indigo-50 hover:border-indigo-200",
      iconColorClass: "text-indigo-600 bg-indigo-50",
      badgeText: "Cộng đồng",
    },
    {
      name: "Facebook Group",
      description: "Nơi cập nhật thông tin sự kiện, các cuộc thi lập trình và những bài viết chia sẻ kiến thức CNTT bổ ích.",
      icon: <FacebookOutlined style={{ fontSize: 28 }} />,
      url: "https://facebook.com/groups/example_elearning",
      bgColorClass: "hover:bg-blue-50 hover:border-blue-200",
      iconColorClass: "text-blue-600 bg-blue-50",
    },
    {
      name: "GitHub Organization",
      description: "Kho lưu trữ toàn bộ source code mẫu các dự án, bài thực hành và template mã nguồn phục vụ học viên.",
      icon: <GithubOutlined style={{ fontSize: 28 }} />,
      url: "https://github.com/example_elearning",
      bgColorClass: "hover:bg-slate-100 hover:border-slate-300",
      iconColorClass: "text-slate-900 bg-slate-100",
    },
    {
      name: "LinkedIn Platform",
      description: "Cổng thông tin tuyển dụng, kết nối cơ hội việc làm từ hơn 100+ đối tác doanh nghiệp lớn trong và ngoài nước.",
      icon: <LinkedinOutlined style={{ fontSize: 28 }} />,
      url: "https://linkedin.com/company/example_elearning",
      bgColorClass: "hover:bg-cyan-50 hover:border-cyan-200",
      iconColorClass: "text-cyan-700 bg-cyan-50",
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest inline-flex items-center gap-1.5 mb-4">
            <Sparkles size={12} className="animate-pulse" />
            Mạng xã hội & Cộng đồng
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Kết nối với chúng tôi
          </h1>
          <p className="text-slate-500 mt-3 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Đồng hành cùng cộng đồng người học năng động nhất để cập nhật kiến thức mới, chia sẻ cơ hội việc làm và giao lưu học hỏi mỗi ngày.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <For
            array={socialChannels}
            render={(channel, index) => (
              <a
                key={index}
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white border border-slate-100 rounded-3xl p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden ${channel.bgColorClass}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${channel.iconColorClass} transition-colors duration-300`}>
                      {channel.icon}
                    </div>
                    {channel.badgeText && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                        {channel.badgeText}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-slate-800 mb-2">
                    {channel.name}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {channel.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-slate-700 transition-colors">
                  <span>Tham gia ngay</span>
                  <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            )}
          />
        </div>

        {/* Footer Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart size={20} className="text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold">Cùng phát triển mỗi ngày</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Chúng tôi luôn nỗ lực tổ chức các buổi workshop online miễn phí, giải đấu Hackathon và biên soạn cẩm nang nghề nghiệp độc quyền gửi riêng cho các thành viên tích cực. Tham gia cộng đồng ngay hôm nay để không bỏ lỡ!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SocialPage);
