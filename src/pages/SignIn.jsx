import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setUserNotFound(false);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.message === "User not found") {
          setUserNotFound(true); // Show account creation option
        } else {
          setError(data.message || "Login failed");
        }
        setLoading(false);
        return;
      }

      // Success: redirect
      setLoading(false);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {userNotFound && (
        <div className="signin-options">
          <p>No account yet?</p>
          <Link to="/signup">
            <button>Create an Account</button>
          </Link>
          <p>Or checkout as a guest:</p>
          <button onClick={() => navigate("/checkout-guest")}>Checkout as Guest</button>
        </div>
      )}
    </div>
  );
}

export default SignIn;
