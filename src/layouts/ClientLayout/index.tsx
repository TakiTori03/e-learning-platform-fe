import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTopManager from "@/routes/ScrollToTopManager";
import GlobalChatbotWidget from "@/components/AI/GlobalChatbotWidget";

const ClientLayout: React.FC = React.memo(() => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Header cố định ở trên */}
      <Header />

      {/* 2. Nội dung thay đổi theo trang */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 3. Footer ở dưới */}
      <Footer />

      {/* 4. Chatbot AI nổi góc phải */}
      <GlobalChatbotWidget />

      {/* Quản lý vị trí cuộn nâng cao (lưu vết và cuộn lên đầu) */}
      <ScrollToTopManager />
    </div>
  );
});

export default ClientLayout;
