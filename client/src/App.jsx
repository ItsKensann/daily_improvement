import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SidebarProvider } from "./context/SidebarContext";
import "./index.css";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </BrowserRouter>
        </SidebarProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
