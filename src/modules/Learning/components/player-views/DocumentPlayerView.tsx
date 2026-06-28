import { useEffect } from "react";
import { Typography } from "antd";
import type { ILesson } from "@/type";
import CButton from "@/components/UI/Button";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { Show } from "@/components/UI/Template";
import PdfPlayer from "@/components/Player/PdfPlayer";
import { useSearchParams } from "react-router-dom";
import { useLearningStore } from "../../store/useLearningStore";

const { Title } = Typography;

interface DocumentPlayerViewProps {
  lesson: ILesson;
  onComplete: (lessonId: string) => void;
}

const DocumentPlayerView = ({
  lesson,
  onComplete,
}: DocumentPlayerViewProps) => {
  const setPlayerRef = useLearningStore((state) => state.setPlayerRef);

  // Tự động đánh dấu hoàn thành bài học tài liệu sau 5 giây đọc (nếu chưa hoàn thành)
  useEffect(() => {
    if (!lesson.isDone) {
      const timer = setTimeout(() => {
        onComplete(lesson.id);
      }, 5000); // 5 giây
      return () => clearTimeout(timer);
    }
  }, [lesson.id, lesson.isDone, onComplete]);

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get("page");
  const pageNum = pageParam ? parseInt(pageParam, 10) : undefined;
  const activePage = pageNum && !isNaN(pageNum) ? pageNum : undefined;

  const isPdfUrl = !!(
    lesson.content &&
    (lesson.content.startsWith("http://") ||
      lesson.content.startsWith("https://") ||
      lesson.content.startsWith("/"))
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Main content rendering area (PDF Player or Markdown text) */}
      <Show>
        <Show.When isTrue={isPdfUrl}>
          <PdfPlayer
            ref={setPlayerRef}
            fileUrl={lesson.content}
            fileName={lesson.name}
            courseId={lesson.courseId}
            lessonId={lesson.id}
            isDone={!!lesson.isDone}
            onComplete={() => onComplete(lesson.id)}
            height="80vh"
            activePage={activePage}
          />
        </Show.When>
        <Show.Else>
          {/* For Markdown / HTML Lessons */}
          <div className="bg-white w-full border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col p-8 min-h-[400px]">
            {/* Header for text lessons */}
            <div className="flex justify-between items-center pb-6 mb-6 border-b border-slate-100 shrink-0">
              <div>
                <Title level={3} className="!m-0 !text-slate-800 text-lg md:text-xl font-bold">
                  {lesson.name}
                </Title>
                <Show>
                  <Show.When isTrue={!!lesson.description}>
                    <p className="text-slate-500 mt-2 m-0 text-sm">{lesson.description}</p>
                  </Show.When>
                </Show>
              </div>
            </div>

            <div
              className="prose max-w-none text-slate-700 leading-relaxed text-sm md:text-base flex-1"
              dangerouslySetInnerHTML={{ __html: lesson.content || "" }}
            />
          </div>
        </Show.Else>
      </Show>
    </div>
  );
};

export default DocumentPlayerView;
