/**
 * @module imp-96337-mixed-ladder-margin-viz-data
 *
 * imp-96337 (ux): import-light viz-data leaf for the imp-96270 mixed {oo,2,3}
 * S-unit ladder spectral-gap margin. imp-96270 tabulated the ladder magnitudes
 * s_u = u^(-1/2)/2 (u = 2^a 3^b, (a,b) != (0,0)), found the ceiling s_2 =
 * 0.353553 attained only at u = 2, and the finite rung-count-within-threshold
 * ladder (t = 0.30 -> 1 rung .. t = 0.05 -> 19 rungs), but shipped no chart.
 *
 * Reshapes the imp-96270 baked leadingMagnitudes and countAboveThreshold
 * fields into two chart-ready series (rung magnitude + margin below ceiling
 * vs u; rung-count vs threshold) and copies the ceiling/gap anchors verbatim.
 * No re-derivation: every plotted value is copied from
 * IMP_96270_SPECTRAL_GAP_MARGIN.
 *
 * PRESENTATION ONLY. This renders a TABULATION of the already-reduced
 * imp-96143 fact (I); it diagonalizes nothing, establishes no operator
 * positivity, moves no Lambda bound, and does NOT touch the finitely-many
 * top confined states (the actual residual). RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96270-mixed-ladder-spectral-gap-margin-tabulation.js (ladder, ceiling, thresholds)
 *
 * Ticket: imp-96337 (ux, sonnet-4-6, medium). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP_96270_SPECTRAL_GAP_MARGIN, ladderMagnitudes } from './imp-96270-mixed-ladder-spectral-gap-margin-tabulation.js';
import { IMP_96333_SPECTRAL_GAP_MARGIN_235 } from './imp-96333-mixed-ladder-235-spectral-gap-margin-tabulation.js';

const CEILING = IMP_96270_SPECTRAL_GAP_MARGIN.ceiling;

// imp-96376: three-prime {oo,2,3,5} tail-density growth vs the two-prime {oo,2,3}
// count, at the five U samples baked by imp-96333. The two-prime count is
// recomputed here (ladderMagnitudes(U).length, same helper imp-96270 exports)
// since imp-96270 only baked threshold-count pairs, not count(u<=U) samples.
export const IMP96376_DENSITY_GROWTH_SERIES = IMP_96333_SPECTRAL_GAP_MARGIN_235.cubicGrowthSamples.map((row) => ({
  U: row.U,
  threePrimeCount: row.count,
  twoPrimeCount: ladderMagnitudes(row.U).length,
  cubicAsymptotic: row.asymptotic,
}));

export const IMP96376_FIRST_PRIME5_RUNG = IMP_96333_SPECTRAL_GAP_MARGIN_235.firstNewRung;

// The ten baked leading rungs, reshaped with the margin below the ceiling
// (s_2 - s_u) alongside each magnitude, sorted u ascending (already the
// source order).
export const IMP96337_RUNG_SERIES = IMP_96270_SPECTRAL_GAP_MARGIN.leadingMagnitudes.map((row) => ({
  rank: row.rank,
  a: row.a,
  b: row.b,
  u: row.u,
  s: row.s,
  margin: CEILING - row.s,
}));

// The threshold -> rung-count ladder, reshaped into a plot-ready series
// sorted threshold ascending (smallest t first, so the step chart reads
// as a monotone-increasing count).
export const IMP96337_THRESHOLD_SERIES = Object.entries(IMP_96270_SPECTRAL_GAP_MARGIN.countAboveThreshold)
  .map(([t, count]) => ({ threshold: Number(t), count }))
  .sort((x, y) => x.threshold - y.threshold);

export const IMP96337_ANCHORS = Object.freeze({
  ceiling: IMP_96270_SPECTRAL_GAP_MARGIN.ceiling,
  gapBelowOne: IMP_96270_SPECTRAL_GAP_MARGIN.gapBelowOne,
  secondRung: IMP_96270_SPECTRAL_GAP_MARGIN.secondRung,
  secondRungRatio: IMP_96270_SPECTRAL_GAP_MARGIN.secondRungRatio,
});

export const IMP96337_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every rung magnitude, margin, and '
  + 'threshold-count value is copied verbatim from the imp-96270 baked tabulation; only the margin '
  + '(s_2 - s_u) and the threshold-series reordering are computed here (no re-derivation, no new '
  + 'diagonalization). This charts a TABULATION of the already-reduced imp-96143 fact (I): it establishes '
  + 'no operator positivity, moves no Lambda bound, and does NOT touch the finitely-many top confined '
  + 'states (the actual residual). The imp-96376 three-prime density-growth panel adds the prime 5: the '
  + 'ceiling s_2 is unmoved (attained only at u = 2) while the S-unit count(u<=U) grows from the two-prime '
  + '(ln U)^2 to the three-prime (ln U)^3, copied from the imp-96333 baked cubicGrowthSamples.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const approx = (x, y, tol) => Math.abs(x - y) <= tol;

const IMP96337_ASSERTIONS = [
  {
    id: 'imp96337-rung-series-matches-source',
    holds: () => IMP96337_RUNG_SERIES.every((p, i) => {
      const src = IMP_96270_SPECTRAL_GAP_MARGIN.leadingMagnitudes[i];
      return p.u === src.u && approx(p.s, src.s, 1e-15) && approx(p.margin, CEILING - src.s, 1e-15);
    }),
    why: 'the reshaped rung series must reproduce the imp-96270 baked leadingMagnitudes row-for-row, with margin = ceiling - s.',
  },
  {
    id: 'imp96337-rung-series-length-ten',
    holds: () => IMP96337_RUNG_SERIES.length === 10,
    why: 'imp-96270 bakes exactly ten leading magnitudes (ranks 1..10).',
  },
  {
    id: 'imp96337-rung-margin-zero-at-ceiling-and-increasing',
    holds: () => approx(IMP96337_RUNG_SERIES[0].margin, 0, 1e-15)
      && IMP96337_RUNG_SERIES.every((p, i) => i === 0 || p.margin > IMP96337_RUNG_SERIES[i - 1].margin),
    why: 'the top rung (u = 2) sits exactly at the ceiling (margin 0), and margin strictly increases as u grows and s_u falls.',
  },
  {
    id: 'imp96337-threshold-series-matches-source-and-monotone',
    holds: () => {
      const want = { '0.3': 1, '0.25': 3, '0.2': 4, '0.15': 6, '0.1': 10, '0.05': 19 };
      const matches = IMP96337_THRESHOLD_SERIES.every((row) => want[String(row.threshold)] === row.count);
      const monotone = IMP96337_THRESHOLD_SERIES.every((row, i) => i === 0 || row.threshold > IMP96337_THRESHOLD_SERIES[i - 1].threshold);
      const countsDecrease = IMP96337_THRESHOLD_SERIES.every((row, i) => i === 0 || row.count <= IMP96337_THRESHOLD_SERIES[i - 1].count);
      return matches && monotone && countsDecrease && IMP96337_THRESHOLD_SERIES.length === 6;
    },
    why: 'imp-96270: counts 1,3,4,6,10,19 at t = 0.30,0.25,0.20,0.15,0.10,0.05, sorted threshold-ascending the count must be non-increasing (a higher threshold admits fewer rungs).',
  },
  {
    id: 'imp96337-anchors-match-source',
    holds: () => approx(IMP96337_ANCHORS.ceiling, 0.3535533905932738, 1e-15)
      && approx(IMP96337_ANCHORS.gapBelowOne, 0.6464466094067263, 1e-15)
      && approx(IMP96337_ANCHORS.ceiling + IMP96337_ANCHORS.gapBelowOne, 1, 1e-15),
    why: 'the ceiling and gap-below-one anchors must match the imp-96270 source verbatim and sum to 1.',
  },
  {
    id: 'imp96337-honest-banner-carries-status',
    holds: () => /RH open/.test(IMP96337_HONEST_BANNER) && /NO QED/.test(IMP96337_HONEST_BANNER) && /refereed bound is changed/i.test(IMP96337_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
  {
    id: 'imp96376-density-growth-series-matches-source-and-three-prime-denser',
    holds: () => IMP96376_DENSITY_GROWTH_SERIES.length === 5
      && IMP96376_DENSITY_GROWTH_SERIES.every((row, i) => {
        const src = IMP_96333_SPECTRAL_GAP_MARGIN_235.cubicGrowthSamples[i];
        return row.U === src.U && row.threePrimeCount === src.count && approx(row.cubicAsymptotic, src.asymptotic, 1e-9)
          && row.threePrimeCount > row.twoPrimeCount;
      }),
    why: 'the five density-growth samples must reproduce imp-96333 cubicGrowthSamples row-for-row, and the three-prime count must exceed the recomputed two-prime count at every U (adding prime 5 only adds rungs).',
  },
  {
    id: 'imp96376-first-prime5-rung-below-ceiling',
    holds: () => IMP96376_FIRST_PRIME5_RUNG.u === 5
      && approx(IMP96376_FIRST_PRIME5_RUNG.s, 0.22360679774997896, 1e-15)
      && approx(CEILING - IMP96376_FIRST_PRIME5_RUNG.s, IMP96376_FIRST_PRIME5_RUNG.marginBelowCeiling, 1e-15)
      && approx(IMP_96333_SPECTRAL_GAP_MARGIN_235.ceiling, CEILING, 1e-15),
    why: 'the first new prime-5 rung (u = 5) sits 0.129947 below the ceiling, and the three-prime ceiling must equal the unmoved two-prime ceiling s_2.',
  },
];

for (const a of IMP96337_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96337-mixed-ladder-margin-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}
