import { useAuthStore } from "../store/useAuthStore";

export const useAuthCheck = () => {
  const { isAuth, isLoading, user } = useAuthStore();
  return { isAuth, isLoading, user };
};

