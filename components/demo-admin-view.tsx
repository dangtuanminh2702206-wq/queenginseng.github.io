"use client";
import { useState } from "react";
import { SiteFooter } from "@/components/site-footer";
import { statusLabel } from "@/lib/demo-labels";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { approveCommission, getCommissions, getOrders, getUsers, getWallet, getWithdrawals, resetDemo, seedDemo, updateOrderStatus, updateWithdrawal } from "@/lib/demo-store";
import { formatVnd } from "@/lib/site";
import { useDemo } from "@/components/use-demo";

export function DemoAdminView() {
  const { hydrated } = useDemo(); const [, refresh] = useState(0);
  const orders = hydrated ? getOrders() : [], users = hydrated ? getUsers() : [], commissions = hydrated ? getCommissions() : [], withdrawals = hydrated ? getWithdrawals() : [];
  const [message, setMessage] = useState("");
  const rerender = () => refresh((value) => value + 1);
  const act = (action: () => unknown) => { try { const result = action(); setMessage(result === false ? "Thao tác chưa đủ điều kiện hoặc đã được xử lý." : "Đã cập nhật dữ liệu thử nghiệm."); } catch(e) { setMessage(e instanceof Error ? e.message : "Không thể thực hiện."); } rerender(); };
  return <main className="min-h-screen bg-[#F7F2E7]"><SiteHeader/><section className="container-wide py-12">
    <div className="rounded-2xl bg-red-950 p-5 text-white"><p className="text-xs font-bold tracking-[.2em]">QUẢN TRỊ THỬ NGHIỆM · CHỈ LƯU TRÊN TRÌNH DUYỆT</p><h1 className="mt-3 font-serif text-4xl">Quản trị dữ liệu thử nghiệm</h1><p className="mt-3 text-sm text-white/70">Mọi thao tác chỉ ảnh hưởng trình duyệt này. Không có đơn, tiền hoặc người dùng thật.</p></div>
    <div className="mt-5 flex flex-wrap gap-3"><Button onClick={() => { act(seedDemo); }} className="bg-[#073D2B]">Tạo dữ liệu mẫu</Button><Button variant="outline" onClick={() => { if (confirm("Xóa toàn bộ dữ liệu qgv-demo-* trên trình duyệt này?")) { resetDemo(); rerender(); } }}>Đặt lại dữ liệu demo</Button></div>
    <p role="status" className="mt-4 text-sm">{message}</p><div className="mt-8 grid gap-6">
      <Panel title={`Người dùng (${users.length})`}>{users.map((user) => <p key={user.id} className="border-b py-3 text-sm"><b>{user.name}</b> · {user.referralCode} · Người giới thiệu: {users.find((item) => item.id === user.referrerId)?.referralCode || "—"}</p>)}</Panel>
      <Panel title={`Đơn hàng (${orders.length})`}>{orders.map((order) => <article key={order.id} className="border-b py-4"><div className="flex flex-wrap justify-between gap-3"><div><b>{order.code}</b><p className="text-sm text-[#587067]">{users.find((user) => user.id === order.userId)?.name} · {formatVnd(order.total)} · {statusLabel(order.status)}</p></div><div className="flex flex-wrap gap-2">{(["CONFIRMED", "SHIPPING", "COMPLETED"] as const).map((status) => <Button key={status} size="sm" variant="outline" onClick={() => { act(() => updateOrderStatus(order.id, status)); }}>{statusLabel(status)}</Button>)}<Button size="sm" variant="outline" onClick={() => { act(() => updateOrderStatus(order.id, "CANCELLED")); }}>Hủy</Button><Button size="sm" onClick={() => { act(() => approveCommission(order.id)); }}>Duyệt hoa hồng</Button></div></div></article>)}</Panel>
      <Panel title={`Hoa hồng (${commissions.length})`}>{commissions.map((commission) => <p key={commission.id} className="border-b py-3 text-sm">{statusLabel(commission.status)} · {formatVnd(commission.amount)} · đơn {orders.find((order) => order.id === commission.orderId)?.code}</p>)}</Panel>
      <Panel title={`Rút tiền (${withdrawals.length})`}>{withdrawals.map((withdrawal) => <div key={withdrawal.id} className="flex flex-wrap justify-between gap-3 border-b py-3 text-sm"><span>{formatVnd(withdrawal.amount)} · {statusLabel(withdrawal.status)} · {withdrawal.bank}</span><div className="flex flex-wrap gap-2">{(["APPROVED", "PAID", "REJECTED"] as const).map((status) => <Button key={status} size="sm" variant="outline" onClick={() => { act(() => updateWithdrawal(withdrawal.id, status)); }}>{statusLabel(status)}</Button>)}</div></div>)}</Panel>
      <Panel title={`Sổ giao dịch (${hydrated ? getWallet().length : 0})`}><p className="text-sm text-[#587067]">Được ghi tự động khi hoa hồng phát sinh, được duyệt, bị hủy hoặc được chi trả.</p></Panel>
    </div>
  </section><SiteFooter/></main>;
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-[#073D2B]/10 bg-white p-6"><h2 className="font-serif text-2xl">{title}</h2><div className="mt-3">{children}</div></section>; }
