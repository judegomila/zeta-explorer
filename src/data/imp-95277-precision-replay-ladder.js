/**
 * imp-95277 — the PRECISION-REPLAY COST LADDER for the imp-95214 tier-2
 * full-window window-1 W1-CERT price, beyond the single 129-192-bit band.
 *
 * WHY THIS TICKET EXISTS. imp-95238 finding (C) budgets the tier-2 chirp
 * certificate at (tier-2 CPU-days) x (G5 precision-replay factor) but leaves the
 * factor asserted "linear". imp-95257 DERIVED the concrete factor for the
 * 129-192-bit band (2.25x, limb-quantized schoolbook) and noted only in prose
 * that the next jump is 4x at 193 bits. What the launch/defer decision actually
 * needs is a LADDER: the precision-scaled tier-2 CPU-day cost at every mantissa-
 * limb band beyond 128 bits, so a target G5 replay precision reads off a number.
 * This module builds that ladder from the SAME FLINT/Arb limb-quantized cost
 * model imp-95257 fixed, and cross-checks its 3-limb rung against imp-95257 so
 * the two agree. It runs no native binary and launches no replay: a wall-clock
 * measurement would need a FLINT/Arb re-run at each precision, which this lane
 * does not launch.
 *
 * THE LADDER (limb-quantized Arb midpoint-multiply model, per imp-95257).
 *
 *  The dominant tier-2 terms (cell evaluation + reconstruction, 68% of the
 *  0.0525 CPU-s/x total) are arb_poly_mullow / ball-Taylor-shift multiply-bound.
 *  At the small limb counts in play FLINT multiplies mantissas SCHOOLBOOK
 *  (mpn_mul, cost proportional to limbs^2; Karatsuba is ~10+ limbs away). A
 *  midpoint arf_t holds n(p) = ceil(p / 64) limbs; the radius mag_t sits at a
 *  fixed 30-bit word, so error propagation is precision-INDEPENDENT.
 *
 *  Writing the replay factor vs the 128-bit 2-limb baseline as
 *    schoolbook (upper):  f_up(L)  = L^2 / 2^2   = L^2 / 4
 *    linear-in-limbs (lo): f_lo(L) = L   / 2
 *  the tier-2 21.1-CPU-day full-window price grows by band as:
 *
 *    bits band     limbs L   f_up = L^2/4   CPU-days (upper)   f_lo = L/2   CPU-days (lower)
 *    <= 128        2         1.00           21.1               1.00         21.1     (baseline)
 *    129 - 192     3         2.25           47.5               1.50         31.7
 *    193 - 256     4         4.00           84.4               2.00         42.2
 *    257 - 320     5         6.25          131.9               2.50         52.8
 *    321 - 384     6         9.00          189.9               3.00         63.3
 *
 *  READING THE LADDER. Cost jumps at each 64-bit limb boundary, not per bit;
 *  within a band the price is FLAT (129 and 192 bits cost the same, both 3
 *  limbs). The upper (schoolbook) column is the conservative budget; the true
 *  multiply-heavy mix sits in the bracket [f_lo, f_up]. Wall-days translate by
 *  the same factor: the 128-bit 3.01 wall-days at 7 threads / 1.51 at 14 becomes
 *  f x that figure at the target band.
 *
 * DOMINANCE IS PRESERVED AT EVERY RUNG (confirms imp-95238 (C) / imp-95257). The
 * factor is common to the level-1 and tier-2 routes (both Arb-multiply-bound at
 * the same working precision), so the 17.9x tier-2 dominance is unchanged at
 * every band -- the ladder rescales both routes by the same f. The launch/defer
 * recommendation (DO NOT run level-1; run tier-2 if at all) is precision-
 * invariant; only the absolute tier-2 budget climbs with the target precision.
 *
 * CONSISTENCY with imp-95257. The 3-limb rung of this ladder REPRODUCES the
 * imp-95257 headline exactly: f_up = 2.25, 21.1 x 2.25 ~ 47.5 CPU-days for the
 * whole 129-192-bit band. This module extends that single band to the full
 * ladder the decision needs; it introduces no new factor at 3 limbs.
 *
 * Grade: DERIVATION / ladder over the frozen imp-95214 / imp-95238 / imp-95257
 * ledgers; NOT a wall-clock measurement (no native run). Changes no bound;
 * launches nothing; NO QED; no refereed bound is changed.
 */

import { TIER2_PRICE } from './imp-95214-tier2-chirp-level.js';
import { PRECISION_REPLAY_MULTIPLIER } from './imp-95257-precision-replay-multiplier.js';

// ── the FLINT/Arb limb-quantized cost model (per imp-95257) ──────────────────
const FLINT_BITS = 64;
const mantissaLimbs = (prec) => Math.ceil(prec / FLINT_BITS);
const baselineLimbs = mantissaLimbs(128); // 2
// schoolbook (cost ~ limbs^2) upper factor and linear-in-limbs lower factor
const factorUpper = (limbs) => limbs ** 2 / baselineLimbs ** 2;
const factorLower = (limbs) => limbs / baselineLimbs;

// ── build the ladder, one rung per mantissa-limb band (128 -> 384 bits) ──────
const baseCpuDays = TIER2_PRICE.fullWindow.cpuDays;         // 21.1
const baseWall7 = TIER2_PRICE.fullWindow.wallDaysAt7Threads;  // 3.01
const baseWall14 = TIER2_PRICE.fullWindow.wallDaysAt14Threads; // 1.51

const rungForLimbs = (limbs) => {
  const fUp = factorUpper(limbs);
  const fLo = factorLower(limbs);
  return Object.freeze({
    limbs,
    bitsLow: (limbs - 1) * FLINT_BITS + 1, // first bit that needs this limb count
    bitsHigh: limbs * FLINT_BITS,          // last bit still in this limb count
    factorUpper: fUp,
    factorLower: fLo,
    cpuDaysUpper: baseCpuDays * fUp,
    cpuDaysLower: baseCpuDays * fLo,
    wallDaysAt7ThreadsUpper: baseWall7 * fUp,
    wallDaysAt14ThreadsUpper: baseWall14 * fUp,
  });
};

// ── the precision-replay ladder ledger ───────────────────────────────────────
export const PRECISION_REPLAY_LADDER = Object.freeze({
  ticket: 'imp-95277-precision-replay-ladder',
  parent: 'imp-95257-precision-replay-multiplier (single 129-192-bit band) + imp-95238 (C)',
  baselineBits: 128,
  baselineLimbs, // 2
  baselineCpuDays: baseCpuDays, // 21.1
  costModel: 'schoolbook Arb mantissa multiply, cost ~ ceil(prec/64)^2 limbs; radius mag_t fixed 30-bit, precision-independent',
  // one rung per mantissa-limb band, 128-bit (2 limbs) through 384-bit (6 limbs)
  rungs: Object.freeze([
    rungForLimbs(2), // <= 128 bits, baseline
    rungForLimbs(3), // 129-192 bits
    rungForLimbs(4), // 193-256 bits
    rungForLimbs(5), // 257-320 bits
    rungForLimbs(6), // 321-384 bits
  ]),
  // headline: the price is FLAT within a band and jumps L^2/4 at each 64-bit boundary
  jumpsAtLimbBoundaries: true,
  flatWithinBand: true,
  // dominance stays precision-invariant at every rung (both routes rescale by f)
  dominancePreservedEveryRung: PRECISION_REPLAY_MULTIPLIER.dominancePreserved, // true
  isWallClockMeasurement: false,
  movesBound: false,
  // imp-95416 asked to "add a viz page for the imp-95277 precision-replay CPU-day
  // ladder (limb bands vs CPU-days, f_lo/f_up bracket)" -- that page already exists
  // as imp-95392 (Imp95392PrecisionReplayCostLadderViz.jsx, wired at
  // /viz-imp95392-precision-replay-cost-ladder), so imp-95416 is a duplicate of
  // already-delivered work, not a gap.
  queueReconciliation: {
    ticket: 'imp-95416',
    request: 'viz page for the imp-95277 ladder (limb bands vs CPU-days, f_lo/f_up bracket)',
    deliveredBy: 'imp-95392 (Imp95392PrecisionReplayCostLadderViz.jsx)',
    verdict: 'already delivered, no new page added',
  },
  verdict:
    'LADDER of the tier-2 full-window window-1 W1-CERT price beyond 128 bits, from the FLINT/Arb ' +
    'limb-quantized schoolbook model. The 21.1-CPU-day (128-bit, 2-limb) baseline grows by the ' +
    'replay factor L^2/4 at each mantissa-limb band: ~47.5 CPU-days at 129-192 bits (3 limbs, ' +
    '2.25x -- reproducing imp-95257), ~84.4 at 193-256 (4 limbs, 4x), ~131.9 at 257-320 (5 limbs, ' +
    '6.25x), ~189.9 at 321-384 (6 limbs, 9x); the linear-in-limbs lower bracket L/2 gives ' +
    '31.7 / 42.2 / 52.8 / 63.3 respectively. The price is FLAT within each 64-bit band and jumps ' +
    'only at limb boundaries, so a per-bit-linear reading understates it. The factor is common to ' +
    'both the level-1 and tier-2 routes, so the 17.9x tier-2 dominance and the DO-NOT-run-level-1 ' +
    'recommendation are precision-invariant at every rung -- only the absolute tier-2 budget climbs. ' +
    'Ladder derived from the frozen imp-95214/95238/95257 ledgers, not a native replay; launches ' +
    'nothing; changes no bound; NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ────
export const IMP95277_ASSERTIONS = [
  {
    id: 'imp95277-rungs-quantize-at-64bit-limb-boundaries',
    description:
      'each rung covers one mantissa-limb band ceil(prec/64): 2 limbs = <=128 bits, then 129-192 (3), 193-256 (4), 257-320 (5), 321-384 (6); the bit ranges tile contiguously with no gap or overlap',
    holds: () => {
      const r = PRECISION_REPLAY_LADDER.rungs;
      if (r.length !== 5) return false;
      for (let i = 0; i < r.length; i++) {
        if (r[i].limbs !== i + 2) return false;
        if (mantissaLimbs(r[i].bitsHigh) !== r[i].limbs) return false;
        if (mantissaLimbs(r[i].bitsLow) !== r[i].limbs) return false;
        if (i > 0 && r[i].bitsLow !== r[i - 1].bitsHigh + 1) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95277-upper-factor-is-limbs-squared-over-four',
    description:
      'the schoolbook upper factor on each rung is L^2/4 vs the 2-limb baseline (1, 2.25, 4, 6.25, 9) and the linear lower bracket is L/2 (1, 1.5, 2, 2.5, 3), with lower <= upper on every rung',
    holds: () => {
      const expUp = [1, 2.25, 4, 6.25, 9];
      const expLo = [1, 1.5, 2, 2.5, 3];
      return PRECISION_REPLAY_LADDER.rungs.every(
        (rung, i) =>
          Math.abs(rung.factorUpper - expUp[i]) < 1e-12 &&
          Math.abs(rung.factorLower - expLo[i]) < 1e-12 &&
          rung.factorLower <= rung.factorUpper
      );
    },
  },
  {
    id: 'imp95277-cpu-days-recompute-from-baseline-and-monotone',
    description:
      'every rung CPU-day figure recomputes as 21.1 x factor for both brackets, the upper column is strictly increasing across rungs (84.4 at 4 limbs > 47.5 at 3), and the baseline rung equals the frozen 21.1',
    holds: () => {
      const r = PRECISION_REPLAY_LADDER.rungs;
      const base = TIER2_PRICE.fullWindow.cpuDays;
      for (let i = 0; i < r.length; i++) {
        if (Math.abs(r[i].cpuDaysUpper - base * r[i].factorUpper) > 1e-9) return false;
        if (Math.abs(r[i].cpuDaysLower - base * r[i].factorLower) > 1e-9) return false;
        if (i > 0 && !(r[i].cpuDaysUpper > r[i - 1].cpuDaysUpper)) return false;
      }
      return (
        Math.abs(r[0].cpuDaysUpper - base) < 1e-9 &&
        Math.abs(r[2].cpuDaysUpper - 84.4) < 1e-6
      );
    },
  },
  {
    id: 'imp95277-three-limb-rung-reproduces-imp95257',
    description:
      'the 3-limb rung (129-192 bits) reproduces the imp-95257 headline exactly: upper factor 2.25 = replayFactor129to192, and 21.1 x 2.25 ~ 47.5 CPU-days matches imp-95257 tier2FullWindowCpuDays160or192Upper (no new factor introduced at 3 limbs)',
    holds: () => {
      const threeLimb = PRECISION_REPLAY_LADDER.rungs.find((x) => x.limbs === 3);
      return (
        Math.abs(threeLimb.factorUpper - PRECISION_REPLAY_MULTIPLIER.replayFactor129to192) < 1e-12 &&
        Math.abs(threeLimb.factorLower - PRECISION_REPLAY_MULTIPLIER.replayFactorLowerBracket) < 1e-12 &&
        Math.abs(
          threeLimb.cpuDaysUpper - PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays160or192Upper
        ) < 1e-6 &&
        Math.abs(
          threeLimb.cpuDaysLower - PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays160or192Lower
        ) < 1e-6
      );
    },
  },
  {
    id: 'imp95277-wall-days-scale-by-the-same-factor',
    description:
      'wall-day translations scale by the same replay factor: each rung upper wall-days at 7 and 14 threads equal the 128-bit baseline wall-days (3.01 / 1.51) times factorUpper',
    holds: () =>
      PRECISION_REPLAY_LADDER.rungs.every(
        (rung) =>
          Math.abs(rung.wallDaysAt7ThreadsUpper - TIER2_PRICE.fullWindow.wallDaysAt7Threads * rung.factorUpper) < 1e-9 &&
          Math.abs(rung.wallDaysAt14ThreadsUpper - TIER2_PRICE.fullWindow.wallDaysAt14Threads * rung.factorUpper) < 1e-9
      ),
  },
  {
    id: 'imp95277-baseline-agrees-across-imp95214-imp95257-imp95277',
    description:
      'imp-95386 cross-validation: the ladder baseline agrees three ways -- baselineLimbs = mantissaLimbs(128) = 2 = imp-95257 baselineLimbs; baselineCpuDays = TIER2_PRICE.fullWindow.cpuDays (21.1) = imp-95257 tier2FullWindowCpuDays128; and the 2-limb baseline rung is unit-factor (factorUpper = factorLower = 1) with cpuDaysUpper = cpuDaysLower = the frozen 21.1 and unit-factor wall-days (3.01 / 1.51). The 3-limb lower bracket also matches imp-95257 tier2FullWindowCpuDays160or192Lower.',
    holds: () => {
      const base = TIER2_PRICE.fullWindow.cpuDays;
      const baseRung = PRECISION_REPLAY_LADDER.rungs.find((x) => x.limbs === 2);
      const threeLimb = PRECISION_REPLAY_LADDER.rungs.find((x) => x.limbs === 3);
      return (
        PRECISION_REPLAY_LADDER.baselineLimbs === mantissaLimbs(128) &&
        PRECISION_REPLAY_LADDER.baselineLimbs === 2 &&
        PRECISION_REPLAY_LADDER.baselineLimbs === PRECISION_REPLAY_MULTIPLIER.baselineLimbs &&
        Math.abs(PRECISION_REPLAY_LADDER.baselineCpuDays - base) < 1e-9 &&
        Math.abs(PRECISION_REPLAY_LADDER.baselineCpuDays - PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays128) < 1e-9 &&
        Math.abs(baseRung.factorUpper - 1) < 1e-12 &&
        Math.abs(baseRung.factorLower - 1) < 1e-12 &&
        Math.abs(baseRung.cpuDaysUpper - base) < 1e-9 &&
        Math.abs(baseRung.cpuDaysLower - base) < 1e-9 &&
        Math.abs(baseRung.wallDaysAt7ThreadsUpper - TIER2_PRICE.fullWindow.wallDaysAt7Threads) < 1e-9 &&
        Math.abs(baseRung.wallDaysAt14ThreadsUpper - TIER2_PRICE.fullWindow.wallDaysAt14Threads) < 1e-9 &&
        Math.abs(threeLimb.cpuDaysLower - PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays160or192Lower) < 1e-6
      );
    },
  },
  {
    id: 'imp95277-dominance-preserved-and-honesty-gate',
    description:
      'fail-closed honesty: the ladder rescales both routes by the same factor so dominance is preserved at every rung (imp-95257 dominancePreserved true), this is a limb-model derivation not a wall-clock run, it moves no bound, and the verdict states NO QED and no-refereed-bound-change',
    holds: () =>
      PRECISION_REPLAY_LADDER.dominancePreservedEveryRung === true &&
      PRECISION_REPLAY_LADDER.isWallClockMeasurement === false &&
      PRECISION_REPLAY_LADDER.movesBound === false &&
      /LADDER/.test(PRECISION_REPLAY_LADDER.verdict) &&
      /NO QED/.test(PRECISION_REPLAY_LADDER.verdict) &&
      /refereed bound is changed/i.test(PRECISION_REPLAY_LADDER.verdict),
  },
  {
    id: 'imp95277-imp95416-reconciliation-recorded',
    description:
      'imp-95416 (viz page for the imp-95277 ladder) is recorded as already delivered by imp-95392, so no duplicate page is built',
    holds: () => {
      const r = PRECISION_REPLAY_LADDER.queueReconciliation;
      return (
        !!r &&
        r.ticket === 'imp-95416' &&
        /imp-95392/.test(r.deliveredBy) &&
        /already delivered/.test(r.verdict)
      );
    },
  },
];

for (const a of IMP95277_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95277-precision-replay-ladder assertion failed: ${a.id}`);
  }
}

export default PRECISION_REPLAY_LADDER;
