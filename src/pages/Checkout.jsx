import React, {
  useEffect,
  useState,
  useContext,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";

import "./CSS/checkout.css";
import { usePO } from "../context/PurchaseOrderContext.jsx";
import { useGuest } from "../context/GuestContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { getImageUrl } from "../utils/getImageUrl.js";

const TAX_RATE = 0.11;
const PROCESSING_FEE_RATE = 0.05;

const getQty = (item) => Number(item.qty ?? item.quantity ?? 0);
const getPrice = (item) => Number(item.price ?? item.unitPrice ?? 0);
const getRowKey = (item) =>
  item._id || `${item.productId || ""}-${item.color || ""}-${item.size || ""}`;

const safeStringify = (obj) =>
  JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  );

export default function Checkout() {
  const navigate = useNavigate();

  const { guest } = useGuest();
  const { user, loading } = useContext(UserContext);
  const {
    poItems,
    clearPO,
    removeFromPO,
    updatePOItemQty,
    updatePOItemSize,
    updatePOItemColor,
    refreshPO,
  } = usePO();

  const [orderData, setOrderData] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [minQtyByProduct, setMinQtyByProduct] = useState({});
  const [sizeOptionsByProduct, setSizeOptionsByProduct] = useState({});
  const [colorOptionsByProduct, setColorOptionsByProduct] = useState({});
  const [productLookupByKey, setProductLookupByKey] = useState({});

  // ---------------- AUTH ----------------
  useEffect(() => {
    if (!loading) {
      if (!user && !guest) navigate("/signin");
      if (!poItems.length) navigate("/");
    }
  }, [user, guest, loading, poItems]);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    setOrderData(
      (poItems || []).map((item) => ({
        ...item,
        qty: item.quantity ?? item.qty ?? 0,
      }))
    );
  }, [poItems]);

  // ---------------- FETCH PRODUCT DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const ids = [...new Set((poItems || []).map(i => i.productId))];

        const entries = await Promise.all(
          ids.map(async (productId) => {
            const res = await fetch(
              `${import.meta.env.VITE_API_URL}/api/products/lookup/${productId}`
            );

            const product = res.ok ? await res.json() : null;

            const sizes =
              product?.variants?.length > 0
                ? [...new Set(product.variants.map(v => v.size).filter(Boolean))]
                : [];

            const colors =
              product?.variants?.length > 0
                ? [...new Set(product.variants.map(v => v.color).filter(Boolean))]
                : [];

            const variantKeys =
              product?.variants?.length > 0
                ? product.variants.map((variant) => variant.productId).filter(Boolean)
                : [];

            return [
              productId,
              product?.minQty ?? 1,
              sizes,
              colors,
              product,
              variantKeys,
            ];
          })
        );

        const minQtyMap = {};
        const sizeMap = {};
        const colorMap = {};
        const productMap = {};

        entries.forEach(([id, minQty, sizes, colors, product, variantKeys]) => {
          const addLookupKey = (key) => {
            if (!key) return;
            minQtyMap[key] = minQty;
            sizeMap[key] = sizes;
            colorMap[key] = colors;
            if (product) productMap[key] = product;
          };

          addLookupKey(id);
          variantKeys.forEach(addLookupKey);
        });

        setColorOptionsByProduct(colorMap);
        setMinQtyByProduct(minQtyMap);
        setSizeOptionsByProduct(sizeMap);
        setProductLookupByKey(productMap);

      } catch (err) {
        console.error(err);
      }
    };

    if (poItems?.length) fetchData();
  }, [poItems]);

  // ---------------- ITEM CHANGE ----------------
  const handleItemChange = async (index, field, value) => {
    try {
      const item = orderData[index];

      if (field === "color") {
        const product = productLookupByKey[item.productId] || null;
        const variants = Array.isArray(product?.variants) ? product.variants : [];

        const variant =
          variants.find(
            (v) =>
              (v?.color || null) === (value || null) &&
              (item.size ? (v?.size || null) === (item.size || null) : true)
          ) || variants.find((v) => (v?.color || null) === (value || null));

        const resolvedSize = variant?.size ?? item.size;
        const resolvedStyleNo = variant?.styleNo || product?.styleNo || item.styleNo || "";
        const resolvedName = String(product?.name || item.name || "").trim();
        const resolvedDescription = String(
          variant?.description || product?.description || item.description || item.name || ""
        ).trim();
        const resolvedPrice = Number.isFinite(Number(variant?.price))
          ? Number(variant.price)
          : Number.isFinite(Number(product?.price))
          ? Number(product.price)
          : item.price;
        const resolvedImage =
          variant?.images_public_id || variant?.image ||
          product?.images_public_id?.[0] || item.image || null;

        const updatedItems = await updatePOItemColor({
          productId: item.productId,
          color: item.color,
          size: item.size,
          newColor: value,
          newSize: resolvedSize !== item.size ? resolvedSize : undefined,
          newProductId: product?._id ? String(product._id) : undefined,
          newStyleNo: resolvedStyleNo,
          newPrice: resolvedPrice,
          newName: resolvedName,
          newDescription: resolvedDescription,
          newImage: resolvedImage,
        });

        const refreshed = await refreshPO();
        const refreshedItems = Array.isArray(refreshed) && refreshed.length > 0 ? refreshed : updatedItems;

        if (refreshedItems && refreshedItems.length) {
          setOrderData(
            refreshedItems.map((itm) => ({
              ...itm,
              qty: itm.quantity ?? itm.qty ?? 0,
            }))
          );
        }

      } else if (field === "size") {
        const updatedItems = await updatePOItemSize({
          productId: item.productId,
          color: item.color,
          size: item.size,
          newSize: value,
        });

        const refreshed = await refreshPO();
        const refreshedItems = Array.isArray(refreshed) && refreshed.length > 0 ? refreshed : updatedItems;

        if (refreshedItems && refreshedItems.length) {
          setOrderData(
            refreshedItems.map((itm) => ({
              ...itm,
              qty: itm.quantity ?? itm.qty ?? 0,
            }))
          );
        } else {
          setOrderData((prev) =>
            prev.map((itm, i) =>
              i === index ? { ...itm, size: value } : itm
            )
          );
        }

      } else if (field === "qty") {
        const updatedItems = await updatePOItemQty({
          productId: item.productId,
          color: item.color,
          size: item.size,
          qty: Number(value),
        });

        const refreshed = await refreshPO();
        const refreshedItems = Array.isArray(refreshed) && refreshed.length > 0 ? refreshed : updatedItems;

        if (refreshedItems && refreshedItems.length) {
          setOrderData(
            refreshedItems.map((itm) => ({
              ...itm,
              qty: itm.quantity ?? itm.qty ?? 0,
            }))
          );
        } else {
          setOrderData((prev) =>
            prev.map((itm, i) =>
              i === index ? { ...itm, qty: Number(value) } : itm
            )
          );
        }
      }

    setError("");
  } catch (err) {
    console.error("Failed to update PO item:", err);
    setError("Failed to update item");
  }
};

  // ---------------- REMOVE ----------------
  const handleRemove = async (index) => {
    const item = orderData[index];

    const updatedItems = await removeFromPO({
      productId: item.productId,
      color: item.color,
      size: item.size,
    });

    if (updatedItems) {
      setOrderData(
        updatedItems.map((itm) => ({
          ...itm,
          qty: itm.quantity ?? itm.qty ?? 0,
        }))
      );
    } else {
      setOrderData((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // ---------------- SHIPPING ----------------
  const [shippingInfo, setShippingInfo] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });

  const validateShipping = () => {
  // First Name (letters only)
  if (!shippingInfo.firstName.trim()) return "First Name is required";
  if (!/^[A-Za-z]+$/.test(shippingInfo.firstName.trim())) {
    return "First Name must contain only letters";
  }

  // Last Name (letters only)
  if (!shippingInfo.lastName.trim()) return "Last Name is required";
  if (!/^[A-Za-z]+$/.test(shippingInfo.lastName.trim())) {
    return "Last Name must contain only letters";
  }

  // Email
  if (!shippingInfo.email.trim()) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
    return "Invalid email address";
  }

  // Phone (exactly 10 digits, numbers only)
  if (!shippingInfo.phone.trim()) return "Phone is required";
  if (!/^\d{10,}$/.test(shippingInfo.phone)) {
    return "Phone must be at least 10 digits";
  }

  // Address
  if (!shippingInfo.address.trim()) return "Address is required";

  // City (letters + spaces allowed)
  if (!shippingInfo.city.trim()) return "City is required";
  if (!/^[A-Za-z\s]+$/.test(shippingInfo.city.trim())) {
    return "City must contain only letters";
  }

  // ZIP (exactly 5 digits)
  if (!shippingInfo.zip.trim()) return "ZIP is required";
  if (!/^\d{5,}$/.test(shippingInfo.zip)) {
    return "ZIP must be minimum 5 digits";
  }

  // Country
  if (!shippingInfo.country.trim()) return "Country is required";

  return null;
};

  useEffect(() => {
    setShippingInfo((prev) => ({
      ...prev,
      email: user?.email || guest?.email || "",
      firstName: user?.name?.split(" ")[0] || "",
      lastName: user?.name?.split(" ")[1] || "",
    }));
  }, [user, guest]);

  // ---------------- CALC ----------------
  const subtotal = useMemo(
    () => orderData.reduce((acc, i) => acc + getQty(i) * getPrice(i), 0),
    [orderData]
  );

  const tax = subtotal * TAX_RATE;
  const processingFee = subtotal * PROCESSING_FEE_RATE;
  const total = subtotal + tax + processingFee;

  // ---------------- STRIPE PAYMENT ----------------
  const handlePayment = async () => {
  setError("");

  const validationError = validateShipping();
  if (validationError) {
    setError(validationError);
    return;
  }

  setSubmitting(true);

  try {
    const payload = {
      items: orderData,
      shippingInfo,
      subtotal,
      estimatedTax: tax,
      totalAmount: total,
      form: { email: shippingInfo.email },
      ownerId: String(user?._id || guest?._id),
      ownerType: user ? "User" : "Guest",
    };

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/payment/create-checkout-session`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: safeStringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Stripe session creation failed");
    }

    if (!data.url) {
      throw new Error("Stripe URL not returned from backend");
    }

    // IMPORTANT: redirect first
    window.location.href = data.url;

  } catch (err) {
    setError(err.message);
    setSubmitting(false);
  }
};

  if (loading) return null;

  const countries = ["United States","Canada","United Kingdom","Australia","India"];

  return (
    <div className="checkout-page">

      <div className="business-log-purchase">
        <img src="/images/logo.png" alt="Company Logo" />
      </div>

      <table className="po-table">
        <thead>
          <tr>
            <th>Style No</th>
            <th>Description</th>
            <th>Size</th>
            <th>Color</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {orderData.map((item, index) => {
            return (
              <tr key={getRowKey(item)}>
                <td><input value={item.styleNo || "N/A"} readOnly /></td>
                <td><input value={item.description || item.name} readOnly /></td>
                <td>
                  {sizeOptionsByProduct[item.productId]?.length > 0 ? (
                    <select
                      value={item.size || ""}
                      onChange={(e) =>
                        handleItemChange(index, "size", e.target.value)
                      }
                    >
                      <option value="">Select Size</option>
                      {sizeOptionsByProduct[item.productId].map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input value={item.size || "N/A"} readOnly />
                  )}
                </td>
                <td>
                  {colorOptionsByProduct[item.productId]?.length > 0 ? (
                    <select
                      value={item.color || ""}
                      onChange={(e) =>
                        handleItemChange(index, "color", e.target.value)
                      }
                    >
                      <option value="">Select Color</option>
                      {colorOptionsByProduct[item.productId].map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input value={item.color || "N/A"} readOnly />
                  )}
                </td>
                <td>
                  <input
                    type="number"
                    value={getQty(item)}
                    onChange={(e) =>
                      handleItemChange(index, "qty", e.target.value)
                    }
                  />
                </td>
                <td><input value={getPrice(item)} readOnly /></td>
                <td>{(getQty(item) * getPrice(item)).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleRemove(index)}>X</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="po-container">

        <div className="po-left">
          <h3>Shipping Information</h3>

          <div className="form-grid">
            <label>Name:</label>
            <input
              value={shippingInfo.firstName}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, firstName: e.target.value })
              }
            />

            <label>Last Name:</label>
            <input
              value={shippingInfo.lastName}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, lastName: e.target.value })
              }
            />

            <label>Email:</label>
            <input
              value={shippingInfo.email}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, email: e.target.value })
              }
            />

            <label>Phone:</label>
            <input
              value={shippingInfo.phone}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
            />

            <label>Address:</label>
            <input
              value={shippingInfo.address}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, address: e.target.value })
              }
            />

            <label>City:</label>
            <input
              value={shippingInfo.city}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, city: e.target.value })
              }
            />

            <label>ZIP:</label>
            <input
              value={shippingInfo.zip}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, zip: e.target.value })
              }
            />

            <label>Country:</label>
            <select
              className="checkout-country-select"
              value={shippingInfo.country}
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, country: e.target.value })
              }
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="po-right">
          <h3>Summary</h3>

          {orderData.map((item, index) => (
          <div key={index}>
              <img
                src={getImageUrl(item.image)}
                alt={item.name || "Product"}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginBottom: "5px",
                  border: "1px solid #ccc",
                }}
              />
            <p>Color: {item.color}</p>
            <p>Size: {item.size || "N/A"}</p>
            <p>Qty: {getQty(item)}</p>
            <p>Price: ${getPrice(item)}</p>
            <p>Total: ${(getQty(item) * getPrice(item)).toFixed(2)}</p>
          </div>
        ))}

          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>Fee: ${processingFee.toFixed(2)}</p>

          <h3>Total: ${total.toFixed(2)}</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button className="checkout-submit-btn" onClick={handlePayment} disabled={submitting}>
            {submitting ? "Redirecting..." : "Submit Purchase Order"}
          </button>
        </div>

      </div>
    </div>
  );
}