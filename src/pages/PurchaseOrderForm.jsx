import { useState } from "react";
import axios from "axios";
import "./PurchaseOrderForm.css";

export default function PurchaseOrderForm() {
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

  const [items, setItems] = useState([{ styleNo: "", description: "", color: "", qty: 1, price: 0, total: 0 }]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === "qty" || field === "price") updatedItems[index].total = (updatedItems[index].qty || 0) * (updatedItems[index].price || 0);
    setItems(updatedItems);
  };

  const addRow = () => setItems([...items, { styleNo: "", description: "", color: "", qty: 1, price: 0, total: 0 }]);
  const removeRow = (index) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
        !formData.bankName ||
        !formData.accountNo ||
        !formData.routingNo ||
        !formData.customerName ||
        !formData.attn ||
        !formData.address ||
        !formData.tel
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    // Validate telephone (simple regex for digits)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.tel.replace(/\D/g, ""))) {
        alert("Please enter a valid telephone number.");
        return;
    }

    // Validate order items
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.styleNo || !item.description || !item.color) {
        alert(`Please fill in all details for Order Items ${i + 1}.`);
        return;
        }
        if (item.qty <= 0 || item.price < 0) {
        alert(`Please enter valid quantity and price for Order item ${i + 1}.`);
        return;
        }
    }

    // Submit form if validation passes
    try {
        await axios.post("http://localhost:5000/api/purchase-order", { ...formData, items });
        alert("Purchase order submitted successfully!");
        // Reset form if needed
        setFormData({
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
        setItems([{ styleNo: "", description: "", color: "", qty: 1, price: 0, total: 0 }]);
    } catch (error) {
        console.error(error);
        alert("Error submitting purchase order");
    }
    };


  return (
    <div className="purchase-order-form">
      <h2>Digital Purchase Order</h2>
      <form onSubmit={handleSubmit}>

        <div className="po-header">
          <h3>1755 Park St, Second Floor, Naperville, IL 60565</h3>
          <h3>Tel: 224-454-1513</h3>
          <h3>Email: novainternationaldesigns@gmail.com</h3>
        </div>

        {/* Bank Info */}
        <h3>BANK DETAILS</h3>
        <div className="input-row">
          <input type="text" name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleChange} required />
          <input type="text" name="accountNo" placeholder="A/C Number" value={formData.accountNo} onChange={handleChange} required />
          <input type="text" name="routingNo" placeholder="Routing Number" value={formData.routingNo} onChange={handleChange} required />
        </div>

        {/* Customer Info */}
        <h3>CUSTOMER DETAILS</h3>
        <div className="input-row">
          <input type="text" name="customerName" placeholder="Customer Name" value={formData.customerName} onChange={handleChange} required />
          <input type="text" name="attn" placeholder="ATTN" value={formData.attn} onChange={handleChange} required />
          <input type="tel" name="tel" placeholder="Telephone Number" value={formData.tel} onChange={handleChange} required />
          <input type="text" name="fax" placeholder="Fax Number" value={formData.fax} onChange={handleChange} />
        </div>
        <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required></textarea>

        {/* Order Items */}
        <h3>ORDER ITEMS</h3>    
        <table className="po-table">
          <thead>
            <tr>
              <th>Style No.</th>
              <th>Description</th>
              <th>Color</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td><input type="text" placeholder="Style No" value={item.styleNo} onChange={(e) => handleItemChange(index, "styleNo", e.target.value)} /></td>
                <td><input type="text" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} /></td>
                <td><input type="text" placeholder="Color" value={item.color} onChange={(e) => handleItemChange(index, "color", e.target.value)} /></td>
                <td><input type="number" min="1" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, "qty", Number(e.target.value))} /></td>
                <td><input type="number" min="0" placeholder="Price" value={item.price} onChange={(e) => handleItemChange(index, "price", Number(e.target.value))} /></td>
                <td><input type="number" value={item.total} readOnly /></td>
                <td><button type="button" onClick={() => removeRow(index)}>X</button></td>
              </tr>
            ))}
          </tbody>  
        </table>
        <div className="add-row-container">
            <button type="button" onClick={addRow}>+ Add Row</button>
        </div>

        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange}></textarea>

        <button type="submit">Submit Purchase Order</button>
      </form>
    </div>
  );
}
