import { useMutation } from "@tanstack/react-query";
import { notification } from "antd";
import { feedbackApi } from "../api/feedbackApi";
import type { IFeedbackSubmitRequest } from "../api/feedbackApi";

export const useSubmitFeedbackMutation = (onSuccessCallback?: () => void) => {
  return useMutation<unknown, Error, IFeedbackSubmitRequest>({
    mutationFn: (data: IFeedbackSubmitRequest) => feedbackApi.createFeedback(data),
    onSuccess: () => {
      notification.success({
        message: "Gửi ý kiến thành công",
        description: "Yêu cầu phản hồi của bạn đã được tiếp nhận thành công.",
      });
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error) => {
      const err = error as { status?: number; message?: string };
      const isRateLimit =
        err?.status === 429 ||
        err?.message?.toLowerCase().includes("rate limit") ||
        err?.message?.toLowerCase().includes("too many");

      notification.error({
        message: "Gửi thất bại",
        description: isRateLimit
          ? "Bạn đã gửi ý kiến quá nhanh. Vui lòng thử lại sau 1 phút."
          : err?.message || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
      });
    },
  });
};
