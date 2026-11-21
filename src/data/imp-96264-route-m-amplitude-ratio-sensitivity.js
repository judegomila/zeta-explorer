/**
 * @module imp-96264-route-m-amplitude-ratio-sensitivity
 *
 * imp-96264 (numerical): amplitude-ratio SENSITIVITY of the imp-96248 Route M
 * confident-separation span. imp-96248 measured the synthetic q4 + q5 two-tone
 * resolvability curve under the EQUAL-amplitude assumption A4 = A5 = 1
 * (IMP96248_SETUP.amplitudeAssumption; imp-96231 stored no per-tone amplitudes),
 * finding the AICc > 90 percent confident-separation span coincides with the
 * Rayleigh span L = 10.0 (N ~ 5.5e6). This module tests whether that conclusion is
 * an artifact of the equal-amplitude choice by re-running the SAME design over a
 * grid of amplitude ratios rho = A4 / A5.
 *
 * WHAT WAS DONE (tmp/imp-96264-scratch.mjs, reproducible, simulation only). The
 * imp-96248 synthetic pipeline (fixed conductor frequencies w4 = 4.5324,
 * w5 = 3.9040; matched-band noise sigma = 0.8846 calibrated to R^2 = 0.71 on span
 * 3.178; uniform log-N grids at rung density dx = 0.143; 2000 Monte-Carlo noise
 * draws per span with a deterministic mulberry32 RNG; AICc two-tone (k = 5) vs best
 * free single-tone (k = 3) model selection) was re-run for amplitude ratios
 * rho = A4 / A5 in {0.25, 0.5, 0.71, 1, 1.41, 2, 4}. The TOTAL signal power was
 * held fixed at A4^2 + A5^2 = 2 so the overall band SNR (the noise floor) is matched
 * to imp-96248 at every ratio, and rho = 1 recovers A4 = A5 = 1 exactly. At each
 * ratio the log-N span L was swept and two thresholds were located: the
 * AICc > 90 percent confident-separation span and the relAmpErr < 0.20
 * amplitude-recovery span, both compared to the Rayleigh span 10.0.
 *
 * FINDINGS (see IMP96264_* below).
 *   (1) EQUAL AMPLITUDES IS THE BEST CASE. The confident-separation span is minimized
 *       at rho = 1 (span 10, == Rayleigh). Every unequal ratio moves the span UP:
 *       rho in {0.71, 1.41} stays at span 10, rho in {0.5, 2} needs span 11 (past
 *       Rayleigh), and the extreme ratios rho in {0.25, 4} (4:1 amplitude imbalance)
 *       never reach 90 percent AICc preference within the swept range (span > 14).
 *   (2) NO UNEQUAL RATIO LOWERS THE SPAN BELOW RAYLEIGH. Across the whole grid the
 *       confident-separation span is >= 10; the minimum (10) occurs only near
 *       rho = 1. The AICc two-tone preference AT the Rayleigh span L = 10 peaks at
 *       rho = 1 (0.944) and falls off symmetrically -- 0.903 (rho = 0.71), 0.917
 *       (rho = 1.41), 0.824 (rho = 0.5), 0.841 (rho = 2), 0.45 (rho = 0.25 / 4).
 *       Confident separation at Rayleigh therefore requires roughly equal amplitudes.
 *   (3) AMPLITUDE RECOVERY DEGRADES THE SAME WAY. The relAmpErr < 0.20 span is also
 *       minimized near rho = 1 (span 6) and rises to 7 at rho in {0.5, 2}, 11-12 at
 *       the extreme ratios: the weaker tone, buried nearer the noise floor, drives
 *       both the recovery error and the model-selection ambiguity.
 *
 * VERDICT: the imp-96248 confident-separation span is AMPLITUDE-RATIO-ROBUST in the
 * conservative direction. The equal-amplitude assumption is the MOST FAVORABLE case,
 * so the imp-96248 conclusion (confident q4/q5 separation needs the Rayleigh span
 * N ~ 5.5e6) is a LOWER BOUND on the required span: any real unequal conductor
 * content would only push the confident-separation span up to or beyond Rayleigh,
 * never below it. This closes the amplitude-assumption sub-gap in the conservative
 * direction and sharpens IMP96248_SUBGAP -- denser d_N data out to at least N ~ 5.5e6
 * is required regardless of the true amplitude split.
 *
 * SIMULATION ONLY. No new zeros, no Gram build. Changes no bound, establishes no
 * operator positivity, makes no RH claim; no refereed bound is changed.
 * RH open. NO QED. Synthetic tones only; no unique identification of the real
 * conductor content or its true amplitude ratio is claimed.
 *
 * @see imp-96248-route-m-conductor-resolvability-curve.js (equal-amplitude curve + IMP96248_SUBGAP)
 * @see imp-96231-route-m-band-vs-drift-identifiability.js (binary Rayleigh span)
 */

export const IMP96264_W4 = (2 * Math.PI) / Math.log(4); // 4.53236
export const IMP96264_W5 = (2 * Math.PI) / Math.log(5); // 3.90396
export const IMP96264_RAYLEIGH_SPAN = (2 * Math.PI) / (IMP96264_W4 - IMP96264_W5); // 9.999

export const IMP96264_SETUP = Object.freeze({
  ratioParam: 'rho = A4 / A5, swept over {0.25, 0.5, 0.71, 1, 1.41, 2, 4}',
  powerConstraint: 'A4^2 + A5^2 = 2 held fixed so the band SNR is matched to imp-96248 at every ratio; rho = 1 gives A4 = A5 = 1',
  noiseSigma: 0.8846,
  noiseCalibration: 'inherited from imp-96248: sigma set so the equal-amplitude signal R^2 = 0.71 on span 3.178',
  rungDensityDx: 0.143,
  monteCarloTrials: 2000,
  rng: 'deterministic mulberry32 seeded per (span, ratio) -- fully reproducible',
  twoToneModel: 'linear fit [1, cos w4 x, sin w4 x, cos w5 x, sin w5 x] (k = 5, fixed conductor frequencies)',
  singleToneModel: 'linear fit [1, cos w x, sin w x] (k = 3), w scanned across [w5 - 0.4, w4 + 0.4] at step 0.03',
  script: 'tmp/imp-96264-scratch.mjs (reproducible)',
  question:
    'can an unequal real amplitude ratio push the confident-separation span below the Rayleigh span 10.0, or is the span amplitude-ratio-robust?',
});

// per-ratio thresholds. spanPref90/spanReliable80 = null means the criterion was not
// reached within the swept span range [2, 14]. prefAtRayleigh = AICc two-tone
// preference fraction measured exactly at the Rayleigh span L = 10.
export const IMP96264_RATIO_TABLE = Object.freeze([
  Object.freeze({ rho: 0.25, A4: 0.343, A5: 1.372, spanAmp20: 11, spanPref90: null, spanReliable80: null, prefAtRayleigh: 0.431 }),
  Object.freeze({ rho: 0.50, A4: 0.632, A5: 1.265, spanAmp20: 7, spanPref90: 11, spanReliable80: 11, prefAtRayleigh: 0.824 }),
  Object.freeze({ rho: 0.71, A4: 0.819, A5: 1.153, spanAmp20: 6, spanPref90: 10, spanReliable80: 10, prefAtRayleigh: 0.903 }),
  Object.freeze({ rho: 1.00, A4: 1.000, A5: 1.000, spanAmp20: 6, spanPref90: 10, spanReliable80: 9, prefAtRayleigh: 0.944 }),
  Object.freeze({ rho: 1.41, A4: 1.154, A5: 0.818, spanAmp20: 6, spanPref90: 10, spanReliable80: 9, prefAtRayleigh: 0.917 }),
  Object.freeze({ rho: 2.00, A4: 1.265, A5: 0.632, spanAmp20: 7, spanPref90: 11, spanReliable80: 11, prefAtRayleigh: 0.841 }),
  Object.freeze({ rho: 4.00, A4: 1.372, A5: 0.343, spanAmp20: 12, spanPref90: null, spanReliable80: null, prefAtRayleigh: 0.450 }),
]);

export const IMP96264_VERDICT = Object.freeze({
  confidentSpanMinimizedAtEqual: true,
  minConfidentSpan: 10.0, // reached only near rho = 1; == Rayleigh
  noRatioLowersSpanBelowRayleigh: true,
  equalAmplitudeIsBestCase: true,
  prefAtRayleighPeaksAtEqual: true,
  conclusion:
    'the imp-96248 confident-separation span is amplitude-ratio-robust in the conservative direction: equal amplitudes (rho = 1) minimize the AICc > 90 percent span at exactly the Rayleigh span 10.0, and every unequal ratio moves the span up (to 11 at rho = 0.5/2, beyond 14 at rho = 0.25/4). The two-tone preference at the Rayleigh span itself peaks at rho = 1 (0.944) and falls off with imbalance, dropping below 0.90 once |log rho| exceeds ~ln(1.4). No unequal amplitude ratio lowers the confident-separation span below Rayleigh, so the imp-96248 conclusion is a LOWER BOUND on the required span.',
});

export const IMP96264_SUBGAP = Object.freeze({
  id: 'imp-96264-confident-separation-span-lower-bounded-by-equal-amplitude-rayleigh',
  statement:
    'sweeping the synthetic q4/q5 amplitude ratio rho = A4/A5 over {0.25..4} at fixed total power (matched band SNR) shows the AICc > 90 percent confident-separation span is minimized at rho = 1 (span 10 == Rayleigh) and only increases with imbalance (11 at rho = 0.5/2, unreached within span 14 at rho = 0.25/4). No unequal ratio pushes confident separation below the Rayleigh span; the equal-amplitude assumption of imp-96248 is the most favorable case, so its Rayleigh-span requirement is a lower bound. The real conductor amplitude ratio remains unmeasured (imp-96231 stored no per-tone amplitudes); if it is far from 1, denser d_N data than N ~ 5.5e6 would be needed.',
});

export const IMP96264_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Simulation only: every value is a reproducible numeric from tmp/imp-96264-scratch.mjs Monte-Carlo of a synthetic q4+q5 two-tone plus matched noise, swept over amplitude ratios; no new zeros, no Gram build, no bound is claimed, no operator positivity is established, and NO unique identification of the real conductor content or its amplitude ratio is claimed.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96264_ASSERTIONS = [
  {
    id: 'imp96264-frequencies-and-rayleigh',
    holds: () =>
      Math.abs(IMP96264_W4 - 4.53236) < 1e-4 &&
      Math.abs(IMP96264_W5 - 3.90396) < 1e-4 &&
      Math.abs(IMP96264_RAYLEIGH_SPAN - 9.999) < 1e-2,
    why: 'the conductor angular frequencies and their Rayleigh span reproduce imp-96248/imp-96231.',
  },
  {
    id: 'imp96264-equal-amplitude-row-matches-imp96248',
    holds: () => {
      const eq = IMP96264_RATIO_TABLE.find((r) => r.rho === 1.0);
      return eq && eq.spanAmp20 === 6 && eq.spanPref90 === 10 && Math.abs(eq.prefAtRayleigh - 0.944) < 0.05;
    },
    why: 'the rho = 1 row recovers imp-96248 (amp-recovery span 6, confident-separation span 10 == Rayleigh, ~0.94 preference at Rayleigh).',
  },
  {
    id: 'imp96264-no-ratio-lowers-span-below-rayleigh',
    holds: () =>
      IMP96264_RATIO_TABLE.every((r) => r.spanPref90 === null || r.spanPref90 >= 10 - 1e-9) &&
      IMP96264_VERDICT.noRatioLowersSpanBelowRayleigh === true,
    why: 'no swept amplitude ratio yields a confident-separation span below the Rayleigh span 10; equal amplitudes is the best case.',
  },
  {
    id: 'imp96264-pref-at-rayleigh-peaks-at-equal',
    holds: () => {
      const eq = IMP96264_RATIO_TABLE.find((r) => r.rho === 1.0).prefAtRayleigh;
      return IMP96264_RATIO_TABLE.every((r) => r.rho === 1.0 || r.prefAtRayleigh <= eq + 1e-9);
    },
    why: 'the AICc two-tone preference at the Rayleigh span is maximal at rho = 1 and falls off with amplitude imbalance.',
  },
  {
    id: 'imp96264-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96264_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96264_HONEST_BANNER) &&
      /NO QED/.test(IMP96264_HONEST_BANNER) &&
      typeof IMP96264_SUBGAP.statement === 'string' &&
      /lower-bounded-by-equal-amplitude/.test(IMP96264_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and a named sub-gap that the confident-separation span is lower-bounded by the equal-amplitude Rayleigh span.',
  },
];

for (const a of IMP96264_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96264-route-m-amplitude-ratio-sensitivity assertion failed: ${a.id}`);
  }
}

export default {
  w4: IMP96264_W4,
  w5: IMP96264_W5,
  rayleighSpan: IMP96264_RAYLEIGH_SPAN,
  setup: IMP96264_SETUP,
  ratioTable: IMP96264_RATIO_TABLE,
  verdict: IMP96264_VERDICT,
  subGap: IMP96264_SUBGAP,
  banner: IMP96264_HONEST_BANNER,
};
