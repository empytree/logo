import { renderMark } from './system.mjs';
import { icoSizes,opticalForSize } from './presentation.mjs';
export function rasterSvg(variant,size,theme='light'){
  return renderMark({...variant,optical:opticalForSize(size),theme}).replace(/width="\d+" height="\d+"/,`width="${size}" height="${size}"`);
}
export function packIco(layers){
  if(layers.length!==icoSizes.length)throw Error('Incomplete favicon resolution set');
  const header=Buffer.alloc(6+layers.length*16);header.writeUInt16LE(1,2);header.writeUInt16LE(layers.length,4);
  let offset=header.length;
  layers.forEach((buffer,index)=>{const size=icoSizes[index],p=6+index*16;header[p]=size===256?0:size;header[p+1]=header[p];header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(buffer.length,p+8);header.writeUInt32LE(offset,p+12);offset+=buffer.length});
  return Buffer.concat([header,...layers]);
}
export function unpackIco(buffer){
  if(buffer.readUInt16LE(0)!==0||buffer.readUInt16LE(2)!==1)throw Error('Invalid ICO header');
  const count=buffer.readUInt16LE(4),result=[];let next=6+count*16;
  if(count!==icoSizes.length)throw Error('Incomplete ICO layers');
  for(let i=0;i<count;i++){
    const p=6+i*16,size=buffer[p]||256,length=buffer.readUInt32LE(p+8),offset=buffer.readUInt32LE(p+12);
    if(size!==icoSizes[i]||(buffer[p+1]||256)!==size||offset!==next||offset+length>buffer.length)throw Error('Invalid ICO directory');
    const png=buffer.subarray(offset,offset+length);
    if(png.toString('hex',0,8)!=='89504e470d0a1a0a'||png.readUInt32BE(16)!==size||png.readUInt32BE(20)!==size)throw Error('Invalid ICO PNG dimensions');
    result.push({size,png});next+=length;
  }
  if(next!==buffer.length)throw Error('Unexpected ICO data');
  return result;
}
