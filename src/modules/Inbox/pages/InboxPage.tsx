import React, { useState } from "react";
import { useConversations, useMessages, useSendMessage } from "../queryHooks";
import { ConversationList } from "../components/ConversationList";
import { MessageThread } from "../components/MessageThread";

const InboxPage: React.FC = () => {
  const [selectedConvId, setSelectedConvId] = useState<string | undefined>(undefined);

  const { data: conversations = [], isLoading: isLoadingConvs } = useConversations();
  const { data: messages = [], isLoading: isLoadingMsgs } = useMessages(selectedConvId);
  const sendMessageMutation = useSendMessage();

  const selectedConversation = conversations.find((c) => c.id === selectedConvId);

  const handleSendMessage = (content: string) => {
    if (!selectedConvId) return;
    sendMessageMutation.mutate({
      conversationId: selectedConvId,
      content,
    });
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex h-[650px]">
        {/* Sidebar */}
        <ConversationList
          conversations={conversations}
          selectedId={selectedConvId}
          onSelect={setSelectedConvId}
          isLoading={isLoadingConvs}
        />

        {/* Message Thread */}
        <MessageThread
          conversation={selectedConversation}
          messages={messages}
          isLoading={isLoadingMsgs}
          onSendMessage={handleSendMessage}
          isSending={sendMessageMutation.isPending}
        />
      </div>
    </div>
  );
};

export default InboxPage;
