import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import "./signin.css";

const SignIn = () => {
  const { signIn } = useContext(UserContext);  // Get the signIn function from context
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",  // Send cookies with the request
      });

      if (res.ok) {
        const data = await res.json();
        signIn(data.user);  // Update user context
        navigate("/");  // Redirect to home page
      } else {
        const data = await res.json();
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="signin-container">
      <h2 className="signin-heading">Sign In</h2>
      <form className="signin-form" onSubmit={handleSubmit}>
        <input
          className="signin-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="signin-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="signin-button" type="submit">
          Sign In
        </button>
        {error && <p className="signin-error">{error}</p>}
      </form>
    </div>
  );
};

export default SignIn;
