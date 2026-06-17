import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { courseApi, sectionApi, lessonApi } from "../services";
import type { ICourse, IListResponse } from "@/type";
import type { ICourseRequest } from "../services/courseApi";

export const useInstructorCourses = (
  page: number = 1,
  size: number = 10,
  q?: string,
  status?: string,
  enabled: boolean = true
) => {
  return useQuery<IListResponse<ICourse>>({
    queryKey: ["instructor", "courses", page, size, q, status],
    queryFn: () => courseApi.getInstructorCourses({ page, size, q, status }),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
};

export const useAllInstructorCourses = (enabled: boolean = true) => {
  return useQuery<ICourse[]>({
    queryKey: ["instructor", "courses", "all"],
    queryFn: () => courseApi.getAllInstructorCourses(),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export const useAdminCourses = (
  page: number = 1,
  size: number = 10,
  q?: string,
  authorId?: string,
  status?: string,
  enabled: boolean = true
) => {
  return useQuery<IListResponse<ICourse>>({
    queryKey: ["admin", "courses", page, size, q, authorId, status],
    queryFn: () => courseApi.getAdminCourses({ page, size, q, authorId, status }),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
};

export const useCourseCurriculum = (courseId: string) => {
  return useQuery({
    queryKey: ["course-curriculum", courseId],
    queryFn: async () => {
      const course = await courseApi.getCourseDetail(courseId);
      const sections = await sectionApi.getSectionsByCourseId(courseId);
      const hydratedSections = await Promise.all(
        sections.map(async (sec) => {
          const lessons = await lessonApi.getLessonsBySectionId(sec.id);
          return { ...sec, lessons };
        })
      );
      return { course, sections: hydratedSections };
    },
    staleTime: 5 * 60 * 1000, // Optimize: Increase staleTime to 5 minutes since changes trigger explicit invalidation
    enabled: !!courseId,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (body: ICourseRequest) => courseApi.createCourse(body),
    onSuccess: (newCourse) => {
      notification.success({
        message: "Tạo khóa học thành công",
        description: `Khóc học "${newCourse.name || ""}" đã được tạo.`,
      });
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Tạo khóa học thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};

export const useUpdateCourse = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (body: ICourseRequest) => courseApi.updateCourse(courseId, body),
    onSuccess: (updated) => {
      notification.success({
        message: "Cập nhật thành công",
        description: `Khóa học "${updated.name}" đã được cập nhật thông tin.`,
      });
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật thất bại",
        description: error?.response?.data?.message || error?.message || "Không thể cập nhật thông tin.",
      });
    },
  });
};

export const useToggleCourseActiveStatus = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status?: string }) =>
      courseApi.toggleCourseActiveStatus(id, status),
    onSuccess: (_, variables) => {
      notification.success({
        message: "Cập nhật thành công",
        description: "Trạng thái hiển thị của khóa học đã thay đổi.",
      });
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", variables.id] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật trạng thái thất bại",
        description: error?.response?.data?.message || error?.message || "Không thể cập nhật trạng thái.",
      });
    },
  });
};

export const useAdminApproveCourse = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      courseApi.adminApproveCourse(id, status),
    onSuccess: (_, variables) => {
      notification.success({
        message: "Cập nhật trạng thái thành công",
        description: `Khóa học đã được chuyển sang trạng thái ${variables.status === "PUBLISHED" ? "ĐÃ DUYỆT" : "GỠ"}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["instructor", "courses"] });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", variables.id] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật trạng thái thất bại",
        description: error?.response?.data?.message || error?.message || "Không thể phê duyệt khóa học.",
      });
    },
  });
};

export const useCourseHistory = (courseId: string, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["course-history", courseId, page, limit],
    queryFn: () => courseApi.getCourseHistory(courseId, page, limit),
    enabled: !!courseId,
    staleTime: 30 * 1000,
  });
};

export const useInstructorsSelect = () => {
  return useQuery({
    queryKey: ["instructors-select"],
    queryFn: () => courseApi.getInstructorsSelect(),
    staleTime: 10 * 60 * 1000,
  });
};
