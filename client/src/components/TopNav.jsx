import React, { useState, useContext } from "react";
import { Moon, Sun, User, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    queryClient.clear();
    await logout();
    navigate("/");
  };

  return (
    <nav className="border-b border-border bg-input">
      <div className="px-8 py-4 flex items-center justify-end">
        <div className="flex items-center gap-6">
          <button onClick={toggleTheme}>
            {theme === "light" ? (
              <Sun className="w-5 h-5 opacity-50" />
            ) : (
              <Moon className="w-5 h-5 opacity-50" />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:opacity-60 transition-opacity"
            >
              <User className="w-5 h-5 opacity-50" />
            </button>

            {showDropdown && (
              <>
                {/* Backdrop to close dropdown when clicking outside */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-1 w-36 bg-input border border-border rounded shadow-md z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:opacity-60 transition-opacity"
                  >
                    <LogOut className="w-4 h-4" />
                    Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
