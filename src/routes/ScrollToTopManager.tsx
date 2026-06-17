import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export const ScrollToTopManager = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Lưu trữ vị trí cuộn của các trang theo location.key
  const cache = useRef<Record<string, { window: number; inner: number }>>({});

  // Lưu vị trí cuộn hiện tại của trang trước khi rời đi hoặc khi đang cuộn
  useEffect(() => {
    const handleScrollSave = () => {
      const windowScroll = window.scrollY || document.documentElement?.scrollTop || document.body?.scrollTop || 0;
      const innerElement = document.querySelector(".ant-layout-content, main, .overflow-y-auto");
      const innerScroll = innerElement ? innerElement.scrollTop : 0;

      if (location.key) {
        cache.current[location.key] = {
          window: windowScroll,
          inner: innerScroll,
        };
      }
    };

    // Theo dõi sự kiện scroll trên window
    window.addEventListener("scroll", handleScrollSave, { passive: true });

    // Tìm và theo dõi sự kiện scroll trên các container con có thanh cuộn
    const innerElements = document.querySelectorAll(".ant-layout-content, main, .overflow-y-auto");
    innerElements.forEach((el) => {
      el.addEventListener("scroll", handleScrollSave, { passive: true });
    });

    return () => {
      window.removeEventListener("scroll", handleScrollSave);
      innerElements.forEach((el) => {
        el.removeEventListener("scroll", handleScrollSave);
      });
    };
  }, [location.key]);

  // Thực hiện reset scroll (chuyển trang mới) hoặc khôi phục scroll (Back/Forward)
  useEffect(() => {
    // Bật chế độ quản lý scroll thủ công, tắt chế độ tự động của trình duyệt
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const performScroll = () => {
      const key = location.key;
      const saved = cache.current[key];

      if (navigationType === "POP" && saved) {
        // --- RESTORE SCROLL (Nhấn Back / Forward) ---
        window.scrollTo(0, saved.window);
        if (document.documentElement) document.documentElement.scrollTop = saved.window;
        if (document.body) document.body.scrollTop = saved.window;

        const innerElement = document.querySelector(".ant-layout-content, main, .overflow-y-auto");
        if (innerElement) {
          innerElement.scrollTop = saved.inner;
        }
      } else {
        // --- SCROLL TO TOP (Chuyển trang mới hoặc chuyển hướng PUSH) ---
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;

        const innerElements = document.querySelectorAll(".ant-layout-content, main, .overflow-y-auto");
        innerElements.forEach((el) => {
          el.scrollTop = 0;
        });
      }
    };

    // Chạy ngay lập tức khi đổi route
    performScroll();

    // Chạy lại sau các khoảng trễ nhỏ để hỗ trợ tải bất đồng bộ (Lazy-load / Suspense / React Query)
    const timer1 = setTimeout(performScroll, 50);
    const timer2 = setTimeout(performScroll, 150);
    const timer3 = setTimeout(performScroll, 300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.key, navigationType]);

  return null;
};

export default ScrollToTopManager;
