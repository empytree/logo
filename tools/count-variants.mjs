import { mkdir, writeFile } from 'node:fs/promises';
import { mouths, dents } from './geometry.mjs';
const eyes=['arrows','beamed-pair','separate-eighths','partial-beam-and-flag'];
const futureMouths=[...mouths,'rest-eighth','rest-quarter','rest-half'];
const count=groups=>groups.reduce((rows,group)=>rows.flatMap(row=>group.map(item=>[...row,item])),[[]]).length;
const report={
  status:'theoretical future parameter combinations, not validated 16px silhouettes',
  dimensions:{eyes:eyes.length,mouths:futureMouths.length,sides:dents.length},
  current:{default:count([['arrows'],mouths,dents,['open']]),withClosed:count([['arrows'],mouths,dents,['open','closed']])},
  future:{oneFrame:count([eyes,futureMouths,dents,['open']]),openAndClosed:count([eyes,futureMouths,dents,['open','closed']]),displayWithCrease:count([eyes,futureMouths,dents,['open','closed','crease']])},
  fixed:['from-inset dent profile','character joint'],
};
await mkdir(new URL('../docs/research/',import.meta.url),{recursive:true});
await writeFile(new URL('../docs/research/variant-counts.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report));
