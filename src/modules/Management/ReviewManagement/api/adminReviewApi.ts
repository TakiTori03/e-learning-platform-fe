import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IReview, IParamsRequest, IListResponse, IReviewReply } from "@/type";

const REVIEWS_PREFIX = `${API_PREFIX.INTERACTION}/reviews`;

export const adminReviewApi = {
  // 1. Get all reviews with pagination and filters
  getAllReviews: (params: IParamsRequest & { q?: string; courseId?: string; rating?: number }): Promise<IListResponse<IReview>> => {
    const { q, courseId, rating, ...rest } = params;
    return axiosClient.get<IListResponse<IReview>>(`${API_PREFIX.INTERACTION}/reviews/admin/search`, {
      ...rest,
      page: rest.page > 0 ? rest.page - 1 : 0,
      q,
      courseId,
      rating,
    });
  },

  // 2. Get all instructor reviews with pagination and filters
  getInstructorReviews: (params: IParamsRequest & { q?: string; courseId?: string; rating?: number }): Promise<IListResponse<IReview>> => {
    const { q, courseId, rating, ...rest } = params;
    return axiosClient.get<IListResponse<IReview>>(`${API_PREFIX.INTERACTION}/reviews/instructor/search`, {
      ...rest,
      page: rest.page > 0 ? rest.page - 1 : 0,
      q,
      courseId,
      rating,
    });
  },

  // 3. Reply to a review (Instructor/Admin)
  replyReview: (reviewId: string, content: string): Promise<IReviewReply> => {
    return axiosClient.post<IReviewReply>(`${REVIEWS_PREFIX}/${reviewId}/replies`, {
      content,
    });
  },
};

