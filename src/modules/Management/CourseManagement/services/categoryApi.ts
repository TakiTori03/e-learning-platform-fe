import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { ICategory, IListResponse, IParamsRequest } from "@/type";

const PREFIX = API_PREFIX.COURSE;

export const categoryApi = {
  getCategoryCourseCounts: (categoryIds: string[]): Promise<Record<string, number>> => {
    return axiosClient.get<Record<string, number>>(`${PREFIX}/courses/count-by-categories`, {
      categoryIds: categoryIds.join(","),
    });
  },

  getCategoriesSelect: (): Promise<ICategory[]> => {
    return axiosClient.get<ICategory[]>(`${PREFIX}/categories/select`);
  },

  searchCategories: (params: IParamsRequest): Promise<IListResponse<ICategory>> => {
    return axiosClient.get<IListResponse<ICategory>>(`${PREFIX}/categories/search`, {
      ...params,
      page: params.page > 0 ? params.page - 1 : 0,
    });
  },

  getCategoryDetail: (id: string): Promise<ICategory> => {
    return axiosClient.get<ICategory>(`${PREFIX}/categories/${id}`);
  },

  createCategory: (body: { name: string; description: string; icon?: string }): Promise<ICategory> => {
    return axiosClient.post<ICategory>(`${PREFIX}/categories`, body);
  },

  updateCategory: (id: string, body: { name: string; description: string; icon?: string }): Promise<ICategory> => {
    return axiosClient.put<ICategory>(`${PREFIX}/categories/${id}`, body);
  },

  deleteCategory: (id: string): Promise<void> => {
    return axiosClient.delete<void>(`${PREFIX}/categories/${id}`);
  },

  toggleCategoryActiveStatus: (id: string): Promise<void> => {
    return axiosClient.patch<void>(`${PREFIX}/categories/${id}/active-status`);
  },
};

export default categoryApi;
