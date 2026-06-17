import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inboxApi } from "../services";
import { IConversation, IMessage } from "../types";
import { notification } from "antd";

// Mock Data
const MOCK_CONVERSATIONS: IConversation[] = [
  {
    id: "conv-1",
    participantId: "user-inst-1",
    participantName: "Nguyễn Văn Minh",
    participantAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Minh",
    participantRole: "Giảng viên",
    lastMessage: "Chào em, bài tập lớn React của em rất tốt. Em cần tối ưu thêm hiệu năng...",
    lastMessageTime: "10:30",
    unreadCount: 2,
    createdAt: "2026-06-04T10:30:00.000Z",
  },
  {
    id: "conv-2",
    participantId: "user-mentor-1",
    participantName: "Trần Thị Lan",
    participantAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lan",
    participantRole: "Mentor",
    lastMessage: "Anh đã xem qua wireframe em thiết kế. Các layout rất hợp lý, chú ý khoảng cách...",
    lastMessageTime: "Hôm qua",
    unreadCount: 0,
    createdAt: "2026-06-03T15:45:00.000Z",
  },
  {
    id: "conv-3",
    participantId: "user-support",
    participantName: "Phòng Hỗ Trợ EduVibe",
    participantAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Support",
    participantRole: "Hỗ trợ viên",
    lastMessage: "Hóa đơn thanh toán khóa học React Native của bạn đã được hệ thống xác nhận thành công.",
    lastMessageTime: "02/06",
    unreadCount: 0,
    createdAt: "2026-06-02T09:12:00.000Z",
  },
];

const MOCK_MESSAGES: Record<string, IMessage[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      conversationId: "conv-1",
      senderId: "user-me",
      senderName: "Học viên",
      content: "Dạ em chào thầy, thầy xem giúp em bài nộp Lab 4 phần Performance optimization với ạ.",
      createdAt: "2026-06-04T10:15:00.000Z",
      isMe: true,
    },
    {
      id: "msg-1-2",
      conversationId: "conv-1",
      senderId: "user-inst-1",
      senderName: "Nguyễn Văn Minh",
      senderAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Minh",
      content: "Chào em, bài tập lớn React của em rất tốt. Em cần tối ưu thêm hiệu năng bằng cách dùng useMemo và useCallback cho các component con nhé.",
      createdAt: "2026-06-04T10:30:00.000Z",
      isMe: false,
    },
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      conversationId: "conv-2",
      senderId: "user-me",
      senderName: "Học viên",
      content: "Chào chị Lan, em đã sửa lại màu sắc chủ đạo theo góp ý hôm trước của chị rồi ạ. Chị xem qua giúp em nhé.",
      createdAt: "2026-06-03T15:30:00.000Z",
      isMe: true,
    },
    {
      id: "msg-2-2",
      conversationId: "conv-2",
      senderId: "user-mentor-1",
      senderName: "Trần Thị Lan",
      senderAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Lan",
      content: "Anh đã xem qua wireframe em thiết kế. Các layout rất hợp lý, chú ý khoảng cách padding giữa các thẻ card để đều hơn nha.",
      createdAt: "2026-06-03T15:45:00.000Z",
      isMe: false,
    },
  ],
  "conv-3": [
    {
      id: "msg-3-1",
      conversationId: "conv-3",
      senderId: "user-me",
      senderName: "Học viên",
      content: "Cho em hỏi em vừa thanh toán khóa học React Native qua VNPay lúc 9h sáng nay, khi nào thì em được kích hoạt học ạ?",
      createdAt: "2026-06-02T09:05:00.000Z",
      isMe: true,
    },
    {
      id: "msg-3-2",
      conversationId: "conv-3",
      senderId: "user-support",
      senderName: "Phòng Hỗ Trợ EduVibe",
      senderAvatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Support",
      content: "Hóa đơn thanh toán khóa học React Native của bạn đã được hệ thống xác nhận thành công. Khóa học đã được mở khóa tự động trong kho của bạn rồi ạ.",
      createdAt: "2026-06-02T09:12:00.000Z",
      isMe: false,
    },
  ],
};

const getLocalConversations = (): IConversation[] => {
  const stored = localStorage.getItem("inbox_conversations");
  if (stored) return JSON.parse(stored);
  localStorage.setItem("inbox_conversations", JSON.stringify(MOCK_CONVERSATIONS));
  return MOCK_CONVERSATIONS;
};

const getLocalMessages = (conversationId: string): IMessage[] => {
  const stored = localStorage.getItem(`inbox_messages_${conversationId}`);
  if (stored) return JSON.parse(stored);
  const defaultMsgs = MOCK_MESSAGES[conversationId] || [];
  localStorage.setItem(`inbox_messages_${conversationId}`, JSON.stringify(defaultMsgs));
  return defaultMsgs;
};

const saveLocalMessage = (conversationId: string, message: IMessage) => {
  const current = getLocalMessages(conversationId);
  const updated = [...current, message];
  localStorage.setItem(`inbox_messages_${conversationId}`, JSON.stringify(updated));

  // Update last message metadata
  const convs = getLocalConversations();
  const updatedConvs = convs.map((c) => {
    if (c.id === conversationId) {
      return {
        ...c,
        lastMessage: message.content,
        lastMessageTime: new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        unreadCount: 0,
      };
    }
    return c;
  });
  localStorage.setItem("inbox_conversations", JSON.stringify(updatedConvs));
};

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      try {
        const data = await inboxApi.getConversations();
        if (data && data.length > 0) return data;
        return getLocalConversations();
      } catch (err) {
        return getLocalConversations();
      }
    },
  });
};

export const useMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      try {
        const data = await inboxApi.getMessages(conversationId);
        if (data && data.length > 0) return data;
        return getLocalMessages(conversationId);
      } catch (err) {
        return getLocalMessages(conversationId);
      }
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { conversationId: string; content: string }) => {
      try {
        const response = await inboxApi.sendMessage(data);
        return response;
      } catch (err) {
        // Fallback to local simulation
        const fakeMessage: IMessage = {
          id: `msg-fake-${Date.now()}`,
          conversationId: data.conversationId,
          senderId: "user-me",
          senderName: "Học viên",
          content: data.content,
          createdAt: new Date().toISOString(),
          isMe: true,
        };
        saveLocalMessage(data.conversationId, fakeMessage);
        return fakeMessage;
      }
    },
    onSuccess: (newMsg) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["messages", newMsg.conversationId] });
      
      // Auto reply simulation for interactive feel
      if (newMsg.id.startsWith("msg-fake-")) {
        setTimeout(() => {
          let replyContent = "Cảm ơn bạn đã liên hệ. Câu hỏi của bạn đã được ghi nhận và chúng tôi sẽ phản hồi trong thời gian sớm nhất.";
          if (newMsg.conversationId === "conv-1") {
            replyContent = "Thầy đã nhận được câu hỏi. Thầy sẽ xem xét chi tiết code của em vào tối nay và phản hồi lại nhé!";
          } else if (newMsg.conversationId === "conv-2") {
            replyContent = "Ok em, chị thấy màu sắc đã hài hòa hơn rồi đó. Để tối chị review kỹ các components khác rồi báo lại sau.";
          }

          const replyMsg: IMessage = {
            id: `msg-reply-${Date.now()}`,
            conversationId: newMsg.conversationId,
            senderId: "system-reply",
            senderName: newMsg.conversationId === "conv-1" ? "Nguyễn Văn Minh" : newMsg.conversationId === "conv-2" ? "Trần Thị Lan" : "Hỗ trợ viên",
            senderAvatar: newMsg.conversationId === "conv-1" 
              ? "https://api.dicebear.com/7.x/adventurer/svg?seed=Minh" 
              : newMsg.conversationId === "conv-2" 
                ? "https://api.dicebear.com/7.x/adventurer/svg?seed=Lan" 
                : "https://api.dicebear.com/7.x/adventurer/svg?seed=Support",
            content: replyContent,
            createdAt: new Date().toISOString(),
            isMe: false,
          };
          
          saveLocalMessage(newMsg.conversationId, replyMsg);
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["messages", newMsg.conversationId] });
          
          notification.info({
            message: "Tin nhắn mới",
            description: `Bạn có phản hồi mới từ ${replyMsg.senderName}`,
            placement: "bottomRight",
          });
        }, 3000);
      }
    },
  });
};
