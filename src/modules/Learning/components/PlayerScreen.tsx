import { Typography, Skeleton } from "antd";
import type { ILesson } from "@/type";
import { LessonType } from "@/constants/enums";
import { Show } from "@/components/UI/Template";

// Import Views
import VideoPlayerView from "./player-views/VideoPlayerView";
import DocumentPlayerView from "./player-views/DocumentPlayerView";
import QuizLandingView from "./player-views/QuizLandingView";

interface PlayerScreenProps {
  lesson: ILesson | null;
  onComplete: (lessonId: string) => void;
  loading?: boolean;
  courseName?: string;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

/**
 * 💎 Polymorphic Learning Screen Component (Strategy Pattern Router)
 * Routes the rendering logic to the appropriate sub-view based on Lesson Type.
 */
const PlayerScreen = ({
  lesson,
  onComplete,
  loading,
  courseName,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev,
}: PlayerScreenProps) => {
  return (
    <div className="w-full h-full">
      <Show>
        <Show.When isTrue={!!loading}>
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <Skeleton.Button active className="!w-full !h-full" />
          </div>
        </Show.When>
        <Show.Else>
          <Show>
            <Show.When isTrue={!lesson}>
              <div className="bg-slate-900 w-full aspect-video flex flex-col items-center justify-center text-white rounded-xl border border-slate-800">
                <Typography.Title level={3} className="!text-slate-200">
                  🚀 Sẵn sàng để tiếp thu kiến thức?
                </Typography.Title>
                <p className="text-slate-400 mt-2">
                  Chọn một bài học ở menu bên phải để bắt đầu học ngay.
                </p>
              </div>
            </Show.When>
            <Show.Else>
              {(() => {
                if (!lesson) return null;
                switch (lesson.type) {
                  case LessonType.VIDEO:
                    return (
                      <VideoPlayerView
                        lesson={lesson}
                        onComplete={onComplete}
                        courseName={courseName}
                        onNextLesson={onNextLesson}
                        onPrevLesson={onPrevLesson}
                        hasNext={hasNext}
                        hasPrev={hasPrev}
                      />
                    );
                  case LessonType.DOCUMENT:
                    return <DocumentPlayerView lesson={lesson} onComplete={onComplete} />;
                  case LessonType.QUIZ:
                    return <QuizLandingView lesson={lesson} />;
                  default:
                    return (
                      <div className="bg-white p-8 w-full min-h-[60vh] border border-gray-100 rounded-xl shadow-sm text-center flex items-center justify-center">
                        <Typography.Title level={4} className="text-slate-400">
                          Định dạng bài học không được hỗ trợ ({lesson.type})
                        </Typography.Title>
                      </div>
                    );
                }
              })()}
            </Show.Else>
          </Show>
        </Show.Else>
      </Show>
    </div>
  );
};

export default PlayerScreen;
