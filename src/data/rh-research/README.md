# RH research module handoff

This directory defines the app-facing contract for evidence-graded RH research.
Rendering a record never upgrades it to a proof, peer review, or a claim that RH
has been resolved. Every record must keep `rhStatus: 'open'`.

## Source and app locations

Curated, schema-neutral sources and reproducibility material should stay outside
the browser bundle:

```text
research/rh/modules/<module-id>.md
research/rh/rh-modules.json
research/rh/source-manifest.json
research/rh/evidence-manifest.json
research/rh/<module-id>/verify/
research/rh/<module-id>/receipts/
```

The app adapter for a published module belongs in:

```text
src/data/rh-research/<module-id>.js
```

It should call `createResearchModule(...)`, be added to `registry.js`, and carry
build assertions registered in `scripts/run-assertions.mjs`. The generic React
renderers live in `src/components/rh-research/`. No module is routed or shown in
navigation until its source text and evidence package are present.

## TeX source-literal safety

JavaScript can silently consume TeX backslashes before the renderer sees them;
for example, `\tau` in an ordinary source literal begins with JavaScript's tab
escape. Write TeX-bearing templates with `String.raw` (or an immutable local
alias such as `const tex = String.raw`) and double backslashes in ordinary
single- or double-quoted strings. `npm run audit:rh-source-escapes` lexes every
`src/data/rh-research/*.js` source file before JavaScript evaluation. It excludes
comments and regular-expression bodies, but rejects unsafe single-backslash
letter commands in ordinary string and template literals. The gate is also part
of `audit:rh-research`, `assert`, `assert:pr`, and `build`.

## Inventory mapping

The neutral inventory may retain these editorial fields:

- `status: accepted | conditional | failed | superseded | open`
- `bodyPath`
- `claims`
- `limitations`
- `evidence`

The app adapter must make the mathematical boundary more precise:

- neutral `status` becomes `reviewStatus`; `accepted` means internal review only
  and requires `reviewScope: 'internal'`;
- app `status` is the result class: `proved-identity`, `proved-estimate`,
  `proved-analytic`, `certified-finite`, `conditional-reduction`,
  `failed-surrogate`, `superseded`, or `open`;
- `claims` are separated into `theorem`, ordered `derivation`, and
  `claimBoundary.statement`;
- `limitations` are separated into `claimBoundary.doesNotClaim`, `blockers`, and,
  where applicable, structured `failures`;
- `evidence` is separated into reproducible `commands`, artifact availability and
  SHA-256, independent `replays`, an explicit `reproducibilityStatus`, and
  source/evidence references;
- `provenance.sourceRefs` pins repository, branch, immutable commit, paths, and
  whether private-repository access is required.

An unavailable artifact remains an explicit artifact with
`availability: 'unavailable'` and a note. It must not be omitted or described as
reproduced. Every artifact also declares `requiredForClaim`; a current replay is
valid only when every load-bearing artifact is available. A failed lower-bound
surrogate must list what the failure does *not*
imply, including that it is not an RH counterexample and does not establish
negativity of the underlying operator unless separately proved.

## Published focused module routes on this branch

The shared index and the focused modules present on this branch use the
repository's existing flat-router convention:

```text
/rh-research-modules
/rh-arithmetic-foundation
/rh-suzuki-recurrence
/rh-prime-memory
/rh-finite-suzuki-certificate
/rh-spectral-head-theory
/rh-channel-geometry
/rh-whole-even-certificate
/rh-signed-complement
/rh-prime-retained-tail-certificate
/rh-historical-routes
```

Each visible module renders its complete checksum-pinned canonical note together
with structured theorem, status, limitation, provenance, and evidence data.
Modules developed on other focused branches appear only when those branches are
composed; this list does not imply that unmerged modules are bundled here.
