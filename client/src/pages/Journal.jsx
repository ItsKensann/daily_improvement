import { useState, useContext } from "react";
import { SideBar } from "../components/Sidebar";
import { TopNav } from "../components/TopNav";
import { AuthContext } from "../context/AuthContext";
import { Smile, Meh, Frown, MoonStar } from "lucide-react";
import api from "../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const moods = [
  { icon: Smile, value: "happy", label: "Happy" },
  { icon: Meh, value: "meh", label: "Meh" },
  { icon: Frown, value: "frown", label: "Frown" },
  { icon: MoonStar, value: "tired", label: "Tired" },
];

export default function Journal() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: journals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["journals"],
    queryFn: async () => {
      const res = await api.get("/api/journals");
      return res.data;
    },
    enabled: !!user, // only run if user exists
  });

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setTitle("");
    setContent("");
    setSelectedMood(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-hidden">
          <div className="flex gap-8 h-full">
            {/* Previous entries sidebar */}
            <div className="w-48 border-r border-border bg-background/50 px-6 py-8 overflow-auto">
              <div className="space-y-4">
                <button
                  onClick={handleNewEntry}
                  className="w-full py-2 px-3 text-left font-serif text-sm text-foreground hover:bg-muted transition-colors"
                >
                  New Entry
                </button>
                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-wide">
                    Previous Entries
                  </p>
                  {journals.map((entry) => (
                    <button
                      key={entry._id}
                      onClick={() => {}}
                      className={`w-full text-left py-2 px-3 rounded transition-colors`}
                    >
                      <p>{entry.title}</p>
                      <p>{entry.date}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main editor */}
            <div className="flex-1 px-24 py-12">
              <div className="mx-auto max-w-4xl space-y-8">
                {/* Header w date and mood selector */}
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <h1 className="font-serif text-2xl text-muted-foreground">
                      {today}
                    </h1>
                    <input
                      type="text"
                      placeholder="Daily Reflection"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full border-none bg-transparent font-serif text-xl text-foreground placeholder:text-muted-foreground placeholder:opacity-40 focus:outline-none"
                    />
                  </div>

                  {/* Mood selector */}
                  <div className="flex items-center gap-4">
                    {moods.map((mood) => {
                      const Icon = mood.icon;
                      return (
                        <button
                          key={mood.value}
                          onClick={() => setSelectedMood(mood.value)}
                          className={`transition-colors ${selectedMood === mood.value ? "text-accent" : ""}`}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.5} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Divider between header and text content */}
                <div className="border-t border-border" />

                {/* Main text editor */}
                <div className="min-h-[60vh]">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Begin writing..."
                    className="h-full min-h-[60vh] w-full resize-none border-none bg-transparent font-serif text-lg leading-relaxed text-foreground placeholder:text-muted-foreground placeholder:opacity-40 focus:outline-none"
                  />
                </div>

                {/* Save button */}
                <div className="flex justify-end">
                  <button
                    onClick={{}}
                    className="border border-border px-6 py-2 font-sans text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
