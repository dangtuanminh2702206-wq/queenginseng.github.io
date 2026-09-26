/**
 * Queen Ginseng order store. Deploy this project as a Web App that executes
 * as the Sheet owner. Requests are accepted only from the Cloudflare Worker.
 * Configure SPREADSHEET_ID and INTERNAL_KEY in Apps Script Script Properties.
 */
const REQUIRED_SHEETS = ["Products", "Customers", "Orders", "OrderItems", "InventoryTransactions", "AuditLog"];

function doPost(event) {
  try {
    const request = JSON.parse(event.postData && event.postData.contents || "{}");
    if (request.internalKey !== getProperty_("INTERNAL_KEY")) return json_({ ok: false, error: { code: "UNAUTHORIZED", message: "Yêu cầu không được phép." } });
    if (request.action !== "createOrder") return json_({ ok: false, error: { code: "UNKNOWN_ACTION", message: "Thao tác không hợp lệ." } });
    return json_({ ok: true, order: createOrder_(request.payload || {}, request.visitorKey || "") });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: { code: "SERVER_ERROR", message: "Không thể xử lý yêu cầu." } });
  }
}

function createOrder_(payload, visitorKey) {
  validateOrder_(payload);
  rateLimit_(visitorKey);
  const lock = LockService.getScriptLock();
  lock.waitLock(20_000);
  try {
    const spreadsheet = SpreadsheetApp.openById(getProperty_("SPREADSHEET_ID"));
    ensureSheets_(spreadsheet);
    const orders = spreadsheet.getSheetByName("Orders");
    const existing = findByColumn_(orders, 3, payload.idempotencyKey);
    if (existing) return readReceipt_(orders, existing);
    const product = findByColumn_(spreadsheet.getSheetByName("Products"), 1, "g8");
    if (!product || product[4] !== 480000 || product[9] !== true) throw new Error("Sản phẩm hiện chưa sẵn sàng nhận đơn.");
    const now = new Date().toISOString();
    const orderId = Utilities.getUuid();
    const orderCode = makeOrderCode_();
    const subtotal = payload.quantity * product[4];
    const customerId = upsertCustomer_(spreadsheet.getSheetByName("Customers"), payload, now);
    orders.appendRow([orderId, orderCode, safe_(payload.idempotencyKey), customerId, safe_(payload.customerName), safe_(payload.phone), safe_(payload.email || ""), [safe_(payload.address), safe_(payload.ward), safe_(payload.province)].filter(Boolean).join(", "), subtotal, "", 0, "", "VND", payload.paymentMethod, "PENDING", "UNPAID", "PENDING", "", now, now, safe_(payload.note || "")]);
    spreadsheet.getSheetByName("OrderItems").appendRow([Utilities.getUuid(), orderId, "g8", "Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan", product[4], payload.quantity, subtotal, now]);
    spreadsheet.getSheetByName("AuditLog").appendRow([Utilities.getUuid(), "system", "ORDER_CREATED", "ORDER", orderId, "", JSON.stringify({ orderCode: orderCode, quantity: payload.quantity, subtotalVnd: subtotal }), "Khách gửi đơn qua website", now]);
    return { orderCode: orderCode, orderStatus: "PENDING", subtotalVnd: subtotal, shippingFeeVnd: null, totalVnd: null };
  } finally {
    lock.releaseLock();
  }
}

function validateOrder_(payload) {
  if (!payload || typeof payload !== "object") throw new Error("Dữ liệu không hợp lệ.");
  if (!/^[0-9a-f-]{20,80}$/i.test(String(payload.idempotencyKey || ""))) throw new Error("Khóa yêu cầu không hợp lệ.");
  if (!["COD", "BANK"].includes(payload.paymentMethod)) throw new Error("Phương thức thanh toán không hợp lệ.");
  if (!Number.isInteger(payload.quantity) || payload.quantity < 1 || payload.quantity > 99) throw new Error("Số lượng không hợp lệ.");
  [payload.customerName, payload.phone, payload.province, payload.ward, payload.address].forEach(function (value) { if (!safe_(value)) throw new Error("Thiếu thông tin nhận hàng."); });
  if (String(payload.website || "")) throw new Error("Yêu cầu không hợp lệ.");
}

function upsertCustomer_(sheet, payload, now) {
  const phone = safe_(payload.phone);
  const found = findByColumn_(sheet, 4, phone);
  if (found) return found[0];
  const id = Utilities.getUuid();
  sheet.appendRow([id, "", safe_(payload.customerName), phone, safe_(payload.email || ""), now, now, "ACTIVE"]);
  return id;
}

function readReceipt_(sheet, row) { return { orderCode: row[1], orderStatus: row[14], subtotalVnd: row[8], shippingFeeVnd: row[9] || null, totalVnd: row[11] || null }; }
function findByColumn_(sheet, column, value) { const last = sheet.getLastRow(); if (last < 2) return null; const values = sheet.getRange(2, 1, last - 1, sheet.getLastColumn()).getValues(); return values.find(function (row) { return String(row[column - 1]) === String(value); }) || null; }
function makeOrderCode_() { return "QGV-" + Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyMMdd") + "-" + Utilities.getUuid().slice(0, 6).toUpperCase(); }
function rateLimit_(visitorKey) { const key = "rate:" + String(visitorKey || "anonymous"); const cache = CacheService.getScriptCache(); const count = Number(cache.get(key) || 0); if (count >= 5) throw new Error("Vui lòng chờ ít phút trước khi gửi lại."); cache.put(key, String(count + 1), 600); }
function safe_(value) { return String(value || "").replace(/[\r\n\t]+/g, " ").replace(/^([=+\-@])/, "'$1").trim().slice(0, 500); }
function getProperty_(name) { const value = PropertiesService.getScriptProperties().getProperty(name); if (!value) throw new Error("Thiếu cấu hình " + name); return value; }
function ensureSheets_(spreadsheet) { REQUIRED_SHEETS.forEach(function (name) { if (!spreadsheet.getSheetByName(name)) throw new Error("Thiếu tab " + name); }); }
function json_(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
