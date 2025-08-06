import React from "react";
import { useChatContext } from "../../context/ChatContext.tsx";
import { ChatItem } from "./ChatItem";
import type { Chat } from "../../types/chat.types";

export const ChatList: React.FC = () => {
  const { thread } = useChatContext();

  if (thread.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm">No chats yet</p>
        <p className="text-xs mt-1">Start a new conversation</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
      {thread.map((chat: Chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};
