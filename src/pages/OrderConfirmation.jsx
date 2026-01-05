import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <h2>Thank You!</h2>
      <p>Your order <strong>{orderId}</strong> has been submitted successfully.</p>
      <p>We have sent email notifications to you and the owner. Your order is being processed.</p>

      <button onClick={() => navigate("/")}>Continue Shopping</button>
      <button onClick={() => navigate(`/purchase-order-summary`)}>View Order</button>
    </div>
  );
}
