import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

// Create context object
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the user info when the app starts
  useEffect(() => {
    // async function to retrieve user info
    const checkUserLoggedIn = async () => {
      try {
        const { data } = await api.get("/auth/current_user");
        setUser(data);
      } catch (error) {
        // If error (401), user is not logged in, leave user as null
        console.log("Not logged in");
        setUser(null);
      } finally {
        // Remove loading icon
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
