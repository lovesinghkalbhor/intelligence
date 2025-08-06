import React from "react";

import { NewChatButton } from "./NewChatButton";
import { ChatList } from "./ChatList";
import { UserProfile } from "./UserProfile";

export const Sidebar: React.FC = () => {
  return (
    <div className="">
      <div className="flex  flex-col w-80 bg-zinc-800/80 h-full">
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <NewChatButton />
          </div>
          <div className="px-4 pb-4">
            <h2 className="text-sm font-medium text-gray-400 mb-3">Chats</h2>
            <ChatList />
          </div>
        </div>
        <UserProfile />
      </div>
    </div>
  );
};
