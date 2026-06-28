import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";

const COURSE_PREFIX = API_PREFIX.COURSE;

export const otherApi = {
  getLearners: (courseId: string): Promise<string[]> => {
    return axiosClient.get<string[]>(
      `${COURSE_PREFIX}/courses/course/getUserByCourse/${courseId}`
    );
  },
};
