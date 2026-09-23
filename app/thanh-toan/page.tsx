"use client";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/components/use-demo";
import { company } from "@/lib/company";
import { createOrder } from "@/lib/demo-store";
import { g8Product, productPack, productWeight } from "@/lib/products";
import { assetPath, formatVnd } from "@/lib/site";

export default function CheckoutPage() {
  const {quantity, clear} = useCart();
  const {user} = useDemo();
  const [method, setMethod] = useState<"COD" | "BANK">("COD");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const total = quantity * g8Product.price;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!user) { setError("Vui lòng đăng nhập tài khoản thử nghiệm để lưu bản mô phỏng."); return; }
    const data = new FormData(event.currentTarget);
    try {
      const order = createOrder({quantity, customerName:String(data.get("name")), phone:String(data.get("phone")), province:String(data.get("province")), ward:String(data.get("ward")), address:String(data.get("address")), email:String(data.get("email")||""), note:String(data.get("note")||""), paymentMethod:method});
      setCode(order.code); clear();
    } catch (err) { setError(err instanceof Error ? err.message : "Không thể lưu bản mô phỏng."); }
  }
  return <main className="min-h-screen bg-background">
    <a href="#noi-dung" className="skip-link">Chuyển đến nội dung chính</a><SiteHeader />
    <div id="noi-dung" className="container-wide py-8 sm:py-12">
      <div className="demo-notice mb-8" role="note"><strong>Bản trải nghiệm — chưa tiếp nhận đơn hàng thật. Vui lòng không chuyển tiền.</strong><p className="mt-1 text-sm">Tài khoản và đơn mô phỏng chỉ lưu trong trình duyệt này. Không nhập thông tin cá nhân thật để thử nghiệm.</p></div>
      {code ? <section className="py-10 text-center" aria-live="polite"><h1 className="font-serif text-4xl">Đã lưu bản mô phỏng</h1><p className="mt-4">Mã mô phỏng cục bộ: {code}</p><p className="mt-4 text-muted-foreground">Chưa gửi đơn tới Queen Ginseng. Không phát sinh thanh toán hoặc giao hàng.</p><Button asChild className="mt-6"><Link href="/tai-khoan/don-hang">Xem đơn thử nghiệm</Link></Button></section>
      : !quantity ? <section className="py-12 text-center"><h1 className="font-serif text-4xl">Giỏ hàng đang trống</h1><p className="mt-4 text-muted-foreground">Chọn sản phẩm trước khi trải nghiệm bước thanh toán.</p><Button asChild className="mt-6 rounded-full"><Link href={`/san-pham/${g8Product.slug}`}>Xem sản phẩm G8</Link></Button></section>
      : <form onSubmit={submit} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6"><div><p className="eyebrow">Thanh toán thử nghiệm</p><h1 className="mt-3 font-serif text-4xl">Thông tin nhận hàng</h1></div>
          {!user && <p className="rounded-xl border bg-white p-4 text-sm">Để lưu bản mô phỏng, hãy <Link href="/dang-nhap" className="font-semibold underline">đăng nhập</Link> hoặc <Link href="/dang-ky" className="font-semibold underline">tạo tài khoản thử nghiệm</Link>.</p>}
          <section aria-label="Thông tin người nhận thử nghiệm" className="rounded-2xl bg-white p-5 sm:p-8"><div className="grid gap-4 sm:grid-cols-2">
            <label className="form-label">Họ và tên<input name="name" required defaultValue={user?.name || ""} className="form-input" /></label>
            <label className="form-label">Số điện thoại<input name="phone" required defaultValue={user?.phone || ""} className="form-input" inputMode="tel" /></label>
            <label className="form-label">Tỉnh/Thành phố<input name="province" required className="form-input" /></label>
            <label className="form-label">Phường/Xã<input name="ward" required className="form-input" /></label>
            <label className="form-label sm:col-span-2">Địa chỉ<input name="address" required className="form-input" /></label>
            <label className="form-label">Email (không bắt buộc)<input name="email" type="email" className="form-input" /></label>
            <label className="form-label">Ghi chú<input name="note" className="form-input" /></label>
          </div></section>
          <fieldset className="rounded-2xl bg-white p-5 sm:p-8"><legend className="px-2 font-serif text-2xl">Phương thức thanh toán</legend>
            <div className="grid gap-3">{([{value:"COD",title:"COD — thanh toán khi nhận hàng"},{value:"BANK",title:"Chuyển khoản ngân hàng — xem trước"}] as const).map(option => <label key={option.value} className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border p-4 ${method === option.value ? "border-primary bg-background" : ""}`}><input type="radio" name="payment" value={option.value} checked={method === option.value} onChange={()=>setMethod(option.value)} className="size-5 accent-primary" /><span>{option.title}</span></label>)}</div>
            {method === "BANK" && <details className="mt-5 rounded-xl border p-4"><summary className="min-h-11 py-2 font-semibold">Xem trước QR doanh nghiệp</summary><p className="demo-notice my-4"><strong>QR nhận tiền thật — chỉ xem trước. Vui lòng không chuyển tiền trong bản trải nghiệm.</strong></p><Image src={assetPath(company.payment.qrImage)} alt="QR MB Bank của doanh nghiệp — chỉ xem trước, không chuyển tiền" width={545} height={818} className="mx-auto h-auto w-full max-w-[250px]" /><dl className="mt-4 space-y-3 text-sm"><div><dt className="text-muted-foreground">Tên tài khoản</dt><dd>{company.payment.accountName}</dd></div><div><dt className="text-muted-foreground">Số tài khoản · {company.payment.bank}</dt><dd>{company.payment.accountNumber}</dd></div><div><dt className="text-muted-foreground">Tạm tính tiền hàng, chưa gồm vận chuyển</dt><dd>{formatVnd(total)}</dd></div></dl><p className="mt-4 text-sm leading-6">Chưa có nội dung chuyển khoản cho đơn thật. Website không tự kiểm tra hoặc xác nhận giao dịch ngân hàng.</p></details>}
          </fieldset>
        </div>
        <aside className="rounded-2xl bg-primary p-6 text-white lg:sticky lg:top-28"><h2 className="font-serif text-2xl">Sản phẩm đã chọn</h2><p className="mt-5">{g8Product.name} × {quantity}</p><p className="mt-2 text-sm text-white/80">{productPack(g8Product)} · {productWeight(g8Product)}</p><div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-white/20 pt-5 font-semibold"><span>Tạm tính tiền hàng</span><span className="price">{formatVnd(total)}</span></div><p className="mt-3 text-sm text-white/80">Chưa gồm phí vận chuyển. Phí giao hàng chưa xác nhận.</p>
          {error && <p role="alert" className="mt-4 rounded-xl bg-white p-3 text-sm text-destructive">{error}</p>}
          <Button className="mt-6 min-h-12 w-full rounded-full bg-accent text-accent-foreground hover:bg-[#D5B765]">Lưu đơn mô phỏng</Button><p className="mt-4 text-sm leading-6 text-white/80">Chỉ lưu trên thiết bị này, không phải đơn hàng thật.</p>
        </aside>
      </form>}
    </div><SiteFooter />
  </main>;
}
