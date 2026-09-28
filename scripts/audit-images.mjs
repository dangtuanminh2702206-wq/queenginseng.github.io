// Decode full pixels, not just headers/HTTP status: truncated files can have dimensions.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
async function files(dir) {
 const result=[];
 for(const item of await fs.readdir(dir,{withFileTypes:true})) {
  const name=path.join(dir,item.name);
  if(item.isDirectory())result.push(...await files(name));else result.push(name);
 }
 return result;
}
let count=0;
for(const file of await files('public/images')) {
 if(!/\.(png|webp|jpe?g)$/i.test(file))continue;
 await sharp(file,{failOn:'warning'}).raw().toBuffer();
 count++;
}
console.log('PASS: '+count+' raster assets fully decoded (including QR and non-catalog future asset).');
