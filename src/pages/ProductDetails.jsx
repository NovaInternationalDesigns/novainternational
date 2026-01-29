import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { usePO } from "../context/PurchaseOrderContext.jsx";
import "./CSS/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { addToPO, poItems } = usePO();

  const MIN_QTY = 500;

  const [product, setProduct] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showAddedBar, setShowAddedBar] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/products/id/${id}`
        );
        if (!res.ok) throw new Error("Product not found");

        const data = await res.json();
        setProduct(data);

        setOrderItems([
          {
            color: data.colors?.[0] || null,
            size: data.sizes?.[0] || null,
            quantity:
              data.colors?.length > 0 && data.sizes?.length > 0 ? 0 : MIN_QTY,
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const hasVariations =
    product?.colors?.length > 0 && product?.sizes?.length > 0;

  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];
    if (field === "quantity") value = Number(value);
    updated[index][field] = value;
    setOrderItems(updated);
    setValidationError("");
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        color: product.colors?.[0] || null,
        size: product.sizes?.[0] || null,
        quantity: 0,
      },
    ]);
    setValidationError("");
  };

  const removeOrderItem = (index) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
    setValidationError("");
  };

  const totalQuantity = orderItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  const validateTotalQty = () => {
    if (totalQuantity < MIN_QTY) {
      const msg = `Minimum total order quantity is ${MIN_QTY}. Selected: ${totalQuantity}`;
      setValidationError(msg);
      setShowPopup(true);
      return false;
    }
    setValidationError("");
    return true;
  };

  // ADD TO PO (DB-BACKED)
  const handleAddToPO = async () => {
    if (!user || !user._id) {
      alert("Please log in first");
      navigate("/signin");
      return;
    }

    if (!validateTotalQty()) return;

    // Prepare purchase order data
    const poData = orderItems.map((item) => ({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      color: item.color || null,
      size: item.size || null,
    }));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/purchaseOrderDraft/${user._id}/items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ items: poData }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add to Purchase Order");
      }

      const data = await res.json();
      console.log("PO Response:", data);

      // Also add to client-side PO context for immediate UX
      poData.forEach((itm) => {
        addToPO({
          productId: itm.productId,
          name: itm.name,
          price: itm.price,
          quantity: itm.quantity,
          color: itm.color,
          size: itm.size,
        });
      });

      // Show confirmation bar
      setShowAddedBar(true);
    } catch (err) {
      console.error("Error adding PO:", err);
      alert("Error adding to Purchase Order: " + err.message);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return null;

  return (
    <div className="product-details">

      <div className="images-section">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || "/images/no-image.png"}
            alt={product.name}
          />
        </Link>
      </div>

      <div className="info-section">
        <h1>{product.name}</h1>
        <h2 className="price">${product.price}</h2>
        <p className="category">{product.category}</p>
        <p className="description">{product.description}</p>

        {hasVariations ? (
          <div className="order-combinations">
            <h4>Order Combinations</h4>
            {orderItems.map((item, idx) => (
              <div key={idx} className="order-row">
                <select
                  value={item.color || ""}
                  onChange={(e) =>
                    updateOrderItem(idx, "color", e.target.value)
                  }
                >
                  {product.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                <select
                  value={item.size || ""}
                  onChange={(e) =>
                    updateOrderItem(idx, "size", e.target.value)
                  }
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={0}
                  step={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateOrderItem(idx, "quantity", Number(e.target.value))
                  }
                />

                {orderItems.length > 1 && (
                  <button onClick={() => removeOrderItem(idx)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button onClick={addOrderItem}>Add Another Combination</button>
            <p>Total Quantity: {totalQuantity}</p>
            <p className="min-qty-note">
              Minimum total order quantity: <strong>{MIN_QTY}</strong>
            </p>
          </div>
        ) : (
          <div className="single-quantity">
            <label>Quantity:</label>
            <div className="single-qty-wrap">
              <input
                type="number"
                min={MIN_QTY}
                step={1}
                value={orderItems[0]?.quantity || MIN_QTY}
                onChange={(e) =>
                  updateOrderItem(0, "quantity", Number(e.target.value))
                }
              />

            </div>
          </div>
        )}

        <div className="action-buttons">
          {!showAddedBar && (
            <button className="add-po-btn" onClick={handleAddToPO}>
              Add to Purchase Order
            </button>
          )}
        </div>
      

        {/* CONFIRMATION BAR */}
        {showAddedBar && (
          <div className="action-buttons">
              <button onClick={() => navigate("/purchase-order")}>
                View Purchase Order
              </button>
              <button onClick={() => navigate("/")}> {/* Navigate home */}
                Continue Shopping
              </button>
          </div>
        )}
          {showPopup && (
            <div className="po-popup-overlay">
              <div className="po-popup">
                <p>{validationError}</p>
                <div className="po-popup-actions">
                  <button onClick={() => setShowPopup(false)}>OK</button>
                </div>
              </div>
            </div>
          )}
</div>
    </div>
  );
}

export default ProductDetails;
