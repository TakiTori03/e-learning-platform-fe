import { Collapse } from "antd";
import {
  CheckCircleFilled,
  PlayCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useLearningStore } from "../store/useLearningStore";
import { memo } from "react";
import type { ILesson, ISection } from "@/type";
import { LessonType } from "@/constants/enums";
import { For, Show } from "@/components/UI/Template";

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
    default:
      return <PlayCircleOutlined className={activeClass} />;
  }
};

const getLessonMeta = (lesson: ILesson) => {
  const videoLengthInSeconds = Math.round(lesson.videoLength || 0);
  switch (lesson.type) {
    case LessonType.VIDEO:
      return (
        <span className="flex items-center gap-1">
          <span>
            {Math.floor(videoLengthInSeconds / 60)}:
            {(videoLengthInSeconds % 60).toString().padStart(2, "0")}
          </span>
        </span>
      );
    case LessonType.DOCUMENT:
      return <span>Tài liệu</span>;
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
                  <div className="flex-shrink-0">
                    <Show>
                      <Show.When isTrue={isDone}>
                        <CheckCircleFilled className="text-emerald-500 text-sm" />
                      </Show.When>
                      <Show.Else>
                        {getLessonIcon(lesson.type, isActive)}
                      </Show.Else>
                    </Show>
                  </div>
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
                  {/* Removed misleading LockOutlined icon for enrolled students */}
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
          defaultActiveKey={sections[0]?.id}
          className="learning-collapse"
          items={collapseItems}
        />
      </div>
    </div>
  );
};

export default memo(LearningSyllabus);
