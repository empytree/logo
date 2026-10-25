import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { mouths, dents } from './geometry.mjs';
import { eyePairs as eyes,mouthKinds } from './system.mjs';
const catalog=JSON.parse(await readFile(new URL('../public/brand/v2/variants.json',import.meta.url),'utf8'));
const count=groups=>groups.reduce((rows,group)=>rows.flatMap(row=>group.map(item=>[...row,item])),[[]]).length;
const report={
  status:'implemented full matrix; all supported micro combinations author-approved; advisory measurements',
  dimensions:{eyes:eyes.length,mouths:mouthKinds.length,sides:dents.length},
  firstImplementation:{default:count([['arrows'],mouths,dents,['open']]),withClosed:count([['arrows'],mouths,dents,['open','closed']])},
  matrix:{oneFrame:count([eyes,mouthKinds,dents,['open']]),openAndClosed:count([eyes,mouthKinds,dents,['open','closed']]),displayWithCrease:count([eyes,mouthKinds,dents,['open','closed','crease']])},
  micro:{allowed:catalog.counts.microAllowed,excluded:catalog.counts.microExcluded,defaultOpen:catalog.counts.websitePool,policyRevision:catalog.microPolicyRevision},
  reproduction:{palettes:2,svgFiles:2016,smallIcoFiles:576,layersPerIco:10},
  fixed:['from-inset dent profile','character joint'],
};
await mkdir(new URL('../docs/research/',import.meta.url),{recursive:true});
await writeFile(new URL('../docs/research/variant-counts.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
