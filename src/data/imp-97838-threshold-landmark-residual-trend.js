/**
 * @module imp-97838-threshold-landmark-residual-trend
 *
 * imp-97838 (numerical, frontier-direction): imp-33743 supplied the general-threshold closed-form
 * (fixed-point) crossover N_cross(thr) = (C_C (1-thr)/(E_trunc thr))^2 * log T0(N_cross) and
 * evaluated it ONLY at the thr = 0.1 far-tail landmark, where the closed-form-vs-empirical residual
 * (~7.4e-5) was ~54x tighter than the ~0.4% halving (thr = 0.5) residual, tracing the gap to the
 * vanishing E_flow term. This module EXTENDS the same closed form to two further thresholds -- a
 * near-peak thr = 0.9 and a deep-tail thr = 0.01 -- and TABULATES how the residual trends with
 * threshold, testing the E_flow-vanishing explanation across the full family.
 *
 * THE EXTENSION (measurement only, same imp-33743 sub-terms; no re-derivation)
 * ---------------------------------------------------------------------------
 * The closed form is the imp-33743 fixed point verbatim; only thr changes. For each thr we compute
 *   (a) N_cross(thr)      -- Banach iteration of N = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N),
 *   (b) N_emp(thr)        -- downslope bisection of sigma(N) = thr (sigma strictly decreasing past
 *                            the N ~ 9.23e5 peak, sigma_peak ~ 0.9494, so thr = 0.9 is a valid
 *                            below-peak downslope crossing),
 *   (c) N_flow(thr)       -- the E_flow-inclusive threshold fixed point (imp-33743 D2 check),
 *       and the ratios rel(thr) = (N_cross - N_emp)/N_emp and E_flow/E_trunc at N_emp.
 *
 * THE FINDING (derivation / measurement only)
 * -------------------------------------------
 *   (D1) THE RESIDUAL FALLS MONOTONICALLY WITH THRESHOLD, TRACKING 2*E_flow/E_trunc OVER ~5.5
 *        DECADES. As thr drops 0.9 -> 0.5 -> 0.1 -> 0.01 the crossover walks down the tail
 *        (N_emp ~ 2.57e7 -> 3.27e9 -> 3.21e11 -> 4.62e13) and the closed-form residual collapses
 *        rel ~ 2.46e-1 -> 3.99e-3 -> 7.38e-5 -> 8.79e-7, tracking the leading predictor
 *        2*E_flow/E_trunc = 2.18e-1 -> 3.81e-3 -> 7.10e-5 -> 8.51e-7 the whole way. The neglected
 *        Gronwall flow term E_flow ~ log T0 / T0 shrinks down the tail (E_flow/E_trunc = 1.09e-1 ->
 *        1.91e-3 -> 3.55e-5 -> 4.26e-7), so the leading closed form is MOST accurate in the deep
 *        tail and WORST near the peak -- the thr = 0.1 landmark imp-33743 reported is just one rung
 *        of a smooth, one-parameter trend, and the ~54x halving/far-tail contrast (3.98e-3 / 7.38e-5)
 *        is the same E_flow ratio (1.91e-3 / 3.55e-5).
 *   (D2) THE LINEAR E_flow PREDICTOR HAS VISIBLE CURVATURE ONLY WHERE E_flow/E_trunc STOPS BEING
 *        TINY. The ratio rel / (2*E_flow/E_trunc) is 1.125 at thr = 0.9 (E_flow/E_trunc ~ 0.11, no
 *        longer small, so the O((E_flow/E_trunc)^2) and log T0 drift terms are visible), 1.049 at
 *        thr = 0.5, and relaxes to ~1.03 by thr = 0.1 and 0.01 -- the residual-is-the-flow-term
 *        explanation is exact to leading order everywhere and the sub-1.04 residual excess in the
 *        tail is the ~2.8e-6 log T0 drift imp-33743 identified. Restoring E_flow in the threshold
 *        balance closes the gap to floating-point zero (< 6e-15 relative) at EVERY threshold,
 *        confirming the trend is entirely the flow term, NOT a grid or rounding artifact.
 *
 * The punchline: imp-33743's thr = 0.1 far-tail result is one point on a monotone residual curve.
 * The leading closed form's accuracy is set by E_flow/E_trunc alone -- ~25% error at the near-peak
 * thr = 0.9, ~0.0001% at the deep-tail thr = 0.01 -- and the flow-inclusive fixed point is exact to
 * machine precision across the whole family. This confirms the E_flow-vanishing explanation as a
 * quantitative law of the threshold rather than a single-landmark coincidence.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33743-sigma-fartail-crossover-closed-form (thr = 0.1 far-tail landmark; the E_flow explanation)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (halving-landmark closed form, thr = 1/2)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma < 0.1 crossing N ~ 3.21e11, bisected)
 * @see imp-34174-crossover-surplus-threshold-family-decay (E_flow surplus across the threshold family)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33723/imp-33743 exactly

// EXACT imp-3406/imp-33582/imp-33723/imp-33743 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // halving amplitude ~1.5727e8 (imp-33723)

// (CLOSED FORM, imp-33743 verbatim) leading threshold crossover as the fixed point
// N = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N).
function crossoverFixedPoint(thr, seed, iters) {
  const K = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = seed;
  for (let i = 0; i < iters; i++) N = K * Math.log(effectiveHeightForN(N));
  return N;
}

// E_flow-inclusive threshold fixed point: E_coll = thr/(1-thr) * (E_trunc + E_flow) (imp-33743 D2 check).
function crossoverFixedPointWithFlow(thr, seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) {
    const rhs = (thr / (1 - thr)) * (E_TRUNC_PT + parts(N).E_flow);
    N = (C_C_PINNED / rhs) ** 2 * Math.log(effectiveHeightForN(N));
  }
  return N;
}

// Downslope bisection in log N for the strictly-decreasing sigma past the peak (reference).
function crossBelowSigma(thr, lo, hi) {
  let a = Math.log(lo);
  let b = Math.log(hi);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).sigma > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Locate the sigma peak so the thr = 0.9 downslope root is bracketed below it.
function sigmaPeak() {
  let bestSig = 0;
  let bestN = 1e6;
  for (let lx = 3; lx < 20; lx += 0.001) {
    const N = Math.pow(10, lx);
    const s = parts(N).sigma;
    if (s > bestSig) {
      bestSig = s;
      bestN = N;
    }
  }
  return { bestSig, bestN };
}
const PEAK = sigmaPeak(); // sigma_peak ~ 0.9494 at N ~ 9.23e5

// The threshold family: two new rungs (0.9 near-peak, 0.01 deep-tail) plus the imp-33743/imp-33723
// anchors (0.1, 0.5) for the trend.
const THRESHOLDS = [0.9, 0.5, 0.1, 0.01];

const ROWS = THRESHOLDS.map((thr) => {
  const N_cf = crossoverFixedPoint(thr, 1e8, 200);
  const N_flow = crossoverFixedPointWithFlow(thr, 1e8, 200);
  const N_emp = crossBelowSigma(thr, PEAK.bestN * 1.0001, 1e20);
  const rel = (N_cf - N_emp) / N_emp; // leading closed-form vs empirical
  const P = parts(N_emp);
  const rFlow = P.E_flow / E_TRUNC_PT; // E_flow/E_trunc at the crossing
  const linPredictor = 2 * rFlow; // rel ~ 2 * E_flow/E_trunc (N proportional to E_coll^-2)
  const withFlowRel = Math.abs(N_flow - N_emp) / N_emp; // ~machine zero when E_flow restored
  return {
    threshold: thr,
    N_cross_closed_form: +N_cf.toExponential(6),
    N_cross_empirical_bisection: +N_emp.toExponential(6),
    N_cross_with_E_flow_restored: +N_flow.toExponential(6),
    rel_offset_closed_form: +rel.toExponential(4),
    linear_predictor_2x_E_flow_over_E_trunc: +linPredictor.toExponential(4),
    rel_over_linear_predictor: +(rel / linPredictor).toFixed(4),
    E_flow_over_E_trunc_at_crossing: +rFlow.toExponential(4),
    with_flow_vs_empirical_rel: +withFlowRel.toExponential(3),
    sigma_at_empirical: +P.sigma.toFixed(6),
  };
});

// Trend summaries for the assertions.
const REL_MONOTONE_DOWN = ROWS.every(
  (r, i) => i === 0 || Math.abs(r.rel_offset_closed_form) < Math.abs(ROWS[i - 1].rel_offset_closed_form)
);
const RATIO_RELAXES = // rel/predictor inflates near the peak, relaxes toward ~1.03 in the tail
  ROWS[0].rel_over_linear_predictor > ROWS[3].rel_over_linear_predictor &&
  ROWS[3].rel_over_linear_predictor < 1.05;
const MAX_WITH_FLOW = Math.max(...ROWS.map((r) => r.with_flow_vs_empirical_rel));

export const IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND = {
  id: 'imp-97838',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33743 closed-form threshold-landmark fixed point N_cross(thr) = ' +
    '(C_C(1-thr)/(E_trunc thr))^2 log T0 from the thr = 0.1 far-tail landmark to a near-peak ' +
    'thr = 0.9 and a deep-tail thr = 0.01, and tabulate how the closed-form-vs-empirical residual ' +
    'trends with threshold, testing the E_flow-vanishing explanation. ' +
    'Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; no QED.',
  closedForm:
    'N_cross(thr) = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N_cross)  (fixed point, imp-33743 verbatim); ' +
    'leading residual rel(thr) = (N_cross - N_emp)/N_emp ~ 2 * E_flow/E_trunc at the crossing.',
  sigmaPeak: {
    sigma_peak: +PEAK.bestSig.toFixed(6), // ~0.949429
    N_peak: +PEAK.bestN.toExponential(4), // ~9.2257e5
    note: 'thr = 0.9 sits below the sigma peak (~0.9494), so its downslope crossing is well defined.',
  },
  thresholdFamily: ROWS,
  trend: {
    rel_offset_falls_monotonically_with_threshold: REL_MONOTONE_DOWN,
    rel_offset_span: `${ROWS[0].rel_offset_closed_form} (thr=0.9) down to ${ROWS[3].rel_offset_closed_form} (thr=0.01)`,
    E_flow_over_E_trunc_span: `${ROWS[0].E_flow_over_E_trunc_at_crossing} (thr=0.9) down to ${ROWS[3].E_flow_over_E_trunc_at_crossing} (thr=0.01)`,
    linear_predictor_ratio_relaxes_to: ROWS[3].rel_over_linear_predictor, // ~1.03 deep tail
    linear_predictor_ratio_at_peak: ROWS[0].rel_over_linear_predictor, // ~1.12 near peak
    max_with_flow_vs_empirical_rel: +MAX_WITH_FLOW.toExponential(3), // < 6e-15
  },
  finding: {
    D1_residual_falls_monotonically_tracking_E_flow:
      'As thr drops 0.9 -> 0.5 -> 0.1 -> 0.01 the crossover walks down the tail (N_emp ~ 2.57e7 -> ' +
      '3.27e9 -> 3.21e11 -> 4.62e13) and the leading closed-form residual collapses ' +
      '~2.46e-1 -> 3.99e-3 -> 7.38e-5 -> 8.79e-7, tracking 2*E_flow/E_trunc = 2.18e-1 -> 3.81e-3 -> ' +
      '7.10e-5 -> 8.51e-7 across ~5.5 decades. The neglected flow term E_flow ~ log T0 / T0 shrinks ' +
      'down the tail, so the leading closed form is most accurate deep in the tail and worst near the ' +
      'peak; imp-33743 thr = 0.1 is one rung of this monotone trend.',
    D2_linear_predictor_curves_only_where_E_flow_is_not_tiny:
      'The ratio rel / (2*E_flow/E_trunc) is ~1.125 at thr = 0.9 (E_flow/E_trunc ~ 0.11, no longer ' +
      'small), ~1.049 at thr = 0.5, and relaxes to ~1.03 by thr = 0.1/0.01 -- the residual-is-the-flow-' +
      'term law is exact to leading order everywhere; the sub-1.04 tail excess is the ~2.8e-6 log T0 ' +
      'drift imp-33743 identified. Restoring E_flow in the threshold balance closes the gap to ' +
      'floating-point zero (< 6e-15 relative) at every threshold -- the trend is entirely the flow ' +
      'term, NOT a grid or rounding artifact.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION (frontier-direction, NOT rigorous). The imp-33743 closed-form threshold crossover ' +
    'N_cross(thr) = ((1-thr)/thr)^2 (C_C/E_trunc)^2 log T0(N_cross) extends smoothly from the thr = 0.1 ' +
    'far-tail landmark to a near-peak thr = 0.9 and a deep-tail thr = 0.01. The closed-form-vs-empirical ' +
    'residual falls MONOTONICALLY with the threshold -- ~2.46e-1 (thr=0.9) -> 3.99e-3 (thr=0.5) -> ' +
    '7.38e-5 (thr=0.1) -> 8.79e-7 (thr=0.01) -- tracking the leading predictor 2*E_flow/E_trunc across ' +
    '~5.5 decades, so the ~54x halving/far-tail contrast imp-33743 reported is just the E_flow ratio ' +
    'and the leading closed form is most accurate deep in the tail. The linear predictor has visible ' +
    'curvature (ratio ~1.12) only near the peak where E_flow/E_trunc ~ 0.11 is no longer tiny, ' +
    'relaxing to ~1.03 in the tail; restoring E_flow closes the residual to < 6e-15 at EVERY threshold, ' +
    'confirming the E_flow-vanishing explanation as a quantitative law of the threshold, not a ' +
    'single-landmark coincidence. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33743 (thr = 0.1 far-tail closed form, the E_flow explanation); imp-33723 (halving closed ' +
    'form, thr = 1/2); imp-33582 (sigma < 0.1 crossing, bisected); imp-33601 (exact identity ' +
    'sigma=1/2 <=> E_coll=E_trunc+E_flow); imp-399/imp-2642 (C_C = (1/8) sqrt(3 pi)); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND_ASSERTIONS = [
  {
    // (D1): the closed-form residual falls monotonically as the threshold drops.
    id: 'imp97838-residual-monotone-in-threshold',
    description: 'closed-form rel offset falls monotonically 0.9 -> 0.5 -> 0.1 -> 0.01 (deeper tail = tighter)',
    holds: () => REL_MONOTONE_DOWN,
  },
  {
    // (D1): the residual spans ~25% (near peak) down to ~1e-6 (deep tail), tracking E_flow.
    id: 'imp97838-residual-spans-five-decades',
    description: 'rel offset spans ~2.5e-1 (thr=0.9) to <1e-6 (thr=0.01); each within 15% of 2*E_flow/E_trunc',
    holds: () =>
      ROWS[0].rel_offset_closed_form > 0.1 &&
      ROWS[3].rel_offset_closed_form < 1e-6 &&
      ROWS.every((r) => Math.abs(r.rel_offset_closed_form / r.linear_predictor_2x_E_flow_over_E_trunc - 1) < 0.15),
  },
  {
    // (D2): the linear predictor ratio inflates near the peak and relaxes toward ~1.03 in the tail.
    id: 'imp97838-linear-predictor-relaxes-in-tail',
    description: 'rel/(2*E_flow/E_trunc) is largest at thr=0.9 and relaxes below 1.05 by thr=0.01',
    holds: () => RATIO_RELAXES && ROWS[0].rel_over_linear_predictor > 1.05,
  },
  {
    // (D2): restoring E_flow closes the residual to floating-point zero at every threshold.
    id: 'imp97838-eflow-restored-closes-residual-all-thresholds',
    description: 'E_flow-inclusive threshold fixed point matches bisection to < 1e-9 at every threshold',
    holds: () => MAX_WITH_FLOW < 1e-9,
  },
  {
    // thr = 0.9 is a valid below-peak downslope crossing (sigma peak ~ 0.9494).
    id: 'imp97838-thr-0p9-below-sigma-peak',
    description: 'thr = 0.9 sits below the measured sigma peak (~0.9494), so its downslope root is well defined',
    holds: () => PEAK.bestSig > 0.9 && PEAK.bestSig < 1 && ROWS[0].sigma_at_empirical > 0.899 && ROWS[0].sigma_at_empirical < 0.901,
  },
  {
    // Honesty gate: derivation/measurement only, no QED, no refereed bound is changed.
    id: 'imp97838-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND.isRigorous === false &&
      /NO QED/.test(IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND.verdict) &&
      /refereed bound is changed/i.test(IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND.verdict),
  },
];

for (const a of IMP97838_THRESHOLD_LANDMARK_RESIDUAL_TREND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97838-threshold-landmark-residual-trend assertion failed: ${a.id}`);
  }
}
