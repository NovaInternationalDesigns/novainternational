import React, { createContext, useState, useEffect, useRef } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const didFetch = useRef(false);

  const fetchUser = async () => {
    if (didFetch.current) return;   // HARD STOP

    didFetch.current = true;        // set immediately to prevent spam

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
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

  useEffect(() => {
    fetchUser();
  }, []);

  const signUp = async (name, email, password) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    setUser(data.user);
    return data;
  };

  const signIn = async (email, password) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    setUser(data.user);
    return data;
  };

  const signOut = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    didFetch.current = false; // allow re-fetch later if needed
    window.location.href = "/";
  };

  return (
    <UserContext.Provider value={{ user, signUp, signIn, signOut, loading }}>
      {children}
    </UserContext.Provider>
  );
};