import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "@/hooks/useGlobalChatStream";
import styles from "./GlobalChatbot.module.css";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

/**
 * Bong bóng tin nhắn đơn lẻ.
 * - User: gradient xanh, bo góc phải
 * - Assistant: trắng + viền, render markdown
 */
const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isStreaming = false,
}) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`${styles.messageRow} ${
        isUser ? styles.messageRowUser : styles.messageRowAssistant
      }`}
    >
      <div
        className={`${styles.bubble} ${
          isUser ? styles.bubbleUser : styles.bubbleAssistant
        }`}
      >
        {isUser ? (
          message.content
        ) : message.content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        ) : isStreaming ? (
          <div className={styles.typingDots}>
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
            <span className={styles.typingDot} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
