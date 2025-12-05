import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Category() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(
          item => item.category.toLowerCase() === category.toLowerCase()
        );

        setProducts(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
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
            <div className="product-card" key={product._id}>
              <img 
                src={product.images?.[0] || "/images/no-image.png"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <p className="category">{product.category}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Category;
