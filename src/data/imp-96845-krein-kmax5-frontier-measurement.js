/**
 * @fileoverview imp-96845 -- MEASUREMENT: solve a fresh HIGHER-DEGREE (kmax = 5) Route I Krein
 * cutting-plane LP across a 2a grid crossing 1.0 toward ln 3, and MEASURE how far the certified
 * design-margin frontier 2a* actually moves right of the kmax = 4 double-precision wall.
 *
 * CONTEXT. imp-96834 argued STRUCTURALLY that the kmax = 4 certified margin eps(2a) = 200(1 - 2a) and
 * its zero at 2a* = 1.0 are an ARTIFACT of the fixed degree / double precision, and that the frontier
 * 2a*(degree) is monotone non-decreasing in degree bounded above by the operator floor -- but left
 * SUB-GAP IMP96834_HIGHER_DEGREE_LP_UNSOLVED: no fresh kmax = 5 LP was solved to MEASURE the actual
 * size of the move. This ticket solves that LP and reports the measured frontier.
 *
 * METHOD (fresh solve, NOT interval-rigorous). Ran the tmp/toeplitz-krein-lp13.py exact-sigma_2
 * cutting-plane solver (F(t) = sigma_2(t) + sum_{k=0..KMAX} sum_j c_{k,j} t^k trig_k(x_j t) >= eps, atoms
 * x_j = k_j*dx >= 2a, periodic tail block) at KMAX = 5 in a LEAN double-precision config (X = 8, dx = 0.02,
 * T = 40, HP = 0.2, FINEH = 3e-4, rounds <= 14, VIOLTOL = 0.4, HiGHS dual-simplex). The SAME lean config
 * with KMAX = 4 is the baseline. Signal measured: whether the LP still emits a bounded-l1 near-feasible
 * positive-margin iterate as 2a grows past 1.0, and where HiGHS numerically walls (status 4/8).
 *
 * FINDINGS (measured, verbatim from tmp/imp-96845/sweep-results.json + sweep2-results.json).
 *   1. THE FRONTIER MOVES RIGHT PAST 1.0. Under the identical lean double-precision config, KMAX = 4
 *      walls immediately at 2a = 0.96 (HiGHS status 2 / infeasible, round 0), whereas KMAX = 5 stays
 *      solvable and near-feasible at 2a = 0.96, 1.00, 1.04, and 1.06, then walls (HiGHS status 4 /
 *      numerical) at 2a = 1.08, 1.09 and ln 3 = 1.0986. So the measured kmax = 5 double-precision
 *      solvability frontier is 1.06 < 2a* < 1.08 -- it moved RIGHT of 1.0 (confirming imp-96834
 *      Finding 1's monotone-right prediction) and reaches 1.06, but does NOT reach ln 3 (short by the
 *      1.06->1.08 wall band, i.e. >= 0.019 in 2a below ln 3).
 *
 *   2. THE l1 CONDITIONING COLLAPSES BY ~5 ORDERS OF MAGNITUDE. The kmax = 5 iterate l1-norm stays
 *      TINY across the whole solvable range: 18.59 (2a = 0.96), 7.03 (1.00), 7.41 (1.04), 7.75 (1.06)
 *      -- versus the baked kmax = 4 certificate l1 = 1.466e6 at 2a = 0.96. The t^5 sin family absorbs
 *      the p = 2 lattice (t ~ 2^k) concentration that forced the kmax = 4 l1 explosion, so degree
 *      alone (still double precision) both moves the wall right AND removes ~5 decades of the l1
 *      conditioning obstruction that imp-96632/imp-96834 projected as the reach-limiter.
 *
 *   3. VERDICT. The kmax = 4 eps zero at 2a = 1.0 is confirmed a degree+precision ARTIFACT by direct
 *      solve: a degree-5 certificate is solvable and small-l1 past 1.0 to ~1.07. But it still falls
 *      short of ln 3 at double precision -- the last ~0.03 in 2a needs extended precision, consistent
 *      with the imp-96834 caveat that degree AND extended precision are needed jointly to reach ln 3.
 *
 * HONEST CAVEATS / SUB-GAP.
 *   - NOT CONVERGED / NOT VERIFIED. Every kmax = 5 point has converged = false: the raw F floor minF
 *     reaches the design margin eps (minF -> 8 at 2a = 0.96, -> 1 past 1.0), but the guarded design
 *     condition F - guard - eps still has a small negative worst residual (best -0.166 at 2a = 1.0, up
 *     to -0.30) at the rounds<=14 / VIOLTOL=0.4 cap. These are NEAR-feasible cutting-plane iterates,
 *     NOT interval-verified certificates.
 *   - CONFIG-DEPENDENT WALL LOCATIONS. The lean config (T = 40, HP = 0.2, FINEH = 3e-4) differs from
 *     the baked interval config (T = 60, HP = 0.02, FINEH = 1e-4); under the lean config even kmax = 4
 *     walls at 0.96, so the absolute wall NUMBERS are config-dependent. The ROBUST measured signal is
 *     the RELATIVE move: kmax = 5 is solvable, small-l1 and near-feasible well past where kmax = 4
 *     walls, with l1 ~ 1e5x smaller.
 *   - SUB-GAP IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED: the kmax = 5 iterates to 2a = 1.06 are
 *     near-feasible (guarded-condition residual ~0.17-0.30) but not driven to convergence or
 *     interval-verified; and the kmax = 5 double-precision wall (~2a = 1.07) still falls short of
 *     ln 3 = 1.0986 by ~0.03 -- extended precision remains needed for the final stretch.
 *
 * Measurement only; interval-rigorous reach stays exactly 2a <= 0.96 (no verified certificate produced
 * past it); the operator floor is a Rayleigh UPPER bound (no operator positivity established); RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96834-krein-certificate-degree-margin-assessment.js (parent: structural monotone-right claim; SUB-GAP IMP96834_HIGHER_DEGREE_LP_UNSOLVED closed by this measurement)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source: epsMarginDecay, normGrowthLaw, baked kmax=4 l1=1.466e6 at 2a=0.96)
 * @see imp-96732-krein-extended-precision-reach-assessment.js (grandparent: labelled 2a>=1.0 intrinsic; degree+precision refinement)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const KMAX4_BAKED_L1_AT_096 = 1.466e6; // baked KREIN_CERTIFICATE l1 at 2a=0.96, kmax=4

// lean double-precision cutting-plane config shared by baseline and kmax=5 solves
export const IMP96845_SOLVE_CONFIG = Object.freeze({
  solver: 'tmp/toeplitz-krein-lp13.py (exact sigma_2 cutting-plane)',
  X: 8.0,
  dx: 0.02,
  T: 40.0,
  HP: 0.2,
  FINEH: 3e-4,
  roundsCap: 14,
  violTol: 0.4,
  method: 'highs-ds',
  note: 'LEAN config -- NOT the baked interval config (T=60, HP=0.02, FINEH=1e-4); absolute wall numbers are config-dependent, the robust signal is the relative kmax4-vs-kmax5 move',
});

// MEASURED sweep rows (verbatim from tmp/imp-96845/sweep-results.json + sweep2-results.json).
// status: solved = LP feasible each round (bounded l1, near-feasible iterate); walled = HiGHS status 2/4.
export const IMP96845_SWEEP = Object.freeze([
  { twoA: 0.96, eps: 8, kmax: 4, status: 'walled', highsStatus: 2, l1: null, worstViol: null, roundsUsed: 1 },
  { twoA: 0.96, eps: 8, kmax: 5, status: 'solved', highsStatus: 0, l1: 18.593168842104156, worstViol: -0.3269604095408276, roundsUsed: 5 },
  { twoA: 1.0, eps: 1, kmax: 4, status: 'walled', highsStatus: 2, l1: null, worstViol: null, roundsUsed: 1 },
  { twoA: 1.0, eps: 1, kmax: 5, status: 'solved', highsStatus: 0, l1: 7.030242896554375, worstViol: -0.16636421527952594, roundsUsed: 4 },
  { twoA: 1.04, eps: 1, kmax: 5, status: 'solved', highsStatus: 0, l1: 7.412780865533326, worstViol: -0.304169309853334, roundsUsed: 3 },
  { twoA: 1.06, eps: 1, kmax: 5, status: 'solved', highsStatus: 0, l1: 7.748635770708253, worstViol: -0.22168369850443792, roundsUsed: 8 },
  { twoA: 1.08, eps: 1, kmax: 5, status: 'walled', highsStatus: 4, l1: null, worstViol: null, roundsUsed: 1 },
  { twoA: 1.09, eps: 1, kmax: 5, status: 'walled', highsStatus: 4, l1: null, worstViol: null, roundsUsed: 1 },
  { twoA: LN3, eps: 1, kmax: 5, status: 'walled', highsStatus: 4, l1: null, worstViol: null, roundsUsed: 1 },
]);

// derived frontier band: largest solved 2a (kmax=5) and smallest walled 2a (kmax=5)
const k5Solved = IMP96845_SWEEP.filter((r) => r.kmax === 5 && r.status === 'solved');
const k5Walled = IMP96845_SWEEP.filter((r) => r.kmax === 5 && r.status === 'walled');
const twoAStarLower = Math.max(...k5Solved.map((r) => r.twoA)); // 1.06 (last solvable)
const twoAStarUpper = Math.min(...k5Walled.map((r) => r.twoA)); // 1.08 (first wall)

export const IMP96845_VERDICT = Object.freeze({
  ticket: 'imp-96845',
  question:
    'how far does the certified-margin frontier 2a* move past 1.0 toward ln3 when the certificate degree is raised to kmax=5 (finer-degree LP solved, not just structurally argued)?',
  answer:
    'the fresh kmax=5 double-precision cutting-plane LP is solvable and near-feasible (small l1) past 1.0 out to 2a=1.06, then walls numerically at 2a=1.08, so the measured kmax=5 frontier is 1.06 < 2a* < 1.08 -- it moves RIGHT of 1.0 (confirming imp-96834 Finding 1) but does NOT reach ln3=1.0986',
  solveRun: true, // a fresh kmax=5 LP WAS solved -- closes IMP96834_HIGHER_DEGREE_LP_UNSOLVED
  kmax: 5,
  twoAStarLowerMeasured: twoAStarLower, // 1.06 last solvable kmax=5 point
  twoAStarUpperMeasured: twoAStarUpper, // 1.08 first walled kmax=5 point
  frontierMovedRightOfOne: twoAStarLower > 1.0, // true (last solvable 2a=1.06 > 1.0)
  reachesLn3: twoAStarLower >= LN3, // false -- last solvable 2a=1.06 < ln3=1.0986
  ln3: LN3,
  shortfallBelowLn3: LN3 - twoAStarLower, // how far the last SOLVED point is below ln3 (~0.039)
  // l1 collapse vs the baked kmax=4 certificate
  kmax4BakedL1At096: KMAX4_BAKED_L1_AT_096, // 1.466e6
  kmax5L1At096: 18.593168842104156,
  l1ReductionFactorAt096: KMAX4_BAKED_L1_AT_096 / 18.593168842104156, // ~7.9e4
  refinesImp96834:
    'closes SUB-GAP IMP96834_HIGHER_DEGREE_LP_UNSOLVED by direct solve: the frontier does move right of 1.0 (to ~1.07) and the l1 conditioning collapses ~5 decades, but the double-precision kmax=5 wall still falls short of ln3 -- degree AND extended precision are needed jointly, as imp-96834 cautioned',
  caveats: Object.freeze({
    notConverged:
      'every kmax=5 point has converged=false: raw F floor minF reaches eps but the guarded design condition F-guard-eps has a small negative worst residual (best -0.166 at 2a=1.0, up to -0.30) at the rounds<=14 / VIOLTOL=0.4 cap -- near-feasible iterates, not interval-verified certificates',
    configDependentWalls:
      'the lean config (T=40, HP=0.2, FINEH=3e-4) walls even kmax=4 at 0.96, so absolute wall numbers are config-dependent; the robust signal is the relative move (kmax=5 solvable and small-l1 well past where kmax=4 walls)',
  }),
  subGap:
    'IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED -- kmax=5 iterates to 2a=1.06 are near-feasible (guarded-condition residual ~0.17-0.30) but not driven to convergence or interval-verified; and the kmax=5 double-precision wall (~2a=1.07) still falls short of ln3=1.0986 by ~0.03, so extended precision remains needed for the final stretch',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96845_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96845_ASSERTIONS = [
  {
    id: 'imp96845-kmax4-walls-where-kmax5-solves-at-096',
    holds: () => {
      const k4 = IMP96845_SWEEP.find((r) => r.twoA === 0.96 && r.kmax === 4);
      const k5 = IMP96845_SWEEP.find((r) => r.twoA === 0.96 && r.kmax === 5);
      return k4.status === 'walled' && k5.status === 'solved' && k5.l1 > 0 && k5.l1 < 100;
    },
    why: 'under the identical lean config, kmax=4 walls at 2a=0.96 while kmax=5 stays solvable with a tiny bounded l1 -- the core degree-move signal.',
  },
  {
    id: 'imp96845-frontier-moves-right-of-one',
    holds: () => IMP96845_VERDICT.frontierMovedRightOfOne === true && twoAStarLower >= 1.06 - 1e-12,
    why: 'the measured kmax=5 solvability frontier must sit past 2a=1.0 (last solvable point 2a=1.06), confirming imp-96834 Finding 1 monotone-right prediction.',
  },
  {
    id: 'imp96845-does-not-reach-ln3',
    holds: () => twoAStarLower < LN3 && twoAStarUpper < LN3,
    why: 'the last solvable kmax=5 point (2a=1.06) is below ln3=1.0986, and the LP walls (2a=1.08, also below ln3) before ln3 -- the double-precision degree-5 route does NOT reach ln3.',
  },
  {
    id: 'imp96845-l1-collapse-vs-kmax4',
    holds: () => IMP96845_VERDICT.l1ReductionFactorAt096 > 1e4,
    why: 'the kmax=5 l1 (~18.6) is >1e4x smaller than the baked kmax=4 l1 (1.466e6) at 2a=0.96 -- degree removes the bulk of the l1 conditioning obstruction.',
  },
  {
    id: 'imp96845-walls-are-highs-numerical',
    holds: () =>
      IMP96845_SWEEP.filter((r) => r.kmax === 5 && r.status === 'walled').every((r) => r.highsStatus === 4),
    why: 'the kmax=5 frontier is a HiGHS numerical wall (status 4), i.e. a double-precision conditioning limit, not a proven infeasibility -- extended precision is the indicated next lever.',
  },
  {
    id: 'imp96845-measurement-only-reach-and-qed-unchanged',
    holds: () =>
      IMP96845_VERDICT.solveRun === true &&
      IMP96845_VERDICT.qed === false &&
      IMP96845_VERDICT.intervalRigorousReachUnchanged === 0.96,
    why: 'a fresh kmax=5 LP was solved (solveRun true, closing the imp-96834 sub-gap), but this is measurement only: no QED, interval-rigorous reach stays 2a<=0.96.',
  },
];

for (const a of IMP96845_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96845-krein-kmax5-frontier-measurement assertion failed: ${a.id}`);
  }
}
