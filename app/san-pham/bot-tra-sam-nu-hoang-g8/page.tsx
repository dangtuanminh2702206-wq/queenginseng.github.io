import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, FileCheck2 } from "lucide-react";

import { ProductPurchase } from "@/components/product-purchase";
import { ProductGallery } from "@/components/product-gallery";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { g8Product, productPack, productWeight } from "@/lib/products";
import { rawMaterialResearch, researchDocuments } from "@/lib/research";
import { assetPath, formatVnd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan | Queen Ginseng Vietnam",
  description: "Thông tin Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan, quy cách 30 gói × 15 g, khối lượng tịnh 450 g và hồ sơ sản phẩm.",
  alternates: { canonical: "/san-pham/bot-tra-sam-nu-hoang-g8" },
};

function BulletList({ items }: { items: string[] }) {
  return <ul className="mt-5 grid gap-3 text-[#465F56]">{items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#C8A34A]" /><span className="leading-7">{item}</span></li>)}</ul>;
}

export default function ProductPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${g8Product.name} – ${g8Product.subtitle}`,
    description: `${g8Product.legalName}, quy cách ${g8Product.unitsPerBox} gói × ${g8Product.unitWeightGrams} g, khối lượng tịnh ${g8Product.netWeightGrams} g.`,
    image: ["https://dangtuanminh2702206-wq.github.io/queenginseng.github.io/images/products/g8/g8-open-box-clean.webp"],
    sku: undefined,
    brand: { "@type": "Brand", name: "Queen Ginseng Vietnam" },
    offers: { "@type": "Offer", price: g8Product.price, priceCurrency: g8Product.currency },
  };

  return (
    <main className="min-h-screen bg-[#F7F2E7] text-[#052C20]">
      <a href="#noi-dung" className="skip-link">Chuyển đến nội dung chính</a>
      <div className="bg-[#052C20] px-4 py-2.5 text-center text-xs font-semibold tracking-[0.1em] text-white">{g8Product.name} · {productPack(g8Product)} · {productWeight(g8Product)}</div>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div id="noi-dung">
        <section className="border-b border-[#073D2B]/10 bg-white">
          <div className="container-wide py-3"><nav aria-label="Đường dẫn" className="flex flex-wrap items-center gap-2 text-sm text-[#6B7C75]"><Link href="/" className="hover:text-[#073D2B]">Trang chủ</Link><span>/</span><span>Sản phẩm</span><span>/</span><span className="text-[#073D2B]">Bột Trà Sâm Nữ Hoàng G8</span></nav></div>
        </section>

        <section className="bg-[#F7F2E7] py-6 sm:py-10">
          <div className="container-wide grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <ProductGallery product={g8Product} />
            <div className="lg:sticky lg:top-28">


              <h1 className="mt-3 font-serif text-[clamp(2.25rem,4vw,3.8rem)] leading-[1.05] tracking-[-0.03em]">{g8Product.name}</h1>
              <p className="mt-3 text-xl text-[#587067]">{g8Product.subtitle}</p>
              <p className="price mt-5 text-3xl font-semibold">{formatVnd(g8Product.price)}</p>
              <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl border border-[#073D2B]/10 bg-white p-4"><p className="text-xs text-[#6B7C75]">Quy cách</p><p className="mt-1 font-semibold">{productPack(g8Product)}</p></div><div className="rounded-xl border border-[#073D2B]/10 bg-white p-4"><p className="text-xs text-[#6B7C75]">Khối lượng tịnh</p><p className="mt-1 font-semibold">{productWeight(g8Product)}</p></div></div>
              <ProductPurchase />
              <div className="mt-5 border-t border-[#073D2B]/10 pt-5 text-sm leading-6 text-[#6B7C75]">{g8Product.sku && <p>SKU: {g8Product.sku}</p>}<p>Hạn sử dụng: {g8Product.shelfLifeMonths} tháng kể từ ngày sản xuất</p></div>
            </div>
          </div>
        </section>

        <section className="section-space bg-white">
          <div className="container-wide grid gap-14 lg:grid-cols-[0.55fr_1.45fr]">
            <div><p className="eyebrow">Thông tin sản phẩm</p><h2 className="section-title !text-[clamp(2.4rem,4vw,4rem)]">Tìm hiểu sản phẩm</h2></div>
            <div className="grid gap-3">
              <section id="gioi-thieu" className="scroll-mt-28"><h3 className="product-detail-title">1. Giới thiệu</h3><p className="mt-5 leading-8 text-[#465F56]">{g8Product.name} là sản phẩm có tên pháp lý “{g8Product.legalName}”. Sản phẩm được đóng thành từng gói định lượng, pha với nước nóng để thưởng thức.</p></section>
              <details className="detail-disclosure"><summary>Thành phần</summary><BulletList items={g8Product.ingredients} /></details>
              <details className="detail-disclosure" open><summary>Hướng dẫn sử dụng</summary><BulletList items={g8Product.usage} /></details>
              <details className="detail-disclosure"><summary>Đối tượng sử dụng</summary><p className="mt-5 leading-8 text-[#465F56]">{g8Product.targetUsers}</p></details>
              <details className="detail-disclosure"><summary>Thông tin dinh dưỡng</summary><p className="mt-3 text-sm text-[#6B7C75]">Số liệu tính trên 100 g sản phẩm; không phải số liệu kiểm nghiệm trực tiếp cho một gói.</p><div className="mt-5 overflow-hidden rounded-2xl border border-primary/10"><table className="w-full text-left"><caption className="sr-only">Thông tin dinh dưỡng trên 100 g sản phẩm</caption><thead><tr className="bg-background"><th scope="col" className="px-5 py-3">Chỉ tiêu</th><th scope="col" className="px-5 py-3 text-right">Trên 100 g</th></tr></thead><tbody>{g8Product.nutritionPer100g.map((row,index) => <tr key={row.label} className={index % 2 ? "bg-background" : "bg-white"}><th scope="row" className="px-5 py-3 font-normal">{row.label}</th><td className="px-5 py-3 text-right font-semibold">{row.value}</td></tr>)}</tbody></table></div></details>
              <details className="detail-disclosure"><summary>Bảo quản & lưu ý</summary><div className="mt-5 grid gap-8 sm:grid-cols-2"><div><h4 className="font-semibold">Bảo quản</h4><BulletList items={g8Product.storage} /></div><div><h4 className="font-semibold">Lưu ý</h4><BulletList items={g8Product.cautions} /></div></div></details>
            </div>
          </div>
        </section>

        <section id="ho-so" className="section-space scroll-mt-24 bg-[#073D2B] text-white"><div className="container-wide"><div className="max-w-3xl"><p className="eyebrow !text-[#D5C388]">7. Hồ sơ sản phẩm</p><h2 className="section-title !text-white">Tài liệu G8</h2><p className="mt-5 leading-7 text-white/65">Các tài liệu này là hồ sơ sản phẩm và kết quả kiểm nghiệm; không phải hồ sơ xác nhận hiệu quả sức khỏe.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2">{g8Product.legalDocuments.map((doc) => <article key={doc.title} className="rounded-2xl border border-white/15 bg-white/[0.06] p-6"><FileCheck2 className="size-6 text-[#D5C388]" /><h3 className="mt-5 text-lg font-semibold">{doc.title}</h3><p className="mt-2 text-sm text-white/60">{doc.detail}</p><a href={assetPath(doc.href)} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#D5C388]">Xem hồ sơ <ExternalLink className="size-4" /></a></article>)}</div></div></section>

        <section className="section-space bg-white"><div className="container-wide grid gap-12 lg:grid-cols-2"><section><p className="eyebrow">8. Đơn vị sản xuất</p><h2 className="mt-4 font-serif text-3xl">{g8Product.manufacturer.name}</h2><dl className="mt-6 grid gap-4 text-sm"><div><dt className="text-[#6B7C75]">Địa chỉ</dt><dd className="mt-1 leading-6">{g8Product.manufacturer.address}</dd></div><div><dt className="text-[#6B7C75]">Hồ sơ thể hiện</dt><dd className="mt-1">{g8Product.manufacturer.standard} · Số {g8Product.manufacturer.certificateNumber} · Cấp ngày {g8Product.manufacturer.issueDate}</dd></div></dl><p className="mt-6 rounded-xl bg-[#F7F2E7] p-4 text-sm leading-6 text-[#587067]">RV Nutrition là đơn vị sản xuất. Chủ thể thương hiệu và đơn vị sản xuất được trình bày tách biệt.</p></section><section><p className="eyebrow">9. Giao hàng & đổi trả</p><div className="mt-5 rounded-2xl border border-[#073D2B]/10 p-6 text-[#587067]"><p>Phí giao hàng: Chưa xác nhận</p><p className="mt-3">Chính sách đổi trả: Đang cập nhật</p></div><p className="eyebrow mt-10">Câu hỏi thường gặp</p><div className="mt-5 grid gap-3"><details className="rounded-xl border border-[#073D2B]/10 p-5"><summary className="cursor-pointer font-semibold">G8 có bao nhiêu gói?</summary><p className="mt-3 text-sm leading-6 text-[#587067]">Một hộp có {g8Product.unitsPerBox} gói, mỗi gói {g8Product.unitWeightGrams} g; khối lượng tịnh {productWeight(g8Product)}.</p></details><details className="rounded-xl border border-[#073D2B]/10 p-5"><summary className="cursor-pointer font-semibold">Cách pha G8 như thế nào?</summary><p className="mt-3 text-sm leading-6 text-[#587067]">{g8Product.usage.slice(0, 3).join(" ")}</p></details></div></section></div></section>

        <section id="nghien-cuu" className="section-space scroll-mt-24 bg-[#F7F2E7]"><div className="container-wide"><div className="max-w-4xl"><p className="eyebrow">Nghiên cứu nguyên liệu Sâm Nữ Hoàng</p><h2 className="section-title">Dữ liệu trên từng mẫu thử</h2><p className="section-copy">Các kết quả dưới đây là dữ liệu kiểm nghiệm trên mẫu nguyên liệu hoặc tinh chất được gửi thử nghiệm và không đồng nghĩa với chỉ tiêu của sản phẩm G8 thành phẩm.</p></div><div className="mt-12 grid gap-5 lg:grid-cols-3">{rawMaterialResearch.map((item) => <article key={item.sample} className="rounded-[1.5rem] border border-[#073D2B]/10 bg-white p-7"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#806526]">Kết quả áp dụng cho mẫu thử</p><h3 className="mt-4 font-serif text-2xl text-[#052C20]">{item.sample}</h3><p className="mt-4 text-sm leading-6 text-[#6B7C75]">{item.laboratory}<br />Ngày: {item.date}<br />{item.report}</p><BulletList items={item.values} /></article>)}</div><div className="mt-8 flex flex-wrap gap-3">{researchDocuments.map((doc) => <a key={doc.title} href={assetPath(doc.href)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#073D2B]/20 bg-white px-5 py-3 text-sm font-semibold text-[#073D2B]">{doc.title} <ExternalLink className="size-4" /></a>)}</div></div></section>
      </div>

      <SiteFooter />
    </main>
  );
}
