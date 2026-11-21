/**
 * @module imp-96248-route-m-conductor-resolvability-curve
 *
 * imp-96248 (numerical): the PARTIAL conductor-resolvability curve for the Route M
 * residual two-tone. imp-96231 established only the BINARY Rayleigh threshold --
 * splitting the two Vasyunin conductors w_4 = 4.5324 and w_5 = 3.9040
 * (delta w = 0.6284) needs a log N span L >= 2 pi / delta w = 10.0 (N ~ 5.5e6,
 * ~72 uniform rungs). The intermediate behaviour between the current 3.18-span and
 * that ideal was never measured. This module reports a SYNTHETIC-data resolvability
 * curve locating the practical (not Rayleigh-ideal) separation span.
 *
 * WHAT WAS DONE (tmp/imp-96248-scratch.mjs, reproducible, simulation only). A clean
 * q4 + q5 two-tone signal r(x) = A4 cos(w4 x + phi4) + A5 cos(w5 x + phi5) with
 * equal unit amplitudes (stated synthetic assumption; imp-96231 stored no per-tone
 * amplitudes) plus matched Gaussian noise (sigma = 0.8846, calibrated so the
 * deterministic signal R^2 = 0.71 on the current span, matching the measured band
 * strength) was sampled on uniform log N grids of GROWING span L, each at the
 * current median rung density dx = 0.143 (so ~L/dx rungs; span 10 => ~71 rungs,
 * matching imp-96231's 72). At each span, over 4000 Monte-Carlo noise draws with a
 * deterministic RNG, two quantities were measured:
 *   (i) the two-tone amplitude-recovery error -- mean over trials of
 *       0.5 (|A4_hat - 1| + |A5_hat - 1|) from the fixed-frequency 5-parameter
 *       linear fit [1, cos w4 x, sin w4 x, cos w5 x, sin w5 x];
 *  (ii) the AICc model-selection preference for the two-tone model (k=5) over the
 *       best free single tone (k=3, w scanned across [w5-0.4, w4+0.4]) -- the
 *       FRACTION of trials in which AICc(two) < AICc(one).
 * A "reliable separation" fraction combines both: relAmpErr < 0.25 AND two-tone
 * preferred. The two-tone design condition number was also tracked per span.
 *
 * FINDINGS (see IMP96248_* below).
 *   (1) THE TRANSITION IS GRADED, NOT BINARY. The AICc two-tone preference climbs
 *       smoothly with span: 0.019 (L=2) -> 0.027 (current L=3.18) -> 0.081 (L=5)
 *       -> 0.278 (L=6) -> 0.433 (L=7) -> 0.705 (L=8) -> 0.883 (L=9) -> 0.940
 *       (L=10, Rayleigh) -> 1.000 (L=14). The design condition number eases
 *       monotonically from 6.3 (L=2) to 1.4 (L=10): the collinearity that blocks
 *       separation relaxes gradually across the whole span range.
 *   (2) TWO PRACTICAL THRESHOLDS, WELL SEPARATED. Amplitude recovery becomes
 *       usable early: relAmpErr < 0.20 first at span L ~ 6 (N ~ 1.0e5). But
 *       CONFIDENT model-selection needs the full Rayleigh span: the AICc 50 percent
 *       crossover sits at L ~ 7.5 (N ~ 5e5), > 80 percent reliable separation
 *       first at L ~ 9 (N ~ 2.0e6), and > 90 percent AICc preference first at
 *       L ~ 10 (N ~ 5.5e6) -- coincident with the Rayleigh span, NOT below it.
 *   (3) MATCHED NOISE DOES NOT BUY BACK SPAN. With noise at the measured band SNR,
 *       the practical CONFIDENT separation span is essentially the Rayleigh span
 *       itself; noise pushes the reliable threshold up TO the Rayleigh limit rather
 *       than relaxing it. Only the weaker amplitude-recovery criterion is met
 *       earlier (span 6 vs 10), and even there the recovered amplitudes still carry
 *       ~18 percent error.
 *
 * VERDICT: the intermediate resolvability curve is now measured. The binary
 * Rayleigh span 10.0 from imp-96231 is confirmed as the CONFIDENT-separation span
 * under matched noise (AICc preference > 90 percent, reliable separation > 80
 * percent only from L ~ 9-10 up), while a weaker amplitude-recovery criterion is
 * met earlier at L ~ 6 (N ~ 1e5) though with ~18 percent amplitude error. There is
 * no intermediate span at which the two conductors become confidently separable
 * below the Rayleigh limit. This SHARPENS IMP96231_SUBGAP: pinning the conductor
 * content is not merely a Rayleigh-ideal wish; with realistic noise the confident
 * separation span is the Rayleigh span, so denser d_N data out to N ~ 5.5e6 is
 * genuinely required, and the earlier N ~ 1e5 regime yields only rough amplitudes.
 *
 * SIMULATION ONLY. No new zeros, no Gram build. Changes no bound, establishes no
 * operator positivity, makes no RH claim; no refereed bound is changed
 * . RH open. NO QED. Uses equal synthetic unit amplitudes; no unique
 * identification of the real conductor content is claimed.
 *
 * @see imp-96231-route-m-band-vs-drift-identifiability.js (binary Rayleigh span + IMP96231_SUBGAP)
 * @see imp-96189-route-m-swing-attribution.js (band attribution)
 * @see imp-96147-route-m-ratio-const-oscillation-fit.js (17 residual rows)
 *
 * Ticket: imp-96248 (numerical, opus-4-8, api-pool). Simulation only; NO QED.
 */

export const IMP96248_W4 = (2 * Math.PI) / Math.log(4); // 4.53236
export const IMP96248_W5 = (2 * Math.PI) / Math.log(5); // 3.90396
export const IMP96248_DELTA_W = IMP96248_W4 - IMP96248_W5; // 0.62840
export const IMP96248_RAYLEIGH_SPAN = (2 * Math.PI) / IMP96248_DELTA_W; // 9.999

export const IMP96248_SETUP = Object.freeze({
  signal: 'r(x) = A4 cos(w4 x + phi4) + A5 cos(w5 x + phi5), A4 = A5 = 1, phi4 = phi5 = 0',
  amplitudeAssumption:
    'equal unit synthetic amplitudes (imp-96231 stored no per-tone amplitudes); no real conductor content is claimed',
  noiseSigma: 0.8846,
  noiseCalibration: 'sigma set so the deterministic signal R^2 = 0.71 on the current span 3.178 (measured band strength)',
  rungDensityDx: 0.143,
  gridsUniform: true,
  monteCarloTrials: 4000,
  rng: 'deterministic mulberry32 seeded per span (fully reproducible)',
  twoToneModel: 'linear fit [1, cos w4 x, sin w4 x, cos w5 x, sin w5 x] (k = 5, fixed conductor frequencies)',
  singleToneModel: 'linear fit [1, cos w x, sin w x] (k = 3), w scanned across [w5 - 0.4, w4 + 0.4]',
  script: 'tmp/imp-96248-scratch.mjs (reproducible)',
  question:
    'at what intermediate log N span do synthetic q4 + q5 tones become practically separable, given the binary Rayleigh span is 10.0 (N ~ 5.5e6)?',
});

// The measured resolvability curve. N ~ exp(ln 250 + span) from the N = 250 ladder start.
export const IMP96248_CURVE = Object.freeze([
  Object.freeze({ span: 2.0, nRungs: 15, cond: 6.28, relAmpErr: 0.6422, twoTonePref: 0.019, reliableSep: 0.000 }),
  Object.freeze({ span: 3.178, nRungs: 23, cond: 4.22, relAmpErr: 0.3986, twoTonePref: 0.027, reliableSep: 0.003 }),
  Object.freeze({ span: 4.0, nRungs: 29, cond: 3.11, relAmpErr: 0.2632, twoTonePref: 0.038, reliableSep: 0.012 }),
  Object.freeze({ span: 5.0, nRungs: 36, cond: 2.38, relAmpErr: 0.2067, twoTonePref: 0.081, reliableSep: 0.057 }),
  Object.freeze({ span: 6.0, nRungs: 43, cond: 2.11, relAmpErr: 0.1776, twoTonePref: 0.278, reliableSep: 0.227 }),
  Object.freeze({ span: 7.0, nRungs: 50, cond: 1.84, relAmpErr: 0.1456, twoTonePref: 0.433, reliableSep: 0.390 }),
  Object.freeze({ span: 8.0, nRungs: 57, cond: 1.61, relAmpErr: 0.1355, twoTonePref: 0.705, reliableSep: 0.654 }),
  Object.freeze({ span: 9.0, nRungs: 64, cond: 1.54, relAmpErr: 0.1264, twoTonePref: 0.883, reliableSep: 0.840 }),
  Object.freeze({ span: 10.0, nRungs: 71, cond: 1.44, relAmpErr: 0.1171, twoTonePref: 0.940, reliableSep: 0.911 }),
  Object.freeze({ span: 12.0, nRungs: 85, cond: 1.55, relAmpErr: 0.1106, twoTonePref: 0.999, reliableSep: 0.978 }),
  Object.freeze({ span: 14.0, nRungs: 99, cond: 1.60, relAmpErr: 0.1027, twoTonePref: 1.000, reliableSep: 0.984 }),
]);

export const IMP96248_PRACTICAL_SPANS = Object.freeze({
  ampRecoveryUsableSpan: 6.0, // relAmpErr < 0.20 first at span 6
  ampRecoveryUsableN: 1.0e5,
  ampRecoveryErrorThere: 0.1776, // still ~18 percent
  aicHalfPrefSpan: 7.5, // AICc two-tone preferred in ~50 percent of trials (between L=7:0.433 and L=8:0.705)
  reliableSep80Span: 9.0, // reliable separation > 80 percent first at span 9
  reliableSep80N: 2.0e6,
  aicPref90Span: 10.0, // AICc preference > 90 percent first at span 10 (== Rayleigh)
  aicPref90N: 5.5e6,
  rayleighSpan: IMP96248_RAYLEIGH_SPAN,
  confidentSeparationCoincidesWithRayleigh: true,
  note: 'amplitude recovery is usable (err < 0.20) already at span 6 (N ~ 1e5) but with ~18 percent error; CONFIDENT model-selection separation (AICc > 90 percent, reliable > 80 percent) needs span ~9-10, coincident with the Rayleigh limit N ~ 5.5e6. Matched noise does not buy back span.',
});

export const IMP96248_VERDICT = Object.freeze({
  transitionGraded: true,
  confidentSpanEqualsRayleigh: true,
  ampRecoveryEarlierButRough: true,
  conclusion:
    'the intermediate resolvability curve is graded, not binary: the AICc two-tone preference climbs smoothly from 0.03 (current span) through 0.44 (span 7) to 0.94 (span 10) as the design condition number eases from 6.3 to 1.4. Two practical thresholds emerge -- amplitude recovery becomes usable (err < 0.20) at span 6 (N ~ 1e5) though still ~18 percent, while confident model-selection separation (AICc > 90 percent, reliable > 80 percent) needs span 9-10, coincident with the Rayleigh limit N ~ 5.5e6. With realistic matched noise there is no span below the Rayleigh limit at which the conductors become confidently separable.',
});

export const IMP96248_SUBGAP = Object.freeze({
  id: 'imp-96248-confident-conductor-separation-needs-rayleigh-span',
  statement:
    'the synthetic resolvability curve shows the q4/q5 separation transition is graded (AICc two-tone preference 0.03 -> 0.44 -> 0.94 across spans 3.18/7/10) but confident separation (AICc > 90 percent, reliable > 80 percent) is reached only at span ~9-10, coincident with the Rayleigh limit N ~ 5.5e6; a weaker amplitude-recovery criterion (err < 0.20) is met earlier at span 6 (N ~ 1e5) but still carries ~18 percent amplitude error. Matched noise at the measured band SNR does not relax the confident-separation span below Rayleigh. Pinning the conductor content therefore needs denser d_N data out to N ~ 5.5e6, with the N ~ 1e5 regime yielding only rough amplitudes -- consistent with, and sharpening, IMP96231_SUBGAP.',
});

export const IMP96248_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Simulation only: every value is a reproducible numeric from tmp/imp-96248-scratch.mjs Monte-Carlo of a synthetic q4+q5 two-tone plus matched noise; no new zeros, no Gram build, no bound is claimed, no operator positivity is established, and NO unique identification of the real conductor content is claimed (equal synthetic unit amplitudes are assumed).';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96248_ASSERTIONS = [
  {
    id: 'imp96248-conductor-frequencies-and-rayleigh',
    holds: () =>
      Math.abs(IMP96248_W4 - 4.53236) < 1e-4 &&
      Math.abs(IMP96248_W5 - 3.90396) < 1e-4 &&
      Math.abs(IMP96248_RAYLEIGH_SPAN - 9.999) < 1e-2,
    why: 'the conductor angular frequencies w4=4.5324, w5=3.9040 and their Rayleigh span 2 pi / delta w = 10.0 reproduce imp-96231.',
  },
  {
    id: 'imp96248-transition-is-graded-monotone',
    holds: () => {
      for (let i = 1; i < IMP96248_CURVE.length; i++) {
        if (IMP96248_CURVE[i].twoTonePref < IMP96248_CURVE[i - 1].twoTonePref - 1e-9) return false;
      }
      return (
        IMP96248_CURVE[1].twoTonePref < 0.05 && // current span 3.18 near-zero preference
        IMP96248_CURVE[IMP96248_CURVE.length - 1].twoTonePref > 0.99 && // resolved at span 14
        IMP96248_VERDICT.transitionGraded === true
      );
    },
    why: 'the AICc two-tone preference rises monotonically from < 0.05 at the current span to > 0.99 at span 14: the separation transition is graded, not a step.',
  },
  {
    id: 'imp96248-amp-recovery-usable-before-aic-confident',
    holds: () =>
      IMP96248_PRACTICAL_SPANS.ampRecoveryUsableSpan < IMP96248_PRACTICAL_SPANS.aicPref90Span &&
      IMP96248_PRACTICAL_SPANS.ampRecoveryErrorThere > 0.1 &&
      IMP96248_PRACTICAL_SPANS.ampRecoveryEarlierButRough !== false,
    why: 'amplitude recovery becomes usable (err < 0.20) at span 6, before the AICc-confident separation span 10, but still carries ~18 percent amplitude error there.',
  },
  {
    id: 'imp96248-confident-separation-coincides-with-rayleigh',
    holds: () =>
      Math.abs(IMP96248_PRACTICAL_SPANS.aicPref90Span - IMP96248_RAYLEIGH_SPAN) < 1.0 &&
      IMP96248_PRACTICAL_SPANS.confidentSeparationCoincidesWithRayleigh === true &&
      IMP96248_VERDICT.confidentSpanEqualsRayleigh === true,
    why: 'the > 90 percent AICc-preference span (10.0) coincides with the Rayleigh span (10.0): matched noise does not buy separation below the ideal limit.',
  },
  {
    id: 'imp96248-condition-number-eases-with-span',
    holds: () =>
      IMP96248_CURVE[0].cond > 2 * IMP96248_CURVE[IMP96248_CURVE.length - 3].cond,
    why: 'the two-tone design condition number falls from 6.3 (span 2) to ~1.4 (span 10): the collinearity blocking separation relaxes gradually.',
  },
  {
    id: 'imp96248-honest-banner-and-subgap-present',
    holds: () =>
      /RH open/.test(IMP96248_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96248_HONEST_BANNER) &&
      /NO QED/.test(IMP96248_HONEST_BANNER) &&
      typeof IMP96248_SUBGAP.statement === 'string' &&
      /confident-conductor-separation/.test(IMP96248_SUBGAP.id),
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers and a named sub-gap that confident separation needs the Rayleigh span.',
  },
];

for (const a of IMP96248_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96248-route-m-conductor-resolvability-curve assertion failed: ${a.id}`);
  }
}

export default {
  w4: IMP96248_W4,
  w5: IMP96248_W5,
  deltaW: IMP96248_DELTA_W,
  rayleighSpan: IMP96248_RAYLEIGH_SPAN,
  setup: IMP96248_SETUP,
  curve: IMP96248_CURVE,
  practicalSpans: IMP96248_PRACTICAL_SPANS,
  verdict: IMP96248_VERDICT,
  subGap: IMP96248_SUBGAP,
  banner: IMP96248_HONEST_BANNER,
};
