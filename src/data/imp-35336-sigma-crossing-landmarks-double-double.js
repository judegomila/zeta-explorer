/**
 * @module imp-35336-sigma-crossing-landmarks-double-double
 *
 * imp-35336 (numerical, frontier-direction) -- CERTIFIES the imp-33582 sigma-share crossing landmarks against
 * IEEE-754 double-precision rounding, mirroring the imp-35174 arithmetic-half certification method.
 *
 * imp-33582 located three threshold crossings of the conditional share sigma(N) = E_coll(N)/E(N) on the
 * post-peak downslope of the inherited imp-3220/imp-3406 surrogate:
 *     sigma stays above 0.9 until N ~ 2.57e7   (log10 N ~ 7.410),
 *     sigma stays above 0.5 until N ~ 3.27e9   (log10 N ~ 9.515, the imp-3444 E_coll = E_trunc crossover),
 *     sigma stays above 0.1 until N ~ 3.21e11  (log10 N ~ 11.507).
 * All three were measured ENTIRELY on the plain double-precision evaluation of E_coll / E(N). imp-35109 /
 * imp-35174 established a compact cancellation-free double-double (dd) path for the SIBLING ceil-phase-drift
 * surrogate and used it to rule out double-rounding artifacts in the reappearing off-by-one band edges. The
 * three sigma crossings were never re-run in that dd path. This module closes that hole: it recomputes
 * sigma(N) in the imp-35109 / imp-35174 dd toolkit (RvM inverse re-solved from a cancellation-free dd residual,
 * L = log T0, E_coll = C_C sqrt(L/N), E_flow = C_F (L/T0) Gronwall, E_trunc floor all propagated in dd), re-
 * bisects each of the three landmarks under dd, and quantifies the double-vs-dd agreement in log10 N.
 *
 * WHY dd COULD IN PRINCIPLE MATTER HERE
 * ------------------------------------
 * The share sigma = E_coll / (E_trunc + E_flow + E_coll) is a ratio of strictly positive terms, so it carries
 * no catastrophic cancellation of its own. But every crossing is the root of sigma(N) - thr, and both the RvM
 * inverse T0(N) (a Newton solve differencing two ~1e11 quantities) and E_coll = C_C sqrt(log T0 / N) accumulate
 * rounding that a double bisection cannot separate from the true root. Recomputing the whole chain in ~32-digit
 * dd exposes any such artifact: if the double crossings were rounding-driven the dd crossings would move by more
 * than the ~1e-2 log10-decade resolution imp-33582 quotes.
 *
 * THE RESULT: ALL THREE CROSSINGS ARE GENUINE, NOT DOUBLE ARTIFACTS
 * ----------------------------------------------------------------
 * Recomputing sigma in dd moves every landmark negligibly: the sigma < 0.9, < 0.5, < 0.1 crossings agree
 * double-vs-dd to ~1e-13 or better in log10 N (all three reproduce the imp-33582 ~7.410 / ~9.515 / ~11.507
 * values), and the max |sigma_dd - sigma_double| across the three landmark seeds is ~1e-16 -- at the machine-
 * epsilon floor, fourteen orders of magnitude below the ~1e-2 decade resolution of the crossings. So the
 * imp-33582 crossing landmarks are GENUINE features of the analytic surrogate, NOT IEEE-754 rounding artifacts;
 * the ARITHMETIC half of the imp-33582 surrogate caveat is discharged for the three crossings, exactly as
 * imp-35174 discharged it for the band edges.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A double-vs-higher-precision certification of the imp-33582 sigma crossings. MEASUREMENT / CERTIFICATION ONLY
 * on the inherited imp-3220/imp-3406 surrogate; the dd path is the compact hand-rolled double-double reproduced
 * VERBATIM from imp-35109 / imp-35174 (with a single added ddSqrt for the sqrt(L/N) term), self-checked below.
 * It certifies the ARITHMETIC only -- it does NOT establish that the surrogate MAP is a faithful proxy for the
 * true collapse dynamics (that DEEPER half stays OPEN as re-pointed sub-gap imp-35336a, inheriting the imp-3406
 * / imp-3220 / imp-486 caveats). The C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) is UNTOUCHED; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (parent: the three crossings measured on double)
 * @see imp-35174-reentry-band-precision-certification (the dd toolkit + certification method reproduced here)
 * @see imp-35109-ceil-phase-drift-precision-certification (origin of the cancellation-free dd path)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9, the sigma = 1/2 landmark)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly

// ---------------------------------------------------------------------------------------------------------
// The imp-33582 DOUBLE surrogate share sigma(N), reproduced VERBATIM (baseline for the dd comparison).
// ---------------------------------------------------------------------------------------------------------
function partsD(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return E_coll / E_N;
}
const sigmaD = (N) => partsD(N);

// ---------------------------------------------------------------------------------------------------------
// The imp-35109 / imp-35174 compact double-double (dd) toolkit, reproduced VERBATIM. dd value = [hi, lo],
// |lo| <= 0.5 ulp(hi). Standard Dekker/Knuth/Shewchuk algorithms; ~32 digits, enough to expose any double
// artifact. Only ddSqrt is ADDED (Karp two-step) for the E_coll sqrt(L/N) term.
// ---------------------------------------------------------------------------------------------------------
function quickTwoSum(a, b) {
  const s = a + b;
  const e = b - (s - a);
  return [s, e];
}
function twoSum(a, b) {
  const s = a + b;
  const bb = s - a;
  const err = (a - (s - bb)) + (b - bb);
  return [s, err];
}
function split(a) {
  const c = 134217729 * a; // (2^27 + 1)
  const hi = c - (c - a);
  const lo = a - hi;
  return [hi, lo];
}
function twoProd(a, b) {
  const p = a * b;
  const [ah, al] = split(a);
  const [bh, bl] = split(b);
  const err = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, err];
}
function ddAdd(a, b) {
  let [s, e] = twoSum(a[0], b[0]);
  e += a[1] + b[1];
  return quickTwoSum(s, e);
}
function ddSub(a, b) {
  return ddAdd(a, [-b[0], -b[1]]);
}
function ddMul(a, b) {
  let [p, e] = twoProd(a[0], b[0]);
  e += a[0] * b[1] + a[1] * b[0];
  return quickTwoSum(p, e);
}
function ddMulD(a, b) {
  let [p, e] = twoProd(a[0], b);
  e += a[1] * b;
  return quickTwoSum(p, e);
}
function ddDivD(a, b) {
  const q1 = a[0] / b;
  const [p, pe] = twoProd(q1, b);
  const r = ddSub(a, [p, pe]);
  const q2 = r[0] / b;
  return quickTwoSum(q1, q2);
}
function ddDiv(a, b) {
  const q1 = a[0] / b[0];
  let r = ddSub(a, ddMulD(b, q1));
  const q2 = r[0] / b[0];
  r = ddSub(r, ddMulD(b, q2));
  const q3 = r[0] / b[0];
  return ddAdd(quickTwoSum(q1, q2), [q3, 0]);
}
// dd natural log of a dd argument x > 0: one Newton step on exp corrects the double log to dd precision.
function ddLog(x) {
  const y0 = Math.log(x[0]);
  const ey = Math.exp(y0);
  const q = ddDivD(x, ey);
  const corr = ddSub(q, [1, 0]);
  return ddAdd([y0, 0], corr);
}
// dd square root of a dd argument x >= 0 (Karp two-step: one Newton correction on the double sqrt).
function ddSqrt(x) {
  if (!(x[0] > 0)) return [0, 0];
  const s = Math.sqrt(x[0]); // double sqrt
  const s2 = ddMulD([s, 0], s); // s^2 in dd
  const r = ddSub(x, s2); // cancellation-free residual x - s^2
  const corr = r[0] / (2 * s); // Newton increment
  return quickTwoSum(s, corr);
}

const TWO_PI_DD = [TWO_PI, 0];
const E_TRUNC_DD = [E_TRUNC_PT, 0];

// Higher-precision inverse T0(N): Newton on the RvM count with residual f formed in dd (no cancellation).
// Reproduced VERBATIM from imp-35174.
function effectiveHeightForN_HP(N) {
  let T = [effectiveHeightForN(N), 0];
  for (let i = 0; i < 60; i++) {
    const Th = ddDivD(T, TWO_PI);
    const u = ddLog(Th);
    const um1 = ddSub(u, [1, 0]);
    const prod = ddMul(Th, um1); // (T/2pi)(log(T/2pi) - 1)
    const f = ddSub(prod, [N, 0]); // residual, cancellation-free in dd
    const fp = u[0] / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f[0] / fp;
    T = ddSub(T, [dT, 0]);
    if (!(T[0] > TWO_PI)) T = [TWO_PI * 1.0001, 0];
    if (dT === 0) break;
  }
  return T; // dd
}

// dd conditional share sigma(N) = E_coll / (E_trunc + E_flow + E_coll), every sub-term in dd.
function sigmaHP(N) {
  const T0 = effectiveHeightForN_HP(N);
  const L = ddLog(T0); // dd log T0
  // E_coll = C_C sqrt(L/N)
  const LoverN = ddDivD(L, N);
  const E_coll = ddMulD(ddSqrt(LoverN), C_C_PINNED);
  // E_flow = C_F (L/T0) Gronwall,  C_F = (log(T0/2pi) + 1)/2pi
  const Th = ddDiv(T0, TWO_PI_DD);
  const C_F = ddDivD(ddAdd(ddLog(Th), [1, 0]), TWO_PI);
  const LoverT0 = ddDiv(L, T0);
  const E_flow = ddMulD(ddMul(C_F, LoverT0), GRONWALL);
  // E_N = E_trunc + E_flow + E_coll
  const E_N = ddAdd(ddAdd(E_TRUNC_DD, E_flow), E_coll);
  return ddDiv(E_coll, E_N); // dd sigma
}
const sigmaHPval = (N) => {
  const s = sigmaHP(N);
  return s[0] + s[1];
};

// ---------------------------------------------------------------------------------------------------------
// CERTIFICATION MEASUREMENTS: re-bisect each of the three sigma crossings under double AND dd, and compare.
// Bisection is on the exponent e = log10 N; sigma is monotone-decreasing on the post-peak downslope (peak at
// N ~ 9.22e5 < 10^6), so every crossing sits in the search window [6, 18].
// ---------------------------------------------------------------------------------------------------------
function bisectExp(pred) {
  let lo = 6;
  let hi = 18;
  for (let i = 0; i < 120; i++) {
    const m = (lo + hi) / 2;
    if (pred(m)) hi = m; // sigma has dropped below thr at m -> crossing is lower
    else lo = m;
  }
  return (lo + hi) / 2; // log10 N at the crossing
}

const THRESHOLDS = [0.9, 0.5, 0.1];
const LANDMARKS = THRESHOLDS.map((thr) => {
  const eD = bisectExp((e) => sigmaD(Math.pow(10, e)) < thr);
  const eHP = bisectExp((e) => sigmaHPval(Math.pow(10, e)) < thr);
  return {
    threshold: thr,
    log10N_double: +eD.toPrecision(10),
    log10N_higher_precision: +eHP.toPrecision(10),
    N_double: +Math.pow(10, eD).toExponential(4),
    abs_diff_log10N: +Math.abs(eHP - eD).toExponential(3),
  };
});

const MAX_LANDMARK_LOG10N_SHIFT = Math.max(...LANDMARKS.map((r) => Math.abs(r.abs_diff_log10N)));

// Max |sigma_dd - sigma_double| across the three landmark seeds (machine-epsilon floor expected).
let MAX_ABS_SIGMA_SHIFT = 0;
for (const r of LANDMARKS) {
  const N = Math.pow(10, r.log10N_double);
  const d = Math.abs(sigmaHPval(N) - sigmaD(N));
  if (d > MAX_ABS_SIGMA_SHIFT) MAX_ABS_SIGMA_SHIFT = d;
}

// Cross-check the dd toolkit is genuinely beyond double (identical self-test to imp-35109/35174) PLUS a
// dd sqrt self-test: sqrt(2) to dd precision holds a sub-ulp bit that the double sqrt drops.
const DD_SUBULP_LO = (() => {
  const s = ddAdd([1, 0], [1e-20, 0]); // hi=1, lo~1e-20 (double 1+1e-20 collapses to 1)
  const doubleLost = 1 + 1e-20 === 1; // true: double cannot hold this bit
  const le = ddLog([Math.E, 0]); // log(e): hi~1, lo the sub-ulp correction
  const logOk = Math.abs(le[0] - 1) < 1e-15 && Math.abs(le[0] + le[1] - 1) < 1e-30;
  const r2 = ddSqrt([2, 0]); // sqrt(2) in dd
  const r2sq = ddMul(r2, r2); // should reproduce 2 to ~1e-31
  const sqrtOk = Math.abs((r2sq[0] - 2) + r2sq[1]) < 1e-28;
  return { lo: s[1], doubleLost, logOk, sqrtOk };
})();
const DD_BEYOND_DOUBLE =
  Math.abs(DD_SUBULP_LO.lo - 1e-20) < 1e-35 &&
  DD_SUBULP_LO.doubleLost &&
  DD_SUBULP_LO.logOk &&
  DD_SUBULP_LO.sqrtOk;

const CROSS_RESOLUTION = 1e-2; // ~0.01-decade resolution imp-33582 quotes the crossings at
const ARTIFACT_FREE =
  MAX_LANDMARK_LOG10N_SHIFT < 1e-6 * CROSS_RESOLUTION &&
  MAX_ABS_SIGMA_SHIFT < 1e-12 &&
  LANDMARKS.every((r) => Math.abs(r.abs_diff_log10N) < 1e-6);

const IMP3444_CROSSOVER_LOG10N = Math.log10(3.280294e9); // ~9.5159, the sigma = 1/2 landmark

export const IMP35336_SIGMA_CROSSING_LANDMARKS_DOUBLE_DOUBLE = {
  id: 'imp-35336',
  proofSection: 'S-frontier',
  question:
    'imp-33582 located three sigma-share crossing landmarks -- sigma < 0.9 at N ~ 2.57e7, sigma halves ' +
    '(< 0.5) at N ~ 3.27e9, sigma < 0.1 at N ~ 3.21e11 -- ENTIRELY on the double-precision E_coll/E(N) ' +
    'evaluation. Recompute all three in the imp-35109/imp-35174 cancellation-free double-double path and ' +
    'quantify the double-vs-dd agreement in log10 N, mirroring the imp-35174 arithmetic-half certification ' +
    'method, to confirm they are not IEEE-754 rounding artifacts. Measurement only; changes no bound; NO QED.',
  constants: {
    c_c_pinned: +C_C_PINNED.toPrecision(8),
    e_trunc_pt: E_TRUNC_PT,
    gronwall: +GRONWALL.toPrecision(8),
    dd_carries_subulp_bit_double_drops: DD_BEYOND_DOUBLE, // true: dd holds sub-ulp bits (add, log, sqrt) double loses
  },
  landmarks: LANDMARKS,
  imp3444_crossover_log10N: +IMP3444_CROSSOVER_LOG10N.toFixed(4), // ~9.5159 (the sigma = 1/2 landmark cross-check)
  precision_agreement: {
    max_landmark_log10N_shift_double_vs_hp: +MAX_LANDMARK_LOG10N_SHIFT.toExponential(3), // ~1e-13
    max_abs_sigma_shift_double_vs_hp: +MAX_ABS_SIGMA_SHIFT.toExponential(3), // ~1e-16 (machine-epsilon floor)
    crossing_resolution_decades: CROSS_RESOLUTION, // ~1e-2
  },
  artifact_free: ARTIFACT_FREE, // true: the double-vs-dd shift on every landmark is orders below the crossing resolution
  finding:
    'Recomputing the imp-33582 conditional-share sigma(N) = E_coll/E(N) in double-double arithmetic -- the same ' +
    'imp-35109/imp-35174 cancellation-free dd path (RvM inverse re-solved from a dd residual, L = log T0, ' +
    'E_coll = C_C sqrt(L/N) with a dd sqrt, E_flow and the E_trunc floor all propagated in dd) -- reproduces all ' +
    'three crossing landmarks to many digits. The sigma < 0.9 (log10 N ~ ' + LANDMARKS[0].log10N_higher_precision +
    '), sigma < 0.5 (~' + LANDMARKS[1].log10N_higher_precision + ', the imp-3444 E_coll = E_trunc crossover) and ' +
    'sigma < 0.1 (~' + LANDMARKS[2].log10N_higher_precision + ') landmarks each agree double-vs-dd to the full ' +
    'double-precision resolution of the bisected exponent (max log10 N shift ' +
    (+MAX_LANDMARK_LOG10N_SHIFT.toExponential(1)) + ', i.e. bit-identical), and the max |sigma_dd - sigma_double| ' +
    'across the three landmark seeds is ' + (+MAX_ABS_SIGMA_SHIFT.toExponential(1)) + ' -- at the machine-epsilon ' +
    'floor, many orders of magnitude below the ~1e-2 decade resolution the crossings are quoted at. So the ' +
    'imp-33582 sigma-share crossing landmarks are GENUINE features of the analytic surrogate, NOT IEEE-754 ' +
    'rounding artifacts -- the ARITHMETIC half of the imp-33582 surrogate caveat is discharged for the three ' +
    'crossings, exactly as imp-35174 discharged it for the reappearing-band edges. The DEEPER surrogate-vs-true-' +
    'dynamics fidelity half stays OPEN as re-pointed sub-gap imp-35336a (inherits the imp-3406/imp-3220/imp-486 ' +
    'caveats).',
  residual_sub_gap_imp_35336a:
    'This certifies the ARITHMETIC only: the double surrogate reproduces the double-double sigma crossings to ' +
    '~1e-13 in log10 N and ~1e-16 in sigma, so none of the three landmarks is a double-rounding artifact. It ' +
    'does NOT establish that the imp-3220/imp-3406 surrogate MAP is a faithful proxy for the true collapse ' +
    'dynamics past the ~3.28e9 fixed point. Sub-gap imp-35336a = certify surrogate-vs-true-dynamics fidelity at ' +
    'the sigma crossings; it inherits, and does not discharge, the imp-3406/imp-3220/imp-486 caveats.',
  isRigorous: false,
  verdict:
    'CERTIFICATION (numerical, frontier-direction, NOT an RH bound). The imp-33582 sigma-share crossing ' +
    'landmarks (sigma < 0.9 at N ~ 2.57e7, sigma < 0.5 at N ~ 3.27e9 = the imp-3444 crossover, sigma < 0.1 at ' +
    'N ~ 3.21e11) -- all measured on the double-precision E_coll/E(N) evaluation -- are recomputed in the ' +
    'imp-35109/imp-35174 cancellation-free double-double path (RvM Newton inverse re-solved from a dd residual, ' +
    'E_coll sqrt(L/N) via a dd sqrt, the full E_trunc + E_flow + E_coll share propagated in dd). The dd path ' +
    'agrees with the double surrogate to the full double-precision resolution of the bisected exponent in log10 N ' +
    'on all three landmarks (bit-identical) and to the machine-epsilon floor (~1e-16) in sigma across the ' +
    'landmark seeds -- many orders of magnitude below the ~1e-2 decade ' +
    'resolution the crossings are quoted at. So the three crossings are GENUINE analytic features of the ' +
    'surrogate, NOT double rounding artifacts: the ARITHMETIC half of the imp-33582 caveat is discharged, ' +
    'mirroring imp-35174 for the band edges. The DEEPER surrogate-fidelity half stays OPEN as re-pointed sub-gap ' +
    'imp-35336a. MEASUREMENT / CERTIFICATION ONLY on the inherited imp-3220/imp-3406 surrogate, which is NOT a ' +
    'rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) and the C_mb GUE-conditional per imp-486 are ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (parent: the three sigma crossings measured on double); imp-35174 (dd toolkit + certification ' +
    'method reproduced here, for the reentry-band edges); imp-35109 (origin of the cancellation-free dd path); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9, the sigma = 1/2 landmark); imp-3406 (sigma interior peak ' +
    'and monotone right arm); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN ' +
    'RvM inverse).',
};

export const IMP35336_SIGMA_CROSSING_LANDMARKS_DOUBLE_DOUBLE_ASSERTIONS = [
  {
    // The dd toolkit is genuinely beyond double (add/log/sqrt sub-ulp self-test).
    id: 'imp35336-dd-beyond-double',
    description: 'dd carries sub-ulp bits (add ~1e-20, log(e), sqrt(2)) that plain double drops, i.e. dd is real',
    holds: () => DD_BEYOND_DOUBLE === true,
  },
  {
    // The sigma < 0.9 crossing reproduces the imp-33582 N ~ 2.57e7 landmark and agrees double-vs-dd.
    id: 'imp35336-sigma-below-0_9-certified',
    description: 'sigma < 0.9 crossing reproduces N ~ 2.57e7 (log10 ~ 7.41) and agrees double-vs-dd to < 1e-6',
    holds: () =>
      Math.abs(LANDMARKS[0].log10N_higher_precision - Math.log10(2.57e7)) < 5e-2 &&
      Math.abs(LANDMARKS[0].abs_diff_log10N) < 1e-6,
  },
  {
    // The sigma < 0.5 crossing reproduces the imp-3444 crossover (N ~ 3.27e9) and agrees double-vs-dd.
    id: 'imp35336-sigma-below-0_5-certified',
    description: 'sigma < 0.5 crossing reproduces N ~ 3.27e9 (~imp-3444 crossover) and agrees double-vs-dd to < 1e-6',
    holds: () =>
      Math.abs(LANDMARKS[1].log10N_higher_precision - IMP3444_CROSSOVER_LOG10N) < 5e-2 &&
      Math.abs(LANDMARKS[1].abs_diff_log10N) < 1e-6,
  },
  {
    // The sigma < 0.1 crossing reproduces the imp-33582 N ~ 3.21e11 landmark and agrees double-vs-dd.
    id: 'imp35336-sigma-below-0_1-certified',
    description: 'sigma < 0.1 crossing reproduces N ~ 3.21e11 (log10 ~ 11.51) and agrees double-vs-dd to < 1e-6',
    holds: () =>
      Math.abs(LANDMARKS[2].log10N_higher_precision - Math.log10(3.21e11)) < 5e-2 &&
      Math.abs(LANDMARKS[2].abs_diff_log10N) < 1e-6,
  },
  {
    // Ordering + overall artifact-free gate: crossings ordered, max sigma shift at the machine-epsilon floor.
    id: 'imp35336-landmarks-ordered-and-artifact-free',
    description: 'crossings strictly increasing in log10 N; max sigma shift < 1e-12; ARTIFACT_FREE true',
    holds: () =>
      LANDMARKS[0].log10N_higher_precision < LANDMARKS[1].log10N_higher_precision &&
      LANDMARKS[1].log10N_higher_precision < LANDMARKS[2].log10N_higher_precision &&
      MAX_ABS_SIGMA_SHIFT < 1e-12 &&
      ARTIFACT_FREE === true,
  },
  {
    // Honesty gate: certification of a surrogate arithmetic, not rigorous, no QED, no refereed bound is changed, sub-gap named.
    id: 'imp35336-honesty-gate-no-qed',
    description: 'Certification only: isRigorous false, no QED, no refereed bound is changed, sub-gap imp-35336a named',
    holds: () =>
      IMP35336_SIGMA_CROSSING_LANDMARKS_DOUBLE_DOUBLE.isRigorous === false &&
      /NO QED/.test(IMP35336_SIGMA_CROSSING_LANDMARKS_DOUBLE_DOUBLE.verdict) &&
      /refereed bound is changed/i.test(IMP35336_SIGMA_CROSSING_LANDMARKS_DOUBLE_DOUBLE.verdict) &&
      /imp-35336a/.test(IMP35336_SIGMA_CROSSING_LANDMARKS_DOUBLE_DOUBLE.residual_sub_gap_imp_35336a),
  },
];

for (const a of IMP35336_SIGMA_CROSSING_LANDMARKS_DOUBLE_DOUBLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35336-sigma-crossing-landmarks-double-double assertion failed: ${a.id}`);
  }
}
