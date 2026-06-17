import React, { useState, useEffect, useCallback } from "react";
import { MessageFilled } from "@ant-design/icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useGlobalChatStream } from "@/hooks/useGlobalChatStream";
import ChatHeader from "./ChatHeader";
import ChatHistoryPanel from "./ChatHistoryPanel";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import styles from "./GlobalChatbot.module.css";

/**
 * Floating Global Chatbot Widget.
 *
 * Hiển thị dưới góc phải trên tất cả các trang client.
 * - FAB trigger với ping animation
 * - Cửa sổ chat slide-up với header gradient
 * - Chuyển đổi giữa chat view / history view
 * - SSE streaming qua custom hook
 * - Tự động khôi phục session khi mở lại
 */
const GlobalChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const { isAuth, user } = useAuthStore();
  const {
    messages,
    sessions,
    activeSessionId,
    isStreaming,
    isLoadingHistory,
    fetchSessions,
    loadSessionMessages,
    startChatStream,
    createNewChat,
    deleteSession,
  } = useGlobalChatStream();

  // Khi mở widget lần đầu: tải sessions + restore session cũ
  useEffect(() => {
    if (isOpen && isAuth) {
      fetchSessions();
      const cachedSessionId = sessionStorage.getItem("global_chat_session_id");
      if (cachedSessionId && messages.length === 0) {
        loadSessionMessages(cachedSessionId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isAuth]);

  const handleToggleHistory = useCallback(() => {
    if (!showHistory) {
      fetchSessions();
    }
    setShowHistory((prev) => !prev);
  }, [showHistory, fetchSessions]);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      loadSessionMessages(sessionId);
      setShowHistory(false);
    },
    [loadSessionMessages]
  );

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      deleteSession(sessionId);
    },
    [deleteSession]
  );

  const handleNewChat = useCallback(() => {
    createNewChat();
    setShowHistory(false);
  }, [createNewChat]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setShowHistory(false);
  }, []);

  return (
    <div className={styles.wrapper}>
      {/* ── FAB Trigger Button ── */}
      {!isOpen && (
        <button
          className={styles.fabTrigger}
          onClick={() => setIsOpen(true)}
          aria-label="Mở chatbot AI"
        >
          <span className={styles.fabPing} />
          <MessageFilled style={{ fontSize: 22 }} />
        </button>
      )}

      {/* ── Chat Window ── */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <ChatHeader
            showHistory={showHistory}
            isAuth={isAuth}
            onClose={handleClose}
            onNewChat={handleNewChat}
            onToggleHistory={handleToggleHistory}
          />

          {showHistory ? (
            <ChatHistoryPanel
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelect={handleSelectSession}
              onDelete={handleDeleteSession}
            />
          ) : (
            <>
              <ChatMessages
                messages={messages}
                isLoadingHistory={isLoadingHistory}
                isStreaming={isStreaming}
                isAuth={isAuth}
                userName={user?.firstName}
              />
              <ChatInput
                isAuth={isAuth}
                isStreaming={isStreaming}
                isLoadingHistory={isLoadingHistory}
                onSend={startChatStream}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(GlobalChatbotWidget);
