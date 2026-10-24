/* Generated from the size-specific allowlist. No fetch, timer or runtime drawing. */
(function () {
  'use strict';
  var script = document.currentScript;
  var link = document.querySelector('link[data-empytree-favicon]');
  if (!script || !link || script.dataset.enabled === 'false') return;
  var candidates = __CANDIDATES__;
  function requested(value, actual) {
    return !value || value.split(',').map(function (x) { return x.trim(); }).indexOf(actual) >= 0;
  }
  var pool = candidates.filter(function (v) {
    return requested(script.dataset.eyes, v.eyes) && requested(script.dataset.mouths, v.mouth)
      && requested(script.dataset.dents, v.dent) && requested(script.dataset.frames || 'open', v.frame);
  }).map(function (v) { return v.id; });
  // An empty requested group keeps the fixed fallback. Do not substitute another face.
  if (!pool.length) return;
  var key = 'empytree.identity.v2';
  var signature = pool.join(',');
  var state = null;
  try { var raw = sessionStorage.getItem(key); if (raw && raw.length < 32768) state = JSON.parse(raw); } catch (_) {}
  var valid = state && state.pool === signature && pool.indexOf(state.last) >= 0
    && Array.isArray(state.deck) && state.deck.length < pool.length
    && state.deck.every(function (id, i) { return pool.indexOf(id) >= 0 && state.deck.indexOf(id) === i && id !== state.last; });
  var last = valid ? state.last : null;
  var deck = valid ? state.deck : [];
  if (!deck.length) {
    deck = pool.slice();
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = deck[i]; deck[i] = deck[j]; deck[j] = swap;
    }
    if (deck.length > 1 && deck[deck.length - 1] === last) {
      var first = deck[0]; deck[0] = deck[deck.length - 1]; deck[deck.length - 1] = first;
    }
  }
  var selected = deck.pop();
  try { sessionStorage.setItem(key, JSON.stringify({pool: signature, deck: deck, last: selected})); } catch (_) {}
  link.href = new URL(selected + '.ico', script.src).href;
  link.dataset.expression = selected;
})();
