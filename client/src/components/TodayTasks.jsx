import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export function TodayTasks() {
  const queryClient = useQueryClient();

  // fetch tasks
  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/api/tasks");
      return res.data;
    },
  });

  // complete taskmutation
  const completeTaskMutation = useMutation({
    mutationFn: async (id) => {
      await api.patch(`/api/tasks/${id}`, { status: "completed" });
    },
    onSuccess: () => {
      // refresh task list and dashboard
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] });
    },
  });

  // filter top 3
  const activeTasks = allTasks.filter((task) => task.status !== "completed");
  const topTasks = activeTasks.slice(0, 3);

  if (isLoading)
    return (
      <div className="font-serif text-sm text-gray-500">Loading tasks...</div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-gray-900 dark:text-gray-100">
          Todo
        </h2>
      </div>

      {topTasks.length === 0 ? (
        <p className="font-serif text-sm text-gray-500 italic">
          Your plate is clear. Enjoy the peace.
        </p>
      ) : (
        <ul className="space-y-5">
          {topTasks.map((task) => (
            <li key={task._id} className="flex items-start gap-4 group">
              {/* Clickable Circle Button */}
              <button
                onClick={() => completeTaskMutation.mutate(task._id)}
                disabled={completeTaskMutation.isPending}
                className="mt-1.5 h-4 w-4 shrink-0 rounded-full border border-gray-400 hover:bg-[#a8b89a] hover:border-[#a8b89a] transition-colors focus:outline-none flex items-center justify-center"
                aria-label="Mark task complete"
              ></button>

              <div className="flex flex-col">
                <span className="font-serif text-base leading-relaxed text-gray-900 dark:text-gray-100 group-hover:text-gray-300 transition-colors">
                  {task.title}
                </span>

                {task.category && (
                  <span className="font-serif text-xs text-[#a8b89a]">
                    {task.category}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
