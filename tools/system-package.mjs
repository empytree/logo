import { readFile,writeFile,mkdir,stat,readdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { projectRoot,verifySource } from './site-package.mjs';
import { filterPool,microPolicyRevision } from './micro-policy.mjs';
const repository='https://github.com/empytree/logo';
const hash=data=>createHash('sha256').update(data).digest('hex');
function child(root,name){if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name))throw Error('Invalid package filename');return path.join(root,name)}
export async function exportSystemPackage({development=false,commit=null,outputName=null}={}){
  if(development&&commit!==null)throw Error('Development packages cannot claim a source commit');
  if(!development)verifySource(commit);
  const pkg=JSON.parse(await readFile(path.join(projectRoot,'package.json'),'utf8'));
  if(!/^\d+\.\d+\.\d+$/.test(pkg.version))throw Error('Invalid release version');
  const version=pkg.version+(development?'-dev':'');
  const output=child(path.join(projectRoot,'dist'),outputName||`empytree-logo-${version}`);
  try{await stat(output);throw Error('Package directory already exists')}catch(error){if(error.code!=='ENOENT')throw error}
  const source=path.join(projectRoot,'public/brand/v2');
  const manifest=JSON.parse(await readFile(path.join(source,'variants.json'),'utf8'));
  const variants=filterPool(manifest.catalog,{frames:['open','closed']});
  const defaultPool=filterPool(manifest.catalog).map(v=>v.id);
  if(!defaultPool.length||!defaultPool.includes(manifest.default)||manifest.microPolicyRevision!==microPolicyRevision)throw Error('Rebuild the optical catalog first');
  const payload=new Map();
  for(const variant of variants)payload.set(`${variant.id}.ico`,await readFile(child(source,`${variant.id}.ico`)));
  payload.set('favicon.ico',await readFile(child(source,`${manifest.default}.ico`)));
  for(const name of ['favicon-96.png','apple-touch-icon.png'])payload.set(name,await readFile(path.join(projectRoot,'public/brand/v1',name)));
  payload.set('random-favicon.js',await readFile(path.join(source,'random-favicon.js')));
  payload.set('variants.json',Buffer.from(JSON.stringify({schemaVersion:2,construction:manifest.construction,microPolicyRevision,default:manifest.default,defaultPool,variants:variants.map(({id,eyes,mouth,frame,dent})=>({id,eyes,mouth,frame,dent,ico:`${id}.ico`}))},null,2)+'\n'));
  const assetBase=`/brand/empytree/v${version}/`;
  const resourceDir=path.join(output,'public','brand','empytree',`v${version}`);
  await mkdir(resourceDir,{recursive:true});
  for(const [name,data] of payload)await writeFile(child(resourceDir,name),data);
  const provenance={schemaVersion:2,package:'@empytree/logo',version,mode:development?'development':'release',sourceRepository:repository,sourceCommit:commit?commit.toLowerCase():null,assetBase,construction:manifest.construction,microPolicyRevision,poolSize:defaultPool.length,availableChoices:variants.length,files:Object.fromEntries([...payload].sort(([a],[b])=>a.localeCompare(b)).map(([name,data])=>[name,hash(data)]))};
  await writeFile(path.join(resourceDir,'logo-source.json'),JSON.stringify(provenance,null,2)+'\n');
  await writeFile(path.join(output,'head.html'),`<link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48" href="${assetBase}favicon.ico" data-empytree-favicon>\n<link rel="apple-touch-icon" sizes="180x180" href="${assetBase}apple-touch-icon.png">\n<script defer src="${assetBase}random-favicon.js"></script>\n`);
  await verifySystemPackage(resourceDir,{requireRelease:!development});
  return {output,resourceDir,provenance};
}
export async function verifySystemPackage(resourceDir,{requireRelease=true}={}){
  const source=JSON.parse(await readFile(path.join(resourceDir,'logo-source.json'),'utf8'));
  if(source.schemaVersion!==2||source.sourceRepository!==repository||source.microPolicyRevision!==microPolicyRevision)throw Error('Unexpected package source or policy');
  if(requireRelease&&(source.mode!=='release'||!/^[0-9a-f]{40}$/.test(source.sourceCommit||'')))throw Error('A pinned release package is required');
  if(source.mode==='development'&&source.sourceCommit!==null)throw Error('False development provenance');
  if(!source.files||Object.keys(source.files).length!==source.availableChoices+5)throw Error('Incomplete inventory');
  if((await readdir(resourceDir)).sort().join('|')!==[...Object.keys(source.files),'logo-source.json'].sort().join('|'))throw Error('Unexpected package file');
  for(const [name,expected] of Object.entries(source.files))if(hash(await readFile(child(resourceDir,name)))!==expected)throw Error(`Checksum mismatch: ${name}`);
  const manifest=JSON.parse(await readFile(path.join(resourceDir,'variants.json'),'utf8'));
  const ids=manifest.variants.map(v=>v.id);
  if(new Set(ids).size!==ids.length||ids.length!==source.availableChoices||manifest.defaultPool.length!==source.poolSize||!manifest.defaultPool.includes(manifest.default)||manifest.defaultPool.some(id=>!ids.includes(id))||manifest.variants.some(v=>!source.files[v.ico]||v.ico!==`${v.id}.ico`||!['open','closed'].includes(v.frame)))throw Error('Unexpected manifest choices');
  if(JSON.stringify(manifest.construction)!==JSON.stringify(source.construction)||manifest.microPolicyRevision!==source.microPolicyRevision)throw Error('Metadata mismatch');
  return source;
}
