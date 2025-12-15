import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../features/products/ProductCard";

function Category() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/products`) //fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          item => item.category.toLowerCase() === category.toLowerCase()
        );
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-page">
      <h1>{category.toUpperCase()}</h1>

      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products found in this category.</p>
        ) : (
          products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default Category;
