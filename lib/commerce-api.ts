import { g8Product } from '@/lib/products';
import { assetPath } from '@/lib/site';
import { normalizeFields, orderErrors, validKey, validReceipt, type OrderRequest, type OrderReceipt } from './order-validation';
export type {OrderRequest,OrderReceipt} from './order-validation';
export type CommerceConfig={orderApiUrl:string;ordersEnabled:boolean};
export class CommerceError extends Error {constructor(message:string,public readonly code:string){super(message);}}
export function makeIdempotencyKey(){
  if(crypto.randomUUID)return crypto.randomUUID();
  const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
  const hex=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
export function normalizeOrderRequest(input:OrderRequest):OrderRequest {
  const errors=orderErrors(input);
  if(Object.keys(errors).length||!validKey(input.idempotencyKey))throw new CommerceError(Object.values(errors)[0]||'Mã yêu cầu không hợp lệ.','INVALID_ORDER');
  return {...normalizeFields(input),idempotencyKey:input.idempotencyKey};
}
export async function getCommerceConfig():Promise<CommerceConfig>{
  try{
    const response=await fetch(assetPath('/config/commerce.json'),{cache:'no-store',signal:AbortSignal.timeout(8000)});
    if(!response.ok)throw new Error();
    const value=await response.json(),url=new URL(value.orderApiUrl);
    if(value.ordersEnabled!==true||url.protocol!=='https:'||url.username||url.password)throw new Error();
    return {ordersEnabled:true,orderApiUrl:url.href};
  }catch{return {ordersEnabled:false,orderApiUrl:''};}
}
// Persist only an opaque key/hash, never contact details. An ambiguous request must
// be reconciled before submitting different details, even after a reload.
const PENDING_KEY='qgv-order-pending-v1';
let memoryPending:{key:string;fingerprint:string}|null=null;
export async function requestKey(input:Omit<OrderRequest,'idempotencyKey'>){
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(normalizeFields(input))));
  const fingerprint=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
  let pending=memoryPending;
  try{const saved=JSON.parse(sessionStorage.getItem(PENDING_KEY)||'null');if(saved&&validKey(saved.key)&&typeof saved.fingerprint==='string')pending=saved;}catch{}
  if(pending&&pending.fingerprint!==fingerprint)throw new CommerceError('Yêu cầu trước chưa rõ kết quả. Hãy gửi lại đúng thông tin trước đó để kiểm tra, tránh tạo hai đơn.','PENDING_ORDER_CHANGED');
  memoryPending=pending||{key:makeIdempotencyKey(),fingerprint};
  try{sessionStorage.setItem(PENDING_KEY,JSON.stringify(memoryPending));}catch{}
  return memoryPending.key;
}
export function clearPendingRequest(){memoryPending=null;try{sessionStorage.removeItem(PENDING_KEY);}catch{}}
export async function submitOrder(input:OrderRequest):Promise<OrderReceipt>{
  const payload=normalizeOrderRequest(input),config=await getCommerceConfig();
  if(!config.ordersEnabled)throw new CommerceError('Hệ thống chưa tiếp nhận đơn hàng thật. Vui lòng không chuyển tiền.','ORDERS_UNAVAILABLE');
  try{
    const response=await fetch(config.orderApiUrl,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...payload,productId:g8Product.id}),signal:AbortSignal.timeout(15000)});
    const body=await response.json().catch(()=>null);
    if(response.ok&&body?.ok===true&&validReceipt(body.order,payload.quantity*g8Product.price))return body.order;
    const messages:Record<string,string>={INVALID_ORDER:'Vui lòng kiểm tra lại thông tin nhận hàng.',RATE_LIMITED:'Bạn gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.',ORDERS_UNAVAILABLE:'Hệ thống chưa tiếp nhận đơn hàng thật. Vui lòng không chuyển tiền.',IDEMPOTENCY_CONFLICT:'Yêu cầu trước có thông tin khác. Cần đối chiếu trước khi đặt thêm đơn.'};
    const code=typeof body?.error?.code==='string'?body.error.code:'INVALID_RESPONSE';
    throw new CommerceError(messages[code]||'Chưa xác minh được kết quả. Hãy thử lại với cùng thông tin; không chuyển tiền.',code);
  }catch(error){
    if(error instanceof CommerceError)throw error;
    throw new CommerceError('Kết nối bị gián đoạn. Yêu cầu có thể đang được xử lý; hãy thử lại với cùng thông tin và không chuyển tiền.','ORDER_NETWORK_ERROR');
  }
}
