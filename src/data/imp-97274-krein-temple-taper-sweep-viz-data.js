/**
 * @module imp-97274-krein-temple-taper-sweep-viz-data
 *
 * imp-97274 (ux): import-light viz-data leaf for the imp-97228 Krein Temple taper sweep
 * (imp-97228-krein-domain-respecting-trial-eta2.js), which had baked the Hann-taper cutoff-width
 * sweep but no chart-ready surface for it.
 *
 * Reshapes the baked imp-97228 IMP97228_TAPER_SWEEP rows (cutoff width w = 100..8) into a single
 * chart-ready series tracking cutoff width w against the Rayleigh quotient mu (upper bound on
 * lambda_1) and the Temple defect eta2, plus a derived flag per row marking whether that row sits
 * "near-floor" on mu (<=0.7, close to the 0.5 uniform-N target) or "small" on eta2 (<3e8, the band
 * only the narrowest tapers w<=12 reach). No row is ever both -- the mutual exclusivity imp-97228
 * found between a near-floor mu and a small eta2.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (w, mu, eta2, relGrowth) value below is copied verbatim
 * from the imp-97228 baked IMP97228_TAPER_SWEEP (no re-derivation of the Gegenbauer-Galerkin build
 * or the Hann-taper coefficients). Changes no bound, establishes no operator positivity, no RH
 * claim; no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97228-krein-domain-respecting-trial-eta2.js (IMP97228_TAPER_SWEEP, IMP97228_BEST, IMP97228_VERDICT)
 *
 * Ticket: imp-97274 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97228_TAPER_SWEEP,
  IMP97228_BEST,
  IMP97228_POLY_RITZ_ETA2,
  IMP97228_VERDICT,
} from './imp-97228-krein-domain-respecting-trial-eta2.js';

const MU_NEAR_FLOOR_THRESHOLD = 0.7;
const ETA2_SMALL_THRESHOLD = 3e8; // separates the w<=12 tail (eta2 ~1.67e8-2.05e8) from the w>=20 band (eta2 >=5.3e8)

// one row per taper-sweep point, descending w (100 -> 8), with the two derived exclusivity flags.
export const IMP97274_TAPER_ROWS = IMP97228_TAPER_SWEEP.map((row) => ({
  ...row,
  muNearFloor: row.mu <= MU_NEAR_FLOOR_THRESHOLD,
  eta2Small: row.eta2 < ETA2_SMALL_THRESHOLD,
}));

export const IMP97274_ASYMPTOTES = Object.freeze({
  polyRitzEta2: IMP97228_POLY_RITZ_ETA2, // ~2.42e9 baseline (no taper)
  eta2Min: IMP97228_BEST.eta2Min, // ~1.67e8, reached at w=8
  muAtEta2Min: IMP97228_BEST.muAtMin, // ~0.895, far above the 0.5 floor target
  muNearFloorThreshold: MU_NEAR_FLOOR_THRESHOLD,
  eta2SmallThreshold: ETA2_SMALL_THRESHOLD,
});

export const IMP97274_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (w, mu, eta2, relGrowth) row ' +
  'is copied verbatim from the imp-97228 baked IMP97228_TAPER_SWEEP (no re-derivation of the Hann-taper ' +
  'Gegenbauer-Galerkin build); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97274_ASSERTIONS = [
  {
    id: 'imp97274-eleven-rows-present',
    holds: () => IMP97274_TAPER_ROWS.length === 11,
    why: 'imp-97228 measures the taper sweep at exactly eleven cutoff widths (w=100..8).',
  },
  {
    id: 'imp97274-descending-w-order',
    holds: () =>
      IMP97274_TAPER_ROWS.every((r, i) => i === 0 || r.w < IMP97274_TAPER_ROWS[i - 1].w),
    why: 'the taper-sweep rows are sorted descending by cutoff width w for chart rendering.',
  },
  {
    id: 'imp97274-mutual-exclusivity-holds',
    holds: () => IMP97274_TAPER_ROWS.every((r) => !(r.muNearFloor && r.eta2Small)),
    why: 'no row of the imp-97228 sweep has BOTH a near-floor mu (<=0.7) AND a small eta2 (<1e9) -- the two requirements are mutually exclusive for this basis.',
  },
  {
    id: 'imp97274-min-eta2-row-costs-mu',
    holds: () => {
      const minRow = IMP97274_TAPER_ROWS.reduce((a, b) => (b.eta2 < a.eta2 ? b : a));
      return (
        minRow.w === 8 &&
        Math.abs(minRow.eta2 - IMP97274_ASYMPTOTES.eta2Min) < 1 &&
        Math.abs(minRow.mu - IMP97274_ASYMPTOTES.muAtEta2Min) < 1e-6 &&
        minRow.muNearFloor === false
      );
    },
    why: 'the row with the smallest eta2 (w=8, ~1.67e8) has mu=0.895 -- above the near-floor threshold -- confirming the eta2 reduction is bought by destroying the approximation.',
  },
  {
    id: 'imp97274-asymptotes-match-source',
    holds: () =>
      Math.abs(IMP97274_ASYMPTOTES.polyRitzEta2 - IMP97228_POLY_RITZ_ETA2) < 1e-6 &&
      Math.abs(IMP97274_ASYMPTOTES.eta2Min - IMP97228_BEST.eta2Min) < 1e-6 &&
      Math.abs(IMP97274_ASYMPTOTES.muAtEta2Min - IMP97228_BEST.muAtMin) < 1e-9,
    why: 'the derived asymptotes must match the imp-97228 source baseline and best-row values exactly.',
  },
  {
    id: 'imp97274-verdict-cross-check',
    holds: () =>
      IMP97228_VERDICT.noWindowWithSmallEta2AndNearFloorMu === true &&
      IMP97228_VERDICT.eta2StaysAstronomical === true &&
      IMP97228_VERDICT.qed === false,
    why: 'the viz leaf must agree with the source imp-97228 verdict flags: no window with small eta2 and near-floor mu, eta2 stays astronomical, no QED.',
  },
  {
    id: 'imp97274-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97274_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97274_HONEST_BANNER) &&
      /NO QED/.test(IMP97274_HONEST_BANNER),
    why: 'every Krein Temple viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97274_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97274-krein-temple-taper-sweep-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  rows: IMP97274_TAPER_ROWS,
  asymptotes: IMP97274_ASYMPTOTES,
  banner: IMP97274_HONEST_BANNER,
};
