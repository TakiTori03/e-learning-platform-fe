import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseApi } from "../services";
import type { IParamsRequest, IListResponse, IReview } from "@/type";

export const useCourseReviews = (courseId: string, page = 1, size = 5) => {
  const queryParams: IParamsRequest = { page, size };

  const { data, isLoading } = useQuery<IListResponse<IReview>>({
    queryKey: ["course-reviews", courseId, queryParams],
    queryFn: () => courseApi.getReviewsByCourseId(courseId, queryParams),
    enabled: !!courseId,
  });

  const reviews = data?.content || [];
  const totalElements = data?.totalElements || 0;

  return {
    reviews,
    totalReviews: totalElements,
    isLoading,
  };
};

export const useCourseRatingSummary = (courseId: string) => {
  return useQuery({
    queryKey: ["course-rating-summary", courseId],
    queryFn: () => courseApi.getCourseRatingSummary(courseId),
    enabled: !!courseId,
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { courseId: string; ratingStar: number; content: string; title?: string }) =>
      courseApi.createReview(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["course-reviews", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-rating-summary", variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-detail", variables.courseId] });
    },
  });
};
