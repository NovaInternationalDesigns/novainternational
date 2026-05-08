import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { UserContext } from "./UserContext";
import { useGuest } from "./GuestContext";

const POContext = createContext();

export const PurchaseOrderProvider = ({ children }) => {
  const [poItems, setPoItems] = useState([]);
  const [purchaseOrderId, setPurchaseOrderId] = useState(null);

  const { user } = useContext(UserContext);
  const { guest } = useGuest();

  const API_URL = import.meta.env.VITE_API_URL;

  const getOwner = () => {
    if (user && user._id) {
      return {
        ownerType: "User",
        ownerId: user._id,
      };
    }

    if (guest && guest._id) {
      return {
        ownerType: "Guest",
        ownerId: guest._id,
      };
    }

    return {
      ownerType: null,
      ownerId: null,
    };
  };

  const mapDraftItems = (source) =>
    (source || []).map((i) => ({
      _id: i._id,
      productId: i.productId,
      styleNo: i.styleNo || "",
      name: i.name || i.description || "",
      description: i.description || i.name || "",
      price: i.price,
      quantity: i.qty ?? i.quantity ?? 0,
      color: i.color || null,
      size: i.size || null,
      image: i.image || null,
    }));

  // Load draft items from server for logged-in users and guests.
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { ownerType, ownerId } = getOwner();

      // Load from server if we have owner info
      if (ownerType && ownerId) {
        try {
          const res = await fetch(
            `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}`,
            {
              credentials: "include",
            }
          );

          if (res.ok) {
            const data = await res.json();

            if (!mounted) return;

            if (data.purchaseOrderId) {
              setPurchaseOrderId(data.purchaseOrderId);
            }

            const items = mapDraftItems(data.items);

            setPoItems(items);

            return;
          }
        } catch (err) {
          console.error(`Failed to fetch ${ownerType} PO draft:`, err);
        }
      }

      // If no server draft exists, keep an in-memory empty cart.
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user, guest]);

  // Do not persist PO items in localStorage; server-side drafts are used when available.

  const addToPO = async (item) => {
    const { ownerType, ownerId } = getOwner();

    const endpoint =
      ownerType && ownerId
        ? `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}/items`
        : null;

    // If backend exists, save there first
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ items: [item] }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));

          throw new Error(
            err.error || err.message || "Failed to add item to PO"
          );
        }

        const data = await res.json();

        console.log("PO Response:", data);

        const items = mapDraftItems(data.po?.items || data.po);

        setPoItems(items);

        return items;
      } catch (err) {
        console.error("Error adding item to server PO:", err);
        throw err;
      }
    }

    // Local fallback
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
            ? {
                ...p,
                quantity: (p.quantity || 0) + (item.quantity || 0),
              }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const removeFromPO = async (productId) => {
    // Accept either a productId string or an object { productId, color, size }
    if (!productId) throw new Error("productId is required");

    const { ownerType, ownerId } = getOwner();

    const endpoint =
      ownerType && ownerId
        ? `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}/items`
        : null;

    if (!endpoint) {
      throw new Error("Session not ready. Please wait a moment and try again.");
    }

    // If user or guest is logged in, request backend to remove
    try {
      let body = null;

      if (typeof productId === "string") {
        body = { productId };
      } else {
        body = {
          productId: productId.productId,
          color: productId.color,
          size: productId.size,
        };
      }

      const res = await fetch(endpoint, {
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

      console.log("PO Response:", data);

      const items = mapDraftItems(data.po?.items || data.po);

      setPoItems(items);

      return items;
    } catch (err) {
      console.error("Error removing item from server PO:", err);
      throw err;
    }
  };

  const refreshPO = async () => {
    const { ownerType, ownerId } = getOwner();
    if (!ownerType || !ownerId) return null;

    try {
      const res = await fetch(
        `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) return null;

      const data = await res.json();
      const items = mapDraftItems(data.items || []);
      setPoItems(items);
      return items;
    } catch (err) {
      console.error("Failed to refresh PO draft:", err);
      return null;
    }
  };

  const updatePOItemQty = async ({
    productId,
    color = null,
    size = null,
    qty,
  }) => {
    if (!productId) throw new Error("productId is required");

    const numericQty = Math.max(1, Number(qty) || 1);

    const { ownerType, ownerId } = getOwner();

    const endpoint =
      ownerType && ownerId
        ? `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}/items`
        : null;

    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId,
          color,
          size,
          qty: numericQty,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(
          err.error || err.message || "Failed to update item quantity"
        );
      }

      const data = await res.json();

      console.log("PO Response:", data);

      const items = mapDraftItems(data.po?.items || data.po);

      setPoItems(items);

      return items;
    }

    setPoItems((prev) =>
      prev.map((item) =>
        item.productId === productId &&
        (item.color || null) === (color || null) &&
        (item.size || null) === (size || null)
          ? { ...item, quantity: numericQty }
          : item
      )
    );

    return null;
  };

  const clearPO = async () => {
    const { ownerType, ownerId } = getOwner();

    const endpoint =
      ownerType && ownerId
        ? `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}/items`
        : null;

    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
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

  const updatePOItemSize = async ({
    productId,
    color = null,
    size = null,
    newSize = null,
    newProductId,
    newStyleNo,
    newPrice,
    newImage,
  }) => {
    if (!productId) throw new Error("productId is required");

    const { ownerType, ownerId } = getOwner();

    const endpoint =
      ownerType && ownerId
        ? `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}/items/size`
        : null;

    if (!endpoint) {
      throw new Error("Session not ready. Please wait a moment and try again.");
    }

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId,
          color,
          size,
          newSize,
          newProductId,
          newStyleNo,
          newPrice,
          newImage,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(
          err.error || err.message || "Failed to update item size"
        );
      }

      const data = await res.json();

      console.log("PO Response:", data);

      const items = mapDraftItems(data.po?.items || data.po);

      setPoItems(items);

      return items;
    } catch (err) {
      console.error("Error updating item size in server PO:", err);
      throw err;
    }
  };

  const updatePOItemColor = async ({
    productId,
    color = null,
    size = null,
    newColor = null,
    newSize,
    newProductId,
    newStyleNo,
    newPrice,
    newName,
    newDescription,
    newImage,
  }) => {
    if (!productId) throw new Error("productId is required");

    const { ownerType, ownerId } = getOwner();

    const endpoint =
      ownerType && ownerId
        ? `${API_URL}/api/purchaseOrderDraft/${ownerType}/${ownerId}/items`
        : null;

    if (!endpoint) {
      throw new Error("Session not ready. Please wait a moment and try again.");
    }

    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",

        body: JSON.stringify({
          productId,
          color,
          size,
          newColor,
          newSize,
          newProductId,
          newStyleNo,
          newPrice,
          newName,
          newDescription,
          newImage,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));

        throw new Error(
          err.error || err.message || "Failed to update item color"
        );
      }

      const data = await res.json();

      console.log("PO Response:", data);

      const items = mapDraftItems(data.po?.items || data.po);

      setPoItems(items);

      return items;
    } catch (err) {
      console.error("Error updating item color in server PO:", err);

      throw err;
    }
  };

  const value = useMemo(
    () => ({
      poItems,
      purchaseOrderId,
      setPurchaseOrderId,
      addToPO,
      removeFromPO,
      updatePOItemQty,
      updatePOItemSize,
      updatePOItemColor,
      refreshPO,
      clearPO,
    }),
    [poItems, purchaseOrderId]
  );

  return (
    <POContext.Provider value={value}>
      {children}
    </POContext.Provider>
  );
};

export const usePO = () => useContext(POContext);