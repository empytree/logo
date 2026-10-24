import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mark, mouths, frames, dents, labels } from './geometry.mjs';
import { identityConfig } from './identity-config.mjs';
const require = createRequire(import.meta.url);
const sharp = require(process.env.EMPYTREE_SHARP || 'sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'public/brand/v1');
const preview = path.join(root, 'docs/brand');
await mkdir(out, { recursive: true });
await mkdir(preview, { recursive: true });
const save = (name, content) => writeFile(path.join(out, name), content);
// Ask the SVG renderer for the target resolution before rasterizing.
const png = (svg, size) => sharp(Buffer.from(svg.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`))).png().toBuffer();

function ico(buffers, sizes) {
  const header = Buffer.alloc(6 + sizes.length * 16);
  header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
  let offset = header.length;
  sizes.forEach((s, i) => {
    const p = 6 + 16 * i;
    header[p] = s === 256 ? 0 : s; header[p + 1] = s === 256 ? 0 : s;
    header.writeUInt16LE(1, p + 4); header.writeUInt16LE(32, p + 6);
    header.writeUInt32LE(buffers[i].length, p + 8); header.writeUInt32LE(offset, p + 12);
    offset += buffers[i].length;
  });
  return Buffer.concat([header, ...buffers]);
}

const opticalFor = s => s <= 20 ? 'micro' : s < 64 ? 'compact' : 'display';
for (const dent of dents) for (const frame of frames) for (const mouth of mouths) for (const optical of ['display', 'compact', 'micro']) {
  if (frame === 'crease' && optical !== 'display') continue;
  await save(`mark-${mouth}-${frame}${dent === 'none' ? '' : `-dent-${dent}`}-${optical}.svg`, mark({ mouth, frame, dent, optical }));
}
await save('logo.svg', mark());
await save('logo-reverse.svg', mark({ color: '#f5f4ef' }));
for (const family of ['beam', 'rest8', 'rest4']) await save(`study-${family}.svg`, mark({ family }));

const entries = [];
for (const dent of dents) for (const frame of ['open', 'closed']) for (const mouth of mouths) {
  const stem = `${mouth}-${frame}${dent === 'none' ? '' : `-dent-${dent}`}`;
  const sizes = dent === 'none' ? [16, 32, 48, 64, 96, 192, 512] : [16, 32, 48, 96];
  for (const size of sizes) {
    await save(`${stem}-${size}.png`, await png(mark({ mouth, frame, dent, optical: opticalFor(size), color: '#20211f', background: '#ffffff' }), size));
    if (size <= 48) await save(`${stem}-${size}-dark.png`, await png(mark({ mouth, frame, dent, optical: opticalFor(size), color: '#f5f4ef', background: '#20211f' }), size));
  }
  // ICO serves browser tabs: keep the micro design at 1x, 2x and 3x density.
  const layers = await Promise.all([16, 32, 48].map(size => png(mark({ mouth, frame, dent, optical: 'micro', color: '#20211f', background: '#ffffff' }), size)));
  await save(`${stem}.ico`, ico(layers, [16, 32, 48]));
  await save(`${stem}-adaptive.svg`, mark({ mouth, frame, dent, optical: 'micro', adaptive: true }));
  entries.push({ id: stem, mouth, frame, dent, label: labels[mouth], ico: `${stem}.ico`, svg: `${stem}-adaptive.svg`, png: `${stem}-96.png` });
}
await save('favicon.ico', await readFile(path.join(out, 'flat-open.ico')));
await save('favicon-96.png', await readFile(path.join(out, 'flat-open-96.png')));
await save('apple-touch-icon.png', await png(mark({ color: '#20211f', background: '#ffffff' }), 180));
await save('variants.json', JSON.stringify({ version: 1, construction: identityConfig, default: 'flat-open', defaultPool: entries.filter(e => e.frame === 'open').map(e => e.id), variants: entries }, null, 2) + '\n');

console.log(`Built historical v1 catalog at ${out}`);
await import('./comparisons.mjs');
await import('./build-gallery.mjs');
