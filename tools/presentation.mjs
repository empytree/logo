// Production presentation is explicit. Historical v1 construction stays unchanged.
export const palettes=Object.freeze({
  light:Object.freeze({foreground:'#20211f',background:'#f5f4ef'}),
  dark:Object.freeze({foreground:'#f5f4ef',background:'#20211f'}),
});
export const icoSizes=Object.freeze([16,20,24,32,40,48,64,96,128,256]);
export const presentation=Object.freeze({revision:'1.4',canvas:'edge-to-edge',palettes,icoSizes,
  opticalBasis:'physical-raster-size',fallbackTheme:'light'});
export function opticalForSize(size){
  if(!Number.isInteger(size)||size<16||size>4096)throw Error('Size must be an integer from 16 to 4096');
  return size<=20?'micro':size<64?'compact':'display';
}
export const gridSizes=Object.freeze({micro:16,compact:32,display:64});
export function fullCanvasTransform(optical){
  // Keep micro eyes/mouth on the accepted pixel grid. Expanding them by 16/14
  // would blur every straight stem; only the micro frame grows to the edge.
  if(optical==='micro')return 'translate(0 0)';
  const n=gridSizes[optical],margin={micro:1,compact:1,display:3}[optical];
  if(!n)throw Error('Unknown optical size');
  return `scale(${n/(n-2*margin)}) translate(${-margin} ${-margin})`;
}
// Closed polygon for a mitered stroke. Clamp the tiny outward miter at dent
// shoulders to the image boundary: the drawing fits rather than being clipped.
function strokePolygon(points,width,low,high){
  const normals=points.slice(1).map(([x,y],i)=>{const dx=x-points[i][0],dy=y-points[i][1],d=Math.hypot(dx,dy);return [-dy/d,dx/d]});
  const edge=sign=>points.map(([x,y],i)=>{
    const a=normals[Math.max(0,i-1)],b=normals[Math.min(i,normals.length-1)],denominator=1+a[0]*b[0]+a[1]*b[1];
    const clamp=v=>Math.max(low,Math.min(high,v));
    return [clamp(x+sign*width/2*(a[0]+b[0])/denominator),clamp(y+sign*width/2*(a[1]+b[1])/denominator)];
  });
  return `<polygon points="${[...edge(1),...edge(-1).reverse()].map(p=>p.join(',')).join(' ')}"/>`;
}
export function edgeFrame(optical,frame,dent){
  const n=gridSizes[optical],m={micro:0,compact:1,display:3}[optical],w={micro:1,compact:1.5,display:2}[optical];
  const c=m+w/2,start={micro:3.5,compact:5.75,display:12}[optical],peak={micro:1.75,compact:3.75,display:8}[optical];
  const rect=(x,y,width,height)=>`<rect x="${x}" y="${y}" width="${width}" height="${height}"/>`;
  const side=(right,bent)=>{
    const mirror=x=>right?n-x:x;
    const points=(bent?[[c,m],[c,start],[peak,n/2],[c,n-start],[c,n-m]]:[[c,m],[c,n-m]]).map(([x,y])=>[mirror(x),y]);
    return strokePolygon(points,w,m,n-m);
  };
  const gap={micro:[6,10],compact:[12,20],display:[24,40]}[optical];
  let top=rect(m,m,n-2*m,w);
  if(frame!=='closed'){
    top=rect(m,m,gap[0]-m,w);
    top+=frame==='crease'?strokePolygon([[gap[1],c],[47,c],[50,6],[53,c],[n-m,c]],w,m,n-m):rect(gap[1],m,n-m-gap[1],w);
  }
  return side(false,dent==='left'||dent==='both')+side(true,dent==='right'||dent==='both')+rect(m,n-m-w,n-2*m,w)+top;
}
