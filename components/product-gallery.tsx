"use client";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { assetPath } from "@/lib/site";
export function ProductGallery({ product }: { product: Product }) {
  const [selected, setSelected] = useState(0);
  return <div><div className="relative aspect-square overflow-hidden rounded-[2rem] border border-[#073D2B]/10 bg-white shadow-[0_28px_70px_rgba(5,44,32,.1)]"><Image src={assetPath(product.images[selected].src)} alt={product.images[selected].alt} fill priority sizes="(max-width:1024px) 100vw,54vw" className="object-cover" /></div>{product.images.length > 1 && <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Ảnh sản phẩm">{product.images.map((image, index) => <button key={image.src} onClick={() => setSelected(index)} aria-label={`Xem ảnh ${index + 1}`} aria-current={selected === index} className={`relative aspect-square w-20 shrink-0 snap-start overflow-hidden rounded-xl border-2 ${selected === index ? "border-[#C8A34A]" : "border-transparent"}`}><Image src={assetPath(image.src)} alt="" fill className="object-cover" /></button>)}</div>}</div>;
}
