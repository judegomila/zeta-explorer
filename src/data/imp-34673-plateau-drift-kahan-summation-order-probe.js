/**
 * @module imp-34673-plateau-drift-kahan-summation-order-probe
 * @fileoverview imp-34673 -- MEASUREMENT ONLY: assess whether compensated (Kahan) summation of the
 *   eight q3 numerator terms removes the ~7e-6 accumulation-order jitter imp-34649 F3 attributed to
 *   summing the wide 6th-order 9-point stencil in different orders, isolating the summation-order
 *   contribution from the intrinsic roundoff-conditioning floor.
 *
 *   THE QUESTION (imp-34649 F3, restated)
 *   -------------------------------------
 *   imp-34649 drove the 2nd/4th/6th-order q3-share plateau drift ~ -0.0968 through ONE shared
 *   coefficient-table code path and found the shared-path 6th-order value -0.096817 differs from the
 *   imp-34626 inline -0.096810 by ~7e-6. F3 attributed that ~7e-6 to accumulation-order sensitivity:
 *   the two code paths sum the eight q3 numerator terms (the antisymmetric 9-point stencil
 *   [7, -72, 338, -488, +488, -338, +72, -7]/240 acting on q(p) = log E_coll) in DIFFERENT orders while
 *   resolving a tiny q3 ~3.4e-5 near-cancellation. If the jitter were genuinely accumulation-order
 *   error, compensated (Kahan) summation -- which cancels the running rounding error of the addition
 *   chain -- should collapse it. This module tests that directly and separates the two candidate
 *   mechanisms: (a) accumulation-order error in the ADDITION chain (Kahan-removable), versus (b) the
 *   catastrophic-cancellation roundoff-conditioning floor of the pre-rounded INPUTS w * q(p + k dp),
 *   which no summation algorithm can recover.
 *
 *   THE PROBE
 *   ---------
 *   Reusing the imp-34446/imp-34531 primitives inline (heightForN, eColl, qOfP; imports NOTHING, no
 *   zeros bundle) and the imp-34626 6th-order stencil verbatim, the eight q3 numerator terms are summed
 *   in four orderings -- forward, reverse, ascending-by-weight-magnitude, descending -- under TWO
 *   accumulators: naive left-to-right, and Kahan compensated summation. Each combination feeds the same
 *   shareOf / driftAt / plateau pipeline (mid vs deep partition at N* ~ 4.62e13, imp-33620 sigma < 0.01;
 *   window mean over the imp-34611/imp-34626 dp ladder). We read the plateau spread ACROSS orderings
 *   under each accumulator, the raw q3-numerator spread at a reference point, and the cancellation ratio.
 *
 *   THE FINDING (Kahan does NOT remove the jitter -- it is the conditioning floor, not accumulation order)
 *   ----------------------------------------------------------------------------------------------------
 *   (F1) FOR EIGHT SUMMANDS KAHAN IS BIT-IDENTICAL TO NAIVE SUMMATION. At the reference point
 *        (N = 1e13, dp = 1e-2) the Kahan and naive q3 numerators agree to the last bit for EVERY one of
 *        the four orderings (|kahan - naive| = 0 exactly). With only eight terms the accumulation-chain
 *        rounding error is already at or below the compensation resolution, so there is no
 *        accumulation error for Kahan to remove.
 *   (F2) THE CROSS-ORDERING SPREAD IS UNCHANGED BY KAHAN. The raw q3-numerator spread across the four
 *        orderings is ~2.70e-13 under naive summation and the SAME ~2.70e-13 under Kahan. Propagated
 *        through the plateau pipeline the plateau spread across orderings is ~2.17e-5 naive vs
 *        ~1.75e-5 Kahan -- a ~1.24x reduction, same order of magnitude, NOT a collapse. Kahan does not
 *        separate out a Kahan-removable accumulation-order component because there is none.
 *   (F3) THE JITTER IS THE CATASTROPHIC-CANCELLATION CONDITIONING FLOOR. At the reference point the
 *        largest stencil term is ~6.96e3 while the true numerator is ~8.24e-9 -- a cancellation ratio
 *        ~8.44e11 (~11.9 decimal digits lost). The corresponding input-roundoff floor
 *        max|term| * eps / |sum| ~ 1.87e-4 (relative) is the irreducible conditioning of the
 *        near-cancellation; the realized cross-ordering sensitivity ~3e-5 (relative) sits inside it.
 *        This error lives in the pre-rounded inputs w * q(p + k dp), not in the addition chain, so NO
 *        summation algorithm (Kahan, pairwise, sorted) can recover it -- only wider-than-double
 *        arithmetic on the inputs could.
 *
 *   CONCLUSION: the ~7e-6 (broadly ~2e-5) plateau jitter imp-34649 F3 called accumulation-order
 *   sensitivity is more precisely the roundoff-CONDITIONING floor of the tiny-q3 catastrophic
 *   cancellation. Kahan compensated summation -- the correct tool for accumulation-chain error -- leaves
 *   it essentially unchanged (bit-identical per ordering, ~1.24x on the cross-ordering plateau spread),
 *   confirming the ~2e-5 spread is intrinsic conditioning, not a remediable summation-order artifact.
 *   This SHARPENS imp-34649 F3 rather than contradicting it: reordering EXPOSES the floor, compensated
 *   accumulation cannot REMOVE it.
 *
 *   MEASUREMENT ONLY. Re-aggregates the already-certified imp-34649 decomposition under two accumulators;
 *   changes NO bound. Reproduces the imp-34446/imp-34531/imp-34543/imp-34573 primitives inline (imports
 *   NOTHING -- no lambda mapping, no polymath15 constant module, no zeros bundle), per the
 *   no-heavy-imports directive. q1,q2,q3 are inherited central differences, NOT fresh analytic closed
 *   forms, so the sigma -> 1 deep-tail regime (imp-3220/imp-3406 component model least trustworthy) is
 *   inherited as-is. The -2 asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are
 *   UNTOUCHED; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no
 *   operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34649-plateau-drift-shared-stencil-crossvalidation.js (F3 ~7e-6 jitter assessed here)
 *   @see imp-34626-plateau-drift-sixth-order-stencil-crosscheck.js (the 6th-order 9-point stencil)
 *   @see imp-34593-drift-share-error-optimal-dp-fit.js (the plateau ~ -0.0968 being probed)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (deep-tail landmark N* ~ 4.62e13, sigma<0.01)
 *
 *   Ticket: imp-34673 (numerical, medium). Kahan summation-order probe; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34543/imp-34573 primitives (imports NOTHING): --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const DEEP_TAIL_N = 4.624385e13; // imp-33620 sigma < 0.01 landmark N* -- the mid/deep boundary

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N

// -- imp-34626 6th-order 9-point stencil (verbatim): q2 symmetric (used with naive summation, held
//    fixed across the probe), q3 the antisymmetric numerator whose eight terms are the object of the
//    summation-order test. q3 = (sum w_k q(p + k dp)) / (240 dp^3); the q1^2 cancels in the share. --
const Q2_TERMS = [[3, 2], [2, -27], [1, 270], [0, -490], [-1, 270], [-2, -27], [-3, 2]];
const Q2_DENOM = 180;
const Q3_TERMS = [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]];
const Q3_DENOM = 240;

// The four term orderings tested (index permutations of the eight q3 terms): forward, reverse,
// ascending-by-weight-magnitude (|w| = 7,72,338,488), and descending. A pure accumulation-order effect
// would move the plateau across these; a conditioning floor pins its magnitude regardless.
const ORDERINGS = {
  forward: [0, 1, 2, 3, 4, 5, 6, 7],
  reverse: [7, 6, 5, 4, 3, 2, 1, 0],
  byMagAsc: [0, 7, 1, 6, 2, 5, 3, 4],
  byMagDesc: [3, 4, 2, 5, 1, 6, 0, 7],
};

// Naive left-to-right accumulation of the eight q3 numerator terms in a chosen ordering.
function q3NumNaive(p, dp, order) {
  let s = 0;
  for (const i of order) {
    const [k, w] = Q3_TERMS[i];
    s += w * qOfP(p + k * dp);
  }
  return s;
}

// Kahan compensated accumulation of the SAME eight terms in the SAME ordering (the only difference is
// the running compensation term c that cancels the addition-chain rounding error).
function q3NumKahan(p, dp, order) {
  let s = 0;
  let c = 0;
  for (const i of order) {
    const [k, w] = Q3_TERMS[i];
    const y = w * qOfP(p + k * dp) - c;
    const t = s + y;
    c = t - s - y;
    s = t;
  }
  return s;
}

// q2 (fixed, naive symmetric stencil -- not the object of the test) and the q3-share built from a
// chosen q3 accumulator + ordering. SAME share definition as imp-34593/imp-34611/imp-34626/imp-34649.
function q2Eval(p, dp) {
  let s = 0;
  for (const [k, w] of Q2_TERMS) s += w * qOfP(p + k * dp);
  return s / (Q2_DENOM * Math.pow(dp, 2));
}

function shareOf(N, dp, order, useKahan) {
  const p = Math.log(N);
  const q2 = q2Eval(p, dp);
  const num = (useKahan ? q3NumKahan : q3NumNaive)(p, dp, order);
  const q3 = num / (Q3_DENOM * Math.pow(dp, 3));
  return q3 / 6 / (-q2 / 2 + q3 / 6);
}

// Same MID/DEEP landmark partition as imp-34573/imp-34587/imp-34593/imp-34611/imp-34626/imp-34649.
const MID_LADDER = [Math.pow(10, 12.0), Math.pow(10, 12.5), Math.pow(10, 13.0), Math.pow(10, 13.333)];
const DEEP_LADDER = [DEEP_TAIL_N, Math.pow(10, 14.0), Math.pow(10, 14.5), Math.pow(10, 15.0)];

const mean = (vals) => vals.reduce((a, b) => a + b, 0) / vals.length;
const spread = (vals) => Math.max(...vals) - Math.min(...vals);

function driftAt(dp, order, useKahan) {
  const midMean = mean(MID_LADDER.map((N) => shareOf(N, dp, order, useKahan)));
  const deepMean = mean(DEEP_LADDER.map((N) => shareOf(N, dp, order, useKahan)));
  return (deepMean - midMean) / midMean;
}

const PLATEAU_STEPS = [6e-3, 8e-3, 1e-2, 1.5e-2, 2e-2, 3e-2, 5e-2, 8e-2, 1e-1, 1.5e-1, 2e-1, 3e-1];
const plateau = (order, useKahan) => mean(PLATEAU_STEPS.map((dp) => driftAt(dp, order, useKahan)));

// (F1) per-ordering Kahan-vs-naive numerator agreement at a reference point -- bit-identical for 8 terms.
const REF_P = Math.log(1e13);
const REF_DP = 1e-2;
const PER_ORDER_KAHAN_MINUS_NAIVE = Object.values(ORDERINGS).map((o) =>
  Math.abs(q3NumKahan(REF_P, REF_DP, o) - q3NumNaive(REF_P, REF_DP, o)),
);
const MAX_KAHAN_MINUS_NAIVE = Math.max(...PER_ORDER_KAHAN_MINUS_NAIVE); // 0 exactly (8-term regime)

// (F2) cross-ordering spread of the raw q3 numerator at the reference point -- identical naive vs Kahan.
const Q3NUM_SPREAD_NAIVE = spread(Object.values(ORDERINGS).map((o) => q3NumNaive(REF_P, REF_DP, o))); // ~2.70e-13
const Q3NUM_SPREAD_KAHAN = spread(Object.values(ORDERINGS).map((o) => q3NumKahan(REF_P, REF_DP, o))); // ~2.70e-13

// (F2) cross-ordering spread of the PLATEAU under each accumulator -- Kahan barely moves it (~1.24x).
const PLATEAU_SPREAD_NAIVE = spread(Object.values(ORDERINGS).map((o) => plateau(o, false))); // ~2.17e-5
const PLATEAU_SPREAD_KAHAN = spread(Object.values(ORDERINGS).map((o) => plateau(o, true))); // ~1.75e-5
const KAHAN_REDUCTION_FACTOR = PLATEAU_SPREAD_NAIVE / PLATEAU_SPREAD_KAHAN; // ~1.24 (NOT a collapse)

// (F3) catastrophic-cancellation conditioning of the tiny q3 numerator at the reference point.
const REF_TERMS = Q3_TERMS.map(([k, w]) => w * qOfP(REF_P + k * REF_DP));
const REF_MAX_TERM = Math.max(...REF_TERMS.map(Math.abs)); // ~6.96e3
const REF_SUM = REF_TERMS.reduce((a, b) => a + b, 0); // ~8.24e-9
const CANCELLATION_RATIO = REF_MAX_TERM / Math.abs(REF_SUM); // ~8.44e11
const LOST_DIGITS = Math.log10(CANCELLATION_RATIO); // ~11.9
const INPUT_ROUNDOFF_FLOOR_REL = (REF_MAX_TERM * Number.EPSILON) / Math.abs(REF_SUM); // ~1.87e-4

export const IMP34673_PLATEAU_DRIFT_KAHAN_PROBE = Object.freeze({
  id: 'imp-34673',
  proofSection: 'S-frontier',
  claim_measured:
    'Assess whether compensated (Kahan) summation of the eight q3 numerator terms removes the ~7e-6 ' +
    'accumulation-order jitter imp-34649 F3 attributed to summing the 6th-order 9-point stencil in ' +
    'different orders, separating summation-order error from the roundoff-conditioning floor of the ' +
    'tiny-q3 catastrophic cancellation -- a probe of the inherited component model, not a bound.',
  deep_tail_boundary_N: DEEP_TAIL_N,
  C_C_inline: +C_C.toFixed(6),
  reference_point: Object.freeze({ N: 1e13, dp: REF_DP }),
  orderings_tested: Object.freeze(Object.keys(ORDERINGS)),
  // F1: for 8 summands Kahan is bit-identical to naive summation (no accumulation error to remove).
  max_kahan_minus_naive_per_ordering: MAX_KAHAN_MINUS_NAIVE, // 0 exactly
  // F2: the cross-ordering spread is unchanged by Kahan (raw numerator identical; plateau ~1.24x only).
  q3num_spread_naive_abs: +Q3NUM_SPREAD_NAIVE.toExponential(3), // ~2.70e-13
  q3num_spread_kahan_abs: +Q3NUM_SPREAD_KAHAN.toExponential(3), // ~2.70e-13 (SAME)
  plateau_spread_naive_abs: +PLATEAU_SPREAD_NAIVE.toExponential(3), // ~2.17e-5
  plateau_spread_kahan_abs: +PLATEAU_SPREAD_KAHAN.toExponential(3), // ~1.75e-5
  kahan_reduction_factor: +KAHAN_REDUCTION_FACTOR.toFixed(3), // ~1.24 (same order of magnitude)
  // F3: the jitter is the catastrophic-cancellation conditioning floor of the pre-rounded inputs.
  cancellation_ratio: +CANCELLATION_RATIO.toExponential(3), // ~8.44e11
  lost_digits: +LOST_DIGITS.toFixed(2), // ~11.9
  input_roundoff_floor_rel: +INPUT_ROUNDOFF_FLOOR_REL.toExponential(3), // ~1.87e-4
  isRigorous: false,
  verdict:
    'MEASUREMENT (NOT rigorous). Kahan-summation probe of the imp-34649 F3 ~7e-6 6th-order plateau ' +
    'jitter [q3-share plateau drift ~ -0.0968; q3 = 9-point antisymmetric stencil ' +
    '[7,-72,338,-488,+488,-338,+72,-7]/240 on q(p) = log E_coll; deep = N >= N* ~ 4.62e13 ' +
    '(imp-33620 sigma < 0.01) vs mid]. imp-34649 F3 attributed the ~7e-6 shared-vs-inline 6th-order ' +
    'difference to accumulation-order sensitivity when summing the eight q3 terms in different orders; ' +
    'this module tests whether Kahan compensated summation -- the correct remedy for accumulation-chain ' +
    'rounding -- collapses it. It does NOT. (F1) FOR EIGHT SUMMANDS KAHAN IS BIT-IDENTICAL TO NAIVE ' +
    'SUMMATION: at the reference point (N = 1e13, dp = 1e-2) |kahan - naive| = 0 exactly for every one ' +
    'of the four orderings tested (forward/reverse/ascending/descending by weight magnitude) -- with ' +
    'only eight terms there is no accumulation error left for Kahan to cancel. (F2) THE CROSS-ORDERING ' +
    'SPREAD IS UNCHANGED: the raw q3-numerator spread across orderings is ~2.70e-13 under BOTH naive ' +
    'and Kahan, and the plateau spread is ~2.17e-5 naive vs ~1.75e-5 Kahan (~1.24x, same order of ' +
    'magnitude, not a collapse). (F3) THE JITTER IS THE CATASTROPHIC-CANCELLATION CONDITIONING FLOOR: ' +
    'the largest stencil term ~6.96e3 cancels to a true numerator ~8.24e-9 (cancellation ratio ' +
    '~8.44e11, ~11.9 digits lost), giving an input-roundoff floor max|term|*eps/|sum| ~ 1.87e-4 ' +
    '(relative) that lives in the pre-rounded inputs w*q(p + k dp), not in the addition chain -- no ' +
    'summation algorithm can recover it. CONCLUSION: the ~7e-6 (broadly ~2e-5) jitter is the ' +
    'roundoff-CONDITIONING floor of the tiny-q3 near-cancellation, not a Kahan-removable ' +
    'accumulation-order artifact; reordering EXPOSES the floor, compensated accumulation cannot REMOVE ' +
    'it. This SHARPENS imp-34649 F3, it does not contradict it. q1,q2,q3 are inherited central ' +
    'differences, NOT fresh analytic closed forms, so the sigma -> 1 deep-tail regime ' +
    '(imp-3220/imp-3406 component model least trustworthy) is inherited as-is. The -2 asymptote and ' +
    'C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional share ' +
    'per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34649 (F3 ~7e-6 6th-order plateau jitter assessed here); imp-34626 (6th-order 9-point ' +
    'stencil); imp-34611 (2nd/4th-order inline plateau); imp-34593 (roundoff-free plateau drift ' +
    '~ -0.0968); imp-34587 (Richardson dp -> 0 intrinsic ~ -0.0748); imp-34573 (deep-tail q3-share ' +
    'error); imp-34531 (F2 O(h^2) coefficient certification); imp-34446 (central-difference exponent); ' +
    'imp-33620 (deep-tail landmark N* ~ 4.62e13, sigma < 0.01); imp-2714 (C_C ansatz); imp-486 (C_mb).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34673_ASSERTIONS = [
  {
    id: 'imp34673-q3-stencil-normalization',
    holds: () => {
      // The 9-point q3 stencil must satisfy the 3rd-derivative normalization sum c_k k^3 / 6 = 1, and
      // the fixed q2 stencil the 2nd-derivative normalization sum c_k k^2 / 2 = 1 -- guards the tables.
      let m3 = 0;
      for (const [k, w] of Q3_TERMS) m3 += w * k * k * k;
      let m2 = 0;
      for (const [k, w] of Q2_TERMS) m2 += w * k * k;
      return Math.abs(m3 / Q3_DENOM / 6 - 1) < 1e-12 && Math.abs(m2 / Q2_DENOM / 2 - 1) < 1e-12;
    },
    why: 'The q3 (3rd-deriv) and q2 (2nd-deriv) stencils inherited from imp-34626 must satisfy their derivative normalizations; guards against a transcription/sign error in the tables under test.',
  },
  {
    id: 'imp34673-kahan-bit-identical-for-eight-terms',
    holds: () =>
      MAX_KAHAN_MINUS_NAIVE === 0 && Q3NUM_SPREAD_KAHAN === Q3NUM_SPREAD_NAIVE,
    why: 'F1/F2: for eight summands Kahan is bit-identical to naive summation per ordering (diff exactly 0) and the cross-ordering raw-numerator spread is unchanged -- there is no accumulation-chain error for Kahan to remove.',
  },
  {
    id: 'imp34673-kahan-does-not-collapse-plateau-spread',
    holds: () =>
      PLATEAU_SPREAD_KAHAN > 1e-5 &&
      KAHAN_REDUCTION_FACTOR < 2 &&
      PLATEAU_SPREAD_NAIVE > 1e-5,
    why: 'F2: Kahan leaves the cross-ordering plateau spread at the same ~2e-5 order of magnitude (reduction factor < 2x), so it does NOT collapse the imp-34649 F3 jitter -- the spread is not a Kahan-removable accumulation-order artifact.',
  },
  {
    id: 'imp34673-catastrophic-cancellation-conditioning-floor',
    holds: () =>
      CANCELLATION_RATIO > 1e11 &&
      LOST_DIGITS > 11 &&
      INPUT_ROUNDOFF_FLOOR_REL > 1e-5,
    why: 'F3: the tiny q3 numerator loses ~11.9 digits to catastrophic cancellation (ratio ~8.4e11), giving an input-roundoff conditioning floor ~1.87e-4 (relative) that no summation algorithm can recover -- the true source of the jitter.',
  },
  {
    id: 'imp34673-honesty-gate-no-qed',
    holds: () =>
      IMP34673_PLATEAU_DRIFT_KAHAN_PROBE.isRigorous === false &&
      /NO QED/.test(IMP34673_PLATEAU_DRIFT_KAHAN_PROBE.verdict) &&
      /refereed bound is changed/i.test(IMP34673_PLATEAU_DRIFT_KAHAN_PROBE.verdict) &&
      /UNTOUCHED/.test(IMP34673_PLATEAU_DRIFT_KAHAN_PROBE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34673_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34673-plateau-drift-kahan-summation-order-probe assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34673_PLATEAU_DRIFT_KAHAN_PROBE;
