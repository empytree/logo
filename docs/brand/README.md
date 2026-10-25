# Visual sheets / Сводные изображения

[README](../../README.md) · [Правила](../logo-system.md) · [Generator](../../examples/generator.html)

Current system: **0.3.1**, construction 1.5, micro approval 2. All supported 16 px combinations are usable. The overview starts the English and Russian READMEs; the remaining sheets serve closer inspection.

| Current sheet | What it shows |
| --- | --- |
| [themes-and-density.png](themes-and-density.png) | Transparent marks on two example surfaces, actual 16/32/48 layers, historical/current canvas comparison and all ten resolutions |
| [overview.png](overview.png), [русская версия](overview-ru.png) | Four large, deliberately different eye/mouth examples; all nine mouths; side/frame states; optical drawings; current usage; open-box, music and “this way up” meanings |
| [dented-sides.png](dented-sides.png) | Four current eye families × four side states; only the frame changes within each column |
| [pixel-check.png](pixel-check.png) | Twelve distinct examples; real 16/32/48 physical-pixel ICO layers and nearest-neighbour enlargements |
| [matrix-display.png](matrix-display.png) | Four eye pairs × nine mouths, with a fixed open frame and straight sides |
| [matrix-micro.png](matrix-micro.png) | 144 open-frame combinations at native 16 px and enlarged pixels; all are approved |
| [hero.png](hero.png) | Canonical large face: arrows / flat / open / none |

SVG sources accompany the overview, side and pixel sheets. `tools/build-docs.mjs` builds current presentation sheets from `renderMark()` and exported ICO bytes; `tools/build-system.mjs` builds the full matrices. `npm run build` rebuilds them all. The four overview examples deliberately vary eyes, mouth, frame and sides rather than only the mouth.

Pixel dimensions describe the source image. GitHub or a browser may scale a whole sheet down; open the original image at 100% to inspect native pixels. Enlargements use nearest-neighbour resampling. Logo drawings have no font dependency; explanatory sheet text uses installed fonts and may vary slightly between rendering environments.

The name on current sheets, including both overview languages, uses the approved base personal spelling: **Fraunces 450 / SOFT 25 / WONK 1 / opsz 72**, tracking **−0.02 em**, with no separate y–t shift. It is drawn with fixed vector outlines from the 26 October 2026 pseudonym study, so SVG and PNG do not require Fraunces to be installed. [Build input and typeface attribution](../../tools/assets/README.md).

Имя на актуальных сводках, включая обе языковые обложки, набрано базовым личным вариантом: **Fraunces 450 / SOFT 25 / WONK 1 / opsz 72**, интервал **−0.02 em**, без отдельного сдвига y–t. Используются точные векторные контуры из исследования от 26 октября 2026 года; установленный Fraunces для SVG и PNG не требуется.

## Construction history / История конструкции

The following are **historical comparisons**, not additional current choices:

- [dent-comparison.png](dent-comparison.png): three studied dent profiles; `from-inset` was chosen.
- [joint-comparison.png](joint-comparison.png): irregular and clean joints; `character` was chosen.
- [micro-head-comparison.png](micro-head-comparison.png): head sizes before/after refinement, also showing discarded dent profiles for comparison.
- `review/`: individual study SVGs. They do not enter a runtime pool.

Исторические сравнения сохранены, поскольку объясняют решения автора. Они подписаны как история и не предлагают заново выбирать профиль или стык. Поисковые образцы в `docs/research/examples/` — отдельный датированный материал исследования, а не актуальная обложка системы.

The overview keeps its four large examples and original parameter/optics layout. Its extended bottom panel explains the open top, short arrow stroke, familiar “this way up” symbol, music inside, monochrome transparency and absence of texture, volume or random deformation. These are presentation explanations, not new construction rules.
