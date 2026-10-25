import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { opticalForSize } from './presentation.mjs';
import { renderMark,variantId } from './system.mjs';
const args=process.argv.slice(2),options={eyes:'arrows',mouth:'flat',frame:'open',dent:'none',theme:'light'};
let size=64,format='svg',output=null,study=false;
for(let i=0;i<args.length;i++){
  const key=args[i];
  if(key==='--study'){study=true;continue}
  const value=args[++i];
  if(value===undefined)throw Error(`Missing value for ${key}`);
  if(['--eyes','--mouth','--frame','--dent','--theme'].includes(key))options[key.slice(2)]=value;
  else if(key==='--size')size=Number(value);
  else if(key==='--format')format=value;
  else if(key==='--output')output=value;
  else throw Error(`Unknown option: ${key}`);
}
if(!Number.isInteger(size)||size<16||size>4096||!['svg','png'].includes(format))throw Error('Size must be 16–4096; format must be svg or png');
const optical=opticalForSize(size);
const id=variantId(options);
const manifest=JSON.parse(await readFile(new URL('../public/brand/v2/variants.json',import.meta.url),'utf8'));
const entry=manifest.catalog.find(v=>v.id===id&&v.optical===optical);
if(!entry)throw Error('That frame has no drawing at this optical size');
if(!entry.allowed&&!study)throw Error(`Excluded at ${optical}: ${entry.reasons.join(', ')}. --study exports a review specimen only.`);
if(!entry.allowed)process.stderr.write(`Study only: ${entry.reasons.join(', ')}\n`);
const svg=renderMark({...options,optical}).replace(/width="\d+" height="\d+"/,`width="${size}" height="${size}"`);
if(!output){if(format!=='svg')throw Error('PNG requires --output');process.stdout.write(svg)}
else {
  const destination=path.resolve(output);
  await mkdir(path.dirname(destination),{recursive:true});
  if(format==='svg')await writeFile(destination,svg);
  else {
    const require=createRequire(import.meta.url),sharp=require(process.env.EMPYTREE_SHARP||'sharp');
    await sharp(Buffer.from(svg)).png().toFile(destination);
  }
  console.log(destination);
}
