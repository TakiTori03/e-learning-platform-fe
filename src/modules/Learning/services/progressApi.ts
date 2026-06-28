import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { AnyElement, ICourse } from "@/type";

const LEARNING_PREFIX = API_PREFIX.LEARNING;

export const progressApi = {
  getEnrolledCourseDetail: (courseId: string): Promise<ICourse> => {
    return axiosClient.get<ICourse>(
      `${LEARNING_PREFIX}/progress/${courseId}`
    );
  },

  getCourseProgressBulk: (
    courseIds: string[]
  ): Promise<Record<string, AnyElement>> => {
    return axiosClient.get<Record<string, AnyElement>>(
      `${LEARNING_PREFIX}/progress/bulk/mine`,
      { courseIds }
    );
  },

  getMyEnrolledCourses: (): Promise<ICourse[]> => {
    return axiosClient.get<ICourse[]>(
      `${API_PREFIX.AGGREGATOR}/courses/my-learning`
    );
  },

  trackProgress: (data: {
    courseId: string;
    lessonId: string;
    isDone: boolean;
  }): Promise<AnyElement> => {
    return axiosClient.post(`${LEARNING_PREFIX}/progress/track`, data);
  },

  trackAccess: (courseId: string, lessonId: string): Promise<AnyElement> => {
    return axiosClient.post(`${LEARNING_PREFIX}/progress/access`, {}, {
      params: { courseId, lessonId },
    });
  },
};
