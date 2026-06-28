import { useEffect, useState, useRef, forwardRef, useImperativeHandle, useMemo } from "react";

export interface PdfPlayerRef {
  getCurrentPage: () => number;
  setCurrentPage: (page: number) => void;
}

interface PdfPlayerProps {
  fileUrl: string;
  fileName: string;
  courseId: string;
  lessonId: string;
  isDone?: boolean;
  onComplete?: () => void;
  height?: string;
  activePage?: number;
}

const PdfPlayer = forwardRef<PdfPlayerRef, PdfPlayerProps>(({
  fileUrl,
  fileName,
  courseId,
  lessonId,
  isDone = false,
  onComplete,
  height = "80vh",
  activePage,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error("Không thể mở toàn màn hình:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Tự động lưu trang PDF đang xem dở vào LocalStorage mỗi 1 giây
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          const pdfApp = (iframe.contentWindow as any).PDFViewerApplication;
          if (pdfApp && typeof pdfApp.page !== "undefined") {
            const currentPage = pdfApp.page;
            if (currentPage > 0) {
              localStorage.setItem(`last_page_${courseId}_${lessonId}`, String(currentPage));
            }
          }
        }
      } catch (e) {
        // Bỏ qua lỗi trong khi PDF.js đang load
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [courseId, lessonId]);

  // Expose API cho component cha (đặc biệt là NoteList thông qua Zustand)
  useImperativeHandle(ref, () => ({
    getCurrentPage: () => {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          const pdfApp = (iframe.contentWindow as any).PDFViewerApplication;
          if (pdfApp && typeof pdfApp.page !== "undefined") {
            return pdfApp.page;
          }
        }
      } catch (e) {
        console.warn("Chưa thể truy xuất PDF page:", e);
      }
      return 1;
    },
    setCurrentPage: (page: number) => {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          const pdfApp = (iframe.contentWindow as any).PDFViewerApplication;
          if (pdfApp) {
            pdfApp.page = page;
          }
        }
      } catch (e) {
        console.warn("Chưa thể chuyển PDF page:", e);
      }
    }
  }));

  // Đồng bộ hóa khi activePage prop thay đổi (đáp ứng click từ AI Tutor hoặc NoteItem)
  useEffect(() => {
    if (activePage) {
      try {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
          const pdfApp = (iframe.contentWindow as any).PDFViewerApplication;
          if (pdfApp) {
            pdfApp.page = activePage;
          }
        }
      } catch (e) {
        // Iframe chưa load xong, PDF.js sẽ tự động dùng hash url
      }
    }
  }, [activePage]);

  // Tính toán URL nạp PDF qua PDF.js Web Viewer tĩnh (Ưu tiên activePage từ props/link, sau đó đến trang đã lưu trong localStorage)
  const pageNum = useMemo(() => {
    if (activePage) return activePage;
    const saved = localStorage.getItem(`last_page_${courseId}_${lessonId}`);
    return saved ? parseInt(saved, 10) : 1;
  }, [activePage, courseId, lessonId]);

  const viewerUrl = useMemo(() => {
    return `/pdfjs/web/viewer.html?file=${encodeURIComponent(fileUrl)}&disableHistory=true#page=${pageNum}`;
  }, [fileUrl, pageNum]);

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col transition-all duration-300 ${
        isFullscreen 
          ? "bg-slate-950 w-screen h-screen p-0 z-50 fixed inset-0 overflow-hidden" 
          : "bg-slate-900 w-full border border-slate-700/60 rounded-xl shadow-lg overflow-hidden"
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      <div className="h-full flex flex-col relative">
        {/* 1. Nhúng PDF.js Viewer qua iframe (chứa sẵn Zoom, Sidebar Thumbnail, Print, Search...) */}
        <iframe
          ref={iframeRef}
          key={fileUrl} // Chỉ re-render iframe khi chuyển sang file PDF khác. Khi đổi trang trên cùng 1 file, trình duyệt tự bắt hashchange chuyển trang mượt mà
          src={viewerUrl}
          title={fileName}
          className="w-full h-full border-none"
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
});

export default PdfPlayer;
