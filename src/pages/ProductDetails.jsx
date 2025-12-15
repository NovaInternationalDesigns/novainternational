import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/id/${id}`); //fetch(`http://localhost:5000/api/products/id/${id}` );

        if (!res.ok) {
          throw new Error("Product not found");
        }

        const data = await res.json();
        setProduct(data);

        if (data?.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!product) return null;

  const handleQtyChange = (value) => {
    if (value < 1) return;
    setQty(value);
  };

  const handleAddToPO = () => {
    const poItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      color: selectedColor,
      quantity: qty,
    };

    console.log("Add to Purchase Order:", poItem);
    // later → send to context / redux / API
  };

  return (
    <div className="product-details">
      {/* LEFT IMAGE */}
      <div className="images-section">
        <img
          src={product.images?.[0] || "/images/no-image.png"}
          alt={product.name}
        />
      </div>

      {/* RIGHT INFO */}
      <div className="info-section">
        <h1>{product.name}</h1>
        <h2 className="price">${product.price}</h2>
        <p className="category">{product.category}</p>

        <p className="description">{product.description}</p>

        {/* COLORS */}
        {product.colors?.length > 0 && (
          <div className="colors-group">
            <h4>Select Color:</h4>
            <div className="color-options">
              {product.colors.map(color => (
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
            min="1"
            value={qty}
            onChange={(e) => handleQtyChange(Number(e.target.value))}
          />
        </div>

        {/* ADD TO PO */}
        <button className="add-po-btn" onClick={handleAddToPO}>
          Add to Purchase Order
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
