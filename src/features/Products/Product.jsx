import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import "./Product.css";

function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        if (!res.ok) throw new Error("Failed to load products");

        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="product-page">
      <h1>All Products</h1>

      <div className="product-grid">
        {products.map(product => (
          <Link 
            to={`/product/${product._id}`}  // ✅ Clicking goes to details page
            className="product-card-link" 
            key={product._id}
          >
      <div className="product-card" key={product._id}>
        <img src={product.images?.[0] || "/images/no-image.png"} alt={product.name} />
        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        <p className="category">{product.category}</p>
      </div>

          </Link>
        ))}
      </div>
    </div>
  );
}

export default Product;
