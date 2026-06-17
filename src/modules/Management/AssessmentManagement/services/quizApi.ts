import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import type { IListResponse } from "@/type";
import type { IQuiz, IQuizAttempt } from "../types";

const PREFIX = API_PREFIX.ASSESSMENT;

export const quizApi = {
  getQuizzesForInstructor: (courseId?: string, q?: string): Promise<IListResponse<IQuiz>> => {
    const params: any = {};
    if (q) params.q = q;
    if (courseId) params.courseId = courseId;
    return axiosClient.get<IListResponse<IQuiz>>(`${PREFIX}/instructor/quizzes`, params);
  },

  getQuizDetailInstructor: (quizId: string): Promise<IQuiz> => {
    return axiosClient.get<IQuiz>(`${PREFIX}/instructor/quizzes/${quizId}`);
  },

  createQuiz: (body: Partial<IQuiz>): Promise<IQuiz> => {
    return axiosClient.post<IQuiz>(`${PREFIX}/instructor/quizzes`, body);
  },

  updateQuiz: (quizId: string, body: Partial<IQuiz>): Promise<IQuiz> => {
    return axiosClient.put<IQuiz>(`${PREFIX}/instructor/quizzes/${quizId}`, body);
  },

  deleteQuiz: (quizId: string): Promise<void> => {
    return axiosClient.delete<void>(`${PREFIX}/instructor/quizzes/${quizId}`);
  },

  // Cho Học viên làm bài
  getQuizDetailStudent: (quizId: string): Promise<IQuiz> => {
    return axiosClient.get<IQuiz>(`${PREFIX}/quizzes/${quizId}`);
  },

  submitQuiz: (quizId: string, body: { submittedAnswers: any[] }): Promise<IQuizAttempt> => {
    return axiosClient.post<IQuizAttempt>(`${PREFIX}/quizzes/${quizId}/submit`, body);
  },

  getAttemptsForQuiz: (quizId: string): Promise<IQuizAttempt[]> => {
    return axiosClient.get<IQuizAttempt[]>(`${PREFIX}/quizzes/${quizId}/attempts`);
  },

  getAttemptsForCourse: (courseId: string): Promise<IQuizAttempt[]> => {
    return axiosClient.get<IQuizAttempt[]>(`${PREFIX}/quizzes/course/${courseId}/attempts`);
  },
};

export default quizApi;
