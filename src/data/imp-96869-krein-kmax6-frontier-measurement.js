/**
 * @fileoverview imp-96869 -- MEASUREMENT: solve the next degree rung (kmax = 6) of the Route I Krein
 * cutting-plane LP across the SAME 2a grid crossing 1.0 toward ln 3, and MEASURE whether the
 * double-precision solvability frontier 2a* keeps climbing with certificate degree.
 *
 * CONTEXT. imp-96834 argued the kmax = 4 certified margin eps(2a) = 200(1 - 2a) and its zero at
 * 2a* = 1.0 are a degree/precision ARTIFACT, monotone non-decreasing in degree. imp-96845 then SOLVED
 * a fresh kmax = 5 LP under a lean double-precision config and measured the frontier at 1.06 < 2a* < 1.08
 * (moved right of 1.0, l1 conditioning collapsed ~5 decades), walling numerically (HiGHS status 4) at
 * 2a = 1.08 -- short of ln 3 = 1.0986. It left OPEN whether the frontier keeps moving right at the next
 * degree. This ticket solves the kmax = 6 rung under the IDENTICAL lean config to measure the per-degree
 * increment of 2a*.
 *
 * METHOD (fresh solve, NOT interval-rigorous). Ran the SAME tmp/toeplitz-krein-lp13.py exact-sigma_2
 * cutting-plane solver (F(t) = sigma_2(t) + sum_{k=0..KMAX} sum_j c_{k,j} t^k trig_k(x_j t) >= eps, atoms
 * x_j = k_j*dx >= 2a, periodic tail block on the top t^KMAX family) at KMAX = 6 in the imp-96845 lean
 * double-precision config (X = 8, dx = 0.02, T = 40, HP = 0.2, FINEH = 3e-4, VIOLTOL = 0.4, HiGHS
 * dual-simplex; eps = 8 at 2a = 0.96, eps = 1 for 2a >= 1.0 -- matching the imp-96845 sweep exactly).
 * Signal measured: whether the LP still emits a bounded-l1 near-feasible positive-margin iterate as 2a
 * grows to and past 1.08 (where kmax = 5 walled), and whether it reaches ln 3.
 *
 * FINDINGS (measured, verbatim from tmp/imp-96869/k6-*.json).
 *   1. THE kmax = 6 FRONTIER REACHES ln 3. Under the identical lean double-precision config the KMAX = 6
 *      LP stays SOLVABLE and near-feasible (bounded small l1 ~ 7, no HiGHS numerical wall) at EVERY
 *      sampled point 2a = 0.96, 1.00, 1.04, 1.06, 1.08, 1.09 and ln 3 = 1.0986 -- whereas kmax = 5
 *      walled (HiGHS status 4) at 2a = 1.08. So raising the degree by one rung MOVED the double-precision
 *      solvability frontier from 1.06 < 2a* < 1.08 (kmax = 5) to 2a* >= ln 3 (kmax = 6): the frontier
 *      KEEPS climbing with degree and now spans the whole grid to ln 3.
 *   2. NO ADDITIONAL l1 BLOWUP. The kmax = 6 iterate l1-norm stays tiny across the range: 18.39
 *      (2a = 0.96), 6.81 (1.00), 7.02 (1.04), 7.14 (1.06), 7.26 (1.08), 7.41 (1.09 = ln 3), essentially
 *      the SAME magnitude as kmax = 5 (18.59 / 7.03 / .. ), and ~8e4x below the baked kmax = 4
 *      certificate l1 = 1.466e6 at 2a = 0.96. The extra t^6 family removes the HiGHS numerical wall
 *      WITHOUT reintroducing the l1 conditioning obstruction.
 *   3. PER-DEGREE INCREMENT. The measured double-precision frontier climbs kmax = 4 wall ~ 1.0 ->
 *      kmax = 5 frontier ~ 1.07 (imp-96845) -> kmax = 6 reaches ln 3 = 1.0986: a per-rung move of
 *      roughly +0.07 (4->5) then a further ~ +0.03 (5->6) that closes the last gap to ln 3. Direction
 *      confirmed: 2a*(degree) is monotone non-decreasing (imp-96834 Finding 1) and passes ln 3 by kmax = 6.
 *
 * HONEST CAVEATS / SUB-GAP.
 *   - NOT CONVERGED / NOT VERIFIED. Every kmax = 6 point has converged = false: the raw F floor minF
 *     reaches the design margin eps, but the guarded design condition F - guard - eps still has a small
 *     negative worst residual (best -0.19 at 2a = 1.0, up to -0.40 at 1.04) at the VIOLTOL = 0.4 cap.
 *     These are NEAR-feasible cutting-plane iterates, NOT interval-verified certificates. The residual is
 *     roughly degree-independent (kmax = 5 sat at -0.17 .. -0.30): what degree = 6 buys over degree = 5
 *     is REMOVAL of the HiGHS numerical wall (LP now solvable to ln 3), NOT convergence to a certificate.
 *   - 2a = 1.09 AND ln 3 ARE THE SAME LP. The atom lattice x_j = k_j*dx (dx = 0.02) snaps both X0 = 1.09
 *     and X0 = ln 3 = 1.098612 to the same first atom x_0 = 1.10 (346 atoms), so those two solves are
 *     byte-identical -- ln 3 is not an independent extra data point beyond 1.09.
 *   - CONFIG-DEPENDENT WALL LOCATIONS. The lean config (T = 40, HP = 0.2, FINEH = 3e-4) differs from the
 *     baked interval config (T = 60, HP = 0.02, FINEH = 1e-4); the ROBUST signal is the RELATIVE move
 *     (kmax = 6 solvable and small-l1 across the full grid where kmax = 5 walled at 1.08), not the
 *     absolute wall numbers.
 *   - SUB-GAP IMP96869_KMAX6_NEAR_FEASIBLE_UNVERIFIED: the kmax = 6 iterates reach ln 3 in the lean-config
 *     SOLVABILITY sense (bounded l1, no HiGHS wall) but are near-feasible (guarded-condition residual
 *     ~0.19-0.40), NOT driven to convergence or interval-verified -- extended precision / a driven solve
 *     remains needed to turn these into verified certificates.
 *
 * Measurement only; interval-rigorous reach stays exactly 2a <= 0.96 (no verified certificate produced
 * past it); the operator floor is a Rayleigh UPPER bound (no operator positivity established); RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96845-krein-kmax5-frontier-measurement.js (parent: kmax=5 frontier 1.06-1.08, walled at 1.08; SUB-GAP: does the frontier keep moving right?)
 * @see imp-96834-krein-certificate-degree-margin-assessment.js (grandparent: structural monotone-right claim 2a*(degree))
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source: baked kmax=4 l1=1.466e6 at 2a=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const KMAX4_BAKED_L1_AT_096 = 1.466e6; // baked KREIN_CERTIFICATE l1 at 2a=0.96, kmax=4
const KMAX5_L1_AT_096 = 18.593168842104156; // imp-96845 kmax=5 l1 at 2a=0.96

// lean double-precision cutting-plane config -- IDENTICAL to imp-96845 (only KMAX differs: 6 vs 5)
export const IMP96869_SOLVE_CONFIG = Object.freeze({
  solver: 'tmp/toeplitz-krein-lp13.py (exact sigma_2 cutting-plane)',
  kmax: 6,
  X: 8.0,
  dx: 0.02,
  T: 40.0,
  HP: 0.2,
  FINEH: 3e-4,
  violTol: 0.4,
  method: 'highs-ds',
  note: 'LEAN config shared with imp-96845 -- NOT the baked interval config (T=60, HP=0.02, FINEH=1e-4); absolute wall numbers are config-dependent, the robust signal is the relative kmax5-vs-kmax6 move',
});

// MEASURED sweep rows (verbatim from tmp/imp-96869/k6-*.json).
// status: solved = LP feasible each round (bounded l1, near-feasible iterate); walled = HiGHS status 2/4.
// xs0 = first atom on the dx-lattice (2a=1.09 and 2a=ln3 both snap to x0=1.10 => byte-identical LP).
export const IMP96869_SWEEP = Object.freeze([
  { twoA: 0.96, eps: 8, kmax: 6, status: 'solved', l1: 18.389910238825085, worstViol: -0.28841919508442615, roundsUsed: 9, xs0: 0.96 },
  { twoA: 1.0, eps: 1, kmax: 6, status: 'solved', l1: 6.806127640953728, worstViol: -0.1905040712298609, roundsUsed: 7, xs0: 1.0 },
  { twoA: 1.04, eps: 1, kmax: 6, status: 'solved', l1: 7.019100515529435, worstViol: -0.39668330325319356, roundsUsed: 8, xs0: 1.04 },
  { twoA: 1.06, eps: 1, kmax: 6, status: 'solved', l1: 7.1357996072559935, worstViol: -0.2382779047903476, roundsUsed: 6, xs0: 1.06 },
  { twoA: 1.08, eps: 1, kmax: 6, status: 'solved', l1: 7.261945969504796, worstViol: -0.221526447902205, roundsUsed: 7, xs0: 1.08 },
  { twoA: 1.09, eps: 1, kmax: 6, status: 'solved', l1: 7.40780839449821, worstViol: -0.29410800397374004, roundsUsed: 7, xs0: 1.1 },
  { twoA: LN3, eps: 1, kmax: 6, status: 'solved', l1: 7.40780839449821, worstViol: -0.29410800397374004, roundsUsed: 7, xs0: 1.1 },
]);

const solved = IMP96869_SWEEP.filter((r) => r.status === 'solved');
const walled = IMP96869_SWEEP.filter((r) => r.status === 'walled');
const twoAStarLower = Math.max(...solved.map((r) => r.twoA)); // ln3 (last solvable)
const twoAStarUpper = walled.length ? Math.min(...walled.map((r) => r.twoA)) : Infinity; // no wall => Infinity

export const IMP96869_VERDICT = Object.freeze({
  ticket: 'imp-96869',
  question:
    'does the double-precision Route I Krein solvability frontier 2a* keep climbing toward ln3 at the next certificate degree kmax=6, and what is the per-degree increment?',
  answer:
    'yes -- the fresh kmax=6 cutting-plane LP stays solvable and near-feasible (bounded l1 ~7, NO HiGHS numerical wall) across the ENTIRE grid to ln3=1.0986, whereas kmax=5 walled at 2a=1.08. The measured frontier climbs kmax=4 wall ~1.0 -> kmax=5 ~1.07 -> kmax=6 reaches ln3, confirming the monotone-right prediction and closing the last gap to ln3 in the lean-config SOLVABILITY sense',
  solveRun: true, // a fresh kmax=6 LP WAS solved across the grid
  kmax: 6,
  twoAStarLowerMeasured: twoAStarLower, // ln3 -- last solvable kmax=6 point
  twoAStarUpperMeasured: twoAStarUpper, // Infinity -- no HiGHS wall observed on the grid
  frontierMovedRightOfKmax5Wall: twoAStarLower > 1.08, // true (last solvable = ln3 > kmax=5 wall 1.08)
  reachesLn3: twoAStarLower >= LN3 - 1e-12, // true -- solvable up to ln3
  noHighsWall: walled.length === 0, // true -- no HiGHS status 2/4 anywhere on the grid
  ln3: LN3,
  // l1 comparison: kmax=6 stays tiny, essentially matching kmax=5, ~8e4x below baked kmax=4
  kmax4BakedL1At096: KMAX4_BAKED_L1_AT_096, // 1.466e6
  kmax5L1At096: KMAX5_L1_AT_096, // 18.59
  kmax6L1At096: 18.389910238825085,
  l1ReductionFactorAt096: KMAX4_BAKED_L1_AT_096 / 18.389910238825085, // ~8.0e4
  perDegreeFrontier: Object.freeze({
    kmax4: 1.0, // double-precision certified-margin zero (imp-96834)
    kmax5: 1.07, // imp-96845 measured frontier midpoint (1.06 solvable, 1.08 walled)
    kmax6: LN3, // this ticket: solvable to ln3, no wall
    note: 'monotone non-decreasing; per-rung move ~ +0.07 (4->5) then ~ +0.03 (5->6) closing the last gap to ln3',
  }),
  refinesImp96845:
    'answers the imp-96845 open question (does the frontier keep moving right with degree?) YES: one more degree rung removes the kmax=5 HiGHS numerical wall at 2a=1.08 and the LP stays solvable and small-l1 to ln3 -- but the guarded-condition residual (~0.2-0.4) is roughly degree-independent, so degree=6 buys SOLVABILITY to ln3, not a verified certificate',
  caveats: Object.freeze({
    notConverged:
      'every kmax=6 point has converged=false: raw F floor minF reaches eps but the guarded design condition F-guard-eps has a small negative worst residual (best -0.19 at 2a=1.0, up to -0.40 at 1.04) at the VIOLTOL=0.4 cap -- near-feasible iterates, not interval-verified certificates',
    sameLpAtLn3:
      'the dx=0.02 atom lattice snaps both X0=1.09 and X0=ln3=1.098612 to the same first atom x0=1.10 (346 atoms), so those two solves are byte-identical -- ln3 is not an independent data point beyond 1.09',
    configDependentWalls:
      'the lean config (T=40, HP=0.2, FINEH=3e-4) differs from the baked interval config; the robust signal is the relative move (kmax=6 solvable across the full grid where kmax=5 walled at 1.08), not absolute wall numbers',
  }),
  subGap:
    'IMP96869_KMAX6_NEAR_FEASIBLE_UNVERIFIED -- kmax=6 iterates reach ln3 in the lean-config SOLVABILITY sense (bounded l1 ~7, no HiGHS wall) but are near-feasible (guarded-condition residual ~0.19-0.40), NOT driven to convergence or interval-verified; a driven / extended-precision solve remains needed to turn these into verified certificates',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96869_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96869_ASSERTIONS = [
  {
    id: 'imp96869-kmax6-solvable-across-full-grid',
    holds: () =>
      IMP96869_SWEEP.every((r) => r.status === 'solved' && r.l1 > 0 && r.l1 < 100),
    why: 'under the identical lean config, kmax=6 stays solvable with a tiny bounded l1 at every sampled 2a from 0.96 to ln3 -- no HiGHS numerical wall anywhere on the grid.',
  },
  {
    id: 'imp96869-frontier-passes-kmax5-wall',
    holds: () =>
      IMP96869_VERDICT.frontierMovedRightOfKmax5Wall === true && IMP96869_VERDICT.noHighsWall === true,
    why: 'the kmax=5 double-precision LP walled (HiGHS status 4) at 2a=1.08; kmax=6 stays solvable past it with no wall, so the frontier moved right with the extra degree.',
  },
  {
    id: 'imp96869-reaches-ln3',
    holds: () => IMP96869_VERDICT.reachesLn3 === true && twoAStarLower >= LN3 - 1e-12,
    why: 'the last solvable kmax=6 point is 2a=ln3=1.0986 -- the double-precision solvability frontier reaches ln3 at this degree rung.',
  },
  {
    id: 'imp96869-l1-stays-small-like-kmax5',
    holds: () =>
      IMP96869_VERDICT.l1ReductionFactorAt096 > 1e4 &&
      Math.abs(IMP96869_VERDICT.kmax6L1At096 - KMAX5_L1_AT_096) < 1.0,
    why: 'the extra t^6 family removes the HiGHS wall WITHOUT reintroducing the l1 conditioning obstruction: kmax=6 l1 at 2a=0.96 (~18.4) matches kmax=5 (~18.6) and stays >1e4x below the baked kmax=4 l1 (1.466e6).',
  },
  {
    id: 'imp96869-near-feasible-not-converged',
    holds: () =>
      IMP96869_SWEEP.every((r) => r.worstViol < 0 && r.worstViol > -0.4001),
    why: 'every kmax=6 point is near-feasible but NOT converged: the guarded-condition worst residual sits in [-0.40, 0) at the VIOLTOL=0.4 cap -- these are near-feasible iterates, not interval-verified certificates.',
  },
  {
    id: 'imp96869-ln3-same-lp-as-109',
    holds: () => {
      const a = IMP96869_SWEEP.find((r) => r.twoA === 1.09);
      const b = IMP96869_SWEEP.find((r) => Math.abs(r.twoA - LN3) < 1e-12);
      return a.xs0 === b.xs0 && a.l1 === b.l1 && a.worstViol === b.worstViol;
    },
    why: 'the dx-lattice snaps X0=1.09 and X0=ln3 to the same first atom x0=1.10, so those two solves are byte-identical -- ln3 is not an independent data point beyond 1.09.',
  },
  {
    id: 'imp96869-measurement-only-reach-and-qed-unchanged',
    holds: () =>
      IMP96869_VERDICT.solveRun === true &&
      IMP96869_VERDICT.qed === false &&
      IMP96869_VERDICT.intervalRigorousReachUnchanged === 0.96,
    why: 'a fresh kmax=6 LP was solved across the grid (solveRun true), but this is measurement only: no QED, interval-rigorous reach stays 2a<=0.96.',
  },
];

for (const a of IMP96869_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96869-krein-kmax6-frontier-measurement assertion failed: ${a.id}`);
  }
}
