"use client";

import Link from "next/link";
import { Leaf, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const links = [
  ["Sản phẩm", "#san-pham"],
  ["Sâm Nữ Hoàng", "#sam-nu-hoang"],
  ["Câu chuyện thương hiệu", "#sam-nu-hoang"],
  ["Chất lượng", "#chat-luong"],
  ["Kiến thức", "#kien-thuc"],
  ["Hệ thống đại lý", "#dai-ly"],
  ["Liên hệ", "#lien-he"],
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#073D2B]/10 bg-[#F7F2E7]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-12 xl:px-16">
        <Link href="#noi-dung" className="flex shrink-0 items-center gap-2.5 text-[#052C20]" aria-label="Queen Ginseng Vietnam - Trang chủ">
          <span className="flex size-9 items-center justify-center rounded-full border border-[#C8A34A]/50 bg-[#073D2B]"><Leaf className="size-4 text-[#D5C388]" /></span>
          <span className="font-serif text-lg leading-none tracking-[-0.02em] sm:text-xl">Queen Ginseng</span>
        </Link>
        <nav className="hidden items-center gap-5 xl:flex" aria-label="Điều hướng chính">
          {links.map(([label, href]) => <Link key={label} href={href} className="text-[13px] font-medium text-[#294D40] transition-colors hover:text-[#C8A34A]">{label}</Link>)}
        </nav>
        <Button type="button" className="hidden h-10 rounded-full bg-[#073D2B] px-5 text-white hover:bg-[#052C20] md:inline-flex xl:hidden 2xl:inline-flex">Đặt mua</Button>
        <Sheet>
          <SheetTrigger asChild><Button variant="outline" size="icon" className="rounded-full border-[#073D2B]/20 bg-transparent text-[#073D2B] xl:hidden" aria-label="Mở trình đơn"><Menu /></Button></SheetTrigger>
          <SheetContent className="w-[88%] border-[#073D2B]/10 bg-[#F7F2E7] p-0 sm:max-w-md">
            <SheetHeader className="border-b border-[#073D2B]/10 p-6 pr-14 text-left">
              <SheetTitle className="font-serif text-2xl text-[#052C20]">Queen Ginseng Vietnam</SheetTitle>
              <SheetDescription className="text-[#587067]">Tinh hoa dược liệu Việt trong nhịp sống hiện đại.</SheetDescription>
            </SheetHeader>
            <nav className="grid p-3" aria-label="Điều hướng trên thiết bị di động">
              {links.map(([label, href]) => <SheetClose asChild key={label}><Link href={href} className="rounded-xl px-4 py-3.5 text-base font-medium text-[#073D2B] hover:bg-white">{label}</Link></SheetClose>)}
            </nav>
            <div className="mt-auto p-6"><SheetClose asChild><Button asChild className="h-12 w-full rounded-full bg-[#073D2B] text-white"><Link href="#dai-ly">Trở thành đại lý</Link></Button></SheetClose></div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

