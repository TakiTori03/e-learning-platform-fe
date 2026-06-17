import React from "react";
import CButton from "@/components/UI/Button";
import { Show } from "@/components/UI/Template";

interface AutoplayOverlayProps {
  nextLessonCountdown: number | null;
  nextLessonName?: string;
  onCancel: () => void;
  onPlayNow: () => void;
}

export const AutoplayOverlay: React.FC<AutoplayOverlayProps> = ({
  nextLessonCountdown,
  nextLessonName,
  onCancel,
  onPlayNow,
}) => {
  return (
    <Show>
      <Show.When isTrue={nextLessonCountdown !== null}>
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-white p-6 animate-fadeIn">
          <div className="text-center space-y-4 max-w-sm">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <span className="relative text-lg font-extrabold text-blue-400 z-10">
                {nextLessonCountdown}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Bài học tiếp theo sắp bắt đầu
            </h3>
            <p className="text-xs text-slate-400">
              Bài tiếp theo:{" "}
              <strong className="text-slate-200">{nextLessonName}</strong>
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <CButton
                onClick={onCancel}
                className="rounded-lg bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
                id="btn-cancel-autoplay"
              >
                Hủy
              </CButton>
              <CButton
                type="primary"
                onClick={onPlayNow}
                className="rounded-lg bg-blue-600 border-none text-white font-bold"
                id="btn-play-autoplay-now"
              >
                Học ngay
              </CButton>
            </div>
          </div>
        </div>
      </Show.When>
    </Show>
  );
};

export default AutoplayOverlay;
