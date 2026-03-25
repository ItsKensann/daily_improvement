import React from "react";

// 'stats' comes fetching GET /api/user/dashboard-stats
export function MetricCards({ stats }) {
  // Defensive check: don't render if data hasn't loaded yet
  if (!stats) return null;

  // Helper to convert 150 minutes into "2.5 hours" or "45 mins"
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} mins`;
    const hours = (minutes / 60).toFixed(1);
    return `${hours} hours`;
  };

  const metrics = [
    {
      label: "Deep Work Today",
      value: formatTime(stats.focus.minutesToday),
      subtitle: `${stats.focus.sessionsToday} sessions completed`,
      accent: "bg-[#a8b89a]", // Adjust to your Zen theme colors
    },
    {
      label: "Tasks Completed",
      value: `${stats.tasks.completedToday} Today`,
      subtitle: `${stats.tasks.completedThisWeek} this week`,
      accent: "bg-[#c4a79a] dark:bg-[#9a8274]",
    },
    {
      label: "Deep Work This Week",
      value: formatTime(stats.focus.minutesThisWeek),
      subtitle: `${stats.focus.sessionsThisWeek} total sessions`,
      accent: "bg-[#a8b89a]",
    },
    {
      label: "Needs Attention",
      value: `${stats.tasks.overdueCount} Overdue`,
      subtitle: "Prioritize these next",
      accent: "bg-[#c4a79a] dark:bg-[#9a8274]",
    },
  ];

  return (
    <div className="mb-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center gap-2">
            <div className={`h-0.5 w-8 ${metric.accent}`} />
            <span className="font-serif text-sm text-gray-500 dark:text-gray-400">
              {metric.label}
            </span>
          </div>
          <div className="space-y-1 pl-10">
            <p className="font-serif text-2xl text-gray-900 dark:text-gray-100">
              {metric.value}
            </p>
            <p className="font-serif text-xs text-gray-500 dark:text-gray-400">
              {metric.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
