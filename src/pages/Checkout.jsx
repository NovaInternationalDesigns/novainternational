// src/pages/Checkout.jsx
import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CSS/checkout.css";

import { usePO } from "../context/PurchaseOrderContext.jsx";
import { useGuest } from "../context/GuestContext.jsx";
import { UserContext } from "../context/UserContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

// helpers
const getQty = (item) => Number(item.qty ?? item.quantity ?? item.quantityOrdered ?? 0);
const getPrice = (item) => Number(item.price ?? item.unitPrice ?? 0);

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { guest } = useGuest();
  const { user } = useContext(UserContext);
  const { purchaseOrderId } = usePO();

  const { items = [], form = {} } = location.state || {};
  const [orderData] = useState(items);

  const [shippingInfo, setShippingInfo] = useState({
    name: guest?.name || user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Block access if no user and no guest
  useEffect(() => {
    if (!user && !guest) {
      navigate("/checkout-guest");
    }
  }, [user, guest, navigate]);

  // Redirect home if no items
  useEffect(() => {
    if (!orderData.length) navigate("/");
  }, [orderData, navigate]);

  const totalAmount = orderData.reduce(
    (acc, item) => acc + getQty(item) * getPrice(item),
    0
  );

  const formattedTotal = totalAmount.toFixed(2);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleStripeCheckout = async () => {
    setError("");

    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.country) {
      setError("Please fill out all shipping information.");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Save Order
      const saveOrderRes = await fetch(`${API_URL}/api/purchase-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: orderData.map((item) => ({
            ...item,
            qty: getQty(item),
            price: getPrice(item),
          })),
          shippingInfo,
          totalAmount,
          form,
          purchaseOrderId,
          ownerType: guest ? "Guest" : "User",
          ownerId: guest?._id || user?._id,
        }),
      });

      const savedOrder = await saveOrderRes.json();

      if (!saveOrderRes.ok) {
        throw new Error(savedOrder.error || "Failed to save order");
      }

      // 2️⃣ Create Stripe Checkout Session
      const sessionRes = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: savedOrder.order._id }),
      });

      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.url) {
        throw new Error(sessionData.error || "Stripe session creation failed");
      }

      // 3️⃣ Redirect to Stripe Hosted Checkout
      window.location.assign(sessionData.url);

    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to start payment. Please try again.");
      setLoading(false);
    }
  };

  if (!user && !guest) return null;

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      {/* Order Summary */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {orderData.map((item, index) => {
            const qty = getQty(item);
            const price = getPrice(item);
            const lineTotal = (qty * price).toFixed(2);

            return (
              <li key={index}>
                <p>{item.name || item.description || "Product"}</p>
                <p>{qty} × ${price.toFixed(2)}</p>
                <p>Total: ${lineTotal}</p>
              </li>
            );
          })}
        </ul>

        <p className="order-total">
          <strong>Total Order Value: ${formattedTotal}</strong>
        </p>
      </div>

      {/* Shipping Info */}
      <div className="checkout-form">
        <h4>Shipping Information</h4>

        <input name="name" placeholder="Full Name" value={shippingInfo.name} onChange={handleInputChange} disabled={loading} />
        <input name="address" placeholder="Address" value={shippingInfo.address} onChange={handleInputChange} disabled={loading} />
        <input name="city" placeholder="City" value={shippingInfo.city} onChange={handleInputChange} disabled={loading} />
        <input name="postalCode" placeholder="Postal Code" value={shippingInfo.postalCode} onChange={handleInputChange} disabled={loading} />
        <input name="country" placeholder="Country" value={shippingInfo.country} onChange={handleInputChange} disabled={loading} />

        {error && (
          <p className="payment-error" style={{ color: "crimson" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleStripeCheckout}
          className="place-order-btn"
          disabled={loading}
        >
          {loading ? "Redirecting to secure payment..." : `Pay $${formattedTotal}`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
