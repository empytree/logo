# Construction and identity

[Русский](../logo-system.md) · [README](../../README.md) · [Generator](generator.md) · [Integration](usage.md)

Current system: **0.3.1**, construction **1.5**, micro approval **2**. Version 0.3.1 is deployed on empytree.com; its verified package SHA is recorded separately from later documentation changes. [Two palettes and density](themes-and-density.md).

## Character

Quiet music from a crumpled box. The original eyes combine noteheads, stems and angular flags with a small separate left stroke, suggesting both notes and “this side up” arrows. A changing mouth and a square box hold the family together when the eye pair changes.

The notehead-to-stem joint is deliberately uneven. Preserve that repeatable step; do not smooth it automatically, exaggerate it randomly or turn it into a gap. Its ability to hold attention is a design hypothesis. The shallow intermediate dent has short straight sections near the corners; the rest of each side slopes toward one inward angle. No texture, perspective, tape or shading is required to make it a box.

## Parts and fixed decisions

| Parameter | Current values |
| --- | --- |
| `eyes` | `arrows`, `beam`, `separate`, `mixed` |
| `mouth` | `flat`, `rise`, `fall`, `corner-left`, `corner-right`, `down`, `rest8`, `rest4`, `rest2` |
| `dent` | `none`, `left`, `right`, `both` |
| `frame` | `open`, `closed`, `crease` (display only) |

The canonical mark is `arrows / flat / open / none`. The only production dent profile is `from-inset`; the only production joint is `character`. Do not randomize either. Historical clean joints and alternative dents are [construction studies](../brand/README.md), not extra runtime choices.

`mixed` has a short left partial beam and an individually flagged right note; it is not another fully beamed pair. The half-rest rectangle stands above its short reference line. These identity drawings do not claim to be a complete playable score.

The source of truth is `identity-config.mjs` plus `geometry.mjs` and `system.mjs` in `tools/`. `renderMark({eyes,mouth,frame,dent,optical})` draws the current system. The old `mark({family: ...})` API remains only for compatibility and historical studies.

## Geometry

The original display face uses a 64 × 64 grid. Tables below describe base coordinates before the 0.3.0 full-canvas mapping; the micro frame uses the new coordinates in [placement rules](themes-and-density.md):

| Element | Construction |
| --- | --- |
| Frame | Centerline `(4,4)…(60,60)`, stroke 2; square corners |
| Open top | Gap x=24…40 |
| Noteheads | Centers `(22,35)`, `(40,35)`; radii 4.75 × 3.1; rotation −12° |
| Stems | x=26 and 44, y=18…35; width 2.5 |
| Right flag | `(x,18) → (x+6,24)` |
| Separate left stroke | `(x−8.5,23.5) → (x−6,21)` |
| Straight mouth | x=18…46; center y=47.5; height 2.5 |

Sharp miter joins extend beyond their centerline vertices. The alternate eye pairs use their own fixed optical placement; changing the mouth or sides never moves the eyes.

The geometric mouths share a fixed field in each optical grid:

| Grid | Left/right | Top/bottom | Stroke |
| --- | --- | --- | --- |
| Display | 18 / 46 | 45 / 50 | 2.5 |
| Compact | 8 / 24 | 23 / 26 | 1.75 |
| Micro | 4 / 12 | 11 / 13 | 1 |

`rise` runs from bottom-left to top-right; `fall` reverses it. `corner-left` fills top-left/top-right/bottom-left; `corner-right` fills top-left/top-right/bottom-right. `down` is a centered downward triangle, inset by 4/2/1 units on display/compact/micro; its lower vertex is at y=51/26.5/13. Rest glyphs use separately drawn paths in `system.mjs`, not font characters. Do not rotate/mirror the whole mark or introduce free random deformation.

| Grid | Left dent | Right dent |
| --- | --- | --- |
| 64 | `(4,12) → (8,32) → (4,52)` | `(60,12) → (56,32) → (60,52)` |
| 32 | `(1.75,5.75) → (3.75,16) → (1.75,26.25)` | `(30.25,5.75) → (28.25,16) → (30.25,26.25)` |
| 16 | `(1.5,3.5) → (2.75,8) → (1.5,12.5)` | `(14.5,3.5) → (13.25,8) → (14.5,12.5)` |

The display top crease is `(47,4) → (50,6) → (53,4)`. A compact/micro request for `crease` fails explicitly in the current API; it does not substitute a different frame.

## Optical drawings and color

Micro covers 16–20 px, compact 21–63 and display 64+. Their grids are 16, 32 and 64. Below 16 px no separate drawing is provided. Micro keeps the notehead attachment point and scales heads by 0.88 × 0.96: width 4 → 3.52, height 2 → 1.92. Dents never trigger further head resizing.

Every ICO contains 16/20/24/32/40/48/64/96/128/256 physical pixels. Optics follow the layer resolution: micro through 20, compact through 63, display from 64. Retina can therefore receive a more detailed drawing of the same face. [Comparison](../brand/themes-and-density.png).

Production SVG/PNG/ICO use a `light` or `dark` placement mode and an explicit line color with a transparent background. The box fills the canvas. There is no mandatory internal or external safety margin; layout supplies spacing as needed. Micro keeps eye/mouth coordinates and expands only its frame; compact/display map to full bounds. See [palette and canvas rules](themes-and-density.md).

## Diversity and approval

The matrix has 144 expressions per fixed frame, 288 open/closed small marks and 432 display expressions with the third frame. Optical grids, densities, colors and formats do not multiply the expression count.

**All 288 supported 16 px combinations are approved by the author.** Quarter rests, small gaps and thresholded raster matches remain usable. Measurements at three densities are advisory, not automatic exclusions. The former 40-choice filter belongs to the development history.

The generic selector defaults to 144 open marks. The deployed website explicitly enables both frames, 288 choices. Its favicon uses a validated shuffle bag; the compact breadcrumb mark is independently selected on the server and remains available in no-JS. [Full generator rules](generator.md), [usage](usage.md), [adoption](../adoptions/0.3.1.md).

Construction, authorship, licensing and trademark registration are separate matters. The mark is a personal identity, not certified packaging instructions. [Provenance](../../AUTHORSHIP.en.md) and [research](../rights-and-publication.md) state their own scope.
