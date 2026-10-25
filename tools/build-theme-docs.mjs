import { createRequire } from 'node:module';
import { readFile,writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { renderMark } from './system.mjs';
import { mark } from './geometry.mjs';
import { unpackIco } from './favicon.mjs';
import { palettes,icoSizes,opticalForSize } from './presentation.mjs';
const require=createRequire(import.meta.url),sharp=require(process.env.EMPYTREE_SHARP||'sharp');
const samples=[
  {eyes:'arrows',mouth:'flat',frame:'open',dent:'none'},
  {eyes:'arrows',mouth:'down',frame:'closed',dent:'left'},
  {eyes:'beam',mouth:'rest8',frame:'open',dent:'both'},
  {eyes:'separate',mouth:'rest4',frame:'closed',dent:'right'},
  {eyes:'mixed',mouth:'rest2',frame:'open',dent:'both'},
  {eyes:'mixed',mouth:'corner-left',frame:'closed',dent:'left'},
];
const text=(x,y,value,size=18,color='#20211f')=>`<text x="${x}" y="${y}" fill="${color}" font-family="Consolas,monospace" font-size="${size}">${value}</text>`;
const image=(png,x,y,size)=>`<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/png;base64,${png.toString('base64')}"/>`;
const svg=['<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="2080"><rect width="1440" height="2080" fill="#f5f4ef"/>',text(48,58,'empytree / 0.3.0 — two palettes, full canvas, resolution families',26),text(48,100,'288 faces × 2 palettes = 576 ICOs. Every ICO contains ten true raster resolutions.'),text(48,132,'16/20 micro · 24/32/40/48 compact · 64/96/128/256 display',17)];
for(const [column,theme] of ['light','dark'].entries()){
  const x=48+column*700,palette=palettes[theme];
  svg.push(`<rect x="${x-16}" y="160" width="680" height="1310" fill="${palette.background}"/>`,text(x,199,theme==='light'?'DARK ON LIGHT':'LIGHT ON DARK',22,palette.foreground),text(x,231,'16px + pixels ×6 / 32px + ×3 / 48px + ×2',15,palette.foreground));
  for(const [row,v] of samples.entries()){
    const y=262+row*192,id=[v.eyes,v.mouth,v.frame,v.dent].join('--');
    const layers=unpackIco(await readFile(new URL(`../public/brand/v2/${id}${theme==='dark'?'-dark':''}.ico`,import.meta.url)));
    svg.push(text(x,y,id,12,palette.foreground));
    for(const [i,size] of [16,32,48].entries()){
      const png=layers.find(v=>v.size===size).png,zoom=await sharp(png).resize(96,96,{kernel:'nearest'}).png().toBuffer(),xx=x+i*214;
      svg.push(image(png,xx,y+35,size),image(zoom,xx+60,y+26,96));
    }
    svg.push(text(x,y+158,'16 CSS px at 1× / 2× / 3×: distinct optical detail',12,palette.foreground));
  }
}
svg.push(text(48,1535,'CANVAS CHANGE / historical 14px box → current 16px box',23));
for(const [i,dent] of ['none','left','both'].entries()){
  const x=48+i*450;
  for(const [j,drawing] of [mark({optical:'micro',dent}),renderMark({optical:'micro',dent})].entries()){
    const png=await sharp(Buffer.from(drawing)).png().toBuffer(),zoom=await sharp(png).resize(112,112,{kernel:'nearest'}).png().toBuffer();
    svg.push(image(zoom,x+j*180,1580,112),text(x+j*180,1725,j?'0.3.0 / 16px':'0.2.1 / 14px',14));
  }
}
svg.push(text(48,1790,'ONE COMPLETE ICO / each layer rasterized directly from its optical vector',21));
const layers=unpackIco(await readFile(new URL('../public/brand/v2/arrows--flat--open--none.ico',import.meta.url)));
for(const [i,size] of icoSizes.entries()){
  const x=48+i*136,png=layers.find(v=>v.size===size).png;
  svg.push(image(png,x,1830,Math.min(size,88)),text(x,1950,String(size)+'px',16),text(x,1976,opticalForSize(size),13));
}
svg.push(text(48,2035,'Main rows: native + pixel zoom. Bottom: fitted previews; labels are encoded sizes. Browser chooses layer.',15),'</svg>');
await writeFile(new URL('../docs/brand/themes-and-density.svg',import.meta.url),svg.join(''));
await sharp(Buffer.from(svg.join(''))).png().toFile(fileURLToPath(new URL('../docs/brand/themes-and-density.png',import.meta.url)));
