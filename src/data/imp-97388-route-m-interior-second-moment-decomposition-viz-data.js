/**
 * @module imp-97388-route-m-interior-second-moment-decomposition-viz-data
 *
 * imp-97388 (ux): import-light viz-data leaf for the imp-97349 interior second-moment
 * decomposition Q(b) = Qhat(b) + Qcross(b) + Qrr(b). Reshapes the imp-97349 baked measured
 * table (IMP97349_PIECES_MEASURED: QhatFrac, QrrOverB per b) plus the imp-97349 JSDoc RESULT 2
 * constant Qcross(b)/b ~ 0.0042 (stated stable to the 4th digit over b = 200..5000) into a
 * chart-ready per-b fraction table, showing Qhat carrying ~99.6% of Q(b) (the elementary,
 * log-polynomial skeleton with NO b^(1/2) term) while Qcross and Qrr are the tiny remaining
 * slivers, both LINEAR in b (so their fraction of Q(b) stays roughly constant across b).
 * No re-derivation: every number reused here is stated verbatim in the imp-97349 JSDoc/exports.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97349-route-m-diagonal-remainder-profile-separation.js (source of every figure reshaped here)
 *
 * Ticket: imp-97388 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-97349 (itself import-light, no zeros bundle).
 */

import {
  IMP97349_PIECES_MEASURED,
  IMP97349_SLOPE_PRECOPRIME,
  IMP97349_DENSITY_6_OVER_PI2,
  IMP97349_HONEST_BANNER,
} from './imp-97349-route-m-diagonal-remainder-profile-separation.js';

// Qcross(b)/b, stated stable to the 4th digit over b = 200..5000 (imp-97349 RESULT 2 JSDoc); reused verbatim.
export const IMP97388_QCROSS_OVER_B = 0.0042;

// the pre-coprimality skeleton slope times the average coprimality density -- the leading slope
// s0 of Q(b) ~ s0 b, baked in imp-97349 (matches the directly measured window-mean s0 ~ 1.764).
export const IMP97388_S0 = IMP97349_SLOPE_PRECOPRIME * IMP97349_DENSITY_6_OVER_PI2;

// Per-b decomposition fractions of Q(b), reshaped from the imp-97349 measured table: qhatFrac is
// the directly-measured Qhat/Qtot; qcrossFrac and qrrFrac approximate Qcross/Qtot and Qrr/Qtot by
// dividing the measured per-b ratios (Qcross/b, Qrr/b) by the leading slope s0 -- an approximation
// (not an identity, since Q(b)/b -> s0 only asymptotically), reused for chart scale only.
export const IMP97388_ROWS = Object.freeze(
  IMP97349_PIECES_MEASURED.map((row) =>
    Object.freeze({
      b: row.b,
      qhatFrac: row.QhatFrac,
      qcrossFrac: IMP97388_QCROSS_OVER_B / IMP97388_S0,
      qrrFrac: row.QrrOverB / IMP97388_S0,
      qrrOverB: row.QrrOverB,
      qcrossOverB: IMP97388_QCROSS_OVER_B,
    }),
  ),
);

export const IMP97388_HONEST_BANNER = IMP97349_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97388_ASSERTIONS = [
  {
    id: 'imp97388-rows-nonempty-and-b-increasing',
    holds: () =>
      IMP97388_ROWS.length >= 4 &&
      IMP97388_ROWS.every((r, i) => i === 0 || r.b > IMP97388_ROWS[i - 1].b),
    why: 'the reshaped per-b table must carry the same strictly-increasing b ladder as the imp-97349 measured table.',
  },
  {
    id: 'imp97388-qhat-dominates-every-row',
    holds: () => IMP97388_ROWS.every((r) => r.qhatFrac > 0.99),
    why: 'Qhat must carry the reported ~99.6% of Q(b) at every b in the ladder -- the headline decomposition fact.',
  },
  {
    id: 'imp97388-qcross-exceeds-qrr-and-both-tiny',
    holds: () =>
      IMP97388_ROWS.every((r) => r.qcrossFrac > r.qrrFrac && r.qcrossFrac < 0.01 && r.qrrFrac < 0.01),
    why: 'the imp-97349 measured constants require Qcross/b (0.0042) > Qrr/b (~0.0003), and both fractions of Q(b) must stay well under 1%.',
  },
  {
    id: 'imp97388-fractions-approximately-close-the-total',
    holds: () =>
      IMP97388_ROWS.every((r) => {
        const total = r.qhatFrac + r.qcrossFrac + r.qrrFrac;
        return Math.abs(total - 1) < 0.01;
      }),
    why: 'qhatFrac + qcrossFrac + qrrFrac must reconcile to 1 within 1% (an approximation via the leading slope s0, not an exact identity).',
  },
  {
    id: 'imp97388-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97388_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97388_HONEST_BANNER) &&
      /NO QED/.test(IMP97388_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97388_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97388-route-m-interior-second-moment-decomposition-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  rows: IMP97388_ROWS,
  s0: IMP97388_S0,
  qcrossOverB: IMP97388_QCROSS_OVER_B,
  banner: IMP97388_HONEST_BANNER,
};
