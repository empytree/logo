# Build, selection algorithm and website adoption

[README](../../README.md) · [Construction](logo-system.md) · [Русский план](../roadmap.md)

This page documents the adopted 0.1.0 behavior and the shared consumer contract. For the current 0.2.1 generator, optical allowlist and exporter, start with [generator.md](generator.md).

## Source and build

Use Node.js 24. Install the pinned dependency tree with `npm ci`, then run `npm run verify`. Sharp is a build dependency, not a website runtime dependency. The package is private in the npm sense to prevent accidental registry publication; the GitHub repository may be public.

`geometry.mjs` draws an SVG from discrete parameters. `identity-config.mjs` fixes the accepted dent profile, joint and micro head scaling. `build.mjs` enumerates the first implementation and rasterizes at the intended target resolution. It writes self-contained SVGs, PNGs, layered ICOs, reverse assets, the manifest and review sheets. `examples/index.html` is an offline gallery generated from the same geometry.

`public/brand/v1` is the source asset catalog's format generation. A website release has a separate semantic version and gets a new versioned URL directory; do not overwrite long-cached assets in a previously deployed version.

## Runtime algorithm

The website package contains six mouths × four side states = 24 open-frame choices. The fixed straight, undented mark is the fallback. The browser script:

1. Reads an allowlisted mouth, frame and side configuration from its script element.
2. Forms the Cartesian pool of permitted combinations.
3. Restores a compatible, validated bag from `sessionStorage`, or starts a new one.
4. Shuffles a new bag with Fisher–Yates, avoiding a repeat at the cycle boundary.
5. Takes one combination, saves the remainder and points one favicon link to the existing ICO beside the script.

It runs once per document load. There is no timer, API or runtime geometry generator. Without storage, cross-load no-repeat guarantees are unavailable. Without JavaScript, the fallback remains. An explicit site no-JS mode should omit the script even when the browser itself supports JavaScript.

For this limited export keep the default open-frame pool; do not enable closed frames, which are not included in the package. The full source catalog supports closed frames for other consumers.

## Export the historical 0.1.0 pool

The commands and 24-choice package below describe the original limited exporter. For the current 0.2.1 candidate use [generator.md](generator.md), `npm run export:site` and its size-specific allowlist; the historical exporter is `npm run export:legacy`.

After the owner has committed the complete source and the checkout is clean:

```sh
npm run export:legacy -- --commit FULL_40_CHARACTER_HEAD_SHA
```

The exporter verifies the actual repository root, HEAD and clean status. It refuses an unpinned release and refuses to overwrite an existing output directory. The original published source produced `dist/empytree-logo-0.1.0/`. Output paths use the package version of the checkout; invoking the legacy exporter from a later checkout does not recreate the old provenance. It contains:

- `public/brand/empytree/v0.1.0/`: 24 ICO variants, the fallback ICO, stable Apple icon, prepared 96 px PNG, selector script and limited manifest.
- `logo-source.json` beside those resources: source repository, full source commit, version, accepted construction, pool size and SHA-256 inventory.
- `head.html`: a framework-neutral example pointing to the versioned local resources.

The 96 px PNG is prepared but is not selected by this head snippet. The declared ICO sizes are 16/32/48. Search-engine favicon selection is not guaranteed by the browser's random expression.

For a local review before there is a source commit:

```sh
npm run export:legacy -- --development
```

A development package uses a `-dev` path and a null source commit. It must not be recorded as an adopted release. If an output exists, use a different `--output-name` for another candidate; do not overwrite a published version.

## Consumer contract

Copy the exported `public/` contents into the consumer's public directory. Keep `logo-source.json`. Verify the copied resources with:

```sh
node tools/verify-site.mjs PATH_TO_RESOURCE_DIRECTORY
```

For a development review only, append `--allow-development`. Checksums detect an accidental change; they are not a digital signature or proof of authorship. The source commit and owner-controlled publication establish the intended provenance chain.

Replace the temporary empty-icon link in every independent document head. Use the exported path instead of assuming the source catalog path. Apply the selector only to the intended JS pages. Preserve historical file encodings when editing standalone pages. Remove competing icon links and verify fallbacks, 404 pages and explicit no-JS routes.

The first consumer is intended to be empytree.com. Its source, templates, deployment configuration and credentials remain outside this repository. Runtime resources are local to that website; a visitor does not fetch executable code from GitHub.

## Adoption record

Version 0.1.0 is [adopted](../adoptions/0.1.0.md). Version 0.2.1 is not adopted yet. After each real rollout, add a separate record containing the released package version, full public source commit, public target site, actual adoption date, scope and observable validation. Do not publish the private site's remote URL, private commit identifiers, templates or deployment logs to establish that record.

Later generator changes require a new source version, validation and a new consumer package. The 144/288/432 matrix and size-specific micro groups are implemented in the next generator; its next adoption must use the new version and exported allowlist.
