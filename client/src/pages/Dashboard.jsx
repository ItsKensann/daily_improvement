import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { TopNav } from "../components/TopNav";
import { SideBar } from "../components/Sidebar";
import { MetricCards } from "../components/MetricCards";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { WeeklyChart } from "../components/WeeklyChart";
import { LoadingSpinner } from "../components/LoadingSpinner"; // Import the spinner

function Dashboard() {
  const { user, loading } = useContext(AuthContext);

  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/api/user/dashboard-stats");
      return res.data;
    },
    enabled: !!user,
  });

  // 1. Handle Auth Loading (Full Screen)
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // 2. Handle Unauthorized
  if (!user) {
    return <Navigate to="/" />;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="min-w-0 flex-1">
        <TopNav />
        <main className="px-12 py-8">
          {/* Handle Data Loading (Keep Layout Intact) */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Greeting */}
              <div className="mb-10 space-y-3">
                <h1 className="font-serif text-3xl tracking-tight text-muted-foreground">
                  {getGreeting()}.
                </h1>
                <p className="font-serif text-base text-muted-foreground">
                  Your singular focus today is:{" "}
                  <span className="font-bold text-foreground">
                    {dashboardStats?.tasks?.topTasks?.[0]?.title ??
                      "No tasks due today"}
                  </span>
                </p>
              </div>

              {/* Metrics */}
              <MetricCards stats={dashboardStats} />

              {/* Weekly chart */}
              <WeeklyChart stats={dashboardStats} />

              <div className="mt-12 grid gap-12 lg:grid-cols-2">
                {/* TodayTasks component would go here */}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
