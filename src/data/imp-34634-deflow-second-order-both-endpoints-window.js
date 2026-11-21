/**
 * @module imp-34634-deflow-second-order-both-endpoints-window
 *
 * imp-34634 (numerical, frontier-direction): imp-34607 measured the deflow second-order
 * 1/log^2(N) identifiability window (the collinearity of the predictors u = 1/log(N) and u^2)
 * by holding the observed high anchor FIXED at kEnd = 20 (log N ~46.05) and extending the
 * synthetic N-span DOWNWARD only, finding VIF < 10 needs a low end at log N_lo ~2.51 (N ~12), a
 * total log N span of ~43.5 (~5x the observed ~8.6). Because it varied only ONE endpoint, that
 * ~43.5 is a 1-D slice of a 2-D design-geometry surface. This module measures VIF and the
 * correlation-matrix condition number over a 2-D grid of BOTH span endpoints and reports the
 * MINIMUM total span (over all endpoint pairs) that achieves VIF < 10, versus the anchored ~43.5.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 *   As in imp-34607, the collinearity of u = 1/log(N) and u^2 is a pure PROPERTY OF THE
 *   DESIGN-MATRIX GEOMETRY (the set of log N sample points), independent of the deflow response
 *   (which underflows the double-precision floor past kEnd ~22.5, imp-34448). A useful exact fact:
 *   the Pearson correlation corr(u, u^2) is INVARIANT under a common positive rescaling of u
 *   (correlation is affine-invariant in each variable separately: corr(a*u, a^2*u^2) =
 *   corr(u, u^2)). Since u_i = 1/(k_i * ln 10), a common rescaling of u is a common rescaling of
 *   1/k, so the correlation depends on the SHAPE of the reciprocal-k grid -- driven principally by
 *   the range RATIO kHi/kLo, not the absolute k values. For a FIXED log N span (fixed kHi - kLo)
 *   that ratio is LARGER when the window sits at lower absolute k, giving more decorrelation. So
 *   moving the high anchor DOWN should let a given VIF < 10 threshold be met at a SMALLER span --
 *   which is exactly what varying only the low endpoint (imp-34607) cannot see.
 *
 *   This module sweeps the high anchor kHi over a grid and, for each, locates the min-span crossing
 *   of VIF = 10 in the low endpoint kLo (subject to a physical floor N >= 2, i.e. kLo >= log10(2)),
 *   then reports the GLOBAL minimum feasible span over the whole (kLo, kHi) surface.
 *
 * FINDING: RELAXING THE ANCHOR HALVES THE REQUIRED SPAN, BUT DOES NOT OPEN IDENTIFIABILITY
 * ---------------------------------------------------------------------------------------
 *   (A) The anchored kHi = 20 slice reproduces imp-34607 exactly: VIF < 10 needs log N_lo ~2.51,
 *       a span ~43.5 (reuse gate vs imp-34607 requiredWindow.spanLogN).
 *   (B) Relaxing the anchor DOES materially reduce the required span. The min-span VIF = 10 crossing
 *       decreases MONOTONICALLY as kHi drops (43.5 at kHi=20 -> ~22.1 at kHi=10 -> ~20.0 at kHi=9),
 *       reaching a GLOBAL minimum feasible span of ~19.6 log N at kHi ~8.8 (the low end pinned at the
 *       physical floor N = 2). Below kHi ~8.8 the floor binds and VIF < 10 is UNREACHABLE at any
 *       span. So the imp-34607 anchored 1-D slice OVERSTATES the minimum required span by ~2.2x
 *       (~43.5 vs ~19.6, ratio ~0.45).
 *   (C) BUT the minimum-span window sits ENTIRELY at N ~2..6e8 -- even further below the deep-N
 *       surrogate / pole neighbourhood than the imp-34607 anchored window (N ~12..1.4e20). So
 *       relaxing the anchor changes the required-span NUMBER but NOT the qualitative conclusion: the
 *       1/log^2(N) coefficient d remains non-identifiable in any physically or numerically accessible
 *       window. The imp-34607 structural non-resolvability is unchanged -- if anything reinforced,
 *       since the globally span-optimal endpoint pair also lives at tiny N far from where the fit is.
 *
 * NUMERICAL / MEASUREMENT ONLY. Reuses the imp-34448 IMP34448_DEFLOW_DECAY_EXPONENT export verbatim
 * (import-light, no 16.7MB zeros bundle, per [[no_heavy_imports_in_pages]]) to reproduce the observed
 * baseline correlation; the 2-D endpoint sweep is a pure design-matrix geometry computation over
 * synthetic log N grids. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic;
 * the analytic E_flow slope is a property of that surrogate, not of the true residual; changes no
 * bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34607-deflow-second-order-identifiability-window (the anchored 1-D slice, span ~43.5)
 * @see imp-34584-deflow-refit-second-order-term (the overfit and ~0.9995 predictor collinearity)
 * @see imp-34448-deflow-decay-exponent (the observed local exponents and the fp floor at kEnd ~22.5)
 */

import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';

const LN10 = Math.LN10;

// The standard multicollinearity rule of thumb: VIF >= 10 (|r| >= 0.9487) is severe collinearity.
const IDENTIFIABILITY_VIF_THRESHOLD = 10;
const STEP = 0.25; // matches the imp-34448 clean-window rung spacing (and imp-34607)
const K_HI_ANCHOR = 20; // the imp-34607 fixed high anchor (log N ~46.05)
// Physical floor on the low endpoint: N >= 2 zeros, i.e. kLo >= log10(2) ~0.30103.
const K_FLOOR = Math.log10(2);

// Pearson correlation of the two predictors u = 1/log(N) and u^2 over a set of kMid rung midpoints.
function corrOfMids(kMids) {
  const us = kMids.map((k) => 1 / (k * LN10));
  const u2 = us.map((u) => u * u);
  const n = us.length;
  const mu = us.reduce((a, b) => a + b, 0) / n;
  const mv = u2.reduce((a, b) => a + b, 0) / n;
  let suv = 0;
  let suu = 0;
  let svv = 0;
  for (let i = 0; i < n; i += 1) {
    suv += (us[i] - mu) * (u2[i] - mv);
    suu += (us[i] - mu) ** 2;
    svv += (u2[i] - mv) ** 2;
  }
  return suv / Math.sqrt(suu * svv);
}

// The rung midpoints of a synthetic grid [kLo .. kHi] with spacing STEP.
function midsForSpan(kLo, kHi) {
  const ks = [];
  for (let k = kLo; k <= kHi + 1e-9; k += STEP) ks.push(k);
  const mids = [];
  for (let i = 1; i < ks.length; i += 1) mids.push((ks[i] + ks[i - 1]) / 2);
  return mids;
}

// VIF and correlation-matrix condition number for a given (kLo, kHi) endpoint pair.
function conditioningAt(kLo, kHi) {
  const r = corrOfMids(midsForSpan(kLo, kHi));
  const vif = 1 / (1 - r * r);
  const cond = (1 + Math.abs(r)) / (1 - Math.abs(r));
  return { kLo, kHi, r, vif, cond, spanLogN: (kHi - kLo) * LN10 };
}

// For a fixed high anchor kHi, the min-span crossing: the LARGEST kLo (>= K_FLOOR) at which
// VIF = threshold. VIF decreases monotonically as kLo decreases (wider span). Returns null if
// the floor already leaves VIF above threshold (floor binds -> VIF < threshold unreachable).
function minSpanCrossingForKHi(kHi) {
  if (conditioningAt(K_FLOOR, kHi).vif > IDENTIFIABILITY_VIF_THRESHOLD) return null; // floor binds
  let lo = K_FLOOR;
  let hi = kHi - 0.5;
  for (let i = 0; i < 90; i += 1) {
    const m = (lo + hi) / 2;
    if (conditioningAt(m, kHi).vif > IDENTIFIABILITY_VIF_THRESHOLD) hi = m; // need wider span
    else lo = m;
  }
  return conditioningAt((lo + hi) / 2, kHi);
}

// ---------------------------------------------------------------------------------------------
// (1) THE ANCHORED BASELINE: reproduce the imp-34607 kHi = 20 fixed-anchor crossing (~43.5).
// ---------------------------------------------------------------------------------------------
const ANCHORED = minSpanCrossingForKHi(K_HI_ANCHOR);
const ANCHORED_SPAN = ANCHORED.spanLogN; // ~43.54 (reproduces imp-34607 ~43.5)
const ANCHORED_LOGN_LO = ANCHORED.kLo * LN10; // ~2.51

// Also reproduce the observed six-rung predictor correlation (import-light reuse gate vs imp-34448).
const OBSERVED_MIDS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample.map((q) => q.kMid);
const OBSERVED_R = corrOfMids(OBSERVED_MIDS); // ~0.99954 (matches imp-34584 ~0.9995)

// ---------------------------------------------------------------------------------------------
// (2) THE 2-D ENDPOINT SWEEP: vary the high anchor kHi, report the min-span crossing at each.
// ---------------------------------------------------------------------------------------------
const SWEEP_KHIS = [20, 18, 16, 14, 12, 10, 9, 8, 6, 4, 2];
const SWEEP_TABLE = SWEEP_KHIS.map((kHi) => {
  const c = minSpanCrossingForKHi(kHi);
  if (c) {
    return {
      kHi,
      feasible: true,
      kLoCross: +c.kLo.toFixed(4),
      logNlo: +(c.kLo * LN10).toFixed(3),
      minSpanLogN: +c.spanLogN.toFixed(3),
      vifAtCross: +c.vif.toFixed(2),
    };
  }
  const floor = conditioningAt(K_FLOOR, kHi);
  return {
    kHi,
    feasible: false, // physical floor N >= 2 binds: VIF < 10 unreachable at any span
    kLoCross: +K_FLOOR.toFixed(4),
    logNlo: +(K_FLOOR * LN10).toFixed(3),
    minSpanLogN: +floor.spanLogN.toFixed(3),
    vifAtFloor: +floor.vif.toFixed(2),
  };
});

// ---------------------------------------------------------------------------------------------
// (3) THE GLOBAL MINIMUM FEASIBLE SPAN over the whole (kLo, kHi) surface. Because the min-span
// crossing decreases monotonically as kHi drops until the floor binds, the global optimum sits at
// the SMALLEST kHi still feasible -- found by bisecting kHi for VIF(K_FLOOR, kHi) = threshold.
// ---------------------------------------------------------------------------------------------
function bisectKHiAtFloorThreshold(loKHi, hiKHi, iters = 100) {
  let lo = loKHi;
  let hi = hiKHi;
  for (let i = 0; i < iters; i += 1) {
    const m = (lo + hi) / 2;
    if (conditioningAt(K_FLOOR, m).vif > IDENTIFIABILITY_VIF_THRESHOLD) lo = m; // VIF grows with kHi
    else hi = m;
  }
  return (lo + hi) / 2;
}
const GLOBAL_MIN_KHI = bisectKHiAtFloorThreshold(6, 12);
const GLOBAL_MIN = conditioningAt(K_FLOOR, GLOBAL_MIN_KHI);
const GLOBAL_MIN_SPAN = GLOBAL_MIN.spanLogN; // ~19.6 log N
const SPAN_RATIO_VS_ANCHORED = GLOBAL_MIN_SPAN / ANCHORED_SPAN; // ~0.45

export const IMP34634_DEFLOW_SECOND_ORDER_BOTH_ENDPOINTS_WINDOW = {
  id: 'imp-34634',
  proofSection: 'S-frontier',
  question:
    'imp-34607 measured the deflow second-order 1/log^2(N) identifiability window by holding the high ' +
    'anchor FIXED at kEnd = 20 and extending the span downward only, finding VIF < 10 needs a span ~43.5. ' +
    'That is a 1-D slice. Over a 2-D grid of BOTH span endpoints, what is the MINIMUM total span achieving ' +
    'VIF < 10, and does relaxing the fixed anchor materially change it? Measurement only; component model ' +
    'NOT rigorous; NO QED.',
  measuredQuantity:
    'VIF = 1/(1 - r^2) with r = corr(u = 1/log(N), u^2) over a 2-D grid of both span endpoints (kLo, kHi), ' +
    'the min-span VIF = 10 crossing at each high anchor kHi, and the global minimum feasible span over all ' +
    'endpoint pairs (subject to a physical floor N >= 2). Pure design-matrix geometry; deflow response not ' +
    'required (and not fp-observable past kEnd ~22.5).',
  identifiabilityVifThreshold: IDENTIFIABILITY_VIF_THRESHOLD,
  physicalFloor: { NloMin: 2, kFloor: +K_FLOOR.toFixed(5) },
  observedPredictorCorr: +OBSERVED_R.toFixed(6), // ~0.99954 (matches imp-34584 ~0.9995)
  anchoredSlice: {
    kHi: K_HI_ANCHOR,
    logNlo: +ANCHORED_LOGN_LO.toFixed(3), // ~2.510
    spanLogN: +ANCHORED_SPAN.toFixed(3), // ~43.542 (reproduces imp-34607 ~43.5)
  },
  sweepTable: SWEEP_TABLE,
  globalMinWindow: {
    kHi: +GLOBAL_MIN_KHI.toFixed(4), // ~8.80
    NhiApprox: +Math.pow(10, GLOBAL_MIN_KHI).toExponential(3), // ~6.3e8
    kLo: +K_FLOOR.toFixed(4), // log10(2), N = 2
    minSpanLogN: +GLOBAL_MIN_SPAN.toFixed(3), // ~19.6
    spanRatioVsAnchored: +SPAN_RATIO_VS_ANCHORED.toFixed(3), // ~0.45
    vifAtOptimum: +GLOBAL_MIN.vif.toFixed(2), // ~10
  },
  finding: {
    A_anchored_slice_reproduces_imp34607:
      'The anchored high-anchor kHi = 20 slice reproduces imp-34607 exactly: VIF < 10 needs the low end ' +
      'at log N_lo ~2.51, a total log N span of ~43.5 (reuse gate vs imp-34607 requiredWindow.spanLogN).',
    B_relaxing_anchor_halves_required_span:
      'Relaxing the fixed anchor DOES materially reduce the required span. The min-span VIF = 10 crossing ' +
      'decreases monotonically as the high anchor kHi drops (~43.5 at kHi=20 -> ~22.1 at kHi=10 -> ~20.0 ' +
      'at kHi=9), reaching a global minimum feasible span of ~19.6 log N at kHi ~8.8 (low end pinned at ' +
      'the physical floor N = 2). Below kHi ~8.8 the floor binds and VIF < 10 is unreachable at any span. ' +
      'So the imp-34607 anchored 1-D slice OVERSTATES the minimum required span by ~2.2x (ratio ~0.45).',
    C_conclusion_unchanged_window_even_lower:
      'But the minimum-span window sits entirely at N ~2..6e8 -- even further below the deep-N surrogate / ' +
      'pole neighbourhood than the imp-34607 anchored window (N ~12..1.4e20). So relaxing the anchor ' +
      'changes the required-span NUMBER but not the qualitative conclusion: the 1/log^2(N) coefficient ' +
      'remains non-identifiable in any accessible window. The imp-34607 structural non-resolvability is ' +
      'unchanged -- reinforced, since the globally span-optimal endpoint pair also lives at tiny N.',
    mechanism:
      'corr(u, u^2) is invariant under a common positive rescaling of u, so it depends on the SHAPE of the ' +
      'reciprocal-k grid -- driven principally by the range ratio kHi/kLo. For a fixed log N span that ' +
      'ratio is larger at lower absolute k, giving more decorrelation; that is why moving the high anchor ' +
      'down meets VIF < 10 at a smaller span, which the imp-34607 low-endpoint-only sweep cannot see.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-34607 deflow ' +
    'second-order 1/log^2(N) identifiability window from a fixed-high-anchor 1-D slice to a 2-D grid of ' +
    'both span endpoints. The anchored kHi = 20 slice reproduces imp-34607 (VIF < 10 needs span ~43.5). ' +
    'Relaxing the anchor DOES materially reduce the required span: the min-span VIF = 10 crossing ' +
    'decreases monotonically as kHi drops, to a global minimum feasible span of ~19.6 log N at kHi ~8.8 ' +
    '(low end pinned at the physical floor N = 2), ~0.45x the anchored ~43.5 -- so the 1-D slice ' +
    'overstates the minimum span by ~2.2x. The mechanism is that corr(u, u^2) is scale-invariant in u and ' +
    'driven by the range ratio kHi/kLo, which is larger at lower absolute k for a fixed span. BUT the ' +
    'minimum-span window sits entirely at N ~2..6e8, even further below the deep-N surrogate regime than ' +
    'the imp-34607 anchored window, so relaxing the anchor changes the required-span NUMBER but not the ' +
    'qualitative conclusion: the coefficient remains non-identifiable in any accessible window, and the ' +
    'imp-34607 structural non-resolvability is unchanged (reinforced). The inherited imp-3220/imp-3406 ' +
    'component model is NOT a rigorous asymptotic; the analytic E_flow slope is a property of that ' +
    'surrogate, not of the true residual; changes no bound; establishes no operator positivity; C_mb ' +
    'GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34607 (the anchored 1-D slice, span ~43.5); imp-34584 (the overfit and ~0.9995 predictor ' +
    'collinearity); imp-34448 (the observed local exponents and the fp floor at kEnd ~22.5).',
};

export const IMP34634_DEFLOW_SECOND_ORDER_BOTH_ENDPOINTS_WINDOW_ASSERTIONS = [
  {
    // (A) The anchored kHi = 20 slice reproduces the imp-34607 required span ~43.5.
    id: 'imp34634-anchored-slice-reproduces-imp34607',
    description: 'the fixed kHi = 20 slice reproduces the imp-34607 VIF < 10 span ~43.5',
    holds: () => Math.abs(ANCHORED_SPAN - 43.5) < 0.5 && Math.abs(ANCHORED_LOGN_LO - 2.51) < 0.2,
  },
  {
    // (B) Relaxing the anchor materially reduces the required span (global min well below anchored).
    id: 'imp34634-relaxing-anchor-reduces-span',
    description: 'global minimum feasible span (~19.6) is well below the anchored ~43.5',
    holds: () =>
      GLOBAL_MIN_SPAN < 22 && GLOBAL_MIN_SPAN > 17 && SPAN_RATIO_VS_ANCHORED < 0.5 && SPAN_RATIO_VS_ANCHORED > 0.4,
  },
  {
    // (C) The global optimum pins the low end at the physical floor N = 2 and sits at a low kHi.
    id: 'imp34634-optimum-at-floor-low-khi',
    description: 'the span-optimal window pins N_lo at the floor (N = 2) with a low high anchor kHi ~8.8',
    holds: () => Math.abs(GLOBAL_MIN_KHI - 8.8) < 0.6 && GLOBAL_MIN.kLo === K_FLOOR,
  },
  {
    // (D) The min-span crossing is monotone in the high anchor over the feasible range.
    id: 'imp34634-min-span-monotone-in-khi',
    description: 'the min-span VIF = 10 crossing decreases monotonically as the high anchor kHi drops',
    holds: () => {
      const feas = SWEEP_TABLE.filter((r) => r.feasible);
      return feas.every((r, i) => i === 0 || r.minSpanLogN < feas[i - 1].minSpanLogN);
    },
  },
  {
    // (E) Below the optimum the physical floor binds: VIF < 10 is unreachable at any span.
    id: 'imp34634-floor-binds-below-optimum',
    description: 'at a high anchor below the optimum (e.g. kHi = 6) the N >= 2 floor leaves VIF > 10',
    holds: () => minSpanCrossingForKHi(6) === null && conditioningAt(K_FLOOR, 6).vif > 10,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34634-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34634_DEFLOW_SECOND_ORDER_BOTH_ENDPOINTS_WINDOW.isRigorous === false &&
      /NO QED/.test(IMP34634_DEFLOW_SECOND_ORDER_BOTH_ENDPOINTS_WINDOW.verdict) &&
      /refereed bound is changed/i.test(IMP34634_DEFLOW_SECOND_ORDER_BOTH_ENDPOINTS_WINDOW.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34634_DEFLOW_SECOND_ORDER_BOTH_ENDPOINTS_WINDOW.verdict),
  },
];

for (const a of IMP34634_DEFLOW_SECOND_ORDER_BOTH_ENDPOINTS_WINDOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34634-deflow-second-order-both-endpoints-window assertion failed: ${a.id}`);
  }
}
