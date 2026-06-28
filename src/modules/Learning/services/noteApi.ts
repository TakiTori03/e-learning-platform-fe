import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { AnyElement } from "@/type";

const LEARNING_PREFIX = API_PREFIX.LEARNING;

export const noteApi = {
  getNotes: (courseId: string): Promise<AnyElement[]> => {
    return axiosClient.get<AnyElement[]>(
      `${LEARNING_PREFIX}/notes/${courseId}`
    );
  },

  createNote: (data: {
    courseId: string;
    lessonId: string;
    content: string;
    videoTime?: number;
    page?: number;
  }): Promise<AnyElement> => {
    return axiosClient.post(`${LEARNING_PREFIX}/notes`, data);
  },

  deleteNote: (noteId: string): Promise<AnyElement> => {
    return axiosClient.delete(`${LEARNING_PREFIX}/notes/${noteId}`);
  },
};
