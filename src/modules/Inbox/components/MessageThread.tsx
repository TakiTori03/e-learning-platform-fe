import React, { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import For from "@/components/UI/Template/For";
import Show from "@/components/UI/Template/Show";
import CButton from "@/components/UI/Button";
import CInput from "@/components/UI/Input";
import { IConversation, IMessage } from "../types";

interface Props {
  conversation?: IConversation;
  messages: IMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  isSending: boolean;
}

export const MessageThread: React.FC<Props> = ({
  conversation,
  messages,
  isLoading,
  onSendMessage,
  isSending,
}) => {
  const [typedMessage, setTypedMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!typedMessage.trim() || isSending) return;
    onSendMessage(typedMessage.trim());
    setTypedMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 flex-1">
      <Show>
        <Show.When isTrue={!conversation}>
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4 animate-bounce">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Hãy chọn một cuộc hội thoại</h3>
            <p className="text-slate-400 text-xs max-w-xs">
              Chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu thảo luận và học tập.
            </p>
          </div>
        </Show.When>

        <Show.Else>
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-4">
            <img
              src={conversation?.participantAvatar || "https://api.dicebear.com/7.x/adventurer/svg"}
              alt={conversation?.participantName}
              className="w-10 h-10 rounded-xl object-cover bg-slate-100"
            />
            <div>
              <h3 className="font-bold text-slate-800 text-sm">{conversation?.participantName}</h3>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                {conversation?.participantRole || "Học viên"}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <Show>
              <Show.When isTrue={isLoading}>
                <div className="space-y-4">
                  <div className="flex gap-3 max-w-[70%]">
                    <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                    <div className="bg-slate-200 h-10 w-48 rounded-2xl animate-pulse"></div>
                  </div>
                  <div className="flex gap-3 max-w-[70%] ml-auto justify-end">
                    <div className="bg-blue-200 h-12 w-64 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              </Show.When>

              <Show.When isTrue={messages.length === 0}>
                <div className="text-center py-12 text-slate-400 text-xs">
                  Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên!
                </div>
              </Show.When>

              <Show.Else>
                <For
                  array={messages}
                  render={(msg) => {
                    const isMe = msg.isMe;
                    return (
                      <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? "ml-auto flex-row-reverse" : ""}`}>
                        <Show>
                          <Show.When isTrue={!isMe}>
                            <img
                              src={msg.senderAvatar || "https://api.dicebear.com/7.x/adventurer/svg"}
                              alt={msg.senderName}
                              className="w-8 h-8 rounded-full bg-slate-200 self-end object-cover"
                            />
                          </Show.When>
                        </Show>

                        <div className="space-y-1">
                          <div
                            className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                              isMe
                                ? "bg-blue-600 text-white rounded-br-none shadow-sm shadow-blue-500/10"
                                : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                            }`}
                          >
                            {msg.content}
                          </div>
                          <div className={`text-[9px] text-slate-400 ${isMe ? "text-right" : ""}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </Show.Else>
            </Show>
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="bg-white p-4 border-t border-slate-100 flex gap-3 items-center">
            <CInput
              id="message-send-input"
              placeholder="Nhập tin nhắn..."
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSending}
              className="flex-1 rounded-2xl bg-slate-50 border-none px-4 h-11 text-xs"
            />
            <CButton
              type="primary"
              onClick={handleSend}
              loading={isSending}
              disabled={!typedMessage.trim()}
              className="h-11 w-11 p-0 rounded-2xl flex items-center justify-center bg-blue-600 border-none shadow-md shadow-blue-500/10"
              id="btn-send-message"
            >
              <Send size={16} className="text-white" />
            </CButton>
          </div>
        </Show.Else>
      </Show>
    </div>
  );
};
