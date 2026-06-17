import React from "react";
import type { ILesson } from "@/type";

interface LessonMetadataProps {
  currentLessonIndex: number;
  currentLesson: ILesson | null;
}

export const LessonMetadata: React.FC<LessonMetadataProps> = ({
  currentLessonIndex,
  currentLesson,
}) => {
  return (
    <div className="flex-1 min-w-0">
      <span className="text-[11px] font-extrabold text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full inline-block mb-3">
        Bài học {currentLessonIndex + 1}
      </span>
      <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight leading-tight">
        {currentLesson?.name}
      </h1>
      <p className="text-[12px] text-slate-400 font-medium mt-2">
        Cập nhật lần cuối:{" "}
        {new Date(currentLesson?.updatedAt || "").toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </p>
    </div>
  );
};

export default LessonMetadata;
