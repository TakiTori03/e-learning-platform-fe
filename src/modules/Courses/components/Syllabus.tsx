import { Collapse, Typography, Space, Button } from "antd";
import {
  PlayCircleOutlined,
  LockOutlined,
  FileTextOutlined,
  RightOutlined,
  QuestionCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { AnyElement, ISection } from "@/type";
import { LessonType } from "@/constants/enums";
import { For } from "@/components/UI/Template";
import { formatDuration } from "@/utils/format";

import { memo, useState } from "react";
import VideoPlayerModal from "@/modules/Management/CourseManagement/components/VideoPlayerModal";

const { Text } = Typography;

import { useNavigate } from "react-router-dom";

const isYoutubeVideo = (lesson: AnyElement) => {
  if (lesson.type !== LessonType.VIDEO || !lesson.content) return false;
  const url = lesson.content;
  return url.includes("youtube.com") || url.includes("youtu.be");
};

interface SectionItemProps {
  section: ISection;
  isBought?: boolean;
  courseId?: string;
  onPreviewClick: (lesson: AnyElement) => void;
}

const SectionItem = memo(({ section, isBought, courseId, onPreviewClick }: SectionItemProps) => {
  const navigate = useNavigate();
  const lessons = section.lessons || [];

  return (
    <div className="flex flex-col select-none">
      <For
        array={lessons}
        render={(lesson: AnyElement) => {
          const videoLengthInSeconds = Math.round(lesson.videoLength || 0);
          const isPreview = isYoutubeVideo(lesson);
          const canClick = isBought || isPreview;
          return (
            <div
              key={lesson.id}
              style={{ paddingLeft: "20px", boxSizing: "border-box" }}
              className={`py-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center w-full border-b border-slate-100 last:border-none ${
                canClick ? "cursor-pointer hover:!bg-blue-50/40" : ""
              }`}
              onClick={() => {
                if (isBought && courseId) {
                  navigate(`/learning/${courseId}/${lesson.id}`);
                } else if (isPreview) {
                  onPreviewClick(lesson);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 flex-shrink-0">
                  {lesson.type === LessonType.VIDEO ? (
                    <PlayCircleOutlined className="text-blue-500" />
                  ) : lesson.type === LessonType.QUIZ ? (
                    <QuestionCircleOutlined className="text-blue-500" />
                  ) : lesson.type === LessonType.ASSIGNMENT ? (
                    <EditOutlined className="text-blue-500" />
                  ) : (
                    <FileTextOutlined className="text-blue-500" />
                  )}
                </div>
                <Text className="font-medium">{lesson.name}</Text>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0" style={{ marginRight: "24px" }}>
                {lesson.videoLength > 0 && (
                  <Text type="secondary" className="text-sm font-mono">
                    {formatDuration(videoLengthInSeconds)}
                  </Text>
                )}
                {isBought ? (
                  <PlayCircleOutlined className="text-blue-400" />
                ) : isPreview ? (
                  <span className="text-blue-600 bg-blue-50 border border-blue-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Xem thử
                  </span>
                ) : (
                  <LockOutlined className="text-gray-300" />
                )}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
});

SectionItem.displayName = "SectionItem";

interface SyllabusProps {
  sections: ISection[];
  isBought?: boolean;
  courseId?: string;
}

const Syllabus = ({ sections, isBought, courseId }: SyllabusProps) => {
  const [previewLesson, setPreviewLesson] = useState<AnyElement | null>(null);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);

  const handlePreviewClick = (lesson: AnyElement) => {
    setPreviewLesson(lesson);
  };

  const totalLessons = sections.reduce(
    (acc, section) => acc + (section.lessons?.length || 0),
    0
  );

  const isAllExpanded = activeKeys.length === sections.length && sections.length > 0;

  const handleToggleExpandAll = () => {
    if (isAllExpanded) {
      setActiveKeys([]);
    } else {
      setActiveKeys(sections.map((s) => s.id));
    }
  };

  const collapseItems = sections.map((section, index) => ({
    key: section.id,
    label: (
      <div className="flex justify-between items-center pr-4">
        <Space>
          <Text className="text-gray-400 font-mono">
            {(index + 1).toString().padStart(2, "0")}.
          </Text>
          <Text strong className="text-base">
            {section.name}
          </Text>
        </Space>
        <Text type="secondary" className="text-sm font-normal">
          {section.numOfLessons || section.lessons?.length || 0} bài học
        </Text>
      </div>
    ),
    className: "border-b last:border-b-0",
    children: (
      <SectionItem
        section={section}
        isBought={isBought}
        courseId={courseId}
        onPreviewClick={handlePreviewClick}
      />
    ),
  }));

  return (
    <div className="syllabus-container">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-800">{sections.length}</span> phần • <span className="font-semibold text-gray-800">{totalLessons}</span> bài học
        </div>
        <Button
          type="link"
          onClick={handleToggleExpandAll}
          className="!text-blue-600 hover:!text-blue-500 font-bold p-0 text-sm h-auto flex items-center"
        >
          {isAllExpanded ? "Thu gọn tất cả" : "Mở rộng tất cả"}
        </Button>
      </div>

      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(keys as string[])}
        className="bg-white rounded-xl overflow-hidden border-gray-200 shadow-sm"
        styles={{
          body: {
            padding: 0,
          },
        }}
        expandIconPlacement="end"
        ghost={false}
        expandIcon={({ isActive }) => (
          <RightOutlined
            style={{
              transform: `rotate(${isActive ? 90 : 0}deg)`,
              transition: "0.3s",
            }}
            className="text-gray-400"
          />
        )}
        items={collapseItems}
      />

      {previewLesson && (
        <VideoPlayerModal
          isOpen={!!previewLesson}
          onClose={() => setPreviewLesson(null)}
          url={previewLesson.content}
          title={previewLesson.name}
        />
      )}
    </div>
  );
};

export default memo(Syllabus);
