import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { userApi } from "../api";
import type { IUserInfo, IListResponse } from "@/type";

// Hook to search and paginate users
export const useAdminUsers = (
  page: number = 1,
  size: number = 10,
  q?: string,
  role?: string,
  status?: string
) => {
  return useQuery<IListResponse<IUserInfo>>({
    queryKey: ["admin", "users-list", page, size, q, role, status],
    queryFn: () =>
      userApi.getAllUsers({
        page,
        size,
        q: q?.trim() || undefined,
        role,
        status,
      }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to update user status
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      userApi.updateUserStatus(id, status),
    onSuccess: (_, variables) => {
      notification.success({
        message: "Cập nhật trạng thái thành công",
        description: `Trạng thái người dùng đã được cập nhật thành "${variables.status}".`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users-list"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật trạng thái thất bại",
        description: error?.response?.data?.message || error?.message || "Đã xảy ra lỗi khi cập nhật trạng thái.",
      });
    },
  });
};

// Hook to assign user system role
export const useAssignRole = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, roleName }: { id: string; roleName: string }) =>
      userApi.assignRole(id, roleName),
    onSuccess: (_, variables) => {
      notification.success({
        message: "Phân vai trò thành công",
        description: `Đã cập nhật vai trò người dùng thành "${variables.roleName}".`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users-list"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      notification.error({
        message: "Phân vai trò thất bại",
        description: error?.response?.data?.message || error?.message || "Đã xảy ra lỗi khi đổi vai trò.",
      });
    },
  });
};

// Hook to approve instructor application
export const useApproveInstructor = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (id: string) => userApi.approveInstructor(id),
    onSuccess: () => {
      notification.success({
        message: "Duyệt thành công",
        description: "Hồ sơ giảng viên đã được duyệt và kích hoạt vai trò INSTRUCTOR.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "users-list"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      notification.error({
        message: "Lỗi xét duyệt",
        description: error?.response?.data?.message || error?.message || "Không thể duyệt yêu cầu giảng viên này.",
      });
    },
  });
};
