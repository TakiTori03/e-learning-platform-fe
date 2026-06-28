import { IBase } from "@/type";

export interface IAnswerOption {
  id?: string;
  optionText: string;
  isCorrect?: boolean;
}

export interface IQuestion {
  id?: string;
  questionText: string;
  type: "SINGLE_CHOICE" | "MULTI_CHOICE";
  scoreWeight: number;
  options: IAnswerOption[];
}

export interface IQuiz extends IBase {
  id: string;
  courseId?: string;
  lessonId?: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScorePercentage: number;
  maxAttempts?: number;
  isFinal: boolean;
  questions?: IQuestion[];
}

export interface IQuizAttempt extends IBase {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  score: number;
  isPassed: boolean;
  isFinalAttempt: boolean;
  submittedAt: string;
  submittedAnswers?: {
    questionId: string;
    selectedOptionIds: string[];
    isCorrect?: boolean;
  }[];
}
