/**
 * @module imp-34041-eflow-widening-ratio-growth-law-tournament
 *
 * imp-34041 (numerical, frontier-direction): imp-33969 R2 tabulated that the imp-33922 over-prediction
 * factor F1/widening = 1/(F2*F3*F4) is NOT window-invariant -- across the imp-33917 boundary sweep
 * kEnd = 11..13 (9 windows) it rises MONOTONICALLY 19.913 -> 165.351 (x8.30), with the attenuation
 * F2*F3*F4 collapsing in lock-step 0.05022 -> 0.006048 (x0.120). But imp-33969 only REPORTED the drift;
 * it never fit its functional form. imp-34023 then fit ln F4 (the driver) log-linearly and extrapolated
 * the ratio PAST kEnd=13 to show it diverges -- but it never scored the over-prediction ratio ITSELF
 * against competing growth laws, and never asked whether the attenuation collapse admits a finite
 * asymptotic floor. This module supplies both, on the SAME 9 anchor windows and identical inherited
 * imp-3406/imp-33810 sub-terms: (A) a three-way model tournament -- linear vs exponential vs power-law --
 * scoring the over-prediction ratio 1/(F2*F3*F4) by RSS/R^2 on the original scale; (B) a log-linear fit
 * of the attenuation with a floor assessment via Aitken/Shanks extrapolation and a 3-parameter
 * plateau fit.
 *
 * THE GROWTH-LAW TOURNAMENT (the over-prediction ratio is EXPONENTIAL in kEnd, not power-law/linear)
 * -------------------------------------------------------------------------------------------------
 *   Scoring the ratio on the ORIGINAL scale over the 9 windows (kEnd = 11.00..13.00 step 0.25):
 *       exponential  ratio = exp(a + b*kEnd)      RSS ~ 7.41    R^2 ~ 0.99962   (WINNER)
 *       power-law    ratio = A*kEnd^b             RSS ~ 55.04   R^2 ~ 0.99720
 *       linear       ratio = a + b*kEnd           RSS ~ 1707    R^2 ~ 0.91311
 *   Exponential wins decisively: its RSS is ~7.4x smaller than power-law and ~230x smaller than linear.
 *   The fitted per-unit-kEnd growth factor is exp(b) ~ 2.888 -- each additional decade of fit boundary
 *   MULTIPLIES the over-prediction by ~2.89. So the raw (log N)^3/N decay over-predicts the widening
 *   GEOMETRICALLY worse as the boundary recedes; the ~19.9x anchor value is the base of an exponential.
 *
 * THE ATTENUATION COLLAPSE HAS NO FINITE POSITIVE FLOOR (it continues to zero)
 * ---------------------------------------------------------------------------
 *   ratio = 1/attenuation, so the exponential ratio growth is exactly an exponential attenuation DECAY:
 *   ln(attenuation) = a + b*kEnd fits with b ~ -1.0606, per-unit factor exp(b) ~ 0.34623, R^2 ~ 0.99976
 *   -- a clean geometric decay toward 0 (the ratio per-unit 2.888 = 1/0.34623). Testing for a finite
 *   asymptotic floor: Aitken/Shanks Delta^2 extrapolation of the attenuation sequence yields limits that
 *   approach 0 FROM BELOW (-4.52e-3 -> -1.75e-4, i.e. negative and rising toward 0), and a 3-parameter
 *   plateau fit attenuation = c + A*exp(b*kEnd) selects a NEGATIVE floor c ~ -8.13e-4 (best log-space
 *   R^2 ~ 0.99997). A negative floor estimate is not a physical plateau -- it is the extrapolator saying
 *   the true limit is 0 (or below the numerically-resolvable positive range). So the attenuation collapse
 *   admits NO finite positive floor: it continues to zero as kEnd recedes, consistent with the imp-34023
 *   F4 -> 0 divergence of the ratio (capped only by the imp-33773 M2 residual sign change at kEnd ~ 21.3).
 *
 * The punchline: fitting a growth law to the imp-33969 R2 over-prediction drift, the over-prediction
 * ratio 1/(F2*F3*F4) is EXPONENTIAL in kEnd (R^2 ~ 0.99962, per-unit factor ~2.888), decisively beating
 * power-law (RSS x7.4 larger) and linear (RSS x230 larger); equivalently the attenuation decays
 * exponentially (per-unit ~0.346, R^2 ~ 0.99976) with NO finite positive asymptotic floor -- Aitken and a
 * plateau fit both drive the floor to 0/negative, so the collapse continues to zero.
 *
 * NUMERICAL / MEASUREMENT ONLY. Descriptive growth-law model selection on the inherited surrogate ratio,
 * NOT an RH bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the fits
 * and the floor extrapolation are descriptive within that model only; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33969-eflow-decay-widening-ratio-kend-sweep (the R2 drift 19.913 -> 165.351 fit here)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the F4 log-linear fit + past-kEnd divergence)
 * @see imp-33922-eflow-analytic-decay-vs-widening-crosscheck (the fixed-kEnd=11 ~19.9x over-prediction)
 * @see imp-33917-endpoint-residual-growth-law (the 9-window kEnd = 11..13 boundary sweep reused)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate at kEnd ~ 21.3)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33922/imp-33969 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33969/imp-34023 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
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
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810 endpoint rung at boundary k (head k=6, tail k=kEnd) -- the roe = resid/eflow ratio.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, resid, sflow, eflow, roe: resid / eflow };
}

const HEAD = rung(6); // fixed head, exactly as imp-33969/imp-34023

// Per-boundary attenuation and over-prediction ratio (head fixed at k=6), same identity as imp-33969.
function factors(kEnd) {
  const TAIL = rung(kEnd);
  const F2 = TAIL.E_N / HEAD.E_N; // normaliser collapse
  const F3 = HEAD.sflow / TAIL.sflow; // E_flow log-slope ratio
  const F4 = TAIL.resid / HEAD.resid; // imp-33773 residual ratio (the driver)
  const attenuation = F2 * F3 * F4;
  return { kEnd, F2, F3, F4, attenuation, ratio: 1 / attenuation };
}

// Simple OLS y = a + b*x, returning {a, b, R2} (in whatever space xs/ys are passed).
function ols(xs, ys) {
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
  const b = sxy / sxx;
  const a = my - b * mx;
  return { a, b, R2: (sxy * sxy) / (sxx * syy) };
}

// Original-scale RSS and R^2 for a fitted predictor (so the three forms compete on the SAME scale).
function scoreOriginal(xs, yObs, pred) {
  const n = xs.length;
  const my = yObs.reduce((a, b) => a + b, 0) / n;
  let rss = 0;
  let tss = 0;
  for (let i = 0; i < n; i++) {
    rss += (yObs[i] - pred(xs[i])) ** 2;
    tss += (yObs[i] - my) ** 2;
  }
  return { rss, R2: 1 - rss / tss };
}

// The SAME 9 anchor windows as imp-33969 (kEnd = 11.00 .. 13.00 step 0.25).
const KENDS = [];
for (let k = 11; k <= 13 + 1e-9; k += 0.25) KENDS.push(+k.toFixed(2));
const SWEEP = KENDS.map(factors);
const RATIOS = SWEEP.map((r) => r.ratio);
const ATTEN = SWEEP.map((r) => r.attenuation);

// -- Part A: three-way growth-law tournament on the over-prediction ratio (original-scale RSS/R^2).
const LIN = ols(KENDS, RATIOS); // ratio = a + b*kEnd
const LIN_SCORE = scoreOriginal(KENDS, RATIOS, (x) => LIN.a + LIN.b * x);
const EXP = ols(KENDS, RATIOS.map(Math.log)); // ln ratio = a + b*kEnd
const EXP_SCORE = scoreOriginal(KENDS, RATIOS, (x) => Math.exp(EXP.a + EXP.b * x));
const POW = ols(KENDS.map(Math.log), RATIOS.map(Math.log)); // ln ratio = a + b*ln kEnd
const POW_SCORE = scoreOriginal(KENDS, RATIOS, (x) => Math.exp(POW.a + POW.b * Math.log(x)));

const TOURNAMENT = [
  { form: 'exponential', model: 'ratio = exp(a + b*kEnd)', a: +EXP.a.toFixed(4), b: +EXP.b.toFixed(4), perUnit: +Math.exp(EXP.b).toFixed(4), rss: +EXP_SCORE.rss.toExponential(4), R2: +EXP_SCORE.R2.toFixed(6) },
  { form: 'power', model: 'ratio = A*kEnd^b', a: +POW.a.toFixed(4), b: +POW.b.toFixed(4), perUnit: null, rss: +POW_SCORE.rss.toExponential(4), R2: +POW_SCORE.R2.toFixed(6) },
  { form: 'linear', model: 'ratio = a + b*kEnd', a: +LIN.a.toFixed(4), b: +LIN.b.toFixed(4), perUnit: null, rss: +LIN_SCORE.rss.toExponential(4), R2: +LIN_SCORE.R2.toFixed(6) },
].sort((p, q) => p.rss - q.rss);
const WINNER = TOURNAMENT[0].form; // exponential
const EXP_OVER_POW_RSS = +(POW_SCORE.rss / EXP_SCORE.rss).toFixed(2); // ~7.43x (power RSS bigger)
const EXP_OVER_LIN_RSS = +(LIN_SCORE.rss / EXP_SCORE.rss).toFixed(1); // ~230x (linear RSS bigger)

// -- Part B: log-linear fit of the attenuation collapse + finite-floor assessment.
const ATT_FIT = ols(KENDS, ATTEN.map(Math.log)); // ln att = a + b*kEnd
const ATT_PER_UNIT = +Math.exp(ATT_FIT.b).toFixed(6); // ~0.34623 -> = 1/ratio_perUnit

// Aitken/Shanks Delta^2 extrapolation of the attenuation sequence toward its asymptotic limit.
function aitken(seq) {
  const out = [];
  for (let i = 0; i + 2 < seq.length; i++) {
    const a0 = seq[i];
    const a1 = seq[i + 1];
    const a2 = seq[i + 2];
    const denom = a2 - a1 - (a1 - a0);
    out.push(a2 - ((a2 - a1) * (a2 - a1)) / denom);
  }
  return out;
}
const AITKEN = aitken(ATTEN);
const AITKEN_FLOOR = AITKEN[AITKEN.length - 1]; // ~ -1.75e-4 (approaches 0 from below -> no positive floor)

// 3-parameter plateau fit att = c + A*exp(b*kEnd): grid-search the floor c that best log-linearises att-c.
function bestFloor() {
  let best = null;
  const minAtt = Math.min(...ATTEN);
  for (let c = -minAtt; c < minAtt; c += minAtt / 2000) {
    const shifted = ATTEN.map((v) => v - c);
    if (shifted.some((v) => v <= 0)) continue;
    const f = ols(KENDS, shifted.map(Math.log));
    if (!best || f.R2 > best.R2) best = { c, R2: f.R2, b: f.b };
  }
  return best;
}
const PLATEAU = bestFloor();
const PLATEAU_FLOOR = PLATEAU.c; // ~ -8.13e-4 (NEGATIVE -> collapse continues to zero, no positive floor)
const HAS_FINITE_POSITIVE_FLOOR = AITKEN_FLOOR > 0 && PLATEAU_FLOOR > 0;

export const IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT = {
  id: 'imp-34041',
  proofSection: 'S-frontier',
  question:
    'imp-33969 R2 tabulated that the over-prediction factor F1/widening = 1/(F2*F3*F4) drifts ' +
    'monotonically 19.913 -> 165.351 across kEnd=11..13 (x8.30) with the attenuation F2*F3*F4 collapsing ' +
    '0.05022 -> 0.006048, but never fit its functional form. Fit a growth law to that drift on the same ' +
    '9 windows: is it power-law or exponential (or linear) in kEnd, scored by RSS/R^2? And does the ' +
    'attenuation collapse admit a finite asymptotic floor or continue to zero? Numerical/measurement ' +
    'only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'Part A: a three-way growth-law tournament on the over-prediction ratio 1/(F2*F3*F4) over kEnd = ' +
    '11.00..13.00 step 0.25 (9 windows, head fixed at k=6) -- linear (a+b*kEnd), exponential ' +
    '(exp(a+b*kEnd)) and power-law (A*kEnd^b), each scored by RSS and R^2 on the original scale so the ' +
    'forms compete fairly. Part B: a log-linear fit ln(attenuation) = a + b*kEnd, plus a finite-floor ' +
    'assessment via Aitken/Shanks Delta^2 extrapolation of the attenuation sequence and a 3-parameter ' +
    'plateau fit att = c + A*exp(b*kEnd) grid-searching the floor c.',
  anchorSweep: SWEEP.map((r) => ({ kEnd: r.kEnd, ratio: +r.ratio.toFixed(3), attenuation: +r.attenuation.toExponential(5) })),
  growthLawTournament: {
    ranked_by_rss: TOURNAMENT, // [exponential (winner), power, linear]
    winner: WINNER, // exponential
    exp_perUnit_kEnd_growth_factor: +Math.exp(EXP.b).toFixed(4), // ~2.888 (each decade of kEnd x2.89)
    exp_R2: +EXP_SCORE.R2.toFixed(6), // ~0.99962
    power_R2: +POW_SCORE.R2.toFixed(6), // ~0.99720
    linear_R2: +LIN_SCORE.R2.toFixed(6), // ~0.91311
    exp_rss_advantage_over_power: EXP_OVER_POW_RSS, // ~7.43x smaller RSS
    exp_rss_advantage_over_linear: EXP_OVER_LIN_RSS, // ~230x smaller RSS
  },
  attenuationFloor: {
    logLinearFit: { form: 'ln(attenuation) = a + b*kEnd', a: +ATT_FIT.a.toFixed(4), b: +ATT_FIT.b.toFixed(4), perUnitDecayFactor: ATT_PER_UNIT, R2: +ATT_FIT.R2.toFixed(8) }, // b~-1.0606, perUnit~0.34623, R2~0.99976
    aitken_limits: AITKEN.map((v) => +v.toExponential(4)), // negative, rising toward 0
    aitken_floor_estimate: +AITKEN_FLOOR.toExponential(5), // ~ -1.75e-4
    plateau_floor_estimate: +PLATEAU_FLOOR.toExponential(4), // ~ -8.13e-4 (negative)
    plateau_fit_R2: +PLATEAU.R2.toFixed(8), // ~0.99997
    has_finite_positive_floor: HAS_FINITE_POSITIVE_FLOOR, // false -- continues to zero
  },
  finding: {
    A_over_prediction_ratio_is_exponential_in_kEnd:
      'The over-prediction ratio 1/(F2*F3*F4) is EXPONENTIAL in kEnd, not power-law or linear. Scoring ' +
      'the ratio on the original scale over the 9 windows: exponential RSS ~ 7.41 (R^2 ~ 0.99962), ' +
      'power-law RSS ~ 55.04 (R^2 ~ 0.99720), linear RSS ~ 1707 (R^2 ~ 0.91311). Exponential wins ' +
      'decisively -- ~7.4x smaller RSS than power-law, ~230x smaller than linear -- with per-unit-kEnd ' +
      'growth factor exp(b) ~ 2.888. So the raw (log N)^3/N decay over-predicts the widening ' +
      'GEOMETRICALLY worse as the fit boundary recedes; the ~19.9x anchor is the base of an exponential.',
    B_attenuation_collapse_has_no_finite_positive_floor:
      'Equivalently the attenuation decays exponentially: ln(attenuation) = a + b*kEnd fits with b ~ ' +
      '-1.0606, per-unit factor exp(b) ~ 0.34623 (= 1/2.888), R^2 ~ 0.99976. It admits NO finite ' +
      'positive asymptotic floor: Aitken/Shanks Delta^2 extrapolation gives limits approaching 0 FROM ' +
      'BELOW (-4.52e-3 -> -1.75e-4) and a 3-parameter plateau fit selects a NEGATIVE floor c ~ -8.13e-4 ' +
      '(log-space R^2 ~ 0.99997). A negative floor is the extrapolator reporting a true limit of 0, so ' +
      'the collapse continues to zero -- consistent with the imp-34023 F4 -> 0 ratio divergence (capped ' +
      'only by the imp-33773 M2 residual sign change at kEnd ~ 21.3).',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / GROWTH-LAW MODEL SELECTION (frontier-direction, NOT rigorous). Fitting a growth law to ' +
    'the imp-33969 R2 over-prediction drift on the same 9 windows (kEnd = 11..13, identical inherited ' +
    'imp-3406/imp-33810 sub-terms, head fixed at k=6) establishes: (A) the over-prediction ratio ' +
    '1/(F2*F3*F4) is EXPONENTIAL in kEnd -- scored on the original scale, exponential RSS ~ 7.41 (R^2 ~ ' +
    '0.99962) beats power-law RSS ~ 55.04 (R^2 ~ 0.99720) by ~7.4x and linear RSS ~ 1707 (R^2 ~ 0.91311) ' +
    'by ~230x, with per-unit-kEnd growth factor exp(b) ~ 2.888; the ~19.9x anchor is the base of an ' +
    'exponential and the drift is geometric, not power-law or linear. (B) Equivalently the attenuation ' +
    'F2*F3*F4 decays exponentially (ln(attenuation) = a + b*kEnd, b ~ -1.0606, per-unit ~ 0.34623 = ' +
    '1/2.888, R^2 ~ 0.99976) and admits NO finite positive asymptotic floor: Aitken/Shanks Delta^2 ' +
    'extrapolation returns limits approaching 0 from below (-4.52e-3 -> -1.75e-4) and a 3-parameter ' +
    'plateau fit selects a NEGATIVE floor c ~ -8.13e-4 -- the extrapolator reporting a true limit of 0, ' +
    'so the collapse continues to zero, consistent with the imp-34023 F4 -> 0 ratio divergence capped ' +
    'only by the imp-33773 M2 residual sign change at kEnd ~ 21.3. The inherited imp-3220/imp-3406 ' +
    'component model is NOT a rigorous asymptotic; the growth-law fits and the floor extrapolation are ' +
    'descriptive within the model only; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33969 (the 9-window kEnd=11..13 over-prediction drift 19.913 -> 165.351 fit here); imp-34023 ' +
    '(the ln F4 log-linear fit + past-kEnd ratio divergence); imp-33922 (the fixed-kEnd=11 ~19.9x ' +
    'over-prediction); imp-33917 (the boundary sweep reused); imp-33884 (the exact widening + F1..F4 ' +
    'decomposition); imp-33810 (the quarter-decade rungs); imp-33773 (the M2 residual capping the ' +
    'surrogate at kEnd~21.3); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT_ASSERTIONS = [
  {
    // (A) Exponential wins the tournament decisively (smallest RSS, R^2 > 0.999) over the 9 windows.
    id: 'imp34041-over-prediction-ratio-is-exponential-winner',
    description: 'exponential wins by RSS: R2 > 0.999, per-unit ~2.888, RSS >7x smaller than power, >100x smaller than linear',
    holds: () =>
      SWEEP.length === 9 &&
      WINNER === 'exponential' &&
      EXP_SCORE.R2 > 0.999 &&
      Math.exp(EXP.b) > 2.8 &&
      Math.exp(EXP.b) < 3.0 &&
      EXP_OVER_POW_RSS > 5 &&
      EXP_OVER_LIN_RSS > 100,
  },
  {
    // Power-law and linear both fit worse on the original scale (power good, linear poor).
    id: 'imp34041-power-and-linear-lose-tournament',
    description: 'power R2 ~0.997 (loses to exp), linear R2 ~0.913 (clearly worst)',
    holds: () =>
      POW_SCORE.R2 > 0.99 &&
      POW_SCORE.R2 < EXP_SCORE.R2 &&
      LIN_SCORE.R2 < 0.95 &&
      LIN_SCORE.rss > POW_SCORE.rss &&
      POW_SCORE.rss > EXP_SCORE.rss,
  },
  {
    // (B) Attenuation decays exponentially and the ratio per-unit is exactly 1/attenuation per-unit.
    id: 'imp34041-attenuation-exponential-decay',
    description: 'ln(attenuation) log-linear R2 > 0.999, per-unit ~0.346 = 1/exp(EXP.b)',
    holds: () =>
      ATT_FIT.R2 > 0.999 &&
      ATT_PER_UNIT > 0.34 &&
      ATT_PER_UNIT < 0.35 &&
      Math.abs(ATT_PER_UNIT - 1 / Math.exp(EXP.b)) < 1e-4,
  },
  {
    // (B) No finite positive asymptotic floor: Aitken and plateau fit both drive the floor to 0/negative.
    id: 'imp34041-attenuation-no-finite-positive-floor',
    description: 'Aitken floor and plateau floor both <= 0 (approach zero from below); has_finite_positive_floor false',
    holds: () =>
      HAS_FINITE_POSITIVE_FLOOR === false &&
      AITKEN_FLOOR < 0 &&
      PLATEAU_FLOOR < 0 &&
      AITKEN_FLOOR > -1e-2,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp34041-honesty-gate-no-qed',
    description: 'Growth-law model selection only: isRigorous false, no QED, PT SOTA, imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.isRigorous === false &&
      /NO QED/.test(IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.verdict) &&
      /remains SOTA/.test(IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT.verdict),
  },
];

for (const a of IMP34041_EFLOW_WIDENING_RATIO_GROWTH_LAW_TOURNAMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34041-eflow-widening-ratio-growth-law-tournament assertion failed: ${a.id}`);
  }
}
