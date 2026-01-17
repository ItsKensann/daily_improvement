import React, { useContext, useState, useEffect, useMemo } from "react";
import { TopNav } from "../components/TopNav";
import { SideBar } from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

function Tasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 1. Fetch Tasks on Load
  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
      }
    };
    fetchTasks();
  }, [user]);

  // 2. Function to Add Task
  const addTask = async (e) => {
    const date = new Date().getDate();
    e.preventDefault();
    try {
      const res = await api.post("/api/tasks", {
        title: newTask,
        priority: "medium",
        dueDate: dueDate,
      });
      setTasks([res.data, ...tasks]); // Update UI instantly
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Function to Delete Task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setTasks(tasks.filter((task) => task._id !== id)); // Remove from UI
    } catch (err) {
      console.error(err);
    }
  };

  // retrieve the categories from task list
  const categoryList = useMemo(() => {
    return ["All", ...new Set(tasks.map((task) => task.category || "General"))];
  }, [tasks]);

  // filter tasks
  const filteredTasks =
    selectedCategory === "All"
      ? tasks
      : tasks.filter(
          (task) => (task.category || "General") === selectedCategory
        );

  // get count for specific category
  const getCount = (category) => {
    return tasks.filter((task) => (task.category || "General") === category)
      .length;
  };

  console.log(categoryList);

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="min-w-0 flex-1">
        <TopNav />
        <div className="flex min-w-0 min-h-screen flex-1">
          <aside className="w-[220px] border-r border-border bg-background px-6 py-8">
            {categoryList.map((category) => (
              <button key={category}>
                <span>{category}</span>
                <span>{getCount(category)}</span>
              </button>
            ))}
          </aside>
          <main className="px-12 py-8">
            <h1>My Tasks</h1>

            {/* Simple Form */}
            <form onSubmit={addTask} style={{ marginBottom: "20px" }}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                style={{ padding: "10px", width: "300px" }}
              />
              <button type="submit" style={{ padding: "10px" }}>
                Add
              </button>
            </form>

            {/* Task List */}
            <ul style={{ listStyle: "none", padding: 0 }}>
              {tasks.map((task) => (
                <li
                  key={task._id}
                  style={{
                    background: "#f4f4f4",
                    margin: "5px",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{task.title}</span>
                  <button
                    onClick={() => deleteTask(task._id)}
                    style={{ color: "red" }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
