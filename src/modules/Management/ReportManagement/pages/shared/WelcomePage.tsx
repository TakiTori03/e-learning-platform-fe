import CButton from "@/components/UI/Button";
import { For } from "@/components/UI/Template";
import { pathRoutes } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";
import { formatFullName } from "@/utils/format";
import { Card, Col, Row, Space, theme, Typography } from "antd";
import {
  BookOpen,
  FolderOpen,
  MessageSquare,
  PlusCircle,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users
} from "lucide-react";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const WelcomePage: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const roleName = user?.role || "GUEST";
  const isAdmin = roleName === "ADMIN";
  const fullName = formatFullName(user) || (isAdmin ? "Admin" : "Giảng viên");

  const adminActions = [
    {
      title: "Danh sách khóa học",
      description: "Kiểm duyệt nội dung, phê duyệt và quản lý toàn bộ các khóa học trên hệ thống.",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      onClick: () => navigate(pathRoutes.admin.courses),
    },
    {
      title: "Danh mục khóa học",
      description: "Tạo mới và quản lý các danh mục phân loại khóa học của hệ thống.",
      icon: <FolderOpen className="w-6 h-6 text-emerald-600" />,
      onClick: () => navigate(pathRoutes.admin.categories),
    },
    {
      title: "Thảo luận bài học",
      description: "Xem và quản lý các bình luận, trao đổi thảo luận của người dùng.",
      icon: <MessageSquare className="w-6 h-6 text-sky-500" />,
      onClick: () => navigate(pathRoutes.admin.discuss),
    },
    {
      title: "Đánh giá khóa học",
      description: "Quản lý và thống kê phản hồi, lượt đánh giá các khóa học trên hệ thống.",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      onClick: () => navigate(pathRoutes.admin.reviewsCenter),
    },
    {
      title: "Duyệt hồ sơ giảng viên",
      description: "Xét duyệt hồ sơ và kích hoạt tài khoản của các giảng viên mới đăng ký.",
      icon: <UserCheck className="w-6 h-6 text-amber-600" />,
      onClick: () => navigate(pathRoutes.admin.instructorReview),
    },
    {
      title: "Danh sách người dùng",
      description: "Quản lý thông tin chi tiết, trạng thái hoạt động và quyền hạn thành viên.",
      icon: <Users className="w-6 h-6 text-violet-600" />,
      onClick: () => navigate(pathRoutes.admin.users),
    },
    {
      title: "Báo cáo & Thống kê",
      description: "Theo dõi báo cáo doanh thu hệ thống, số lượng đăng ký học mới.",
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      onClick: () => navigate(pathRoutes.admin.report),
    },
    {
      title: "Cài đặt tài khoản",
      description: "Thay đổi thông tin hồ sơ cá nhân và cập nhật mật khẩu đăng nhập.",
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      onClick: () => navigate(pathRoutes.admin.settings),
    },
  ];

  const instructorActions = [
    {
      title: "Quản lý khóa học",
      description: "Xem danh sách và biên tập nội dung, bài giảng khóa học của bạn.",
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      onClick: () => navigate(pathRoutes.instructor.courses),
    },
    {
      title: "Tạo khóa học mới",
      description: "Bắt đầu xây dựng khóa học mới của bạn ngay lập tức.",
      icon: <PlusCircle className="w-6 h-6 text-emerald-600" />,
      onClick: () => navigate(pathRoutes.instructor.courses),
    },
    {
      title: "Hỏi đáp & Thảo luận",
      description: "Giải đáp trực tiếp thắc mắc chuyên môn của học viên dưới các bài học.",
      icon: <MessageSquare className="w-6 h-6 text-sky-500" />,
      onClick: () => navigate(pathRoutes.instructor.discuss),
    },
    {
      title: "Đánh giá học viên",
      description: "Theo dõi nhận xét, số sao đánh giá trung bình để cải thiện khóa học.",
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      onClick: () => navigate(pathRoutes.admin.reports.reviewsCenter),
    },
    {
      title: "Doanh thu & Thống kê",
      description: "Theo dõi báo cáo doanh số, biểu đồ tăng trưởng đăng ký mới.",
      icon: <TrendingUp className="w-6 h-6 text-indigo-600" />,
      onClick: () => navigate(pathRoutes.instructor.report),
    },
    {
      title: "Cài đặt tài khoản",
      description: "Thay đổi thông tin cá nhân, cập nhật headline & tiểu sử chuyên môn.",
      icon: <Settings className="w-6 h-6 text-gray-600" />,
      onClick: () => navigate(pathRoutes.instructor.settings),
    },
  ];

  const filteredActions = isAdmin ? adminActions : instructorActions;

  return (
    <div className="space-y-6">
      {/* Banner chào mừng */}
      <Card
        className="w-full border-0 overflow-hidden relative rounded-2xl shadow-sm animate-fade-in"
        style={{
          background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryActive || '#1e3a8a'} 100%)`,
        }}
        styles={{ body: { padding: "40px 32px" } }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl translate-y-12" />

        <Row align="middle" gutter={[24, 24]}>
          <Col xs={24} md={16} className="z-10">
            <Space direction="vertical" size="small" className="w-full">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                Welcome Back
              </span>
              <Title level={1} className="m-0 text-white font-extrabold tracking-tight" style={{ color: "#fff" }}>
                Chào mừng trở lại, {fullName}! 🎉
              </Title>
              <Paragraph className="text-white/80 text-base max-w-xl leading-relaxed mb-6">
                Chào mừng bạn đến với trang quản trị E-Learning. Chúc bạn có một ngày làm việc tràn đầy năng lượng và hiệu quả.
              </Paragraph>
              <CButton
                type="primary"
                onClick={() => navigate(isAdmin ? pathRoutes.admin.dashboard : pathRoutes.instructor.courses)}
                style={{
                  height: "44px",
                  borderRadius: "22px",
                  backgroundColor: token.colorWhite,
                  color: token.colorPrimary,
                  border: "none",
                  fontWeight: "bold",
                }}
                className="px-6 hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
              >
                {isAdmin ? "Đi đến Dashboard" : "Quản lý khóa học"}
              </CButton>
            </Space>
          </Col>
          <Col xs={0} md={8} className="flex justify-center z-10">
            <img
              src="https://sneat-vuetify-admin-template.vercel.app/assets/illustration-john-light-0061869a.png"
              alt="Welcome illustration"
              className="h-44 object-contain drop-shadow-lg transform hover:scale-105 transition-transform duration-500"
            />
          </Col>
        </Row>
      </Card>

      {/* Danh sách hành động nhanh */}
      <div>
        <div className="mb-4">
          <Title level={4} className="text-gray-800 font-bold m-0">
            Hành động nhanh
          </Title>
          <Text type="secondary" className="text-sm">
            Lối tắt truy cập các tính năng chính dựa trên vai trò của bạn
          </Text>
        </div>

        <Row gutter={[16, 16]}>
          <For
            array={filteredActions}
            render={(action, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card
                  hoverable
                  onClick={action.onClick}
                  className="h-full border border-gray-100 hover:border-blue-200 rounded-xl transition-all hover:shadow-md group cursor-pointer"
                  styles={{ body: { padding: "24px" } }}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 p-3 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors duration-300">
                      {action.icon}
                    </div>
                    <div className="space-y-1">
                      <Text className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 block">
                        {action.title}
                      </Text>
                      <Text className="text-xs text-gray-500 line-clamp-2 leading-relaxed block">
                        {action.description}
                      </Text>
                    </div>
                  </div>
                </Card>
              </Col>
            )}
          />
        </Row>
      </div>
    </div>
  );
};

export default memo(WelcomePage);
