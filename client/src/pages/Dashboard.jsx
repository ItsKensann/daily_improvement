import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

function Dashboard() {
  // Consume context
  const { user, loading } = useContext(AuthContext);

  // 1. Wait for loading to finish
  if (loading) return <div>Loading...</div>;

  // 2. If no user, kick them back to Landing (Protection)
  if (!user) return <Navigate to="/" />;

  // 3. Render the Dashboard
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Dashboard</h1>

      <h2>Welcome back, {user.displayName}</h2>

      {/* Visual Debugging: See all the data we have */}
      <pre
        style={{
          textAlign: "left",
          background: "#141414ff",
          padding: "20px",
          margin: "20px",
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}

export default Dashboard;
