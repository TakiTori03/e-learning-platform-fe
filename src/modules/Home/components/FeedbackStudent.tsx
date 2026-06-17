import React, { memo } from "react";
import For from "@/components/UI/Template/For";

interface ITestimonial {
  name: string;
  avatar: string;
  description: string;
  bgColor: string;
  textColor: string;
}

export const FeedbackStudent: React.FC = () => {
  const testimonials: ITestimonial[] = [
    {
      name: "CLIVE GRAVES",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Clive",
      description: "Tài liệu học tập rất xuất sắc, phương pháp cố vấn cũng rất tuyệt vời. Các giảng viên đã làm rất tốt việc truyền đạt và tạo ra một môi trường thân thiện, gắn kết. Nhiều khóa học trực tuyến thất bại do người học bị cô lập, nhưng nền tảng này thì hoàn toàn khác. Tôi thực sự học hỏi được rất nhiều.",
      bgColor: "#1e3a8a",
      textColor: "#ffffff",
    },
    {
      name: "NAYA SCHWARTZ",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Naya",
      description: "Tham gia các lớp học trực tuyến tại đây mang lại lợi ích to lớn cho tôi. Các khóa học được thiết kế rất bài bản, giảng viên luôn hỗ trợ nhiệt tình và phản hồi email nhanh chóng. Cảm ơn nền tảng đã giúp tôi vừa học tập linh hoạt vừa phát triển được công việc kinh doanh của mình.",
      bgColor: "#f59e0b",
      textColor: "#0f172a",
    },
    {
      name: "MARIA SANDOVAL",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Maria",
      description: "Tôi đã nhận được chứng chỉ của mình, và tôi muốn gửi lời cảm ơn tới nền tảng vì sự hỗ trợ liên tục. Dù các khóa học đầy thử thách, nhưng các giảng viên luôn ở bên cạnh sẵn sàng hướng dẫn và giúp đỡ tôi. Tôi vô cùng yêu thích các buổi học.",
      bgColor: "#090d16",
      textColor: "#ffffff",
    },
  ];

  return (
    <div className="bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <For
            array={testimonials}
            render={(item, index) => (
              <div
                key={index}
                style={{ backgroundColor: item.bgColor, color: item.textColor }}
                className="rounded-[32px] p-8 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all duration-300"
              >
                <div className="text-xs leading-relaxed italic opacity-90">
                  "{item.description}"
                </div>
                <div 
                  className="flex items-center gap-4 border-t pt-4"
                  style={{ borderColor: item.textColor === "#ffffff" ? "rgba(255,255,255,0.15)" : "rgba(15,23,42,0.15)" }}
                >
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-10 h-10 rounded-xl bg-white/20 object-cover"
                  />
                  <div className="font-extrabold text-[10px] uppercase tracking-wider">
                    {item.name}
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(FeedbackStudent);
