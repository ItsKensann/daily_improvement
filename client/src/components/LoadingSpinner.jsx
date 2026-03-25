import React from "react";

export const LoadingSpinner = ({ fullScreen = false }) => {
  const spinner = (
    <div className="flex items-center justify-center space-x-2">
      <div className="h-5 w-5 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      <span className="text-muted-foreground font-medium">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex h-64 w-full items-center justify-center">
      {spinner}
    </div>
  );
};
