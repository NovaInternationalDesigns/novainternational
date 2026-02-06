import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { usePO } from "../context/PurchaseOrderContext"; // make sure path is correct
import { useGuest } from "../context/GuestContext"; // for guest session
import "./CSS/orderConfirmation.css";

export default function OrderConfirmation() {
  const [order, setOrder] = useState(null);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const API_URL = import.meta.env.VITE_API_URL || "";
  const { clearPO } = usePO();
  const { endGuestSession } = useGuest(); // get guest session handler
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`${API_URL}/api/payment/order/${sessionId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setOrder(data);

        // Clear the frontend purchase order
        clearPO();

        // End guest session automatically
        endGuestSession();

        // Optional: redirect after 5s (if you want to auto go home)
        // setTimeout(() => navigate("/"), 5000);
      } catch (err) {
        console.error("Fetch order error:", err);
      }
    };

    fetchOrder();
  }, [sessionId, API_URL, clearPO, endGuestSession, navigate]);

  if (!order) return <div>Loading...</div>;

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
            <span>Order Total:</span> ${order.totalAmount}
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
          <span>${order.totalAmount}</span>
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
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}
