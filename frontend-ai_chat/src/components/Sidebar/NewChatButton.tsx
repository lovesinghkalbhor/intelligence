import React from "react";
import { PlusIcon } from "../icons/Icons";
import { useChatContext } from "../../context/ChatContext";

export const NewChatButton: React.FC = () => {
  const { createChat } = useChatContext();

  return (
    <button
      onClick={createChat}
      className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 border border-gray-700"
    >
      <PlusIcon className="w-4 h-4 text-gray-400" />
      <span className="text-gray-200 font-medium">New chat</span>
    </button>
  );
};
