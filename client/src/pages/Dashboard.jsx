import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { TopNav } from "../components/TopNav";
import { SideBar } from "../components/Sidebar";
import { Navigate } from "react-router-dom";
import api from "../api/axios";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
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

  if (loading) {
    // TODO change to loading screen
    return <div>loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

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
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="min-w-0 flex-1">
        <TopNav />
      </div>
    </div>
  );
}

export default Dashboard;
