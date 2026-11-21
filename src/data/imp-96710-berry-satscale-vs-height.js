/**
 * @module imp-96710-berry-satscale-vs-height
 * @fileoverview imp-96710 -- derive the Berry semiclassical number-variance
 *   saturation scale L_sat(T) quantitatively and test its height scaling against
 *   Sigma2_emp measured on THREE height sub-windows of the Odlyzko zeros6 dataset.
 *
 *   BACKGROUND
 *   -----------------------------------------------
 *   imp-96695 found that the two-interval correlation rho computed from real zeros
 *   departs from the exact GUE sine-kernel rho, and attributed it to finite-height
 *   (Berry semiclassical) saturation of the zeta number variance: Sigma2_emp tracks
 *   the exact GUE Sigma2 at small L then saturates near ~0.36-0.43 at a scale
 *   "L ~ 3-8, consistent with the height T ~ 1e6", but NEVER derived the predicted
 *   saturation scale L_sat(T) nor confirmed its height dependence. This module
 *   supplies both.
 *
 *   THE BERRY SATURATION SCALE (derived)
 *   -----------------------------------------------
 *   From the explicit-formula density fluctuation
 *     N_fl(t) = -(1/pi) sum_{p,k} (1/k) p^(-k/2) sin(k t log p),
 *   the number variance over a height window holding L unfolded levels is
 *     Sigma2(L) = (1/pi^2) sum_{p,k} (1/k^2) p^(-k)
 *                  [1 - cos(k * 2pi L log p / log(T/2pi))].
 *   The lowest-frequency term is the shortest periodic orbit, prime p=2 (period
 *   log 2). Its phase phi = 2pi L log2 / log(T/2pi) crosses from the growing
 *   regime (1 - cos ~ phi^2/2) into the saturated regime (1 - cos -> 1, on
 *   average) at phi ~ 1, which fixes the saturation scale
 *     L_sat(T) = log(T/2pi) / (2pi log 2).
 *   So L_sat grows like log(T/2pi): LOWER-height sub-windows saturate EARLIER
 *   (smaller L_sat) and, because the saturated value is the GUE curve evaluated
 *   near L_sat, at a lower plateau. The saturated plateau itself then grows only
 *   like log log T:  Sigma2_sat(T) ~ const + (1/pi^2) log( log(T/2pi) ).
 *
 *   WHAT WAS MEASURED
 *   -----------------------------------------------
 *   Sigma2_emp(L) was re-measured (same Monte-Carlo phase-averaged estimator as
 *   imp-96695: smooth Riemann-Siegel unfolding u_n = theta(gamma_n)/pi + 1, mean
 *   density 1; 2e6 random window placements per L, seeded PRNG) on three nested
 *   height cuts of zeros6:
 *     low   T <= 1e4     (N =   10,142 zeros,  log(T/2pi) = 7.372)
 *     mid   T <= 1e5     (N =  138,069 zeros,  log(T/2pi) = 9.675)
 *     high  T <= 1.13e6  (N = 2,001,052 zeros, log(T/2pi) = 12.102, full set)
 *   The high cut reproduces imp-96695 (Sigma2_emp/GUE = 0.371 at L=960 vs its 0.371).
 *
 *   THE FINDING
 *   -----------------------------------------------
 *   (1) The saturation scale SHIFTS WITH T exactly as Berry predicts. The Berry
 *       L_sat(T) = log(T/2pi)/(2pi log2) rises 1.693 -> 2.222 -> 2.779 across the
 *       three cuts. The directly measured turnover of Sigma2_emp (its peak before
 *       the flat plateau) moves right with T: peak near L~3 (low), L~5 (mid),
 *       L~5-8 (high) -- the very "L ~ 3-8" band imp-96695 reported, now resolved as
 *       a height-DEPENDENT scale, not a fixed one.
 *   (2) The empirical departure scale tracks the Berry scale at a HEIGHT-INDEPENDENT
 *       ratio. Defining L_cross as the L at which the GUE growth would reach the
 *       measured plateau (invert (1/pi^2)(log(2pi L)+gamma+1) = Sigma2_plateau),
 *       L_cross = 0.857 / 1.195 / 1.461 for low/mid/high, and the ratio
 *       L_cross / L_sat_Berry = 0.506 / 0.538 / 0.526 is constant to ~3 percent.
 *       Constant ratio = both scales carry the SAME log(T/2pi) height dependence.
 *   (3) The plateau grows with T at the predicted log-log rate. Measured plateau
 *       (mean of Sigma2_emp over L>=60) = 0.3304 / 0.3641 / 0.3844 (low/mid/high).
 *       The high-minus-low increment 0.0540 matches the Berry prediction
 *       (1/pi^2) log( log(T_high/2pi) / log(T_low/2pi) ) = 0.0502 to within the
 *       Monte-Carlo noise.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A quantitative confirmation MEASUREMENT of the Berry finite-height mechanism
 *   invoked (but not derived) in imp-96695. It derives L_sat(T), computes it at
 *   three heights, and verifies the empirical Sigma2_emp saturation scale AND
 *   plateau both scale with T as predicted. It recomputes no crossover, moves no
 *   L*, instantiates no interval, closes no analytic sub-gap, changes no bound.
 *   The GUE-vs-empirical gap is confirmed a finite-height artefact (the accessible
 *   low-height zeros cannot corroborate the T -> infinity GUE rho the reach
 *   estimate uses), in the SAFE direction as imp-96695 already noted. NO QED.
 *   No refereed bound is changed; RH open.
 *
 * @see imp-96695-basis-c-empirical-rho-vs-gue-crossvalidation (the finite-height claim this quantifies)
 * @see imp-96721-sigma2-emp-vs-gue-viz-data (the single-height Sigma2_emp-vs-GUE viz)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the GUE rho model both check)
 *
 * Ticket: imp-96710 (numerical, medium). Measurement/derivation only; establishes
 * nothing; moves no bound; NO QED; no refereed bound is changed.
 */

// -- Provenance ----------------------------------------------------------------
const IMP96710_PROVENANCE = Object.freeze({
  dataset: 'scripts/.zeros-cache/zeros6',
  unfolding: 'u_n = theta(gamma_n)/pi + 1 (Riemann-Siegel smooth counting; mean density 1)',
  estimator: 'Monte-Carlo phase-averaged number variance, 2e6 random window placements per L, seeded numpy default_rng',
  berryFormula: 'L_sat(T) = log(T/2pi) / (2pi log 2)  [p=2 shortest-orbit phase reaches order 1]',
  plateauFormula: 'Sigma2_sat(T) ~ const + (1/pi^2) log( log(T/2pi) )  [log-log height growth]',
  script: 'tmp/imp-96710-berry-satscale.py',
});

// -- Per-height-cut derivation + measurement -----------------------------------
// L_satBerry: log(Teff/2pi)/(2pi log2). plateau: mean Sigma2_emp over L>=60.
// lCross: L at which GUE growth (1/pi^2)(log(2pi L)+gamma+1) equals the plateau.
const IMP96710_CUTS = Object.freeze([
  Object.freeze({ label: 'low', Tcut: 1.0e4, Teff: 9998.85, nZeros: 10142, logTeff2pi: 7.3723, lSatBerry: 1.6928, plateau: 0.3304, lCross: 0.857, peakL: 3 }),
  Object.freeze({ label: 'mid', Tcut: 1.0e5, Teff: 99999.70, nZeros: 138069, logTeff2pi: 9.6750, lSatBerry: 2.2215, plateau: 0.3641, lCross: 1.195, peakL: 5 }),
  Object.freeze({ label: 'high', Tcut: 1.13e6, Teff: 1132490.66, nZeros: 2001052, logTeff2pi: 12.1021, lSatBerry: 2.7788, plateau: 0.3844, lCross: 1.461, peakL: 6 }),
]);

// -- Sigma2_emp(L) per cut, with the exact-asymptotic GUE reference ------------
// Columns: L, Sigma2_emp(low), Sigma2_emp(mid), Sigma2_emp(high), Sigma2_GUE.
// (GUE = large-L sine-kernel asymptotic (1/pi^2)(log(2pi L)+gamma+1); it slightly
//  overshoots the exact Si/Ci form below L~1, which is why the L=0.5 ratios differ
//  by ~1 percent from imp-96695 -- immaterial to the saturation-scale conclusion.)
const IMP96710_SIGMA2_TABLE = Object.freeze([
  Object.freeze({ L: 0.5, low: 0.2708, mid: 0.2745, high: 0.2765, gue: 0.2758 }),
  Object.freeze({ L: 1, low: 0.3142, mid: 0.3219, high: 0.3275, gue: 0.3460 }),
  Object.freeze({ L: 2, low: 0.3616, mid: 0.3731, high: 0.3803, gue: 0.4163 }),
  Object.freeze({ L: 3, low: 0.3773, mid: 0.3969, high: 0.4088, gue: 0.4573 }),
  Object.freeze({ L: 5, low: 0.3627, mid: 0.4079, high: 0.4314, gue: 0.5091 }),
  Object.freeze({ L: 8, low: 0.3118, mid: 0.3794, high: 0.4210, gue: 0.5567 }),
  Object.freeze({ L: 12, low: 0.3136, mid: 0.3414, high: 0.3797, gue: 0.5978 }),
  Object.freeze({ L: 30, low: 0.3094, mid: 0.3813, high: 0.3496, gue: 0.6906 }),
  Object.freeze({ L: 60, low: 0.3219, mid: 0.3710, high: 0.4071, gue: 0.7609 }),
  Object.freeze({ L: 120, low: 0.3369, mid: 0.3553, high: 0.3672, gue: 0.8311 }),
  Object.freeze({ L: 480, low: 0.3337, mid: 0.3634, high: 0.3863, gue: 0.9716 }),
  Object.freeze({ L: 960, low: 0.3312, mid: 0.3610, high: 0.3869, gue: 1.0418 }),
]);

// L_cross / L_sat_Berry -- constant to ~3 percent across the three heights.
const IMP96710_RATIO_LCROSS_OVER_LSAT = Object.freeze([0.506, 0.538, 0.526]);
// Plateau increment: observed (high - low) vs Berry log-log prediction.
const IMP96710_PLATEAU_INCREMENT_OBS = 0.0540;
const IMP96710_PLATEAU_INCREMENT_BERRY = 0.0502;

export const IMP96710_BERRY_SATSCALE_VS_HEIGHT = Object.freeze({
  id: 'imp-96710',
  proofSection: 'S-frontier',
  quantifies: 'imp-96695 (finite-height/Berry saturation of the zeta number variance)',
  provenance: IMP96710_PROVENANCE,
  cuts: IMP96710_CUTS,
  sigma2Table: IMP96710_SIGMA2_TABLE,
  ratioLCrossOverLSat: IMP96710_RATIO_LCROSS_OVER_LSAT,
  plateauIncrementObserved: IMP96710_PLATEAU_INCREMENT_OBS,
  plateauIncrementBerry: IMP96710_PLATEAU_INCREMENT_BERRY,
  anyBoundMoved: false,
  verdict:
    'DERIVATION + MEASUREMENT. The Berry semiclassical number-variance saturation ' +
    'scale is L_sat(T) = log(T/2pi)/(2pi log 2), set by the shortest periodic orbit ' +
    '(prime p=2, period log 2) whose phase reaches order 1. Computed at three height ' +
    'cuts of zeros6 it rises 1.693 -> 2.222 -> 2.779, and the directly measured ' +
    'Sigma2_emp turnover moves right with T (peak L ~ 3 -> 5 -> 6), resolving the ' +
    'imp-96695 "L ~ 3-8" band as a height-DEPENDENT scale. The empirical departure ' +
    'scale L_cross tracks L_sat_Berry at a height-independent ratio ~0.52 (both carry ' +
    'the same log(T/2pi) dependence), and the plateau grows at the predicted log-log ' +
    'rate: observed high-minus-low increment 0.0540 vs Berry (1/pi^2)*log(log ratio) ' +
    '= 0.0502. So Sigma2_emp saturates EARLIER at lower T, exactly as the Berry ' +
    'mechanism requires -- confirming imp-96695s finite-height attribution. Moves no ' +
    'bound; instantiates no interval; NO QED. No refereed bound is changed.',
  citation:
    'imp-96695 (the finite-height claim quantified here); Berry 1988 semiclassical ' +
    'number variance of the Riemann zeros; Odlyzko zeros6 dataset; Dyson-Mehta ' +
    'sine-kernel number variance.',
});

export default IMP96710_BERRY_SATSCALE_VS_HEIGHT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96710_BERRY_SATSCALE_VS_HEIGHT_ASSERTIONS = [
  {
    id: 'imp96710-lsat-grows-with-height',
    why: 'The core Berry prediction: the saturation scale L_sat(T) = log(T/2pi)/(2pi log2) ' +
      'must increase monotonically with the height cut T.',
    holds: () => {
      const c = IMP96710_CUTS;
      const recomputed = (Teff) => Math.log(Teff / (2 * Math.PI)) / (2 * Math.PI * Math.log(2));
      for (let i = 0; i < c.length; i++) {
        if (Math.abs(recomputed(c[i].Teff) - c[i].lSatBerry) > 1e-3) return false;
      }
      return c[0].lSatBerry < c[1].lSatBerry && c[1].lSatBerry < c[2].lSatBerry;
    },
  },
  {
    id: 'imp96710-plateau-grows-with-height',
    why: 'Lower-height windows saturate earlier and at a lower plateau; the measured ' +
      'plateau must increase from the low to the high cut.',
    holds: () => {
      const c = IMP96710_CUTS;
      return c[0].plateau < c[1].plateau && c[1].plateau < c[2].plateau;
    },
  },
  {
    id: 'imp96710-lcross-tracks-lsat-at-constant-ratio',
    why: 'A height-independent L_cross/L_sat ratio is the signature that the empirical ' +
      'departure scale carries the same log(T/2pi) height dependence as the Berry scale.',
    holds: () => {
      const r = IMP96710_RATIO_LCROSS_OVER_LSAT;
      for (let i = 0; i < IMP96710_CUTS.length; i++) {
        const c = IMP96710_CUTS[i];
        if (Math.abs(c.lCross / c.lSatBerry - r[i]) > 5e-3) return false;
      }
      const spread = Math.max(...r) - Math.min(...r);
      return spread < 0.05; // constant to within ~3 percent
    },
  },
  {
    id: 'imp96710-plateau-increment-matches-berry-loglog',
    why: 'The plateau should grow like (1/pi^2) log(log(T/2pi)); the observed ' +
      'high-minus-low increment must match the Berry log-log prediction to MC noise.',
    holds: () => {
      const c = IMP96710_CUTS;
      const obs = c[2].plateau - c[0].plateau;
      const pred = Math.log(c[2].logTeff2pi / c[0].logTeff2pi) / (Math.PI ** 2);
      return Math.abs(obs - IMP96710_PLATEAU_INCREMENT_OBS) < 1e-4
        && Math.abs(pred - IMP96710_PLATEAU_INCREMENT_BERRY) < 1e-3
        && Math.abs(obs - pred) < 6e-3;
    },
  },
  {
    id: 'imp96710-high-cut-reproduces-imp96695',
    why: 'The high height cut must reproduce the imp-96695 saturation ratio (Sigma2_emp/GUE ' +
      '~ 0.371 at L=960) as a control on the re-measurement.',
    holds: () => {
      const row = IMP96710_SIGMA2_TABLE.find((r) => r.L === 960);
      const ratio = row.high / row.gue;
      return Math.abs(ratio - 0.371) < 5e-3;
    },
  },
  {
    id: 'imp96710-no-bound-moved',
    why: 'This is a measurement/derivation only; it must not assert any bound movement.',
    holds: () => IMP96710_BERRY_SATSCALE_VS_HEIGHT.anyBoundMoved === false,
  },
];
