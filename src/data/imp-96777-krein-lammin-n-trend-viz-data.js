/**
 * @module imp-96777-krein-lammin-n-trend-viz-data
 *
 * imp-96777 (ux): import-light viz-data leaf for the imp-96749 IMP96749_LADDER
 * N-trend of lambda_min(T_a[sigma_2]) (Rayleigh-Ritz upper floor, Route I Krein
 * Toeplitz operator) at 2a in {1.00, 1.05, ln 3}, over N=20..76, with the
 * double-precision-trustworthy cutoff band (N<=~52-60, condB<=~1e13) marked.
 *
 * imp-96749 measured the floor but shipped no visualization: this module
 * reshapes IMP96749_LADDER + IMP96749_NS + IMP96749_TRUSTED (all imported
 * directly, no transcription) into per-curve chart-ready series (normalised
 * to their own N=20 value so all three curves share one y-axis) and a
 * trusted/corrupted N-band marker.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * the uniform-in-N spectral gap remains the open analyticObstruction;
 * interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96749-krein-lammin-N-trend-measurement.js (source ladder + verdict)
 * @see imp-96772-krein-lammin-double-double-recompute.js (extended-precision recompute REFUTING
 *   the "red band = conditioning noise" reading below; IMP96777_CORRECTION_IMP96772)
 * @see imp-96701-frobenius-majorant-eleven-rung-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96777 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96749_LADDER,
  IMP96749_NS,
  IMP96749_CONDB,
  IMP96749_TRUSTED,
  IMP96749_VERDICT,
} from './imp-96749-krein-lammin-N-trend-measurement.js';
import { IMP96772_VERDICT } from './imp-96772-krein-lammin-double-double-recompute.js';

export const IMP96777_NS = IMP96749_NS;

const COLOR_BY_KEY = Object.freeze({
  '2a=1.00': '#38bdf8',
  '2a=1.05': '#facc15',
  '2a=ln3': '#4ade80',
});

// Chart-ready series list, one per 2a rung, each normalised to its own N=20
// value so the three curves (magnitudes ~8.3 / ~2.1 / ~0.57) share one axis.
export const IMP96777_SERIES = Object.freeze(
  Object.entries(IMP96749_LADDER).map(([key, values]) =>
    Object.freeze({
      key,
      label: `lambda_min(T_a[sigma_2]), ${key}`,
      color: COLOR_BY_KEY[key],
      values,
      normalizedValues: Object.freeze(values.map((v) => v / values[0])),
    }),
  ),
);

// Trusted/corrupted N-band boundary (index-based, on the shared IMP96777_NS grid).
export const IMP96777_TRUSTED_BAND = Object.freeze({
  trustedNmax: IMP96749_TRUSTED.trustedNmax,
  wallOnsetN: 60,
  trustedIdxMax: IMP96777_NS.indexOf(IMP96749_TRUSTED.trustedNmax),
  wallOnsetIdx: IMP96777_NS.indexOf(60),
  condBWall: IMP96749_TRUSTED.condBWall,
  condBAtTrustedMax: IMP96749_CONDB.find((r) => r.N === IMP96749_TRUSTED.trustedNmax).condB,
  condBAtWallOnset: IMP96749_CONDB.find((r) => r.N === 60).condB,
});

export const IMP96777_VERDICT_SUMMARY = Object.freeze({
  answer: IMP96749_VERDICT.answer,
  decrementReaccelIsConditioningArtifact: IMP96749_VERDICT.decrementReaccelIsConditioningArtifact,
  uniformNGapSettled: IMP96749_VERDICT.uniformNGapSettled,
  qed: IMP96749_VERDICT.qed,
});

// imp-96772 recomputed this same ladder at extended precision (mp.dps=40) past the condB~1e13
// wall marked below and found the wall does NOT corrupt the floor: double- and extended-precision
// solves agree to < 1e-6 up to condB=1.1e16 (N=100), so the red-band re-acceleration this page
// calls "numerical noise, not evidence the gap is closing" is instead a real (t-truncation) effect.
export const IMP96777_CORRECTION_IMP96772 = Object.freeze({
  ticket: 'imp-96772',
  note: 'the imp-96749 "red band = Gram-conditioning noise" reading below is REFUTED: an extended-precision (dps=40) recompute reproduces the double-precision floor to < 1e-6 across the entire ladder up to condB=1.1e16 (N=100) -- the wall does not corrupt the floor. The descent past N=60 is a real t-truncation effect (fixed T=800 under-resolving the positive t-tail), not numerical noise, confirming imp-96768 from the Legendre side.',
  floorCorruptionWallExists: IMP96772_VERDICT.floorCorruptionWallExists,
  imp96749Finding3ConditioningReadingRefuted: IMP96772_VERDICT.imp96749Finding3ConditioningReadingRefuted,
  qed: IMP96772_VERDICT.qed,
});

export const IMP96777_HONEST_BANNER =
  'Measurement only: this is a Rayleigh-Ritz UPPER floor, not an operator positivity proof. ' +
  'The uniform-in-N spectral gap lambda_min(T_a[sigma_2]) >= c > 0 stays OPEN past the ' +
  'double-precision-trustworthy window; interval-rigorous certificate reach stays 2a<=0.96; ' +
  'RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96777_ASSERTIONS = [
  {
    id: 'imp96777-three-series-eight-rungs',
    holds: () =>
      IMP96777_SERIES.length === 3 &&
      IMP96777_SERIES.every((s) => s.values.length === IMP96777_NS.length && s.normalizedValues.length === IMP96777_NS.length),
    why: 'the viz must carry all three 2a rungs (1.00, 1.05, ln3) over the full eight-point N=20..76 ladder, with no dropped points.',
  },
  {
    id: 'imp96777-normalized-start-at-one-and-decreasing',
    holds: () =>
      IMP96777_SERIES.every((s) =>
        s.normalizedValues[0] === 1 && s.normalizedValues.every((v, i) => i === 0 || v <= s.normalizedValues[i - 1]),
      ),
    why: 'each normalised curve starts at 1 (its own N=20 value) and is monotone non-increasing, matching the imp-96749 monotone-decreasing floor.',
  },
  {
    id: 'imp96777-trusted-band-inside-ladder-and-before-wall',
    holds: () =>
      IMP96777_TRUSTED_BAND.trustedIdxMax >= 0 &&
      IMP96777_TRUSTED_BAND.wallOnsetIdx > IMP96777_TRUSTED_BAND.trustedIdxMax &&
      IMP96777_TRUSTED_BAND.condBAtTrustedMax < IMP96777_TRUSTED_BAND.condBWall &&
      IMP96777_TRUSTED_BAND.condBAtWallOnset > IMP96777_TRUSTED_BAND.condBWall,
    why: 'the trusted-window boundary (N<=52) must sit strictly before the corruption-onset rung (N=60) on the shared N grid, with condB crossing the 1e13 wall exactly in between.',
  },
  {
    id: 'imp96777-imp96772-correction-present',
    holds: () =>
      IMP96777_CORRECTION_IMP96772.floorCorruptionWallExists === false &&
      IMP96777_CORRECTION_IMP96772.imp96749Finding3ConditioningReadingRefuted === true &&
      IMP96777_CORRECTION_IMP96772.qed === false,
    why: 'this page must not go on displaying the superseded imp-96749 "conditioning noise" reading of the red band without the imp-96772 correction (wall does not corrupt the floor; descent is real t-truncation).',
  },
  {
    id: 'imp96777-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96777_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96777_HONEST_BANNER) &&
      /NO QED/.test(IMP96777_HONEST_BANNER) &&
      IMP96777_VERDICT_SUMMARY.qed === false,
    why: 'every Route I viz surface carries the RH-open / PT-Lambda / NO-QED markers, matching the source verdict.',
  },
];

for (const a of IMP96777_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96777-krein-lammin-n-trend-viz-data assertion failed: ${a.id}`);
  }
}
