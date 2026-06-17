import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { AnyElement, ICourse, IDiscussion, IListResponse } from "@/type";

const COURSE_PREFIX = API_PREFIX.COURSE;
const INTERACTION_PREFIX = API_PREFIX.INTERACTION;
const LEARNING_PREFIX = API_PREFIX.LEARNING;

export const learningApi = {
  // --- Enrollment & Progress (Learning Service) ---
  getEnrolledCourseDetail: (courseId: string): Promise<ICourse> => {
    return axiosClient.get<ICourse>(
      `${LEARNING_PREFIX}/internal/learning/progress/mine`,
      { courseId }
    );
  },

  getCourseProgressBulk: (
    courseIds: string[]
  ): Promise<Record<string, AnyElement>> => {
    return axiosClient.get<Record<string, AnyElement>>(
      `${LEARNING_PREFIX}/internal/learning/progress/bulk/mine`,
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

  // --- Notes (Learning Service) ---
  getNotes: (courseId: string): Promise<AnyElement[]> => {
    return axiosClient.get<AnyElement[]>(
      `${LEARNING_PREFIX}/notes/${courseId}`
    );
  },

  createNote: (data: {
    courseId: string;
    lessonId: string;
    content: string;
    videoTime: number;
  }): Promise<AnyElement> => {
    return axiosClient.post(`${LEARNING_PREFIX}/notes`, data);
  },

  deleteNote: (noteId: string): Promise<AnyElement> => {
    return axiosClient.delete(`${LEARNING_PREFIX}/notes/${noteId}`);
  },

  // --- Discussions (Interaction Service) ---
  getDiscussions: (lessonId: string): Promise<IListResponse<IDiscussion>> => {
    return axiosClient.get<IListResponse<IDiscussion>>(
      `${INTERACTION_PREFIX}/discussions/lesson/${lessonId}`
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
      `${INTERACTION_PREFIX}/discussions`,
      data
    );
  },

  likeDiscussion: (id: string): Promise<IDiscussion> => {
    return axiosClient.post<IDiscussion>(
      `${INTERACTION_PREFIX}/discussions/${id}/like`
    );
  },

  dislikeDiscussion: (id: string): Promise<IDiscussion> => {
    return axiosClient.post<IDiscussion>(
      `${INTERACTION_PREFIX}/discussions/${id}/dislike`
    );
  },

  // --- Others ---
  getLearners: (courseId: string): Promise<string[]> => {
    return axiosClient.get<string[]>(
      `${COURSE_PREFIX}/courses/course/getUserByCourse/${courseId}`
    );
  },
};
