import React, { useState, useEffect } from "react";
import { Table, Space, Button, Card, Typography, Tag, Tooltip, Input, Select, Empty } from "antd";
import CPopconfirm from "@/components/UI/Popconfirm";
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  GraduationCap,
  Search,
  FileQuestion,
  RotateCcw,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/UI/PageHeader";
import StatsCard from "@/components/UI/StatsCard";
import { pathRoutes } from "@/constants/routes";
import { useInstructorQuizzes, useDeleteQuizMutation } from "../queryHooks/useQuizHooks";
import { useAllInstructorCourses } from "@/modules/Management/CourseManagement/queryHooks/useCourseHooks";
import type { IQuiz } from "../types";
import QuizReviewModal from "@/modules/Learning/components/QuizReviewModal";

const { Text } = Typography;

const InstructorAssessments: React.FC = () => {
  const navigate = useNavigate();

  const [selectedQuiz, setSelectedQuiz] = useState<IQuiz | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePreviewQuiz = (quiz: IQuiz) => {
    setSelectedQuiz(quiz);
    setIsPreviewOpen(true);
  };
  
  // States for search and filter
  const [searchVal, setSearchVal] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterType, setFilterType] = useState<"lesson" | "final" | undefined>(undefined);
  const [filterLinkStatus, setFilterLinkStatus] = useState<"linked" | "unlinked" | undefined>(undefined);
  const [filterCourseId, setFilterCourseId] = useState<string | undefined>(undefined);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchVal);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchVal]);

  // Query and mutation hooks
  const { data: quizzesData, isLoading } = useInstructorQuizzes(filterCourseId, debouncedSearch);
  const quizzes = quizzesData?.content || [];
  const apiMeta = quizzesData?.meta;
  const deleteQuizMutation = useDeleteQuizMutation();

  const handleDelete = (quizId: string) => {
    deleteQuizMutation.mutate(quizId);
  };

  // Fetch instructor courses for selector
  const { data: coursesData } = useAllInstructorCourses();
  const courses = coursesData || [];
  const courseMap = React.useMemo(() => {
    const map = new Map<string, string>();
    courses.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [courses]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchVal("");
    setFilterType(undefined);
    setFilterLinkStatus(undefined);
    setFilterCourseId(undefined);
  };

  const hasActiveFilters = searchVal !== "" || filterType !== undefined || filterLinkStatus !== undefined || filterCourseId !== undefined;

  // Client-side filtering on top of backend search
  const filteredQuizzes = quizzes.filter((quiz) => {
    if (filterType === "lesson" && quiz.isFinal) return false;
    if (filterType === "final" && !quiz.isFinal) return false;

    const isLinked = !!quiz.lessonId;
    if (filterLinkStatus === "linked" && !isLinked) return false;
    if (filterLinkStatus === "unlinked" && isLinked) return false;

    return true;
  });

  // Calculate statistics (based on Backend metadata or fallback to client-side)
  const totalCount = apiMeta?.totalCount !== undefined ? Number(apiMeta.totalCount) : quizzes.length;
  const linkedCount = apiMeta?.linkedCount !== undefined ? Number(apiMeta.linkedCount) : quizzes.filter((q) => q.lessonId).length;
  const unlinkedCount = apiMeta?.unlinkedCount !== undefined ? Number(apiMeta.unlinkedCount) : totalCount - linkedCount;
  const avgTimeLimit = apiMeta?.avgTimeLimit !== undefined
    ? Number(apiMeta.avgTimeLimit)
    : (totalCount > 0 ? Math.round(quizzes.reduce((sum, q) => sum + (q.timeLimitMinutes || 0), 0) / totalCount) : 0);

  const columns = [
    {
      title: "Tiêu đề đề thi",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: IQuiz) => (
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${record.isFinal ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}>
            {record.isFinal ? <GraduationCap size={18} /> : <BookOpen size={18} />}
          </div>
          <Space direction="vertical" size={1}>
            <span className="font-bold text-gray-800 text-sm hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(pathRoutes.instructor.assessmentBuilder.replace(":quizId?", record.id))}>
              {text}
            </span>
            <Text type="secondary" className="text-xs max-w-md line-clamp-1 block text-gray-500">
              {record.description || "Không có mô tả cho đề thi này."}
            </Text>
            {record.courseId && courseMap.has(record.courseId) && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 mt-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-medium w-fit">
                <BookOpen size={10} className="text-gray-400" />
                {courseMap.get(record.courseId)}
              </span>
            )}
          </Space>
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "timeLimitMinutes",
      key: "timeLimitMinutes",
      render: (min: number) => (
        <span className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
          <Clock size={14} className="text-gray-400" />
          {min} phút
        </span>
      ),
    },
    {
      title: "Điểm đạt",
      dataIndex: "passingScorePercentage",
      key: "passingScorePercentage",
      render: (pct: number) => {
        const colorClass = pct >= 80 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-blue-600 bg-blue-50 border-blue-100";
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
            {pct}%
          </span>
        );
      },
    },
    {
      title: "Số câu hỏi",
      key: "questionCount",
      render: (_: any, record: IQuiz) => (
        <span className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
          <FileQuestion size={14} className="text-gray-400" />
          {record.questions?.length || 0} câu
        </span>
      ),
    },
    {
      title: "Kiểu",
      dataIndex: "isFinal",
      key: "isFinal",
      render: (isFinal: boolean) =>
        isFinal ? (
          <Tag color="purple" className="rounded-full px-3 py-0.5 font-medium border-purple-200">
            Cuối khóa
          </Tag>
        ) : (
          <Tag color="blue" className="rounded-full px-3 py-0.5 font-medium border-blue-200">
            Bài học
          </Tag>
        ),
    },
    {
      title: "Liên kết bài học",
      key: "linkedStatus",
      render: (_: any, record: IQuiz) => {
        const isLinked = !!record.lessonId;
        return isLinked ? (
          <Tag
            icon={<CheckCircle2 size={12} className="inline mr-1 text-emerald-500" />}
            color="success"
            className="rounded-full px-2.5 py-0.5 font-medium border-emerald-200 text-emerald-700 bg-emerald-50/50"
          >
            Đã liên kết
          </Tag>
        ) : (
          <Tag
            icon={<AlertCircle size={12} className="inline mr-1 text-amber-500" />}
            color="warning"
            className="rounded-full px-2.5 py-0.5 font-medium border-amber-200 text-amber-700 bg-amber-50/50"
          >
            Chưa liên kết
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: IQuiz) => (
        <Space size="small">
          <Tooltip title="Xem trước đề thi">
            <Button
              type="text"
              icon={<Eye size={15} className="text-gray-500 group-hover:text-emerald-600 transition-colors" />}
              className="hover:bg-emerald-50 rounded-lg h-9 w-9 flex items-center justify-center border border-transparent hover:border-emerald-100 group transition-all"
              onClick={() => handlePreviewQuiz(record)}
            />
          </Tooltip>

          <Tooltip title="Chỉnh sửa đề thi">
            <Button
              type="text"
              icon={<Edit2 size={15} className="text-gray-500 group-hover:text-blue-600 transition-colors" />}
              className="hover:bg-blue-50 rounded-lg h-9 w-9 flex items-center justify-center border border-transparent hover:border-blue-100 group transition-all"
              onClick={() => navigate(pathRoutes.instructor.assessmentBuilder.replace(":quizId?", record.id))}
            />
          </Tooltip>

          <Tooltip title={record.lessonId ? "Không thể xóa đề thi đã liên kết bài học" : "Xóa đề thi"}>
            <CPopconfirm
              title="Bạn chắc chắn muốn xóa đề thi này khỏi ngân hàng đề?"
              description="Hành động này không thể khôi phục."
              onConfirm={() => handleDelete(record.id)}
              disabled={!!record.lessonId}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, className: "bg-red-500 hover:bg-red-600 border-0" }}
            >
              <Button
                type="text"
                danger
                icon={<Trash2 size={15} />}
                disabled={!!record.lessonId}
                className="hover:bg-red-50 disabled:hover:bg-transparent rounded-lg h-9 w-9 flex items-center justify-center border border-transparent disabled:opacity-30 disabled:border-transparent transition-all"
              />
            </CPopconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ngân hàng đề thi"
        subtitle="Quản lý thư viện đề thi trắc nghiệm phục vụ bài giảng"
        showBackButton={false}
        showCreateButton={true}
        createButtonText="Tạo đề thi mới"
        onCreateClick={() => navigate(pathRoutes.instructor.assessmentBuilder.replace("/:quizId?", ""))}
      />

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Tổng số đề thi"
          value={totalCount}
          icon={<FileText size={22} />}
          color="blue"
          loading={isLoading}
        />
        <StatsCard
          title="Đã liên kết bài học"
          value={linkedCount}
          icon={<CheckCircle2 size={22} />}
          color="emerald"
          loading={isLoading}
        />
        <StatsCard
          title="Chưa liên kết bài"
          value={unlinkedCount}
          icon={<AlertCircle size={22} />}
          color="amber"
          loading={isLoading}
        />
        <StatsCard
          title="Thời gian thi TB"
          value={`${avgTimeLimit} phút`}
          icon={<Clock size={22} />}
          color="indigo"
          loading={isLoading}
        />
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl border border-gray-100/80 shadow-sm p-4 bg-white">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm theo tiêu đề hoặc mô tả..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              prefix={<Search size={16} className="text-gray-400 mr-1.5" />}
              allowClear
              className="h-10 rounded-xl border-gray-200 hover:border-gray-300 focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Khóa học:</span>
              <Select
                value={filterCourseId}
                onChange={setFilterCourseId}
                options={courses.map((c) => ({ value: c.id, label: c.name }))}
                placeholder="Chọn khóa học"
                className="h-10 w-48"
                popupClassName="rounded-lg"
                showSearch
                optionFilterProp="label"
                allowClear
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Kiểu:</span>
              <Select
                value={filterType}
                onChange={setFilterType}
                options={[
                  { value: "lesson", label: "Bài học" },
                  { value: "final", label: "Cuối khóa" },
                ]}
                placeholder="Chọn kiểu đề"
                className="h-10 w-36"
                popupClassName="rounded-lg"
                allowClear
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Liên kết:</span>
              <Select
                value={filterLinkStatus}
                onChange={setFilterLinkStatus}
                options={[
                  { value: "linked", label: "Đã liên kết" },
                  { value: "unlinked", label: "Chưa liên kết" },
                ]}
                placeholder="Chọn liên kết"
                className="h-10 w-36"
                popupClassName="rounded-lg"
                allowClear
              />
            </div>

            </div>
          </div>
        </Card>

      {/* Main Table Card */}
      <Card className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white">
        <Table
          columns={columns}
          dataSource={filteredQuizzes}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            className: "px-6 pb-2",
          }}
          rowClassName="hover:bg-slate-50/50 transition-colors"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm">Không tìm thấy đề thi nào phù hợp.</p>
                    {hasActiveFilters && (
                      <Button
                        type="link"
                        size="small"
                        onClick={handleResetFilters}
                        className="mt-2 text-primary font-medium"
                      >
                        Xóa toàn bộ bộ lọc
                      </Button>
                    )}
                  </div>
                }
              />
            ),
          }}
        />
      </Card>

      <QuizReviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedQuiz(null);
        }}
        quiz={selectedQuiz}
        mode="instructor"
      />
    </div>
  );
};

export default InstructorAssessments;
