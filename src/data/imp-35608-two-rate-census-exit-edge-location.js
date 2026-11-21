/**
 * @module imp-35608-two-rate-census-exit-edge-location
 *
 * imp-35608 (numerical, frontier-direction) -- LOCATE the exact two-rate direct-census EXIT edge that imp-35572
 * left as a lower bound. imp-35572 measured that adding the imp-34862 early-transient second contraction rate to
 * the single-rate iters-to-floor map changes the terminal off-by-one over the imp-34997/imp-35111 reentry band
 * [10^27.084691, 10^37.167107] by ZERO iterates in-band, and that the ONLY rate-sensitivity is the ceil-crossing
 * census EXIT edge, which the negative two-rate phase offset pushes far above the nominal band. But imp-35572 only
 * PROBED the tail: it reported the two-rate residual resid = n_two - measured stays -1 at 10^60 (exit ">20 decades"
 * above nominal) and never bisected the exponent where n_two finally catches the measured Picard count 14. This
 * module bisects that exit edge exactly for p in {1,2,3}. ASSESSMENT ONLY: it discharges nothing; imp-35243a stays
 * OPEN; changes no bound; NO QED.
 *
 * THE MAP (imp-35572 / imp-35331 / imp-35111 / imp-34862 VERBATIM, double surrogate imp-3220/imp-3406)
 * ---------------------------------------------------------------------------------------------------
 * TWO-RATE ceil argument (imp-34862 ratio-fit): x_two(seed, p) = p + [log(delta_0/EPS_FP) - p log(1/r_0)]/ln(1/r),
 *   contracting at an early-transient rate r_0 = (delta_p/delta_0)^(1/p) for the first p post-collapse iterates,
 *   then at the asymptotic rate r; n_two(seed) = 1 + ceil(x_two). resid(e) = n_two(10^e) - measured Picard count.
 *
 * WHAT IS MEASURED
 * ----------------
 * For p in {1,2,3}, a deterministic upward exponent scan from just above the single-rate exit (10^40) to the
 * IEEE-754 double-overflow ceiling (10^305; 10^308 already returns NaN because 10^308 overflows to Infinity),
 * bracketing the first e where resid steps -1 -> 0, then a 200-step exponent bisection of that bracket. This
 * locates the exact log10 N at which n_two catches the measured Picard count 14 (resid -> 0), and the decade
 * offset of that edge above both the nominal exit (10^37.167107) and the single-rate census exit (~10^37.16711).
 *
 * THE RESULT: THE EXIT EDGE IS FINITE, LOCATED, AND ~141/182/185 DECADES ABOVE THE NOMINAL EXIT
 * --------------------------------------------------------------------------------------------
 * The census exit edge is NOT merely ">20 decades" (imp-35572 lower bound); it is a finite, well-defined ceil
 * crossing:
 *   p = 1: exit at 10^178.3477  ->  +141.18 decades above the nominal 10^37.167107 exit.
 *   p = 2: exit at 10^219.4919  ->  +182.32 decades.
 *   p = 3: exit at 10^221.7751  ->  +184.61 decades.
 * The single-rate census exit sits at 10^37.167107 (bit-matching imp-35111/imp-35572), so the offsets above the
 * single-rate exit equal the offsets above nominal to 8 figures. The two-rate law therefore delays the far-above-
 * band ceil crossing by ~141-185 decades but, per imp-35572, leaves EVERY in-band seed count unchanged. The edge
 * grows with p because a larger early-rate window deepens the negative phase offset, holding x_two below the next
 * integer for longer. All three edges lie comfortably below the 10^308 double-overflow ceiling, so each is a
 * genuinely located crossing rather than an artifact of running out of representable range.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A direct exponent bisection of the two-rate census exit edge on the inherited imp-3220/imp-3406 double
 * surrogate, IEEE-754 double precision (point rate estimates, no interval enclosure). It sharpens the imp-35572
 * lower bound (">20 decades / at least 10^60") to an exact located edge; it discharges NOTHING: imp-35111a /
 * imp-35174a / imp-35243a stay OPEN; the reentry band stays NOT ESTABLISHED as a feature of the true dynamic
 * (R1/R4 binding). MEASUREMENT ONLY; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35572-reentry-band-terminal-width-rate-robustness (in-band zero change; census exit left as a >=10^60 lower bound)
 * @see imp-35331-reentry-band-two-rate-phase-drift (two-rate frac-window relocation; census at 4 sampled points)
 * @see imp-34862-iters-to-floor-two-rate-law (the two-rate law and exact-peel control; off-by-one is terminal)
 * @see imp-35111-off-by-one-reentry-band-width (single-rate frac-window and direct-census band edges)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (R1-R4 certificate; imp-35243a OPEN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34862/34997/35111/35243/35331/35572)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)

// The shared imp-34862/imp-35111/imp-35331/imp-35572 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-34862/35111/35331/35572)
const R_CONTRACT = Math.abs((g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2); // ~0.0454235 (single asymptotic rate)
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

// Post-collapse relative distance and the SINGLE-rate / TWO-rate ceil arguments (imp-35111/imp-35331/35572 VERBATIM).
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

// Directly-measured Picard count: iterate g until bit-identical to the fixed point (imp-35111/35572 VERBATIM).
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

const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // nominal band-off, log10 N (imp-35111/35174/35572)

// Census residuals (predicted - measured Picard count) under single and two-rate, indexed by log10 N.
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

// Deterministic upward scan from just above the single-rate exit (10^40) to the IEEE-754 double-overflow ceiling
// (10^305; 10^308 already returns NaN because Math.pow(10, 308) overflows to Infinity, so resid is undefined
// there). Bracket the first exponent where resid steps -1 -> 0, then bisect that bracket for the exact edge.
const SCAN_START = 40;
const SCAN_CEIL = 305;
const SCAN_STEP = 1;
const OVERFLOW_CEILING_EXP = 308; // Math.pow(10, 308) === Infinity => resid NaN above this (record only)
function locateTwoRateExit(p) {
  let prev = SCAN_START;
  for (let e = SCAN_START + SCAN_STEP; e <= SCAN_CEIL; e += SCAN_STEP) {
    if (residTwoAt(e, p) === 0 && residTwoAt(prev, p) === -1) {
      return bisectExp(prev, e, (x) => residTwoAt(x, p) === 0);
    }
    prev = e;
  }
  return NaN; // edge not located below the overflow ceiling (should not happen for p in {1,2,3})
}

const CENSUS_EXIT_SINGLE = bisectExp(30, 45, (e) => residSingleAt(e) === 0); // ~37.167107 (imp-35111/35572)
const TWO_RATE_EXIT_EDGES = [1, 2, 3].map((p) => {
  const edge = locateTwoRateExit(p);
  return {
    p,
    exit_log10N: +edge.toPrecision(10), // exact ceil-crossing exponent under the two-rate law
    decades_above_nominal: +(edge - EXIT_EXP).toPrecision(8), // offset above the nominal 10^37.167107 exit
    decades_above_single: +(edge - CENSUS_EXIT_SINGLE).toPrecision(8), // offset above the single-rate census exit
  };
});
const ALL_EDGES_FINITE = TWO_RATE_EXIT_EDGES.every((r) => Number.isFinite(r.exit_log10N));
const ALL_EDGES_BELOW_OVERFLOW = TWO_RATE_EXIT_EDGES.every((r) => r.exit_log10N < OVERFLOW_CEILING_EXP);
const EDGE_MONOTONE_IN_P =
  TWO_RATE_EXIT_EDGES[0].exit_log10N < TWO_RATE_EXIT_EDGES[1].exit_log10N &&
  TWO_RATE_EXIT_EDGES[1].exit_log10N < TWO_RATE_EXIT_EDGES[2].exit_log10N;

export const IMP35608_TWO_RATE_CENSUS_EXIT_EDGE_LOCATION = {
  id: 'imp-35608',
  proofSection: 'S-frontier',
  question:
    'imp-35572 measured that the two-rate contraction law leaves the terminal off-by-one unchanged across the ' +
    'nominal reentry band [10^27.08, 10^37.17] and that the ONLY rate-sensitivity is the ceil-crossing census ' +
    'EXIT edge, which it reported only as a lower bound (resid stays -1 out to at least 10^60, edge unlocated). ' +
    'Locate that exit edge exactly: bisect the exponent where n_two = 1 + ceil(x_two) catches the measured ' +
    'Picard count 14 (resid -> 0) for p in {1,2,3}, and tabulate how many decades above the nominal exit ' +
    '(10^37.167107) the two-rate law pushes the census edge. Measurement only on the surrogate iterate-count; ' +
    'imp-35243a stays OPEN; changes no bound; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    eps_fp_floor: EPS_FP, // 2.3e-16
    reentry_exponent_log10N: REENTRY_EXP, // 27.084691
    nominal_exit_exponent_log10N: EXIT_EXP, // 37.167107
    single_rate_census_exit_log10N: +CENSUS_EXIT_SINGLE.toPrecision(8), // ~37.167107
    double_overflow_ceiling_log10N: OVERFLOW_CEILING_EXP, // 308: resid NaN above this (Math.pow(10, 308) === Infinity)
  },
  two_rate_census_exit_edges: TWO_RATE_EXIT_EDGES, // p in {1,2,3}: exit_log10N, decades_above_nominal, decades_above_single
  all_edges_finite: ALL_EDGES_FINITE, // true: every exit edge located below the overflow ceiling
  edge_grows_with_p: EDGE_MONOTONE_IN_P, // true: a larger early-rate window deepens the negative offset, delaying the crossing
  finding:
    'Exponent bisection of the two-rate direct-census EXIT edge imp-35572 left as a lower bound. Under the ' +
    'imp-34862 two-rate ceil map n_two = 1 + ceil(x_two) on the inherited imp-3220/imp-3406 double surrogate, ' +
    'the census residual resid = n_two - measured (measured Picard count 14 throughout) steps -1 -> 0 at a ' +
    'FINITE, well-defined ceil crossing for each p, located far above the nominal band: p=1 at 10^178.3477 ' +
    '(+141.18 decades above the nominal 10^37.167107 exit), p=2 at 10^219.4919 (+182.32 decades), p=3 at ' +
    '10^221.7751 (+184.61 decades). The single-rate census exit sits at 10^37.167107 (bit-matching imp-35111/' +
    'imp-35572), so the offsets above the single-rate exit equal the offsets above nominal to 8 figures. All ' +
    'three edges lie well below the 10^308 IEEE-754 double-overflow ceiling, so each is a genuinely located ' +
    'crossing, not an artifact of exhausting representable range. The edge grows monotonically with p because a ' +
    'larger early-rate window deepens the negative two-rate phase offset, holding x_two below the next integer ' +
    'for longer. This SHARPENS the imp-35572 lower bound (">20 decades / at least 10^60") to exact located ' +
    'edges, and is consistent with imp-35572 in-band: the two-rate law delays the far-above-band ceil crossing ' +
    'by ~141-185 decades while leaving EVERY in-band seed count unchanged.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The two-rate direct-census EXIT edge imp-35572 ' +
    'reported only as a lower bound (resid still -1 at 10^60) is here LOCATED exactly by exponent bisection: the ' +
    'residual steps -1 -> 0 at 10^178.3477 (p=1, +141.18 decades above the nominal 10^37.167107 exit), ' +
    '10^219.4919 (p=2, +182.32 decades) and 10^221.7751 (p=3, +184.61 decades), each a finite ceil crossing ' +
    'well below the 10^308 double-overflow ceiling and monotone in p. The single-rate census exit is unmoved at ' +
    '10^37.167107. This confirms the imp-35572 picture -- the second rate only DELAYS the far-above-band exit ' +
    'edge, by ~141-185 decades, and never alters an in-band count. IEEE-754 double precision, point rate ' +
    'estimates (no interval enclosure), on the inherited imp-3220/imp-3406 surrogate; discharges NOTHING; ' +
    'imp-35111a / imp-35174a / imp-35243a stay OPEN; the reentry band stays NOT ESTABLISHED as a feature of the ' +
    'true dynamic (R1/R4 binding); the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35572 (in-band zero change; census exit left as a >=10^60 lower bound); imp-35331 (two-rate frac-window ' +
    'relocation; census at 4 sampled points); imp-34862 (the two-rate law and exact-peel control); imp-35111 ' +
    '(single-rate frac-window and direct-census band edges); imp-35243 (R1-R4 certificate, imp-35243a OPEN); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz).',
};

export const IMP35608_TWO_RATE_CENSUS_EXIT_EDGE_LOCATION_ASSERTIONS = [
  {
    // The asymptotic rate matches the inherited imp-34862/imp-35111/imp-35331/imp-35572 surrogate.
    id: 'imp35608-rate-matches-parent',
    description: 'r ~ 0.0454235 and ln(1/r) ~ 3.09173 (identical to imp-34862/imp-35111/imp-35331/imp-35572)',
    holds: () =>
      Math.abs(R_CONTRACT - 0.0454235) < 1e-5 &&
      Math.abs(LN_INV_R - 3.09173) < 1e-3,
  },
  {
    // The single-rate census exit is unmoved at the nominal 10^37.167107 (bit-matching imp-35111/imp-35572).
    id: 'imp35608-single-exit-unmoved',
    description: 'single-rate census exit ~10^37.167107 (matches the nominal band-off exponent)',
    holds: () => Math.abs(CENSUS_EXIT_SINGLE - EXIT_EXP) < 1e-2,
  },
  {
    // THE RESULT: every two-rate exit edge is located FINITELY, below the overflow ceiling, and grows with p.
    id: 'imp35608-exit-edges-located-finite',
    description: 'p in {1,2,3} exit edges located finite (< 10^308 ceiling), monotone increasing in p',
    holds: () =>
      TWO_RATE_EXIT_EDGES.length === 3 &&
      ALL_EDGES_FINITE &&
      ALL_EDGES_BELOW_OVERFLOW &&
      EDGE_MONOTONE_IN_P,
  },
  {
    // The located edges match the bisected values ~141/182/185 decades above the nominal exit.
    id: 'imp35608-exit-edge-offsets',
    description: 'exit edges 10^178.35 (+141.18), 10^219.49 (+182.32), 10^221.78 (+184.61) decades above nominal',
    holds: () =>
      Math.abs(TWO_RATE_EXIT_EDGES[0].exit_log10N - 178.3477444) < 1e-3 &&
      Math.abs(TWO_RATE_EXIT_EDGES[1].exit_log10N - 219.4918648) < 1e-3 &&
      Math.abs(TWO_RATE_EXIT_EDGES[2].exit_log10N - 221.7750827) < 1e-3 &&
      Math.abs(TWO_RATE_EXIT_EDGES[0].decades_above_nominal - 141.18064) < 1e-3 &&
      Math.abs(TWO_RATE_EXIT_EDGES[1].decades_above_nominal - 182.32476) < 1e-3 &&
      Math.abs(TWO_RATE_EXIT_EDGES[2].decades_above_nominal - 184.60798) < 1e-3,
  },
  {
    // The located edges all exceed the imp-35572 >20-decade / 10^60 lower bound they sharpen.
    id: 'imp35608-sharpens-35572-lower-bound',
    description: 'every located exit edge exceeds the imp-35572 lower bound (> 60 in log10 N, > 20 decades above exit)',
    holds: () =>
      TWO_RATE_EXIT_EDGES.every((r) => r.exit_log10N > 60 && r.decades_above_nominal > 20),
  },
  {
    // Honesty gate: measurement only, sharpens imp-35572, discharges nothing, sub-gap OPEN, no QED, no refereed bound is changed.
    id: 'imp35608-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35608_TWO_RATE_CENSUS_EXIT_EDGE_LOCATION.isRigorous === false &&
      /imp-35243a stay OPEN/.test(IMP35608_TWO_RATE_CENSUS_EXIT_EDGE_LOCATION.verdict) &&
      /NO QED/.test(IMP35608_TWO_RATE_CENSUS_EXIT_EDGE_LOCATION.verdict) &&
      /refereed bound is changed/i.test(IMP35608_TWO_RATE_CENSUS_EXIT_EDGE_LOCATION.verdict),
  },
];

for (const a of IMP35608_TWO_RATE_CENSUS_EXIT_EDGE_LOCATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35608-two-rate-census-exit-edge-location assertion failed: ${a.id}`);
  }
}
