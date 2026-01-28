import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PurchaseOrderForm.css";
import { usePO } from "../context/PurchaseOrderContext.jsx";

export default function PurchaseOrderForm({ items }) {
  const navigate = useNavigate();

  const { poItems, clearPO } = usePO();

  const [authChecked, setAuthChecked] = useState(false); // 🔐 auth state

  const [formData, setFormData] = useState({
    bankName: "",
    accountNo: "",
    routingNo: "",
    customerName: "",
    attn: "",
    address: "",
    tel: "",
    fax: "",
    notes: ""
  });

  const [orderItems, setOrderItems] = useState([]);

  // 🔐 CHECK LOGIN STATUS (REDIRECT IF NOT LOGGED IN)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          { withCredentials: true }
        );
        setAuthChecked(true); // ✅ logged in
      } catch (error) {
        navigate("/signin"); // ❌ not logged in → sign in
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ LOAD ITEMS FROM SUMMARY PAGE
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const addRow = () =>
    setOrderItems([
      ...orderItems,
      { styleNo: "", description: "", color: "", qty: 0, price: 0, total: 0 }
    ]);

  const removeRow = (index) =>
    setOrderItems(orderItems.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/purchase-order`,
        { ...formData, items: orderItems },
        { withCredentials: true } // 🔐 send session cookie
      );

      alert("Purchase order submitted successfully!");
      // clear client-side PO after successful submit
      if (clearPO) clearPO();
      navigate(`/digital-letter-head/${res.data.order._id}`);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        navigate("/signin"); // session expired
      } else {
        alert("Error submitting purchase order");
      }
    }
  };

  // ⛔ DO NOT RENDER UNTIL AUTH IS VERIFIED
  if (!authChecked) {
    return <p>Checking login status...</p>;
  }

  // ⛔ SAFETY CHECK
  if (orderItems.length === 0) {
    return <p>Loading order items...</p>;
  }

  return (
    <div className="purchase-order-form">
      <h2>Purchase Order</h2>

      <form onSubmit={handleSubmit}>
        <h3>BANK DETAILS</h3>
        <div className="input-row">
          <input name="bankName" placeholder="Bank Name" onChange={handleChange} required />
          <input name="accountNo" placeholder="A/C Number" onChange={handleChange} required />
          <input name="routingNo" placeholder="Routing Number" onChange={handleChange} required />
        </div>

        <h3>BUSINESS DETAILS</h3>
        <div className="input-row">
          <input name="customerName" placeholder="Customer Name" onChange={handleChange} required />
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

        <h3>ORDER ITEMS</h3>
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

        <button type="button" onClick={addRow}>+ Add Row</button>
        <button type="submit">Submit Purchase Order</button>
      </form>
    </div>
  );
}
