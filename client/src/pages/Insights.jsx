import React, { useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { SideBar } from "../components/Sidebar";
import { TopNav } from "../components/TopNav";
import { LoadingSpinner } from "../components/LoadingSpinner";

export default function Insights() {
  const queryClient = useQueryClient();

  // Fetch the history of insights
  const { data: insights = [], isLoading } = useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const res = await api.get("/api/ai/daily-insight");
      return res.data;
    },
  });

  const generateInsightMutation = useMutation({
    mutationFn: async () => {
      await api.post("/api/ai/daily-insight/generate");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today, ${time}`;
    return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SideBar />
      <div className="flex min-w-0 flex-1 flex-col h-full">
        <TopNav />

        <main className="flex-1 overflow-y-auto px-6 py-12 md:px-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-serif text-5xl font-thin text-[#d4d4d4] leading-tight">
              Your Insights
            </h1>
            <p className="mt-4 font-serif text-[#a0a0a0]">
              Patterns and reflections from your deep work.
            </p>
          </div>

          {/* Conditional Rendering: Loading vs Content */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="mb-8 flex justify-center">
                <button
                  className="flex items-center gap-2 rounded-sm border border-[#444] px-6 py-2 font-serif text-sm text-[#d4d4d4] transition-all hover:bg-[#32363a] disabled:opacity-50"
                  onClick={() => generateInsightMutation.mutate()}
                  disabled={generateInsightMutation.isPending}
                >
                  {generateInsightMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Reflecting...
                    </>
                  ) : (
                    "Generate New Insight"
                  )}
                </button>
              </div>

              {/* Insights Feed */}
              <div className="mx-auto max-w-2xl space-y-6">
                {insights.length === 0 ? (
                  <div className="text-center p-8 border border-[#444] rounded bg-[#32363a]/50">
                    <p className="font-serif text-[#a0a0a0]">
                      No insights generated yet. Complete some tasks or log a
                      focus session to get started.
                    </p>
                  </div>
                ) : (
                  [...insights].reverse().map((insight) => (
                    <div
                      key={insight._id}
                      className="group rounded-sm border border-[#444] bg-[#32363a]/40 p-8 transition-all duration-300 hover:border-[#a8b89a]/50 hover:-translate-y-0.5"
                    >
                      <div className="mb-6 flex items-center gap-3">
                        <Sparkles
                          className="h-4 w-4 text-[#a8b89a] flex-shrink-0"
                          strokeWidth={2}
                        />
                        <span className="font-sans text-xs uppercase tracking-widest text-[#a0a0a0]">
                          {formatTimestamp(insight.createdAt)}
                        </span>
                      </div>

                      <p className="mb-6 font-serif text-lg leading-relaxed text-[#d4d4d4]">
                        {insight.content}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {insight.contextPills.map((pill, index) => (
                          <div
                            key={index}
                            className="rounded-full border border-[#444] px-4 py-1.5 font-serif text-xs text-[#a0a0a0] transition-colors group-hover:border-[#a8b89a]/50 group-hover:text-[#a8b89a]"
                          >
                            {pill}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
