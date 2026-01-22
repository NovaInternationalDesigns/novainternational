import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../features/products/ProductCard";
import "./category.css"; 

function Category() {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to format strings: replace hyphens with spaces and uppercase
  const formatTitle = (str) => {
    if (!str) return "";
    return str.replace(/-/g, " ").toUpperCase();
  };

  useEffect(() => {
    setLoading(true);

    let url = `${import.meta.env.VITE_API_URL}/api/products?category=${category}`;
    if (subcategory) url += `&subcategory=${subcategory}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, subcategory]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="product-page">
      
      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products found</p>
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
