"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

import { readCart, writeCart } from '@/lib/cart-store';

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
    readCart,
    () => 0,
  );

  const setQuantity = writeCart;

  const value = useMemo<CartContextValue>(() => ({
    quantity,
    add: (amount = 1) => { if(Number.isInteger(amount)&&amount>0)setQuantity(readCart() + amount); },
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
