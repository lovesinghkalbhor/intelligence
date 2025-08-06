import React from "react";
import { BotIcon } from "../icons/Icons";

export const LoadingMessage: React.FC = () => {
  return (
    <div className="flex gap-4 justify-start">
      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
        <BotIcon className="w-4 h-4 text-white" />
      </div>

      <div className="max-w-[70%]">
        <div className="p-4   rounded-2xl">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
