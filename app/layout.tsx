import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "Queen Ginseng Vietnam | Sâm Nữ Hoàng G8",
  description: "Queen Ginseng Vietnam giới thiệu Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan, quy cách 30 gói × 15 g, khối lượng tịnh 450 g.",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className="antialiased"><CartProvider>{children}</CartProvider></body></html>;
}
