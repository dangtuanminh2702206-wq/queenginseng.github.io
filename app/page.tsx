import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, BookOpen, ExternalLink, FileCheck2, Leaf, PackageCheck, Sprout } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/site-footer";
import { g8Product, productPack, productWeight } from "@/lib/products";
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
      <div className="bg-[#052C20] px-4 py-2.5 text-center text-[12px] font-semibold tracking-[0.1em] text-white sm:text-[13px]">{g8Product.name} · {productPack(g8Product)} · {productWeight(g8Product)}</div>
      <SiteHeader />

      <div id="noi-dung">
        <section id="san-pham" className="scroll-mt-24 bg-background">
          <div className="container-wide grid items-center gap-x-12 gap-y-5 py-7 sm:py-10 lg:grid-cols-2 lg:py-14">
            <div className="lg:col-start-1 lg:row-start-1">
              <p className="eyebrow">Queen Ginseng Vietnam</p>
              <h1 className="mt-3 max-w-[16ch] font-serif text-[clamp(2.25rem,4.5vw,4.5rem)] leading-[1.06] tracking-[-.025em]">{g8Product.name}</h1>
              <p className="mt-2 text-lg text-muted-foreground sm:text-xl">{g8Product.subtitle}</p>
            </div>
            <div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-3xl border border-primary/10 bg-[#F2EBDD] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:aspect-square">
              <Image src={assetPath(g8Product.images[0].src)} alt={g8Product.images[0].alt} fill priority sizes="(max-width:640px) 90vw, (max-width:1024px) 560px, 46vw" className="object-contain" />
            </div>
            <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
              <p className="price text-3xl font-semibold">{formatVnd(g8Product.price)} <span className="text-base font-normal text-muted-foreground">/ hộp</span></p>
              <p className="mt-2 text-sm text-muted-foreground">{productPack(g8Product)} · Khối lượng tịnh {productWeight(g8Product)}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="min-h-12 rounded-full px-7"><Link href={productHref}>Đặt mua sản phẩm <ArrowRight aria-hidden="true" /></Link></Button>
                <Link href={productHref + "#gioi-thieu"} className="text-link px-2">Xem chi tiết G8</Link>
              </div>
              <p className="mt-5 max-w-lg leading-7 text-muted-foreground">Tinh hoa dược liệu Việt trong nhịp sống hiện đại. Từng gói trà sâm hòa tan, tiện lợi khi pha và thưởng thức.</p>
              <p className="mt-3 text-sm text-muted-foreground">Hạn sử dụng {g8Product.shelfLifeMonths} tháng kể từ ngày sản xuất.</p>
            </div>
          </div>
        </section>

        <section aria-label="Giá trị Queen Ginseng" className="border-y border-[#073D2B]/10 bg-[#F7F2E7]"><div className="container-wide grid md:grid-cols-3">{benefits.map(({ icon: Icon, title, text }, index) => <article key={title} className={`flex gap-4 py-8 md:px-7 ${index > 0 ? "border-t border-[#073D2B]/10 md:border-l md:border-t-0" : ""}`}><Icon className="mt-0.5 size-5 shrink-0 text-[#C8A34A]" aria-hidden="true" /><div><h2 className="font-semibold text-[#073D2B]">{title}</h2><p className="mt-2 text-sm leading-6 text-[#587067]">{text}</p></div></article>)}</div></section>

        <section id="sam-nu-hoang" className="section-space scroll-mt-24 bg-white"><div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="eyebrow">Câu chuyện Sâm Nữ Hoàng</p><h2 className="section-title">Giá trị bản địa, cách tiếp cận đương đại</h2></div><div className="border-l border-[#C8A34A]/40 pl-6 sm:pl-10"><p className="font-serif text-2xl leading-10 text-[#294D40] sm:text-3xl sm:leading-[1.5]">Queen Ginseng Vietnam hướng đến việc đưa dược liệu Việt vào đời sống hiện đại bằng sản phẩm tiện lợi, thông tin rõ ràng và hình thức chỉn chu.</p></div></div></section>

        <section id="minh-bach" className="section-space scroll-mt-24 bg-primary text-white">
          <div className="container-wide">
            <div id="chat-luong" className="scroll-mt-24 max-w-2xl"><p className="eyebrow !text-[#D5C388]">Hồ sơ & minh bạch</p><h2 className="section-title !text-white">Thông tin để bạn tìm hiểu G8</h2><p className="mt-4 leading-7 text-white/80">Hồ sơ sản phẩm, dữ liệu nguyên liệu và nguồn tham khảo được trình bày riêng, để bạn dễ tra cứu.</p></div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">{transparencyCards.map(({icon: Icon, title, text, href}) => <Link key={title} href={href} className="interactive-card rounded-2xl border border-white/25 p-5"><Icon className="size-6 text-[#D5C388]" aria-hidden="true" /><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-white/80">{text}</p><span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#D5C388]">Tìm hiểu <ArrowRight className="size-4" aria-hidden="true" /></span></Link>)}</div>
            <p className="mt-5 text-sm leading-6 text-white/80">Kết quả nghiên cứu nguyên liệu chỉ áp dụng cho mẫu thử, không thay thế hồ sơ sản phẩm G8.</p>
          </div>
        </section>

        <section id="dau-an" className="section-space scroll-mt-24 bg-white"><div className="container-wide"><div className="max-w-3xl"><p className="eyebrow">Dấu ấn thương hiệu</p><h2 className="section-title">Một dấu ấn của Queen Ginseng</h2></div><div className="mt-8 grid gap-5 md:grid-cols-[1.15fr_0.85fr]"><div className="relative min-h-[340px] md:min-h-[480px] overflow-hidden rounded-[2rem] bg-[#EEE8DC]"><Image src={assetPath("/images/brand-awards/2026/award-ceremony.webp")} alt="Đại diện Queen Ginseng Việt Nam nhận cúp và chứng nhận tại diễn đàn năm 2026" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-center" /></div><div className="grid gap-5"><div className="relative min-h-[230px] overflow-hidden rounded-[2rem] bg-[#EEE8DC]"><Image src={assetPath("/images/brand-awards/2026/award-certificate.webp")} alt="Chứng nhận Top 10 Thương hiệu - Nhãn hiệu uy tín hội nhập kinh tế quốc tế năm 2026" fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-contain" /></div><div className="rounded-[2rem] bg-[#052C20] p-7 text-white"><Award className="size-7 text-[#C8A34A]" /><h3 className="mt-5 font-serif text-2xl leading-9">Top 10 Thương hiệu – Nhãn hiệu uy tín hội nhập kinh tế quốc tế năm 2026</h3><p className="mt-4 text-sm text-white/65">Ngày 19/09/2026 · Đây là dấu ấn thương hiệu, không phải chứng nhận chất lượng hay hiệu quả của sản phẩm G8.</p></div></div></div></div></section>

        <section id="kien-thuc" className="section-space scroll-mt-24 bg-[#F7F2E7]"><div className="container-wide"><div className="section-heading-row"><div><p className="eyebrow">Kiến thức dược liệu Việt Nam</p><h2 className="section-title">Đọc đúng nguồn, hiểu đúng đối tượng</h2></div><BookOpen className="hidden size-9 text-[#C8A34A] md:block" /></div><article className="mt-7 overflow-hidden rounded-[1.75rem] border border-[#073D2B]/10 bg-white"><div className="p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#806526]">Nguồn ngoài · Người Đưa Tin</p><h3 className="mt-4 font-serif text-3xl leading-10 text-[#052C20]">Giá trị kinh tế của dược liệu Việt Nam: câu chuyện lá sâm Ngọc Linh</h3><p className="mt-5 leading-7 text-[#587067]">Bài viết nói về sâm Ngọc Linh, được dẫn như bối cảnh chung về giá trị dược liệu Việt Nam; không phải bằng chứng cho Sâm Nữ Hoàng hoặc G8.</p><a href="https://m.nguoiduatin.vn/loai-la-dat-do-bac-nhat-the-gioi-150-trieu-dong-kg-chi-duy-nhat-viet-nam-so-huu-204250821122019654.htm" target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 font-semibold text-[#073D2B]">Đọc bài gốc <ExternalLink className="size-4" /></a></div></article></div></section>

        <section id="dai-ly" className="section-space scroll-mt-24 border-t border-primary/10 bg-[#EEE8DC]"><div className="container-wide grid items-center gap-6 md:grid-cols-[1.3fr_1fr]"><div><p className="eyebrow">NPP · Đại lý · Cộng tác viên</p><h2 className="section-title">Kết nối cùng Queen Ginseng</h2></div><div><p className="leading-7 text-muted-foreground">Chính sách hợp tác và kênh tiếp nhận đăng ký đang được cập nhật.</p><p className="mt-3 rounded-xl border border-primary/15 bg-white p-4 text-sm text-muted-foreground">Chưa mở đăng ký trực tuyến. Thông tin sẽ được công bố khi có kênh tiếp nhận chính thức.</p></div></div></section>
      </div>
      <SiteFooter />
    </main>
  );
}
