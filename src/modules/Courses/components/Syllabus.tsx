import { Collapse, Typography, Space } from "antd";
import {
  PlayCircleOutlined,
  LockOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { AnyElement, ISection } from "@/type";
import { LessonType } from "@/constants/enums";
import { For } from "@/components/UI/Template";
import { useLessons } from "../queryHooks/useCourseQueries";

import { memo } from "react";

const { Text } = Typography;

interface SectionItemProps {
  section: ISection;
}

const SectionItem = memo(({ section }: SectionItemProps) => {
  const { data: lessonsData, isLoading } = useLessons(section.id);

  const lessons = lessonsData || [];

  if (isLoading) {
    return (
      <div className="p-4 text-center text-gray-400 animate-pulse">
        Đang tải bài học...
      </div>
    );
  }

  return (
    <div className="flex flex-col select-none">
      <For
        array={lessons}
        render={(lesson: AnyElement) => {
          const videoLengthInSeconds = Math.round(lesson.videoLength || 0);
          return (
            <div
              key={lesson.id}
              className="px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center w-full border-none"
            >
              <Space size="middle">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                  {lesson.type === LessonType.VIDEO ? (
                    <PlayCircleOutlined className="text-blue-500" />
                  ) : (
                    <FileTextOutlined className="text-blue-500" />
                  )}
                </div>
                <Text className="font-medium">{lesson.name}</Text>
              </Space>
              <Space size="large">
                {lesson.videoLength > 0 && (
                  <Text type="secondary" className="text-sm font-mono">
                    {Math.floor(videoLengthInSeconds / 60)}:
                    {(videoLengthInSeconds % 60).toString().padStart(2, "0")}
                  </Text>
                )}
                <LockOutlined className="text-gray-300" />
              </Space>
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
}

const Syllabus = ({ sections }: SyllabusProps) => {
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
          {section.numOfLessons || 0} bài học
        </Text>
      </div>
    ),
    className: "border-b last:border-b-0",
    children: <SectionItem section={section} />,
  }));

  return (
    <div className="syllabus-container">
      <Collapse
        className="bg-white rounded-xl overflow-hidden border-gray-200 shadow-sm"
        expandIconPlacement="end"
        ghost={false}
        expandIcon={({ isActive }) => (
          <PlayCircleOutlined
            style={{
              transform: `rotate(${isActive ? 90 : 0}deg)`,
              transition: "0.3s",
            }}
            className="text-gray-400"
          />
        )}
        items={collapseItems}
      />
    </div>
  );
};

export default memo(Syllabus);
