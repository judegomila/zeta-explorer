/**
 * @module imp-97162-krein-temple-defect-eta2-measurement
 * @fileoverview imp-97162 -- MEASUREMENT of imp-97136 INGREDIENT 1: the tail-inclusive Temple residual
 *   defect eta2 = ||T_a[sigma_2] psi - mu psi||^2 = <psi, A^2 psi> - mu^2 for the committed Ritz
 *   eigenvector psi at 2a=ln3, and the spectral separation beta <= lambda_2 that a positive Temple
 *   bound mu - eta2/(beta - mu) would require to exceed 0.5 (a positive uniform-N floor).
 *
 *   imp-97136 flagged eta2 as NOT committed anywhere and only heuristically available, so the Temple
 *   bound mu - eta2/(beta - mu) could not be evaluated. This leaf commits the measurement. It reuses the
 *   imp-96875 pole-free Gegenbauer-Galerkin build (orthonormal L^2 basis => Gram B = scaleB*I, exactly
 *   diagonal, so the condB ~ 1e13 Legendre-Gram wall never appears and N=100 is reached without extended
 *   precision). psi is the smallest-Ritz-value eigenvector; because an exact finite-matrix eigenvector has
 *   zero IN-space residual, the Temple defect is the OUT-OF-SPACE residual: eta2 = ||A_tail v||^2 / scaleB^2
 *   for the B-normalised g = psi/sqrt(<psi,psi>_B), with A_tail the rows [N,Nbig) of the operator applied
 *   to the padded eigenvector. The sigma_2 t-integral is carried to T=800 (the committed cutoff).
 *
 *   Measurement only. mu stays an UPPER bound and is drifting (imp-97121); no lower-bound certificate;
 *   no bound moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * FINDING 1 -- mu CONFIRMS THE COMMITTED FLOOR. The smallest Ritz value in the orthonormal Gegenbauer basis
 *   at N=100, T=800 is mu = 0.53384576, matching the committed Legendre N=100 T=800 floor mu ~ 0.533852
 *   (imp-96772) to ~1e-5 (different well-conditioned basis, same operator). So the measured psi IS the
 *   committed Ritz eigenvector, and mu > 0.5 (the eventual target floor) as expected.
 *
 * FINDING 2 -- eta2 IS ASTRONOMICALLY LARGE AND DOES NOT CONVERGE WITHIN REACH. Applying the true operator
 *   T_a[sigma_2] to the polynomial Ritz eigenvector produces eta2 ~ 2.42e9 (eta ~ 4.9e4) at Nbig=300, and
 *   the value GROWS monotonically with the evaluation space along Nbig = 120,140,160,180,220,260,300:
 *   5.84e8 -> 1.18e9 -> 1.61e9 -> 1.81e9 -> 2.13e9 -> 2.30e9 -> 2.42e9 (increments decay slowly, no finite
 *   limit reached in the accessible range). The mechanism is structural: T_a[sigma_2] is UNBOUNDED (it
 *   multiplies by the prefactor (t^2+1/4)^2 ~ t^4, which the committed sigma_2 t-integral carries to
 *   T=800), so a fixed polynomial trial vector is at best MARGINALLY in dom(A) and its image T psi has heavy
 *   high-frequency tails; the residual ||T psi - mu psi|| is therefore huge and (near-)non-convergent. This
 *   is a SECOND obstruction beyond imp-97136 INGREDIENT 2 (the missing beta): even INGREDIENT 1, once
 *   actually computed with the t-tail included, is not merely uncommitted but quantitatively catastrophic --
 *   eta2 exceeds mu by ~10 orders of magnitude.
 *
 * FINDING 3 -- THE REQUIRED beta IS ~1e10, FAR BEYOND ANY ADMISSIBLE lambda_2. Temple certifies
 *   mu - eta2/(beta - mu) >= tau iff beta >= mu + eta2/(mu - tau) (needs mu > tau). With mu = 0.53384576 and
 *   eta2 = 2.42e9: reaching mere positivity (tau=0) needs beta >= 4.54e9; reaching the target uniform-N floor
 *   (tau=0.5) needs beta >= 7.16e10. But beta must be a LOWER bound on lambda_2, and the (illegitimate,
 *   wrong-direction) Ritz UPPER estimate of lambda_2 is only O(1) -- it drifts through ~67,55,41,3 and even
 *   goes spuriously negative as Nbig grows. No admissible beta <= lambda_2 can be ~1e10, so the Temple bound
 *   is not merely uncertain (imp-97136) but manifestly UNREACHABLE for this eigenvector: every hypothetical
 *   beta = mu*(1+f), f in {0.05,...,2.0}, yields a Temple floor of ~ -1.7e9 to -6.8e10 (all strongly negative).
 *
 * VERDICT. INGREDIENT 1 of route (A) is now measured, not merely flagged: eta2 ~ 2.42e9 (and rising with the
 *   evaluation space) for the committed Ritz eigenvector at 2a=ln3, T=800. This CONFIRMS and SHARPENS the
 *   imp-97136 infeasibility verdict -- the polynomial Ritz eigenvector is (at best marginally) in dom(A) of the
 *   unbounded operator, so its Temple residual defect is ~10 orders of magnitude larger than mu, and the beta
 *   the Temple bound would need to exceed 0.5 (~7.2e10) is astronomically beyond any admissible lambda_2 (O(1)).
 *   Route (A) is doubly obstructed: INGREDIENT 2 (a-priori beta <= lambda_2) does not exist, and INGREDIENT 1
 *   (a finite, small eta2) fails for the only trial vectors in hand. SUB-GAP IMP97162_TEMPLE_DEFECT_ETA2_HUGE.
 *   Measurement only; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (INGREDIENT 1 flagged uncommitted; this leaf commits it)
 * @see imp-96875-katotemple-scout.py (Gegenbauer out-of-space residual build reused here)
 * @see imp-96772-krein-lammin-double-double-recompute.js (committed Legendre floor mu ~ 0.533852 @ N=100, T=800)
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (Finding 3: compression defect descends without a rate)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97162_RIGOROUS_REACH_2A = 0.96;
export const IMP97162_BINDING_2A = LN3;

// Measured Temple quotient for the committed Ritz eigenvector (Gegenbauer orthonormal build, N=100, T=800,
// 2a=ln3; eta2 taken at the largest evaluation space Nbig=300). All values from tmp/imp-97162-eta2-temple-defect.py.
export const IMP97162_MEASURED = Object.freeze({
  N_trial: 100,
  Nbig_best: 300,
  T: 800,                          // committed sigma_2 t-integral cutoff
  mu: 0.5338457645363593,          // smallest Ritz value = Rayleigh floor (UPPER bound on lambda_1)
  eta2: 2424503980.717981,         // ||T psi - mu psi||^2 for the B-normalised eigenvector
  eta: 49239.25243865894,          // sqrt(eta2)
  committedLegendreFloor: 0.533852, // imp-96772 Legendre N=100 T=800 floor (matches mu to ~1e-5)
  muIsUpperBoundOnly: true,        // Ritz value >= lambda_1 always
  muStillDrifting: true,           // imp-97121: descends with the trial/evaluation space
});

// eta2 as the evaluation space Nbig grows (T-tail carried to T=800; grows monotonically, no finite limit
// reached in the accessible range -- consistent with the polynomial eigenvector being at best marginally in dom(A)).
export const IMP97162_ETA2_LADDER = Object.freeze([
  Object.freeze({ Nbig: 120, eta2: 583728031.4 }),
  Object.freeze({ Nbig: 140, eta2: 1176191504.2 }),
  Object.freeze({ Nbig: 160, eta2: 1606799704.8 }),
  Object.freeze({ Nbig: 180, eta2: 1811504408.1 }),
  Object.freeze({ Nbig: 220, eta2: 2126517948.0 }),
  Object.freeze({ Nbig: 260, eta2: 2304102807.7 }),
  Object.freeze({ Nbig: 300, eta2: 2424503980.7 }),
]);

// --- Temple lower bound and the required-separation inversion ---

// Temple lower bound on lambda_1 given (mu, eta2) and a LOWER bound beta on lambda_2. Valid only when beta > mu.
export function templeLowerBound(mu, eta2, beta) {
  if (!(beta > mu)) return null;
  return mu - eta2 / (beta - mu);
}

// The beta (lower bound on lambda_2) that Temple would need for the bound to reach a target floor tau:
//   mu - eta2/(beta - mu) >= tau  <=>  beta >= mu + eta2/(mu - tau)   (requires mu > tau).
export function requiredBetaForTarget(mu, eta2, tau) {
  if (!(mu > tau)) return null;
  return mu + eta2 / (mu - tau);
}

const { mu: MU, eta2: ETA2 } = IMP97162_MEASURED;

// Required beta <= lambda_2 for a few target floors tau. All are ~1e9-1e11, astronomically beyond any
// admissible lambda_2 (the wrong-direction Ritz UPPER estimate of lambda_2 is only O(1)).
export const IMP97162_REQUIRED_BETA = Object.freeze(
  [0.0, 0.25, 0.5].map((tau) => {
    const beta = requiredBetaForTarget(MU, ETA2, tau);
    return Object.freeze({ targetFloor: tau, requiredBeta: beta, requiredGap: beta - MU });
  }),
);

// Forward: a range of HYPOTHETICAL beta = mu*(1+f) -> resulting Temple floor (all strongly negative here).
export const IMP97162_FORWARD_TABLE = Object.freeze(
  [0.05, 0.1, 0.2, 0.5, 1.0, 2.0].map((f) => {
    const beta = MU * (1 + f);
    return Object.freeze({ gapFraction: f, beta, templeFloor: templeLowerBound(MU, ETA2, beta) });
  }),
);

export const IMP97162_VERDICT = Object.freeze({
  ticket: 'imp-97162',
  question: 'what is the tail-inclusive Temple residual defect eta2 for the committed Ritz eigenvector at 2a=ln3, and what beta <= lambda_2 would a positive Temple bound need to exceed 0.5?',
  binding_2a: LN3,
  // Finding 1: mu confirms the committed floor
  muConfirmsCommittedFloor: true,   // 0.53384576 vs committed 0.533852
  muAbove0p5: true,
  // Finding 2: eta2 is huge and non-convergent
  eta2Measured: ETA2,               // ~2.42e9
  eta2GrowsWithEvaluationSpace: true,
  eta2ExceedsMuByOrdersOfMagnitude: true, // ~10 orders
  operatorIsUnboundedSoEigenvectorMarginalInDomain: true, // (t^2+1/4)^2 ~ t^4 prefactor
  // Finding 3: required beta is ~1e10, far beyond admissible lambda_2
  requiredBetaForPositivity: requiredBetaForTarget(MU, ETA2, 0.0),   // ~4.54e9
  requiredBetaFor0p5Floor: requiredBetaForTarget(MU, ETA2, 0.5),     // ~7.16e10
  requiredBetaBeyondAnyAdmissibleLambda2: true, // Ritz upper estimate of lambda_2 is only O(1)
  templeBoundUnreachableForThisEigenvector: true,
  // relationship to imp-97136
  confirmsAndSharpensImp97136Infeasibility: true,
  routeADoublyObstructed: true, // INGREDIENT 1 (small finite eta2) AND INGREDIENT 2 (a-priori beta) both fail
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap: 'IMP97162_TEMPLE_DEFECT_ETA2_HUGE -- the tail-inclusive Temple residual defect eta2 = ||T_a[sigma_2] psi - mu psi||^2 for the committed Ritz eigenvector at 2a=ln3, T=800 is ~2.42e9 (eta ~ 4.9e4) and GROWS monotonically with the evaluation space Nbig (5.84e8 -> 2.42e9 over Nbig 120..300, no finite limit reached), because T_a[sigma_2] is unbounded (prefactor (t^2+1/4)^2 ~ t^4) and the polynomial Ritz eigenvector is at best marginally in dom(A). mu = 0.53384576 confirms the committed Legendre N=100 T=800 floor 0.533852. The Temple bound mu - eta2/(beta - mu) would need beta >= 4.54e9 for mere positivity and beta >= 7.16e10 to exceed the 0.5 uniform-N target -- astronomically beyond any admissible lambda_2 (the wrong-direction Ritz UPPER estimate of lambda_2 is only O(1) and even goes spuriously negative), so every hypothetical beta = mu*(1+f) yields a strongly negative Temple floor. This CONFIRMS and SHARPENS imp-97136: route (A) is doubly obstructed -- INGREDIENT 2 (a-priori beta <= lambda_2) does not exist, and INGREDIENT 1 (a finite, small eta2) fails for the only trial vectors in hand. Measurement only; mu stays an UPPER bound and is drifting; no lower-bound certificate; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97162_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97162_ASSERTIONS = [
  {
    id: 'imp97162-mu-confirms-committed-floor',
    holds: () =>
      Math.abs(IMP97162_MEASURED.mu - IMP97162_MEASURED.committedLegendreFloor) < 1e-4 &&
      IMP97162_MEASURED.mu > 0.5,
    why: 'the measured Gegenbauer Ritz floor mu = 0.53384576 matches the committed Legendre N=100 T=800 floor 0.533852 to ~1e-5, confirming psi is the committed Ritz eigenvector, and mu > 0.5 (the target floor).',
  },
  {
    id: 'imp97162-eta2-huge-and-monotone-growing',
    holds: () => {
      const L = IMP97162_ETA2_LADDER;
      const monotone = L.every((r, i) => i === 0 || r.eta2 > L[i - 1].eta2);
      const huge = IMP97162_MEASURED.eta2 > 1e9 && IMP97162_MEASURED.eta2 / IMP97162_MEASURED.mu > 1e9;
      return monotone && huge && IMP97162_VERDICT.eta2GrowsWithEvaluationSpace === true;
    },
    why: 'eta2 grows monotonically with Nbig (5.84e8 -> 2.42e9) and exceeds mu by ~10 orders of magnitude -- the polynomial eigenvector is at best marginally in dom(A) of the unbounded operator T_a[sigma_2].',
  },
  {
    id: 'imp97162-required-beta-is-astronomical',
    holds: () => {
      const b0 = requiredBetaForTarget(MU, ETA2, 0.0);
      const b5 = requiredBetaForTarget(MU, ETA2, 0.5);
      // Temple L(beta) = mu - eta2/(beta - mu); at beta = required beta the floor should equal the target.
      const check5 = Math.abs(templeLowerBound(MU, ETA2, b5) - 0.5) < 1e-6;
      return b0 > 1e9 && b5 > 1e10 && b5 > b0 && check5 &&
        IMP97162_VERDICT.requiredBetaBeyondAnyAdmissibleLambda2 === true;
    },
    why: 'reaching positivity needs beta >= 4.54e9 and reaching the 0.5 floor needs beta >= 7.16e10 (verified: templeLowerBound at the required beta equals the target) -- astronomically beyond any admissible lambda_2 (O(1)).',
  },
  {
    id: 'imp97162-forward-temple-floors-all-negative',
    holds: () =>
      IMP97162_FORWARD_TABLE.length === 6 &&
      IMP97162_FORWARD_TABLE.every((r) => r.templeFloor !== null && r.templeFloor < 0) &&
      IMP97162_VERDICT.templeBoundUnreachableForThisEigenvector === true,
    why: 'every hypothetical beta = mu*(1+f) with a plausible O(mu) gap yields a strongly negative Temple floor, since eta2 dwarfs mu*(beta - mu) -- the Temple bound is unreachable for this eigenvector.',
  },
  {
    id: 'imp97162-measurement-only-no-qed',
    holds: () =>
      IMP97162_VERDICT.operatorPositivityProved === false &&
      IMP97162_VERDICT.boundMoves === false &&
      IMP97162_VERDICT.uniformNGapClosed === false &&
      IMP97162_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97162_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97162_BINDING_2A - LN3) < 1e-12 &&
      IMP97162_VERDICT.qed === false,
    why: 'measurement only: mu stays an UPPER bound, no lower-bound certificate is produced, the uniform-in-N gap stays open, no bound moves, the interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97162_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97162 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
