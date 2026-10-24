import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { identityConfig } from './identity-config.mjs';

export const projectRoot=fileURLToPath(new URL('../',import.meta.url));
const sha256=buffer=>createHash('sha256').update(buffer).digest('hex');
const repository='https://github.com/empytree/logo';
function git(args){
  const result=spawnSync('git',['-C',projectRoot,...args],{encoding:'utf8',windowsHide:true});
  if(result.status!==0)throw Error('Release export needs a real Git checkout with an existing commit.');
  return result.stdout.trim();
}
export function verifySource(commit){
  if(!/^[0-9a-f]{40}$/i.test(commit||''))throw Error('A full source commit is required for a release export.');
  const checkout=path.resolve(git(['rev-parse','--show-toplevel']));
  const expected=path.resolve(projectRoot);
  if((process.platform==='win32'?checkout.toLowerCase():checkout)!==(process.platform==='win32'?expected.toLowerCase():expected))throw Error('The project must be the repository root.');
  if(git(['rev-parse','HEAD']).toLowerCase()!==commit.toLowerCase())throw Error('Source commit does not match HEAD.');
  if(git(['status','--porcelain','--untracked-files=normal']))throw Error('Commit or discard source changes before release export.');
}
function child(root,name){
  if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name))throw Error('Invalid package filename.');
  return path.join(root,name);
}

export async function exportSitePackage({development=false,commit=null,outputName=null}={}){
  const pkg=JSON.parse(await readFile(path.join(projectRoot,'package.json'),'utf8'));
  if(!/^\d+\.\d+\.\d+$/.test(pkg.version))throw Error('A numeric release version is required.');
  if(!development)verifySource(commit);
  else if(commit!==null)throw Error('Development packages must not claim a source commit.');
  const version=pkg.version+(development?'-dev':'');
  const distRoot=path.join(projectRoot,'dist');
  const output=child(distRoot,outputName||`empytree-logo-${version}`);
  // Do not silently overwrite a package of an existing version.
  try{await stat(output);throw Error('Package directory already exists; choose a new output name or version.')}catch(error){if(error.code!=='ENOENT')throw error}
  const source=path.join(projectRoot,'public/brand/v1');
  const manifest=JSON.parse(await readFile(path.join(source,'variants.json'),'utf8'));
  if(JSON.stringify(manifest.construction)!==JSON.stringify(identityConfig))throw Error('Rebuild resources before exporting.');
  const variants=manifest.variants.filter(v=>manifest.defaultPool.includes(v.id));
  if(variants.length!==24||variants.some(v=>v.frame!=='open')||new Set(variants.map(v=>v.id)).size!==24)throw Error('The first website package requires 24 unique open-frame choices.');
  for(const variant of variants)if(!/^[a-z-]+$/.test(variant.id)||variant.ico!==variant.id+'.ico')throw Error('Invalid variant reference.');
  const assetBase=`/brand/empytree/v${version}/`;
  const resourceDir=path.join(output,'public','brand','empytree',`v${version}`);
  const payload=new Map();
  for(const name of ['favicon.ico','favicon-96.png','apple-touch-icon.png','random-favicon.js',...variants.map(v=>v.ico)])payload.set(name,await readFile(child(source,name)));
  // Do not advertise large or adaptive assets that this limited package omits.
  payload.set('variants.json',Buffer.from(JSON.stringify({version:manifest.version,construction:manifest.construction,default:manifest.default,defaultPool:manifest.defaultPool,variants:variants.map(({id,mouth,frame,dent,label,ico})=>({id,mouth,frame,dent,label,ico}))},null,2)+'\n'));
  await mkdir(resourceDir,{recursive:true});
  for(const [name,buffer] of payload)await writeFile(child(resourceDir,name),buffer);
  const provenance={schemaVersion:1,package:'@empytree/logo',version,mode:development?'development':'release',sourceRepository:repository,sourceCommit:commit?commit.toLowerCase():null,assetBase,construction:identityConfig,poolSize:24,files:Object.fromEntries([...payload].sort(([a],[b])=>a.localeCompare(b)).map(([name,buffer])=>[name,sha256(buffer)]))};
  await writeFile(path.join(resourceDir,'logo-source.json'),JSON.stringify(provenance,null,2)+'\n');
  const head=`<link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48" href="${assetBase}favicon.ico" data-empytree-favicon>\n<link rel="apple-touch-icon" sizes="180x180" href="${assetBase}apple-touch-icon.png">\n<script defer src="${assetBase}random-favicon.js"></script>\n`;
  await writeFile(path.join(output,'head.html'),head);
  await writeFile(path.join(output,'README.txt'),`empytree logo ${version}\nMode: ${provenance.mode}\nSource: ${repository}\nCommit: ${provenance.sourceCommit||'none — development preview; not a release'}\n\nCopy public/ contents to the consumer public directory. Replace the temporary icon link using head.html. Omit the selector script in an explicit no-JS mode. Never claim a development package as a released adoption. Keep logo-source.json with the resources.\n\nThe package is for the owner's personal identity. Publication and GitHub forks do not establish a separate license to adopt the mark as another brand. See the source repository's rights documentation.\n`);
  await verifySitePackage(resourceDir,{requireRelease:!development});
  return {output,resourceDir,provenance};
}

export async function verifySitePackage(resourceDir,{requireRelease=true}={}){
  const provenance=JSON.parse(await readFile(path.join(resourceDir,'logo-source.json'),'utf8'));
  if(provenance.sourceRepository!==repository||provenance.poolSize!==24)throw Error('Unknown source or unexpected website pool.');
  if(requireRelease&&(provenance.mode!=='release'||!/^[0-9a-f]{40}$/.test(provenance.sourceCommit||'')))throw Error('A pinned release package is required.');
  if(!provenance.files||Object.keys(provenance.files).length!==29)throw Error('Incomplete package inventory.');
  for(const [name,expected] of Object.entries(provenance.files))if(sha256(await readFile(child(resourceDir,name)))!==expected)throw Error(`Checksum mismatch: ${name}`);
  const manifest=JSON.parse(await readFile(path.join(resourceDir,'variants.json'),'utf8'));
  if(manifest.defaultPool.length!==24||manifest.variants.length!==24||manifest.variants.some(v=>v.frame!=='open'))throw Error('Unexpected manifest pool.');
  if(JSON.stringify(manifest.construction)!==JSON.stringify(provenance.construction))throw Error('Construction metadata mismatch.');
  return provenance;
}
