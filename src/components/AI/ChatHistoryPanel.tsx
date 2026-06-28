import React from "react";
import { DeleteOutlined } from "@ant-design/icons";
import CPopconfirm from "@/components/UI/Popconfirm";
import type { ChatSession } from "@/hooks/useGlobalChatStream";
import styles from "./GlobalChatbot.module.css";

interface ChatHistoryPanelProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

/**
 * Panel hiển thị danh sách các phiên chat cũ.
 * Cho phép chọn để xem lại hoặc xóa.
 */
const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  sessions,
  activeSessionId,
  onSelect,
  onDelete,
}) => {
  if (sessions.length === 0) {
    return (
      <div className={styles.historyPanel}>
        <div className={styles.historyEmpty}>Chưa có cuộc hội thoại nào</div>
      </div>
    );
  }

  return (
    <div className={styles.historyPanel}>
      {sessions.map((session) => (
        <div
          key={session.id}
          className={`${styles.historyItem} ${
            activeSessionId === session.id ? styles.historyItemActive : ""
          }`}
          onClick={() => onSelect(session.id)}
        >
          <div className={styles.historyInfo}>
            <p className={styles.historyTitle}>
              {session.title || "Không có tiêu đề"}
            </p>
            <p className={styles.historyDate}>
              {new Date(session.updatedAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <CPopconfirm
            title="Xóa hội thoại này?"
            description="Tất cả tin nhắn sẽ bị xóa vĩnh viễn."
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete(session.id);
            }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <button
              className={styles.historyDeleteBtn}
              onClick={(e) => e.stopPropagation()}
              title="Xóa hội thoại"
            >
              <DeleteOutlined />
            </button>
          </CPopconfirm>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ChatHistoryPanel);
