/* Generated from the size-specific allowlist. No fetch, timer or runtime drawing. */
(function () {
  'use strict';
  var script = document.currentScript;
  var link = document.querySelector('link[data-empytree-favicon]');
  if (!script || !link || script.dataset.enabled === 'false') return;
  var candidates = [{"id":"arrows--flat--open--none","eyes":"arrows","mouth":"flat","dent":"none","frame":"open"},{"id":"arrows--flat--closed--none","eyes":"arrows","mouth":"flat","dent":"none","frame":"closed"},{"id":"arrows--corner-left--open--none","eyes":"arrows","mouth":"corner-left","dent":"none","frame":"open"},{"id":"arrows--corner-left--closed--none","eyes":"arrows","mouth":"corner-left","dent":"none","frame":"closed"},{"id":"arrows--corner-right--open--none","eyes":"arrows","mouth":"corner-right","dent":"none","frame":"open"},{"id":"arrows--corner-right--closed--none","eyes":"arrows","mouth":"corner-right","dent":"none","frame":"closed"},{"id":"arrows--down--open--none","eyes":"arrows","mouth":"down","dent":"none","frame":"open"},{"id":"arrows--down--closed--none","eyes":"arrows","mouth":"down","dent":"none","frame":"closed"},{"id":"arrows--rest2--open--none","eyes":"arrows","mouth":"rest2","dent":"none","frame":"open"},{"id":"arrows--rest2--closed--none","eyes":"arrows","mouth":"rest2","dent":"none","frame":"closed"},{"id":"beam--flat--open--none","eyes":"beam","mouth":"flat","dent":"none","frame":"open"},{"id":"beam--flat--closed--none","eyes":"beam","mouth":"flat","dent":"none","frame":"closed"},{"id":"beam--corner-left--open--none","eyes":"beam","mouth":"corner-left","dent":"none","frame":"open"},{"id":"beam--corner-left--closed--none","eyes":"beam","mouth":"corner-left","dent":"none","frame":"closed"},{"id":"beam--corner-right--open--none","eyes":"beam","mouth":"corner-right","dent":"none","frame":"open"},{"id":"beam--corner-right--closed--none","eyes":"beam","mouth":"corner-right","dent":"none","frame":"closed"},{"id":"beam--down--open--none","eyes":"beam","mouth":"down","dent":"none","frame":"open"},{"id":"beam--down--closed--none","eyes":"beam","mouth":"down","dent":"none","frame":"closed"},{"id":"beam--rest2--open--none","eyes":"beam","mouth":"rest2","dent":"none","frame":"open"},{"id":"beam--rest2--closed--none","eyes":"beam","mouth":"rest2","dent":"none","frame":"closed"},{"id":"separate--flat--open--none","eyes":"separate","mouth":"flat","dent":"none","frame":"open"},{"id":"separate--flat--closed--none","eyes":"separate","mouth":"flat","dent":"none","frame":"closed"},{"id":"separate--corner-left--open--none","eyes":"separate","mouth":"corner-left","dent":"none","frame":"open"},{"id":"separate--corner-left--closed--none","eyes":"separate","mouth":"corner-left","dent":"none","frame":"closed"},{"id":"separate--corner-right--open--none","eyes":"separate","mouth":"corner-right","dent":"none","frame":"open"},{"id":"separate--corner-right--closed--none","eyes":"separate","mouth":"corner-right","dent":"none","frame":"closed"},{"id":"separate--down--open--none","eyes":"separate","mouth":"down","dent":"none","frame":"open"},{"id":"separate--down--closed--none","eyes":"separate","mouth":"down","dent":"none","frame":"closed"},{"id":"separate--rest2--open--none","eyes":"separate","mouth":"rest2","dent":"none","frame":"open"},{"id":"separate--rest2--closed--none","eyes":"separate","mouth":"rest2","dent":"none","frame":"closed"},{"id":"mixed--flat--open--none","eyes":"mixed","mouth":"flat","dent":"none","frame":"open"},{"id":"mixed--flat--closed--none","eyes":"mixed","mouth":"flat","dent":"none","frame":"closed"},{"id":"mixed--corner-left--open--none","eyes":"mixed","mouth":"corner-left","dent":"none","frame":"open"},{"id":"mixed--corner-left--closed--none","eyes":"mixed","mouth":"corner-left","dent":"none","frame":"closed"},{"id":"mixed--corner-right--open--none","eyes":"mixed","mouth":"corner-right","dent":"none","frame":"open"},{"id":"mixed--corner-right--closed--none","eyes":"mixed","mouth":"corner-right","dent":"none","frame":"closed"},{"id":"mixed--down--open--none","eyes":"mixed","mouth":"down","dent":"none","frame":"open"},{"id":"mixed--down--closed--none","eyes":"mixed","mouth":"down","dent":"none","frame":"closed"},{"id":"mixed--rest2--open--none","eyes":"mixed","mouth":"rest2","dent":"none","frame":"open"},{"id":"mixed--rest2--closed--none","eyes":"mixed","mouth":"rest2","dent":"none","frame":"closed"}];
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
