import React, { memo } from "react";
import { Progress } from "antd";

interface LearningProgressProps {
  progressPercent: number;
}

const LearningProgress: React.FC<LearningProgressProps> = ({ progressPercent }) => {
  const roundedPercent = Math.round(progressPercent);

  return (
    <div className="flex items-center gap-3 text-slate-300">
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider leading-none mb-1">
          Tiến độ học tập
        </span>
        <span className="text-[11px] font-bold text-slate-300 leading-none">
          {roundedPercent}% hoàn thành
        </span>
      </div>
      <Progress
        type="circle"
        percent={roundedPercent}
        size={32}
        strokeColor={{
          "0%": "#2272eb",
          "100%": "#10b981",
        }}
        trailColor="#334155"
        format={(percent) => (
          <span className="text-[9px] font-extrabold text-slate-200">{percent}%</span>
        )}
      />
    </div>
  );
};

export default memo(LearningProgress);
