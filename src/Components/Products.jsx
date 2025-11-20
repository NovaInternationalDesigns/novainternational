import React from "react";
import "./ProductSection.css";

const products = [
  { id: 1, title: "Product A", desc: "High quality item." },
  { id: 2, title: "Product B", desc: "Best seller product." },
  { id: 3, title: "Product C", desc: "Customer favorite." },
];

const ProductSection = () => {
  return (
    <section className="products">
      <h2>Our Products</h2>
      <div className="product-list">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
