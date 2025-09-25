import React from "react";
import { Brain } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="relative flex items-center justify-center">
        <Brain className="w-16 h-16 text-primary animate-pulse" />
      </div>
      <p className="mt-4 text-lg font-medium text-muted-foreground">
        Loading NeuroAssist
      </p>
      <div className="flex space-x-2 mt-2">
        <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
        <span style={{animationDelay: '0.2s'}} className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
        <span style={{animationDelay: '0.4s'}} className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default Loading;
