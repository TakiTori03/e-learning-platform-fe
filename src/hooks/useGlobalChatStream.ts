import { useState, useCallback, useRef } from "react";

export interface Message {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
}

/**
 * Custom hook quản lý toàn bộ luồng chat Global:
 * - SSE streaming (fetch + ReadableStream)
 * - CRUD session / messages
 * - Lưu trữ sessionId vào sessionStorage
 */
export const useGlobalChatStream = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    sessionStorage.getItem("global_chat_session_id")
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentRoutedAgent, setCurrentRoutedAgent] = useState<string | null>(null);

  // AbortController ref để hủy stream khi cần
  const abortRef = useRef<AbortController | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

  // ─── 1. Lấy danh sách hội thoại cũ ───
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/ai/chat/global/sessions`, {
        credentials: "include",
        headers: { "X-Requested-With": "XMLHttpRequest" },
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          setSessions(resData.payload || []);
        }
      }
    } catch (e) {
      console.error("Lỗi lấy danh sách session:", e);
    }
  }, [apiUrl]);

  // ─── 2. Lấy tin nhắn của một hội thoại cụ thể ───
  const loadSessionMessages = useCallback(
    async (sessionId: string) => {
      setIsLoadingHistory(true);
      try {
        const response = await fetch(
          `${apiUrl}/ai/chat/global/sessions/${sessionId}/messages`,
          {
            credentials: "include",
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        );
        if (response.ok) {
          const resData = await response.json();
          if (resData.success) {
            const dbMessages: Message[] = (resData.payload || []).map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (m: any) => ({
                id: String(m.id),
                sender: m.role as "user" | "assistant",
                content: m.content,
                timestamp: new Date(m.createdAt),
              })
            );
            setMessages(dbMessages);
            setActiveSessionId(sessionId);
            sessionStorage.setItem("global_chat_session_id", sessionId);
          }
        }
      } catch (e) {
        console.error("Lỗi tải tin nhắn:", e);
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [apiUrl]
  );

  // ─── 3. Gửi tin nhắn & Streaming SSE ───
  const startChatStream = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isStreaming) return;

      // Optimistic UI: thêm ngay tin nhắn user + placeholder assistant
      const userMsgId = crypto.randomUUID();
      const assistantMsgId = crypto.randomUUID();

      setMessages((prev) => [
        ...prev,
        {
          id: userMsgId,
          sender: "user",
          content: userMessage,
          timestamp: new Date(),
        },
        {
          id: assistantMsgId,
          sender: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(`${apiUrl}/ai/chat/global/stream`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            message: userMessage,
            sessionId: activeSessionId || undefined,
          }),
          signal: controller.signal,
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        if (!reader) throw new Error("Stream reader not available");

        let buffer = "";
        let assistantAnswer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          let currentEvent = "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            if (trimmed.startsWith("event:")) {
              currentEvent = trimmed.substring(6).trim();
            } else if (trimmed.startsWith("data:")) {
              const dataStr = trimmed.substring(5);

              if (currentEvent === "metadata") {
                try {
                  const meta = JSON.parse(dataStr.trim());
                  if (meta.sessionId) {
                    setActiveSessionId(meta.sessionId);
                    sessionStorage.setItem(
                      "global_chat_session_id",
                      meta.sessionId
                    );
                    fetchSessions();
                  }
                  if (meta.routedAgent) {
                    setCurrentRoutedAgent(meta.routedAgent);
                  }
                } catch {
                  // metadata parse fail — bỏ qua
                }
              } else if (currentEvent === "message") {
                assistantAnswer += dataStr;
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: assistantAnswer }
                      : msg
                  )
                );
              } else if (currentEvent === "done") {
                setIsStreaming(false);
                fetchSessions();
              }
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        console.error("Stream error:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: "⚠️ Đã xảy ra sự cố kết nối AI." }
              : msg
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [activeSessionId, apiUrl, fetchSessions, isStreaming]
  );

  // ─── 4. Tạo cuộc hội thoại mới ───
  const createNewChat = useCallback(() => {
    // Hủy stream đang chạy nếu có
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setMessages([]);
    setActiveSessionId(null);
    setCurrentRoutedAgent(null);
    setIsStreaming(false);
    sessionStorage.removeItem("global_chat_session_id");
  }, []);

  // ─── 5. Xóa cuộc hội thoại ───
  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        const response = await fetch(
          `${apiUrl}/ai/chat/global/sessions/${sessionId}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: { "X-Requested-With": "XMLHttpRequest" },
          }
        );
        if (response.ok) {
          setSessions((prev) => prev.filter((s) => s.id !== sessionId));
          if (activeSessionId === sessionId) {
            createNewChat();
          }
        }
      } catch (e) {
        console.error("Lỗi xóa hội thoại:", e);
      }
    },
    [activeSessionId, apiUrl, createNewChat]
  );

  return {
    messages,
    sessions,
    activeSessionId,
    isStreaming,
    isLoadingHistory,
    currentRoutedAgent,
    fetchSessions,
    loadSessionMessages,
    startChatStream,
    createNewChat,
    deleteSession,
  };
};
