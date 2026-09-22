"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { g8Product } from "@/lib/products";
import { assetPath, formatVnd } from "@/lib/site";

export function CartButton() {
  const { quantity, setQuantity, clear } = useCart();
  const total = quantity * g8Product.price;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full border-[#073D2B]/20 bg-white/50 text-[#073D2B]" aria-label={`Mở giỏ hàng, ${quantity} sản phẩm`}>
          <ShoppingBag className="size-4" />
          {quantity > 0 && <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#C8A34A] text-[10px] font-bold text-[#052C20]">{quantity}</span>}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-[94%] flex-col border-[#073D2B]/10 bg-[#F7F2E7] p-0 sm:max-w-md">
        <SheetHeader className="border-b border-[#073D2B]/10 p-6 pr-14 text-left">
          <SheetTitle className="font-serif text-2xl text-[#052C20]">Giỏ hàng</SheetTitle>
          <SheetDescription>{quantity ? `${quantity} hộp G8 trong giỏ` : "Giỏ hàng của bạn đang trống."}</SheetDescription>
        </SheetHeader>
        {quantity > 0 ? (
          <div className="flex flex-1 flex-col p-6">
            <div className="flex gap-4">
              <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-white">
                <Image src={assetPath(g8Product.images[0].src)} alt={g8Product.images[0].alt} fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#052C20]">{g8Product.name}</p>
                <p className="mt-1 text-sm text-[#587067]">30 gói × 15 g · 450 g</p>
                <p className="mt-2 font-semibold text-[#073D2B]">{formatVnd(g8Product.price)}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-y border-[#073D2B]/10 py-4">
              <div className="flex items-center rounded-full border border-[#073D2B]/15 bg-white p-1">
                <button onClick={() => setQuantity(quantity - 1)} className="grid size-9 place-items-center rounded-full hover:bg-[#F7F2E7]" aria-label="Giảm số lượng"><Minus className="size-4" /></button>
                <output className="w-10 text-center font-semibold" aria-live="polite">{quantity}</output>
                <button onClick={() => setQuantity(quantity + 1)} className="grid size-9 place-items-center rounded-full hover:bg-[#F7F2E7]" aria-label="Tăng số lượng"><Plus className="size-4" /></button>
              </div>
              <button onClick={clear} className="inline-flex items-center gap-2 text-sm text-[#775E28] hover:text-[#052C20]"><Trash2 className="size-4" /> Xóa</button>
            </div>
            <div className="mt-auto space-y-4 pt-8">
              <div className="flex items-center justify-between text-lg font-semibold"><span>Tạm tính</span><span>{formatVnd(total)}</span></div>
              <p className="text-xs leading-5 text-[#6B7C75]">Phí giao hàng: [...] · Ngưỡng miễn phí: [...]</p>
              <Button asChild className="h-12 w-full rounded-full bg-[#073D2B] text-white"><Link href="/thanh-toan">Tiếp tục thanh toán</Link></Button>
              <Button asChild variant="outline" className="h-11 w-full rounded-full border-[#073D2B]/20 bg-transparent"><Link href="/gio-hang">Xem giỏ hàng</Link></Button>
            </div>
          </div>
        ) : (
          <div className="grid flex-1 place-items-center p-8 text-center"><div><ShoppingBag className="mx-auto size-10 text-[#C8A34A]" /><p className="mt-4 text-sm text-[#587067]">Hãy thêm G8 vào giỏ để tiếp tục.</p><Button asChild className="mt-6 rounded-full bg-[#073D2B]"><Link href="/san-pham/bot-tra-sam-nu-hoang-g8">Xem sản phẩm G8</Link></Button></div></div>
        )}
      </SheetContent>
    </Sheet>
  );
}

