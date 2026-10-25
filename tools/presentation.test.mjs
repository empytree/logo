import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { renderMark,parts,wrap,enumerate } from './system.mjs';
import { icoSizes,palettes,opticalForSize } from './presentation.mjs';
import { unpackIco } from './favicon.mjs';
const require=createRequire(import.meta.url),sharp=require(process.env.EMPYTREE_SHARP||'sharp');
const resource=name=>new URL('../public/brand/v2/'+name,import.meta.url);
test('frame fills its canvas without cropping any stroke, including dent shoulders',async()=>{
  for(const [optical,size] of [['micro',16],['compact',32],['display',64]])for(const frame of optical==='display'?['open','closed','crease']:['open','closed'])for(const dent of ['none','left','right','both']){
    const content=parts({optical,frame,dent}).frame;
    const svg=wrap(content,{optical,theme:null}).replace(`viewBox="0 0 ${size} ${size}"`,`viewBox="-2 -2 ${size+4} ${size+4}"`).replace(`width="${size}" height="${size}"`,`width="${size+4}" height="${size+4}"`);
    const {data,info}=await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    let minX=Infinity,minY=Infinity,maxX=-1,maxY=-1;
    for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>0){minX=Math.min(x,minX);minY=Math.min(y,minY);maxX=Math.max(x,maxX);maxY=Math.max(y,maxY)}
    assert.deepEqual([minX,minY,maxX,maxY],[2,2,size+1,size+1],`${optical}/${frame}/${dent}`);
  }
});
test('every face has both transparent line colors and ten true vector-rasterized ICO resolutions',async()=>{
  for(const variant of enumerate('micro')){
    for(const theme of Object.keys(palettes)){
      const buffer=await readFile(resource(variant.id+(theme==='dark'?'-dark':'')+'.ico'));
      const layers=unpackIco(buffer);assert.deepEqual(layers.map(v=>v.size),icoSizes);
      for(const {size,png} of layers){
        const optical=opticalForSize(size);
        const svg=renderMark({...variant,optical,theme}).replace(/width="\d+" height="\d+"/,`width="${size}" height="${size}"`);
        const actual=await sharp(png).ensureAlpha().raw().toBuffer();
        assert.deepEqual(actual,await sharp(Buffer.from(svg)).ensureAlpha().raw().toBuffer(),`${variant.id}/${theme}/${size}`);
        let transparent=0,solid=0;
        for(let i=3;i<actual.length;i+=4){if(actual[i]===0)transparent++;if(actual[i]===255)solid++}
        assert.ok(transparent>size*size/3,`${variant.id}/${theme}/${size}: no transparent field`);
        assert.ok(solid>0,`${variant.id}/${theme}/${size}: missing solid strokes`);
      }
    }
  }
  // Both recommended colors have precisely the same silhouette and alpha.
  const light=unpackIco(await readFile(resource('arrows--flat--open--none.ico')));
  const dark=unpackIco(await readFile(resource('arrows--flat--open--none-dark.ico')));
  for(let layer=0;layer<light.length;layer++){
    const a=await sharp(light[layer].png).ensureAlpha().raw().toBuffer(),b=await sharp(dark[layer].png).ensureAlpha().raw().toBuffer();
    for(let i=3;i<a.length;i+=4)assert.equal(a[i],b[i]);
  }
  const id='separate--flat--open--none';
  const layers=unpackIco(await readFile(resource(id+'.ico')));
  const microSvg=renderMark({eyes:'separate',optical:'micro'}).replace('width="16" height="16"','width="32" height="32"');
  assert.notDeepEqual(await sharp(layers.find(v=>v.size===32).png).raw().toBuffer(),await sharp(Buffer.from(microSvg)).raw().toBuffer());
});
test('theme changes reuse the same face without consuming the random bag; legacy and unavailable APIs work',async()=>{
  const selector=await readFile(resource('random-favicon.js'),'utf8');
  function page({dark=false,legacy=false,throws=false,available=true}={}){
    const store=new Map(),link={href:'https://example.test/favicon.ico',dataset:{}},query={matches:dark};let change;
    if(legacy)query.addListener=callback=>{change=callback};else query.addEventListener=(event,callback)=>{assert.equal(event,'change');change=callback};
    const context={document:{currentScript:{src:'https://example.test/brand/random-favicon.js',dataset:{frames:'open,closed'}},querySelector:()=>link},sessionStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},URL,Math};
    if(available)context.matchMedia=value=>{assert.equal(value,'(prefers-color-scheme: dark)');if(throws)throw Error('blocked');return query};
    vm.runInNewContext(selector,context);return {store,link,query,change};
  }
  for(const legacy of [false,true]){
    const {store,link,query,change}=page({dark:true,legacy});
    const before=[...store],id=link.dataset.expression;
    assert.equal(link.dataset.theme,'dark');assert.ok(link.href.endsWith(id+'-dark.ico'));
    query.matches=false;change();assert.equal(link.dataset.theme,'light');assert.ok(link.href.endsWith(id+'.ico'));
    query.matches=true;change();assert.equal(link.dataset.expression,id);assert.deepEqual([...store],before);
  }
  for(const options of [{throws:true},{available:false}])assert.equal(page(options).link.dataset.theme,'light');
});

test('line colors are recommended defaults; explicit creative colors preserve transparency and geometry',async()=>{
  const defaults=renderMark({optical:'micro'}),custom=renderMark({optical:'micro',theme:'dark',color:'#804020'});
  assert.match(defaults,/#20211f/);assert.match(custom,/#804020/);
  assert.doesNotMatch(custom,/<rect width="16" height="16"/);
  const a=await sharp(Buffer.from(defaults)).ensureAlpha().raw().toBuffer(),b=await sharp(Buffer.from(custom)).ensureAlpha().raw().toBuffer();
  for(let i=3;i<a.length;i+=4)assert.equal(a[i],b[i]);
  assert.throws(()=>renderMark({color:'currentColor'}));
  assert.throws(()=>renderMark({color:'#ffffff80'}));
  assert.throws(()=>renderMark({background:'#ffffff'}));
  for(const name of ['favicon-96.png','apple-touch-icon.png']){
    const {data}=await sharp(await readFile(resource(name))).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.ok(data.some((value,index)=>index%4===3&&value===0));
  }
});
