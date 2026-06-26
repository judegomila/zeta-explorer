// @module imp-2752-bootstrap-determinism-crosscheck
// imp-2752 — Determinism cross-check for the shared bootstrap-CI skeleton.
//
// PURPOSE
// -------
// Three downstream CI cross-validations share ONE bootstrap skeleton
// (scripts/bootstrap-ci.mjs: mulberry32 RNG + OLS log-log fit + floor-index
// percentile), each pinned to a fixed seed:
//
//   imp-1160  seed 0xC0DEBEEF  (percentile, 1500 replicates)
//   imp-1166  seed 0xC51166FA  (percentile,  500 replicates)
//   imp-1185  seed 0xB10C81FA  (block,       2000 replicates, block size 3)
//
// If the mulberry32 RNG, the OLS fitter, or the percentile-index convention
// ever acquired hidden state (e.g. a module-level accumulator, a shared
// mutable buffer, or a Date/Math.random leak), then re-running the SAME
// (seed, grid, method) twice in one process would yield DIFFERENT CIs, and
// every downstream cross-validation that depends on the frozen CI would be
// silently invalidated.
//
// This module re-runs each of the three configurations TWICE in one process
// and asserts the two invocations are bit-for-bit identical (strict ===
// equality on every returned numeric field). It is the determinism contract
// for the shared skeleton, complementary to the imp-1188 reference-value
// equivalence tripwires (which pin WHAT the skeleton computes; this pins that
// it computes the SAME thing every time).
//
// HONEST SCOPE
// ------------
// (1) This checks DETERMINISM (re-run reproducibility within a process), not
//     correctness of the CI values themselves -- that is imp-1188's job.
// (2) imp-1160 upstream uses a DIFFERENT kernel (gamma-resample-then-
//     recompute), which the shared helper does not extract. For the
//     0xC0DEBEEF configuration this module therefore drives the SHARED
//     skeleton (percentile method on the fixed grid) as a determinism probe
//     of that exact seed + replicate count through the common
//     mulberry32 + OLS path. It does NOT reproduce imp-1160s gamma-kernel CI.
// (3) Strict === (not a tolerance) is intentional: a deterministic, purely
//     functional RNG MUST return identical doubles across re-runs. Any
//     nonzero difference is a regression, not floating-point noise.

import { bootstrapSlopeCI } from '../../scripts/bootstrap-ci.mjs';

// ── imp-1166 fixed-grid reference (mirrors imp-1188 verbatim) ──────────────
// 13-point linear-statistics extended grid (imp-1162) with per-N variance
// divided by log N (imp-1166 simplified Conrey-Snaith correction).
const IMP1166_GRID = Object.freeze([
  Object.freeze({ N:     100, v: 0.06864163141521673   }),
  Object.freeze({ N:     200, v: 0.033674927150899245  }),
  Object.freeze({ N:     500, v: 0.019031316441728355  }),
  Object.freeze({ N:    1000, v: 0.00731459133683924   }),
  Object.freeze({ N:    2000, v: 0.0050857413083440495 }),
  Object.freeze({ N:    5000, v: 0.001969377182859525  }),
  Object.freeze({ N:   10000, v: 0.0008558736430692803 }),
  Object.freeze({ N:   20000, v: 0.0017321519541642016 }),
  Object.freeze({ N:   50000, v: 0.0002322207486724605 }),
  Object.freeze({ N:  100000, v: 0.00014148927165190587 }),
  Object.freeze({ N:  200000, v: 0.00007771047406411212 }),
  Object.freeze({ N:  500000, v: 0.000045450210738127436 }),
  Object.freeze({ N: 1000000, v: 0.00001639811835774324 }),
]);

const X_LOG = IMP1166_GRID.map((r) => Math.log(r.N));
const Y_LOG_CORRECTED = IMP1166_GRID.map((r) => Math.log(r.v / Math.log(r.N)));

// The three downstream configurations, each pinned to its frozen seed.
const CONFIGS = Object.freeze([
  Object.freeze({
    ticket: 'imp-1160',
    seed: 0xC0DEBEEF,
    method: 'percentile',
    replicates: 1500,
  }),
  Object.freeze({
    ticket: 'imp-1166',
    seed: 0xC51166FA,
    method: 'percentile',
    replicates: 500,
  }),
  Object.freeze({
    ticket: 'imp-1185',
    seed: 0xB10C81FA,
    method: 'block',
    replicates: 2000,
    blockSize: 3,
  }),
]);

// Numeric fields that must be bit-identical across two invocations.
const NUMERIC_FIELDS = Object.freeze([
  'slope', 'intercept', 'R2', 'ci_lo', 'ci_hi', 'median', 'width',
  'replicates', 'nFinite', 'blockSize', 'seed', 'confidence',
]);

function runConfig(cfg) {
  return bootstrapSlopeCI({
    x: X_LOG,
    y: Y_LOG_CORRECTED,
    replicates: cfg.replicates,
    confidence: 0.95,
    method: cfg.method,
    seed: cfg.seed,
    blockSize: cfg.blockSize,
  });
}

// Re-run each configuration twice in this process and record bit-identity.
const REPRO = CONFIGS.map((cfg) => {
  const first = runConfig(cfg);
  const second = runConfig(cfg);
  const mismatches = [];
  for (const f of NUMERIC_FIELDS) {
    const a = first[f];
    const b = second[f];
    // Strict identity: a deterministic RNG must return the exact same double.
    // (null === null is fine for the percentile-method blockSize field.)
    if (a !== b) mismatches.push({ field: f, first: a, second: b });
  }
  return Object.freeze({
    ticket: cfg.ticket,
    seed: cfg.seed,
    method: cfg.method,
    replicates: cfg.replicates,
    identical: mismatches.length === 0,
    mismatches: Object.freeze(mismatches),
    ci_lo: first.ci_lo,
    ci_hi: first.ci_hi,
    median: first.median,
  });
});

export const IMP2752_BOOTSTRAP_DETERMINISM_DIAGNOSTIC = Object.freeze({
  id: 'imp-2752',
  ticket: 'imp-2752',
  attemptDate: '2026-06-25',
  helperPath: 'scripts/bootstrap-ci.mjs',
  goal:
    'Re-run the three percentile/block bootstrap CIs that share the ' +
    'scripts/bootstrap-ci.mjs skeleton twice each and assert each is ' +
    'bit-for-bit identical across the two invocations, catching any ' +
    'non-determinism regression in the shared mulberry32 + OLS skeleton.',
  configs: CONFIGS,
  reproductions: Object.freeze(REPRO),
  honestScope: Object.freeze([
    'Checks DETERMINISM (re-run reproducibility), not CI correctness -- ' +
    'the reference values are pinned by imp-1188.',
    'imp-1160 upstream uses a gamma-resample kernel not extracted by the ' +
    'shared helper; the 0xC0DEBEEF leg drives the shared percentile ' +
    'skeleton as a determinism probe of that seed + replicate count, not ' +
    'a reproduction of imp-1160s gamma-kernel CI.',
    'Strict === equality is intentional: a purely functional RNG must ' +
    'return identical doubles, so any difference is a regression.',
  ]),
  parallelTickets: ['imp-1160', 'imp-1166', 'imp-1185', 'imp-1188'],
});

export const IMP2752_BOOTSTRAP_DETERMINISM_ASSERTIONS = [
  {
    id: 'imp2752-imp1160-seed-deterministic-across-two-runs',
    why:
      'Re-running the shared bootstrap skeleton twice with seed 0xC0DEBEEF ' +
      '(percentile, 1500 replicates) on the fixed grid must yield bit- ' +
      'identical CI endpoints, slope, and replicate counts. A mismatch ' +
      'means the mulberry32 RNG or OLS fitter carries hidden state.',
    holds: () => REPRO[0].identical,
  },
  {
    id: 'imp2752-imp1166-seed-deterministic-across-two-runs',
    why:
      'Re-running with seed 0xC51166FA (percentile, 500 replicates) twice ' +
      'must be bit-identical. This is the imp-1166 downstream CI ' +
      'configuration; non-determinism here would invalidate the imp-1166 ' +
      'cross-validation.',
    holds: () => REPRO[1].identical,
  },
  {
    id: 'imp2752-imp1185-seed-deterministic-across-two-runs',
    why:
      'Re-running with seed 0xB10C81FA (block, 2000 replicates, block ' +
      'size 3) twice must be bit-identical. This is the imp-1185 ' +
      'block-bootstrap cross-validation configuration.',
    holds: () => REPRO[2].identical,
  },
  {
    id: 'imp2752-all-three-configs-bit-identical',
    why:
      'All three shared-skeleton configurations (imp-1160/1166/1185 seeds) ' +
      'must reproduce bit-for-bit across two invocations. This is the ' +
      'aggregate determinism contract: if any leg drifts, every downstream ' +
      'CI cross-validation built on the frozen CIs is silently invalidated.',
    holds: () =>
      REPRO.length === 3 &&
      REPRO.every((r) => r.identical && r.mismatches.length === 0),
  },
  {
    id: 'imp2752-reproductions-produce-finite-ordered-cis',
    why:
      'Each reproduced CI must be finite and properly ordered ' +
      '(ci_lo <= median <= ci_hi). A degenerate or NaN CI would make the ' +
      'bit-identity check vacuous (NaN !== NaN would also fail identity, ' +
      'so this guards the meaningfulness of the determinism assertion).',
    holds: () =>
      REPRO.every(
        (r) =>
          Number.isFinite(r.ci_lo) &&
          Number.isFinite(r.ci_hi) &&
          Number.isFinite(r.median) &&
          r.ci_lo <= r.median &&
          r.median <= r.ci_hi,
      ),
  },
];
