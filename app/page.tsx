import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, ExternalLink, FileCheck2, Leaf, PackageCheck, ShieldCheck, Sprout } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/company";
import { g8Product } from "@/lib/products";
import { researchDocuments } from "@/lib/research";
import { assetPath, formatVnd } from "@/lib/site";

const benefits = [
  { icon: Sprout, title: "Định hướng dược liệu Việt", text: "Trân trọng nguồn nguyên liệu bản địa trong cách tiếp cận hiện đại." },
  { icon: PackageCheck, title: "Tiện lợi mỗi ngày", text: "Từng gói định lượng sẵn, dễ pha và phù hợp nhịp sống bận rộn." },
  { icon: FileCheck2, title: "Thông tin minh bạch", text: "Hồ sơ sản phẩm, nghiên cứu nguyên liệu và tin ngoài được phân loại rõ." },
];

const transparencyCards = [
  { icon: FileCheck2, title: "Hồ sơ G8", text: "Thông tin pháp lý và kiểm nghiệm sản phẩm", href: "/san-pham/bot-tra-sam-nu-hoang-g8#ho-so" },
  { icon: Leaf, title: "Nghiên cứu Sâm Nữ Hoàng", text: "Dữ liệu trên các mẫu nguyên liệu", href: "/san-pham/bot-tra-sam-nu-hoang-g8#nghien-cuu" },
  { icon: BookOpen, title: "Tin tức dược liệu", text: "Nguồn tham khảo bên ngoài", href: "#kien-thuc" },
];

export default function Home() {
  const productHref = `/san-pham/${g8Product.slug}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <a href="#noi-dung" className="skip-link">Chuyển đến nội dung chính</a>
      <div className="bg-[#052C20] px-4 py-2.5 text-center text-[12px] font-semibold tracking-[0.1em] text-white sm:text-[13px]">SÂM NỮ HOÀNG G8 · 30 GÓI × 15 G · 450 G</div>
      <SiteHeader />

      <div id="noi-dung">
        <section className="relative isolate overflow-hidden bg-[#F7F2E7]">
          <div className="botanical-grid absolute inset-0 -z-10 opacity-45" aria-hidden="true" />
          <div className="mx-auto grid min-h-[700px] max-w-[1440px] items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-14 lg:py-20 xl:px-20">
            <div className="animate-rise max-w-[690px]">
              <p className="eyebrow">Dược liệu Việt · Nhịp sống hiện đại</p>
              <h1 className="mt-6 font-serif text-[clamp(3rem,6vw,6rem)] leading-[1.06] tracking-[-0.025em] text-[#052C20]">Tinh hoa dược liệu Việt trong nhịp sống hiện đại</h1>
              <p className="mt-7 max-w-[620px] text-[17px] leading-8 text-[#325247] sm:text-lg">Queen Ginseng phát triển sản phẩm từ nguồn nguyên liệu thiên nhiên, hướng đến sự tiện lợi, minh bạch và chất lượng.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 rounded-full bg-[#073D2B] px-7 text-white hover:bg-[#052C20]"><Link href={productHref}>Đặt mua sản phẩm <ArrowRight /></Link></Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[#073D2B]/25 bg-white/50 px-7 text-[#073D2B] hover:bg-white"><Link href="#dai-ly">Trở thành đại lý</Link></Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#587067]"><span>30 gói × 15 g</span><span>Khối lượng tịnh 450 g</span><span>{formatVnd(g8Product.price)} / hộp</span></div>
            </div>
            <div className="relative animate-soft-in">
              <div className="absolute -left-3 top-5 z-10 hidden rounded-full border border-[#C8A34A]/35 bg-[#F7F2E7]/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#7C652D] shadow-sm sm:block">G8 · Sản phẩm chủ lực</div>
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[#073D2B]/10 bg-[#EFE9DD] shadow-[0_35px_90px_rgba(5,44,32,0.14)]">
                <Image src={assetPath(g8Product.images[0].src)} alt={g8Product.images[0].alt} fill priority sizes="(max-width: 1024px) 100vw, 54vw" className="object-cover transition-transform duration-700 hover:scale-[1.025]" />
              </div>
            </div>
          </div>
        </section>

        <section id="san-pham" className="section-space scroll-mt-24 bg-white">
          <div className="container-wide"><div className="grid overflow-hidden rounded-[2rem] border border-[#073D2B]/10 bg-[#F7F2E7] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[420px] lg:min-h-[640px]"><Image src={assetPath(g8Product.images[0].src)} alt={g8Product.images[0].alt} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /></div>
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12"><p className="eyebrow">Sản phẩm G8</p><h2 className="mt-4 font-serif text-4xl leading-tight text-[#052C20] sm:text-5xl">{g8Product.name}</h2><p className="mt-2 text-lg text-[#587067]">{g8Product.subtitle}</p><p className="mt-7 text-3xl font-semibold text-[#073D2B]">{formatVnd(g8Product.price)}</p><div className="mt-7 grid grid-cols-3 gap-2 text-center text-sm"><span className="rounded-xl bg-white px-3 py-4">30 gói</span><span className="rounded-xl bg-white px-3 py-4">15 g/gói</span><span className="rounded-xl bg-white px-3 py-4">450 g</span></div><p className="mt-6 text-sm leading-6 text-[#587067]">Hạn sử dụng {g8Product.shelfLifeMonths} tháng kể từ ngày sản xuất. SKU: chưa xác nhận.</p><Button asChild size="lg" className="mt-8 h-12 rounded-full bg-[#073D2B] text-white hover:bg-[#052C20]"><Link href={productHref}>Xem chi tiết và đặt mua <ArrowRight /></Link></Button></div>
          </div></div>
        </section>

        <section aria-label="Giá trị Queen Ginseng" className="border-y border-[#073D2B]/10 bg-[#F7F2E7]"><div className="container-wide grid md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }, index) => <article key={title} className={`flex gap-4 py-8 md:px-7 ${index > 0 ? "border-t border-[#073D2B]/10 md:border-l md:border-t-0" : ""}`}><Icon className="mt-0.5 size-5 shrink-0 text-[#C8A34A]" aria-hidden="true" /><div><h2 className="font-semibold text-[#073D2B]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#587067]">{text}</p></div></article>)}</div></section>

        <section id="sam-nu-hoang" className="section-space scroll-mt-24 bg-white"><div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="eyebrow">Câu chuyện Sâm Nữ Hoàng</p><h2 className="section-title">Giá trị bản địa, cách tiếp cận đương đại</h2></div><div className="border-l border-[#C8A34A]/40 pl-6 sm:pl-10"><p className="font-serif text-2xl leading-10 text-[#294D40] sm:text-3xl sm:leading-[1.5]">Queen Ginseng Vietnam hướng đến việc đưa dược liệu Việt vào đời sống hiện đại bằng sản phẩm tiện lợi, thông tin rõ ràng và hình thức chỉn chu.</p><p className="mt-7 max-w-2xl text-base leading-8 text-[#587067]">Thông tin chi tiết về vùng nguyên liệu và quá trình phát triển thương hiệu: [...]</p></div></div></section>

        <section id="chat-luong" className="section-space scroll-mt-24 bg-[#073D2B] text-white"><div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16"><div><p className="eyebrow !text-[#D5C388]">Hồ sơ G8</p><h2 className="section-title !text-white">Hồ sơ sản phẩm được trình bày đúng phạm vi</h2><p className="mt-6 leading-7 text-white/65">Các tài liệu dưới đây là hồ sơ sản phẩm và kết quả kiểm nghiệm; không phải chứng nhận hiệu quả sức khỏe.</p></div><div className="grid gap-4 sm:grid-cols-2">{g8Product.legalDocuments.map((doc) => <article key={doc.title} className="flex min-h-[190px] flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.06] p-6"><ShieldCheck className="size-6 text-[#D5C388]" /><div className="mt-8"><h3 className="font-semibold">{doc.title}</h3><p className="mt-2 text-sm leading-6 text-white/60">{doc.detail}</p><a href={assetPath(doc.href)} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#D5C388]">Xem hồ sơ <ExternalLink className="size-4" /></a></div></article>)}</div></div></section>

        <section id="minh-bach" className="section-space scroll-mt-24 bg-[#F7F2E7]"><div className="container-wide"><div className="max-w-3xl"><p className="eyebrow">Nghiên cứu & Minh bạch</p><h2 className="section-title">Rõ nguồn tài liệu, đúng phạm vi dữ liệu</h2><p className="section-copy">Queen Ginseng hướng đến việc trình bày rõ nguồn tài liệu và phạm vi của từng kết quả nghiên cứu.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{transparencyCards.map(({ icon: Icon, title, text, href }) => <Link key={title} href={href} className="group rounded-[1.5rem] border border-[#073D2B]/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(5,44,32,0.08)]"><Icon className="size-6 text-[#C8A34A]" /><h3 className="mt-10 font-serif text-2xl text-[#052C20]">{title}</h3><p className="mt-3 leading-7 text-[#587067]">{text}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#073D2B]">Tìm hiểu <ArrowRight className="size-4 transition group-hover:translate-x-1" /></span></Link>)}</div><div className="mt-6 flex flex-wrap gap-3 text-xs text-[#6B7C75]">{researchDocuments.map((doc) => <a key={doc.title} href={assetPath(doc.href)} target="_blank" rel="noreferrer" className="rounded-full border border-[#073D2B]/15 bg-white px-4 py-2 hover:border-[#C8A34A]">{doc.title}</a>)}</div></div></section>

        <section id="dau-an" className="section-space scroll-mt-24 bg-white"><div className="container-wide"><div className="max-w-3xl"><p className="eyebrow">Dấu ấn thương hiệu</p><h2 className="section-title">Queen Ginseng tại Diễn đàn Hợp tác Phát triển Kinh tế Quốc tế 2026</h2></div><div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><div className="relative min-h-[520px] overflow-hidden rounded-[2rem] bg-[#EEE8DC]"><Image src={assetPath("/images/brand-awards/2026/award-ceremony.webp")} alt="Đại diện Queen Ginseng Việt Nam nhận cúp và chứng nhận tại diễn đàn năm 2026" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-center" /></div><div className="grid gap-5"><div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-[#EEE8DC]"><Image src={assetPath("/images/brand-awards/2026/award-certificate.webp")} alt="Chứng nhận Top 10 Thương hiệu - Nhãn hiệu uy tín hội nhập kinh tế quốc tế năm 2026" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" /></div><div className="rounded-[2rem] bg-[#052C20] p-7 text-white"><Award className="size-7 text-[#C8A34A]" /><h3 className="mt-5 font-serif text-2xl leading-9">Top 10 Thương hiệu – Nhãn hiệu uy tín hội nhập kinh tế quốc tế năm 2026</h3><p className="mt-4 text-sm text-white/65">Ngày 19/09/2026 · Đây là dấu ấn thương hiệu, không phải chứng nhận chất lượng hay hiệu quả của sản phẩm G8.</p></div></div></div></div></section>

        <section id="kien-thuc" className="section-space scroll-mt-24 bg-[#F7F2E7]"><div className="container-wide"><div className="section-heading-row"><div><p className="eyebrow">Kiến thức dược liệu Việt Nam</p><h2 className="section-title">Đọc đúng nguồn, hiểu đúng đối tượng</h2></div><BookOpen className="hidden size-9 text-[#C8A34A] md:block" /></div><article className="mt-12 grid overflow-hidden rounded-[1.75rem] border border-[#073D2B]/10 bg-white md:grid-cols-[0.65fr_1.35fr]"><div className="flex min-h-[250px] items-end bg-[#073D2B] p-8"><span className="font-serif text-7xl text-white/15">01</span></div><div className="p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C8A34A]">Nguồn ngoài · Người Đưa Tin</p><h3 className="mt-4 font-serif text-3xl leading-10 text-[#052C20]">Giá trị kinh tế của dược liệu Việt Nam: câu chuyện lá sâm Ngọc Linh</h3><p className="mt-5 leading-7 text-[#587067]">Bài viết nói về sâm Ngọc Linh, được dẫn như bối cảnh chung về giá trị dược liệu Việt Nam; không phải bằng chứng cho Sâm Nữ Hoàng hoặc G8.</p><a href="https://m.nguoiduatin.vn/loai-la-dat-do-bac-nhat-the-gioi-150-trieu-dong-kg-chi-duy-nhat-viet-nam-so-huu-204250821122019654.htm" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#073D2B]">Đọc bài gốc <ExternalLink className="size-4" /></a></div></article></div></section>

        <section id="dai-ly" className="section-space scroll-mt-24 bg-[#C8A34A]"><div className="container-wide grid items-center gap-10 lg:grid-cols-[1fr_auto]"><div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#052C20]/70">NPP · Đại lý · Cộng tác viên</p><h2 className="mt-5 font-serif text-[clamp(2.7rem,5vw,5rem)] leading-[1.03] tracking-[-0.04em] text-[#052C20]">Cùng đưa dược liệu Việt đến gần hơn với người dùng</h2><p className="mt-6 text-[#052C20]/70">Chính sách hợp tác: [...]</p></div><Button asChild size="lg" className="h-13 rounded-full bg-[#052C20] px-8 text-white hover:bg-[#073D2B]"><Link href="#lien-he">Đăng ký hợp tác <ArrowRight /></Link></Button></div></section>
      </div>

      <footer id="lien-he" className="scroll-mt-24 bg-[#052C20] text-white"><div className="container-wide grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.25fr_0.75fr_0.9fr]"><div className="max-w-xl"><div className="flex items-center gap-3"><Leaf className="size-7 text-[#C8A34A]" /><span className="font-serif text-2xl">Queen Ginseng Vietnam</span></div><p className="mt-6 text-sm leading-7 text-white/65">{company.vietnameseName}<br />{company.shortName} · Mã số doanh nghiệp {company.enterpriseNumber}</p><p className="mt-3 text-sm leading-7 text-white/65">{company.address}</p></div><div><h2 className="text-sm font-semibold text-[#D5C388]">Khám phá</h2><nav className="mt-5 grid gap-3 text-sm text-white/65"><Link href={productHref} className="hover:text-white">Sản phẩm G8</Link><Link href="#minh-bach" className="hover:text-white">Nghiên cứu & Minh bạch</Link><Link href="#dau-an" className="hover:text-white">Dấu ấn thương hiệu</Link><Link href="#kien-thuc" className="hover:text-white">Kiến thức</Link></nav></div><div><h2 className="text-sm font-semibold text-[#D5C388]">Liên hệ</h2><div className="mt-5 space-y-3 text-sm text-white/65"><p>Hotline: {company.contact.hotline}</p><p>Email khách hàng: {company.contact.email}</p><p>Zalo: {company.contact.zalo}</p><p>Facebook: {company.contact.facebook}</p><p>TikTok: {company.contact.tiktok}</p></div></div></div><div className="border-t border-white/10"><div className="container-wide flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:justify-between"><p>© 2026 Queen Ginseng Vietnam. Bảo lưu mọi quyền.</p><p>Giao hàng · Đổi trả · Chính sách bảo mật: [...]</p></div></div></footer>
    </main>
  );
}
