import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IFeedback, IFeedbackReply, IParamsRequest, IListResponse } from "@/type";

const INTERACTION_PREFIX = `${API_PREFIX.INTERACTION}/feedbacks`;

export const adminFeedbackApi = {
  // 1. Get all feedbacks (pageable with optional q, type, and status search)
  getAllFeedbacks: (params: IParamsRequest & { status?: string; type?: string }): Promise<IListResponse<IFeedback>> => {
    const { status, type, ...rest } = params;
    return axiosClient.get<IListResponse<IFeedback>>(`${INTERACTION_PREFIX}/admin/search`, {
      ...rest,
      page: rest.page > 0 ? rest.page - 1 : 0,
      status,
      type,
    });
  },

  // 2. Reply to a feedback
  replyFeedback: (id: string, content: string): Promise<IFeedbackReply> => {
    return axiosClient.post<IFeedbackReply>(`${INTERACTION_PREFIX}/admin/feedbacks/${id}/reply`, {
      content,
    });
  },

  // 3. Update active status of a feedback (RESOLVED, RESPONDED, CLOSED, etc.)
  updateFeedbackStatus: (id: string, status: string): Promise<IFeedback> => {
    return axiosClient.put<IFeedback>(`${INTERACTION_PREFIX}/admin/feedbacks/${id}/status`, {}, {
      params: { status },
    });
  },
};
