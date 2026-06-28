import React from "react";
import { Layout, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CButton from "@/components/UI/Button";
import LearningProgress from "./LearningProgress";

const { Header } = Layout;
const { Title } = Typography;

interface LearningHeaderProps {
  courseId: string;
  courseName: string;
  progressPercent: number;
}

const LearningHeader: React.FC<LearningHeaderProps> = ({
  courseId,
  courseName,
  progressPercent,
}) => {
  const navigate = useNavigate();

  return (
    <Header className="bg-slate-900 px-6 h-14 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800/80 shadow-sm relative shrink-0">
      {/* Sleek thin progress bar at the very bottom of the header */}
      <div 
        className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-primary to-blue transition-all duration-500 ease-out" 
        style={{ width: `${progressPercent}%` }} 
        id="header-progress-bar"
      />
      
      {/* Left section: Back button & Title */}
      <div className="flex items-center gap-3">
        <CButton
          type="text"
          icon={<ArrowLeftOutlined className="text-slate-300 hover:text-white" />}
          onClick={() => navigate(`/courses/${courseId}`)}
          className="hover:bg-slate-800/80 rounded-full flex items-center justify-center w-9 h-9 border-none shadow-none"
        />
        <span className="h-4 w-[1px] bg-slate-800 block" />
        <Title level={5} className="!text-slate-100 !m-0 font-bold line-clamp-1 max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-xl text-[14px]">
          {courseName}
        </Title>
      </div>

      {/* Right section: Progress Indicator */}
      <LearningProgress progressPercent={progressPercent} />
    </Header>
  );
};

export default LearningHeader;
