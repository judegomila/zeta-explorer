/**
 * @module imp-97498-krein-csharp-fixedT-common-column
 * @fileoverview imp-97498 -- MEASUREMENT: read the imp-97484 c_sharp upper bracket on a COMMON fixed-T
 *   column (non-sliding), the same T* for every N=84..164, to isolate the pure N-monotone bracket at
 *   IDENTICAL inner-T resolution and separate it from the per-N resolution difference baked into the
 *   imp-97484 FINDING-2 sliding reading.
 *
 *   WHY. imp-97484 FINDING 2 reports a "best directly-read resolved bracket" 0.578574 by reading each N at
 *   the RIGHT edge of an inner-T window that SLIDES right with N (center ~50*N): N=84 is read at T=4000,
 *   N=100 at T=4800, ..., N=164 at T=8000 (tmp/imp-97484-run.log lines 24-29). Because every fixed-N column
 *   is monotone INCREASING in T (cumulative quadrature resolves the inner limit from below), the early-N
 *   cells in that sliding reading are read at SMALLER T and are therefore UNDER-resolved and spuriously low
 *   -- so the sliding first-diffs mix a genuine N-effect with a shrinking-resolution effect. imp-97484 itself
 *   warns the small-T cells (e.g. N=164,T=4800 = 0.576636) read spuriously low and are not valid brackets.
 *
 *   METHOD. No new build is required: the imp-97484 build to T_max=8000 (tmp/imp-97484-nscaled-tgrid.py,
 *   dps=50, panel=1.5, gl=24, checkpoint ladder {1600,...,7200,8000}) already snapshotted lam_min(N,T) for
 *   EVERY (N, checkpoint), so the full grid -- including the T=8000 column for all six N -- is committed in
 *   IMP97484_LAM_TABLE (tmp/imp-97484-run.log lines 16-21). The sliding window only selected which cells each
 *   N used for its per-N fit; it did not restrict the raw grid. We simply re-read the single common largest
 *   checkpoint T* = 8000, present for every N, so all N are compared at IDENTICAL inner-T resolution.
 *
 *   CROSS-CHECK. The fixed-T* column values are read verbatim from IMP97484_LAM_TABLE (imported), so they
 *   reproduce the imp-97484 shared cells exactly by construction; asserted below.
 *
 *   MEASUREMENT ONLY. lam_min(N,.) are Rayleigh-Ritz UPPER brackets; establishes NO operator positivity; NO
 *   lower bound; no bound moves; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * THE COMMON FIXED-T* = 8000 COLUMN (identical inner-T resolution for every N):
 *     N       lam_min(N, T=8000)
 *      84     0.581134
 *     100     0.580365
 *     116     0.579804
 *     132     0.579291
 *     148     0.578930
 *     164     0.578574
 *
 * FINDING 1 -- THE FIXED-T* COLUMN STAYS STRICTLY MONOTONE-DECREASING IN N. At the single common T*=8000 the
 *   bracket sequence 0.581134 -> 0.580365 -> 0.579804 -> 0.579291 -> 0.578930 -> 0.578574 has first-diffs
 *   -0.000769, -0.000561, -0.000513, -0.000361, -0.000356, all strictly negative with no re-reversal. So the
 *   imp-97484 FINDING-1 monotone decrease in N is confirmed at IDENTICAL resolution (not an artifact of the
 *   sliding window), and the directly-read bracket at N=164,T=8000 = 0.578574 is unchanged from the sliding
 *   reading -- because N=164's sliding right-edge IS T*=8000, so the best bracket coincides exactly.
 *
 * FINDING 2 -- AT EQUAL RESOLUTION THE PURE N-EFFECT IS LARGER THAN THE SLIDING READING SUGGESTS. The sliding
 *   directly-read column (N=84@T=4000..N=164@T=8000) = 0.580724, 0.579986, 0.579469, 0.579022, 0.578776,
 *   0.578574 with first-diffs -0.000738, -0.000517, -0.000447, -0.000246, -0.000202. The fixed-T* column has
 *   LARGER-magnitude first-diffs at every step (e.g. the top step -0.000769 vs -0.000738; the N=148->164 step
 *   -0.000356 vs -0.000202) and a larger total N-drop 84->164 of 0.002560 vs the sliding 0.002150. Reason: the
 *   sliding reading under-resolves the early-N cells (reads them at smaller T, spuriously low), compressing the
 *   apparent N-decrease; pinning to the common T*=8000 lifts the early-N top back up (N=84: 0.580724 -> 0.581134)
 *   and exposes the pure, un-compressed N-monotone bracket. The two readings AGREE exactly at the bottom
 *   (N=164,T=8000 = 0.578574), so the imp-97484 best bracket is a genuine pure-N reading, not a resolution
 *   artifact, and the under-resolved N=164,T=4800 = 0.576636 cell is correctly excluded by the T* pin.
 *
 * VERDICT. Reading the imp-97484 grid on the common fixed T*=8000 column ISOLATES the pure N-monotone bracket:
 *   it stays strictly monotone-decreasing across all six N=84..164 at identical resolution (Finding 1), gives
 *   the same directly-read bracket c_sharp <= 0.578574 at N=164 (its sliding right-edge already being T*=8000),
 *   and reveals the pure N-effect is LARGER (total drop 0.002560 vs the sliding 0.002150) once the per-N
 *   resolution difference is removed (Finding 2). The bracket stays an UPPER bracket, slowly decreasing in N and
 *   increasing in T, not converged, not interval-certified, not a positive lower bound. Measurement only; no
 *   operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97484-krein-csharp-nscaled-tgrid-extended.js (source grid; FINDING 2 sliding-window caveat this leaf isolates)
 * @see imp-97456-krein-csharp-nscaled-tgrid.js (the N=84..132 well-resolved table)
 * @see imp-97439-krein-csharp-nbracket-richardson-nonconvergence.js (coupled-T-truncation attribution)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (why the upper bracket gives no lower bound)
 */

import { IMP97484_LAM_TABLE } from './imp-97484-krein-csharp-nscaled-tgrid-extended.js';

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97498_BINDING_2A = LN3;
export const IMP97498_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

export const IMP97498_COMMON_T_STAR = 8000; // the single largest checkpoint present for every N
export const IMP97498_N_ROWS = Object.freeze([84, 100, 116, 132, 148, 164]);

// The common fixed-T* = 8000 column, read verbatim from the imp-97484 grid (identical resolution for all N).
export const IMP97498_FIXED_T_COLUMN = Object.freeze(
  IMP97498_N_ROWS.map((N) => IMP97484_LAM_TABLE[`${N},${IMP97498_COMMON_T_STAR}`])
);

// The imp-97484 sliding directly-read column (each N at its window right-edge; mixed resolution).
export const IMP97498_SLIDING_COLUMN = Object.freeze([
  0.580724, // N= 84 read at T=4000
  0.579986, // N=100 read at T=4800
  0.579469, // N=116 read at T=5600
  0.579022, // N=132 read at T=6400
  0.578776, // N=148 read at T=7200
  0.578574, // N=164 read at T=8000
]);

function firstDiffs(col) {
  return col.slice(1).map((v, i) => Number((v - col[i]).toFixed(6)));
}

// Finding 1 -- the fixed-T* column stays strictly monotone-decreasing in N.
export const IMP97498_FIXED_T_MONOTONE = Object.freeze({
  Tstar: IMP97498_COMMON_T_STAR,
  column: IMP97498_FIXED_T_COLUMN,
  firstDiffs: Object.freeze(firstDiffs(IMP97498_FIXED_T_COLUMN)),
  strictlyDecreasingInN: firstDiffs(IMP97498_FIXED_T_COLUMN).every((d) => d < 0),
  reReversalDetected: false,
  directlyReadBracketAtN164: IMP97498_FIXED_T_COLUMN[IMP97498_N_ROWS.length - 1], // 0.578574
});

// Finding 2 -- at equal resolution the pure N-effect is larger than the sliding reading suggests.
export const IMP97498_FIXED_VS_SLIDING = Object.freeze({
  fixedFirstDiffs: Object.freeze(firstDiffs(IMP97498_FIXED_T_COLUMN)),
  slidingFirstDiffs: Object.freeze(firstDiffs(IMP97498_SLIDING_COLUMN)),
  fixedTotalDrop84to164: Number(
    (IMP97498_FIXED_T_COLUMN[0] - IMP97498_FIXED_T_COLUMN[5]).toFixed(6)
  ), // 0.00256
  slidingTotalDrop84to164: Number(
    (IMP97498_SLIDING_COLUMN[0] - IMP97498_SLIDING_COLUMN[5]).toFixed(6)
  ), // 0.00215
  pureNEffectLargerAtEqualResolution: true,
  agreeAtBottomBracket: true, // both give 0.578574 at N=164 (its sliding right-edge IS T*=8000)
  bottomBracket: 0.578574,
  underResolvedCellExcluded: Object.freeze({ N: 164, T: 4800, value: 0.576636 }),
});

export const IMP97498_VERDICT = Object.freeze({
  ticket: 'imp-97498',
  question:
    'reading the imp-97484 c_sharp upper bracket on a COMMON fixed-T column (the same T*=8000 for every N=84..164, non-sliding), does the pure N-monotone bracket stay monotone-decreasing at identical inner-T resolution, and what directly-read bracket does it give at N=164,T=8000 vs the sliding reading?',
  answer:
    'the fixed-T*=8000 column (0.581134, 0.580365, 0.579804, 0.579291, 0.578930, 0.578574) stays STRICTLY monotone-decreasing in N with no re-reversal (first-diffs -0.000769, -0.000561, -0.000513, -0.000361, -0.000356), confirming the imp-97484 FINDING-1 decrease at IDENTICAL resolution rather than as a sliding-window artifact. The directly-read bracket at N=164,T=8000 = 0.578574 is UNCHANGED from the sliding reading, because N=164 sliding right-edge already IS T*=8000, so the two readings coincide exactly at the bottom. Removing the per-N resolution difference reveals the pure N-effect is LARGER than the sliding column suggests: the fixed-T* first-diffs exceed the sliding first-diffs at every step and the total N-drop 84->164 is 0.002560 vs the sliding 0.002150 (the sliding under-resolves early-N cells, reading them spuriously low, which compresses the apparent decrease). The under-resolved N=164,T=4800 = 0.576636 cell is correctly excluded by pinning to T*. The bracket stays an UPPER bracket, not converged, not interval-certified, not a positive lower bound.',
  binding_2a: LN3,
  commonTstar: IMP97498_COMMON_T_STAR,
  // Finding 1
  fixedTcolumnMonotoneDecreasingInN: true,
  reReversalAtFixedT: false,
  directlyReadBracketAtN164T8000: 0.578574,
  // Finding 2
  pureNEffectLargerAtEqualResolution: true,
  fixedTotalDrop: 0.00256,
  slidingTotalDrop: 0.00215,
  agreesWithSlidingAtBottomBracket: true,
  // cross-check
  reproducesImp97484SharedCells: true,
  // program state unchanged
  isUpperBracketOnLambda1: true,
  positiveLowerBoundProduced: false,
  intervalCertified: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97498_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97498_ASSERTIONS = [
  {
    id: 'imp97498-fixed-T-column-read-from-imp97484-grid',
    holds: () => {
      // the fixed-T* column is read verbatim from the imp-97484 grid (exact reproduction of shared cells)
      const expected = [0.581134, 0.580365, 0.579804, 0.579291, 0.578930, 0.578574];
      for (let i = 0; i < expected.length; i++) {
        if (Math.abs(IMP97498_FIXED_T_COLUMN[i] - expected[i]) > 1e-12) return false;
      }
      return (
        IMP97498_FIXED_T_COLUMN.length === 6 &&
        IMP97498_VERDICT.reproducesImp97484SharedCells === true
      );
    },
    why: 'the common fixed-T*=8000 column is read verbatim from IMP97484_LAM_TABLE, so it reproduces the imp-97484 shared cells exactly.',
  },
  {
    id: 'imp97498-fixed-T-column-strictly-monotone-decreasing-in-N',
    holds: () =>
      IMP97498_FIXED_T_MONOTONE.strictlyDecreasingInN === true &&
      IMP97498_FIXED_T_MONOTONE.firstDiffs.every((d) => d < 0) &&
      IMP97498_FIXED_T_MONOTONE.reReversalDetected === false &&
      IMP97498_VERDICT.fixedTcolumnMonotoneDecreasingInN === true,
    why: 'at the single common T*=8000 the bracket sequence is strictly decreasing across all six N with no re-reversal, confirming the imp-97484 FINDING-1 decrease at identical resolution.',
  },
  {
    id: 'imp97498-bottom-bracket-agrees-with-sliding',
    holds: () =>
      Math.abs(IMP97498_FIXED_T_MONOTONE.directlyReadBracketAtN164 - 0.578574) < 1e-9 &&
      Math.abs(IMP97498_SLIDING_COLUMN[5] - 0.578574) < 1e-9 &&
      IMP97498_VERDICT.directlyReadBracketAtN164T8000 === 0.578574 &&
      IMP97498_VERDICT.agreesWithSlidingAtBottomBracket === true,
    why: 'the directly-read bracket at N=164,T=8000 = 0.578574 is identical in the fixed-T and sliding readings, because N=164 sliding right-edge IS T*=8000.',
  },
  {
    id: 'imp97498-pure-N-effect-larger-at-equal-resolution',
    holds: () => {
      // every fixed-T first-diff is at least as steep (more negative) as the corresponding sliding first-diff
      const f = IMP97498_FIXED_VS_SLIDING.fixedFirstDiffs;
      const s = IMP97498_FIXED_VS_SLIDING.slidingFirstDiffs;
      if (f.length !== s.length) return false;
      for (let i = 0; i < f.length; i++) {
        if (!(f[i] <= s[i])) return false; // fixed-T diff is more negative (steeper)
      }
      return (
        IMP97498_FIXED_VS_SLIDING.fixedTotalDrop84to164 > IMP97498_FIXED_VS_SLIDING.slidingTotalDrop84to164 &&
        Math.abs(IMP97498_FIXED_VS_SLIDING.fixedTotalDrop84to164 - 0.00256) < 1e-9 &&
        Math.abs(IMP97498_FIXED_VS_SLIDING.slidingTotalDrop84to164 - 0.00215) < 1e-9 &&
        IMP97498_VERDICT.pureNEffectLargerAtEqualResolution === true
      );
    },
    why: 'at identical resolution the fixed-T* first-diffs are steeper than the sliding first-diffs at every step and the total N-drop 84->164 is larger (0.002560 vs 0.002150): the sliding reading under-resolves early-N cells and compresses the apparent N-decrease.',
  },
  {
    id: 'imp97498-measurement-only-no-qed',
    holds: () =>
      IMP97498_VERDICT.positiveLowerBoundProduced === false &&
      IMP97498_VERDICT.isUpperBracketOnLambda1 === true &&
      IMP97498_VERDICT.intervalCertified === false &&
      IMP97498_VERDICT.directlyReadBracketAtN164T8000 < 0.581 &&
      IMP97498_VERDICT.operatorPositivityProved === false &&
      IMP97498_VERDICT.boundMoves === false &&
      IMP97498_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97498_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97498_BINDING_2A - LN3) < 1e-12 &&
      IMP97498_VERDICT.qed === false,
    why: 'measurement only: lam_min(N,.) are Rayleigh-Ritz UPPER brackets; no positive lower bound, no operator positivity, not interval-certified; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97498_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97498-krein-csharp-fixedT-common-column assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
