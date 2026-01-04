import React from "react";
import { Moon, Sun, Settings, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function TopNav() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="border-b border-border bg-background">
      <div className="px-8 py-4 flex items-center justify-end">
        {/* <h2 className="tracking-wide opacity-80">Kaizen - Daily Improvement</h2> */}

        <div className="flex items-center gap-6">
          <button onClick={toggleTheme}>
            {theme === "light" ? (
              <Sun className="w-5 h-5 opacity-50" />
            ) : (
              <Moon className="w-5 h-5 opacity-50" />
            )}
          </button>
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
