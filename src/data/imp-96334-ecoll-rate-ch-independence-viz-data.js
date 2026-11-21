/**
 * @module imp-96334-ecoll-rate-ch-independence-viz-data
 *
 * imp-96334 (ux): import-light viz-data leaf for the imp-96311 E_coll rate-vs-conclusion
 * C_H-independence tabulation, which measured that the log-log slope of E_coll(N) is
 * bit-for-bit identical across every C_H column while only the multiplicative prefactor
 * scales -- but shipped with no chart surface.
 *
 * Reshapes the imp-96311 baked per-C_H columns into a chart-ready log-log family (one
 * series per C_H) plus a segment-slope panel showing the shared crawl toward the N^{-1/2}
 * exponent. Every numeric literal (values, segmentSlopes, sharedSlopeProfile, maxSlopeSpread)
 * is copied verbatim from the imp-96311 baked module; only the per-point plotting shape
 * (paired {N, value} / {segmentLabel, slope} records) is computed here.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no operator positivity,
 * no RH claim. C_H isRigorousUpperBound remains false (imp-2642/imp-2701); the imp-2640
 * Gronwall discharge of C_Lip remains NEGATIVE. No refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96311-ecoll-rate-ch-independence-tabulation.js (baked columns, slope profile)
 *
 * Ticket: imp-96334 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96311_ECOLL_RATE_CH_INDEPENDENCE } from './imp-96311-ecoll-rate-ch-independence-tabulation.js';

const SRC = IMP96311_ECOLL_RATE_CH_INDEPENDENCE;

// One series per C_H column: paired {N, value} points across the shared N ladder.
export const IMP96334_FAMILY = SRC.columns.map((col) => ({
  C_H: col.C_H,
  label: `C_H = ${col.C_H.toPrecision(4)}`,
  points: SRC.ladderN.map((N, i) => ({ N, value: col.values[i] })),
}));

// Segment labels (N_i -> N_{i+1}) paired with the single shared slope value per segment,
// since the slope is C_H-independent (max spread SRC.maxSlopeSpread, near machine-zero).
export const IMP96334_SLOPE_PANEL = SRC.sharedSlopeProfile.map((slope, i) => ({
  segment: `${SRC.ladderN[i].toExponential(0)}→${SRC.ladderN[i + 1].toExponential(0)}`,
  slope,
  spreadAcrossCH: SRC.slopeSpreadAcrossCH[i],
}));

export const IMP96334_MAX_SLOPE_SPREAD = SRC.maxSlopeSpread;

export const IMP96334_PREFACTOR = {
  ratioTarget: SRC.prefactor.ratioTarget,
  maxDeviation: SRC.prefactor.maxDeviation,
};

export const IMP96334_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every E_coll value, '
  + 'segment slope, and slope-spread literal is copied verbatim from the imp-96311 baked '
  + 'columns/sharedSlopeProfile/slopeSpreadAcrossCH fields; only the per-point plotting shape '
  + '({N, value} pairs and {segment, slope} records) is computed here. C_H (hence C_Lip) is '
  + 'shown to move only the prefactor and the limit value, never the measured N^{-1/2} rate; '
  + 'C_H isRigorousUpperBound stays false (imp-2642/imp-2701) and the imp-2640 Gronwall '
  + 'discharge of C_Lip remains NEGATIVE.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96334_ASSERTIONS = [
  {
    id: 'imp96334-family-has-one-series-per-c-h-column',
    holds: () => IMP96334_FAMILY.length === SRC.cHMagnitudes.length
      && IMP96334_FAMILY.every((s, i) => s.C_H === SRC.cHMagnitudes[i]),
    why: 'each imp-96311 C_H magnitude must produce exactly one plotted series, in the same order as cHMagnitudes.',
  },
  {
    id: 'imp96334-family-points-match-baked-values-exactly',
    holds: () => IMP96334_FAMILY.every((s, si) => s.points.every((p, pi) => p.N === SRC.ladderN[pi]
      && p.value === SRC.columns[si].values[pi])),
    why: 'plotted {N, value} points must reproduce the imp-96311 baked ladderN/columns.values arrays exactly (no recomputation).',
  },
  {
    id: 'imp96334-slope-panel-length-matches-segments',
    holds: () => IMP96334_SLOPE_PANEL.length === SRC.ladderN.length - 1
      && IMP96334_SLOPE_PANEL.every((s, i) => s.slope === SRC.sharedSlopeProfile[i]),
    why: 'the slope panel must have one row per N-ladder segment and copy the shared slope value verbatim.',
  },
  {
    id: 'imp96334-slope-spread-near-machine-zero',
    holds: () => IMP96334_MAX_SLOPE_SPREAD < 1e-9,
    why: 'the chart claims a single shared slope curve; this only holds visually if the cross-C_H slope spread is negligible, matching the imp-96311 measurement.',
  },
];

for (const a of IMP96334_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96334-ecoll-rate-ch-independence-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
