// types/chat.types.ts
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

//we call it Thread in database
export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  thread: Chat[];
  activeThread: Chat | null;
  isLoading: boolean;
  error: string | null;
  createChat: () => void;
  selectThread: (chatId: string) => void;
  deleteThread: (chatId: string) => void;
  sendMessage: (
    content: string,
    imageBase64: string | undefined
  ) => Promise<void>;
  updateThreadTitle: (chatId: string, title: string) => void;
}
