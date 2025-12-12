import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/id/${id}`)
        const data = await res.json();
        setProduct(data);
        if (data?.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      } catch (error) {
        console.error("Error loading product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="product-details">
      {/* LEFT IMAGE */}
      <div className="images-section">
        <img 
          src={product.images?.[0] || "/images/no-image.png"} 
          alt={product.name} 
        />
      </div>

      {/* RIGHT SECTION */}
      <div className="info-section">
        <h1>{product.name}</h1>
        <h2 className="price">${product.price}</h2>
        <p className="category">{product.category}</p>

        {/* Description */}
        <p className="description">{product.description}</p>

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="colors-group">
            <h4>Select Color:</h4>
            <div className="color-options">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`color-btn ${selectedColor === color ? "selected" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="qty-group">
          <h4>Quantity:</h4>
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          />
        </div>

        {/* Add to Purchase Order */}
        <button className="add-po-btn">
          Add to Purchase Order
        </button>
      </div>
    </div>
  );
}

export default ProductDetails;
