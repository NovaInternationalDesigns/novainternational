// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuth = localStorage.getItem("isAuthenticated");
  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate
        to="/signin"
        state={{
          redirectTo: location.pathname,
          order: location.state
        }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
