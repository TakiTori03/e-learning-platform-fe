import React from "react";
import { Typography, Table, Skeleton } from "antd";
import {
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import type { ILesson } from "@/type";
import { useStudentQuizDetail, useStudentQuizAttempts } from "../../queryHooks";
import CButton from "@/components/UI/Button";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";

const { Title, Paragraph } = Typography;

interface QuizLandingViewProps {
  lesson: ILesson;
}

export const QuizLandingView = ({ lesson }: QuizLandingViewProps) => {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const quizId = lesson.content;

  const { data: quiz, isLoading: isQuizLoading } = useStudentQuizDetail(quizId || "", !!quizId);
  const { data: attempts = [], isLoading: isAttemptsLoading } = useStudentQuizAttempts(quizId || "", !!quizId);

  const columns = [
    {
      title: "Thời gian nộp",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (val: string) => new Date(val).toLocaleDateString("vi-VN"),
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      render: (val: number) => `${val}/100`,
    },
    {
      title: "Kết quả",
      dataIndex: "isPassed",
      key: "isPassed",
      render: (val: boolean) => (
        <CTag type={val ? TypeTagEnum.SUCCESS : TypeTagEnum.ERROR}>
          {val ? "Đạt" : "Trượt"}
        </CTag>
      ),
    },
  ];

  if (isQuizLoading) {
    return (
      <div className="bg-white p-8 border border-slate-200 rounded-xl h-full flex items-center justify-center">
        <Skeleton active paragraph={{ rows: 6 }} className="w-full" />
      </div>
    );
  }

  const questionsCount = quiz?.questions?.length || 0;

  return (
    <div className="bg-white w-full min-h-[480px] flex flex-col md:flex-row border border-slate-200 rounded-xl shadow-sm overflow-hidden select-none">
      {/* Left Column: Rules & Info */}
      <div className="flex-1 p-6 border-r border-slate-100 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full inline-block mb-2 uppercase tracking-wider">
            Bài tập trắc nghiệm
          </span>
          <Title level={3} className="!text-slate-800 !mt-0 !mb-1 leading-tight text-base md:text-lg">
            {quiz?.title}
          </Title>
          <Paragraph className="text-slate-500 text-xs mt-1 mb-0 leading-relaxed">
            {quiz?.description || "Không có mô tả cho bài kiểm tra này."}
          </Paragraph>

          {/* Criteria Grid */}
          <div className="grid grid-cols-2 gap-3 mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100 max-w-lg">
            <div className="flex items-center gap-2.5">
              <ClockCircleOutlined className="text-slate-400 text-sm" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Thời gian giới hạn</div>
                <div className="text-xs font-bold text-slate-700">
                  {quiz?.timeLimitMinutes ? `${quiz.timeLimitMinutes} phút` : "Không giới hạn"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <BookOutlined className="text-slate-400 text-sm" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Số lượng câu hỏi</div>
                <div className="text-xs font-bold text-slate-700">{questionsCount} câu hỏi</div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 col-span-2 border-t border-slate-200/50 pt-2.5">
              <CheckCircleOutlined className="text-primary text-sm" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Yêu cầu tối thiểu để Đạt</div>
                <div className="text-xs font-bold text-primary">
                  Đạt từ {quiz?.passingScorePercentage}% điểm trở lên
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2.5 col-span-2 border-t border-slate-200/50 pt-2.5">
              <PlayCircleOutlined className="text-slate-400 text-sm" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Giới hạn số lần làm bài</div>
                <div className="text-xs font-bold text-slate-700">
                  {quiz?.maxAttempts && quiz.maxAttempts > 0 
                    ? `Tối đa ${quiz.maxAttempts} lần (Đã thực hiện ${attempts.length} lần)` 
                    : "Không giới hạn số lần làm bài"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <CButton
            type="primary"
            icon={<PlayCircleOutlined />}
            className="h-9 px-6 rounded-lg font-bold text-xs"
            onClick={() => navigate(`/learning/${courseId}/quiz/${quizId}/take?lessonId=${lesson.id}`)}
            disabled={!!quiz?.maxAttempts && quiz.maxAttempts > 0 && attempts.length >= quiz.maxAttempts}
          >
            Bắt đầu làm bài thi
          </CButton>
          {!!quiz?.maxAttempts && quiz.maxAttempts > 0 && attempts.length >= quiz.maxAttempts && (
            <div className="mt-2 text-xs text-red-500 font-semibold">
              Bạn đã đạt giới hạn số lần làm bài cho bài thi này.
            </div>
          )}
        </div>
      </div>

      {/* Right Column: History Attempts */}
      <div className="w-full md:w-[320px] p-6 bg-slate-50/50 flex flex-col flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <HistoryOutlined className="text-slate-400 text-sm" />
          <Title level={4} className="!m-0 !text-slate-700 !text-xs font-bold uppercase tracking-wider">
            Lịch sử làm bài
          </Title>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 p-1.5 shadow-sm">
          <Table
            dataSource={attempts}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 4, size: "small" }}
            size="small"
            className="w-full"
            loading={isAttemptsLoading}
            locale={{ emptyText: "Chưa có lượt thi nào" }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizLandingView;
