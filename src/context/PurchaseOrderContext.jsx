import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";

const POContext = createContext();

export const PurchaseOrderProvider = ({ children }) => {
  const [poItems, setPoItems] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);
  const { user } = useContext(UserContext);
  const API_URL = import.meta.env.VITE_API_URL;

  // Load from server (when logged in) or from localStorage
  useEffect(() => {
    const load = async () => {
      if (user && user._id) {
        try {
          const res = await fetch(`${API_URL}/api/purchaseOrderDraft/${user._id}`, {
            credentials: "include",
          });
          if (res.ok) {
            const data = await res.json();
              // keep purchaseOrderId from draft
              if (data.purchaseOrderId) setPurchaseOrderId(data.purchaseOrderId);
              const items = (data.items || []).map((i) => ({
              productId: i.productId,
              name: i.name,
              price: i.price,
              quantity: i.qty ?? i.quantity ?? 0,
              color: i.color || null,
              size: i.size || null,
            }));
            setPoItems(items);
            return;
          }
        } catch (err) {
          console.error("Failed to fetch PO draft:", err);
        }
      }

      const saved = localStorage.getItem("poItems");
      if (saved) setPoItems(JSON.parse(saved));
    };

    load();
  }, [user]);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("poItems", JSON.stringify(poItems));
  }, [poItems]);

  const addToPO = (item) => {
    setPoItems((prev) => {
      // match by productId + color + size to keep combinations distinct
      const existing = prev.find(
        (p) =>
          p.productId === item.productId &&
          (p.color || null) === (item.color || null) &&
          (p.size || null) === (item.size || null)
      );

      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId &&
          (p.color || null) === (item.color || null) &&
          (p.size || null) === (item.size || null)
            ? { ...p, quantity: (p.quantity || 0) + (item.quantity || 0) }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const removeFromPO = async (productId) => {
    // Accept either a productId string or an object { productId, color, size }
    if (!productId) return;

    // If user is logged in, request backend to remove
    if (user && user._id) {
      try {
        let body = null;
        if (typeof productId === "string") body = { productId };
        else body = {
          productId: productId.productId,
          color: productId.color,
          size: productId.size,
        };

        const res = await fetch(`${API_URL}/api/purchaseOrderDraft/${user._id}/items`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || err.message || "Failed to remove item");
        }

        const data = await res.json();
        const items = (data.po?.items || data.po || []).map((i) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.qty ?? i.quantity ?? 0,
          color: i.color || null,
          size: i.size || null,
        }));
        setPoItems(items);
        return;
      } catch (err) {
        console.error("Error removing item from server PO:", err);
        // fall through to local-only removal
      }
    }

    setPoItems((prev) => {
      if (typeof productId === "string") {
        return prev.filter((p) => p.productId !== productId);
      }

      const { productId: id, color, size } = productId;
      return prev.filter(
        (p) => !(p.productId === id && (color ? p.color === color : true) && (size ? p.size === size : true))
      );
    });
  };

  const clearPO = async () => {
    if (user && user._id) {
      try {
        const res = await fetch(`${API_URL}/api/purchaseOrderDraft/${user._id}/items`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || err.message || "Failed to clear PO");
        }

        setPoItems([]);
        return;
      } catch (err) {
        console.error("Error clearing server PO:", err);
        // fall through to local clear
      }
    }

    setPoItems([]);
  };

  return (
    <POContext.Provider value={{ poItems, purchaseOrderId, setPurchaseOrderId, addToPO, removeFromPO, clearPO }}>
      {children}
    </POContext.Provider>
  );
};

export const usePO = () => useContext(POContext);
