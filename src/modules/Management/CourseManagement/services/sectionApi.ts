import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { ISection } from "@/type";

const PREFIX = API_PREFIX.COURSE;

export interface ISectionRequest {
  name: string;
  description?: string;
  position?: number;
  courseId: string;
}

export const sectionApi = {
  getSectionsByCourseId: (courseId: string): Promise<ISection[]> => {
    return axiosClient.get<ISection[]>(`${PREFIX}/sections/course/${courseId}`);
  },

  createSection: (body: ISectionRequest): Promise<ISection> => {
    return axiosClient.post<ISection>(`${PREFIX}/sections`, body);
  },

  updateSection: (id: string, body: ISectionRequest): Promise<ISection> => {
    return axiosClient.put<ISection>(`${PREFIX}/sections/${id}`, body);
  },

  deleteSections: (ids: string[]): Promise<void> => {
    return axiosClient.post<void>(`${PREFIX}/sections/delete`, ids);
  },

  reorderSections: (sectionIds: string[]): Promise<void> => {
    return axiosClient.post<void>(`${PREFIX}/sections/reorder`, sectionIds);
  },
};

export default sectionApi;
