import { arrows, mouthShape, dents, frames, mouths as geometricMouths } from './geometry.mjs';
import { identityConfig } from './identity-config.mjs';
import { palettes,gridSizes,fullCanvasTransform,edgeFrame } from './presentation.mjs';

export const eyePairs = ['arrows', 'beam', 'separate', 'mixed'];
export const mouthKinds = [...geometricMouths, 'rest8', 'rest4', 'rest2'];
export const opticalSizes = ['micro', 'compact', 'display'];
export const names = {
  arrows: 'Note arrows', beam: 'Beamed notes', separate: 'Separate eighths', mixed: 'Partial beam + flag',
  flat: 'Straight', rise: 'Rising /', fall: 'Falling \\', 'corner-left': 'Left wedge', 'corner-right': 'Right wedge', down: 'Down triangle',
  rest8: 'Eighth rest', rest4: 'Quarter rest', rest2: 'Half rest',
  none: 'Straight sides', left: 'Left dent', right: 'Right dent', both: 'Both dents', open: 'Open', closed: 'Closed', crease: 'Top crease',
};
const rect = (x,y,w,h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const line = (d,w) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="butt" stroke-linejoin="miter"/>`;

export function variantId({eyes='arrows',mouth='flat',frame='open',dent='none'}={}) {
  validate({eyes,mouth,frame,dent,optical:'display'});
  return `${eyes}--${mouth}--${frame}--${dent}`;
}
export function enumerate(optical='display') {
  if(!opticalSizes.includes(optical))throw Error('Unknown optical size');
  const result=[];
  for(const eyes of eyePairs)for(const mouth of mouthKinds)for(const frame of frames)for(const dent of dents){
    if(frame==='crease'&&optical!=='display')continue;
    const parameters={eyes,mouth,frame,dent};
    result.push({...parameters,id:variantId(parameters)});
  }
  return result;
}
function validate({eyes,mouth,frame,dent,optical}) {
  if(!eyePairs.includes(eyes)||!mouthKinds.includes(mouth)||!frames.includes(frame)||!dents.includes(dent)||!opticalSizes.includes(optical))throw Error('Unknown system parameter');
  if(frame==='crease'&&optical!=='display')throw Error('Top crease is display-only; choose another frame explicitly');
}
function notes(eyes,optical) {
  if(eyes==='arrows')return arrows(optical,'character',identityConfig.microHeadScaleX,identityConfig.microHeadScaleY);
  if(optical==='micro'){
    const head=`<path d="M4 8H7V10H3V9H4Z" transform="translate(7 9) scale(${identityConfig.microHeadScaleX} ${identityConfig.microHeadScaleY}) translate(-7 -9)"/>`;
    let result=[0,5].map(dx=>`<g transform="translate(${dx} 0)">${head}${rect(6,3,1,7)}</g>`).join('');
    if(eyes==='beam')result+=rect(6,3,6,1);
    else {
      if(eyes==='mixed')result+=rect(6,3,3,1);
      for(const x of eyes==='mixed'?[11]:[6,11])result+=`<path d="M${x} 3H${x+1}V4H${x+2}V6H${x+1}V5H${x}Z"/>`;
    }
    return result;
  }
  const compact=optical==='compact';
  const beam=eyes==='beam';
  const positions=compact?(beam?[13,22]:[12,23]):(beam?[26,44]:[24,46]);
  const [top,cy,dx,rx,ry,w]=compact?(beam?[8,18,2,3,2,1.75]:[7,16.5,1.9,2.4,1.5,1.5]):(beam?[18,35,4,4.75,3.1,2.5]:[14,32,3.8,4.3,2.9,2]);
  let result=positions.map(x=>`<ellipse cx="${x-dx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(-12 ${x-dx} ${cy})"/>`+rect(x-w/2,top,w,cy-top)).join('');
  if(beam)result+=rect(positions[0]-w/2,top-w/2,positions[1]-positions[0]+w,compact?1.75:3);
  else {
    if(eyes==='mixed')result+=rect(positions[0]-w/2,top-w/2,compact?5:10,compact?1.75:2.5);
    for(const x of eyes==='mixed'?[positions[1]]:positions){
      if(compact)result+=`<path d="M${x} 7C${x+0.5} 9.5 ${x+4} 9.5 ${x+2} 13.5C${x+2.75} 10.5 ${x-0.5} 11 ${x} 7Z"/>`;
      else result+=`<path d="M${x} 14C${x+1} 19 ${x+8} 19 ${x+4} 27C${x+5.5} 21 ${x-1} 22 ${x} 14Z"/>`;
    }
  }
  return result;
}
function rest(kind,optical) {
  if(optical==='micro'){
    if(kind==='rest8')return '<ellipse cx="7" cy="11.3" rx="0.85" ry="0.65"/>'+line('M9 10.5L7.8 13M7 12Q8.5 12 9 10.5',0.9);
    if(kind==='rest4')return '<path d="M7.8 10.4L9.3 11.6L8 12.4L9 13.4C7.5 12.4 6.7 13.5 7.6 13.8C5.9 13.5 6.7 12 7.8 12.2L6.8 11.1L7.8 11.4Z"/>';
    return rect(6,11,4,1)+rect(5,12,6,1);
  }
  const compact=optical==='compact';
  if(kind==='rest2')return compact?rect(13,22,6,2)+rect(11,24,10,1):rect(26,43,12,4)+rect(22,47,20,2);
  const drawing=kind==='rest8'?'<ellipse cx="30" cy="41" rx="2.5" ry="2" transform="rotate(-15 30 41)"/>'+line('M35 39L30 50M30 43Q33 44 35 39',2)
    :'<path d="M31 38L36 43L32 47L35 51C31 48 27 52 30 55C24 53 27 47 31 47L27 43L31 42Z"/>';
  return compact?`<g transform="translate(0 ${kind==='rest8'?2:0}) scale(.5)">${drawing}</g>`:drawing;
}
export function parts({eyes='arrows',mouth='flat',frame='open',dent='none',optical='display'}={}) {
  validate({eyes,mouth,frame,dent,optical});
  const transform=content=>`<g transform="${fullCanvasTransform(optical)}">${content}</g>`;
  return {frame:transform(edgeFrame(optical,frame,dent)),eyes:transform(notes(eyes,optical)),mouth:transform(geometricMouths.includes(mouth)?mouthShape(optical,mouth):rest(mouth,optical))};
}
export function wrap(content,{optical='display',theme='light',color,background}={}) {
  const size=gridSizes[optical];
  if(!size)throw Error('Unknown optical size');
  if(theme!==null&&!Object.hasOwn(palettes,theme))throw Error('Unknown theme');
  // null is a construction/review layer only; production exports name a palette.
  const palette=theme===null?{foreground:'currentColor',background:null}:palettes[theme];
  if(theme!==null&&background!==undefined&&background!==null)throw Error('Production marks have transparent backgrounds');
  if(theme!==null&&color!==undefined&&!/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color))throw Error('Use an explicit opaque hex line color');
  color??=palette.foreground;
  background=background===undefined?palette.background:background;
  const safe=value=>value==='currentColor'||/^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(value);
  if(!safe(color)||(background!==null&&!safe(background)))throw Error('Use a hex color or currentColor');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="empytree — тихая музыка из помятой коробки">`
    +(background?`<rect width="${size}" height="${size}" fill="${background}"/>`:'')
    +`<g${color!=='currentColor'?` color="${color}"`:''} fill="currentColor">${content}</g></svg>\n`;
}
export function renderMark(options={}){const layers=parts(options);return wrap(layers.frame+layers.eyes+layers.mouth,options)}
