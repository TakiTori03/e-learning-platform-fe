import { useMemo, useCallback, useEffect } from "react";
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

const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

/**
 * 🎥 Adaptive Video Player View
 * - Employs a clean YouTube iframe for preview videos (enables fast clicks, zero lag, original controls).
 * - Uses UnifiedVideoJsPlayer for core secure HLS streams (prevents skipping, records exact progress).
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

  const youtubeId = useMemo(() => {
    if (!isYoutube || !lesson.content) return null;
    return getYoutubeId(lesson.content);
  }, [isYoutube, lesson.content]);

  // Tự động hoàn thành bài học video YouTube (preview) sau 5 giây học thử
  useEffect(() => {
    if (isYoutube && !lesson.isDone) {
      const timer = setTimeout(() => {
        onComplete(lesson.id);
      }, 5000); // 5 giây
      return () => clearTimeout(timer);
    }
  }, [isYoutube, lesson.id, lesson.isDone, onComplete]);

  const initialTime = useMemo(() => {
    const saved = localStorage.getItem(`last_time_${lesson.courseId}_${lesson.id}`);
    return saved ? parseFloat(saved) : 0;
  }, [lesson.courseId, lesson.id]);

  const handleProgress = useCallback(
    (state: { played: number; playedSeconds: number }) => {
      if (state.played >= 0.9) {
        localStorage.setItem(
          `last_time_${lesson.courseId}_${lesson.id}`,
          "0"
        );
      } else {
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

  // 1. YouTube Preview Video Layout: Render directly with clean iframe for fast load & interaction
  if (isYoutube && youtubeId) {
    return (
      <div className="bg-black w-full aspect-video overflow-hidden relative rounded-xl border border-slate-800 shadow-2xl transition-all duration-300 ease-in-out hover:border-slate-700 group">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
          title={lesson.name}
          className="w-full h-full border-none"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // 2. Secured Course HLS Video Layout: Play via secure UnifiedVideoJsPlayer
  return (
    <div className="bg-black w-full aspect-video overflow-hidden relative rounded-xl border border-slate-800 shadow-2xl transition-all duration-300 ease-in-out hover:border-slate-700 group">
      <UnifiedVideoJsPlayer
        ref={setPlayerRef}
        src={lesson.content}
        type="application/x-mpegURL"
        playing={shouldAutoplay}
        initialTime={initialTime}
        subtitleUrl={lesson.urlTranscript || lesson.transcriptUrl} 
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
            message: "Không thể kết nối luồng phát video HLS",
          })
        }
      />
    </div>
  );
};

export default VideoPlayerView;
