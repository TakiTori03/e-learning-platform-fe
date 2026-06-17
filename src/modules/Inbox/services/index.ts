import { axiosClient } from "@/core/http";
import { API_PREFIX } from "@/constants/api";
import { IConversation, IMessage } from "../types";

export const inboxApi = {
  getConversations: async (): Promise<IConversation[]> => {
    return axiosClient.get(`${API_PREFIX.INTERACTION}/messages/conversations`);
  },

  getMessages: async (conversationId: string): Promise<IMessage[]> => {
    return axiosClient.get(`${API_PREFIX.INTERACTION}/messages/conversations/${conversationId}`);
  },

  sendMessage: async (data: { conversationId?: string; receiverId?: string; content: string }): Promise<IMessage> => {
    return axiosClient.post(`${API_PREFIX.INTERACTION}/messages`, data);
  },
};
