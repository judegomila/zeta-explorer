/**
 * @module imp-33255-sigma-postpeak-regime-effective-exponent
 *
 * imp-33255 (numerical, frontier-direction): imp-3406 pinned the imp-3220 conditional
 * share sigma(N) = E_coll(N)/E(N) to an interior MAXIMUM at N_max ~ 9.219e5
 * (sigma_max ~ 0.949429) and asserted it then decays MONOTONELY to 0; imp-3529 measured
 * the LOCAL pointwise decay exponent p(N) = -d ln sigma/d ln N climbing from ~0 at the
 * flat cap to 1/2 on the far tail, and (correctly) concluded the whole post-peak arm is
 * NOT a single power law. What imp-3529 explicitly did NOT do -- and what the roadmap
 * asks for -- is to FIT a single decay-rate exponent to the specific regime the ticket
 * names: the E_trunc-OUTLIVES-E_coll regime, i.e. N past the imp-3444 E_coll = E_trunc
 * crossover (N ~ 3.28e9), where the constant truncation floor dominates the vanishing
 * GUE-conditional collision term. This module performs that ordinary-least-squares
 * power-law fit and quantifies how well a SINGLE exponent describes the regime.
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-3463 / imp-3529)
 * ------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * The crossover N_cross is where E_coll = E_trunc (E_coll/E_trunc = 1, sigma ~ 1/2).
 * For N > N_cross the constant floor E_trunc OUTLIVES E_coll (E_coll/E_trunc < 1), so
 * sigma ~ E_coll/E_trunc ~ (C_C/E_trunc) sqrt(logT0/N): a near-pure sqrt(1/N) law up to
 * the slow logT0 factor -- exactly the regime a single fitted exponent can summarise.
 *
 * THE MEASUREMENT: a single OLS effective exponent per fit window
 * --------------------------------------------------------------
 * Over a window [N_cross, N_cross * 10^M] sampled uniformly in log10 N (4 points/decade),
 * regress ln sigma on ln N; the negative slope is the effective decay exponent p_eff(M)
 * and R^2 measures how well one power law fits. Because the LOCAL exponent still drifts
 * upward inside the regime (imp-3529), p_eff(M) is NOT constant -- it rises with the
 * window span M toward the imp-3463 far-tail value 1/2. Reporting p_eff(M) AND its R^2
 * therefore both (i) hands the roadmap the single "decay-rate exponent of the
 * E_trunc-outlives-E_coll regime" it asked for and (ii) certifies honestly that this
 * single number is window-dependent (there is no exact single power law), consistent
 * with imp-3529.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) SINGLE-EXPONENT FIT. Over the E_trunc-outlives-E_coll regime the OLS effective
 *        exponent p_eff climbs with window span: ~0.390 over the first 3 decades past the
 *        crossover, ~0.444 over 6, ~0.473 over 12, ~0.486 over 24 -- all BELOW and rising
 *        toward the imp-3463 asymptote 1/2, matching the sqrt(logT0/N) leading form.
 *   (F2) GOODNESS OF FIT. R^2 is high and INCREASES with window span (~0.9935 at 3 decades
 *        -> ~0.9998 at 24), so the regime is described increasingly well by a single power
 *        law the further out one looks -- the residual drift is concentrated just past the
 *        crossover where the local exponent is still ramping.
 *   (F3) CONTRAST WITH THE PRE-CROSSOVER ARM. Fitting instead the E_coll-DOMINANT arm from
 *        the peak to the crossover (N_max..N_cross) gives a much SMALLER effective exponent
 *        (~0.070) with a POOR single-law fit (R^2 ~ 0.84), confirming a single exponent is
 *        only meaningful ONCE E_trunc outlives E_coll -- exactly the regime the ticket names.
 *
 * The punchline: the roadmap's qualitative "sigma decays monotonically toward 0 past the
 * peak" is now backed, in the specific E_trunc-outlives-E_coll regime, by a single fitted
 * decay-rate exponent p_eff ~ 0.39-0.49 that rises toward the imp-3463 asymptote 1/2 as
 * the fit window extends, with R^2 -> ~1. This is the single-number regime summary that
 * imp-3529's pointwise local exponent left unfit -- and it is honestly window-dependent,
 * not an exact single power law.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; no positivity, no bridge
 * closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N), "no single exponent")
 * @see imp-3463-sigma-fartail-decay (far-tail leading form sigma ~ (C_C/E_trunc) sqrt(logT0/N), exponent -> 1/2)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3406/imp-3463/imp-3529)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-3463/imp-3529 exactly

// EXACT imp-3406/imp-3463/imp-3529 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, super-poly negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// The E_coll = E_trunc crossover: the entry to the E_trunc-outlives-E_coll regime.
// Bisection on the sign of E_coll - E_trunc (reproduces imp-3444 N ~ 3.280e9).
function ecollEqualsEtrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e12);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_CROSS = ecollEqualsEtrunc(); // ~3.280e9

// Ordinary-least-squares fit of ln sigma on ln N over [loN, hiN], sampled uniformly in
// log10 N (default 4 points per decade). Returns the effective decay exponent p_eff =
// -slope and the coefficient of determination R^2 (single-power-law goodness of fit).
function olsEffectiveExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  const dLo = Math.log10(loN);
  const dHi = Math.log10(hiN);
  for (let d = dLo; d <= dHi + 1e-9; d += step) {
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
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  let ssTot = 0;
  let ssRes = 0;
  let maxResLn = 0;
  for (let i = 0; i < n; i++) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - my) ** 2;
    maxResLn = Math.max(maxResLn, Math.abs(ys[i] - pred));
  }
  return { p_eff: -slope, R2: 1 - ssRes / ssTot, maxResLn, nPoints: n };
}

// Effective-exponent ladder: fit the E_trunc-outlives-E_coll regime over windows of
// growing span M decades past the crossover; p_eff rises toward 1/2, R^2 toward 1.
const WINDOW_DECADES = [3, 6, 12, 24];
const EXPONENT_LADDER = WINDOW_DECADES.map((M) => {
  const f = olsEffectiveExponent(N_CROSS, N_CROSS * Math.pow(10, M));
  return {
    windowDecades: M,
    p_eff: +f.p_eff.toFixed(5),
    R2: +f.R2.toFixed(6),
    maxResidualLn: +f.maxResLn.toExponential(3),
    nPoints: f.nPoints,
  };
});

// Contrast fit over the E_coll-DOMINANT pre-crossover arm (peak -> crossover): a much
// smaller effective exponent with a poor single-law fit -- a single exponent is only
// meaningful once E_trunc outlives E_coll.
const N_MAX = 9.2186e5; // imp-3406/imp-3529 interior maximum
const PRECROSS_FIT = olsEffectiveExponent(N_MAX, N_CROSS);
const PRECROSS = {
  window: 'peak -> crossover (E_coll-dominant)',
  p_eff: +PRECROSS_FIT.p_eff.toFixed(5),
  R2: +PRECROSS_FIT.R2.toFixed(6),
};

export const IMP33255_SIGMA_POSTPEAK_REGIME_EFFECTIVE_EXPONENT = {
  id: 'imp-33255',
  proofSection: 'S-frontier',
  question:
    'Fit a SINGLE decay-rate exponent to the E_trunc-outlives-E_coll regime of the ' +
    'conditional share sigma(N) = E_coll/E(N) -- the arm past the imp-3444 E_coll = ' +
    'E_trunc crossover (N ~ 3.28e9) beyond the imp-3406 interior maximum -- and quantify ' +
    'imp-3406s qualitative "monotone decay toward 0" via an OLS power-law fit. ' +
    'Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'p_eff = -slope of OLS regression of ln sigma on ln N over [N_cross, N_cross*10^M] ' +
    '(4 points/decade); R^2 = single-power-law goodness of fit',
  crossover: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-3444 E_coll = E_trunc)
    sigma_at_cross: +sigma(N_CROSS).toFixed(6), // ~0.4995 (share ~ 1/2)
    note:
      'For N > N_cross the constant truncation floor E_trunc OUTLIVES the vanishing ' +
      'GUE-conditional E_coll (E_coll/E_trunc < 1), so sigma ~ (C_C/E_trunc) sqrt(logT0/N) ' +
      '-- the near-sqrt regime a single fitted exponent summarises.',
  },
  asymptoticExponent: 0.5, // imp-3463 far-tail sqrt(1/N) leading form, approached from below
  exponentLadder: EXPONENT_LADDER,
  preCrossoverContrast: PRECROSS,
  finding: {
    F1_single_exponent_fit:
      'OLS p_eff over the E_trunc-outlives-E_coll regime climbs with window span: ~0.390 ' +
      '(3 decades past crossover), ~0.444 (6), ~0.473 (12), ~0.486 (24) -- all below and ' +
      'rising toward the imp-3463 asymptote 1/2, matching sqrt(logT0/N).',
    F2_goodness_of_fit:
      'R^2 is high and INCREASES with window span (~0.9935 at 3 decades -> ~0.9998 at 24): ' +
      'the regime is described increasingly well by a single power law the further out one ' +
      'looks, the residual drift concentrated just past the crossover.',
    F3_precrossover_contrast:
      'Fitting the E_coll-DOMINANT pre-crossover arm (peak -> crossover) gives a far smaller ' +
      'exponent (~0.070) with a POOR single-law fit (R^2 ~ 0.84): a single exponent is only ' +
      'meaningful once E_trunc outlives E_coll -- exactly the regime the ticket names.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Fitting a SINGLE decay-rate exponent ' +
    'to the E_trunc-outlives-E_coll regime (N past the imp-3444 crossover N ~ 3.28e9) of ' +
    'the conditional share sigma(N), the OLS effective exponent p_eff climbs from ~0.390 ' +
    '(first 3 decades) through ~0.444, ~0.473 to ~0.486 (24 decades), rising toward the ' +
    'imp-3463 far-tail 1/2 from below, with R^2 improving from ~0.9935 to ~0.9998. So the ' +
    'regime IS well summarised by a single (window-dependent) exponent near 0.39-0.49, ' +
    'even though the exact local exponent still drifts (imp-3529); a pre-crossover fit ' +
    'gives only ~0.070 at R^2 ~ 0.84, confirming the single-exponent description is proper ' +
    'to the E_trunc-outlives-E_coll arm. This quantifies imp-3406s qualitative monotone ' +
    'decay-to-0 claim with a fitted number. The C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; no positivity, no bridge closure, no RH claim, NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3406 (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm); imp-3529 (LOCAL ' +
    'pointwise exponent p(N), no single exponent); imp-3463 (far-tail leading form, ' +
    'exponent -> 1/2); imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-3220 ' +
    '(U-shaped sigma(N) decade ladder, exact sub-terms); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33255_SIGMA_POSTPEAK_REGIME_EFFECTIVE_EXPONENT_ASSERTIONS = [
  {
    // Reuse gate: the exact sub-terms reproduce the imp-3444 E_coll = E_trunc crossover
    // (N ~ 3.280e9, sigma ~ 1/2), proving the identical model is in use.
    id: 'imp33255-reproduces-imp3444-crossover',
    description: 'N_cross ~ 3.280e9 where E_coll = E_trunc and sigma ~ 1/2 (identical sub-terms)',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-3 &&
      Math.abs(parts(N_CROSS).E_coll / E_TRUNC_PT - 1) < 1e-4 &&
      Math.abs(sigma(N_CROSS) - 0.5) < 2e-3,
  },
  {
    // (F1): the fitted effective exponent rises monotonely with window span toward 1/2,
    // staying strictly below it (approaches the imp-3463 asymptote from below).
    id: 'imp33255-effective-exponent-climbs-toward-half',
    description: 'p_eff strictly increases with window span, all in (0.35, 0.5), rising toward 1/2',
    holds: () => {
      for (let i = 1; i < EXPONENT_LADDER.length; i++) {
        if (!(EXPONENT_LADDER[i].p_eff > EXPONENT_LADDER[i - 1].p_eff)) return false;
      }
      return (
        EXPONENT_LADDER.every((r) => r.p_eff > 0.35 && r.p_eff < 0.5) &&
        EXPONENT_LADDER[0].p_eff < 0.42 &&
        EXPONENT_LADDER[EXPONENT_LADDER.length - 1].p_eff > 0.48
      );
    },
  },
  {
    // (F2): the single-power-law fit is good and improves with window span (R^2 -> ~1).
    id: 'imp33255-goodness-of-fit-improves',
    description: 'R^2 high (>0.99) and monotonely increasing with window span toward ~1',
    holds: () => {
      for (let i = 1; i < EXPONENT_LADDER.length; i++) {
        if (!(EXPONENT_LADDER[i].R2 > EXPONENT_LADDER[i - 1].R2)) return false;
      }
      return EXPONENT_LADDER.every((r) => r.R2 > 0.99) &&
        EXPONENT_LADDER[EXPONENT_LADDER.length - 1].R2 > 0.999;
    },
  },
  {
    // (F3): the pre-crossover E_coll-dominant arm has a much smaller effective exponent
    // and a poor single-law fit -- the single exponent is proper to the outlives regime.
    id: 'imp33255-precrossover-poor-single-law',
    description: 'pre-crossover fit p_eff ~ 0.07 with R^2 ~ 0.84 (much worse than the outlives regime)',
    holds: () =>
      PRECROSS.p_eff < 0.15 &&
      PRECROSS.R2 < 0.9 &&
      PRECROSS.p_eff < EXPONENT_LADDER[0].p_eff &&
      PRECROSS.R2 < EXPONENT_LADDER[0].R2,
  },
  {
    // Honesty gate: measurement/fit only, window-dependence acknowledged, no QED, PT SOTA.
    id: 'imp33255-honesty-gate-no-qed',
    description: 'Measurement only: no QED, PT stays SOTA',
    holds: () =>
      IMP33255_SIGMA_POSTPEAK_REGIME_EFFECTIVE_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP33255_SIGMA_POSTPEAK_REGIME_EFFECTIVE_EXPONENT.verdict) &&
      /remains SOTA/.test(IMP33255_SIGMA_POSTPEAK_REGIME_EFFECTIVE_EXPONENT.verdict),
  },
];

for (const a of IMP33255_SIGMA_POSTPEAK_REGIME_EFFECTIVE_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33255-sigma-postpeak-regime-effective-exponent assertion failed: ${a.id}`);
  }
}
