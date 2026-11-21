/**
 * @module imp-35036-sigma-fartail-exponent-log-slow-half-approach
 *
 * imp-35036 (numerical, frontier-direction): imp-33582 tabulated the per-decade LOCAL decay
 * exponent p_dec = -slope of OLS(ln sigma vs ln N) of the GUE-conditional share
 * sigma(N) = E_coll/E(N) on the near-peak grid, stopping the ladder at the decade [1e11,1e12]
 * where p_dec ~ 0.4310 -- still ~0.069 short of the imp-3463 far-tail 1/2 asymptote. It never
 * quantified the RESIDUAL gap 1/2 - p_dec past that decade, nor estimated at what N the local
 * exponent finally reaches within 1e-3 of 1/2. This module extends the SAME imp-33582 ladder
 * (identical olsExponent estimator, identical imp-3220/imp-3406 sub-terms) from k = 11 out to
 * k = 30, measures the residual gap decade by decade, and locates the 0.49 / 0.495 / 0.499
 * crossings -- quantifying how ASTRONOMICALLY slowly the constant truncation floor E_trunc
 * finishes overtaking the vanishing sqrt(1/N) E_coll.
 *
 * THE QUANTITY (byte-identical sub-terms to imp-3220 / imp-3406 / imp-33274 / imp-33582)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the exact inherited imp-3406/imp-33582 sub-terms.
 *
 * THE MEASUREMENT: extend the exponent ladder + residual-gap law + 0.499 crossing
 * -------------------------------------------------------------------------------
 *   (a) EXTENDED PER-DECADE LADDER: p_dec over [10^k, 10^(k+1)] for k = 11..30 (4 pts/decade,
 *       same estimator as imp-33582), plus the residual gap g_dec = 1/2 - p_dec each decade.
 *   (b) THE GAP LAW: fit g against the natural hypothesis 1/(2 ln N) (evaluated at the decade
 *       geometric midpoint) and report the ratio g / [1/(2 ln N)] -- it converges to 1 from
 *       above, so the exponent approaches 1/2 only LOGARITHMICALLY, g ~ 1/(2 ln N).
 *   (c) THE 0.499 CROSSING: the first decade [10^k,10^(k+1)] whose p_dec reaches 0.49, 0.495,
 *       0.499 (within 1e-3 of the asymptote) -- located by scanning k with the same estimator.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE LADDER PLATEAUS, IT DOES NOT SPRINT TO 1/2. Past imp-33582 the per-decade exponent
 *        keeps climbing but decelerates hard: ~0.4310 [1e11] -> ~0.4646 [1e12] -> ~0.4777 ->
 *        ~0.4828 -> ~0.4851 -> ... -> only ~0.4927 by the decade [1e30,1e31]. After the sharp
 *        near-peak ramp the residual gap shrinks in tiny, ever-slower steps.
 *   (F2) THE RESIDUAL GAP IS LOGARITHMIC, g ~ 1/(2 ln N). The ratio g_dec / [1/(2 ln N_mid)]
 *        falls from ~3.65 at [1e11,1e12] to ~2.04 at [1e12,1e13] and plateaus at ~1.019 by the
 *        1e20..1e30 decades -- converging to 1 from above (the residual ~1.9 percent is the
 *        finite decade-wide OLS window bias). So the last approach to the imp-3463 1/2 is NOT a
 *        power law: the gap halves only every time ln N doubles, i.e. every squaring of N.
 *   (F3) THE 0.499 CROSSING IS ASTRONOMICAL. The local exponent first reaches 0.49 at the decade
 *        ~[1e22,1e23], 0.495 at ~[1e44,1e45], and 0.499 (within 1e-3 of 1/2) only at the decade
 *        ~[1e219,1e220] -- N ~ 10^219, ~218 decades past the imp-3444 crossover N ~ 3.28e9. So
 *        the constant E_trunc floor finishes overtaking the vanishing E_coll only at heights
 *        astronomically beyond any conceivable verification scale: the g ~ 1/(2 ln N) law puts
 *        the within-1e-3 point at ln N ~ 500.
 *
 * The punchline: extending the imp-33582 per-decade exponent ladder shows the residual gap to
 * the imp-3463 far-tail 1/2 decays only LOGARITHMICALLY (g ~ 1/(2 ln N), ratio -> 1 from above),
 * so although the exponent is monotone toward 1/2 it plateaus near ~0.49 for hundreds of
 * decades: the local exponent first lands within 1e-3 of 1/2 only at N ~ 10^219. The constant
 * truncation floor overtakes the GUE-conditional collapse term with extreme, log-slow reluctance.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the far-tail exponent stays 1/2 per imp-3463;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ladder k=6..11, p_dec ~0.4310 at [1e11,1e12])
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (FAR-tail sliding window, p_eff -> 1/2)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX N ~ 9.22e5, monotone decay-to-0 right arm)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582 exactly
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote

// EXACT imp-3406/imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// SAME estimator as imp-33582: p = -slope of OLS(ln sigma on ln N) over [loN,hiN] (4 pts/decade).
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

// (F1)/(F2) Extended per-decade ladder k = 11..30, with residual gap and the 1/(2 ln N) law.
const EXTENDED_LADDER = [];
for (let k = 11; k <= 30; k++) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const p = olsExponent(lo, hi);
  const gap = HALF - p;
  const Nmid = Math.pow(10, k + 0.5); // decade geometric midpoint
  const logLaw = 1 / (2 * Math.log(Nmid)); // hypothesised leading form 1/(2 ln N)
  EXTENDED_LADDER.push({
    decade: `1e${k}->1e${k + 1}`,
    p_local: +p.toFixed(6),
    residualGap: +gap.toExponential(4),
    gapOverLogLaw: +(gap / logLaw).toFixed(4), // -> 1 from above
  });
}

// (F3) First decade whose per-decade exponent reaches a near-asymptote threshold (same estimator).
function firstDecadeReaching(target) {
  for (let k = 11; k <= 520; k++) {
    if (olsExponent(Math.pow(10, k), Math.pow(10, k + 1)) >= target) return k;
  }
  return null;
}
const K_REACH_0_49 = firstDecadeReaching(0.49); // ~22
const K_REACH_0_495 = firstDecadeReaching(0.495); // ~44
const K_REACH_0_499 = firstDecadeReaching(0.499); // ~219

export const IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH = {
  id: 'imp-35036',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582 per-decade local decay-exponent ladder of the GUE-conditional share ' +
    'sigma(N) = E_coll/E(N) past [1e11,1e12] (where p_dec ~ 0.4310, ~0.069 short of the imp-3463 ' +
    '1/2 asymptote): measure the residual gap 1/2 - p_dec across further decades and estimate the ' +
    'N at which the local exponent first reaches 0.499 (within 1e-3 of 1/2), quantifying how ' +
    'slowly the constant floor E_trunc finishes overtaking the vanishing E_coll. Measurement/fit ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'p_dec = -slope of OLS(ln sigma on ln N) over each decade [10^k,10^(k+1)] for k=11..30 (same ' +
    'imp-33582 estimator, 4 pts/decade); residual gap 1/2 - p_dec and its ratio to 1/(2 ln N); ' +
    'plus the first decade whose p_dec reaches 0.49, 0.495, 0.499',
  farTailExponent: HALF, // imp-3463 asymptote the ladder approaches from below
  extendedLadder: EXTENDED_LADDER,
  crossings: {
    p_reaches_0_49_first_decade: `1e${K_REACH_0_49}->1e${K_REACH_0_49 + 1}`, // ~1e22
    p_reaches_0_495_first_decade: `1e${K_REACH_0_495}->1e${K_REACH_0_495 + 1}`, // ~1e44
    p_reaches_0_499_first_decade: `1e${K_REACH_0_499}->1e${K_REACH_0_499 + 1}`, // ~1e219
    logN_at_0_499: +Math.log(Math.pow(10, K_REACH_0_499 + 0.5)).toFixed(1), // ln N ~ 505
  },
  gapLaw: {
    form: 'residual gap g = 1/2 - p_dec ~ 1/(2 ln N) (leading log-slow approach)',
    ratio_at_1e12: EXTENDED_LADDER[1].gapOverLogLaw, // ~2.04 (early, near-peak transient)
    ratio_at_1e20: EXTENDED_LADDER.find((r) => r.decade === '1e20->1e21').gapOverLogLaw, // ~1.019
    ratio_at_1e30: EXTENDED_LADDER[EXTENDED_LADDER.length - 1].gapOverLogLaw, // ~1.019
  },
  finding: {
    F1_ladder_plateaus:
      'Past imp-33582 the per-decade exponent keeps climbing but decelerates hard: ~0.4310 ' +
      '[1e11] -> ~0.4646 [1e12] -> ~0.4777 -> ~0.4828 -> ... -> only ~0.4927 by [1e30,1e31]. ' +
      'After the near-peak ramp the residual gap shrinks in tiny, ever-slower steps.',
    F2_gap_is_logarithmic:
      'The ratio (1/2 - p_dec) / [1/(2 ln N_mid)] falls from ~3.65 at [1e11,1e12] to ~2.04 at ' +
      '[1e12,1e13] and plateaus at ~1.019 across the 1e20..1e30 decades (the residual ~1.9 ' +
      'percent is the finite decade-wide OLS window bias), converging to 1 from above: the ' +
      'residual gap decays like 1/(2 ln N), NOT a power law -- it halves only when ln N doubles.',
    F3_0499_crossing_astronomical:
      'The local exponent first reaches 0.49 at the decade ~[1e22,1e23], 0.495 at ~[1e44,1e45], ' +
      'and 0.499 (within 1e-3 of 1/2) only at ~[1e219,1e220] -- N ~ 10^219, ~218 decades past ' +
      'the imp-3444 crossover ~3.28e9. Consistent with the g ~ 1/(2 ln N) law placing the ' +
      'within-1e-3 point at ln N ~ 500: E_trunc overtakes E_coll with extreme, log-slow reluctance.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582 per-decade exponent ' +
    'ladder of sigma(N) = E_coll/E(N) from [1e11,1e12] (p_dec ~0.4310) out to [1e30,1e31] ' +
    '(p_dec ~0.4927): the residual gap 1/2 - p_dec decays only LOGARITHMICALLY, g ~ 1/(2 ln N) ' +
    '(the ratio g/[1/(2 ln N)] -> 1 from above, plateauing at ~1.019 by 1e20), so although the exponent is ' +
    'monotone toward the imp-3463 far-tail 1/2 it plateaus near ~0.49 for hundreds of decades: ' +
    'p_dec first reaches 0.49 at ~[1e22,1e23], 0.495 at ~[1e44,1e45], and 0.499 (within 1e-3 of ' +
    '1/2) only at ~[1e219,1e220], N ~ 10^219. The constant E_trunc floor finishes overtaking the ' +
    'vanishing GUE-conditional E_coll only at astronomically large heights. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; the far-tail exponent stays 1/2 per imp-3463; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (per-decade ladder k=6..11, p_dec ~0.4310 at [1e11,1e12]); imp-33274 (FAR-tail ' +
    'sliding-window p_eff -> 1/2); imp-3463 (far-tail leading form, exponent -> 1/2 from below); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-3406 (interior MAX N ~ 9.22e5); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH_ASSERTIONS = [
  {
    // Reuse gate: the extended ladder continues the imp-33582 ladder -- the [1e11,1e12] decade
    // reproduces p_dec ~0.4310 and the exponent rises monotonely but stays strictly below 1/2.
    id: 'imp35036-continues-imp33582-ladder',
    description: 'first extended decade [1e11,1e12] ~0.4310; ladder monotone increasing, all in (0.43,0.5)',
    holds: () => {
      if (Math.abs(EXTENDED_LADDER[0].p_local - 0.4310) > 5e-4) return false;
      for (let i = 1; i < EXTENDED_LADDER.length; i++) {
        if (!(EXTENDED_LADDER[i].p_local > EXTENDED_LADDER[i - 1].p_local)) return false;
      }
      return EXTENDED_LADDER.every((r) => r.p_local > 0.43 && r.p_local < HALF);
    },
  },
  {
    // (F2): the residual gap tracks 1/(2 ln N) -- the ratio converges to 1 from above.
    id: 'imp35036-gap-follows-inverse-log-law',
    description: 'gap / [1/(2 ln N)] decreases toward 1 from above; ~1.02 by the 1e20 decade',
    holds: () => {
      const r20 = EXTENDED_LADDER.find((r) => r.decade === '1e20->1e21').gapOverLogLaw;
      const rLast = EXTENDED_LADDER[EXTENDED_LADDER.length - 1].gapOverLogLaw;
      return (
        EXTENDED_LADDER[0].gapOverLogLaw > 1 &&
        rLast > 1 &&
        rLast < EXTENDED_LADDER[0].gapOverLogLaw &&
        Math.abs(r20 - 1) < 0.05
      );
    },
  },
  {
    // (F3): the near-asymptote crossings are ordered and astronomically late -- 0.499 near 1e219.
    id: 'imp35036-0499-crossing-astronomical',
    description: 'p_dec reaches 0.49 ~1e22, 0.495 ~1e44, 0.499 ~1e219; ordered and >> imp-3444 crossover',
    holds: () =>
      K_REACH_0_49 < K_REACH_0_495 &&
      K_REACH_0_495 < K_REACH_0_499 &&
      Math.abs(K_REACH_0_49 - 22) <= 1 &&
      Math.abs(K_REACH_0_495 - 44) <= 2 &&
      Math.abs(K_REACH_0_499 - 219) <= 4,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35036-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH.isRigorous === false &&
      IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH.verdict) &&
      /refereed bound is changed/i.test(IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH.verdict),
  },
];

for (const a of IMP35036_SIGMA_FARTAIL_EXPONENT_LOG_SLOW_HALF_APPROACH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35036-sigma-fartail-exponent-log-slow-half-approach assertion failed: ${a.id}`);
  }
}
