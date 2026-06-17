import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminReviewApi } from "../api/adminReviewApi";
import { App } from "antd";

export const useAdminReviews = (
  page: number = 1,
  size: number = 10,
  search?: string,
  courseId?: string,
  rating?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["admin", "reviews-list", page, size, search, courseId, rating],
    queryFn: async () => {
      const res = await adminReviewApi.getAllReviews({
        page,
        size,
        q: search,
        courseId,
        rating,
      });
      return res;
    },
    staleTime: 2 * 60 * 1000,
    enabled,
  });
};

export const useInstructorReviews = (
  page: number = 1,
  size: number = 10,
  search?: string,
  courseId?: string,
  rating?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["instructor", "reviews-list", page, size, search, courseId, rating],
    queryFn: async () => {
      const res = await adminReviewApi.getInstructorReviews({
        page,
        size,
        q: search,
        courseId,
        rating,
      });
      return res;
    },
    staleTime: 2 * 60 * 1000,
    enabled: enabled && !!courseId,
  });
};

export const useReplyReviewMutation = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ reviewId, content }: { reviewId: string; content: string }) =>
      adminReviewApi.replyReview(reviewId, content),
    onSuccess: () => {
      notification.success({
        message: "Phản hồi thành công",
        description: "Đã gửi phản hồi của bạn đến đánh giá này.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews-list"] });
      queryClient.invalidateQueries({ queryKey: ["instructor", "reviews-list"] });
    },
    onError: () => {
      notification.error({
        message: "Phản hồi thất bại",
        description: "Không thể gửi phản hồi. Vui lòng thử lại.",
      });
    },
  });
};

