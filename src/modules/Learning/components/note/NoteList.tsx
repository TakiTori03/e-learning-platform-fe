import React, { useState, useMemo } from "react";
import { Empty, Modal, Typography, notification, Card, Segmented } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { learningApi } from "../../services";
import { useLearningStore } from "../../store/useLearningStore";
import CButton from "@/components/UI/Button";
import CTextArea from "@/components/UI/TextArea";
import { For, Show } from "@/components/UI/Template";
import NoteItem, { type INoteItem } from "./NoteItem";

const { Title } = Typography;

interface NoteListProps {
  courseId: string;
  lessonId: string;
}

export const NoteList: React.FC<NoteListProps> = ({
  courseId,
  lessonId,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const seekTo = useLearningStore((state) => state.seekTo);
  const playerRef = useLearningStore((state) => state.playerRef);
  const lessons = useLearningStore((state) => state.lessons);

  const [isAdding, setIsAdding] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [filterScope, setFilterScope] = useState<"current" | "all">("current");

  // Fetch notes with proper typing
  const { data: notes = [], isLoading } = useQuery<INoteItem[]>({
    queryKey: ["learning-notes", courseId],
    queryFn: () => learningApi.getNotes(courseId) as Promise<INoteItem[]>,
  });

  // Create note
  const createNoteMutation = useMutation<unknown, Error, { courseId: string; lessonId: string; content: string; videoTime: number }>({
    mutationFn: learningApi.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-notes"] });
      setIsAdding(false);
      setNoteContent("");
      notification.success({ message: "Đã lưu ghi chú" });
    },
  });

  // Delete note
  const deleteNoteMutation = useMutation<unknown, Error, string>({
    mutationFn: learningApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["learning-notes"] });
      notification.success({ message: "Đã xóa ghi chú" });
    },
  });

  const handleAddNote = () => {
    if (!noteContent.trim()) return;

    // Lấy thời gian hiện tại của video
    const currentTime = playerRef?.getCurrentTime() || 0;

    createNoteMutation.mutate({
      courseId,
      lessonId,
      content: noteContent,
      videoTime: Math.floor(currentTime),
    });
  };

  const handleDeleteNote = (noteId: string) => {
    Modal.confirm({
      title: "Xóa ghi chú?",
      content: "Hành động này không thể hoàn tác.",
      onOk: () => deleteNoteMutation.mutate(noteId),
    });
  };

  const handleSeekNote = (note: INoteItem) => {
    if (note.lessonId === lessonId) {
      seekTo(note.videoTime);
    } else {
      localStorage.setItem(`last_time_${courseId}_${note.lessonId}`, String(note.videoTime));
      navigate(`/learning/${courseId}/${note.lessonId}`);
    }
  };

  const filteredNotes = useMemo(() => {
    if (filterScope === "current") {
      return notes.filter((n) => n.lessonId === lessonId);
    }
    return notes;
  }, [notes, filterScope, lessonId]);

  if (isLoading)
    return <div className="p-10 text-center text-slate-500">Đang tải ghi chú...</div>;

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
        <Title level={5} className="!m-0">
          Ghi chú của tôi ({filteredNotes.length})
        </Title>
        <Show>
          <Show.When isTrue={!isAdding}>
            <CButton
              id="btn-add-note-open"
              typeCustom="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAdding(true)}
              className="rounded-lg"
            >
              Thêm ghi chú
            </CButton>
          </Show.When>
        </Show>
      </div>

      <div className="p-4 border-b bg-gray-50/20 flex justify-center">
        <Segmented
          options={[
            { label: "Bài hiện tại", value: "current" },
            { label: "Tất cả bài", value: "all" },
          ]}
          value={filterScope}
          onChange={(value) => setFilterScope(value as "current" | "all")}
          block
          className="rounded-lg w-full text-xs font-semibold"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <Show>
          <Show.When isTrue={isAdding}>
            <Card className="mb-6 border-primary/20 bg-primary/5 shadow-sm">
              <CTextArea
                id="new-note-text"
                rows={4}
                placeholder="Nhập nội dung ghi chú..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="mb-4 rounded-lg"
              />
              <div className="flex justify-end gap-2">
                <CButton id="btn-add-note-cancel" onClick={() => setIsAdding(false)}>
                  Hủy
                </CButton>
                <CButton
                  id="btn-add-note-save"
                  typeCustom="primary"
                  loading={createNoteMutation.isPending}
                  onClick={handleAddNote}
                  className="rounded-lg"
                >
                  Lưu ghi chú
                </CButton>
              </div>
            </Card>
          </Show.When>
        </Show>

        <Show>
          <Show.When isTrue={filteredNotes.length === 0 && !isAdding}>
            <Empty
              description={
                filterScope === "current"
                  ? "Chưa có ghi chú nào cho bài học này"
                  : "Bạn chưa có ghi chú nào cho khóa học này"
              }
            />
          </Show.When>
          <Show.Else>
            <div className="space-y-4">
              <For
                array={filteredNotes}
                render={(note) => {
                  const noteLesson = lessons.find((l) => l.id === note.lessonId);
                  const lessonName = noteLesson?.name || "Bài học khác";

                  return (
                    <NoteItem
                      key={note.id}
                      note={note}
                      lessonName={lessonName}
                      filterScope={filterScope}
                      onSeek={handleSeekNote}
                      onDelete={handleDeleteNote}
                    />
                  );
                }}
              />
            </div>
          </Show.Else>
        </Show>
      </div>
    </div>
  );
};

export default NoteList;
