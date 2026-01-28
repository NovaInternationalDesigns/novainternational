import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./DigitalLetterHead.css";

function DigitalLetterHead() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/purchase-order/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  const totalAmount = order.items?.reduce((sum, item) => sum + (item.total || 0), 0);

  return (
    <div className="digital-letterhead">
  <div className="letterhead-logo">
    <img src="/images/logo.png" alt="Company Logo" />
  </div>

  <h1>Digital Purchase Order</h1>

    <div className="header-section">
  <div className="header-left">
    <p>Company: {order.customerName}</p>
    <p>ATTN: {order.attn}</p>
    <p>Address: {order.address}</p>
    <p>Tel: {order.tel}</p>
    {order.fax && <p>Fax: {order.fax}</p>}
  </div>

  <div className="header-right">
    <p>Bank: {order.bankName}</p>
    <p>A/C No: {order.accountNo}</p>
    <p>Routing No: {order.routingNo}</p>
    {order.notes && <p>Notes: {order.notes}</p>}
  </div>
</div>

  <h3>Order Items</h3>
  <table className="letterhead-table">
    <thead> 
      <tr>
        <th>Style No.</th>
        <th>Size</th>
        <th>Description</th>
        <th>Color</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      {order.items?.map((item, index) => (
        <tr key={index}>
          <td>{item.styleNo}</td>
          <td>{item.size || "-"}</td>
          <td>{item.description}</td>
          <td>{item.color}</td>
          <td>{item.qty}</td>
          <td>${item.price.toFixed(2)}</td>
          <td>${item.total.toFixed(2)}</td>
        </tr>
      ))}
      <tr>
        <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>Grand Total:</td>
        <td style={{ fontWeight: "bold" }}>${totalAmount.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <button onClick={() => window.print()}>Print / Save PDF</button>

  <div className="letterhead-footer">
    <p>Phone: +1 708 334 8942 | Email: ritika@novainternationaldesigns.com | Address: 1755 Park Street, Naperville, IL </p>
  </div>
</div>

  );
}

export default DigitalLetterHead;
