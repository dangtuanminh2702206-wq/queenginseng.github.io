import { g8Product } from "@/lib/products";
import { assetPath } from "@/lib/site";

type CommerceConfig = {
  orderApiUrl?: string;
  ordersEnabled?: boolean;
};

export type OrderRequest = {
  idempotencyKey: string;
  customerName: string;
  phone: string;
  email?: string;
  province: string;
  ward: string;
  address: string;
  note?: string;
  paymentMethod: "COD" | "BANK";
  quantity: number;
  website: string;
};

export type OrderReceipt = {
  orderCode: string;
  orderStatus: "PENDING";
  subtotalVnd: number;
  shippingFeeVnd: null;
  totalVnd: null;
};

export class CommerceError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
  }
}

function cleanText(value: string, maxLength: number) {
  return value.replace(/[\r\n\t]+/g, " ").trim().slice(0, maxLength);
}

export function makeIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `qgv-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function normalizeOrderRequest(input: OrderRequest): OrderRequest {
  const quantity = Math.floor(input.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new CommerceError("Số lượng cần từ 1 đến 99 hộp.", "INVALID_QUANTITY");
  const name = cleanText(input.customerName, 100);
  const phone = cleanText(input.phone, 24);
  const province = cleanText(input.province, 100);
  const ward = cleanText(input.ward, 100);
  const address = cleanText(input.address, 240);
  if (!name || !phone || !province || !ward || !address) throw new CommerceError("Vui lòng điền đủ thông tin nhận hàng.", "INVALID_CUSTOMER");
  return {
    ...input,
    customerName: name,
    phone,
    province,
    ward,
    address,
    email: input.email ? cleanText(input.email, 160) : undefined,
    note: input.note ? cleanText(input.note, 500) : undefined,
  };
}

async function getConfig(): Promise<CommerceConfig> {
  const response = await fetch(assetPath("/config/commerce.json"), { cache: "no-store" });
  if (!response.ok) return {};
  return response.json() as Promise<CommerceConfig>;
}

export async function submitOrder(input: OrderRequest): Promise<OrderReceipt> {
  const payload = normalizeOrderRequest(input);
  const config = await getConfig();
  if (!config.ordersEnabled || !config.orderApiUrl) {
    throw new CommerceError("Hệ thống đặt hàng trực tuyến đang được thiết lập. Vui lòng quay lại sau.", "ORDERS_UNAVAILABLE");
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(config.orderApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ ...payload, productId: g8Product.id }),
      signal: controller.signal,
    });
    const body = await response.json().catch(() => null) as { ok?: boolean; error?: { code?: string; message?: string }; order?: OrderReceipt } | null;
    if (!response.ok || !body?.ok || !body.order) {
      throw new CommerceError(body?.error?.message || "Chưa thể tiếp nhận đơn. Vui lòng thử lại.", body?.error?.code || "ORDER_REQUEST_FAILED");
    }
    return body.order;
  } catch (error) {
    if (error instanceof CommerceError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw new CommerceError("Kết nối mất quá lâu. Đơn chưa được xác nhận; bạn có thể thử lại với cùng thông tin.", "ORDER_TIMEOUT");
    throw new CommerceError("Không thể kết nối hệ thống đặt hàng. Vui lòng thử lại sau.", "ORDER_NETWORK_ERROR");
  } finally {
    window.clearTimeout(timeout);
  }
}
