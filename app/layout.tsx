import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/queenginseng.github.io" : "";

export const metadata: Metadata = {
  title: "Queen Ginseng Vietnam | Dược liệu Việt hiện đại",
  description: "Queen Ginseng Vietnam phát triển sản phẩm từ nguồn nguyên liệu thiên nhiên, hướng đến sự tiện lợi, minh bạch và chất lượng.",
  icons: { icon: `${basePath}/favicon.svg`, shortcut: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body className="antialiased">{children}</body></html>;
}

