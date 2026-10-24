# empytree / personal mark system

[Русский](README.ru.md) · [Construction rules](docs/en/logo-system.md) · [Full generator](examples/generator.html) · [First-edition gallery](examples/index.html)

Quiet music from a crumpled box. A personal mark for **empytree**: note-like eyes also suggest upward arrows, a geometric mouth, and an open square with controlled side dents.

![The current family](docs/brand/dented-sides.png)

The accepted construction uses intermediate shallow dents (`from-inset`), the deliberately irregular notehead-to-stem joint (`character`), and a separate micro drawing with slightly smaller heads for 16 px. The canonical face has a straight mouth, open top and undented sides. Other side profiles and the smooth joint are historical studies.

The adopted 0.1.0 website pool is **24 combinations**: six mouths × four side states, open frame. Optional closed frames bring the available first-version pool to 48. Version 0.2.0 implements the full matrix: 144 combinations per fixed frame, 288 open/closed candidates and 432 display expressions including the top crease. Its conservative micro policy permits 40 open/closed choices, including 20 open-frame defaults. See the [generator specification](docs/en/generator.md). These counts do not certify perceptual distinctness.

## Build and inspect

Use Node.js 24 and the committed lockfile:

```sh
npm ci
npm run build
npm run research:examples
npm run audit:docs
npm run check
```

Open [examples/generator.html](examples/generator.html) directly in a browser; the first-edition gallery remains at [examples/index.html](examples/index.html). It is self-contained and needs no API, server or ChatGPT host. The historical catalog is in `public/brand/v1/`; the independent musical catalog and micro allowlist are in `public/brand/v2/`. Node and Sharp are build dependencies; a consuming website needs only the exported static files and the selector script.

## Documentation

- [Construction and diversity — English](docs/en/logo-system.md), [Русский](docs/logo-system.md)
- [Build, algorithm and website adoption](docs/en/usage.md)
- [Authorship — English](AUTHORSHIP.en.md), [Русский](AUTHORSHIP.md)
- [Development decisions](docs/development-history.md), [rollout roadmap](docs/roadmap.md)
- [Full generator and optical exclusions](docs/en/generator.md), [Русский](docs/generator.md)
- [Combination count](docs/variation-space.md)
- [Recorded website adoption — 0.1.0](docs/adoptions/0.1.0.md)
- [Image analogy research and its limitations](docs/research/image-analogies.md)
- [Rights and publication research](docs/rights-and-publication.md)
- [Documentation audit](docs/documentation-audit.md)

Research and detailed historical records are currently in Russian; the English specification and authorship record cover the accepted state. Legal-policy drafts have not become an adopted bilingual license.

See the [language policy](docs/languages.md) and [initial commit plan](docs/commit-plan.md).

## Website consumer

This repository is separate from the website. Version 0.1.0 is [adopted](docs/adoptions/0.1.0.md) with 24 static favicon choices. Version 0.2.0 is the next candidate, with 20 eligible open-frame defaults and 40 available open/closed choices. The browser chooses one per load and does not fetch executable code from GitHub. See the [adoption contract](docs/en/usage.md); adoption of 0.2.0 is pending.

## Rights

Concept, supplied sketch and art direction: **empytree**, [empytree.com](http://empytree.com/). Implementation was prepared with AI assistance under the author's direction. The [provenance record](AUTHORSHIP.en.md) distinguishes this from an authorship or trademark-registration guarantee.

The project is not currently declared open source. No blanket MIT or other reuse license has been selected. Public visibility and ordinary GitHub forks do not themselves grant a separate right to adopt this personal mark as another brand. The `private` package setting prevents accidental npm publication; it does not mean the GitHub repository must be private.
