import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../services";
import { notification } from "antd";
import type { ICourse } from "@/type";
import { useAuthStore } from "@/store/useAuthStore";

export const useWishlist = (courseId?: string, options?: { enabledQuery?: boolean }) => {
  const queryClient = useQueryClient();
  const { isAuth } = useAuthStore();
  const enabledQuery = options?.enabledQuery ?? true;

  // 1. Query to fetch the entire wishlist
  const wishlistQuery = useQuery<ICourse[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      return await wishlistApi.getWishlist();
    },
    enabled: isAuth && enabledQuery,
  });

  // 2. Mutation to add to wishlist
  const addMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => wishlistApi.addToWishlist(id),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Đã thêm khóa học vào danh sách yêu thích.",
      });
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm khóa học vào danh sách yêu thích.",
      });
    },
  });

  // 3. Mutation to remove from wishlist
  const removeMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => wishlistApi.removeFromWishlist(id),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Đã xóa khóa học khỏi danh sách yêu thích.",
      });
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa khóa học khỏi danh sách yêu thích.",
      });
    },
  });

  const wishlistCourses = wishlistQuery.data || [];
  const isFavorite = courseId ? wishlistCourses.some((c) => c.id === courseId) : false;

  return {
    wishlistCourses,
    isLoading: wishlistQuery.isLoading,
    isFavorite,
    checkingStatus: wishlistQuery.isFetching,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
