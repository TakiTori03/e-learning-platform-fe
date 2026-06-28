import { For } from "@/components/UI/Template";
import { LessonType } from "@/constants/enums";
import type { ILesson, ISection } from "@/type";
import {
  CheckCircleFilled,
  EditOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { Collapse } from "antd";
import { memo, useState, useEffect, useMemo } from "react";
import { useLearningStore } from "../store/useLearningStore";
import { formatDuration } from "@/utils/format";

interface LearningSyllabusProps {
  sections: ISection[];
  lessons: ILesson[];
  progress: number;
  onLessonSelect: (lesson: ILesson) => void;
  isMobile?: boolean;
}

const getLessonIcon = (type: LessonType | string, isActive: boolean) => {
  const activeClass = isActive ? "text-primary text-sm" : "text-slate-400 text-sm";
  switch (type) {
    case LessonType.VIDEO:
      return <PlayCircleOutlined className={activeClass} />;
    case LessonType.DOCUMENT:
      return <FileTextOutlined className={activeClass} />;
    case LessonType.QUIZ:
      return <QuestionCircleOutlined className={activeClass} />;
    case LessonType.ASSIGNMENT:
      return <EditOutlined className={activeClass} />;
    default:
      return <PlayCircleOutlined className={activeClass} />;
  }
};

const getLessonMeta = (lesson: ILesson) => {
  const isYoutube = !!(
    lesson.content &&
    (lesson.content.includes("youtube.com") || lesson.content.includes("youtu.be"))
  );
  if (isYoutube) {
    return (
      <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider border border-blue-100/60 select-none">
        Preview
      </span>
    );
  }

  const videoLengthInSeconds = Math.round(lesson.videoLength || 0);
  switch (lesson.type) {
    case LessonType.VIDEO:
      return (
        <span className="flex items-center gap-1 font-mono">
          <span>{formatDuration(videoLengthInSeconds)}</span>
        </span>
      );
    case LessonType.DOCUMENT:
      return <span>Tài liệu</span>;
    case LessonType.QUIZ:
      return <span>Trắc nghiệm</span>;
    case LessonType.ASSIGNMENT:
      return <span>Bài tập</span>;
    default:
      return null;
  }
};

const LearningSyllabus = ({
  sections,
  lessons,
  progress,
  onLessonSelect,
  isMobile = false,
}: LearningSyllabusProps) => {
  const currentLesson = useLearningStore((state) => state.currentLesson);
  const lessonsDoneIds = useLearningStore((state) => state.lessonsDoneIds);

  // Tìm sectionId của bài học hiện tại
  const currentLessonSectionId = useMemo(() => {
    if (!currentLesson) return null;
    const found = lessons.find((l) => l.id === currentLesson.id);
    return found?.sectionId || currentLesson.sectionId || null;
  }, [currentLesson, lessons]);

  // Quản lý các sections đang mở
  const [activeKeys, setActiveKeys] = useState<string[]>(() => {
    return sections[0] ? [sections[0].id] : [];
  });

  // Tự động mở rộng section chứa bài học hiện tại khi vào trang hoặc chuyển bài
  useEffect(() => {
    if (currentLessonSectionId) {
      setActiveKeys((prev) => {
        if (prev.includes(currentLessonSectionId)) return prev;
        return [...prev, currentLessonSectionId];
      });
    }
  }, [currentLessonSectionId]);

  const getLessonsBySection = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section?.lessons) return section.lessons;
    return lessons.filter((l) => l.sectionId === sectionId);
  };

  const collapseItems = sections.map((section, idx) => {
    const sectionLessons = getLessonsBySection(section.id);
    const sectionDoneCount = sectionLessons.filter((l) =>
      lessonsDoneIds.includes(l.id)
    ).length;

    return {
      key: section.id,
      label: (
        <div className="flex flex-col py-0.5">
          <span className="text-sm font-bold text-slate-700 line-clamp-1">
            Phần {idx + 1}: {section.name}
          </span>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5">
            {sectionDoneCount}/{sectionLessons.length} bài học hoàn thành
          </span>
        </div>
      ),
      className: "border-b border-slate-100 bg-white hover:bg-slate-50/20 transition-colors",
      children: (
        <div className="flex flex-col select-none bg-slate-50/30">
          <For
            array={sectionLessons}
            render={(lesson) => {
              const isDone = lessonsDoneIds.includes(lesson.id);
              const isActive = currentLesson?.id === lesson.id;

              return (
                <div
                  key={lesson.id}
                  className={`flex items-center gap-3.5 w-full px-5 py-3.5 cursor-pointer border-b border-slate-100/50 transition-all hover:bg-primary/5 ${
                    isActive
                      ? "bg-primary/10 border-l-4 border-l-primary !pl-4"
                      : ""
                  }`}
                  onClick={() => onLessonSelect(lesson)}
                >
                  {/* Left: Lesson type icon is ALWAYS shown */}
                  <div className="flex-shrink-0 flex items-center justify-center w-5">
                    {getLessonIcon(lesson.type, isActive)}
                  </div>

                  {/* Center: Lesson details */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={`block truncate text-xs font-semibold ${
                        isActive ? "text-primary" : "text-slate-600"
                      }`}
                    >
                      {lesson.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-medium">
                      {getLessonMeta(lesson)}
                    </div>
                  </div>

                  {/* Right: Completed checkmark icon */}
                  {isDone && (
                    <div className="flex-shrink-0 ml-2">
                      <CheckCircleFilled className="text-emerald-500 text-[13px]" />
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>
      ),
    };
  });

  return (
    <div className={`flex flex-col bg-white ${isMobile ? "" : "h-full"}`}>
      {/* Premium Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/30">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Nội dung học
          </h3>
          <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
            Đã hoàn thành {lessonsDoneIds.length}/{lessons.length} bài học
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-full border border-emerald-100 shadow-sm shrink-0">
          <CheckCircleFilled className="text-emerald-500 text-xs" />
          <span className="text-[11px] font-bold text-emerald-700 leading-none">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Accordion list */}
      <div className={isMobile ? "w-full" : "flex-1 overflow-y-auto custom-scrollbar"}>
        <Collapse
          ghost
          expandIconPlacement="end"
          activeKey={activeKeys}
          onChange={(keys) => setActiveKeys(keys as string[])}
          className="learning-collapse"
          items={collapseItems}
        />
      </div>
    </div>
  );
};

export default memo(LearningSyllabus);
