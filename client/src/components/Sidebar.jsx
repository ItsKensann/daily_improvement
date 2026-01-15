import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  BookOpen,
  Clock,
  PenLine,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { useSideBar } from "../context/SidebarContext";

export function SideBar() {
  const { isCollapsed, toggleSidebar } = useSideBar();
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: PenLine, label: "Journal", href: "/journal" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: BookOpen, label: "Library", href: "/library" },
    { icon: Clock, label: "Focus", href: "/focus" },
  ];

  return (
    <aside
      className={`border-r bg-background py-6 transition-all duration-300 ${
        isCollapsed ? "w-[92px] px-3" : "w-[228px] px-4"
      }`}
    >
      <div
        className={`mb-12 flex items-center ${
          isCollapsed ? "justify-center" : "justify-between px-4"
        }`}
      >
        <h1 className={isCollapsed ? "hidden" : "font-serif text-lg"}>
          Kaizen
        </h1>
        <button
          onClick={toggleSidebar}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {isCollapsed ? <PanelLeft /> : <PanelLeftClose />}
        </button>
      </div>
      <nav className="flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 p-3 py-2.5 font-serif text-sm transition-colors ${
                isCollapsed ? "justify-center" : ""
              }
                ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-accent-foreground"
                }
              `}
            >
              <item.icon className="h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
