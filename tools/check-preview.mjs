// Logic smoke check for the conversation comparison. This is not a browser render.
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html = await readFile(process.argv[2], 'utf8');
assert.ok(Buffer.byteLength(html) < 1000000);
assert.doesNotMatch(html, /__EMPYTREE_ASSETS__|<!doctype|<html|<head|<body/i);
const created = [];
function element() {
  const el = { style: {}, attrs: {}, children: [], listeners: {}, setAttribute(k, v) { this.attrs[k] = v; }, appendChild(x) {this.children.push(x)}, append(...x) {this.children.push(...x)}, replaceChildren() {this.children = []}, addEventListener(k, fn) {this.listeners[k] = fn} };
  created.push(el); return el;
}
const selects = {};
for (const [, field, body] of html.matchAll(/<select[^>]*data-choice="([^"]+)"[^>]*>([\s\S]*?)<\/select>/g)) {
  const el = element(); el.dataset = { choice: field };
  el.options = Array.from(body.matchAll(/<option value="([^"]+)">([^<]*)<\/option>/g)).map(([, value, text]) => ({value, text}));
  el.value = el.options[0].value;
  Object.defineProperty(el, 'selectedOptions', {get: () => el.options.filter(o => o.value === el.value)});
  selects[field] = el;
}
const hero = element(), sizes = element(), caption = element(), random = element();
const queries = { '[data-hero]':hero, '[data-sizes]':sizes, '[data-caption]':caption, '[data-random]':random };
const root = {querySelectorAll: () => Object.values(selects), querySelector: s => {assert.ok(queries[s], s); return queries[s]}};
const code = html.match(/<script>([\s\S]*?)<\/script>/)[1];
let saved;
const context = { document: {getElementById: id => {assert.equal(id, 'empytree-quiet-box'); return root}, createElement: element}, window: {addEventListener() {}, openai: {setWidgetState(value) {saved = value; return Promise.resolve()}}}, Math };
vm.runInNewContext(code, context);
let count = 0;
for (const mouth of selects.mouth.options) for (const frame of selects.frame.options) for (const dent of selects.dent.options) {
  for (const [field, option] of Object.entries({mouth, frame, dent})) {selects[field].value = option.value; selects[field].listeners.change()}
  assert.equal(sizes.children.length, 6);
  assert.match(hero.style.maskImage, /^url\("data:image\/svg\+xml;base64,/);
  assert.ok(hero.attrs['aria-label'].includes(dent.text)); count++;
}
const previous = hero.style.maskImage;
random.listeners.click(); assert.notEqual(hero.style.maskImage, previous);
assert.ok(saved.modelContent.mouth && saved.modelContent.dent);
for (const el of created) for (const value of Object.values(el.style)) assert.ok(!String(value).includes('undefined'));
console.log(`Preview logic: ${count} combinations and random selection passed; 6 real-size marks per choice.`);
