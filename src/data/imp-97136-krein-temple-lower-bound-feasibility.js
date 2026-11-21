/**
 * @module imp-97136-krein-temple-lower-bound-feasibility
 * @fileoverview imp-97136 -- FEASIBILITY ASSESSMENT (proof) of route (A) of imp-97121 Finding 2: a
 *   complementary LOWER-bound eigenvalue certificate (Temple / Kato-Temple / Lehmann-Maehly) for
 *   lambda_min(T_a[sigma_2]) at 2a=ln3. imp-97121 named this as one of two admissible routes to the
 *   missing N-INDEPENDENT lower bound (SUB-GAP IMP97121_UNIFORM_N_FLOOR_NEEDS_LOWER_BOUND_OBJECT) and
 *   flagged its second ingredient -- an a-priori separation/enclosure of the next spectral point above
 *   lambda_min -- as UNKNOWN for this operator. This leaf assesses (i) whether that spectral-gap
 *   enclosure is obtainable and (ii) what Temple-quotient defect the committed Ritz eigenvector supplies.
 *
 *   Feasibility assessment only. Instantiates NO certificate; produces no lower bound; changes no bound;
 *   interval-rigorous reach stays 2a<=0.96; no refereed bound is changed; RH open; NO QED.
 *
 * THE TEMPLE MACHINERY (what route A actually requires). For a self-adjoint operator A with a normalised
 *   trial vector psi in dom(A), write mu = <psi, A psi> (the Rayleigh quotient) and the residual defect
 *   eta2 = ||A psi - mu psi||^2 = <psi, A^2 psi> - mu^2 (the variance of A in the state psi). mu is always
 *   an UPPER bound on lambda_min. Temple s inequality upgrades this to a LOWER bound
 *       lambda_min >= mu - eta2 / (beta - mu),
 *   PROVIDED a number beta is known with mu < beta <= lambda_2, i.e. beta is a rigorous LOWER bound on
 *   the SECOND eigenvalue (the next spectral point above lambda_min). Kato-Temple is the two-sided
 *   refinement (same beta requirement); Lehmann-Maehly generalises to several eigenvalues at once but
 *   trades beta for an a-priori reference rho known to satisfy rho <= lambda_{m+1} -- still an unproved
 *   separation of the same kind. So EVERY variant needs an a-priori spectral-separation constant.
 *
 * INGREDIENT 1 -- THE TEMPLE QUOTIENT (mu, eta2) FROM THE COMMITTED RITZ EIGENVECTOR. mu is available in
 *   principle: it is exactly the committed Ritz floor at 2a=ln3, mu ~ 0.533852 (Legendre N=100, T=800,
 *   imp-96772) or mu ~ 0.475606 (shift-invert Nbig=240, T=800, imp-96911). But (a) mu is itself only an
 *   UPPER bound and is still DRIFTING downward with the trial/evaluation space (imp-97121), so it is not a
 *   fixed certified number; and (b) the residual defect eta2 is NOT committed anywhere -- computing
 *   ||A psi - mu psi||^2 means applying T_a[sigma_2] to psi, which drags in the sigma_2 t-integral tail,
 *   so a CERTIFIED interval eta2 inherits exactly the compression-defect + t-tail truncation error that
 *   imp-97121 Finding 3 records as DESCENDING WITHOUT A RATE. The shift-invert mu = 1/eta - m is moreover
 *   a compressed-resolvent value, not the raw Rayleigh quotient of a domain vector, so even exhibiting a
 *   genuine psi in dom(A) with a certified ||A psi - mu psi|| is itself non-trivial. Ingredient 1 is thus
 *   only heuristically available today, not as a certified interval residual.
 *
 * INGREDIENT 2 -- THE SPECTRAL SEPARATION beta (LOWER BOUND ON lambda_2) IS THE DECISIVE OBSTRUCTION. This
 *   is the ingredient imp-97121 flags as unknown, and the obstruction is structural, not just missing
 *   data: Rayleigh-Ritz produces the WRONG-DIRECTION bound. By Courant-Fischer the k-th Ritz value is an
 *   UPPER bound on lambda_k, so the second Ritz value beta_Ritz satisfies lambda_2 <= beta_Ritz, whereas
 *   Temple needs beta <= lambda_2. Using the finite-N second Ritz value as beta is therefore ILLEGITIMATE
 *   (it can and generically does exceed lambda_2). Obtaining a genuine LOWER bound on lambda_2 is itself a
 *   lower-bound-eigenvalue problem -- the SAME class of object the whole certificate is missing. Route (A)
 *   thus does not remove the missing lower-bound object; it RELOCATES it from lambda_min to lambda_2. This
 *   is the circular/bootstrap character: Lehmann-Maehly does not escape it, since its a-priori rho <=
 *   lambda_{m+1} is the identical unproved separation.
 *
 * WHAT WOULD SURVIVE IF BOTH INGREDIENTS EXISTED -- THE BREAK-EVEN RESIDUAL BUDGET. Even granting a
 *   certified (mu, eta2) and a valid beta, Temple certifies positivity (lambda_min >= 0, the only thing
 *   the Krein floor needs) iff mu - eta2/(beta - mu) >= 0, i.e. iff eta2 <= mu (beta - mu). So the largest
 *   residual defect Temple can tolerate is eta_max = sqrt(mu (beta - mu)), an INCREASING function of the
 *   gap beta - mu that COLLAPSES to 0 as beta -> mu+. With mu ~ 0.53 still drifting and the gap
 *   beta - mu entirely unbracketed, this budget is uncontrolled: if lambda_2 sits close to lambda_min the
 *   Temple correction is vacuous (negative) even for a tiny residual. Feasibility of route (A) therefore
 *   hinges ENTIRELY on a quantitative gap lambda_2 - lambda_min >= g > 0 that is today not merely unknown
 *   but not even bracketed (imp-97121 records no committed lambda_2 or gap estimate).
 *
 * VERDICT. Route (A) is NOT feasible with the currently committed objects. The committed Ritz eigenvector
 *   supplies mu (= the Ritz floor, itself only an upper bound and still drifting) but NOT a certified
 *   interval residual eta2 (which inherits the open t-tail / compression-defect truncation), and --
 *   decisively -- the second required ingredient, an a-priori LOWER bound beta <= lambda_2, does not
 *   exist: Rayleigh-Ritz yields only the wrong-direction upper bound lambda_2 <= beta_Ritz, and no
 *   independent spectral-gap enclosure for T_a[sigma_2] is committed. Route (A) therefore does not resolve
 *   IMP96749_UNIFORM_N_GAP_UNSETTLED; it relocates the missing lower-bound object from lambda_min to
 *   lambda_2 (a bootstrap requirement Lehmann-Maehly shares via rho <= lambda_{m+1}). The prerequisite
 *   before route (A) can even be attempted is an INDEPENDENT proof of a positive, quantified spectral gap
 *   lambda_2 - lambda_min >= g > 0 -- for which the operator has no route today; only then does the
 *   break-even budget eta2 <= mu (beta - mu) become checkable. SUB-GAP
 *   IMP97136_TEMPLE_NEEDS_APRIORI_SPECTRAL_GAP. Feasibility assessment only; no operator positivity
 *   established; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (Finding 2 route (A); the missing lower-bound object)
 * @see imp-96772-krein-lammin-double-double-recompute.js (Legendre floor mu ~ 0.533852 @ N=100, T=800)
 * @see imp-96911-krein-eta-nconvergence-scout.js (shift-invert floor mu ~ 0.475606 @ Nbig=240; no committed lambda_2)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this assessment)
export const IMP97136_RIGOROUS_REACH_2A = 0.96;
export const IMP97136_BINDING_2A = LN3;

// The committed Ritz floors that route (A) would use as the Temple quotient mu. Every value is a
// Rayleigh-Ritz UPPER bound on the true lambda_min and is still descending (imp-97121).
export const IMP97136_RITZ_FLOORS = Object.freeze({
  legendreN100_T800_mu: 0.533852,     // imp-96772, extended precision
  shiftInvertNbig240_T800_mu: 0.475606, // imp-96911, mu = 1/eta - m (compressed resolvent, not a raw domain Rayleigh quotient)
  muIsUpperBoundOnly: true,           // Ritz value >= lambda_min always
  muStillDrifting: true,              // imp-97121: descends with the trial/evaluation space, no fixed certified value
  residualDefectEta2Committed: false, // <psi,A^2 psi> - mu^2 not committed; would inherit the open t-tail truncation
});

// --- Temple lower bound and the break-even residual budget (self-contained arithmetic) ---

// Temple lower bound on lambda_min given the quotient (mu, eta2) and a LOWER bound beta on lambda_2.
// Valid only when beta > mu; returns null when the required separation mu < beta fails.
export function templeLowerBound(mu, eta2, beta) {
  if (!(beta > mu)) return null; // Temple requires mu < beta <= lambda_2
  return mu - eta2 / (beta - mu);
}

// The largest residual defect eta (eta = sqrt(eta2)) for which Temple still certifies lambda_min >= 0,
// as a function of mu and the assumed spectral gap g = beta - mu > 0: eta_max = sqrt(mu * g).
export function breakEvenEta(mu, gap) {
  if (!(gap > 0) || !(mu > 0)) return 0;
  return Math.sqrt(mu * gap);
}

// Illustrative break-even budget at the binding floor mu = legendre N=100 value, for a range of
// (unknown) gap fractions gap = f * mu. Purely illustrative: the true gap is not bracketed today.
const MU_BIND = IMP97136_RITZ_FLOORS.legendreN100_T800_mu;
export const IMP97136_BREAKEVEN_TABLE = Object.freeze(
  [0.1, 0.5, 1.0, 2.0].map((f) => Object.freeze({
    gapFractionOfMu: f,
    gap: f * MU_BIND,
    beta: (1 + f) * MU_BIND,
    etaMax: breakEvenEta(MU_BIND, f * MU_BIND), // max tolerable residual defect eta for positivity
  })),
);

export const IMP97136_VERDICT = Object.freeze({
  ticket: 'imp-97136',
  question: 'is a Temple / Kato-Temple / Lehmann-Maehly lower-bound eigenvalue certificate for lambda_min(T_a[sigma_2]) at 2a=ln3 feasible given the missing spectral-gap enclosure, and what Temple-quotient defect does the committed Ritz eigenvector supply?',
  binding_2a: LN3,
  route: 'A -- complementary lower-bound eigenvalue method (Temple / Kato-Temple / Lehmann-Maehly)',
  // ingredient 1: the Temple quotient (mu, eta2)
  muAvailableAsRitzFloor: true,        // mu = committed Ritz floor ~0.53 (Legendre) / ~0.48 (shift-invert)
  muIsUpperBoundAndDrifting: true,     // not a fixed certified number
  residualDefectEta2Certified: false,  // eta2 inherits the open t-tail / compression-defect truncation
  // ingredient 2: the a-priori separation beta (the decisive obstruction)
  spectralGapEnclosureObtainable: false, // no committed lambda_2 or gap estimate for this operator
  ritzGivesWrongDirectionForBeta: true,  // k-th Ritz value is an UPPER bound on lambda_k; Temple needs beta <= lambda_2
  secondRitzValueUsableAsBeta: false,    // lambda_2 <= beta_Ritz, so using beta_Ritz violates beta <= lambda_2
  lowerBoundOnLambda2IsSameMissingObject: true, // route A relocates the missing lower bound from lambda_min to lambda_2
  lehmannMaehlyEscapesCircularity: false,       // its a-priori rho <= lambda_{m+1} is the identical unproved separation
  // even if both ingredients existed: break-even budget hinges on the (unbracketed) gap
  positivityBreakEvenIsEta2LeqMuGap: true, // Temple certifies lambda_min >= 0 iff eta2 <= mu*(beta - mu)
  gapQuantifiedOrBracketed: false,
  // overall
  routeAFeasibleWithCommittedObjects: false,
  prerequisite: 'an independent proof of a positive, quantified spectral gap lambda_2 - lambda_min >= g > 0',
  // unchanged program state
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  uniformNGapClosed: false,
  subGap: 'IMP97136_TEMPLE_NEEDS_APRIORI_SPECTRAL_GAP -- route (A) of imp-97121 Finding 2 (a Temple / Kato-Temple / Lehmann-Maehly complementary lower-bound eigenvalue certificate for lambda_min(T_a[sigma_2]) at 2a=ln3) is NOT feasible with the currently committed objects. Temple s inequality lambda_min >= mu - eta2/(beta - mu) needs two ingredients: (1) the quotient (mu, eta2) of a normalised domain trial vector, and (2) an a-priori number beta with mu < beta <= lambda_2 (a rigorous LOWER bound on the second eigenvalue). The committed Ritz eigenvector supplies mu = the Ritz floor (~0.533852 Legendre N=100 T=800, ~0.475606 shift-invert Nbig=240), but mu is only an UPPER bound and is still drifting down with the trial/evaluation space, and the residual defect eta2 = <psi,A^2 psi> - mu^2 is not committed and would inherit exactly the sigma_2 t-integral-tail / compression-defect truncation that imp-97121 Finding 3 records as descending without a rate (the shift-invert mu = 1/eta - m is a compressed-resolvent value, not even a raw domain Rayleigh quotient). Ingredient (2) is the decisive obstruction and is STRUCTURAL: by Courant-Fischer the k-th Rayleigh-Ritz value is an UPPER bound on lambda_k, so the second Ritz value beta_Ritz satisfies lambda_2 <= beta_Ritz, the WRONG direction for Temple s requirement beta <= lambda_2 -- the finite-N solve cannot supply beta, and producing a genuine lower bound on lambda_2 is itself a lower-bound-eigenvalue problem, the SAME class of object the certificate is missing. Route (A) therefore does not remove the missing lower-bound object; it RELOCATES it from lambda_min to lambda_2 (a bootstrap requirement Lehmann-Maehly shares, since its a-priori rho <= lambda_{m+1} is the identical unproved separation). Even granting both ingredients, Temple certifies the only thing the Krein floor needs (lambda_min >= 0) iff eta2 <= mu*(beta - mu), so the tolerable residual budget eta_max = sqrt(mu*(beta - mu)) collapses to 0 as beta -> mu+ and is entirely uncontrolled while the gap lambda_2 - lambda_min is neither quantified nor bracketed (no committed lambda_2). The prerequisite before route (A) can even be attempted is an INDEPENDENT proof of a positive, quantified spectral gap lambda_2 - lambda_min >= g > 0, for which the operator has no route today. Feasibility assessment only; no operator positivity established; no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97136_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97136_ASSERTIONS = [
  {
    id: 'imp97136-temple-formula-exact-on-2x2-with-beta-eq-lambda2',
    holds: () => {
      // Validate the Temple formula on a synthetic 2x2 self-adjoint A = [[1, 0.1],[0.1, 3]] whose
      // eigenvalues are known in closed form. With trial psi = e1 the Temple bound using beta = lambda_2
      // is EXACT (equals lambda_min) for a 2-dim problem -- a correctness check of templeLowerBound.
      const off = 0.1, d1 = 1, d2 = 3;
      const tr = d1 + d2, disc = Math.sqrt((d1 - d2) ** 2 + 4 * off * off);
      const lambda1 = (tr - disc) / 2, lambda2 = (tr + disc) / 2;
      const mu = d1;                       // <e1, A e1>
      const eta2 = off * off;              // ||A e1 - mu e1||^2 = off^2
      const lb = templeLowerBound(mu, eta2, lambda2);
      return lb !== null && mu >= lambda1 && lb <= lambda1 + 1e-12 && Math.abs(lb - lambda1) < 1e-9;
    },
    why: 'Temple lambda_min >= mu - eta2/(beta - mu) is a valid lower bound (exact when beta = lambda_2 on a 2x2); confirms the templeLowerBound implementation and that mu is an upper bound.',
  },
  {
    id: 'imp97136-second-ritz-value-is-wrong-direction-for-beta',
    holds: () => {
      // On A = diag(1,2,10) project onto span{ e1, (0,cos p,sin p) }, p=0.3. The 2x2 Ritz block is
      // diag(1, 2 cos^2 p + 10 sin^2 p); its SECOND Ritz value exceeds lambda_2 = 2, so it CANNOT serve
      // as Temple s beta (which needs beta <= lambda_2). Demonstrates the structural wrong-direction fact.
      const p = 0.3;
      const secondRitz = 2 * Math.cos(p) ** 2 + 10 * Math.sin(p) ** 2;
      const lambda2 = 2;
      const templeWouldBeInvalid = templeLowerBound(1.5, 0.01, secondRitz) !== null && secondRitz > lambda2;
      return secondRitz > lambda2 && templeWouldBeInvalid &&
        IMP97136_VERDICT.ritzGivesWrongDirectionForBeta === true &&
        IMP97136_VERDICT.secondRitzValueUsableAsBeta === false;
    },
    why: 'the k-th Ritz value is an upper bound on lambda_k, so the second Ritz value (2.6987 > lambda_2 = 2 here) violates Temple s beta <= lambda_2 requirement -- Rayleigh-Ritz gives the wrong-direction bound for the separation.',
  },
  {
    id: 'imp97136-breakeven-budget-monotone-and-collapses-at-zero-gap',
    holds: () => {
      // eta_max = sqrt(mu * gap) increases with the gap and -> 0 as gap -> 0, so with an unbracketed gap
      // the tolerable residual budget is uncontrolled. Check monotonicity across the illustrative table
      // and the zero-gap collapse.
      const t = IMP97136_BREAKEVEN_TABLE;
      const monotone = t.every((row, i) => i === 0 || row.etaMax > t[i - 1].etaMax);
      const collapses = breakEvenEta(MU_BIND, 0) === 0 && breakEvenEta(MU_BIND, 1e-9) < 1e-4;
      // spot value: f=1 (beta = 2 mu) gives eta_max = mu, i.e. eta_max^2 = mu^2
      const spot = t.find((r) => r.gapFractionOfMu === 1.0);
      const spotOk = spot && Math.abs(spot.etaMax - MU_BIND) < 1e-12;
      return monotone && collapses && spotOk &&
        IMP97136_VERDICT.positivityBreakEvenIsEta2LeqMuGap === true &&
        IMP97136_VERDICT.gapQuantifiedOrBracketed === false;
    },
    why: 'Temple certifies lambda_min >= 0 iff eta2 <= mu*(beta - mu); the budget eta_max = sqrt(mu*gap) rises with the gap and collapses to 0 as the gap vanishes, so an unbracketed lambda_2 - lambda_min leaves the budget uncontrolled.',
  },
  {
    id: 'imp97136-missing-ingredients-relocate-not-remove-the-object',
    holds: () =>
      IMP97136_VERDICT.muAvailableAsRitzFloor === true &&
      IMP97136_VERDICT.residualDefectEta2Certified === false &&
      IMP97136_VERDICT.spectralGapEnclosureObtainable === false &&
      IMP97136_VERDICT.lowerBoundOnLambda2IsSameMissingObject === true &&
      IMP97136_VERDICT.lehmannMaehlyEscapesCircularity === false &&
      IMP97136_VERDICT.routeAFeasibleWithCommittedObjects === false,
    why: 'route (A) supplies mu but not a certified residual, and needs a lower bound on lambda_2 that is the same missing lower-bound object -- it relocates rather than removes it; Lehmann-Maehly does not escape the circularity.',
  },
  {
    id: 'imp97136-assessment-only-no-qed',
    holds: () =>
      IMP97136_VERDICT.operatorPositivityProved === false &&
      IMP97136_VERDICT.boundMoves === false &&
      IMP97136_VERDICT.uniformNGapClosed === false &&
      IMP97136_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97136_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97136_BINDING_2A - LN3) < 1e-12 &&
      IMP97136_VERDICT.qed === false,
    why: 'feasibility assessment only: no operator positivity is established, the uniform-in-N gap stays open, no bound moves, the interval-rigorous certificate reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97136_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97136 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
