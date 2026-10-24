import { exportSitePackage } from './site-package.mjs';
const args=process.argv.slice(2);let development=false,commit=null,outputName=null;
for(let i=0;i<args.length;i++){
  if(args[i]==='--development')development=true;
  else if(args[i]==='--commit')commit=args[++i];
  else if(args[i]==='--output-name')outputName=args[++i];
  else throw Error('Usage: node tools/export-site.mjs [--development | --commit FULL_SHA] [--output-name NAME]');
}
const result=await exportSitePackage({development,commit,outputName});
console.log(JSON.stringify({output:result.output,version:result.provenance.version,mode:result.provenance.mode,poolSize:result.provenance.poolSize,sourceCommit:result.provenance.sourceCommit}));
