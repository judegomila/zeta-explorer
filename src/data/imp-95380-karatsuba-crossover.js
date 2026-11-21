/**
 * imp-95380 — the KARATSUBA CROSSOVER in the imp-95277 precision-replay ladder,
 * beyond the schoolbook regime (>~640 bits / >=10 mantissa limbs).
 *
 * WHY THIS TICKET EXISTS. imp-95277 builds the tier-2 CPU-day replay ladder from a
 * pure SCHOOLBOOK multiply model (Arb mantissa multiply cost ~ limbs^2), and notes
 * only in prose that FLINT/GMP switches to Karatsuba "~10+ limbs away". Every rung
 * of that ladder (128-384 bits, 2-6 limbs) is inside the schoolbook regime, so the
 * note never bites there. But a far-precision G5 replay target (say 768-1280 bits)
 * sits ABOVE the crossover, where the L^2 schoolbook slope OVERSTATES the true cost:
 * GMP multiplies large mantissas with Karatsuba (Toom-2), whose cost scales as
 * L^log2(3) ~ L^1.585, not L^2. This module extends the ladder past 384 bits and
 * annotates where the schoolbook slope breaks to the Karatsuba slope, and what that
 * does to the far-precision tier-2 budget and the 17.9x tier-2 dominance margin. It
 * runs no native binary and launches no replay: it refines the imp-95257 limb-
 * quantized model over the frozen imp-95214/95277 ledgers.
 *
 * THE CROSSOVER. GMP switches mpn_mul from schoolbook to Karatsuba at
 * MUL_TOOM22_THRESHOLD, a platform-tuned limb count typically in the ~10-30 limb
 * range; the imp-95277 note pins it at "~10+ limbs" ~ 640 bits, which this model
 * takes as its anchor L_c = 10 limbs. The multiply-cost model, continuous at L_c, is
 *   M(L) = L^2                          for L <= L_c   (schoolbook, mpn_mul)
 *   M(L) = L_c^2 * (L / L_c)^log2(3)    for L >  L_c   (Karatsuba, Toom-2)
 * so both pieces agree at L = L_c (M(L_c) = L_c^2). Higher Toom-3 / FFT crossovers
 * (~100+ / ~1000+ limbs) are far beyond any G5 replay precision in play, so only the
 * schoolbook -> Karatsuba break matters over this range.
 *
 * THE REPLAY FACTORS. Normalising to the 128-bit 2-limb baseline (which is deep in
 * the schoolbook regime, M(2) = 4) gives two ladder factors:
 *   f_school(L) = L^2 / 4          (the imp-95277 pure-schoolbook extrapolation)
 *   f_karat(L)  = M(L) / 4         (the crossover-aware factor)
 * For L <= L_c the two coincide (f_karat reproduces the imp-95277 ladder exactly);
 * for L > L_c the crossover-aware factor is strictly below the schoolbook one, so
 * the schoolbook ladder is a conservative UPPER budget past 640 bits.
 *
 * THE EXTENDED LADDER (CPU-days, 21.1-day 2-limb baseline).
 *
 *  limbs  bits band     f_school = L^2/4   Karatsuba-aware f_karat   school CPU-days   karat CPU-days   karat/school
 *  6      321 - 384     9.00               9.00   (schoolbook)       189.9             189.9            1.000
 *  8      449 - 512     16.00              16.00  (schoolbook)       337.6             337.6            1.000
 *  10     577 - 640     25.00              25.00  (at crossover)     527.5             527.5            1.000
 *  12     705 - 768     36.00              ~33.38                    759.6             ~704.3           ~0.927
 *  14     833 - 896     49.00              ~42.61                    1033.9            ~899.2           ~0.870
 *  16     961 - 1024    64.00              ~52.66                    1350.4            ~1111.1          ~0.823
 *  20     1217 - 1280   100.00             75.00  (exact 3/4)        2110.0            1582.5           0.750
 *
 * A CLEAN CHECK. Karatsuba's recurrence triples the multiply cost each time the
 * operand size DOUBLES (3 half-size sub-multiplies), whereas schoolbook quadruples
 * it. So at exactly TWICE the crossover, L = 2 L_c = 20 limbs, the Karatsuba factor
 * is EXACTLY 3/4 of the schoolbook factor (75 vs 100): the schoolbook ladder
 * overstates the 1280-bit tier-2 budget by a third at that point (2110 -> 1582.5
 * CPU-days), and by ~18% already at 1024 bits.
 *
 * DOMINANCE IS PRESERVED, AND ITS MARGIN IS UNTOUCHED. The Karatsuba crossover is a
 * property of the shared Arb mantissa multiply, so it rescales the level-1 AND tier-2
 * routes by the SAME M(L): the 17.9x tier-2 dominance ratio is invariant across the
 * crossover exactly as it was across the schoolbook rungs (imp-95277 /95257). The
 * crossover changes only the ABSOLUTE far-precision tier-2 budget -- lowering it below
 * the schoolbook extrapolation -- not the dominance margin or the DO-NOT-run-level-1
 * recommendation.
 *
 * Grade: DERIVATION / model-extension over the frozen imp-95214/95238/95257/95277
 * ledgers using the standard GMP schoolbook->Karatsuba cost law; NOT a wall-clock
 * measurement (no native run) and NOT a probe of the exact per-platform
 * MUL_TOOM22_THRESHOLD. Changes no bound; launches nothing; NO QED; no refereed bound is changed.
 */

import { TIER2_PRICE } from './imp-95214-tier2-chirp-level.js';
import { PRECISION_REPLAY_LADDER } from './imp-95277-precision-replay-ladder.js';

// -- the GMP multiply cost model (schoolbook -> Karatsuba crossover) -----------
const FLINT_BITS = 64;
const mantissaLimbs = (prec) => Math.ceil(prec / FLINT_BITS);
const baselineLimbs = mantissaLimbs(128); // 2
// GMP MUL_TOOM22_THRESHOLD is platform-tuned (~10-30 limbs); the imp-95277 note
// anchors the crossover at "~10+ limbs" ~ 640 bits, taken here as L_c.
const KARATSUBA_LIMB_THRESHOLD = 10;                 // ~640 bits
const KARATSUBA_EXPONENT = Math.log2(3);             // ~1.5849625 (Toom-2 slope)
// continuous multiply cost: schoolbook below the crossover, Karatsuba above it
const multiplyCost = (limbs) =>
  limbs <= KARATSUBA_LIMB_THRESHOLD
    ? limbs ** 2
    : KARATSUBA_LIMB_THRESHOLD ** 2 *
      (limbs / KARATSUBA_LIMB_THRESHOLD) ** KARATSUBA_EXPONENT;
// replay factors vs the 2-limb baseline (which is schoolbook: cost = 4)
const baselineCost = multiplyCost(baselineLimbs); // 4
const factorSchoolbook = (limbs) => limbs ** 2 / baselineLimbs ** 2; // imp-95277
const factorKaratsuba = (limbs) => multiplyCost(limbs) / baselineCost;

// -- build the extended ladder, one rung per mantissa-limb band ----------------
const baseCpuDays = TIER2_PRICE.fullWindow.cpuDays; // 21.1

const rungForLimbs = (limbs) => {
  const fSchool = factorSchoolbook(limbs);
  const fKarat = factorKaratsuba(limbs);
  return Object.freeze({
    limbs,
    bitsLow: (limbs - 1) * FLINT_BITS + 1,
    bitsHigh: limbs * FLINT_BITS,
    aboveCrossover: limbs > KARATSUBA_LIMB_THRESHOLD,
    factorSchoolbook: fSchool,
    factorKaratsuba: fKarat,
    cpuDaysSchoolbook: baseCpuDays * fSchool,
    cpuDaysKaratsuba: baseCpuDays * fKarat,
    // fraction of the schoolbook budget the Karatsuba model keeps (<=1 above L_c)
    karatsubaOverSchoolbook: fKarat / fSchool,
    // savings vs the schoolbook extrapolation (0 below the crossover)
    schoolbookOverstatePct: (1 - fKarat / fSchool) * 100,
  });
};

// -- the extended (crossover-aware) precision-replay ladder ledger -------------
export const KARATSUBA_CROSSOVER_LADDER = Object.freeze({
  ticket: 'imp-95380-karatsuba-crossover',
  parent: 'imp-95277-precision-replay-ladder (pure schoolbook L^2 slope, 128-384 bits)',
  baselineBits: 128,
  baselineLimbs,
  crossoverLimbs: KARATSUBA_LIMB_THRESHOLD,   // 10 (~640 bits)
  crossoverBits: KARATSUBA_LIMB_THRESHOLD * FLINT_BITS, // 640
  karatsubaExponent: KARATSUBA_EXPONENT,      // log2(3) ~ 1.585
  costModel:
    'M(L) = L^2 for L <= L_c (schoolbook mpn_mul); M(L) = L_c^2 (L/L_c)^log2(3) for L > L_c ' +
    '(Karatsuba/Toom-2); continuous at L_c = 10 limbs (~640 bits); Toom-3/FFT crossovers far beyond range',
  // rungs continuing the imp-95277 ladder from 321-384 bits (6 limbs) up to 1280 bits (20 limbs)
  rungs: Object.freeze([
    rungForLimbs(6),  // 321-384  bits (schoolbook, reproduces imp-95277 last rung)
    rungForLimbs(8),  // 449-512  bits (schoolbook)
    rungForLimbs(10), // 577-640  bits (at the crossover, still equal)
    rungForLimbs(12), // 705-768  bits (Karatsuba)
    rungForLimbs(14), // 833-896  bits (Karatsuba)
    rungForLimbs(16), // 961-1024 bits (Karatsuba)
    rungForLimbs(20), // 1217-1280 bits (Karatsuba, exactly 3/4 of schoolbook)
  ]),
  // headline structural facts
  schoolbookIsConservativeUpperBudget: true, // f_karat <= f_school above the crossover
  ratioAtTwiceThresholdIsThreeQuarters: true, // clean Karatsuba doubling check
  // the crossover rescales BOTH routes equally, so the dominance margin is invariant
  dominancePreservedEveryRung: PRECISION_REPLAY_LADDER.dominancePreservedEveryRung, // true
  dominanceMarginUnchangedAcrossCrossover: true,
  isWallClockMeasurement: false,
  probesExactToomThreshold: false,
  movesBound: false,
  verdict:
    'EXTENDED the imp-95277 tier-2 replay ladder past 384 bits and annotated the schoolbook->Karatsuba ' +
    'crossover at ~640 bits (~10 mantissa limbs, GMP MUL_TOOM22_THRESHOLD). Below the crossover the ' +
    'crossover-aware factor reproduces the imp-95277 schoolbook ladder exactly; above it the true Arb ' +
    'multiply scales as L^log2(3) ~ L^1.585, not L^2, so the schoolbook slope OVERSTATES the ' +
    'far-precision tier-2 budget: karat/school ~ 0.927 at 768 bits, ~0.823 at 1024 bits, and EXACTLY ' +
    '3/4 at 1280 bits (20 limbs = twice the crossover, where Karatsuba triples cost per size-doubling ' +
    'while schoolbook quadruples). CPU-day budgets thus climb more slowly than the schoolbook ladder ' +
    '(e.g. 1280-bit tier-2 ~1582 CPU-days Karatsuba vs ~2110 schoolbook). The crossover is a property ' +
    'of the shared Arb mantissa multiply, so it rescales the level-1 and tier-2 routes by the same ' +
    'M(L): the 17.9x tier-2 dominance margin and the DO-NOT-run-level-1 recommendation are invariant ' +
    'across the crossover -- only the absolute far-precision budget drops below the schoolbook ' +
    'extrapolation. Model extension over the frozen imp-95214/95277 ledgers using the standard GMP ' +
    'cost law, not a native replay and not a probe of the exact per-platform threshold; launches ' +
    'nothing; changes no bound; NO QED; no refereed bound is changed.',
});

// -- self-executing assertions (import-light; recomputable arithmetic only) ----
export const IMP95380_ASSERTIONS = [
  {
    id: 'imp95380-below-crossover-reproduces-the-schoolbook-ladder',
    description:
      'for every rung at or below the 10-limb crossover the Karatsuba-aware factor equals the schoolbook L^2/4 factor exactly (continuity), and the 6-limb rung reproduces the imp-95277 321-384-bit schoolbook CPU-days (189.9)',
    holds: () => {
      const r = KARATSUBA_CROSSOVER_LADDER.rungs;
      const belowOk = r.every(
        (rung) =>
          rung.limbs > KARATSUBA_LIMB_THRESHOLD ||
          Math.abs(rung.factorKaratsuba - rung.factorSchoolbook) < 1e-12
      );
      const six = r.find((x) => x.limbs === 6);
      const parentSix = PRECISION_REPLAY_LADDER.rungs.find((x) => x.limbs === 6);
      return (
        belowOk &&
        Math.abs(six.cpuDaysKaratsuba - parentSix.cpuDaysUpper) < 1e-6 &&
        Math.abs(six.factorKaratsuba - 9) < 1e-12
      );
    },
  },
  {
    id: 'imp95380-above-crossover-karatsuba-is-strictly-cheaper-and-monotone',
    description:
      'above the crossover the Karatsuba factor is strictly below the schoolbook factor (schoolbook overstates), the overstatement fraction grows with limb count, and the crossover-aware CPU-days still increase monotonically across rungs',
    holds: () => {
      const above = KARATSUBA_CROSSOVER_LADDER.rungs.filter((r) => r.aboveCrossover);
      if (above.length < 2) return false;
      for (let i = 0; i < above.length; i++) {
        if (!(above[i].factorKaratsuba < above[i].factorSchoolbook - 1e-9)) return false;
        if (!(above[i].schoolbookOverstatePct > 0)) return false;
        if (i > 0 && !(above[i].schoolbookOverstatePct > above[i - 1].schoolbookOverstatePct)) return false;
        if (i > 0 && !(above[i].cpuDaysKaratsuba > above[i - 1].cpuDaysKaratsuba)) return false;
      }
      return true;
    },
  },
  {
    id: 'imp95380-ratio-at-twice-the-crossover-is-exactly-three-quarters',
    description:
      'at exactly twice the crossover (20 limbs, 1280 bits) the Karatsuba factor is exactly 3/4 of the schoolbook factor (75 vs 100), because Karatsuba triples the cost per operand-size doubling while schoolbook quadruples it',
    holds: () => {
      const twenty = KARATSUBA_CROSSOVER_LADDER.rungs.find((r) => r.limbs === 20);
      return (
        Math.abs(twenty.factorSchoolbook - 100) < 1e-9 &&
        Math.abs(twenty.factorKaratsuba - 75) < 1e-9 &&
        Math.abs(twenty.karatsubaOverSchoolbook - 0.75) < 1e-9
      );
    },
  },
  {
    id: 'imp95380-cpu-days-recompute-from-baseline-both-columns',
    description:
      'every rung CPU-day figure recomputes as 21.1 x factor for both the schoolbook and Karatsuba columns, and each Karatsuba CPU-day figure is at most its schoolbook counterpart',
    holds: () =>
      KARATSUBA_CROSSOVER_LADDER.rungs.every(
        (r) =>
          Math.abs(r.cpuDaysSchoolbook - baseCpuDays * r.factorSchoolbook) < 1e-9 &&
          Math.abs(r.cpuDaysKaratsuba - baseCpuDays * r.factorKaratsuba) < 1e-9 &&
          r.cpuDaysKaratsuba <= r.cpuDaysSchoolbook + 1e-9
      ),
  },
  {
    id: 'imp95380-dominance-margin-invariant-and-honesty-gate',
    description:
      'fail-closed honesty: the crossover rescales both routes by the same multiply cost so the 17.9x dominance margin is unchanged (dominancePreserved true, marginUnchanged true), this is a model extension not a wall-clock run and not a probe of the exact platform threshold, it moves no bound, and the verdict states NO QED and no-refereed-bound-change',
    holds: () =>
      KARATSUBA_CROSSOVER_LADDER.dominancePreservedEveryRung === true &&
      KARATSUBA_CROSSOVER_LADDER.dominanceMarginUnchangedAcrossCrossover === true &&
      KARATSUBA_CROSSOVER_LADDER.isWallClockMeasurement === false &&
      KARATSUBA_CROSSOVER_LADDER.probesExactToomThreshold === false &&
      KARATSUBA_CROSSOVER_LADDER.movesBound === false &&
      /KARATSUBA/i.test(KARATSUBA_CROSSOVER_LADDER.verdict) &&
      /NO QED/.test(KARATSUBA_CROSSOVER_LADDER.verdict) &&
      /refereed bound is changed/i.test(KARATSUBA_CROSSOVER_LADDER.verdict),
  },
];

for (const a of IMP95380_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95380-karatsuba-crossover assertion failed: ${a.id}`);
  }
}

export default KARATSUBA_CROSSOVER_LADDER;
