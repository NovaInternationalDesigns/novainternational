// src/context/UserContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch current logged-in user from backend
  const fetchUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        credentials: "include", // important for cookies
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Signup new user
  const signUp = async (name, email, password) => {
    try {
      const body = { name, email, password };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // session cookie
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 409) {
          throw new Error(errData.message || "User already exists. Please sign in.");
        }
        if (res.status === 422) {
          throw new Error(errData.message || "Please check signup details and try again.");
        }
        throw new Error(errData.message || "Signup failed");
      }

      const data = await res.json();
      return { user: data.user || null };
    } catch (err) {
      throw new Error(err.message || "Signup failed");
    }
  };

  // Sign in: fetch user from /me
  const signIn = async (userData) => {
    if (userData) {
      setUser(userData);
      setLoading(false);
      return;
    }

    await fetchUser();
  };

  // Logout user
  const signOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  // Fetch user once on app load
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </UserContext.Provider>
  );
};