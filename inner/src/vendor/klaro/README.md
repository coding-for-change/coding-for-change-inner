# Vendored Klaro CMP

`klaro-no-css.js` and `klaro.min.css`, copied verbatim from the `klaro` npm
package **v0.7.21**.

## Why vendored instead of an npm dependency

Klaro declares its build tooling as *runtime* `dependencies`:

```json
"dependencies": {
  "@babel/eslint-parser": "^7.23.10",
  "sass": "^1.25.0",
  "webpack-merge": "^5.10.0"
}
```

Depending on the package therefore drags Babel and Sass into `inner`'s
production install — roughly 1,100 lines of lockfile and a large transitive tree
shipped in the runtime image for nothing, since all we consume is one prebuilt
bundle and one stylesheet.

Vendoring also fits the upstream reality. Klaro has had **no npm release since
v0.7.21 (March 2024)** and **no commits since March 2025**, so "stay current via
npm" is a benefit that doesn't exist here. Pinning a reviewed artifact in-repo is
the honest description of what we're doing: this is compliance code, and having
it frozen and diffable is a feature.

## Trade-offs we accepted

- No `npm audit` coverage for these files.
- Updates are manual (see below).
- The bundle is ~212 KB. It is loaded via dynamic `import()` from
  `src/app/ConsentManager.tsx`, so it stays out of the initial page bundle.
  (Note: Klaro's `-no-translations` variant is byte-for-byte the same size, so
  there is nothing to gain by switching to it even though we supply our own DE/EN
  copy.)

## How to update

1. `npm view klaro version` — check whether upstream has actually moved.
2. `npm pack klaro@<version>`, unpack it, and copy `dist/klaro-no-css.js` and
   `dist/klaro.min.css` over the files here.
3. Diff them. This is consent code — read what changed rather than trusting the
   version bump.
4. Re-check `src/types/klaro.d.ts`: it declares only the narrow surface we use
   (`setup`, `show`, `getManager`, and the manager's `consents` / `confirmed` /
   `watch`). If any of those moved, the type error is the point.
5. Verify against the consent section of the repo-root `CLAUDE.md`: with a fresh
   profile, decline, and confirm no `_gcl_*` / `_ga*` cookie or `cfc.*` storage
   key exists.
