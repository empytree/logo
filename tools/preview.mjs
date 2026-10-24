import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { mark, mouths, frames, dents } from './geometry.mjs';
const require = createRequire(import.meta.url);
const sharp = require(process.env.EMPYTREE_SHARP || 'sharp');
const target = process.argv[2];
if (!target) throw new Error('Provide the path to the visualization fragment');
const assets = {};
const opticalFor = s => s <= 20 ? 'micro' : s < 64 ? 'compact' : 'display';
for (const dent of dents) for (const frame of frames) for (const mouth of mouths) {
  const hero = mark({ frame, mouth, dent, color: '#000000' });
  assets[[mouth, frame, dent, 'hero'].join(':')] = 'data:image/svg+xml;base64,' + Buffer.from(hero).toString('base64');
  for (const size of [16, 24, 32, 48, 64, 96]) {
    const svg = mark({ frame, mouth, dent, color: '#000000', optical: opticalFor(size) }).replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`);
    const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
    assets[[mouth, frame, dent, size].join(':')] = 'data:image/png;base64,' + buffer.toString('base64');
  }
}
let content = await readFile(new URL('preview-fragment.html', import.meta.url), 'utf8');
content = content.replace('__EMPYTREE_ASSETS__', JSON.stringify(assets));
await writeFile(target, content);
console.log(`Prepared interactive comparison (${Buffer.byteLength(content)} bytes)`);
