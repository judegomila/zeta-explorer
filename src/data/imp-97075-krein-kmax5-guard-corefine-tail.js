/**
 * @fileoverview imp-97075 -- CO-REFINEMENT MEASUREMENT (numerical): decide whether the imp-96868
 * kmax=5, 2a=1.06 binding worst design-condition residual at the T=40 tail (t*=37.878) -- shown by
 * imp-96868 to be PRECISION-INVARIANT (double vs 50-digit agree to 3.85e-8) and a coarse-grid GUARD
 * deficit, not roundoff -- MOVES once the guard grid is genuinely refined. imp-96868 established that
 * extended precision alone does not move it; this ticket measures the joint lever by refining the
 * guard grid (FINEH) and, independently, the coarse cell (hc) at the binding tail cell, mirroring the
 * imp-96978 2a=1.00 two-knob decomposition. Import-light: all values below are frozen literals from a
 * direct decomposition of the tmp/toeplitz-krein-verify4.py lower_bound machinery run on the imp-96868
 * 2a=1.06 double-precision iterate (tmp/imp-96868/dump-highs-ds-1.060.json, symbol sigma2, kmax=5, 84
 * atoms) at the binding tail cell m=37.878 (tmp/imp-97075-guard-corefine.py). No certified bound moves;
 * certified reach stays 2a<=0.96; RH open; NO QED.
 *
 * SETUP (identical guard machinery to imp-96978). The verifier rigorous lower bound on a coarse cell
 * centered at m of half-width r=hc/2 is
 *   F_low(t_f) = sigma_taylor(t_f) + nu(t_f) - slack - r_f |F-prime(t_f)| - (1/2)(C2 + M2) r_f^2,
 *   sigma_taylor(t_f) = sigma(m) + sigma-prime(m)(t_f - m) - (1/2) C2 (t_f - m)^2,
 * with d = t_f - m over the COARSE half-width [-r,r], r_f the FINE sub-cell half-width (set by FINEH),
 * C2 = sup_cell |sigma_2-prime-prime|, M2 = sup_cell |nu-prime-prime|. For sigma_2 = (t^2+1/4)^2 w_1,
 *   C2 = (12 t^2 + 1)|w_1| + 8 t (t^2+1/4)|w_1-prime| + (t^2+1/4)^2 W1PP,  W1PP = 32.8029... .
 * Two knobs are swept independently at the tail cell m=37.878: FINEH (drives r_f and hence the
 * r_f-order guard terms only) and the COARSE cell width hc (drives r and hence the sigma second-order
 * Taylor penalty -0.5 C2 d^2). The LP dx=0.02 grid corresponds to hc=2e-2.
 *
 * FINDING 1 -- REFINING FINEH DOES NOT MOVE THE TAIL GUARD DEFICIT (the bound SATURATES). Holding
 * hc=2e-2 (the LP dx grid) and shrinking the FINEH tolerance so r_f falls from 2.04e-5 (nf=489) to
 * 2.05e-7 (nf=48898), the rigorous lower bound moves only -3193.69 -> -3192.05: a 0.05 percent change
 * over a ~100x r_f refinement. The two r_f-order guard terms DO vanish (rf|F-prime| -14.64 -> -0.15;
 * 0.5(C2+M2)rf^2 -0.10 -> 0.00), but the FINEH-invariant coarse sigma second-order Taylor penalty
 * -0.5 C2 d^2 GROWS (-3382.2 -> -3396.0) because finer sub-cells sit nearer the coarse-cell EDGES
 * where |d| approaches r. So the binding tail guard deficit is a COARSE-cell enclosure and is
 * FINEH-invariant -- refining the guard grid (smaller FINEH) does NOT rescue it and does NOT move the
 * near-feasible band onset past 1.07. This CONFIRMS AND QUANTIFIES the imp-96868 precision-invariance:
 * the deficit is invariant under BOTH extended precision (imp-96868) AND guard-grid refinement (here).
 *
 * FINDING 2 -- REFINING THE COARSE CELL hc DOES RESCUE (bound climbs monotonically to the true point
 * value +6.20). Shrinking hc drives the lower bound from -3193.69 (hc=2e-2) -> -792.27 (1e-2) ->
 * -193.44 (5e-3) -> -25.89 (2e-3) -> -1.92 (1e-3) -> +4.09 (5e-4) -> +5.78 (2e-4) -> +6.05 (1e-4),
 * converging to the true point value F(t)=+6.200 that holds throughout the tail. The sigma Taylor
 * penalty falls as r^2 (0.5 C2 r^2); the cell flips POSITIVE at hc <= 5e-4. So the ONLY lever that
 * moves the tail guard deficit is the COARSE grid resolution (or a cell-local w1-prime-prime enclosure
 * / third-order sigma Taylor enclosure per imp-96978 Finding 3), NOT FINEH and NOT precision.
 *
 * FINDING 3 -- THE BINDING TERM IS q^2 W1PP AND IS AMPLIFIED 26x AT THE TAIL. At t=37.878 the
 * C2 = 6.785e7 decomposes as (12t^2+1)|w1| = 23722.8, 8 t q |w1-prime| = 278605.1, and q^2 W1PP =
 * 6.7548e7 -- the last is 99.55 percent of C2 (even more dominant than the 99.2 percent at the
 * imp-96978 t=16.7 cell). C2 is 26x the t=16.7 value (2.575e6) because the sigma_2 double factor
 * (t^2+1/4)^2 grows as t^4: q^2 ~ 2.06e6 at t=37.878 vs 7.79e4 at t=16.7. This is why the tail coarse
 * penalty (-3382 at hc=2e-2) dwarfs the t=16.7 penalty (-0.82 at hc=2e-3): the same q^2 W1PP mechanism,
 * amplified by the tail curvature.
 *
 * VERDICT. The imp-96868 precision-invariant coarse-grid guard deficit at the 2a=1.06 tail is ALSO
 * FINEH-invariant: refining the guard grid (smaller FINEH) under the same iterate does NOT move it
 * (saturates at -3192 over a 100x refinement), so guard-grid refinement is NOT the lever and the
 * near-feasible band onset does NOT move past 1.07 by FINEH. The deficit is the coarse-cell (dx/hc)
 * second-order sigma Taylor penalty, dominated 99.55 percent by q^2 W1PP and amplified 26x at the tail
 * by the (t^2+1/4)^2 double factor; it is rescued ONLY by the COARSE grid (hc <= 5e-4 flips the cell
 * positive, converging to true point F = +6.20) or a cell-local w1-prime-prime / third-order enclosure.
 * This SETTLES the imp-96868 "guard resolution and degree remain co-binding" residual on the guard axis:
 * of the two guard knobs, FINEH is inert and the COARSE grid is the mover. Neither extended precision
 * (imp-96868) nor FINEH (here) moves the frontier; the guard lever is coarse-grid + curvature-enclosure.
 *
 * HONEST CAVEAT / SUB-GAP. (a) These are the tmp/toeplitz-krein-verify4.py SECOND-ORDER TAYLOR guard
 * numbers, NOT the imp-96868 LP cutting-plane VIOLTOL guard (a lighter guard giving the -0.2217 figure);
 * the ABSOLUTE magnitudes are guard-FORMULATION-dependent, but the FINEH-invariance / hc-rescue /
 * q^2 W1PP-domination MECHANISM is the shared, transferable finding. (b) Per imp-96868, no
 * extended-precision LP solver exists in-environment, so a full multi-word LP RE-SOLVE at refined
 * coarse grid was NOT performed; this measures the guard decomposition on the fixed 2a=1.06 iterate at
 * the single binding tail cell, not a re-optimized certificate. SUB-GAP
 * IMP97075_COARSEGRID_LP_RESOLVE_NOT_RUN -- a full [0,40] verification at hc<=5e-4 (25x the coarse cell
 * count) with a re-optimized extended-precision LP is needed to actually CERTIFY past 2a=0.96; the
 * certified reach stays 2a<=0.96 pending that run.
 *
 * Measurement only; interval-rigorous certified reach stays exactly 2a <= 0.96; the operator floor is a
 * Rayleigh UPPER bound (no operator positivity established); RH open; no refereed bound is changed;
 * NO QED.
 *
 * @see imp-96868-krein-kmax5-extprec-frontier.js (parent: precision-invariant tail guard deficit at 2a=1.06, t*=37.878; degree+guard co-binding)
 * @see imp-96978-krein-kmax5-100-guard-resolution.js (sibling mechanism at 2a=1.00, t=16.7: FINEH inert, hc rescues, q^2 W1PP binding)
 * @see imp-96845-krein-kmax5-frontier-measurement.js (grandparent: double-precision band; degree AND extended precision jointly)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// W1PP: rigorous constant bound of |w1-prime-prime| used by the verifier (verify4.py line 21).
export const IMP97075_W1PP = 32.802903963831554;

// Binding tail cell (imp-96868 worst design-condition residual location) and the true point value
// there, which stays comfortably positive throughout (the negative lower bounds are entirely guard).
export const IMP97075_TWO_A = 1.06;
export const IMP97075_TAIL_CELL = 37.878;
export const IMP97075_TRUE_POINT_F = 6.2003;

// COARSE-cell (hc) sweep at the tail cell m=37.878 (FINEH default): as hc shrinks the rigorous lower
// bound climbs monotonically from -3193.69 to +6.05, converging to the true point value +6.20.
// hc=2e-2 is the LP dx=0.02 grid. sigTaylorPen = -0.5 C2 d^2 (the binding penalty) falls as r^2.
export const IMP97075_HC_SWEEP = Object.freeze([
  { hc: 2.0e-2, flow: -3193.6870, sigTaylorPen: -3382.2142, rfDF: -14.6443, secondOrderRf: -0.1000, truePointF: 239.223, rf: 2.04e-5, nf: 489 },
  { hc: 1.0e-2, flow: -792.2678, sigTaylorPen: -841.6558, rfDF: -7.3073, secondOrderRf: -0.0995, truePointF: 65.740, rf: 2.04e-5, nf: 245 },
  { hc: 5.0e-3, flow: -193.4420, sigTaylorPen: -208.6510, rfDF: -3.6278, secondOrderRf: -0.0987, truePointF: 21.156, rf: 2.03e-5, nf: 123 },
  { hc: 2.0e-3, flow: -25.8946, sigTaylorPen: -32.5575, rfDF: -1.4399, secondOrderRf: -0.0995, truePointF: 8.553, rf: 2.04e-5, nf: 49 },
  { hc: 1.0e-3, flow: -1.9247, sigTaylorPen: -7.8166, rfDF: -0.6916, secondOrderRf: -0.0955, truePointF: 6.767, rf: 2.00e-5, nf: 25 },
  { hc: 5.0e-4, flow: +4.0929, sigTaylorPen: -1.8067, rfDF: -0.3197, secondOrderRf: -0.0883, truePointF: 6.331, rf: 1.92e-5, nf: 13 },
  { hc: 2.0e-4, flow: +5.7813, sigTaylorPen: -0.2171, rfDF: -0.1153, secondOrderRf: -0.0955, truePointF: 6.216, rf: 2.00e-5, nf: 5 },
  { hc: 1.0e-4, flow: +6.0540, sigTaylorPen: -0.0377, rfDF: -0.0400, secondOrderRf: -0.0663, truePointF: 6.203, rf: 1.67e-5, nf: 3 },
]);

// FINEH sweep at the tail cell m=37.878, hc FIXED at 2e-2 (LP dx grid): shrinking rf ~100x moves the
// rigorous lower bound only -3193.69 -> -3192.05 (0.05 percent); it SATURATES because the rf-order
// guard terms vanish while the FINEH-invariant coarse sigTaylorPen GROWS toward -3396.
export const IMP97075_FINEH_SWEEP = Object.freeze([
  { tolScale: 1e0, flow: -3193.6870, rf: 2.04e-5, nf: 489, sigTaylorPen: -3382.2142, rfDF: -14.6443, secondOrderRf: -0.1000 },
  { tolScale: 1e-1, flow: -3192.5391, rf: 6.46e-6, nf: 1547, sigTaylorPen: -3391.7008, rfDF: -4.6354, secondOrderRf: -0.0100 },
  { tolScale: 1e-2, flow: -3192.1926, rf: 2.04e-6, nf: 4890, sigTaylorPen: -3394.7011, rfDF: -1.4671, secondOrderRf: -0.0010 },
  { tolScale: 1e-3, flow: -3192.0846, rf: 6.47e-7, nf: 15463, sigTaylorPen: -3395.6507, rfDF: -0.4640, secondOrderRf: -0.0001 },
  { tolScale: 1e-4, flow: -3192.0506, rf: 2.05e-7, nf: 48898, sigTaylorPen: -3395.9510, rfDF: -0.1467, secondOrderRf: -0.0000 },
]);

// C2 = sup_cell |sigma_2-prime-prime| decomposition at the tail t=37.878 -- q^2 W1PP dominates
// (99.55 percent) and C2 is 26x the imp-96978 t=16.7 value (2.575e6) via the (t^2+1/4)^2 double factor.
export const IMP97075_C2_TAIL = Object.freeze({
  t: 37.878,
  curvatureTerm: 23722.8,      // (12 t^2 + 1) |w1|
  crossTerm: 278605.1,         // 8 t (t^2+1/4) |w1-prime|
  qSqW1ppTerm: 67547890.0,     // (t^2+1/4)^2 W1PP -- the binding term
  C2: 67850218.0,
  qSqW1ppFraction: 67547890.0 / 67850218.0, // ~0.9955
  c2RatioVsT16: 67850218.0 / 2575224.8,     // ~26.3x the imp-96978 t=16.7 C2
});

export const IMP97075_VERDICT = Object.freeze({
  ticket: 'imp-97075',
  question:
    'does the imp-96868 precision-invariant coarse-grid guard deficit at the kmax=5, 2a=1.06 tail (t*=37.878) MOVE once the guard grid (FINEH) is genuinely refined, and does the near-feasible band onset move past 1.07?',
  twoA: 1.06,
  tailCell: 37.878,
  // Finding 1: FINEH does not move the tail deficit -- bound saturates near -3192 over 100x refinement
  finehMovesDeficit: false,
  finehSaturationFlow: -3192.05,
  finehMovePercentOver100x: 0.05, // (-3193.69 -> -3192.05)
  bindingSlackIsCoarseSigmaTaylor: true,
  bandOnsetMovesPast107ByFineh: false,
  // Finding 2: coarse hc DOES rescue -- bound climbs to +6.05, converging to true point F=+6.20
  coarseHcRescues: true,
  hcThresholdForPositiveCell: 5.0e-4, // cell +4.09 at hc=5e-4
  convergesToTruePointF: IMP97075_TRUE_POINT_F,
  // Finding 3: binding term is q^2 W1PP, amplified 26x at the tail vs t=16.7
  bindingTermIsQsqW1pp: true,
  qSqW1ppFraction: IMP97075_C2_TAIL.qSqW1ppFraction,
  c2RatioVsT16: IMP97075_C2_TAIL.c2RatioVsT16,
  alternativeFix:
    'cell-local (interval) |w1-prime-prime| enclosure or third-order sigma Taylor enclosure shrinks C2 without shrinking hc (imp-96978 Finding 3)',
  // Verdict: neither extended precision (imp-96868) nor FINEH (here) moves the frontier; coarse-grid is
  deficitInvariantUnderPrecisionAndFineh: true,
  guardLeverIsCoarseGridNotFineh: true,
  refinesImp96868:
    'settles imp-96868 "guard resolution and degree remain co-binding" on the guard axis: of the two guard knobs, FINEH is inert (bound saturates over 100x refinement) and the COARSE grid is the mover -- the tail deficit is invariant under BOTH extended precision AND guard-grid refinement',
  // Honest residual + guardrails
  guardFormulationCaveat:
    'these are the verify4 SECOND-ORDER TAYLOR guard numbers, not the imp-96868 LP VIOLTOL guard (-0.2217); absolute magnitudes are guard-formulation-dependent, the FINEH-invariance/hc-rescue/q^2 W1PP mechanism is the shared finding',
  subGap:
    'IMP97075_COARSEGRID_LP_RESOLVE_NOT_RUN -- no extended-precision LP solver in-environment; a full [0,40] re-verification at hc<=5e-4 with a re-optimized multi-word LP was not run, so the direct extended-precision 2a* number past 1.07 is still not measured; this measures the guard decomposition on the fixed 2a=1.06 iterate at the single binding tail cell',
  intervalRigorousReachUnchanged: 0.96,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97075_VERDICT;

// --- self-executing assertions (imp-3715 convention; pure literals, import-light) ---
const IMP97075_ASSERTIONS = [
  {
    id: 'imp97075-fineh-does-not-move-tail-deficit',
    holds: () => {
      const first = IMP97075_FINEH_SWEEP[0];
      const last = IMP97075_FINEH_SWEEP[IMP97075_FINEH_SWEEP.length - 1];
      // rf shrinks ~100x but Flow stays deeply negative and barely moves (< 0.1% of magnitude)
      return (
        last.rf < first.rf / 50 &&
        last.flow < 0 &&
        Math.abs(last.flow - first.flow) < Math.abs(first.flow) * 1e-3 &&
        last.sigTaylorPen < first.sigTaylorPen && // coarse penalty GROWS as fine points near edges
        IMP97075_VERDICT.finehMovesDeficit === false &&
        IMP97075_VERDICT.bandOnsetMovesPast107ByFineh === false
      );
    },
    why: 'holding hc=2e-2 (LP dx grid) and shrinking rf ~100x, the rigorous lower bound moves only -3193.69 -> -3192.05 (0.05 percent) while the FINEH-invariant coarse sigma-Taylor penalty grows -- refining the guard grid does NOT move the tail guard deficit.',
  },
  {
    id: 'imp97075-coarse-hc-rescues-bound-climbs-to-true-pointf',
    holds: () => {
      const flows = IMP97075_HC_SWEEP.map((r) => r.flow);
      const monotone = flows.every((v, i) => i === 0 || v >= flows[i - 1] - 1e-6);
      const firstPositive = IMP97075_HC_SWEEP.find((r) => r.flow > 0);
      return (
        monotone &&
        flows[0] < 0 &&
        flows[flows.length - 1] > 0 &&
        Math.abs(flows[flows.length - 1] - IMP97075_TRUE_POINT_F) < 0.2 &&
        firstPositive.hc <= IMP97075_VERDICT.hcThresholdForPositiveCell + 1e-12 &&
        IMP97075_VERDICT.coarseHcRescues === true
      );
    },
    why: 'shrinking the coarse cell hc drives the rigorous lower bound monotonically from -3193.69 (hc=2e-2) to +6.05 (hc=1e-4), converging to the true point value +6.20; the cell is positive at hc<=5e-4.',
  },
  {
    id: 'imp97075-binding-term-is-qsq-w1pp-amplified-at-tail',
    holds: () =>
      IMP97075_C2_TAIL.qSqW1ppTerm > IMP97075_C2_TAIL.curvatureTerm &&
      IMP97075_C2_TAIL.qSqW1ppTerm > IMP97075_C2_TAIL.crossTerm &&
      IMP97075_C2_TAIL.qSqW1ppFraction > 0.99 &&
      IMP97075_C2_TAIL.c2RatioVsT16 > 10 &&
      IMP97075_VERDICT.bindingTermIsQsqW1pp === true,
    why: 'the C2=6.785e7 second-derivative bound at the tail t=37.878 is 99.55 percent q^2 W1PP and 26x the imp-96978 t=16.7 C2 -- the (t^2+1/4)^2 double factor amplifies the same binding term at the tail.',
  },
  {
    id: 'imp97075-deficit-invariant-under-precision-and-fineh-no-qed',
    holds: () =>
      IMP97075_TRUE_POINT_F > 0 &&
      IMP97075_HC_SWEEP[0].flow < 0 &&
      IMP97075_VERDICT.deficitInvariantUnderPrecisionAndFineh === true &&
      IMP97075_VERDICT.guardLeverIsCoarseGridNotFineh === true &&
      IMP97075_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97075_VERDICT.operatorPositivityProved === false &&
      typeof IMP97075_VERDICT.subGap === 'string' &&
      IMP97075_VERDICT.subGap.includes('IMP97075_COARSEGRID_LP_RESOLVE_NOT_RUN') &&
      IMP97075_VERDICT.qed === false,
    why: 'the true point value F stays +6.20 across the tail while the coarse lower bound is -3193.69; the deficit is invariant under both extended precision (imp-96868) and FINEH refinement (here), the guard lever is the coarse grid, the certified reach stays 2a<=0.96, and NO QED.',
  },
];

for (const a of IMP97075_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97075 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
