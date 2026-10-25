# Generator, approved micro pool and compact marks

[Русский](../generator.md) · [Offline generator](../../examples/generator.html) · [First adoption](../adoptions/0.1.0.md)

Version **0.3.1** adds transparency, two recommended line colors and full-canvas artwork. The 0.2.1 author decision remains: all **288** supported micro combinations are usable; the generic default is **144** open choices. The latest verified [adoption](../adoptions/0.3.1.md) is 0.3.1. [Theme, bounds and density](themes-and-density.md).

## Independent parts

- Eye pairs: `arrows`, `beam`, `separate`, `mixed` (a partial left beam and a separately flagged right note).
- Mouths: `flat`, `rise`, `fall`, `corner-left`, `corner-right`, `down`, `rest8`, `rest4`, `rest2`.
- Sides: `none`, `left`, `right`, `both`, always using `from-inset`.
- Frames: `open`, `closed`, `crease`; the last remains display-only.

The half rest stands above its reference line. These faces are identity drawings, not complete playable notation. Irregular `character` joints and reduced micro heads remain fixed.

There are **432** display expressions and **288** compact/micro combinations. All **288** micro combinations are usable. The generic default is **144** open-frame choices; `data-frames="open,closed"` enables all 288. A small top-crease request fails explicitly, without substituting another frame.

Base grids are micro 16, compact 32 and display 64. Every ICO has ten physical resolutions: 16/20 micro, 24/32/40/48 compact, 64/96/128/256 display. Layers are vector-rasterized. The micro frame expands while eyes/mouth retain their pixel grid. Irregular joints remain; the new drawings do not claim byte compatibility with earlier releases.

## Advisory measurements

Micro policy revision **2** records `all-supported-variants-approved-by-empytree`. No gap, quarter-rest-detail or duplicate-raster observation automatically excludes a choice.

The build still rasterizes separate frame/eyes/mouth layers at three densities. Pixels with alpha ≥64/255 enter masks. Distances below `density + 1`, small quarter-rest details and identical thresholded silhouettes are retained as observations with density measurements. They do not override the author's review.

Revision 1 admitted 40 open/closed choices (20 open); that decision remains in Git history and the journal. Current results are **288 allowed, 0 excluded**, 144 open defaults. See the [report](../research/micro-policy.json), [catalog](../../public/brand/v2/variants.json), [native raster sheet](../brand/matrix-micro.png) and [large sheet](../brand/matrix-display.png).

## Build and generate

```sh
npm ci
npm run verify
npm run generate -- --eyes mixed --mouth rest4 --dent left --size 16 --format png --output .local/mark.png
npm run generate -- --eyes separate --mouth rest2 --size 32 --output .local/home.svg
```

CLI supports 16–4096 px and SVG/PNG. `--color` explicitly overrides the recommended line color for creative placement; the background stays transparent. `--theme light|dark` selects the explicit palette (default light), also included in HTML-generator SVG downloads. SVG without `--output` goes to stdout; PNG needs a file. `--study` remains compatible but is not required for any supported micro combination. The offline HTML generator embeds 2016 SVGs (1008 optical drawings × 2 palettes) and native PNGs without network, server or external fonts.

## Website and breadcrumbs

After the owner commits the complete source, from a clean checkout:

```sh
npm run export:site -- --commit FULL_40_CHARACTER_HEAD_SHA
```

`--development` creates a preview with a null source commit. Schema 5 for 0.3.0 contains **576 ICOs and 576 compact SVGs** in two palettes, two fallback ICOs, PNGs 96/180, selector and manifest: 1158 hashed files plus provenance. Each ID has `ico`/`icoDark` and `svg`/`svgDark`. Older schema 2/3 verification remains supported.

The browser favicon selector chooses once per load from the requested frames. A validated sessionStorage Fisher–Yates bag visits the pool before repeating and avoids immediate cycle-boundary repetition. Unknown/empty groups preserve the fallback. Storage failure removes cross-load guarantees. There is no runtime drawing, manifest fetch or timer.

Breadcrumb marks may be independently selected on the server from `markPool`, including without JavaScript. Resolve only manifest-listed SVGs inside the pinned resource directory. Insert the trusted SVG inline with a recommended line color and transparent background. Choose `svgDark` for a dark header; the link color does not recolor it. Give the link an accessible name such as “Home”; mark the nested SVG decorative with `aria-hidden="true"` and `focusable="false"`. About 32–40 CSS px suits compact breadcrumbs; reserve a comfortable focus/click area and avoid layout shifts.

Keep versioned local URLs and `logo-source.json`. A development package is not a released adoption. A new source commit and real rollout must precede its adoption record. The shared contract and first-version behavior remain in [usage](usage.md).

Changes to `prefers-color-scheme` switch only the selected favicon palette, without another random draw or consuming the bag.
