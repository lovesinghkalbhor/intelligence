import React, { useState } from "react";
import type { Chat } from "../../types/chat.types.ts";
import { useChatContext } from "../../context/ChatContext.tsx";
import { MessageIcon, TrashIcon } from "../icons/Icons";

interface ChatItemProps {
  chat: Chat;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat }) => {
  const { activeThread, selectThread, deleteThread } = useChatContext();
  const [showActions, setShowActions] = useState(false);
  const isActive = activeThread?.id === chat.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteThread(chat.id);
  };

  return (
    <div
      className={`relative group cursor-pointer rounded-lg mb-2 transition-all duration-200 ${
        isActive
          ? "bg-zinc-700 border-zinc-500/50 border"
          : "hover:bg-zinc-700/70 border border-transparent"
      }`}
      onClick={() => selectThread(chat.id)}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-3 px-3 py-2.5">
        {/* <MessageIcon
          className={`w-4 h-4 flex-shrink-0 ${
            isActive ? "text-white" : "text-gray-500"
          }`}
        /> */}
        <span
          className={`flex-1 text-sm truncate ${
            isActive ? "text-white" : "text-gray-300"
          }`}
        >
          {chat.title}
        </span>
        {showActions && !isActive && (
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all duration-200"
          >
            <TrashIcon className="w-3 h-3 text-red-400" />
          </button>
        )}
      </div>
    </div>
  );
};
