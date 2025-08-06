import React, { useEffect, useRef } from "react";
import { useChatContext } from "../../context/ChatContext.tsx";
import { MessageBubble } from "./MessageBubble";
import { LoadingMessage } from "./LoadingMessage";
import type { Message } from "../../types/chat.types";

export const MessagesList: React.FC = () => {
  const { activeThread, isLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  if (!activeThread) return null;

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-6 space-y-6">
        {activeThread.messages.map((message: Message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isLoading && <LoadingMessage />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
