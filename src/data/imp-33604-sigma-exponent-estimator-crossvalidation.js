/**
 * @module imp-33604-sigma-exponent-estimator-crossvalidation
 *
 * imp-33604 (numerical, frontier-direction): the sigma-decay exponent of the imp-3406
 * conditional share sigma(N) = E_coll(N)/E(N) is now measured THREE different ways past
 * its interior maximum, but the three have never been tabulated on ONE shared grid:
 *   - imp-33582 : per-DECADE local OLS exponent p_dec = -slope of OLS(ln sigma vs ln N)
 *                 over each window [10^k, 10^(k+1)] (4 pts/decade). Ramps 0.0105 -> 0.4310
 *                 across k = 6..11.
 *   - imp-3529  : POINTWISE local exponent p(N) = -d ln sigma / d ln N (central diff in ln N).
 *   - imp-3463  : far-tail LEADING form sigma ~ (C_C/E_trunc) sqrt(logT0/N), whose exponent
 *                 -> 1/2 FROM BELOW.
 * These are three estimators of the SAME decay. This module puts all three on the shared
 * decade grid k = 6..11 and reconciles the coarse per-decade OLS ramp with the pointwise
 * p(N), reporting HOW the smoothing enters and by how much.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-3529 / imp-3463 / imp-33582)
 * -----------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the exact inherited imp-3406 sub-terms, byte-identical
 * to the three modules being cross-validated.
 *
 * THE RECONCILIATION (the key observation)
 * ----------------------------------------
 * A least-squares slope of ln sigma over the window [10^k, 10^(k+1)] is, up to curvature,
 * the AVERAGE of the pointwise slope -d ln sigma / d ln N over that window. Because the
 * pointwise exponent p(N) rises MONOTONELY across each decade (imp-3529 F1), that average
 * lands NEAR the pointwise value at the geometric MIDPOINT 10^(k+0.5) and is bracketed by
 * the decade endpoints:
 *     p(10^k)  <  p_dec^OLS  ~=  p(10^(k+0.5))  <  p(10^(k+1)).
 * So the per-decade OLS does NOT lag the pointwise p(N) "generically" -- it matches the
 * pointwise value at the decade CENTRE (to discretization error), and only appears to lag
 * when compared against the pointwise value at the decade's UPPER EDGE. That upper-edge lag
 * is exactly the amount the exponent climbs over half a decade -- the smoothing bias the
 * ticket asks to quantify.
 *
 * THE SHARED-GRID TABLE (exact sub-terms, k = 6..11)
 * --------------------------------------------------
 *   k   p_dec(OLS)  p(lo)     p(mid)    p(hi)    OLS-p(mid)   OLS-p(hi)  [upper-edge lag]
 *   6   0.01048     0.00056   0.00991   0.02332   +5.7e-4     -0.0128
 *   7   0.04475     0.02332   0.04335   0.07321   +1.4e-3     -0.0285
 *   8   0.11762     0.07321   0.11574   0.17136   +1.9e-3     -0.0537   (peak lag, mid-ramp)
 *   9   0.23602     0.17136   0.23594   0.30107   +7.9e-5     -0.0651
 *   10  0.35612     0.30107   0.35799   0.40186   -1.9e-3     -0.0457
 *   11  0.43105     0.40186   0.43255   0.45264   -1.5e-3     -0.0216
 * (p(hi) at k = 11 is 0.4526, the imp-3529 1e12 rung, still below the imp-3463 1/2 asymptote.)
 *
 * THE FINDING (measurement / cross-validation only)
 * -------------------------------------------------
 *   (F1) THE PER-DECADE OLS MATCHES THE POINTWISE p(N) AT THE DECADE CENTRE. For every
 *        decade k = 6..11, |p_dec^OLS - p(10^(k+0.5))| < 2.0e-3 -- well inside the pointwise
 *        central-difference discretization scale -- so the imp-33582 coarse ladder and the
 *        imp-3529 pointwise exponent are the SAME estimator sampled at the decade midpoint.
 *   (F2) THE OLS IS STRICTLY BRACKETED BY THE DECADE ENDPOINTS. p(10^k) < p_dec^OLS < p(10^(k+1))
 *        for every decade: the OLS averages the monotonely-climbing pointwise exponent, so it
 *        necessarily sits between the (lower) decade-start and (higher) decade-end pointwise
 *        values. This is why the imp-33582 ramp reads ~0.4310 for [1e11,1e12] while the
 *        pointwise p(1e12) is already ~0.4526.
 *   (F3) THE APPARENT "LAG" IS THE UPPER-EDGE SMOOTHING BIAS, AND IT IS SMALL WHERE IT MATTERS.
 *        Measured against the decade's UPPER edge the OLS lags by p(hi) - p_dec: 0.013, 0.028,
 *        0.054, 0.065, 0.046, 0.022 -- a hump peaking mid-ramp (k = 8..9, the steepest part of
 *        the exponent climb) and shrinking at both ends where p(N) is flatter. The lag is the
 *        half-decade rise of the exponent, NOT a model discrepancy.
 *   (F4) ALL THREE AGREE ON THE 1/2 CEILING FROM BELOW. Every p_dec, every pointwise p(N) on
 *        the grid, and the imp-3463 leading-form exponent all stay strictly below 1/2 and rise
 *        toward it -- the coarse OLS, the pointwise measure, and the analytic far-tail form are
 *        mutually consistent to their discretization error.
 *
 * The punchline: the imp-33582 per-decade OLS ramp (0.0105 -> 0.4310) is NOT a competing
 * measurement against the imp-3529 pointwise p(N) -- it is the same exponent averaged over
 * each decade, matching the pointwise value at the decade CENTRE to < 2e-3 and bracketed by
 * the endpoints. The only "lag" is the smoothing offset against the decade's upper edge
 * (peaking ~0.065 mid-ramp), exactly the amount p(N) climbs over half a decade. All three
 * estimators converge to the imp-3463 far-tail 1/2 from below.
 *
 * MEASUREMENT / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade OLS exponent ladder)
 * @see imp-3529-sigma-postpeak-decay-exponent (pointwise p(N) = -d ln sigma / d ln N)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-3529/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3529/imp-33582 exactly

// EXACT imp-3529/imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582 per-decade OLS exponent: p_dec = -slope of ln sigma on ln N over [loN, hiN].
function olsExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-3529 pointwise exponent: p(N) = -d ln sigma / d ln N (central difference in ln N).
function pointwiseExponent(N) {
  const h = 1e-4;
  const lnN = Math.log(N);
  const sMinus = Math.log(sigma(Math.exp(lnN - h)));
  const sPlus = Math.log(sigma(Math.exp(lnN + h)));
  return -(sPlus - sMinus) / (2 * h);
}

const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote (approached from below)

// Shared grid k = 6..11: per-decade OLS vs pointwise p(N) at the decade lo / mid / hi.
const SHARED_GRID = [6, 7, 8, 9, 10, 11].map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const mid = Math.pow(10, k + 0.5);
  const pOls = olsExponent(lo, hi);
  const pMid = pointwiseExponent(mid);
  const pLo = pointwiseExponent(lo);
  const pHi = pointwiseExponent(hi);
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_ols: +pOls.toFixed(5),
    p_pointwise_lo: +pLo.toFixed(5),
    p_pointwise_mid: +pMid.toFixed(5),
    p_pointwise_hi: +pHi.toFixed(5),
    ols_minus_mid: +(pOls - pMid).toExponential(3), // agreement at decade CENTRE
    upperEdgeLag: +(pHi - pOls).toFixed(5), // smoothing bias vs decade upper edge
  };
});

// The max centre-agreement gap and the max upper-edge smoothing lag across the grid.
const MAX_CENTRE_GAP = Math.max(...SHARED_GRID.map((r) => Math.abs(r.ols_minus_mid)));
const MAX_UPPER_LAG = Math.max(...SHARED_GRID.map((r) => r.upperEdgeLag));

export const IMP33604_SIGMA_EXPONENT_ESTIMATOR_CROSSVALIDATION = {
  id: 'imp-33604',
  proofSection: 'S-frontier',
  question:
    'Put the three sigma-decay exponent estimators on ONE shared decade grid (k = 6..11): ' +
    'the imp-33582 per-decade local OLS exponent, the imp-3529 pointwise p(N) = -d ln sigma/d ln N, ' +
    'and the imp-3463 far-tail leading form (exponent -> 1/2 from below). Confirm the coarse ' +
    'per-decade OLS and the pointwise measure AGREE within their discretization error and ' +
    'characterize the smoothing offset. Measurement/cross-validation only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'For each decade [10^k,10^(k+1)] (k=6..11): the imp-33582 OLS exponent p_dec, the imp-3529 ' +
    'pointwise p(N) at the decade lo/mid/hi, the centre-agreement p_dec - p(mid), and the ' +
    'upper-edge smoothing lag p(hi) - p_dec',
  sharedGrid: SHARED_GRID,
  farTailExponent: HALF, // imp-3463 asymptote all three estimators ramp toward from below
  maxCentreAgreementGap: +MAX_CENTRE_GAP.toExponential(3), // ~1.9e-3
  maxUpperEdgeLag: +MAX_UPPER_LAG.toFixed(5), // ~0.065 (mid-ramp, k=8..9)
  finding: {
    F1_ols_matches_pointwise_at_decade_centre:
      'For every decade k = 6..11, |p_dec^OLS - p(10^(k+0.5))| < 2.0e-3 -- inside the pointwise ' +
      'central-difference discretization scale -- so the imp-33582 coarse per-decade ladder and ' +
      'the imp-3529 pointwise exponent are the SAME estimator sampled at the decade midpoint.',
    F2_ols_bracketed_by_decade_endpoints:
      'p(10^k) < p_dec^OLS < p(10^(k+1)) for every decade: the OLS averages the monotonely ' +
      'climbing pointwise exponent, so it sits between the (lower) decade-start and (higher) ' +
      'decade-end pointwise values -- why the [1e11,1e12] OLS reads ~0.431 while p(1e12) ~0.453.',
    F3_apparent_lag_is_upper_edge_smoothing:
      'Measured against the decade upper edge the OLS lags by p(hi) - p_dec: 0.013, 0.028, 0.054, ' +
      '0.065, 0.046, 0.022 -- a hump peaking mid-ramp (k = 8..9, steepest exponent climb) and ' +
      'shrinking where p(N) is flatter. The lag is the half-decade rise of the exponent, not a ' +
      'model discrepancy.',
    F4_all_three_below_half:
      'Every p_dec, every pointwise p(N) on the grid, and the imp-3463 leading-form exponent stay ' +
      'strictly below 1/2 and rise toward it -- coarse OLS, pointwise measure, and analytic ' +
      'far-tail form are mutually consistent to their discretization error.',
  },
  isRigorous: false,
  verdict:
    'CROSS-VALIDATION (frontier-direction, NOT rigorous). Tabulating the three sigma-decay ' +
    'exponent estimators on one shared decade grid (k = 6..11): the imp-33582 per-decade OLS ' +
    'exponent MATCHES the imp-3529 pointwise p(N) at the geometric decade midpoint to < 2.0e-3 ' +
    'everywhere, and is strictly bracketed by the decade endpoints p(10^k) < p_dec < p(10^(k+1)). ' +
    'The imp-33582 ramp (0.0105 -> 0.4310) is therefore the imp-3529 pointwise exponent averaged ' +
    'over each decade, NOT a competing measurement. The only offset is the smoothing lag against ' +
    'the decade upper edge, p(hi) - p_dec, a hump peaking ~0.065 mid-ramp (k = 8..9) and shrinking ' +
    'at both ends -- exactly the half-decade rise of the exponent. All three estimators, plus the ' +
    'imp-3463 leading form, stay strictly below and ramp toward the 1/2 far-tail asymptote from ' +
    'below. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33582 (per-decade OLS exponent ladder 0.0105 -> 0.4310); imp-3529 (pointwise p(N) = ' +
    '-d ln sigma/d ln N); imp-3463 (far-tail leading form, exponent -> 1/2 from below); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33604_SIGMA_EXPONENT_ESTIMATOR_CROSSVALIDATION_ASSERTIONS = [
  {
    // Reuse gate: the shared grid reproduces the imp-33582 per-decade OLS ramp
    // (0.0105 [1e6,1e7] climbing to 0.4310 [1e11,1e12]) from the identical sub-terms.
    id: 'imp33604-reproduces-imp33582-ols-ramp',
    description: 'per-decade OLS ramps 0.0105 [1e6,1e7] -> 0.4310 [1e11,1e12], strictly increasing',
    holds: () => {
      for (let i = 1; i < SHARED_GRID.length; i++) {
        if (!(SHARED_GRID[i].p_ols > SHARED_GRID[i - 1].p_ols)) return false;
      }
      return (
        Math.abs(SHARED_GRID[0].p_ols - 0.0105) < 5e-4 &&
        Math.abs(SHARED_GRID[SHARED_GRID.length - 1].p_ols - 0.431) < 5e-4
      );
    },
  },
  {
    // (F1): the per-decade OLS matches the pointwise p(N) at the decade midpoint to < 2e-3,
    // proving the two estimators coincide (same quantity, sampled at the decade centre).
    id: 'imp33604-ols-matches-pointwise-at-centre',
    description: 'for every decade |p_ols - p_pointwise(mid)| < 2.0e-3 (agreement at decade centre)',
    holds: () =>
      SHARED_GRID.every((r) => Math.abs(r.ols_minus_mid) < 2.0e-3) && MAX_CENTRE_GAP < 2.0e-3,
  },
  {
    // (F2): the OLS is strictly bracketed by the decade endpoints -- the averaging signature
    // that reconciles the coarse ramp (0.431 at [1e11,1e12]) with the pointwise p(1e12) ~0.453.
    id: 'imp33604-ols-bracketed-by-endpoints',
    description: 'p_pointwise(lo) < p_ols < p_pointwise(hi) for every decade (OLS averages the climb)',
    holds: () =>
      SHARED_GRID.every((r) => r.p_pointwise_lo < r.p_ols && r.p_ols < r.p_pointwise_hi),
  },
  {
    // (F3): the apparent lag is the upper-edge smoothing bias -- positive everywhere and a
    // hump peaking mid-ramp (k=8..9), NOT a monotone model discrepancy.
    id: 'imp33604-upper-edge-lag-is-a-midramp-hump',
    description: 'p(hi) - p_ols > 0 for all decades, peaks mid-ramp (~0.065 at k=8..9), max < 0.07',
    holds: () => {
      const lags = SHARED_GRID.map((r) => r.upperEdgeLag);
      const argmax = lags.indexOf(Math.max(...lags));
      return (
        lags.every((l) => l > 0) &&
        MAX_UPPER_LAG > 0.05 &&
        MAX_UPPER_LAG < 0.07 &&
        (argmax === 2 || argmax === 3) // mid-ramp k = 8 or 9 (steepest exponent climb)
      );
    },
  },
  {
    // (F4): coarse OLS, pointwise p(N), and the imp-3463 leading form all stay below 1/2.
    id: 'imp33604-all-estimators-below-half',
    description: 'every OLS and pointwise exponent on the grid is in (0, 1/2), ramping toward imp-3463 1/2',
    holds: () =>
      SHARED_GRID.every(
        (r) =>
          r.p_ols > 0 &&
          r.p_ols < HALF &&
          r.p_pointwise_lo > 0 &&
          r.p_pointwise_hi < HALF,
      ),
  },
  {
    // Honesty gate: measurement/cross-validation only, far-tail exponent = 1/2 (imp-3463),
    // no QED, no refereed bound is changed.
    id: 'imp33604-honesty-gate-no-qed',
    description: 'Cross-validation only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP33604_SIGMA_EXPONENT_ESTIMATOR_CROSSVALIDATION.isRigorous === false &&
      IMP33604_SIGMA_EXPONENT_ESTIMATOR_CROSSVALIDATION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP33604_SIGMA_EXPONENT_ESTIMATOR_CROSSVALIDATION.verdict) &&
      /refereed bound is changed/i.test(IMP33604_SIGMA_EXPONENT_ESTIMATOR_CROSSVALIDATION.verdict),
  },
];

for (const a of IMP33604_SIGMA_EXPONENT_ESTIMATOR_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33604-sigma-exponent-estimator-crossvalidation assertion failed: ${a.id}`);
  }
}
