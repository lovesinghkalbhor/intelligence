import React from "react";
import { useChatContext } from "../../context/ChatContext.tsx";

export const ChatHeader: React.FC = () => {
  const { activeThread } = useChatContext();

  if (!activeThread) return null;

  return (
    <div className=" px-6 py-4 ">
      <div className="flex items-center justify-between">
        <h1 className="text-md font-semibold text-gray-100 truncate">
          {activeThread.title}
        </h1>
        <div className="text-xs text-gray-500">
          {activeThread.messages.length} messages
        </div>
      </div>
    </div>
  );
};
