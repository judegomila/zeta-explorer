/**
 * imp-34245 -- The DIVERGENCE-RATE LAW of the imp-34189 bisected M2-ceiling crossing
 * kEnd*(w) as the fitting-window width w -> 0: logarithmic, not power-law.
 *
 * imp-34189 recorded that the bisected M2-residual sign-change crossing kEnd* rises MONOTONICALLY
 * as the fitting window narrows (kEnd* ~ 21.28, 21.73, 22.30, 23.17, 23.94 at w = 1, 3/4, 1/2,
 * 1/4, 1/8 decades) with NO w -> 0 limit, but never FIT that divergence. This module regresses the
 * recorded ladder against w to decide whether the blow-up is power-law (kEnd* ~ c w^-p) or
 * logarithmic (kEnd* ~ a - b ln w), reports the fitted exponent/rate, and connects it to the O(1)
 * expansion parameter e*D ~ 1.13 that imp-34189 identified as the reason the Taylor-in-D series does
 * not converge.
 *
 * THE FIT -- LOGARITHMIC WINS.
 *   Regressing the recorded 5-rung ladder both ways:
 *     LOG:  kEnd* = a - b ln w  gives a ~ 21.35, b ~ 1.273, R^2 ~ 0.9966;
 *     POW:  kEnd* = c w^-p      gives c ~ 21.37, p ~ 0.0563, R^2 (in k-space) ~ 0.9944.
 *   The logarithmic law fits better (higher R^2, ~40% lower sum-of-squared residuals) and -- more
 *   tellingly -- the power-law exponent p ~ 0.056 is so tiny that w^-p is itself indistinguishable
 *   from -p ln w = a mild logarithm over the measured range. There is no genuine power-law blow-up;
 *   the crossing recedes only LOGARITHMICALLY slowly as the window shrinks.
 *
 * THE ASYMPTOTIC RATE b_inf -> ~1 (one decade per e-fold).
 *   Extending the ladder (recomputed here down to w = 1/64, where the 5-point bisection is still
 *   numerically clean) shows the LOCAL logarithmic rate dk/d(ln w) is NOT constant: it decays
 *   monotonically from ~1.57 (between w = 1 and 3/4) through ~1.12 (w ~ 1/8..1/16) toward ~1.00
 *   near w ~ 1/64. So the whole-window OLS rate b ~ 1.14..1.27 is a range-average of a slope that
 *   settles to an asymptotic b_inf ~ 1: in the deep tail kEnd* ~ const - ln w, i.e. the crossing
 *   recedes by ONE decade in N per e-fold narrowing of the window. (Below w ~ 1/128 the 5-point OLS
 *   over a sub-percent-decade window loses floating-point resolution and the bisection destabilizes,
 *   so b_inf ~ 1 is read at the edge of numerical reach, not proven to be exactly 1.)
 *
 * THE CONNECTION TO e*D ~ 1.13.
 *   That the recession is merely LOGARITHMIC -- not power-law -- is the direct signature of the O(1),
 *   NON-shrinking expansion parameter e*D ~ 1.13 that imp-34189 flagged: a power-law blow-up
 *   kEnd* ~ w^-p with p bounded away from 0 would require an expansion parameter that GROWS as the
 *   window shrinks, whereas e*D stays O(1). The whole-window rate b ~ 1.14 (on the extended ladder)
 *   sits essentially AT e*D ~ 1.13, and the deep-tail rate b_inf ~ 1 is the pure one-decade-per-e-fold
 *   recession of a finite-D discretization estimator that has no continuous limit to converge to
 *   (the continuous residual is identically zero, per imp-34127/imp-34189). The 21.281 full-decade
 *   reading is therefore the finite-D value of a slowly (logarithmically) diverging, not converging,
 *   crossing -- reinforcing imp-34189: quote the ceiling directly from the bisection.
 *
 * Measurement/fit within the inherited imp-3406/imp-33810 component model only; the component model
 * is NOT a rigorous asymptotic; no bound changes; no operator positivity; C_mb GUE-conditional per
 * imp-486 untouched; imp-3066 K_a >= 0 untouched; no refereed bound is changed. NO QED.
 *
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (the recorded window-width ladder fit here)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (leading closed form kEnd* ~ 21.00)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (bisected kEnd* ~ 21.281)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (the widening-slope limit b_inf ~ -1 cohort partner)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127
 * (leading closed form) -> imp-34189 (next-order term + window-width divergence ladder) -> imp-34245
 * (this module: the ladder fit -- logarithmic, b_inf~1) -> imp-34188 (widening-slope limit b_inf~-1).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34127/imp-34189 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34189 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// 5-point OLS sigma exponent over a window of width w decades starting at k -- verbatim from imp-34189.
function olsSigmaExponentW(k, w, pts = 5) {
  const step = w / (pts - 1);
  const xs = [];
  const ys = [];
  for (let i = 0; i < pts; i++) {
    const N = Math.pow(10, k + i * step);
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
function ecollExponentMagW(k, w) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + w);
  return -Math.log(parts(hi).E_coll / parts(lo).E_coll) / Math.log(hi / lo);
}
function residAtW(k, w) {
  const pSigma = olsSigmaExponentW(k, w);
  const pEcoll = ecollExponentMagW(k, w);
  const ph = parts(Math.pow(10, k + w));
  return pEcoll * (1 - ph.sigma) - pSigma;
}
function bisectCrossing(residFn, lo0, hi0) {
  let lo = lo0;
  let hi = hi0;
  if (residFn(lo) <= 0 || residFn(hi) >= 0) return NaN;
  for (let i = 0; i < 90; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// One-variable OLS y = intercept + slope*x, returning R^2 in y-space.
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
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssr = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssr += (ys[i] - pred) ** 2;
  }
  return { slope, intercept, r2: 1 - ssr / syy, ssr };
}

// --- THE RECORDED imp-34189 LADDER (widths in decades; kEnd* reproduced by bisection) ---
const RECORDED_WIDTHS = [1, 0.75, 0.5, 0.25, 0.125];
const RECORDED_LADDER = RECORDED_WIDTHS.map((w) => ({
  wDecades: w,
  kEndStar: +bisectCrossing((k) => residAtW(k, w), 15, 28).toFixed(4),
}));

const lnW = RECORDED_LADDER.map((r) => Math.log(r.wDecades));
const kEnd = RECORDED_LADDER.map((r) => r.kEndStar);
const lnK = RECORDED_LADDER.map((r) => Math.log(r.kEndStar));

// LOG model: kEnd* = a - b ln w  (regress kEnd* on ln w; b = -slope).
const LOG_FIT = ols(lnW, kEnd);
const LOG_A = +LOG_FIT.intercept.toFixed(4);
const LOG_B = +(-LOG_FIT.slope).toFixed(4); // ~1.273 per e-fold narrowing
const LOG_R2 = +LOG_FIT.r2.toFixed(6);

// POWER model: kEnd* = c w^-p  (regress ln kEnd* on ln w; p = -slope), R^2 re-measured in k-space.
const POW_FIT = ols(lnW, lnK);
const POW_C = +Math.exp(POW_FIT.intercept).toFixed(4);
const POW_P = +(-POW_FIT.slope).toFixed(4); // ~0.056 -- a would-be exponent so small w^-p ~ mild log
let powSSRk = 0;
let sstK = 0;
const meanK = kEnd.reduce((a, b) => a + b, 0) / kEnd.length;
for (let i = 0; i < RECORDED_LADDER.length; i++) {
  const pred = Math.exp(POW_FIT.intercept + POW_FIT.slope * lnW[i]);
  powSSRk += (kEnd[i] - pred) ** 2;
  sstK += (kEnd[i] - meanK) ** 2;
}
const POW_R2K = +(1 - powSSRk / sstK).toFixed(6);

// LOG beats POWER? (higher R^2 AND lower SSR in k-space).
const LOG_BEATS_POWER = LOG_R2 > POW_R2K && LOG_FIT.ssr < powSSRk;

// --- ASYMPTOTIC RATE: local dk/d(ln w) on the extended ladder (w down to 1/64, numerically clean) ---
const EXT_WIDTHS = [1, 0.75, 0.5, 0.25, 0.125, 0.0625, 0.03125, 0.015625];
const EXT_LADDER = EXT_WIDTHS.map((w) => ({
  wDecades: w,
  kEndStar: +bisectCrossing((k) => residAtW(k, w), 15, 30).toFixed(6),
}));
const LOCAL_RATES = [];
for (let i = 1; i < EXT_LADDER.length; i++) {
  const dk = EXT_LADDER[i].kEndStar - EXT_LADDER[i - 1].kEndStar;
  const dlnw = Math.log(EXT_LADDER[i].wDecades) - Math.log(EXT_LADDER[i - 1].wDecades);
  LOCAL_RATES.push({
    wFrom: EXT_LADDER[i - 1].wDecades,
    wTo: EXT_LADDER[i].wDecades,
    rate: +(-dk / dlnw).toFixed(4),
  });
}
const B_INF_ESTIMATE = LOCAL_RATES[LOCAL_RATES.length - 1].rate; // deepest reliable local rate ~1.00
const RATE_DECAYS_TOWARD_ONE =
  LOCAL_RATES[0].rate > 1.4 && Math.abs(B_INF_ESTIMATE - 1) < 0.1 &&
  LOCAL_RATES.every((r, i) => i === 0 || r.rate <= LOCAL_RATES[i - 1].rate + 1e-9);

// Whole-window rate on the extended ladder (brackets e*D ~ 1.13).
const EXT_FIT = ols(EXT_LADDER.map((r) => Math.log(r.wDecades)), EXT_LADDER.map((r) => r.kEndStar));
const EXT_B = +(-EXT_FIT.slope).toFixed(4); // ~1.14 -- essentially e*D
const E_D = 1.13; // imp-34189 expansion parameter e*D = e*ln10 ~ 1.13 at the crossing (e ~ 0.490)

export const IMP34245_M2_CEILING_WINDOW_WIDTH_DIVERGENCE_LAW = {
  id: 'imp-34245',
  proofSection: 'S-frontier',
  question:
    'imp-34189 recorded that the bisected M2-residual sign-change crossing kEnd* rises monotonically ' +
    'as the fitting window narrows (kEnd* ~ 21.28, 21.73, 22.30, 23.17, 23.94 at w = 1, 3/4, 1/2, 1/4, ' +
    '1/8 decades) with NO w -> 0 limit, but never FIT that divergence. Regress kEnd* against w to decide ' +
    'whether the blow-up is power-law (kEnd* ~ c w^-p) or logarithmic (kEnd* ~ a - b ln w), report the ' +
    'fitted exponent/rate, and connect it to the O(1) expansion parameter e*D ~ 1.13. Fit only; NO QED.',
  measuredQuantity:
    'The power-law-vs-logarithmic goodness-of-fit on the recorded imp-34189 window-width ladder, the ' +
    'fitted logarithmic rate b and would-be power exponent p, the asymptotic local rate dk/d(ln w) as ' +
    'w -> 0 on an extended (w down to 1/64) ladder, and the connection of the rate to e*D ~ 1.13.',
  recordedLadder: RECORDED_LADDER,
  logFit: { a: LOG_A, b: LOG_B, r2: LOG_R2 }, // kEnd* = a - b ln w
  powerFit: { c: POW_C, p: POW_P, r2_kspace: POW_R2K }, // kEnd* = c w^-p
  logBeatsPower: LOG_BEATS_POWER,
  extendedLadder: EXT_LADDER,
  localRates: LOCAL_RATES,
  bInfEstimate: B_INF_ESTIMATE, // deepest reliable local rate ~1.00 (one decade per e-fold)
  wholeWindowRateExtended: EXT_B, // ~1.14 -- essentially at e*D
  expansionParameterED: E_D, // ~1.13 (imp-34189)
  finding: {
    A_divergence_is_logarithmic:
      'The recorded ladder is fit better by kEnd* = a - b ln w (a ~ ' + LOG_A + ', b ~ ' + LOG_B +
      ', R^2 ~ ' + LOG_R2 + ') than by kEnd* = c w^-p (c ~ ' + POW_C + ', p ~ ' + POW_P + ', R^2 ~ ' +
      POW_R2K + ' in k-space): higher R^2 and ~40% lower squared-residual. The would-be power exponent ' +
      'p ~ ' + POW_P + ' is so tiny that w^-p is indistinguishable from a mild logarithm over the range; ' +
      'the crossing recedes only LOGARITHMICALLY slowly, with no power-law blow-up.',
    B_asymptotic_rate_approaches_one:
      'Extending the ladder to w = 1/64 (still numerically clean) shows the LOCAL rate dk/d(ln w) is not ' +
      'constant: it decays monotonically from ~' + LOCAL_RATES[0].rate + ' (w = 1 -> 3/4) toward ~' +
      B_INF_ESTIMATE + ' near w = 1/64. So the whole-window OLS rate b ~ ' + LOG_B + ' (5 rungs) / ~' +
      EXT_B + ' (8 rungs) is a range-average settling to an asymptotic b_inf ~ 1: in the deep tail ' +
      'kEnd* ~ const - ln w, i.e. one decade of recession per e-fold narrowing. Below w ~ 1/128 the ' +
      '5-point OLS loses floating-point resolution, so b_inf ~ 1 is read at the edge of numerical reach.',
    C_connection_to_expansion_parameter:
      'A merely LOGARITHMIC (not power-law) recession is the signature of the O(1), non-shrinking ' +
      'expansion parameter e*D ~ ' + E_D + ' from imp-34189: a power-law kEnd* ~ w^-p with p bounded ' +
      'away from 0 would need an expansion parameter that GROWS as the window shrinks, whereas e*D stays ' +
      'O(1). The whole-window rate b ~ ' + EXT_B + ' sits essentially AT e*D ~ ' + E_D + ', and the ' +
      'deep-tail b_inf ~ 1 is the pure one-decade-per-e-fold recession of a finite-D discretization ' +
      'estimator with no continuous limit -- reinforcing imp-34189 that the 21.281 ceiling is best ' +
      'quoted directly from the full-decade bisection.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / FIT (frontier-direction, NOT rigorous). The imp-34189 window-width divergence of the ' +
    'M2-ceiling crossing kEnd*(w) is LOGARITHMIC, not power-law: the recorded ladder fits kEnd* = a - b ' +
    'ln w (a ~ ' + LOG_A + ', b ~ ' + LOG_B + ', R^2 ~ ' + LOG_R2 + ') better than kEnd* = c w^-p ' +
    '(p ~ ' + POW_P + ', R^2 ~ ' + POW_R2K + '), and the would-be power exponent is so tiny it is ' +
    'itself just a mild logarithm. The local rate dk/d(ln w) decays from ~' + LOCAL_RATES[0].rate +
    ' toward ~' + B_INF_ESTIMATE + ' as w -> 1/64, so the asymptotic rate b_inf ~ 1 (one decade of ' +
    'recession per e-fold narrowing), while the whole-window rate b ~ ' + EXT_B + ' brackets the O(1) ' +
    'expansion parameter e*D ~ ' + E_D + '. That the recession is only logarithmic is the direct ' +
    'signature of that non-shrinking e*D: the crossing has no w -> 0 limit but diverges slowly, so the ' +
    'full-decade 21.281 is the finite-D reading of a logarithmically-diverging (not converging) ' +
    'crossing, best quoted from the bisection. The inherited component model is NOT a rigorous ' +
    'asymptotic; this is descriptive within the model only; changes no bound; establishes no operator ' +
    'positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34189 (the recorded window-width ladder, fit here); imp-34127 (leading closed form kEnd* ~ ' +
    '21.00); imp-34023 (bisected kEnd* ~ 21.281); imp-34188 (widening-slope limit b_inf ~ -1, cohort ' +
    'partner); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34245_M2_CEILING_WINDOW_WIDTH_DIVERGENCE_LAW_ASSERTIONS = [
  {
    // (A) The recorded ladder reproduces the imp-34189 rungs to within rounding.
    id: 'imp34245-recorded-ladder-reproduces-imp34189',
    description: 'the recorded window-width ladder reproduces imp-34189 {21.28,21.73,22.30,23.17,23.94}',
    holds: () => {
      const ref = [21.2809, 21.7314, 22.3036, 23.1663, 23.9426];
      return RECORDED_LADDER.every((r, i) => Math.abs(r.kEndStar - ref[i]) < 0.01);
    },
  },
  {
    // (B) The logarithmic model out-fits the power-law model on the recorded ladder.
    id: 'imp34245-logarithmic-beats-power-law',
    description: 'kEnd* = a - b ln w fits the recorded ladder better than kEnd* = c w^-p (higher R^2)',
    holds: () => LOG_BEATS_POWER && LOG_R2 > 0.99 && POW_R2K > 0.99,
  },
  {
    // (C) The fitted logarithmic rate b is O(1), in the 1..1.4 band bracketing e*D ~ 1.13.
    id: 'imp34245-log-rate-order-one',
    description: 'the fitted logarithmic rate b ~ 1.27 (5-rung) is O(1), bracketing e*D ~ 1.13',
    holds: () => LOG_B > 1.0 && LOG_B < 1.4,
  },
  {
    // (D) The would-be power exponent p is tiny (< 0.1): no genuine power-law blow-up.
    id: 'imp34245-power-exponent-tiny',
    description: 'the would-be power exponent p ~ 0.056 is < 0.1 (indistinguishable from a mild log)',
    holds: () => POW_P > 0 && POW_P < 0.1,
  },
  {
    // (E) The local rate decays monotonically from >1.4 toward ~1 as the window narrows.
    id: 'imp34245-local-rate-decays-toward-one',
    description: 'the local rate dk/d(ln w) decays from >1.4 toward b_inf ~ 1 as w -> 1/64',
    holds: () => RATE_DECAYS_TOWARD_ONE,
  },
  {
    // (F) The whole-window rate on the extended ladder sits essentially at e*D ~ 1.13.
    id: 'imp34245-whole-window-rate-brackets-eD',
    description: 'the extended-ladder whole-window rate b ~ 1.14 is within 0.1 of e*D ~ 1.13',
    holds: () => Math.abs(EXT_B - E_D) < 0.1,
  },
];
