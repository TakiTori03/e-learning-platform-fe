import React, { useState, useCallback, useEffect } from "react";
import { Layout, Tabs } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { useLearningTabs } from "./useLearningTabs";
import type { ILesson, ISection } from "@/type";

const { Sider } = Layout;

interface LearningSiderProps {
  courseId: string;
  progressPercent: number;
  sections: ISection[];
  lessons: ILesson[];
  currentLessonId?: string;
  handleLessonSelect: (lesson: ILesson) => void;
  isMobile: boolean;
}

const LearningSider: React.FC<LearningSiderProps> = ({
  courseId,
  progressPercent,
  sections,
  lessons,
  currentLessonId,
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
  const [collapsed, setCollapsed] = useState(false);
  const [width, setWidth] = useState(() => {
    const saved = localStorage.getItem("learning-sidebar-width");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 300 && parsed <= 800) {
        return parsed;
      }
    }
    return 380;
  });
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    localStorage.setItem("learning-sidebar-width", String(width));
  }, [width]);

  const resize = useCallback((mouseMoveEvent: MouseEvent) => {
    const newWidth = window.innerWidth - mouseMoveEvent.clientX;
    const maxAllowedWidth = Math.min(800, window.innerWidth * 0.7);
    if (newWidth >= 300 && newWidth <= maxAllowedWidth) {
      setWidth(newWidth);
    }
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const tabItems = useLearningTabs(
    courseId,
    progressPercent,
    sections,
    lessons,
    currentLessonId,
    handleLessonSelect,
    false, // isMobile = false for desktop Sider
    activeTab
  );

  return (
    <Sider
      width={width}
      collapsedWidth={0}
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="bg-white border-l border-slate-200/80 z-20 h-full relative hidden lg:block"
      theme="light"
      style={{
        transition: isResizing ? "none" : undefined,
      }}
    >
      {/* Resizer Handle */}
      {!collapsed && (
        <div
          onMouseDown={startResizing}
          className="absolute left-[-3px] top-0 bottom-0 w-[6px] cursor-col-resize z-30 group"
          title="Kéo để thay đổi kích thước"
        >
          <div
            className={`w-[1px] h-full mx-auto transition-all duration-200 ${
              isResizing
                ? "bg-blue-500 w-[3px]"
                : "bg-slate-200/50 group-hover:bg-blue-500 group-hover:w-[3px]"
            }`}
          />
        </div>
      )}

      {/* Pull Tab Handle for Collapse Drawer */}
      <div
        className="absolute left-[-12px] top-1/2 -translate-y-1/2 z-40 cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="w-6 h-12 bg-white hover:bg-slate-50 border border-slate-200 shadow-md rounded-full flex items-center justify-center transition-colors">
          {collapsed ? (
            <LeftOutlined className="text-[9px] text-slate-400" />
          ) : (
            <RightOutlined className="text-[9px] text-slate-400" />
          )}
        </div>
      </div>

      <div className="h-full flex flex-col">
        {!isMobile && (
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            className="h-full learning-sidebar-tabs flex-1"
            centered
            items={tabItems}
          />
        )}
      </div>
    </Sider>
  );
};

export default LearningSider;
