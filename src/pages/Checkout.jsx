import React, { useEffect, useState, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./CSS/checkout.css";

import { usePO } from "../context/PurchaseOrderContext.jsx";
import { useGuest } from "../context/GuestContext.jsx";
import { UserContext } from "../context/UserContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const TAX_RATE = 0.07;
const SHIPPING_FLAT = 15;
const FREE_SHIPPING_THRESHOLD = 500;

const getQty = (item) => Number(item.qty ?? item.quantity ?? 0);
const getPrice = (item) => Number(item.price ?? item.unitPrice ?? 0);

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { guest, endGuestSession } = useGuest();
  const { user, loading } = useContext(UserContext);
  const { purchaseOrderId } = usePO();

  const { items = [], form = {} } = location.state || {};
  const [orderData] = useState(items);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Wait until user loading finishes to avoid redirecting prematurely
    if (!loading) {
      if (!user && !guest) navigate("/checkout-guest");
      if (!orderData.length) navigate("/");
    }
  }, [user, guest, loading, navigate, orderData]);

  // CALCULATIONS
  const subtotal = useMemo(() => orderData.reduce((acc, item) => acc + getQty(item) * getPrice(item), 0), [orderData]);
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const estimatedTax = (subtotal + shippingCost) * TAX_RATE;
  const total = subtotal + shippingCost + estimatedTax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleStripeCheckout = async () => {
    setError("");

    const requiredFields = ["firstName", "address", "city", "zip", "country"];
    const missing = requiredFields.filter((f) => !shippingInfo[f]?.trim());
    if (missing.length) {
      setError("Please fill all required shipping fields.");
      return;
    }

    setSubmitting(true);

    try {
      // Save Purchase Order
      const saveRes = await fetch(`${API_URL}/api/purchase-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          items: orderData,
          shippingInfo,
          subtotal,
          shippingCost,
          estimatedTax,
          totalAmount: total,
          form,
          purchaseOrderId,
          ownerType: guest ? "Guest" : "User",
          ownerId: guest?._id || user?._id,
        }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) throw new Error(saved.error || "Failed to save order");
      const orderId = saved?.order?._id;
      if (!orderId) throw new Error("Order ID not returned");

      // Create Stripe session
      const sessionRes = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) throw new Error(sessionData.error || "Stripe session creation failed");

      if (guest && endGuestSession) endGuestSession();

      window.location.assign(sessionData.url);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Checkout failed");
      setSubmitting(false);
    }
  };

  if (loading) return null;
  if (!user && !guest) return null;

  return (
    <div className="purchase-order-form">
      <h2>Checkout</h2>

      <div className="po-container">
        {/* LEFT COLUMN – SHIPPING */}
        <div className="po-left po-form-section">
          <h3>Shipping Details</h3>

          <div className="input-row">
            <input
              name="firstName"
              placeholder="First Name"
              value={shippingInfo.firstName}
              onChange={handleInputChange}
              required
            />
            <input
              name="lastName"
              placeholder="Last Name"
              value={shippingInfo.lastName}
              onChange={handleInputChange}
            />
          </div>

          <input
            name="company"
            placeholder="Company"
            value={shippingInfo.company}
            onChange={handleInputChange}
          />

          <textarea
            name="address"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            required
          />

          <div className="input-row">
            <input
              name="city"
              placeholder="City"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
            />
            <input
              name="state"
              placeholder="State"
              value={shippingInfo.state}
              onChange={handleInputChange}
            />
          </div>

          <div className="input-row">
            <input
              name="zip"
              placeholder="ZIP Code"
              value={shippingInfo.zip}
              onChange={handleInputChange}
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={shippingInfo.country}
              onChange={handleInputChange}
              required
            />
          </div>

          <input
            name="phone"
            placeholder="Phone"
            value={shippingInfo.phone}
            onChange={handleInputChange}
          />
        </div>

        {/* RIGHT COLUMN – ORDER SUMMARY */}
        <div className="po-right po-form-section">
          <h3>Purchase Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Estimated Tax</span>
            <span>${estimatedTax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="grand-total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>

          {error && <p className="po-form-error">{error}</p>}

          <button
            type="button"
            onClick={handleStripeCheckout}
            disabled={submitting}
          >
            {submitting ? "Redirecting..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
