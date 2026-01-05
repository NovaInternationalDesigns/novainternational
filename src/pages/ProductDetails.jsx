import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const MIN_QTY = 500;

  const [product, setProduct] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/id/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data);

        setOrderItems([{
          color: data.colors?.[0] || "",
          size: data.sizes?.[0] || "",
          quantity: MIN_QTY
        }]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const hasVariations = product?.colors?.length > 0 && product?.sizes?.length > 0;

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return null;

  const updateOrderItem = (index, field, value) => {
    const newItems = [...orderItems];
    if (field === "quantity") value = Number(value);
    newItems[index][field] = value;
    setOrderItems(newItems);
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        color: product.colors?.[0] || "",
        size: product.sizes?.[0] || "",
        quantity: 0
      }
    ]);
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const totalQuantity = orderItems.reduce((acc, item) => acc + Number(item.quantity || 0), 0);

  const validateTotalQty = () => {
    if (hasVariations && totalQuantity < MIN_QTY) {
      alert(`Minimum total order quantity is ${MIN_QTY}. Selected: ${totalQuantity}`);
      return false;
    }
    return true;
  };

  const handleAddToPO = () => {
    if (!validateTotalQty()) return;
    const poData = orderItems.map(item => ({
      productId: product._id,
      name: product.name,
      price: product.price,
      color: hasVariations ? item.color : null,
      size: hasVariations ? item.size : null,
      quantity: item.quantity
    }));
    navigate("/purchase-order-summary", { state: { items: poData } });
  };

  const handleBuyNow = () => {
    if (!validateTotalQty()) return;
    const orderData = orderItems.map(item => ({
      productId: product._id,
      name: product.name,
      price: product.price,
      color: hasVariations ? item.color : null,
      size: hasVariations ? item.size : null,
      quantity: item.quantity
    }));
    navigate("/checkout", { state: { items: orderData } });
  };

  return (
    <div className="product-details">
      <div className="images-section">
        <img src={product.images?.[0] || "/images/no-image.png"} alt={product.name} />
      </div>

      <div className="info-section">
        <h1>{product.name}</h1>
        <h2 className="price">${product.price}</h2>
        <p className="category">{product.category}</p>
        <p className="description">{product.description}</p>

        {hasVariations ? (
          <div className="order-combinations">
            <h4>Order Combinations (Color + Size + Quantity)</h4>
            {orderItems.map((item, idx) => (
              <div key={idx} className="order-row">
                <select value={item.color} onChange={e => updateOrderItem(idx, "color", e.target.value)}>
                  {product.colors.map(color => <option key={color} value={color}>{color}</option>)}
                </select>
                <select value={item.size} onChange={e => updateOrderItem(idx, "size", e.target.value)}>
                  {product.sizes.map(size => <option key={size} value={size}>{size}</option>)}
                </select>
                <input type="number" min={0} value={item.quantity} onChange={e => updateOrderItem(idx, "quantity", e.target.value)} />
                {orderItems.length > 1 && <button onClick={() => removeOrderItem(idx)}>Remove</button>}
              </div>
            ))}
            <button onClick={addOrderItem}>Add Another Combination</button>
            <p>Total Quantity: {totalQuantity}</p>
            <p className="min-qty-note">Minimum total order quantity: <strong>{MIN_QTY}</strong></p>
          </div>
        ) : (
          <div className="single-quantity">
            <label>Quantity:</label>
            <input type="number" min={MIN_QTY} value={orderItems[0]?.quantity || MIN_QTY} onChange={e => updateOrderItem(0, "quantity", Number(e.target.value))} />
            <p className="min-qty-note">Minimum order quantity: <strong>{MIN_QTY}</strong></p>
          </div>
        )}

        <div className="action-buttons">
          <button className="add-po-btn" onClick={handleAddToPO}>Add to Purchase Order</button>
          <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
