import { useState } from "react";
import { SideBar } from "../components/Sidebar";
import { TopNav } from "../components/TopNav";
import { Smile, Meh, Frown, MoonStar } from "lucide-react";

const moods = [
  { icon: Smile, value: "happy", label: "Happy" },
  { icon: Meh, value: "meh", label: "Meh" },
  { icon: Frown, value: "frown", label: "Frown" },
  { icon: MoonStar, value: "tired", label: "Tired" },
];

export default function Journal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedWord, setSelectedWord] = useState(null);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav />
      </div>
    </div>
  );
}
