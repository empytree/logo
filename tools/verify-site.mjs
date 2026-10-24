import { verifySitePackage } from './site-package.mjs';
const [directory,...args]=process.argv.slice(2);
if(!directory||args.some(a=>a!=='--allow-development'))throw Error('Usage: node tools/verify-site.mjs RESOURCE_DIRECTORY [--allow-development]');
const result=await verifySitePackage(directory,{requireRelease:!args.includes('--allow-development')});
console.log(JSON.stringify({verified:true,version:result.version,sourceCommit:result.sourceCommit,poolSize:result.poolSize}));
