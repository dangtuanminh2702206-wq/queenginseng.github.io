/**
 * Deploy as Sheet owner; keep ORDERS_ENABLED=false until deployment acceptance.
 * All requests need INTERNAL_KEY. The URL itself is not an access control.
 * A WRITING order is a recoverable journal, not a successful order.
 */
const SCHEMA_ = {
 Products:['product_id','slug','legal_name','display_name','price_vnd','currency','units_per_box','unit_weight_g','net_weight_g','is_public','updated_at'],
 Customers:['customer_id','auth_subject','full_name','phone','email','created_at','updated_at','status'],
 Orders:['order_id','order_code','idempotency_key','customer_id','customer_name','phone','email','shipping_address','subtotal_vnd','shipping_fee_vnd','discount_vnd','total_vnd','currency','payment_method','order_status','payment_status','shipping_status','referrer_partner_id','created_at','updated_at','customer_note'],
 OrderItems:['order_item_id','order_id','product_id','product_name_snapshot','unit_price_vnd','quantity','line_total_vnd','created_at'],
 AuditLog:['audit_id','actor_id','action','entity_type','entity_id','before_json','after_json','reason','created_at']
};
function fail_(code){const error=new Error(code);error.code=code;throw error;}
function doPost(event){
 try{
  const text=event&&event.postData&&event.postData.contents||'';
  if(text.length>12000)fail_('INVALID_ORDER');
  let request;try{request=JSON.parse(text);}catch(error){fail_('INVALID_ORDER');}
  if(!request||request.internalKey!==getProperty_('INTERNAL_KEY'))fail_('UNAUTHORIZED');
  if(request.action!=='createOrder')fail_('INVALID_ORDER');
  if(getProperty_('ORDERS_ENABLED')!=='true')fail_('ORDERS_UNAVAILABLE');
  return json_({ok:true,order:createOrder_(request.payload,request.visitorKey)});
 }catch(error){
  const code=error.code||'SERVER_ERROR';
  console.error('Order request failed: '+code); // Never log request/contact data/secrets.
  return json_({ok:false,error:{code:code}});
 }
}
function validateOrder_(p){
 if(!p||typeof p!=='object'||Array.isArray(p)||p.productId!=='g8')fail_('INVALID_ORDER');
 if(typeof p.idempotencyKey!=='string'||! /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(p.idempotencyKey))fail_('INVALID_ORDER');
 if(!Number.isInteger(p.quantity)||p.quantity<1||p.quantity>99||!['COD','BANK'].includes(p.paymentMethod)||p.website)fail_('INVALID_ORDER');
 const limits={customerName:100,phone:24,province:100,ward:100,address:240,email:160,note:500};
 const result={productId:'g8',idempotencyKey:p.idempotencyKey,paymentMethod:p.paymentMethod,quantity:p.quantity};
 Object.keys(limits).forEach(function(key){
  const val=p[key]===undefined?'':p[key];
  if(typeof val!=='string'||val.length>limits[key])fail_('INVALID_ORDER');
  result[key]=val.replace(/[\r\n\t]+/g,' ').trim();
 });
 ['customerName','phone','province','ward','address'].forEach(function(k){if(!result[k])fail_('INVALID_ORDER');});
 result.phone=result.phone.replace(/[\s().-]/g,'').replace(/^\+84/,'0');
 if(!/^0\d{9}$/.test(result.phone)||(result.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)))fail_('INVALID_ORDER');
 return result;
}
function createOrder_(input,visitorKey){
 const p=validateOrder_(input);
 if(typeof visitorKey!=='string'||! /^[0-9a-f]{64}$/.test(visitorKey))fail_('INVALID_ORDER');
 const lock=LockService.getScriptLock();if(!lock.tryLock(10000))fail_('RATE_LIMITED');
 try{
  const id=getProperty_('SPREADSHEET_ID');
  // Fail closed if the underlying customer data store is broadly shared.
  if(DriveApp.getFileById(id).getSharingAccess()!==DriveApp.Access.PRIVATE)fail_('STORE_UNSAFE');
  const ss=SpreadsheetApp.openById(id),tables={};
  Object.keys(SCHEMA_).forEach(function(name){tables[name]=table_(ss,name);});
  let order=find_(tables.Orders,'idempotency_key',p.idempotencyKey);
  if(order){
   if(!matches_(order,p))fail_('IDEMPOTENCY_CONFLICT');
   // Resume an interrupted write. Returns only after child rows and audit exist.
   return finishOrder_(tables,order,p);
  }
  rateLimit_(visitorKey);
  const product=find_(tables.Products,'product_id','g8');
  if(!product||product.price_vnd!==480000||product.currency!=='VND'||product.units_per_box!==30||product.unit_weight_g!==15||product.net_weight_g!==450||product.is_public!==true)fail_('ORDERS_UNAVAILABLE');
  const now=new Date().toISOString(),orderId=Utilities.getUuid();
  order={order_id:orderId,order_code:makeOrderCode_(tables.Orders),idempotency_key:p.idempotencyKey,customer_id:'guest-'+orderId,customer_name:p.customerName,phone:p.phone,email:p.email,shipping_address:[p.address,p.ward,p.province].join(', '),subtotal_vnd:p.quantity*product.price_vnd,shipping_fee_vnd:'',discount_vnd:0,total_vnd:'',currency:'VND',payment_method:p.paymentMethod,order_status:'WRITING',payment_status:'UNPAID',shipping_status:'PENDING',referrer_partner_id:'',created_at:now,updated_at:now,customer_note:p.note};
  append_(tables.Orders,order);
  SpreadsheetApp.flush();
  return finishOrder_(tables,order,p);
 }finally{lock.releaseLock();}
}
function matches_(o,p){
 return o.customer_name===p.customerName&&String(o.phone)===p.phone&&o.email===p.email&&o.shipping_address===[p.address,p.ward,p.province].join(', ')&&o.subtotal_vnd===p.quantity*480000&&o.payment_method===p.paymentMethod&&o.customer_note===p.note;
}
function finishOrder_(t,o,p){
 if(!['WRITING','PENDING'].includes(o.order_status))fail_('IDEMPOTENCY_CONFLICT');
 const customer={customer_id:o.customer_id,auth_subject:'',full_name:o.customer_name,phone:o.phone,email:o.email,created_at:o.created_at,updated_at:o.created_at,status:'ACTIVE'};
 // Guest records are keyed by order, not treated as authenticated users by phone.
 if(!find_(t.Customers,'customer_id',o.customer_id))append_(t.Customers,customer);
 const items=rows_(t.OrderItems).filter(function(x){return x.order_id===o.order_id;});
 if(items.length>1)fail_('STORE_INCONSISTENT');
 if(items.length){
  const item=items[0];if(item.product_id!=='g8'||item.quantity!==p.quantity||item.unit_price_vnd!==480000||item.line_total_vnd!==o.subtotal_vnd)fail_('STORE_INCONSISTENT');
 }else append_(t.OrderItems,{order_item_id:o.order_id+':g8',order_id:o.order_id,product_id:'g8',product_name_snapshot:'Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan',unit_price_vnd:480000,quantity:p.quantity,line_total_vnd:o.subtotal_vnd,created_at:o.created_at});
 const audit=rows_(t.AuditLog).find(function(x){return x.entity_id===o.order_id&&x.action==='ORDER_CREATED';});
 if(!audit)append_(t.AuditLog,{audit_id:o.order_id+':created',actor_id:'system',action:'ORDER_CREATED',entity_type:'ORDER',entity_id:o.order_id,before_json:'',after_json:JSON.stringify({orderCode:o.order_code,quantity:p.quantity,subtotalVnd:o.subtotal_vnd}),reason:'Khách gửi yêu cầu qua website',created_at:o.created_at});
 SpreadsheetApp.flush();
 if(o.order_status==='WRITING'){cell_(t.Orders,o._row,'updated_at',new Date().toISOString());cell_(t.Orders,o._row,'order_status','PENDING');SpreadsheetApp.flush();}
 return {orderCode:o.order_code,orderStatus:'PENDING',subtotalVnd:o.subtotal_vnd,shippingFeeVnd:null,totalVnd:null};
}
function table_(ss,name){
 const sheet=ss.getSheetByName(name);if(!sheet)fail_('SCHEMA_ERROR');
 const headers=sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
 if(SCHEMA_[name].some(function(key){return headers.filter(function(h){return h===key;}).length!==1;}))fail_('SCHEMA_ERROR');
 return {sheet:sheet,headers:headers};
}
function rows_(t){
 if(t.sheet.getLastRow()<2)return [];
 return t.sheet.getRange(2,1,t.sheet.getLastRow()-1,t.headers.length).getValues().map(function(row,i){const obj={_row:i+2};t.headers.forEach(function(h,j){if(h)obj[h]=row[j];});return obj;});
}
function find_(t,key,value){const found=rows_(t).filter(function(row){return String(row[key])===String(value);});if(found.length>1)fail_('STORE_INCONSISTENT');return found[0]||null;}
function safe_(value){return typeof value==='string'?"'"+value:value;}
// Prefix all strings as literal Sheets text, preserving leading zero phone numbers
// and preventing formulas even if a string starts with whitespace or '='.
function append_(t,obj){obj._row=t.sheet.getLastRow()+1;t.sheet.getRange(obj._row,1,1,t.headers.length).setValues([t.headers.map(function(h){return safe_(obj[h]===undefined?'':obj[h]);})]);}
function cell_(t,row,key,value){t.sheet.getRange(row,t.headers.indexOf(key)+1).setValue(safe_(value));}
function makeOrderCode_(orders){for(let i=0;i<5;i++){const code='QGV-'+Utilities.formatDate(new Date(),'Asia/Ho_Chi_Minh','yyMMdd')+'-'+Utilities.getUuid().replace(/-/g,'').slice(0,12).toUpperCase();if(!find_(orders,'order_code',code))return code;}fail_('SERVER_ERROR');}
function rateLimit_(visitorKey){
 // Executed inside the script lock. Durable timestamps survive cache eviction.
 // Maximum 5 new requests/IP/10min; retries do not consume another order slot.
 const props=PropertiesService.getScriptProperties(),all=props.getProperties(),now=Date.now(),key='rate:'+visitorKey;
 Object.keys(all).filter(function(k){return k.indexOf('rate:')===0;}).forEach(function(k){try{if(JSON.parse(all[k]).expires<=now)props.deleteProperty(k);}catch(e){props.deleteProperty(k);}});
 const rateKeys=Object.keys(props.getProperties()).filter(function(k){return k.indexOf('rate:')===0;});
 if(!props.getProperty(key)&&rateKeys.length>=500)fail_('RATE_LIMITED');
 const current=JSON.parse(props.getProperty(key)||'null')||{count:0,expires:now+600000};
 if(current.count>=5)fail_('RATE_LIMITED');
 current.count++;props.setProperty(key,JSON.stringify(current));
}
function getProperty_(name){const value=PropertiesService.getScriptProperties().getProperty(name);if(!value)fail_('ORDERS_UNAVAILABLE');return value;}
function json_(body){return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);}
