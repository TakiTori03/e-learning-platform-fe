import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFeedbackApi } from "../api/adminFeedbackApi";
import { App } from "antd";
import { FeedbackStatusLabels, type FeedbackStatus } from "@/constants/enums";

// ======================== HOOKS ========================
export const useAdminFeedbacks = (
  page: number = 1,
  size: number = 10,
  search?: string,
  status?: string,
  type?: string
) => {
  return useQuery({
    queryKey: ["admin", "feedbacks-list", page, size, search, status, type],
    queryFn: async () => {
      const res = await adminFeedbackApi.getAllFeedbacks({
        page,
        size,
        q: search,
        status,
        type,
      });
      return res;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateFeedbackStatusMutation = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFeedbackApi.updateFeedbackStatus(id, status),
    onSuccess: (updated) => {
      const label = FeedbackStatusLabels[updated.status as FeedbackStatus] || updated.status;
      notification.success({
        message: "Cập nhật thành công",
        description: `Trạng thái phản hồi đã chuyển sang "${label}".`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "feedbacks-list"] });
    },
    onError: () => {
      notification.error({
        message: "Cập nhật thất bại",
        description: "Không thể cập nhật trạng thái phản hồi. Vui lòng thử lại.",
      });
    },
  });
};

export const useReplyFeedbackMutation = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: ({ id, content }: { id: string; content: string }) =>
      adminFeedbackApi.replyFeedback(id, content),
    onSuccess: () => {
      notification.success({
        message: "Gửi phản hồi thành công",
        description: "Ý kiến trả lời đã được gửi đến người dùng.",
      });
      queryClient.invalidateQueries({ queryKey: ["admin", "feedbacks-list"] });
    },
    onError: () => {
      notification.error({
        message: "Gửi phản hồi thất bại",
        description: "Không thể gửi phản hồi. Vui lòng thử lại.",
      });
    },
  });
};
