import React, { useEffect } from "react"; // Added useEffect
import { Sparkles } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
import api from "../api/axios";
import { SideBar } from "../components/Sidebar";
import { TopNav } from "../components/TopNav";

export default function Insights() {
  const queryClient = useQueryClient(); // Initialize queryClient

  // Fetch the history of insights from our backend
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
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });

  // Effect to auto-generate 2 insights if the list is empty
  useEffect(() => {
    if (
      !isLoading &&
      insights.length === 0 &&
      !generateInsightMutation.isPending
    ) {
      // Generate 2 insights
      const generateInitialInsights = async () => {
        for (let i = 0; i < 3; i++) {
          await generateInsightMutation.mutateAsync();
        }
      };
      generateInitialInsights();
    }
  }, [insights.length, isLoading]);

  // Helper to format the MongoDB timestamp
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2b2d2e] flex items-center justify-center">
        <p className="font-serif text-[#a0a0a0] animate-pulse">
          Consulting the digital zen master...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />

      <div className="min-w-0 flex-1">
        <TopNav />
        <main className="px-6 py-12 md:px-12">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="font-serif text-5xl font-thin text-[#d4d4d4] leading-tight">
              Your Insights
            </h1>
            <p className="mt-4 font-serif text-[#a0a0a0]">
              Patterns and reflections from your deep work.
            </p>
          </div>

          <div className="mb-8 flex justify-center">
            <button
              className="rounded-sm border border-[#444] px-6 py-2 font-serif text-sm text-[#d4d4d4] transition-all hover:bg-[#32363a] disabled:opacity-50"
              onClick={() => generateInsightMutation.mutate()}
              disabled={generateInsightMutation.isPending}
            >
              {generateInsightMutation.isPending
                ? "Reflecting..."
                : "Generate New Insight"}
            </button>
          </div>

          {/* Insights Feed */}
          <div className="mx-auto max-w-2xl space-y-6">
            {insights.length === 0 ? (
              <div className="text-center p-8 border border-[#444] rounded bg-[#32363a]/50">
                <p className="font-serif text-[#a0a0a0]">
                  No insights generated yet. Complete some tasks or log a focus
                  session to get started.
                </p>
              </div>
            ) : (
              // Sort by date descending so newest is at the top
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
        </main>
      </div>
    </div>
  );
}
