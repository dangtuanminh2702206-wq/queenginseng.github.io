import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL("https://dangtuanminh2702206-wq.github.io/queenginseng.github.io/"),
  title: "Queen Ginseng Vietnam | Sâm Nữ Hoàng G8",
  description: "Queen Ginseng Vietnam giới thiệu Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan, quy cách 30 gói × 15 g, khối lượng tịnh 450 g.",
  alternates: { canonical: "/" },
  openGraph: { title: "Queen Ginseng Vietnam | Sâm Nữ Hoàng G8", description: "Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan, 30 gói × 15 g.", images: [`${basePath}/images/products/g8/g8-open-box.webp`] },
  icons: { icon: `${basePath}/images/brand/queen-ginseng-logo-crop.png`, shortcut: `${basePath}/images/brand/queen-ginseng-logo-crop.png` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className="antialiased"><CartProvider>{children}</CartProvider></body></html>;
}
