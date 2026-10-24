/* empytree identity v1: one expression per page load; no timers or API calls. */
(function () {
  'use strict';
  var script = document.currentScript;
  var link = document.querySelector('link[data-empytree-favicon]');
  if (!script || !link || script.dataset.enabled === 'false') return;
  var knownMouths = ['flat', 'rise', 'fall', 'corner-left', 'corner-right', 'down'];
  var knownFrames = ['open', 'closed'];
  var knownDents = ['none', 'left', 'right', 'both'];
  function choices(input, allowed, fallback) {
    var values = (input || '').split(',').map(function (x) { return x.trim(); });
    return allowed.filter(function (x) { return values.indexOf(x) >= 0; }).length
      ? allowed.filter(function (x) { return values.indexOf(x) >= 0; }) : fallback;
  }
  var mouths = choices(script.dataset.mouths, knownMouths, knownMouths);
  var frames = choices(script.dataset.frames, knownFrames, ['open']);
  var dents = choices(script.dataset.dents, knownDents, knownDents);
  var pool = [];
  frames.forEach(function (f) { mouths.forEach(function (m) { dents.forEach(function (d) { pool.push(m + '-' + f + (d === 'none' ? '' : '-dent-' + d)); }); }); });
  var key = 'empytree.identity.v1';
  var signature = pool.join(',');
  var state = null;
  try {
    var stored = sessionStorage.getItem(key);
    if (stored && stored.length < 4096) state = JSON.parse(stored);
  } catch (_) { /* Storage disabled: the current page can still choose a face. */ }
  var valid = state && state.pool === signature && pool.indexOf(state.last) >= 0
    && Array.isArray(state.deck) && state.deck.length < pool.length
    && state.deck.every(function (id, i) { return pool.indexOf(id) >= 0 && state.deck.indexOf(id) === i && id !== state.last; });
  var last = valid ? state.last : null;
  var deck = valid ? state.deck : [];
  if (!deck.length) {
    deck = pool.slice();
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = deck[i]; deck[i] = deck[j]; deck[j] = temp;
    }
    if (deck.length > 1 && deck[deck.length - 1] === last) {
      var first = deck[0]; deck[0] = deck[deck.length - 1]; deck[deck.length - 1] = first;
    }
  }
  var selected = deck.pop();
  try { sessionStorage.setItem(key, JSON.stringify({ pool: signature, deck: deck, last: selected })); } catch (_) {}
  // Resolve beside this script, so the component also works under a subdirectory.
  link.href = new URL(selected + '.ico', script.src).href;
  link.dataset.expression = selected;
})();
