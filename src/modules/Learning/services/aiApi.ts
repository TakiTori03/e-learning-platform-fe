import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";

const AI_PREFIX = API_PREFIX.AI;

export interface ICitation {
  lessonId: string;
  contentType: string;
  sourceCitation: string;
}

export interface IChatSession {
  id: string;
  userId: string;
  courseId: string;
  title: string;
  agentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface IChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  citations?: string; // JSON String or already parsed depending on serialization
  createdAt: string;
}

export interface IChatResponse {
  answer: string;
  citations: ICitation[];
  routedAgent?: string;
  evaluationScore?: number;
  sessionId?: string;
}

export const aiApi = {
  // Lấy danh sách phiên chat theo khóa học
  getSessions: (courseId: string): Promise<IChatSession[]> => {
    return axiosClient.get<IChatSession[]>(`${AI_PREFIX}/chat/tutor/sessions`, {
      courseId,
    });
  },

  // Lấy danh sách tin nhắn trong phiên chat
  getMessages: (sessionId: string): Promise<IChatMessage[]> => {
    return axiosClient.get<IChatMessage[]>(
      `${AI_PREFIX}/chat/tutor/sessions/${sessionId}/messages`
    );
  },

  // Xóa phiên chat
  deleteSession: (sessionId: string): Promise<void> => {
    return axiosClient.delete<void>(`${AI_PREFIX}/chat/tutor/sessions/${sessionId}`);
  },
};

/**
 * Đọc luồng SSE Stream từ Backend sử dụng Fetch API & ReadableStream
 */
export async function streamTutorChat(
  message: string,
  courseId: string,
  sessionId: string | null,
  onMetadata: (data: { sessionId: string; citations?: ICitation[]; routedAgent?: string }) => void,
  onToken: (token: string) => void,
  onComplete: (fullText: string) => void,
  onError: (err: any) => void
) {
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const url = `${baseUrl}${AI_PREFIX}/chat/tutor/stream`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify({
        message,
        courseId,
        sessionId,
      }),
      // Quan trọng: Gửi kèm cookie của session qua gateway
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Yêu cầu thất bại với trạng thái: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Không nhận được luồng dữ liệu trả về từ máy chủ.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullText = "";

    let currentEvent = "message";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

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
              onMetadata(meta);
            } catch (e) {
              console.error("Lỗi parse metadata SSE:", e);
            }
          } else if (currentEvent === "message") {
            onToken(dataStr);
            fullText += dataStr;
          } else if (currentEvent === "done") {
            onComplete(fullText);
          }
        }
      }
    }
  } catch (error) {
    console.error("Lỗi xảy ra trong luồng stream:", error);
    onError(error);
  }
}
