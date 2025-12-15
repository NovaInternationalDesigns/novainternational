import { Link } from "react-router-dom";
import "./productcard.css";

function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="product-card-link"
    >
      <div className="product-card">
        <img
          src={product.images?.[0] || "/images/no-image.png"}
          alt={product.name}
        />

        <h3>{product.name}</h3>
        <p className="price">${product.price}</p>
        <p className="category">{product.category}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
