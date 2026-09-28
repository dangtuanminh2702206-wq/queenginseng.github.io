const {test}=require('node:test'),assert=require('node:assert/strict');
const {loadTs,storage,input,sheetHarness}=require('./helpers.cjs');
const receipt=q=>({orderCode:'QGV-260927-ABCDEF012345',orderStatus:'PENDING',subtotalVnd:480000*q,shippingFeeVnd:null,totalVnd:null});
test('G8 shared data and validation reject malformed quantities',()=>{
 const v=loadTs('lib/order-validation.ts'),p=loadTs('lib/products.ts').g8Product;
 assert.equal(p.price,480000);assert.equal(p.unitsPerBox*p.unitWeightGrams,450);assert.equal(p.sku,null);
 for(const quantity of [-1,0,1.2,100,NaN,Infinity,'2'])assert.ok(v.orderErrors({...input(),quantity}).quantity);
 assert.equal(Object.keys(v.orderErrors(input())).length,0);
 assert.equal(v.normalizeFields({...input(),phone:'+84 900 000 001'}).phone,'0900000001');
 assert.ok(v.validReceipt(receipt(2),960000));assert.ok(!v.validReceipt(receipt(1),960000));
});
test('cart handles corrupt and blocked storage, bounds and memory fallback',()=>{
 const localStorage=storage();const cart=loadTs('lib/cart-store.ts',{localStorage,window:{dispatchEvent(){}}});
 for(const v of ['NaN','{}','-1','1.2']){localStorage.setItem('qgv-cart-v1',v);assert.equal(cart.readCart(),0);}
 cart.writeCart(2);assert.equal(cart.readCart()*480000,960000);cart.writeCart(1000);assert.equal(cart.readCart(),99);
 localStorage.getItem=()=>{throw Error('blocked');};localStorage.setItem=()=>{throw Error('blocked');};
 cart.writeCart(1);assert.equal(cart.readCart(),1);
});
test('request keys survive reload, match retry and reject changed pending payload',async()=>{
 const sessionStorage=storage();const globals={sessionStorage};const a=loadTs('lib/commerce-api.ts',globals),p=input();
 const key=await a.requestKey(p);assert.match(key,/^[a-f0-9-]{36}$/);assert.equal(await a.requestKey(p),key);
 const b=loadTs('lib/commerce-api.ts',globals);assert.equal(await b.requestKey(p),key);
 await assert.rejects(()=>b.requestKey({...p,quantity:2}),e=>e.code==='PENDING_ORDER_CHANGED');
 b.clearPendingRequest();assert.notEqual(await b.requestKey(p),key);
 assert.ok(![...sessionStorage.map.values()].join('').includes(p.phone));
});
test('UUID fallback is UUIDv4 and accepted',()=>{
 const api=loadTs('lib/commerce-api.ts',{crypto:{getRandomValues:arr=>crypto.getRandomValues(arr)}});
 assert.match(api.makeIdempotencyKey(),/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/);
});
test('disabled configuration never sends order',async()=>{
 let calls=0;const api=loadTs('lib/commerce-api.ts',{fetch:async()=>{calls++;return Response.json({ordersEnabled:false,orderApiUrl:''});}});
 await assert.rejects(()=>api.submitOrder(input()),e=>e.code==='ORDERS_UNAVAILABLE');assert.equal(calls,1);
});
for(const failure of ['json','amount','network','http']){
 test('API does not report false success: '+failure,async()=>{
  let count=0;const api=loadTs('lib/commerce-api.ts',{fetch:async()=>{if(++count===1)return Response.json({ordersEnabled:true,orderApiUrl:'https://test.example/orders'});
   if(failure==='network')throw Error('timeout');if(failure==='json')return new Response('not json');
   return Response.json({ok:true,order:receipt(failure==='amount'?2:1)},{status:failure==='http'?500:200});}});
  await assert.rejects(()=>api.submitOrder(input()));
 });
}
test('API accepts only validated server receipt',async()=>{
 let count=0;const api=loadTs('lib/commerce-api.ts',{fetch:async()=>Response.json(++count===1?{ordersEnabled:true,orderApiUrl:'https://test.example/orders'}:{ok:true,order:receipt(1)})});
 assert.equal((await api.submitOrder(input())).subtotalVnd,480000);
});
test('Apps Script server price, idempotency, formula safety and re-ordered headers',()=>{
 const h=sheetHarness({reverse:true}),p={...input(),customerName:'=IMPORTXML("bad")',unitPrice:1,quantity:2};
 const a=h.call(p),b=h.call(p);assert.equal(a.orderCode,b.orderCode);assert.equal(a.subtotalVnd,960000);
 for(const name of ['Orders','OrderItems','Customers','AuditLog'])assert.equal(h.tables[name].rows.length,2,name);
 assert.ok(h.rawWrites.some(w=>w.values[0].includes("'"+p.customerName)));
 assert.ok(h.rawWrites.some(w=>w.values[0].includes("'0900000001")));
 assert.throws(()=>h.call({...p,quantity:3}),/IDEMPOTENCY_CONFLICT/);
});
for(const name of ['Orders','Customers','OrderItems','AuditLog']){
 for(const stage of ['before','after'])test('Apps Script repairs interrupted '+name+' '+stage,()=>{
  const h=sheetHarness(),p=input();h.fail(name,stage);assert.throws(()=>h.call(p));
  assert.equal(h.call(p).subtotalVnd,480000);assert.equal(h.call(p).subtotalVnd,480000);
  for(const table of ['Orders','Customers','OrderItems','AuditLog'])assert.equal(h.tables[table].rows.length,2,table);
  assert.equal(h.tables.Orders.rows[1][h.tables.Orders.rows[0].indexOf('order_status')],'PENDING');
 });
}
test('Apps Script refuses public sharing, wrong key, disabled intake and busy lock',()=>{
 const unsafe=sheetHarness({publicAccess:true});assert.throws(()=>unsafe.call(input()),/STORE_UNSAFE/);assert.equal(unsafe.tables.Orders.rows.length,1);
 const h=sheetHarness();assert.equal(h.post(input(),'wrong').error.code,'UNAUTHORIZED');
 h.props.ORDERS_ENABLED='false';assert.equal(h.post(input()).error.code,'ORDERS_UNAVAILABLE');
 assert.throws(()=>sheetHarness({locked:true}).call(input()),/RATE_LIMITED/);
});
test('Apps Script refuses schema drift and wrong product price; rate limit allows retries',()=>{
 let h=sheetHarness();h.tables.Orders.rows[0][0]='wrong';assert.throws(()=>h.call(input()),/SCHEMA_ERROR/);
 h=sheetHarness();h.tables.Products.rows[1][4]=1;assert.throws(()=>h.call(input()),/ORDERS_UNAVAILABLE/);
 h=sheetHarness();const p=input();for(let i=0;i<5;i++)h.call(i===0?p:input());
 assert.equal(h.call(p).subtotalVnd,480000);assert.throws(()=>h.call(input()),/RATE_LIMITED/);
});
const env={ALLOWED_ORIGIN:'https://shop.example',INTERNAL_KEY:'test',RATE_LIMIT_SALT:'salt',APPS_SCRIPT_URL:'https://script.google.com/macros/s/test/exec'};
const request=(body,headers={})=>new Request('https://worker.example/orders',{method:'POST',headers:{Origin:env.ALLOWED_ORIGIN,'content-type':'application/json','CF-Connecting-IP':'192.0.2.1',...headers},body:typeof body==='string'?body:JSON.stringify(body)});
test('Worker rejects malformed/oversized/unauthorized-origin requests before upstream',async()=>{
 const worker=loadTs('backend/worker/src/index.ts',{fetch:()=>{throw Error('must not call');}}).default;
 for(const body of [null,[],{...input(),quantity:1.5},{...input(),productId:'g7'},'{'])assert.equal((await worker.fetch(request(body),env)).status,400);
 assert.equal((await worker.fetch(request('x'.repeat(9000)),env)).status,413);
 const denied=await worker.fetch(request(input(),{Origin:'https://evil.example'}),env);assert.equal(denied.status,403);assert.equal(denied.headers.get('access-control-allow-origin'),null);
 assert.equal((await worker.fetch(request(input()),{...env,INTERNAL_KEY:''})).status,503);
});
test('Worker strips forged price/status/permissions, hashes IP and validates receipt',async()=>{
 let sent;const worker=loadTs('backend/worker/src/index.ts',{fetch:async(_url,options)=>{sent=JSON.parse(options.body);return Response.json({ok:true,order:receipt(1)});}}).default;
 const response=await worker.fetch(request({...input(),price:1,isAdmin:true,orderStatus:'PAID'}),env);
 assert.equal(response.status,200);assert.equal(sent.payload.price,undefined);assert.equal(sent.payload.isAdmin,undefined);assert.equal(sent.payload.orderStatus,undefined);assert.match(sent.visitorKey,/^[a-f0-9]{64}$/);
 const broken=loadTs('backend/worker/src/index.ts',{fetch:async()=>new Response('<html>bad</html>')}).default;
 assert.equal((await broken.fetch(request(input()),env)).status,502);
});
function demo(){const localStorage=storage();return {localStorage,store:loadTs('lib/demo-store.ts',{localStorage,window:{dispatchEvent(){}}})};}
test('Demo rejects nested corrupt rows and preserves multiple referral records',()=>{
 const {store,localStorage}=demo();
 localStorage.setItem(store.DEMO_KEYS.orders,JSON.stringify([{id:'bad',code:'BAD',items:[{quantity:{}}],total:480000}]));
 localStorage.setItem(store.DEMO_KEYS.wallet,JSON.stringify([{id:'bad',amount:10,type:'PAID',referenceId:{}}]));
 assert.equal(store.getOrders().length,0);assert.equal(store.getWallet().length,0);
 store.seedDemo();
 for(const phone of ['0900000003','0900000004'])store.registerUser({name:'Demo',phone,referralCode:'QGDEMOA'});
 assert.equal(JSON.parse(localStorage.getItem(store.DEMO_KEYS.referrals)).length,3);
});
test('Demo corrupted/blocked storage does not crash the global header',()=>{
 const {store,localStorage}=demo();for(const value of ['{}','null','[null,{}]']){localStorage.setItem(store.DEMO_KEYS.users,value);assert.equal(store.getUsers().length,0);assert.equal(store.currentUser(),null);}
 localStorage.getItem=()=>{throw Error('blocked');};localStorage.setItem=()=>{throw Error('blocked');};store.getSnapshot();store.seedDemo();assert.equal(store.currentUser().id,'demo-a');store.logoutUser();assert.equal(store.currentUser(),null);
});
test('Demo wallet rejects invalid values, duplicate payout and cancelled/rejected transitions',()=>{
 const {store}=demo();store.seedDemo();assert.throws(()=>store.seedDemo());
 assert.throws(()=>store.updateOrderStatus('demo-order','COMPLETED'));
 for(const s of ['CONFIRMED','SHIPPING','COMPLETED'])store.updateOrderStatus('demo-order',s);
 assert.equal(store.approveCommission('demo-order'),true);assert.equal(store.approveCommission('demo-order'),false);
 const bank={bank:'Demo',accountNumber:'000',accountName:'Demo'};
 for(const amount of [NaN,Infinity,-1,0,1.5,25000])assert.throws(()=>store.requestWithdrawal({...bank,amount}));
 const w=store.requestWithdrawal({...bank,amount:10000});assert.equal(store.balances('demo-a').available,14000);
 store.updateWithdrawal(w.id,'APPROVED');store.updateWithdrawal(w.id,'PAID');store.updateWithdrawal(w.id,'PAID');assert.equal(store.balances('demo-a').available,14000);
 assert.equal(store.getWallet().filter(w=>w.type==='WITHDRAWAL_PAID').length,1);
 const next=store.requestWithdrawal({...bank,amount:14000});store.updateWithdrawal(next.id,'REJECTED');store.updateWithdrawal(next.id,'REJECTED');
 assert.equal(store.balances('demo-a').available,14000);assert.throws(()=>store.updateWithdrawal(next.id,'PAID'));
});
test('Demo commission reversal blocks reserved payout and releases holds once',()=>{
 const {store}=demo();store.seedDemo();for(const s of ['CONFIRMED','SHIPPING','COMPLETED'])store.updateOrderStatus('demo-order',s);store.approveCommission('demo-order');
 const w=store.requestWithdrawal({amount:24000,bank:'Demo',accountName:'Demo',accountNumber:'000'});store.updateWithdrawal(w.id,'APPROVED');
 store.updateOrderStatus('demo-order','RETURNED');assert.throws(()=>store.updateWithdrawal(w.id,'PAID'));
 store.updateWithdrawal(w.id,'REJECTED');assert.equal(store.balances('demo-a').available,0);
});
