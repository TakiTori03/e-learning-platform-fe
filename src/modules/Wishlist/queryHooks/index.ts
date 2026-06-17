import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistApi } from "../services";
import { notification } from "antd";
import type { ICourse } from "@/type";

export const useWishlist = (courseId?: string) => {
  const queryClient = useQueryClient();

  // 1. Query to fetch the entire wishlist
  const wishlistQuery = useQuery<ICourse[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      return await wishlistApi.getWishlist();
    },
  });

  // 2. Query to check status of a specific course
  const statusQuery = useQuery<boolean>({
    queryKey: ["wishlist-status", courseId],
    queryFn: async () => {
      if (!courseId) return false;
      return await wishlistApi.checkWishlistStatus(courseId);
    },
    enabled: !!courseId,
  });

  // 3. Mutation to add to wishlist
  const addMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => wishlistApi.addToWishlist(id),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Đã thêm khóa học vào danh sách yêu thích.",
      });
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: ["wishlist-status", courseId],
        });
      }
    },
    onError: () => {
      notification.error({
        message: "Lỗi",
        description: "Không thể thêm khóa học vào danh sách yêu thích.",
      });
    },
  });

  // 4. Mutation to remove from wishlist
  const removeMutation = useMutation<void, Error, string>({
    mutationFn: (id: string) => wishlistApi.removeFromWishlist(id),
    onSuccess: () => {
      notification.success({
        message: "Thành công",
        description: "Đã xóa khóa học khỏi danh sách yêu thích.",
      });
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      if (courseId) {
        queryClient.invalidateQueries({
          queryKey: ["wishlist-status", courseId],
        });
      }
    },
    onError: () => {
      notification.error({
        message: "Lỗi",
        description: "Không thể xóa khóa học khỏi danh sách yêu thích.",
      });
    },
  });

  const wishlistCourses = wishlistQuery.data || [];

  return {
    wishlistCourses,
    isLoading: wishlistQuery.isLoading,
    isFavorite: statusQuery.data ?? false,
    checkingStatus: statusQuery.isLoading,
    addToWishlist: addMutation.mutate,
    removeFromWishlist: removeMutation.mutate,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  };
};
