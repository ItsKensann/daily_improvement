import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

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
    e.preventDefault();
    try {
      const res = await api.post("/api/tasks", {
        title: newTask,
        priority: "medium",
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

  return (
    <div style={{ padding: "50px" }}>
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
    </div>
  );
}

export default Dashboard;
