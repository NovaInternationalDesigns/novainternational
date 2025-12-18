import { createContext, useContext, useEffect, useState } from "react";

// 1️⃣ Create the Auth Context
const AuthContext = createContext();

// 2️⃣ Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Login function
  const login = (email) => {
    const userData = { email }; // you can add more info like name, id, token
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // The value we pass to context consumers
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user, // true if user exists
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3️⃣ Hook to use Auth Context in any component
export const useAuth = () => useContext(AuthContext);
