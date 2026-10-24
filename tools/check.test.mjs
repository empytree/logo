import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { mark, mouths, frames, dents, dentProfiles } from './geometry.mjs';
import { identityConfig } from './identity-config.mjs';
const require = createRequire(import.meta.url);
const sharp = require(process.env.EMPYTREE_SHARP || 'sharp');
const source = await readFile(new URL('../public/brand/v1/random-favicon.js', import.meta.url), 'utf8');
const asset = name => readFile(new URL(`../public/brand/v1/${name}`, import.meta.url));
function page(store = new Map(), dataset = {}, failStorage = false, hasLink = true) {
  const link = { href: 'https://example.test/sub/brand/v1/favicon.ico', dataset: {} };
  const context = {
    document: { currentScript: { src: 'https://example.test/sub/brand/v1/random-favicon.js', dataset }, querySelector: () => hasLink ? link : null },
    sessionStorage: { getItem: k => { if (failStorage) throw Error('blocked'); return store.get(k); }, setItem: (k, v) => { if (failStorage) throw Error('blocked'); store.set(k, v); } },
    URL, Math,
  };
  vm.runInNewContext(source, context);
  return link;
}

test('shuffle bag visits all 24 mouth/side combinations before repeating', () => {
  const store = new Map(); let previous;
  for (let cycle = 0; cycle < 20; cycle++) {
    const seen = new Set();
    for (let i = 0; i < 24; i++) {
      const link = page(store); const selected = link.dataset.expression;
      assert.notEqual(selected, previous); seen.add(selected); previous = selected;
      assert.equal(link.href, `https://example.test/sub/brand/v1/${selected}.ico`);
    }
    assert.equal(seen.size, 24);
  }
});
test('frame and mouth configuration, pool changes and single-entry pool work', () => {
  const store = new Map();
  assert.equal(page(store, { mouths: 'flat', frames: 'closed', dents: 'none' }).dataset.expression, 'flat-closed');
  assert.equal(page(store, { mouths: 'flat', frames: 'closed', dents: 'none' }).dataset.expression, 'flat-closed');
  const seen = new Set(Array.from({ length: 48 }, () => page(store, { frames: 'open,closed' }).dataset.expression));
  assert.equal(seen.size, 48);
  assert.equal(page(store, { mouths: 'down', frames: 'open', dents: 'left' }).dataset.expression, 'down-open-dent-left');
});
test('unavailable or corrupt storage and missing links preserve a usable fallback', () => {
  assert.match(page(new Map(), {}, true).href, /\.ico$/);
  for (const raw of ['{', 'null', '{"pool":"flat","deck":["../../bad"]}', JSON.stringify({ pool: mouths.map(m => m + '-open').join(','), last: 'flat-open', deck: [null] })]) {
    assert.match(page(new Map([['empytree.identity.v1', raw]])).href, /\/(flat|rise|fall|corner-left|corner-right|down)-open(-dent-(left|right|both))?\.ico$/);
  }
  assert.match(page(new Map(), { enabled: 'false' }).href, /favicon\.ico$/);
  assert.match(page(new Map(), {}, false, false).href, /favicon\.ico$/);
});
test('every ICO has three valid opaque PNG frames at 16, 32 and 48 pixels', async () => {
  for (const dent of dents) for (const frame of ['open', 'closed']) for (const mouth of mouths) {
    const ico = await asset(`${mouth}-${frame}${dent === 'none' ? '' : `-dent-${dent}`}.ico`);
    assert.equal(ico.readUInt16LE(2), 1); assert.equal(ico.readUInt16LE(4), 3);
    for (const [i, size] of [16, 32, 48].entries()) {
      const p = 6 + i * 16; const length = ico.readUInt32LE(p + 8); const offset = ico.readUInt32LE(p + 12);
      assert.equal(ico[p], size); assert.equal(ico[p + 1], size);
      assert.ok(offset + length <= ico.length);
      const { data, info } = await sharp(ico.subarray(offset, offset + length)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.equal(info.width, size); assert.equal(info.height, size);
      for (let j = 3; j < data.length; j += 4) assert.equal(data[j], 255);
    }
  }
});
test('micro flat mouth and one-pixel frame stay solid; all six expressions differ', async () => {
  const buffers = await Promise.all(mouths.map(m => asset(`${m}-open-16.png`)));
  assert.equal(new Set(buffers.map(b => b.toString('base64'))).size, 6);
  const { data, info } = await sharp(buffers[0]).raw().toBuffer({ resolveWithObject: true });
  const pixel = (x, y) => Array.from(data.subarray((y * info.width + x) * info.channels, (y * info.width + x) * info.channels + 3));
  for (let x = 4; x < 12; x++) assert.deepEqual(pixel(x, 12), [32, 33, 31]);
  for (let x = 1; x < 15; x++) assert.deepEqual(pixel(x, 14), [32, 33, 31]);
  for (const xy of [[0, 0], [7, 1], [8, 1], [7, 11], [7, 13]]) assert.deepEqual(pixel(...xy), [255, 255, 255]);
});
test('all geometric variants and dents are self-contained; music extensions remain future scope', () => {
  for (const dent of dents) for (const optical of ['micro', 'compact', 'display']) for (const frame of frames) for (const mouth of mouths) {
    const svg = mark({ optical, frame, mouth, dent });
    assert.doesNotMatch(svg, /<script|<image|<text|<foreignObject|url\(/i);
  }
  assert.throws(() => mark({ optical: 'micro', family: 'rest8' }));
});
test('all 48 manifest choices exist, and density-2 frame renders as two solid pixels', async () => {
  const manifest = JSON.parse(await asset('variants.json'));
  assert.equal(manifest.variants.length, 48); assert.equal(manifest.defaultPool.length, 24);
  assert.deepEqual(manifest.construction, identityConfig);
  assert.equal(manifest.construction.joint, 'character');
  assert.ok(manifest.variants.every(v => !v.id.includes('clean') && !v.id.includes('from-corners')));
  for (const entry of manifest.variants) for (const key of ['ico', 'svg', 'png']) assert.ok((await asset(entry[key])).length > 0);
  const ico = await asset('flat-open.ico');
  const p = 22, length = ico.readUInt32LE(p + 8), offset = ico.readUInt32LE(p + 12);
  const {data, info} = await sharp(ico.subarray(offset, offset + length)).raw().toBuffer({resolveWithObject: true});
  for (const y of [28, 29]) for (let x = 2; x < 30; x++) {
    assert.equal(data[(y * 32 + x) * info.channels], 32);
  }
});
test('character joints exactly preserve the previous SVG silhouettes in every note family', async () => {
  const expected = {
    'logo.svg':'0bafb1dec1fddde1f17351887f8b9aa72c2edd68ef9344a4f33e877ddd1126e9',
    'study-beam.svg':'8b8237b47b7958876e5a554d8fda4ddaca5e6c5889e6f21c5ac884b4f8618958',
    'study-rest8.svg':'3ac714ea9da1be7ae5466a4f4c50cb7c2da0f2f85f0194f307e1f684011ceb44',
    'study-rest4.svg':'1d98a15f2507e3931d447d3802187748b24d64770b2c7b354dd7a9b642ffc979',
  };
  for(const [file,hash] of Object.entries(expected))assert.equal(createHash('sha256').update(await asset(file)).digest('hex'),hash);
});
test('clean comparison preserves heads and all upper note geometry', async () => {
  for(const family of ['arrows','beam','rest8','rest4']){
    const current=mark({family,joint:'character'}),clean=mark({family,joint:'clean'});
    assert.deepEqual(current.match(/<ellipse[^>]*>/g),clean.match(/<ellipse[^>]*>/g));
    const upper=async svg=>sharp(Buffer.from(svg)).extract({left:0,top:0,width:64,height:26}).raw().toBuffer();
    const a=await upper(current),b=await upper(clean);
    // Equivalent stroked and filled contours differ slightly in edge antialiasing.
    // An overlapping second shaft would change alpha by ~48 and fail this bound.
    let maximum=0,total=0;
    for(let i=0;i<a.length;i++){const delta=Math.abs(a[i]-b[i]);maximum=Math.max(maximum,delta);total+=delta}
    assert.ok(maximum<=10,`${family}: upper contour changed by ${maximum}/255`);
    assert.ok(total/a.length<.1,`${family}: upper silhouette moved`);
    assert.notEqual(current,clean);
  }
});
test('dent profiles change only the frame and never change an undented mark', async () => {
  const baseline=mark({dent:'none'});
  const face=async svg=>sharp(Buffer.from(svg)).extract({left:12,top:10,width:42,height:44}).raw().toBuffer();
  const expected=await face(baseline);
  for(const dentProfile of dentProfiles){
    assert.equal(mark({dent:'none',dentProfile}),baseline);
    for(const dent of ['left','right','both'])assert.deepEqual(await face(mark({dent,dentProfile})),expected);
  }
});
test('small dent is excluded; confirmed joint and intermediate dent remain fixed', () => {
  assert.deepEqual(dentProfiles,['local-large','from-inset','from-corners']);
  assert.equal(identityConfig.joint,'character');assert.equal(identityConfig.dentProfile,'from-inset');
  assert.throws(()=>mark({dentProfile:'local-original'}));
});
test('smaller micro heads lighten the left gap while preserving shafts and larger glyphs', async () => {
  const image=async options=>sharp(Buffer.from(mark({optical:'micro',color:'#20211f',background:'#ffffff',...options}))).raw().toBuffer({resolveWithObject:true});
  for(const dentProfile of dentProfiles)for(const dent of ['left','both']){
    const options={dentProfile,dent};
    const previous=await image({...options,microHeadScaleX:1,microHeadScaleY:1}),current=await image(options);
    const red=(r,x,y)=>r.data[(y*16+x)*r.info.channels];
    assert.ok(red(current,3,9)>red(previous,3,9)+70,`${dentProfile}: left head stays too close to the frame`);
    assert.ok(red(current,4,9)<64,`${dentProfile}: head lost its solid core`);
    for(const [x,y] of [[6,4],[6,5],[6,7],[6,9],[11,7],[11,9]])assert.equal(red(current,x,y),red(previous,x,y));
  }
  for(const optical of ['display','compact'])assert.equal(mark({optical}),mark({optical,microHeadScaleX:1,microHeadScaleY:1}));
});
