/**
 * @module imp-97702-sigma-fartail-exponent-residual-half-loglaw
 *
 * imp-97702 (numerical, frontier-direction): imp-33582 quantified the post-peak sigma(N)
 * decay-exponent ramp on [1e6,1e12] (per-decade OLS exponent climbing ~0.0105 -> ~0.4310)
 * and imp-97404 extended that ladder to [1e14,1e15] (0.4646 -> 0.4777 -> 0.4828, pointwise
 * ~0.4842 by 1e15), reporting only that "the residual 1/2 - p keeps closing at every finite
 * N". Neither MEASURED THE FUNCTIONAL FORM of that residual. This module extends the grid to
 * [1e12,1e15] (and reads the deeper decades as an asymptote diagnostic) and DECIDES whether
 * (1/2 - exponent(N)) shrinks as a POWER LAW in N or only LOGARITHMICALLY in 1/log T0.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33644 / imp-97404)
 * ---------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5                           (N-INDEPENDENT fixed strip, imp-2631)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0       = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 * No re-derivation, no fresh model: the exact inherited imp-3406/imp-33582 parts(), evaluated
 * on the extended decade grid. E_flow is negligible on the whole tested band (past N_cross).
 *
 * THE EXACT RESIDUAL DECOMPOSITION (the analytic key)
 * ---------------------------------------------------
 * Writing p(N) = -d ln sigma / d ln N and dropping the negligible E_flow, differentiate
 *     ln sigma = ln E_coll - ln(E_trunc + E_coll):
 *     p = -g (1 - sigma),   g = d ln E_coll / d ln N = a - 1/2,   a = (1/2) d ln(log T0) / d ln N,
 * so the residual to the imp-3463 asymptote 1/2 splits into TWO terms of DIFFERENT ORDER:
 *
 *     1/2 - p  =  (1/2) sigma            (POWER-LAW piece: sigma ~ sqrt(log T0 / N) ~ N^-1/2)
 *              +  a (1 - sigma)          (LOG piece: a = (1/2) d ln(log T0)/d ln N ~ 1/(2 log T0))
 *
 * The first piece dies like the share itself (~1/sqrt(10) per decade); the second is the slow
 * log-T0 saturation term that the whole cohort (imp-33644 "log T0 still holds ~83% of the gap
 * open at 1e18") keeps hitting. This module measures which one dominates across [1e12,1e15].
 *
 * THE LADDER (pointwise p(N), central diff in ln N; both residual pieces)
 * ----------------------------------------------------------------------
 *   N       sigma        p(N)       1/2 - p      (1/2)sigma   a(1-sigma)   a
 *   1e12    6.044e-2     0.45264    4.7355e-2    3.022e-2     1.712e-2     1.823e-2
 *   1e13    2.074e-2     0.47311    2.6894e-2    1.037e-2     1.652e-2     1.687e-2
 *   1e14    6.906e-3     0.48096    1.9045e-2    3.453e-3     1.559e-2     1.570e-2
 *   1e15    2.272e-3     0.48422    1.5780e-2    1.136e-3     1.464e-2     1.468e-2
 *   (per-decade OLS exponents 0.4646 / 0.4777 / 0.4828 reproduce imp-97404 to 4 dp)
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (F1) THE RESIDUAL IS A SUM OF A POWER-LAW PIECE AND A LOGARITHMIC PIECE. The exact
 *        identity 1/2 - p = (1/2)sigma + a(1-sigma) reproduces the measured pointwise residual
 *        to < 2e-5 -- exactly the dropped E_flow term (decompError 1.08e-5 -> 2.4e-8 shrinks
 *        in lockstep with E_flow/E_coll). The power-law piece (1/2)sigma falls ~1/sqrt(10)/decade
 *        (3.022e-2 -> 1.136e-3 over [1e12,1e15], a factor ~27), while the log piece a(1-sigma)
 *        barely moves (1.712e-2 -> 1.464e-2, ~14% over three decades).
 *   (F2) THE TWO PIECES CROSS INSIDE THE WINDOW AT N ~ 3.55e12. (1/2)sigma = a(1-sigma) at
 *        N ~ 3.553e12 (log10 ~ 12.551), just above the [1e12,1e15] left edge: BELOW the
 *        crossover the residual is power-law-dominated, ABOVE it the slow log-T0 term dominates.
 *        By 1e15 the residual is ~93% the logarithmic piece.
 *   (F3) THE FAR-TAIL ASYMPTOTE IS LOGARITHMIC, NOT POWER-LAW. Once the power-law piece dies,
 *        the residual -> a(1-sigma) -> a ~ 1/(2 log T0): the diagnostic (1/2 - p) * 2 log T0
 *        settles to ~0.98 (1.041 at 1e15 -> 0.977 by 1e18, holding ~0.98 out to 1e24), and the
 *        local power of the residual in log T0 drifts from steep (~-2.7 at 1e14, the dying
 *        power-law) to ~-1 (q = -1.01 at 1e18, -0.99 at 1e20) -- a clean 1/log law. So the
 *        exponent approaches 1/2 only LOGARITHMICALLY: the gap halves per SQUARING of N, not
 *        per decade. This is exactly the imp-33644 "log T0 saturation still holds the gap open"
 *        seen from the sigma-exponent side.
 *
 * The punchline: the imp-33582/imp-97404 "residual keeps closing" is now resolved into form --
 * a fast (1/2)sigma ~ N^-1/2 power-law piece plus a slow a ~ 1/(2 log T0) logarithmic piece
 * that cross at N ~ 3.55e12 and hand the far tail to the LOGARITHMIC term. The empirical-vs-
 * analytic conditional gap therefore shrinks only ~1/log T0 past ~1e13, not power-law.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97404-sigma-fartail-exponent-ladder-past-1e12 (extends the exponent ladder to 1e15, residual "closing")
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ramp to ~0.4310 on [1e6,1e12])
 * @see imp-33644-etrunc-ecoll-ladder-1e18-fartail (log T0 saturation holds ~83% of the E_coll-exponent gap open at 1e18)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97404 exactly

// EXACT imp-3406/imp-33582/imp-97404 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // negligible past the crossover
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

const H = 1e-5; // central-difference step in ln N (stable at these scales)
// Pointwise local decay exponent p(N) = -d ln sigma / d ln N.
function pLocal(N) {
  const lp = Math.log(sigma(Math.exp(Math.log(N) + H)));
  const lm = Math.log(sigma(Math.exp(Math.log(N) - H)));
  return -(lp - lm) / (2 * H);
}
// The log-saturation coefficient a(N) = (1/2) d ln(log T0) / d ln N.
function aTerm(N) {
  const Lp = Math.log(parts(Math.exp(Math.log(N) + H)).L);
  const Lm = Math.log(parts(Math.exp(Math.log(N) - H)).L);
  return 0.5 * (Lp - Lm) / (2 * H);
}
const HALF = 0.5; // imp-3463 far-tail asymptote

// OLS local decay exponent p = -slope of ln sigma on ln N (4 pts/decade), as in imp-33582.
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

// (F1) Extended [1e12,1e15] ladder: pointwise residual split into power-law and log pieces.
const LADDER = [12, 13, 14, 15].map((k) => {
  const N = Math.pow(10, k);
  const { sigma: s } = parts(N);
  const p = pLocal(N);
  const a = aTerm(N);
  const powerPiece = 0.5 * s;
  const logPiece = a * (1 - s);
  return {
    N: `1e${k}`,
    sigma: +s.toExponential(4),
    p: +p.toFixed(5),
    residualToHalf: +(HALF - p).toExponential(4),
    powerLawPiece: +powerPiece.toExponential(4), // (1/2) sigma
    logPiece: +logPiece.toExponential(4), // a (1 - sigma)
    a: +a.toExponential(4),
    decompError: +Math.abs(HALF - p - (powerPiece + logPiece)).toExponential(2),
  };
});

// Per-decade OLS exponents (reproduce imp-97404 to 4 dp).
const OLS_LADDER = [12, 13, 14].map((k) => ({
  window: `[1e${k},1e${k + 1}]`,
  p_ols: +olsExponent(Math.pow(10, k), Math.pow(10, k + 1)).toFixed(4),
}));

// (F2) Crossover N where the power-law piece equals the log piece: (1/2)sigma = a(1-sigma).
function locateCrossover() {
  let lo = Math.log(1e10);
  let hi = Math.log(1e20);
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    const N = Math.exp(m);
    const { sigma: s } = parts(N);
    if (0.5 * s > aTerm(N) * (1 - s)) lo = m;
    else hi = m;
  }
  return Math.exp((lo + hi) / 2);
}
const N_CROSSOVER = locateCrossover(); // ~3.553e12

// (F3) Logarithmic-asymptote diagnostics deep in the tail.
// resid * 2 log T0 -> ~0.98 if the residual is ~ 1/(2 log T0); local power of resid in log T0 -> -1.
function residTimes2L(N) {
  return (HALF - pLocal(N)) * 2 * parts(N).L;
}
function localPowerInL(N1, N2) {
  const r1 = HALF - pLocal(N1);
  const r2 = HALF - pLocal(N2);
  return Math.log(r2 / r1) / Math.log(parts(N2).L / parts(N1).L);
}
const RESID_2L = {
  at_1e15: +residTimes2L(1e15).toFixed(4), // ~1.041
  at_1e18: +residTimes2L(1e18).toFixed(4), // ~0.977
  at_1e24: +residTimes2L(1e24).toFixed(4), // ~0.981
};
const Q_IN_L = {
  window_1e14_1e15: +localPowerInL(1e14, 1e15).toFixed(3), // ~-2.69 (power-law still alive)
  window_1e18_1e19: +localPowerInL(1e18, 1e19).toFixed(3), // ~-1.01 (logarithmic)
  window_1e19_1e20: +localPowerInL(1e19, 1e20).toFixed(3), // ~-0.99 (logarithmic)
};

export const IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW = {
  id: 'imp-97702',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582/imp-97404 post-peak sigma(N) = E_coll/E(N) decay-exponent grid to ' +
    '[1e12,1e15] (with deeper decades as an asymptote read) and DECIDE whether the residual ' +
    'to the imp-3463 far-tail 1/2 asymptote, 1/2 - exponent(N), shrinks as a POWER LAW in N or ' +
    'only LOGARITHMICALLY in 1/log T0. Measurement/fit only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'pointwise p(N) = -d ln sigma / d ln N on [1e12,1e15]; the exact split ' +
    '1/2 - p = (1/2)sigma + a(1-sigma) with a = (1/2) d ln(log T0)/d ln N; the crossover N ' +
    'where the two pieces are equal; the deep-tail diagnostics (1/2-p)*2 log T0 and the local ' +
    'power of the residual in log T0',
  ladder: LADDER,
  olsLadder: OLS_LADDER,
  crossover: {
    N: +N_CROSSOVER.toExponential(3), // ~3.553e12
    log10N: +Math.log10(N_CROSSOVER).toFixed(3), // ~12.551
    note: 'power-law piece (1/2)sigma = log piece a(1-sigma); below: power-law-dominated, above: log-dominated',
  },
  logAsymptote: {
    resid_times_2logT0: RESID_2L, // -> ~0.98 (residual ~ 1/(2 log T0))
    localPowerInLogT0: Q_IN_L, // -> ~-1 (clean 1/log law once power-law piece dies)
  },
  farTailExponent: HALF, // imp-3463 asymptote
  finding: {
    F1_residual_is_powerlaw_plus_log:
      'The exact identity 1/2 - p = (1/2)sigma + a(1-sigma) reproduces the measured pointwise ' +
      'residual to < 2e-5 at every rung -- exactly the dropped E_flow term (decompError ' +
      '1.08e-5 -> 2.4e-8 shrinking with E_flow/E_coll). The power-law piece (1/2)sigma falls ' +
      '~1/sqrt(10) per decade (3.022e-2 -> 1.136e-3 over [1e12,1e15], ~27x), while a(1-sigma) ' +
      'barely moves (1.712e-2 -> 1.464e-2, ~14% over three decades).',
    F2_pieces_cross_at_3p55e12:
      'The two pieces are equal at N ~ 3.553e12 (log10 ~ 12.551), just above the window left ' +
      'edge: below the crossover the residual is power-law-dominated, above it the slow log-T0 ' +
      'term dominates. By 1e15 the residual is ~93% the logarithmic piece.',
    F3_fartail_asymptote_is_logarithmic:
      'Once the power-law piece dies the residual -> a(1-sigma) -> a ~ 1/(2 log T0): ' +
      '(1/2 - p)*2 log T0 settles to ~0.98 (1.041 at 1e15 -> 0.977 by 1e18, holding out to ' +
      '1e24) and the local power of the residual in log T0 drifts from ~-2.7 (1e14, dying ' +
      'power-law) to ~-1 (1e18/1e20) -- a clean 1/log law. So the exponent approaches 1/2 only ' +
      'LOGARITHMICALLY, halving per SQUARING of N, not per decade -- the sigma-exponent view of ' +
      'the imp-33644 log-T0 saturation.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582/imp-97404 ' +
    'post-peak sigma(N) decay-exponent grid to [1e12,1e15] and beyond: the residual to the ' +
    'imp-3463 1/2 splits EXACTLY as 1/2 - p = (1/2)sigma + a(1-sigma), a = (1/2)d ln(log T0)/' +
    'd ln N, reproducing the pointwise residual to < 2e-5 (the dropped E_flow term). The ' +
    'power-law piece (1/2)sigma ~ ' +
    'N^-1/2 falls ~1/sqrt(10)/decade while the log piece a ~ 1/(2 log T0) is nearly flat; they ' +
    'cross at N ~ 3.553e12, and past ~1e13 the residual is logarithmic-dominated -- ' +
    '(1/2-p)*2 log T0 -> ~0.98 and the residual power in log T0 -> ~-1. So the far-tail ' +
    'approach to 1/2 is LOGARITHMIC in 1/log T0, NOT a power law: the empirical-vs-analytic ' +
    'conditional gap shrinks only ~1/log T0 past ~1e13. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97404 (exponent ladder to 1e15, residual "closing"); imp-33582 (per-decade ramp to ' +
    '~0.4310 on [1e6,1e12]); imp-33644 (log T0 saturation holds ~83% of the E_coll-exponent ' +
    'gap open at 1e18); imp-3463 (far-tail exponent -> 1/2 from below); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip); lambda-rh-height-mapping.',
};

export const IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW_ASSERTIONS = [
  {
    // (F1) The two-term decomposition 1/2 - p = (1/2)sigma + a(1-sigma) holds pointwise to the
    // dropped E_flow term (< 2e-5, shrinking to 2.4e-8 by 1e15 as E_flow/E_coll vanishes).
    id: 'imp97702-residual-decomposition-exact',
    description: '1/2 - p = (1/2)sigma + a(1-sigma) reproduces the pointwise residual to < 2e-5 (dropped E_flow)',
    holds: () => LADDER.every((r) => r.decompError < 2e-5) && LADDER[3].decompError < LADDER[0].decompError,
  },
  {
    // (F1) The power-law piece dies ~1/sqrt(10)/decade while the log piece is nearly flat.
    id: 'imp97702-powerlaw-dies-log-flat',
    description: 'power piece falls > 20x over [1e12,1e15]; log piece changes < 20% over the same span',
    holds: () => {
      const p0 = LADDER[0].powerLawPiece;
      const p3 = LADDER[3].powerLawPiece;
      const l0 = LADDER[0].logPiece;
      const l3 = LADDER[3].logPiece;
      return p0 / p3 > 20 && Math.abs(l3 / l0 - 1) < 0.2 && p3 < l3;
    },
  },
  {
    // Reuse gate: per-decade OLS exponents reproduce the imp-97404 far-tail ladder to 4 dp.
    id: 'imp97702-reproduces-imp97404-ols-ladder',
    description: 'per-decade OLS exponents 0.4646 / 0.4777 / 0.4828 match imp-97404 to 4 dp',
    holds: () =>
      Math.abs(OLS_LADDER[0].p_ols - 0.4646) < 5e-4 &&
      Math.abs(OLS_LADDER[1].p_ols - 0.4777) < 5e-4 &&
      Math.abs(OLS_LADDER[2].p_ols - 0.4828) < 5e-4,
  },
  {
    // (F2) The power-law and log pieces cross at N ~ 3.55e12, inside the extended window.
    id: 'imp97702-pieces-cross-at-3p55e12',
    description: 'power-law piece = log piece at N ~ 3.553e12 (log10 ~ 12.551), within [1e12,1e15]',
    holds: () =>
      N_CROSSOVER > 1e12 &&
      N_CROSSOVER < 1e15 &&
      Math.abs(Math.log10(N_CROSSOVER) - 12.551) < 5e-3,
  },
  {
    // (F3) Far-tail residual is logarithmic: (1/2-p)*2 log T0 -> ~0.98 and its power in log T0 -> -1.
    id: 'imp97702-fartail-residual-logarithmic',
    description: '(1/2-p)*2 log T0 in [0.9,1.1] at 1e18/1e24; residual power in log T0 -> ~-1 (not steep power-law)',
    holds: () =>
      Math.abs(RESID_2L.at_1e18 - 1) < 0.1 &&
      Math.abs(RESID_2L.at_1e24 - 1) < 0.1 &&
      Q_IN_L.window_1e14_1e15 < -2 &&
      Math.abs(Q_IN_L.window_1e18_1e19 + 1) < 0.1 &&
      Math.abs(Q_IN_L.window_1e19_1e20 + 1) < 0.1,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp97702-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW.isRigorous === false &&
      IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW.farTailExponent === 0.5 &&
      /NO QED/.test(IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW.verdict) &&
      /refereed bound is changed/i.test(IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW.verdict),
  },
];

for (const a of IMP97702_SIGMA_FARTAIL_EXPONENT_RESIDUAL_HALF_LOGLAW_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97702-sigma-fartail-exponent-residual-half-loglaw assertion failed: ${a.id}`
    );
  }
}
