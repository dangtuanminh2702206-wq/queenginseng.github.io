const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
async function main() {
  const phase = process.argv[2] || 'before';
  const base = process.argv[3] || 'http://127.0.0.1:4175/queenginseng.github.io';
  const dir = path.resolve('outputs/audit', phase);
  await fs.mkdir(dir, {recursive:true});
  const browser = await chromium.launch({headless:true, channel:'msedge'});
  const page = await browser.newPage();
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  const routes=['/','/san-pham/bot-tra-sam-nu-hoang-g8/','/gio-hang/','/thanh-toan/','/dang-nhap/','/dang-ky/','/tai-khoan/','/tai-khoan/don-hang/','/tai-khoan/gioi-thieu/','/tai-khoan/hoa-hong/','/tai-khoan/rut-tien/','/demo-admin/'];
  const results=[];
  for(const width of [375,390,768,1024,1440]) {
    await page.setViewportSize({width,height:900});
    for(const route of routes) {
      const response=await page.goto(base+route); await page.waitForTimeout(300);
      if ([390,1440].includes(width)) {
        await page.evaluate(async()=>{
          for(let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo({top:y,behavior:'instant'});await new Promise(r=>setTimeout(r,120));}
          await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
          window.scrollTo({top:0,behavior:'instant'});
          await document.fonts.ready;
          await new Promise(r=>setTimeout(r,200));
        });
      }
      const decodeErrors=await page.evaluate(async()=>{const failed=[];await Promise.all([...document.images].map(async i=>{i.loading='eager';try{await i.decode();}catch{failed.push(i.src);}}));return failed;});
      results.push({width,route,decodeErrors,status:response.status(),...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth, title:document.title, brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src)}))});
      if([390,1440].includes(width)&&['/','/san-pham/bot-tra-sam-nu-hoang-g8/','/thanh-toan/'].includes(route)) await page.screenshot({path:path.join(dir,`${width}-${route==='/'?'home':route.split('/')[1]}.png`),fullPage:true});
    }
  }
  await fs.writeFile(path.join(dir,'routes.json'), JSON.stringify({base,results,errors},null,2));
  console.log(JSON.stringify({phase,routes:results.length,issues:results.filter(r=>r.status!==200||r.overflow||r.brokenImages.length||r.decodeErrors.length),errors}));
  await browser.close();
}
main().catch(e=>{console.error(e);process.exitCode=1});
