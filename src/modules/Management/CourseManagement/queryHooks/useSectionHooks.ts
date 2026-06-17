import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { sectionApi } from "../services";
import type { ISectionRequest } from "../services/sectionApi";

export const useCreateSection = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (body: ISectionRequest) => sectionApi.createSection(body),
    onSuccess: () => {
      notification.success({
        message: "Thêm chương mới thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Thêm chương mới thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};

export const useUpdateSection = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: ISectionRequest }) =>
      sectionApi.updateSection(id, body),
    onSuccess: () => {
      notification.success({
        message: "Cập nhật chương thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật chương thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};

export const useDeleteSection = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (id: string) => sectionApi.deleteSections([id]),
    onSuccess: () => {
      notification.success({
        message: "Xóa chương thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Xóa chương thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};

export const useReorderSections = (courseId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (ids: string[]) => sectionApi.reorderSections(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course-curriculum", courseId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Thay đổi thứ tự chương thất bại",
        description: error?.response?.data?.message || error?.message || "Đã có lỗi xảy ra.",
      });
    },
  });
};
