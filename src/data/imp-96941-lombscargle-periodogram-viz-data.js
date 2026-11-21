/**
 * @module imp-96941-lombscargle-periodogram-viz-data
 *
 * imp-96941 (ux): import-light viz-data leaf for the imp-96915 Lomb-Scargle
 * periodogram of the 21-rung Burnol-ratio oscillatory remainder -- reshapes
 * the claimed-frequency/alias-image pair and the genuine low-frequency peak
 * into a chart-ready periodogram series (frequency vs normalized power), plus
 * a stability strip (leave-one-out mean/range, half-splits, parity subsamples)
 * for the genuine peak.
 *
 * imp-96915 exported the raw claimed/alias/genuine-peak/stability objects but
 * shipped no chart-ready reshaping: this leaf imports those literals verbatim
 * (no re-derivation) and adds a three-point periodogram series (claimed w,
 * its alias image, the genuine peak) plus a stability-estimate series.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96915-burnol-oscillation-frequency-periodogram.js (source claimed/alias/genuine-peak/stability + verdict)
 * @see imp-96940-sigma-crossing-ladder-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96941 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96915_CLAIMED,
  IMP96915_GENUINE_PEAK,
  IMP96915_STABILITY,
  IMP96915_NYQUIST_W,
  IMP96915_PEAK_FAP,
  IMP96915_VERDICT,
} from './imp-96915-burnol-oscillation-frequency-periodogram.js';

// chart-ready periodogram series: three points on a shared frequency axis --
// the claimed (unresolvable, above-Nyquist) frequency, its resolvable alias
// image (identical power), and the genuine dominant peak.
export const IMP96941_PERIODOGRAM_SERIES = Object.freeze([
  {
    label: 'claimed w=3.85 (above Nyquist)',
    w: IMP96915_CLAIMED.w,
    power: IMP96915_CLAIMED.powerAtClaimed,
    resolvable: false,
    isAlias: false,
  },
  {
    label: 'alias image 2pi-3.85',
    w: +IMP96915_CLAIMED.aliasW.toFixed(4),
    power: IMP96915_CLAIMED.powerAtAlias,
    resolvable: true,
    isAlias: true,
  },
  {
    label: 'genuine peak w=0.70',
    w: IMP96915_GENUINE_PEAK.w,
    power: +IMP96915_GENUINE_PEAK.power.toFixed(4),
    resolvable: true,
    isAlias: false,
  },
]);

// Nyquist reference line (rad/sample) separating resolvable from unresolvable frequencies
export const IMP96941_NYQUIST_LINE = IMP96915_NYQUIST_W;

// chart-ready stability series for the genuine peak: named estimates vs the full-ladder w
export const IMP96941_STABILITY_SERIES = Object.freeze([
  { label: 'full ladder', w: IMP96915_GENUINE_PEAK.w },
  { label: 'LOO mean', w: IMP96915_STABILITY.looMean },
  { label: 'LOO min', w: IMP96915_STABILITY.looMin },
  { label: 'LOO max', w: IMP96915_STABILITY.looMax },
  { label: 'first-14 half-split', w: IMP96915_STABILITY.first14 },
  { label: 'last-14 half-split', w: IMP96915_STABILITY.last14 },
  { label: 'even subsample', w: IMP96915_STABILITY.even },
  { label: 'odd subsample (aliased)', w: IMP96915_STABILITY.odd },
]);

export const IMP96941_HONEST_BANNER =
  'Presentation only: the periodogram series shows the imp-96832 claimed frequency w=3.85 sits ' +
  'above the Nyquist frequency pi=3.1416 and shares identical power with its resolvable alias image ' +
  '(the signature of an above-Nyquist alias, not a real spectral line), while the genuine dominant ' +
  'peak sits at w=0.70 (~13x stronger) and is stable under leave-one-out and half-split subsampling. ' +
  'A measurement/decision only; the qualitative VIF>1 conclusion is untouched; interval-rigorous ' +
  'certificate reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP96941_ASSERTIONS array below, not at import time.
export const IMP96941_VALIDATION = Object.freeze({
  threePeriodogramPoints: IMP96941_PERIODOGRAM_SERIES.length === 3,
  claimedAboveNyquist: IMP96941_PERIODOGRAM_SERIES[0].w > IMP96941_NYQUIST_LINE,
  aliasBelowNyquist: IMP96941_PERIODOGRAM_SERIES[1].w < IMP96941_NYQUIST_LINE,
  claimedAndAliasSamePower:
    Math.abs(IMP96941_PERIODOGRAM_SERIES[0].power - IMP96941_PERIODOGRAM_SERIES[1].power) < 1e-9,
  genuinePeakDominates:
    IMP96941_PERIODOGRAM_SERIES[2].power > 10 * IMP96941_PERIODOGRAM_SERIES[0].power,
  eightStabilityPoints: IMP96941_STABILITY_SERIES.length === 8,
  stabilityBoundedNearPeak: IMP96941_STABILITY_SERIES.slice(0, 6).every(
    (row) => row.w > 0.6 && row.w < 0.75,
  ),
  oddSubsampleIsOutlier:
    IMP96941_STABILITY_SERIES[7].w > 1.5, // decimation-aliased, far from the 0.7 cluster
  peakFapAboveFiveSigma: IMP96915_PEAK_FAP > 0.05,
  matchesSourceVerdict: IMP96915_VERDICT.qed === false && IMP96915_VERDICT.w385IsSamplingArtifact === true,
  honestBannerPresent:
    /RH open/.test(IMP96941_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96941_HONEST_BANNER) &&
    /NO QED/.test(IMP96941_HONEST_BANNER),
});

// imp-96397: registers the IMP96941_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96941_ASSERTIONS = [
  {
    id: 'imp96941-three-periodogram-points-present',
    description: 'the periodogram series carries exactly the claimed, alias, and genuine-peak points',
    holds: () => IMP96941_VALIDATION.threePeriodogramPoints,
  },
  {
    id: 'imp96941-claimed-freq-above-nyquist-alias-below',
    description: 'the claimed frequency sits above Nyquist while its alias image sits below it',
    holds: () => IMP96941_VALIDATION.claimedAboveNyquist && IMP96941_VALIDATION.aliasBelowNyquist,
  },
  {
    id: 'imp96941-claimed-and-alias-share-power',
    description: 'the claimed frequency and its alias image carry identical periodogram power',
    holds: () => IMP96941_VALIDATION.claimedAndAliasSamePower,
  },
  {
    id: 'imp96941-genuine-peak-dominates-claimed',
    description: 'the genuine peak power exceeds 10x the claimed/alias power',
    holds: () => IMP96941_VALIDATION.genuinePeakDominates,
  },
  {
    id: 'imp96941-eight-stability-points-present',
    description: 'the stability series carries all eight named estimates',
    holds: () => IMP96941_VALIDATION.eightStabilityPoints,
  },
  {
    id: 'imp96941-stability-bounded-near-peak',
    description: 'the full-ladder/LOO/half-split estimates cluster tightly around the 0.70 peak',
    holds: () => IMP96941_VALIDATION.stabilityBoundedNearPeak,
  },
  {
    id: 'imp96941-odd-subsample-is-decimation-outlier',
    description: 'the odd-parity subsample sits far from the 0.70 cluster, consistent with decimation aliasing',
    holds: () => IMP96941_VALIDATION.oddSubsampleIsOutlier,
  },
  {
    id: 'imp96941-peak-fap-above-five-percent',
    description: 'even the genuine peak is not formally significant at the 5% level (FAP > 0.05)',
    holds: () => IMP96941_VALIDATION.peakFapAboveFiveSigma,
  },
  {
    id: 'imp96941-matches-source-verdict',
    description: 'the leaf agrees with the imp-96915 verdict (sampling artifact, no QED)',
    holds: () => IMP96941_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp96941-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96941_VALIDATION.honestBannerPresent,
  },
];
