import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { IUserInfo } from "@/type";

interface AuthState {
  user: IUserInfo | null;
  isAuth: boolean;
  isLoading: boolean;
  setUser: (user: IUserInfo | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuth: false,
      isLoading: true,
      setUser: (user) => {
        set({ user, isAuth: !!user, isLoading: false }, false, "auth/setUser");
      },
      logout: () => {
        set({ user: null, isAuth: false, isLoading: false }, false, "auth/logout");
      },
    }),
    { name: "AuthStore" }
  )
);
