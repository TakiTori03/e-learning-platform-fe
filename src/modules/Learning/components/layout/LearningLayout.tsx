import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import { useParams } from "react-router-dom";
import LearningHeader from "./LearningHeader";
import LearningSider from "./LearningSider";
import LearningMobileTabs from "./LearningMobileTabs";
import type { ILesson, ISection } from "@/type";

const { Content } = Layout;

interface LearningLayoutProps {
  children?: React.ReactNode;
  courseName: string;
  progressPercent: number;
  sections: ISection[];
  lessons: ILesson[];
  currentLessonId?: string;
  handleLessonSelect: (lesson: ILesson) => void;
}

const LearningLayout: React.FC<LearningLayoutProps> = ({
  children,
  courseName,
  progressPercent,
  sections,
  lessons,
  currentLessonId,
  handleLessonSelect,
}) => {
  const { courseId } = useParams<{ courseId: string }>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleMediaChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    
    handleMediaChange(mediaQuery);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaChange);
      return () => mediaQuery.removeEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
      return () => mediaQuery.removeListener(handleMediaChange);
    }
  }, []);

  return (
    <Layout className="h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Dynamic inline styles to inject clean layout variables & tab design overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .learning-sidebar-tabs {
          display: flex;
          flex-direction: column;
          height: 100% !important;
        }
        .learning-sidebar-tabs .ant-tabs-nav {
          margin: 0 !important;
          background-color: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        .learning-sidebar-tabs .ant-tabs-nav-wrap {
          padding: 0 12px;
        }
        .learning-sidebar-tabs .ant-tabs-tab {
          padding: 14px 4px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          color: #64748b !important;
        }
        .learning-sidebar-tabs .ant-tabs-tab-active {
          color: var(--ant-color-primary, #2272eb) !important;
        }
        .learning-sidebar-tabs .ant-tabs-ink-bar {
          background: var(--ant-color-primary, #2272eb) !important;
          height: 3px !important;
          border-radius: 3px 3px 0 0;
        }
        .learning-sidebar-tabs .ant-tabs-content-holder {
          flex: 1 !important;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background-color: #ffffff;
        }
        .learning-sidebar-tabs .ant-tabs-content {
          height: 100% !important;
          display: flex;
          flex-direction: column;
        }
        .learning-sidebar-tabs .ant-tabs-tabpane-active {
          height: 100% !important;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Mobile inline tabs styling */
        .learning-mobile-tabs .ant-tabs-nav {
          margin: 0 0 16px 0 !important;
          background-color: transparent;
          border-bottom: 1px solid #f1f5f9;
        }
        .learning-mobile-tabs .ant-tabs-tab {
          padding: 10px 4px !important;
          font-size: 13px !important;
          font-weight: 600 !important;
          color: #64748b !important;
        }
        .learning-mobile-tabs .ant-tabs-tab-active {
          color: var(--ant-color-primary, #2272eb) !important;
        }
        .learning-mobile-tabs .ant-tabs-ink-bar {
          background: var(--ant-color-primary, #2272eb) !important;
          height: 3px !important;
          border-radius: 3px 3px 0 0;
        }

        /* Modern premium scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 9999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      ` }} />

      <LearningHeader
        courseId={courseId || ""}
        courseName={courseName}
        progressPercent={progressPercent}
      />

      <Layout className="flex-1 overflow-hidden relative">
        <Content className="flex flex-col bg-slate-50 overflow-y-auto custom-scrollbar h-full">
          {children}

          <LearningMobileTabs
            courseId={courseId || ""}
            progressPercent={progressPercent}
            sections={sections}
            lessons={lessons}
            currentLessonId={currentLessonId}
            handleLessonSelect={handleLessonSelect}
            isMobile={isMobile}
          />
        </Content>

        <LearningSider
          courseId={courseId || ""}
          progressPercent={progressPercent}
          sections={sections}
          lessons={lessons}
          currentLessonId={currentLessonId}
          handleLessonSelect={handleLessonSelect}
          isMobile={isMobile}
        />
      </Layout>
    </Layout>
  );
};

export default LearningLayout;
