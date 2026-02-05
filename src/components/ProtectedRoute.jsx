import { Navigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useGuest } from "../context/GuestContext";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { user, loading: userLoading } = useContext(UserContext);
  const { guest } = useGuest();

  if (userLoading) {
    return <div>Loading...</div>;
  }

  // Allow access if user is authenticated OR guest session is active
  if (!user && !guest) {
    return (
      <Navigate
        to="/signin"
        state={{ redirectTo: location.pathname }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
