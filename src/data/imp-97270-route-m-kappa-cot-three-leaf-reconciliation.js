/**
 * @module imp-97270-route-m-kappa-cot-three-leaf-reconciliation
 *
 * imp-97270 (accuracy, CROSS-VALIDATION): reconcile the single MEASURED positive coefficient in the
 * Route M first-moment decomposition -- the operative cotangent coefficient kappa_cot ~ +0.12 that
 * the imp-97210 obligation ledger records -- against the two leaves it is built from but never checked
 * against jointly: the imp-97226 signed varying-modulus half S(b)/(phi(b) b) -> ~-0.0795 and the
 * imp-97119 PROVED boundary asymptotic V(1,b) = o(phi(b) b). Cross-validation only; kappa_cot stays
 * MEASURED; no bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE IDENTITY BEING CHECKED (imp-97097 isolation; imp-97210 ledger row).
 * -------------------------------------------------------------------------------
 * The cotangent part of the first moment is F_cot = -(pi/2) Phi(b) with
 *     Phi(b) = -V(1,b) + S(b),   S(b) = Sum_{a=2,(a,b)=1}^{b-1} V(b,a),
 * V(1,b) the boundary term and S(b) the operative varying-modulus half. The ledger records the
 * coefficient as
 *     kappa_cot = -(pi/2) lim_{b->oo} Phi(b) / (phi(b) b)   ~ +0.12   (MEASURED).
 * Dividing Phi by phi(b) b and taking the limit splits the coefficient into a boundary leg and a
 * varying-modulus leg:
 *     kappa_cot = -(pi/2) [ lim (-V(1,b)/(phi(b) b))  +  lim (S(b)/(phi(b) b)) ].
 * The two legs are exactly the objects the two sibling leaves already settled:
 *   - BOUNDARY LEG (imp-97119, PROVED): V(1,b) = -(b/pi)(log(b/(2pi)) + gamma) - 1/pi + O(1/b) = O(b log b),
 *     and by Landau's totient lower bound V(1,b) = o(phi(b) b), so lim (-V(1,b)/(phi(b) b)) = 0. The
 *     boundary contributes NOTHING to the leading coefficient.
 *   - VARYING-MODULUS LEG (imp-97226, MEASURED): S(b)/(phi(b) b) is flat and negative, converging to
 *     ~-0.0795 (monotone in magnitude, -0.0728 at b=101 -> -0.079513 at b=24001), so
 *     lim (S(b)/(phi(b) b)) = c_s_signed ~ -0.0795.
 *
 * -------------------------------------------------------------------------------
 * THE RECONCILIATION (arithmetic only; no new measurement).
 * -------------------------------------------------------------------------------
 * Feeding the two settled legs into the identity:
 *     kappa_cot(reconstructed) = -(pi/2) [ 0 + (-0.079513) ] = (pi/2) * 0.079513 = +0.124899.
 * Three independent handles on the SAME coefficient now agree:
 *     kappa_cot (reconstructed from the two legs)   = +0.124899   [this leaf]
 *     kappa_cot (implied by measured total - arith) = 0.696 - 0.5704960511 = +0.125504   [imp-97210]
 *     kappa_cot (ledger stored 2-sig-fig constant)  = +0.12                               [imp-97210]
 * The reconstructed value agrees with the total-minus-arith implied value to
 *     |0.124899 - 0.125504| = 6.05e-4  (~0.48%),
 * and both round to the ledger's ~+0.12. Equivalently, reassembling the whole first-moment constant
 * from the two settled legs plus the exact arithmetic coefficient gives
 *     kappa(reconstructed) = kappa_arith + kappa_cot = 0.5704960511 + 0.124899 = 0.695395,
 * matching the measured total kappa ~ 0.696 to 6.05e-4 (~0.09%).
 *
 * -------------------------------------------------------------------------------
 * WHAT THIS SETTLES / WHAT STAYS OPEN.
 * -------------------------------------------------------------------------------
 * SETTLES (cross-validation): the single MEASURED positive coefficient kappa_cot ~ +0.12 is INTERNALLY
 * CONSISTENT across the three leaves. It is not an independent floating fit -- it is (pi/2) times the
 * imp-97226 measured signed half, with the imp-97119 PROVED boundary leg vanishing exactly, and it
 * closes the measured total to <1e-3. The sign is forced too: S/(phi b b) < 0 and the leading -(pi/2)
 * flip make kappa_cot > 0, so the cotangent part ADDS to (does not subtract from) kappa_arith.
 * STAYS OPEN: kappa_cot stays MEASURED. The varying-modulus leg S(b)/(phi(b) b) -> -0.0795 is a
 * measurement of a non-elementary Bettin-Conrey period-function mean value (imp-97226/imp-97204
 * obstruction); this leaf certifies NEITHER its limit nor its sign rigorously. The residual ~6e-4 is
 * the finite-b truncation of the signed leg at b=24001 (the ratio is still creeping toward its
 * asymptote), NOT a certified error bar. The positivity of the whole kappa still rests on the single
 * open scalar c_1 (equivalently M2w < 0.32546) named by imp-97210. No bound on Lambda moves.
 * No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97210-route-m-kappa-obligation-ledger.js (the ledger recording kappa_cot ~ +0.12 MEASURED)
 * @see imp-97226-route-m-cotangent-cancellation-ratio-ladder.js (signed half S/(phi b b) -> -0.0795)
 * @see imp-97119-route-m-boundary-cotangent-asymptotic.js (boundary V(1,b) = o(phi b b), PROVED)
 * @see imp-97097-route-m-cotangent-first-moment-reciprocity.js (isolation Phi = -V(1,b) + S(b))
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97270 (accuracy, opus-4-8, api-pool). Cross-validation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// -- inputs pulled verbatim from the three leaves (no recomputation) --
const KAPPA_ARITH = 0.5704960511308594; // imp-97096, EXACT = (3/2)C - 3/8
const S_SIGNED_LIMIT = -0.079513; // imp-97226 measured S(b)/(phi b b) at b=24001 (converged)
const BOUNDARY_LEG_LIMIT = 0; // imp-97119 PROVED: -V(1,b)/(phi b b) -> 0 (V = o(phi b b))
const KAPPA_TOTAL_MEASURED = 0.696; // imp-97155/97210 measured total
const KAPPA_COT_LEDGER = 0.12; // imp-97210 stored 2-sig-fig constant

// -- the reconciliation (arithmetic only) --
const PHI_LEG_LIMIT = BOUNDARY_LEG_LIMIT + S_SIGNED_LIMIT; // lim Phi(b)/(phi b b) = -0.079513
const KAPPA_COT_RECONSTRUCTED = -(Math.PI / 2) * PHI_LEG_LIMIT; // -(pi/2) * (-0.079513) = +0.124899
const KAPPA_COT_IMPLIED = KAPPA_TOTAL_MEASURED - KAPPA_ARITH; // 0.125504 (total - arith)
const RESID_RECON_VS_IMPLIED = Math.abs(KAPPA_COT_RECONSTRUCTED - KAPPA_COT_IMPLIED); // ~6.05e-4
const KAPPA_RECONSTRUCTED_TOTAL = KAPPA_ARITH + KAPPA_COT_RECONSTRUCTED; // 0.695395
const RESID_TOTAL = Math.abs(KAPPA_RECONSTRUCTED_TOTAL - KAPPA_TOTAL_MEASURED); // ~6.05e-4

export const IMP97270_RECONCILIATION = Object.freeze({
  id: 'imp-97270',
  proofSection: 'S-frontier',
  // the identity legs
  boundaryLegLimit: BOUNDARY_LEG_LIMIT, // 0 (imp-97119 PROVED)
  signedHalfLimit: S_SIGNED_LIMIT, // -0.079513 (imp-97226 MEASURED)
  phiLegLimit: PHI_LEG_LIMIT, // -0.079513
  // the three handles on kappa_cot
  kappaCotReconstructed: KAPPA_COT_RECONSTRUCTED, // +0.124899 (this leaf)
  kappaCotImplied: KAPPA_COT_IMPLIED, // +0.125504 (imp-97210 total - arith)
  kappaCotLedger: KAPPA_COT_LEDGER, // +0.12 (imp-97210 stored)
  // residuals
  residReconVsImplied: RESID_RECON_VS_IMPLIED, // ~6.05e-4 (~0.48%)
  kappaReconstructedTotal: KAPPA_RECONSTRUCTED_TOTAL, // 0.695395
  residTotalVsMeasured: RESID_TOTAL, // ~6.05e-4 (~0.09%)
  // status
  kappaCotStatus: 'MEASURED', // unchanged; this leaf does not certify the signed leg
  anyBoundMoved: false,
  qed: false,
});

export const IMP97270_VERDICT = Object.freeze({
  question:
    'is the single MEASURED positive coefficient kappa_cot ~ +0.12 in the imp-97210 obligation ledger ' +
    'internally consistent with the imp-97226 signed half S/(phi b b) -> -0.0795 and the imp-97119 ' +
    'PROVED boundary V(1,b) = o(phi b b), via kappa_cot = -(pi/2) lim Phi/(phi b b)?',
  consistent: true,
  boundaryLegVanishes: true, // imp-97119: -V/(phi b b) -> 0 exactly, contributes nothing
  signVerified: true, // S < 0 and the -(pi/2) flip force kappa_cot > 0 (adds to kappa_arith)
  residualSizedTruncation: true, // ~6e-4 residual = finite-b (b=24001) truncation of the signed leg
  kappaCotStaysMeasured: true,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The three leaves RECONCILE. Feeding the imp-97119 PROVED boundary leg (-V(1,b)/(phi b b) -> 0) ' +
    'and the imp-97226 measured signed half (S(b)/(phi b b) -> -0.079513) into the imp-97097 identity ' +
    'kappa_cot = -(pi/2) lim Phi/(phi b b) reconstructs kappa_cot = (pi/2)*0.079513 = +0.124899, which ' +
    'agrees with the total-minus-arith implied +0.125504 to 6.05e-4 (~0.48%) and rounds to the ledger ' +
    'stored ~+0.12; reassembling the full constant kappa_arith + kappa_cot = 0.695395 closes the ' +
    'measured total 0.696 to 6.05e-4 (~0.09%). So the single MEASURED positive coefficient is not a ' +
    'floating fit -- it is exactly (pi/2) times the measured signed half with the proved boundary leg ' +
    'vanishing, and its positive sign is forced by S < 0. kappa_cot stays MEASURED (the signed leg is ' +
    'a non-elementary Bettin-Conrey mean value, not certified); the ~6e-4 residual is the finite-b ' +
    'truncation of the signed leg at b=24001, not a certified error bar; the positivity of the whole ' +
    'kappa still rests on the single open scalar c_1 (M2w < 0.32546). No bound on Lambda moves. ' +
    'No refereed bound is changed; RH open; NO QED.',
});

export const IMP97270_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation only: the operative cotangent ' +
  'coefficient kappa_cot ~ +0.12 (imp-97210 ledger, MEASURED) reconstructs as -(pi/2) lim Phi/(phi b b) ' +
  '= (pi/2)*0.079513 = +0.124899 from the imp-97226 signed half (-0.079513) plus the imp-97119 PROVED ' +
  'vanishing boundary leg; it agrees with the total-minus-arith +0.125504 to 6.05e-4 and closes the ' +
  'measured total 0.696 to 6.05e-4. kappa_cot stays MEASURED; the residual is finite-b truncation, not ' +
  'a certified bar; the whole positivity still rests on the single open scalar M2w < 0.32546. No bound ' +
  'on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97270_ASSERTIONS = [
  {
    id: 'imp97270-reconstruction-matches-signed-half-times-half-pi',
    holds: () =>
      Math.abs(KAPPA_COT_RECONSTRUCTED - (Math.PI / 2) * 0.079513) < 1e-12 &&
      KAPPA_COT_RECONSTRUCTED > 0, // sign forced by S < 0
    why: 'kappa_cot = -(pi/2)(0 + S/(phi b b)) = (pi/2)*0.079513, positive because the signed half is negative.',
  },
  {
    id: 'imp97270-reconstruction-agrees-with-total-minus-arith',
    holds: () => RESID_RECON_VS_IMPLIED < 1e-3, // reconstructed vs (0.696 - kappa_arith)
    why: 'the reconstructed kappa_cot agrees with the total-minus-arith implied value to <1e-3 (~0.48%).',
  },
  {
    id: 'imp97270-reassembled-total-closes-measured-kappa',
    holds: () => RESID_TOTAL < 1e-3 && Math.abs(KAPPA_RECONSTRUCTED_TOTAL - 0.696) < 1e-3,
    why: 'kappa_arith + reconstructed kappa_cot closes the measured total kappa ~ 0.696 to <1e-3.',
  },
  {
    id: 'imp97270-both-reconstructions-round-to-ledger',
    holds: () =>
      Math.abs(KAPPA_COT_RECONSTRUCTED - KAPPA_COT_LEDGER) < 0.01 &&
      Math.abs(KAPPA_COT_IMPLIED - KAPPA_COT_LEDGER) < 0.01,
    why: 'both the reconstructed and the total-implied kappa_cot round to the ledger stored ~+0.12 (2 sig figs).',
  },
  {
    id: 'imp97270-honesty-gate-no-qed',
    holds: () =>
      IMP97270_VERDICT.consistent === true &&
      IMP97270_VERDICT.kappaCotStaysMeasured === true &&
      IMP97270_RECONCILIATION.kappaCotStatus === 'MEASURED' &&
      IMP97270_VERDICT.anyBoundMoved === false &&
      IMP97270_VERDICT.qed === false &&
      /NO QED/.test(IMP97270_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97270_HONEST_BANNER) &&
      /RH open/.test(IMP97270_HONEST_BANNER),
    why: 'cross-validation only: kappa_cot stays MEASURED, no bound moved, honesty markers present.',
  },
];

for (const a of IMP97270_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97270-route-m-kappa-cot-three-leaf-reconciliation assertion failed: ${a.id}`,
    );
  }
}

export default {
  reconciliation: IMP97270_RECONCILIATION,
  verdict: IMP97270_VERDICT,
  banner: IMP97270_HONEST_BANNER,
};
