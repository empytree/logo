# Full generator and optical allowlist

[Русский](../generator.md) · [Offline generator](../../examples/generator.html) · [First adoption](../adoptions/0.1.0.md)

Version 0.2.0 is the next release candidate. The website currently uses 0.1.0. The established frame, `from-inset` dents, `character` joints and reduced micro heads remain unchanged.

## Independent parts

`tools/system.mjs` combines a complete eye pair, a mouth, a frame and a side state. The eye pair is one parameter, not two independent eyes:

- `arrows`: the accepted hybrid note/up-arrow pair;
- `beam`: two notes sharing a full horizontal beam;
- `separate`: two eighth notes with individual flags;
- `mixed`: a left note with a short horizontal partial beam, plus a separately flagged right note.

Mouths are `flat`, `rise`, `fall`, `corner-left`, `corner-right`, `down`, `rest8`, `rest4` and `rest2`. The half rest sits **above** its short reference line; omitting the line or hanging the rectangle below it would change its reading. Musical faces are identity drawings, not complete playable notation.

The state space contains 432 display expressions (4 × 9 × 4 × 3), including `crease`. Compact and micro each have 288 candidates (open/closed only). Small `crease` requests fail explicitly; the generator does not quietly replace the frame.

Existing arrow/geometric-mouth drawings are byte-for-byte compatible with the first renderer. Historical `mark({family: ...})` studies remain unchanged; the new API is `renderMark({eyes,mouth,frame,dent,optical})`.

## Size-specific eligibility

Display starts at 64 CSS px, compact at 21–63, micro at 16–20. The three SVG grids are 64/32/16. They are optical drawings, not three additional expressions. ICO layers use the micro drawing at 16, 32 and 48 physical pixels for a 16 CSS px icon at 1×/2×/3×.

Micro policy revision 1 currently permits **40 of 288** open/closed candidates. **20** of those use the default open frame; **248** candidates are excluded. All four eye-pair families remain represented. The old deployed 24-choice pool remains part of version 0.1.0; it is not retrospectively rewritten by this stricter policy.

Build procedure:

1. Rasterize the frame, eyes and mouth as separate transparent layers at each density 1, 2 and 3.
2. Include pixels with alpha ≥64/255 in each mask. Measure the Euclidean distance between the nearest occupied pixel centres for each pair of layers.
3. Require distance ≥`density + 1` physical pixels for frame/eyes, eyes/mouth and frame/mouth. This is a conservative separation rule; it does not quantify aesthetic quality.
4. Exclude the entire `rest4` micro group: its bends collapse into an ambiguous small fragment. Other collision groups come from measured geometry, not arbitrary name matching.
5. Among remaining candidates, retain one representative of each identical thresholded 16 px silhouette, in deterministic enumeration order. This deduplication is not a proof of perceptual distinctness; all-density checks still apply.
6. Form the allowlist **before** shuffling. An empty requested group keeps the fixed fallback; do not silently substitute another expression.

The complete reasons, density measurements and exclusions are in [micro-policy.json](../research/micro-policy.json); the catalog is [variants.json](../../public/brand/v2/variants.json). The [native-pixel sheet](../brand/matrix-micro.png) includes rejected specimens; the [large sheet](../brand/matrix-display.png) shows every eye/mouth pairing. Visual review informed the quarter-rest exclusion and confirms the conservative collisions. Browser tab rendering may vary; this is not a universal readability certification.

## Reproduce and generate

With Node.js 24:

```sh
npm ci
npm run verify
npm run generate -- --eyes mixed --mouth rest2 --dent left --size 128 --output .local/mixed.svg
npm run generate -- --eyes beam --mouth flat --size 16 --format png --output .local/beam.png
```

`generate` writes SVG to stdout when `--output` is absent. PNG requires an output path. Sizes 16–4096 are accepted. Rejected micro requests fail; `--study` explicitly creates a review specimen and emits a warning. It does not make that specimen eligible for the website.

Open `examples/generator.html` directly: no server, API, external fonts or network is needed. It embeds all 1008 optical drawings, native micro PNGs, rejection reasons, random eligible selection, SVG download and URL-fragment choices. The first-edition gallery remains at `examples/index.html`.

## Next website package

After the owner commits the complete source and the checkout is clean:

```sh
npm run export:site -- --commit FULL_40_CHARACTER_HEAD_SHA
```

For a local preview only, use `--development`; its commit is null. Version 0.2.0 packages contain 40 eligible ICOs, a canonical fallback, stable Apple icon, 96 px PNG, selector and reduced manifest. The default selector uses the 20 open-frame choices. Closed choices are available via `data-frames="open,closed"`. `data-eyes`, `data-mouths` and `data-dents` restrict that allowlist; they cannot introduce a rejected combination.

The selector is generated from the allowlist. It draws nothing and fetches no manifest at runtime. A validated `sessionStorage` shuffle bag visits all allowed choices before repeating and prevents an immediate repeat across cycle boundaries. Pool changes discard incompatible storage. Storage failure permits selection without the cross-load guarantee.

Keep the provenance file, versioned local resource URLs and explicit no-JS fallback contract described in [usage](usage.md). The historical limited exporter is `npm run export:legacy`; use `export:site` for the next adoption. A new source commit, export and real website rollout must precede a 0.2.0 adoption record.
