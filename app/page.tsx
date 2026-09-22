import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BookOpen, FileCheck2, Leaf, PackageCheck, Quote, Scale, Sparkles, Sprout } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

const basePath = process.env.GITHUB_ACTIONS === "true" ? "/queenginseng.github.io" : "";

const benefits = [
  { icon: Sprout, title: "Nguồn nguyên liệu thiên nhiên", text: "Định hướng phát triển từ dược liệu Việt." },
  { icon: PackageCheck, title: "Tiện lợi mỗi ngày", text: "Quy cách gọn gàng, phù hợp nhịp sống hiện đại." },
  { icon: FileCheck2, title: "Thông tin minh bạch", text: "Thông tin sản phẩm được trình bày rõ ràng." },
];
const goals = [
  { number: "01", title: "Nhu cầu sử dụng", text: "[...]" },
  { number: "02", title: "Thói quen hằng ngày", text: "[...]" },
  { number: "03", title: "Lựa chọn làm quà", text: "[...]" },
  { number: "04", title: "Sản phẩm phù hợp", text: "[...]" },
];
const reasons = [
  { icon: Leaf, title: "Định hướng dược liệu Việt", text: "Phát triển sản phẩm từ nguồn nguyên liệu thiên nhiên theo tinh thần hiện đại." },
  { icon: Scale, title: "Tôn trọng sự minh bạch", text: "Thông tin quan trọng được thể hiện rõ trên bao bì và tài liệu sản phẩm." },
  { icon: Sparkles, title: "Trải nghiệm chỉn chu", text: "Từ thiết kế đến cách sử dụng đều hướng tới sự gọn gàng và thuận tiện." },
];
const articles = [
  { tag: "Kiến thức", title: "Hiểu đúng thông tin trên bao bì sản phẩm", text: "[...]" },
  { tag: "Dược liệu Việt", title: "Từ nguyên liệu thiên nhiên đến sản phẩm hiện đại", text: "[...]" },
  { tag: "Cẩm nang", title: "Cách lựa chọn sản phẩm phù hợp nhu cầu", text: "[...]" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <a href="#noi-dung" className="skip-link">Chuyển đến nội dung chính</a>
      <div className="bg-[#052C20] px-4 py-2.5 text-center text-[13px] font-medium tracking-[0.08em] text-white">QUEEN GINSENG VIETNAM · TINH HOA DƯỢC LIỆU VIỆT</div>
      <SiteHeader />

      <div id="noi-dung">
        <section className="relative isolate overflow-hidden bg-[#F7F2E7]">
          <div className="botanical-grid absolute inset-0 -z-10 opacity-45" aria-hidden="true" />
          <div className="mx-auto grid min-h-[720px] max-w-[1440px] items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-14 lg:py-24 xl:px-20">
            <div className="animate-rise max-w-[690px]">
              <p className="eyebrow">Dược liệu Việt · Nhịp sống hiện đại</p>
              <h1 className="mt-6 font-serif text-[clamp(3.1rem,6.2vw,6.25rem)] leading-[1.06] tracking-[-0.025em] text-[#052C20]">Tinh hoa dược liệu Việt trong nhịp sống hiện đại</h1>
              <p className="mt-7 max-w-[620px] text-[17px] leading-8 text-[#325247] sm:text-lg">Queen Ginseng phát triển các sản phẩm từ nguồn nguyên liệu thiên nhiên, hướng đến sự tiện lợi, minh bạch và chất lượng.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button type="button" size="lg" className="h-12 rounded-full bg-[#073D2B] px-7 text-[15px] text-white shadow-none hover:bg-[#052C20]">Đặt mua sản phẩm <ArrowRight /></Button>
                <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-[#073D2B]/25 bg-white/50 px-7 text-[15px] text-[#073D2B] shadow-none hover:bg-white"><Link href="#dai-ly">Trở thành đại lý</Link></Button>
              </div>
            </div>
            <div className="relative animate-soft-in lg:pl-4">
              <div className="absolute -left-5 top-7 z-10 hidden rounded-full border border-[#C8A34A]/35 bg-[#F7F2E7]/95 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C652D] shadow-sm sm:block">8 gói × 3 g</div>
              <div className="relative aspect-square overflow-hidden rounded-[2.5rem] border border-[#073D2B]/10 bg-[#EAE3D5] shadow-[0_35px_90px_rgba(5,44,32,0.14)]">
                <Image src={`${basePath}/images/g8-box-crop.jpg`} alt="Hộp Queen Ginseng G8 Trà sâm hòa tan" fill priority sizes="(max-width: 1024px) 100vw, 54vw" className="object-cover object-center transition-transform duration-700 hover:scale-[1.025]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#052C20]/40 to-transparent p-7 pt-24 text-white"><p className="text-sm font-medium tracking-[0.14em]">QUEEN GINSENG G8</p><p className="mt-1 text-sm text-white/80">Trà sâm hòa tan · 24 g</p></div>
              </div>
            </div>
          </div>
        </section>

        <section aria-label="Giá trị thương hiệu" className="border-y border-[#073D2B]/10 bg-white">
          <div className="mx-auto grid max-w-[1280px] gap-0 px-5 sm:px-8 md:grid-cols-3 lg:px-12">
            {benefits.map(({ icon: Icon, title, text }, index) => <div key={title} className={`flex gap-4 py-7 md:px-7 ${index > 0 ? "border-t border-[#073D2B]/10 md:border-l md:border-t-0" : ""}`}><Icon className="mt-0.5 size-5 shrink-0 text-[#C8A34A]" aria-hidden="true" /><div><h2 className="text-sm font-semibold text-[#073D2B]">{title}</h2><p className="mt-1 text-sm leading-6 text-[#587067]">{text}</p></div></div>)}
          </div>
        </section>

        <section id="san-pham" className="section-space bg-white scroll-mt-24">
          <div className="container-wide">
            <div className="section-heading-row"><div><p className="eyebrow">Sản phẩm nổi bật</p><h2 className="section-title">Được chọn cho nhịp sống mỗi ngày</h2></div><Button asChild variant="link" className="hidden p-0 text-[#073D2B] md:inline-flex"><Link href="#g8">Xem chi tiết <ArrowRight /></Link></Button></div>
            <div className="mt-12">
              <article className="product-card group grid overflow-hidden lg:grid-cols-[1.15fr_0.85fr]">
                <div className="relative aspect-square overflow-hidden bg-[#EEE8DC] lg:aspect-auto lg:min-h-[620px]"><Image src={`${basePath}/images/g8-box-crop.jpg`} alt="Queen Ginseng G8 Trà sâm hòa tan" fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover transition duration-700 group-hover:scale-[1.025]" /><span className="absolute left-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#073D2B]">Sản phẩm chủ lực</span></div>
                <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:p-12"><div><p className="text-sm text-[#6B7C75]">Trà sâm hòa tan</p><h3 className="mt-2 font-serif text-4xl leading-tight text-[#052C20] sm:text-5xl">Queen Ginseng G8</h3><p className="mt-5 leading-7 text-[#587067]">Sản phẩm trọng tâm của Queen Ginseng Vietnam, phát triển theo định hướng tiện lợi và phù hợp với nhịp sống hiện đại.</p><div className="mt-7 grid grid-cols-3 gap-2 text-center text-sm"><span className="rounded-xl bg-[#F7F2E7] px-3 py-4">8 gói/hộp</span><span className="rounded-xl bg-[#F7F2E7] px-3 py-4">3 g/gói</span><span className="rounded-xl bg-[#F7F2E7] px-3 py-4">Tổng 24 g</span></div></div><div><p className="text-sm text-[#6B7C75]">Giá</p><p className="mt-1 text-xl font-semibold text-[#073D2B]">[...]</p><Button type="button" size="lg" className="mt-6 h-12 rounded-full bg-[#073D2B] px-7 text-white hover:bg-[#052C20]">Đặt mua sản phẩm <ArrowRight /></Button></div></div>
              </article>
            </div>
          </div>
        </section>

        <section className="section-space bg-[#F7F2E7]">
          <div className="container-wide"><div className="max-w-2xl"><p className="eyebrow">Khám phá theo nhu cầu</p><h2 className="section-title">Bắt đầu từ điều bạn quan tâm</h2><p className="section-copy">Thông tin công dụng đang được cập nhật và sẽ chỉ hiển thị sau khi được xác nhận.</p></div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{goals.map((goal) => <article key={goal.number} className="goal-card group"><span className="font-serif text-5xl text-[#C8A34A]/55">{goal.number}</span><div className="mt-20"><h3 className="text-lg font-semibold text-[#073D2B]">{goal.title}</h3><p className="mt-2 text-sm text-[#587067]">{goal.text}</p><ArrowRight className="mt-5 size-5 text-[#C8A34A] transition-transform group-hover:translate-x-1" aria-hidden="true" /></div></article>)}</div>
          </div>
        </section>

        <section id="g8" className="section-space overflow-hidden bg-[#073D2B] text-white scroll-mt-24">
          <div className="container-wide grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative order-2 lg:order-1"><div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[#E8E2D6] shadow-[0_30px_80px_rgba(0,0,0,0.2)]"><Image src={`${basePath}/images/g8-box-crop.jpg`} alt="Hộp Queen Ginseng G8" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div><div className="absolute -bottom-6 right-5 rounded-2xl border border-white/15 bg-[#052C20]/95 p-5 shadow-xl backdrop-blur sm:right-10"><p className="text-xs uppercase tracking-[0.15em] text-[#D5C388]">Quy cách hiện tại</p><p className="mt-2 text-xl font-semibold">24 g · 8 gói × 3 g</p></div></div>
            <div className="order-1 lg:order-2"><p className="eyebrow !text-[#D5C388]">Sản phẩm tiêu biểu</p><h2 className="mt-5 font-serif text-[clamp(2.8rem,5vw,5rem)] leading-[1.02] tracking-[-0.035em]">Queen Ginseng G8</h2><p className="mt-4 text-xl text-white/75">Trà sâm hòa tan</p>
              <div className="mt-9 grid gap-3 sm:grid-cols-3">{["8 gói/hộp", "3 g/gói", "Tổng 24 g"].map((item) => <div key={item} className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-4 text-center text-sm font-medium">{item}</div>)}</div>
              <dl className="mt-9 divide-y divide-white/15 border-y border-white/15 text-sm"><div className="grid grid-cols-[130px_1fr] gap-4 py-4"><dt className="text-white/55">Thành phần</dt><dd>[...]</dd></div><div className="grid grid-cols-[130px_1fr] gap-4 py-4"><dt className="text-white/55">Công dụng</dt><dd>[...]</dd></div><div className="grid grid-cols-[130px_1fr] gap-4 py-4"><dt className="text-white/55">Giá bán</dt><dd>[...]</dd></div></dl>
              <Button type="button" size="lg" className="mt-9 h-12 rounded-full bg-[#C8A34A] px-7 text-[#052C20] hover:bg-[#D5B765]">Đặt mua sản phẩm <ArrowRight /></Button>
            </div>
          </div>
        </section>

        <section id="sam-nu-hoang" className="section-space bg-white scroll-mt-24"><div className="container-wide grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><div><p className="eyebrow">Câu chuyện Sâm Nữ Hoàng</p><h2 className="section-title">Giá trị bản địa, cách tiếp cận đương đại</h2></div><div className="border-l border-[#C8A34A]/40 pl-6 sm:pl-10"><p className="font-serif text-2xl leading-10 text-[#294D40] sm:text-3xl sm:leading-[1.5]">Queen Ginseng Vietnam hướng đến việc đưa dược liệu Việt vào đời sống hiện đại bằng những sản phẩm tiện lợi, thông tin rõ ràng và hình thức chỉn chu.</p><p className="mt-7 max-w-2xl text-base leading-8 text-[#587067]">Thông tin chi tiết về vùng nguyên liệu, quá trình phát triển thương hiệu và các cột mốc: [...]</p><Button asChild variant="link" className="mt-5 h-auto p-0 text-[#073D2B]"><Link href="#lien-he">Tìm hiểu câu chuyện thương hiệu <ArrowRight /></Link></Button></div></div></section>

        <section className="section-space bg-[#F7F2E7]"><div className="container-wide"><div className="text-center"><p className="eyebrow">Vì sao chọn Queen Ginseng</p><h2 className="section-title mx-auto">Một chuẩn mực rõ ràng cho trải nghiệm hằng ngày</h2></div><div className="mt-14 grid gap-5 md:grid-cols-3">{reasons.map(({ icon: Icon, title, text }, index) => <article key={title} className="rounded-[1.75rem] border border-[#073D2B]/10 bg-white p-7 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(5,44,32,0.08)] sm:p-9"><div className="flex size-12 items-center justify-center rounded-full bg-[#073D2B] text-white"><Icon className="size-5" /></div><p className="mt-10 text-xs font-semibold tracking-[0.14em] text-[#C8A34A]">0{index + 1}</p><h3 className="mt-3 font-serif text-2xl text-[#052C20]">{title}</h3><p className="mt-4 leading-7 text-[#587067]">{text}</p></article>)}</div></div></section>

        <section id="chat-luong" className="section-space bg-white scroll-mt-24"><div className="container-wide grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16"><div><p className="eyebrow">Hồ sơ chất lượng</p><h2 className="section-title">Thông tin cần được kiểm chứng</h2><p className="section-copy">Hồ sơ và chứng nhận sẽ được cập nhật khi có tài liệu chính thức.</p></div><div className="grid gap-4 sm:grid-cols-2">{["Hồ sơ sản phẩm", "Chứng nhận chất lượng", "Thông tin kiểm nghiệm", "Truy xuất nguồn gốc"].map((item) => <article key={item} className="flex min-h-[180px] flex-col justify-between rounded-2xl border border-[#073D2B]/12 p-6"><BadgeCheck className="size-6 text-[#C8A34A]" aria-hidden="true" /><div><h3 className="font-semibold text-[#073D2B]">{item}</h3><p className="mt-2 text-sm text-[#6B7C75]">[...]</p></div></article>)}</div></div></section>

        <section className="section-space bg-[#052C20] text-white"><div className="container-wide"><div className="max-w-2xl"><p className="eyebrow !text-[#D5C388]">Khách hàng nói gì</p><h2 className="section-title !text-white">Trải nghiệm từ người đã lựa chọn</h2><p className="mt-5 text-white/60">Nội dung đánh giá sẽ được hiển thị sau khi có dữ liệu xác thực.</p></div><div className="mt-12 grid gap-5 md:grid-cols-3">{[1, 2, 3].map((item) => <article key={item} className="rounded-[1.5rem] border border-white/12 bg-white/[0.055] p-7"><Quote className="size-7 text-[#C8A34A]" aria-hidden="true" /><p className="mt-10 font-serif text-2xl leading-9 text-white/85">“[...]”</p><div className="mt-10 border-t border-white/10 pt-5 text-sm text-white/55">[Tên khách hàng]</div></article>)}</div></div></section>

        <section id="dai-ly" className="section-space bg-[#C8A34A] scroll-mt-24"><div className="container-wide grid items-center gap-10 lg:grid-cols-[1fr_auto]"><div className="max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#052C20]/70">NPP · Đại lý · Cộng tác viên</p><h2 className="mt-5 font-serif text-[clamp(2.7rem,5vw,5rem)] leading-[1.03] tracking-[-0.04em] text-[#052C20]">Cùng đưa dược liệu Việt đến gần hơn với người dùng</h2><p className="mt-6 text-[#052C20]/70">Chính sách hợp tác: [...]</p></div><Button asChild size="lg" className="h-13 rounded-full bg-[#052C20] px-8 text-white hover:bg-[#073D2B]"><Link href="#lien-he">Đăng ký hợp tác <ArrowRight /></Link></Button></div></section>

        <section id="kien-thuc" className="section-space bg-[#F7F2E7] scroll-mt-24"><div className="container-wide"><div className="section-heading-row"><div><p className="eyebrow">Kiến thức dược liệu</p><h2 className="section-title">Đọc để hiểu rõ hơn</h2></div><BookOpen className="hidden size-9 text-[#C8A34A] md:block" aria-hidden="true" /></div><div className="mt-12 grid gap-5 md:grid-cols-3">{articles.map((article, index) => <article key={article.title} className="group overflow-hidden rounded-[1.5rem] border border-[#073D2B]/10 bg-white"><div className="flex aspect-[16/9] items-end bg-[#073D2B] p-6"><span className="font-serif text-7xl text-white/12">0{index + 1}</span></div><div className="p-6 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C8A34A]">{article.tag}</p><h3 className="mt-4 font-serif text-2xl leading-8 text-[#052C20]">{article.title}</h3><p className="mt-4 text-sm text-[#6B7C75]">{article.text}</p><span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#073D2B]">Đọc bài viết <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></div></article>)}</div></div></section>
      </div>

      <footer id="lien-he" className="bg-[#052C20] text-white scroll-mt-24"><div className="container-wide grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.2fr_0.8fr_0.8fr]"><div className="max-w-md"><div className="flex items-center gap-3"><Leaf className="size-7 text-[#C8A34A]" /><span className="font-serif text-2xl">Queen Ginseng Vietnam</span></div><p className="mt-6 text-sm leading-7 text-white/60">CÔNG TY CỔ PHẦN QUEEN GINSENG VIỆT NAM</p><p className="mt-2 text-sm leading-7 text-white/60">Thông tin liên hệ: [...]</p></div><div><h2 className="text-sm font-semibold text-[#D5C388]">Khám phá</h2><nav className="mt-5 grid gap-3 text-sm text-white/65" aria-label="Liên kết chân trang"><Link href="#san-pham" className="hover:text-white">Sản phẩm</Link><Link href="#sam-nu-hoang" className="hover:text-white">Sâm Nữ Hoàng</Link><Link href="#chat-luong" className="hover:text-white">Chất lượng</Link><Link href="#kien-thuc" className="hover:text-white">Kiến thức</Link></nav></div><div><h2 className="text-sm font-semibold text-[#D5C388]">Liên hệ</h2><div className="mt-5 space-y-3 text-sm text-white/65"><p>Địa chỉ: [...]</p><p>Điện thoại: [...]</p><p>Email: [...]</p></div></div></div><div className="border-t border-white/10"><div className="container-wide flex flex-col gap-3 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© 2026 Queen Ginseng Vietnam. Bảo lưu mọi quyền.</p><p>Chính sách: [...]</p></div></div></footer>
    </main>
  );
}

