import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("up_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("up_cart", JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (found) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setOpen(true);
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));

  const setQty = (id, qty) => {
    if (qty < 1) return remove(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal: items.reduce((s, i) => s + i.qty * i.price, 0),
    }),
    [items]
  );

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, count, subtotal, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
