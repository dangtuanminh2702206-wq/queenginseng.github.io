"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";

export function ProductPurchase() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const router = useRouter();

  function addToCart() {
    cart.add(quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function buyNow() {
    cart.add(quantity);
    router.push("/thanh-toan");
  }

  return (
    <div className="mt-8">
      <label className="text-sm font-semibold text-[#294D40]" htmlFor="quantity">Số lượng</label>
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex h-12 items-center rounded-full border border-[#073D2B]/20 bg-white p-1">
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-10 place-items-center rounded-full hover:bg-[#F7F2E7]" aria-label="Giảm số lượng"><Minus className="size-4" /></button>
          <input id="quantity" value={quantity} readOnly className="w-10 bg-transparent text-center font-semibold outline-none" aria-live="polite" />
          <button type="button" onClick={() => setQuantity(Math.min(99, quantity + 1))} className="grid size-10 place-items-center rounded-full hover:bg-[#F7F2E7]" aria-label="Tăng số lượng"><Plus className="size-4" /></button>
        </div>
        <Button type="button" onClick={addToCart} className="h-12 flex-1 rounded-full bg-[#073D2B] px-6 text-white hover:bg-[#052C20]"><ShoppingBag /> {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}</Button>
      </div>
      <Button type="button" onClick={buyNow} variant="outline" className="mt-3 h-12 w-full rounded-full border-[#C8A34A] bg-[#C8A34A] text-[#052C20] hover:bg-[#D5B765]">Mua ngay</Button>
    </div>
  );
}

