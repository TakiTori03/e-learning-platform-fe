import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Nạp Tailwind CSS và styles toàn cục

// Cấu hình ngôn ngữ tiếng Việt cho dayjs toàn cục
dayjs.locale("vi");

// Khởi tạo Query Client quản lý cache API
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      refetchOnWindowFocus: false, // 🌟 Tối ưu: Không tự động reload API khi chuyển tab
      staleTime: 10 * 1000,        // 🌟 Tối ưu: Dữ liệu được coi là mới trong 10 giây
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});


ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
