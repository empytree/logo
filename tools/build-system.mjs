import { createRequire } from 'node:module';
import { mkdir,readFile,writeFile,readdir,unlink } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { enumerate,parts,wrap,renderMark,eyePairs,mouthKinds,names } from './system.mjs';
import { identityConfig } from './identity-config.mjs';
import { microPolicyRevision,microApproval,opticalReasons,filterPool,reasonLabels } from './micro-policy.mjs';
const require=createRequire(import.meta.url);
const sharp=require(process.env.EMPYTREE_SHARP||'sharp');
const out=new URL('../public/brand/v2/',import.meta.url);
const previews=new URL('../docs/brand/',import.meta.url);
await mkdir(out,{recursive:true});
await mkdir(previews,{recursive:true});
const alphaMask=async (svg,size=16)=>{
  const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const pixels=[];
  for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(data[(y*size+x)*info.channels+3]>=64)pixels.push([x,y]);
  return pixels;
};
const distance=(a,b)=>{
  let squared=Infinity;
  for(const [x,y] of a)for(const [xx,yy] of b)squared=Math.min(squared,(x-xx)**2+(y-yy)**2);
  return Number(Math.sqrt(squared).toFixed(3));
};
const catalog=[];
const seen=new Map();
const pngCache=new Map();
const maskCache=new Map();
for(const optical of ['display','compact','micro'])for(const variant of enumerate(optical)){
  const options={...variant,optical};
  const svg=renderMark(options);
  const file=`${variant.id}-${optical}.svg`;
  await writeFile(new URL(file,out),svg);
  let metrics=null,advisories=[],rasterHash=null,duplicateOf=null;
  if(optical==='micro'){
    const layers=parts(options);
    const densityGaps={};let densitySafe=true;
    for(const density of [1,2,3]){
      const masks=[];
      for(const layer of Object.values(layers)){
        const svg=wrap(layer,{optical}).replace('width="16" height="16"',`width="${16*density}" height="${16*density}"`);
        if(!maskCache.has(svg))maskCache.set(svg,await alphaMask(svg,16*density));
        masks.push(maskCache.get(svg));
      }
      const [frame,eyes,mouth]=masks;
      const values={frameEyes:distance(frame,eyes),eyesMouth:distance(eyes,mouth),frameMouth:distance(frame,mouth)};
      densityGaps[density]=values;
      if(Object.values(values).some(gap=>gap<density+1))densitySafe=false;
    }
    metrics={...densityGaps[1],densitySafe,densityGaps};
    const png=await sharp(Buffer.from(renderMark({...options,color:'#20211f',background:'#ffffff'}))).png().toBuffer();
    pngCache.set(variant.id,png);
    await writeFile(new URL(`${variant.id}-16.png`,out),png);
    const mask=await alphaMask(svg);
    rasterHash=createHash('sha256').update(JSON.stringify(mask)).digest('hex');
    advisories=opticalReasons(variant,metrics);
    if(seen.has(rasterHash)){duplicateOf=seen.get(rasterHash);advisories.push('duplicate-raster')}
    else seen.set(rasterHash,variant.id);
  }
  catalog.push({...variant,optical,svg:file,allowed:true,reasons:[],advisories,metrics,rasterHash,duplicateOf});
}
const micro=catalog.filter(v=>v.optical==='micro');
const counts={display:432,compact:288,microCandidates:288,microAllowed:micro.filter(v=>v.allowed).length,microExcluded:micro.filter(v=>!v.allowed).length,websitePool:filterPool(catalog).length};
const manifest={schemaVersion:2,construction:identityConfig,microPolicyRevision,microApproval,default:'arrows--flat--open--none',counts,catalog};
await writeFile(new URL('variants.json',out),JSON.stringify(manifest,null,2)+'\n');
function ico(layers){
  const header=Buffer.alloc(6+layers.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(layers.length,4);
  let offset=header.length;
  layers.forEach((buffer,index)=>{const size=[16,32,48][index],p=6+index*16;header[p]=size;header[p+1]=size;header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(buffer.length,p+8);header.writeUInt32LE(offset,p+12);offset+=buffer.length});
  return Buffer.concat([header,...layers]);
}
const allowedIcos=new Set(micro.filter(v=>v.allowed).map(v=>`${v.id}.ico`));
// Remove only obsolete generated ICO files in this fixed output directory.
for(const name of await readdir(out))if(/^[a-z0-9-]+\.ico$/.test(name)&&!allowedIcos.has(name))await unlink(new URL(name,out));
for(const variant of micro.filter(v=>v.allowed)){
  const svg=renderMark({...variant,color:'#20211f',background:'#ffffff'});
  const layers=await Promise.all([16,32,48].map(size=>sharp(Buffer.from(svg.replace('width="16" height="16"',`width="${size}" height="${size}"`))).png().toBuffer()));
  await writeFile(new URL(`${variant.id}.ico`,out),ico(layers));
}
const selector=await readFile(new URL('selector-template.js',import.meta.url),'utf8');
await writeFile(new URL('random-favicon.js',out),selector.replace('__CANDIDATES__',JSON.stringify(micro.filter(v=>v.allowed).map(({id,eyes,mouth,dent,frame})=>({id,eyes,mouth,dent,frame})))));
await writeFile(new URL('../docs/research/micro-policy.json',import.meta.url),JSON.stringify({revision:microPolicyRevision,approval:microApproval,thresholdAlpha:64,densities:[1,2,3],advisoryPixelCenterDistance:'density + 1',reasonLabels,counts,excluded:[],observations:micro.filter(v=>v.advisories.length).map(({id,advisories,metrics,duplicateOf})=>({id,advisories,metrics,duplicateOf}))},null,2)+'\n');

// Review sheets embed the actual native raster, not an enlarged vector approximation.
const text=(x,y,value,size=14,color='#20211f')=>`<text x="${x}" y="${y}" font-family="Segoe UI,sans-serif" font-size="${size}" fill="${color}">${value}</text>`;
const image=(data,x,y,size)=>`<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/png;base64,${data.toString('base64')}"/>`;
const sheet=['<svg xmlns="http://www.w3.org/2000/svg" width="1560" height="1140"><rect width="1560" height="1140" fill="#f5f4ef"/>',text(24,36,'empytree / 144 open-frame expressions — native 16 px + pixels ×4',22),text(24,62,`All supported combinations approved by empytree · ${counts.websitePool} open-frame choices`,16)];
for(const [col,eyes] of eyePairs.entries())sheet.push(text(118+col*360,96,names[eyes],17));
for(const [row,mouth] of mouthKinds.entries()){
  const y=122+row*108;
  sheet.push(text(18,y+42,names[mouth],14));
  for(const [col,eyes] of eyePairs.entries())for(const [d,dent] of ['none','left','right','both'].entries()){
    const variant=micro.find(v=>v.eyes===eyes&&v.mouth===mouth&&v.frame==='open'&&v.dent===dent);
    const x=118+col*360+d*88;
    const native=pngCache.get(variant.id);
    const zoom=await sharp(native).resize(64,64,{kernel:'nearest'}).png().toBuffer();
    sheet.push(image(zoom,x,y,64),image(native,x+24,y+68,16),text(x,y+100,dent,11,variant.allowed?'#28603d':'#9b3029'));
  }
}
sheet.push('</svg>');
await writeFile(new URL('matrix-micro.svg',previews),sheet.join(''));
await sharp(Buffer.from(sheet.join(''))).png().toFile(fileURLToPath(new URL('matrix-micro.png',previews)));
const overview=['<svg xmlns="http://www.w3.org/2000/svg" width="1220" height="1740"><rect width="1220" height="1740" fill="#f5f4ef"/>',text(28,40,'empytree / 4 eye pairs × 9 mouths — open frame, straight sides',26)];
for(const [col,eyes] of eyePairs.entries())overview.push(text(170+col*252,85,names[eyes],17));
for(const [row,mouth] of mouthKinds.entries())for(const [col,eyes] of eyePairs.entries()){
  const x=160+col*252,y=110+row*178;
  const png=await sharp(Buffer.from(renderMark({eyes,mouth,color:'#20211f'}))).resize(136).png().toBuffer();
  overview.push(image(png,x,y,136));
  if(col===0)overview.push(text(16,y+72,names[mouth],14));
}
overview.push('</svg>');
await sharp(Buffer.from(overview.join(''))).png().toFile(fileURLToPath(new URL('matrix-display.png',previews)));
await writeFile(new URL('catalog-data.json',out),JSON.stringify({eyePairs,mouthKinds,names,manifest:'variants.json'})+'\n');
console.log(JSON.stringify(counts));
