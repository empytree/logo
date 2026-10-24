# Website integration

[README](../../README.md) · [Construction](logo-system.md) · [Generator](generator.md) · [Deployed 0.2.1](../adoptions/0.2.1.md)

Version **0.2.1** is deployed on [empytree.com](http://empytree.com/): 288 favicon choices and independently selected compact home-link marks on the jugbeat page. The deployed public source is [9145a47a0d1f5cfb998848d2e6646a66fdaf300f](https://github.com/empytree/logo/commit/9145a47a0d1f5cfb998848d2e6646a66fdaf300f). Documentation-only commits do not replace that provenance or require a new website package.

## Build and inspect

With Node.js 24:

```sh
npm ci
npm run verify
```

This rebuilds the historical catalog, current musical catalog, offline examples and current visual sheets, then checks documentation and behavior. Sharp is a build dependency. Consumers need only static resources and their integration code. `examples/generator.html` is the current offline example; `examples/index.html` is explicitly the first edition.

## Export a versioned package

Use a clean checkout and its full source commit:

```sh
npm run export:site -- --commit FULL_40_CHARACTER_HEAD_SHA
```

The exporter checks repository root, HEAD and clean status and refuses to overwrite an output directory. Reproducing the deployed version means using its recorded source commit. Changes to runtime geometry or selection require a new version; do not overwrite files at a previously deployed versioned URL.

The 0.2.1 package directory is `dist/empytree-logo-0.2.1/`. Its `public/brand/empytree/v0.2.1/` contains 288 ICO variants, 288 compact SVGs, the canonical favicon, stable Apple icon, 96 px PNG, selector, manifest and `logo-source.json`. There are 581 SHA-256 inventory entries plus provenance. Manifest/provenance schema 3 includes `markPool`, `compactMarks` and each variant's compact `svg` filename.

For an uncommitted local preview:

```sh
npm run export:site -- --development
```

This creates a `-dev` version with null source commit. It is not a release or an adoption record. `--output-name` gives a different local directory if one already exists.

## Favicon

Copy the package's `public/` contents into the consumer's public directory. For the full website pool use:

```html
<link rel="icon" type="image/x-icon" sizes="16x16 32x32 48x48"
      href="/brand/empytree/v0.2.1/favicon.ico" data-empytree-favicon>
<link rel="apple-touch-icon" sizes="180x180"
      href="/brand/empytree/v0.2.1/apple-touch-icon.png">
<script defer src="/brand/empytree/v0.2.1/random-favicon.js"
        data-frames="open,closed"></script>
```

The generic default without `data-frames` is 144 open choices. The snippet explicitly enables both frames, 288 choices. `data-eyes`, `data-mouths` and `data-dents` can restrict the supported pool; an empty/unknown group keeps the fixed fallback. Only one selector should run per document.

The selector validates and restores a compatible sessionStorage shuffle bag, creates a Fisher–Yates bag as needed, takes one choice and saves the remainder. Every choice is visited once per cycle; the boundary avoids an immediate repeat. Pool changes invalidate old storage. Without storage, selection works without the cross-load guarantee. It runs once per document load, with no timer, API, manifest fetch or runtime drawing. ICO layers all use micro geometry at 1×/2×/3×.

In an explicit no-JS mode omit the selector even if the browser supports JavaScript. The canonical favicon and Apple icon remain. A browser with JavaScript disabled also keeps the fallback. The prepared 96 px PNG is not selected by this snippet; search-engine favicon selection is not guaranteed.

## Breadcrumb home mark

Choose an ID from `markPool` on the server and resolve only that variant's manifest-listed compact SVG inside the pinned resource directory. Insert the trusted generated SVG inline, so `currentColor` inherits the home link's normal/hover color. Do not accept arbitrary user SVG or paths.

Give the link a name such as `aria-label="Home"`; the nested SVG is decorative (`aria-hidden="true"`, `focusable="false"`). Reserve its dimensions before rendering. The deployed site uses about 32–40 CSS px with a visible keyboard focus and at least a 44 × 44 CSS px link area.

The breadcrumb selection is independent of the favicon. It happens once on the server per page request and works without JavaScript. Repetitions are possible; the breadcrumb does not use the favicon's sessionStorage bag. Neither mark changes on a timer.

## Verify and record

```sh
node tools/verify-site.mjs PATH_TO_RESOURCE_DIRECTORY
```

For development only append `--allow-development`. Verify actual HTTP responses, asset hashes, no-JS, all independent heads, the 404 page and breadcrumb accessibility. Preserve historical encodings when editing old pages. The deployed site currently serves HTTP; HTTPS is not asserted by this document.

Keep `logo-source.json`. Hashes detect accidental modifications; they are not digital signatures. After a real rollout add an adoption record with source SHA, version, date, public scope and observable validation. Keep private consumer source/history/infrastructure outside this repository.

The 24-choice 0.1.0 implementation and `export:legacy` remain for historical compatibility. They are not the current integration recipe. See [adoption history](../adoptions/0.1.0.md) and [current adoption](../adoptions/0.2.1.md).
