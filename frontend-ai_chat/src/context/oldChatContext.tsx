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

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
}: any) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- API Integration Start ---

  // 1. Fetch all chats on initial load
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/threads/get"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch chats.");
        }
        const result = await response.json();
        // Assuming your backend returns data.threads
        // Map backend _id to frontend id
        const fetchedChats: Chat[] = result.data.map((thread: any) => ({
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
        setChats(fetchedChats);

        // Optionally, activate the most recent chat if any exist
        if (fetchedChats.length > 0) {
          setActiveChat(fetchedChats[0]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load chats.");
        console.error("Error fetching chats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, []); // Empty dependency array means this runs once on mount

  const createChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat);
  }, []);

  const selectChat = useCallback(
    (chatId: string) => {
      const chat = chats.find((c) => c.id === chatId);
      if (chat) {
        setActiveChat(chat);
      }
    },
    [chats]
  );

  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (activeChat?.id === chatId) {
        setActiveChat(null);
      }
    },
    [activeChat]
  );

  const updateChatTitle = useCallback(
    (chatId: string, title: string) => {
      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, title } : chat))
      );
      if (activeChat?.id === chatId) {
        setActiveChat((prev: Chat | null) =>
          prev ? { ...prev, title } : null
        );
      }
    },
    [activeChat]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeChat) return;

      setIsLoading(true);
      setError(null);

      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        role: "user",
        timestamp: new Date(),
      };

      // Add user message immediately
      const updatedChat = {
        ...activeChat,
        messages: [...activeChat.messages, userMessage],
        updatedAt: new Date(),
      };

      setActiveChat(updatedChat);
      setChats((prev) =>
        prev.map((chat) => (chat.id === activeChat.id ? updatedChat : chat))
      );

      // Auto-update chat title if it's the first message
      if (activeChat.messages.length === 0) {
        const title =
          content.length > 30 ? content.substring(0, 30) + "..." : content;
        updateChatTitle(activeChat.id, title);
      }

      try {
        // Call your backend API here
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
            chatHistory: activeChat.messages,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: "assistant",
          timestamp: new Date(),
        };

        const finalChat = {
          ...updatedChat,
          messages: [...updatedChat.messages, assistantMessage],
          updatedAt: new Date(),
        };

        setActiveChat(finalChat);
        setChats((prev) =>
          prev.map((chat) => (chat.id === activeChat.id ? finalChat : chat))
        );
      } catch (err) {
        setError("Failed to send message. Please try again.");
        console.error("Error sending message:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [activeChat, updateChatTitle]
  );

  const contextValue: ChatContextType = {
    chats,
    activeChat,
    isLoading,
    error,
    createChat,
    selectChat,
    deleteChat,
    sendMessage,
    updateChatTitle,
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};
