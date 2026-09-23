"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { useCart } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { g8Product, productPack, productWeight } from "@/lib/products";
import { assetPath, formatVnd } from "@/lib/site";

export default function CartPage() {
  const { quantity, setQuantity, clear } = useCart();
  const total = quantity * g8Product.price;

  return <main className="min-h-screen bg-[#F7F2E7] text-[#052C20]"><SiteHeader /><section className="section-space"><div className="container-wide"><p className="eyebrow">Giỏ hàng</p><h1 className="section-title">Sản phẩm bạn đã chọn</h1>{quantity === 0 ? <div className="mt-12 rounded-[2rem] border border-[#073D2B]/10 bg-white p-12 text-center"><ShoppingBag className="mx-auto size-10 text-[#C8A34A]" /><p className="mt-5 text-[#587067]">Giỏ hàng đang trống.</p><Button asChild className="mt-7 rounded-full bg-[#073D2B]"><Link href={`/san-pham/${g8Product.slug}`}>Xem Sâm Nữ Hoàng G8</Link></Button></div> : <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_380px]"><article className="flex flex-col gap-6 rounded-[2rem] border border-[#073D2B]/10 bg-white p-6 sm:flex-row"><div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-[#F7F2E7] sm:w-48"><Image src={assetPath(g8Product.images[0].src)} alt={g8Product.images[0].alt} fill sizes="192px" className="object-contain" /></div><div className="flex flex-1 flex-col"><h2 className="font-serif text-3xl">{g8Product.name}</h2><p className="mt-2 text-sm text-[#587067]">{g8Product.subtitle} · {productPack(g8Product)} · {productWeight(g8Product)}</p><p className="mt-4 font-semibold">{formatVnd(g8Product.price)} / hộp</p><div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6"><div className="flex items-center rounded-full border border-[#073D2B]/15 p-1"><button onClick={() => setQuantity(quantity - 1)} className="grid size-11 place-items-center" aria-label="Giảm số lượng"><Minus className="size-4" /></button><output aria-live="polite" className="w-10 text-center font-semibold">{quantity}</output><button onClick={() => setQuantity(quantity + 1)} className="grid size-11 place-items-center" aria-label="Tăng số lượng"><Plus className="size-4" /></button></div><button onClick={clear} className="inline-flex min-h-11 items-center gap-2 text-sm text-[#775E28]"><Trash2 className="size-4" /> Xóa</button></div></div></article><aside className="h-fit rounded-[2rem] bg-[#073D2B] p-7 text-white"><h2 className="font-serif text-2xl">Tóm tắt đơn hàng</h2><div className="mt-6 flex justify-between border-b border-white/15 pb-5 text-sm text-white/70"><span>{quantity} hộp G8</span><span>{formatVnd(total)}</span></div><div className="mt-5 flex justify-between text-lg font-semibold"><span>Tạm tính tiền hàng</span><span>{formatVnd(total)}</span></div><p className="mt-4 text-xs leading-5 text-white/80">Chưa gồm phí vận chuyển. Phí giao hàng chưa xác nhận.</p><Button asChild className="mt-7 h-12 w-full rounded-full bg-[#C8A34A] text-[#052C20] hover:bg-[#D5B765]"><Link href="/thanh-toan">Tiếp tục thanh toán</Link></Button></aside></div>}</div></section><SiteFooter /></main>;
}
