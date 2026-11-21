/**
 * imp-95930 -- viz panel for the imp-95897 six-offset-vs-log-T table plus the
 * r_cap(3e12) envelope band.
 *
 * imp-95897 tabulated offset(T) = measuredVar(T) - Selberg term across the six
 * accessible imp-95710 heights (T = 1e4..5e5), found it noise-dominated with an
 * INTERIOR max at T = 1.5e5 (C0 = 0.333721), and derived the resulting
 * r_cap(3e12) envelope band [0.196 (min-offset) .. 0.260 (max-anchor C0)]. That
 * table and band were never rendered visually. This module derives a flat,
 * chart-ready row per height (offset, log T) directly from the frozen imp-95897
 * record -- no new cited input, no re-derivation.
 *
 * Import-light: only imports the imp-95897 module (no zeros bundle).
 *
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (the measured table and envelope band this renders)
 */

import { IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY } from './imp-95897-c0-offset-monotonicity-envelope-safety.js';

const SRC = IMP95897_C0_OFFSET_MONOTONICITY_ENVELOPE_SAFETY;

export const IMP95930_OFFSET_ROWS = Object.freeze(
  SRC.offsetRows.map((row) =>
    Object.freeze({
      Tc: row.Tc,
      logT: row.logT,
      offset: row.offset,
      isMax: row.Tc === SRC.offsetTrend.argmaxHeight,
    }),
  ),
);

export const IMP95930_C0 = SRC.offsetC0;
export const IMP95930_ARGMAX_HEIGHT = SRC.offsetTrend.argmaxHeight;
export const IMP95930_ENVELOPE_BAND = Object.freeze({
  windowBottomT: SRC.envelopeSafety.windowBottomT,
  rCapMaxAnchor: SRC.envelopeSafety.rCapMaxAnchor,
  rCapMinOffset: SRC.envelopeSafety.rCapMinOffset,
  bandDrop: SRC.envelopeSafety.bandDrop,
});

export const IMP95930_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95897 six-offset table and r_cap(3e12) ' +
  'envelope band verbatim (no re-derivation, no fresh measurement). The offset is ' +
  'noise-dominated (R^2 ~ 0.0007) with its max at an INTERIOR height (1.5e5), not an ' +
  'endpoint -- monotonicity over [3e12, infinity) is UNDECIDED by this table alone (see ' +
  'imp-95921 for the superseding analytic bracket). Changes no bound, establishes no ' +
  'operator positivity, no RH claim; no refereed bound is changed; NO QED.';

export const IMP95930_ASSERTIONS = [
  {
    id: 'imp95930-six-rows-match-source-order',
    description:
      'exactly six offset rows exist, in the same T order as the imp-95897 source table',
    holds: () =>
      IMP95930_OFFSET_ROWS.length === 6 &&
      IMP95930_OFFSET_ROWS.every((row, i) => row.Tc === SRC.offsetRows[i].Tc),
  },
  {
    id: 'imp95930-max-row-flagged-and-interior',
    description:
      'exactly one row is flagged isMax, it matches the imp-95897 argmax height (1.5e5), ' +
      'and it is neither the first nor last row (interior max)',
    holds: () => {
      const maxRows = IMP95930_OFFSET_ROWS.filter((r) => r.isMax);
      if (maxRows.length !== 1 || maxRows[0].Tc !== 1.5e5) return false;
      const idx = IMP95930_OFFSET_ROWS.indexOf(maxRows[0]);
      return idx > 0 && idx < IMP95930_OFFSET_ROWS.length - 1;
    },
  },
  {
    id: 'imp95930-envelope-band-matches-source',
    description:
      'the rendered envelope band values equal the imp-95897 envelopeSafety record exactly',
    holds: () =>
      IMP95930_ENVELOPE_BAND.rCapMaxAnchor === SRC.envelopeSafety.rCapMaxAnchor &&
      IMP95930_ENVELOPE_BAND.rCapMinOffset === SRC.envelopeSafety.rCapMinOffset &&
      IMP95930_ENVELOPE_BAND.rCapMaxAnchor > IMP95930_ENVELOPE_BAND.rCapMinOffset,
  },
  {
    id: 'imp95930-caveat-carries-honesty-markers',
    description: 'the caveat banner names the interior max and keeps the NO QED / SOTA guardrail',
    holds: () =>
      /INTERIOR/.test(IMP95930_CAVEAT_BANNER) &&
      /NO QED/.test(IMP95930_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP95930_CAVEAT_BANNER) &&
      SRC.isRigorous === false,
  },
];

for (const a of IMP95930_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95930-c0-offset-envelope-panel-viz-data assertion failed: ${a.id}`);
  }
}
