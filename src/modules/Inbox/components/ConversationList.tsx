import React, { useState } from "react";
import { Search, MessageSquareCode } from "lucide-react";
import For from "@/components/UI/Template/For";
import Show from "@/components/UI/Template/Show";
import CInput from "@/components/UI/Input";
import { IConversation } from "../types";

interface Props {
  conversations: IConversation[];
  selectedId?: string;
  onSelect: (id: string) => void;
  isLoading: boolean;
}

export const ConversationList: React.FC<Props> = ({
  conversations,
  selectedId,
  onSelect,
  isLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-100 w-full md:w-80 flex-shrink-0">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-50">
        <h2 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
          <MessageSquareCode size={22} className="text-blue-600" />
          Hộp thư đến
        </h2>
        <CInput
          id="conversation-search"
          placeholder="Tìm kiếm hội thoại..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<Search size={16} className="text-slate-400" />}
          className="rounded-xl bg-slate-50 border-none h-10 text-xs"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <Show>
          <Show.When isTrue={isLoading}>
            <div className="space-y-3 p-4">
              <For
                array={[1, 2, 3]}
                render={(_, idx) => (
                  <div key={idx} className="flex gap-3 items-center animate-pulse">
                    <div className="w-12 h-12 bg-slate-100 rounded-2xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-slate-100 rounded w-1/3"></div>
                      <div className="h-2.5 bg-slate-100 rounded w-3/4"></div>
                    </div>
                  </div>
                )}
              />
            </div>
          </Show.When>

          <Show.When isTrue={filteredConversations.length === 0}>
            <div className="text-center py-12 px-4">
              <p className="text-slate-400 text-xs">Không tìm thấy cuộc trò chuyện nào.</p>
            </div>
          </Show.When>

          <Show.Else>
            <For
              array={filteredConversations}
              render={(conversation) => {
                const isActive = conversation.id === selectedId;
                return (
                  <button
                    key={conversation.id}
                    onClick={() => onSelect(conversation.id)}
                    className={`w-full flex gap-3 p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-900 border border-blue-100/50"
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conversation.participantAvatar || "https://api.dicebear.com/7.x/adventurer/svg"}
                        alt={conversation.participantName}
                        className="w-11 h-11 rounded-xl bg-slate-100 object-cover"
                      />
                      <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[8px] font-bold bg-white text-slate-500 border border-slate-100 shadow-sm">
                        {conversation.participantRole || "Học viên"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold text-xs text-slate-800 truncate">
                          {conversation.participantName}
                        </h4>
                        <span className="text-[9px] text-slate-400 flex-shrink-0">
                          {conversation.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] truncate leading-normal">
                        {conversation.lastMessage}
                      </p>
                    </div>

                    <Show>
                      <Show.When isTrue={!!conversation.unreadCount && conversation.unreadCount > 0 && !isActive}>
                        <div className="flex-shrink-0 self-center">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      </Show.When>
                    </Show>
                  </button>
                );
              }}
            />
          </Show.Else>
        </Show>
      </div>
    </div>
  );
};
