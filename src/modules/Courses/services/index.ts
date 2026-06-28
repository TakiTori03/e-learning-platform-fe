import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type {
  AnyElement,
  ICourse,
  ILesson,
  IListResponse,
  IParamsRequest,
  ISection,
  ICategory,
  IReview,
} from "@/type";

const PREFIX = API_PREFIX.COURSE;
const AGGREGATOR_PREFIX = API_PREFIX.AGGREGATOR;

export const courseApi = {
  // --- Courses ---
  getCourses: (params: IParamsRequest): Promise<IListResponse<ICourse>> => {
    return axiosClient.get<IListResponse<ICourse>>(
      `${AGGREGATOR_PREFIX}/courses/search`,
      {
        ...params,
        page: params.page > 0 ? params.page - 1 : 0,
      }
    );
  },

  getCourseDetail: (courseId: string): Promise<ICourse> => {
    return axiosClient.get<ICourse>(
      `${AGGREGATOR_PREFIX}/courses/detail/${courseId}`
    );
  },

  recordCourseView: (courseId: string): Promise<{ success: boolean }> => {
    return axiosClient.post<{ success: boolean }>(
      `${PREFIX}/courses/${courseId}/view`
    );
  },

  getPopularCourses: (limit = 10): Promise<ICourse[]> => {
    return axiosClient.get<ICourse[]>(`${PREFIX}/courses/popular`, { limit });
  },

  getRelatedCourses: (courseId: string, limit = 5): Promise<ICourse[]> => {
    return axiosClient.get<ICourse[]>(`${PREFIX}/courses/related/${courseId}`, {
      limit,
    });
  },

  // --- Sections ---
  getSectionsByCourseId: (courseId: string): Promise<ISection[]> => {
    return axiosClient.get<ISection[]>(`${PREFIX}/sections/course/${courseId}`);
  },

  // --- Lessons ---
  getLessonsBySectionId: (sectionId: string): Promise<ILesson[]> => {
    return axiosClient.get<ILesson[]>(`${PREFIX}/lessons/section/${sectionId}`);
  },

  getAllLessonsByCourseId: (courseId: string): Promise<ILesson[]> => {
    return axiosClient.get<ILesson[]>(
      `${PREFIX}/lessons/course/${courseId}/all-lessons`
    );
  },

  updateLessonDone: (id: string): Promise<AnyElement> => {
    return axiosClient.post(`${PREFIX}/lessons/done/${id}`);
  },

  // --- Categories ---
  getAllCategories: (): Promise<IListResponse<ICategory>> => {
    return axiosClient.get<IListResponse<ICategory>>(
      `${PREFIX}/categories/search`
    );
  },

  getCategoriesSelect: (): Promise<ICategory[]> => {
    return axiosClient.get<ICategory[]>(`${PREFIX}/categories/select`);
  },

  getInstructorsSelect: (): Promise<AnyElement[]> => {
    return axiosClient.get<AnyElement[]>(
      `${API_PREFIX.IDENTITY}/users/authors/select`
    );
  },

  getReviewsByCourseId: (courseId: string, params: IParamsRequest): Promise<IListResponse<IReview>> => {
    return axiosClient.get<IListResponse<IReview>>(
      `${API_PREFIX.INTERACTION}/reviews/course/${courseId}`,
      {
        page: params.page > 0 ? params.page - 1 : 0,
        size: params.size || 5,
      }
    );
  },

  getCourseRatingSummary: (courseId: string): Promise<{ averageRating: number; totalReviews: number; ratingPercentages: Record<string, string> }> => {
    return axiosClient.get(
      `${API_PREFIX.INTERACTION}/reviews/course/${courseId}/summary`
    );
  },

  createReview: (data: { courseId: string; ratingStar: number; content: string; title?: string }): Promise<IReview> => {
    return axiosClient.post<IReview>(`${API_PREFIX.INTERACTION}/reviews`, data);
  },
};
