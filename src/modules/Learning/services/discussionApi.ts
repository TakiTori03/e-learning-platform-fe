import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IDiscussion, IListResponse } from "@/type";

const LEARNING_PREFIX = API_PREFIX.LEARNING;

export const discussionApi = {
  getDiscussions: (lessonId: string): Promise<IListResponse<IDiscussion>> => {
    return axiosClient.get<IListResponse<IDiscussion>>(
      `${LEARNING_PREFIX}/discussions/lesson/${lessonId}`
    );
  },

  createDiscussion: (data: {
    content: string;
    courseId: string;
    lessonId: string;
    sectionId?: string;
    parentId?: string;
  }): Promise<IDiscussion> => {
    return axiosClient.post<IDiscussion>(
      `${LEARNING_PREFIX}/discussions`,
      data
    );
  },

  likeDiscussion: (id: string): Promise<IDiscussion> => {
    return axiosClient.post<IDiscussion>(
      `${LEARNING_PREFIX}/discussions/${id}/like`
    );
  },

  dislikeDiscussion: (id: string): Promise<IDiscussion> => {
    return axiosClient.post<IDiscussion>(
      `${LEARNING_PREFIX}/discussions/${id}/dislike`
    );
  },
};
