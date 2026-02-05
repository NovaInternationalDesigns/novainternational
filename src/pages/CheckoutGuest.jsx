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
  const { setGuest } = useGuest(); // Update guest context
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
      // 1. Create guest in backend database
      const guestRes = await fetch(`${API_URL}/api/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          email: email.trim() 
        }),
      });

      if (!guestRes.ok) {
        const errData = await guestRes.json();
        throw new Error(errData.error || "Failed to create guest session");
      }

      const guestData = await guestRes.json();

      // 2. Set guest in context (includes _id from DB)
      setGuest(guestData.guest);

      // 3. Clear any old purchase orders (optional)
      clearPO();

      // 4. Redirect to products/category page to add items to purchase order
      navigate("/category/fashion/women");
    } catch (err) {
      setError("Failed to proceed as guest. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
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
      </form>
    </div>
  );
};

export default CheckoutGuest;
