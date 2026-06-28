import {
  App,
  Card,
  Col,
  Collapse,
  Divider,
  Drawer,
  Form,
  Progress,
  Radio,
  Row,
  Space,
  Tooltip,
  Typography
} from "antd";
import {
  ArrowDown,
  ArrowUp,
  Edit2,
  ExternalLink,
  Eye,
  FileEdit,
  FileText,
  HelpCircle,
  Play,
  PlayCircle,
  Plus,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// UI Wrappers & Template Components
import CButton from "@/components/UI/Button";
import CInput from "@/components/UI/Input";
import CModal from "@/components/UI/Modal";
import PageHeader from "@/components/UI/PageHeader";
import CSelect from "@/components/UI/Select";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { For, Show } from "@/components/UI/Template";
import CTextArea from "@/components/UI/TextArea";
import VideoPlayerModal from "../components/VideoPlayerModal";
import CPopconfirm from "@/components/UI/Popconfirm";

// Constants & Types
import {
  LessonType,
  LessonTypeLabels
} from "@/constants/enums";
import type { ILessonRequest } from "../services/lessonApi";

// Hooks
import { mediaApi } from "@/core/http/mediaApi";
import { useInstructorQuizzes } from "@/modules/Management/AssessmentManagement/queryHooks/useQuizHooks";
import {
  useCourseCurriculum,
  useCreateLesson,
  useCreateSection,
  useDeleteLesson,
  useDeleteSection,
  useReorderLessons,
  useReorderSections,
  useUpdateLesson,
  useUpdateSection,
} from "../queryHooks";

const { Title, Text, Paragraph } = Typography;

export const InstructorCurriculumEdit: React.FC = () => {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { message: antdMessage } = App.useApp();

  // Queries
  const { data, isLoading } = useCourseCurriculum(courseId);
  const course = data?.course;
  const sections = data?.sections || [];

  // Mutations
  const createSectionMutation = useCreateSection(courseId);
  const updateSectionMutation = useUpdateSection(courseId);
  const deleteSectionMutation = useDeleteSection(courseId);
  const reorderSectionsMutation = useReorderSections(courseId);

  const createLessonMutation = useCreateLesson(courseId);
  const updateLessonMutation = useUpdateLesson(courseId);
  const deleteLessonMutation = useDeleteLesson(courseId);
  const reorderLessonsMutation = useReorderLessons(courseId);

  // Fetch quizzes for selector
  const { data: quizzesData, isLoading: isQuizzesLoading } = useInstructorQuizzes();
  const quizzesList = quizzesData?.content || [];

  // Section Modal state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [sectionForm] = Form.useForm();

  // Lesson Drawer state
  const [isLessonDrawerOpen, setIsLessonDrawerOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const [lessonForm] = Form.useForm();

  const quizOptions = useMemo(() => {
    return quizzesList
      .filter((q) => {
        // Exclude final exam quizzes (isFinal === true) from regular lessons
        if (q.isFinal) return false;
        // If the quiz is not linked to any lesson (lessonId is null/undefined), show it
        if (!q.lessonId) return true;
        // If it's the quiz currently linked to the lesson being edited, show it
        if (editingLesson && editingLesson.type === "QUIZ" && editingLesson.content === q.id) {
          return true;
        }
        return false;
      })
      .map((q) => ({ label: q.title, value: q.id }));
  }, [quizzesList, editingLesson]);

  // Lesson content / media upload state
  const [lessonType, setLessonType] = useState<string>("VIDEO");
  const [videoSource, setVideoSource] = useState<string>("youtube");
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploadedMediaId, setUploadedMediaId] = useState<string>("");
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");

  // Preview Modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{ url: string; title: string; transcriptUrl?: string } | null>(null);

  // ======================== SECTION HANDLERS ========================
  const handleOpenCreateSection = () => {
    setEditingSection(null);
    sectionForm.resetFields();
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (section: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid collapse toggle
    setEditingSection(section);
    sectionForm.setFieldsValue({
      name: section.name,
      description: section.description,
    });
    setIsSectionModalOpen(true);
  };

  const handleSectionFormSubmit = (values: any) => {
    if (editingSection) {
      updateSectionMutation.mutate(
        { id: editingSection.id, body: { ...values, courseId } },
        { onSuccess: () => setIsSectionModalOpen(false) }
      );
    } else {
      createSectionMutation.mutate(
        { ...values, courseId, position: sections.length + 1 },
        { onSuccess: () => setIsSectionModalOpen(false) }
      );
    }
  };

  const handleMoveSection = (index: number, direction: "up" | "down", e: React.MouseEvent) => {
    e.stopPropagation();
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    reorderSectionsMutation.mutate(newSections.map((s) => s.id));
  };

  // ======================== LESSON HANDLERS ========================
  const handleOpenCreateLesson = (sectionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSectionId(sectionId);
    setEditingLesson(null);
    setLessonType("VIDEO");
    setVideoSource("youtube");
    setUploadedMediaId("");
    setUploadedVideoUrl("");
    setUploadPercent(0);
    lessonForm.resetFields();
    setIsLessonDrawerOpen(true);
  };

  const handleOpenEditLesson = (lesson: any, sectionId: string) => {
    setActiveSectionId(sectionId);
    setEditingLesson(lesson);

    // UI groups YOUTUBE under VIDEO
    const isYoutube = lesson.type === LessonType.VIDEO && (lesson.content && (lesson.content.includes("youtube.com") || lesson.content?.includes("youtu.be")));
    setLessonType(lesson.type);
    setVideoSource(isYoutube ? "youtube" : "upload");
    setUploadedVideoUrl(isYoutube ? "" : lesson.content || "");
    setUploadedMediaId(lesson.mediaId || "");

    lessonForm.setFieldsValue({
      name: lesson.name,
      description: lesson.description,
      type: lesson.type,
      content: lesson.content,
    });
    setIsLessonDrawerOpen(true);
  };

  const handleLessonTypeChange = (e: any) => {
    setLessonType(e.target.value);
  };

  // Handle File Upload (Video vs PDF)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (lessonType === LessonType.VIDEO && !file.type.startsWith("video/")) {
      antdMessage.error("Chỉ hỗ trợ upload các tệp tin Video.");
      return;
    }

    if (lessonType === LessonType.DOCUMENT && file.type !== "application/pdf") {
      antdMessage.error("Chỉ hỗ trợ upload tệp tin PDF.");
      return;
    }

    try {
      setUploading(true);
      setUploadPercent(0);

      if (lessonType === LessonType.VIDEO) {
        antdMessage.info("Đang khởi tạo đường truyền tải lên trực tiếp...");
        const { uploadUrl, mediaId } = await mediaApi.requestPresignedUrl(
          file.name,
          file.type
        );

        await mediaApi.uploadToPresignedUrl(uploadUrl, file, (percent) => {
          setUploadPercent(percent);
        });

        setUploadedMediaId(mediaId);
        setUploadedVideoUrl("");
        lessonForm.setFieldsValue({ content: "" });
        antdMessage.success("Đã tải lên video thành công!");
      } else if (lessonType === LessonType.DOCUMENT) {
        antdMessage.info("Đang tải lên tài liệu PDF...");
        const response = await mediaApi.uploadDocument(file);

        setUploadedMediaId(response.id);
        setUploadedVideoUrl("");
        lessonForm.setFieldsValue({ content: "" });
        antdMessage.success("Đã tải lên tài liệu thành công!");
      }

    } catch (err: any) {
      antdMessage.error("Tải tệp tin lên thất bại: " + (err.message || "Lỗi đường truyền."));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = async () => {
    if (uploadedMediaId) {
      if (!editingLesson || editingLesson.mediaId !== uploadedMediaId) {
        try {
          await mediaApi.deleteMedia(uploadedMediaId);
        } catch (e) {
          console.error("Lỗi xóa file mồ côi:", e);
        }
      }
    }
    setUploadedMediaId("");
    setUploadedVideoUrl("");
    lessonForm.setFieldsValue({ content: "" });
  };

  const handleQuickAction = (lesson: any) => {
    if (lesson.type === LessonType.VIDEO) {
      if (lesson.content) {
        setPreviewData({
          url: lesson.content,
          title: lesson.name,
          transcriptUrl: lesson.transcriptUrl
        });
        setIsPreviewModalOpen(true);
      } else {
        antdMessage.warning("Video bài giảng đang được xử lý hoặc chưa được tải lên.");
      }
    } else if (lesson.type === LessonType.DOCUMENT) {
      if (lesson.content) {
        window.open(lesson.content, "_blank");
      } else {
        antdMessage.warning("Tài liệu bài giảng đang được xử lý hoặc chưa được tải lên.");
      }
    } else {
      navigate(`/author/courses/${courseId}/builder/${lesson.id}`);
    }
  };

  const handleLessonFormSubmit = async (values: any) => {
    if (lessonType === LessonType.VIDEO && videoSource === "upload") {
      if (!uploadedMediaId && !uploadedVideoUrl) {
        antdMessage.error("Vui lòng tải lên video bài giảng trước khi lưu!");
        return;
      }
    }
    if (lessonType === LessonType.DOCUMENT) {
      if (!uploadedMediaId && !uploadedVideoUrl) {
        antdMessage.error("Vui lòng tải lên tài liệu PDF trước khi lưu!");
        return;
      }
    }

    let finalContent = values.content || "";
    if (lessonType === LessonType.VIDEO && videoSource === "upload") {
      finalContent = (editingLesson && !uploadedMediaId) ? editingLesson.content : "";
    } else if (lessonType === LessonType.DOCUMENT) {
      finalContent = (editingLesson && !uploadedMediaId) ? editingLesson.content : "";
    } else if (lessonType === LessonType.QUIZ || lessonType === LessonType.ASSIGNMENT) {
      finalContent = values.content || "";
    }

    let currentPosition = editingLesson?.position;
    if (!editingLesson) {
      const currentSection = sections.find(s => s.id === activeSectionId);
      currentPosition = currentSection ? currentSection.lessons.length + 1 : 1;
    }

    const payload: ILessonRequest = {
      name: values.name,
      description: values.description || "",
      type: lessonType,
      content: finalContent,
      position: currentPosition,
      sectionId: activeSectionId,
      courseId,
    };

    if (editingLesson) {
      updateLessonMutation.mutate(
        { id: editingLesson.id, body: payload },
        {
          onSuccess: async () => {
            if (uploadedMediaId && (lessonType === "VIDEO" || lessonType === "DOCUMENT")) {
              try {
                await mediaApi.linkMediaToLesson(uploadedMediaId, editingLesson.id, courseId);
              } catch (e) {
                console.error("Binding media fail", e);
              }
            }
            setIsLessonDrawerOpen(false);
          },
        }
      );
    } else {
      createLessonMutation.mutate(
        payload,
        {
          onSuccess: async (newLesson: any) => {
            if (uploadedMediaId && newLesson?.id && (lessonType === "VIDEO" || lessonType === "DOCUMENT")) {
              try {
                await mediaApi.linkMediaToLesson(uploadedMediaId, newLesson.id, courseId);
              } catch (e) {
                console.error("Binding media fail", e);
              }
            }
            setIsLessonDrawerOpen(false);
          },
        }
      );
    }
  };

  const handleMoveLesson = (
    _sectionId: string,
    lessons: any[],
    index: number,
    direction: "up" | "down"
  ) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === lessons.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const newLessons = [...lessons];
    const temp = newLessons[index];
    newLessons[index] = newLessons[targetIndex];
    newLessons[targetIndex] = temp;

    reorderLessonsMutation.mutate(newLessons.map((l) => l.id));
  };

  const handleDeleteLesson = (lessonId: string, _sectionId: string) => {
    deleteLessonMutation.mutate(lessonId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Xây dựng giáo trình"
        subtitle={course?.name || "Đang tải dữ liệu khóa học..."}
        showBackButton={true}
        onBackClick={() => navigate("/author/courses")}
        showCreateButton={true}
        createButtonText="Thêm chương học mới"
        onCreateClick={handleOpenCreateSection}
      />

      <Show>
        <Show.When isTrue={isLoading}>
          <Card loading={true} className="rounded-xl border border-gray-100" />
        </Show.When>
        <Show.Else>
          <Row gutter={[24, 24]}>
            {/* Left panel: Course summary stats */}
            <Col xs={24} lg={8}>
              <Card className="rounded-xl border border-gray-100 shadow-sm sticky top-6">
                <div className="space-y-4">
                  <div className="h-44 overflow-hidden rounded-lg">
                    <img
                      src={course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80"}
                      className="w-full h-full object-cover"
                      alt={course?.name}
                    />
                  </div>
                  <div>
                    <Title level={5} className="!m-0 text-gray-800 font-bold leading-snug">
                      {course?.name}
                    </Title>
                    <Text className="text-gray-400 text-xs block mt-1 line-clamp-2">
                      {course?.subTitle}
                    </Text>
                  </div>
                  <Divider className="my-2" />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        Tổng chương học
                      </Text>
                      <Title level={3} className="!m-0 text-gray-800 font-bold mt-1">
                        {sections.length}
                      </Title>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <Text type="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                        Tổng bài học
                      </Text>
                      <Title level={3} className="!m-0 text-gray-800 font-bold mt-1">
                        {sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)}
                      </Title>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>

            {/* Right panel: Chapters & Lessons builder */}
            <Col xs={24} lg={16} className="space-y-4">
              <Show>
                <Show.When isTrue={sections.length === 0}>
                  <Card className="rounded-xl border border-gray-100 py-16 text-center shadow-sm">
                    <Paragraph className="text-gray-400 mb-4">
                      Khóa học này chưa có chương học nào. Hãy khởi tạo chương học đầu tiên!
                    </Paragraph>
                    <CButton
                      type="primary"
                      icon={<Plus className="w-4 h-4 mr-1.5" />}
                      onClick={handleOpenCreateSection}
                      style={{
                        height: "40px",
                        borderRadius: "8px",
                        backgroundColor: "#2563eb",
                        color: "#ffffff",
                        border: "none",
                        fontWeight: 600,
                      }}
                    >
                      Tạo chương học đầu tiên
                    </CButton>
                  </Card>
                </Show.When>
                <Show.Else>
                  <Collapse
                    accordion
                    expandIconPlacement="start"
                    className="bg-transparent border-0 space-y-4"
                    items={sections.map((sec, secIdx) => {
                      const lessonList = sec.lessons || [];
                      return {
                        key: sec.id,
                        className: "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                        label: (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 select-none gap-3">
                            <div className="min-w-0 flex-1">
                              <Text strong className="text-gray-800 text-sm block truncate">
                                {sec.name}
                              </Text>
                              <Text type="secondary" className="text-xs font-normal block truncate mt-0.5">
                                {sec.description || "Không có mô tả chương."}
                              </Text>
                            </div>
                            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                              <Tooltip title="Lên">
                                <CButton
                                  size="small"
                                  type="text"
                                  icon={<ArrowUp className="w-4 h-4 text-gray-400" />}
                                  disabled={secIdx === 0}
                                  onClick={(e) => handleMoveSection(secIdx, "up", e)}
                                  className="rounded-lg hover:bg-gray-100 hidden sm:inline-flex"
                                />
                              </Tooltip>
                              <Tooltip title="Xuống">
                                <CButton
                                  size="small"
                                  type="text"
                                  icon={<ArrowDown className="w-4 h-4 text-gray-400" />}
                                  disabled={secIdx === sections.length - 1}
                                  onClick={(e) => handleMoveSection(secIdx, "down", e)}
                                  className="rounded-lg hover:bg-gray-100 hidden sm:inline-flex"
                                />
                              </Tooltip>

                              <div className="w-[1px] h-4 bg-gray-200 mx-1 hidden sm:block"></div>

                              <CButton
                                size="small"
                                type="text"
                                icon={<Plus className="w-4 h-4 text-blue-600 mr-1" />}
                                onClick={(e) => handleOpenCreateLesson(sec.id, e)}
                                className="rounded-lg hover:bg-blue-50 px-2"
                              >
                                <span className="text-[12px] font-semibold text-blue-600 hidden sm:inline">Thêm bài học</span>
                              </CButton>

                              <Tooltip title="Sửa chương">
                                <CButton
                                  size="small"
                                  type="text"
                                  icon={<Edit2 className="w-4 h-4 text-gray-500" />}
                                  onClick={(e) => handleOpenEditSection(sec, e)}
                                  className="rounded-lg hover:bg-gray-100"
                                />
                              </Tooltip>

                              <CPopconfirm
                                title="Xóa chương này?"
                                description="Hành động này sẽ xóa toàn bộ bài học bên trong chương."
                                onConfirm={() => deleteSectionMutation.mutate(sec.id)}
                                okText="Xóa"
                                cancelText="Hủy"
                                okButtonProps={{ danger: true }}
                              >
                                <CButton
                                  size="small"
                                  type="text"
                                  danger
                                  icon={<Trash2 className="w-4 h-4" />}
                                  onClick={(e) => e.stopPropagation()}
                                  className="rounded-lg hover:bg-red-50"
                                />
                              </CPopconfirm>
                            </div>
                          </div>
                        ),
                        children: (
                          <div className="space-y-3 pt-1">
                            <Show>
                              <Show.When isTrue={lessonList.length === 0}>
                                <div className="text-center py-6 text-gray-400 text-xs border border-dashed border-gray-100 rounded-lg">
                                  Chưa có bài học nào trong chương này.
                                </div>
                              </Show.When>
                              <Show.Else>
                                <For
                                  array={lessonList}
                                  render={(les, lesIdx) => (
                                    <div
                                      key={les.id}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-xl transition-all shadow-sm hover:shadow gap-3 sm:gap-4 mb-2"
                                    >
                                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                        <div className="shrink-0 mt-0.5 sm:mt-0">
                                          <Show>
                                            <Show.When isTrue={les.type === "VIDEO"}>
                                              <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                <Video className="w-4 h-4 text-indigo-500" />
                                              </div>
                                            </Show.When>
                                            <Show.When isTrue={les.type === "DOCUMENT"}>
                                              <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                                <FileText className="w-4 h-4 text-emerald-500" />
                                              </div>
                                            </Show.When>
                                            <Show.When isTrue={les.type === "QUIZ"}>
                                              <div className="w-9 h-9 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                                                <HelpCircle className="w-4 h-4 text-purple-500" />
                                              </div>
                                            </Show.When>
                                            <Show.Else>
                                              <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                                                <FileEdit className="w-4 h-4 text-orange-500" />
                                              </div>
                                            </Show.Else>
                                          </Show>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <Text strong className="text-gray-800 text-sm block truncate">
                                            {les.name}
                                          </Text>
                                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                            <CTag type={TypeTagEnum.DRAFT} className="text-[10px] border-0 px-2 py-0 h-5 flex items-center bg-gray-100 text-gray-600 rounded font-medium">
                                              {les.type}
                                            </CTag>

                                            {les.videoLength > 0 && (
                                              <Text type="secondary" className="text-[11px] flex items-center gap-1">
                                                <PlayCircle className="w-3.5 h-3.5 text-gray-400" /> {Math.floor(les.videoLength / 60)}:{Math.floor(les.videoLength % 60).toString().padStart(2, "0")}
                                              </Text>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-1 shrink-0 border-t sm:border-0 border-gray-100 pt-2 sm:pt-0">
                                        {(les.content || les.type === "QUIZ" || les.type === "ASSIGNMENT") && (
                                          <Tooltip title={les.type === "VIDEO" ? "Phát Video" : les.type === "DOCUMENT" ? "Đọc Tài liệu" : "Quản lý bài tập/thi"}>
                                            <CButton
                                              size="small"
                                              type="text"
                                              icon={
                                                les.type === "VIDEO" ? <Play className="w-4 h-4 text-indigo-500" /> :
                                                les.type === "DOCUMENT" ? <Eye className="w-4 h-4 text-emerald-500" /> :
                                                <ExternalLink className="w-4 h-4 text-orange-500" />
                                              }
                                              onClick={() => handleQuickAction(les)}
                                              className="rounded-lg hover:bg-gray-100 flex items-center justify-center"
                                            />
                                          </Tooltip>
                                        )}
                                        <Tooltip title="Sửa bài học">
                                          <CButton
                                            size="small"
                                            type="text"
                                            icon={<Edit2 className="w-4 h-4 text-gray-500" />}
                                            onClick={() => handleOpenEditLesson(les, sec.id)}
                                            className="rounded-lg hover:bg-gray-100 flex items-center justify-center"
                                          />
                                        </Tooltip>
                                        <CPopconfirm
                                          title="Xóa bài học này?"
                                          onConfirm={() => handleDeleteLesson(les.id, sec.id)}
                                          okText="Xóa"
                                          cancelText="Hủy"
                                          okButtonProps={{ danger: true }}
                                        >
                                          <CButton
                                            size="small"
                                            type="text"
                                            danger
                                            icon={<Trash2 className="w-4 h-4" />}
                                            className="rounded-lg hover:bg-red-50 flex items-center justify-center"
                                          />
                                        </CPopconfirm>

                                        <div className="w-[1px] h-4 bg-gray-200 mx-1 hidden sm:block"></div>

                                        <Tooltip title="Di chuyển lên">
                                          <CButton
                                            size="small"
                                            type="text"
                                            icon={<ArrowUp className="w-4 h-4 text-gray-400" />}
                                            disabled={lesIdx === 0}
                                            onClick={() => handleMoveLesson(sec.id, lessonList, lesIdx, "up")}
                                            className="rounded-lg hover:bg-gray-100 flex items-center justify-center"
                                          />
                                        </Tooltip>
                                        <Tooltip title="Di chuyển xuống">
                                          <CButton
                                            size="small"
                                            type="text"
                                            icon={<ArrowDown className="w-4 h-4 text-gray-400" />}
                                            disabled={lesIdx === lessonList.length - 1}
                                            onClick={() => handleMoveLesson(sec.id, lessonList, lesIdx, "down")}
                                            className="rounded-lg hover:bg-gray-100 flex items-center justify-center"
                                          />
                                        </Tooltip>
                                      </div>
                                    </div>
                                  )}
                                />
                              </Show.Else>
                            </Show>
                          </div>
                        )
                      };
                    })}
                  />
                </Show.Else>
              </Show>
            </Col>
          </Row>
        </Show.Else>
      </Show>

      {/* Section Create/Edit Modal */}
      <CModal
        title={editingSection ? "Chỉnh sửa chương học" : "Tạo chương học mới"}
        open={isSectionModalOpen}
        onCancel={() => setIsSectionModalOpen(false)}
        footer={null}
        forceRender
        className="rounded-2xl overflow-hidden"
      >
        <Form form={sectionForm} layout="vertical" onFinish={handleSectionFormSubmit} className="pt-3">
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Tên chương học</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên chương" }]}
          >
            <CInput id="sectionName" placeholder="Ví dụ: Chương 1: Cơ bản về React..." className="rounded-lg h-10" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700">Mô tả chương (Tùy chọn)</span>}
          >
            <CTextArea id="sectionDescription" placeholder="Tóm tắt kiến thức của chương học này..." rows={3} className="rounded-lg" />
          </Form.Item>



          <Form.Item className="mb-0 text-right">
            <Space>
              <CButton onClick={() => setIsSectionModalOpen(false)} className="rounded-lg">Hủy</CButton>
              <CButton
                type="primary"
                htmlType="submit"
                style={{
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  padding: "0 16px",
                }}
              >
                Xác nhận
              </CButton>
            </Space>
          </Form.Item>
        </Form>
      </CModal>

      {/* Lesson Create/Edit Drawer */}
      <Drawer
        title={editingLesson ? "Chỉnh sửa bài học" : "Tạo bài học mới"}
        width={560}
        onClose={() => setIsLessonDrawerOpen(false)}
        open={isLessonDrawerOpen}
        styles={{ body: { paddingBottom: 80 } }}
        footer={
          <div className="text-right">
            <Space>
              <CButton onClick={() => setIsLessonDrawerOpen(false)}>Hủy</CButton>
              <CButton
                type="primary"
                onClick={() => lessonForm.submit()}
                loading={uploading}
                style={{
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  fontWeight: 600,
                  padding: "0 24px",
                }}
              >
                Xác nhận
              </CButton>
            </Space>
          </div>
        }
      >
        <Form form={lessonForm} layout="vertical" onFinish={handleLessonFormSubmit}>
          <Form.Item
            name="name"
            label={<span className="font-semibold text-gray-700">Tên bài học</span>}
            rules={[{ required: true, message: "Vui lòng nhập tên bài học" }]}
          >
            <CInput id="lessonName" placeholder="Ví dụ: Giới thiệu khóa học..." className="rounded-lg h-10" />
          </Form.Item>

          <Form.Item
            name="description"
            label={<span className="font-semibold text-gray-700">Mô tả chi tiết</span>}
          >
            <CTextArea id="lessonDescription" placeholder="Mô tả nội dung bài học..." rows={3} className="rounded-lg" />
          </Form.Item>

          <Form.Item
            name="type"
            label={<span className="font-semibold text-gray-700">Loại bài học</span>}
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={handleLessonTypeChange} disabled={editingLesson !== null}>
              <For
                array={Object.values(LessonType)}
                render={(type) => (
                  <Radio key={type} value={type}>
                    {LessonTypeLabels[type]}
                  </Radio>
                )}
              />
            </Radio.Group>
          </Form.Item>



          <Show>
            <Show.When isTrue={lessonType === "VIDEO"}>
              <Card className="bg-gray-50 border border-gray-155 rounded-xl mb-4">
                <Form.Item label={<span className="font-semibold text-gray-700">Nguồn Video</span>} required>
                  <Radio.Group value={videoSource} onChange={(e) => setVideoSource(e.target.value)}>
                    <Radio value="youtube">Mã nhúng YouTube</Radio>
                    <Radio value="upload">Tải tệp tin trực tiếp</Radio>
                  </Radio.Group>
                </Form.Item>

                <Show>
                  <Show.When isTrue={videoSource === "youtube"}>
                    <Form.Item
                      name="content"
                      label={<span className="font-semibold text-gray-700">URL Youtube hoặc Mã nhúng</span>}
                      rules={[{ required: true, message: "Vui lòng nhập link Youtube" }]}
                    >
                      <CInput id="youtubeContent" placeholder="https://www.youtube.com/watch?v=..." className="rounded-lg h-10" />
                    </Form.Item>
                  </Show.When>
                  <Show.Else>
                    <div className="space-y-3">
                      <span className="font-semibold text-xs text-gray-600 block">Tải video bài giảng lên hệ thống</span>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          id="video-uploader"
                          accept="video/*"
                          onChange={handleFileUpload}
                          style={{ display: "none" }}
                        />
                        <Show>
                          <Show.When isTrue={!(uploadedMediaId || uploadedVideoUrl) && !uploading}>
                            <CButton
                              icon={<Plus className="w-4 h-4 mr-1.5" />}
                              onClick={() => document.getElementById("video-uploader")?.click()}
                              className="rounded-lg h-10 border-dashed"
                            >
                              Chọn file video
                            </CButton>
                          </Show.When>
                          <Show.When isTrue={!!(uploadedMediaId || uploadedVideoUrl) && !uploading}>
                            <div className="flex items-center gap-3">
                              <span className="text-green-500 font-semibold text-xs flex items-center gap-1">
                                ✓ Đã tải lên file video
                              </span>
                              <CButton
                                size="small"
                                type="text"
                                danger
                                onClick={handleRemoveMedia}
                              >
                                Xóa file
                              </CButton>
                            </div>
                          </Show.When>
                        </Show>
                      </div>

                      {uploading && (
                        <div className="mt-2">
                          <Progress percent={uploadPercent} status="active" />
                          <span className="text-[10px] text-gray-400 block mt-1">Đang truyền file trực tiếp đến Cloud Storage...</span>
                        </div>
                      )}

                      {editingLesson && (uploadedMediaId || uploadedVideoUrl) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <span className="font-semibold text-xs text-gray-600 block mb-1.5">Link liên kết (URL Video hệ thống)</span>
                          <CInput id="videoUrlDisabled" value={uploadedMediaId || uploadedVideoUrl} disabled className="rounded-lg h-10 bg-gray-50 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </Show.Else>
                </Show>
              </Card>
            </Show.When>

            <Show.When isTrue={lessonType === LessonType.DOCUMENT}>
              <Card className="bg-gray-50 border border-gray-155 rounded-xl mb-4">
                <div className="space-y-3">
                  <span className="font-semibold text-xs text-gray-600 block">Tải tài liệu (PDF) lên hệ thống</span>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="doc-uploader"
                      accept="application/pdf"
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <Show>
                      <Show.When isTrue={!(uploadedMediaId || uploadedVideoUrl) && !uploading}>
                        <CButton
                          icon={<Upload className="w-4 h-4 mr-1.5" />}
                          onClick={() => document.getElementById("doc-uploader")?.click()}
                          className="rounded-lg h-10 border-dashed"
                        >
                          Chọn file PDF
                        </CButton>
                      </Show.When>
                      <Show.When isTrue={!!(uploadedMediaId || uploadedVideoUrl) && !uploading}>
                        <div className="flex items-center gap-3">
                          <span className="text-green-500 font-semibold text-xs flex items-center gap-1">
                            ✓ Đã tải lên file tài liệu
                          </span>
                          <CButton
                            size="small"
                            type="text"
                            danger
                            onClick={handleRemoveMedia}
                          >
                            Xóa file
                          </CButton>
                        </div>
                      </Show.When>
                    </Show>
                  </div>

                  {uploading && (
                    <div className="mt-2">
                      <Progress percent={uploadPercent} status="active" />
                      <span className="text-[10px] text-gray-400 block mt-1">Đang truyền file trực tiếp đến Cloud Storage...</span>
                    </div>
                  )}

                  {editingLesson && (uploadedMediaId || uploadedVideoUrl) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <span className="font-semibold text-xs text-gray-600 block mb-1.5">Link liên kết (URL Tài liệu hệ thống)</span>
                      <CInput id="docUrlDisabled" value={uploadedMediaId || uploadedVideoUrl} disabled className="rounded-lg h-10 bg-gray-50 text-gray-500" />
                    </div>
                  )}
                </div>
              </Card>
            </Show.When>

            <Show.When isTrue={lessonType === LessonType.QUIZ}>
              <Form.Item
                name="content"
                label={<span className="font-semibold text-gray-700">Liên kết Đề thi từ Ngân hàng</span>}
                rules={[{ required: true, message: "Vui lòng chọn đề thi!" }]}
              >
                <CSelect
                  id="quizSelect"
                  placeholder="Chọn đề thi..."
                  options={quizOptions}
                  loading={isQuizzesLoading}
                  className="rounded-lg h-10"
                  showSearch
                />
              </Form.Item>
            </Show.When>

            <Show.When isTrue={lessonType === LessonType.ASSIGNMENT}>
              <Show.When isTrue={!!editingLesson}>
                <Form.Item
                  name="content"
                  label={<span className="font-semibold text-gray-700">Link liên kết (ID hệ thống)</span>}
                >
                  <CInput id="quizIdDisabled" disabled placeholder="Chưa có dữ liệu liên kết" className="rounded-lg h-10 bg-gray-50 text-gray-500" />
                </Form.Item>
              </Show.When>
            </Show.When>
          </Show>
        </Form>
      </Drawer>

      {/* Quick Action Preview Modal */}
      <VideoPlayerModal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setTimeout(() => setPreviewData(null), 300);
        }}
        url={previewData?.url || ""}
        title={previewData?.title}
        transcriptUrl={previewData?.transcriptUrl}
      />
    </div>
  );
};

export default InstructorCurriculumEdit;
