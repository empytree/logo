# Construction and identity

[Русский](../logo-system.md) · [README](../../README.md) · [Generator](generator.md) · [Integration](usage.md)

Current system: **0.2.1**, deployed on empytree.com. The accepted construction is revision **1.3**; micro approval policy is revision **2**. These describe different things: package version, drawing construction and permitted use of small combinations.

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

The original display face uses a 64 × 64 grid:

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

Micro covers 16–20 CSS px, compact 21–63 and display 64+. Their grids are 16, 32 and 64. Below 16 px no separate drawing is provided. Micro keeps the notehead attachment point and scales heads by 0.88 × 0.96: width 4 → 3.52, height 2 → 1.92. Dents never trigger further head resizing.

ICO uses the micro drawing at 16/32/48 physical pixels for a 16 CSS px icon at 1×/2×/3×. A compact SVG at 32 CSS px is a different optical drawing. The [pixel sheet](../brand/pixel-check.png) embeds actual ICO layers; native dimensions refer to the source image, which a README may scale down.

Inline SVG inherits `currentColor`; external SVG in `<img>` does not inherit parent text color. For dark surfaces use inline inheritance or an explicit light drawing. ICO has an opaque white background. Keep strong contrast and a quiet backdrop. Leave at least 8/64 of a large mark's width clear outside it; do not add padding inside the favicon cell.

## Diversity and approval

The matrix has 144 expressions per fixed frame, 288 open/closed small marks and 432 display expressions with the third frame. Optical grids, densities, colors and formats do not multiply the expression count.

**All 288 supported 16 px combinations are approved by the author.** Quarter rests, small gaps and thresholded raster matches remain usable. Measurements at three densities are advisory, not automatic exclusions. The former 40-choice filter belongs to the development history.

The generic selector defaults to 144 open marks. The deployed website explicitly enables both frames, 288 choices. Its favicon uses a validated shuffle bag; the compact breadcrumb mark is independently selected on the server and remains available in no-JS. [Full generator rules](generator.md), [usage](usage.md), [adoption](../adoptions/0.2.1.md).

Construction, authorship, licensing and trademark registration are separate matters. The mark is a personal identity, not certified packaging instructions. [Provenance](../../AUTHORSHIP.en.md) and [research](../rights-and-publication.md) state their own scope.
