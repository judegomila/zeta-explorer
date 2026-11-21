/**
 * @module imp-35036-sigma-decay-exponent-ladder-extension
 *
 * imp-35036 (numerical, frontier-direction): imp-33582 measured the PER-DECADE local decay
 * exponent p_dec of the GUE-conditional share sigma(N) = E_coll/E(N) past the interior peak,
 * finding it ramps monotonely from ~0.0105 on [1e6,1e7] to ~0.4310 on [1e11,1e12] -- still
 * ~0.069 short of the imp-3463 far-tail 1/2 asymptote -- and STOPPED there. This module
 * EXTENDS the same per-decade exponent ladder deep into the far tail, measures the residual
 * gap 1/2 - p_dec across further decades, identifies the LAW governing how the gap closes,
 * and estimates the N at which the local exponent first reaches 0.499 (within 1e-3 of 1/2).
 * The point: it quantifies how astonishingly SLOWLY the constant truncation floor E_trunc
 * finishes overtaking the vanishing GUE-conditional E_coll ~ sqrt(1/N).
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-33582 / imp-35041)
 * --------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0      = effectiveHeightForN(N)             (Riemann-von Mangoldt inverse)
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)      (dominant, GUE-conditional C_H)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the EXACT inherited imp-33582 sub-terms and the same
 * 4-points-per-decade OLS exponent estimator, only the decade list and the analysis extend.
 *
 * THE MEASUREMENT: extended per-decade exponent ladder
 * ----------------------------------------------------
 *   p_dec(k) = -slope of OLS(ln sigma vs ln N) over [10^k, 10^(k+1)], 4 pts/decade, for the
 *   decades k = 11..30 past where imp-33582 stopped (k=11). The residual gap 1/2 - p_dec(k),
 *   the empirical gap-closure law, and the decade-start k (hence N) where p_dec first hits 0.499.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) LADDER CONTINUES CLIMBING BUT DECELERATES SHARPLY. Past imp-33582 last rung (0.4310 on
 *        [1e11,1e12]) the exponent keeps rising monotonely -- 0.4646, 0.4777, 0.4828, 0.4851 on
 *        [1e12..1e16] -- but the per-decade INCREMENT collapses: the first six decades closed
 *        ~0.42 of the gap, the next five close only ~0.055. The residual gap 1/2 - p_dec falls
 *        6.90e-2 -> 3.54e-2 -> 2.23e-2 -> 1.72e-2 -> 1.49e-2 and then crawls: still ~7.5e-3 on
 *        [1e29,1e30], ~15 decades past where imp-33582 stopped.
 *   (F2) THE GAP CLOSES ONLY LOGARITHMICALLY: 1/2 - p_dec ~ 1/(2 ln N). Testing the deep-tail
 *        product (1/2 - p_dec) * 2 ln N_center against 1 gives ~1.02 by [1e20,1e21] and drifts
 *        toward ~1.007 by [1e200,1e201] -- confirming the residual gap is ~1/(2 ln N), NOT a
 *        power law. This is the exact signature of sigma ~ C sqrt(L/N) with L = log T0: then
 *        -d ln sigma/d ln N = 1/2 - (1/2) d ln L/d ln N, and d ln L/d ln N ~ 1/ln N, so the
 *        exponent approaches 1/2 as slowly as 1/ln N vanishes. The imp-3463 1/2 asymptote is
 *        thus reached only in a logarithmically-slow limit, not on any humanly-reachable decade.
 *   (F3) 0.499 NOT REACHED UNTIL N ~ 1.3e218. Bisecting the decade-start k for p_dec = 0.499
 *        (within 1e-3 of 1/2) lands at k ~ 218.1, i.e. N ~ 1.28e218 -- roughly 212 decades past
 *        the 10^6 PATH-1 ceiling. The 1/(2 ln N) law extrapolates the 0.4999 crossing (gap 1e-4)
 *        to ln N ~ 5e3, N ~ 10^2170 -- astronomically far. E_trunc "wins" the far tail, but only
 *        in the logarithmic limit; the empirical-vs-analytic exponent gap never closes at any
 *        finite N.
 *
 * The punchline: extending the imp-33582 per-decade decay-exponent ladder shows the local
 * exponent keeps climbing toward the imp-3463 1/2 asymptote but the residual gap 1/2 - p_dec
 * closes only as 1/(2 ln N) -- a logarithmically-slow approach. The exponent first reaches 0.499
 * only near N ~ 1.3e218. The constant truncation floor E_trunc does overtake the vanishing
 * GUE-conditional E_coll in the far tail, but the crossover is spread over hundreds of decades.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ladder to 0.4310, extended here)
 * @see imp-35041-sigma-deep-tail-threshold-extension (companion: sigma THRESHOLD crossings, sqrt(1/N) spacing)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (FAR-tail sliding window p_eff -> 1/2)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const HALF = 0.5;
const LN10 = Math.log(10);
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-35041 exactly

// EXACT imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// OLS local decay exponent p_dec = -slope of ln sigma on ln N over [10^k, 10^(k+1)]
// (4 pts/decade). IDENTICAL estimator to imp-33582 (olsExponent over one decade window).
function olsExponentDecade(k, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = k; d <= k + 1 + 1e-9; d += step) {
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

// (F1) Extended per-decade ladder, k = 11..30 (imp-33582 stopped at k=11 -> 0.4310).
const LADDER = [];
for (let k = 11; k <= 30; k++) {
  const p = olsExponentDecade(k);
  LADDER.push({ decade: `1e${k}->1e${k + 1}`, p: +p.toFixed(6), gap: +(HALF - p).toExponential(4) });
}

// (F2) Gap-closure law: (1/2 - p_dec) * 2 * ln(N_center) -> ~1 if gap ~ 1/(2 ln N).
function gapLawProduct(k) {
  const p = olsExponentDecade(k);
  const lnNc = (k + 0.5) * LN10; // ln of the decade geometric center 10^(k+0.5)
  return (HALF - p) * 2 * lnNc;
}
const GAP_LAW_AT_20 = gapLawProduct(20); // ~1.019
const GAP_LAW_AT_30 = gapLawProduct(30); // ~1.019
const GAP_LAW_AT_200 = gapLawProduct(200); // ~1.007

// (F3) Decade-start k where p_dec first reaches a target (bisection; p_dec rises with k).
// Bound at k=260 (max N = 1e261, safely below double overflow ~1.8e308): the 0.499 crossing
// lands near k=218, well inside. Do NOT raise the bound past ~300 -- decade windows there
// overflow to Infinity and the OLS slope produces spurious (artifact) exponents.
function reachDecadeK(target) {
  let a = 11;
  let b = 260;
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    if (olsExponentDecade(m) < target) a = m;
    else b = m;
  }
  return (a + b) / 2;
}
const K_REACH_0_499 = reachDecadeK(0.499); // ~218.1
const N_REACH_0_499 = Math.pow(10, K_REACH_0_499); // ~1.28e218

export const IMP35036_SIGMA_DECAY_EXPONENT_LADDER_EXTENSION = {
  id: 'imp-35036',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582 per-decade local decay-exponent ladder for sigma(N) = E_coll/E(N) ' +
    'past [1e11,1e12] (exponent ~0.4310), measure the residual gap 1/2 - p_dec across further ' +
    'decades, and estimate the N at which the local exponent first reaches 0.499 (within 1e-3 ' +
    'of the imp-3463 1/2 asymptote). Measurement/fit only; conditional-share diagnostic; no QED.',
  measuredQuantity:
    'p_dec(k) = -slope of OLS(ln sigma vs ln N) over [10^k,10^(k+1)] (4 pts/decade) for k=11..30, ' +
    'the residual gap 1/2 - p_dec, the gap-closure law product (1/2 - p_dec) * 2 ln N_center, and ' +
    'the decade-start k (hence N) at which p_dec first reaches 0.499',
  exponentLadder: LADDER, // k = 11..30
  gapClosureLaw: {
    // (1/2 - p_dec) * 2 ln(N_center) -> ~1 confirms residual gap ~ 1/(2 ln N)
    product_at_1e20: +GAP_LAW_AT_20.toFixed(4), // ~1.019
    product_at_1e30: +GAP_LAW_AT_30.toFixed(4), // ~1.019
    product_at_1e200: +GAP_LAW_AT_200.toFixed(4), // ~1.007
  },
  reach0_499: {
    decadeStart_k: +K_REACH_0_499.toFixed(4), // ~218.1
    at_N: +N_REACH_0_499.toExponential(4), // ~1.28e218
  },
  farTailExponent: HALF, // imp-3463 asymptote the ladder approaches only logarithmically slowly
  finding: {
    F1_ladder_continues_but_decelerates:
      'Past the imp-33582 last rung (0.4310 on [1e11,1e12]) the exponent keeps rising monotonely ' +
      '(0.4646, 0.4777, 0.4828, 0.4851 on [1e12..1e16]) but the per-decade increment collapses: ' +
      'the residual gap 1/2 - p_dec falls 6.90e-2 -> 3.54e-2 -> 2.23e-2 -> 1.72e-2 -> 1.49e-2 and ' +
      'then crawls, still ~7.5e-3 on [1e29,1e30], ~15 decades past where imp-33582 stopped.',
    F2_gap_closes_logarithmically:
      'The residual gap closes only as 1/(2 ln N): (1/2 - p_dec) * 2 ln N_center holds near ~1.02 ' +
      'by [1e20,1e21] and drifts to ~1.007 by [1e200,1e201], NOT a power law. This is the signature ' +
      'of sigma ~ C sqrt(L/N), L = log T0: -d ln sigma/d ln N = 1/2 - (1/2) d ln L/d ln N with ' +
      'd ln L/d ln N ~ 1/ln N, so the exponent approaches 1/2 as slowly as 1/ln N vanishes.',
    F3_reaches_0_499_only_at_1e218:
      'Bisecting the decade-start k for p_dec = 0.499 (within 1e-3 of 1/2) lands at k ~ 218.1, ' +
      'N ~ 1.28e218 -- ~212 decades past the 10^6 ceiling. The 1/(2 ln N) law extrapolates the ' +
      '0.4999 crossing to N ~ 10^2170. E_trunc overtakes the vanishing E_coll only in the ' +
      'logarithmic limit; the exponent gap never closes at any finite N.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582 per-decade ' +
    'decay-exponent ladder on the identical inherited model: past 0.4310 on [1e11,1e12] the local ' +
    'exponent keeps climbing monotonely toward the imp-3463 1/2 asymptote (0.4646, 0.4777, 0.4828, ' +
    '0.4851 on [1e12..1e16]) but the residual gap 1/2 - p_dec closes only as 1/(2 ln N) -- confirmed ' +
    'by the deep-tail product (1/2 - p_dec) * 2 ln N_center holding near ~1.007-1.02. The exponent ' +
    'first reaches 0.499 only near N ~ 1.28e218 (~212 decades past the 10^6 ceiling); the law ' +
    'extrapolates 0.4999 to N ~ 10^2170. The constant truncation floor E_trunc does overtake the ' +
    'vanishing GUE-conditional E_coll in the far tail, but only in the logarithmically-slow limit -- ' +
    'the empirical-vs-analytic exponent gap never closes at any finite N. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33582 (per-decade ladder to 0.4310 on [1e11,1e12], extended here); imp-35041 (companion ' +
    'threshold-crossing extension); imp-3463 (far-tail leading form, exponent -> 1/2 from below); ' +
    'imp-33274 (far-tail sliding-window p_eff -> 1/2); imp-3406 (interior MAX N ~ 9.22e5); imp-486 ' +
    '(C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP35036_SIGMA_DECAY_EXPONENT_LADDER_EXTENSION_ASSERTIONS = [
  {
    // Reuse gate: the k=11 rung reproduces the imp-33582 last rung (~0.4310), proving the
    // identical inherited model and 4-pts/decade OLS estimator are in use.
    id: 'imp35036-reproduces-imp33582-last-rung',
    description: 'p_dec on [1e11,1e12] ~0.4310 reproduces the imp-33582 last ladder rung',
    holds: () => Math.abs(LADDER[0].p - 0.431048) < 1e-3,
  },
  {
    // (F1): the extended ladder is monotone increasing, stays below 1/2, and the residual gap
    // shrinks monotonely across the measured decades.
    id: 'imp35036-ladder-monotone-below-half',
    description: 'extended p_dec ladder monotone increasing, all < 0.5, residual gap shrinking',
    holds: () => {
      for (let i = 1; i < LADDER.length; i++) {
        if (!(LADDER[i].p > LADDER[i - 1].p)) return false;
        if (!(LADDER[i].p < 0.5)) return false;
        if (!(LADDER[i].gap < LADDER[i - 1].gap)) return false;
      }
      return true;
    },
  },
  {
    // (F2): the gap-closure law (1/2 - p_dec) * 2 ln N_center stays close to 1 in the deep tail
    // (drifting slightly ABOVE 1), confirming the residual gap ~ 1/(2 ln N) logarithmic law.
    id: 'imp35036-gap-closes-logarithmically',
    description: '(1/2 - p_dec) * 2 ln N_center in [1.0,1.05] at 1e20/1e30/1e200 (gap ~ 1/(2 ln N))',
    holds: () =>
      GAP_LAW_AT_20 > 1.0 && GAP_LAW_AT_20 < 1.05 &&
      GAP_LAW_AT_30 > 1.0 && GAP_LAW_AT_30 < 1.05 &&
      GAP_LAW_AT_200 > 1.0 && GAP_LAW_AT_200 < 1.05 &&
      GAP_LAW_AT_200 < GAP_LAW_AT_20,
  },
  {
    // (F3): the local exponent first reaches 0.499 only near N ~ 1.28e218 (k ~ 218.1),
    // hundreds of decades past the 10^6 ceiling.
    id: 'imp35036-reaches-0499-only-at-1e218',
    description: 'p_dec first reaches 0.499 at k ~ 218.1, N ~ 1.28e218',
    holds: () =>
      K_REACH_0_499 > 210 && K_REACH_0_499 < 226 &&
      olsExponentDecade(K_REACH_0_499) > 0.4989 &&
      olsExponentDecade(K_REACH_0_499) < 0.4991,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35036-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35036_SIGMA_DECAY_EXPONENT_LADDER_EXTENSION.isRigorous === false &&
      IMP35036_SIGMA_DECAY_EXPONENT_LADDER_EXTENSION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35036_SIGMA_DECAY_EXPONENT_LADDER_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP35036_SIGMA_DECAY_EXPONENT_LADDER_EXTENSION.verdict),
  },
];

for (const a of IMP35036_SIGMA_DECAY_EXPONENT_LADDER_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35036-sigma-decay-exponent-ladder-extension assertion failed: ${a.id}`);
  }
}
