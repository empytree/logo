// A discrete, conservative optical policy; never repairs a selected face afterwards.
export const microPolicyRevision = 1;
export const reasonLabels = {
  'quarter-rest-detail': 'Quarter-rest turns collapse at 16 px',
  'frame-eyes-gap': 'Frame and eyes lack a full separating pixel',
  'eyes-mouth-gap': 'Eyes and mouth lack a full separating pixel',
  'frame-mouth-gap': 'Frame and mouth lack a full separating pixel',
  'duplicate-raster': 'Same thresholded 16 px silhouette as an earlier choice',
  'density-gap': 'A layer gap becomes too narrow at 2x or 3x density',
};
export function opticalReasons(variant,metrics) {
  const reasons=[];
  if(variant.mouth==='rest4')reasons.push('quarter-rest-detail');
  if(metrics.frameEyes<2)reasons.push('frame-eyes-gap');
  if(metrics.eyesMouth<2)reasons.push('eyes-mouth-gap');
  if(metrics.frameMouth<2)reasons.push('frame-mouth-gap');
  if(!metrics.densitySafe)reasons.push('density-gap');
  return reasons;
}
export function filterPool(catalog,{optical='micro',eyes=null,mouths=null,dents=null,frames=['open']}={}) {
  if(!['micro','compact','display'].includes(optical))throw Error('Unknown optical size');
  return catalog.filter(v=>v.optical===optical&&v.allowed
    &&(!eyes||eyes.includes(v.eyes))&&(!mouths||mouths.includes(v.mouth))
    &&(!dents||dents.includes(v.dent))&&(!frames||frames.includes(v.frame)));
}
