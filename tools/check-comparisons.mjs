// Interaction smoke check; pixel sheets are inspected separately.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const directory=process.argv[2];
function makeElement(){return {style:{},children:[],attrs:{},listeners:{},append(...els){this.children.push(...els)},appendChild(el){this.children.push(el)},replaceChildren(){this.children=[]},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this.listeners[k]=fn}}}
for(const [file,id] of [['quiet-box-dents.html','empytree-dent-comparison'],['quiet-box-joints.html','empytree-joint-comparison']]){
  const html=await readFile(path.join(directory,file),'utf8');assert.ok(Buffer.byteLength(html)<1000000);assert.doesNotMatch(html,/__[A-Z_]+__|<!doctype|<html|<head|<body/i);
  const elements=[];const element=()=>{const el=makeElement();elements.push(el);return el};const selects={};
  for(const [,field,body] of html.matchAll(/<select[^>]*data-choice="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)){
    const el=element();el.dataset={choice:field};el.options=Array.from(body.matchAll(/<option value="([^"]+)">([^<]*)<\/option>/g)).map(([,value,text])=>({value,text}));el.value=el.options[0].value;
    Object.defineProperty(el,'selectedOptions',{get:()=>el.options.filter(o=>o.value===el.value)});selects[field]=el;
  }
  const grid=element(),status=element();const root={querySelectorAll:()=>Object.values(selects),querySelector:selector=>selector==='[data-grid]'?grid:selector==='[data-status]'?status:selector==='[data-choice]'?Object.values(selects)[0]:null};
  let saved;const context={document:{getElementById:key=>{assert.equal(key,id);return root},createElement:element},window:{addEventListener(){},openai:{setWidgetState(value){saved=value;return Promise.resolve()}}}};
  vm.runInNewContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],context);
  let count=0;
  function visit(fields,i){if(i===fields.length){count++;assert.equal(grid.children.length,file.includes('dents')?3:2);return}const [field,el]=fields[i];for(const option of el.options){el.value=option.value;el.listeners.change();visit(fields,i+1)}}
  visit(Object.entries(selects),0);assert.ok(saved.modelContent.comparison);
  for(const el of elements)for(const value of Object.values(el.style))assert.ok(!String(value).includes('undefined'));
  console.log(`${file}: ${count} comparison states passed.`);
}
