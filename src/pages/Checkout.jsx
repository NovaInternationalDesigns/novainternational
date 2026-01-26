import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve the order data from the previous page's state
  const { items } = location.state || { items: [] };
  
  const [orderData, setOrderData] = useState(items);
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });

  useEffect(() => {
    // If no items are found, redirect to the home page or product page
    if (orderData.length === 0) {
      navigate("/");
    }
  }, [orderData, navigate]);

  const handleInputChange = (e, section) => {
    const { name, value } = e.target;

    if (section === "shipping") {
      setShippingInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    } else if (section === "payment") {
      setPaymentInfo((prevInfo) => ({
        ...prevInfo,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for shipping and payment info
    if (
      !shippingInfo.name ||
      !shippingInfo.address ||
      !shippingInfo.city ||
      !shippingInfo.postalCode ||
      !shippingInfo.country
    ) {
      alert("Please fill out all shipping information.");
      return;
    }

    if (
      !paymentInfo.cardNumber ||
      !paymentInfo.expirationDate ||
      !paymentInfo.cvv
    ) {
      alert("Please fill out all payment information.");
      return;
    }

    // Simulate payment processing
    alert("Order placed successfully! Proceeding to payment...");

    // After successful payment, redirect to order confirmation page or home page
    navigate("/order-confirmation");
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>

      <div className="order-summary">
        <h3>Order Summary</h3>
        <ul>
          {orderData.map((item, index) => (
            <li key={index}>
              <p>{item.name}</p>
              <p>
                {item.quantity} x ${item.price}
              </p>
              <p>Total: ${item.quantity * item.price}</p>
            </li>
          ))}
        </ul>
        <p className="order-total">
          Total Order Value: ${orderData.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
          )}
        </p>
      </div>

      <form className="checkout-form" onSubmit={handleSubmit}>
        {/* Shipping Information */}
        <div className="shipping-section">
          <h4>Shipping Information</h4>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={shippingInfo.name}
            onChange={(e) => handleInputChange(e, "shipping")}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={(e) => handleInputChange(e, "shipping")}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingInfo.city}
            onChange={(e) => handleInputChange(e, "shipping")}
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={shippingInfo.postalCode}
            onChange={(e) => handleInputChange(e, "shipping")}
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingInfo.country}
            onChange={(e) => handleInputChange(e, "shipping")}
          />
        </div>

        {/* Payment Information */}
        <div className="payment-section">
          <h4>Payment Information</h4>
          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={paymentInfo.cardNumber}
            onChange={(e) => handleInputChange(e, "payment")}
          />
          <input
            type="text"
            name="expirationDate"
            placeholder="Expiration Date (MM/YY)"
            value={paymentInfo.expirationDate}
            onChange={(e) => handleInputChange(e, "payment")}
          />
          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={paymentInfo.cvv}
            onChange={(e) => handleInputChange(e, "payment")}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="place-order-btn">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
