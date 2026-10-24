import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { mark, mouths, dents } from './geometry.mjs';
const data={mouths,dents,marks:{}};
for(const mouth of mouths)for(const dent of dents)for(const frame of ['open','closed'])for(const optical of ['display','compact','micro'])data.marks[[mouth,dent,frame,optical].join(':')]=mark({mouth,dent,frame,optical});
const template=await readFile(new URL('gallery-template.html',import.meta.url),'utf8');
await mkdir(new URL('../examples/',import.meta.url),{recursive:true});
await writeFile(new URL('../examples/index.html',import.meta.url),template.replace('__GALLERY_DATA__',JSON.stringify(data)));
console.log('Built standalone, offline gallery.');
