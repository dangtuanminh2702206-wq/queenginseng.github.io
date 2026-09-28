// Browser regression tests only against the local static export.
// API requests are intercepted; this script never submits an order to the live store.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const base='http://127.0.0.1:4175/queenginseng.github.io';
const product='/san-pham/bot-tra-sam-nu-hoang-g8/';
const wait=async(page,predicate,arg)=>page.waitForFunction(predicate,arg,{timeout:10000});
async function main(){
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const results=[],errors=[];
 async function run(name,fn){try{await fn();results.push({name,passed:true});console.log('PASS '+name);}catch(e){results.push({name,passed:false,error:e.message});console.error('FAIL '+name+': '+e.message);}}
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await run('Header stays visible when scrolling homepage',async()=>{
  await page.goto(base+'/');await page.waitForTimeout(500);await page.evaluate(()=>window.scrollTo({top:700,behavior:'instant'}));
  await page.waitForTimeout(100);const top=await page.locator('header').evaluate(e=>e.getBoundingClientRect().top);
  assert.ok(top>=-1&&top<=1,'sticky header top='+top);
 });
 await run('Mobile menu: keyboard focus, Escape and return focus',async()=>{
  await page.goto(base+'/');const trigger=page.getByRole('button',{name:'Mở trình đơn'});await trigger.click();
  await page.getByRole('dialog').waitFor();assert.ok(await page.evaluate(()=>document.querySelector('[role="dialog"]').contains(document.activeElement)));
  await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>document.querySelector('[role="dialog"]').contains(document.activeElement)));
  await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
  assert.equal(await trigger.evaluate(e=>document.activeElement===e),true);
 });
 await run('Product add → cart 480000 → increment 960000 → reload → decrement → remove',async()=>{
  await page.goto(base+product);await page.getByRole('button',{name:'Thêm vào giỏ',exact:true}).click();
  await page.getByRole('button',{name:'Mở giỏ hàng, 1 sản phẩm'}).click();
  const dialog=page.getByRole('dialog');await dialog.waitFor();assert.match(await dialog.innerText(),/480\.000/);
  await dialog.getByRole('button',{name:'Tăng số lượng'}).click();assert.match(await dialog.innerText(),/960\.000/);
  await dialog.getByRole('link',{name:'Xem giỏ hàng'}).click();await page.waitForURL('**/gio-hang/**');
  await page.reload();await wait(page,()=>document.querySelector('output')?.textContent==='2');
  assert.match(await page.locator('aside').innerText(),/960\.000/);
  await page.getByRole('button',{name:'Giảm số lượng'}).click();await wait(page,()=>document.querySelector('output')?.textContent==='1');
  await page.getByRole('button',{name:'Xóa',exact:true}).click();await page.getByText('Giỏ hàng đang trống.',{exact:true}).waitFor();
 });
 await run('Cart synchronization between tabs',async()=>{
  await page.goto(base+product);await page.getByRole('button',{name:'Thêm vào giỏ',exact:true}).click();
  const tab=await context.newPage();await tab.goto(base+'/gio-hang/');
  await tab.getByRole('button',{name:'Tăng số lượng'}).click();await page.getByRole('button',{name:'Mở giỏ hàng, 2 sản phẩm'}).waitFor();await tab.close();
 });
 await run('Disabled checkout gives no payment request or enabled submit',async()=>{
  await page.goto(base+'/thanh-toan/');
  await page.getByText('Bản trải nghiệm — chưa tiếp nhận đơn hàng thật. Vui lòng không chuyển tiền.',{exact:true}).waitFor();
  assert.equal(await page.getByRole('button',{name:'Chưa mở nhận đơn'}).isDisabled(),true);
  assert.equal(await page.locator('img[src*="payment"]').count(),0);
 });
 await run('Private pages noindex, public canonical and image basePath',async()=>{
  for(const route of ['/gio-hang/','/thanh-toan/','/dang-nhap/','/dang-ky/','/tai-khoan/','/demo-admin/']){
   await page.goto(base+route);assert.match(await page.locator('meta[name="robots"]').getAttribute('content'),/noindex/);
  }
  await page.goto(base+product);assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://dangtuanminh2702206-wq.github.io/queenginseng.github.io/san-pham/bot-tra-sam-nu-hoang-g8');
  assert.ok(!(await page.locator('meta[property="og:image"]').getAttribute('content')).includes('queenginseng.github.io/queenginseng.github.io/queenginseng'));
 });
 await run('Corrupt browser storage does not crash homepage or cart',async()=>{
  await page.evaluate(()=>{localStorage.setItem('qgv-cart-v1','NaN');localStorage.setItem('qgv-demo-users-v1','{}');localStorage.setItem('qgv-demo-session-v1','{"userId":"x"}');});
  await page.goto(base+'/gio-hang/');await page.getByText('Giỏ hàng đang trống.',{exact:true}).waitFor();
 });
 await run('Blocked localStorage: add stays usable for the current page',async()=>{
  const c=await browser.newContext({viewport:{width:375,height:812}});
  await c.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('blocked','SecurityError');}}));
  const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(base+product);
  await p.getByRole('button',{name:'Thêm vào giỏ',exact:true}).click();await p.getByRole('button',{name:'Mở giỏ hàng, 1 sản phẩm'}).click();
  assert.match(await p.getByRole('dialog').innerText(),/480\.000/);await c.close();
 });
 // Only this fresh, isolated context is allowed to display the mocked enabled API.
 const testContext=await browser.newContext({viewport:{width:390,height:844}});
 await testContext.route('**/config/commerce.json',route=>route.fulfill({json:{ordersEnabled:true,orderApiUrl:'https://qgv-test.invalid/orders'}}));
 let mode='failure',requests=[];
 await testContext.route('https://qgv-test.invalid/orders',async route=>{
  const request=route.request().postDataJSON();requests.push(request);
  if(mode==='network')return route.abort('timedout');
  if(mode==='invalid')return route.fulfill({json:{ok:true,order:{orderCode:'fake',subtotalVnd:1}}});
  if(mode==='rate')return route.fulfill({status:429,json:{ok:false,error:{code:'RATE_LIMITED'}}});
  if(mode==='failure')return route.fulfill({status:503,json:{ok:false,error:{code:'UPSTREAM_ERROR'}}});
  await new Promise(r=>setTimeout(r,150));
  return route.fulfill({json:{ok:true,order:{orderCode:'QGV-260928-ABCDEF012345',orderStatus:'PENDING',subtotalVnd:request.quantity*480000,shippingFeeVnd:null,totalVnd:null}}});
 });
 const p=await testContext.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+product);await p.getByRole('button',{name:'Thêm vào giỏ',exact:true}).click();await p.goto(base+'/thanh-toan/');
 await run('Enabled mocked checkout validates fields, focuses summary, keeps input on failure',async()=>{
  const submit=p.getByRole('button',{name:'Gửi yêu cầu đặt hàng'});await submit.waitFor();await submit.click();
  await p.locator('[role="alert"][tabindex="-1"]').waitFor();assert.equal(await p.locator('[role="alert"][tabindex="-1"]').evaluate(e=>document.activeElement===e),true);assert.equal(requests.length,0);
  for(const [id,value]of Object.entries({customerName:'Khách kiểm thử',phone:'0900000001',province:'Hà Nội',ward:'Xuân Mai',address:'Địa chỉ kiểm thử'}))await p.locator('#'+id).fill(value);
  await submit.click();await p.locator('[role="alert"][tabindex="-1"]').getByText(/Chưa xác minh/).waitFor();
  assert.equal(await p.locator('#customerName').inputValue(),'Khách kiểm thử');assert.equal(await p.evaluate(()=>localStorage.getItem('qgv-cart-v1')),'1');
 });
 await run('Network failure and malformed success retain cart and reuse request key',async()=>{
  const original=requests[0].idempotencyKey;mode='network';await p.getByRole('button',{name:'Gửi yêu cầu đặt hàng'}).click();await p.locator('[role="alert"][tabindex="-1"]').getByText(/Kết nối bị gián đoạn/).waitFor();
  mode='rate';await p.getByRole('button',{name:'Gửi yêu cầu đặt hàng'}).click();await p.locator('[role="alert"][tabindex="-1"]').getByText(/quá nhiều yêu cầu/).waitFor();
  mode='invalid';await p.getByRole('button',{name:'Gửi yêu cầu đặt hàng'}).click();await p.locator('[role="alert"][tabindex="-1"]').getByText(/Chưa xác minh/).waitFor();
  assert.ok(requests.every(r=>r.idempotencyKey===original));assert.equal(await p.evaluate(()=>localStorage.getItem('qgv-cart-v1')),'1');
 });
 await run('Retry after reload uses same key; changed pending information is blocked',async()=>{
  const original=requests[0].idempotencyKey;await p.reload();
  for(const [id,value]of Object.entries({customerName:'Khách kiểm thử',phone:'0900000001',province:'Hà Nội',ward:'Xuân Mai',address:'Địa chỉ khác'}))await p.locator('#'+id).fill(value);
  await p.getByRole('button',{name:'Gửi yêu cầu đặt hàng'}).click();await p.locator('[role="alert"][tabindex="-1"]').getByText(/Yêu cầu trước chưa rõ/).waitFor();assert.equal(requests.length,4);
  await p.locator('#address').fill('Địa chỉ kiểm thử');mode='success';
  await p.getByRole('button',{name:'Gửi yêu cầu đặt hàng'}).click();
  await p.getByRole('heading',{name:'Đã tiếp nhận yêu cầu đặt hàng'}).waitFor();
  assert.equal(requests.at(-1).idempotencyKey,original);assert.equal(requests.length,5);assert.equal(await p.evaluate(()=>localStorage.getItem('qgv-cart-v1')),'0');
 });
 await run('Demo sign-up / logout and admin transition feedback',async()=>{
  await page.goto(base+'/demo-admin/');await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('qgv-demo-')).forEach(k=>localStorage.removeItem(k)));await page.reload();
  await page.getByRole('button',{name:'Tạo dữ liệu mẫu'}).click();await page.getByRole('button',{name:'Hoàn tất',exact:true}).click();
  await page.getByRole('status').getByText(/không cho phép/).waitFor();
  await page.goto(base+'/tai-khoan/');await page.getByRole('button',{name:'Đăng xuất'}).click();await page.waitForURL(url=>url.pathname.replace(/\/$/,'')==='/queenginseng.github.io');
  await page.goto(base+'/dang-ky/');await page.getByLabel('Họ và tên',{exact:true}).fill('Khách Demo');await page.getByLabel('Số điện thoại',{exact:true}).fill('0900000003');
  await page.getByRole('button',{name:'Đăng ký',exact:true}).click();await page.waitForURL('**/tai-khoan/**');await page.getByText('Xin chào, Khách Demo').waitFor();
 });
 await run('Accordion keyboard, reduced motion and PDF links',async()=>{
  await page.goto(base+product);await page.waitForTimeout(500);
  const summary=page.locator('summary').filter({hasText:'Thành phần'}).first();
  await summary.press('Enter');
  assert.equal(await summary.evaluate(e=>e.parentElement.open),true);
  await summary.press('Enter');assert.equal(await summary.evaluate(e=>e.parentElement.open),false);
  assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
  const links=await page.locator('a[href*=".pdf"]').evaluateAll(es=>[...new Set(es.map(e=>e.href.split('#')[0]))]);
  assert.equal(links.length,3);
  for(const href of links){const response=await context.request.get(href);assert.equal(response.status(),200);assert.equal((await response.body()).subarray(0,5).toString(),'%PDF-');}
 });
 await run('Authenticated demo screens fit all five requested widths',async()=>{
  await page.goto(base+'/dang-nhap/');await page.getByLabel('Số điện thoại',{exact:true}).fill('0900000001');
  await page.getByRole('button',{name:'Đăng nhập',exact:true}).click();await page.waitForURL('**/tai-khoan/**');
  for(const width of [375,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   for(const route of ['/tai-khoan/','/tai-khoan/don-hang/','/tai-khoan/gioi-thieu/','/tai-khoan/hoa-hong/','/tai-khoan/rut-tien/','/demo-admin/']){
    await page.goto(base+route);await page.waitForTimeout(100);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,width+' '+route);
   }
  }
 });
 await run('Home CTA, browser back/forward and product route remain under basePath',async()=>{
  await page.goto(base+'/');await page.getByRole('link',{name:'Đặt mua sản phẩm',exact:true}).click();await page.waitForURL('**/san-pham/bot-tra-sam-nu-hoang-g8/**');
  await page.goBack();await page.getByRole('heading',{name:'Sâm Nữ Hoàng G8',exact:true}).waitFor();
  await page.goForward();await page.getByRole('button',{name:'Thêm vào giỏ',exact:true}).waitFor();
  assert.ok(page.url().startsWith(base+product.slice(0,-1)));
 });
 await fs.mkdir('outputs/audit/after',{recursive:true});
 await fs.writeFile('outputs/audit/after/interactions.json',JSON.stringify({results,errors},null,2));
 await browser.close();assert.equal(results.filter(r=>!r.passed).length,0);assert.deepEqual(errors,[]);
}
main().catch(e=>{console.error(e);process.exitCode=1});
