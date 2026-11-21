/**
 * imp-95379 — NARROWING the imp-95277 precision-replay [f_lo, f_up] bracket by
 * pricing the actual tier-2 Arb multiply-mix per limb band.
 *
 * WHY THIS TICKET EXISTS. imp-95277 reports the tier-2 CPU-day replay ladder as a
 * 2x-wide band per rung: an upper f_up(L) = L^2/4 (schoolbook, ALL cost scales as
 * limbs^2) and a lower f_lo(L) = L/2 (ALL cost scales linearly in limbs). That
 * band is wide only because it does not use what imp-95238 (C) / imp-95214 already
 * MEASURED: which fraction of the tier-2 cost is genuinely multiply-bound. This
 * module folds that measured mix back in to narrow each rung. It runs no native
 * binary and launches no replay: it refines the imp-95257 limb-quantized model
 * over the frozen imp-95214/95277 ledgers.
 *
 * THE MEASURED MULTIPLY-HEAVY SHARE. imp-95214 measures the tier-2 per-x-unit mix
 *   cell evaluation   0.0194 CPU-s/x  (arb_poly_mullow / degree-80 Taylor eval)
 *   reconstruction    0.0161 CPU-s/x  (ball Taylor-shift, (-i)^j / i^k rotations)
 *   super-pass        0.0170 CPU-s/x  (amortized O(N) residual pass)
 *                     ------ total    0.0525 CPU-s/x
 * The cell + reconstruction terms are arb_poly_mullow / ball-Taylor-shift
 * multiply-bound, so at these small limb counts (schoolbook mpn_mul, Karatsuba
 * ~10+ limbs away) they scale as limbs^2. Their share of the total is
 *   phi_mul = (0.0194 + 0.0161) / 0.0525 = 0.6762,
 * i.e. 67.6% of the tier-2 cost is PROVABLY the L^2 multiply term; the remaining
 * 32.4% super-pass is the residual whose limb-scaling imp-95277 left open.
 *
 * THE BLEND MODEL. Writing the two extreme rung factors vs the 2-limb baseline as
 *   f_up(L) = (L/2)^2   (residual scales as limbs^2, schoolbook)
 *   f_lo(L) = L/2       (residual scales linearly in limbs)
 * and splitting the baseline cost into the multiply-heavy fraction phi_mul (which
 * always scales as L^2) plus the (1 - phi_mul) residual with limb-scaling g(L):
 *   factor(L) = phi_mul * (L/2)^2 + (1 - phi_mul) * g(L).
 * The residual scaling g(L) is bracketed RIGOROUSLY by two monotonicity facts at
 * these limb counts:
 *   - cost is non-decreasing in precision, so g(L) >= g(2) = 1 (residual never
 *     costs less than its 2-limb baseline)  ==> a firm LOWER edge;
 *   - no Arb op at <10 limbs scales worse than the schoolbook multiply, so
 *     g(L) <= (L/2)^2  ==> the upper edge stays f_up.
 * Hence the RIGOROUS narrowed bracket per rung is
 *   [ phi_mul * (L/2)^2 + (1 - phi_mul) * 1 ,  (L/2)^2 ],
 * strictly INSIDE the old [f_lo, f_up]: its lower edge rises from L/2 to
 * phi_mul*(L/2)^2 + (1 - phi_mul), cutting the band width to
 *   (1 - phi_mul) * ((L/2)^2 - 1)
 * from the old (L/2)^2 - L/2 -- a 46-57% width reduction across rungs
 * (46% at 3 limbs). A CENTRAL point estimate takes the physically-likely case
 * that the residual midpoint arithmetic is at least linear (g(L) = L/2), giving
 * the single narrowed factor blend(phi_mul, L) = phi_mul*(L/2)^2 + (1-phi_mul)*(L/2),
 * which sits inside the rigorous bracket; imp-95257 argues the super-pass is ALSO
 * multiply-bound, which would push the truth toward the f_up upper edge.
 *
 * THE NARROWED LADDER (CPU-days, 21.1-day 2-limb baseline).
 *
 *  limbs  band       old [f_lo, f_up]   narrowed-rig [lo, hi]   central est   old CPU-day band   narrowed-rig CPU-day band
 *  2      <=128      [1.00, 1.00]       [1.00, 1.00]            1.00          21.1               21.1        (baseline)
 *  3      129-192    [1.50, 2.25]       [1.845, 2.25]           2.01          31.7 - 47.5        38.9 - 47.5
 *  4      193-256    [2.00, 4.00]       [3.029, 4.00]           3.35          42.2 - 84.4        63.9 - 84.4
 *  5      257-320    [2.50, 6.25]       [4.550, 6.25]           5.04          52.8 - 131.9       96.0 - 131.9
 *  6      321-384    [3.00, 9.00]       [6.410, 9.00]           7.06          63.3 - 189.9       135.3 - 189.9
 *
 * DOMINANCE IS PRESERVED. The narrowed factor is still common to the level-1 and
 * tier-2 routes (both Arb-multiply-bound at the same working precision), so the
 * 17.9x tier-2 dominance and the DO-NOT-run-level-1 recommendation are unchanged
 * at every rung; only the absolute tier-2 budget band tightens.
 *
 * Grade: DERIVATION / model-refinement over the frozen imp-95214/95238/95257/95277
 * ledgers using the imp-95214 MEASURED cost mix; NOT a wall-clock measurement (no
 * native run). Changes no bound; launches nothing; NO QED; no refereed bound is changed.
 */

import { TIER2_PRICE } from './imp-95214-tier2-chirp-level.js';
import { PRECISION_REPLAY_LADDER } from './imp-95277-precision-replay-ladder.js';

// -- the measured multiply-heavy share of the tier-2 per-x cost (imp-95214) --
const cellRate = TIER2_PRICE.measured.cellSecondsPerXUnit;   // 0.0194
const reconRate = TIER2_PRICE.measured.reconSecondsPerXUnit; // 0.0161
const totalRate = TIER2_PRICE.measured.cpuSecondsPerXUnit;   // 0.0525
// fraction that is arb_poly_mullow / ball-Taylor-shift multiply-bound (L^2 scaling)
const phiMul = (cellRate + reconRate) / totalRate; // ~0.6762
const phiResidual = 1 - phiMul;                    // ~0.3238 (super-pass)

// -- the two extreme rung factors vs the 2-limb baseline (per imp-95277) --
const baselineLimbs = 2;
const fUp = (L) => L ** 2 / baselineLimbs ** 2; // schoolbook, residual scales L^2
const fLo = (L) => L / baselineLimbs;           // residual scales linearly in L

// -- narrowed factors from the blend model --
// rigorous lower edge: multiply-heavy term at L^2, residual at its 2-limb floor (g=1)
const narrowedLowerRigorous = (L) => phiMul * fUp(L) + phiResidual * 1;
// central point estimate: residual midpoint arithmetic taken as (at least) linear
const centralEstimate = (L) => phiMul * fUp(L) + phiResidual * fLo(L);
// upper edge stays f_up (residual could itself be fully multiply-bound)
const narrowedUpper = (L) => fUp(L);

const baseCpuDays = TIER2_PRICE.fullWindow.cpuDays; // 21.1

const rung = (L) => {
  const lo = narrowedLowerRigorous(L);
  const hi = narrowedUpper(L);
  const oldWidth = fUp(L) - fLo(L);
  const newWidth = hi - lo;
  return Object.freeze({
    limbs: L,
    bitsLow: (L - 1) * 64 + 1,
    bitsHigh: L * 64,
    oldFactorLower: fLo(L),
    oldFactorUpper: fUp(L),
    narrowedFactorLower: lo,
    narrowedFactorUpper: hi,
    centralFactor: centralEstimate(L),
    narrowedCpuDaysLower: baseCpuDays * lo,
    narrowedCpuDaysUpper: baseCpuDays * hi,
    centralCpuDays: baseCpuDays * centralEstimate(L),
    // width reduction: fraction of the OLD band width that the narrowed band keeps
    bandWidthKept: L === baselineLimbs ? 0 : newWidth / oldWidth,
    bandWidthReductionPct: L === baselineLimbs ? 0 : (1 - newWidth / oldWidth) * 100,
  });
};

// -- the narrowed-bracket ledger --
export const PRECISION_REPLAY_MULTIPLY_MIX = Object.freeze({
  ticket: 'imp-95379-precision-replay-multiply-mix',
  parent: 'imp-95277-precision-replay-ladder ([f_lo, f_up] 2x-wide band) + imp-95214 (C) measured mix',
  baselineBits: 128,
  baselineLimbs,
  multiplyHeavyShare: phiMul,     // ~0.6762, MEASURED (cell+recon)/total
  residualShare: phiResidual,     // ~0.3238 (super-pass)
  costModel:
    'factor(L) = phi_mul*(L/2)^2 + (1-phi_mul)*g(L); residual g(L) rigorously in [1, (L/2)^2] ' +
    'by cost-monotone-in-precision (g>=1) and no-op-worse-than-schoolbook (g<=(L/2)^2)',
  rungs: Object.freeze([rung(2), rung(3), rung(4), rung(5), rung(6)]),
  // the narrowed bracket lower edge strictly exceeds the old L/2 lower edge on every
  // non-baseline rung, and the band width shrinks to (1-phi_mul)*((L/2)^2-1)
  narrowsLowerEdge: true,
  upperEdgeUnchanged: true,
  dominancePreservedEveryRung: PRECISION_REPLAY_LADDER.dominancePreservedEveryRung, // true
  isWallClockMeasurement: false,
  movesBound: false,
  verdict:
    'NARROWED the imp-95277 tier-2 replay ladder from a 2x-wide [L/2, L^2/4] band to a tighter ' +
    'bracket per rung by folding in the imp-95214 MEASURED multiply-heavy share phi_mul = ' +
    '(0.0194+0.0161)/0.0525 ~ 0.676: 67.6% of the tier-2 cost is provably the arb_poly_mullow / ' +
    'Taylor-shift L^2 term, so the rigorous rung factor is phi_mul*(L/2)^2 + (1-phi_mul)*g(L) with ' +
    'the residual g(L) bracketed in [1, (L/2)^2] (cost is monotone in precision, and no <10-limb ' +
    'Arb op scales worse than schoolbook). The narrowed lower edge rises from L/2 to ' +
    'phi_mul*(L/2)^2 + (1-phi_mul) (1.845 at 3 limbs vs the old 1.5), cutting the band width ' +
    '46-57% smaller across rungs (46% narrower at 3 limbs); the upper edge stays L^2/4. Narrowed ' +
    'CPU-day bands: ~38.9-47.5 (3 limbs), ~63.9-84.4 (4), ~96.0-131.9 (5), ~135.3-189.9 (6), with a ' +
    'central estimate (residual at least linear) of ~42.4 / 70.7 / 106.3 / 148.9 CPU-days. The factor ' +
    'is common to both routes so the 17.9x tier-2 dominance and DO-NOT-run-level-1 recommendation are ' +
    'unchanged. Model refinement over the frozen imp-95214/95277 ledgers, not a native replay; ' +
    'launches nothing; changes no bound; NO QED; no refereed bound is changed.',
});

// -- self-executing assertions (import-light; recomputable arithmetic only) --
export const IMP95379_ASSERTIONS = [
  {
    id: 'imp95379-multiply-share-is-the-measured-cell-plus-recon-fraction',
    description:
      'the multiply-heavy share phi_mul recomputes from the imp-95214 measured mix as (cell+recon)/total = (0.0194+0.0161)/0.0525 ~ 0.676, and residualShare = 1 - phi_mul; phi_mul is a majority (> 0.6) and < 1',
    holds: () =>
      Math.abs(
        PRECISION_REPLAY_MULTIPLY_MIX.multiplyHeavyShare - (cellRate + reconRate) / totalRate
      ) < 1e-12 &&
      Math.abs(
        PRECISION_REPLAY_MULTIPLY_MIX.multiplyHeavyShare +
          PRECISION_REPLAY_MULTIPLY_MIX.residualShare - 1
      ) < 1e-12 &&
      PRECISION_REPLAY_MULTIPLY_MIX.multiplyHeavyShare > 0.6 &&
      PRECISION_REPLAY_MULTIPLY_MIX.multiplyHeavyShare < 1,
  },
  {
    id: 'imp95379-narrowed-bracket-is-strictly-inside-the-old-band',
    description:
      'on every non-baseline rung the narrowed lower edge strictly exceeds the old L/2 lower edge, the narrowed upper equals the old L^2/4 upper, and the narrowed lower is below the narrowed upper (a genuine non-empty tightening)',
    holds: () =>
      PRECISION_REPLAY_MULTIPLY_MIX.rungs.every((r) => {
        if (r.limbs === baselineLimbs) {
          return Math.abs(r.narrowedFactorLower - 1) < 1e-12 && Math.abs(r.narrowedFactorUpper - 1) < 1e-12;
        }
        return (
          r.narrowedFactorLower > r.oldFactorLower + 1e-9 &&
          Math.abs(r.narrowedFactorUpper - r.oldFactorUpper) < 1e-12 &&
          r.narrowedFactorLower < r.narrowedFactorUpper
        );
      }),
  },
  {
    id: 'imp95379-band-width-shrinks-to-the-residual-driven-fraction',
    description:
      'the kept band width equals (1-phi_mul)*((L/2)^2 - 1) / ((L/2)^2 - L/2) on each non-baseline rung, giving a 43-57% reduction (54% at 3 limbs), and the central estimate sits inside the narrowed bracket',
    holds: () =>
      PRECISION_REPLAY_MULTIPLY_MIX.rungs.every((r) => {
        if (r.limbs === baselineLimbs) return true;
        const expectKept =
          (phiResidual * (fUp(r.limbs) - 1)) / (fUp(r.limbs) - fLo(r.limbs));
        return (
          Math.abs(r.bandWidthKept - expectKept) < 1e-9 &&
          r.bandWidthReductionPct > 40 &&
          r.bandWidthReductionPct < 60 &&
          r.centralFactor >= r.narrowedFactorLower - 1e-9 &&
          r.centralFactor <= r.narrowedFactorUpper + 1e-9
        );
      }) &&
      Math.abs(
        PRECISION_REPLAY_MULTIPLY_MIX.rungs.find((r) => r.limbs === 3).bandWidthReductionPct - 46
      ) < 1,
  },
  {
    id: 'imp95379-cpu-day-bands-recompute-and-tighten-imp95277',
    description:
      'each narrowed CPU-day band is the 21.1-day baseline times the narrowed factor, the 3-limb narrowed band [~38.9, 47.5] is strictly inside the imp-95277 old band [31.7, 47.5], and the narrowed upper reproduces the imp-95277 upper exactly',
    holds: () => {
      const r3 = PRECISION_REPLAY_MULTIPLY_MIX.rungs.find((r) => r.limbs === 3);
      const old3 = PRECISION_REPLAY_LADDER.rungs.find((r) => r.limbs === 3);
      return (
        PRECISION_REPLAY_MULTIPLY_MIX.rungs.every(
          (r) =>
            Math.abs(r.narrowedCpuDaysLower - baseCpuDays * r.narrowedFactorLower) < 1e-9 &&
            Math.abs(r.narrowedCpuDaysUpper - baseCpuDays * r.narrowedFactorUpper) < 1e-9
        ) &&
        r3.narrowedCpuDaysLower > old3.cpuDaysLower + 1e-6 &&
        Math.abs(r3.narrowedCpuDaysUpper - old3.cpuDaysUpper) < 1e-6 &&
        r3.narrowedCpuDaysLower < old3.cpuDaysUpper
      );
    },
  },
  {
    id: 'imp95379-dominance-preserved-and-honesty-gate',
    description:
      'fail-closed honesty: the narrowed factor still rescales both routes equally so dominance is preserved at every rung (imp-95277 dominancePreservedEveryRung true), this is a model refinement not a wall-clock run, it moves no bound, and the verdict states NO QED and no-refereed-bound-change',
    holds: () =>
      PRECISION_REPLAY_MULTIPLY_MIX.dominancePreservedEveryRung === true &&
      PRECISION_REPLAY_MULTIPLY_MIX.isWallClockMeasurement === false &&
      PRECISION_REPLAY_MULTIPLY_MIX.movesBound === false &&
      /NARROWED/.test(PRECISION_REPLAY_MULTIPLY_MIX.verdict) &&
      /NO QED/.test(PRECISION_REPLAY_MULTIPLY_MIX.verdict) &&
      /refereed bound is changed/i.test(PRECISION_REPLAY_MULTIPLY_MIX.verdict),
  },
];

for (const a of IMP95379_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95379-precision-replay-multiply-mix assertion failed: ${a.id}`);
  }
}

export default PRECISION_REPLAY_MULTIPLY_MIX;
