import { readFile,writeFile } from 'node:fs/promises';
import { renderMark,eyePairs,mouthKinds,names } from './system.mjs';
import { reasonLabels } from './micro-policy.mjs';
const manifest=JSON.parse(await readFile(new URL('../public/brand/v2/variants.json',import.meta.url),'utf8'));
const marks={},pixels={};
for(const entry of manifest.catalog)for(const theme of ['light','dark']){
  marks[entry.id+':'+entry.optical+':'+theme]=renderMark({...entry,theme});
  if(entry.optical==='micro')pixels[entry.id+':'+theme]='data:image/png;base64,'+(await readFile(new URL(`../public/brand/v2/${entry.id}-16${theme==='dark'?'-dark':''}.png`,import.meta.url))).toString('base64');
}
const adoption=JSON.parse(await readFile(new URL('../docs/adoptions/current.json',import.meta.url),'utf8'));
const template=(await readFile(new URL('generator-template.html',import.meta.url),'utf8')).replace('__ADOPTED_VERSION__',adoption.version);
await writeFile(new URL('../examples/generator.html',import.meta.url),template.replace('__GENERATOR_DATA__',JSON.stringify({catalog:manifest.catalog,counts:manifest.counts,eyePairs,mouthKinds,names,reasons:reasonLabels,marks,pixels})));
console.log('Built offline generator and optical allowlist browser');
