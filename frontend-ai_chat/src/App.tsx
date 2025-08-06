import React from "react";
import { ChatProvider } from "./context/ChatContext.tsx";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { ChatArea } from "./components/Chat/ChatArea";
import "./styles/globals.css";

const App: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-gray-950 text-white">
        <Sidebar />
        <div className="flex-1">
          {" "}
          <ChatArea />{" "}
        </div>
      </div>
    </ChatProvider>
  );
};

export default App;
