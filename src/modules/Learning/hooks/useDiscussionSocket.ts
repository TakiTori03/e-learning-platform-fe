import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Client } from "@stomp/stompjs";
import { API_PREFIX } from "@/constants/api";
import type { IDiscussion, IListResponse } from "@/type";

interface UseDiscussionSocketProps {
  lessonId: string;
  page?: number;
}

export const useDiscussionSocket = ({ lessonId, page = 0 }: UseDiscussionSocketProps) => {
  const queryClient = useQueryClient();
  const stompClientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    // 1. Khởi tạo STOMP Client trỏ qua API Gateway
    const gatewayUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsProtocol}//${gatewayUrl.replace(/^https?:\/\//, "")}${API_PREFIX.INTERACTION}/ws-discussion`;

    const client = new Client({
      brokerURL: wsUrl,
      // KHÔNG cần truyền Authorization header thủ công vì hệ thống đang dùng cơ chế BFF Cookie (HttpOnly).
      // Trình duyệt sẽ tự động gửi kèm cookie "access_token" trong Handshake Request.
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("[WS-STOMP]:", str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 2. Xử lý khi kết nối thành công
    client.onConnect = (frame) => {
      console.log("[WS-STOMP]: Connected to gateway WebSocket.");

      // Đăng ký (Subscribe) topic của bài học hiện tại
      const destination = `/topic/lesson.${lessonId}`;
      client.subscribe(destination, (message) => {
        try {
          const newDiscussion: IDiscussion = JSON.parse(message.body);
          console.log("[WS-STOMP]: Received discussion message:", newDiscussion);

          // 3. Đồng bộ hóa trực tiếp vào Cache của React Query
          queryClient.setQueryData<IListResponse<IDiscussion>>(
            ["discussions", lessonId, page],
            (oldData) => {
              if (!oldData) return oldData;

              // Helper để tìm kiếm và cập nhật thảo luận/phản hồi nếu đã tồn tại (dành cho Edit hoặc Like/Unlike)
              const findAndReplace = (items: IDiscussion[]): { updated: boolean; items: IDiscussion[] } => {
                let replaced = false;
                const newItems = items.map((item) => {
                  if (item.id === newDiscussion.id) {
                    replaced = true;
                    return {
                      ...item,
                      ...newDiscussion,
                      // Giữ lại danh sách replies cũ nếu tin nhắn broadcast không mang theo replies
                      replies: newDiscussion.replies?.length ? newDiscussion.replies : item.replies,
                    };
                  }
                  if (item.replies && item.replies.length > 0) {
                    const res = findAndReplace(item.replies);
                    if (res.updated) {
                      replaced = true;
                      return { ...item, replies: res.items };
                    }
                  }
                  return item;
                });
                return { updated: replaced, items: newItems };
              };

              // Kiểm tra xem đây có phải là cập nhật (like count hoặc edit content) của thảo luận cũ không
              const replaceResult = findAndReplace(oldData.content);
              if (replaceResult.updated) {
                return {
                  ...oldData,
                  content: replaceResult.items,
                };
              }

              // Nếu không phải là cập nhật -> Đây là bình luận hoặc phản hồi mới được thêm
              if (!newDiscussion.parentId) {
                // Thảo luận gốc mới
                if (oldData.content.some((d) => d.id === newDiscussion.id)) {
                  return oldData;
                }
                return {
                  ...oldData,
                  content: [newDiscussion, ...oldData.content],
                  totalElements: (oldData.totalElements || 0) + 1,
                };
              } else {
                // Phản hồi mới
                const insertReply = (items: IDiscussion[]): IDiscussion[] => {
                  return items.map((item) => {
                    if (item.id === newDiscussion.parentId) {
                      const replies = item.replies || [];
                      if (replies.some((r) => r.id === newDiscussion.id)) return item;
                      return {
                        ...item,
                        replies: [...replies, newDiscussion],
                        replyCount: (item.replyCount || 0) + 1,
                      };
                    }
                    if (item.replies && item.replies.length > 0) {
                      return {
                        ...item,
                        replies: insertReply(item.replies),
                      };
                    }
                    return item;
                  });
                };

                return {
                  ...oldData,
                  content: insertReply(oldData.content),
                };
              }
            }
          );
        } catch (error) {
          console.error("[WS-STOMP]: Error parsing message body:", error);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error("[WS-STOMP]: Broker error:", frame.headers["message"]);
      console.error("[WS-STOMP]: Additional details:", frame.body);
    };

    // Kích hoạt kết nối
    client.activate();
    stompClientRef.current = client;

    // Hủy kết nối (cleanup) khi unmount hook
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        console.log("[WS-STOMP]: Deactivated connection.");
      }
    };
  }, [lessonId, page, queryClient]);

  return stompClientRef.current;
};
