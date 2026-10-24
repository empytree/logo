import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
test('standalone gallery has complete optical data and no host or network dependency',async()=>{
  const html=await readFile(new URL('../examples/index.html',import.meta.url),'utf8');
  assert.ok(html.startsWith('<!doctype html>'));assert.ok(!html.includes('__GALLERY_DATA__'));
  const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];new vm.Script(script);
  const data=JSON.parse(script.match(/const data=(.+);\r?\n/)[1]);
  assert.equal(data.mouths.length,6);assert.equal(data.dents.length,4);assert.equal(Object.keys(data.marks).length,144);
  for(const mouth of data.mouths)for(const dent of data.dents)for(const frame of ['open','closed'])for(const optical of ['display','compact','micro'])assert.match(data.marks[[mouth,dent,frame,optical].join(':')],/^<svg /);
  for(const [,id] of script.matchAll(/getElementById\('([^']+)'\)/g))assert.ok(html.includes(`id="${id}"`),id);
  assert.doesNotMatch(script,/window\.openai|fetch\(|XMLHttpRequest|WebSocket/);
});
