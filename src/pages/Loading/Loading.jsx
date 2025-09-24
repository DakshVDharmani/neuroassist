import React from "react";
import { Brain } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Brain Icon */}
      <div className="relative flex items-center justify-center">
        <Brain className="w-16 h-16 text-primary-600 animate-bounce" />
      </div>

      {/* Loading text */}
      <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
        Loading MindBridge
      </p>

      {/* Animated dots */}
      <div className="flex space-x-2 mt-2">
        <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-primary-600 rounded-full animate-bounce delay-300"></span>
      </div>
    </div>
  );
};

export default Loading;

