import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      credentials: "include",  // IMPORTANT: sends cookies
    })
      .then((res) => {
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setIsAuth(false);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
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
