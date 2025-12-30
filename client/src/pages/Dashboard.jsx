import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { TopNav } from "../components/TopNav";
import api from "../api/axios";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  // useEffect to fetch tasks on load
  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const res = await api.get("/api/tasks");
        setTasks(res.data);
      }
    };
    fetchTasks();
  }, [user]);

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 18) {
      return "Good afternoon";
    }
    return "Good evening";
  };

  // placeholders
  const briefingCards = [];

  const weeklyData = [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
    </div>
  );
}

export default Dashboard;
