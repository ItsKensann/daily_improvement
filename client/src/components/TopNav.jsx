import React from "react";
import { Moon, Sun, Settings, User } from "lucide-react";

export function TopNav() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="px-8 py-4 flex items-center justify-between">
        <h2 className="tracking-wide opacity-80">
          Kaizen - Daily Improvement{" "}
        </h2>

        <div className="flex items-center gap-6">
          <button className="p-2 hover:opacity-60 transition-opacity">
            <Settings className="w-5 h-5 opacity-50" />
          </button>
          <button className="p-2 hover:opacity-60 transition-opacity">
            <User className="w-5 h-5 opacity-50" />
          </button>
        </div>
      </div>
    </nav>
  );
}
