import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


function CheckoutGuest() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Optional: create a temporary guest in backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/purchase-order/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to proceed as guest");
        setLoading(false);
        return;
      }

      // Redirect to checkout page with guest info
      setLoading(false);
      navigate("/checkout");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="checkout-guest-container">
      <h2>Checkout as Guest</h2>

      <form onSubmit={handleGuestCheckout}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Proceeding..." : "Proceed as Guest"}
        </button>

        {error && <p className="checkout-error">{error}</p>}
      </form>
    </div>
  );
}

export default CheckoutGuest;