import { createContext, useContext, useEffect, useState } from "react";

const POContext = createContext();

export const PurchaseOrderProvider = ({ children }) => {
  const [poItems, setPoItems] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("poItems");
    if (saved) setPoItems(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("poItems", JSON.stringify(poItems));
  }, [poItems]);

  const addToPO = (item) => {
    setPoItems((prev) => {
      const existing = prev.find(
        (p) => p.productId === item.productId && p.color === item.color
      );

      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId && p.color === item.color
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        );
      }

      return [...prev, item];
    });
  };

  const removeFromPO = (productId) => {
    setPoItems((prev) => prev.filter((p) => p.productId !== productId));
  };

  const clearPO = () => {
    setPoItems([]);
  };

  return (
    <POContext.Provider value={{ poItems, addToPO, removeFromPO, clearPO }}>
      {children}
    </POContext.Provider>
  );
};

export const usePO = () => useContext(POContext);
