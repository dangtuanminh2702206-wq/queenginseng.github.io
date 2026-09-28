import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
export default function NotFound() {
 return <main className="min-h-screen bg-background"><SiteHeader/><section className="container-wide py-24 text-center"><p className="eyebrow">Không tìm thấy trang</p><h1 className="mt-4 font-serif text-4xl">Trang này không còn khả dụng</h1><p className="mt-5">Bạn có thể quay về trang chủ để tiếp tục khám phá Sâm Nữ Hoàng G8.</p><Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-primary px-7 text-white">Về trang chủ</Link></section><SiteFooter/></main>;
}
