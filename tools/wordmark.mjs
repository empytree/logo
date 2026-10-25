// Fixed outlines from the approved 2026-10-26 pseudonym study.
// No font lookup, automatic optical sizing or extra y–t adjustment at render time.
import { readFileSync } from 'node:fs';
const model=JSON.parse(readFileSync(new URL('assets/empytree-fraunces.json',import.meta.url),'utf8'));
export const wordmarkWidth=size=>(model.inkBounds[2]-model.inkBounds[0])/model.unitsPerEm*size;
export function wordmark(x,baseline,size,{color='#20211f',anchor='start'}={}){
  const width=wordmarkWidth(size),left=x-(anchor==='end'?width:anchor==='middle'?width/2:0);
  const paths=model.glyphs.map((glyph,index)=>`<path transform="translate(${glyph.x+index*model.trackingEm*model.unitsPerEm} ${glyph.y})" d="${glyph.d}"/>`).join('');
  return `<g role="img" aria-label="empytree" data-wordmark="fraunces" fill="${color}" transform="translate(${left} ${baseline}) scale(${size/model.unitsPerEm} ${-size/model.unitsPerEm}) translate(${-model.inkBounds[0]} 0)"><title>empytree</title>${paths}</g>`;
}
