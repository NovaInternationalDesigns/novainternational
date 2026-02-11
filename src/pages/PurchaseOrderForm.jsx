import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useGuest } from "../context/GuestContext";
import "./CSS/PurchaseOrderForm.css";
import { usePO } from "../context/PurchaseOrderContext.jsx";

export default function PurchaseOrderForm({ items }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { guest } = useGuest();

  const { poItems, clearPO, removeFromPO } = usePO();

  const [authChecked, setAuthChecked] = useState(false); // auth state

  const [formData, setFormData] = useState({
    bankName: "",
    accountNo: "",
    routingNo: "",
    email: "",
    customerName: "",
    attn: "",
    address: "",
    tel: "",
    fax: "",
    notes: ""
  });
  const [formError, setFormError] = useState("");

  const [orderItems, setOrderItems] = useState([]);

  // CHECK LOGIN STATUS (ALLOW USER OR GUEST)
  useEffect(() => {
    // Allow access if user is logged in OR guest session exists
    if (user || guest) {
      setAuthChecked(true);
    } else {
      navigate("/signin");
    }
  }, [user, guest, navigate]);

  // LOAD ITEMS FROM SUMMARY PAGE
  useEffect(() => {
    const source = items && items.length > 0 ? items : poItems;

    if (source && source.length > 0) {
      setOrderItems(
        source.map((item) => ({
          styleNo: item.productId || item.styleNo,
          description: item.name || item.description,
          color: item.color || "",
          size: item.size || "",
          qty: item.quantity ?? item.qty ?? 0,
          price: item.price || 0,
          total: (item.quantity ?? item.qty ?? 0) * (item.price || 0),
        }))
      );
    }
  }, [items, poItems]);

  // PRE-FILL FORM WITH USER/GUEST DATA
  useEffect(() => {
    if (user || guest) {
      setFormData((prev) => ({
        ...prev,
        customerName: user?.name || guest?.name || "",
        email: user?.email || guest?.email || "",
      }));
    }
  }, [user, guest]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") setFormError("");
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...orderItems];
    updated[index][field] = value;

    if (field === "qty" || field === "price") {
      updated[index].total =
        (updated[index].qty || 0) * (updated[index].price || 0);
    }

    setOrderItems(updated);
  };

  const removeRow = async (index) => {
    const item = orderItems[index];

    // Optimistic UI update
    setOrderItems((prev) => prev.filter((_, i) => i !== index));

    // If this item maps to a draft PO item (has productId/styleNo), remove from server and PO context
    const productId = item.productId || item.styleNo;
    if (productId) {
      try {
        await removeFromPO({ productId, color: item.color, size: item.size });
      } catch (err) {
        console.error('Failed to remove PO item on server:', err);
        setFormError('Failed to remove item from Purchase Order');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side email validation (only if provided)
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(formData.email).toLowerCase())) {
        setFormError("Please enter a valid email address.");
        return;
      }
    }
    // Compute grand total and navigate to Checkout with order data
    const totalAmount = orderItems.reduce((sum, it) => sum + (it.qty || 0) * (it.price || 0), 0);
    navigate('/checkout', { state: { items: orderItems, form: formData, totalAmount } });
  };

  // DO NOT RENDER UNTIL AUTH IS VERIFIED
  if (!authChecked) {
    return <p>Checking login status...</p>;
  }

  // SAFETY CHECK
  if (orderItems.length === 0) {
    return <p>Loading order items...</p>;
  }

  return (
    <div className="purchase-order-form">
  <h2>Purchase Order</h2>

  {/* ORDER ITEMS TABLE */}
  <div className="po-left">
    <table className="po-table">
      <thead>
        <tr>
          <th>Style</th>
          <th>Description</th>
          <th>Size</th>
          <th>Color</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orderItems.map((item, index) => (
          <tr key={index}>
            <td><input value={item.styleNo} readOnly /></td>
            <td><input value={item.description} readOnly /></td>
            <td>
              <input
                value={item.size}
                onChange={(e) => handleItemChange(index, "size", e.target.value)}
              />
            </td>
            <td>
              <input
                value={item.color}
                onChange={(e) => handleItemChange(index, "color", e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                value={item.qty}
                onChange={(e) => handleItemChange(index, "qty", Number(e.target.value))}
                min={0}
              />
            </td>
            <td>
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
              />
            </td>
            <td>
              <input value={item.total} readOnly />
            </td>
            <td>
              <button type="button" onClick={() => removeRow(index)}>X</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="po-container">
    {/* LEFT: Bank Details */}
      <div className="po-right po-form-section">
      <form onSubmit={handleSubmit}>
        <h3>BUSINESS DETAILS</h3>
        <div className="input-row">
          <input name="customerName" placeholder="Customer Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="attn" placeholder="ATTN" onChange={handleChange} required />
          <input name="tel" placeholder="Telephone" onChange={handleChange} required />
          <input name="fax" placeholder="Fax" onChange={handleChange} />
        </div>

        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        {formError && <p className="po-form-error">{formError}</p>}

        <div>
          <strong>Grand Total: $</strong>
          <strong>{orderItems.reduce((sum, it) => sum + (it.qty || 0) * (it.price || 0), 0).toFixed(2)}</strong>
        </div>

        <button type="submit">Proceed to Checkout</button>
      </form>
    </div>

    {/* RIGHT: Business Details */}
     <div className="po-left po-form-section">
      <form>
        <h3>BANK DETAILS</h3>
        <div className="input-row">
          <input name="bankName" placeholder="Bank Name" onChange={handleChange} required />
          <input name="accountNo" placeholder="A/C Number" onChange={handleChange} required />
          <input name="routingNo" placeholder="Routing Number" onChange={handleChange} required />
        </div>
      </form>
    </div>
 
  </div>
</div>

  );
}
