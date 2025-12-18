import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  // Product-specific minimum quantity (fallback to 500)
  const MIN_QTY = product.minQty || 500;

  const [qty, setQty] = useState(MIN_QTY);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || ""
  );

  const handleQtyChange = (value) => {
    if (value < MIN_QTY) {
      setQty(MIN_QTY);
      return;
    }
    setQty(value);
  };

  const validateQty = () => {
    if (qty < MIN_QTY) {
      alert(`Minimum order quantity for this product is ${MIN_QTY}`);
      return false;
    }
    return true;
  };

  const handleAddToPO = () => {
    if (!validateQty()) return;

    const poItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      quantity: qty,
    };

    console.log("Add to Purchase Order:", poItem);
    // TODO: send to context / redux / API
  };

  const handleBuyNow = () => {
    if (!validateQty()) return;

    const order = {
      productId: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      quantity: qty,
    };

    navigate("/checkout", { state: order });
  };

  return (
    <div className="product-card">
      <img
        src={product.images?.[0] || "/images/no-image.png"}
        alt={product.name}
        className="product-image"
        onClick={() => navigate(`/product/${product._id}`)}
      />

      <h3 className="product-name" onClick={() => navigate(`/product/${product._id}`)}>{product.name}</h3>
      <p className="price">${product.price}</p>

      {/* COLORS */}
      {product.colors?.length > 0 && (
        <div className="colors-group">
          <h4>Select Color:</h4>
          <div className="color-options">
            {product.colors.map((color) => (
              <button
                key={color}
                className={`color-btn ${
                  selectedColor === color ? "selected" : ""
                }`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUANTITY */}
      <div className="qty-group">
        <h4>Quantity:</h4>
        <input
          type="number"
          min={MIN_QTY}
          value={qty}
          onChange={(e) => handleQtyChange(Number(e.target.value))}
        />
        <p className="min-qty-note">
          Minimum order quantity: <strong>{MIN_QTY}</strong>
        </p>
      </div>

      {/* ACTION BUTTONS */}
      <div className="action-buttons">
        <button className="buy-now-btn" onClick={handleBuyNow}>
          Buy Now
        </button>
        <button className="add-po-btn" onClick={handleAddToPO}>
          Add to Purchase Order
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
