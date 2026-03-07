import React, { useContext, useState, useEffect, useMemo } from "react";
import { TopNav } from "../components/TopNav";
import { SideBar } from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import { Plus, Calendar } from "lucide-react";
import api from "../api/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const priorityColors = {
  high: "bg-[#F51B2A]",
  medium: "bg-[#F5791B]",
  low: "bg=[#F5E61B]",
};

function Tasks() {
  const { user } = useContext(AuthContext);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "medium",
    dueDate: "",
  });
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [activeView, setActiveView] = useState("Today");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  // query function runs when compoent is mounted
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["tasks"], // name of cache
    queryFn: async () => {
      const res = await api.get("/api/tasks");
      return res.data;
    },
    enabled: !!user, // only run if user exists
  });

  const addTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      const res = await api.post("/api/tasks", taskData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsCreating(false);
      setNewTask({ title: "", priority: "medium", dueDate: "" });
    },
    onError: (err) => {
      console.error(err);
    },
  });

  // Handler to call in your form
  const handleAddTask = (e) => {
    e.preventDefault();
    addTaskMutation.mutate({
      title: newTask.title,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    });
  };

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      // refetch, update tasks cache
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const todayUpcoming = [
    { label: "Today", count: 5 },
    { label: "Upcoming", count: 12 },
  ];

  // retrieve the categories from task list
  const categoryList = useMemo(() => {
    return ["All", ...new Set(tasks.map((task) => task.category || "General"))];
  }, [tasks]);

  // filter tasks
  const filteredTasks =
    selectedCategory === "All"
      ? tasks
      : tasks.filter(
          (task) => (task.category || "General") === selectedCategory,
        );

  // get count for specific category
  const getCount = (category) => {
    return tasks.filter((task) => (task.category || "General") === category)
      .length;
  };

  // get count for incomplete tasks
  const incompleteTasks = tasks.filter((task) => task.status !== "complete");

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="min-w-0 flex-1">
        <TopNav />
        <div className="flex min-w-0 min-h-screen flex-1">
          {/* Tasklist side bar */}
          <aside className="w-[220px] border-r border-border bg-background px-6 py-8">
            <nav className="space-y-6">
              <div className="space-y-1">
                {todayUpcoming.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setActiveView(item.label)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                      item.label === activeView
                        ? "font-serif font-semibold text-foreground"
                        : "font-serif text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <div className="px-3 pb-2 font-serif text-xs uppercase tracking-wide text-muted-foreground">
                  Folders
                </div>
                {categoryList.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveView(category)}
                    className={`flex w-full items-center justify-between px-3 py-2 font-serif text-sm transition-colors ${
                      activeView === category
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{category}</span>
                    <span className="text-xs text-muted-foreground">
                      {getCount(category)}
                    </span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          <main className="px-12 py-8">
            <div className="space-y-0">
              <div className="mb-8">
                <h1 className="font-serif text-2xl text-foreground">Today</h1>
                <p className="mt-1 font-serif text-sm text-muted-foreground">
                  {incompleteTasks.length} tasks remaining
                </p>
              </div>
            </div>

            {/* Tasks list */}
            <div className="divide-y divide-border/50">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  onMouseEnter={() => setHoveredTask(task._id)}
                  onMouseLeave={() => setHoveredTask(null)}
                  className={`group flex items-center gap-4 py-4 transition colors`}
                >
                  {/* Button to remove task */}
                  <button
                    onClick={() => deleteTaskMutation.mutate(task._id)}
                    className={`h-4 w-4 rounded-full border-2 transition-colors ${
                      task.status === "complete"
                        ? "border-accent bg-accent"
                        : "border-muted-foreground hover:border-foreground"
                    }`}
                  />
                  <div className="flex flex-1 items-center gap-3">
                    <span className={`font-serif text-[15px] text-foreground`}>
                      {task.title}
                    </span>
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${priorityColors[task.priority]}`}
                    />

                    <span className="font-serif text-sm text-muted-foreground">
                      {task.dueDate}
                    </span>
                  </div>

                  {/* Start Focus session hover */}
                  <button
                    className={`font-serif text-sm text-muted-foreground transition-opacity hover:text-foreground ${hoveredTask === task._id ? "opacity-100" : "opacity-0"}`}
                  >
                    Start Focus Session
                  </button>
                </div>
              ))}
            </div>
            {/* Create task form */}
            <div className="mt-6 border-t border-border/50 pt-6">
              {!isCreating ? (
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-4 w-4" />
                  <span className="font-serif text-[15px]">Add new task</span>
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="Task name..."
                    autoFocus
                    className="w-full bg-transparent"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTask(e)}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
