import React, { useRef, useEffect } from "react";
import { Spin } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import type { Message } from "@/hooks/useGlobalChatStream";
import MessageBubble from "./MessageBubble";
import styles from "./GlobalChatbot.module.css";

interface ChatMessagesProps {
  messages: Message[];
  isLoadingHistory: boolean;
  isStreaming: boolean;
  isAuth: boolean;
  userName?: string;
}

/**
 * Khung hiển thị danh sách tin nhắn.
 * - Empty state: icon + lời chào
 * - Loading: spinner
 * - Messages: scroll tự động xuống cuối
 */
const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoadingHistory,
  isStreaming,
  isAuth,
  userName,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoadingHistory) {
    return (
      <div className={styles.messagesArea}>
        <div className={styles.loadingCenter}>
          <Spin size="default" />
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className={styles.messagesArea}>
        <div className={styles.emptyState}>
          <RobotOutlined className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>
            Xin chào{isAuth && userName ? ` ${userName}` : ""}! 👋
          </p>
          <p className={styles.emptySubtitle}>
            Tôi có thể giúp bạn tìm kiếm khóa học phù hợp, tư vấn lộ trình
            học tập cá nhân hóa và quản lý nhiệm vụ học tập.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.messagesArea}>
      {messages.map((msg, index) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isStreaming={
            isStreaming &&
            msg.sender === "assistant" &&
            index === messages.length - 1
          }
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default React.memo(ChatMessages);
