/**
 * @module imp-124958-fartail-mantissa-ratio-decay-viz-data
 *
 * imp-124958 (ux): import-light viz-data leaf for the imp-124846 far-tail mantissa-ratio
 * isolation. Reshapes the imp-124846 RATIO_TABLE (the mantissa-to-leading ratio m_k/g_k and the
 * mantissa share m_k/Delta_k over the per-nine ladder k = 1..5) into chart-ready rows, so a page
 * can render the ten-fold-per-nine decay without re-deriving anything.
 *
 * No re-derivation: every ratio / share / decay value is copied verbatim from
 * IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION.ratioTable. Presentation only; changes no
 * bound; establishes no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-124846-fartail-mantissa-leading-ratio-isolation.js (the source object this reshapes)
 *
 * Ticket: imp-124958 (ux, sonnet-4-6, low). Plain exported validation object (imp-96294
 * convention), no self-executing assertion throw.
 */

import { IMP124846_FARTAIL_MANTISSA_LEADING_RATIO_ISOLATION as SRC } from './imp-124846-fartail-mantissa-leading-ratio-isolation.js';

export const IMP124958_RATIO_ROWS = Object.freeze(
  SRC.ratioTable.map((row) =>
    Object.freeze({
      nines: row.nines,
      ratioToLeading: row.ratio_mk_over_gk,
      shareOfSpacing: row.share_mk_over_delta,
      ratioDecayFromPrev: row.ratioDecayFromPrev,
      shareDecayFromPrev: row.shareDecayFromPrev,
    })
  )
);

export const IMP124958_DECAY_LIMIT = SRC.ratioDecayLimit; // 10
export const IMP124958_LEADING_RATE_COEFFICIENT = SRC.leadingRateCoefficient; // ~0.255843

export const IMP124958_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every ratio / share / decay '
  + 'value plotted here is copied verbatim from the imp-124846 far-tail mantissa-ratio isolation '
  + '(a closed-form RvM inversion, not a rigorous asymptotic). Conditional-share diagnostic, '
  + 'changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP124958_VALIDATION = Object.freeze({
  fiveRungs: IMP124958_RATIO_ROWS.length === 5,
  ratioMonotoneFalling: IMP124958_RATIO_ROWS.every(
    (r, i) => i === 0 || r.ratioToLeading < IMP124958_RATIO_ROWS[i - 1].ratioToLeading
  ),
  shareMonotoneFalling: IMP124958_RATIO_ROWS.every(
    (r, i) => i === 0 || r.shareOfSpacing < IMP124958_RATIO_ROWS[i - 1].shareOfSpacing
  ),
  decayRatiosClimbTowardTen: IMP124958_RATIO_ROWS.filter((r) => r.ratioDecayFromPrev !== null).every(
    (r) => r.ratioDecayFromPrev >= 10 && r.ratioDecayFromPrev < 10.5
  ),
  decayLimitIsTen: IMP124958_DECAY_LIMIT === 10,
});
