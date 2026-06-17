import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),svgr()],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      usePolling: true, // Tối ưu hot-reload
    },
    host: true,         // Cho phép truy cập qua mạng LAN
    port: 3000,         // Cố định cổng chạy 3000
    strictPort: true,   // Không tự động đổi cổng nếu bị chiếm
    allowedHosts: true,
  },
   build: {
    rollupOptions: {
      output: {
        // Chia nhỏ các thư viện lớn khi build production để tăng tốc độ tải trang
        manualChunks(id: string) {
          if (
            id.includes("react-router-dom") ||
            id.includes("@remix-run") ||
            id.includes("react-router")
          ) {
            return "@react-router";
          }
          if (id.includes("lodash")) {
            return "@lodash";
          }
          if (id.includes("antd")) {
            return "@antd";
          }
        },
      },
    },
  }
});
