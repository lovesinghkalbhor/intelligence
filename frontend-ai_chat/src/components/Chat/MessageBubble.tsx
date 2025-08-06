import React from "react";
import type { Message } from "../../types/chat.types.ts";
import { UserIcon, BotIcon } from "../icons/Icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Import the GFM plugin
import { CodeBlock } from "./CodeBlock.tsx";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  console.log(message);
  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-8 h-8 mt-3  border-zinc-500 border-2 rounded-full flex items-center justify-center flex-shrink-0">
          <BotIcon className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? "order-first" : ""}`}>
        <div
          className={`p-4 rounded-2xl ${
            isUser ? "bg-zinc-700 text-white ml-auto" : "text-gray-100"
          }`}
        >
          <div className="prose prose-invert max-w-none ">
            {/* This is where you use ReactMarkdown */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]} // Apply the GFM plugin
              components={{
                // Optional: Customize specific elements for styling or behavior
                code({ inline, className, children }: any) {
                  return (
                    <CodeBlock inline={inline} className={className}>
                      {children}
                    </CodeBlock>
                  );
                },
                a: ({ node, ...props }) => (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                    {...props}
                  />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <div
          className={`text-xs text-gray-500 mt-1 ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {isUser && (
        <div className="w-8 h-8  border-zinc-500 border-2 mt-3 rounded-full flex items-center justify-center flex-shrink-0">
          <UserIcon className="w-4 h-4 text-gray-300" />
        </div>
      )}
    </div>
  );
};
