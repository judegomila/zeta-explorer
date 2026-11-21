/**
 * @module imp-97273-route-m-inverse-oversampling-viz-data
 *
 * imp-97273 (ux): import-light viz-data leaf for the imp-97225 inverse-line oversampling ladder
 * (imp-97225-route-m-inverse-oversampling-ratio-ladder.js), which had baked the OVR(b) measurement
 * ladder but no chart-ready surface for it.
 *
 * Reshapes the baked imp-97225 IMP97225_LADDER rows (b = 101..4001) into a single chart-ready
 * series tracking the oversampling factor OVR(b) = M2w(b) / E_h[(c_0/a)^2 at a=b] alongside the
 * Cauchy-Schwarz ceiling sqrt(M2w) (csCeiling) and the target kappa_arith = 0.5705 the ceiling must
 * clear. Also derives the per-row margin ratio kappa_arith / csCeiling, which settles near the
 * measured ~1.38x.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (b, M2w, full, ovr, csCeiling, c1) value below is copied
 * verbatim from the imp-97225 baked IMP97225_LADDER (no re-derivation of the O(b^2) cotangent
 * kernels). Changes no bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (IMP97225_LADDER, IMP97225_MEASURED, IMP97225_VERDICT)
 *
 * Ticket: imp-97273 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import {
  IMP97225_LADDER,
  IMP97225_MEASURED,
  IMP97225_VERDICT,
} from './imp-97225-route-m-inverse-oversampling-ratio-ladder.js';

// one row per ladder point, ascending b, with the derived margin ratio kappa_arith / csCeiling.
export const IMP97273_OVERSAMPLING_ROWS = IMP97225_LADDER.map((row) => ({
  ...row,
  marginRatio: IMP97225_MEASURED.kappaArith / row.csCeiling,
}));

export const IMP97273_ASYMPTOTES = Object.freeze({
  ovr: IMP97225_MEASURED.ovrAsymptote, // OVR(b) settles ~1.25 for b >= 701
  csCeiling: IMP97225_MEASURED.csCeilingStable, // sqrt(M2w) settles ~0.414
  kappaArith: IMP97225_MEASURED.kappaArith, // target the ceiling must clear
  marginRatio: IMP97225_MEASURED.csMarginBelowKappaArith, // ~1.38x
});

export const IMP97273_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, M2w, full, ovr, csCeiling, ' +
  'c1) row is copied verbatim from the imp-97225 baked IMP97225_LADDER (no re-derivation of the O(b^2) ' +
  'cotangent kernels); no bound is claimed and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97273_ASSERTIONS = [
  {
    id: 'imp97273-nine-rows-present',
    holds: () => IMP97273_OVERSAMPLING_ROWS.length === 9,
    why: 'imp-97225 measures the ladder at exactly nine b values (101..4001).',
  },
  {
    id: 'imp97273-ascending-b-order',
    holds: () =>
      IMP97273_OVERSAMPLING_ROWS.every(
        (r, i) => i === 0 || r.b > IMP97273_OVERSAMPLING_ROWS[i - 1].b,
      ),
    why: 'the ladder rows are sorted ascending by b for chart rendering.',
  },
  {
    id: 'imp97273-ovr-in-bounded-band',
    holds: () => IMP97273_OVERSAMPLING_ROWS.every((r) => r.ovr > 1.1 && r.ovr < 1.3),
    why: 'every row of the imp-97225 ladder carries an oversampling factor OVR in the bounded ~1.2-1.26 band, evidencing no drift.',
  },
  {
    id: 'imp97273-margin-ratio-above-one',
    holds: () => IMP97273_OVERSAMPLING_ROWS.every((r) => r.marginRatio > 1),
    why: 'the Cauchy-Schwarz ceiling sqrt(M2w) stays strictly below kappa_arith at every measured b, so the derived margin ratio exceeds 1.',
  },
  {
    id: 'imp97273-margin-ratio-near-asymptote',
    holds: () => {
      const last = IMP97273_OVERSAMPLING_ROWS[IMP97273_OVERSAMPLING_ROWS.length - 1];
      return Math.abs(last.marginRatio - IMP97273_ASYMPTOTES.marginRatio) < 0.05;
    },
    why: 'the derived margin ratio kappa_arith / csCeiling at the largest measured b (4001) must sit near the ~1.38x asymptote quoted in imp-97225.',
  },
  {
    id: 'imp97273-verdict-cross-check',
    holds: () =>
      IMP97225_VERDICT.ovrBounded === true &&
      IMP97225_VERDICT.csCeilingBelowTargetThroughout === true &&
      IMP97225_VERDICT.anyBoundMoved === false &&
      IMP97225_VERDICT.qed === false,
    why: 'the viz leaf must agree with the source imp-97225 verdict flags: OVR bounded, ceiling below target throughout, no bound moved, no QED.',
  },
  {
    id: 'imp97273-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97273_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97273_HONEST_BANNER) &&
      /NO QED/.test(IMP97273_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97273_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97273-route-m-inverse-oversampling-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  rows: IMP97273_OVERSAMPLING_ROWS,
  asymptotes: IMP97273_ASYMPTOTES,
  banner: IMP97273_HONEST_BANNER,
};
