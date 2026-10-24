import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { mark, jointDetail, mouths, dentProfiles, joints } from './geometry.mjs';
const require=createRequire(import.meta.url);
const sharp=require(process.env.EMPYTREE_SHARP||'sharp');
const target=process.argv[2];if(!target)throw Error('Provide the visualization directory');
const uri=svg=>'data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
const dentAssets={},jointAssets={};
for(const mouth of mouths)for(const dent of ['left','right','both'])for(const dentProfile of dentProfiles){
  const prefix=[mouth,dent,dentProfile].join(':');
  dentAssets[prefix+':hero']=uri(mark({mouth,dent,dentProfile,color:'#000000'}));
  for(const size of [16,32,64]){
    const svg=mark({mouth,dent,dentProfile,color:'#000000',optical:size===16?'micro':size===32?'compact':'display'}).replace(/width="\d+" height="\d+"/,`width="${size}" height="${size}"`);
    const buffer=await sharp(Buffer.from(svg)).png().toBuffer();
    dentAssets[prefix+':'+size]='data:image/png;base64,'+buffer.toString('base64');
    if(size===16)dentAssets[prefix+':zoom16']='data:image/png;base64,'+(await sharp(buffer).resize(128,128,{kernel:'nearest'}).png().toBuffer()).toString('base64');
  }
}
for(const family of ['arrows','beam','rest8'])for(const joint of joints){
  const svg=mark({family,joint,color:'#000000'});
  jointAssets[family+':'+joint+':full']=uri(svg);
  jointAssets[family+':'+joint+':crop']=uri(jointDetail({family,joint,color:'#000000'}));
}
for(const [template,name,placeholder,data] of [['dent-comparison-fragment.html','quiet-box-dents.html','__DENT_ASSETS__',dentAssets],['joint-comparison-fragment.html','quiet-box-joints.html','__JOINT_ASSETS__',jointAssets]]){
  const html=(await readFile(new URL(template,import.meta.url),'utf8')).replace(placeholder,JSON.stringify(data));
  if(Buffer.byteLength(html)>1000000)throw Error('Comparison exceeds visualization budget');
  await writeFile(path.join(target,name),html);console.log(`${name}: ${Buffer.byteLength(html)} bytes`);
}
