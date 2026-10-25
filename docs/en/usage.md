# Website integration

[README](../../README.md) · [Construction](logo-system.md) · [Generator](generator.md) · [Deployed 0.3.1](../adoptions/0.3.1.md)

Version **0.3.1** is deployed on [empytree.com](http://empytree.com/): 288 favicon choices and independently selected compact home-link marks on the jugbeat page. The deployed public source is [bb58e057dcd8e4fdb12aedf9725f26e4080c92b9](https://github.com/empytree/logo/commit/bb58e057dcd8e4fdb12aedf9725f26e4080c92b9). Documentation-only commits do not replace that provenance or require a new website package.

## Current source 0.3.1

The new package adds transparent backgrounds and recommended light/dark line colors, full-canvas marks and ten resolutions per ICO. See [complete theme/density rules](themes-and-density.md). The transparent 0.3.1 package is deployed and publicly verified. Overview-only changes do not require a new export or rollout.

Build with Node.js 24: `npm ci`, then `npm run verify`. Preview with `npm run export:site -- --development`; it has a `-dev` URL and null commit. A release requires the owner's clean committed checkout:

```sh
npm run export:site -- --commit FULL_40_CHARACTER_HEAD_SHA
```

The exporter checks root/HEAD/clean state and refuses overwrite. Copy only `public/` into the consumer. Schema 5 contains 576 paired ICOs, 576 paired compact SVGs and six other hashed resources, plus provenance: 1159 files total. Each ICO contains 16/20/24/32/40/48/64/96/128/256px, with optics selected by physical resolution. Keep all layers and `logo-source.json`; do not overwrite earlier versioned URLs.

## Favicon

```html
<link rel="icon" type="image/x-icon"
      sizes="16x16 20x20 24x24 32x32 40x40 48x48 64x64 96x96 128x128 256x256"
      href="/brand/empytree/v0.3.1/favicon.ico" data-empytree-favicon>
<link rel="apple-touch-icon" sizes="180x180"
      href="/brand/empytree/v0.3.1/apple-touch-icon.png">
<script defer src="/brand/empytree/v0.3.1/random-favicon.js"
        data-frames="open,closed"></script>
```

The generic default is 144 open choices; explicitly enabling both frames gives 288. Supported `data-eyes`, `data-mouths`, `data-dents` restrictions preserve the fixed fallback for unknown/empty groups. Run one selector per document. A validated sessionStorage Fisher–Yates bag visits all requested faces before repeating and avoids immediate cycle-boundary repetition; blocked storage removes cross-load guarantees.

The face is selected once per load. `matchMedia` selects its paired palette and `change` updates that palette without consuming the bag. Missing API uses light. No manifest fetch, runtime drawing, polling or timer is needed. Omit the selector for explicit no-JS. Disabled JavaScript retains the fixed light canonical ICO, also with ten layers. Apple icon remains stable. The supplied 96px PNG is not automatically selected by this snippet; search-engine icon selection is not guaranteed.

## Breadcrumb home mark

On the server choose an ID from `markPool`. For the existing dark header use that variant's `svgDark`; use `svg` for a known light placement. Both are transparent, with recommended default line colors. Creative placement may explicitly override the line color after checking the actual background. Resolve only manifest-listed files in the pinned directory; accept no user SVG or path.

Give the home link an accessible name, mark its nested SVG `aria-hidden="true" focusable="false"`, reserve its dimensions and provide visible focus. Existing marks are about 32–40 CSS px with a minimum 44px target. Selection is independent of the favicon and works without JavaScript. Server random selection may repeat; no timer changes either mark. SVG itself remains vector at high display density.

## Verification and adoption

`node tools/verify-site.mjs PATH_TO_RESOURCE_DIRECTORY` checks a pinned release. For preview only add `--allow-development`. Verify checksums, both palettes, ICO dimensions, all independent heads, no-JS, the 404 page and breadcrumb accessibility. Preserve historical text encodings. Test actual browser theme changes and dense displays where available; automated layer checks do not claim access to Apple hardware.

Hashes detect accidental modification; they are not signatures. Record the full public source SHA, version, public scope and observable results only after rollout. Keep private consumer code/history/infrastructure outside this repository. Older 0.1.0, 0.2.1 and 0.3.0 URLs/adoption records remain historical; `export:legacy` is not the current recipe.
