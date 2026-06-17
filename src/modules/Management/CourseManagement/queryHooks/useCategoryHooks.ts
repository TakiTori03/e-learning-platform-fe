import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { categoryApi } from "../services";
import type { ICategory, IListResponse } from "@/type";

// Hook search categories
export const useCategoriesSearch = (page: number, size: number, q?: string) => {
  return useQuery<IListResponse<ICategory>>({
    queryKey: ["admin", "categories", page, size, q],
    queryFn: async () => {
      const response = await categoryApi.searchCategories({ page, size, q });
      if (response && response.content && response.content.length > 0) {
        const ids = response.content.map((c) => c.id);
        try {
          const counts = await categoryApi.getCategoryCourseCounts(ids);
          response.content = response.content.map((c) => ({
            ...c,
            courses: counts[c.id] || 0,
          }));
        } catch (e) {
          console.error("Failed to fetch bulk category course counts", e);
        }
      }
      return response;
    },
    staleTime: 2 * 60 * 1000,
  });
};

// Hook create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (body: { name: string; description: string; icon?: string }) =>
      categoryApi.createCategory(body),
    onSuccess: (newCat) => {
      notification.success({
        message: "Tạo danh mục thành công",
        description: `Danh mục "${newCat.name}" đã được tạo thành công.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-select"] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Tạo danh mục thất bại",
        description: error?.response?.data?.message || error?.message || "Đã xảy ra lỗi.",
      });
    },
  });
};

// Hook update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name: string; description: string; icon?: string } }) =>
      categoryApi.updateCategory(id, body),
    onSuccess: (updated) => {
      notification.success({
        message: "Cập nhật danh mục thành công",
        description: `Danh mục "${updated.name}" đã được cập nhật.`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-select"] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật danh mục thất bại",
        description: error?.response?.data?.message || error?.message || "Đã xảy ra lỗi.",
      });
    },
  });
};

// Hook delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (id: string) => categoryApi.deleteCategory(id),
    onSuccess: () => {
      notification.success({
        message: "Xóa danh mục thành công",
        description: "Danh mục đã được xóa khỏi hệ thống.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories-select"] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Xóa danh mục thất bại",
        description: error?.response?.data?.message || error?.message || "Đã xảy ra lỗi.",
      });
    },
  });
};

// Hook select categories
export const useCategoriesSelect = () => {
  return useQuery({
    queryKey: ["categories-select"],
    queryFn: () => categoryApi.getCategoriesSelect(),
    staleTime: 10 * 60 * 1000,
  });
};
