import { Typography } from "antd";
import { DownloadOutlined, CheckCircleOutlined } from "@ant-design/icons";
import type { ILesson } from "@/type";
import { useEffect, useState } from "react";
import CButton from "@/components/UI/Button";
import CTag, { TypeTagEnum } from "@/components/UI/Tag";
import { Show } from "@/components/UI/Template";

const { Title } = Typography;

interface DocumentPlayerViewProps {
  lesson: ILesson;
  onComplete: (lessonId: string) => void;
}

const AUTO_COMPLETE_SECONDS = 5;

const DocumentPlayerView = ({
  lesson,
  onComplete,
}: DocumentPlayerViewProps) => {
  const [prevLessonId, setPrevLessonId] = useState(lesson.id);
  const [countdown, setCountdown] = useState(AUTO_COMPLETE_SECONDS);

  if (lesson.id !== prevLessonId) {
    setPrevLessonId(lesson.id);
    setCountdown(AUTO_COMPLETE_SECONDS);
  }

  // Auto-complete document after countdown (only if not already done)
  useEffect(() => {
    if (lesson.isDone) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete(lesson.id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [lesson.id, lesson.isDone, onComplete]);

  const isPdfUrl = !!(
    lesson.content &&
    (lesson.content.startsWith("http://") ||
      lesson.content.startsWith("https://") ||
      lesson.content.startsWith("/"))
  );

  return (
    <div className="bg-white w-full h-[70vh] flex flex-col border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
        <div>
          <Title level={3} className="!m-0 !text-slate-800 text-lg md:text-xl">
            {lesson.name}
          </Title>
          <Show>
            <Show.When isTrue={!!lesson.description}>
              <p className="text-slate-500 mt-2 m-0 text-sm">{lesson.description}</p>
            </Show.When>
          </Show>
        </div>

        <div className="flex items-center gap-3">
          <Show>
            <Show.When isTrue={!!lesson.isDone}>
              <CTag
                type={TypeTagEnum.SUCCESS}
                className="rounded-full px-4 py-1 font-medium m-0 text-sm"
              >
                Đã hoàn thành
              </CTag>
            </Show.When>
            <Show.Else>
              <CTag
                type={TypeTagEnum.PROCESSING}
                className="rounded-full px-4 py-1 font-medium m-0 text-sm animate-pulse"
              >
                Tự động hoàn thành sau {countdown}s
              </CTag>
            </Show.Else>
          </Show>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8 relative">
        <Show>
          <Show.When isTrue={isPdfUrl}>
            <div className="h-full flex flex-col">
              <div className="mb-4 flex justify-end">
                <CButton
                  type="primary"
                  icon={<DownloadOutlined />}
                  href={lesson.content}
                  target="_blank"
                  download
                >
                  Tải xuống tài liệu
                </CButton>
              </div>
              <iframe
                src={`${lesson.content}#toolbar=0`}
                className="w-full h-full rounded-lg border border-slate-200 shadow-inner"
                title={lesson.name}
              />
            </div>
          </Show.When>
          <Show.Else>
            <div
              className="prose max-w-none text-slate-700 leading-relaxed text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: lesson.content || "" }}
            />
          </Show.Else>
        </Show>
      </div>
    </div>
  );
};

export default DocumentPlayerView;
