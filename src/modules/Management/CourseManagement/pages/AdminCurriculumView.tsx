import React, { useState } from "react";
import {
  Card,
  Typography,
  Collapse,
  Divider,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  Video,
  FileText,
  PlayCircle,
  Play,
  Eye,
  HelpCircle,
  FileEdit,
  ExternalLink,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

// UI Wrappers & Template Components
import CButton from "@/components/UI/Button";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import PageHeader from "@/components/UI/PageHeader";
import { Show, For } from "@/components/UI/Template";
import VideoPlayerModal from "../components/VideoPlayerModal";

// Query Hooks
import { useCourseCurriculum } from "../queryHooks";

const { Title, Text, Paragraph } = Typography;

export const AdminCurriculumView: React.FC = () => {
  const { courseId = "" } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Queries
  const { data, isLoading } = useCourseCurriculum(courseId);
  const course = data?.course;
  const sections = data?.sections || [];

  // Preview Modal state
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState<{ url: string; title: string; transcriptUrl?: string } | null>(null);

  const handleQuickAction = (lesson: any) => {
    if (lesson.type === "VIDEO") {
      if (lesson.content) {
        setPreviewData({
          url: lesson.content,
          title: lesson.name,
          transcriptUrl: lesson.transcriptUrl,
        });
        setIsPreviewModalOpen(true);
      }
    } else if (lesson.type === "DOCUMENT") {
      if (lesson.content) {
        window.open(lesson.content, "_blank");
      }
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kiểm duyệt giáo trình khóa học"
        subtitle="Chế độ xem (Read-only) dành cho Quản trị viên"
        showBackButton={true}
        onBackClick={() => navigate("/admin/courses")}
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

            {/* Right panel: Chapters & Lessons read-only view */}
            <Col xs={24} lg={16} className="space-y-4">
              <Show>
                <Show.When isTrue={sections.length === 0}>
                  <Card className="rounded-xl border border-gray-100 py-16 text-center shadow-sm">
                    <Paragraph className="text-gray-400 mb-0">
                      Khóa học này chưa có nội dung chương học nào.
                    </Paragraph>
                  </Card>
                </Show.When>
                <Show.Else>
                  <Collapse
                    accordion
                    expandIconPlacement="start"
                    className="bg-transparent border-0 space-y-4"
                    items={sections.map((sec) => {
                      const lessonList = sec.lessons || [];
                      return {
                        key: sec.id,
                        className: "bg-white border border-gray-150 rounded-xl overflow-hidden shadow-sm",
                        label: (
                          <div className="flex items-center justify-between w-full pr-4 select-none">
                            <div>
                              <Text strong className="text-gray-800 text-sm">
                                {sec.name}
                              </Text>
                              <br />
                              <Text type="secondary" className="text-[10px] font-normal">
                                {sec.description || "Không có mô tả chương."}
                              </Text>
                            </div>
                          </div>
                        ),
                        children: (
                          <div className="space-y-3 pt-1">
                            <Show>
                              <Show.When isTrue={lessonList.length === 0}>
                                <div className="text-center py-6 text-gray-400 text-xs border border-dashed border-gray-100 rounded-lg">
                                  Không có bài học nào trong chương này.
                                </div>
                              </Show.When>
                              <Show.Else>
                                <For
                                  array={lessonList}
                                  render={(les) => (
                                    <div
                                      key={les.id}
                                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-lg transition-all gap-3"
                                    >
                                      <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                        <div className="shrink-0 mt-0.5 sm:mt-0">
                                          <Show>
                                            <Show.When isTrue={les.type === "VIDEO"}>
                                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100">
                                                <Video className="w-3.5 h-3.5 text-indigo-500" />
                                              </div>
                                            </Show.When>
                                            <Show.When isTrue={les.type === "DOCUMENT"}>
                                              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                                                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                                              </div>
                                            </Show.When>
                                            <Show.When isTrue={les.type === "QUIZ"}>
                                              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center border border-purple-100">
                                                <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                                              </div>
                                            </Show.When>
                                            <Show.Else>
                                              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center border border-orange-100">
                                                <FileEdit className="w-3.5 h-3.5 text-orange-500" />
                                              </div>
                                            </Show.Else>
                                          </Show>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <Text strong className="text-gray-700 text-xs block truncate">
                                            {les.name}
                                          </Text>
                                          <div className="flex flex-wrap items-center gap-2 mt-1">
                                            <CTag type={TypeTagEnum.DRAFT} className="text-[9px] border-0 px-2 py-0 h-4 flex items-center bg-gray-200/60 rounded font-medium">
                                              {les.type}
                                            </CTag>

                                            {les.videoLength > 0 && (
                                              <Text type="secondary" className="text-[10px] flex items-center gap-1">
                                                <PlayCircle className="w-3 h-3 text-gray-400" /> {Math.floor(les.videoLength / 60)}:{Math.floor(les.videoLength % 60).toString().padStart(2, "0")}
                                              </Text>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center justify-end gap-1 shrink-0 border-t sm:border-0 border-gray-100 pt-2 sm:pt-0">
                                        {les.content && (
                                          <Tooltip title={les.type === "VIDEO" ? "Phát Video" : les.type === "DOCUMENT" ? "Đọc Tài liệu" : "Xem liên kết"}>
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
                                      </div>
                                    </div>
                                  )}
                                />
                              </Show.Else>
                            </Show>
                          </div>
                        ),
                      };
                    })}
                  />
                </Show.Else>
              </Show>
            </Col>
          </Row>
        </Show.Else>
      </Show>

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

export default AdminCurriculumView;
