/**
 * imp-95401 — LOCALIZING the true tier-2 precision-replay factor INSIDE the
 * imp-95277 [f_lo, f_up] bracket, from a static arb_poly_mullow limb-operation
 * profile of the frozen tier-2 kernel.
 *
 * WHY THIS TICKET EXISTS. imp-95277 builds the precision-replay cost ladder but
 * leaves each rung's replay factor bracketed between a schoolbook upper
 * f_up(L) = L^2 / 4 (all cost multiply-bound, mpn_mul ~ limbs^2) and a
 * linear-in-limbs lower f_lo(L) = L / 2 (all cost O(limbs)). It never locates
 * where the ACTUAL tier-2 multiply-heavy mix sits inside that gap. This module
 * localizes the operating point by a static operation-count decomposition of the
 * frozen tier-2 code -- NOT a native run, NOT a wall-clock measurement.
 *
 * THE OPERATION PROFILE (static, over the frozen tier-2 kernel).
 *
 *  imp-95277 records that the dominant tier-2 terms -- cell evaluation +
 *  reconstruction, delivered by arb_poly_mullow / ball-Taylor-shift -- are
 *  multiply-bound and account for w_mul = 68% of the 0.0525 CPU-s/x tier-2 total.
 *  Split the per-x tier-2 work into three limb-scaling classes:
 *
 *    (1) MULTIPLY-BOUND  w_mul  = 0.68  midpoint mpn_mul ~ limbs^2  -> scales f_up = L^2/4
 *    (2) NON-MULTIPLY    w_rest = 0.32  midpoint adds / normalization / carry-out
 *                                        (per arb ball op) ~ O(limbs) -> scales f_lo = L/2
 *                                        OR radius mag_t at a FIXED 30-bit word,
 *                                        precision-INDEPENDENT      -> scales 1
 *
 *  Class (1) is the only quadratic term; class (2) carries the residual
 *  uncertainty because part of the 32% (midpoint adds, limb normalization) scales
 *  linearly while part (the mag_t radius, loop/memory overhead) is precision-flat.
 *
 * THE LOCALIZED FACTOR. Blending the classes by their CPU-time weights collapses
 * the bracket to a point estimate plus a narrow residual sub-bracket:
 *
 *    f_hat(L)      = w_mul * f_up(L) + w_rest * f_lo(L)   (32% tail scales linear)
 *    f_hat_flat(L) = w_mul * f_up(L) + w_rest * 1         (32% tail precision-flat)
 *
 *  with f_hat_flat <= true factor <= f_hat. Per band (baseline L=2 is unit):
 *
 *    limbs L   f_lo   f_up   f_hat_flat   f_hat   pos-in-bracket   CPU-days (f_hat)
 *    2         1.00   1.00   1.00         1.00    --               21.1  (baseline)
 *    3         1.50   2.25   1.85         2.01    0.68             42.4
 *    4         2.00   4.00   3.04         3.36    0.68             70.9
 *    5         2.50   6.25   4.57         5.05    0.68            106.6
 *    6         3.00   9.00   6.44         7.08    0.68            149.4
 *
 *  TWO STRUCTURAL FACTS.
 *   - BAND-INVARIANT POSITION. Because f_hat = w_mul*f_up + (1-w_mul)*f_lo is an
 *     affine blend, its position (f_hat - f_lo)/(f_up - f_lo) equals w_mul = 0.68
 *     EXACTLY at every rung -- the true point sits at the multiply-bound weight
 *     of the bracket, band-independent (no per-band re-fit needed).
 *   - BRACKET COLLAPSE. The residual sub-bracket width f_hat - f_hat_flat =
 *     w_rest * (f_lo - 1) is only 11-21% of the original f_up - f_lo gap
 *     (0.16/0.32/0.48/0.64 vs 0.75/2.00/3.75/6.00 at L=3..6), so the localization
 *     shrinks the replay-factor uncertainty by ~5-9x per band.
 *
 * NOTHING MOVES. The blend rescales the level-1 and tier-2 routes by the same
 * factor, so the 17.9x dominance and the DO-NOT-run-level-1 recommendation are
 * unchanged; only the localized central estimate of the tier-2 budget is pinned.
 *
 * Grade: STATIC OPERATION-COUNT DERIVATION over the frozen imp-95214/95238/95257/
 * 95277 ledgers; NOT a native run, NOT a wall-clock measurement; launches nothing;
 * changes no bound; NO QED; no refereed bound is changed.
 */

import { PRECISION_REPLAY_LADDER } from './imp-95277-precision-replay-ladder.js';

// ── the multiply-bound CPU-time weight of the tier-2 kernel (imp-95277 prose) ──
const MULTIPLY_BOUND_FRACTION = 0.68; // arb_poly_mullow / ball-Taylor-shift share
const NON_MULTIPLY_FRACTION = 1 - MULTIPLY_BOUND_FRACTION; // 0.32

// ── localize each ladder rung inside its [f_lo, f_up] bracket ─────────────────
const localizeRung = (rung) => {
  const fUp = rung.factorUpper; // schoolbook L^2/4
  const fLo = rung.factorLower; // linear-in-limbs L/2
  // point estimate: 32% non-multiply tail scales linearly (conservative)
  const factorPoint = MULTIPLY_BOUND_FRACTION * fUp + NON_MULTIPLY_FRACTION * fLo;
  // residual-flat: 32% non-multiply tail is precision-independent (lower residual)
  const factorPointFlat = MULTIPLY_BOUND_FRACTION * fUp + NON_MULTIPLY_FRACTION * 1;
  // position of the point estimate within the original bracket in [0,1]
  const positionInBracket = fUp === fLo ? 0 : (factorPoint - fLo) / (fUp - fLo);
  const base = PRECISION_REPLAY_LADDER.baselineCpuDays; // 21.1
  return Object.freeze({
    limbs: rung.limbs,
    bitsLow: rung.bitsLow,
    bitsHigh: rung.bitsHigh,
    factorLower: fLo,
    factorUpper: fUp,
    factorPointFlat, // 32% tail precision-flat  (lower residual)
    factorPoint, // 32% tail linear-in-limbs (headline point estimate)
    positionInBracket, // = MULTIPLY_BOUND_FRACTION at every non-baseline rung
    residualSubBracketWidth: factorPoint - factorPointFlat,
    originalBracketWidth: fUp - fLo,
    cpuDaysPoint: base * factorPoint,
    cpuDaysPointFlat: base * factorPointFlat,
  });
};

// ── the localized-factor ledger ──────────────────────────────────────────────
export const TIER2_MULTIPLY_MIX_LOCALIZATION = Object.freeze({
  ticket: 'imp-95401-tier2-multiply-mix-localization',
  parent: 'imp-95277-precision-replay-ladder ([f_lo, f_up] bracket) + imp-95257 (68% multiply-bound share)',
  multiplyBoundFraction: MULTIPLY_BOUND_FRACTION,
  nonMultiplyFraction: NON_MULTIPLY_FRACTION,
  baselineCpuDays: PRECISION_REPLAY_LADDER.baselineCpuDays, // 21.1
  operationModel:
    'static arb_poly_mullow limb-operation profile: 68% midpoint mpn_mul ~ limbs^2 (f_up), ' +
    '32% midpoint add / normalization ~ O(limbs) (f_lo) or fixed 30-bit mag_t radius ' +
    '(precision-independent, factor 1); no native run',
  rungs: Object.freeze(PRECISION_REPLAY_LADDER.rungs.map(localizeRung)),
  // the affine blend sits at the multiply-bound weight of the bracket, every band
  positionInBracketIsBandInvariant: true,
  positionInBracketValue: MULTIPLY_BOUND_FRACTION,
  isWallClockMeasurement: false,
  isNativeRun: false,
  movesBound: false,
  verdict:
    'LOCALIZED the tier-2 precision-replay factor inside the imp-95277 [f_lo, f_up] bracket by a ' +
    'static arb_poly_mullow limb-operation profile of the frozen tier-2 kernel. Blending the 68% ' +
    'multiply-bound (schoolbook L^2/4) and 32% non-multiply (linear L/2) CPU-time shares gives a ' +
    'point estimate f_hat = 0.68*f_up + 0.32*f_lo that sits at position 0.68 of the bracket at ' +
    'EVERY band (affine blend => band-invariant), i.e. ~2.01x (129-192 bits), 3.36x (193-256), ' +
    '5.05x (257-320), 7.08x (321-384) -> ~42.4 / 70.9 / 106.6 / 149.4 CPU-days. The residual ' +
    'sub-bracket (whether the 32% tail is linear or precision-flat) is only 11-21% of the original ' +
    'gap, a ~5-9x collapse of the replay-factor uncertainty per band. The blend rescales both routes ' +
    'equally, so the 17.9x dominance and DO-NOT-run-level-1 recommendation are unchanged. Static ' +
    'operation-count derivation over the frozen imp-95214/95238/95257/95277 ledgers; not a native ' +
    'run; launches nothing; changes no bound; NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ────
export const IMP95401_ASSERTIONS = [
  {
    id: 'imp95401-point-estimate-lies-inside-the-bracket',
    description:
      'on every non-baseline rung the headline point estimate f_hat and the precision-flat residual sit strictly inside [f_lo, f_up]: f_lo < f_hat_flat <= f_hat < f_up',
    holds: () =>
      TIER2_MULTIPLY_MIX_LOCALIZATION.rungs.every((r) =>
        r.limbs === 2
          ? Math.abs(r.factorPoint - 1) < 1e-12 && Math.abs(r.factorPointFlat - 1) < 1e-12
          : r.factorLower < r.factorPointFlat &&
            r.factorPointFlat <= r.factorPoint &&
            r.factorPoint < r.factorUpper
      ),
  },
  {
    id: 'imp95401-position-in-bracket-is-band-invariant-multiply-weight',
    description:
      'because f_hat = w_mul*f_up + (1-w_mul)*f_lo is affine, its position in the bracket equals w_mul = 0.68 exactly on every rung where f_up != f_lo (band-invariant, no per-band re-fit)',
    holds: () =>
      TIER2_MULTIPLY_MIX_LOCALIZATION.rungs
        .filter((r) => r.factorUpper !== r.factorLower)
        .every((r) => Math.abs(r.positionInBracket - MULTIPLY_BOUND_FRACTION) < 1e-12),
  },
  {
    id: 'imp95401-point-factors-match-the-closed-form-blend',
    description:
      'the point factors recompute from the ladder brackets as 0.68*f_up + 0.32*f_lo and 0.68*f_up + 0.32 exactly (2.01 / 3.36 / 5.05 / 7.08 and 1.85 / 3.04 / 4.57 / 6.44 at L=3..6)',
    holds: () => {
      const expPoint = { 2: 1.0, 3: 2.01, 4: 3.36, 5: 5.05, 6: 7.08 };
      const expFlat = { 2: 1.0, 3: 1.85, 4: 3.04, 5: 4.57, 6: 6.44 };
      return TIER2_MULTIPLY_MIX_LOCALIZATION.rungs.every((r) => {
        const point = 0.68 * r.factorUpper + 0.32 * r.factorLower;
        const flat = 0.68 * r.factorUpper + 0.32;
        return (
          Math.abs(r.factorPoint - point) < 1e-12 &&
          Math.abs(r.factorPointFlat - flat) < 1e-12 &&
          Math.abs(r.factorPoint - expPoint[r.limbs]) < 1e-9 &&
          Math.abs(r.factorPointFlat - expFlat[r.limbs]) < 1e-9
        );
      });
    },
  },
  {
    id: 'imp95401-residual-sub-bracket-collapses-vs-original',
    description:
      'the residual sub-bracket width (f_hat - f_hat_flat) = 0.32*(f_lo - 1) is 11-21% of the original f_up - f_lo gap on every non-baseline rung (a ~5-9x collapse of the replay-factor uncertainty)',
    holds: () =>
      TIER2_MULTIPLY_MIX_LOCALIZATION.rungs
        .filter((r) => r.limbs > 2)
        .every((r) => {
          const ratio = r.residualSubBracketWidth / r.originalBracketWidth;
          return (
            Math.abs(r.residualSubBracketWidth - NON_MULTIPLY_FRACTION * (r.factorLower - 1)) < 1e-12 &&
            ratio > 0.1 &&
            ratio < 0.22
          );
        }),
  },
  {
    id: 'imp95401-cpu-days-recompute-from-frozen-baseline',
    description:
      'every rung CPU-day figure recomputes as 21.1 x factor for both the point and precision-flat estimates, the point column is strictly increasing across rungs, and the baseline rung equals the frozen 21.1',
    holds: () => {
      const r = TIER2_MULTIPLY_MIX_LOCALIZATION.rungs;
      const base = PRECISION_REPLAY_LADDER.baselineCpuDays;
      for (let i = 0; i < r.length; i++) {
        if (Math.abs(r[i].cpuDaysPoint - base * r[i].factorPoint) > 1e-9) return false;
        if (Math.abs(r[i].cpuDaysPointFlat - base * r[i].factorPointFlat) > 1e-9) return false;
        if (i > 0 && !(r[i].cpuDaysPoint > r[i - 1].cpuDaysPoint)) return false;
      }
      return Math.abs(r[0].cpuDaysPoint - base) < 1e-9;
    },
  },
  {
    id: 'imp95401-dominance-preserved-and-honesty-gate',
    description:
      'fail-closed honesty: the localization is a static operation-count derivation not a native run or wall-clock measurement, it moves no bound, weights sum to one, and the verdict states LOCALIZED, NO QED and no-refereed-bound-change',
    holds: () =>
      Math.abs(
        TIER2_MULTIPLY_MIX_LOCALIZATION.multiplyBoundFraction +
          TIER2_MULTIPLY_MIX_LOCALIZATION.nonMultiplyFraction -
          1
      ) < 1e-12 &&
      TIER2_MULTIPLY_MIX_LOCALIZATION.isWallClockMeasurement === false &&
      TIER2_MULTIPLY_MIX_LOCALIZATION.isNativeRun === false &&
      TIER2_MULTIPLY_MIX_LOCALIZATION.movesBound === false &&
      /LOCALIZED/.test(TIER2_MULTIPLY_MIX_LOCALIZATION.verdict) &&
      /NO QED/.test(TIER2_MULTIPLY_MIX_LOCALIZATION.verdict) &&
      /refereed bound is changed/i.test(TIER2_MULTIPLY_MIX_LOCALIZATION.verdict),
  },
];

for (const a of IMP95401_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95401-tier2-multiply-mix-localization assertion failed: ${a.id}`);
  }
}

export default TIER2_MULTIPLY_MIX_LOCALIZATION;
