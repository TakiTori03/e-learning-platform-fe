import LoadingLazy from "@/components/UI/LoadingLazy";
import { Show } from "@/components/UI/Template";
import { message } from "antd";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LearningLayout from "../components/layout/LearningLayout";
import { LessonType } from "@/constants/enums";
import {
  AutoplayOverlay,
  CelebrationModal,
  LessonControls,
  LessonDescription,
  LessonMetadata,
} from "../components/path-player";
import PlayerScreen from "../components/PlayerScreen";
import { useLearning } from "../queryHooks";

export const PathPlayerPage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();

  const {
    isLoading,
    course,
    currentLesson,
    handleLessonSelect,
    handleLessonComplete,
    goToNextLesson,
    goToPrevLesson,
    currentLessonIndex,
    lessons,
    progressPercent,
    doneCount,
    hasPathNext,
    hasPathPrev,
  } = useLearning(courseId || "", lessonId);

  const [nextLessonCountdown, setNextLessonCountdown] = useState<number | null>(null);
  const [isAutoplayCancelled, setIsAutoplayCancelled] = useState(false);

  // 🏷️ Dynamic Browser Tab Title
  useEffect(() => {
    if (currentLesson?.name && course?.name) {
      document.title = `${currentLesson.name} - ${course.name} | E-Learning`;
    }
    return () => {
      document.title = "E-Learning";
    };
  }, [currentLesson?.name, course?.name]);

  // ⌨️ Keyboard Navigation (← →) - Optimized with useRef to prevent event listener churn
  const navRef = useRef({ goToNextLesson, goToPrevLesson, hasPathNext, hasPathPrev });
  useEffect(() => {
    navRef.current = { goToNextLesson, goToPrevLesson, hasPathNext, hasPathPrev };
  }, [goToNextLesson, goToPrevLesson, hasPathNext, hasPathPrev]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // Only allow Shift + N and Shift + P in fullscreen mode
      const isFullscreen = !!document.fullscreenElement ||
                           !!(document as any).webkitFullscreenElement ||
                           !!(document as any).mozFullScreenElement ||
                           !!(document as any).msFullscreenElement;
      if (!isFullscreen) return;

      const { goToNextLesson: goNext, goToPrevLesson: goPrev, hasPathNext: next, hasPathPrev: prev } = navRef.current;
      if (e.shiftKey && (e.key === "N" || e.key === "n") && next) {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.setItem("pending_fullscreen", "true");
        message.loading({ content: "Đang chuyển sang bài học tiếp theo...", key: "lesson_nav", duration: 1.5 });
        goNext();
      } else if (e.shiftKey && (e.key === "P" || e.key === "p") && prev) {
        e.preventDefault();
        e.stopPropagation();
        sessionStorage.setItem("pending_fullscreen", "true");
        message.loading({ content: "Đang quay lại bài học trước...", key: "lesson_nav", duration: 1.5 });
        goPrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  // 🎉 Completion Celebration (Tránh việc bật lặp lại nhiều lần nếu đã chúc mừng)
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationCheckedRef = useRef(false);

  const shouldCelebrate = progressPercent >= 100 && doneCount > 0 && !!courseId;
  if (shouldCelebrate && !celebrationCheckedRef.current) {
    celebrationCheckedRef.current = true;
    const key = `course_celebrated_${courseId}`;
    const hasCelebrated = localStorage.getItem(key);
    if (!hasCelebrated) {
      setShowCelebration(true);
      localStorage.setItem(key, "true");
    }
  }

  // ⏳ Autoplay Countdown handler
  useEffect(() => {
    if (nextLessonCountdown === null) return;
    if (nextLessonCountdown <= 0) {
      setNextLessonCountdown(null);
      goToNextLesson();
      return;
    }

    const timer = setTimeout(() => {
      setNextLessonCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [nextLessonCountdown, goToNextLesson]);

  // Cancel countdown if lesson changes (render-phase adjustment)
  const [prevLessonId, setPrevLessonId] = useState(lessonId);
  if (lessonId !== prevLessonId) {
    setPrevLessonId(lessonId);
    setNextLessonCountdown(null);
    setIsAutoplayCancelled(false);
  }

  const handleLessonCompleteWithAutoNext = useCallback(
    (completedId: string) => {
      handleLessonComplete(completedId);
      if (hasPathNext && !isAutoplayCancelled) {
        setNextLessonCountdown(5); // Start 5s countdown to autoplay next lesson
      }
    },
    [handleLessonComplete, hasPathNext, isAutoplayCancelled]
  );

  if (isLoading) return <LoadingLazy />;

  return (
    <Show>
      <Show.When isTrue={!course}>
        <div className="p-20 text-center text-slate-500 italic font-medium">
          Không tìm thấy khóa học hoặc bạn chưa đăng ký.
        </div>
      </Show.When>
  <Show.When isTrue={lessons.length === 0}>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <span className="text-5xl mb-4 block">📚</span>
            <h2 className="text-xl font-bold text-slate-800">Khóa học chưa có bài học</h2>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              Khóa học "{course?.name}" hiện tại chưa được cập nhật bài học nào. Vui lòng quay lại sau hoặc liên hệ với giảng viên để biết thêm chi tiết.
            </p>
            <button
              onClick={() => navigate(`/courses/${courseId}`)}
              className="mt-6 px-5 py-2.5 bg-primary text-white font-medium rounded-lg text-sm transition-all hover:bg-primary/90 shadow-sm"
            >
              Quay lại trang chi tiết khóa học
            </button>
          </div>
        </div>
      </Show.When>
      <Show.Else>
        <LearningLayout
          courseName={course?.name || ""}
          progressPercent={progressPercent}
          sections={course?.sections || []}
          lessons={lessons}
          currentLessonId={currentLesson?.id}
          handleLessonSelect={handleLessonSelect}
        >
          <Show>
            <Show.When isTrue={currentLesson?.type === LessonType.VIDEO}>
              {/* Floating Cinematic Player Wrapper */}
              <div className="bg-slate-955 w-full shrink-0 px-0 sm:px-6 py-0 sm:py-6 md:py-8 border-b border-slate-900/90 flex justify-center shadow-inner relative">
                <div className="absolute inset-0 bg-radial-gradient from-slate-900/30 to-transparent pointer-events-none" />
                <div className="max-w-[960px] w-full aspect-video sm:rounded-xl overflow-hidden shadow-2xl border-0 sm:border border-slate-800/60 bg-black relative z-10 learning-player-container">
                  <PlayerScreen
                    lesson={currentLesson}
                    onComplete={handleLessonCompleteWithAutoNext}
                    loading={isLoading}
                    courseName={course?.name || ""}
                    onNextLesson={goToNextLesson}
                    onPrevLesson={goToPrevLesson}
                    hasNext={hasPathNext}
                    hasPrev={hasPathPrev}
                  />

                  <AutoplayOverlay
                    nextLessonCountdown={nextLessonCountdown}
                    nextLessonName={lessons[currentLessonIndex + 1]?.name}
                    onCancel={() => {
                      setNextLessonCountdown(null);
                      setIsAutoplayCancelled(true);
                    }}
                    onPlayNow={() => {
                      setNextLessonCountdown(null);
                      goToNextLesson();
                    }}
                  />
                </div>
              </div>

              {/* Lesson Metadata Area */}
              <div className="px-6 py-8 md:px-10 max-w-[960px] mx-auto w-full flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-8">
                  <LessonMetadata
                    currentLessonIndex={currentLessonIndex}
                    currentLesson={currentLesson}
                  />

                  <LessonControls
                    hasPathPrev={hasPathPrev}
                    hasPathNext={hasPathNext}
                    goToPrevLesson={goToPrevLesson}
                    goToNextLesson={goToNextLesson}
                  />
                </div>

                <LessonDescription description={currentLesson?.description} />
              </div>
            </Show.When>
            <Show.Else>
              {/* Non-Video Layout (Quiz, Document, etc.) */}
              <div className="px-6 py-8 md:px-10 max-w-[960px] mx-auto w-full flex-1 flex flex-col gap-6">
                <div className="w-full relative z-10">
                  <PlayerScreen
                    lesson={currentLesson}
                    onComplete={handleLessonCompleteWithAutoNext}
                    loading={isLoading}
                    courseName={course?.name || ""}
                    onNextLesson={goToNextLesson}
                    onPrevLesson={goToPrevLesson}
                    hasNext={hasPathNext}
                    hasPrev={hasPathPrev}
                  />
                </div>

                {/* Clean bottom navigation bar without duplicate metadata/descriptions for Quizzes */}
                <div className="flex justify-between items-center border-t border-slate-200 pt-6">
                  <div>
                    {currentLesson?.type === LessonType.DOCUMENT && (
                      <LessonMetadata
                        currentLessonIndex={currentLessonIndex}
                        currentLesson={currentLesson}
                      />
                    )}
                  </div>

                  <LessonControls
                    hasPathPrev={hasPathPrev}
                    hasPathNext={hasPathNext}
                    goToPrevLesson={goToPrevLesson}
                    goToNextLesson={goToNextLesson}
                  />
                </div>
              </div>
            </Show.Else>
          </Show>

          <CelebrationModal
            open={showCelebration}
            onCancel={() => setShowCelebration(false)}
            courseName={course?.name}
            onNavigateToCourse={() => navigate(`/courses/${courseId}`)}
            onGetCertificate={() => setShowCelebration(false)}
          />
        </LearningLayout>
      </Show.Else>
    </Show>
  );
};

export default memo(PathPlayerPage);

