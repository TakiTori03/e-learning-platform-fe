import React from "react";
import { Typography, Progress } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import CButton from "@/components/UI/Button";
import CModal from "@/components/UI/Modal";

const { Title, Text } = Typography;

interface CelebrationModalProps {
  open: boolean;
  onCancel: () => void;
  courseName?: string;
  onNavigateToCourse: () => void;
  onGetCertificate: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  open,
  onCancel,
  courseName,
  onNavigateToCourse,
  onGetCertificate,
}) => {
  return (
    <CModal
      open={open}
      onCancel={onCancel}
      footer={[
        <CButton
          key="back"
          onClick={onNavigateToCourse}
          className="rounded-lg font-medium"
        >
          Quay về khóa học
        </CButton>,
        <CButton
          key="cert"
          type="primary"
          icon={<TrophyOutlined />}
          onClick={onGetCertificate}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-none font-bold shadow-md shadow-orange-500/20 rounded-lg text-white"
        >
          Nhận chứng chỉ
        </CButton>,
      ]}
      centered
      width={450}
    >
      <div className="text-center py-6">
        <div className="text-6xl mb-4 animate-bounce">🎓</div>
        <Title level={3} className="!mb-2 !font-extrabold text-slate-800">
          Tuyệt vời!
        </Title>
        <Text className="text-sm text-slate-500 block mb-6 font-medium">
          Bạn đã hoàn thành xuất sắc 100% lộ trình của khóa học <br />
          <strong className="text-slate-700">{courseName}</strong>
        </Text>
        <div className="flex justify-center relative">
          <Progress
            type="circle"
            percent={100}
            strokeColor={{
              "0%": "#10b981",
              "100%": "#059669",
            }}
            size={110}
          />
        </div>
      </div>
    </CModal>
  );
};

export default CelebrationModal;
