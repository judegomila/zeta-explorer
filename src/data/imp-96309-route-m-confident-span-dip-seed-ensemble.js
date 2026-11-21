/**
 * @module imp-96309-route-m-confident-span-dip-seed-ensemble
 *
 * imp-96309 (numerical): ASSESSMENT of the imp-96288 finding-2 margin.
 * imp-96288 re-ran the imp-96248/imp-96264 synthetic q4+q5 confident-separation
 * pipeline at fine rho/span resolution and reported that the global-minimum
 * interpolated crossing span was L = 9.051 at rho = A4/A5 = 0.94, which is 0.085
 * (~0.9 percent) BELOW the rho = 1 value L = 9.136 -- so a slightly-unequal ratio
 * gave a marginally smaller confident-separation span than equal amplitudes,
 * falsifying the imp-96264 strict lower-bound-by-equal-amplitude sub-gap. imp-96288
 * FLAGGED that 0.085 margin as Monte-Carlo/interpolation-jitter-sized on a flat
 * near-equal plateau, but never re-ran it at higher draw counts or across a seed
 * ensemble. This module tests whether the rho = 0.94 dip below rho = 1 SURVIVES.
 *
 * WHAT WAS DONE (tmp/imp-96309-scratch.mjs, reproducible, simulation only). Identical
 * imp-96288 pipeline -- same w4 = 4.5324, w5 = 3.9040; same calibrated SIGMA = 0.8846
 * (R^2 = 0.71 on span 3.178); dx = 0.143 rung grids; AICc two-tone (k = 5, fixed
 * frequencies) vs best free single-tone (k = 3, w scanned [w5-0.4, w4+0.4] step 0.03);
 * total power A4^2 + A5^2 = 2 fixed; linear-interpolated first 0.90-preference crossing
 * on a span grid step 0.25 -- run in two experiments:
 *   (A) HIGHER DRAWS: NTRIALS = 20000 (10x the imp-96288 2000), single deterministic
 *       seed stream (the imp-96288 seed base 0x51ed), focused rho grid.
 *   (B) SEED ENSEMBLE: NTRIALS = 2000 (imp-96288 draw count) but E = 16 independent
 *       golden-ratio-spaced deterministic seed offsets, giving a distribution of the
 *       crossSpan at rho = 0.94 and rho = 1.00 and of their difference.
 *
 * FINDINGS (see IMP96309_* below).
 *   (1) AT 10x DRAWS THE DIP REVERSES SIGN. With 20000 draws the global-minimum crossing
 *       span moves to rho = 1.00 (L = 9.125); cross(0.94) = 9.153 now sits 0.028 ABOVE
 *       the rho = 1 value, not below it. The imp-96288 "0.94 dips 0.085 below rho=1"
 *       ordering does not reproduce at higher draw count -- the whole near-equal curve
 *       is a flat plateau L ~ 9.12 .. 9.19.
 *   (2) ACROSS THE SEED ENSEMBLE THE MARGIN AVERAGES BACK TO ZERO. The signed margin
 *       (cross(1.00) - cross(0.94), positive when 0.94 dips below rho=1) has ensemble
 *       mean = 0.0103 with across-seed sd = 0.0615, i.e. mean/sd = 0.168 -- well within
 *       one sigma of zero. The sign flips seed-to-seed (10 of 16 seeds put 0.94 below
 *       rho=1, 6 the other way), so no stable ordering exists. The imp-96288 seed base
 *       (0x51ed) is exactly the first ensemble seed and reproduces its +0.085 margin,
 *       confirming that the imp-96288 dip was that single seed's realization.
 *   (3) THE imp-96288 FINDING-2 FLAG IS VINDICATED, THE PLATEAU PICTURE HOLDS. The dip
 *       is Monte-Carlo/interpolation jitter, as imp-96288 flagged: it does NOT survive
 *       higher draws or a seed ensemble and averages back into the flat near-equal
 *       plateau. The durable imp-96288 finding-3 conclusion (crossSpan is a flat plateau
 *       ~9.1 just below Rayleigh across |log rho| <= ln 1.26, rising with imbalance
 *       outside it) is unaffected.
 *
 * VERDICT: the rho = 0.94 sub-Rayleigh dip is CONFIRMED as noise, not a real sub-plateau
 * feature. There is no amplitude ratio that buys a materially smaller confident-separation
 * span than equal amplitudes; the near-equal regime is a jitter-limited flat plateau. This
 * does NOT change any reach bound: the imp-96248 requirement (denser d_N data out to ~
 * Rayleigh scale, N ~ 5.5e6) holds regardless of the true amplitude split.
 *
 * SIMULATION ONLY. No new zeros, no Gram build. Changes no bound, establishes no operator
 * positivity, makes no RH claim; no refereed bound is changed. RH open. NO QED.
 * Synthetic tones only; no unique identification of the real conductor content or its true
 * amplitude ratio is claimed.
 *
 * @see imp-96288-route-m-confident-span-lower-bound-test.js (finding-2 margin this assesses)
 * @see imp-96264-route-m-amplitude-ratio-sensitivity.js (coarse-grid sub-gap)
 * @see imp-96248-route-m-conductor-resolvability-curve.js (equal-amplitude curve)
 */

export const IMP96309_W4 = (2 * Math.PI) / Math.log(4); // 4.53236
export const IMP96309_W5 = (2 * Math.PI) / Math.log(5); // 3.90396
export const IMP96309_RAYLEIGH_SPAN = (2 * Math.PI) / (IMP96309_W4 - IMP96309_W5); // 9.999

export const IMP96309_SETUP = Object.freeze({
  pipeline: 'identical to imp-96288: same w4/w5, SIGMA = 0.8846, dx = 0.143, AICc two-tone (k=5) vs best free single-tone (k=3), total power A4^2+A5^2 = 2 fixed, linear-interpolated 0.90-preference crossing on span grid step 0.25',
  experimentA: 'HIGHER DRAWS: NTRIALS = 20000 (10x the imp-96288 2000), single deterministic seed base 0x51ed, focused rho grid [0.84..1.12]',
  experimentB: 'SEED ENSEMBLE: NTRIALS = 2000 (imp-96288 count), E = 16 golden-ratio-spaced deterministic seed offsets, distribution of crossSpan(0.94) and crossSpan(1.00)',
  noiseSigma: 0.8846,
  script: 'tmp/imp-96309-scratch.mjs (reproducible)',
  question:
    'does the imp-96288 rho=0.94 crossing-span dip (0.085 below rho=1) survive at 10x draws and across a seed ensemble, or is it Monte-Carlo/interpolation jitter that averages back into the plateau?',
});

// Experiment A: crossing span per rho at NTRIALS = 20000 (single seed base 0x51ed).
export const IMP96309_HIGHDRAW_CURVE = Object.freeze([
  Object.freeze({ rho: 0.84, crossSpan: 9.191 }),
  Object.freeze({ rho: 0.89, crossSpan: 9.172 }),
  Object.freeze({ rho: 0.94, crossSpan: 9.153 }),
  Object.freeze({ rho: 1.00, crossSpan: 9.125 }),
  Object.freeze({ rho: 1.06, crossSpan: 9.172 }),
  Object.freeze({ rho: 1.12, crossSpan: 9.185 }),
]);

// Experiment B: 16-seed ensemble at NTRIALS = 2000. Per-seed signed margin
// (crossSpan(1.00) - crossSpan(0.94)); positive when rho=0.94 dips below rho=1.
export const IMP96309_ENSEMBLE = Object.freeze({
  seeds: 16,
  ntrials: 2000,
  cross094: Object.freeze({ mean: 9.1364, sd: 0.0486 }),
  cross100: Object.freeze({ mean: 9.1467, sd: 0.0652 }),
  margin: Object.freeze({ mean: 0.0103, sd: 0.0615, meanOverSd: 0.168 }),
  perSeedMargins: Object.freeze([
    0.085, 0.049, -0.073, -0.048, 0.052, 0.09, -0.001, -0.123,
    -0.042, 0.018, 0.029, 0.054, 0.011, 0.058, -0.051, 0.057,
  ]),
  signPos: 10, // seeds with rho=0.94 below rho=1
  signNeg: 6,  // seeds with rho=1 below rho=0.94
  seed0MatchesImp96288: true, // first seed (0x51ed) reproduces the imp-96288 +0.085 margin
});

export const IMP96309_VERDICT = Object.freeze({
  highDrawMinRho: 1.00,        // global-minimum crossing span at 20000 draws sits at rho=1, not 0.94
  highDrawDipEqMinus094: -0.028, // cross(1.00) - cross(0.94) at 20000 draws: NEGATIVE (0.94 is ABOVE rho=1)
  ensembleMarginMean: 0.0103,  // signed margin averages ~0, within one sigma (0.0615)
  ensembleMeanOverSd: 0.168,   // |mean|/sd well below 1: statistically indistinguishable from zero
  signFlipsAcrossSeeds: true,  // 10 vs 6 split: no stable ordering
  dipSurvives: false,          // does NOT survive higher draws or the seed ensemble
  imp96288Finding2Vindicated: true, // the 0.085 margin was correctly flagged as MC/interpolation jitter
  plateauPictureUnchanged: true,    // imp-96288 finding-3 (flat plateau ~9.1 below Rayleigh) holds
  reachBoundUnchanged: true,
  conclusion:
    'the imp-96288 rho=0.94 crossing-span dip (0.085 below rho=1) is CONFIRMED as Monte-Carlo/interpolation jitter: at 10x draws (20000) the global-minimum span reverts to rho=1 (9.125, with 0.94 now 0.028 ABOVE it), and across a 16-seed ensemble the signed margin averages 0.0103 +/- 0.0615 (mean/sd = 0.168, sign flipping 10 vs 6). The imp-96288 seed base is exactly the first ensemble seed and reproduces its +0.085, so the reported dip was one seed realization. imp-96288 finding-2 (margin flagged as noise-sized) is vindicated and its finding-3 flat-plateau picture is unaffected; no amplitude ratio buys a materially smaller confident-separation span. Changes no reach bound.',
});

export const IMP96309_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Simulation only: every value is a reproducible numeric from tmp/imp-96309-scratch.mjs Monte-Carlo of a synthetic q4+q5 two-tone plus matched noise, re-run at 10x draws and across a 16-seed ensemble; no new zeros, no Gram build, no bound is claimed, no operator positivity is established, and NO unique identification of the real conductor content or its amplitude ratio is claimed.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96309_ASSERTIONS = [
  {
    id: 'imp96309-frequencies-and-rayleigh',
    holds: () =>
      Math.abs(IMP96309_W4 - 4.53236) < 1e-4 &&
      Math.abs(IMP96309_W5 - 3.90396) < 1e-4 &&
      Math.abs(IMP96309_RAYLEIGH_SPAN - 9.999) < 1e-2,
    why: 'the conductor angular frequencies and their Rayleigh span reproduce imp-96248/imp-96264/imp-96288.',
  },
  {
    id: 'imp96309-highdraw-min-at-rho1-not-094',
    holds: () => {
      let minSpan = Infinity, minRho = null;
      for (const r of IMP96309_HIGHDRAW_CURVE) if (r.crossSpan < minSpan) { minSpan = r.crossSpan; minRho = r.rho; }
      const c094 = IMP96309_HIGHDRAW_CURVE.find((r) => r.rho === 0.94).crossSpan;
      const c100 = IMP96309_HIGHDRAW_CURVE.find((r) => r.rho === 1.00).crossSpan;
      return minRho === 1.00 && c094 > c100 &&
        Math.abs((c100 - c094) - IMP96309_VERDICT.highDrawDipEqMinus094) < 1e-9;
    },
    why: 'at 20000 draws the global-minimum crossing span sits at rho=1, with rho=0.94 above it -- the imp-96288 dip reverses sign at higher draw count.',
  },
  {
    id: 'imp96309-ensemble-margin-within-one-sigma',
    holds: () => {
      const m = IMP96309_ENSEMBLE.margin;
      const ratio = Math.abs(m.mean) / m.sd;
      return ratio < 1.0 && Math.abs(ratio - IMP96309_VERDICT.ensembleMeanOverSd) < 1e-2 &&
        IMP96309_ENSEMBLE.perSeedMargins.length === IMP96309_ENSEMBLE.seeds;
    },
    why: 'the across-seed signed margin (0.0103 +/- 0.0615) is within one sigma of zero, so no stable 0.94-vs-1.00 ordering exists.',
  },
  {
    id: 'imp96309-sign-flips-and-seed0-reproduces-imp96288',
    holds: () => {
      const pos = IMP96309_ENSEMBLE.perSeedMargins.filter((m) => m > 1e-9).length;
      const neg = IMP96309_ENSEMBLE.perSeedMargins.filter((m) => m < -1e-9).length;
      return pos === IMP96309_ENSEMBLE.signPos && neg === IMP96309_ENSEMBLE.signNeg &&
        pos > 0 && neg > 0 &&
        Math.abs(IMP96309_ENSEMBLE.perSeedMargins[0] - 0.085) < 1e-9 &&
        IMP96309_ENSEMBLE.seed0MatchesImp96288 === true;
    },
    why: 'the margin sign flips 10 vs 6 across seeds, and the first (imp-96288) seed reproduces the reported +0.085 dip -- the imp-96288 finding was one seed realization.',
  },
  {
    id: 'imp96309-dip-does-not-survive',
    holds: () =>
      IMP96309_VERDICT.dipSurvives === false &&
      IMP96309_VERDICT.imp96288Finding2Vindicated === true &&
      IMP96309_VERDICT.plateauPictureUnchanged === true &&
      IMP96309_VERDICT.reachBoundUnchanged === true,
    why: 'the dip does not survive higher draws or the seed ensemble; imp-96288 finding-2 (noise-sized flag) is vindicated and the plateau picture and reach bound are unchanged.',
  },
  {
    id: 'imp96309-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96309_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96309_HONEST_BANNER) &&
      /NO QED/.test(IMP96309_HONEST_BANNER),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96309_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96309-route-m-confident-span-dip-seed-ensemble assertion failed: ${a.id}`);
  }
}

export default {
  w4: IMP96309_W4,
  w5: IMP96309_W5,
  rayleighSpan: IMP96309_RAYLEIGH_SPAN,
  setup: IMP96309_SETUP,
  highDrawCurve: IMP96309_HIGHDRAW_CURVE,
  ensemble: IMP96309_ENSEMBLE,
  verdict: IMP96309_VERDICT,
  banner: IMP96309_HONEST_BANNER,
};
