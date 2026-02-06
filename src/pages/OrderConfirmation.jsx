// src/pages/OrderConfirmation.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePO } from "../context/PurchaseOrderContext";
import { useGuest } from "../context/GuestContext";
import "./CSS/orderConfirmation.css";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const API_URL = import.meta.env.VITE_API_URL || "";
  const { clearPO } = usePO();
  const { endGuestSession } = useGuest();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payment/order/${sessionId}`);

        if (!res.ok) {
          throw new Error(`Failed to fetch order. Status: ${res.status}`);
        }

        const data = await res.json();

        if (!data) {
          throw new Error("Order not found.");
        }

        setOrder(data);

        // Clear frontend purchase order and guest session
        clearPO();
        endGuestSession();
      } catch (err) {
        console.error("Fetch order error:", err);
        setError(err.message || "Failed to fetch order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [sessionId, API_URL, clearPO, endGuestSession]);

  if (loading) return <div className="loading">Loading your order...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="order-confirmation">
      <h2>
        Thank you for your order, {order.customerName || order.form?.customerName || "Customer"}!
      </h2>
      <p><strong>Purchase Order ID:</strong> {order.purchaseOrderId || order._id}</p>
      <p className="success-text">Your payment was successful.</p>

      <div className="order-summary">
        <div className="order-meta">
          <div>
            <span>Order Total:</span> ${order.totalAmount.toFixed(2)}
          </div>
        </div>

        <ul className="order-items">
          {order.items.map((item, idx) => (
            <li className="order-item" key={idx}>
              <div className="item-name">{item.description || item.name}</div>
              <div className="item-qty">x {item.qty}</div>
              <div className="item-total">${(item.qty * item.price).toFixed(2)}</div>
            </li>
          ))}
        </ul>

        <div className="order-total">
          <span>Total</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {order.shippingInfo?.name && (
        <div className="shipping-info">
          <h4>Shipping Information</h4>
          <p>{order.shippingInfo.name}</p>
          <p>{order.shippingInfo.address}</p>
          <p>
            {order.shippingInfo.city}, {order.shippingInfo.postalCode}
          </p>
          <p>{order.shippingInfo.country}</p>
        </div>
      )}

      <div className="back-home">
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    </div>
  );
}
