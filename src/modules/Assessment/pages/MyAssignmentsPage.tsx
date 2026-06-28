import React, { useState } from "react";
import { Card, Col, Empty, Row, Input, Select, Tooltip, message } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  SearchOutlined,
  TrophyOutlined,
  BookOutlined,
  ArrowRightOutlined,
  CrownOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CButton from "@/components/UI/Button";
import LoadingLazy from "@/components/UI/LoadingLazy";
import { For, Show } from "@/components/UI/Template";
import { useMyAssignments } from "../queryHooks";
import { quizApi } from "@/modules/Management/AssessmentManagement/services/quizApi";
import type { IQuiz, IQuizAttempt } from "@/modules/Management/AssessmentManagement/types";
import QuizReviewModal from "../components/QuizReviewModal";

const { Option } = Select;

export const MyAssignmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { stats, assignments, courses, isLoading } = useMyAssignments();

  // Review Modal States
  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [selectedAttempt, setSelectedAttempt] = useState<IQuizAttempt | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const handleOpenReview = async (quizId: string) => {
    const hideLoading = message.loading("Đang tải dữ liệu bài làm...", 0);
    try {
      // Fetch quiz details and attempts in parallel
      const [quizData, attemptsData] = await Promise.all([
        quizApi.getQuizDetailStudent(quizId),
        quizApi.getAttemptsForQuiz(quizId),
      ]);
      
      setSelectedQuiz(quizData);
      
      // Select the latest attempt
      if (attemptsData && attemptsData.length > 0) {
        const sorted = [...attemptsData].sort(
          (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        );
        setSelectedAttempt(sorted[0]);
      } else {
        setSelectedAttempt(null);
      }
      setIsReviewModalOpen(true);
    } catch (error: any) {
      message.error(error?.response?.data?.message || error?.message || "Không thể tải dữ liệu bài làm.");
    } finally {
      hideLoading();
    }
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("ALL");
  const [selectedFinalStatus, setSelectedFinalStatus] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  if (isLoading) {
    return <LoadingLazy />;
  }

  // Difficulty Mapping for Display & Filters
  const difficultyMapping: Record<string, { label: string; tagClass: string }> = {
    EASY: { label: "Dễ", tagClass: "bg-blue-50 text-blue-600 border-blue-200" },
    MEDIUM: { label: "Trung bình", tagClass: "bg-amber-50 text-amber-600 border-amber-200" },
    HARD: { label: "Khó", tagClass: "bg-rose-50 text-rose-500 border-rose-200" },
  };

  // Filter Logic
  const filteredAssignments = assignments.filter((item: any) => {
    // 1. Search Query filter (matches title, course name, or description)
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

    // 2. Course filter
    const matchesCourse =
      selectedCourseId === "ALL" || item.courseId === selectedCourseId;

    // 3. Final Exam filter
    let matchesFinal = true;
    if (selectedFinalStatus === "FINAL") {
      matchesFinal = item.isFinal === true;
    } else if (selectedFinalStatus === "LESSON") {
      matchesFinal = item.isFinal === false;
    }

    // 4. Status filter
    let statusKey = "NOT_STARTED";
    if (item.status === "COMPLETED") statusKey = "COMPLETED";
    else if (item.status === "IN_PROGRESS") statusKey = "IN_PROGRESS";

    const matchesStatus =
      selectedStatus === "ALL" || statusKey === selectedStatus;

    return matchesSearch && matchesCourse && matchesFinal && matchesStatus;
  });

  return (
    <div className="min-h-[85vh] bg-slate-50/60 pb-16">
      {/* Stats Header Section */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-6 md:px-12 mb-8 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight m-0">
                Bài tập & Đánh giá của tôi
              </h1>
              <p className="text-slate-500 text-sm mt-1.5 m-0 font-medium">
                Quản lý, thực hiện và theo dõi kết quả các bài tập trong khóa học của bạn
              </p>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <Row gutter={[20, 20]} className="mt-6">
            <Col xs={12} md={6}>
              <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <div>
                  <div className="text-[11px] font-extrabold text-blue-500 uppercase tracking-wider">
                    Tổng số bài tập
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-blue-900 mt-1">
                    {stats.totalCount}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-center justify-center">
                  <FileTextOutlined className="text-blue-500 text-xl" />
                </div>
              </div>
            </Col>

            <Col xs={12} md={6}>
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <div>
                  <div className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">
                    Đã hoàn thành
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-emerald-900 mt-1">
                    {stats.completedCount}
                  </div>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-center">
                  <CheckCircleOutlined className="text-emerald-500 text-xl" />
                </div>
              </div>
            </Col>

            <Col xs={12} md={6}>
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <div>
                  <div className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">
                    Đang thực hiện
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-amber-900 mt-1">
                    {stats.inProgressCount}
                  </div>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center justify-center">
                  <ClockCircleOutlined className="text-amber-500 text-xl" />
                </div>
              </div>
            </Col>

            <Col xs={12} md={6}>
              <div className="bg-purple-50/40 border border-purple-100 rounded-2xl p-5 shadow-sm flex items-center justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                <div>
                  <div className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider">
                    Tỷ lệ hoàn thành
                  </div>
                  <div className="text-2xl md:text-3xl font-black text-purple-900 mt-1">
                    {stats.completionRate}%
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex items-center justify-center">
                  <ThunderboltOutlined className="text-purple-500 text-xl" />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Filters and Search Bar */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 mb-6 shadow-sm flex flex-col gap-4">
          
          {/* Row 1: Search & Course Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search Input */}
            <div className="flex-1">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <SearchOutlined /> Tìm kiếm nhanh
              </div>
              <Input
                placeholder="Tìm kiếm theo tiêu đề, bài tập hoặc khóa học..."
                prefix={<SearchOutlined className="text-slate-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl border-slate-200/80 h-11 hover:border-orange-400 focus:border-orange-500 transition-all font-medium text-slate-700 shadow-sm"
                allowClear
              />
            </div>

            {/* Course Filter Dropdown */}
            <div className="w-full md:w-80">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <BookOutlined /> Theo khóa học
              </div>
              <Select
                value={selectedCourseId}
                onChange={(val) => setSelectedCourseId(val)}
                className="w-full h-11 rounded-xl shadow-sm"
                placeholder="Chọn khóa học"
                dropdownClassName="rounded-xl"
              >
                <Option value="ALL">Tất cả khóa học</Option>
                {courses.map((course: any) => (
                  <Option key={course.id} value={course.id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          {/* Row 2: Tag/Button Filter Sets */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            
            {/* Final Exam Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CrownOutlined className="text-amber-500" /> Phân loại:
              </span>
              <div className="flex items-center gap-2">
                {[
                  { key: "ALL", label: "Tất cả" },
                  { key: "LESSON", label: "Bài học" },
                  { key: "FINAL", label: "Thi cuối kỳ" },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedFinalStatus(item.key)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all duration-200 ${
                      selectedFinalStatus === item.key
                        ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <HistoryOutlined /> Trạng thái:
              </span>
              <div className="flex items-center gap-2">
                {[
                  { key: "ALL", label: "Tất cả" },
                  { key: "NOT_STARTED", label: "Chưa làm" },
                  { key: "IN_PROGRESS", label: "Đang làm" },
                  { key: "COMPLETED", label: "Hoàn thành" },
                ].map((stat) => (
                  <button
                    key={stat.key}
                    onClick={() => setSelectedStatus(stat.key)}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all duration-200 ${
                      selectedStatus === stat.key
                        ? "bg-slate-800 border-slate-800 text-white shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    {stat.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Exercises/Quizzes List */}
        <Show>
          <Show.When isTrue={filteredAssignments.length === 0}>
            <Card className="text-center py-20 border-dashed border-2 rounded-3xl bg-white shadow-sm max-w-2xl mx-auto border-slate-200">
              <Empty
                image={<BookOutlined style={{ fontSize: 72, color: "#cbd5e1" }} />}
                description={
                  <span className="text-slate-500 text-lg font-semibold block mt-4">
                    Không tìm thấy bài tập nào phù hợp
                  </span>
                }
              />
            </Card>
          </Show.When>
          <Show.Else>
            <div className="flex flex-col gap-4">
              <For
                array={filteredAssignments}
                render={(item: any) => {
                  const diffMeta = difficultyMapping[item.difficulty] || {
                    label: "Cơ bản",
                    tagClass: "bg-blue-50 text-blue-600 border-blue-100",
                  };

                  // Status badge styling
                  let statusLabel = "Chưa làm";
                  let statusClass = "bg-slate-100 text-slate-600 border-slate-200";
                  let actionBtnLabel = "Làm bài";
                  let actionBtnClass = "bg-orange-500 hover:bg-orange-600 hover:-translate-y-0.5 text-white shadow-md shadow-orange-500/10";

                  if (item.status === "COMPLETED") {
                    statusLabel = "Hoàn thành";
                    statusClass = "bg-emerald-50 text-emerald-600 border-emerald-200";
                    actionBtnLabel = "Xem lại";
                    actionBtnClass = "bg-slate-700 hover:bg-slate-800 hover:-translate-y-0.5 text-white shadow-md shadow-slate-700/10";
                  } else if (item.status === "IN_PROGRESS") {
                    statusLabel = "Đang làm";
                    statusClass = "bg-amber-50 text-amber-600 border-amber-200";
                    actionBtnLabel = "Tiếp tục";
                    actionBtnClass = "bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5 text-white shadow-md shadow-blue-600/10";
                  }

                  // Max Attempts display
                  const maxAttemptsStr = item.maxAttempts !== null ? item.maxAttempts : "∞";

                  // Check if score is high score or needs highlighting
                  const hasAttempts = item.attemptCount > 0;
                  const isPassTagClass = item.isPass 
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                    : "bg-rose-50 text-rose-600 border-rose-200";
                  const isPassTagText = item.isPass ? "Đạt" : "Chưa đạt";

                  return (
                    <Card
                      key={item.id}
                      className="rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 hover:-translate-y-0.5"
                      styles={{ body: { padding: "24px 28px" } }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        {/* Info details */}
                        <div className="flex-1 flex flex-col gap-2.5">
                          {/* Course context path */}
                          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-slate-400">
                            <BookOutlined className="text-slate-350" />
                            <span className="hover:text-slate-600 transition-colors cursor-default">{item.courseName}</span>
                            <span className="text-slate-300">/</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase text-slate-500 font-extrabold">{item.categoryName}</span>
                          </div>

                          {/* Quiz Title & Type Badge */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-lg font-bold text-slate-800 m-0 leading-snug">
                              {item.title}
                            </h3>
                            {item.isFinal ? (
                              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                                <CrownOutlined /> Thi cuối kỳ
                              </span>
                            ) : (
                              <span className="bg-blue-50 text-blue-600 border border-blue-200 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                Bài học
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {item.description ? (
                            <p className="text-slate-500 text-sm mt-0.5 mb-1.5 font-medium leading-relaxed max-w-3xl">
                              {item.description}
                            </p>
                          ) : (
                            <p className="text-slate-400 text-xs italic mt-0.5 mb-1.5">
                              Không có mô tả chi tiết cho bài tập này.
                            </p>
                          )}

                          {/* Badge Tags Row */}
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${diffMeta.tagClass}`}>
                              Độ khó: {diffMeta.label}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border ${statusClass}`}>
                              Trạng thái: {statusLabel}
                            </span>
                            {hasAttempts && (
                              <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md border flex items-center gap-1 ${isPassTagClass}`}>
                                {item.isPass ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                                Kết quả: {isPassTagText}
                              </span>
                            )}
                          </div>

                          {/* Metrics row */}
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2 pt-2 border-t border-slate-100 text-[12px] font-bold text-slate-500">
                            
                            {/* Score Display (Achieved Points / Total Points) */}
                            <Tooltip title="Điểm số cao nhất / Tổng điểm">
                              <span className={`flex items-center gap-2 ${hasAttempts ? "text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150" : "text-slate-400"}`}>
                                <TrophyOutlined className={hasAttempts ? "text-amber-500" : "text-slate-350"} />
                                <span>
                                  Điểm: <strong className={hasAttempts ? "text-slate-800" : ""}>{item.achievedPoints !== null ? item.achievedPoints.toFixed(1) : "0.0"}</strong> / {item.totalPoints.toFixed(1)}
                                </span>
                              </span>
                            </Tooltip>

                            {/* Attempt count (used/max) */}
                            <Tooltip title="Số lượt làm bài đã dùng / Tối đa">
                              <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150">
                                <ThunderboltOutlined className="text-orange-400" />
                                <span>
                                  Lượt làm: <strong>{item.attemptCount}</strong> / {maxAttemptsStr}
                                </span>
                              </span>
                            </Tooltip>

                            {/* Time limit */}
                            <span className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-150">
                              <ClockCircleOutlined className="text-blue-400" />
                              <span>
                                Thời gian: {item.timeLimitMinutes ? `${item.timeLimitMinutes} phút` : "Không giới hạn"}
                              </span>
                            </span>

                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="flex items-center justify-end">
                          <CButton
                            type="primary"
                            size="large"
                            className={`rounded-xl font-bold flex items-center justify-center gap-2 border-none transition-all duration-300 min-w-[130px] h-11 ${actionBtnClass}`}
                            onClick={() => {
                              if (actionBtnLabel === "Xem lại") {
                                handleOpenReview(item.id);
                              } else {
                                navigate(`/learning/${item.courseId}/quiz/${item.id}/take`);
                              }
                            }}
                            icon={actionBtnLabel !== "Xem lại" ? <ArrowRightOutlined /> : <InfoCircleOutlined />}
                          >
                            {actionBtnLabel}
                          </CButton>
                        </div>
                      </div>
                    </Card>
                  );
                }}
              />
            </div>
          </Show.Else>
        </Show>
      </div>

      <QuizReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedQuiz(null);
          setSelectedAttempt(null);
        }}
        quiz={selectedQuiz}
        attempt={selectedAttempt}
        mode="student"
      />
    </div>
  );
};

export default MyAssignmentsPage;
