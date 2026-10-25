# Pseudonym outlines

`empytree-fraunces.json` preserves the approved base personal spelling from the
author's `pseudonym-study/constructions-data.json`, dated 2026-10-26:

- Fraunces, `wght=450`, `SOFT=25`, `WONK=1`, `opsz=72`.
- Lowercase `empytree`, native kerning, tracking −0.02 em, no local y–t shift.
- Original shaped glyph paths, positions and ink bounds; 2000 units per em.
- Font version 1.000;[b76b70a41], SHA-256
  `177ff6c0f14e5550a3c624247cd1189611d4eb65d000b14944c63d967958abbb`.

The source font is by The Fraunces Project Authors:
[upstream](https://github.com/undercasetype/Fraunces),
[source distribution](https://github.com/google/fonts/tree/main/ofl/fraunces).
Its SIL Open Font License 1.1 is preserved in `Fraunces-OFL.txt`.
This attribution concerns the typeface; it does not set a license for the mark system.

`../wordmark.mjs` scales these fixed outlines proportionally and places the visible
left edge at the requested x coordinate (or aligns the visible center/right edge).
The y coordinate is the original font baseline. The JSON is a local build input;
rendering does not depend on the research directory or installed fonts. To change
the approved spelling, replace the contours and metrics together from a newly
approved shaped model, then rebuild the presentation sheets.
