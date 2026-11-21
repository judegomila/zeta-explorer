/**
 * @module imp-96142-decorrelation-safety-margin-viz-data
 *
 * imp-96142 (ux): import-light viz-data leaf for the imp-96109 de-correlation safety-margin
 * assessment (imp-96109-tue5-dip-decorrelation-safety-margin.js), which had baked the three
 * below-envelope dip heights' de-correlation analysis but no viz surface for the margin itself.
 *
 * Reshapes the three baked below-envelope rows (T = 1e4, 1.5e5, 3e5) into chart-ready form:
 * a log-scale grouped-bar comparison of the O(1/L) boundary-sharing estimate rho_boundary
 * against the critical lag-1 correlation |rho_crit| needed to flip each height's verdict, plus
 * a table of the signed safety ratio (rho_crit / rho_boundary) per height. Only T = 1.5e5 has a
 * POSITIVE rho_crit (0.5744) -- a real flip threshold -- and its ~285x gap over rho_boundary
 * (0.00202) is the headline safety margin; the other two heights have NEGATIVE rho_crit, meaning
 * no positive correlation could ever promote them (unconditionally safe, not just "far from the
 * threshold").
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number below is copied verbatim from the imp-96109
 * baked `rows` and `significantDip` (no re-derivation of the AR-1 model or the chi-square
 * crossover). Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96109-tue5-dip-decorrelation-safety-margin.js (rows, significantDip, verdict)
 *
 * Ticket: imp-96142 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN } from './imp-96109-tue5-dip-decorrelation-safety-margin.js';

const SRC = IMP96109_T15E5_DIP_DECORRELATION_SAFETY_MARGIN;

// one row per below-envelope dip height, sign of rho_crit determines the verdict label.
export const IMP96142_ROWS = SRC.rows.map((r) => ({
  Tc: r.Tc,
  relPct: r.relPct,
  rhoBoundary: r.rhoBoundary,
  rhoCrit: r.rhoCrit,
  safetyRatio: r.safetyRatio,
  unconditionallySafe: r.rhoCrit < 0,
}));

export const IMP96142_SIGNIFICANT = {
  Tc: SRC.significantDip.Tc,
  rhoBoundary: SRC.significantDip.rhoBoundary,
  rhoCrit: SRC.significantDip.rhoCrit,
  safetyRatio: SRC.significantDip.safetyRatio,
};

export const IMP96142_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every rho_boundary, rho_crit, and safety-ratio value is copied verbatim from the imp-96109 baked rows and significantDip block (no re-derivation of the AR-1 de-correlation model or the imp-96071 chi-square crossover); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96142_ASSERTIONS = [
  {
    id: 'imp96142-three-dip-heights-present',
    holds: () => IMP96142_ROWS.length === 3,
    why: 'imp-96109 reports exactly three below-envelope dip heights (T = 1e4, 1.5e5, 3e5); the reshaped row set must preserve that count.',
  },
  {
    id: 'imp96142-significant-dip-matches-baked-literals',
    holds: () =>
      Math.abs(IMP96142_SIGNIFICANT.rhoCrit - 0.57443) < 1e-4 &&
      Math.abs(IMP96142_SIGNIFICANT.rhoBoundary - 0.0020170) < 1e-6 &&
      Math.abs(IMP96142_SIGNIFICANT.safetyRatio - 284.79) < 0.5,
    why: 'the T = 1.5e5 significant-dip headline numbers (rho_crit = 0.5744, rho_boundary = 0.00202, safety ratio = 284.8) must match the imp-96109 baked significantDip block.',
  },
  {
    id: 'imp96142-only-t15e5-is-positive-rho-crit',
    holds: () => {
      const positive = IMP96142_ROWS.filter((r) => r.rhoCrit > 0);
      return positive.length === 1 && positive[0].Tc === 1.5e5;
    },
    why: 'only the T = 1.5e5 significant dip has a real (positive) flip threshold; the two noise heights must have negative rho_crit, i.e. be unconditionally unpromotable.',
  },
  {
    id: 'imp96142-two-noise-heights-unconditionally-safe',
    holds: () => IMP96142_ROWS.filter((r) => r.unconditionallySafe).length === 2,
    why: 'exactly two of the three dip heights (T = 1e4, 3e5) must be flagged unconditionally safe (rho_crit < 0), matching imp-96109 noiseHeightsUnpromotable.',
  },
  {
    id: 'imp96142-rho-boundary-shrinks-with-height',
    holds: () => {
      const sorted = [...IMP96142_ROWS].sort((a, b) => a.Tc - b.Tc);
      return sorted.every((r, i) => i === 0 || r.rhoBoundary < sorted[i - 1].rhoBoundary);
    },
    why: 'rho_boundary ~ 1/L shrinks monotonically with T since the box occupancy L grows with T (more zeros per box dilute the boundary-sharing effect at higher heights).',
  },
  {
    id: 'imp96142-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96142_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96142_HONEST_BANNER) &&
      /NO QED/.test(IMP96142_HONEST_BANNER),
    why: 'every Route A-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96142_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96142-decorrelation-safety-margin-viz-data assertion failed: ${a.id}`);
  }
}
