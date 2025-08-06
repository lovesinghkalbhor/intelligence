import React from "react";
import { useChatContext } from "../../context/ChatContext.tsx";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { ChatInput } from "./ChatInput";
import { EmptyState } from "./EmptyState";

export const ChatArea: React.FC = () => {
  const { activeThread, sendMessage, isLoading } = useChatContext();
  // Modified onSendMessage handler to accept imageBase64
  const handleSendMessage = async (
    message: string,
    imageBase64?: string | undefined
  ) => {
    if (activeThread) {
      // Pass imageBase64 to sendMessage
      await sendMessage(message, imageBase64);
    }
  };

  if (!activeThread) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full bg-zinc-800">
      <ChatHeader />
      <div className="flex-1 overflow-x-hidden">
        <MessagesList />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
