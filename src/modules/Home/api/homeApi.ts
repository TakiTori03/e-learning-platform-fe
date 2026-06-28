import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { ICategory, ICourse, IListResponse, IParamsRequest } from "@/type";

const PREFIX = API_PREFIX.COURSE;

export const homeApi = {
  getCategories: (params?: Partial<IParamsRequest>) => {
    return axiosClient.get<IListResponse<ICategory>>(
      `${PREFIX}/categories/search`,
      params
    );
  },

  getPopularCourses: (limit = 8) => {
    return axiosClient.get<ICourse[]>(`${PREFIX}/courses/popular`, { limit });
  },

  createSubscription: (email: string) => {
    return axiosClient.post(`${API_PREFIX.INTERACTION}/subscribes`, { email });
  },

  getBlogs: (params?: Record<string, any>) => {
    return axiosClient.get<IListResponse<any>>(`${API_PREFIX.INTERACTION}/blogs`, params);
  },
};
