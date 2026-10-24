# empytree personal mark system

[Русская спецификация](../logo-system.md) · [README](../../README.md)

Construction revision 1.3, 24 October 2026. The established construction remains accepted. Version 0.1.0 is adopted; version 0.2.1 implements the independent musical generator described in [generator.md](generator.md). This page records the original construction and its stable first-edition API. The mark is personal identification for empytree, not a certified packaging instruction or evidence of trademark registration.

## Concept

Quiet music from a crumpled box. Two noteheads act as eyes; upward stems and angular flags also suggest “this side up” arrows. A short separate stroke to the left of each flag strengthens that ambiguity. A geometric mouth recalls the baseline of the packaging symbol. The open square reads as a box without textures, perspective or tape.

The slightly uneven notehead-to-stem connection is deliberate and accepted. It is a repeatable irregularity against otherwise controlled geometry. It must not be automatically smoothed away, randomly exaggerated or turned into a gap. Its ability to hold attention is a design hypothesis, not a proven perceptual effect.

## Accepted construction

The source of truth is `tools/identity-config.mjs` together with `tools/geometry.mjs`; `tools/system.mjs` adds independent musical components and `tools/micro-policy.mjs` sets small-size eligibility.

- Side profile: `from-inset`, an intermediate shallow dent with short straight sections near the corners.
- Joint: `character`, the existing irregular connection.
- Mouths: `flat`, `rise`, `fall`, `corner-left`, `corner-right`, `down`.
- Side states: `none`, `left`, `right`, `both`. One dent profile is used across all states.
- Open top is the default. A closed top is optional. The top-crease study is display-only.
- One color, square artboard, sharp corners, fixed eyes and proportions within each optical size. No rotation or whole-mark mirroring.

| Element | Display grid, 64 × 64 |
| --- | --- |
| Frame | Centerline `(4,4)` to `(60,60)`, stroke 2 |
| Open top | Gap from x=24 to x=40 |
| Noteheads | Centers `(22,35)`, `(40,35)`; radii 4.75 × 3.1; rotation −12° |
| Stems | x=26 and 44, y=18…35; stroke 2.5 |
| Right flag | `(x,18)` to `(x+6,24)` |
| Separate left stroke | `(x−8.5,23.5)` to `(x−6,21)` |
| Straight mouth | x=18…46; center y=47.5; height 2.5 |

These are construction centerlines. Sharp miter joins extend beyond their centerline vertices.

| Optical grid | Left dent | Right dent |
| --- | --- | --- |
| 64 | `(4,12) → (8,32) → (4,52)` | `(60,12) → (56,32) → (60,52)` |
| 32 | `(1.75,5.75) → (3.75,16) → (1.75,26.25)` | `(30.25,5.75) → (28.25,16) → (30.25,26.25)` |
| 16 | `(1.5,3.5) → (2.75,8) → (1.5,12.5)` | `(14.5,3.5) → (13.25,8) → (14.5,12.5)` |

## Optical sizes

Use display from 64 CSS px, compact at 21–63 px, and micro at 16–20 px. Standard targets are 16, 24, 32, 48, 64 and 96. Readability below 16 px is not promised.

Micro joins the small left flag fragment to the tip and uses a pixel-oriented silhouette. Only its noteheads are reduced: width 4 → 3.52 px, height 2 → 1.92 px, scaling by 0.88 × 0.96 around the right attachment point. The shaft, arrows, frame and mouth are unchanged. Heads do not change size when the side state changes.

All ICO layers use micro geometry at 16, 32 and 48 physical pixels for a 16 CSS px tab icon at 1×, 2× and 3× density. Standalone `*-32.png` files use compact geometry for a 32 px presentation; they are different exports by design.

## Color and clearance

Master SVGs use `currentColor` when embedded inline. An external SVG in `<img>` does not inherit the parent text color: use the explicit reverse asset for a dark background. ICO/ordinary PNG exports have opaque white backgrounds; reverse small PNGs have dark backgrounds. Adaptive SVGs use a color-scheme media query and require checking in target browsers.

Keep at least 8/64 of the mark width clear outside a large mark. Do not add extra padding inside a favicon cell. Use a quiet contrasting background. Color does not identify expressions.

## Controlled diversity

The first website pool contains 24 combinations: one eye pair × six mouths × four side states, open frame. An optional closed frame increases the available pool to 48. The single dent profile and joint are not random dimensions.

`random-favicon.js` selects once per document load. It shuffles the full allowed pool with Fisher–Yates and consumes a bag in `sessionStorage`; every combination is visited once per cycle. The boundary between cycles avoids an immediate repetition of the whole combination. A mouth may repeat with different sides. With unavailable storage, selection still works but cross-load repeat guarantees disappear. No timer or API request is used.

With JavaScript disabled, the canonical straight-mouth, undented ICO remains. Apple touch icons are stable. Site-wide “no JS” modes should also omit the selector script. Block-order randomization can remain independent.

The build generates static assets. The browser selector chooses an existing icon; it does not draw geometry. The offline generator supports the full independent musical matrix.

## Independent musical matrix

Four eye-pair designs: arrows, beamed notes, separate eighths, partial horizontal beam plus a separate flag. Nine mouths: the six geometric forms plus eighth, quarter and half rests. Four side states produce 144 parameter combinations with one frame, 288 with open/closed frames, and 432 in display when an open top crease is added as a third frame alternative.

These counts do not establish distinct or readable 16 px images. Musical studies are not literal playable notation. The next generator implements size-specific allowed groups, rejection reasons and density validation; its author-approved micro pool contains all 288 open/closed choices, 144 open by default. Adoption of that version is still a separate milestone. Optical sizes, pixel densities, file formats and discarded dent profiles do not multiply the conceptual face count.

## Build and adoption

See [building and website adoption](usage.md), [the Russian detailed geometry](../logo-system.md), [development history](../development-history.md), and [the roadmap](../roadmap.md). Examples and historical alternatives are documentation, not additional runtime choices. Rights and authorship are separate from visual construction.
