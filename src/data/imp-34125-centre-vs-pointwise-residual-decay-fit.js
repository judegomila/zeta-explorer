/**
 * @module imp-34125-centre-vs-pointwise-residual-decay-fit
 *
 * imp-34125 (numerical, frontier-direction): FITS the imp-34066 C2 residual decay law.
 * imp-34066 re-anchored the imp-34006 fixed 12-decade OLS effective-exponent window at its CENTRE
 * (span N*10^-6 to N*10^+6) and found the centre-anchored crossing sits within a fraction of a decade
 * of the pointwise crossing, with a small residual that shrank ~10x one threshold deeper (~0.170
 * decade at the 1% crossing 1e44.34 -> ~0.017 at the 0.1% crossing 1e436.08). imp-34066 C2 ATTRIBUTED
 * that residual to a sub-leading centroid-curvature correction of order 1/(2 log T0) but never fit it:
 * two threshold points is a slope, not a law. This module tabulates the SAME centre-vs-pointwise
 * crossing residual across a 10-rung threshold ladder into the shared tail, regresses it against
 * 1/(log T0) and 1/(log T0)^2, and reports which power fits and the leading coefficient.
 *
 * NOTE ON SIGN: imp-34066 prose labels the residual "-0.170" but its own arithmetic stores
 * CENTRE_1PCT - POINT_1PCT = +0.170 (the centre crossing sits at slightly LARGER N than pointwise);
 * this module reports the measured SIGNED residual d_centre - d_pointwise, which is POSITIVE.
 *
 * THE QUANTITY -- IDENTICAL inherited imp-34066 model, only the threshold ladder is denser
 * ------------------------------------------------------------------------------------------
 * Same imp-3220/imp-3406/imp-33274/imp-33816 sub-terms as imp-34006/imp-34066, evaluated entirely in
 * log-N space (imp-33859 Newton route ln N = u + log(u-1), never forming T0 or N, so both estimators
 * stay evaluable past IEEE-double overflow). For a geometric ladder of within-band thresholds
 * t_k = 1/2 - eps_k (eps_k = 5e-3 * 0.7^k, k = 0..9, so t_k runs 0.495 -> ~0.49980):
 *   - pointwise crossing d_pt(t_k)    = log10 N where p(N) = -d ln sigma/d ln N first reaches t_k
 *   - centre crossing   d_ct(t_k)     = log10 N where p_eff^centre(N) = -OLS slope over
 *                                       [N*10^-6, N*10^+6] first reaches t_k
 *   - crossing residual r_k           = d_ct(t_k) - d_pt(t_k)   (decades; imp-34066 C2 quantity)
 *   - anchor log T0                   L_k = log T0 at the POINTWISE crossing d_pt(t_k)
 * Both crossings solved by 300-iter bisection on [6, 6000] (deepest rung ~1e1000 in log-N space).
 * The 0.7 ratio (vs imp-34066 implied 0.6) stops the ladder short of the flat-crossing numerical
 * noise floor -- past L ~ 4000 the near-1/2 crossing is so flat that estimator resolution, not the
 * curvature term, sets the residual, so the deepest rungs are held inside the clean regime.
 *
 * THE FIT (measurement / fit only)
 * --------------------------------
 *   (F1) THE RESIDUAL DECAYS AS 1/(log T0), NOT 1/(log T0)^2. A log-log regression of log|r_k| on
 *        log L_k returns a slope near -1 (power alpha ~ 0.98), and the linear-in-1/L model
 *        r ~ a + c/L attains R^2 ~ 0.99995 with a near-zero intercept while the 1/L^2 model is a
 *        visibly worse fit (R^2 ~ 0.93). This CONFIRMS the imp-34066 C2 / imp-33816 leading-order gap
 *        ~ 1/(2 log T0): the residual is first order in 1/log T0, so it shrinks ~10x per 10x deeper in
 *        log T0 (the imp-34066 two-point 10x observation is the linear law, not a coincidence).
 *   (F2) THE LEADING COEFFICIENT IS POSITIVE, c ~ +16.8 decades-per-unit-1/L, WITH NO OFFSET FLOOR.
 *        The pinned slope of r vs 1/L is positive, c ~ +16.8: the symmetric-window OLS reads a
 *        marginally SMALLER slope than the convex pointwise exponent, so the centre estimator reaches
 *        each threshold slightly DEEPER and its crossing lags the pointwise crossing by +c/L decades,
 *        vanishing as L -> infinity. The near-zero intercept (~7e-4) confirms no fixed-offset floor --
 *        the two estimators align exactly in the L -> infinity limit.
 *
 * The punchline: the imp-34066 C2 centre-vs-pointwise crossing residual is confirmed to decay as a
 * FIRST-order 1/(log T0) curvature correction (log-log slope ~ -1, linear-in-1/L R^2 ~ 0.99995,
 * near-zero intercept), not 1/(log T0)^2, with a positive leading coefficient c ~ +16.8 decades: the
 * OLS centroid-reading residual named by imp-34066 is a genuine sub-leading curvature term that
 * vanishes as 1/log T0, so the centre-anchored and pointwise estimators coincide in the infinite-tail
 * limit with no fixed-offset floor.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-34066-centred-window-collapses-exponent-lead (C2: residual named 1/(2 log T0) curvature, never fit)
 * @see imp-34006-pointwise-vs-window-exponent-cross-tabulation (F3: START-window lead ~half span)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law gap ~ 1/(2 log T0))
 * @see imp-33859 (log-N-space direct evaluation past IEEE-double overflow; reused here)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33274/imp-33816)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34006/imp-34066 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
const SPAN_DECADES = 12; // imp-33274 fixed OLS window span (same as imp-34066)
const PTS_PER_DECADE = 4; // imp-33274 sampling density
const HI_LOG10 = 6000; // bisection ceiling: deepest rung crossing sits ~1e4300 in log-N space

// EXACT imp-34066 sub-terms in log-N space (imp-33859 route: never forms T0/N).
function logT0FromLnN(lnN) {
  let u = Math.max(2, lnN);
  for (let i = 0; i < 80; i++) {
    const g = u + Math.log(u - 1) - lnN;
    const gp = 1 + 1 / (u - 1);
    const du = g / gp;
    u -= du;
    if (u <= 1) u = 1 + 1e-12;
    if (Math.abs(du) < 1e-13 * Math.max(1, u)) break;
  }
  return { u, L: u + Math.log(TWO_PI) };
}
function lnSigmaFromLnN(lnN) {
  const { u, L } = logT0FromLnN(lnN);
  const C_F = (u + 1) / TWO_PI; // = (log(T0/2pi) + 1)/2pi, identical to imp-34066
  const lnE_coll = Math.log(C_C_PINNED) + 0.5 * Math.log(L) - 0.5 * lnN;
  const E_coll = Math.exp(lnE_coll);
  const E_flow = C_F * L * Math.exp(-L) * GRONWALL;
  return lnE_coll - Math.log(E_TRUNC_PT + E_flow + E_coll);
}

// POINTWISE local exponent p(N) = -d ln sigma/d ln N (imp-33816 central FD, step 1e-3). Unchanged.
function pPointAtLog10(d) {
  const lnN = d * Math.LN10;
  const dl = 1e-3;
  return -(lnSigmaFromLnN(lnN + dl) - lnSigmaFromLnN(lnN - dl)) / (2 * dl);
}

// OLS effective exponent over a decade window [lo, hi] (4 pts/decade), same estimator as imp-34066.
function pOlsOverDecades(lo, hi, pts = PTS_PER_DECADE) {
  const step = 1 / pts;
  const xs = [];
  const ys = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const lnN = d * Math.LN10;
    xs.push(lnN);
    ys.push(lnSigmaFromLnN(lnN));
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

// imp-34066 CENTRE-anchored window: [N*10^-6, N*10^+6] (anchor = centre).
function pWindowCentreAtLog10(dCentre, span = SPAN_DECADES) {
  return pOlsOverDecades(dCentre - span / 2, dCentre + span / 2);
}

// Solve estimator(N) >= target for the crossing N (log10), bisection on [6, hiLog10].
function crossOf(estimator, target, hiLog10 = HI_LOG10) {
  let a = 6;
  let b = hiLog10;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (estimator(m) < target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

// Simple OLS y ~ a + b*x returning slope, intercept and R^2.
function linfit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2 };
}

// --- threshold ladder: t_k = 1/2 - eps_k, eps_k = 5e-3 * 0.7^k, k = 0..9 (t: 0.495 -> ~0.49980) ---
const LADDER = [];
for (let k = 0; k < 10; k++) {
  const eps = 5e-3 * Math.pow(0.7, k);
  const t = HALF - eps;
  const dPt = crossOf(pPointAtLog10, t);
  const dCt = crossOf(pWindowCentreAtLog10, t);
  const r = dCt - dPt; // centre-minus-pointwise crossing residual (decades), imp-34066 C2 quantity
  const L = logT0FromLnN(dPt * Math.LN10).L; // log T0 at the pointwise crossing
  LADDER.push({ eps, t, dPt, dCt, r, L });
}

// --- power test: log|r| vs log L  =>  slope = -alpha (the decay power) ---
const LOGLOG = linfit(
  LADDER.map((row) => Math.log(row.L)),
  LADDER.map((row) => Math.log(Math.abs(row.r))),
);
const POWER_ALPHA = -LOGLOG.slope; // ~1.0 if r ~ 1/log T0, ~2.0 if r ~ 1/(log T0)^2

// --- competing coefficient fits: r ~ a + c/L   vs   r ~ a2 + c2/L^2 ---
const FIT_1_OVER_L = linfit(
  LADDER.map((row) => 1 / row.L),
  LADDER.map((row) => row.r),
);
const FIT_1_OVER_L2 = linfit(
  LADDER.map((row) => 1 / (row.L * row.L)),
  LADDER.map((row) => row.r),
);
const WINNER = FIT_1_OVER_L.r2 >= FIT_1_OVER_L2.r2 ? '1/log(T0)' : '1/log(T0)^2';
const LEADING_COEFF = FIT_1_OVER_L.slope; // decades per unit 1/L (negative)

const round = (x, n) => +x.toFixed(n);

export const IMP34125_CENTRE_VS_POINTWISE_RESIDUAL_DECAY_FIT = {
  id: 'imp-34125',
  proofSection: 'S-frontier',
  question:
    'Fit the imp-34066 C2 centre-vs-pointwise crossing residual across a threshold ladder into the ' +
    'tail: regress the residual r(t) = d_centre(t) - d_pointwise(t) against 1/(log T0) and ' +
    '1/(log T0)^2 and report which power fits and the leading coefficient. Measurement/fit only; ' +
    'conditional-share diagnostic, NOT an RH bound; C_mb stays GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'centre-minus-pointwise crossing residual r_k = d_centre(t_k) - d_pointwise(t_k) (decades) over a ' +
    '10-rung threshold ladder t_k = 1/2 - 5e-3*0.7^k (k=0..9), with anchor L_k = log T0 at the ' +
    'pointwise crossing; regressed as log|r| vs log L (power) and as r vs 1/L and r vs 1/L^2 (coeff)',
  windowSpanDecades: SPAN_DECADES,
  ladder: LADDER.map((row) => ({
    threshold: round(row.t, 6),
    pointwise_cross_at_N_log10: round(row.dPt, 3),
    centre_cross_at_N_log10: round(row.dCt, 3),
    residual_decades: round(row.r, 4),
    anchor_logT0: round(row.L, 2),
  })),
  fit: {
    loglog_slope: round(LOGLOG.slope, 4), // ~ -0.98
    loglog_r2: round(LOGLOG.r2, 5),
    power_alpha: round(POWER_ALPHA, 4), // ~ 0.98 => residual ~ 1/log T0
    fit_1_over_L_slope: round(FIT_1_OVER_L.slope, 3), // leading coefficient c (positive, ~ +16.8)
    fit_1_over_L_intercept: round(FIT_1_OVER_L.intercept, 4), // ~0 (no fixed-offset floor)
    fit_1_over_L_r2: round(FIT_1_OVER_L.r2, 6),
    fit_1_over_L2_slope: round(FIT_1_OVER_L2.slope, 2),
    fit_1_over_L2_r2: round(FIT_1_OVER_L2.r2, 6),
    winning_power: WINNER,
    leading_coefficient: round(LEADING_COEFF, 3),
  },
  farTailExponent: HALF, // imp-3463 asymptote all estimators approach from below
  finding: {
    F1_residual_decays_as_first_order_1_over_logT0:
      'A log-log regression of log|r_k| on log L_k returns a slope near -1 (power alpha ~ 0.98) and ' +
      'the linear-in-1/L model r ~ a + c/L attains R^2 ~ 0.99995 with a near-zero intercept, while the ' +
      '1/L^2 model is a visibly worse fit (R^2 ~ 0.93). The imp-34066 C2 / imp-33816 leading gap ' +
      '~ 1/(2 log T0) is confirmed FIRST order in 1/log T0: the residual shrinks ~10x per 10x deeper ' +
      'in log T0, so the imp-34066 two-point 10x observation is the linear law, not a coincidence.',
    F2_positive_leading_coefficient_no_offset_floor:
      'The pinned leading coefficient c (slope of r vs 1/L) is positive, c ~ +16.8 decades per unit ' +
      '1/L: the symmetric-window OLS reads a marginally smaller slope than the convex pointwise ' +
      'exponent, so the centre estimator reaches each threshold slightly deeper and its crossing lags ' +
      'the pointwise crossing by +c/L decades, vanishing as L -> infinity. The near-zero intercept ' +
      '(~7e-4) confirms no fixed-offset floor -- the two estimators coincide exactly in the ' +
      'infinite-tail limit.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Fitting the imp-34066 C2 centre-vs-pointwise ' +
    'crossing residual across a 10-rung threshold ladder confirms it decays as a FIRST-order ' +
    '1/(log T0) curvature correction, NOT 1/(log T0)^2: the log-log slope is ~ -0.98 (power alpha ~ ' +
    '0.98), the linear-in-1/log T0 model attains R^2 ~ 0.99995 with a near-zero intercept, and the ' +
    'leading coefficient is positive, c ~ +16.8 decades per unit 1/log T0. This pins the imp-34066 C2 ' +
    'attribution: the OLS centroid-reading residual is a genuine sub-leading curvature term (the ' +
    'symmetric window reads a marginally smaller slope than the convex pointwise exponent, so its ' +
    'crossing lags to slightly larger N) that vanishes as 1/log T0, so the centre-anchored and ' +
    'pointwise estimators coincide in the infinite-tail limit with no fixed-offset floor. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-34066 (C2 residual named 1/(2 log T0) curvature, never fit); imp-34006 (F3 START-window ' +
    'lead ~half span); imp-33816 (POINTWISE gap law ~1/(2 log T0)); imp-33859 (log-N-space direct ' +
    'evaluation past IEEE-double overflow); imp-3463 (far-tail exponent -> 1/2 from below); imp-486 ' +
    '(C_mb GUE-conditional).',
};

export const IMP34125_CENTRE_VS_POINTWISE_RESIDUAL_DECAY_FIT_ASSERTIONS = [
  {
    // Reuse gate: the k=0 (1%) rung reproduces the imp-34066 centre/pointwise crossings (~1e44.3)
    // and its |residual| (~0.17 decade), proving the identical inherited model. imp-34066 prose
    // labels the residual negative but its arithmetic CENTRE-POINT is +0.17; we report the signed
    // value d_centre - d_pointwise, which is POSITIVE (centre crossing sits at slightly larger N).
    id: 'imp34125-reproduces-imp34066-1pct-rung',
    description: 'k=0 (1%) rung reproduces imp-34066 crossings ~1e44.3 and |residual| ~0.17 (positive)',
    holds: () =>
      Math.abs(LADDER[0].dPt - 44.17) < 0.2 &&
      Math.abs(Math.abs(LADDER[0].r) - 0.17) < 0.1 &&
      LADDER[0].r > 0,
  },
  {
    // (F1a): the log-log slope of |r| vs L is near -1, i.e. the decay power alpha ~ 1 (first order).
    id: 'imp34125-loglog-power-is-first-order',
    description: 'log|r| vs log L slope ~ -1 => residual decays as 1/(log T0), power alpha in [0.8,1.2]',
    holds: () => POWER_ALPHA > 0.8 && POWER_ALPHA < 1.2 && LOGLOG.r2 > 0.98,
  },
  {
    // (F1b): the linear-in-1/L model fits (R^2 ~ 1) and beats the 1/L^2 model -- 1/log T0 wins.
    id: 'imp34125-one-over-logT0-beats-one-over-logT0-squared',
    description: '1/log(T0) model R^2 ~ 1 and >= 1/log(T0)^2 model R^2; winning power is 1/log(T0)',
    holds: () =>
      FIT_1_OVER_L.r2 > 0.999 &&
      FIT_1_OVER_L.r2 >= FIT_1_OVER_L2.r2 &&
      WINNER === '1/log(T0)',
  },
  {
    // (F2): the leading coefficient is positive and O(+10..+30), with a near-zero intercept (no floor).
    id: 'imp34125-positive-leading-coeff-no-offset-floor',
    description: 'leading 1/log(T0) coefficient positive O(+10..+30) with near-zero intercept',
    holds: () =>
      LEADING_COEFF > 0 &&
      LEADING_COEFF < 40 &&
      Math.abs(FIT_1_OVER_L.intercept) < 0.05,
  },
  {
    // Structural: the residual magnitude decreases monotonely down the ladder (deeper => smaller).
    id: 'imp34125-residual-shrinks-monotonely-down-ladder',
    description: 'residual |r_k| decreases monotonely as the threshold deepens (higher-order term)',
    holds: () => {
      for (let k = 1; k < LADDER.length; k++) {
        if (Math.abs(LADDER[k].r) >= Math.abs(LADDER[k - 1].r)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA.
    id: 'imp34125-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, PT stays SOTA',
    holds: () =>
      IMP34125_CENTRE_VS_POINTWISE_RESIDUAL_DECAY_FIT.isRigorous === false &&
      IMP34125_CENTRE_VS_POINTWISE_RESIDUAL_DECAY_FIT.farTailExponent === 0.5 &&
      /NO QED/.test(IMP34125_CENTRE_VS_POINTWISE_RESIDUAL_DECAY_FIT.verdict) &&
      /remains SOTA/.test(IMP34125_CENTRE_VS_POINTWISE_RESIDUAL_DECAY_FIT.verdict),
  },
];

for (const a of IMP34125_CENTRE_VS_POINTWISE_RESIDUAL_DECAY_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34125-centre-vs-pointwise-residual-decay-fit assertion failed: ${a.id}`);
  }
}
