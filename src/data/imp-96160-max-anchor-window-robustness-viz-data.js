/**
 * @module imp-96160-max-anchor-window-robustness-viz-data
 *
 * imp-96160 (ux): import-light viz-data leaf for the imp-96132 max-anchor
 * window-robustness sweep across the four "other" imp-96090 held-out heights
 * {2e4, 1e5, 2e5, 4e5}. imp-96132 measured all 48 configs (12 per height) as a
 * table of numbers but shipped with no chart surface for the sweep shape --
 * this reshapes the same 48 rows into a flat, chart-ready list plus a per-height
 * summary, so the "46/48 cap, two shallow endpoint breaches" finding is visible
 * at a glance instead of read off a table.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every marginRelPct / caps / canonicalMarginRelPct
 * value is imported unchanged from imp-96132 (no re-derivation, no re-baking of the
 * underlying sd(C-E) / meanL literals); only the flattening for plotting happens here.
 * Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96132-max-anchor-window-robustness-four-heights.js (source measurement)
 * @see imp-96112-max-anchor-margin-window-robustness (the 5e4-only sweep this extends)
 *
 * Ticket: imp-96160 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS } from './imp-96132-max-anchor-window-robustness-four-heights.js';

const SRC = IMP96132_MAX_ANCHOR_WINDOW_ROBUSTNESS_FOUR_HEIGHTS;
const CANONICAL_TAG = 'k=1';

// Flatten the 4 heights x 12 configs into a single 48-row list, in height order,
// carrying an isCanonical flag for the imp-96090 canonical window at each height.
export const IMP96160_CONFIGS = SRC.heightResults.flatMap((h) =>
  h.rows.map((r) => ({
    Tc: h.Tc,
    tag: r.tag,
    axis: r.axis,
    marginRelPct: r.marginRelPct,
    caps: r.caps,
    isCanonical: r.tag === CANONICAL_TAG,
  }))
);

// Per-height summary: canonical margin, min/max margin over the 12-config sweep,
// and whether every config at this height capped.
export const IMP96160_HEIGHT_SUMMARY = SRC.heightResults.map((h) => ({
  Tc: h.Tc,
  canonicalMarginRelPct: h.canonicalMarginRelPct,
  marginRangePct: h.marginRangePct,
  allCap: h.allCap,
  breaches: h.breaches,
}));

export const IMP96160_SUMMARY = {
  totalConfigs: SRC.summary.totalConfigs,
  totalCaps: SRC.summary.totalCaps,
  totalBreaches: SRC.summary.totalBreaches,
  heightsAllCap: SRC.summary.heightsAllCap,
  heightsWithBreach: SRC.summary.heightsWithBreach,
  canonicalWindowAllPositive: SRC.summary.canonicalWindowAllPositive,
};

export const IMP96160_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every margin value plotted '
  + 'here is imported verbatim from imp-96132 (no re-derivation, no re-baking of the underlying '
  + 'sd(C-E) / mean-L literals); only the flattening into a 48-config chart list happens in this '
  + 'module. Changes no bound and establishes no operator positivity.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96160_ASSERTIONS = [
  {
    id: 'imp96160-forty-eight-configs-flattened',
    holds: () => IMP96160_CONFIGS.length === 48,
    why: 'imp-96132 measured 4 heights x 12 configs; the flattened list must carry all 48 rows.',
  },
  {
    id: 'imp96160-two-breaches-preserved',
    holds: () => IMP96160_CONFIGS.filter((c) => !c.caps).length === 2,
    why: 'imp-96132: exactly two of the 48 configs breach the max-anchor envelope (the two endpoint heights, extreme windows).',
  },
  {
    id: 'imp96160-breaches-at-expected-height-and-tag',
    holds: () => {
      const breaches = IMP96160_CONFIGS.filter((c) => !c.caps);
      return breaches.some((b) => b.Tc === 2.0e4 && b.tag === 'k=2')
        && breaches.some((b) => b.Tc === 4.0e5 && b.tag === 'k=0.5');
    },
    why: 'imp-96132: the breaches are the coarse k=2 window at T=2e4 and the fine k=0.5 window at T=4e5.',
  },
  {
    id: 'imp96160-four-canonical-rows-all-positive',
    holds: () => {
      const canonical = IMP96160_CONFIGS.filter((c) => c.isCanonical);
      return canonical.length === 4 && canonical.every((c) => c.caps && c.marginRelPct > 5);
    },
    why: 'the imp-96090 canonical window (k=1, span=0.30, non-overlap) must cap with comfortable positive margin at all four heights, matching imp-96132.',
  },
  {
    id: 'imp96160-height-summary-matches-source',
    holds: () => IMP96160_HEIGHT_SUMMARY.length === 4
      && IMP96160_HEIGHT_SUMMARY.filter((h) => !h.allCap).length === 2,
    why: 'exactly two of the four held-out heights (the endpoints) should carry a breach; the two interior heights must be allCap.',
  },
];

for (const a of IMP96160_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96160-max-anchor-window-robustness-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
