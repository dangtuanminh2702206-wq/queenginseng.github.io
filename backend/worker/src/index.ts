export interface Env {
  APPS_SCRIPT_URL: string;
  INTERNAL_KEY: string;
  RATE_LIMIT_SALT: string;
  ALLOWED_ORIGIN: string;
}

type OrderPayload = {
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
  productId: "g8";
  website?: string;
};

const headers = { "content-type": "application/json; charset=UTF-8", "cache-control": "no-store" };
const error = (code: string, message: string, status = 400, origin?: string) => new Response(JSON.stringify({ ok: false, error: { code, message } }), { status, headers: cors({ ...headers }, origin) });
const cors = (base: Record<string, string>, origin?: string) => ({ ...base, "access-control-allow-origin": origin || "", vary: "Origin" });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") || "";
    if (origin !== env.ALLOWED_ORIGIN) return error("ORIGIN_NOT_ALLOWED", "Nguồn yêu cầu không được phép.", 403, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors({ "access-control-allow-methods": "POST, OPTIONS", "access-control-allow-headers": "content-type", "access-control-max-age": "86400" }, origin) });
    if (request.method !== "POST" || new URL(request.url).pathname !== "/orders") return error("NOT_FOUND", "Không tìm thấy yêu cầu.", 404, origin);
    let payload: OrderPayload;
    try { payload = await request.json() as OrderPayload; } catch { return error("INVALID_JSON", "Dữ liệu gửi lên không hợp lệ.", 400, origin); }
    if (!valid(payload)) return error("INVALID_ORDER", "Thông tin đơn hàng chưa hợp lệ.", 400, origin);
    const visitorKey = await digest(`${request.headers.get("CF-Connecting-IP") || "unknown"}:${env.RATE_LIMIT_SALT}`);
    const gatewayResponse = await fetch(env.APPS_SCRIPT_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "createOrder", internalKey: env.INTERNAL_KEY, visitorKey, payload }) });
    const body = await gatewayResponse.text();
    return new Response(body, { status: gatewayResponse.ok ? 200 : 502, headers: cors(headers, origin) });
  },
};

function valid(payload: OrderPayload) { return payload && payload.productId === "g8" && /^[0-9a-f-]{20,80}$/i.test(payload.idempotencyKey) && Number.isInteger(payload.quantity) && payload.quantity > 0 && payload.quantity <= 99 && ["COD", "BANK"].includes(payload.paymentMethod) && !payload.website && [payload.customerName, payload.phone, payload.province, payload.ward, payload.address].every(value => typeof value === "string" && value.trim().length > 0); }
async function digest(value: string) { const bytes = new TextEncoder().encode(value); const hash = await crypto.subtle.digest("SHA-256", bytes); return Array.from(new Uint8Array(hash)).map(byte => byte.toString(16).padStart(2, "0")).join(""); }
