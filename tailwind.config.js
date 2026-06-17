/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Đồng bộ màu primary với Ant Design CSS Variable
        primary: "var(--ant-color-primary, #2272eb)",
        brandBlue: "#2C3D94",
        disabled: "#00000040",
        link: "#005AAA",
      },
    },
  },
  plugins: [],
   corePlugins: {
    preflight: false,
  },
}

