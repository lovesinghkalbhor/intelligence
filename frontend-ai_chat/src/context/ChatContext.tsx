import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect, // Import useEffect
  type ReactNode,
} from "react";
import type { Chat, Message, ChatContextType } from "../types/chat.types.ts";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [thread, setThreads] = useState<Chat[]>([]);
  const [activeThread, setActiveThread] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- API Integration Start ---

  // 1. Fetch all thread on initial load
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/threads/get`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch thread.");
        }
        const result = await response.json();
        // Assuming your backend returns data.threads
        // Map backend _id to frontend id
        const fetchedThreads: Chat[] = result.data.map((thread: any) => ({
          id: thread._id,
          title: thread.title,
          messages: thread.messages.map((msg: any) => ({
            id: msg._id, // Backend provides _id for messages too
            content: msg.content,
            role: msg.role,
            timestamp: new Date(msg.timestamp),
          })),
          createdAt: new Date(thread.createdAt),
          updatedAt: new Date(thread.updatedAt),
        }));
        setThreads(fetchedThreads);

        // Optionally, activate the most recent chat if any exist
        if (fetchedThreads.length > 0) {
          setActiveThread(fetchedThreads[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load thread.");
        console.error("Error fetching thread:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []); // Empty dependency array means this runs once on mount

  // 2. Modify createChat to hit the backend
  const createChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Call backend to create a new thread
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/threads/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: "New Chat" }), // Initial title
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create new chat.");
      }

      const backendThread = await response.json();
      // Map backend _id to frontend id
      const newChat: Chat = {
        id: backendThread._id,
        title: backendThread.title,
        messages: [], // Initially empty, messages added via sendMessage
        createdAt: new Date(backendThread.createdAt),
        updatedAt: new Date(backendThread.updatedAt),
      };

      setThreads((prev) => [newChat, ...prev]);
      setActiveThread(newChat);
    } catch (err: any) {
      setError(err.message || "Failed to create new chat.");
      console.error("Error creating chat:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies for this simple version

  // 3. Modify selectChat to fetch full thread messages if needed
  const selectThread = useCallback(
    async (chatId: string) => {
      // Check if the chat is already active and up-to-date (optional optimization)
      if (activeThread?.id === chatId) {
        return; // No need to re-fetch if already active
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/threads/${chatId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chat details.");
        }

        const result = await response.json();
        const fetchedThreads: Chat = {
          id: result.data._id,
          title: result.data.title,
          messages: result.data.messages.map((msg: any) => ({
            id: msg._id,
            content: msg.content,
            role: msg.role,
            timestamp: new Date(msg.timestamp),
          })),
          createdAt: new Date(result.data.createdAt),
          updatedAt: new Date(result.data.updatedAt),
        };
        setActiveThread(fetchedThreads);

        // Also update the thread array to ensure its messages are current
        // setThreads((prev) =>
        //   prev.map((chat) =>
        //     chat.id === fetchedThreads.id ? fetchedThreads : chat
        //   )
        // );
      } catch (err: any) {
        setError(err.message || "Failed to select chat.");
        console.error("Error selecting chat:", err);
        setActiveThread(null); // Clear active chat on error
      } finally {
        setIsLoading(false);
      }
    },
    [activeThread] // Dependency to re-create if activeThread changes
  );

  // 4. Modify deleteChat to hit the backend
  const deleteThread = useCallback(
    async (chatId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/threads/${chatId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete chat.");
        }

        // Optimistically remove from UI first for better UX
        setThreads((prev) => prev.filter((chat) => chat.id !== chatId));
        if (activeThread?.id === chatId) {
          setActiveThread(null);
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete chat.");
        console.error("Error deleting chat:", err);
        // If delete fails, you might want to re-fetch or revert state
      } finally {
        setIsLoading(false);
      }
    },
    [activeThread] // Dependency on activeThread to check if it's the one being deleted
  );

  // 5. Add a function to update chat title on the backend
  const updateThreadTitle = useCallback(
    async (chatId: string, title: string) => {
      // Optimistic update
      setThreads((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
      );
      if (activeThread?.id === chatId) {
        setActiveThread((prev: Chat | null) =>
          prev ? { ...prev, title } : null
        );
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/threads/${chatId}`,
          {
            method: "PATCH", // Or PUT, depending on your backend
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update chat title on backend.");
        }
        // Backend doesn't return the full thread, so rely on optimistic update for now.
        // If backend returned updated thread, you'd use that to set state.
      } catch (err: any) {
        setError(err.message || "Failed to update chat title.");
        console.error("Error updating chat title:", err);
        // Revert optimistic update if necessary, or just let the user re-try.
        // For simplicity, we'll let it be for now.
      }
    },
    [activeThread]
  );

  // 6. sendMessage is already well-integrated, but needs a small adjustment for threadId
  const sendMessage = useCallback(
    async (content: string, imageBase64: string | undefined) => {
      // Ensure activeThread exists and has an ID (from backend)
      if (!activeThread || !activeThread.id) {
        setError("No active chat or chat ID found to send message.");
        return;
      }

      setIsLoading(true);
      setError(null);

      const userMessage: Message = {
        id: Date.now().toString(), // Temp ID for optimistic update
        content,
        role: "user",
        timestamp: new Date(),
      };

      // Optimistically add user message
      const updatedChatWithUserMessage = {
        ...activeThread,
        messages: [...activeThread.messages, userMessage],
        updatedAt: new Date(),
      };

      setActiveThread(updatedChatWithUserMessage);

      // this will make the updated one on the top
      setThreads((prev) => [
        updatedChatWithUserMessage,
        ...prev.filter((chats) => chats.id !== updatedChatWithUserMessage.id),
      ]);

      // Auto-update chat title if it's the first message *in this session for this chat*
      // Or if the chat was just created and the title is default "New Chat"
      if (
        activeThread.messages.length === 0 || // This condition works for newly created client-side thread
        activeThread.title === "New Chat" || // Catches thread created on backend with default title
        (activeThread.messages.length === 0 &&
          activeThread.title.includes("...")) // if backend title was based on initial message too
      ) {
        const title =
          content.length > 30 ? content.substring(0, 30) + "..." : content;
        // Call updateChatTitle. It will now also update the backend title.
        await updateThreadTitle(activeThread.id, title);
      }

      try {
        // Call your backend API here
        // Pass activeThread.id (which is the threadId from MongoDB)
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/chat/message`,
          {
            // Corrected endpoint
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: content,
              threadId: activeThread.id, // Pass the backend thread ID
              imageBase64,
              // chatHistory is not needed here as the backend fetches it from DB
            }),
          }
        );

        if (!response.ok) {
          // Attempt to parse error message from backend
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send message.");
        }

        const data = await response.json(); // Backend response now contains threadId, userMessage, assistantMessage
        const assistantMessageContent = data.data.assistantMessage; // Access assistantMessage from data.data

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(), // Still use temp ID for frontend display
          content: assistantMessageContent,
          role: "assistant",
          timestamp: new Date(),
        };

        const finalChat = {
          ...updatedChatWithUserMessage, // Start with the chat that has the user message
          messages: [...updatedChatWithUserMessage.messages, assistantMessage],
          updatedAt: new Date(),
        };

        setActiveThread(finalChat);
        setThreads((prev) =>
          prev.map((chat) => (chat.id === finalChat.id ? finalChat : chat))
        );
      } catch (err: any) {
        setError(err.message || "Failed to send message. Please try again.");
        console.error("Error sending message:", err);

        // Optional: If send fails, remove the optimistically added user message
        setActiveThread((prevChat) =>
          prevChat
            ? {
                ...prevChat,
                messages: prevChat.messages.filter(
                  (msg) => msg.id !== userMessage.id
                ),
              }
            : null
        );
        setThreads((prev) =>
          prev.map((chat) =>
            chat.id === activeThread.id
              ? {
                  ...chat,
                  messages: chat.messages.filter(
                    (msg) => msg.id !== userMessage.id
                  ),
                }
              : chat
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeThread, updateThreadTitle]
  );
  // --- API Integration End ---

  const contextValue: ChatContextType = {
    thread,
    activeThread,
    isLoading,
    error,
    createChat,
    selectThread,
    deleteThread,
    sendMessage,
    updateThreadTitle,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
