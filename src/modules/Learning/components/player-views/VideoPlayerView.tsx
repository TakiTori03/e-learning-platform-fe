import { useMemo, useCallback } from "react";
import { Alert, notification } from "antd";
import type { ILesson } from "@/type";
import { useLearningStore } from "../../store/useLearningStore";
import UnifiedVideoJsPlayer from "../UnifiedVideoJsPlayer";

interface VideoPlayerViewProps {
  lesson: ILesson;
  onComplete: (lessonId: string) => void;
  courseName?: string;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * 🎥 Adaptive Video Player View using Video.js
 * - Handles YouTube & HLS with a single consistent player core.
 * - Prevents skipping, tracks progress, and saves last watch time for resume.
 */
const VideoPlayerView = ({
  lesson,
  onComplete,
  courseName,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev,
}: VideoPlayerViewProps) => {
  const setPlayerRef = useLearningStore((state) => state.setPlayerRef);

  const isYoutube = useMemo(() => {
    if (!lesson.content) return false;
    return (
      lesson.content.includes("youtube.com") ||
      lesson.content.includes("youtu.be")
    );
  }, [lesson.content]);

  const initialTime = useMemo(() => {
    const saved = localStorage.getItem(`last_time_${lesson.courseId}_${lesson.id}`);
    return saved ? parseFloat(saved) : 0;
  }, [lesson.courseId, lesson.id]);

  const handleProgress = useCallback(
    (state: { played: number; playedSeconds: number }) => {
      // 1. If video progress is >= 90% (marked as completed), reset saved position to 0
      if (state.played >= 0.9) {
        localStorage.setItem(
          `last_time_${lesson.courseId}_${lesson.id}`,
          "0"
        );
      } else {
        // 2. Otherwise, save current position for resume playback
        localStorage.setItem(
          `last_time_${lesson.courseId}_${lesson.id}`,
          String(state.playedSeconds)
        );
      }
    },
    [lesson.courseId, lesson.id]
  );

  const handleComplete = useCallback(() => {
    localStorage.setItem(
      `last_time_${lesson.courseId}_${lesson.id}`,
      "0"
    );
    onComplete(lesson.id);
  }, [lesson.courseId, lesson.id, onComplete]);

  const shouldAutoplay = useMemo(() => {
    if (typeof window === "undefined" || !window.navigator) return false;
    const nav = window.navigator as { userActivation?: { hasBeenActive: boolean } };
    return !!nav.userActivation?.hasBeenActive;
  }, []);

  if (!lesson.content) {
    return (
      <div className="bg-slate-900 w-full aspect-video flex items-center justify-center text-white p-8 rounded-xl border border-slate-800">
        <Alert
          message="Không tìm thấy bài giảng"
          description="Video bài học hiện không khả dụng. Vui lòng liên hệ giáo viên phụ trách."
          type="error"
          showIcon
          className="max-w-md w-full shadow-lg border-red-200"
        />
      </div>
    );
  }

  return (
    <div className="bg-black w-full aspect-video overflow-hidden relative rounded-xl border border-slate-800 shadow-2xl transition-all duration-300 ease-in-out hover:border-slate-700 group">
      <UnifiedVideoJsPlayer
        ref={setPlayerRef}
        src={lesson.content}
        type={isYoutube ? "video/youtube" : "application/x-mpegURL"}
        playing={shouldAutoplay}
        initialTime={initialTime}
        subtitleUrl={isYoutube ? undefined : (lesson.urlTranscript || lesson.transcriptUrl)} 
        onProgress={handleProgress}
        onComplete={handleComplete}
        lessonName={lesson.name}
        courseName={courseName}
        onNextLesson={onNextLesson}
        onPrevLesson={onPrevLesson}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onError={() =>
          notification.error({
            message: `Không thể kết nối luồng phát video ${isYoutube ? "YouTube" : "HLS"}`,
          })
        }
      />
    </div>
  );
};

export default VideoPlayerView;
