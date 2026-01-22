// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user if authenticated
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signIn = (userData) => {
    setUser(userData);
  };

  const signOut = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </UserContext.Provider>
  );
};
