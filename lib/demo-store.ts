import { g8Product } from "@/lib/products";
import { referralConfig } from "@/lib/referral-config";

export const DEMO_KEYS = {
  users: "qgv-demo-users-v1", session: "qgv-demo-session-v1", orders: "qgv-demo-orders-v1",
  referrals: "qgv-demo-referrals-v1", commissions: "qgv-demo-commissions-v1",
  wallet: "qgv-demo-wallet-v1", withdrawals: "qgv-demo-withdrawals-v1",
} as const;

export type DemoUser = { id: string; name: string; phone: string; email?: string; referralCode: string; referrerId: string | null; createdAt: string };
export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "COMPLETED" | "CANCELLED" | "RETURNED";
export type DemoOrder = { id: string; code: string; userId: string; customerName: string; phone: string; province: string; ward: string; address: string; email?: string; note?: string; items: { productId: string; quantity: number; unitPrice: number }[]; subtotal: number; discount: number; shippingFee: number | null; commissionEligibleAmount: number; total: number; paymentMethod: "COD" | "BANK"; referrerId: string | null; status: OrderStatus; createdAt: string };
export type CommissionStatus = "PENDING" | "AVAILABLE" | "PAID" | "CANCELLED";
export type DemoCommission = { id: string; beneficiaryId: string; buyerId: string; orderId: string; eligibleAmount: number; rate: number; amount: number; status: CommissionStatus; createdAt: string };
export type WalletType = "COMMISSION_PENDING" | "COMMISSION_RELEASE" | "COMMISSION_CANCEL" | "WITHDRAWAL_REQUEST" | "WITHDRAWAL_PAID";
export type WalletTransaction = { id: string; userId: string; type: WalletType; amount: number; referenceId: string; createdAt: string };
export type WithdrawalStatus = "PENDING" | "APPROVED" | "PAID" | "REJECTED";
export type DemoWithdrawal = { id: string; userId: string; amount: number; bank: string; accountNumber: string; accountName: string; status: WithdrawalStatus; createdAt: string };

const eventName = "qgv-demo-changed";
const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const now = () => new Date().toISOString();
const load = <T>(key: string, fallback: T): T => { if (typeof window === "undefined") return fallback; try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; } };
const save = (key: string, value: unknown) => { localStorage.setItem(key, JSON.stringify(value)); window.dispatchEvent(new Event(eventName)); };
export const subscribeDemo = (callback: () => void) => { window.addEventListener(eventName, callback); window.addEventListener("storage", callback); return () => { window.removeEventListener(eventName, callback); window.removeEventListener("storage", callback); }; };
export const getSnapshot = () => Object.values(DEMO_KEYS).map((key) => localStorage.getItem(key) || "").join("|");
export const getUsers = () => load<DemoUser[]>(DEMO_KEYS.users, []);
export const getOrders = () => load<DemoOrder[]>(DEMO_KEYS.orders, []);
export const getCommissions = () => load<DemoCommission[]>(DEMO_KEYS.commissions, []);
export const getWallet = () => load<WalletTransaction[]>(DEMO_KEYS.wallet, []);
export const getWithdrawals = () => load<DemoWithdrawal[]>(DEMO_KEYS.withdrawals, []);
export const getSession = () => load<{ userId: string } | null>(DEMO_KEYS.session, null);
export const currentUser = () => { const session = getSession(); return session ? getUsers().find((u) => u.id === session.userId) ?? null : null; };
const makeCode = () => `QG${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export function registerUser(input: { name: string; phone: string; email?: string; referralCode?: string }) {
  const users = getUsers();
  const duplicate = users.find((u) => u.phone === input.phone);
  if (duplicate && input.referralCode?.trim().toUpperCase() === duplicate.referralCode) throw new Error("Bạn không thể sử dụng mã giới thiệu của chính mình.");
  if (duplicate) { save(DEMO_KEYS.session, { userId: duplicate.id }); return duplicate; }
  let referrer: DemoUser | undefined;
  if (input.referralCode) referrer = users.find((u) => u.referralCode.toUpperCase() === input.referralCode!.trim().toUpperCase());
  const user: DemoUser = { id: uid("usr"), name: input.name.trim(), phone: input.phone.trim(), email: input.email?.trim() || undefined, referralCode: makeCode(), referrerId: referrer?.id ?? null, createdAt: now() };
  users.push(user); save(DEMO_KEYS.users, users); save(DEMO_KEYS.session, { userId: user.id });
  if (referrer) save(DEMO_KEYS.referrals, [...load(DEMO_KEYS.referrals, [] as { referrerId: string; referredUserId: string; createdAt: string }[]), { referrerId: referrer.id, referredUserId: user.id, createdAt: now() }]);
  return user;
}
export function loginUser(phone: string) { const user = getUsers().find((u) => u.phone === phone.trim()); if (!user) return null; save(DEMO_KEYS.session, { userId: user.id }); return user; }
export function logoutUser() { localStorage.removeItem(DEMO_KEYS.session); window.dispatchEvent(new Event(eventName)); }

export function createOrder(input: Omit<DemoOrder, "id" | "code" | "userId" | "items" | "subtotal" | "discount" | "shippingFee" | "commissionEligibleAmount" | "total" | "referrerId" | "status" | "createdAt"> & { quantity: number }) {
  const user = currentUser(); if (!user) throw new Error("Vui lòng đăng nhập trước khi đặt hàng.");
  const subtotal = input.quantity * g8Product.price;
  const order: DemoOrder = { id: uid("ord"), code: `QGV-DEMO-${Date.now().toString().slice(-7)}`, userId: user.id, customerName: input.customerName, phone: input.phone, province: input.province, ward: input.ward, address: input.address, email: input.email, note: input.note, items: [{ productId: g8Product.id, quantity: input.quantity, unitPrice: g8Product.price }], subtotal, discount: 0, shippingFee: null, commissionEligibleAmount: subtotal, total: subtotal, paymentMethod: input.paymentMethod, referrerId: user.referrerId, status: "PENDING", createdAt: now() };
  save(DEMO_KEYS.orders, [...getOrders(), order]);
  if (user.referrerId) {
    const amount = Math.round(order.commissionEligibleAmount * referralConfig.commissionRate);
    const commission: DemoCommission = { id: uid("com"), beneficiaryId: user.referrerId, buyerId: user.id, orderId: order.id, eligibleAmount: order.commissionEligibleAmount, rate: referralConfig.commissionRate, amount, status: "PENDING", createdAt: now() };
    save(DEMO_KEYS.commissions, [...getCommissions(), commission]);
    save(DEMO_KEYS.wallet, [...getWallet(), { id: uid("wal"), userId: user.referrerId, type: "COMMISSION_PENDING", amount, referenceId: commission.id, createdAt: now() } satisfies WalletTransaction]);
  }
  return order;
}

export function updateOrderStatus(orderId: string, status: OrderStatus) { const orders = getOrders(); const order = orders.find((o) => o.id === orderId); if (!order) return; order.status = status; save(DEMO_KEYS.orders, orders); if (status === "CANCELLED" || status === "RETURNED") cancelCommission(orderId); }
export function approveCommission(orderId: string) { const order = getOrders().find((o) => o.id === orderId); if (!order || order.status !== "COMPLETED") return false; const list = getCommissions(); const item = list.find((c) => c.orderId === orderId && c.status === "PENDING"); if (!item) return false; item.status = "AVAILABLE"; save(DEMO_KEYS.commissions, list); save(DEMO_KEYS.wallet, [...getWallet(), { id: uid("wal"), userId: item.beneficiaryId, type: "COMMISSION_RELEASE", amount: item.amount, referenceId: item.id, createdAt: now() } satisfies WalletTransaction]); return true; }
function cancelCommission(orderId: string) { const list = getCommissions(); const item = list.find((c) => c.orderId === orderId && c.status !== "CANCELLED" && c.status !== "PAID"); if (!item) return; item.status = "CANCELLED"; save(DEMO_KEYS.commissions, list); save(DEMO_KEYS.wallet, [...getWallet(), { id: uid("wal"), userId: item.beneficiaryId, type: "COMMISSION_CANCEL", amount: item.amount, referenceId: item.id, createdAt: now() } satisfies WalletTransaction]); }

export function balances(userId: string) { const commissions = getCommissions().filter((c) => c.beneficiaryId === userId); const withdrawals = getWithdrawals().filter((w) => w.userId === userId); const paidCommission = commissions.filter((c) => c.status === "PAID").reduce((s, c) => s + c.amount, 0); const paidWithdrawal = withdrawals.filter((w) => w.status === "PAID").reduce((s, w) => s + w.amount, 0); const reserved = withdrawals.filter((w) => w.status === "PENDING" || w.status === "APPROVED").reduce((s, w) => s + w.amount, 0); const released = commissions.filter((c) => c.status === "AVAILABLE").reduce((s, c) => s + c.amount, 0); return { pending: commissions.filter((c) => c.status === "PENDING").reduce((s, c) => s + c.amount, 0), available: Math.max(0, released - reserved - Math.max(0, paidWithdrawal - paidCommission)), paid: paidWithdrawal }; }
export function requestWithdrawal(input: Omit<DemoWithdrawal, "id" | "userId" | "status" | "createdAt">) { const user = currentUser(); if (!user) throw new Error("Vui lòng đăng nhập."); if (input.amount <= 0 || input.amount > balances(user.id).available) throw new Error("Số tiền rút vượt quá số dư hoa hồng khả dụng."); const item: DemoWithdrawal = { ...input, id: uid("wd"), userId: user.id, status: "PENDING", createdAt: now() }; save(DEMO_KEYS.withdrawals, [...getWithdrawals(), item]); save(DEMO_KEYS.wallet, [...getWallet(), { id: uid("wal"), userId: user.id, type: "WITHDRAWAL_REQUEST", amount: item.amount, referenceId: item.id, createdAt: now() } satisfies WalletTransaction]); return item; }
export function updateWithdrawal(id: string, status: WithdrawalStatus) { const list = getWithdrawals(); const item = list.find((w) => w.id === id); if (!item || item.status === "PAID") return; item.status = status; save(DEMO_KEYS.withdrawals, list); if (status === "PAID") { const commissions = getCommissions(); let remaining = item.amount; for (const c of commissions.filter((c) => c.beneficiaryId === item.userId && c.status === "AVAILABLE")) { if (remaining <= 0) break; if (c.amount <= remaining) { c.status = "PAID"; remaining -= c.amount; } } save(DEMO_KEYS.commissions, commissions); save(DEMO_KEYS.wallet, [...getWallet(), { id: uid("wal"), userId: item.userId, type: "WITHDRAWAL_PAID", amount: item.amount, referenceId: item.id, createdAt: now() } satisfies WalletTransaction]); } }

export function seedDemo() { const createdAt = now(); const a: DemoUser = { id: "demo-a", name: "Nguyễn Minh Demo", phone: "0900000001", referralCode: "QGDEMOA", referrerId: null, createdAt }; const b: DemoUser = { id: "demo-b", name: "Khách Demo", phone: "0900000002", referralCode: "QGDEMOB", referrerId: a.id, createdAt }; save(DEMO_KEYS.users, [a, b]); save(DEMO_KEYS.referrals, [{ referrerId: a.id, referredUserId: b.id, createdAt }]); save(DEMO_KEYS.session, { userId: a.id }); const order: DemoOrder = { id: "demo-order", code: "QGV-DEMO-0001", userId: b.id, customerName: b.name, phone: b.phone, province: "Hà Nội", ward: "Xuân Mai", address: "Địa chỉ minh họa", items: [{ productId: "g8", quantity: 1, unitPrice: 480000 }], subtotal: 480000, discount: 0, shippingFee: null, commissionEligibleAmount: 480000, total: 480000, paymentMethod: "COD", referrerId: a.id, status: "PENDING", createdAt }; const commission: DemoCommission = { id: "demo-commission", beneficiaryId: a.id, buyerId: b.id, orderId: order.id, eligibleAmount: 480000, rate: .05, amount: 24000, status: "PENDING", createdAt }; save(DEMO_KEYS.orders, [order]); save(DEMO_KEYS.commissions, [commission]); save(DEMO_KEYS.wallet, [{ id: "demo-wallet", userId: a.id, type: "COMMISSION_PENDING", amount: 24000, referenceId: commission.id, createdAt }]); save(DEMO_KEYS.withdrawals, []); }
export function resetDemo() { Object.values(DEMO_KEYS).forEach((key) => localStorage.removeItem(key)); window.dispatchEvent(new Event(eventName)); }
