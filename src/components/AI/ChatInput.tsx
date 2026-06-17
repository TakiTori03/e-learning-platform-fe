import React, { useState, useCallback } from "react";
import { LockOutlined, SendOutlined } from "@ant-design/icons";
import styles from "./GlobalChatbot.module.css";

interface ChatInputProps {
  isAuth: boolean;
  isStreaming: boolean;
  isLoadingHistory: boolean;
  onSend: (message: string) => void;
}

/**
 * Ô nhập liệu tin nhắn.
 * - Chưa đăng nhập: hiện thông báo khóa + link login
 * - Đã đăng nhập: textarea + nút gửi
 * - Enter gửi, Shift+Enter xuống dòng
 */
const ChatInput: React.FC<ChatInputProps> = ({
  isAuth,
  isStreaming,
  isLoadingHistory,
  onSend,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed || isStreaming || isLoadingHistory) return;
    onSend(trimmed);
    setInputValue("");
  }, [inputValue, isStreaming, isLoadingHistory, onSend]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (!isAuth) {
    return (
      <div className={styles.inputArea}>
        <div className={styles.authLock}>
          <LockOutlined className={styles.authLockIcon} />
          <p className={styles.authLockText}>
            Vui lòng đăng nhập để sử dụng Chatbot
          </p>
          <button
            className={styles.authLockLink}
            onClick={() => (window.location.href = "/auth-callback")}
          >
            Đăng nhập ngay →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputRow}>
        <textarea
          className={styles.inputField}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            isStreaming ? "AI đang trả lời..." : "Hỏi tôi bất cứ điều gì..."
          }
          disabled={isStreaming || isLoadingHistory}
          rows={1}
        />
        <button
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={!inputValue.trim() || isStreaming || isLoadingHistory}
          title="Gửi tin nhắn"
        >
          <SendOutlined />
        </button>
      </div>
    </div>
  );
};

export default React.memo(ChatInput);
