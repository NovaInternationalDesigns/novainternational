import React, { useEffect, useState } from "react";

function Electronics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products/all")
      .then((res) => res.json())
      .then((data) => {
        // Filter only Electronics
        const electronics = data.filter((p) => p.category === "Electronics");
        setProducts(electronics);
        // setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ padding: "20px" }}>Loading products...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Electronics</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "flex-start"
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                width: "250px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3>{product.name}</h3>

              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginBottom: "10px"
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    backgroundColor: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "5px",
                    marginBottom: "10px"
                  }}
                >
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

export default Electronics;
