// Original empytree identity geometry. No font, stock icon, or external asset.
import { identityConfig } from './identity-config.mjs';
export const mouths = ['flat', 'rise', 'fall', 'corner-left', 'corner-right', 'down'];
export const frames = ['open', 'closed', 'crease'];
export const dents = ['none', 'left', 'right', 'both'];
export const dentLabels = { none: 'Ровные бока', left: 'Вмятина слева', right: 'Вмятина справа', both: 'Две вмятины' };
export const dentProfiles = ['local-large', 'from-inset', 'from-corners'];
export const dentProfileLabels = { 'local-large': 'Увеличенная локальная', 'from-inset': 'Пологая промежуточная', 'from-corners': 'Пологая от углов' };
export const joints = ['character', 'clean'];
export const labels = {
  flat: 'Тишина', rise: 'Наклон /', fall: 'Наклон \\',
  'corner-left': 'Левый угол', 'corner-right': 'Правый угол', down: 'Треугольник',
};
const line = (d, width) => `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="butt" stroke-linejoin="miter"/>`;
const rect = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;

export function frameShape(optical, frame, dent, dentProfile) {
  const left = dent === 'left' || dent === 'both';
  const right = dent === 'right' || dent === 'both';
  const inset = dentProfile === 'from-inset';
  const full = dentProfile === 'from-corners';
  if (optical === 'micro') {
    const l = full ? 'M1.5 1.5L2.75 8L1.5 14.5' : inset ? 'M1.5 1.5V3.5L2.75 8L1.5 12.5V14.5' : 'M1.5 1.5V5.75L2.75 8L1.5 10.25V14.5';
    const r = full ? 'M14.5 1.5L13.25 8L14.5 14.5' : inset ? 'M14.5 1.5V3.5L13.25 8L14.5 12.5V14.5' : 'M14.5 1.5V5.75L13.25 8L14.5 10.25V14.5';
    return (left ? line(l, 1) : rect(1, 1, 1, 14))
      + (right ? line(r, 1) : rect(14, 1, 1, 14)) + rect(1, 14, 14, 1)
      + (frame === 'closed' ? rect(1, 1, 14, 1) : rect(1, 1, 5, 1) + rect(10, 1, 5, 1));
  }
  if (optical === 'compact') {
    const leftSide = left ? full ? 'L3.75 16' : inset ? 'V5.75L3.75 16L1.75 26.25' : 'V12.5L3.75 16L1.75 19.5' : '';
    const rightSide = right ? full ? 'L28.25 16' : inset ? 'V26.25L28.25 16L30.25 5.75' : 'V19.5L28.25 16L30.25 12.5' : '';
    return line(`M12 1.75H1.75${leftSide}${left && full ? 'L1.75 30.25' : 'V30.25'}H30.25${rightSide}${right && full ? 'L30.25 1.75' : 'V1.75'}H20${frame === 'closed' ? 'H12' : ''}`, 1.5);
  }
  const leftSide = left ? full ? 'L8 32' : inset ? 'V12L8 32L4 52' : 'V26L8 32L4 38' : '';
  const rightSide = right ? full ? 'L56 32' : inset ? 'V52L56 32L60 12' : 'V38L56 32L60 26' : '';
  return line(`M24 4H4${leftSide}${left && full ? 'L4 60' : 'V60'}H60${rightSide}${right && full ? 'L60 4' : 'V4'}${frame === 'crease' ? 'H53L50 6L47 4H40' : frame === 'closed' ? 'H24' : 'H40'}`, 2);
}

// Review-only clean alternative: retain the head, shaft axis, flag and all spacing.
// Taper just the lower shaft into the rotated ellipse's rightmost tangent point.
function cleanStem(x, top, cx, cy, rx, ry, width, flag = null) {
  const angle = -12 * Math.PI / 180;
  const c = Math.cos(angle), s = Math.sin(angle);
  const extent = Math.sqrt(rx * rx * c * c + ry * ry * s * s);
  const ex = cx + extent;
  const ey = cy + (rx * rx - ry * ry) * s * c / extent;
  const n = value => Number(value.toFixed(4));
  const delta = width / (2 * Math.SQRT2);
  // A single contour avoids a raster seam between a shaft and a separate flag.
  const upper = flag === null ? `M${n(x-width/2)} ${top}H${n(x+width/2)}`
    : `M${n(x-width/2)} ${n(top-width/2*(1+Math.SQRT2))}L${n(x+flag+delta)} ${n(top+flag-delta)}L${n(x+flag-delta)} ${n(top+flag+delta)}L${n(x+width/2)} ${n(top+width/2*(1+Math.SQRT2))}`;
  return `<path d="${upper}V${n(cy-ry-1)}C${n(x+width/2)} ${n(cy-ry*.5)} ${n(ex)} ${n(ey-ry*.5)} ${n(ex)} ${n(ey)}L${n(x-width/2)} ${cy}Z"/>`;
}

export function arrows(optical, joint, microHeadScaleX, microHeadScaleY) {
  if (optical === 'micro') {
    // At 16 px the left shard joins the tip. An isolated subpixel shard is unstable.
    const head = `<path d="M4 8H7V10H3V9H4Z" transform="translate(7 9) scale(${microHeadScaleX} ${microHeadScaleY}) translate(-7 -9)"/>`;
    return [0, 5].map(dx => `<g transform="translate(${dx} 0)">${rect(6, 4, 1, joint === 'clean' ? 5 : 6)}${rect(5, 5, 3, 1)}${head}</g>`).join('');
  }
  const compact = optical === 'compact';
  const positions = compact ? [13, 22] : [26, 44];
  return positions.map(x => compact
    ? `<ellipse cx="${x - 2}" cy="18" rx="3" ry="2" transform="rotate(-12 ${x - 2} 18)"/>`
      + (joint === 'clean' ? cleanStem(x, 8, x-2, 18, 3, 2, 1.75, 3.5) + line(`M${x - 5} 11.5L${x - 3.5} 10`, 1.75) : line(`M${x} 18V8L${x + 3.5} 11.5M${x - 5} 11.5L${x - 3.5} 10`, 1.75))
    : `<ellipse cx="${x - 4}" cy="35" rx="4.75" ry="3.1" transform="rotate(-12 ${x - 4} 35)"/>`
      + (joint === 'clean' ? cleanStem(x, 18, x-4, 35, 4.75, 3.1, 2.5, 6) + line(`M${x - 8.5} 23.5L${x - 6} 21`, 2.5) : line(`M${x} 35V18L${x + 6} 24M${x - 8.5} 23.5L${x - 6} 21`, 2.5))
  ).join('');
}

export function mouthShape(optical, mouth) {
  const c = optical === 'compact';
  const m = optical === 'micro';
  const [l, r, top, bottom, mid, w] = m ? [4, 12, 11, 13, 12, 1]
    : c ? [8, 24, 23, 26, 24.5, 1.75] : [18, 46, 45, 50, 47.5, 2.5];
  if (mouth === 'flat') return rect(l, m ? 12 : mid - w / 2, r - l, w);
  if (mouth === 'rise') return line(`M${l} ${bottom}L${r} ${top}`, w);
  if (mouth === 'fall') return line(`M${l} ${top}L${r} ${bottom}`, w);
  if (mouth === 'corner-left') return `<path d="M${l} ${top}H${r}L${l} ${bottom}Z"/>`;
  if (mouth === 'corner-right') return `<path d="M${l} ${top}H${r}V${bottom}Z"/>`;
  return `<path d="M${l + (m ? 1 : c ? 2 : 4)} ${top}H${r - (m ? 1 : c ? 2 : 4)}L${(l + r) / 2} ${bottom + (m ? 0 : c ? .5 : 1)}Z"/>`;
}

function musicalEyes(family, joint) {
  if (family === 'beam') {
    return [26, 44].map(x => `<ellipse cx="${x - 4}" cy="35" rx="4.75" ry="3.1" transform="rotate(-12 ${x - 4} 35)"/>` + (joint === 'clean' ? cleanStem(x, 18, x-4, 35, 4.75, 3.1, 2.5) : rect(x - 1.25, 18, 2.5, 17))).join('') + rect(24.75, 17, 20.5, 3);
  }
  // Deliberately geometric eighth-note flags, rather than imported font glyphs.
  const notes = [24, 46].map(x => `<ellipse cx="${x - 3.8}" cy="32" rx="4.3" ry="2.9" transform="rotate(-12 ${x - 3.8} 32)"/>` + (joint === 'clean' ? cleanStem(x, 14, x-3.8, 32, 4.3, 2.9, 2) : rect(x - 1, 14, 2, 18))
    + `<path d="M${x} 14C${x + 1} 19 ${x + 8} 19 ${x + 4} 27C${x + 5.5} 21 ${x - 1} 22 ${x} 14Z"/>`).join('');
  return notes;
}

function restMouth(family) {
  if (family === 'rest8') return `<ellipse cx="30" cy="41" rx="2.5" ry="2" transform="rotate(-15 30 41)"/>` + line('M35 39L30 50M30 43Q33 44 35 39', 2);
  // A geometric quarter rest, kept in the large expressive family only.
  return `<path d="M31 38L36 43L32 47L35 51C31 48 27 52 30 55C24 53 27 47 31 47L27 43L31 42Z"/>`;
}

// Magnified joint study: exact head/lower-shaft geometry, with flags and mouth hidden.
export function jointDetail({family='arrows',joint='character',color='currentColor'}={}) {
  if(!['arrows','beam','rest8','rest4'].includes(family)||!joints.includes(joint))throw Error('Unknown joint study parameter');
  const separate=family==='rest8'||family==='rest4';
  const [positions,dx,cy,rx,ry,w]=separate?[[24,46],3.8,32,4.3,2.9,2]:[[26,44],4,35,4.75,3.1,2.5];
  const content=positions.map(x=>`<ellipse cx="${x-dx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(-12 ${x-dx} ${cy})"/>`+(joint==='clean'?cleanStem(x,26,x-dx,cy,rx,ry,w):rect(x-w/2,26,w,cy-26))).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="15 26 36 13" width="360" height="130" role="img" aria-label="Увеличение стыка; флажки и рот скрыты"><g color="${color}" fill="currentColor">${content}</g></svg>`;
}

export function mark({ optical = 'display', mouth = 'flat', frame = 'open', dent = 'none', dentProfile = identityConfig.dentProfile, joint = identityConfig.joint, microHeadScaleX = identityConfig.microHeadScaleX, microHeadScaleY = identityConfig.microHeadScaleY, family = 'arrows', color = 'currentColor', background = null, adaptive = false } = {}) {
  if (!['micro', 'compact', 'display'].includes(optical) || !mouths.includes(mouth) || !frames.includes(frame) || !dents.includes(dent) || !dentProfiles.includes(dentProfile) || !joints.includes(joint) || !['arrows', 'beam', 'rest8', 'rest4'].includes(family)) throw new Error('Unknown identity parameter');
  if (family !== 'arrows' && optical !== 'display') throw new Error('Musical studies are display-only');
  if (![microHeadScaleX,microHeadScaleY].every(value => Number.isFinite(value) && value > 0 && value <= 1)) throw new Error('Invalid micro head scale');
  if (frame === 'crease' && optical !== 'display') frame = 'open';
  const size = optical === 'micro' ? 16 : optical === 'compact' ? 32 : 64;
  const content = frameShape(optical, frame, dent, dentProfile) + (family === 'arrows' ? arrows(optical, joint, microHeadScaleX, microHeadScaleY) + mouthShape(optical, mouth)
    : musicalEyes(family, joint) + (family === 'beam' ? mouthShape(optical, mouth) : restMouth(family)));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="empytree — тихая музыка из помятой коробки">`
    + (adaptive ? '<style>:root{color:#20211f}@media(prefers-color-scheme:dark){:root{color:#f5f4ef}}</style>' : '')
    + (background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : '')
    + `<g${color !== 'currentColor' ? ` color="${color}"` : ''} fill="currentColor">${content}</g></svg>\n`;
}
