import { memo } from "react";
import { Row, Col, Typography } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { For } from "@/components/UI/Template";

const { Title, Text } = Typography;

interface CourseWillLearnProps {
  willLearns?: string[];
}

export const CourseWillLearn = ({ willLearns = [] }: CourseWillLearnProps) => {
  if (!willLearns || willLearns.length === 0) return null;

  return (
    <div className="border border-gray-100 rounded-xl p-10 mb-12 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-gray-100">
      <Title
        level={3}
        className="mb-10 !text-2xl font-black tracking-tight uppercase"
      >
        Bạn sẽ học được gì?
      </Title>
      <Row gutter={[32, 24]}>
        <For
          array={willLearns}
          render={(item, idx) => (
            <Col xs={24} md={12} key={idx} className="flex gap-4">
              <CheckCircleOutlined className="text-green-500 mt-1 flex-shrink-0 text-lg" />
              <Text className="text-[#2d2f31] font-medium leading-relaxed italic">
                {item}
              </Text>
            </Col>
          )}
        />
      </Row>
    </div>
  );
};

export default memo(CourseWillLearn);
