
import { useLocation } from "react-router-dom";
import "./checkout.css";

function Checkout() {
  const { state } = useLocation();

  if (!state) {
    return <h2 className="checkout-empty">No product selected</h2>;
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-card">
        <div className="checkout-row">
          <span>Product</span>
          <strong>{state.name}</strong>
        </div>

        <div className="checkout-row">
          <span>Price</span>
          <strong>USD {state.price}</strong>
        </div>

        <div className="checkout-row">
          <span>Color</span>
          <strong>{state.color}</strong>
        </div>

        <div className="checkout-row">
          <span>Quantity</span>
          <strong>{state.quantity}</strong>
        </div>

        <hr />

        <div className="checkout-total">
          <span>Total</span>
          <strong>${state.price * state.quantity}</strong>
        </div>

        <button className="checkout-btn">
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default Checkout;
