// Current presentation sheets use the full generator and the actual exported ICO layers.
import { createRequire } from 'node:module';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { unpackIco } from './favicon.mjs';
import { renderMark,eyePairs,mouthKinds,names } from './system.mjs';
const require=createRequire(import.meta.url),sharp=require(process.env.EMPYTREE_SHARP||'sharp');
const output=new URL('../docs/brand/',import.meta.url);
await mkdir(output,{recursive:true});
const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
const manifest=JSON.parse(await readFile(new URL('../public/brand/v2/variants.json',import.meta.url),'utf8'));
const adoption=JSON.parse(await readFile(new URL('../docs/adoptions/current.json',import.meta.url),'utf8'));
const ink='#20211f',paper='#f5f4ef',rule='#c9cbc1',soft='#aeb2a4';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text=(x,y,value,size=20,{color=ink,font='Consolas,monospace',anchor='start'}={})=>`<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" text-anchor="${anchor}" fill="${color}">${escape(value)}</text>`;
const line=(y,x=64,to=1376,color=rule)=>`<path d="M${x} ${y}H${to}" fill="none" stroke="${color}"/>`;
const begin=(width,height,background=paper)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="${background}"/>`;
const embed=(buffer,x,y,width,height=width,type='png')=>`<image x="${x}" y="${y}" width="${width}" height="${height}" href="data:image/${type};base64,${buffer.toString('base64')}"/>`;
const glyph=(options,x,y,size,color=ink)=>embed(Buffer.from(renderMark({...options,color,theme:null})),x,y,size,size,'svg+xml');
const id=v=>[v.eyes,v.mouth,v.frame,v.dent].join('--');
const primary=[
  {eyes:'arrows',mouth:'flat',frame:'open',dent:'left'},
  {eyes:'beam',mouth:'down',frame:'closed',dent:'right'},
  {eyes:'separate',mouth:'rest4',frame:'open',dent:'both'},
  {eyes:'mixed',mouth:'rest2',frame:'closed',dent:'none'},
];
const samples=[...primary,
  {eyes:'arrows',mouth:'rise',frame:'closed',dent:'both'},
  {eyes:'beam',mouth:'fall',frame:'open',dent:'none'},
  {eyes:'mixed',mouth:'corner-left',frame:'closed',dent:'left'},
  {eyes:'separate',mouth:'corner-right',frame:'open',dent:'right'},
  {eyes:'beam',mouth:'rest8',frame:'closed',dent:'both'},
  {eyes:'mixed',mouth:'flat',frame:'open',dent:'both'},
  {eyes:'arrows',mouth:'down',frame:'closed',dent:'none'},
  {eyes:'separate',mouth:'rest2',frame:'open',dent:'left'},
];
async function icoPng(variant,size){
  const buffer=await readFile(new URL(`../public/brand/v2/${id(variant)}.ico`,import.meta.url));
  const layer=unpackIco(buffer).find(layer=>layer.size===size);if(!layer)throw Error('Missing resolution');return layer.png;
}
async function save(name,svg){
  await writeFile(new URL(name+'.svg',output),svg);
  await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL(name+'.png',output)));
}
const languages={
  en:{tag:'PERSONAL MARK SYSTEM',title:'Quiet music from a crumpled box.',eyes:['Note arrows','Beamed notes','Separate eighths','Partial beam + flag'],detail:['Straight mouth / left dent','Triangle / right dent','Quarter rest / both dents','Half rest / straight sides'],parts:'4 EYE PAIRS × 9 MOUTHS × 4 SIDE STATES',counts:'288 small marks / 432 display expressions',mouths:['Straight','Rising','Falling','Left wedge','Right wedge','Triangle','1/8 rest','1/4 rest','1/2 rest'],box:'ONE BOX / FOUR SIDE STATES',sides:['Straight','Left','Right','Both'],frames:'OPEN / CLOSED / TOP CREASE',crease:'Top crease: display only, 64 px and above',optics:'THREE OPTICAL DRAWINGS',native:'16 px / native',zoom:'16 px / pixels ×8',sizes:'32 px compact / 64 px display',accepted:'Every supported 16 px combination is approved.',fixed:'ONE CHARACTER, MANY EXPRESSIONS',features:['Deliberately irregular note joints.','Intermediate shallow dents; the face stays fixed.','Transparent artwork; recommended line colors.'],live:'Live on empytree.com: 288 favicons + breadcrumb home marks',footer:'Construction 1.5 / micro policy 2 / version '+pkg.version},
  ru:{tag:'СИСТЕМА ЛИЧНОГО ЗНАКА',title:'Тихая музыка из помятой коробки.',eyes:['Ноты-стрелки','Связанная пара','Раздельные восьмые','Короткая вязка + флажок'],detail:['Прямой рот / вмятина слева','Треугольник / вмятина справа','Пауза 1/4 / две вмятины','Пауза 1/2 / ровные бока'],parts:'4 ВЕРХА × 9 РТОВ × 4 СОСТОЯНИЯ БОКОВ',counts:'288 малых / 432 крупных выражения',mouths:['Прямой','Наклон /','Наклон \\','Левый угол','Правый угол','Треугольник','Пауза 1/8','Пауза 1/4','Пауза 1/2'],box:'ОДНА КОРОБКА / ЧЕТЫРЕ СОСТОЯНИЯ',sides:['Ровно','Слева','Справа','Две'],frames:'ОТКРЫТАЯ / ЗАКРЫТАЯ / С ЗАЛОМОМ',crease:'Залом сверху — только display, от 64 px',optics:'ТРИ ОПТИЧЕСКИХ РИСУНКА',native:'16 px / оригинал',zoom:'16 px / пиксели ×8',sizes:'32 px compact / 64 px display',accepted:'Все поддерживаемые сочетания 16 px разрешены автором.',fixed:'ХАРАКТЕР ОДИН, ВЫРАЖЕНИЯ МЕНЯЮТСЯ',features:['Неровный стык головки и штиля сохраняется.','Пологие вмятины; лицо остаётся на месте.','Прозрачный знак; рекомендуемые цвета линий.'],live:'На empytree.com: 288 favicon + знак Home в хлебных крошках',footer:'Конструкция 1.5 / политика micro 2 / версия '+pkg.version},
};
for(const [language,copy] of Object.entries(languages)){
  copy.counts=language==='en'?`${manifest.counts.microAllowed} small marks / ${manifest.counts.display} display expressions`:`${manifest.counts.microAllowed} малых / ${manifest.counts.display} крупных выражения`;
  copy.live=language==='en'?`Live ${adoption.version}: ${adoption.faviconChoices} faces / ${adoption.faviconFiles} ICOs + breadcrumb marks`:`На сайте ${adoption.version}: ${adoption.faviconChoices} лиц / ${adoption.faviconFiles} ICO + знак Home`;
  const cover=[begin(1440,1640),text(64,52,copy.tag,15),text(1376,52,'empytree / '+pkg.version,15,{anchor:'end'}),text(64,120,'empytree',70,{font:'Georgia,serif'}),text(64,166,copy.title,28,{font:'Georgia,serif'})];
  for(const [index,variant] of primary.entries()){
    const center=228+index*328;
    cover.push(glyph(variant,center-120,212,240),text(center,492,copy.eyes[index],21,{anchor:'middle',font:'Georgia,serif'}),text(center,520,copy.detail[index],14,{anchor:'middle'}));
  }
  cover.push(line(554),text(64,596,copy.parts,23),text(64,627,copy.counts,19));
  for(const [index,mouth] of mouthKinds.entries()){
    const center=64+(index+.5)*1312/9;
    cover.push(glyph({eyes:'arrows',mouth},center-49,660,98),text(center,791,copy.mouths[index],14,{anchor:'middle'}));
  }
  cover.push(line(824),text(64,866,copy.box,19),text(776,866,copy.optics,19));
  for(const [index,dent] of ['none','left','right','both'].entries()){
    const center=124+index*150;
    cover.push(glyph({eyes:'beam',mouth:'flat',dent},center-48,899,96),text(center,1022,copy.sides[index],16,{anchor:'middle'}));
  }
  cover.push(text(64,1082,copy.frames,18));
  for(const [index,frame] of ['open','closed','crease'].entries())cover.push(glyph({eyes:'mixed',mouth:'down',frame,dent:'both'},66+index*182,1112,96));
  cover.push(text(64,1246,copy.crease,15));
  const micro=await icoPng(primary[2],16),zoom=await sharp(micro).resize(128,128,{kernel:'nearest'}).png().toBuffer();
  cover.push(embed(micro,784,934,16),text(776,1002,copy.native,13),embed(zoom,950,900,128),text(936,1066,copy.zoom,13));
  cover.push(glyph({...primary[2],optical:'compact'},800,1114,32),glyph(primary[2],904,1098,64),text(776,1215,copy.sizes,15));
  cover.push(text(776,1250,copy.accepted,14));
  cover.push('<rect x="0" y="1300" width="1440" height="340" fill="'+ink+'"/>',text(64,1346,copy.fixed,20,{color:paper}));
  for(const [index,variant] of [primary[1],{eyes:'mixed',mouth:'rest8',frame:'open',dent:'left'},primary[2]].entries())cover.push(glyph(variant,64+index*178,1376,144,paper));
  for(const [index,value] of copy.features.entries())cover.push(text(672,1410+index*35,value,19,{color:paper,font:'Georgia,serif'}));
  cover.push(text(64,1573,copy.live,18,{color:paper}),text(64,1612,copy.footer,14,{color:soft}),'</svg>');
  await save(language==='en'?'overview':'overview-ru',cover.join(''));
}

const sides=[begin(1440,1210),text(64,60,'empytree / side states across the current musical family',27,{font:'Georgia,serif'}),text(64,96,'Only the frame changes. One accepted dent profile: from-inset.',18)];
for(const [column,variant] of primary.entries())sides.push(text(326+column*284,145,names[variant.eyes],18));
for(const [row,dent] of ['none','left','right','both'].entries()){
  const y=184+row*234;
  sides.push(text(64,y+92,names[dent],19));
  for(const [column,variant] of primary.entries())sides.push(glyph({...variant,dent},314+column*284,y,170));
}
sides.push(line(1140),text(64,1181,'Version '+pkg.version+' / intermediate shallow dents / irregular joints remain fixed',17),'</svg>');
await save('dented-sides',sides.join(''));

const pixels=[begin(1440,1530),text(40,54,'empytree / real favicon pixels, twelve distinct expressions',28,{font:'Georgia,serif'}),text(40,91,'ICO: 16/20 micro; 24–48 compact; 64–256 display. Two palettes; every expression approved.',17)];
pixels.push(text(40,140,'EXPRESSION',15),text(378,140,'DISPLAY',15),text(552,140,'16 px / 1×',15),text(844,140,'32 px / 2×',15),text(1136,140,'48 px / 3×',15));
for(const [row,variant] of samples.entries()){
  const y=166+row*108;
  pixels.push(text(40,y+34,names[variant.eyes],17),text(40,y+61,names[variant.mouth]+' / '+variant.dent,14),glyph(variant,386,y+4,84));
  for(const [column,size] of [16,32,48].entries()){
    const png=await icoPng(variant,size),zoom=await sharp(png).resize(96,96,{kernel:'nearest'}).png().toBuffer();
    const x=552+column*292;
    pixels.push(embed(png,x,y+(96-size)/2,size),embed(zoom,x+68,y,96));
  }
}
pixels.push(text(40,1502,'Native raster at left of each pair / nearest-neighbour ×6, ×3 and ×2 at right / version '+pkg.version,16),'</svg>');
await save('pixel-check',pixels.join(''));

// Canonical master remains the simple, open, undented face.
await sharp(Buffer.from(renderMark({theme:'light'}))).resize(768,768).png().toFile(fileURLToPath(new URL('hero.png',output)));
console.log('Built current overview (EN/RU), side-state and native-pixel presentation sheets for '+pkg.version);
