import React from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import CButton from "@/components/UI/Button";

interface LessonControlsProps {
  hasPathPrev: boolean;
  hasPathNext: boolean;
  goToPrevLesson: () => void;
  goToNextLesson: () => void;
}

export const LessonControls: React.FC<LessonControlsProps> = ({
  hasPathPrev,
  hasPathNext,
  goToPrevLesson,
  goToNextLesson,
}) => {
  return (
    <div className="flex w-full sm:w-auto justify-between sm:justify-start gap-2.5 shrink-0 self-start md:self-center">
      <CButton
        size="large"
        icon={<LeftOutlined className="text-xs" />}
        disabled={!hasPathPrev}
        onClick={goToPrevLesson}
        className="flex-1 sm:flex-initial rounded-full font-semibold border-slate-200 text-slate-600 hover:text-primary hover:border-primary flex items-center justify-center text-[10px] tracking-wider"
      >
        BÀI TRƯỚC
      </CButton>
      <CButton
        type="primary"
        size="large"
        disabled={!hasPathNext}
        onClick={goToNextLesson}
        className="flex-1 sm:flex-initial rounded-full bg-primary hover:scale-[1.02] border-none font-bold text-[10px] tracking-wider shadow-md shadow-primary/10 flex items-center justify-center gap-1.5 transition-all text-white"
      >
        BÀI TIẾP THEO <RightOutlined className="text-xs" />
      </CButton>
    </div>
  );
};

export default LessonControls;
