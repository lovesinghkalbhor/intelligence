import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext.tsx";
import { SendIcon } from "../icons/Icons";

export const ChatInput: React.FC = () => {
  const { sendMessage, isLoading, activeThread } = useChatContext();
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    await sendMessage(message, undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!activeThread) return null;

  return (
    <div className="">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Ask anything..."
              className="w-full resize-none border-0 bg-zinc-700 text-gray-100 placeholder-gray-500 rounded-xl px-4 py-3 pb-12 pr-12 focus:outline-none focus:ring-0 h-fit custom-scrollbar"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none"
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </form>
    </div>
  );
};
