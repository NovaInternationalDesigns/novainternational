import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./PurchaseOrderForm.css";

export default function PurchaseOrderForm({ product, qty, color }) {
  const navigate = useNavigate();

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

  const [items, setItems] = useState([]);

  // ✅ Pre-fill first row with product data
  useEffect(() => {
    if (product) {
      setItems([
        {
          styleNo: product._id,
          description: product.name,
          color: color || "",
          qty: qty,
          price: product.price,
          total: qty * product.price
        }
      ]);
    }
  }, [product, qty, color]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "qty" || field === "price") {
      updatedItems[index].total =
        (updatedItems[index].qty || 0) * (updatedItems[index].price || 0);
    }

    setItems(updatedItems);
  };

  const addRow = () =>
    setItems([
      ...items,
      { styleNo: "", description: "", color: "", qty: 1, price: 0, total: 0 }
    ]);

  const removeRow = (index) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/purchase-order",
        { ...formData, items }
      );

      alert("Purchase order submitted successfully!");
      navigate(`/digital-letter-head/${res.data.order._id}`);
    } catch (error) {
      console.error(error);
      alert("Error submitting purchase order");
    }
  };

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
              <th>Color</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td><input value={item.styleNo} /></td>
                <td><input value={item.description} /></td>
                <td>
                  <input
                    value={item.color}
                    onChange={(e) =>
                      handleItemChange(index, "color", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      handleItemChange(index, "qty", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", Number(e.target.value))
                    }
                  />
                </td>
                <td><input value={item.total} readOnly /></td>
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
