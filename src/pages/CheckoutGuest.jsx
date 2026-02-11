// src/pages/CheckoutGuest.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuest } from "../context/GuestContext.jsx";
import { usePO } from "../context/PurchaseOrderContext.jsx";
import "./CSS/checkout.css";

const API_URL = import.meta.env.VITE_API_URL;

const CheckoutGuest = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setGuest, endGuestSession } = useGuest(); // add endGuestSession
  const { clearPO } = usePO(); // Clear any previous purchase order items

  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create guest in backend
      const guestRes = await fetch(`${API_URL}/api/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const guestData = await guestRes.json();

      if (!guestRes.ok) {
        throw new Error(guestData.error || "Failed to create guest session");
      }

      // 2️⃣ Set guest in context
      setGuest(guestData.guest);

      // Optional: clear any old purchase orders
      clearPO();

      // Redirect to products/category page to add items
      navigate("/category/fashion/women");
    } catch (err) {
      console.error("Guest checkout error:", err);
      setError(err.message || "Failed to proceed as guest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearGuest = () => {
    if (endGuestSession) {
      endGuestSession();
      clearPO();
      navigate("/");
    }
  };

  return (
    <div className="checkout-guest-container">
      <h2>Checkout as Guest</h2>
      <form onSubmit={handleGuestCheckout} className="checkout-form">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {error && <p className="checkout-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Proceeding..." : "Proceed as Guest"}
        </button>

        {/* Optional: Button to clear guest session */}
        <button type="button" onClick={handleClearGuest} className="clear-guest-btn">
          Cancel Guest Checkout
        </button>
      </form>
    </div>
  );
};

export default CheckoutGuest;
