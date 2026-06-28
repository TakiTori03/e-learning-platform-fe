import { useState } from "react";
import { Typography, Table, Skeleton, Collapse } from "antd";
import {
  ClockCircleOutlined,
  BookOutlined,
  CheckCircleOutlined,
  HistoryOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import type { ILesson } from "@/type";
import type { IQuizAttempt } from "@/modules/Management/AssessmentManagement/types";
import { useStudentQuizDetail, useStudentQuizAttempts } from "@/modules/Assessment/queryHooks";
import CButton from "@/components/UI/Button";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import QuizReviewModal from "@/modules/Assessment/components/QuizReviewModal";

const { Title, Paragraph } = Typography;

interface QuizLandingViewProps {
  lesson: ILesson;
}

export const QuizLandingView = ({ lesson }: QuizLandingViewProps) => {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const quizId = lesson.content;

  const [selectedAttempt, setSelectedAttempt] = useState<IQuizAttempt | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleReviewAttempt = (attempt: IQuizAttempt) => {
    setSelectedAttempt(attempt);
    setIsReviewOpen(true);
  };

  const { data: quiz, isLoading: isQuizLoading } = useStudentQuizDetail(quizId || "", !!quizId);
  const { data: attempts = [], isLoading: isAttemptsLoading } = useStudentQuizAttempts(quizId || "", !!quizId);

  // Sort attempts ascending (oldest first, i.e. Lần 1, Lần 2...)
  const sortedAttempts = [...attempts].sort(
    (a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
  );

  const columns = [
    {
      title: "Lượt thi",
      key: "attemptNumber",
      width: 100,
      render: (_: any, __: any, index: number) => (
        <span className="font-semibold text-slate-600">Lần {index + 1}</span>
      ),
    },
    {
      title: "Thời gian nộp",
      dataIndex: "submittedAt",
      key: "submittedAt",
      render: (val: string) => {
        const d = new Date(val);
        return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
      },
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      render: (val: number) => (
        <span className="font-bold text-slate-800">{val}/100</span>
      ),
    },
    {
      title: "Kết quả",
      dataIndex: "isPassed",
      key: "isPassed",
      width: 120,
      render: (val: boolean) => (
        <CTag type={val ? TypeTagEnum.SUCCESS : TypeTagEnum.ERROR}>
          {val ? "Đạt" : "Trượt"}
        </CTag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: (record: IQuizAttempt) => (
        <CButton
          type="text"
          className="!text-primary font-semibold hover:underline p-0 h-auto"
          onClick={() => handleReviewAttempt(record)}
        >
          Xem lại
        </CButton>
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
  const isFinalExam = quiz?.isFinal || false;

  return (
    <div className="bg-white w-full border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 select-none flex flex-col justify-between">
      {/* Title & Description Section */}
      <div>
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mb-2.5 uppercase tracking-wider ${
            isFinalExam
              ? "text-red-600 bg-red-50 border border-red-100"
              : "text-primary bg-primary/10"
          }`}
        >
          {isFinalExam ? "Bài thi cuối khóa" : "Bài tập trắc nghiệm"}
        </span>
        <Title level={3} className="!text-slate-800 !mt-0 !mb-2 leading-tight text-base md:text-xl font-extrabold">
          {quiz?.title}
        </Title>
        <Paragraph className="text-slate-500 text-xs md:text-sm mt-1 mb-0 leading-relaxed max-w-2xl">
          {quiz?.description || "Không có mô tả cho bài kiểm tra này."}
        </Paragraph>

        {/* Horizontal Metadata Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 bg-slate-50/70 p-4 md:p-5 rounded-2xl border border-slate-100 w-full">
          <div className="flex items-center gap-3">
            <ClockCircleOutlined className="text-slate-400 text-base" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Thời gian</div>
              <div className="text-xs md:text-sm font-bold text-slate-700">
                {quiz?.timeLimitMinutes ? `${quiz.timeLimitMinutes} phút` : "Không giới hạn"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOutlined className="text-slate-400 text-base" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Câu hỏi</div>
              <div className="text-xs md:text-sm font-bold text-slate-700">{questionsCount} câu hỏi</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircleOutlined className="text-primary text-base" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Yêu cầu đạt</div>
              <div className="text-xs md:text-sm font-bold text-primary">
                Đạt từ {quiz?.passingScorePercentage}% trở lên
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PlayCircleOutlined className="text-slate-400 text-base" />
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Số lượt làm</div>
              <div className="text-xs md:text-sm font-bold text-slate-700">
                {quiz?.maxAttempts && quiz.maxAttempts > 0 
                  ? `Tối đa ${quiz.maxAttempts} lần` 
                  : "Không giới hạn"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centered Actions section */}
      <div className="mt-8 flex flex-col items-center justify-center">
        <CButton
          type="primary"
          icon={<PlayCircleOutlined />}
          className="h-10 px-8 rounded-full font-bold text-xs shadow-md shadow-primary/10 hover:scale-[1.02] transition-all"
          onClick={() => navigate(`/learning/${courseId}/quiz/${quizId}/take?lessonId=${lesson.id}`)}
          disabled={!!quiz?.maxAttempts && quiz.maxAttempts > 0 && attempts.length >= quiz.maxAttempts}
        >
          Bắt đầu làm bài thi
        </CButton>
        {!!quiz?.maxAttempts && quiz.maxAttempts > 0 && attempts.length >= quiz.maxAttempts && (
          <div className="mt-3.5 text-xs text-red-500 font-semibold bg-red-50 px-4 py-2 rounded-full border border-red-100 shadow-sm">
            Bạn đã đạt giới hạn số lần làm bài cho bài thi này.
          </div>
        )}
      </div>

      {/* Collapse Attempts History section */}
      <div className="w-full mt-8 border-t border-slate-100 pt-6">
        <Collapse 
          ghost 
          expandIconPosition="end"
          className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl overflow-hidden"
        >
          <Collapse.Panel 
            header={
              <span className="font-bold text-slate-600 hover:text-primary transition-colors flex items-center gap-2 text-xs uppercase tracking-wider py-1 select-none">
                <HistoryOutlined />
                Lịch sử làm bài ({attempts.length} lượt đã thực hiện)
              </span>
            } 
            key="history"
          >
            <div className="bg-white rounded-xl border border-slate-100 p-2 shadow-sm mt-3 overflow-hidden">
              <Table
                dataSource={sortedAttempts}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 4, size: "small" }}
                size="small"
                className="w-full"
                loading={isAttemptsLoading}
                locale={{ emptyText: "Chưa có lượt thi nào" }}
              />
            </div>
          </Collapse.Panel>
        </Collapse>
      </div>

      <QuizReviewModal
        isOpen={isReviewOpen}
        onClose={() => {
          setIsReviewOpen(false);
          setSelectedAttempt(null);
        }}
        quiz={quiz || null}
        attempt={selectedAttempt}
        mode="student"
      />
    </div>
  );
};

export default QuizLandingView;
