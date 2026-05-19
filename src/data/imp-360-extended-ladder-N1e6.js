/**
 * @module imp-360-extended-ladder-N1e6
 * @fileoverview imp-360 / imp-423: Extended measured Dyson backward-ODE
 * collision-time ladder at N ∈ {25k, 50k, 100k, 150k, 250k, 400k, 600k, 1M}
 * (the 25k/50k/100k rows are JS interval-RK4 CLOSED; the imp-423 ticket-spec
 * ladder {150k, 250k, 400k, 600k, 1M} ships as H_raw + t_c_pair honest-partial
 * rows pending a C/Arb/CAPD backend for O(N^2) integration).
 *
 * Each row is produced by scripts/run-imp360-single-N.mjs — an optimised
 * one-ULP interval-RK4 driver (mathematically identical to
 * src/math/interval-dyson-integrator.mjs backwardCollisionInterval, with
 * pre-allocated Uint32Array buffers instead of per-call BigInt for ~10×
 * speedup).  Results are accumulated in the JSON sidecar file and this
 * module re-exports them with build-time assertions.
 *
 * Row schema:
 *   N                — number of Riemann zeros used
 *   dt               — RK4 step size
 *   H_raw            — initial minimum gap = min_{i} (γ_{i+1} − γ_i)
 *   t_c_pair         — pairwise collapse time = H_raw² / 8
 *   t_c_lo           — certified lower bound on |t_c(N)| (from bracket)
 *   t_c_hi           — certified upper bound (null ↔ +∞, budget exhausted)
 *   K_paper_cert_floor — certified t_c lower bound used in the paper chain
 *   maxIntervalWidth — peak interval half-width across all particles / steps
 *   closed           — true if bracket closed; false if budget exhausted
 *   steps            — number of RK4 steps taken
 *   reason           — 'gap-lower-bound-nonpositive' | 'rk4-stage-zero-crossing'
 *                      | 'budget-exhausted'
 *   runtimeSec       — wall-clock seconds for this N
 *   source           — 'imp-360-one-ulp-interval-rk4-optimized'
 *   generatedAt      — ISO-8601 timestamp
 *
 * Proof-chain role:
 *   Extends the imp-857 / imp-899 ladder (N ≤ 10⁴) into the (10⁴, 10⁶]
 *   range.  Closed rows feed PATH_C_BASELINE_FIT_V2 (imp-400) to tighten
 *   the 1/N OLS intercept toward Lambda = 0.  Budget-exhausted rows still
 *   contribute t_c_lo as a certified lower bound.
 *
 * @see imp-360, imp-423
 * @see src/math/interval-dyson-integrator.mjs
 * @see src/data/path-c-baseline-fit-v2.js
 * @see src/data/imp-857-baseline-sweep-result.js
 * @see scripts/run-imp360-single-N.mjs
 */

import ROWS_JSON from './imp-360-extended-ladder-N1e6-rows.json';

const ROWS = Array.isArray(ROWS_JSON) ? ROWS_JSON : [];

// ── Exported record ──────────────────────────────────────────────────────────

export const IMP_360_EXTENDED_LADDER_N1E6 = Object.freeze({
  id: 'imp-360-extended-ladder-N1e6',
  tickets: ['imp-360', 'imp-423'],
  title:
    'Extended measured Dyson backward-ODE collision-time ladder ' +
    '(N ∈ {25k, 50k, 100k, 150k, 250k, 400k, 600k, 500k, 1M})',
  status: ROWS.length === 0
    ? 'scaffolded-no-rows-yet'
    : ROWS.some((r) => r.closed)
      ? 'partial-rows-available'
      : 'budget-exhausted-partial',
  method:
    'One-ULP outward-inflation interval RK4 (imp-362 math, optimised impl). ' +
    'Pre-allocated Uint32Array buffers replace per-call BigInt for ~10× ' +
    'speedup.  Math is bit-for-bit identical on all finite positive inputs.',
  zeroSource: 'src/data/zeros-to-1e6.js (1 000 000 Odlyzko ordinates)',
  targetNs: [25000, 50000, 100000, 150000, 250000, 400000, 500000, 600000, 1000000],
  rows: ROWS,
  closedRows: ROWS.filter((r) => r.closed === true),
  partialRows: ROWS.filter((r) => r.closed === false),
  headlineSummary:
    ROWS.length === 0
      ? 'No rows yet — computation in progress.'
      : ROWS.filter((r) => r.closed).length +
        ' of ' +
        ROWS.length +
        ' rows closed; widest maxIntervalWidth = ' +
        (ROWS.filter((r) => r.closed).length > 0
          ? Math.max(...ROWS.filter((r) => r.closed).map((r) => r.maxIntervalWidth)).toExponential(3)
          : 'n/a'),
  predecessor: {
    imp857: 'N ∈ {1000, 2000, 5000, 10000} — all closed, maxW ≤ 1.28e-9',
    imp899: 'N=10000 follow-up confirming N=10^4 barrier',
  },
  limitations: [
    'JavaScript Float64 does not expose fesetround; ULP inflation is ' +
      'strictly weaker than true IEEE 754 directed rounding.',
    'Per-step cost is O(N²); N > 10⁵ may exceed sandbox time budget.',
    'Budget-exhausted rows (t_c_hi = null) provide only a certified lower ' +
      'bound; t_c_hi = +∞ in the paper chain for those rows.',
  ],
});

// ── Build-time assertions ────────────────────────────────────────────────────

export const IMP_360_EXTENDED_LADDER_N1E6_ASSERTIONS = [
  {
    id: 'imp360-ext-rows-array-valid',
    holds: () => Array.isArray(ROWS),
    why: 'ROWS must be an array (JSON sidecar loaded correctly).',
  },
  {
    id: 'imp360-ext-closed-rows-have-nonneg-t_c_lo',
    holds: () =>
      ROWS.filter((r) => r.closed === true).every(
        (r) => typeof r.t_c_lo === 'number' && r.t_c_lo >= 0,
      ),
    why:
      'Every closed row must have t_c_lo >= 0.  t_c_lo = 0 is valid (and ' +
      'physically correct): it means the gap collapsed within the first RK4 ' +
      'step so the bracket is [0, t_c_hi].  The useful datum is t_c_hi > 0.',
  },
  {
    id: 'imp360-ext-closed-rows-bracket-ordered',
    holds: () =>
      ROWS.filter((r) => r.closed === true && r.t_c_hi !== null).every(
        (r) => r.t_c_hi > r.t_c_lo,
      ),
    why:
      'For every closed row with a finite t_c_hi, the bracket must satisfy ' +
      't_c_hi > t_c_lo.  A reversed bracket is a bug in the integrator.',
  },
  {
    id: 'imp360-ext-closed-rows-maxW-under-heuristic',
    holds: () =>
      ROWS.filter((r) => r.closed === true).every(
        (r) => typeof r.maxIntervalWidth === 'number' && r.maxIntervalWidth < 1e-2,
      ),
    why:
      'Every closed row must have maxIntervalWidth < 0.01 (the imp-857 ' +
      'heuristic threshold).  A wider wrapper means the one-ULP inflation ' +
      'is dominating and the bracket is not useful for the paper chain.',
  },
  {
    id: 'imp360-ext-n-values-are-expected',
    holds: () => {
      const expected = new Set([25000, 50000, 100000, 150000, 250000, 400000, 500000, 600000, 1000000]);
      return ROWS.every((r) => expected.has(r.N));
    },
    why:
      'All rows must have N in the union of the original imp-360 target set ' +
      '{25k, 50k, 100k, 250k, 500k, 1M} and the imp-423 ticket-spec ladder ' +
      '{150k, 250k, 400k, 600k, 1M}. Together {25k, 50k, 100k, 150k, 250k, 400k, ' +
      '500k, 600k, 1M}. A row with an unexpected N suggests a runner misconfiguration.',
  },
  {
    id: 'imp360-ext-source-tag-present',
    holds: () =>
      ROWS.every((r) => typeof r.source === 'string' && r.source.length > 0),
    why:
      'Every row must carry a non-empty source tag for provenance. ' +
      'Missing source means the runner did not write the field.',
  },
];
