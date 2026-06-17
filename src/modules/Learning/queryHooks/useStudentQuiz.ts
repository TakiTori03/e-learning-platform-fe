import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizApi } from "@/modules/Management/AssessmentManagement/services/quizApi";
import type { IQuiz, IQuizAttempt } from "@/modules/Management/AssessmentManagement/types";

export const useStudentQuizDetail = (quizId: string, enabled: boolean = true) => {
  return useQuery<IQuiz>({
    queryKey: ["student-quiz-detail", quizId],
    queryFn: () => quizApi.getQuizDetailStudent(quizId),
    enabled: !!quizId && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export const useStudentQuizAttempts = (quizId: string, enabled: boolean = true) => {
  return useQuery<IQuizAttempt[]>({
    queryKey: ["student-quiz-attempts", quizId],
    queryFn: () => quizApi.getAttemptsForQuiz(quizId),
    enabled: !!quizId && enabled,
    staleTime: 1 * 60 * 1000,
  });
};

export const useSubmitQuizMutation = (quizId: string) => {
  const queryClient = useQueryClient();

  return useMutation<IQuizAttempt, Error, { submittedAnswers: any[] }>({
    mutationFn: (body) => quizApi.submitQuiz(quizId, body),
    onSuccess: () => {
      // Refresh attempts and enrolled course progress status
      queryClient.invalidateQueries({ queryKey: ["student-quiz-attempts", quizId] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-course"] });
    },
  });
};
