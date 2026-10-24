// Review assets are deliberately kept out of public/brand and the random pool.
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { mark, jointDetail, dentProfiles, dentProfileLabels } from './geometry.mjs';
const require = createRequire(import.meta.url);
const sharp = require(process.env.EMPYTREE_SHARP || 'sharp');
const destination = new URL('../docs/brand/', import.meta.url);
const studies = new URL('../docs/brand/review/', import.meta.url);
await mkdir(studies, { recursive: true });
const ink = '#20211f', paper = '#f5f4ef';
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = (x, y, value, size = 18) => `<text x="${x}" y="${y}" fill="${ink}" font-family="Segoe UI,Arial,sans-serif" font-size="${size}">${escape(value)}</text>`;
const image = (svg, x, y, width, height = width) => `<image x="${x}" y="${y}" width="${width}" height="${height}" href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"/>`;
const raster = async (svg, size) => sharp(Buffer.from(svg.replace(/width="\d+" height="\d+"/, `width="${size}" height="${size}"`))).png().toBuffer();
const start = (w, h) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="${paper}"/>`;
async function save(name, svg) {
  await writeFile(new URL(`${name}.svg`, destination), svg);
  await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL(`${name}.png`, destination)));
}
const dentSheet = [start(1440, 1260), text(64, 62, 'История конструкции: три профиля вмятин', 26), text(64, 103, 'Глаза и неровный стык одинаковы · у всех трёх профилей одна глубина', 18)];
const dentCases = [{mouth:'flat', dent:'left', label:'Прямой рот · вмятина слева'}, {mouth:'corner-left', dent:'both', label:'Левый угол · две вмятины'}, {mouth:'down', dent:'right', label:'Треугольник · вмятина справа'}];
for (const [col, dentProfile] of dentProfiles.entries()) {
  const x = 80 + col * 456;
  dentSheet.push(text(x, 157, dentProfileLabels[dentProfile], 21), text(x, 188, col === 0 ? 'Глубина 4 / участок 12' : col === 1 ? 'Глубина 4 / отступ от угла 8' : 'Глубина 4 / вся сторона 56', 17));
  for (const [row, options] of dentCases.entries()) {
    const y = 220 + row * 268;
    const svg = mark({...options, dentProfile, color:ink});
    dentSheet.push(image(svg, x, y, 188), text(x, y + 222, options.label, 17));
    await writeFile(new URL(`dent-${dentProfile}-${options.mouth}-${options.dent}.svg`, studies), svg);
  }
  let cursor = x;
  for (const size of [16, 32, 64]) {
    const svg = mark({mouth:'corner-left', dent:'both', dentProfile, optical: size === 16 ? 'micro' : size === 32 ? 'compact' : 'display', color:ink});
    const buffer = await raster(svg, size);
    dentSheet.push(`<image x="${cursor}" y="${1110 - size}" width="${size}" height="${size}" href="data:image/png;base64,${buffer.toString('base64')}"/>`, text(cursor, 1143, `${size} px`, 15));
    cursor += size + 48;
  }
}
dentSheet.push(text(64, 1218, 'Утверждена пологая промежуточная вмятина. Остальные профили — история сравнения.', 18), '</svg>');
await save('dent-comparison', dentSheet.join(''));

const joinSheet = [start(1440, 1200), text(64, 64, 'История конструкции: неровный стык утверждён', 26), text(64, 103, 'Слева — сохранённый вариант; справа — локальное сглаживание без переноса головок', 18), text(64, 165, 'ЗАМЕТНЫЙ СТЫК · СОХРАНЯЕМ', 20), text(760, 165, 'АККУРАТНЫЙ · ТОЛЬКО СРАВНЕНИЕ', 20)];
const jointCases = [{family:'arrows', mouth:'flat', label:'Ноты-стрелки'}, {family:'beam', mouth:'flat', label:'Связанная пара'}, {family:'rest8', mouth:'flat', label:'Раздельные восьмые · этюд'}];
for (const [row, options] of jointCases.entries()) {
  const y = 214 + row * 290;
  for (const [col, joint] of ['character', 'clean'].entries()) {
    const x = 64 + col * 696;
    const svg = mark({...options, joint, color:ink});
    const crop = jointDetail({...options,joint,color:ink});
    joinSheet.push(image(svg, x, y, 190), image(crop, x + 236, y + 27, 345, 125), text(x, y + 231, options.label, 18), text(x + 236, y + 192, 'Увеличение области соединения', 16));
    await writeFile(new URL(`joint-${joint}-${options.family}.svg`, studies), svg);
  }
}
joinSheet.push(text(64, 1160, 'Неровный стык остаётся авторской особенностью. В случайный набор аккуратный вариант не добавляется.', 18), '</svg>');
await save('joint-comparison', joinSheet.join(''));
console.log('Built review-only comparisons for dent profiles and note joints.');

// Actual 16 px rasters and nearest-neighbour enlargements: no synthetic vector zoom.
const microSheet=[start(1440,940),text(64,60,'История micro: уменьшение головок нот',26),text(64,100,'Рамка, стрелки, штили и положение рта не менялись · слева в паре было, справа стало',18)];
for(const [col,dentProfile] of dentProfiles.entries()){
  const x=64+col*456;microSheet.push(text(x,160,dentProfileLabels[dentProfile],21));
  for(const [row,dent] of ['left','both'].entries()){
    const y=210+row*310;microSheet.push(text(x,y,dent==='left'?'Вмятина слева':'Обе вмятины',18));
    for(const [i,old] of [true,false].entries()){
      const svg=mark({optical:'micro',dent,dentProfile,color:ink,background:'#ffffff',...(old?{microHeadScaleX:1,microHeadScaleY:1}:{})});
      const buffer=await raster(svg,16),zoom=await sharp(buffer).resize(160,160,{kernel:'nearest'}).png().toBuffer();
      const xx=x+i*200;microSheet.push(`<image x="${xx}" y="${y+30}" width="16" height="16" href="data:image/png;base64,${buffer.toString('base64')}"/><image x="${xx}" y="${y+70}" width="160" height="160" href="data:image/png;base64,${zoom.toString('base64')}"/>`,text(xx,y+265,old?'Было':'Стало',17));
    }
  }
}
microSheet.push(text(64,900,'Головки: ширина 4 → 3.52 px, высота 2 → 1.92 px. Правая точка крепления сохранена.',18),'</svg>');
await save('micro-head-comparison',microSheet.join(''));
