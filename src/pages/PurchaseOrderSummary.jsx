import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PurchaseOrderForm from "./PurchaseOrderForm";
import "./PurchaseOrderSummary.css";

export default function PurchaseOrderSummary() {
  const location = useLocation();
  const navigate = useNavigate();

  const items = location.state?.items || [];

  if (items.length === 0) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No items found in Purchase Order</h2>
        <p>Please add products before submitting a PO.</p>

        <button onClick={() => navigate("/")}>
          Go Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="po-summary">
      <h1>Purchase Order Summary</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Product</th>
            <th>Color</th>
            <th>Size</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>{item.name}</td>
              <td>{item.color || "-"}</td>
              <td>{item.size || "-"}</td>
              <td>{item.quantity}</td>
              <td>${item.price}</td>
              <td>${item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <PurchaseOrderForm items={items} />

      <div className="actions">
        <button className="continue-btn" onClick={() => navigate("/")}>
            Continue Shopping
        </button>
        </div>
    </div>
  );
}
