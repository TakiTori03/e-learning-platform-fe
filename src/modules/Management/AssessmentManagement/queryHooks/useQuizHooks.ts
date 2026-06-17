import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import type { IListResponse } from "@/type";
import { quizApi } from "../services/quizApi";
import type { IQuiz } from "../types";

export const useInstructorQuizzes = (courseId?: string, q?: string) => {
  return useQuery<IListResponse<IQuiz>>({
    queryKey: ["instructor-quizzes", courseId, q],
    queryFn: () => quizApi.getQuizzesForInstructor(courseId, q),
    staleTime: 2 * 60 * 1000,
  });
};

export const useQuizDetail = (quizId: string, enabled: boolean = true) => {
  return useQuery<IQuiz>({
    queryKey: ["quiz-detail-instructor", quizId],
    queryFn: () => quizApi.getQuizDetailInstructor(quizId),
    enabled: !!quizId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateQuizMutation = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (body: Partial<IQuiz>) => quizApi.createQuiz(body),
    onSuccess: (newQuiz) => {
      notification.success({
        message: "Tạo đề thi thành công",
        description: `Đề thi "${newQuiz.title}" đã được tạo.`,
      });
      queryClient.invalidateQueries({ queryKey: ["instructor-quizzes"] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Tạo đề thi thất bại",
        description: error?.response?.data?.message || error?.message || "Không thể tạo đề thi mới.",
      });
    },
  });
};

export const useUpdateQuizMutation = (quizId: string) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (body: Partial<IQuiz>) => quizApi.updateQuiz(quizId, body),
    onSuccess: (updated) => {
      notification.success({
        message: "Cập nhật thành công",
        description: `Đề thi "${updated.title}" đã được cập nhật.`,
      });
      queryClient.invalidateQueries({ queryKey: ["instructor-quizzes"] });
      queryClient.invalidateQueries({ queryKey: ["quiz-detail-instructor", quizId] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Cập nhật thất bại",
        description: error?.response?.data?.message || error?.message || "Không thể cập nhật đề thi.",
      });
    },
  });
};

export const useDeleteQuizMutation = () => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  return useMutation({
    mutationFn: (quizId: string) => quizApi.deleteQuiz(quizId),
    onSuccess: () => {
      notification.success({
        message: "Xóa thành công",
        description: "Đề thi đã được xóa khỏi ngân hàng đề.",
      });
      queryClient.invalidateQueries({ queryKey: ["instructor-quizzes"] });
    },
    onError: (error: any) => {
      notification.error({
        message: "Xóa đề thi thất bại",
        description: error?.response?.data?.message || error?.message || "Không thể xóa đề thi này.",
      });
    },
  });
};
