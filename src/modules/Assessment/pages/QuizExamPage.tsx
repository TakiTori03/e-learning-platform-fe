import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Typography, Radio, Checkbox, Modal, Skeleton, message } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LeftOutlined,
  RightOutlined,
  ArrowLeftOutlined,
  FlagOutlined,
  FlagFilled,
} from "@ant-design/icons";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import type { IQuizAttempt } from "@/modules/Management/AssessmentManagement/types";
import {
  useStudentQuizDetail,
  useSubmitQuizMutation,
} from "../queryHooks";
import CButton from "@/components/UI/Button";
import { Show } from "@/components/UI/Template";

const { Title, Paragraph, Text } = Typography;

export const QuizExamPage: React.FC = () => {
  const { courseId = "", quizId = "" } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get("lessonId") || "";

  // Exam state
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [quizStatus, setQuizStatus] = useState<"doing" | "completed">("doing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [lastAttemptResult, setLastAttemptResult] = useState<IQuizAttempt | null>(null);

  // Fetch details
  const { data: quiz, isLoading: isQuizLoading } = useStudentQuizDetail(quizId, !!quizId);
  const submitMutation = useSubmitQuizMutation(quizId);

  const questions = useMemo(() => quiz?.questions || [], [quiz]);
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);

  // Set initial timer when quiz loads
  useEffect(() => {
    if (quiz) {
      if (quiz.timeLimitMinutes && quiz.timeLimitMinutes > 0) {
        setTimeLeft(quiz.timeLimitMinutes * 60);
      } else {
        setTimeLeft(null);
      }
    }
  }, [quiz]);

  // Timer Countdown Effect
  useEffect(() => {
    if (quizStatus !== "doing" || timeLeft === null) return;

    if (timeLeft <= 0) {
      message.warning("Đã hết thời gian làm bài! Đang tự động nộp bài...");
      handleAutoSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, quizStatus]);

  // Handle answers selection
  const handleAnswerSelect = (questionId: string, optionId: string, isMulti: boolean) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMulti) {
        const next = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [questionId]: next };
      } else {
        return { ...prev, [questionId]: [optionId] };
      }
    });
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const getSubmissionPayload = useCallback(() => {
    const submittedAnswers = questions.map((q) => ({
      questionId: q.id,
      selectedOptionIds: selectedAnswers[q.id || ""] || [],
    }));
    return { submittedAnswers };
  }, [questions, selectedAnswers]);

  const handleAutoSubmit = () => {
    const payload = getSubmissionPayload();
    submitMutation.mutate(payload, {
      onSuccess: (result) => {
        setLastAttemptResult(result);
        setQuizStatus("completed");
      },
    });
  };

  const handleManualSubmit = () => {
    const unansweredCount = questions.filter((q) => !selectedAnswers[q.id || ""]?.length).length;

    Modal.confirm({
      title: "Xác nhận nộp bài?",
      content: unansweredCount > 0 
        ? `Bạn vẫn còn ${unansweredCount} câu hỏi chưa trả lời. Bạn chắc chắn muốn nộp bài thi?` 
        : "Bạn có chắc chắn muốn nộp bài thi ngay bây giờ?",
      okText: "Nộp bài",
      cancelText: "Hủy",
      onOk: () => {
        const payload = getSubmissionPayload();
        submitMutation.mutate(payload, {
          onSuccess: (result) => {
            setLastAttemptResult(result);
            setQuizStatus("completed");
          },
        });
      },
    });
  };

  const handleExit = () => {
    if (quizStatus === "doing") {
      Modal.confirm({
        title: "Xác nhận thoát bài thi?",
        content: "Bài thi đang được tiến hành. Nếu thoát ra bây giờ, kết quả của bạn sẽ không được lưu. Bạn có chắc chắn muốn thoát?",
        okText: "Thoát",
        cancelText: "Hủy",
        onOk: () => {
          navigate(`/learning/${courseId}/${lessonId}`);
        },
      });
    } else {
      navigate(`/learning/${courseId}/${lessonId}`);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setQuizStatus("doing");
    if (quiz?.timeLimitMinutes && quiz.timeLimitMinutes > 0) {
      setTimeLeft(quiz.timeLimitMinutes * 60);
    } else {
      setTimeLeft(null);
    }
    setLastAttemptResult(null);
  };

  if (isQuizLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-lg animate-pulse">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  const hasAnswer = useCallback((qId: string) => {
    return !!selectedAnswers[qId]?.length;
  }, [selectedAnswers]);

  const toggleFlag = useCallback(() => {
    if (currentQuestion?.id) {
      setFlaggedQuestions((prev) => ({
        ...prev,
        [currentQuestion.id!]: !prev[currentQuestion.id!],
      }));
    }
  }, [currentQuestion]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col select-none overflow-y-auto">
      {/* Header Bar */}
      <header className="h-16 border-b border-solid border-slate-200 px-6 bg-white flex justify-between items-center z-10 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className="w-10 h-10 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all border border-solid border-slate-200 bg-white"
            title="Thoát bài thi"
          >
            <ArrowLeftOutlined className="text-lg" />
          </button>
          <div>
            <Title level={4} className="!m-0 !text-slate-800 text-sm md:text-base font-extrabold truncate max-w-[450px]">
              {quiz?.title}
            </Title>
            <Text className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">
              {quizStatus === "doing" ? `Câu ${currentQuestionIndex + 1} / ${questions.length}` : "KẾT QUẢ BÀI THI"}
            </Text>
          </div>
        </div>

        {/* Header Right */}
        <div className="flex items-center gap-3">
        </div>
      </header>

      {/* Main Workspace (Centered Card Grid Layout) */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
        <Show>
          {/* ================= DOING EXAM ================= */}
          <Show.When isTrue={quizStatus === "doing"}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start w-full">
              {/* Left Column: Moodle-style Question Box */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row border border-solid border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm animate-fadeIn">
                  {/* Left Side: Question Meta Panel */}
                  <div className="w-full md:w-44 bg-slate-50 p-5 border-r md:border-r border-b md:border-b-0 border-solid border-slate-200 flex flex-col gap-3.5 text-xs text-slate-500">
                    <div className="font-extrabold text-slate-800 text-sm">Câu hỏi {currentQuestionIndex + 1}</div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${hasAnswer(currentQuestion?.id || "") ? "bg-green-500" : "bg-amber-400"}`}></span>
                      <span className="font-semibold text-slate-600">
                        {hasAnswer(currentQuestion?.id || "") ? "Đã trả lời" : "Chưa trả lời"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">Đạt điểm 1,00</div>
                    
                    <button
                      onClick={toggleFlag}
                      className={`flex items-center gap-1.5 mt-4 pt-4 border-t border-solid border-slate-200/60 transition-colors font-semibold text-left bg-transparent border-0 cursor-pointer p-0 ${
                        currentQuestion && flaggedQuestions[currentQuestion.id!]
                          ? "text-red-600 hover:text-red-700"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {currentQuestion && flaggedQuestions[currentQuestion.id!] ? (
                        <FlagFilled className="text-red-500 text-sm" />
                      ) : (
                        <FlagOutlined className="text-sm" />
                      )}
                      {currentQuestion && flaggedQuestions[currentQuestion.id!] ? "Bỏ đánh dấu" : "Đánh dấu câu hỏi"}
                    </button>
                  </div>

                  {/* Right Side: Question Text & Options */}
                  <div className="flex-1 p-6 md:p-8 bg-white flex flex-col justify-between min-h-[380px]">
                    <div>
                      <span className="text-[10px] font-bold bg-blue-50 border border-solid border-blue-100 text-primary rounded px-2.5 py-0.5 inline-block mb-4 tracking-wider uppercase">
                        {currentQuestion?.type === "MULTI_CHOICE" ? "CÂU HỎI NHIỀU ĐÁP ÁN" : "CÂU HỎI MỘT ĐÁP ÁN"}
                      </span>
                      <Paragraph className="text-sm md:text-base text-slate-800 font-extrabold leading-relaxed mb-6">
                        {currentQuestion?.questionText}
                      </Paragraph>

                      {/* Render Choices Options */}
                      <div className="space-y-3">
                        {currentQuestion?.options.map((opt, idx) => {
                          const isChecked = (selectedAnswers[currentQuestion.id || ""] || []).includes(opt.id || "");
                          const isMulti = currentQuestion.type === "MULTI_CHOICE";
                          const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D...

                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleAnswerSelect(currentQuestion.id || "", opt.id || "", isMulti)}
                              className={`flex items-center gap-4 p-3.5 rounded-lg border border-solid transition-all duration-150 cursor-pointer select-none ${
                                isChecked
                                  ? "bg-blue-50/20 border-blue-500 text-slate-900 shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50/50 hover:border-slate-300"
                              }`}
                            >
                              {/* Option Letter circle */}
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all border border-solid flex-shrink-0 ${
                                isChecked
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-slate-50 text-slate-500 border-slate-200"
                              }`}>
                                {optionLetter}
                              </div>

                              <div className="flex items-center gap-2">
                                {isMulti ? (
                                  <Checkbox checked={isChecked} onClick={(e) => e.stopPropagation()} className="pointer-events-none" />
                                ) : (
                                  <Radio checked={isChecked} onClick={(e) => e.stopPropagation()} className="pointer-events-none" />
                                )}
                                <span className="text-xs md:text-sm font-medium text-slate-700 leading-relaxed">{opt.optionText}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Navigation controls (Docked inside the card) */}
                    <div className="flex justify-between items-center mt-8 pt-5 border-t border-solid border-slate-100 flex-shrink-0">
                      <CButton
                        icon={<LeftOutlined />}
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                        className="rounded-lg font-semibold h-9 text-xs text-slate-600 border border-solid border-slate-200 hover:text-slate-800 hover:bg-slate-50 bg-white"
                      >
                        Câu trước
                      </CButton>

                      <Show>
                        <Show.When isTrue={currentQuestionIndex === questions.length - 1}>
                          <CButton
                            type="primary"
                            className="rounded-lg px-8 font-bold bg-emerald-600 border border-solid border-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 text-white h-9 text-xs shadow-sm"
                            onClick={handleManualSubmit}
                            loading={submitMutation.isPending}
                          >
                            Nộp bài
                          </CButton>
                        </Show.When>
                        <Show.Else>
                          <CButton
                            icon={<RightOutlined />}
                            iconPosition="end"
                            onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                            className="rounded-lg font-semibold h-9 text-xs text-slate-600 border border-solid border-slate-200 hover:text-slate-800 hover:bg-slate-50 bg-white"
                          >
                            Câu tiếp theo
                          </CButton>
                        </Show.Else>
                      </Show>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Timer & Question Palette */}
              <div className="flex flex-col gap-4 lg:col-span-1">
                {/* Block 2: Timer Count */}
                {timeLeft !== null && (
                  <div className="bg-white border border-solid border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-2">
                    <Title level={5} className="!m-0 !text-slate-800 !text-xs font-bold uppercase tracking-wider pb-2 border-b border-solid border-slate-100">
                      Thời gian còn lại
                    </Title>
                    <div className={`flex items-center justify-center gap-2 py-3 rounded-lg border border-solid font-mono text-2xl font-black shadow-inner transition-all ${
                      (timeLeft || 0) < 60 
                        ? "bg-red-50 text-red-600 border-red-200 animate-pulse animate-duration-500" 
                        : "bg-slate-50 text-slate-700 border-slate-100"
                    }`}>
                      <ClockCircleOutlined className="text-lg" />
                      {formatTime(timeLeft || 0)}
                    </div>
                  </div>
                )}

                {/* Block 3: Questions Navigation Card */}
                <div className="bg-white border border-solid border-slate-200 shadow-sm rounded-xl p-4 flex flex-col gap-3">
                  <Title level={5} className="!m-0 !text-slate-800 !text-xs font-bold uppercase tracking-wider pb-2 border-b border-solid border-slate-100">
                    Bản đồ câu hỏi
                  </Title>
                  <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                    {questions.map((q, idx) => {
                      const hasAns = hasAnswer(q.id || "");
                      const isActive = idx === currentQuestionIndex;
                      const isQuestionFlagged = !!flaggedQuestions[q.id || ""];

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`aspect-square rounded-lg text-xs font-bold transition-all border border-solid flex items-center justify-center relative ${
                            isActive
                              ? "bg-blue-500 text-white border-blue-500 shadow-sm ring-2 ring-blue-100 scale-105 z-10"
                              : hasAns
                              ? "bg-slate-200 text-slate-700 border-slate-300 hover:bg-slate-300"
                              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {idx + 1}
                          {isQuestionFlagged && (
                            <span className="absolute top-0.5 right-0.5 text-[8px] text-red-500 flex items-center justify-center leading-none">
                              <FlagFilled className="scale-75" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-solid border-slate-100">
                    <CButton
                      type="primary"
                      danger
                      className="w-full rounded-lg font-bold h-9 text-xs shadow-sm bg-red-500 border border-solid border-red-500 hover:bg-red-600 hover:border-red-600 text-white"
                      onClick={handleManualSubmit}
                      loading={submitMutation.isPending}
                    >
                      Nộp bài thi ngay
                    </CButton>
                  </div>
                </div>
              </div>
            </div>
          </Show.When>

          {/* ================= COMPLETED EXAM ================= */}
          <Show.When isTrue={quizStatus === "completed"}>
            <div className="flex flex-col items-center justify-center w-full">
              <div className="max-w-md w-full bg-white p-8 border border-solid border-slate-200 shadow-lg rounded-2xl text-center relative">
                <div className="absolute inset-0 bg-radial-gradient from-slate-100/30 to-transparent pointer-events-none rounded-2xl" />
                <Show>
                  <Show.When isTrue={!!lastAttemptResult?.isPassed}>
                    <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
                    <Title level={2} className="!text-green-600 !mt-0 !text-2xl font-bold">
                      Chúc mừng! Bạn đã đạt
                    </Title>
                  </Show.When>
                  <Show.Else>
                    <CloseCircleOutlined className="text-red-500 text-6xl mb-4" />
                    <Title level={2} className="!text-red-600 !mt-0 !text-2xl font-bold">
                      Không đạt điểm chuẩn
                    </Title>
                  </Show.Else>
                </Show>

                <div className="bg-slate-50 rounded-xl p-4.5 border border-solid border-slate-200/60 grid grid-cols-2 gap-4 mt-6">
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Điểm của bạn</div>
                    <div className={`text-2xl font-extrabold ${lastAttemptResult?.isPassed ? "text-green-600" : "text-red-600"}`}>
                      {lastAttemptResult?.score}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Yêu cầu đạt</div>
                    <div className="text-2xl font-extrabold text-slate-700">{quiz?.passingScorePercentage}%</div>
                  </div>
                </div>

                <Paragraph className="text-slate-600 text-xs md:text-sm mt-6 leading-relaxed max-h-[100px] overflow-y-auto">
                  {lastAttemptResult?.isPassed 
                    ? "Bạn đã xuất sắc vượt qua bài kiểm tra của bài giảng này! Trạng thái hoàn thành bài học đã được ghi nhận trên hệ thống."
                    : "Điểm số của bạn chưa đạt yêu cầu tối thiểu. Đừng nản lòng, bạn có thể ôn tập kỹ lại bài học cũ và tiến hành làm lại bài thi để cải thiện kết quả."}
                </Paragraph>

                <div className="mt-8 flex justify-center gap-4">
                  <CButton
                    type="default"
                    className="h-9 rounded-lg font-semibold text-xs text-slate-600 border border-solid border-slate-200 hover:text-slate-800 hover:bg-slate-50 bg-white"
                    onClick={handleExit}
                  >
                    Quay lại khóa học
                  </CButton>
                  <CButton
                    type="primary"
                    className="h-9 rounded-lg font-bold text-xs shadow-sm"
                    onClick={handleRetake}
                  >
                    Làm lại bài thi
                  </CButton>
                </div>
              </div>
            </div>
          </Show.When>
        </Show>
      </main>
    </div>
  );
};

export default QuizExamPage;
