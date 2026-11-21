/**
 * @module imp-35640-two-rate-census-exit-edge-regression-guard
 *
 * imp-35640 (accuracy, frontier-direction) -- REGRESSION GUARD for the imp-35608 two-rate direct-census
 * EXIT-edge exponents. imp-35608 located, by 200-step exponent bisection on the imp-3220/imp-3406 double
 * surrogate, the finite ceil crossing at which the two-rate Picard predictor n_two = 1 + ceil(x_two)
 * catches the measured Picard count for p in {1,2,3}: p=1 at 10^178.3477 (+141.18 decades above the
 * nominal 10^37.167107 exit), p=2 at 10^219.4919 (+182.32) and p=3 at 10^221.7751 (+184.61). Those three
 * exponents and offsets carry NO independent assertion tripwire in the imp-35608 module beyond that
 * module re-running its own bisection, so a silent change in effectiveHeightForN, the
 * K_AMPL = (C_C/E_trunc)^2 amplitude, or the ceil/peel logic could drift the located exponents without
 * tripping a build.
 *
 * WHAT THIS MODULE DOES (import-light, fully self-contained)
 * ---------------------------------------------------------
 * This module INLINES the pure-Math surrogate VERBATIM -- the Riemann-von Mangoldt inverse
 * effectiveHeightForN (Newton iteration, no zeros bundle), the C_C = (1/8) sqrt(3 pi) ansatz value, the
 * fixed-point map g(N) = K log T0(N), the single- and two-rate ceil arguments, the directly-measured
 * Picard count, and the upward-scan-then-bisect exit locator -- with ZERO imports, so it can never
 * transitively pull the 16.7MB zeros bundle (per no_heavy_imports_in_pages) and re-bisects the exit edge
 * from first principles rather than trusting imp-35608 exports. It then asserts the three exit-edge
 * log10 N and the three decade offsets match 7-sig-fig reference literals within 1e-6 RELATIVE tolerance
 * (storage-precision tolerance). VERIFICATION TOOLING ONLY: it recomputes an established measurement,
 * changes no bound, discharges nothing; imp-35243a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35608-two-rate-census-exit-edge-location (the located edges this module guards)
 * @see imp-35572-reentry-band-terminal-width-rate-robustness (in-band zero change; census exit lower bound)
 * @see imp-34862-iters-to-floor-two-rate-law (the two-rate law and exact-peel control)
 */

// ---- Inlined constants (imp-35608 VERBATIM; no imports) --------------------------------------------
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // (1/8) sqrt(3 pi) ~ 0.3837 (imp-2642/imp-2643/imp-2714)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 amplitude
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)

// ---- Inlined Riemann-von Mangoldt inverse (lambda-rh-height-mapping.js effectiveHeightForN VERBATIM) --
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  const twoPi = 2 * Math.PI;
  let T = Math.max(twoPi * Math.E, (twoPi * N) / Math.max(1, Math.log(N + twoPi)));
  for (let i = 0; i < 40; i++) {
    const u = Math.log(T / twoPi);
    const f = (T / twoPi) * (u - 1) - N;
    const fp = u / twoPi;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > twoPi)) T = twoPi * 1.0001;
    if (Math.abs(dT) < 1e-9 * Math.max(1, T)) break;
  }
  return T;
}

// ---- Inlined fixed-point map and census predictors (imp-35608 VERBATIM) ----------------------------
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 fixed point
const R_CONTRACT = Math.abs((g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

const collapseDist = (seed) => Math.abs(g(seed) - N_CROSS_FP) / N_CROSS_FP;
const xArgSingle = (seed) => Math.log(collapseDist(seed) / EPS_FP) / LN_INV_R;
function fitEarlyRateR0(seed, p) {
  let N = g(seed);
  const d0 = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  for (let i = 0; i < p; i++) N = g(N);
  const dp = Math.abs(N - N_CROSS_FP) / N_CROSS_FP;
  return Math.pow(dp / d0, 1 / p);
}
const xArgTwoRate = (seed, p) => {
  const d0 = collapseDist(seed);
  const r0 = fitEarlyRateR0(seed, p);
  return p + (Math.log(d0 / EPS_FP) - p * Math.log(1 / r0)) / LN_INV_R;
};
const predSingle = (s) => 1 + Math.ceil(xArgSingle(s));
const predTwo = (s, p) => 1 + Math.ceil(xArgTwoRate(s, p));

function itersToFloorMeasured(seed, cap = 600) {
  let N = seed;
  let k = 0;
  while (k < cap) {
    N = g(N);
    k++;
    if (N === N_CROSS_FP) break;
  }
  return k;
}

const EXIT_EXP = 37.167107; // nominal band-off, log10 N (imp-35111/35174/35572)
const residSingleAt = (e) => predSingle(Math.pow(10, e)) - itersToFloorMeasured(Math.pow(10, e));
const residTwoAt = (e, p) => predTwo(Math.pow(10, e), p) - itersToFloorMeasured(Math.pow(10, e));

function bisectExp(lo, hi, pred) {
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (pred(m)) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}

const SCAN_START = 40;
const SCAN_CEIL = 305;
const SCAN_STEP = 1;
function locateTwoRateExit(p) {
  let prev = SCAN_START;
  for (let e = SCAN_START + SCAN_STEP; e <= SCAN_CEIL; e += SCAN_STEP) {
    if (residTwoAt(e, p) === 0 && residTwoAt(prev, p) === -1) {
      return bisectExp(prev, e, (x) => residTwoAt(x, p) === 0);
    }
    prev = e;
  }
  return NaN;
}

// ---- Independent re-bisection of the three exit edges ----------------------------------------------
const GUARD_EDGES = [1, 2, 3].map((p) => {
  const edge = locateTwoRateExit(p);
  return { p, exit_log10N: edge, decades_above_nominal: edge - EXIT_EXP };
});

// 7-sig-fig reference literals (imp-35608 located values); guarded at 1e-6 RELATIVE (storage precision).
const REFERENCE = [
  { p: 1, exit_log10N: 178.3477444, decades_above_nominal: 141.1806374 },
  { p: 2, exit_log10N: 219.4918648, decades_above_nominal: 182.3247578 },
  { p: 3, exit_log10N: 221.7750827, decades_above_nominal: 184.6079757 },
];
const REL_TOL = 1e-6;
const relClose = (got, ref) => Math.abs(got - ref) <= REL_TOL * Math.abs(ref);

export const IMP35640_TWO_RATE_CENSUS_EXIT_EDGE_REGRESSION_GUARD = {
  id: 'imp-35640',
  proofSection: 'S-frontier',
  question:
    'The imp-35608 two-rate direct-census EXIT-edge exponents (p=1: 178.3477, p=2: 219.4919, ' +
    'p=3: 221.7751 log10 N; +141.18/182.32/184.61 decades above the 37.167107 nominal exit) carry no ' +
    'independent assertion tripwire, so a silent change in effectiveHeightForN, the K = (C_C/E_trunc)^2 ' +
    'amplitude, or the ceil/peel logic could drift them without tripping a build. Add an import-light ' +
    'guard that re-bisects each edge from an inlined pure-Math surrogate (never the 16.7MB zeros bundle) ' +
    'and pins the three exit exponents and three decade offsets to 7-sig-fig reference literals within ' +
    '1e-6 relative. Verification tooling only; recomputes an established measurement; NO QED.',
  reference_edges: REFERENCE,
  guard_edges: GUARD_EDGES.map((r) => ({
    p: r.p,
    exit_log10N: +r.exit_log10N.toPrecision(10),
    decades_above_nominal: +r.decades_above_nominal.toPrecision(8),
  })),
  relative_tolerance: REL_TOL,
  finding:
    'Independent re-bisection of the imp-35608 two-rate census EXIT edge from a FULLY INLINED pure-Math ' +
    'surrogate (zero imports: the effectiveHeightForN Riemann-von Mangoldt inverse, the ' +
    'C_C = (1/8) sqrt(3 pi) ansatz value, the g(N) = K log T0(N) map, the single/two-rate ceil arguments, ' +
    'the measured Picard count, and the scan-then-bisect locator, all reproduced verbatim). The re-bisected ' +
    'exit exponents 178.3477444 (p=1), 219.4918648 (p=2), 221.7750827 (p=3) and their decade offsets ' +
    '141.1806374, 182.3247578, 184.6079757 reproduce the imp-35608 located values to 1e-6 relative, so any ' +
    'silent drift in the surrogate, the amplitude, or the ceil/peel logic now trips a build. VERIFICATION ' +
    'TOOLING ONLY: recomputes an established measurement, changes no bound, discharges nothing; imp-35243a ' +
    'stays OPEN; NO QED; no refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-35608 (two-rate census exit edge location, the guarded values); imp-35572 (in-band zero change; ' +
    'census exit lower bound); imp-34862 (the two-rate law and exact-peel control); imp-35111 (single-rate ' +
    'frac-window and direct-census band edges); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz).',
};

export const IMP35640_TWO_RATE_CENSUS_EXIT_EDGE_REGRESSION_GUARD_ASSERTIONS = [
  {
    // The inlined surrogate reproduces the inherited asymptotic contraction rate.
    id: 'imp35640-rate-matches-parent',
    description: 'r ~ 0.0454235 and ln(1/r) ~ 3.09173 (inlined surrogate matches imp-35608)',
    holds: () => Math.abs(R_CONTRACT - 0.0454235) < 1e-5 && Math.abs(LN_INV_R - 3.09173) < 1e-3,
  },
  {
    // Independent re-bisection pins all three exit exponents to the 7-sig-fig references within 1e-6 relative.
    id: 'imp35640-exit-exponents-pinned',
    description: 'exit log10 N 178.3477444 / 219.4918648 / 221.7750827 pinned within 1e-6 relative',
    holds: () =>
      GUARD_EDGES.length === 3 &&
      GUARD_EDGES.every((r, i) => relClose(r.exit_log10N, REFERENCE[i].exit_log10N)),
  },
  {
    // Independent re-bisection pins all three decade offsets to the 7-sig-fig references within 1e-6 relative.
    id: 'imp35640-decade-offsets-pinned',
    description: 'decade offsets 141.1806374 / 182.3247578 / 184.6079757 pinned within 1e-6 relative',
    holds: () =>
      GUARD_EDGES.every((r, i) => relClose(r.decades_above_nominal, REFERENCE[i].decades_above_nominal)),
  },
  {
    // Sanity: edges are finite, below the 10^308 double-overflow ceiling, and monotone increasing in p.
    id: 'imp35640-edges-finite-monotone',
    description: 'all edges finite, below the 10^308 overflow ceiling, monotone increasing in p',
    holds: () =>
      GUARD_EDGES.every((r) => Number.isFinite(r.exit_log10N) && r.exit_log10N < 308) &&
      GUARD_EDGES[0].exit_log10N < GUARD_EDGES[1].exit_log10N &&
      GUARD_EDGES[1].exit_log10N < GUARD_EDGES[2].exit_log10N,
  },
  {
    // Honesty gate: verification tooling only, changes no bound, sub-gap OPEN, no QED, no refereed bound is changed.
    id: 'imp35640-honesty-gate-no-qed',
    description: 'Verification tooling only: isRigorous false, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35640_TWO_RATE_CENSUS_EXIT_EDGE_REGRESSION_GUARD.isRigorous === false &&
      /imp-35243a\s+stays OPEN/.test(IMP35640_TWO_RATE_CENSUS_EXIT_EDGE_REGRESSION_GUARD.finding) &&
      /NO QED/.test(IMP35640_TWO_RATE_CENSUS_EXIT_EDGE_REGRESSION_GUARD.finding) &&
      /refereed bound is changed/i.test(IMP35640_TWO_RATE_CENSUS_EXIT_EDGE_REGRESSION_GUARD.finding),
  },
];

for (const a of IMP35640_TWO_RATE_CENSUS_EXIT_EDGE_REGRESSION_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35640-two-rate-census-exit-edge-regression-guard assertion failed: ${a.id}`);
  }
}
