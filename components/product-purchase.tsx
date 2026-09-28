"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";

export function ProductPurchase() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const cart = useCart();
  const router = useRouter();

  function addToCart() {
    const accepted = Math.min(quantity, 99 - cart.quantity);
    if (!accepted) { setMessage("Giỏ đã đạt giới hạn 99 hộp cho một yêu cầu."); return; }
    cart.add(quantity);
    setAdded(true);
    setMessage(`${accepted} hộp đã thêm vào giỏ.` + (accepted < quantity ? " Giỏ đã đạt giới hạn 99 hộp." : ""));
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  }

  function buyNow() {
    cart.add(quantity);
    router.push("/thanh-toan");
  }

  return (
    <div className="mt-5">
      <label className="text-sm font-semibold text-[#294D40]" htmlFor="quantity">Số lượng</label>
      <div className="mt-3 flex flex-wrap gap-3">
        <div className="flex h-14 items-center rounded-full border border-[#073D2B]/20 bg-white p-1">
          <button type="button" disabled={quantity <= 1} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-11 place-items-center rounded-full hover:bg-[#F7F2E7]" aria-label="Giảm số lượng"><Minus className="size-4" /></button>
          <input id="quantity" value={quantity} readOnly className="w-10 bg-transparent text-center font-semibold outline-none" aria-live="polite" />
          <button type="button" disabled={quantity >= 99} onClick={() => setQuantity(Math.min(99, quantity + 1))} className="grid size-11 place-items-center rounded-full hover:bg-[#F7F2E7]" aria-label="Tăng số lượng"><Plus className="size-4" /></button>
        </div>
        <Button type="button" onClick={addToCart} className="h-12 flex-1 rounded-full bg-[#073D2B] px-6 text-white hover:bg-[#052C20]"><ShoppingBag aria-hidden="true" /> {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}</Button>
      </div>
      <p className="mt-2 text-sm text-[#294D40]" role="status">{message}</p>
      <Button type="button" onClick={buyNow} variant="outline" className="mt-3 h-12 w-full rounded-full border-[#C8A34A] bg-[#C8A34A] text-[#052C20] hover:bg-[#D5B765]">Mua ngay</Button>
    </div>
  );
}
