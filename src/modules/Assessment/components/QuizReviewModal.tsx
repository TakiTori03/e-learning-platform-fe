import React, { memo } from "react";
import { Modal, Radio, Checkbox, Tag, Typography, Button } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  WarningOutlined,
  CalendarOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import type { IQuiz, IQuizAttempt } from "@/modules/Management/AssessmentManagement/types";

const { Title, Paragraph } = Typography;

interface QuizReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: IQuiz | null;
  attempt?: IQuizAttempt | null;
  mode: "student" | "instructor";
}

const QuizReviewModal: React.FC<QuizReviewModalProps> = ({
  isOpen,
  onClose,
  quiz,
  attempt,
  mode,
}) => {
  if (!quiz) return null;

  const isStudent = mode === "student";
  const questions = quiz.questions || [];

  // Calculate statistics
  const totalQuestions = questions.length;
  const correctAnswersCount = isStudent && attempt
    ? attempt.submittedAnswers?.filter((ans) => ans.isCorrect === true).length || 0
    : 0;

  const handleScrollToQuestion = (idx: number) => {
    const el = document.getElementById(`review-question-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={850}
      title={
        <div className="border-b border-slate-100 pb-3 flex flex-col gap-1 pr-6">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
            {isStudent ? "Xem lại chi tiết bài làm học viên" : "Xem trước đề thi (Instructor Mode)"}
          </span>
          <Title level={4} className="!m-0 !text-slate-800 font-extrabold leading-tight text-base sm:text-lg">
            {quiz.title}
          </Title>
        </div>
      }
      className="quiz-review-modal"
      bodyStyle={{ maxHeight: "75vh", overflowY: "auto", padding: "16px 12px" }}
      destroyOnClose
    >
      <div className="space-y-6">
        {/* Top Premium Attempt Summary Board */}
        {isStudent && attempt && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm select-none">
            {/* Score box */}
            <div className="flex items-center gap-4 border-r border-slate-200/50 pr-4 last:border-0">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${
                attempt.isPassed ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              }`}>
                <TrophyOutlined className="text-xl" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Điểm số</span>
                <span className={`text-xl font-extrabold ${attempt.isPassed ? "text-emerald-600" : "text-red-500"}`}>
                  {attempt.score}/100
                </span>
                <Tag color={attempt.isPassed ? "emerald" : "red"} className="font-bold border-0 ml-2 rounded-full text-[9px]">
                  {attempt.isPassed ? "ĐẠT" : "CHƯA ĐẠT"}
                </Tag>
              </div>
            </div>

            {/* Questions correct count */}
            <div className="flex items-center gap-4 border-r border-slate-200/50 pr-4 last:border-0">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                <CheckCircleOutlined className="text-xl" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Kết quả</span>
                <span className="text-sm font-bold text-slate-700 block">
                  Đúng <span className="text-emerald-600">{correctAnswersCount}</span> / {totalQuestions} câu hỏi
                </span>
              </div>
            </div>

            {/* Submission date */}
            <div className="flex items-center gap-4 last:border-0">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                <CalendarOutlined className="text-xl" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Nộp lúc</span>
                <span className="text-xs font-bold text-slate-700 block">
                  {new Date(attempt.submittedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <span className="text-[11px] text-slate-400 block font-medium">
                  {new Date(attempt.submittedAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Question Palette Map */}
        {totalQuestions > 0 && (
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm sticky top-0 z-20 flex flex-col gap-2.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Bản đồ câu hỏi (Nhấn để chuyển nhanh)
            </span>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const userAns = attempt?.submittedAnswers?.find((ans) => ans.questionId === q.id);
                const selectedOptionIds = userAns?.selectedOptionIds || [];
                const isQuestionCorrect = userAns?.isCorrect;

                let btnClass = "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200";
                let dotIcon = null;

                if (isStudent && attempt) {
                  if (!userAns || selectedOptionIds.length === 0) {
                    btnClass = "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100";
                  } else if (isQuestionCorrect === true) {
                    btnClass = "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600";
                    dotIcon = <CheckOutlined className="text-[8px] ml-0.5 animate-bounce" />;
                  } else {
                    btnClass = "bg-red-500 text-white border-red-500 hover:bg-red-600";
                    dotIcon = <CloseOutlined className="text-[8px] ml-0.5 animate-pulse" />;
                  }
                } else {
                  // Instructor Preview Mode
                  btnClass = "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100";
                }

                return (
                  <Button
                    key={q.id}
                    size="small"
                    onClick={() => handleScrollToQuestion(idx)}
                    className={`font-extrabold text-xs rounded-xl flex items-center justify-center px-3 border border-solid shadow-none ${btnClass}`}
                  >
                    <span>{idx + 1}</span>
                    {dotIcon}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-6">
          {totalQuestions === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Bài kiểm tra này chưa có câu hỏi nào.
            </div>
          ) : (
            questions.map((q, qIdx) => {
              const userAns = attempt?.submittedAnswers?.find((ans) => ans.questionId === q.id);
              const selectedOptionIds = userAns?.selectedOptionIds || [];
              const isMulti = q.type === "MULTI_CHOICE";
              const isQuestionCorrect = userAns?.isCorrect;

              let questionBoxClass = "p-5 bg-white border border-slate-200/80 rounded-2xl flex flex-col gap-4 hover:border-slate-300 transition-colors shadow-sm scroll-mt-24";
              let titleIcon = null;
              let correctnessText = null;

              if (isStudent && attempt) {
                if (!userAns || selectedOptionIds.length === 0) {
                  questionBoxClass = "p-5 bg-amber-50/5 border border-amber-200 rounded-2xl flex flex-col gap-4 hover:border-amber-300 transition-colors shadow-sm scroll-mt-24";
                  titleIcon = <WarningOutlined className="text-amber-500 text-base" />;
                  correctnessText = <span className="text-[11px] font-bold text-amber-600">Chưa làm</span>;
                } else if (isQuestionCorrect === true) {
                  questionBoxClass = "p-5 bg-emerald-50/5 border border-emerald-200 rounded-2xl flex flex-col gap-4 hover:border-emerald-300 transition-colors shadow-sm scroll-mt-24";
                  titleIcon = <CheckCircleOutlined className="text-emerald-500 text-base" />;
                  correctnessText = <span className="text-[11px] font-bold text-emerald-600">Đúng (100% điểm)</span>;
                } else {
                  questionBoxClass = "p-5 bg-red-50/5 border border-red-200 rounded-2xl flex flex-col gap-4 hover:border-red-300 transition-colors shadow-sm scroll-mt-24";
                  titleIcon = <CloseCircleOutlined className="text-red-500 text-base" />;
                  correctnessText = <span className="text-[11px] font-bold text-red-500">Sai (0% điểm)</span>;
                }
              }

              return (
                <div
                  key={q.id}
                  id={`review-question-${qIdx}`}
                  className={questionBoxClass}
                >
                  {/* Question header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      {titleIcon}
                      <span className="font-extrabold text-slate-800 text-sm">
                        Câu {qIdx + 1}:
                      </span>
                      {correctnessText}
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="font-bold border-0 bg-blue-50 text-blue-600 text-[10px] uppercase rounded-full px-2.5 py-0.5 m-0 leading-none">
                        {isMulti ? "Nhiều đáp án" : "Một đáp án"}
                      </Tag>
                    </div>
                  </div>

                  {/* Question Content */}
                  <div>
                    <Paragraph className="text-xs sm:text-sm font-extrabold text-slate-800 leading-relaxed mb-4">
                      {q.questionText}
                    </Paragraph>

                    {/* Options list */}
                    <div className="space-y-3">
                      {q.options.map((opt, optIdx) => {
                        const optionLetter = String.fromCharCode(65 + optIdx);
                        const isSelected = selectedOptionIds.includes(opt.id || "");
                        const isCorrect = opt.isCorrect === true;

                        let optionStyle = "border-slate-200 bg-white hover:bg-slate-50/10";
                        let checkIcon = null;

                        if (isStudent) {
                          if (isSelected) {
                            if (isQuestionCorrect === true) {
                              optionStyle = "border-emerald-500 bg-emerald-50/10 text-emerald-700 font-medium";
                              checkIcon = (
                                <Tag color="emerald" className="font-bold border-0 rounded-full px-2.5 text-[9px] uppercase m-0">
                                  Lựa chọn chính xác
                                </Tag>
                              );
                            } else {
                              optionStyle = "border-red-400 bg-red-50/10 text-red-700 font-medium";
                              checkIcon = (
                                <Tag color="red" className="font-bold border-0 rounded-full px-2.5 text-[9px] uppercase m-0">
                                  Lựa chọn sai
                                </Tag>
                              );
                            }
                          }
                        } else {
                          // Instructor preview mode: highlight correct option
                          if (isCorrect) {
                            optionStyle = "border-emerald-500 bg-emerald-50/10 text-emerald-700 font-medium";
                            checkIcon = (
                              <Tag color="emerald" className="font-bold border-0 rounded px-2 text-[9px] uppercase m-0">
                                Đáp án đúng
                              </Tag>
                            );
                          }
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`flex items-center justify-between p-3.5 rounded-xl border border-solid transition-all text-xs sm:text-sm ${optionStyle}`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Option circle */}
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border border-solid shrink-0 transition-colors ${
                                  isSelected
                                    ? isQuestionCorrect === true
                                      ? "bg-emerald-500 text-white border-emerald-500"
                                      : "bg-red-500 text-white border-red-500"
                                    : isCorrect && !isStudent
                                    ? "bg-emerald-500 text-white border-emerald-500"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                                }`}
                              >
                                {optionLetter}
                              </div>

                              <div className="flex items-center gap-2">
                                {isMulti ? (
                                  <Checkbox checked={isSelected || (isCorrect && !isStudent)} disabled className="pointer-events-none" />
                                ) : (
                                  <Radio checked={isSelected || (isCorrect && !isStudent)} disabled className="pointer-events-none" />
                                )}
                                <span className="text-slate-700 font-medium leading-relaxed">{opt.optionText}</span>
                              </div>
                            </div>

                            {checkIcon && <div className="shrink-0 ml-2">{checkIcon}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Modal>
  );
};

export default memo(QuizReviewModal);
