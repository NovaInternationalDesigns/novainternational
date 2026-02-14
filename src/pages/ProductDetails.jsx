import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useGuest } from "../context/GuestContext";
import { usePO } from "../context/PurchaseOrderContext.jsx";
import "./CSS/ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { guest } = useGuest();
  const { addToPO } = usePO();

  const MIN_QTY = 1;

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

        // Start quantity as blank
        setOrderItems([
          {
            color: data.colors?.[0] || null,
            size: data.sizes?.[0] || null,
            quantity: "",
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

  // Allow blank quantity
  const updateOrderItem = (index, field, value) => {
    const updated = [...orderItems];

    if (field === "quantity") {
      if (value === "") {
        updated[index][field] = "";
      } else {
        updated[index][field] = Number(value);
      }
    } else {
      updated[index][field] = value;
    }

    setOrderItems(updated);
    setValidationError("");
  };

  const addOrderItem = () => {
    setOrderItems([
      ...orderItems,
      {
        color: product.colors?.[0] || null,
        size: product.sizes?.[0] || null,
        quantity: "",
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

  const handleAddToPO = async () => {
    if (!user && !guest) {
      alert("Please log in or proceed as guest");
      navigate("/signin");
      return;
    }

    if (!validateTotalQty()) return;

    const poData = orderItems.map((item) => ({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: Number(item.quantity || 0),
      color: item.color || null,
      size: item.size || null,
      images: product.images, // keep image if needed later
    }));

    try {
      const ownerType = user ? "User" : "Guest";
      const ownerId = user?._id || guest?._id;
      const endpoint = `${import.meta.env.VITE_API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}/items`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: poData }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to add to Purchase Order");
      }

      const data = await res.json();
      console.log("PO Response:", data);

      poData.forEach((itm) => {
        addToPO(itm);
      });

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
        <h2 className="price">US$ {product.price}</h2>
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
                  value={item.quantity ?? ""}
                  onChange={(e) =>
                    updateOrderItem(idx, "quantity", e.target.value)
                  }
                />

                {orderItems.length > 1 && (
                  <button onClick={() => removeOrderItem(idx)}>
                    Remove
                  </button>
                )}
              </div>
            ))}

            <button onClick={addOrderItem}>
              Add Another Combination
            </button>

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
                value={orderItems[0]?.quantity ?? ""}
                onChange={(e) =>
                  updateOrderItem(0, "quantity", e.target.value)
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

        {showAddedBar && (
          <div className="action-buttons">
            <button onClick={() => navigate("/purchase-order/form")}>
              View Purchase Order
            </button>
            <button onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        )}

        {showPopup && (
          <div className="po-popup-overlay">
            <div className="po-popup">
              <p>{validationError}</p>
              {/* <div className="po-popup-actions">
                <button onClick={() => setShowPopup(false)}>
                  OK
                </button>
              </div> */}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProductDetails;
