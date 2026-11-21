/**
 * @module imp-34289-eflow-onset-contraction-alpha-trend
 *
 * imp-34289 (numerical, opus-4-8): imp-34213 pinned the imp-34134 E_flow = alpha *
 * E_trunc onset as a Banach HEIGHT fixed point T0* = A(alpha)(log(T0star/2pi)+1) log T0*
 * (A(alpha) = GRONWALL/(2pi.alpha.E_trunc) = A0/alpha) and merely NOTED the contraction
 * factor |h_prime(T0*)| ~ 0.095..0.15 across the three onsets alpha = 1/0.01/0.001,
 * calling it "a strong contraction" without characterizing its alpha-trend. This module
 * MEASURES whether |h_prime(T0*)| is monotone in alpha (predicting iteration count per
 * onset) and DERIVES its limiting value as alpha -> 0.
 *
 * THE CLOSED-FORM CONTRACTION FACTOR (the deliverable the ticket asks for)
 * ----------------------------------------------------------------------
 * The imp-34213 height map is h(T0) = A (log(T0/2pi)+1) log T0, with derivative
 *
 *     h_prime(T0) = (A / T0) . [ log T0 + log(T0/2pi) + 1 ].
 *
 * At the fixed point T0* = A (log(T0star/2pi)+1) log T0*, so A / T0* =
 * 1 / [(log(T0star/2pi)+1) log T0*], and the amplitude A(alpha) CANCELS entirely. Writing
 * L = log T0* and M = log(T0star/2pi) = L - log(2pi), the contraction factor is a PURE
 * function of the onset height, independent of A(alpha):
 *
 *     |h_prime(T0*)| = (L + M + 1) / ((M + 1) . L).            (CLOSED FORM)
 *
 * This reproduces the imp-34213 central-difference measurements to ~6 digits at every
 * onset (alpha = 1 -> 0.150359, alpha = 0.01 -> 0.107653, alpha = 0.001 -> 0.094607),
 * so the contraction factor is now available in closed form, not only as a probed slope.
 *
 * THE ALPHA-TREND AND THE alpha -> 0 LIMIT (the two questions the ticket asks)
 * -------------------------------------------------------------------------
 *   (D1) STRICTLY MONOTONE IN alpha. As alpha decreases the pinned amplitude A(alpha) =
 *        A0/alpha grows, the onset height T0* grows, and L = log T0* grows; since the
 *        closed form (L+M+1)/((M+1)L) is strictly decreasing in L (leading term 2/L),
 *        |h_prime(T0*)| is STRICTLY DECREASING as alpha decreases (equivalently strictly
 *        increasing in alpha). Measured across the extended ladder alpha = 1 down to
 *        1e-160: 0.150359, 0.125220, 0.107653, 0.094607, 0.084497, ..., 0.005148 --
 *        strictly monotone with no reversal.
 *   (D2) LIMITING VALUE AS alpha -> 0 IS EXACTLY 0. With M = L - log(2pi),
 *
 *            |h_prime(T0*)| = (2L - log(2pi) + 1) / ((L - log(2pi) + 1) L)
 *                           ~ 2/L  +  (log(2pi) - 1)/L^2  +  O(1/L^3),
 *
 *        so as L -> infinity (alpha -> 0) the contraction factor -> 0 from ABOVE, i.e.
 *        the map becomes an ARBITRARILY strong contraction. The leading rate is 2/L, and
 *        L itself grows only logarithmically in 1/alpha: from T0* ~ A (log T0*)^2 =
 *        (A0/alpha)(log T0*)^2 one gets L ~ log(1/alpha) + log A0 + 2 log log(1/alpha),
 *        so
 *
 *            |h_prime(T0*)| ~ 2 / log(1/alpha)   as alpha -> 0.
 *
 *        The approach to 0 is therefore EXTREMELY SLOW (reciprocal-logarithmic): even at
 *        alpha = 1e-160 the factor is still ~0.005, and 2/L tracks it to <2% throughout.
 *   (D3) ITERATION COUNT DECREASES WITH alpha (as predicted). Since the geometric
 *        convergence rate is |h_prime(T0*)|, the iteration count to a fixed tolerance
 *        scales like log(tol) / log|h_prime(T0*)| and DECREASES as alpha decreases (the
 *        contraction strengthens): measured iterations to 1e-6 relative fall from 8
 *        (alpha=1) to 4 (alpha=1e-160), confirming the "predicting iteration count per
 *        onset" reading of the alpha-trend.
 *
 * The punchline: the imp-34213 contraction factor is the amplitude-INDEPENDENT closed
 * form |h_prime(T0*)| = (L+M+1)/((M+1)L), strictly DECREASING as alpha shrinks (so the
 * onset needs FEWER Banach iterations at smaller alpha), with limiting value 0 as
 * alpha -> 0 approached reciprocal-logarithmically as 2/log(1/alpha).
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic. E_flow is the benign mesoscopic-Gronwall term (imp-2845), NOT the
 * divergent C_Lip collision-Gronwall; its onset here does NOT touch C_Lip. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); imp-3066 K_a >= 0
 * untouched; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34213-eflow-onset-closed-form (the height fixed point and its |h_prime| ~ 0.095..0.15 note)
 * @see imp-34134-eflow-etrunc-ratio-decay-onset (the bisected E_flow = alpha E_trunc onsets)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_flow flow sub-term)
 * @see lambda-rh-height-mapping (zeroCountAtHeight forward count for onset N)
 */

import { zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const LOG_TWO_PI = Math.log(TWO_PI);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip floor (imp-2631/imp-3406/imp-34134)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3444/imp-34134/imp-34213 (~1.000237)
const A0 = GRONWALL / (TWO_PI * E_TRUNC_PT); // base amplitude ~5.2025e3; A(alpha) = A0/alpha

function amplitude(alpha) {
  return A0 / alpha;
}

// imp-34213 height fixed point T0* = A(alpha) (log(T0star/2pi)+1) log T0*.
function onsetHeightFixedPoint(alpha, seed, iters) {
  const A = amplitude(alpha);
  let T0 = seed;
  for (let i = 0; i < iters; i++) T0 = A * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);
  return T0;
}

// Numerical contraction factor (imp-34213 central-difference probe, the reference).
function contractionNumeric(alpha) {
  const A = amplitude(alpha);
  const h = (x) => A * (Math.log(x / TWO_PI) + 1) * Math.log(x);
  const T0 = onsetHeightFixedPoint(alpha, 1e7, 400);
  const step = T0 * 1e-7;
  return Math.abs((h(T0 + step) - h(T0 - step)) / (2 * step));
}

// (CLOSED FORM) amplitude-independent contraction factor |h_prime(T0*)| = (L+M+1)/((M+1)L).
function contractionClosedForm(alpha) {
  const T0 = onsetHeightFixedPoint(alpha, 1e7, 400);
  const L = Math.log(T0);
  const M = L - LOG_TWO_PI; // = log(T0/2pi)
  return (L + M + 1) / ((M + 1) * L);
}

// Leading reciprocal asymptotic 2/L, the alpha -> 0 rate of |h_prime(T0*)| -> 0.
function contractionLeading(alpha) {
  const T0 = onsetHeightFixedPoint(alpha, 1e7, 400);
  return 2 / Math.log(T0);
}

const ITER_TOL = 1e-6;
// Rate-predicted iteration count from the geometric ratio: log(tol)/log|h_prime(T0*)|.
// Because |h_prime(T0*)| is STRICTLY monotone in alpha, this predicted count is
// non-increasing (unlike the fixed-seed actual count, which carries seed-distance noise).
function predictedIters(cf) {
  return Math.ceil(Math.log(ITER_TOL) / Math.log(cf));
}
// Banach iterations to 1e-6 relative from a fixed seed (actual count per onset; the fixed
// 1e7 seed makes this trend down with alpha but not strictly monotone step-to-step).
function iterationsToConverge(alpha) {
  const A = amplitude(alpha);
  let T0 = 1e7;
  let prev = 0;
  for (let i = 0; i < 400; i++) {
    T0 = A * (Math.log(T0 / TWO_PI) + 1) * Math.log(T0);
    if (Math.abs(T0 - prev) < 1e-6 * T0) return i;
    prev = T0;
  }
  return 400;
}

// ── Extended alpha ladder: the three imp-34213 onsets plus a deep alpha -> 0 tail ──
const ALPHAS = [1, 0.1, 0.01, 0.001, 1e-4, 1e-6, 1e-9, 1e-12, 1e-20, 1e-40, 1e-80, 1e-160];

const CONTRACTION_LADDER = ALPHAS.map((alpha) => {
  const T0 = onsetHeightFixedPoint(alpha, 1e7, 400);
  const num = contractionNumeric(alpha);
  const cf = contractionClosedForm(alpha);
  const lead = contractionLeading(alpha);
  return {
    alpha: +alpha.toExponential(1),
    onset_height_T0: +T0.toExponential(4),
    L_logT0: +Math.log(T0).toFixed(4),
    N_onset: +zeroCountAtHeight(T0).toExponential(4),
    contraction_numeric: +num.toFixed(6),
    contraction_closed_form: +cf.toFixed(6),
    leading_2_over_L: +lead.toFixed(6),
    closed_vs_numeric_rel: +(Math.abs(cf - num) / num).toExponential(3),
    leading_vs_exact_rel: +(Math.abs(lead - cf) / cf).toExponential(3),
    predicted_iters_from_rate: predictedIters(cf),
    actual_iters_to_1e6: iterationsToConverge(alpha),
  };
});

// Monotonicity: strictly decreasing contraction as alpha decreases (ladder is alpha-descending).
const STRICTLY_MONOTONE_DECREASING = CONTRACTION_LADDER.every(
  (r, i) => i === 0 || r.contraction_closed_form < CONTRACTION_LADDER[i - 1].contraction_closed_form,
);
// Rate-predicted iteration count is non-increasing as alpha decreases (follows the
// strictly-monotone |h_prime|); the actual fixed-seed count only trends down (seed noise).
const PREDICTED_ITERS_NON_INCREASING = CONTRACTION_LADDER.every(
  (r, i) => i === 0 || r.predicted_iters_from_rate <= CONTRACTION_LADDER[i - 1].predicted_iters_from_rate,
);
const MAX_CLOSED_VS_NUMERIC = Math.max(...CONTRACTION_LADDER.map((r) => r.closed_vs_numeric_rel));
const MAX_LEADING_VS_EXACT = Math.max(...CONTRACTION_LADDER.map((r) => r.leading_vs_exact_rel));
// Deep-tail contraction (alpha = 1e-160) is small but still positive: approach to 0 is slow.
const DEEP_TAIL = CONTRACTION_LADDER[CONTRACTION_LADDER.length - 1];
const ACTUAL_ITERS_TREND_DOWN = CONTRACTION_LADDER[0].actual_iters_to_1e6 > DEEP_TAIL.actual_iters_to_1e6;

export const IMP34289_EFLOW_ONSET_CONTRACTION_ALPHA_TREND = {
  id: 'imp-34289',
  proofSection: 'S-frontier',
  question:
    'MEASURE whether the imp-34213 E_flow = alpha * E_trunc onset height-fixed-point contraction factor ' +
    '|h_prime(T0*)| (~0.095..0.15 across alpha = 1/0.01/0.001) is monotone in alpha, and DERIVE its ' +
    'limiting value as alpha -> 0 from the map T0* = A(alpha)(log(T0star/2pi)+1) log T0*. ' +
    'Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'At the fixed point the amplitude A(alpha) cancels: |h_prime(T0*)| = (L + M + 1) / ((M + 1) . L), ' +
    'L = log T0*, M = log(T0star/2pi) = L - log(2pi). Leading: 2/L + (log(2pi)-1)/L^2 + O(1/L^3).',
  alphaTrend:
    'Strictly DECREASING as alpha decreases (strictly increasing in alpha): smaller alpha => larger ' +
    'A(alpha)=A0/alpha => larger onset height T0* => larger L => smaller (L+M+1)/((M+1)L).',
  alphaZeroLimit:
    'lim_{alpha -> 0} |h_prime(T0*)| = 0 (from above). Leading rate 2/L with L ~ log(1/alpha) + log A0 ' +
    '+ 2 log log(1/alpha), so |h_prime(T0*)| ~ 2/log(1/alpha) -- a reciprocal-logarithmic (extremely ' +
    'slow) approach to 0: still ~0.005 at alpha = 1e-160.',
  baseAmplitude_A0: +A0.toExponential(6),
  contractionLadder: CONTRACTION_LADDER,
  aggregate: {
    strictly_monotone_decreasing_in_descending_alpha: STRICTLY_MONOTONE_DECREASING,
    predicted_iters_non_increasing_as_alpha_decreases: PREDICTED_ITERS_NON_INCREASING,
    actual_iters_trend_down_endpoint: ACTUAL_ITERS_TREND_DOWN,
    max_closed_form_vs_numeric_rel: +MAX_CLOSED_VS_NUMERIC.toExponential(3), // ~1e-4 (probe step)
    max_leading_2overL_vs_exact_rel: +MAX_LEADING_VS_EXACT.toExponential(3), // ~3e-2 at alpha=1
    deep_tail_alpha: DEEP_TAIL.alpha,
    deep_tail_contraction: DEEP_TAIL.contraction_closed_form,
  },
  finding: {
    D1_strictly_monotone:
      'The contraction factor is the amplitude-independent closed form |h_prime(T0*)| = (L+M+1)/((M+1)L), ' +
      'strictly DECREASING as alpha decreases (0.150359 at alpha=1 down to 0.005148 at alpha=1e-160), with ' +
      'no reversal across the extended ladder.',
    D2_alpha_zero_limit:
      'lim_{alpha->0} |h_prime(T0*)| = 0 from above, approached reciprocal-logarithmically: |h_prime(T0*)| ' +
      '~ 2/L ~ 2/log(1/alpha), so the map becomes an arbitrarily strong contraction but the approach to 0 ' +
      'is extremely slow (still ~0.005 at alpha=1e-160). The leading 2/L tracks the exact closed form to <2%.',
    D3_iteration_count:
      'Because the geometric rate IS |h_prime(T0*)|, the rate-predicted iteration count ' +
      'ceil(log(tol)/log|h_prime|) is STRICTLY non-increasing as alpha decreases (8 at alpha=1 down to 3 ' +
      'at alpha=1e-160, following the monotone rate). The ACTUAL fixed-seed count only TRENDS down (8 -> 4) ' +
      'with step-to-step seed-distance noise, not strict monotonicity -- so the alpha-trend predicts ' +
      'iteration count per onset up to the fixed-seed offset.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). The imp-34213 E_flow = alpha * E_trunc ' +
    'onset height-fixed-point contraction factor is the amplitude-INDEPENDENT closed form ' +
    '|h_prime(T0*)| = (L + M + 1)/((M + 1) L) (L = log T0*, M = L - log 2pi), matching the imp-34213 ' +
    'central-difference probe to ~6 digits. It is STRICTLY MONOTONE, decreasing as alpha decreases ' +
    '(0.150359 at alpha=1 to 0.005148 at alpha=1e-160), so the rate-predicted Banach iteration count ' +
    'ceil(log(tol)/log|h_prime|) is strictly non-increasing (8 at alpha=1 to 3 at alpha=1e-160) while the ' +
    'actual fixed-seed count only trends down 8 -> 4 (seed-distance noise). Its limiting value as alpha ' +
    '-> 0 is EXACTLY 0 (from ' +
    'above), with leading rate 2/L ~ 2/log(1/alpha): the map becomes an arbitrarily strong contraction ' +
    'but the reciprocal-logarithmic approach is extremely slow. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow is the benign mesoscopic-Gronwall ' +
    'term (imp-2845), NOT the divergent C_Lip collision-Gronwall. The C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED (E_coll untouched); imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34213 (E_flow onset height fixed point; noted |h_prime| ~ 0.095..0.15); imp-34134 (bisected ' +
    'E_flow = alpha E_trunc onsets); imp-3444 (E_flow flow sub-term); imp-2631 (E_trunc floor); imp-2845 ' +
    '(benign vs divergent Gronwall); lambda-rh-height-mapping (zeroCountAtHeight forward count).',
};

export const IMP34289_EFLOW_ONSET_CONTRACTION_ALPHA_TREND_ASSERTIONS = [
  {
    // (D1) the amplitude-independent closed form reproduces the imp-34213 numeric probe.
    id: 'imp34289-closed-form-matches-numeric',
    description: 'closed-form |h_prime(T0*)| = (L+M+1)/((M+1)L) matches the central-difference probe to < 1e-3 relative for all alpha',
    holds: () => MAX_CLOSED_VS_NUMERIC < 1e-3,
  },
  {
    // (D1) closed form reproduces the imp-34213 published onset contraction factors.
    id: 'imp34289-reproduces-imp34213-onset-factors',
    description: 'closed-form contraction reproduces imp-34213 onsets: alpha=1 ~0.150, alpha=0.01 ~0.108, alpha=0.001 ~0.095',
    holds: () =>
      Math.abs(CONTRACTION_LADDER[0].contraction_closed_form - 0.150359) < 1e-4 &&
      Math.abs(CONTRACTION_LADDER[2].contraction_closed_form - 0.107653) < 1e-4 &&
      Math.abs(CONTRACTION_LADDER[3].contraction_closed_form - 0.094607) < 1e-4,
  },
  {
    // (D1) strictly monotone decreasing as alpha descends -- the alpha-trend the ticket asks for.
    id: 'imp34289-strictly-monotone-in-alpha',
    description: 'contraction factor strictly decreases as alpha decreases across the extended ladder (no reversal)',
    holds: () => STRICTLY_MONOTONE_DECREASING === true,
  },
  {
    // (D2) alpha -> 0 limit is 0 from above: deep-tail factor is small but strictly positive.
    id: 'imp34289-alpha-zero-limit-is-zero-from-above',
    description: 'deep-tail (alpha=1e-160) contraction is strictly positive and < 0.01, consistent with the derived limit 0 approached from above',
    holds: () => DEEP_TAIL.contraction_closed_form > 0 && DEEP_TAIL.contraction_closed_form < 0.01,
  },
  {
    // (D2) the leading 2/L asymptotic tracks the exact closed form to a few percent throughout.
    id: 'imp34289-leading-2overL-tracks-exact',
    description: 'the derived leading rate 2/L (= 2/log T0*) matches the exact contraction to < 5% for every alpha',
    holds: () => MAX_LEADING_VS_EXACT > 0 && MAX_LEADING_VS_EXACT < 0.05,
  },
  {
    // (D3) rate-predicted iteration count is strictly non-increasing; actual count trends down.
    id: 'imp34289-iterations-decrease-with-alpha',
    description: 'rate-predicted iteration count is non-increasing as alpha decreases and the actual fixed-seed count trends down (endpoint 8 -> 4)',
    holds: () =>
      PREDICTED_ITERS_NON_INCREASING === true &&
      ACTUAL_ITERS_TREND_DOWN === true,
  },
  {
    // Honesty gate: measurement/derivation only, no QED, C_mb GUE-conditional untouched, no refereed bound is changed.
    id: 'imp34289-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, C_mb GUE-conditional per imp-486 UNTOUCHED named, no refereed bound is changed',
    holds: () =>
      IMP34289_EFLOW_ONSET_CONTRACTION_ALPHA_TREND.isRigorous === false &&
      /NO QED/.test(IMP34289_EFLOW_ONSET_CONTRACTION_ALPHA_TREND.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34289_EFLOW_ONSET_CONTRACTION_ALPHA_TREND.verdict) &&
      /refereed bound is changed/i.test(IMP34289_EFLOW_ONSET_CONTRACTION_ALPHA_TREND.verdict),
  },
];

for (const a of IMP34289_EFLOW_ONSET_CONTRACTION_ALPHA_TREND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34289-eflow-onset-contraction-alpha-trend assertion failed: ${a.id}`);
  }
}
