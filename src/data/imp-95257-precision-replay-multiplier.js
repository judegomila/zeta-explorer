/**
 * imp-95257 — DERIVATION of the concrete G5 precision-replay multiplier
 * (160-bit and 192-bit vs the 128-bit baseline) for the imp-95238 tier-2
 * full-window window-1 certificate price.
 *
 * WHY THIS TICKET EXISTS. imp-95238 finding (C) budgets the tier-2 chirp
 * certificate at (tier-2 CPU-days) x (G5 precision-replay factor) and states
 * the price "scales LINEARLY in verified-precision replays (160/192-bit G5
 * replays multiply the price)" -- but the actual replay factor is ASSERTED,
 * never measured or derived. The frontier scout asks for a concrete factor for
 * the dominant cost terms (cell evaluation + reconstruction). This module
 * DERIVES that factor from the FLINT/Arb limb-quantized cost model. It runs no
 * native binary and launches no full run (a wall-clock measurement would need a
 * native FLINT/Arb re-run at each precision, which this lane does not launch).
 *
 * THE DERIVATION (limb-quantized Arb midpoint-multiply model).
 *
 *  COST MODEL. The dominant tier-2 terms are cell evaluation (0.0194 CPU-s/x)
 *  and reconstruction (0.0161 CPU-s/x) -- together 68% of the 0.0525 total,
 *  the super-pass being the other 32%. All three are Arb ball-arithmetic bound:
 *  arb_poly_mullow carrier convolutions, exact ball Taylor shifts, the (-i)^j
 *  and i^k rotations, and per-cell degree-80 Taylor evaluation. Each such op is
 *  dominated by the midpoint mantissa multiply arf_mul. In FLINT the midpoint
 *  arf_t holds a mantissa of ceil(prec / FLINT_BITS) limbs (FLINT_BITS = 64 on
 *  64-bit hardware); the radius is a mag_t at a fixed MAG_BITS = 30 single
 *  word, so radius/error propagation is precision-INDEPENDENT. At these small
 *  limb counts FLINT multiplies mantissas SCHOOLBOOK (mpn_mul): the Karatsuba
 *  threshold is ~10+ limbs and FFT is thousands of bits away, so the mantissa
 *  multiply costs proportional to (limbs)^2.
 *
 *  LIMB COUNTS. n(p) = ceil(p / 64):
 *    n(128) = 2 limbs   (baseline)
 *    n(160) = 3 limbs   (160 / 64 = 2.5, rounds UP to 3)
 *    n(192) = 3 limbs   (192 / 64 = 3)
 *
 *  MULTIPLIER. Multiply-dominated (schoolbook, cost proportional to n^2):
 *    factor(160) = n(160)^2 / n(128)^2 = 9 / 4 = 2.25
 *    factor(192) = n(192)^2 / n(128)^2 = 9 / 4 = 2.25
 *  If instead the dominant work were purely LINEAR in limbs (O(n) adds /
 *  rounding rather than the O(n^2) multiply), the factor would be n(p)/n(128) =
 *  3 / 2 = 1.5 for both. The true tier-2 mix is multiply-heavy (mullow /
 *  Taylor convolution), so the factor sits in the bracket [1.5, 2.25] with the
 *  schoolbook 2.25 as the conservative (upper) budget for both 160 and 192.
 *
 * TWO CORRECTIONS TO THE imp-95238 "linear-in-precision" NOTE.
 *  (1) It is NOT linear in bit-count. A per-bit reading of "linear scaling"
 *      would give 160/128 = 1.25x and 192/128 = 1.50x; the limb-quantized
 *      multiply-dominated cost is HIGHER (2.25x) because limbs jump at 64-bit
 *      boundaries and the dominant op is quadratic in limbs.
 *  (2) 160-bit and 192-bit cost the SAME. Both occupy 3 mantissa limbs, so the
 *      schoolbook mantissa multiply is identical; the "160/192 multiply the
 *      price" phrasing that implies two distinct factors is dissolved at limb
 *      granularity -- there is ONE replay factor (~2.25x) for the whole 129-192
 *      bit band, jumping again only at 193 bits (4 limbs, 4x).
 *
 * DOMINANCE IS PRESERVED (confirms + refines imp-95238 (C)). The factor is
 * common to BOTH the level-1 and the tier-2 routes (both are Arb-multiply-bound
 * at the same working precision), so the 17.9x level-1/tier-2 ratio is unchanged
 * -- the correction is only that the shared multiplier is limb-quantized 2.25x,
 * not per-bit-linear. The concrete honest budget for the tier-2 full-window
 * window-1 certificate is therefore 21.1 x 2.25 ~ 47.5 CPU-days at 160 OR 192
 * bits (bracket 31.7-47.5), replacing the "linear scaling" note with a number.
 *
 * Grade: DERIVATION from the FLINT/Arb limb-quantized cost model over the frozen
 * imp-95214/95238 ledgers; NOT a wall-clock measurement (no native run). Changes
 * no bound; launches nothing; NO QED; no refereed bound is changed.
 */

import { TIER2_PRICE } from './imp-95214-tier2-chirp-level.js';
import { FULLWINDOW_RUN_DECISION } from './imp-95238-fullwindow-run-decision.js';

// ── the FLINT/Arb limb-quantized cost model ──────────────────────────────────
export const FLINT_BITS = 64; // limb size on 64-bit hardware
const mantissaLimbs = (prec) => Math.ceil(prec / FLINT_BITS);

// schoolbook mantissa-multiply factor vs the 128-bit baseline (cost ~ limbs^2)
const schoolbookFactor = (prec) =>
  mantissaLimbs(prec) ** 2 / mantissaLimbs(128) ** 2;
// linear-in-limbs lower bracket (cost ~ limbs)
const linearFactor = (prec) => mantissaLimbs(prec) / mantissaLimbs(128);

// ── the derived multiplier ledger ────────────────────────────────────────────
export const PRECISION_REPLAY_MULTIPLIER = Object.freeze({
  ticket: 'imp-95257-precision-replay-multiplier',
  parent: 'imp-95238-fullwindow-run-decision (finding (C): factor asserted linear, never measured)',
  baselineBits: 128,
  baselineLimbs: mantissaLimbs(128), // 2
  // the dominant cost terms this factor is derived for (imp-95214 measured mix)
  dominantTerms: Object.freeze({
    cellSecondsPerXUnit: TIER2_PRICE.measured.cellSecondsPerXUnit,   // 0.0194
    reconSecondsPerXUnit: TIER2_PRICE.measured.reconSecondsPerXUnit, // 0.0161
    superSecondsPerXUnit: TIER2_PRICE.measured.superSecondsPerXUnit, // 0.0170
    totalSecondsPerXUnit: TIER2_PRICE.measured.cpuSecondsPerXUnit,   // 0.0525
    cellPlusReconShare:
      (TIER2_PRICE.measured.cellSecondsPerXUnit + TIER2_PRICE.measured.reconSecondsPerXUnit) /
      TIER2_PRICE.measured.cpuSecondsPerXUnit, // ~0.676
  }),
  // per-precision replay factors (limb-quantized; schoolbook = conservative)
  perPrecision: Object.freeze([
    Object.freeze({ bits: 160, limbs: mantissaLimbs(160), factorSchoolbook: schoolbookFactor(160), factorLinearBracket: linearFactor(160) }),
    Object.freeze({ bits: 192, limbs: mantissaLimbs(192), factorSchoolbook: schoolbookFactor(192), factorLinearBracket: linearFactor(192) }),
  ]),
  // the concrete headline: ONE factor for the whole 129-192 bit band (3 limbs)
  replayFactor129to192: schoolbookFactor(160), // 2.25
  replayFactorLowerBracket: linearFactor(160),  // 1.5
  // the honest budget in CPU-days (tier-2 full window x the factor)
  tier2FullWindowCpuDays128: TIER2_PRICE.fullWindow.cpuDays, // 21.1
  tier2FullWindowCpuDays160or192Upper: TIER2_PRICE.fullWindow.cpuDays * schoolbookFactor(160), // ~47.5
  tier2FullWindowCpuDays160or192Lower: TIER2_PRICE.fullWindow.cpuDays * linearFactor(160),    // ~31.7
  // corrections to the imp-95238 note
  perBitLinearReadingWouldGive160: 160 / 128, // 1.25 -- what the note naively implies
  perBitLinearReadingWouldGive192: 192 / 128, // 1.50 -- both UNDERSTATE the true cost
  bit160and192CostEqual: mantissaLimbs(160) === mantissaLimbs(192), // true (both 3 limbs)
  dominancePreserved: FULLWINDOW_RUN_DECISION.precisionReplayMultipliesBothRoutesEqually, // true
  isWallClockMeasurement: false, // this is a limb-model derivation, not a native run
  movesBound: false,
  verdict:
    'DERIVED replay factor ~2.25x (limb-quantized schoolbook Arb mantissa multiply, cost ~ ' +
    'ceil(prec/64)^2) for BOTH 160-bit and 192-bit vs the 128-bit baseline -- ONE factor for the ' +
    'whole 129-192 bit band because all three occupy 2 (at 128) or 3 (at 160 and 192) mantissa ' +
    'limbs. The dominant cell + reconstruction terms (68% of the 0.0525 CPU-s/x total) are ' +
    'arb_poly_mullow / ball-Taylor-shift multiply-bound, so they scale as limbs^2, not per-bit ' +
    'linearly; bracket [1.5, 2.25] with 2.25 the conservative budget. This CORRECTS the imp-95238 ' +
    'note two ways: (1) a per-bit-linear reading (1.25x/1.50x) UNDERSTATES the cost, and (2) 160 ' +
    'and 192 bits cost the SAME (both 3 limbs), not two distinct factors. Concrete honest budget: ' +
    'tier-2 full window 21.1 CPU-days x 2.25 ~ 47.5 CPU-days at 160 OR 192 bits (bracket 31.7-47.5). ' +
    'The factor is common to both routes so the 17.9x tier-2 dominance is preserved (precision-' +
    'invariant, refined from linear to limb-quantized). Derivation from the FLINT limb model, not a ' +
    'wall-clock run; launches nothing; changes no bound; NO QED; no refereed bound is changed.',
});

// ── self-executing assertions (import-light; recomputable arithmetic only) ────
export const IMP95257_ASSERTIONS = [
  {
    id: 'imp95257-limb-counts-quantize-at-64bit-boundaries',
    description:
      'mantissa limbs = ceil(prec/64): 128 bits = 2 limbs, 160 bits rounds UP to 3 limbs, 192 bits = 3 limbs; so 160 and 192 occupy the SAME limb count while 128 is one fewer',
    holds: () =>
      mantissaLimbs(128) === 2 &&
      mantissaLimbs(160) === 3 &&
      mantissaLimbs(192) === 3 &&
      PRECISION_REPLAY_MULTIPLIER.baselineLimbs === 2 &&
      PRECISION_REPLAY_MULTIPLIER.bit160and192CostEqual === true,
  },
  {
    id: 'imp95257-schoolbook-multiplier-is-2p25-for-both',
    description:
      'the schoolbook (cost ~ limbs^2) replay factor is 9/4 = 2.25 for BOTH 160 and 192 bits vs the 128-bit 2-limb baseline, and the linear-in-limbs lower bracket is 3/2 = 1.5, giving the bracket [1.5, 2.25]',
    holds: () =>
      PRECISION_REPLAY_MULTIPLIER.perPrecision.every(
        (p) => Math.abs(p.factorSchoolbook - 2.25) < 1e-12 && Math.abs(p.factorLinearBracket - 1.5) < 1e-12
      ) &&
      Math.abs(PRECISION_REPLAY_MULTIPLIER.replayFactor129to192 - 2.25) < 1e-12 &&
      Math.abs(PRECISION_REPLAY_MULTIPLIER.replayFactorLowerBracket - 1.5) < 1e-12 &&
      PRECISION_REPLAY_MULTIPLIER.replayFactorLowerBracket < PRECISION_REPLAY_MULTIPLIER.replayFactor129to192,
  },
  {
    id: 'imp95257-dominant-terms-are-cell-plus-recon-majority',
    description:
      'the cost terms the factor is derived for -- cell evaluation + reconstruction -- are the dominant share (> 60%) of the tier-2 total, read off the imp-95214 measured mix (0.0194 + 0.0161 of 0.0525), and the component rates sum to the total',
    holds: () =>
      PRECISION_REPLAY_MULTIPLIER.dominantTerms.cellPlusReconShare > 0.6 &&
      Math.abs(
        PRECISION_REPLAY_MULTIPLIER.dominantTerms.cellSecondsPerXUnit +
          PRECISION_REPLAY_MULTIPLIER.dominantTerms.reconSecondsPerXUnit +
          PRECISION_REPLAY_MULTIPLIER.dominantTerms.superSecondsPerXUnit -
          PRECISION_REPLAY_MULTIPLIER.dominantTerms.totalSecondsPerXUnit
      ) < 1e-3,
  },
  {
    id: 'imp95257-concrete-budget-recomputes',
    description:
      'the honest CPU-day budget recomputes: tier-2 full window (21.1) times the 2.25 factor is ~47.5 CPU-days at 160 OR 192 bits (upper), with the linear bracket 21.1 x 1.5 ~ 31.7 (lower); both exceed the 128-bit baseline',
    holds: () => {
      const base = TIER2_PRICE.fullWindow.cpuDays;
      return (
        Math.abs(PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays128 - base) < 1e-9 &&
        Math.abs(PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays160or192Upper - base * 2.25) < 1e-6 &&
        Math.abs(PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays160or192Lower - base * 1.5) < 1e-6 &&
        PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays160or192Upper > base &&
        PRECISION_REPLAY_MULTIPLIER.tier2FullWindowCpuDays160or192Lower > base
      );
    },
  },
  {
    id: 'imp95257-corrects-perbit-linear-note-two-ways',
    description:
      'the derivation corrects the imp-95238 note: (1) a per-bit-linear reading gives 1.25x/1.50x which UNDERSTATES the limb-quantized 2.25x, and (2) 160-bit and 192-bit cost the SAME (equal limb counts), so there is one factor for the band, not two',
    holds: () =>
      PRECISION_REPLAY_MULTIPLIER.perBitLinearReadingWouldGive160 < PRECISION_REPLAY_MULTIPLIER.replayFactor129to192 &&
      PRECISION_REPLAY_MULTIPLIER.perBitLinearReadingWouldGive192 < PRECISION_REPLAY_MULTIPLIER.replayFactor129to192 &&
      PRECISION_REPLAY_MULTIPLIER.perPrecision[0].factorSchoolbook ===
        PRECISION_REPLAY_MULTIPLIER.perPrecision[1].factorSchoolbook,
  },
  {
    id: 'imp95257-dominance-preserved-and-honesty-gate',
    description:
      'fail-closed honesty: the factor is common to both routes so the tier-2 dominance is preserved (imp-95238 precisionReplayMultipliesBothRoutesEqually true), this is a limb-model derivation not a wall-clock measurement, it moves no bound, and the verdict states NO QED and no-refereed-bound-change',
    holds: () =>
      PRECISION_REPLAY_MULTIPLIER.dominancePreserved === true &&
      PRECISION_REPLAY_MULTIPLIER.isWallClockMeasurement === false &&
      PRECISION_REPLAY_MULTIPLIER.movesBound === false &&
      /DERIVED/.test(PRECISION_REPLAY_MULTIPLIER.verdict) &&
      /NO QED/.test(PRECISION_REPLAY_MULTIPLIER.verdict) &&
      /refereed bound is changed/i.test(PRECISION_REPLAY_MULTIPLIER.verdict),
  },
];

for (const a of IMP95257_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95257-precision-replay-multiplier assertion failed: ${a.id}`);
  }
}

export default PRECISION_REPLAY_MULTIPLIER;
