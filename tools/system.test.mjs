import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,writeFile,rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
import { enumerate,renderMark,parts,wrap } from './system.mjs';
import { icoSizes,palettes,opticalForSize } from './presentation.mjs';
import { rasterSvg,unpackIco } from './favicon.mjs';
import { mark,mouths,dents } from './geometry.mjs';
import { filterPool } from './micro-policy.mjs';
import { exportSystemPackage,verifySystemPackage } from './system-package.mjs';
const require=createRequire(import.meta.url),sharp=require(process.env.EMPYTREE_SHARP||'sharp');
const resource=name=>new URL('../public/brand/v2/'+name,import.meta.url);
const manifest=JSON.parse(await readFile(resource('variants.json'),'utf8'));
const selector=await readFile(resource('random-favicon.js'),'utf8');
const root=fileURLToPath(new URL('../',import.meta.url));

test('full matrix is distinct; the accepted dent and irregular joint remain fixed',()=>{
  for(const [optical,count] of [['display',432],['compact',288],['micro',288]]){
    const variants=enumerate(optical);
    assert.equal(variants.length,count);assert.equal(new Set(variants.map(v=>v.id)).size,count);
    assert.equal(new Set(variants.map(v=>renderMark({...v,optical}))).size,count);
  }
  assert.equal(manifest.construction.joint,'character');assert.equal(manifest.construction.dentProfile,'from-inset');assert.equal(manifest.construction.canvas,'edge-to-edge');
  assert.match(parts({optical:'micro'}).eyes,/scale\(0.88 0.96\)/);assert.throws(()=>renderMark({theme:'unknown'}));
  assert.throws(()=>renderMark({optical:'micro',frame:'crease'}));
  assert.throws(()=>renderMark({eyes:'<script>'}));
  assert.throws(()=>renderMark({color:'red" onload="bad'}));
});

test('all supported micro combinations are author-approved and measurements stay advisory',()=>{
  assert.equal(manifest.catalog.length,1008);
  const pool=filterPool(manifest.catalog);
  assert.equal(pool.length,144);assert.equal(filterPool(manifest.catalog,{frames:['open','closed']}).length,288);
  assert.equal(new Set(pool.map(v=>v.eyes)).size,4);
  assert.ok(manifest.catalog.every(v=>v.allowed&&v.reasons.length===0));
  assert.equal(filterPool(manifest.catalog,{mouths:['rest4']}).length,16);
  assert.ok(pool.filter(v=>v.mouth==='rest4').every(v=>v.advisories.includes('quarter-rest-detail')));
});

test('compact and display layers never overlap at their native raster sizes',async()=>{
  for(const optical of ['compact','display'])for(const variant of enumerate(optical)){
    const masks=[];
    for(const layer of Object.values(parts({...variant,optical}))){
      const {data,info}=await sharp(Buffer.from(wrap(layer,{optical,theme:null}))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      const mask=new Set();for(let i=3;i<data.length;i+=info.channels)if(data[i]>=64)mask.add((i-3)/info.channels);masks.push(mask);
    }
    for(const [a,b] of [[0,1],[0,2],[1,2]])assert.ok(![...masks[a]].some(pixel=>masks[b].has(pixel)),`${variant.id}, ${optical}, layers ${a}/${b}`);
  }
});

test('advisory measurements remain accurate after the edge-to-edge construction',async()=>{
  for(const variant of filterPool(manifest.catalog,{frames:['open','closed']})){
    const layers=parts(variant);
    for(const [index,scale] of [1,2,3].entries()){
      const masks=[];
      for(const layer of Object.values(layers)){
        const svg=wrap(layer,{optical:'micro',theme:null}).replace('width="16" height="16"',`width="${16*scale}" height="${16*scale}"`);
        const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
        const pixels=[];for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*info.channels+3]>=64)pixels.push([x,y]);masks.push(pixels);
      }
      for(const [a,b] of [[0,1],[0,2],[1,2]]){
        let distance=Infinity;for(const [x,y] of masks[a])for(const [xx,yy] of masks[b])distance=Math.min(distance,Math.hypot(x-xx,y-yy));
        const name=a===0?(b===1?'frameEyes':'frameMouth'):'eyesMouth';
        assert.equal(Number(distance.toFixed(3)),variant.metrics.densityGaps[scale][name]);
      }

    }
  }
});

function page(store,dataset={},failStorage=false){
  const link={href:'https://example.test/nested/favicon.ico',dataset:{}};
  vm.runInNewContext(selector,{document:{currentScript:{src:'https://example.test/nested/random-favicon.js',dataset},querySelector:()=>link},sessionStorage:{getItem:k=>{if(failStorage)throw Error();return store.get(k)},setItem:(k,v)=>{if(failStorage)throw Error();store.set(k,v)}},Math,URL});
  return link;
}
test('new selector visits only eligible choices, exhausts a bag and preserves fallback for empty/invalid groups',()=>{
  const pool=filterPool(manifest.catalog),store=new Map();let previous;
  for(let cycle=0;cycle<4;cycle++){
    const seen=new Set();for(let i=0;i<pool.length;i++){const result=page(store);assert.ok(pool.some(v=>v.id===result.dataset.expression));assert.notEqual(result.dataset.expression,previous);previous=result.dataset.expression;seen.add(previous)}assert.equal(seen.size,pool.length);
  }
  assert.match(page(store,{mouths:'rest4'}).href,/--rest4--/);
  assert.match(page(store,{mouths:'rest16'}).href,/favicon.ico$/);
  const allStore=new Map(),allSeen=new Set();for(let i=0;i<288;i++)allSeen.add(page(allStore,{frames:'open,closed'}).dataset.expression);assert.equal(allSeen.size,288);
  assert.match(page(store,{eyes:'../../bad'}).href,/favicon.ico$/);
  assert.match(page(store,{enabled:'false'}).href,/favicon.ico$/);
  assert.match(page(new Map(),{},true).href,/--open--/);
  assert.match(page(new Map([['empytree.identity.v2','{"deck":["../../bad"]}']])).href,/--open--/);
  assert.match(page(store,{frames:'closed'}).href,/--closed--/);
});

test('CLI exports all approved small specimens and still refuses unsupported small frames',()=>{
  const run=args=>spawnSync(process.execPath,['tools/generate.mjs',...args],{cwd:root,encoding:'utf8',windowsHide:true});
  assert.equal(run(['--mouth','rest4','--size','16']).status,0);
  assert.match(run(['--size','16','--theme','dark','--color','#804020']).stdout,/#804020/);
  assert.notEqual(run(['--frame','crease','--size','16']).status,0);
  assert.match(run(['--eyes','mixed','--size','64']).stdout,/<svg/);
  const study=run(['--mouth','rest4','--size','16','--study']);assert.equal(study.status,0);assert.equal(study.stderr,'');
});

test('new website package includes only allowed ICOs, records a null development commit and detects corruption',async()=>{
  const outputName='test-system-'+process.pid;
  const expected=path.join(root,'dist',outputName);
  try{
    const {resourceDir,provenance}=await exportSystemPackage({development:true,outputName});
    assert.equal(provenance.schemaVersion,5);assert.equal(Object.keys(provenance.files).length,1158);assert.equal(provenance.faviconFiles,576);assert.equal(provenance.sourceCommit,null);assert.equal(provenance.poolSize,144);assert.equal(provenance.availableChoices,288);assert.equal(provenance.compactMarks,288);
    const packed=JSON.parse(await readFile(path.join(resourceDir,'variants.json'),'utf8'));
    assert.equal(packed.markPool.length,288);assert.ok(packed.variants.every(v=>v.svg===v.id+'-compact.svg'));
    assert.match(await readFile(path.join(resourceDir,packed.variants[0].svg),'utf8'),/viewBox="0 0 32 32"/);
    await assert.rejects(verifySystemPackage(resourceDir));
    await verifySystemPackage(resourceDir,{requireRelease:false});
    await assert.rejects(exportSystemPackage({development:true,outputName}));
    await writeFile(path.join(resourceDir,'random-favicon.js'),'corrupt');
    await assert.rejects(verifySystemPackage(resourceDir,{requireRelease:false}),/Checksum/);
    await assert.rejects(exportSystemPackage({development:true,outputName:'../escape'}));
  }finally{
    assert.equal(path.dirname(expected),path.join(root,'dist'));assert.ok(path.basename(expected).startsWith('test-system-'));
    await rm(expected,{recursive:true,force:true});
  }
});

test('offline generator embeds every optical drawing, actual micro pixels and syntactically valid controls',async()=>{
  const html=await readFile(new URL('../examples/generator.html',import.meta.url),'utf8');
  assert.doesNotMatch(html,/__GENERATOR_DATA__|window\.openai|fetch\(/);
  assert.match(html,/data:image\/png;base64/);
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
  const data=JSON.parse(script.match(/const data=(.*);\r?\n/)[1]);
  assert.equal(Object.keys(data.marks).length,2016);assert.equal(Object.keys(data.pixels).length,576);
});

test('generator controls allow every micro mark and preserve explicit unsupported frame state',async()=>{
  const html=await readFile(new URL('../examples/generator.html',import.meta.url),'utf8');
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  class Element {
    constructor(tag='div'){this.tag=tag;this.value='';this.options=[];this.children=[];this.listeners={};this.disabled=false;this.textContent='';this.innerHTML='';this.classList={toggle(){}}}
    appendChild(child){this.children.push(child);if(this.tag==='select'&&child.tag==='option'){this.options.push(child);if(!this.value)this.value=child.value}return child}
    append(...children){for(const child of children)this.appendChild(child)}
    replaceChildren(){this.children=[]}
    addEventListener(name,callback){this.listeners[name]=callback}
  }
  const nodes={};for(const id of ['eyes','mouth','dent','frame','optical','sheet','theme'])nodes[id]=new Element('select');
  nodes.optical.value='display';nodes.sheet.value='all';nodes.theme.value='light';
  const document={getElementById:id=>nodes[id]??=new Element(),createElement:tag=>new Element(tag)};
  vm.runInNewContext(script,{document,location:{hash:''},URLSearchParams,Math});
  assert.equal(nodes.download.disabled,false);assert.match(nodes.status.textContent,/eligible at display/);
  nodes.optical.value='micro';nodes.mouth.value='rest4';nodes.optical.listeners.change();
  assert.equal(nodes.download.disabled,false);assert.match(nodes.status.textContent,/Quarter-rest/);
  nodes.random.listeners.click();assert.equal(nodes.download.disabled,false);assert.match(nodes.status.textContent,/eligible at micro/);
  nodes.frame.value='crease';nodes.frame.listeners.change();
  assert.equal(nodes.download.disabled,true);assert.equal(nodes.random.disabled,true);assert.match(nodes.status.textContent,/No drawing/);assert.equal(nodes.frame.value,'crease');
  nodes.optical.value='display';nodes.optical.listeners.change();assert.equal(nodes.download.disabled,false);
  nodes.theme.value='dark';nodes.theme.listeners.change();assert.doesNotMatch(nodes.hero.innerHTML,/#20211f/);assert.match(nodes.hero.innerHTML,/#f5f4ef/);
  assert.ok(nodes.grid.children.length>0);
});
