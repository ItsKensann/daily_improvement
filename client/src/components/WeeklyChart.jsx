import React, { useMemo } from "react";

export function WeeklyChart({ stats }) {
  // If data isn't loaded yet, show a blank placeholder or return null
  if (!stats || !stats.focus.byDay) return null;

  // Transform backend data into the 7-day array
  const weeklyData = useMemo(() => {
    const today = new Date();

    // Generate an array of the last 7 days
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));

      // Format to "YYYY-MM-DD" to match backend aggregation _id
      const dateString = d.toISOString().split("T")[0];

      // Get short day name (e.g., "Mon", "Tue")
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      // Find the backend data for this specific day
      const dayData = stats.focus.byDay.find((item) => item._id === dateString);

      // Convert minutes to hours (1 decimal place)
      const minutes = dayData ? dayData.totalMinutes : 0;
      const hours = Number((minutes / 60).toFixed(1));

      return {
        day: dayName,
        hours: hours,
        label: hours > 0 ? `${hours}h` : "-", // Show '-' for 0 hours to keep it clean
      };
    });
  }, [stats]);

  // Fallback to 1 if max is 0, otherwise the math (0/0) results in NaN and breaks the height
  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1);

  return (
    <div className="mb-12 space-y-20">
      <div className="flex items-center gap-2">
        <div className="h-0.5 w-8 bg-[#a8b89a]" /> {/* Zen Accent Color */}
        <h2 className="font-serif text-sm text-gray-500 dark:text-gray-400">
          Weekly Deep Work Hours
        </h2>
      </div>

      <div className="flex items-end justify-between gap-4 px-10">
        {weeklyData.map((data, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-3">
            {/* The Bar */}
            <div
              className="w-full bg-[#a8b89a] transition-all duration-500 ease-out rounded-t-sm"
              style={{
                // Calculate height percentage relative to the max day (max 160px tall)
                height: `${(data.hours / maxHours) * 160}px`,
                // If it's 0 hours, give it a tiny 2px height so the bar isn't completely invisible
                minHeight: data.hours === 0 ? "2px" : "0px",
                opacity: data.hours === 0 ? 0.3 : 1,
              }}
            />
            {/* The Labels */}
            <div className="space-y-1 text-center">
              <p className="font-serif text-xs text-gray-500 dark:text-gray-400">
                {data.day}
              </p>
              <p className="font-serif text-xs text-gray-500 dark:text-gray-400">
                {data.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
