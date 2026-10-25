import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { presentation } from './presentation.mjs';
import { identityConfig } from './identity-config.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const reportTarget=path.join(root,'docs/research/documentation-check.json');
async function walk(directory){const result=[];for(const item of await readdir(directory,{withFileTypes:true})){if(['node_modules','.git','dist','.local'].includes(item.name))continue;const name=path.join(directory,item.name);if(item.isDirectory())result.push(...await walk(name));else if(item.name.endsWith('.md'))result.push(name)}return result}
const files=await walk(root);let localLinks=0;const missing=[];
for(const file of files){
  const source=(await readFile(file,'utf8')).replace(/```[\s\S]*?```/g,'');
  for(const match of source.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)){
    const raw=match[1].replace(/^<|>$/g,'');if(/^[a-z][a-z\d+.-]*:/i.test(raw)||raw.startsWith('#'))continue;
    const target=decodeURIComponent(raw.split('#')[0]);if(!target)continue;localLinks++;
    const resolved=path.resolve(path.dirname(file),target);
    // This self-linked report is written only after the audit succeeds.
    if(resolved===reportTarget)continue;
    try{await stat(resolved)}catch(_){missing.push({file:path.relative(root,file),target})}
  }
}
assert.deepEqual(missing,[],'Broken local documentation links');
assert.equal(identityConfig.dentProfile,'from-inset');assert.equal(identityConfig.joint,'character');
const main=await readFile(path.join(root,'docs/logo-system.md'),'utf8');
assert.ok(main.includes("dentProfile='from-inset'"));
assert.ok(!main.includes('окончательный выбор профиля ещё предстоит'));
const counts=JSON.parse(await readFile(path.join(root,'docs/research/variant-counts.json'),'utf8'));
assert.deepEqual(counts.matrix,{oneFrame:144,openAndClosed:288,displayWithCrease:432});
const manifest=JSON.parse(await readFile(path.join(root,'public/brand/v1/variants.json'),'utf8'));
assert.deepEqual(manifest.construction,identityConfig,'Generated exports do not match accepted construction');
const current=JSON.parse(await readFile(path.join(root,'public/brand/v2/variants.json'),'utf8'));
const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
const adoption=JSON.parse(await readFile(path.join(root,'docs/adoptions/current.json'),'utf8'));
assert.deepEqual(current.construction,{...identityConfig,...presentation});
assert.equal(current.counts.microAllowed,288);assert.equal(current.counts.websitePool,144);
for(const file of ['README.md','README.ru.md','docs/en/generator.md','docs/generator.md']){
  const content=await readFile(path.join(root,file),'utf8');assert.ok(content.includes(pkg.version));assert.ok(content.includes(String(current.counts.microAllowed)));assert.ok(content.includes(String(current.counts.websitePool)));
}
assert.equal(adoption.faviconChoices,current.counts.microAllowed);
assert.equal(adoption.genericOpenDefaults,current.counts.websitePool);
assert.match(adoption.sourceCommit,/^[0-9a-f]{40}$/);
const result={date:'2026-10-25',markdownFiles:files.length,localLinks,missingLinks:missing.length,construction:identityConfig,systemVersion:pkg.version,adoptedVersion:adoption.version,adoptedSource:adoption.sourceCommit,adoptedChoices:adoption.faviconChoices,genericOpenDefaults:current.counts.websitePool,firstImplementationChoices:manifest.defaultPool.length,matrix:counts.matrix,micro:counts.micro};
await writeFile(reportTarget,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
