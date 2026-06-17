import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { ICourse, IListResponse, IParamsRequest } from "@/type";

const PREFIX = API_PREFIX.COURSE;

export interface ICourseRequest {
  name: string;
  subTitle: string;
  thumbnail?: string;
  coursePreview?: string;
  price?: number;
  finalPrice?: number;
  description: string;
  level: string;
  categoryId: string;
  requirements?: string[];
  willLearns?: string[];
  tags?: string[];
}

export const courseApi = {
  getInstructorCourses: (params: IParamsRequest & { status?: string }): Promise<IListResponse<ICourse>> => {
    return axiosClient.get<IListResponse<ICourse>>(`${PREFIX}/courses/instructor/search`, {
      ...params,
      page: params.page > 0 ? params.page - 1 : 0,
    });
  },

  getAllInstructorCourses: (): Promise<ICourse[]> => {
    return axiosClient.get<ICourse[]>(`${PREFIX}/courses/instructor/all`);
  },

  getAdminCourses: (params: IParamsRequest & { authorId?: string; status?: string }): Promise<IListResponse<ICourse>> => {
    const { authorId, ...rest } = params;
    const queryParams: any = {
      ...rest,
      page: params.page > 0 ? params.page - 1 : 0,
    };
    if (authorId) {
      queryParams.authors = [authorId];
    }
    return axiosClient.get<IListResponse<ICourse>>(`${PREFIX}/courses/admin/search`, queryParams);
  },

  getCourseDetail: (courseId: string): Promise<ICourse> => {
    return axiosClient.get<ICourse>(`${PREFIX}/courses/${courseId}`);
  },

  createCourse: (body: ICourseRequest): Promise<ICourse> => {
    return axiosClient.post<ICourse>(`${PREFIX}/courses`, body);
  },

  updateCourse: (id: string, body: ICourseRequest): Promise<ICourse> => {
    return axiosClient.put<ICourse>(`${PREFIX}/courses/${id}`, body);
  },

  deleteCourses: (ids: string[]): Promise<void> => {
    return axiosClient.post<void>(`${PREFIX}/courses/delete`, ids);
  },

  toggleCourseActiveStatus: (id: string, status?: string): Promise<void> => {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    const query = params.toString() ? `?${params.toString()}` : "";
    return axiosClient.patch<void>(`${PREFIX}/courses/update-active-status/${id}${query}`);
  },

  adminApproveCourse: (id: string, status: string): Promise<void> => {
    const params = new URLSearchParams();
    params.append("status", status);
    const query = params.toString() ? `?${params.toString()}` : "";
    return axiosClient.patch<void>(`${PREFIX}/courses/${id}/approve${query}`);
  },

  getCourseHistory: (id: string, page = 1, limit = 10): Promise<IListResponse<any>> => {
    return axiosClient.get<IListResponse<any>>(`${PREFIX}/admin/courses/${id}/histories`, { page, limit });
  },

  getInstructorsSelect: (): Promise<any[]> => {
    return axiosClient.get<any[]>(`${API_PREFIX.IDENTITY}/users/authors/select`);
  },
};

export default courseApi;
