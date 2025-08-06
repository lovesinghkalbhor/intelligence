import React from "react";
import { UserIcon } from "../icons/Icons";

export const UserProfile: React.FC = () => {
  return (
    <div className="border-t border-gray-700 p-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-200">User</p>
          <p className="text-xs text-gray-500">Free Plan</p>
        </div>
      </div>
    </div>
  );
};
