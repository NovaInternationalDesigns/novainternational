import React, { useEffect, useState } from "react";

function Accessories() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/products/all`)
      .then((res) => res.json())
      .then((data) => {
        const accessories = data.filter((p) => p.category === "Accessories");
        setProducts(accessories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [API_URL]);

  if (loading) return <p style={{ padding: "20px" }}>Loading products...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Accessories</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {products.map((product) => (
            <div key={product._id} style={{ width: "250px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
              <h3>{product.name}</h3>
              {product.images && product.images.length > 0 ? (
                <img src={product.images[0]} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px", marginBottom: "10px" }} />
              ) : (
                <div style={{ width: "100%", height: "150px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "5px", marginBottom: "10px" }}>
                  <p>No Image</p>
                </div>
              )}
              <p style={{ fontSize: "14px", minHeight: "40px" }}>{product.description}</p>
              <p><strong>Price:</strong> ${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Accessories;
