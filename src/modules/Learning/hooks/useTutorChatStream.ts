import { useState, useEffect, useCallback } from "react";
import {
  aiApi,
  streamTutorChat,
  IChatSession,
  IChatMessage,
  ICitation,
} from "../services/aiApi";

export const useTutorChatStream = (courseId: string) => {
  const [sessions, setSessions] = useState<IChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // States cho tin nhắn đang stream hiện tại
  const [streamedAnswer, setStreamedAnswer] = useState("");
  const [streamedCitations, setStreamedCitations] = useState<ICitation[]>([]);

  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Lấy danh sách các session
  const fetchSessions = useCallback(async () => {
    setLoadingSessions(true);
    try {
      const data = await aiApi.getSessions(courseId);
      const sorted = [...data].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setSessions(sorted);

      if (sorted.length > 0 && !activeSessionId) {
        setActiveSessionId(sorted[0].id);
      }
    } catch (e) {
      console.error("Lỗi khi tải danh sách hội thoại:", e);
    } finally {
      setLoadingSessions(false);
    }
  }, [courseId, activeSessionId]);

  // Lấy danh sách tin nhắn trong session hiện tại
  const fetchMessages = useCallback(async (sessionId: string) => {
    setLoadingMessages(true);
    try {
      const data = await aiApi.getMessages(sessionId);
      const sorted = [...data].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sorted);
    } catch (e) {
      console.error("Lỗi khi tải lịch sử tin nhắn:", e);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  // Tải danh sách session khi đổi Course
  useEffect(() => {
    fetchSessions();
  }, [courseId]);

  // Tải tin nhắn khi đổi activeSessionId
  useEffect(() => {
    if (activeSessionId) {
      fetchMessages(activeSessionId);
      setStreamedAnswer("");
      setStreamedCitations([]);
    } else {
      setMessages([]);
    }
  }, [activeSessionId, fetchMessages]);

  // Tạo cuộc hội thoại mới tinh (Reset Chat)
  const handleResetChat = useCallback(() => {
    setActiveSessionId(null);
    setMessages([]);
    setStreamedAnswer("");
    setStreamedCitations([]);
  }, []);

  // Xóa cuộc hội thoại
  const handleDeleteSession = useCallback(
    async (sessionId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      try {
        await aiApi.deleteSession(sessionId);
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
          setMessages([]);
        }
        fetchSessions();
      } catch (err) {
        console.error("Lỗi khi xóa hội thoại:", err);
      }
    },
    [activeSessionId, fetchSessions]
  );

  // Gửi tin nhắn
  const handleSendMessage = useCallback(async () => {
    const messageText = inputMessage.trim();
    if (!messageText || isStreaming) return;

    setInputMessage("");
    setIsStreaming(true);
    setStreamedAnswer("");
    setStreamedCitations([]);

    const tempUserMsg: IChatMessage = {
      id: `temp-${Date.now()}`,
      sessionId: activeSessionId || "",
      role: "user",
      content: messageText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    let targetSessionId = activeSessionId;

    try {
      await streamTutorChat(
        messageText,
        courseId,
        targetSessionId,
        (metadata) => {
          if (metadata.sessionId && !targetSessionId) {
            targetSessionId = metadata.sessionId;
            setActiveSessionId(metadata.sessionId);
          }
          if (metadata.citations) {
            setStreamedCitations(metadata.citations);
          }
        },
        (token) => {
          setStreamedAnswer((prev) => prev + token);
        },
        async () => {
          setIsStreaming(false);
          setStreamedAnswer("");
          setStreamedCitations([]);

          if (targetSessionId) {
            await fetchMessages(targetSessionId);
            await fetchSessions();
          }
        },
        () => {
          setIsStreaming(false);
          const errorMsg: IChatMessage = {
            id: `err-${Date.now()}`,
            sessionId: targetSessionId || "",
            role: "assistant",
            content:
              "⚠️ Hệ thống AI hiện đang quá tải hoặc gặp sự cố kết nối. Vui lòng gửi lại câu hỏi.",
            createdAt: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, errorMsg]);
        }
      );
    } catch (err) {
      console.error("Gửi tin nhắn stream thất bại:", err);
      setIsStreaming(false);
    }
  }, [inputMessage, isStreaming, activeSessionId, courseId, fetchMessages, fetchSessions]);

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    messages,
    inputMessage,
    setInputMessage,
    isStreaming,
    streamedAnswer,
    streamedCitations,
    loadingSessions,
    loadingMessages,
    handleResetChat,
    handleDeleteSession,
    handleSendMessage,
    fetchSessions,
    fetchMessages,
  };
};
