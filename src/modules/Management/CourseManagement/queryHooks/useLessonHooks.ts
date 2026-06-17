import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { lessonApi } from "../services";
import type { ILessonRequest } from "../services/lessonApi";

export const useCreateLesson = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (body: ILessonRequest) => lessonApi.createLesson(body),
    onSuccess: () => {
      notification.success({
        message: "Thêm bài học thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Thêm bài học thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};

export const useUpdateLesson = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ILessonRequest }) =>
      lessonApi.updateLesson(id, body),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật bài học thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật bài học thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};

export const useDeleteLesson = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (id: string) => lessonApi.deleteLessons([id]),
    onSuccess: () => {
      notification.success({
        message: "Xóa bài học thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Xóa bài học thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};

export const useReorderLessons = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (ids: string[]) => lessonApi.reorderLessons(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Thay đổi thứ tự bài học thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};
