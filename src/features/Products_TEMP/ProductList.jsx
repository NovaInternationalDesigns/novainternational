import React, { useEffect, useState } from "react";

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://novainternational-backend.onrender.com/api/products/all")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      {products.map((p) => (
        <div key={p._id} style={{ border: "1px solid #ccc", margin: "10px" }}>
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>Price: ${p.price}</p>
          <div>
            {p.images.map((url, i) => (
              <img key={i} src={url} alt="" style={{ width: "100px", marginRight: "5px" }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
