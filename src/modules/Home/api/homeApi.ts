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

  getPopularCourses: (params?: Partial<IParamsRequest>) => {
    return axiosClient.get<IListResponse<ICourse>>(`${PREFIX}/courses/search`, {
      sort: "views,desc",
      size: 8,
      ...params,
    });
  },

  getHomeCourses: (params?: Partial<IParamsRequest>) => {
    return axiosClient.get<IListResponse<ICourse>>(
      `${PREFIX}/courses/search`,
      params
    );
  },

  createSubscription: (email: string) => {
    return axiosClient.post(`${API_PREFIX.INTERACTION}/subscribes`, { email });
  },

  getBlogs: (params?: Record<string, any>) => {
    return axiosClient.get<IListResponse<any>>(`${API_PREFIX.INTERACTION}/blogs`, params);
  },
};
