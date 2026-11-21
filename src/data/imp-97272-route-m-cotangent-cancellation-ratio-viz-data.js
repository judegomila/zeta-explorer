/**
 * @module imp-97272-route-m-cotangent-cancellation-ratio-viz-data
 *
 * imp-97272 (ux): import-light viz-data leaf for the imp-97226 signed-vs-absolute cotangent
 * cancellation ratio ladder (imp-97226-route-m-cotangent-cancellation-ratio-ladder.js), which had
 * baked the |S(b)|/A(b) ladder but no chart-ready surface for it.
 *
 * Reshapes the baked imp-97226 ladder rows (b = 101..24001) into a single chart-ready series
 * tracking three co-plotted quantities per b: the cancellation ratio |S(b)|/A(b) (~0.540, stable),
 * the signed scalar S(b)/(phi(b) b) (~-0.0795, flat and negative), and the absolute companion
 * A(b)/(phi(b) b) (~0.147, flat). Also derives the per-row sharpening factor abs/|signed|, which
 * settles near the measured ~1.85x.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (b, signed, abs, cancel) value below is copied verbatim
 * from the imp-97226 baked IMP97226_LADDER (no re-derivation of the V(h,k) cotangent sums). Changes
 * no bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (IMP97226_LADDER, IMP97226_MEASURED, IMP97226_VERDICT)
 *
 * Ticket: imp-97272 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97226_LADDER,
  IMP97226_MEASURED,
  IMP97226_VERDICT,
} from './imp-97226-route-m-cotangent-cancellation-ratio-ladder.js';

// one row per ladder point, ascending b, with the derived sharpening factor abs/|signed|.
export const IMP97272_CANCELLATION_ROWS = IMP97226_LADDER.map((row) => ({
  ...row,
  absSigned: Math.abs(row.signed),
  sharpeningFactor: row.abs / Math.abs(row.signed),
}));

export const IMP97272_ASYMPTOTES = Object.freeze({
  cancel: IMP97226_MEASURED.cancelAsymptote, // |S|/A settles ~0.540
  signed: IMP97226_MEASURED.signedStable, // S/(phi b b) settles ~-0.0795
  abs: IMP97226_MEASURED.absStable, // A/(phi b b) settles ~0.147
  sharpeningFactor: IMP97226_MEASURED.signedSharpeningFactor, // ~1.85x
});

export const IMP97272_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, signed, abs, cancel) row ' +
  'is copied verbatim from the imp-97226 baked IMP97226_LADDER (no re-derivation of the V(h,k) cotangent ' +
  'sums); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97272_ASSERTIONS = [
  {
    id: 'imp97272-ten-rows-present',
    holds: () => IMP97272_CANCELLATION_ROWS.length === 10,
    why: 'imp-97226 measures the ladder at exactly ten b values (101..24001).',
  },
  {
    id: 'imp97272-ascending-b-order',
    holds: () =>
      IMP97272_CANCELLATION_ROWS.every(
        (r, i) => i === 0 || r.b > IMP97272_CANCELLATION_ROWS[i - 1].b,
      ),
    why: 'the ladder rows are sorted ascending by b for chart rendering.',
  },
  {
    id: 'imp97272-cancel-ratio-in-stable-band',
    holds: () => IMP97272_CANCELLATION_ROWS.every((r) => r.cancel > 0.5 && r.cancel < 0.6),
    why: 'every row of the imp-97226 ladder carries a cancellation ratio |S|/A in the ~0.54 stable band.',
  },
  {
    id: 'imp97272-signed-negative-abs-larger',
    holds: () =>
      IMP97272_CANCELLATION_ROWS.every((r) => r.signed < 0 && r.abs > r.absSigned),
    why: 'the signed half stays negative and strictly smaller in magnitude than the absolute companion at every b (genuine cancellation).',
  },
  {
    id: 'imp97272-sharpening-factor-near-asymptote',
    holds: () => {
      const last = IMP97272_CANCELLATION_ROWS[IMP97272_CANCELLATION_ROWS.length - 1];
      return Math.abs(last.sharpeningFactor - IMP97272_ASYMPTOTES.sharpeningFactor) < 0.1;
    },
    why: 'the derived sharpening factor abs/|signed| at the largest measured b (24001) must sit near the ~1.85x asymptote quoted in imp-97226.',
  },
  {
    id: 'imp97272-verdict-cross-check',
    holds: () =>
      IMP97226_VERDICT.cancellationPersists === true &&
      IMP97226_VERDICT.signedHalfFlatAndNegative === true &&
      IMP97226_VERDICT.anyBoundMoved === false &&
      IMP97226_VERDICT.qed === false,
    why: 'the viz leaf must agree with the source imp-97226 verdict flags: cancellation persists, signed half flat/negative, no bound moved, no QED.',
  },
  {
    id: 'imp97272-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97272_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97272_HONEST_BANNER) &&
      /NO QED/.test(IMP97272_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97272_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97272-route-m-cotangent-cancellation-ratio-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  rows: IMP97272_CANCELLATION_ROWS,
  asymptotes: IMP97272_ASYMPTOTES,
  banner: IMP97272_HONEST_BANNER,
};
