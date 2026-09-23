import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/company";
import { g8Product } from "@/lib/products";
import { assetPath } from "@/lib/site";

export function SiteFooter() {
  return <footer id="lien-he" className="scroll-mt-24 bg-[#052C20] text-white">
    <div className="container-wide grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><Image src={assetPath("/images/brand/queen-ginseng-logo-crop.png")} alt="Queen Ginseng Việt Nam" width={150} height={70} className="h-16 w-auto rounded-lg bg-white object-contain p-1" />
        <p className="mt-5 text-sm leading-7 text-white/80">{company.vietnameseName}<br />{company.shortName} · Mã số doanh nghiệp {company.enterpriseNumber}</p>
        <p className="mt-2 text-sm leading-7 text-white/80">{company.address}</p></div>
      <nav aria-label="Khám phá Queen Ginseng"><h2 className="font-semibold text-[#D5C388]">Khám phá</h2>
        <Link className="footer-link" href={`/san-pham/${g8Product.slug}`}>Sản phẩm G8</Link>
        <Link className="footer-link" href="/#minh-bach">Hồ sơ & minh bạch</Link>
        <Link className="footer-link" href="/#dau-an">Dấu ấn thương hiệu</Link>
        <Link className="footer-link" href="/tai-khoan/gioi-thieu">Giới thiệu 5% · Bản thử nghiệm</Link></nav>
      <div><h2 className="font-semibold text-[#D5C388]">Liên hệ & chính sách</h2><p className="mt-4 text-sm leading-7 text-white/80">Kênh liên hệ bán hàng, chính sách giao hàng và đổi trả đang được cập nhật.</p><p className="mt-3 text-sm leading-7 text-white/80">Website hiện là bản trải nghiệm, chưa tiếp nhận đơn hàng thật.</p></div>
    </div><div className="container-wide border-t border-white/15 py-5 text-xs text-white/75">© 2026 Queen Ginseng Vietnam. Bảo lưu mọi quyền.</div>
  </footer>;
}
