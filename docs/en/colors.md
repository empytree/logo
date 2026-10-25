# Line colors and transparency

[Русский](../colors.md) · [Placement and density](themes-and-density.md) · [Generator](../../examples/generator.html)

Accepted by the author on 25 October 2026 for **0.3.1**. Shape and color have separate rules: geometry stays recognizable and repeatable, while color may respond to the surface and creative purpose.

| Placement | Recommended line color | Image background |
| --- | --- | --- |
| Light surface (`light`) | `#20211f`, dark | Transparent |
| Dark surface (`dark`) | `#f5f4ef`, light | Transparent |

**These are recommendations, not mandatory brand constants.** Another explicit color is allowed for a creative need, such as a composition, illustration or different surface. Check contrast and legibility at the actual delivered size, particularly 16px. Color must not hide thin parts, rests or dents.

Production SVG/PNG and every ICO layer have no background plate. Antialiased edges have intermediate alpha; pixels outside strokes are fully transparent. Example surfaces `#f5f4ef` and `#20211f` in visual sheets and the HTML preview are not included in downloaded artwork.

A creative color change does not alter irregular joints, shallow dents, optical drawings or expression counts. Extra colors are not randomly introduced on the site: the standard package carries the two recommended treatments. The current API accepts an explicit opaque RGB hex override, rather than random or uncontrolled inherited coloring.

```sh
npm run generate -- --eyes mixed --mouth rest2 --theme dark --size 48 --output .local/mark.svg
npm run generate -- --eyes mixed --mouth rest2 --theme light --color '#804020' --size 48 --output .local/mark-custom.svg
```

```js
renderMark({eyes:'mixed', mouth:'rest2', optical:'compact', theme:'light', color:'#804020'});
```

`theme` names the intended surface; `color` explicitly overrides its recommended line color. The image remains transparent. Derived compositions can make creative color choices while keeping the mark recognizable and its placement conditions clear. This does not independently license the personal mark for another brand.
