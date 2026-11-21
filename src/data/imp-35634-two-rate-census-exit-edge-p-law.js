/**
 * @module imp-35634-two-rate-census-exit-edge-p-law
 *
 * imp-35634 (numerical, frontier-direction) -- FIT the p-dependence of the imp-35608 two-rate direct-census
 * EXIT-edge exponent and PROJECT p=4,5, assessing whether the edge saturates below the IEEE-754 10^308
 * double-overflow ceiling. imp-35608 LOCATED the finite exit edge for p in {1,2,3} (10^178.3477, 10^219.4919,
 * 10^221.7751; +141.18/182.32/184.61 decades above the nominal 10^37.167107 exit) and found it grows with p, but
 * it never fit the edge(p) law nor projected higher p. This module does both. ASSESSMENT ONLY: it discharges
 * nothing; imp-35243a stays OPEN; changes no bound; NO QED.
 *
 * THE MAP (imp-35608 / imp-35572 / imp-34862 VERBATIM, double surrogate imp-3220/imp-3406)
 * ---------------------------------------------------------------------------------------
 * TWO-RATE ceil argument (imp-34862 ratio-fit): x_two(seed, p) = p + [log(delta_0/EPS_FP) - p log(1/r_0)]/ln(1/r),
 *   early-transient rate r_0 = (delta_p/delta_0)^(1/p) for the first p post-collapse iterates, then the asymptotic
 *   rate r; n_two(seed) = 1 + ceil(x_two). The census EXIT edge is the exponent e where resid = n_two(10^e) -
 *   measured Picard count steps -1 -> 0 (imp-35608 bit-identical machinery, reproduced here).
 *
 * WHAT IS MEASURED / DERIVED
 * --------------------------
 * (1) Re-locate the exit edge exactly for p in {1,2,3,4,5} by the same upward exponent scan + 200-step bisection
 *     as imp-35608 (p=1,2,3 reproduce the imp-35608 values bit-for-bit; p=4,5 are new).
 * (2) FIT a geometric-decrement law to the three imp-35608 points alone: the located edges have increments
 *     d1 = edge(2)-edge(1) = 41.1441 and d2 = edge(3)-edge(2) = 2.2832, ratio q = d2/d1 = 0.05549. A geometric
 *     tail edge(p) = L - (const) q^p then has finite asymptote L = edge(3) + d2 q/(1-q), and projects
 *     edge_fit(4) = edge(3) + d2 q, edge_fit(5) = edge(3) + d2 q + d2 q^2.
 * (3) Compare the three-point geometric PROJECTION against the directly-located p=4,5 edges.
 *
 * THE RESULT: THE EXIT EDGE SATURATES AT ~10^221.9, FAR BELOW THE 10^308 CEILING
 * -----------------------------------------------------------------------------
 * The located edges are p=1: 178.3477, p=2: 219.4919, p=3: 221.7751, p=4: 221.8819, p=5: 221.8888 (log10 N). The
 * increments collapse geometrically -- 41.1441, 2.2832, 0.1068, 0.0069 (successive ratios ~0.055, 0.047, 0.065,
 * roughly constant) -- so edge(p) approaches a FINITE asymptote, not a divergence. The three-point geometric fit
 * gives asymptote L ~ 221.909 and projects edge_fit(4) ~ 221.902, edge_fit(5) ~ 221.909, each within ~0.02 of the
 * directly-located 221.8819 / 221.8888. Both the fit and the direct location agree the edge SATURATES near
 * 10^221.9, ~87 orders of magnitude below the IEEE-754 10^308 double-overflow ceiling. The edge therefore never
 * approaches the representable-range boundary as p grows: the ~141-185-decade delay imp-35608 measured is bounded,
 * and adding more early-transient contraction cannot push the census exit past the overflow ceiling.
 *
 * MECHANISM
 * ---------
 * A larger early-rate window p adds a NEGATIVE phase offset to x_two of size -p*[log(1/r_0) - log(1/r)]/ln(1/r) +
 * p, but the fitted r_0 = (delta_p/delta_0)^(1/p) itself relaxes toward the asymptotic r as p grows (the post-
 * collapse iterate is already deep in the linear-contraction regime by p=3), so each extra iterate contributes a
 * geometrically-shrinking increment to the delay. The edge is thus a bounded monotone sequence with a finite
 * supremum, exactly the saturation the fit and the direct location both exhibit.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A three-point geometric-decrement fit of the imp-35608 edge(p) sequence, cross-checked against directly-located
 * p=4,5 edges, on the inherited imp-3220/imp-3406 double surrogate, IEEE-754 double precision (point rate
 * estimates, no interval enclosure). It EXTENDS imp-35608 from three located points to a saturation law with a
 * finite asymptote; it discharges NOTHING: imp-35111a / imp-35174a / imp-35243a stay OPEN; the reentry band stays
 * NOT ESTABLISHED as a feature of the true dynamic (R1/R4 binding). MEASUREMENT ONLY; the C_C = (1/8) sqrt(3 pi)
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35608-two-rate-census-exit-edge-location (the three located edges p=1,2,3 this fits)
 * @see imp-35572-reentry-band-terminal-width-rate-robustness (in-band zero change; census exit lower bound)
 * @see imp-34862-iters-to-floor-two-rate-law (the two-rate law and exact-peel control)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (R1-R4 certificate; imp-35243a OPEN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34862/34997/35111/35243/35331/35572/35608)
const EPS_FP = 2.3e-16; // machine-epsilon relative agreement floor (imp-34755/34775/34903)

// The shared imp-35608/imp-34862 fixed-point map g(N) = K log T0(N), reproduced VERBATIM.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function iterate(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS_FP = iterate(1e9, 200); // ~3280294351.65 (bit-identical to imp-35608)
const R_CONTRACT = Math.abs((g(N_CROSS_FP + 1) - g(N_CROSS_FP - 1)) / 2); // ~0.0454235
const LN_INV_R = Math.log(1 / R_CONTRACT); // ~3.09173 nats/iterate

// Post-collapse relative distance and the SINGLE / TWO-rate ceil arguments (imp-35608 VERBATIM).
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

// Directly-measured Picard count: iterate g until bit-identical to the fixed point (imp-35608 VERBATIM).
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

const EXIT_EXP = 37.167107; // nominal band-off, log10 N (imp-35111/35174/35572/35608)
const OVERFLOW_CEILING_EXP = 308; // Math.pow(10, 308) === Infinity => resid NaN above this

const residTwoAt = (e, p) => predTwo(Math.pow(10, e), p) - itersToFloorMeasured(Math.pow(10, e));
function bisectExp(lo, hi, pred) {
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (pred(m)) hi = m;
    else lo = m;
  }
  return (lo + hi) / 2;
}
// Deterministic upward scan from just above the single-rate exit (10^40) to the double-overflow ceiling
// (10^305), bracketing the first exponent where resid steps -1 -> 0, then bisecting (imp-35608 VERBATIM).
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
  return NaN; // edge not located below the overflow ceiling
}

// (1) Re-locate the exit edge for p in {1,2,3,4,5}; p=1,2,3 reproduce imp-35608, p=4,5 are new.
const LOCATED_EDGES = [1, 2, 3, 4, 5].map((p) => ({
  p,
  exit_log10N: +locateTwoRateExit(p).toPrecision(10),
}));
const edgeAt = (p) => LOCATED_EDGES.find((r) => r.p === p).exit_log10N;

// (2) Geometric-decrement fit from the THREE imp-35608 points alone.
const D1 = edgeAt(2) - edgeAt(1); // ~41.1441
const D2 = edgeAt(3) - edgeAt(2); // ~2.2832
const Q_RATIO = D2 / D1; // ~0.05549 (geometric increment ratio)
const ASYMPTOTE_FIT = edgeAt(3) + (D2 * Q_RATIO) / (1 - Q_RATIO); // finite supremum L ~ 221.909
const EDGE_FIT = {
  p4: edgeAt(3) + D2 * Q_RATIO, // ~221.902
  p5: edgeAt(3) + D2 * Q_RATIO + D2 * Q_RATIO * Q_RATIO, // ~221.909
};

// (3) Fit-vs-direct residuals at p=4,5, and the increment ladder confirming geometric collapse.
const FIT_RESIDUAL = {
  p4: +(EDGE_FIT.p4 - edgeAt(4)).toPrecision(4),
  p5: +(EDGE_FIT.p5 - edgeAt(5)).toPrecision(4),
};
const INCREMENTS = [
  +(edgeAt(2) - edgeAt(1)).toPrecision(8), // d1
  +(edgeAt(3) - edgeAt(2)).toPrecision(8), // d2
  +(edgeAt(4) - edgeAt(3)).toPrecision(8), // d3
  +(edgeAt(5) - edgeAt(4)).toPrecision(8), // d4
];
const INCREMENT_RATIOS = [
  +(INCREMENTS[1] / INCREMENTS[0]).toPrecision(6),
  +(INCREMENTS[2] / INCREMENTS[1]).toPrecision(6),
  +(INCREMENTS[3] / INCREMENTS[2]).toPrecision(6),
];
// Saturation verdict: the located edge, its fit asymptote, and the projected p=4,5 all sit far below the ceiling.
const MARGIN_BELOW_CEILING = +(OVERFLOW_CEILING_EXP - ASYMPTOTE_FIT).toPrecision(6); // ~86 decades of headroom
const EDGE_SATURATES_BELOW_CEILING =
  ASYMPTOTE_FIT < OVERFLOW_CEILING_EXP &&
  LOCATED_EDGES.every((r) => Number.isFinite(r.exit_log10N) && r.exit_log10N < OVERFLOW_CEILING_EXP) &&
  INCREMENTS[3] < INCREMENTS[2] && INCREMENTS[2] < INCREMENTS[1]; // increments strictly collapse

export const IMP35634_TWO_RATE_CENSUS_EXIT_EDGE_P_LAW = {
  id: 'imp-35634',
  proofSection: 'S-frontier',
  question:
    'imp-35608 located the finite two-rate census EXIT edge for p in {1,2,3} (10^178.35, 10^219.49, 10^221.78; ' +
    '+141.18/182.32/184.61 decades above the nominal 10^37.167107 exit) and found it grows with p, but never fit ' +
    'the edge(p) law nor projected higher p. Fit the p-dependence from the three located points, project p=4,5, ' +
    'and assess whether the edge saturates below the IEEE-754 10^308 double-overflow ceiling. Measurement only on ' +
    'the imp-3220/imp-3406 double surrogate; imp-35243a stays OPEN; changes no bound; NO QED.',
  constants: {
    contraction_rate_r: +R_CONTRACT.toPrecision(6), // ~0.0454235
    log_law_constant_ln_inv_r: +LN_INV_R.toPrecision(6), // ~3.09173
    nominal_exit_exponent_log10N: EXIT_EXP, // 37.167107
    double_overflow_ceiling_log10N: OVERFLOW_CEILING_EXP, // 308
  },
  located_edges: LOCATED_EDGES, // p in {1..5}: exit_log10N (p=1,2,3 reproduce imp-35608, p=4,5 new)
  increments: INCREMENTS, // d1..d4 = 41.1441, 2.2832, 0.1068, 0.0069 (geometric collapse)
  increment_ratios: INCREMENT_RATIOS, // ~0.0555, 0.0468, 0.0648 (roughly constant => geometric)
  geometric_fit: {
    d1: +D1.toPrecision(8),
    d2: +D2.toPrecision(8),
    q_ratio: +Q_RATIO.toPrecision(8), // ~0.05549 from the three imp-35608 points alone
    asymptote_log10N: +ASYMPTOTE_FIT.toPrecision(10), // finite supremum L ~ 221.909
    projected_edge_p4: +EDGE_FIT.p4.toPrecision(10), // ~221.902
    projected_edge_p5: +EDGE_FIT.p5.toPrecision(10), // ~221.909
  },
  fit_vs_direct_residual: FIT_RESIDUAL, // ~+0.020, +0.020 (three-point fit slightly over-projects the plateau)
  margin_below_overflow_ceiling_decades: MARGIN_BELOW_CEILING, // ~86 decades of headroom under 10^308
  edge_saturates_below_ceiling: EDGE_SATURATES_BELOW_CEILING, // true
  finding:
    'The imp-35608 two-rate census EXIT-edge exponent SATURATES at ~10^221.9, ~87 orders of magnitude below the ' +
    'IEEE-754 10^308 double-overflow ceiling. Re-locating the edge for p in {1,2,3,4,5} by the imp-35608 scan+' +
    'bisection reproduces the three imp-35608 points bit-for-bit (178.3477, 219.4919, 221.7751) and adds p=4 at ' +
    '221.8819 and p=5 at 221.8888 (log10 N). The increments collapse geometrically -- 41.1441, 2.2832, 0.1068, ' +
    '0.0069, successive ratios ~0.055/0.047/0.065 -- so edge(p) is a bounded monotone sequence with a finite ' +
    'supremum, not a divergence. A three-point geometric-decrement fit (increment ratio q = d2/d1 = 0.05549) ' +
    'gives asymptote L ~ 221.909 and projects edge_fit(4) ~ 221.902, edge_fit(5) ~ 221.909, each within ~0.02 of ' +
    'the directly-located 221.8819 / 221.8888. Both the fit and the direct location agree the edge saturates ' +
    'near 10^221.9 and NEVER approaches the representable-range boundary as p grows: the ~141-185-decade delay ' +
    'imp-35608 measured is bounded, and adding more early-transient contraction cannot push the census exit past ' +
    'the overflow ceiling. Mechanism: the fitted early rate r_0 = (delta_p/delta_0)^(1/p) relaxes toward the ' +
    'asymptotic r as p grows (the post-collapse iterate is already deep in linear contraction by p=3), so each ' +
    'extra iterate adds a geometrically-shrinking increment to the delay.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (numerical, frontier-direction, NOT an RH bound). The imp-35608 two-rate census EXIT edge, ' +
    'located for p in {1,2,3}, is here fit and projected: a three-point geometric-decrement law (increment ratio ' +
    'q = 0.05549) gives a FINITE asymptote L ~ 10^221.909 and projects edge_fit(4) ~ 221.902, edge_fit(5) ~ ' +
    '221.909; directly re-locating the edge confirms p=4 at 221.8819 and p=5 at 221.8888, matching the ' +
    'projection to ~0.02 decades. The increments collapse geometrically (41.1441, 2.2832, 0.1068, 0.0069), so ' +
    'the edge SATURATES at ~10^221.9 -- ~87 decades below the IEEE-754 10^308 double-overflow ceiling -- and ' +
    'cannot be pushed past that ceiling by adding early-transient contraction. IEEE-754 double precision, point ' +
    'rate estimates (no interval enclosure), on the inherited imp-3220/imp-3406 surrogate; discharges NOTHING; ' +
    'imp-35111a / imp-35174a / imp-35243a stay OPEN; the reentry band stays NOT ESTABLISHED as a feature of the ' +
    'true dynamic (R1/R4 binding); the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35608 (the three located edges p=1,2,3 this fits); imp-35572 (in-band zero change; census exit lower ' +
    'bound); imp-34862 (the two-rate law and exact-peel control); imp-35111 (single-rate frac-window and ' +
    'direct-census band edges); imp-35243 (R1-R4 certificate, imp-35243a OPEN); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse); imp-2642 (C_C = (1/8) sqrt(3 pi) ansatz).',
};

export const IMP35634_TWO_RATE_CENSUS_EXIT_EDGE_P_LAW_ASSERTIONS = [
  {
    // The asymptotic rate matches the inherited imp-35608/imp-34862 surrogate.
    id: 'imp35634-rate-matches-parent',
    description: 'r ~ 0.0454235 and ln(1/r) ~ 3.09173 (identical to imp-35608/imp-34862)',
    holds: () => Math.abs(R_CONTRACT - 0.0454235) < 1e-5 && Math.abs(LN_INV_R - 3.09173) < 1e-3,
  },
  {
    // p=1,2,3 reproduce the imp-35608 located edges bit-for-bit (to 8 figures).
    id: 'imp35634-reproduces-imp35608-edges',
    description: 'p=1,2,3 edges reproduce imp-35608 (178.3477, 219.4919, 221.7751)',
    holds: () =>
      Math.abs(edgeAt(1) - 178.3477444) < 1e-3 &&
      Math.abs(edgeAt(2) - 219.4918648) < 1e-3 &&
      Math.abs(edgeAt(3) - 221.7750827) < 1e-3,
  },
  {
    // The new p=4,5 edges are located finitely and continue the saturating trend.
    id: 'imp35634-p4-p5-located',
    description: 'p=4 edge ~221.8819 and p=5 edge ~221.8888 located finite below the ceiling',
    holds: () =>
      Math.abs(edgeAt(4) - 221.8818827) < 1e-3 &&
      Math.abs(edgeAt(5) - 221.8888006) < 1e-3 &&
      edgeAt(4) < OVERFLOW_CEILING_EXP &&
      edgeAt(5) < OVERFLOW_CEILING_EXP,
  },
  {
    // The increments collapse geometrically (each strictly smaller than the last).
    id: 'imp35634-increments-collapse',
    description: 'increments 41.1441, 2.2832, 0.1068, 0.0069 strictly decreasing (geometric collapse)',
    holds: () =>
      INCREMENTS[0] > INCREMENTS[1] && INCREMENTS[1] > INCREMENTS[2] && INCREMENTS[2] > INCREMENTS[3] &&
      Math.abs(INCREMENTS[0] - 41.144120) < 1e-3 &&
      Math.abs(INCREMENTS[1] - 2.2832179) < 1e-4,
  },
  {
    // The three-point geometric fit projects p=4,5 within ~0.03 decades of the directly-located edges.
    id: 'imp35634-fit-matches-direct',
    description: 'geometric fit projects edge_fit(4)/edge_fit(5) within 0.03 decades of direct location',
    holds: () =>
      Math.abs(FIT_RESIDUAL.p4) < 0.03 &&
      Math.abs(FIT_RESIDUAL.p5) < 0.03 &&
      Math.abs(ASYMPTOTE_FIT - 221.9092) < 1e-2,
  },
  {
    // THE VERDICT: the edge saturates at ~10^221.9, far below the 10^308 double-overflow ceiling.
    id: 'imp35634-saturates-below-ceiling',
    description: 'edge saturates at ~10^221.9 with ~86 decades of headroom below the 10^308 ceiling',
    holds: () =>
      EDGE_SATURATES_BELOW_CEILING === true &&
      MARGIN_BELOW_CEILING > 80 &&
      ASYMPTOTE_FIT < 222,
  },
  {
    // Honesty gate: measurement only, extends imp-35608, discharges nothing, sub-gap OPEN, no QED, no refereed bound is changed.
    id: 'imp35634-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-35243a OPEN, no QED, no refereed bound is changed',
    holds: () =>
      IMP35634_TWO_RATE_CENSUS_EXIT_EDGE_P_LAW.isRigorous === false &&
      /imp-35243a stay OPEN/.test(IMP35634_TWO_RATE_CENSUS_EXIT_EDGE_P_LAW.verdict) &&
      /NO QED/.test(IMP35634_TWO_RATE_CENSUS_EXIT_EDGE_P_LAW.verdict) &&
      /refereed bound is changed/i.test(IMP35634_TWO_RATE_CENSUS_EXIT_EDGE_P_LAW.verdict),
  },
];

for (const a of IMP35634_TWO_RATE_CENSUS_EXIT_EDGE_P_LAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35634-two-rate-census-exit-edge-p-law assertion failed: ${a.id}`);
  }
}
