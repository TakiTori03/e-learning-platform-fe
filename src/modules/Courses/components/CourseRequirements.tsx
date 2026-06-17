import { memo } from "react";
import { Typography } from "antd";
import { For } from "@/components/UI/Template";

const { Title, Text } = Typography;

interface CourseRequirementsProps {
  requirements?: string[];
}

export const CourseRequirements = ({ requirements = [] }: CourseRequirementsProps) => {
  if (!requirements || requirements.length === 0) return null;

  return (
    <div className="mb-16 px-4">
      <Title
        level={3}
        className="mb-8 !text-2xl font-black tracking-tight uppercase"
      >
        Yêu cầu
      </Title>
      <ul className="list-none p-0 m-0 space-y-4">
        <For
          array={requirements}
          render={(req, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2.5 flex-shrink-0" />
              <Text className="text-[#2d2f31] text-base font-medium opacity-80 leading-relaxed italic">
                {req}
              </Text>
            </li>
          )}
        />
      </ul>
    </div>
  );
};

export default memo(CourseRequirements);
