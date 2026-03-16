import { useState, useContext, useMemo } from "react";
import { SideBar } from "../components/Sidebar";
import { TopNav } from "../components/TopNav";
import { AuthContext } from "../context/AuthContext";
import { Smile, Meh, Frown, MoonStar, Loader2 } from "lucide-react";
import api from "../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const moods = [
  { icon: Smile, value: "happy", label: "Happy" },
  { icon: Meh, value: "meh", label: "Meh" },
  { icon: Frown, value: "frown", label: "Frown" },
  { icon: MoonStar, value: "tired", label: "Tired" },
];

const DRAFT_KEY = "journal_draft";

export default function Journal() {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Initialize draft from localStorage
  const [draft, setDraft] = useState(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    return saved ? JSON.parse(saved) : { title: "", content: "", mood: "meh" };
  });

  const updateDraft = (fields) => {
    const updated = { ...draft, ...fields };
    setDraft(updated);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  };

  // Fetch Journals
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
    enabled: !!user,
  });

  // Create Mutation
  const addJournalMutation = useMutation({
    mutationFn: async (journalData) => {
      const res = await api.post("/api/journals", journalData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journals"] });
      setDraft({ title: "", content: "", mood: "meh" });
      localStorage.removeItem(DRAFT_KEY);
      setSelectedEntry(null);
    },
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!draft.content.trim()) return alert("Write something first!");

    addJournalMutation.mutate({
      date: new Date().toISOString(),
      ...draft,
    });
  };

  // UI Derived State
  const isViewing = !!selectedEntry;
  const displayTitle = isViewing ? selectedEntry.title : draft.title;
  const displayContent = isViewing ? selectedEntry.content : draft.content;
  const displayMood = isViewing ? selectedEntry.mood : draft.mood;
  const displayDate = isViewing
    ? new Date(selectedEntry.date).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Today's Reflection";

  return (
    <div className="flex h-screen bg-background">
      <SideBar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-hidden">
          <div className="flex gap-8 h-full">
            {/* Previous entries sidebar */}
            <div className="w-64 border-r border-border bg-background/50 px-6 py-8 overflow-auto">
              <div className="space-y-4">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className={`w-full py-2 px-3 text-left font-serif text-sm transition-colors rounded ${!isViewing ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"}`}
                >
                  + New Entry
                </button>

                <div className="border-t border-border pt-4 space-y-2">
                  <p className="text-xs font-sans text-muted-foreground uppercase tracking-wide mb-4">
                    Previous Entries
                  </p>

                  {isLoading && (
                    <Loader2 className="animate-spin h-4 w-4 text-muted-foreground" />
                  )}

                  {journals.map((entry) => (
                    <button
                      key={entry._id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`w-full text-left py-2 px-3 rounded transition-all ${selectedEntry?._id === entry._id ? "bg-muted border-l-2 border-accent" : "hover:bg-muted/50"}`}
                    >
                      <p className="truncate text-sm font-medium">
                        {entry.title || "Untitled"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main editor */}
            <div className="flex-1 px-12 lg:px-24 py-12 overflow-y-auto">
              <div className="mx-auto max-w-3xl space-y-8">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <h1 className="font-serif text-sm uppercase tracking-widest text-muted-foreground">
                      {displayDate}
                    </h1>
                    <input
                      type="text"
                      placeholder="Title your entry..."
                      value={displayTitle}
                      readOnly={isViewing}
                      onChange={(e) => updateDraft({ title: e.target.value })}
                      className="w-full border-none bg-transparent font-serif text-3xl text-foreground placeholder:opacity-30 focus:outline-none"
                    />
                  </div>

                  {/* Mood selector */}
                  <div className="flex items-center gap-3 bg-muted/30 p-2 rounded-full">
                    {moods.map((mood) => {
                      const Icon = mood.icon;
                      const isActive = displayMood === mood.value;
                      return (
                        <button
                          key={mood.value}
                          disabled={isViewing}
                          onClick={() => updateDraft({ mood: mood.value })}
                          className={`p-2 rounded-full transition-all ${isActive ? "bg-background text-accent shadow-sm" : "text-muted-foreground hover:text-foreground disabled:opacity-50"}`}
                          title={mood.label}
                        >
                          <Icon
                            className="h-5 w-5"
                            strokeWidth={isActive ? 2 : 1.5}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border" />

                <div className="min-h-[50vh]">
                  <textarea
                    value={displayContent}
                    readOnly={isViewing}
                    onChange={(e) => updateDraft({ content: e.target.value })}
                    placeholder="Write your heart out..."
                    className="h-full min-h-[50vh] w-full resize-none border-none bg-transparent font-serif text-lg leading-relaxed text-foreground placeholder:opacity-30 focus:outline-none"
                  />
                </div>

                {/* Save button - Only show if writing new */}
                {!isViewing && (
                  <div className="flex justify-end pb-12">
                    <button
                      onClick={handleSave}
                      disabled={addJournalMutation.isPending}
                      className="border border-border px-6 py-2 font-sans text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      {addJournalMutation.isPending
                        ? "Saving..."
                        : "Save to Journal"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
