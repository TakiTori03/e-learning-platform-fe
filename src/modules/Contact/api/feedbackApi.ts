import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { FeedbackType } from "@/constants/enums";

const PREFIX = API_PREFIX.INTERACTION;

export interface IFeedbackSubmitRequest {
  type: FeedbackType;
  name: string;
  email: string;
  title: string;
  content: string;
}

export const feedbackApi = {
  createFeedback: (data: IFeedbackSubmitRequest) => {
    return axiosClient.post<unknown>(`${PREFIX}/feedbacks`, data);
  },
};
