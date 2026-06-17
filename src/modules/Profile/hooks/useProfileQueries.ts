import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  profileApi,
  type IUpdateProfileRequest,
  type IChangePasswordRequest,
} from "../api/profileApi";
import { authApi } from "@/modules/Auth/services/authApi";
import { useAuthStore } from "@/store/useAuthStore";
import { notification } from "antd";

export const useProfileQueries = (userId?: string) => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const profileQuery = useQuery({
    queryKey: ["profile", userId || "me"],
    queryFn: async () => {
      if (userId) {
        return await authApi.getUserById(userId);
      } else {
        const userData = await authApi.getMe();
        setUser(userData);
        return userData;
      }
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: IUpdateProfileRequest) => profileApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(["profile", "me"], updatedUser);
      notification.success({
        message: "Cập nhật hồ sơ thành công",
        description: "Thông tin hồ sơ của bạn đã được cập nhật thành công.",
      });
    },
    onError: () => {
      notification.error({
        message: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật thông tin hồ sơ.",
      });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (avatarUrl: string) =>
      profileApi.updateProfile({ avatar: avatarUrl }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(["profile", "me"], updatedUser);
      notification.success({
        message: "Cập nhật ảnh đại diện thành công",
        description: "Ảnh đại diện của bạn đã được cập nhật thành công.",
      });
    },
    onError: () => {
      notification.error({
        message: "Cập nhật thất bại",
        description: "Không thể cập nhật ảnh đại diện.",
      });
    },
  });

  const updatePrivacyMutation = useMutation({
    mutationFn: (data: { showProfile: boolean; showCourses: boolean }) =>
      profileApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.setQueryData(["profile", "me"], updatedUser);
      notification.success({
        message: "Đã lưu cài đặt quyền riêng tư",
        description: "Quyền riêng tư của bạn đã được cập nhật thành công.",
      });
    },
    onError: () => {
      notification.error({
        message: "Cập nhật thất bại",
        description: "Không thể cập nhật quyền riêng tư.",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (data: IChangePasswordRequest) =>
      profileApi.changePassword(data),
    onSuccess: () => {
      notification.success({
        message: "Đổi mật khẩu thành công",
        description: "Mật khẩu của bạn đã được thay đổi thành công.",
      });
    },
    onError: (err: any) => {
      notification.error({
        message: "Đổi mật khẩu thất bại",
        description:
          err?.message || "Vui lòng kiểm tra lại mật khẩu cũ.",
      });
    },
  });

  return {
    user: profileQuery.data,
    isLoading: profileQuery.isLoading,
    isUpdating:
      updateProfileMutation.isPending ||
      updateAvatarMutation.isPending ||
      updatePrivacyMutation.isPending ||
      changePasswordMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    updateAvatar: updateAvatarMutation.mutateAsync,
    updatePrivacy: updatePrivacyMutation.mutateAsync,
    changePassword: changePasswordMutation.mutateAsync,
    resetPasswordMutation: changePasswordMutation.reset,
  };
};
