/**
 * @module imp-95888-rcap-window-bottom-viz-data
 * @fileoverview imp-95888 -- lightweight viz-data module charting the imp-95722
 *   derived r_cap(T) envelope across its full reach: the six imp-95710 measured
 *   heights (T = 1e4..5e5, ~1.7 decades) plus a fine log10-T grid bridging the
 *   ~6.8-decade gap up to the imp-95519 window bottom T = 3.0e12 -- the only
 *   in-repo lever that reaches that far (no verified-zero table extends there;
 *   see src/data/glossary.js "HONEST SUB-GAP" entry).
 *
 *   Reuses the imp-95722 closed forms verbatim (same reuse pattern as
 *   imp-95805 / imp-95818 / imp-95897): the exported selbergConstant and
 *   offsetC0 pin the SAME envelope, recomputed here at a fine grid purely for
 *   chart resolution -- not a re-derivation, no new cited input, no heavy
 *   imports (no zeros bundle, no sibling data beyond imp-95722 itself).
 *
 *   @see imp-95722-number-variance-ratio-window-bottom-bound.js (the derived envelope this charts)
 */

import { IMP95722_NUMBER_VARIANCE_RATIO_WINDOW_BOTTOM_BOUND } from './imp-95722-number-variance-ratio-window-bottom-bound.js';

const { rows: ROWS, windowBottom, selbergConstant, offsetC0 } =
  IMP95722_NUMBER_VARIANCE_RATIO_WINDOW_BOTTOM_BOUND;

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const logLog = (T) => Math.log(Math.log(T / TWO_PI));
// Same closed form as imp-95722's cappedRatio -- verbatim reuse, not a new derivation.
const cappedRatio = (T) => (selbergConstant * logLog(T) + offsetC0) / gueNumberVariance(envelopeCount(T));

// Fine log10-T grid spanning the measured ceiling to the window bottom, purely for chart
// resolution (the six measured points alone would leave a visually empty ~6.8-decade gap).
const GRID_POINTS = 40;
const log10Min = Math.log10(ROWS[ROWS.length - 1].Tc);
const log10Max = Math.log10(windowBottom.T);
export const IMP95888_ENVELOPE_CURVE = Object.freeze(
  Array.from({ length: GRID_POINTS + 1 }, (_, i) => {
    const log10T = log10Min + ((log10Max - log10Min) * i) / GRID_POINTS;
    const T = 10 ** log10T;
    return Object.freeze({ T, log10T, rCap: cappedRatio(T) });
  }),
);

// The six imp-95710 measured heights, both the true ratio and the envelope at that height.
export const IMP95888_MEASURED_POINTS = Object.freeze(
  ROWS.map((r) =>
    Object.freeze({
      T: r.Tc,
      log10T: Math.log10(r.Tc),
      rCap: r.cappedRatio,
      rMeasured: r.varRatioMeasuredOverGUE,
    }),
  ),
);

export const IMP95888_LANDMARKS = Object.freeze([
  Object.freeze({
    name: 'measured_ceiling',
    label: 'imp-95710 measured ceiling',
    T: ROWS[ROWS.length - 1].Tc,
    log10T: Math.log10(ROWS[ROWS.length - 1].Tc),
    rCap: ROWS[ROWS.length - 1].cappedRatio,
  }),
  Object.freeze({
    name: 'window_bottom',
    label: 'imp-95519 window bottom',
    T: windowBottom.T,
    log10T: Math.log10(windowBottom.T),
    rCap: windowBottom.cappedRatio,
  }),
]);

export const IMP95888_GAP_DECADES = +(
  Math.log10(windowBottom.T) - Math.log10(ROWS[ROWS.length - 1].Tc)
).toFixed(4);

export const IMP95888_CAVEAT_BANNER =
  'HONEST STATUS: r_cap(T) is a DERIVED upper envelope (r(T) in (0, r_cap(T)]) from the ' +
  'imp-95722 closed forms, not a measurement -- the curve across the ~' +
  `${IMP95888_GAP_DECADES.toFixed(1)}-decade gap from the imp-95710 measured ceiling to the ` +
  'imp-95519 window bottom is analytic bridging for chart resolution, not new data. It is the ' +
  'only in-repo lever that reaches T=3.0e12 at all: no verified-zero table extends anywhere ' +
  'near that height. Introduces no new cited input and changes no bound; no refereed bound is changed' +
  '. C0-envelope-safety is ALSO only a FINITE ' +
  'super-window, not an all-heights guarantee: imp-95921 shows offset(T) drifts upward ' +
  'without bound and crosses C0 at a finite height T_x in [~5.8e17, ~1.36e28] -- comfortably ' +
  'above 3.0e12 but not beyond it. No QED.';

export const IMP95888_RCAP_WINDOW_BOTTOM_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95888-curve-spans-measured-ceiling-to-window-bottom',
    description: 'the fine grid starts at the measured ceiling and ends at the window bottom',
    holds: () =>
      Math.abs(IMP95888_ENVELOPE_CURVE[0].T - ROWS[ROWS.length - 1].Tc) < 1 &&
      Math.abs(IMP95888_ENVELOPE_CURVE[IMP95888_ENVELOPE_CURVE.length - 1].T - windowBottom.T) < 10,
  },
  {
    id: 'imp95888-curve-rcap-monotone-decreasing',
    description: 'the fine-grid r_cap curve is monotonically non-increasing (reproduces imp-95722 finding 1)',
    holds: () =>
      IMP95888_ENVELOPE_CURVE.every(
        (p, i) => i === 0 || p.rCap <= IMP95888_ENVELOPE_CURVE[i - 1].rCap + 1e-9,
      ),
  },
  {
    id: 'imp95888-measured-points-match-source-exactly',
    description: 'the six reshaped measured points match the imp-95722 ROWS exactly',
    holds: () =>
      IMP95888_MEASURED_POINTS.length === ROWS.length &&
      IMP95888_MEASURED_POINTS.every((p, i) => p.T === ROWS[i].Tc && p.rCap === ROWS[i].cappedRatio),
  },
  {
    id: 'imp95888-landmarks-sub-one-and-ascending',
    description: 'both landmarks stay strictly below r_cap=1 and are ascending in log10T',
    holds: () =>
      IMP95888_LANDMARKS[0].log10T < IMP95888_LANDMARKS[1].log10T &&
      IMP95888_LANDMARKS.every((m) => m.rCap > 0 && m.rCap < 1),
  },
  {
    id: 'imp95888-window-bottom-landmark-matches-source',
    description: 'the window-bottom landmark matches the imp-95722 windowBottom exactly',
    holds: () => IMP95888_LANDMARKS[1].T === windowBottom.T && IMP95888_LANDMARKS[1].rCap === windowBottom.cappedRatio,
  },
  {
    id: 'imp95888-gap-decades-matches-log-arithmetic',
    description: 'the reported gap in decades matches log10(windowBottom.T) - log10(measured ceiling)',
    holds: () => Math.abs(IMP95888_GAP_DECADES - 6.78) < 0.05,
  },
  {
    id: 'imp95888-caveat-banner-states-honest-status',
    description: 'the caveat banner opens with HONEST STATUS and flags no QED',
    holds: () => /HONEST STATUS/.test(IMP95888_CAVEAT_BANNER) && /No QED/.test(IMP95888_CAVEAT_BANNER),
  },
  {
    id: 'imp95888-caveat-banner-flags-finite-super-window',
    description:
      'the caveat banner records that C0-envelope-safety (imp-95921) is a FINITE super-window, not an all-heights guarantee',
    holds: () => /FINITE/.test(IMP95888_CAVEAT_BANNER) && /super-window/.test(IMP95888_CAVEAT_BANNER) && /imp-95921/.test(IMP95888_CAVEAT_BANNER),
  },
];

for (const a of IMP95888_RCAP_WINDOW_BOTTOM_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95888-rcap-window-bottom-viz-data assertion failed: ${a.id}`);
  }
}
