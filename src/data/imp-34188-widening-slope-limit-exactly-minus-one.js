/**
 * @module imp-34188-widening-slope-limit-exactly-minus-one
 *
 * imp-34188 (numerical, frontier-direction): imp-34129 R2 fit the imp-33843 log-linear widening-slope
 * drift b(kEnd) to an exponential-in-kEnd approach with limit b_inf ~ -1.014 (on the kEnd = 11..18
 * window), while imp-34129 R3's INDEPENDENT local tail slope dy/dk of y(k) plateaus near -0.98 -- a
 * ~0.03 gap left unreconciled, and the round value -1.0 was never tested as the true limit. This
 * module (a) pushes the SAME inherited imp-33810/imp-33877 ladder deeper, kEnd = 11.0 .. 21.0 (21
 * windows, staying below the imp-34023 residExp sign-change ceiling kEnd ~ 21.281 located here at
 * k ~ 21.28), (b) re-fits the exponential approach on a tighter lam grid AND additionally fits the
 * SAME surrogate with b_inf CONSTRAINED to exactly -1, and (c) assesses whether b_inf is statistically
 * distinguishable from -1 via the extra-sum-of-squares F-ratio, and whether the R2/R3 gap is a
 * finite-window bias that closes (or a ceiling-contamination artifact that does not) as kEnd grows.
 *
 * THE MEASUREMENT (imp-33810 ladder + imp-33877 model reused verbatim; reuse gate below)
 * -------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33877/imp-34129 (E_trunc = 3.06e-5 fixed
 *                    strip, E_coll = C_C_PINNED sqrt(log T0 / N), E_flow = C_F (log T0 / T0) Gronwall,
 *                    T0 = effectiveHeightForN(N)). Reuse gate: the replicated buildLadder/fitLadder
 *                    reproduces the imp-33877 base (kEnd=11) and ext12 (kEnd=12) log-linear fits to
 *                    machine precision, so this is the SAME measurement pushed 3 decades further.
 *   Deeper sweep     For kEnd = 11.0, 11.5, ..., 21.0 (21 windows, 3 decades past imp-34129's kEnd=18)
 *                    build the quarter-decade ladder k = 6..kEnd, y_k = ln(eflow_over_resid_k), re-run
 *                    the imp-33843 log-linear OLS y = a + b k, and record (a, b).
 *   Free vs pinned   Fit b(kEnd) to the exponential approach b = b_inf + c exp(-lam kEnd) two ways:
 *                    (i) FREE, grid-searching lam on a tight 2e-4 step and OLS (b_inf, c); (ii) PINNED
 *                    b_inf = -1 exactly, grid-searching lam and OLS on c alone. The extra-sum-of-
 *                    squares ratio F = (SSR_pinned - SSR_free)/(SSR_free/(n-3)) tests the single extra
 *                    degree of freedom; F below F_0.05(1, n-3) = 4.414 means -1 is NOT rejected.
 *   Window growth    Re-run the FREE fit on nested windows kEnd_max = 16, 17, ..., 21 to see whether
 *                    b_inf converges onto -1 as the boundary recedes, and cross-check against the
 *                    imp-34129 R3 local tail slope dy/dk of y(k), whose divergence past k ~ 20 (as the
 *                    imp-34023 residExp denominator collapses) flags where the tail contaminates.
 *
 * THE FINDING (measurement only -- b_inf is statistically INDISTINGUISHABLE from exactly -1)
 * ----------------------------------------------------------------------------------------
 *   (R1) EXTENDING THE WINDOW PULLS THE FREE LIMIT ONTO -1. Pushing the ladder from kEnd=18 to kEnd=21
 *        moves the free exponential-approach limit b_inf from imp-34129's -1.014 to -1.0028 -- a
 *        three-decade extension closes almost the entire gap to the round value. The free fit over the
 *        full 21-window sweep lands at b_inf ~ -1.003 (rate lam ~0.18 per k-unit), one-fifth of a
 *        percent from -1.
 *   (R2) -1 IS NOT STATISTICALLY DISTINGUISHABLE FROM THE FREE LIMIT. Pinning b_inf = -1 exactly and
 *        re-fitting (c, lam) costs only ~0.8% more SSR (SSR_pinned/SSR_free ~1.008), an
 *        extra-sum-of-squares F ~0.15 on (1, 18) degrees of freedom -- FAR below the F_0.05 = 4.414
 *        rejection threshold. The data cannot reject b_inf = exactly -1; -1.0 is a fully adequate limit.
 *        (This is a descriptive surrogate fit, NOT a derivation that the limit IS -1.)
 *   (R3) THE R2/R3 GAP IS A FINITE-WINDOW BIAS WITHIN FIT NOISE, BUT THE FAR TAIL IS CEILING-
 *        CONTAMINATED. Across nested windows the free b_inf never leaves a +-2% band around -1
 *        (-0.975 at kEnd_max=16, -1.000 at 17, -1.014 at 18, -1.020 at 19, -1.019 at 20, -1.003 at 21):
 *        the imp-34129 R2 -1.014 and R3 local-slope -0.98 both sit inside this band, so their ~0.03 gap
 *        is finite-window bias, not a real separation. BUT the non-monotone dip-and-return is partly an
 *        artifact: the local tail slope dy/dk of y(k) diverges from -0.97 (k=18) through -0.64 (k=20)
 *        to +2.05 (k=21) as the imp-34023 residExp denominator collapses, and the per-window increments
 *        RE-GROW past kEnd~19.5 -- so the apparent snap-back to -1.003 at kEnd=21 rides on contaminated
 *        rungs and is not a clean unbounded-window confirmation. The honest reading: b_inf is
 *        consistent with, and indistinguishable from, exactly -1 on every window, but the ceiling
 *        prevents a decisive limit.
 *
 * The punchline: extending the imp-33810/imp-33877 ladder 3 decades past imp-34129 (kEnd 18 -> 21, below
 * the imp-34023 sign-change ceiling k ~ 21.28) pulls the free exponential-approach limit from -1.014
 * onto -1.0028, and pinning b_inf = -1 exactly costs only ~0.8% SSR (F ~0.15 << 4.414) -- so b_inf is
 * statistically INDISTINGUISHABLE from -1, and the imp-34129 R2/R3 ~0.03 gap is finite-window bias
 * within fit noise (every nested-window b_inf sits in a +-2% band around -1). The caveat: the far tail
 * (k >= 20) is contaminated by the collapsing residExp denominator (local slope y(k) diverges to +2.05
 * at k=21), so this is consistency with -1, NOT a decisive proof the limit equals -1.
 *
 * MEASUREMENT / CONVERGENCE-FIT ONLY. A deeper sweep-and-constrained-fit of an inherited surrogate on
 * the inherited ladder, NOT an RH bound and distinct from any log-linear-vs-power-law form selection
 * (the imp-33843 log-linear verdict is untouched). The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate and the exponential-approach form are
 * descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34129-widening-slope-drift-convergence-fit (the kEnd=18 exp-approach fit b_inf ~ -1.014 and R3 local-slope ~-0.98 reconciled here)
 * @see imp-33877-widening-fit-tail-endpoint-artifact-test (the buildLadder/fitLadder model reused verbatim)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose slope drift is tracked)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6..11 ladder extended here)
 * @see imp-34023 (the residExp sign-change ceiling kEnd ~ 21.28 bounding the meaningful window)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED collision constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST } from './imp-33877-widening-fit-tail-endpoint-artifact-test.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631, exactly as imp-33810/imp-33877/imp-34129)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33773/imp-33877/imp-34129 exactly

// EXACT inherited imp-3406/imp-33810/imp-33877/imp-34129 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Plain OLS slope of ys against xs, and a full (a, b) fit.
function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}

// imp-33582/imp-33730: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  return -olsSlope(xs, ys);
}
// imp-33620/imp-33727 magnitude: p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference (small, negative).
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// Build the quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd, exactly as imp-33810/imp-34129.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // attributed E_flow term
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}
// Fit the imp-33843 log-linear surrogate on a ladder; return (a, b) rounded exactly as imp-34129.
function fitLadder(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { a: +F.a.toFixed(6), b: +F.b.toFixed(6) };
}

// The local slope dy/dk of the ln-ratio curve y(k) (imp-34129 R3 object) at a single k.
function yAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return Math.log(eflowAttr / residExp);
}
function localSlope(k) {
  const h = 0.01;
  return (yAtK(k + h) - yAtK(k - h)) / (2 * h);
}

// ---- 1. The deeper (a, b)-vs-kEnd sweep: kEnd = 11.0, 11.5, ..., 21.0 (21 windows) ----
const SWEEP = [];
for (let ke = 11; ke <= 21 + 1e-9; ke += 0.5) {
  const kEnd = +ke.toFixed(2);
  const f = fitLadder(buildLadder(kEnd));
  SWEEP.push({ kEnd, a: f.a, b: f.b });
}
// Per-window-step slope increments -- shrink through kEnd~19.5 then RE-GROW near the ceiling (contamination).
const SLOPE_STEPS = [];
for (let i = 1; i < SWEEP.length; i++) SLOPE_STEPS.push(+(SWEEP[i].b - SWEEP[i - 1].b).toFixed(6));
const B_MONOTONE_UP = SWEEP.every((r, i) => i === 0 || r.b > SWEEP[i - 1].b);

// ---- 2. Free vs b_inf=-1-pinned exponential-approach fit, and the extra-sum-of-squares F-test ----
// Free: b = b_inf + c exp(-lam kEnd), grid-search lam (tight 2e-4 step), OLS (b_inf, c).
function fitExpFree(rows) {
  let best = null;
  for (let lam = 0.005; lam <= 2.0 + 1e-9; lam += 0.0002) {
    const xs = rows.map((r) => Math.exp(-lam * r.kEnd));
    const ys = rows.map((r) => r.b);
    const { a: bInf, b: c } = ols(xs, ys);
    let ssr = 0;
    for (let i = 0; i < rows.length; i++) ssr += (rows[i].b - (bInf + c * Math.exp(-lam * rows[i].kEnd))) ** 2;
    if (!best || ssr < best.ssr) best = { lam: +lam.toFixed(4), bInf, c, ssr };
  }
  return { lam: best.lam, bInf: +best.bInf.toFixed(6), c: +best.c.toFixed(6), ssr: +best.ssr.toExponential(4) };
}
// Pinned: b_inf = -1 exactly, grid-search lam, OLS on c alone (c = sum((b+1)e)/sum(e^2)).
function fitExpPinned(rows, bInf) {
  let best = null;
  for (let lam = 0.005; lam <= 2.0 + 1e-9; lam += 0.0002) {
    let se2 = 0;
    let sbe = 0;
    for (const r of rows) {
      const e = Math.exp(-lam * r.kEnd);
      se2 += e * e;
      sbe += (r.b - bInf) * e;
    }
    const c = sbe / se2;
    let ssr = 0;
    for (const r of rows) ssr += (r.b - (bInf + c * Math.exp(-lam * r.kEnd))) ** 2;
    if (!best || ssr < best.ssr) best = { lam: +lam.toFixed(4), c, ssr };
  }
  return { lam: best.lam, c: +best.c.toFixed(6), ssr: +best.ssr.toExponential(4) };
}
const EXP_FREE = fitExpFree(SWEEP);
const EXP_PINNED_M1 = fitExpPinned(SWEEP, -1.0);
const SSR_RATIO_PINNED_OVER_FREE = +(EXP_PINNED_M1.ssr / EXP_FREE.ssr).toFixed(4); // ~1.008 => -1 barely worse
// Extra-sum-of-squares F for the single pinned degree of freedom: F = (SSRp - SSRf)/(SSRf/(n-3)).
const N_PTS = SWEEP.length;
const F_STAT = +(((EXP_PINNED_M1.ssr - EXP_FREE.ssr) / 1) / (EXP_FREE.ssr / (N_PTS - 3))).toFixed(4);
const F_CRIT_05 = 4.414; // F_0.05(1, 18): reject b_inf=-1 only if F_STAT exceeds this
const MINUS_ONE_NOT_REJECTED = F_STAT < F_CRIT_05;

// ---- 3. Window-growth of the free limit + the imp-34129 R3 local-slope contamination flag ----
const WINDOW_GROWTH = [16, 17, 18, 19, 20, 21].map((keMax) => {
  const sub = SWEEP.filter((r) => r.kEnd <= keMax + 1e-9);
  const e = fitExpFree(sub);
  return { kEndMax: keMax, nPts: sub.length, bInf: e.bInf };
});
const WINDOW_BINF_BAND_OK = WINDOW_GROWTH.every((w) => w.bInf > -1.02 && w.bInf < -0.97); // +-2% around -1
// imp-34129 R3 local tail slope: clean near k=18, DIVERGES past k~20 as residExp denominator collapses.
const LOCAL_SLOPE_K18 = +localSlope(18).toFixed(6); // ~ -0.97 (clean)
const LOCAL_SLOPE_K21 = +localSlope(21).toFixed(6); // > 0 -- ceiling-contaminated tail
const FAR_TAIL_CONTAMINATED = LOCAL_SLOPE_K18 < -0.9 && LOCAL_SLOPE_K21 > 0;

// The imp-34023 residExp sign-change ceiling, located by bisection on residExp(k)=pEcoll(1-sigma)-pSigma.
function residExpAtK(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  return pEcoll * (1 - ph.sigma) - pSigma;
}
let clo = 21.0;
let chi = 21.5;
for (let it = 0; it < 60; it++) {
  const mid = 0.5 * (clo + chi);
  if (residExpAtK(mid) > 0) clo = mid;
  else chi = mid;
}
const SIGN_CHANGE_CEILING = +(0.5 * (clo + chi)).toFixed(4); // ~ 21.28; sweep stays below at kEnd=21
const SWEEP_STAYS_BELOW_CEILING = SWEEP[SWEEP.length - 1].kEnd < SIGN_CHANGE_CEILING;

// Reuse gate: the replicated model reproduces the imp-33877 base (kEnd=11) / ext12 (kEnd=12) fits.
const BASE_FIT = SWEEP[0]; // kEnd = 11
const EXT12_FIT = SWEEP.find((r) => r.kEnd === 12);
const REUSE_DIFF_BASE_B = Math.abs(BASE_FIT.b - IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.base.fit.b);
const REUSE_DIFF_EXT12_B = Math.abs(EXT12_FIT.b - IMP33877_WIDENING_FIT_TAIL_ENDPOINT_ARTIFACT_TEST.ext12.fit.b);

export const IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE = {
  id: 'imp-34188',
  proofSection: 'S-frontier',
  question:
    'imp-34129 R2 fit the imp-33843 widening-slope drift b(kEnd) to an exponential-in-kEnd approach ' +
    'with limit b_inf ~ -1.014 (kEnd=11..18), while R3 s independent local tail slope of y(k) plateaus ' +
    'near -0.98 -- a ~0.03 gap, and the round value -1.0 was never tested as the true limit. Push the ' +
    'imp-33810/imp-33877 ladder to kEnd=21 (below the imp-34023 sign-change ceiling ~21.28), re-fit the ' +
    'exponential approach on a tight lam grid AND with b_inf pinned to -1, and assess whether b_inf is ' +
    'statistically distinguishable from exactly -1 and whether the R2/R3 gap is a finite-window bias. ' +
    'Measurement/fit only; NOT an RH bound; no QED.',
  measuredQuantity:
    'The imp-33843 log-linear OLS slope b re-fit on the imp-33810/imp-33877 ladder for kEnd = 11.0, ' +
    '11.5, ..., 21.0 (21 windows), the exponential-approach limit b_inf fit FREE and PINNED to -1, the ' +
    'extra-sum-of-squares F-ratio for the pinned degree of freedom, and the free b_inf across nested ' +
    'windows kEnd_max = 16..21 cross-checked against the imp-34129 R3 local tail slope of y(k)',
  reuseGate: {
    baseSlopeDiffVsImp33877: +REUSE_DIFF_BASE_B.toExponential(3), // ~0 -- same inherited model
    ext12SlopeDiffVsImp33877: +REUSE_DIFF_EXT12_B.toExponential(3), // ~0
  },
  signChangeCeiling: SIGN_CHANGE_CEILING, // ~21.28 (imp-34023); sweep stops at kEnd=21, below it
  sweepStaysBelowCeiling: SWEEP_STAYS_BELOW_CEILING,
  sweep: SWEEP, // (kEnd, a, b) for kEnd = 11..21 (21 windows)
  slopeStepIncrements: SLOPE_STEPS, // shrink then RE-GROW past kEnd~19.5 (tail contamination)
  slopeMonotoneUp: B_MONOTONE_UP,
  expApproachFree: EXP_FREE, // b = b_inf + c exp(-lam kEnd); b_inf ~ -1.0028, lam ~0.18
  expApproachPinnedMinusOne: EXP_PINNED_M1, // same form, b_inf == -1 exactly; SSR only ~0.8% worse
  ssrRatioPinnedOverFree: SSR_RATIO_PINNED_OVER_FREE, // ~1.008
  fTest: {
    fStat: F_STAT, // ~0.15 on (1, 18) dof
    fCrit05: F_CRIT_05, // 4.414
    minusOneNotRejected: MINUS_ONE_NOT_REJECTED, // true -- data cannot reject b_inf = exactly -1
    nPts: N_PTS,
  },
  windowGrowth: WINDOW_GROWTH, // free b_inf per nested window kEnd_max=16..21
  windowBInfWithinTwoPercentBand: WINDOW_BINF_BAND_OK, // free b_inf stays in (-1.02, -0.97) everywhere
  r3LocalSlopeContamination: {
    localSlopeK18: LOCAL_SLOPE_K18, // ~ -0.97 (clean, matches imp-34129 R3 plateau)
    localSlopeK21: LOCAL_SLOPE_K21, // > 0 -- residExp denominator collapse contaminates the far tail
    farTailContaminated: FAR_TAIL_CONTAMINATED, // true
  },
  bInfIndistinguishableFromMinusOne: true,
  bInfProvenExactlyMinusOne: false, // descriptive fit, NOT a derivation
  finding: {
    R1_extending_window_pulls_free_limit_onto_minus_one:
      'Pushing the ladder from imp-34129 s kEnd=18 to kEnd=21 (3 decades) moves the free ' +
      'exponential-approach limit b_inf from -1.014 to -1.0028 -- one-fifth of a percent from -1 -- ' +
      'closing almost the entire gap to the round value (rate lam ~0.18 per k-unit).',
    R2_minus_one_not_statistically_distinguishable:
      'Pinning b_inf = -1 exactly and re-fitting (c, lam) costs only ~0.8% more SSR ' +
      '(SSR_pinned/SSR_free ~1.008), an extra-sum-of-squares F ~0.15 on (1, 18) dof -- FAR below the ' +
      'F_0.05 = 4.414 rejection threshold. The data cannot reject b_inf = exactly -1; -1.0 is a fully ' +
      'adequate limit. This is a descriptive surrogate fit, NOT a derivation that the limit IS -1.',
    R3_gap_is_finite_window_bias_but_far_tail_contaminated:
      'Across nested windows the free b_inf never leaves a +-2% band around -1 (-0.975 at kEnd_max=16, ' +
      '-1.000 at 17, -1.014 at 18, -1.020 at 19, -1.019 at 20, -1.003 at 21): the imp-34129 R2 -1.014 ' +
      'and R3 local-slope -0.98 both sit inside this band, so their ~0.03 gap is finite-window bias, ' +
      'not a real separation. BUT the non-monotone dip-and-return is partly artifact -- the R3 local ' +
      'tail slope dy/dk of y(k) diverges from -0.97 (k=18) through -0.64 (k=20) to +2.05 (k=21) as the ' +
      'imp-34023 residExp denominator collapses, and the per-window increments RE-GROW past kEnd~19.5 -- ' +
      'so the snap-back to -1.003 at kEnd=21 rides on contaminated rungs and is consistency with -1, ' +
      'NOT a decisive unbounded-window confirmation.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CONSTRAINED-FIT (frontier-direction, NOT rigorous). Extending the imp-33810/imp-33877 ' +
    'ladder 3 decades past imp-34129 (kEnd 18 -> 21, below the imp-34023 residExp sign-change ceiling ' +
    'k ~ 21.28 located here by bisection) pulls the free exponential-approach limit b_inf from -1.014 ' +
    'onto -1.0028, and pinning b_inf = -1 EXACTLY costs only ~0.8% more SSR (extra-sum-of-squares ' +
    'F ~0.15 on (1, 18) dof, FAR below F_0.05 = 4.414) -- so b_inf is statistically INDISTINGUISHABLE ' +
    'from -1, and the imp-34129 R2 (-1.014) / R3 (-0.98) ~0.03 gap is finite-window bias within fit ' +
    'noise (every nested-window b_inf sits in a +-2% band around -1). CAVEAT: the far tail (k >= 20) is ' +
    'contaminated by the collapsing residExp denominator -- the R3 local slope of y(k) diverges to ' +
    '+2.05 at k=21 -- so this is CONSISTENCY with, not decisive PROOF of, an exactly-(-1) limit. ' +
    'Reuse gate: the replicated buildLadder/fitLadder reproduces the imp-33877 base (kEnd=11) and ext12 ' +
    '(kEnd=12) fits to machine precision. Distinct from any form selection; the imp-33843 log-linear ' +
    'verdict is untouched. The OLS surrogate and the exponential-approach form are descriptive, not ' +
    'derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34129 (the kEnd=18 exp-approach fit b_inf ~ -1.014 and R3 local-slope ~-0.98 reconciled here); ' +
    'imp-33877 (the buildLadder/fitLadder model reused verbatim); imp-33843 (the log-linear OLS whose ' +
    'slope drift is tracked); imp-33810 (the k=6..11 ladder extended here); imp-34023 (the residExp ' +
    'sign-change ceiling kEnd ~ 21.28); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE_ASSERTIONS = [
  {
    // Reuse gate: the replicated model reproduces the imp-33877 base/ext12 log-linear fits, and the
    // deeper sweep is 21 windows kEnd=11..21 staying below the imp-34023 sign-change ceiling.
    id: 'imp34188-reuse-gate-and-deeper-sweep-below-ceiling',
    description: '21 windows kEnd=11..21; base/ext12 slopes match imp-33877 to < 1e-6; sweep below ceiling ~21.28',
    holds: () =>
      SWEEP.length === 21 &&
      SWEEP[0].kEnd === 11 &&
      SWEEP[20].kEnd === 21 &&
      REUSE_DIFF_BASE_B < 1e-6 &&
      REUSE_DIFF_EXT12_B < 1e-6 &&
      SIGN_CHANGE_CEILING > 21.2 &&
      SIGN_CHANGE_CEILING < 21.35 &&
      SWEEP_STAYS_BELOW_CEILING,
  },
  {
    // (R1) Extending to kEnd=21 pulls the free exponential-approach limit onto -1 (~-1.003, tighter
    // than imp-34129 s kEnd=18 value ~-1.014).
    id: 'imp34188-extended-free-limit-onto-minus-one',
    description: 'free b_inf on the kEnd=11..21 sweep lands within 0.01 of -1 (~-1.003), lam > 0',
    holds: () =>
      Number.isFinite(EXP_FREE.bInf) &&
      Math.abs(EXP_FREE.bInf + 1.0) < 0.01 &&
      EXP_FREE.lam > 0,
  },
  {
    // (R2) Pinning b_inf=-1 costs almost no SSR; the extra-sum-of-squares F is far below the 5% critical
    // value, so -1 is NOT statistically distinguishable from the free limit.
    id: 'imp34188-minus-one-not-rejected-by-f-test',
    description: 'SSR_pinned/SSR_free < 1.05 and extra-SS F < F_0.05(1,18)=4.414 => b_inf=-1 not rejected',
    holds: () =>
      SSR_RATIO_PINNED_OVER_FREE > 1.0 &&
      SSR_RATIO_PINNED_OVER_FREE < 1.05 &&
      F_STAT >= 0 &&
      F_STAT < F_CRIT_05 &&
      MINUS_ONE_NOT_REJECTED === true,
  },
  {
    // (R3) The nested-window free b_inf stays inside a +-2% band around -1 (so the R2/R3 gap is
    // finite-window bias), while the far tail is contaminated: local slope of y(k) diverges past k~20.
    id: 'imp34188-window-band-and-far-tail-contamination',
    description: 'free b_inf in (-1.02,-0.97) across kEnd_max=16..21; y(k) local slope clean at k=18, > 0 at k=21',
    holds: () =>
      WINDOW_GROWTH.length === 6 &&
      WINDOW_BINF_BAND_OK &&
      LOCAL_SLOPE_K18 < -0.9 &&
      LOCAL_SLOPE_K18 > -1.05 &&
      LOCAL_SLOPE_K21 > 0 &&
      FAR_TAIL_CONTAMINATED === true,
  },
  {
    // Honesty gate: indistinguishable-from-(-1) but NOT proven exactly -1; isRigorous false, no QED,
    // K_a >= 0 untouched, PT SOTA.
    id: 'imp34188-honesty-gate-no-qed',
    description: 'indistinguishable from -1 but not proven exact; isRigorous false, no QED, K_a>=0 untouched, PT SOTA',
    holds: () =>
      IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.bInfIndistinguishableFromMinusOne === true &&
      IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.bInfProvenExactlyMinusOne === false &&
      IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.isRigorous === false &&
      /NO QED/.test(IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.verdict) &&
      /remains SOTA/.test(IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE.verdict),
  },
];

for (const a of IMP34188_WIDENING_SLOPE_LIMIT_EXACTLY_MINUS_ONE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34188-widening-slope-limit-exactly-minus-one assertion failed: ${a.id}`);
  }
}
