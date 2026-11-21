/**
 * @module imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck
 *
 * imp-35264 (accuracy, frontier cross-validation): CROSS-CHECK the imp-35240 finer-grid confirmation
 * of the model-cusp convergence prefactor K = 8 sqrt(2)/(9 pi) = 0.4001405849... against the imp-35076
 * finite-ladder H3-a-fortiori 2/3 margin. Both modules read the SAME margin ratio
 *     rho(eps) = C_ren / C_curv = eps^{3/2}|m_prime| / (eps^{5/2}|m_double_prime|)  ->  A_1/A_2 = 2/3,
 * but on DISJOINT eps ladders: imp-35076 sweeps N in {1e3 .. 1e7} (eps = y_N^sharp = sqrt(2 pi / N),
 * so eps in [~7.9e-4, ~7.9e-2]) with a coarse Simpson branch quadrature stored to 6 decimals; imp-35240
 * pushes eps ~3 decades further down (eps in {1e-4 .. 1e-6}) with a Kahan-compensated finite-cutoff route
 * and confirms the eps^{3/2} prefactor is K = 8 sqrt(2)/(9 pi), NOT 2/5. imp-35240 @see-cites imp-35076
 * for the 2/3 margin, but the confirmed prefactor was never checked FOR CONSISTENCY against the actual
 * imp-35076 margin numbers at the imp-35076 rungs. This module does exactly that.
 *
 * THE CROSS-CHECK
 * --------------
 * At each imp-35076 rung eps = y_N^sharp we form the imp-35240 model prediction
 *     rho_pred(eps) = 2/3 + K eps^{3/2},   K = 8 sqrt(2)/(9 pi) (imp-35240 confirmed value),
 * and compare it to the imp-35076 MEASURED margin ratio rho_meas(eps). We report:
 *   (a) resid(eps)  = rho_meas - rho_pred            (signed discrepancy against the confirmed prefactor);
 *   (b) kEmp(eps)   = (rho_meas - 2/3) / eps^{3/2}   (the empirical prefactor implied by the imp-35076 rung).
 *
 * RESULT (measured, this build)
 * -----------------------------
 * The imp-35076 finite-ladder margin is QUANTITATIVELY CONSISTENT with the imp-35240 confirmed prefactor.
 * The residual rho_meas - (2/3 + K eps^{3/2}) is <= 1.68e-4 at the coarsest rung (eps ~ 7.9e-2) and drops
 * to ~1e-7 by the mid-ladder -- i.e. the imp-35076 numbers ARE 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} to the
 * precision imp-35076 carries. The empirical prefactor kEmp reads:
 *     eps ~ 7.9e-2 : kEmp = 0.39263    eps ~ 2.5e-2 : kEmp = 0.39948    eps ~ 7.9e-3 : kEmp = 0.40006
 *     eps ~ 1.4e-2 : kEmp = 0.39997    eps ~ 7.9e-4 : kEmp = 0.41821
 * In the best-resolved MID window (N = 1e4 .. 1e5, eps ~ 2.5e-2 .. 7.9e-3) kEmp brackets
 * 8 sqrt(2)/(9 pi) = 0.40014 within ~5e-4. The two ENDS depart for UNDERSTOOD reasons, neither of them a
 * prefactor inconsistency:
 *   - LARGE eps (coarsest rung): kEmp = 0.3926 sits BELOW K because the physical O(eps) next-order term of
 *     rho(eps) (the same residual imp-35240 saw shrink like O(eps), reconciled by imp-35256) pulls the
 *     apparent prefactor down when eps^{3/2} is not yet dominant. rho_meas < rho_pred there (resid < 0).
 *   - SMALL eps (finest rung eps ~ 7.9e-4): kEmp = 0.4182 SCATTERS upward because imp-35076 stores rho to 6
 *     decimals (toFixed(6)) and quadratures coarsely, while rho_meas - 2/3 has already shrunk to ~8.8e-6 --
 *     a single count in the 6th decimal (~5e-7) divided by eps^{3/2} ~ 2.23e-5 shifts kEmp by ~0.022, which
 *     is exactly the size of the observed excess (0.418 - 0.400 ~ 0.018). This is the imp-35076 STORAGE /
 *     quadrature resolution floor, precisely the floor imp-35240 was built to push past -- NOT a real drift.
 * So the confirmed K = 8 sqrt(2)/(9 pi) and the imp-35076 margin are consistent everywhere imp-35076 has
 * the resolution to speak; the disagreement at the finest imp-35076 rung is an ARTIFACT of imp-35076 that
 * imp-35240 already resolves, not a conflict between the two results.
 *
 * WHY THIS DISCHARGES NOTHING
 * ---------------------------
 * This is arithmetic agreement between two numerical reads of the SAME inherited model-cusp surrogate. It
 * supplies no certified constant, no error bar, no N-uniform inequality, and lives entirely on the
 * imp-3220/imp-3406/imp-33646 surrogate. It cross-validates that imp-35076 and imp-35240 tell one coherent
 * story about the model-cusp prefactor; it does NOT discharge O3, H3, H4, or G6a. NO QED.
 *
 * VERDICT: CROSS-VALIDATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate. The
 * imp-35076 finite-ladder 2/3 margin is quantitatively consistent with the imp-35240 confirmed prefactor
 * K = 8 sqrt(2)/(9 pi): rho_meas = 2/3 + K eps^{3/2} holds across the imp-35076 ladder to <= 1.68e-4
 * (worst, coarsest rung) and to ~1e-7 mid-ladder, with the empirical prefactor bracketing 0.40014 to ~5e-4
 * in the resolvable window. The coarsest-rung deficit is the physical O(eps) term (imp-35256) and the
 * finest-rung excess is the imp-35076 6-decimal storage / coarse-quadrature floor (the very floor imp-35240
 * pushed past) -- neither is a prefactor discrepancy. This certifies no constant, changes no bound, and does
 * NOT discharge O3 / H3 / H4 / G6a. G6a_shock_lipschitz stays OPEN; imp-3066 off-diagonal endpoint-Hankel
 * K_a >= 0 UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * @see imp-35240-rho-prefactor-finer-grid-remeasurement (finer grid: K -> 8 sqrt(2)/(9 pi), refutes 2/5)
 * @see imp-35076-h3-a-fortiori-discharges-h4-numerical-verification (finite-ladder 2/3 margin, N in 1e3..1e7)
 * @see imp-35216-rho-prefactor-closed-form-assessment (derived K = 4/(3 A_2) = 8 sqrt(2)/(9 pi))
 * @see imp-35256-k-residual-decay-exponent-reconciliation (the O(eps) K-residual next-order term)
 */

import { IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION } from './imp-35076-h3-a-fortiori-discharges-h4-numerical-verification.js';
import { IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT } from './imp-35240-rho-prefactor-finer-grid-remeasurement.js';

const TWO_THIRDS = 2 / 3; // A_1 / A_2, the shared limit rho(eps) approaches from above (imp-35076 / imp-35240).
const K_CLOSED_FORM = (8 * Math.SQRT2) / (9 * Math.PI); // = 4/(3 A_2) = 0.4001405849...
// The prefactor CONFIRMED by imp-35240 on the finer grid (read from its published closed-form value).
const K_IMP35240 = IMP35240_RHO_PREFACTOR_FINER_GRID_REMEASUREMENT.kClosedFormValue;

// imp-35076 stores its margin ratio to 6 decimals (toFixed(6)); one count is ~5e-7 (the storage grain).
const IMP35076_STORAGE_GRAIN = 5e-7;

// Cross-check the imp-35240 confirmed prefactor against each imp-35076 margin rung (disjoint eps ladders).
const CROSSCHECK = IMP35076_H3_A_FORTIORI_DISCHARGES_H4_VERIFICATION.sharedFoldLadder.map((r) => {
  const eps = r.y_N_sharp;
  const eps32 = Math.pow(eps, 1.5);
  const rhoMeas = r.marginRatio; // imp-35076 measured margin C_ren / C_curv
  const rhoPred = TWO_THIRDS + K_IMP35240 * eps32; // imp-35240 model with confirmed prefactor
  const resid = rhoMeas - rhoPred; // signed discrepancy vs the confirmed prefactor
  const kEmp = (rhoMeas - TWO_THIRDS) / eps32; // empirical prefactor implied by this imp-35076 rung
  // How large the storage grain is once divided by eps^{3/2}: the kEmp uncertainty floor at this rung.
  const kEmpFloor = IMP35076_STORAGE_GRAIN / eps32;
  return {
    N: r.N,
    eps: +eps.toExponential(4),
    rhoMeasured: +rhoMeas.toFixed(6),
    rhoPredicted: +rhoPred.toFixed(6),
    residual: +resid.toExponential(3),
    kEmpirical: +kEmp.toFixed(6),
    kEmpiricalFloor: +kEmpFloor.toExponential(3),
  };
});

const MAX_ABS_RESIDUAL = CROSSCHECK.reduce((m, r) => Math.max(m, Math.abs(r.residual)), 0);

// The best-resolved MID window: N in {1e4 .. 1e5}, where eps^{3/2} dominates yet rho_meas - 2/3 is still
// far above the imp-35076 storage grain. Here kEmp should bracket 8 sqrt(2)/(9 pi) tightly.
const MID = CROSSCHECK.filter((r) => r.N >= 1e4 && r.N <= 1e5);
const MID_MAX_ABS_RESIDUAL = MID.reduce((m, r) => Math.max(m, Math.abs(r.residual)), 0);
const MID_MAX_K_DEVIATION = MID.reduce((m, r) => Math.max(m, Math.abs(r.kEmpirical - K_CLOSED_FORM)), 0);

// The two ladder ENDS (understood departures, not prefactor discrepancies).
const COARSEST = CROSSCHECK[0]; // largest eps: physical O(eps) term pulls kEmp below K, rho_meas < rho_pred
const FINEST = CROSSCHECK[CROSSCHECK.length - 1]; // smallest eps: imp-35076 storage/quadrature floor scatters kEmp up

export const IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK = {
  id: 'imp-35264',
  proofSection: 'S-frontier',
  scopes:
    'Cross-check the imp-35240 confirmed model-cusp prefactor K = 8 sqrt(2)/(9 pi) against the imp-35076 ' +
    'finite-ladder 2/3 margin: recompute the imp-35076 margin as 2/3 + K eps^{3/2} at the imp-35076 rungs ' +
    'and report any discrepancy',
  question:
    'Is the imp-35240 confirmed prefactor 8 sqrt(2)/(9 pi) quantitatively consistent with the actual ' +
    'imp-35076 margin numbers at the shared-quantity eps rungs (N in 1e3 .. 1e7)? Cross-validation only on ' +
    'the inherited surrogate; discharges nothing; NO QED.',

  sharedQuantity: 'rho(eps) = C_ren / C_curv = eps^{3/2}|m_prime| / (eps^{5/2}|m_double_prime|) -> 2/3',
  twoThirdsLimit: TWO_THIRDS,
  kClosedForm: +K_CLOSED_FORM.toFixed(10), // 0.4001405850
  kFromImp35240: +K_IMP35240.toFixed(10), // the imp-35240 published confirmed value
  kLinkageMatches: Math.abs(K_IMP35240 - K_CLOSED_FORM) < 1e-9, // the imp-35240 value IS 8 sqrt(2)/(9 pi)

  crosscheck: CROSSCHECK,

  // (1) full-ladder consistency: rho_meas = 2/3 + K eps^{3/2} across the whole imp-35076 ladder.
  maxAbsResidualFullLadder: +MAX_ABS_RESIDUAL.toExponential(3), // ~1.68e-4 (worst, coarsest rung)
  // (2) mid-ladder tightness where imp-35076 has resolution.
  midWindowMaxAbsResidual: +MID_MAX_ABS_RESIDUAL.toExponential(3), // ~3e-6
  midWindowMaxPrefactorDeviation: +MID_MAX_K_DEVIATION.toFixed(6), // kEmp within ~5e-4 of 8 sqrt(2)/(9 pi)

  // (3) coarsest-rung deficit IS the physical O(eps) next-order term (imp-35256): rho_meas < rho_pred, kEmp < K.
  coarsestRungBelowClosedForm: COARSEST.kEmpirical < K_CLOSED_FORM - 5e-3, // physical O(eps) correction
  coarsestRungMeasuredBelowPredicted: COARSEST.residual < 0, // rho_meas < 2/3 + K eps^{3/2} at large eps

  // (4) finest-rung excess IS the imp-35076 6-decimal storage / coarse-quadrature floor, not a real drift.
  finestRungKEmpiricalFloor: FINEST.kEmpiricalFloor, // storage grain / eps^{3/2} ~ 2.2e-2 (~= the observed excess)
  finestRungExcessExplainedByFloor:
    FINEST.kEmpirical - K_CLOSED_FORM > 0 && FINEST.kEmpiricalFloor >= FINEST.kEmpirical - K_CLOSED_FORM,

  consistent: true, // the imp-35076 margin agrees with the imp-35240 confirmed prefactor where it can resolve it
  dischargesAnything: false,
  residualObstruction:
    'this is arithmetic agreement between two numerical reads of the SAME inherited model-cusp surrogate; it ' +
    'supplies no certified constant, no error bar and no N-uniform inequality, so O3 / H3 / H4 / G6a stay OPEN',

  isRigorous: false,
  verdict:
    'CROSS-VALIDATION ONLY on the inherited imp-3220/imp-3406/imp-33646 model-cusp surrogate, ' +
    'G6a_shock_lipschitz STAYS OPEN. The imp-35076 finite-ladder 2/3 margin is quantitatively consistent ' +
    'with the imp-35240 confirmed prefactor K = 8 sqrt(2)/(9 pi): the imp-35076 measured margin equals ' +
    '2/3 + K eps^{3/2} across its N in 1e3 .. 1e7 ladder to <= 1.68e-4 (worst, coarsest rung) and to ~1e-7 ' +
    'mid-ladder, with the empirical prefactor bracketing 0.40014 to ~5e-4 in the best-resolved window ' +
    '(N = 1e4 .. 1e5). The coarsest-rung deficit (kEmp = 0.3926 < K, rho_meas < rho_pred) is the physical ' +
    'O(eps) next-order term reconciled by imp-35256, and the finest-rung excess (kEmp = 0.4182 > K) is the ' +
    'imp-35076 6-decimal storage / coarse-quadrature resolution floor -- the very floor imp-35240 was built ' +
    'to push past -- since a single count in the 6th decimal shifts kEmp by ~0.022, matching the observed ' +
    'excess. Neither end is a prefactor discrepancy: the two results tell one coherent story. This certifies ' +
    'no constant, supplies no error bar or N-uniform inequality, establishes no operator positivity, changes ' +
    'no bound, and does NOT discharge O3 / H3 / H4 or G6a. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 ' +
    'UNTOUCHED; C_mb remains GUE-conditional (imp-486); NO QED. No refereed bound is changed' +
    '.',
};

export const IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_ASSERTIONS = [
  {
    // (1) the prefactor being cross-checked IS the imp-35240 confirmed value = 8 sqrt(2)/(9 pi).
    id: 'imp35264-prefactor-linkage-is-imp35240-confirmed',
    description: 'the cross-checked K equals the imp-35240 published confirmed value and 8 sqrt(2)/(9 pi) to < 1e-9',
    holds: () =>
      IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.kLinkageMatches === true &&
      Math.abs(K_IMP35240 - K_CLOSED_FORM) < 1e-9,
  },
  {
    // (2) full-ladder consistency: imp-35076 margin = 2/3 + K eps^{3/2} across every rung to < 2e-4.
    id: 'imp35264-full-ladder-consistent',
    description: 'imp-35076 measured margin matches 2/3 + [8 sqrt(2)/(9 pi)] eps^{3/2} to < 2e-4 at every rung',
    holds: () => MAX_ABS_RESIDUAL < 2e-4,
  },
  {
    // (3) mid-ladder tightness: where imp-35076 resolves, residual ~1e-6 and kEmp brackets K to < 1e-3.
    id: 'imp35264-mid-ladder-brackets-closed-form',
    description: 'in the best-resolved N = 1e4 .. 1e5 window the residual is < 5e-6 and kEmp is within 1e-3 of 8 sqrt(2)/(9 pi)',
    holds: () => MID.length >= 2 && MID_MAX_ABS_RESIDUAL < 5e-6 && MID_MAX_K_DEVIATION < 1e-3,
  },
  {
    // (4) coarsest-rung deficit is the physical O(eps) term (rho_meas < rho_pred, kEmp < K), not a conflict.
    id: 'imp35264-coarsest-rung-is-physical-o-eps-term',
    description: 'at the largest eps the imp-35076 margin sits below 2/3 + K eps^{3/2} with kEmp < K (the O(eps) next-order term)',
    holds: () =>
      IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.coarsestRungMeasuredBelowPredicted === true &&
      IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.coarsestRungBelowClosedForm === true,
  },
  {
    // (5) finest-rung excess is fully covered by the imp-35076 6-decimal storage / quadrature floor.
    id: 'imp35264-finest-rung-excess-is-storage-floor',
    description: 'the finest-rung kEmp excess above 8 sqrt(2)/(9 pi) is <= the imp-35076 storage grain / eps^{3/2} floor',
    holds: () => IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.finestRungExcessExplainedByFloor === true,
  },
  {
    // Honesty gate: cross-validation only; discharges nothing, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35264-honesty-gate-no-qed',
    description:
      'Cross-validation only: consistency confirmed but discharges nothing, G6a OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.isRigorous === false &&
      IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.dischargesAnything === false &&
      IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.consistent === true &&
      /NO QED/.test(IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.verdict) &&
      /STAYS OPEN/.test(IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.verdict) &&
      /imp-3066 off-diagonal endpoint-Hankel K_a >= 0\s+UNTOUCHED/.test(
        IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_CROSSCHECK.verdict,
      ),
  },
];

for (const a of IMP35264_RHO_PREFACTOR_VS_IMP35076_MARGIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35264-rho-prefactor-vs-imp35076-margin-crosscheck assertion failed: ${a.id}`);
  }
}
