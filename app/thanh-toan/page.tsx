"use client";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { company } from "@/lib/company";
import { CommerceError, makeIdempotencyKey, submitOrder, type OrderReceipt } from "@/lib/commerce-api";
import { g8Product, productPack, productWeight } from "@/lib/products";
import { formatVnd } from "@/lib/site";

export default function CheckoutPage() {
  const {quantity, clear} = useCart();
  const [method, setMethod] = useState<"COD" | "BANK">("COD");
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const idempotencyKeyRef = useRef<string>("");
  const total = quantity * g8Product.price;
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const data = new FormData(event.currentTarget);
    setIsSubmitting(true);
    try {
      idempotencyKeyRef.current ||= makeIdempotencyKey();
      const order = await submitOrder({ idempotencyKey: idempotencyKeyRef.current, quantity, customerName:String(data.get("name")), phone:String(data.get("phone")), province:String(data.get("province")), ward:String(data.get("ward")), address:String(data.get("address")), email:String(data.get("email")||""), note:String(data.get("note")||""), paymentMethod:method, website:String(data.get("website")||"") });
      setReceipt(order); clear();
    } catch (err) {
      setError(err instanceof CommerceError ? err.message : "Chưa thể tiếp nhận đơn. Vui lòng thử lại.");
      requestAnimationFrame(() => errorRef.current?.focus());
    } finally { setIsSubmitting(false); }
  }
  return <main className="min-h-screen bg-background">
    <a href="#noi-dung" className="skip-link">Chuyển đến nội dung chính</a><SiteHeader />
    <div id="noi-dung" className="container-wide py-8 sm:py-12">
      <div className="demo-notice mb-8" role="note"><strong>Thông tin yêu cầu đặt hàng.</strong><p className="mt-1 text-sm">Website chỉ xác nhận tiếp nhận đơn khi nhận được phản hồi từ hệ thống vận hành. Phí giao hàng và tổng thanh toán được xác nhận sau.</p></div>
      {receipt ? <section className="py-10 text-center" aria-live="polite"><h1 className="font-serif text-4xl">Đã tiếp nhận yêu cầu đặt hàng</h1><p className="mt-4">Mã đơn: <strong>{receipt.orderCode}</strong></p><p className="mt-2">Tạm tính tiền hàng: {formatVnd(receipt.subtotalVnd)}</p><p className="mt-4 text-muted-foreground">Queen Ginseng sẽ xác nhận tồn kho, phí giao hàng và hướng dẫn thanh toán sau.</p><Button asChild className="mt-6"><Link href={`/san-pham/${g8Product.slug}`}>Quay lại sản phẩm G8</Link></Button></section>
      : !quantity ? <section className="py-12 text-center"><h1 className="font-serif text-4xl">Giỏ hàng đang trống</h1><p className="mt-4 text-muted-foreground">Chọn sản phẩm trước khi trải nghiệm bước thanh toán.</p><Button asChild className="mt-6 rounded-full"><Link href={`/san-pham/${g8Product.slug}`}>Xem sản phẩm G8</Link></Button></section>
      : <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6"><div><p className="eyebrow">Đặt hàng G8</p><h1 className="mt-3 font-serif text-4xl">Thông tin nhận hàng</h1></div>
          <section aria-label="Thông tin người nhận" className="rounded-2xl bg-white p-5 sm:p-8"><div className="grid gap-4 sm:grid-cols-2">
            <label className="form-label">Họ và tên<input name="name" required autoComplete="name" className="form-input" /></label>
            <label className="form-label">Số điện thoại<input name="phone" required autoComplete="tel" className="form-input" inputMode="tel" /></label>
            <label className="form-label">Tỉnh/Thành phố<input name="province" required className="form-input" /></label>
            <label className="form-label">Phường/Xã<input name="ward" required className="form-input" /></label>
            <label className="form-label sm:col-span-2">Địa chỉ<input name="address" required autoComplete="street-address" className="form-input" /></label>
            <label className="form-label">Email (không bắt buộc)<input name="email" type="email" autoComplete="email" className="form-input" /></label>
            <label className="form-label">Ghi chú<input name="note" className="form-input" /></label>
          </div></section>
          <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <fieldset className="rounded-2xl bg-white p-5 sm:p-8"><legend className="px-2 font-serif text-2xl">Phương thức thanh toán</legend>
            <div className="grid gap-3">{([{value:"COD",title:"COD — thanh toán khi nhận hàng"},{value:"BANK",title:"Chuyển khoản ngân hàng — chờ xác nhận đơn"}] as const).map(option => <label key={option.value} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-4 ${method === option.value ? "border-primary bg-background" : ""}`}><input type="radio" name="payment" value={option.value} checked={method === option.value} onChange={()=>setMethod(option.value)} className="size-5 accent-primary" /><span>{option.title}</span></label>)}</div>
            {method === "BANK" && <details className="mt-5 rounded-xl border p-4"><summary className="min-h-11 py-2 font-semibold">Thông tin chuyển khoản sau khi xác nhận</summary><p className="demo-notice my-4"><strong>Chưa chuyển tiền ở bước này.</strong> Queen Ginseng cần xác nhận tồn kho và phí giao hàng trước khi gửi số tiền, mã đơn và QR thanh toán.</p><dl className="space-y-3 text-sm"><div><dt className="text-muted-foreground">Ngân hàng</dt><dd>{company.payment.bank}</dd></div><div><dt className="text-muted-foreground">Tên tài khoản</dt><dd>{company.payment.accountName}</dd></div><div><dt className="text-muted-foreground">Số tài khoản</dt><dd>{company.payment.accountNumber}</dd></div></dl></details>}
          </fieldset>
        </div>
        <aside className="rounded-2xl bg-primary p-6 text-white lg:sticky lg:top-28"><h2 className="font-serif text-2xl">Sản phẩm đã chọn</h2><p className="mt-5">{g8Product.name} × {quantity}</p><p className="mt-2 text-sm text-white/80">{productPack(g8Product)} · {productWeight(g8Product)}</p><div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-white/20 pt-5 font-semibold"><span>Tạm tính tiền hàng</span><span className="price">{formatVnd(total)}</span></div><p className="mt-3 text-sm text-white/80">Chưa gồm phí vận chuyển. Phí giao hàng chưa xác nhận.</p>
          {error && <div ref={errorRef} tabIndex={-1} role="alert" className="mt-4 rounded-xl bg-white p-3 text-sm text-destructive">{error}</div>}
          <Button disabled={isSubmitting} className="mt-6 min-h-12 w-full rounded-full bg-accent text-accent-foreground hover:bg-[#D5B765]">{isSubmitting ? "Đang gửi yêu cầu…" : "Gửi yêu cầu đặt hàng"}</Button><p className="mt-4 text-sm leading-6 text-white/80">Chỉ tiếp nhận đơn khi hệ thống phản hồi thành công. Phí giao hàng sẽ được xác nhận sau.</p>
        </aside>
      </form>}
    </div><SiteFooter />
  </main>;
}
