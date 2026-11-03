# Parallel work contract

This checkpoint is designed to let proof, computation, audit, and paper work
proceed simultaneously without rewriting the validated baseline.

## Frozen ownership

- `evidence/`, `provenance/`, and the root `SHA256SUMS` are immutable after the
  baseline commit. Corrections create a new versioned evidence directory and a
  new manifest; they never replace old bytes.
- `CLAIMS.md` and `paper/` have a single integration owner on the checkpoint
  branch. Workstreams propose claim deltas rather than editing the same rows in
  parallel.
- Generated exploratory output never goes into `evidence/`.

## Branch lanes

Use one isolated worktree per branch:

- `zsv/proof-<lemma>` - analytic proof work;
- `zsv/experiment-<question>` - exploratory numerics, clearly non-certifying;
- `zsv/audit-<artifact>` - independent replay or adversarial review;
- `zsv/paper-<section>` - exposition only;
- `zsv/integration-<date>` - controlled merges of accepted deltas.

Do not force-push a shared lane. Do not merge directly into `main`; open a
draft PR and preserve the evidence grade in the title and description.

## Workstream shape

Copy `workstreams/TEMPLATE/` to `workstreams/<name>/` and keep:

- `STATUS.md` - hypothesis, current result, and precise blocker;
- `CLAIM_DELTA.md` - proposed new/changed ledger rows;
- `src/` - authored derivations or code;
- `tests/` - bounded checks;
- `results/` - generated outputs with commands and environment;
- `MANIFEST.json` - hashes, byte counts, rerun status, and provenance.

## Promotion gates

A numerical observation may become a `finite-certificate` claim only when its
finite domain, arithmetic model, analytic tail/error terms, verifier, and
replay receipt are all frozen. It may become `proved` only when the analytic
argument and every imported premise are identified. No claim becomes “peer
reviewed” through an internal audit.

The central target should remain one bounded statement: prove the actual
lower-metric innovation domination with all degree, source-map, inverse, and
reserve constants visible. Adjacent experiments should be separate lanes.

