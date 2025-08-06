import React from "react";
import { useChatContext } from "../../context/ChatContext";
import { SparklesIcon } from "../icons/Icons";

export const EmptyState: React.FC = () => {
  const { createChat } = useChatContext();

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-950 p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-100 mb-3">
          Welcome to ChatAI
        </h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Start a conversation and explore the possibilities of AI-powered chat.
          Ask questions, get creative, or just have a friendly conversation.
        </p>
        <button
          onClick={createChat}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
        >
          <SparklesIcon className="w-4 h-4" />
          Start New Chat
        </button>
      </div>
    </div>
  );
};
