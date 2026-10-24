import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mark, mouths, frames, dents, dentLabels, labels } from './geometry.mjs';
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

const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const sheet = [];
const text = (x, y, str, size = 18, fill = '#20211f') => `<text x="${x}" y="${y}" fill="${fill}" font-family="Segoe UI,Arial,sans-serif" font-size="${size}">${escape(str)}</text>`;
const embed = (svg, x, y, size) => `<image x="${x}" y="${y}" width="${size}" height="${size}" href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"/>`;
sheet.push('<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1480" viewBox="0 0 1440 1480"><rect width="1440" height="1480" fill="#f5f4ef"/>');
sheet.push(text(72, 70, 'empytree / тихая музыка из помятой коробки', 26), text(72, 107, 'Знак, который меняет выражение, сохраняя лицо.', 18));
sheet.push(embed(mark(), 72, 155, 310));
sheet.push(text(455, 190, 'НОТЫ · ЛИЦО · ЭТОЙ СТОРОНОЙ ВВЕРХ', 18), text(455, 242, 'Разрыв — открытый верх коробки.', 24), text(455, 282, 'Короткий левый штрих — намёк на стрелку.', 24), text(455, 322, 'Наклонные головки — музыка внутри.', 24));
sheet.push(text(455, 402, 'Основной вариант: открытая рамка, прямой рот.', 18), text(455, 434, 'Монохром. Без текстур, объёма и случайных деформаций.', 18));
sheet.push(text(72, 548, 'ОДНО ЛИЦО · ШЕСТЬ ВЫРАЖЕНИЙ', 18));
for (const [i, mouth] of mouths.entries()) {
  const x = 72 + i * 218;
  sheet.push(embed(mark({ mouth }), x, 585, 154), text(x, 780, labels[mouth], 18));
}
sheet.push(text(72, 862, 'ТРИ ОПТИЧЕСКИЕ ВЕРСИИ · РАЗМЕРЫ НИЖЕ ПОКАЗАНЫ 1:1', 18));
let xx = 72;
for (const size of [16, 20, 24, 32, 48, 64, 96]) {
  sheet.push(embed(mark({ optical: opticalFor(size), color: '#20211f', background: '#ffffff' }), xx, 906 + (96 - size) / 2, size), text(xx, 1038, `${size} px`, 16));
  xx += size + 74;
}
sheet.push('<rect x="72" y="1082" width="576" height="230" fill="#20211f"/>', embed(mark({ color: '#f5f4ef' }), 94, 1111, 164), embed(mark({ frame: 'closed', color: '#f5f4ef' }), 280, 1111, 164), embed(mark({ frame: 'crease', color: '#f5f4ef' }), 466, 1111, 164));
sheet.push(text(722, 1110, 'ОТДЕЛЬНАЯ МУЗЫКАЛЬНАЯ ВЕТКА · ОТ 64 px', 16));
for (const [i, family] of ['beam', 'rest8', 'rest4'].entries()) sheet.push(embed(mark({ family }), 722 + i * 208, 1146, 140), text(722 + i * 208, 1322, ['Общая вязка', 'Восьмая пауза', 'Четвертная пауза'][i], 16));
sheet.push(text(72, 1350, 'Открытая / закрытая / с заломом', 16), text(72, 1420, 'Концепция v1 · 24.10.2026 · Точные исходники и правила прилагаются.', 16), '</svg>');
await writeFile(path.join(preview, 'overview.svg'), sheet.join(''));
await sharp(Buffer.from(sheet.join(''))).png().toFile(path.join(preview, 'overview.png'));
await writeFile(path.join(preview, 'hero.png'), await png(mark({ color: '#20211f', background: '#f5f4ef' }), 768));

// A contact sheet uses real exported pixels, including the exact 16 px raster.
const audit = [];
audit.push('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="810"><rect width="1200" height="810" fill="#f5f4ef"/>', text(32, 42, 'Фавиконы: реальные пиксели / увеличение ×6', 23));
for (const [i, mouth] of mouths.entries()) {
  const y = 78 + i * 112;
  audit.push(text(32, y + 50, labels[mouth], 17));
  for (const [j, size] of [16, 32, 48].entries()) {
    const buf = await readFile(path.join(out, `${mouth}-open-${size}.png`));
    audit.push(`<image x="${235 + j * 260}" y="${y + (48 - size) / 2}" width="${size}" height="${size}" href="data:image/png;base64,${buf.toString('base64')}"/>`);
    if (size === 16) {
      const zoom = await sharp(buf).resize(96, 96, { kernel: 'nearest' }).png().toBuffer();
      audit.push(`<image x="300" y="${y - 20}" width="96" height="96" href="data:image/png;base64,${zoom.toString('base64')}"/>`);
    } else audit.push(`<image x="${300 + j * 260}" y="${y - 20}" width="${size * 2}" height="${size * 2}" href="data:image/png;base64,${(await sharp(buf).resize(size * 2, size * 2, { kernel: 'nearest' }).png().toBuffer()).toString('base64')}"/>`);
  }
}
audit.push(text(235, 787, '16 px / ×6', 16), text(495, 787, '32 px / ×2', 16), text(755, 787, '48 px / ×2', 16), '</svg>');
await sharp(Buffer.from(audit.join(''))).png().toFile(path.join(preview, 'pixel-check.png'));
console.log(`Built identity system at ${out}`);

// Additional contact sheet: the implemented scope, including all four side states.
const dentSheet = ['<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1220"><rect width="1440" height="1220" fill="#f5f4ef"/>', text(64, 65, 'empytree / шесть выражений × четыре состояния коробки', 26), text(64, 104, 'Первая реализация · глаза постоянны, рот и бока выбираются независимо', 18)];
for (const [row, dent] of dents.entries()) {
  const y = 155 + row * 250;
  dentSheet.push(text(64, y + 26, dentLabels[dent], 18));
  for (const [col, mouth] of mouths.entries()) {
    const x = 320 + col * 175;
    dentSheet.push(embed(mark({ mouth, dent }), x, y, 130));
    const p = await readFile(path.join(out, `${mouth}-open${dent === 'none' ? '' : `-dent-${dent}`}-16.png`));
    dentSheet.push(`<image x="${x}" y="${y + 154}" width="16" height="16" href="data:image/png;base64,${p.toString('base64')}"/>`, text(x + 26, y + 168, '16 px', 14));
    if (row === 3) dentSheet.push(text(x, y + 207, labels[mouth], 16));
  }
}
dentSheet.push(text(64, 1190, 'Вмятина ограничена серединой бока. Углы коробки и лицо не смещаются.', 18), '</svg>');
await writeFile(path.join(preview, 'dented-sides.svg'), dentSheet.join(''));
await sharp(Buffer.from(dentSheet.join(''))).png().toFile(path.join(preview, 'dented-sides.png'));
await import('./comparisons.mjs');
