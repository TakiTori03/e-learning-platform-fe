import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notification } from "antd";

interface CartState {
  courseIds: string[];
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      courseIds: [],
      
      addToCart: (courseId) => {
        const { courseIds } = get();
        if (!courseIds.includes(courseId)) {
          set({ courseIds: [...courseIds, courseId] });
          notification.success({ message: "Đã thêm khóa học vào giỏ hàng" });
        } else {
          notification.info({ message: "Khóa học đã có trong giỏ hàng" });
        }
      },
      
      removeFromCart: (courseId) => {
        const { courseIds } = get();
        set({ courseIds: courseIds.filter((id) => id !== courseId) });
        notification.success({ message: "Đã xóa khỏi giỏ hàng" });
      },
      
      clearCart: () => {
        set({ courseIds: [] });
      },
      
      isInCart: (courseId) => {
        return get().courseIds.includes(courseId);
      },
    }),
    {
      name: "e-learning-cart-storage", // Tên key trong localStorage
    }
  )
);
