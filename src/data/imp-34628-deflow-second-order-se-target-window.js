/**
 * @module imp-34628-deflow-second-order-se-target-window
 *
 * imp-34628 (numerical, frontier-direction): imp-34607 located the identifiability window for the
 * deflow second-order 1/log^2(N) term using the STANDARD MULTICOLLINEARITY RULE OF THUMB
 * (VIF < 10, i.e. |r| < 0.9487, cond < ~38), and found the required synthetic log N span is ~43.5
 * (~5x the observed ~8.6) -- reaching down to log N_lo ~2.51 (N ~12). But that VIF < 10 threshold is
 * a heuristic on predictor collinearity ALONE; it is not tied to any target precision on the
 * coefficient d, and it ignores that widening the span also grows the u^2 predictor spread and the
 * rung count -- both of which shrink the coefficient standard error independently of the
 * correlation. This module re-poses the identifiability question under a COEFFICIENT-SE-TARGET
 * criterion and compares the required span to the imp-34607 VIF < 10 span.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 *   For the OLS fit p = a + c*u + d*u2 (u = 1/log(N), u2 = u^2, intercept a), the standard error of
 *   the second-order coefficient d is a closed-form design-matrix property:
 *       SE(d) = sigma / sqrt( S22 * (1 - r^2) ),
 *   where sigma is the per-rung residual noise, S22 = sum_i (u2_i - mean_u2)^2 is the total spread of
 *   the u2 predictor, and r = corr(u, u2) is the same predictor correlation imp-34607 tabulated (so
 *   SE is inflated by sqrt(VIF) = 1/sqrt(1 - r^2) relative to the orthogonal case sigma/sqrt(S22)).
 *   The RELATIVE standard error is then relSE = SE(d) / |d|. Holding the high anchor fixed at
 *   kEnd = 20 (log N ~46.05) exactly as imp-34607 does, and extending the synthetic N-span downward
 *   on the same STEP = 0.25 grid, this module locates the minimum log N span at which relSE drops
 *   below a stated target (d resolved to 50% and to 10%), and compares each SE-target span to the
 *   imp-34607 VIF < 10 span ~43.5.
 *
 *   The per-rung noise sigma and the reference |d| are taken from the OBSERVED rungs (self-contained
 *   from the single imp-34448 import): sigma is the RMS residual of the imp-34571 one-parameter refit
 *   p = pInf - c/log(N) (a two-parameter model, ~3.4e-4 here, order-consistent with the imp-34571
 *   ~7.3e-4), and |d| is the magnitude of the three-parameter OLS u2 coefficient on the observed six
 *   rungs (~91.7, reproducing the imp-34584 recovered |d| ~91.7).
 *
 * FINDING: THE SE-TARGET SPAN IS FAR SMALLER THAN THE VIF < 10 RULE-OF-THUMB SPAN
 * ------------------------------------------------------------------------------
 *   (A) In the observed six-rung window the coefficient is poorly resolved: SE(d) ~53, |d| ~91.7, so
 *       relSE ~0.58 -- d is not even resolved to 50%. This is fully consistent with the imp-34584
 *       "not resolvable to next order" verdict (a ~1.7-sigma quasi-detection with ~58% uncertainty).
 *   (B) Under a precision criterion the required span is MUCH SMALLER than the VIF < 10 span (~43.5):
 *       resolving d to 50% needs a log N span of only ~8.9 (log N_lo ~37.1, N ~1.4e16) -- ~0.20x the
 *       VIF < 10 span, barely wider than the observed ~8.6; resolving d to 10% needs ~14.6 (log N_lo
 *       ~31.4, N ~4.5e13) -- ~0.34x. The VIF < 10 rule of thumb OVERSTATES the span needed for a
 *       stated precision by ~3x (10% target) to ~5x (50% target), because it thresholds only the
 *       correlation r and ignores that a wider span also grows S22 (the u2 spread) and the rung
 *       count -- so the SE shrinks far faster than the collinearity heuristic alone predicts.
 *   (C) Unlike the imp-34607 VIF < 10 floors (N ~12..9000, far below the deep-N surrogate regime),
 *       the SE-target floors (N ~4.5e13..1.4e16, kEnd ~13.7..16.1) stay WITHIN the deep-N regime and
 *       far below the fp underflow floor (deflow fp-observable to kEnd ~22.5) -- these rungs carry
 *       LARGER deflow than the observed window and are more, not less, observable. So a precision-
 *       based extension is far less inaccessible than the rule of thumb implies; the cost is only
 *       extending the imp-34448 clean window downward to kEnd ~13.7 and assuming the (non-rigorous)
 *       surrogate model holds across it. The imp-34584 non-identifiability nevertheless HOLDS in the
 *       observed window (relSE ~58% > 50%); the refinement is that the deficit is modest, not the
 *       ~5x-span chasm the VIF < 10 heuristic suggests.
 *
 * NUMERICAL / MEASUREMENT ONLY. Reuses the imp-34448 IMP34448_DEFLOW_DECAY_EXPONENT export verbatim
 * (import-light, no 16.7MB zeros bundle, per [[no_heavy_imports_in_pages]]); the SE-target sweep is a
 * pure design-matrix geometry computation over synthetic log N grids, with sigma and |d| fit from the
 * observed rungs. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the
 * analytic E_flow slope is a property of that surrogate, not of the true residual; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34607-deflow-second-order-identifiability-window (the VIF < 10 rule-of-thumb span ~43.5)
 * @see imp-34584-deflow-refit-second-order-term (the overfit and the recovered |d| ~91.7)
 * @see imp-34571-deflow-exponent-vs-analytic-slope (the one-parameter refit and ~7.3e-4 residual)
 * @see imp-34448-deflow-decay-exponent (the observed local exponents and the fp floor at kEnd ~22.5)
 */

import { IMP34448_DEFLOW_DECAY_EXPONENT } from './imp-34448-deflow-decay-exponent.js';

const LN10 = Math.LN10;

// The fixed high anchor and grid, matching imp-34607 exactly (clean-window high end, rung spacing).
const K_HI = 20;
const STEP = 0.25;

// The two stated relative-SE targets: d resolved to 50% and to 10%.
const TARGET_RELSE_HALF = 0.5;
const TARGET_RELSE_TENTH = 0.1;

// ---------------------------------------------------------------------------------------------
// Solve a small (intercept + predictors) OLS system by Gaussian elimination with partial pivoting.
// Returns the coefficient vector and the residuals. Columns include the intercept column.
// ---------------------------------------------------------------------------------------------
function olsFit(cols, y) {
  const n = y.length;
  const k = cols.length;
  const XtX = Array.from({ length: k }, () => new Array(k).fill(0));
  const Xty = new Array(k).fill(0);
  for (let i = 0; i < n; i += 1) {
    for (let a = 0; a < k; a += 1) {
      Xty[a] += cols[a][i] * y[i];
      for (let b = 0; b < k; b += 1) XtX[a][b] += cols[a][i] * cols[b][i];
    }
  }
  const M = XtX.map((row, i) => [...row, Xty[i]]);
  for (let c = 0; c < k; c += 1) {
    let piv = c;
    for (let r = c + 1; r < k; r += 1) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < k; r += 1) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let cc = c; cc <= k; cc += 1) M[r][cc] -= f * M[c][cc];
    }
  }
  const beta = M.map((row, i) => row[k] / row[i]);
  const resid = y.map((yi, i) => yi - cols.reduce((s, col, a) => s + beta[a] * col[i], 0));
  return { beta, resid };
}

// ---------------------------------------------------------------------------------------------
// (1) THE OBSERVED RUNGS: fit the per-rung noise sigma and the reference |d| self-contained from
//     the single imp-34448 import.
// ---------------------------------------------------------------------------------------------
const OBS = IMP34448_DEFLOW_DECAY_EXPONENT.localExponentSample; // six clean rungs {kMid, p}
const OBS_U = OBS.map((q) => 1 / (q.kMid * LN10));
const OBS_U2 = OBS_U.map((u) => u * u);
const OBS_P = OBS.map((q) => q.p);
const OBS_ONES = OBS_U.map(() => 1);

// sigma: RMS residual of the imp-34571 one-parameter refit p = pInf - c/log(N) (two-parameter model),
// with the usual (n - 2) dof correction -- the honest per-rung noise (the d term is not real signal).
const FIT2 = olsFit([OBS_ONES, OBS_U], OBS_P);
const SIGMA = Math.sqrt(FIT2.resid.reduce((s, r) => s + r * r, 0) / (OBS_P.length - 2)); // ~3.4e-4

// |d|: magnitude of the three-parameter OLS u2 coefficient on the observed rungs (reproduces imp-34584).
const FIT3 = olsFit([OBS_ONES, OBS_U, OBS_U2], OBS_P);
const D_REF = Math.abs(FIT3.beta[2]); // ~91.7

// ---------------------------------------------------------------------------------------------
// (2) THE SE-TARGET GEOMETRY: SE(d) = sigma / sqrt(S22 (1 - r^2)) on a synthetic span [kLo .. K_HI].
// ---------------------------------------------------------------------------------------------
function midsForSpan(kLo) {
  const ks = [];
  for (let k = kLo; k <= K_HI + 1e-9; k += STEP) ks.push(k);
  const mids = [];
  for (let i = 1; i < ks.length; i += 1) mids.push((ks[i] + ks[i - 1]) / 2);
  return mids;
}

// The coefficient-SE geometry at a given low anchor kLo (fixed high anchor K_HI).
function seAt(kLo) {
  const mids = midsForSpan(kLo);
  const us = mids.map((k) => 1 / (k * LN10));
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
  const r = suv / Math.sqrt(suu * svv);
  const s22 = svv;
  const seD = SIGMA / Math.sqrt(s22 * (1 - r * r));
  return {
    kLo,
    logNlo: kLo * LN10,
    spanLogN: (K_HI - kLo) * LN10,
    nRungs: n,
    r,
    seD,
    relSE: seD / D_REF,
  };
}

// ---------------------------------------------------------------------------------------------
// (3) THE OBSERVED-WINDOW BASELINE: relative SE(d) on the actual six rungs (real mids, not the grid).
// ---------------------------------------------------------------------------------------------
function seOnMids(mids) {
  const us = mids.map((k) => 1 / (k * LN10));
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
  const r = suv / Math.sqrt(suu * svv);
  const seD = SIGMA / Math.sqrt(svv * (1 - r * r));
  return { r, seD, relSE: seD / D_REF };
}
const OBS_MIDS = OBS.map((q) => q.kMid);
const OBSERVED = seOnMids(OBS_MIDS); // relSE ~0.58 (not resolved even to 50%)
const OBSERVED_SPAN = (Math.max(...OBS_MIDS) - Math.min(...OBS_MIDS)) * LN10; // ~8.6

// ---------------------------------------------------------------------------------------------
// (4) THE SE-TARGET WINDOWS: minimum span at which relSE drops below each target (bisection).
//     relSE decreases monotonically as kLo decreases (wider span, larger S22, more rungs).
// ---------------------------------------------------------------------------------------------
function bisectSpanForTarget(target, loK, hiK, iters = 120) {
  let lo = loK;
  let hi = hiK;
  for (let i = 0; i < iters; i += 1) {
    const m = (lo + hi) / 2;
    if (seAt(m).relSE > target) hi = m; // still above target -> need wider span (lower kLo)
    else lo = m;
  }
  return (lo + hi) / 2;
}
const HALF_KLO = bisectSpanForTarget(TARGET_RELSE_HALF, 10, 19.9);
const HALF = seAt(HALF_KLO);
const TENTH_KLO = bisectSpanForTarget(TARGET_RELSE_TENTH, 6, 18);
const TENTH = seAt(TENTH_KLO);

// The imp-34607 VIF < 10 span (baked reference literal for the head-to-head comparison).
const IMP34607_VIF10_SPAN = 43.54;

// ---------------------------------------------------------------------------------------------
// (5) THE SWEEP TABLE: same kLo anchors as imp-34607, with the coefficient-SE columns added.
// ---------------------------------------------------------------------------------------------
const SWEEP_KLOS = [16, 10, 6, 4, 3, 2, 1.0902];
const SWEEP_TABLE = SWEEP_KLOS.map((kLo) => {
  const s = seAt(kLo);
  return {
    kEndLo: kLo,
    logNlo: +s.logNlo.toFixed(3),
    spanLogN: +s.spanLogN.toFixed(3),
    predictorCorr: +s.r.toFixed(6),
    seD: +s.seD.toExponential(4),
    relSE: +s.relSE.toExponential(4),
  };
});

export const IMP34628_DEFLOW_SECOND_ORDER_SE_TARGET_WINDOW = {
  id: 'imp-34628',
  proofSection: 'S-frontier',
  question:
    'imp-34607 located the deflow 1/log^2(N) identifiability window with the multicollinearity rule ' +
    'of thumb (VIF < 10), needing a log N span ~43.5. That threshold is not tied to any target ' +
    'precision on the coefficient d. What span is actually needed to bring the OLS relative standard ' +
    'error of d below a stated target (d resolved to 50% / 10%), and how does it compare to ~43.5? ' +
    'Measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The minimum synthetic log N span (high anchor fixed at kEnd = 20, same STEP = 0.25 grid as ' +
    'imp-34607) at which relSE = SE(d)/|d| drops below 0.5 and below 0.1, where ' +
    'SE(d) = sigma / sqrt(S22 (1 - r^2)) is the closed-form OLS standard error of the u^2 coefficient, ' +
    'sigma is the imp-34571 one-parameter-refit residual, and |d| is the observed OLS u^2 coefficient ' +
    'magnitude. Compared head-to-head to the imp-34607 VIF < 10 span ~43.5.',
  inputs: {
    sigmaPerRung: +SIGMA.toExponential(4), // ~3.4e-4 (imp-34571 refit residual scale, ~7.3e-4)
    dRefMagnitude: +D_REF.toFixed(3), // ~91.7 (reproduces imp-34584 |d|)
    highAnchorKend: K_HI,
    gridStep: STEP,
    imp34607Vif10Span: IMP34607_VIF10_SPAN,
  },
  targetRelSeHalf: TARGET_RELSE_HALF,
  targetRelSeTenth: TARGET_RELSE_TENTH,
  observedWindow: {
    spanLogN: +OBSERVED_SPAN.toFixed(3), // ~8.6
    predictorCorr: +OBSERVED.r.toFixed(6), // ~0.99954
    seD: +OBSERVED.seD.toFixed(3), // ~53
    relSE: +OBSERVED.relSE.toFixed(4), // ~0.58 (not resolved even to 50%)
  },
  seTargetHalfWindow: {
    kEndLo: +HALF_KLO.toFixed(4), // ~16.13
    logNlo: +HALF.logNlo.toFixed(3), // ~37.1
    Nlo: +Math.pow(10, HALF_KLO).toExponential(3), // ~1.4e16
    spanLogN: +HALF.spanLogN.toFixed(3), // ~8.9
    nRungs: HALF.nRungs,
    spanRatioVsVif10: +(HALF.spanLogN / IMP34607_VIF10_SPAN).toFixed(3), // ~0.20
    spanRatioVsObserved: +(HALF.spanLogN / OBSERVED_SPAN).toFixed(3), // ~1.03
  },
  seTargetTenthWindow: {
    kEndLo: +TENTH_KLO.toFixed(4), // ~13.66
    logNlo: +TENTH.logNlo.toFixed(3), // ~31.4
    Nlo: +Math.pow(10, TENTH_KLO).toExponential(3), // ~4.5e13
    spanLogN: +TENTH.spanLogN.toFixed(3), // ~14.6
    nRungs: TENTH.nRungs,
    spanRatioVsVif10: +(TENTH.spanLogN / IMP34607_VIF10_SPAN).toFixed(3), // ~0.34
    spanRatioVsObserved: +(TENTH.spanLogN / OBSERVED_SPAN).toFixed(3), // ~1.7
  },
  sweepTable: SWEEP_TABLE,
  finding: {
    A_observed_window_barely_below_half_precision:
      'In the observed six-rung window SE(d) ~53 and |d| ~91.7, so relSE ~0.58 -- d is not resolved ' +
      'even to 50%. This is a ~1.7-sigma quasi-detection with ~58% uncertainty, fully consistent with ' +
      'the imp-34584 "not resolvable to next order" verdict.',
    B_se_target_span_far_smaller_than_vif10:
      'Under a precision criterion the required span is MUCH SMALLER than the imp-34607 VIF < 10 span ' +
      '~43.5: resolving d to 50% needs a log N span of only ~8.9 (~0.20x the VIF < 10 span, barely ' +
      'wider than the observed ~8.6); resolving d to 10% needs ~14.6 (~0.34x). The VIF < 10 rule of ' +
      'thumb overstates the span needed for a stated precision by ~3x (10% target) to ~5x (50% ' +
      'target), because it thresholds only the correlation r and ignores that a wider span also grows ' +
      'the u^2 spread S22 and the rung count -- both of which shrink SE(d) independently of r.',
    C_se_target_floors_stay_in_deep_N_regime:
      'Unlike the imp-34607 VIF < 10 floors (N ~12..9000, far below the deep-N surrogate regime), the ' +
      'SE-target floors (N ~4.5e13..1.4e16, kEnd ~13.7..16.1) stay within the deep-N regime and far ' +
      'below the fp underflow floor (deflow fp-observable to kEnd ~22.5) -- these rungs carry larger ' +
      'deflow than the observed window and are more, not less, observable. So a precision-based ' +
      'extension is far less inaccessible than the rule of thumb implies; the cost is only extending ' +
      'the imp-34448 clean window down to kEnd ~13.7 and assuming the (non-rigorous) surrogate holds. ' +
      'The imp-34584 non-identifiability still holds in the observed window (relSE ~58% > 50%); the ' +
      'refinement is that the deficit is modest, not the ~5x-span chasm the VIF < 10 heuristic implies.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Re-poses the imp-34607 deflow ' +
    '1/log^2(N) identifiability window under a coefficient-SE-target criterion instead of the VIF < 10 ' +
    'rule of thumb. Using the closed-form OLS standard error SE(d) = sigma / sqrt(S22 (1 - r^2)) with ' +
    'sigma ~3.4e-4 (the imp-34571 one-parameter refit residual scale, ~7.3e-4) and |d| ~91.7 ' +
    '(reproducing imp-34584), the observed six-rung window sits at relSE ~0.58 -- d not resolved even ' +
    'to 50% (consistent with imp-34584 non-resolvability). Holding the high anchor at kEnd = 20 and ' +
    'extending the same STEP = 0.25 synthetic grid downward, resolving d to 50% needs a log N span of ' +
    'only ~8.9 (~0.20x the imp-34607 VIF < 10 span ~43.5) and to 10% needs ~14.6 (~0.34x): the VIF < ' +
    '10 rule of thumb overstates the span needed for a stated precision by ~3x-5x, because it ' +
    'thresholds only the correlation and ignores that a wider span also grows the u^2 spread S22 and ' +
    'the rung count. Moreover the SE-target floors (N ~4.5e13..1.4e16) stay within the deep-N regime ' +
    'and below the fp underflow floor (deflow observable to kEnd ~22.5), unlike the VIF < 10 floors ' +
    '(N ~12..9000) -- so a precision-based extension is far less inaccessible than the heuristic ' +
    'implies, though it still requires extending the imp-34448 clean window and assuming the surrogate ' +
    'holds. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the analytic ' +
    'E_flow slope is a property of that surrogate, not of the true residual; changes no bound; ' +
    'establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34607 (the VIF < 10 rule-of-thumb span ~43.5); imp-34584 (the overfit and recovered |d| ' +
    '~91.7); imp-34571 (the one-parameter refit and ~7.3e-4 residual); imp-34448 (the observed local ' +
    'exponents and the fp floor at kEnd ~22.5).',
};

export const IMP34628_DEFLOW_SECOND_ORDER_SE_TARGET_WINDOW_ASSERTIONS = [
  {
    // (A) The per-rung noise sigma is order-consistent with the imp-34571 ~7.3e-4 refit residual.
    id: 'imp34628-sigma-matches-refit-residual-scale',
    description: 'per-rung noise sigma is in ~1e-4..1e-3 (imp-34571 refit residual scale)',
    holds: () => SIGMA > 1e-4 && SIGMA < 1e-3,
  },
  {
    // (B) The reference |d| reproduces the imp-34584 recovered magnitude ~91.7.
    id: 'imp34628-dref-reproduces-imp34584',
    description: 'observed OLS u^2 coefficient magnitude |d| ~91.7 (matches imp-34584)',
    holds: () => Math.abs(D_REF - 91.7) < 5,
  },
  {
    // (C) In the observed window d is NOT resolved even to 50% (relSE > 0.5), consistent with imp-34584.
    id: 'imp34628-observed-window-not-half-resolved',
    description: 'observed-window relSE exceeds 0.5 (d not resolved even to 50%)',
    holds: () => OBSERVED.relSE > 0.5 && OBSERVED.relSE < 1,
  },
  {
    // (D) The 50% and 10% SE-target spans are BOTH far below the imp-34607 VIF < 10 span ~43.5.
    id: 'imp34628-se-target-span-far-below-vif10',
    description: 'both SE-target spans are < half the imp-34607 VIF < 10 span ~43.5',
    holds: () =>
      HALF.spanLogN < 0.5 * IMP34607_VIF10_SPAN &&
      TENTH.spanLogN < 0.5 * IMP34607_VIF10_SPAN &&
      TENTH.spanLogN > HALF.spanLogN,
  },
  {
    // (E) The 10% SE-target floor stays in the deep-N regime, below the fp underflow floor kEnd ~22.5.
    id: 'imp34628-se-target-floor-in-deep-n-regime',
    description: 'the 10% SE-target low anchor kEnd stays in ~10..17 (deep-N, below fp floor 22.5)',
    holds: () => TENTH_KLO > 10 && TENTH_KLO < 22.5 && HALF_KLO > TENTH_KLO,
  },
  {
    // (F) relSE decreases monotonically as the span widens (kLo drops) across the sweep.
    id: 'imp34628-sweep-relse-monotone-decreasing',
    description: 'relative SE(d) strictly decreases as the synthetic span widens',
    holds: () => SWEEP_TABLE.every((row, i) => i === 0 || row.relSE < SWEEP_TABLE[i - 1].relSE),
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34628-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34628_DEFLOW_SECOND_ORDER_SE_TARGET_WINDOW.isRigorous === false &&
      /NO QED/.test(IMP34628_DEFLOW_SECOND_ORDER_SE_TARGET_WINDOW.verdict) &&
      /refereed bound is changed/i.test(IMP34628_DEFLOW_SECOND_ORDER_SE_TARGET_WINDOW.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34628_DEFLOW_SECOND_ORDER_SE_TARGET_WINDOW.verdict),
  },
];

for (const a of IMP34628_DEFLOW_SECOND_ORDER_SE_TARGET_WINDOW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34628-deflow-second-order-se-target-window assertion failed: ${a.id}`);
  }
}
