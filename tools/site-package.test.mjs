import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { exportSitePackage,verifySitePackage,projectRoot } from './site-package.mjs';
test('development export limits the pool, preserves provenance and detects corruption',async()=>{
  const name=`test-site-${process.pid}-${Date.now()}`;
  const result=await exportSitePackage({development:true,outputName:name});
  try{
    assert.equal(result.provenance.sourceCommit,null);assert.equal(result.provenance.poolSize,24);
    const pkg=JSON.parse(await readFile(path.join(projectRoot,'package.json'),'utf8'));
    assert.equal(result.provenance.assetBase,`/brand/empytree/v${pkg.version}-dev/`);
    const head=await readFile(path.join(result.output,'head.html'),'utf8');
    assert.ok(head.includes(result.provenance.assetBase+'random-favicon.js'));
    await verifySitePackage(result.resourceDir,{requireRelease:false});
    await assert.rejects(()=>verifySitePackage(result.resourceDir),/pinned release/);
    await assert.rejects(()=>exportSitePackage({development:true,outputName:name}),/already exists/);
    await writeFile(path.join(result.resourceDir,'flat-open.ico'),'corrupted');
    await assert.rejects(()=>verifySitePackage(result.resourceDir,{requireRelease:false}),/Checksum mismatch/);
  }finally{
    const expectedParent=path.resolve(projectRoot,'dist');
    const target=path.resolve(result.output);
    assert.equal(path.dirname(target),expectedParent);assert.ok(path.basename(target).startsWith('test-site-'));
    await rm(target,{recursive:true,force:true});
  }
});
test('export rejects unpinned releases, false development provenance and path escapes',async()=>{
  await assert.rejects(()=>exportSitePackage(),/full source commit/);
  await assert.rejects(()=>exportSitePackage({development:true,commit:'a'.repeat(40)}),/must not claim/);
  await assert.rejects(()=>exportSitePackage({development:true,outputName:'../outside'}),/Invalid package filename/);
});
