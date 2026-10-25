# Two palettes, canvas bounds and display density

[Русский](../themes-and-density.md) · [Construction](logo-system.md) · [Comparison sheet](../brand/themes-and-density.png)

Rules for **0.3.0**, construction **1.4**, accepted on 25 October 2026. This is a new source package; the latest verified public adoption remains [0.2.1](../adoptions/0.2.1.md). A source release is not a claim of deployment.

## Placement conditions

Every production mark declares one of two palettes and includes an opaque background:

| `theme` | Mark | Background |
| --- | --- | --- |
| `light` | `#20211f` | `#f5f4ef` |
| `dark` | `#f5f4ef` | `#20211f` |

These are placement modes, not extra expressions. Photos, arbitrary colors and transparent backgrounds are not production modes of this revision. Inline SVG also uses a named palette rather than unrestricted link-color inheritance. The existing dark breadcrumb header calls for `dark`, independently of the visitor's system preference: its placement conditions are known.

The box fills the canvas, including 16 × 16 instead of the previous 14 × 14 micro box. No mandatory internal padding or external clear-space margin remains. Page layout may add spacing between elements. Contours fit completely, including sharp dent shoulders.

Micro keeps the accepted eye/mouth coordinates and 0.88 × 0.96 head reduction. Only the frame expands: straight side axes x=0.5/15.5; top/bottom thickness 1; left dent `(0.5,3.5) → (1.75,8) → (0.5,12.5)`, mirrored on the right. This preserves pixel-aligned stems. Scaling the entire old 14-pixel box to 16 would introduce fractional stem coordinates and blur notes.

Compact maps its original `[1,31]` bounds to `[0,32]` using `scale(32/30) translate(-1,-1)`. Display maps `[3,61]` to `[0,64]` using `scale(64/58) translate(-3,-3)`. Frames are closed filled contours; tiny outward shoulder miters are constrained during construction rather than cropped after rendering. Irregular joints and the accepted `from-inset` dent remain.

`presentation.mjs` defines palettes, frame geometry and resolutions. Low-level `wrap({theme:null})` is only for measurement masks and studies on a known background. CLI, browser generator and consumer packages export explicit opaque production palettes. `public/brand/v1` preserves historical construction.

## Every ICO carries the full resolution family

| Physical px | Optical drawing |
| --- | --- |
| 16, 20 | micro |
| 24, 32, 40, 48 | compact |
| 64, 96, 128, 256 | display |

All **576 ICO files** contain all ten layers: 288 expressions × 2 palettes. Resolutions do not add expressions. Each layer is rasterized directly from its optical vector, never enlarged from a 16 px PNG. ICO encodes dimension 256 as zero in its one-byte size fields.

A nominal 16 CSS px icon at 1×/1.25×/1.5×/2×/2.5×/3×/4× can use 16/20/24/32/40/48/64 physical pixels. The browser chooses its layer; `sizes` advertises availability without guaranteeing an exact choice in every browser surface. Higher density may use compact/display detail while retaining the same expression. This intentionally replaces 0.2.1's all-micro 16/32/48 layers. Advisory micro measurements at 1×/2×/3× still measure one drawing; they do not describe all current ICO layers.

SVG remains vector. Choose an inline mark's optical drawing for its placement size; the browser rasterizes it at display density. Link target size, accessible name and keyboard focus do not depend on physical image resolution. The Apple touch icon is a separate stable 180 px PNG and does not follow live tab-theme changes.

## Website theme selection

1. Once per load, select a face from the validated sessionStorage shuffle bag. The site enables both frames (288); the generic default remains 144 open marks.
2. Read `matchMedia('(prefers-color-scheme: dark)')`. Use `${id}.ico` for light or `${id}-dark.ico` for dark.
3. A `change` event switches only the palette URL. Preserve the face, remaining bag and next random choice. No timer or polling is involved.
4. Missing/throwing API uses light. Disabled JavaScript or explicit no-JS retains canonical light `favicon.ico`, also with all ten layers. Unknown/empty groups retain the fallback.

The reported preference is not the precise tab-strip color or a custom browser skin. Opaque contrasting palettes do not rely on transparent-background matching. Cached bookmark icons may refresh on the browser's own schedule; immediate updates to every stored copy are not promised.

Schema **4** packages contain 576 ICOs, 576 compact SVGs, two canonical ICOs, PNGs at 96/180, selector and manifest: **1158 SHA-256 entries plus `logo-source.json`**. `ico`/`icoDark` and `svg`/`svgDark` share a face ID. Provenance records palettes, sizes and per-layer optics. Never overwrite previously published versioned resources.

Mechanism references: [MDN: link and multi-size ICO](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/link), [Apple: Retina image delivery](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/SafariImageDeliveryBestPractices/ServingImagestoRetinaDisplays/ServingImagestoRetinaDisplays.html), [MDN: matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia), [change event](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/change_event).
