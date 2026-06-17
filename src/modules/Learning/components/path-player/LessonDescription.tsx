import React from "react";
import { Show } from "@/components/UI/Template";

interface LessonDescriptionProps {
  description?: string;
}

export const LessonDescription: React.FC<LessonDescriptionProps> = ({
  description,
}) => {
  return (
    <div className="mb-12">
      <h3 className="text-[14px] font-bold text-slate-800 mb-4 tracking-tight flex items-center gap-2">
        <span className="w-1 h-4 bg-primary rounded-full block" />
        Mô tả bài học
      </h3>
      <div className="text-sm text-slate-600 leading-relaxed max-w-none pl-3 border-l-2 border-slate-100 font-medium">
        <Show>
          <Show.When isTrue={!!description}>
            {description}
          </Show.When>
          <Show.Else>
            <span className="italic text-slate-400">
              Giảng viên chưa cập nhật mô tả chi tiết cho bài học này.
            </span>
          </Show.Else>
        </Show>
      </div>
    </div>
  );
};

export default LessonDescription;
