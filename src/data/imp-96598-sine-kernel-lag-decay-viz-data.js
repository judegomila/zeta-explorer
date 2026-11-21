/**
 * @module imp-96598-sine-kernel-lag-decay-viz-data
 *
 * imp-96598 (ux): import-light viz-data leaf for the imp-96567 box-averaged
 * GUE sine-kernel lag decay -- rho_k vs k. Plots the direct lag correlations
 * rho_1..rho_6 against the closed-form O(1/k^2) tail curve
 * rho_k = -(1/(2 pi^2 Sigma^2)) ln(k^2/(k^2-1)), and marks the ~8.9x gap
 * between rho_1 = -0.4640 and that tail curve (the FALSE-ANCHORING artifact
 * imp-96567 resolved), plus the bounded telescoping tail sum
 * sum_{k>=2} rho_k = -0.036022.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every number here is reused verbatim from
 * imp-96567 (numberVariance, directLagCorrelations, closedFormTail.tailCoeff,
 * reconciliation.rho1AboveTailFactor, tailBudget.rhoSum); only the closed-form
 * curve over an extended k-range (k=2..12, for the chart) is recomputed here
 * from those same baked inputs, using the identical formula. Changes no
 * bound, establishes no operator positivity, no RH claim; conditional on the
 * GUE sine kernel / Montgomery pair correlation (UNPROVEN); no refereed bound is changed
 * ; RH open. NO QED.
 *
 * @see imp-96567-box-averaged-sine-kernel-lag-decay.js (source finding + all baked inputs)
 *
 * Ticket: imp-96598 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96567_BOX_AVERAGED_SINE_KERNEL_LAG_DECAY as SRC,
  IMP96567_HONEST_BANNER,
} from './imp-96567-box-averaged-sine-kernel-lag-decay.js';

const PI = Math.PI;
const SIGMA2 = SRC.numberVariance; // 0.974834, baked in imp-96567
const TAIL_COEFF = SRC.closedFormTail.tailCoeff; // -0.051968

// Same closed-form tail re-derived on the imp-96567 baked Sigma^2 (no new measurement).
const covClosed = (k) => -Math.log((k * k) / (k * k - 1)) / (2 * PI * PI);
const rhoClosed = (k) => covClosed(k) / SIGMA2;

const K_MAX = 12;

export const IMP96598_LAG_LADDER = Object.freeze(
  Array.from({ length: K_MAX }, (_, i) => i + 1).map((k) => {
    const direct = SRC.directLagCorrelations[k] ?? null; // only baked for k=1..6
    const closed = k >= 2 ? rhoClosed(k) : null; // the tail law does not apply at k=1
    return Object.freeze({ k, direct, closed });
  }),
);

// The reconciliation core this page exists to illustrate: rho_1 sits far above the tail curve.
export const IMP96598_RHO1_GAP = Object.freeze({
  rho1: SRC.directLagCorrelations[1], // -0.463978
  tailCoeffAtK1: TAIL_COEFF, // -0.051968 (the tail curve extrapolated to k=1, NOT a valid rho_1 estimate)
  aboveTailFactor: SRC.reconciliation.rho1AboveTailFactor, // ~8.93x
  mechanism:
    'rho_1 obeys the touching-box union identity (log number variance), not the k>=2 O(1/k^2) tail law.',
});

// The bounded telescoping tail this page marks alongside the curve.
export const IMP96598_TAIL_SUM = Object.freeze({
  rhoSum: SRC.tailBudget.rhoSum, // -0.036022
  note: SRC.tailBudget.note,
});

export const IMP96598_HONEST_BANNER = IMP96567_HONEST_BANNER;

// --- self-executing internal-consistency assertions (recompute vs. imp-96567 baked values) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  if (IMP96598_LAG_LADDER.length !== K_MAX) throw new Error('imp-96598: lag ladder must have K_MAX rows');
  if (IMP96598_LAG_LADDER[0].direct !== SRC.directLagCorrelations[1] || IMP96598_LAG_LADDER[0].closed !== null)
    throw new Error('imp-96598: k=1 row must carry the direct rho_1 and no closed-form tail value');

  // the recomputed closed-form curve must match imp-96567's own baked rho_2/rho_3 to tight tolerance
  if (!approx(rhoClosed(2), SRC.closedFormTail.rho2, 1e-9)) throw new Error('imp-96598: recomputed rho_2 drifted from imp-96567');
  if (!approx(rhoClosed(3), SRC.closedFormTail.rho3, 1e-9)) throw new Error('imp-96598: recomputed rho_3 drifted from imp-96567');

  // every direct and closed-form value on the ladder must be nonpositive (sign engine)
  for (const row of IMP96598_LAG_LADDER) {
    if (row.direct !== null && !(row.direct <= 0)) throw new Error('imp-96598: direct rho_k must be nonpositive');
    if (row.closed !== null && !(row.closed <= 0)) throw new Error('imp-96598: closed-form rho_k must be nonpositive');
  }

  // the closed-form curve magnitude must be monotonically decreasing for k>=2
  for (let i = 1; i < IMP96598_LAG_LADDER.length; i++) {
    const prev = IMP96598_LAG_LADDER[i - 1];
    const cur = IMP96598_LAG_LADDER[i];
    if (prev.closed !== null && cur.closed !== null && !(Math.abs(cur.closed) < Math.abs(prev.closed)))
      throw new Error('imp-96598: closed-form tail magnitude must decrease with k');
  }

  // rho_1 sits ~8.9x above the tail-curve extrapolation (the gap this page visualizes)
  if (!(IMP96598_RHO1_GAP.aboveTailFactor > 8 && IMP96598_RHO1_GAP.aboveTailFactor < 10))
    throw new Error('imp-96598: rho_1-above-tail factor must sit in (8, 10)');
  if (!approx(Math.abs(IMP96598_RHO1_GAP.rho1) / Math.abs(IMP96598_RHO1_GAP.tailCoeffAtK1), IMP96598_RHO1_GAP.aboveTailFactor, 1e-3))
    throw new Error('imp-96598: rho_1/tailCoeff ratio must reproduce the reported above-tail factor');

  // the k>=2 tail sum is small and bounded against rho_1
  if (!(Math.abs(IMP96598_TAIL_SUM.rhoSum) < Math.abs(IMP96598_RHO1_GAP.rho1)))
    throw new Error('imp-96598: tail sum must be small against rho_1');
  if (!approx(IMP96598_TAIL_SUM.rhoSum, -0.036022, 1e-4)) throw new Error('imp-96598: tail sum drifted from the baked -0.036022');

  // honesty gates
  if (!(/RH open/.test(IMP96598_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96598_HONEST_BANNER) && /NO QED/.test(IMP96598_HONEST_BANNER)))
    throw new Error('imp-96598: honest banner missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96598_LAG_LADDER;
