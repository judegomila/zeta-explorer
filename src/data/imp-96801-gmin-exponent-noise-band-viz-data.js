/**
 * @module imp-96801-gmin-exponent-noise-band-viz-data
 *
 * imp-96801 (ux): import-light viz-data leaf for the imp-96755 Monte-Carlo
 * sampling-noise band on the gmin small-gap exponent fits -- reshapes the
 * eleven baked estimator rows (obs, mcMean, mcSd, band95, z, p1Steeper) into
 * a chart-ready row list plus the GUE -1/3 cube-root reference exponent.
 *
 * Every number is reused verbatim from imp-96755 (200,000-trial Monte Carlo
 * of the Weibull-3 block-extreme null); no re-fit, no new numerics.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity,
 * no RH claim; measurement conditional on GUE; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96755-gmin-exponent-noise-band.js (source Monte-Carlo bands)
 * @see imp-96683-route-m-conditioning-ceiling-ci-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96801 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { GMIN_EXPONENT_NOISE_BAND } from './imp-96755-gmin-exponent-noise-band.js';

export const IMP96801_NULL_EXPONENT = GMIN_EXPONENT_NOISE_BAND.model.nullExponent; // -1/3

// Chart-ready row list: one entry per imp-96755 estimator, carrying the
// observed fit, the null-model mean/sd, and the 95% sampling band -- baked
// verbatim from imp-96755.bands.
export const IMP96801_ROWS = Object.freeze(
  GMIN_EXPONENT_NOISE_BAND.bands.map((b) =>
    Object.freeze({
      estimator: b.estimator,
      label: `${b.estimator} (n=${b.nPts})`,
      nPts: b.nPts,
      obs: b.obs,
      mcMean: b.mcMean,
      mcSd: b.mcSd,
      band95: Object.freeze({ lo: b.band95[0], hi: b.band95[1] }),
      z: b.z,
      p1Steeper: b.p1Steeper,
      outside95: b.outside95,
    }),
  ),
);

export const IMP96801_MOST_SIGNIFICANT = Object.freeze({ ...GMIN_EXPONENT_NOISE_BAND.mostSignificant });

export const IMP96801_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every band edge, ' +
  'z-score, and observed exponent is reused verbatim from imp-96755 (200,000-trial Monte Carlo ' +
  'of the Weibull-3 block-extreme null); this module only reshapes those baked numbers into a ' +
  'chart-ready row list. No bound is claimed moved and no operator positivity is established; ' +
  'measurement conditional on GUE.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96801_ASSERTIONS = [
  {
    id: 'imp96801-eleven-rows',
    holds: () => IMP96801_ROWS.length === 11,
    why: 'the imp-96755 Monte-Carlo sweep reports exactly eleven estimator rows (full/matched/five k-restrictions/lowHalf/highHalf/two sliding trends).',
  },
  {
    id: 'imp96801-null-exponent-is-minus-one-third',
    holds: () => Math.abs(IMP96801_NULL_EXPONENT - (-1 / 3)) < 1e-12,
    why: 'the GUE sine-kernel cubic level-repulsion null fixes the block-minima exponent at exactly -1/3.',
  },
  {
    id: 'imp96801-every-row-inside-its-own-band',
    holds: () => IMP96801_ROWS.every((r) => r.band95.lo <= r.obs && r.obs <= r.band95.hi),
    why: 'imp-96755 found NO estimator lands outside its own 95% null band (anyOutside95 = false).',
  },
  {
    id: 'imp96801-mc-mean-near-null-exponent',
    // Corrected: the two slidingTrend* rows are drift SLOPES of the local
    // exponent, whose null mean is 0 (imp-96755 mcMean -0.0001), not -1/3.
    // The original every-row check against -1/3 could never hold.
    holds: () => IMP96801_ROWS.every((r) => {
      const nullMean = r.estimator.startsWith('slidingTrend') ? 0 : IMP96801_NULL_EXPONENT;
      return Math.abs(r.mcMean - nullMean) < 0.01;
    }),
    why: 'the Monte-Carlo null model is unbiased: every exponent-estimator mean sits within 0.01 of the exact -1/3 law, and every sliding-trend (drift-slope) mean within 0.01 of 0.',
  },
  {
    id: 'imp96801-full-row-is-most-significant',
    holds: () =>
      IMP96801_MOST_SIGNIFICANT.estimator === 'full' &&
      IMP96801_ROWS.find((r) => r.estimator === 'full').z === IMP96801_MOST_SIGNIFICANT.z,
    why: 'the full 15-point estimator (z=-1.77) is the most significant single deviation reported by imp-96755.',
  },
  {
    id: 'imp96801-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96801_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96801_HONEST_BANNER) &&
      /NO QED/.test(IMP96801_HONEST_BANNER),
    why: 'every viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96801_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96801-gmin-exponent-noise-band-viz-data assertion failed: ${a.id}`);
  }
}
