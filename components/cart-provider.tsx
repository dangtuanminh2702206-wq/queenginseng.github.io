"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "qgv-cart-v1";

type CartContextValue = {
  quantity: number;
  add: (amount?: number) => void;
  setQuantity: (quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const quantity = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      window.addEventListener("qgv-cart-changed", callback);
      return () => {
        window.removeEventListener("storage", callback);
        window.removeEventListener("qgv-cart-changed", callback);
      };
    },
    () => {
      const saved = Number(window.localStorage.getItem(STORAGE_KEY));
      return Number.isFinite(saved) && saved > 0 ? Math.floor(saved) : 0;
    },
    () => 0,
  );

  const setQuantity = (next: number) => {
    const safe = Math.max(0, Math.min(99, Math.floor(next || 0)));
    window.localStorage.setItem(STORAGE_KEY, String(safe));
    window.dispatchEvent(new Event("qgv-cart-changed"));
  };

  const value = useMemo<CartContextValue>(() => ({
    quantity,
    add: (amount = 1) => setQuantity(quantity + amount),
    setQuantity,
    clear: () => setQuantity(0),
  }), [quantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
