import React from "react";
import { Card, Tooltip, Space, Typography } from "antd";
import { DeleteOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import { formatDateTime } from "@/utils/format";
import CButton from "@/components/UI/Button";
import { Show } from "@/components/UI/Template";

const { Text } = Typography;

export interface INoteItem {
  id: string;
  courseId: string;
  lessonId: string;
  content: string;
  videoTime?: number;
  page?: number;
  createdAt: string;
}

interface NoteItemProps {
  note: INoteItem;
  lessonName: string;
  filterScope: "current" | "all";
  onSeek: (note: INoteItem) => void;
  onDelete: (noteId: string) => void;
}

export const NoteItem: React.FC<NoteItemProps> = React.memo(({
  note,
  lessonName,
  filterScope,
  onSeek,
  onDelete,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card
      className="group border-gray-100 hover:border-primary/25 transition-all hover:shadow-md rounded-xl"
      styles={{ body: { padding: "16px" } }}
    >
      <Show>
        <Show.When isTrue={filterScope === "all"}>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold mb-2.5 bg-slate-50 px-2 py-1 rounded border border-slate-100/50 max-w-full">
            <BookOutlined className="text-slate-400 text-xs shrink-0" />
            <span className="truncate flex-1">{lessonName}</span>
          </div>
        </Show.When>
      </Show>

      <div className="flex justify-between items-start mb-3">
        <CButton
          id={`btn-seek-note-${note.id}`}
          type="text"
          size="small"
          className="bg-primary/10 text-primary border-none hover:bg-primary hover:text-white rounded-full flex items-center gap-2 px-3"
          onClick={() => onSeek(note)}
        >
          {note.page !== undefined && note.page !== null ? (
            <>
              <BookOutlined />
              <span className="font-bold">Trang {note.page}</span>
            </>
          ) : (
            <>
              <ClockCircleOutlined />
              <span className="font-bold">
                {formatTime(note.videoTime || 0)}
              </span>
            </>
          )}
        </CButton>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Space>
            <Tooltip title="Xóa">
              <CButton
                id={`btn-delete-note-${note.id}`}
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(note.id)}
              />
            </Tooltip>
          </Space>
        </div>
      </div>

      <Text className="text-gray-800 leading-relaxed block mb-2 text-sm whitespace-pre-line">
        {note.content}
      </Text>

      <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
        {formatDateTime(note.createdAt)}
      </div>
    </Card>
  );
});

export default NoteItem;
