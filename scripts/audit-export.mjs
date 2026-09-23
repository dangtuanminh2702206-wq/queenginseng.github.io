import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('out');
const origin = 'https://dangtuanminh2702206-wq.github.io';
const prefix = '/queenginseng.github.io';
async function files(dir) {
  const result = [];
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await files(file)); else result.push(file);
  }
  return result;
}
let checked = 0;
const errors = [];
for (const file of (await files(root)).filter(f=>f.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,'');
  if (/8 gói|3 g\/gói|24 g|8 sachets|chữa ung thư|phòng ung thư|trẻ hóa tế bào|tăng miễn dịch|giảm nám|chống lão hóa|bảo vệ gan|hỗ trợ tim mạch|tăng sinh lý|trà tía tô|\bG[567]\b/i.test(visible)) errors.push('Unexpected public copy: '+file);
  for (const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*?\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;','&'), origin + prefix + '/' + path.relative(root,file).replaceAll('\\','/'));
    if (url.origin !== origin) continue;
    if (!url.pathname.startsWith(prefix)) { errors.push('Missing basePath: '+url); continue; }
    let target = path.join(root, decodeURIComponent(url.pathname.slice(prefix.length)));
    try {
      if ((await stat(target)).isDirectory()) target = path.join(target,'index.html');
      await stat(target); checked++;
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = await readFile(target,'utf8');
        const id = decodeURIComponent(url.hash.slice(1));
        if (!targetHtml.includes('id="'+id+'"')) errors.push('Missing anchor: '+url);
      }
    } catch { errors.push('Missing asset/route: '+url); }
  }
}
const productHtml = await readFile(path.join(root,'san-pham/bot-tra-sam-nu-hoang-g8/index.html'),'utf8');
const structured = JSON.parse(productHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
assert.equal(structured.offers.price,480000);
assert.equal(structured.offers.priceCurrency,'VND');
assert.equal(structured.offers.availability,undefined);
assert.equal(structured.sku,undefined);
assert.equal(new Intl.NumberFormat('vi-VN').format(structured.offers.price*2),'960.000');
assert.equal(errors.length,0,errors.join('\n'));
console.log(`PASS: ${checked} local asset/route/anchor references; public-copy scan; G8 JSON-LD price/currency; no invented SKU/availability; 2 boxes = 960.000.`);
