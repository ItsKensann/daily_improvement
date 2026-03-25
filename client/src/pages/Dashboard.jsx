import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { TopNav } from "../components/TopNav";
import { SideBar } from "../components/Sidebar";
import { MetricCards } from "../components/MetricCards";
import { Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { WeeklyChart } from "../components/WeeklyChart";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);

  const queryClient = useQueryClient();

  // query function runs when component is mounted
  const { data: dashboardStats, isLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await api.get("/api/user/dashboard-stats");
      console.log(res.data);
      return res.data;
    },
    enabled: !!user,
  });

  // mutations

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
        <main className="px-12 py-8">
          {/* Greeting */}
          <div className="mb-10 space-y-3">
            <h1 className="font-serif text-3xl tracking-tight text-muted-foreground">
              {getGreeting()}.
            </h1>
            <p className="font-serif text-base text-muted-foreground">
              Your singular focus today is:{" "}
              <b>
                {dashboardStats?.tasks?.topTasks?.[0]?.title ??
                  "No tasks due today"}
              </b>
            </p>
          </div>
          {/* Metrics */}
          <MetricCards stats={dashboardStats} />
          {/* Weekly chart */}
          <WeeklyChart stats={dashboardStats} />

          {/* Bottom side */}
          <div className="mt-12 grid gap-12 lg:grid-cols-2"></div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
