// src/components/CodeBlock.tsx
import React, { useState } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string; // For language class (e.g., language-js)
  inline?: boolean; // To differentiate inline code from block code
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
  inline,
}) => {
  const [copied, setCopied] = useState(false);

  // Extract the text content from children (which is typically a string)
  const codeText = String(children);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset "Copied!" message after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Optionally, set an error state here
    }
  };

  if (inline) {
    // Styling for inline code (e.g., `git status`)
    return (
      <code
        className={`bg-gray-700 text-cyan-400 px-1 py-0.5 rounded-md text-sm ${className}`} // className passed from remark-gfm if available
      >
        {children}
      </code>
    );
  }

  // Styling for block code (e.g., ```javascript ... ```)
  const language = className?.replace("language-", "") || "text"; // Extract language from className

  return (
    <div className="relative my-2 rounded-xl bg-gray-900">
      {/* Language label and Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-gray-400 border-b border-gray-800">
        <span className="capitalize">
          {language === "text" ? "Code" : language}
        </span>
        <button
          onClick={handleCopy}
          className="relative px-2 py-1 rounded-md hover:bg-gray-700 transition-colors duration-200"
        >
          {copied ? (
            <span className="text-green-400">Copied!</span>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7v4a1 1 0 001 1h4m-4-10v4a1 1 0 001 1h4m-4-10V9a1 1 0 01-1 1H9a1 1 0 00-1 1v4m-4 0h6m4 0h6m-4-10v4a1 1 0 01-1 1H9a1 1 0 00-1 1v4m-4 0h6m4 0h6m-4-10v4a1 1 0 01-1 1H9a1 1 0 00-1 1v4m-4 0h6m4 0h6"
              />
            </svg>
          )}
        </button>
      </div>
      {/* Code content */}
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <code className={`block whitespace-pre-wrap ${className}`}>
          {children}
        </code>
      </div>
    </div>
  );
};
