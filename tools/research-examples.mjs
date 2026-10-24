import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { mark } from './geometry.mjs';
const require=createRequire(import.meta.url),sharp=require(process.env.EMPYTREE_SHARP||'sharp');
const destination=new URL('../docs/research/examples/',import.meta.url);
await mkdir(destination,{recursive:true});
const cases=[{id:'A-flat-straight',mouth:'flat',dent:'none'},{id:'B-triangle-left',mouth:'down',dent:'left'},{id:'C-corner-both',mouth:'corner-left',dent:'both'}];
const manifest=[];
const sheet=['<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="450"><rect width="1200" height="450" fill="#ffffff"/>'];
for(const options of cases){
  const svg=mark({...options,color:'#20211f',background:'#ffffff'}).replace('width="64" height="64"','width="512" height="512"');
  const buffer=await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(new URL(options.id+'.svg',destination),svg);await writeFile(new URL(options.id+'.png',destination),buffer);
  manifest.push({...options,file:options.id+'.png',sha256:createHash('sha256').update(buffer).digest('hex')});
  const x=50+(manifest.length-1)*400;
  sheet.push(`<image x="${x}" y="30" width="300" height="300" href="data:image/png;base64,${buffer.toString('base64')}"/><text x="${x}" y="385" fill="#20211f" font-family="Arial,sans-serif" font-size="20">${options.id}</text>`);
}
sheet.push('</svg>');
await writeFile(new URL('reference-sheet.svg',destination),sheet.join(''));
await writeFile(new URL('reference-sheet.png',destination),await sharp(Buffer.from(sheet.join(''))).png().toBuffer());
await writeFile(new URL('manifest.json',destination),JSON.stringify(manifest,null,2)+'\n');
console.log('Prepared three distinct reference examples for the image-search review.');
