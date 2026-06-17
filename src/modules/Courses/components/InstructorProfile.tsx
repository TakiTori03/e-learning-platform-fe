import { formatFullName } from "@/utils/format";
import { memo } from "react";
import { Avatar, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

interface InstructorProfileProps {
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    biography: string;
    headline?: string;
  };
}

export const InstructorProfile = ({ instructor }: InstructorProfileProps) => {
  if (!instructor) return null;

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Avatar
          size={120}
          src={instructor.avatar}
          icon={<UserOutlined />}
          className="shadow-md flex-shrink-0"
        />
        <div>
          <Title level={4} className="mb-1 text-blue-600">
            {formatFullName(instructor)}
          </Title>
          <Text type="secondary" className="block mb-4 font-medium">
            {instructor.headline || "Chuyên gia đào tạo kiến thức chuyên sâu"}
          </Text>
          <Paragraph className="text-gray-600 text-base leading-relaxed max-w-2xl">
            {instructor.biography ||
              "Giảng viên tâm huyết với nhiều năm kinh nghiệm trong lĩnh vực giảng dạy và thực chiến dự án."}
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default memo(InstructorProfile);
