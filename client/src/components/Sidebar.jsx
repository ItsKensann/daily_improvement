import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  CheckSquare,
  Calendar,
  BarChart3,
  BookOpen,
  Clock,
  PenLine,
} from "lucide-react";

export function SideBar() {
  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: PenLine, label: "Journal", href: "/journal" },
    { icon: CheckSquare, label: "Tasks", href: "/tasks" },
    { icon: Calendar, label: "Calendar", href: "/calendar" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: BookOpen, label: "Library", href: "/library" },
    { icon: Clock, label: "Focus Timer", href: "/focus" },
  ];

  return (
    <aside className="w-[228px] border-r border-border bg-background px-4 py-6">
      <div></div>
      <nav>
        <Link to="/tasks">TEST</Link>
      </nav>
    </aside>
  );
}
