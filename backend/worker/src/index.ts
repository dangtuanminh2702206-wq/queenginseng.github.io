import { normalizeFields, orderErrors, validKey, validReceipt, type OrderFields } from '../../../lib/order-validation';
export interface Env {APPS_SCRIPT_URL:string;INTERNAL_KEY:string;RATE_LIMIT_SALT:string;ALLOWED_ORIGIN:string}
const headers={'content-type':'application/json; charset=UTF-8','cache-control':'no-store','x-content-type-options':'nosniff',vary:'Origin'};
const reply=(body:unknown,status:number,origin?:string)=>new Response(JSON.stringify(body),{status,headers:{...headers,...(origin?{'access-control-allow-origin':origin}:{})}});
const error=(code:string,status:number,origin?:string)=>reply({ok:false,error:{code}},status,origin);
const statuses:Record<string,number>={INVALID_ORDER:400,IDEMPOTENCY_CONFLICT:409,RATE_LIMITED:429,ORDERS_UNAVAILABLE:503,STORE_UNSAFE:503,SCHEMA_ERROR:503};
export default {
 async fetch(request:Request,env:Env):Promise<Response>{
  const origin=request.headers.get('Origin')||'';
  if(!env.ALLOWED_ORIGIN||origin!==env.ALLOWED_ORIGIN)return error('ORIGIN_NOT_ALLOWED',403);
  if(new URL(request.url).pathname!=='/orders')return error('NOT_FOUND',404,origin);
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{...headers,'access-control-allow-origin':origin,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'content-type','access-control-max-age':'600'}});
  if(request.method!=='POST')return error('METHOD_NOT_ALLOWED',405,origin);
  if(!env.INTERNAL_KEY||!env.RATE_LIMIT_SALT||!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(env.APPS_SCRIPT_URL||''))return error('ORDERS_UNAVAILABLE',503,origin);
  if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))return error('INVALID_CONTENT_TYPE',415,origin);
  if(Number(request.headers.get('content-length'))>8192)return error('PAYLOAD_TOO_LARGE',413,origin);
  try{
    const reader=request.body?.getReader();if(!reader)return error('INVALID_ORDER',400,origin);
    const decoder=new TextDecoder();let text='',size=0;
    while(true){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>8192){await reader.cancel();return error('PAYLOAD_TOO_LARGE',413,origin);}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();
    let raw;try{raw=JSON.parse(text);}catch{return error('INVALID_JSON',400,origin);}
    if(!raw||typeof raw!=='object'||Array.isArray(raw)||raw.productId!=='g8'||!validKey(raw.idempotencyKey)||Object.keys(orderErrors(raw as OrderFields)).length)return error('INVALID_ORDER',400,origin);
    // Send an explicit allowlist; never forward client prices, permissions or statuses.
    const p=normalizeFields(raw);
    const payload={productId:'g8',idempotencyKey:raw.idempotencyKey,customerName:p.customerName,phone:p.phone,email:p.email,province:p.province,ward:p.ward,address:p.address,note:p.note,paymentMethod:p.paymentMethod,quantity:p.quantity,website:p.website};
    const ip=request.headers.get('CF-Connecting-IP');if(!ip)return error('ORDERS_UNAVAILABLE',503,origin);
    const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+':'+env.RATE_LIMIT_SALT));
    const visitorKey=Array.from(new Uint8Array(hash),v=>v.toString(16).padStart(2,'0')).join('');
    const upstream=await fetch(env.APPS_SCRIPT_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'createOrder',internalKey:env.INTERNAL_KEY,visitorKey,payload}),signal:AbortSignal.timeout(25000)});
    if(!upstream.ok)return error('UPSTREAM_ERROR',502,origin);
    const result=await upstream.json().catch(()=>null) as {ok?:boolean;order?:unknown;error?:{code?:string}}|null;
    if(result?.ok===true&&validReceipt(result.order,p.quantity*480000))return reply({ok:true,order:result.order},200,origin);
    const code=result?.error?.code;
    return error(code&&statuses[code]?code:'UPSTREAM_ERROR',code&&statuses[code]?statuses[code]:502,origin);
  }catch{return error('UPSTREAM_ERROR',502,origin);}
 }
};
