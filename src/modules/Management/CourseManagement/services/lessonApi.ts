import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { ILesson } from "@/type";

const PREFIX = API_PREFIX.COURSE;

export interface ILessonRequest {
  name: string;
  description?: string;
  content?: string;
  videoLength?: number;
  type: string;
  position?: number;
  sectionId: string;
  courseId: string;
}

export const lessonApi = {
  getLessonsBySectionId: (sectionId: string): Promise<ILesson[]> => {
    return axiosClient.get<ILesson[]>(`${PREFIX}/lessons/section/${sectionId}`);
  },

  createLesson: (body: ILessonRequest): Promise<ILesson> => {
    return axiosClient.post<ILesson>(`${PREFIX}/lessons`, body);
  },

  updateLesson: (id: string, body: ILessonRequest): Promise<ILesson> => {
    return axiosClient.put<ILesson>(`${PREFIX}/lessons/${id}`, body);
  },

  deleteLessons: (ids: string[]): Promise<void> => {
    return axiosClient.post<void>(`${PREFIX}/lessons/delete`, ids);
  },

  reorderLessons: (lessonIds: string[]): Promise<void> => {
    return axiosClient.post<void>(`${PREFIX}/lessons/reorder`, lessonIds);
  },
};

export default lessonApi;
