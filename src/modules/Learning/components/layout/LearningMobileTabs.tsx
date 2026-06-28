import React, { useCallback } from "react";
import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import { useLearningTabs } from "./useLearningTabs";
import type { ILesson, ISection } from "@/type";

interface LearningMobileTabsProps {
  courseId: string;
  progressPercent: number;
  sections: ISection[];
  lessons: ILesson[];
  currentLessonId?: string;
  currentLesson?: ILesson | null;
  handleLessonSelect: (lesson: ILesson) => void;
  isMobile: boolean;
}

const LearningMobileTabs: React.FC<LearningMobileTabsProps> = ({
  courseId,
  progressPercent,
  sections,
  lessons,
  currentLessonId,
  currentLesson,
  handleLessonSelect,
  isMobile,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "syllabus";
  const setActiveTab = useCallback((tab: string) => {
    setSearchParams((prev) => {
      prev.set("tab", tab);
      return prev;
    }, { replace: true });
  }, [setSearchParams]);
  const tabItems = useLearningTabs(
    courseId,
    progressPercent,
    sections,
    lessons,
    currentLessonId,
    currentLesson,
    handleLessonSelect,
    true, // isMobile = true for mobile tabs
    activeTab
  );

  if (!isMobile) return null;

  return (
    <div className="block lg:hidden mt-8 border-t border-slate-200/80 pt-6 px-6 pb-8 md:px-10 max-w-[960px] mx-auto w-full">
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        className="learning-mobile-tabs"
        items={tabItems}
      />
    </div>
  );
};

export default LearningMobileTabs;
