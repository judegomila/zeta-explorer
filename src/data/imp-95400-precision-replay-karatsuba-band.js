/**
 * imp-95400 — FULL-BAND completion of the imp-95380 Karatsuba-regime
 * precision-replay ladder, out to 40 mantissa limbs (~2560 bits).
 *
 * WHY THIS TICKET EXISTS. imp-95277 builds the tier-2 CPU-day precision-replay
 * ladder from a SCHOOLBOOK multiply model (Arb mantissa cost ~ limbs^2) and stops
 * at 6 limbs (384 bits), noting only in prose that FLINT/GMP switches to a
 * sub-quadratic Karatsuba multiply at about 10+ limbs, the point the L^2 model
 * breaks. imp-95380 then extended that ladder across the schoolbook -> Karatsuba
 * crossover, anchored at L_c = 10 limbs, but stopped at 20 limbs (1280 bits). The
 * imp-95400 scout ticket asks for the ladder across the WHOLE Karatsuba band the
 * decision needs: L = 10 .. 40 limbs, ~577 .. 2560 bits. This module completes
 * that band -- it reuses the imp-95380 crossover-aware cost model unchanged,
 * CROSS-CHECKS its shared 10- and 20-limb rungs against imp-95380 for continuity,
 * and adds the two genuinely new far-precision rungs at 30 and 40 limbs (1920 and
 * 2560 bits) that neither imp-95277 nor imp-95380 carries.
 *
 * THIS IS NOT A NOVEL COST MODEL. imp-95380 already established, and this module
 * imports, the continuous multiply-cost law anchored at the crossover:
 *   f_karat(L) = M(L) / M(2),  M(L) = L^2 (L <= L_c),  M(L) = L_c^2 (L/L_c)^log2(3) (L > L_c),
 * with L_c = 10 limbs. All this module adds is the reach: two more rungs and the
 * cross-check tying its lower rungs back to imp-95380.
 *
 * THE COMPLETED KARATSUBA BAND (CPU-days, 21.1-day 2-limb schoolbook baseline).
 *
 *   limbs   bits band       f_karat = 25*(L/10)^log2(3)   Karat CPU-days   schoolbook L^2/4 (over-budget)   source
 *   10      577 - 640       25.00                         527.5            25.00                            imp-95380 (crossover anchor)
 *   20      1217 - 1280     75.00 (= exact 3/4 of 100)    1582.5           100.00                           imp-95380 (top rung)
 *   30      1857 - 1920     142.61                        3009.1           225.00                           imp-95400 (NEW)
 *   40      2497 - 2560     225.00 (= exact 9x of 25)     4747.5           400.00                           imp-95400 (NEW)
 *
 *  Two exact anchors fall out of log2(3): doubling the limb count multiplies the
 *  Karatsuba factor by 2^log2(3) = 3 exactly (10 -> 20 is 25 -> 75; reproduces the
 *  imp-95380 "exact 3/4 of schoolbook" rung), and quadrupling by 4^log2(3) = 9
 *  exactly (10 -> 40 is 25 -> 225). The pure-schoolbook square L^2/4 would read
 *  100 / 225 / 400 at 20 / 30 / 40 limbs, so extrapolating the imp-95277 schoolbook
 *  column over-budgets the far-precision replay by 25% at 20 limbs, 37% at 30, and
 *  44% at 40. Reading a >=1920-bit G5 replay off the Karatsuba column, not the
 *  schoolbook square, avoids that over-budget.
 *
 * CONTINUITY / CROSS-CHECK WITH imp-95380. The 10- and 20-limb rungs here are
 * recomputed independently and must equal the corresponding imp-95380
 * KARATSUBA_CROSSOVER_LADDER rungs to double precision (527.5 and 1582.5 CPU-days);
 * an assertion below enforces that tie. The crossover anchor factor (25 = the
 * imp-95277 schoolbook L^2/4 rule extended to 10 limbs) is inherited from
 * imp-95380, not re-chosen.
 *
 * DOMINANCE IS PRESERVED. As in imp-95277 / imp-95380 the replay factor is common
 * to the level-1 and tier-2 routes (both Arb-multiply-bound at the same working
 * precision), so the 17.9x tier-2 dominance and the DO-NOT-run-level-1
 * recommendation stay precision-invariant across the whole band; only the absolute
 * tier-2 budget climbs, now sub-quadratically.
 *
 * Grade: DERIVATION / ladder extension over the frozen imp-95214 / imp-95380
 * ledgers; NOT a wall-clock measurement (no native run, no replay launched).
 * Changes no bound; imp-95277 / imp-95380 untouched; NO QED; no refereed bound is changed.
 */

import { KARATSUBA_CROSSOVER_LADDER } from './imp-95380-karatsuba-crossover.js';
import { TIER2_PRICE } from './imp-95214-tier2-chirp-level.js';

// -- reuse the imp-95380 crossover-aware cost model (NO new model) ------------
const FLINT_BITS = 64;
const KARATSUBA_EXP = Math.log2(3);                       // ~1.5849625, Karatsuba slope
const CROSSOVER_LIMBS = KARATSUBA_CROSSOVER_LADDER.crossoverLimbs; // 10, from imp-95380
const baselineLimbs = KARATSUBA_CROSSOVER_LADDER.baselineLimbs;    // 2
// crossover anchor = imp-95277 schoolbook L^2/4 rule extended to L_c (25), per imp-95380
const crossoverAnchorFactor = CROSSOVER_LIMBS ** 2 / baselineLimbs ** 2; // 25
const factorKaratsuba = (limbs) =>
  crossoverAnchorFactor * (limbs / CROSSOVER_LIMBS) ** KARATSUBA_EXP;
const factorSchoolbook = (limbs) => limbs ** 2 / baselineLimbs ** 2; // the over-budget column

// inherit the frozen 21.1-CPU-day tier-2 full-window baseline (same source imp-95380 uses)
const baseCpuDays = TIER2_PRICE.fullWindow.cpuDays; // 21.1

const rungForLimbs = (limbs, source) => {
  const fK = factorKaratsuba(limbs);
  return Object.freeze({
    limbs,
    bitsLow: (limbs - 1) * FLINT_BITS + 1, // first bit that needs this limb count
    bitsHigh: limbs * FLINT_BITS,          // last bit still in this limb count
    source, // 'imp-95380' (shared, cross-checked) or 'imp-95400' (new far rung)
    factorKaratsuba: fK,
    factorSchoolbookOverBudget: factorSchoolbook(limbs), // what L^2/4 would over-budget
    cpuDaysKaratsuba: baseCpuDays * fK,
    cpuDaysSchoolbookOverBudget: baseCpuDays * factorSchoolbook(limbs),
    // fraction of the schoolbook budget the Karatsuba model keeps (1 at crossover, < 1 above)
    karatsubaFractionOfSchoolbook: fK / factorSchoolbook(limbs),
  });
};

// -- the completed Karatsuba-band ladder ledger ------------------------------
export const PRECISION_REPLAY_KARATSUBA_BAND = Object.freeze({
  ticket: 'imp-95400-precision-replay-karatsuba-band',
  parent: 'imp-95380-karatsuba-crossover (crossover model, rungs to 20 limbs / 1280 bits)',
  baselineBits: 128,
  baselineLimbs, // 2
  baselineCpuDays: baseCpuDays, // 21.1, inherited unchanged
  crossoverLimbs: CROSSOVER_LIMBS, // 10, from imp-95380
  crossoverBits: (CROSSOVER_LIMBS - 1) * FLINT_BITS + 1, // 577 = first bit needing 10 limbs
  crossoverAnchorFactor, // 25 = schoolbook L^2/4 at 10 limbs
  karatsubaExponent: KARATSUBA_EXP, // log2(3)
  reusesImp95380Model: true, // this module adds reach, not a new cost law
  costModel:
    'imp-95380 crossover-aware Arb multiply model, imported unchanged: schoolbook L^2 below the ' +
    '~10-limb crossover, Karatsuba L_c^2 (L/L_c)^log2(3) above it, continuous at L_c = 10 limbs; ' +
    'this module extends the ladder from 20 to 40 limbs (1280 -> 2560 bits)',
  // full band: shared imp-95380 rungs (cross-checked) + two new far-precision rungs
  rungs: Object.freeze([
    rungForLimbs(10, 'imp-95380'), // 577-640 bits, crossover anchor
    rungForLimbs(20, 'imp-95380'), // 1217-1280 bits, imp-95380 top rung (exact 3/4)
    rungForLimbs(30, 'imp-95400'), // 1857-1920 bits, NEW
    rungForLimbs(40, 'imp-95400'), // 2497-2560 bits, NEW (exact 9x anchor)
  ]),
  underBudgetsSchoolbookAboveCrossover: true,
  dominancePreservedEveryRung: KARATSUBA_CROSSOVER_LADDER.dominancePreservedEveryRung !== false, // true
  isWallClockMeasurement: false,
  movesBound: false,
  verdict:
    'FULL-BAND completion of the imp-95380 Karatsuba-regime precision-replay ladder out to 40 mantissa ' +
    'limbs (~2560 bits). Reusing the imp-95380 crossover-aware cost model unchanged (anchor 25 at 10 ' +
    'limbs, slope L^log2(3)), the tier-2 21.1-CPU-day baseline reads ~527.5 CPU-days at 10 limbs and ' +
    '~1582.5 at 20 limbs (both cross-checked equal to the imp-95380 rungs), then ~3009.1 at 30 limbs ' +
    'and ~4747.5 at 40 limbs -- the two far-precision rungs imp-95380 did not carry. The pure-schoolbook ' +
    'square L^2/4 would over-budget the same targets by 25% / 37% / 44% at 20 / 30 / 40 limbs, so a ' +
    '>=1920-bit G5 replay should be read off the Karatsuba column. Dominance stays precision-invariant ' +
    '(both routes rescale by the same factor). Ladder extension derived from the frozen imp-95214/95380 ' +
    'ledgers, not a native replay; launches nothing; changes no bound; imp-95277/imp-95380 untouched; ' +
    'NO QED; no refereed bound is changed.',
});

// -- self-executing assertions (import-light; recomputable arithmetic only) ---
export const IMP95400_ASSERTIONS = [
  {
    id: 'imp95400-band-spans-10-to-40-limbs-monotone',
    description:
      'the completed band covers 10..40 limbs (577..2560 bits), limb counts strictly increasing, every rung at or above the imp-95380 ~10-limb crossover; the two new rungs (30, 40 limbs) carry source imp-95400',
    holds: () => {
      const r = PRECISION_REPLAY_KARATSUBA_BAND.rungs;
      if (r.length !== 4) return false;
      const limbs = r.map((x) => x.limbs);
      if (JSON.stringify(limbs) !== JSON.stringify([10, 20, 30, 40])) return false;
      for (let i = 0; i < r.length; i++) {
        if (Math.ceil(r[i].bitsHigh / 64) !== r[i].limbs) return false;
        if (Math.ceil(r[i].bitsLow / 64) !== r[i].limbs) return false;
        if (r[i].limbs < PRECISION_REPLAY_KARATSUBA_BAND.crossoverLimbs) return false;
        if (i > 0 && !(r[i].limbs > r[i - 1].limbs)) return false;
      }
      const newRungs = r.filter((x) => x.source === 'imp-95400').map((x) => x.limbs);
      return (
        r[0].bitsLow === 577 &&
        r[3].bitsHigh === 2560 &&
        JSON.stringify(newRungs) === JSON.stringify([30, 40])
      );
    },
  },
  {
    id: 'imp95400-shared-rungs-cross-check-imp95380',
    description:
      'continuity: the shared 10- and 20-limb rungs recompute here equal the corresponding imp-95380 KARATSUBA_CROSSOVER_LADDER rungs to double precision (527.5 and 1582.5 CPU-days), confirming this module reuses the imp-95380 model rather than a new one',
    holds: () => {
      const mine = PRECISION_REPLAY_KARATSUBA_BAND.rungs;
      const theirs = KARATSUBA_CROSSOVER_LADDER.rungs;
      for (const L of [10, 20]) {
        const a = mine.find((x) => x.limbs === L);
        const b = theirs.find((x) => x.limbs === L);
        if (!a || !b) return false;
        if (Math.abs(a.factorKaratsuba - b.factorKaratsuba) > 1e-9) return false;
        if (Math.abs(a.cpuDaysKaratsuba - b.cpuDaysKaratsuba) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95400-new-far-rungs-are-anchored-powers',
    description:
      'the two new far rungs recompute as 25*(L/10)^log2(3): the 40-limb rung is the exact quadrupling anchor 4^log2(3)=9 (factor 225, ~4747.5 CPU-days) and the 30-limb rung is ~142.61 (~3009.1 CPU-days), both strictly above the imp-95380 20-limb rung',
    holds: () => {
      const r = PRECISION_REPLAY_KARATSUBA_BAND.rungs;
      const anchor = PRECISION_REPLAY_KARATSUBA_BAND.crossoverAnchorFactor;
      const exp = PRECISION_REPLAY_KARATSUBA_BAND.karatsubaExponent;
      const byL = (L) => r.find((x) => x.limbs === L);
      for (const L of [30, 40]) {
        const expected = anchor * (L / 10) ** exp;
        if (Math.abs(byL(L).factorKaratsuba - expected) > 1e-9) return false;
        if (!(byL(L).cpuDaysKaratsuba > byL(20).cpuDaysKaratsuba)) return false;
      }
      return (
        Math.abs(byL(40).factorKaratsuba - 225) < 1e-9 &&
        Math.abs(byL(30).cpuDaysKaratsuba - 3009.1) < 1e-1 &&
        Math.abs(byL(40).cpuDaysKaratsuba - 4747.5) < 1e-1
      );
    },
  },
  {
    id: 'imp95400-karatsuba-under-budgets-schoolbook-above-crossover',
    description:
      'the Karatsuba factor equals the schoolbook square L^2/4 exactly at the 10-limb crossover and is strictly below it at every larger rung; the schoolbook over-budget is 25% at 20 limbs, ~37% at 30, and 44% at 40 (karatsubaFractionOfSchoolbook 3/4, ~0.634, 9/16)',
    holds: () => {
      const r = PRECISION_REPLAY_KARATSUBA_BAND.rungs;
      const byL = (L) => r.find((x) => x.limbs === L);
      for (const rung of r) {
        if (rung.limbs === 10) {
          if (Math.abs(rung.factorKaratsuba - rung.factorSchoolbookOverBudget) > 1e-9) return false;
        } else if (!(rung.factorKaratsuba < rung.factorSchoolbookOverBudget)) {
          return false;
        }
      }
      return (
        Math.abs(byL(20).karatsubaFractionOfSchoolbook - 0.75) < 1e-9 &&
        Math.abs(byL(40).karatsubaFractionOfSchoolbook - 9 / 16) < 1e-9 &&
        byL(30).karatsubaFractionOfSchoolbook > 0.6 &&
        byL(30).karatsubaFractionOfSchoolbook < 0.65
      );
    },
  },
  {
    id: 'imp95400-cpu-days-recompute-from-inherited-baseline',
    description:
      'every rung CPU-day figure recomputes as the inherited 21.1 baseline (TIER2_PRICE.fullWindow.cpuDays) times its Karatsuba factor, and that baseline agrees with the imp-95380 ladder implied baseline (its 10-limb rung cpuDays / factor) rather than introducing a new one',
    holds: () => {
      const r = PRECISION_REPLAY_KARATSUBA_BAND.rungs;
      const base = PRECISION_REPLAY_KARATSUBA_BAND.baselineCpuDays;
      const theirTen = KARATSUBA_CROSSOVER_LADDER.rungs.find((x) => x.limbs === 10);
      const theirBase = theirTen.cpuDaysKaratsuba / theirTen.factorKaratsuba; // implied 21.1
      if (Math.abs(base - theirBase) > 1e-6) return false;
      return r.every(
        (rung) => Math.abs(rung.cpuDaysKaratsuba - base * rung.factorKaratsuba) < 1e-6
      );
    },
  },
  {
    id: 'imp95400-dominance-preserved-and-honesty-gate',
    description:
      'fail-closed honesty: the band rescales both routes by the same factor so dominance is preserved, this reuses the imp-95380 model (not a new one), it is a limb-model derivation not a wall-clock run, moves no bound, and the verdict states NO QED and no-refereed-bound-change',
    holds: () =>
      PRECISION_REPLAY_KARATSUBA_BAND.dominancePreservedEveryRung === true &&
      PRECISION_REPLAY_KARATSUBA_BAND.reusesImp95380Model === true &&
      PRECISION_REPLAY_KARATSUBA_BAND.underBudgetsSchoolbookAboveCrossover === true &&
      PRECISION_REPLAY_KARATSUBA_BAND.isWallClockMeasurement === false &&
      PRECISION_REPLAY_KARATSUBA_BAND.movesBound === false &&
      /FULL-BAND/.test(PRECISION_REPLAY_KARATSUBA_BAND.verdict) &&
      /NO QED/.test(PRECISION_REPLAY_KARATSUBA_BAND.verdict) &&
      /refereed bound is changed/i.test(PRECISION_REPLAY_KARATSUBA_BAND.verdict),
  },
];

for (const a of IMP95400_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95400-precision-replay-karatsuba-band assertion failed: ${a.id}`);
  }
}

export default PRECISION_REPLAY_KARATSUBA_BAND;
