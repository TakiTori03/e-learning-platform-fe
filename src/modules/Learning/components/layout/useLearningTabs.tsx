import { useMemo, useState } from "react";
import {
  QuestionCircleOutlined,
  ContainerOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import LearningSyllabus from "../LearningSyllabus";
import DiscussionList from "../discussion/DiscussionList";
import NoteList from "../note/NoteList";
import type { ILesson, ISection } from "@/type";

const LazyTabContent: React.FC<{
  activeKey: string;
  tabKey: string;
  children: React.ReactNode;
}> = ({ activeKey, tabKey, children }) => {
  const [hasRendered, setHasRendered] = useState(false);

  if (activeKey === tabKey && !hasRendered) {
    setHasRendered(true);
  }

  if (!hasRendered) return null;
  return <>{children}</>;
};

export const useLearningTabs = (
  courseId: string,
  progressPercent: number,
  sections: ISection[],
  lessons: ILesson[],
  currentLessonId: string | undefined,
  handleLessonSelect: (lesson: ILesson) => void,
  isMobile: boolean,
  activeTab: string
) => {
  return useMemo(() => [
    {
      key: "syllabus",
      label: (
        <span className="flex items-center gap-2">
          <UnorderedListOutlined />
          Nội dung học
        </span>
      ),
      children: (
        <LazyTabContent activeKey={activeTab} tabKey="syllabus">
          <div className={isMobile ? "" : "h-full"}>
            <LearningSyllabus
              sections={sections}
              lessons={lessons}
              progress={progressPercent}
              onLessonSelect={handleLessonSelect}
              isMobile={isMobile}
            />
          </div>
        </LazyTabContent>
      ),
    },
    {
      key: "discuss",
      label: (
        <span className="flex items-center gap-2">
          <QuestionCircleOutlined />
          Thảo luận
        </span>
      ),
      children: (
        <LazyTabContent activeKey={activeTab} tabKey="discuss">
          <div className={isMobile ? "p-4 bg-slate-50/10" : "h-full overflow-hidden bg-slate-50/10 flex flex-col"}>
            <DiscussionList
              lessonId={currentLessonId || ""}
              courseId={courseId}
            />
          </div>
        </LazyTabContent>
      ),
    },
    {
      key: "notes",
      label: (
        <span className="flex items-center gap-2">
          <ContainerOutlined />
          Ghi chú
        </span>
      ),
      children: (
        <LazyTabContent activeKey={activeTab} tabKey="notes">
          <div className={isMobile ? "" : "h-full overflow-y-auto custom-scrollbar"}>
            <NoteList
              courseId={courseId}
              lessonId={currentLessonId || ""}
            />
          </div>
        </LazyTabContent>
      ),
    },
  ], [sections, lessons, progressPercent, handleLessonSelect, currentLessonId, courseId, isMobile, activeTab]);
};
