/**
 * @module imp-97415-krein-lambda2-certified-lower-bound-assessment
 * @fileoverview imp-97415 -- can a certified a-priori LOWER bound rho <= lambda_2 be produced for the
 *   imp-97400 Lehmann-Maehly m=1 gate at 2a = ln3, and does it exceed the measured lambda_1 upper bracket
 *   0.581059 so the enclosure lambda_1 >= rho - 1/nu_max(rho) becomes usable? imp-97400 executed the m=1
 *   bracket and reported that even with the genuine full-projector second moment it still needs a certified
 *   rho <= lambda_2, i.e. a LOWER estimate on lambda_2 -- and the only reading in hand, lambda_2 = 83.090493,
 *   is itself a Rayleigh-Ritz UPPER bracket (wrong direction). This leaf assesses the three standard routes to
 *   a certified lower bound on lambda_2 of the compressed self-adjoint operator A = P_a M_sigma2 P_a and
 *   reports the reachable rho.
 *
 *   DERIVATION / ASSESSMENT only. No unconditional lower bound on lambda_2 that exceeds 0.581059 is produced;
 *   the m=1 enclosure stays UNUSABLE; no operator positivity is established; no bound moves; interval-rigorous
 *   reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * SETUP. For the m=1 Lehmann-Maehly bracket lambda_1 >= rho - 1/nu_max(rho) to be BOTH valid AND non-trivial
 *   we need a shift rho with (a) rho <= lambda_2 (validity of the certified lower bound) and (b) rho > lambda_1
 *   (otherwise the bracket falls below lambda_1 and carries no lower information). Since the only reading of
 *   lambda_1 is its UPPER bracket 0.581059, condition (b) forces rho > 0.581059. Hence the enclosure is usable
 *   iff there is a CERTIFIED lower bound on lambda_2 that EXCEEDS 0.581059. That is the exact question here.
 *
 * ROUTE 1 -- OPERATOR DOMINATION / MIN-MAX. Split the symbol sigma_2 = sigma_2^+ - sigma_2^- into its positive
 *   and negative parts and write A = C - B with C = P_a M_{sigma2^+} P_a >= 0 and B = P_a M_{sigma2^-} P_a >= 0.
 *   Then A >= -B as forms, so by min-max monotonicity lambda_k(A) >= lambda_k(-B) for every k. In particular
 *   lambda_2(A) >= lambda_2(-B) = -(second-LARGEST eigenvalue of B). A certified lower bound on lambda_2(A)
 *   therefore needs a certified UPPER bound on the second-largest eigenvalue of B, and the only cheap certified
 *   one is the operator norm: 2nd-largest(B) <= ||B|| = ||P_a M_{sigma2^-} P_a|| <= ||M_{sigma2^-}|| =
 *   sup_t sigma_2^-(t) = -inf_t sigma_2(t) = 4336.198 (imp-97335, argmin t = 9.3502). So route 1 yields the
 *   certified but useless rho = lambda_2(A) >= -4336.198 -- EXACTLY the imp-97335 symbol-infimum wall, one index
 *   up. B is a positive compression of multiplication by the confined width-~6.9 negative well, whose top
 *   eigenvalues carry the integrated well mass, so its second-largest eigenvalue is large and rho stays deeply
 *   NEGATIVE. Route 1 cannot cross zero, let alone reach 0.581059.
 *
 * ROUTE 2 -- LEHMANN-MAEHLY FOR lambda_2 (RECURSION). Lehmann-Maehly can bracket lambda_2 from below, but the
 *   m=2 variant needs an a-priori rho2 <= lambda_3 -- a certified lower bound on the THIRD eigenvalue. Certifying
 *   lambda_2 from below thus merely pushes the same a-priori-lower-bound requirement up one index (turtles all
 *   the way up), and it still consumes the FULL-projector second-moment matrix A2 = <A phi_i, A phi_j> that
 *   imp-97400 / imp-97399 leave unresolved (the sinc-kernel double integral). No new information: this route is
 *   an unbounded regress resting on the same missing primitive.
 *
 * ROUTE 3 -- WEINSTEIN-ARONSZAJN / INTERMEDIATE PROBLEMS. A certified lower bound on lambda_2(A) here requires a
 *   base operator A0 with A0 <= A whose spectrum is solvable and whose SECOND eigenvalue is the certified bound.
 *   The only operator domination available is A >= -B (route 1), whose spectrum is not solvable and whose second
 *   eigenvalue is negative. A truncated / band-restricted base A0 = P_a M_{sigma2, restricted} P_a is NOT <= A.
 *   Any solvable base with A0 <= A and a POSITIVE second eigenvalue would already certify lambda_2(A) > 0, hence
 *   (with lambda_1 <= lambda_2) is exactly the kind of positivity certificate the whole program is missing --
 *   assuming it is circular. Route 3 therefore collapses into route 1 or into an unproven positivity assumption.
 *
 * VERDICT. No route supplies a certified lower bound on lambda_2 that exceeds the lambda_1 upper bracket
 *   0.581059. Route 1 (operator domination) reaches the certified but useless rho >= -4336.198 -- the imp-97335
 *   symbol infimum, one index up -- and provably cannot cross zero because B carries the well mass. Route 2
 *   (Lehmann-Maehly recursion) pushes the a-priori requirement to lambda_3 (unbounded regress) and still needs
 *   the full-projector second moment. Route 3 (Weinstein-Aronszajn) needs a solvable base A0 <= A with positive
 *   second eigenvalue, which would itself be the missing positivity certificate. So the imp-97400 m=1 Lehmann-
 *   Maehly enclosure stays UNUSABLE at 2a = ln3: the certified reachable rho is -4336.198, four orders below the
 *   required 0.581059. This sharpens rather than closes the imp-97400 sub-gap: the a-priori lower bound on
 *   lambda_2 is subject to the SAME concentration wall as the lower bound on lambda_1, so it is not an
 *   independent lever. SUB-GAP IMP97415_LAMBDA2_LOWER_BOUND_SHARES_CONCENTRATION_WALL. No operator positivity;
 *   no bound moves; interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * @see imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (m=1 enclosure executed; needs rho<=lambda_2)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (symbol infimum inf_t sigma_2 = -4336.198 at t=9.3502)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (Temple/Lehmann-Maehly need a-priori rho<=lambda_2)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (lower-bound routes share the primitive)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (full band projector / sinc kernel)
 *
 * Ticket: imp-97415 (numerical, opus-4-8, api-pool). Derivation/assessment only; no rigorous lower bound on
 * lambda_2; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681096 -- the binding 2a for the Krein / c_sharp floor
export const IMP97415_BINDING_2A = LN3;
export const IMP97415_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// The two committed readings the gate turns on (imp-97400 Ritz brackets, N=28, T=200).
export const IMP97415_GATE_INPUTS = Object.freeze({
  lambda1UpperBracket: 0.581059, // committed best Rayleigh-Ritz upper bracket on lambda_1 (imp-97206/97355/97379)
  lambda2UpperBracket: 83.090493, // Ritz UPPER bracket on lambda_2 -- wrong direction for the gate
  symbolInfimum: -4336.198026, // inf_t sigma_2(t) at t=9.3502 (imp-97335); = -||M_{sigma2^-}||
  requiredRhoExceeds: 0.581059, // usable iff a CERTIFIED lower bound on lambda_2 exceeds this (rho>lambda_1)
});

// ROUTE 1 -- operator domination / min-max. A = C - B, C=P_a M_{sigma2^+} P_a >= 0, B=P_a M_{sigma2^-} P_a >= 0.
export const IMP97415_ROUTE1_OPERATOR_DOMINATION = Object.freeze({
  identity: 'A = C - B with C = P_a M_{sigma2^+} P_a >= 0 and B = P_a M_{sigma2^-} P_a >= 0, so A >= -B',
  minMaxBound: 'lambda_2(A) >= lambda_2(-B) = -(second-largest eigenvalue of B)',
  certifiedUpperOnB: 'second-largest(B) <= ||B|| <= ||M_{sigma2^-}|| = sup_t sigma_2^-(t) = 4336.198',
  reachableRho: -4336.198026, // certified but useless; equals the imp-97335 symbol infimum, one index up
  crossesZero: false, // B carries the confined-well mass, so its second-largest eigenvalue is large positive
  usable: false,
});

// ROUTE 2 -- Lehmann-Maehly for lambda_2. Needs an a-priori rho2 <= lambda_3: unbounded regress.
export const IMP97415_ROUTE2_LEHMANN_RECURSION = Object.freeze({
  requirement: 'the m=2 Lehmann-Maehly bracket for lambda_2 needs an a-priori rho2 <= lambda_3',
  consequence: 'pushes the a-priori-lower-bound requirement up one index (turtles all the way up)',
  stillNeedsFullProjectorSecondMoment: true, // A2 = <A phi_i, A phi_j> with the FULL P_a (imp-97400/97399)
  usable: false,
});

// ROUTE 3 -- Weinstein-Aronszajn / intermediate problems. Needs a solvable base A0 <= A: circular or route 1.
export const IMP97415_ROUTE3_WEINSTEIN_ARONSZAJN = Object.freeze({
  requirement: 'a solvable base operator A0 <= A whose SECOND eigenvalue is the certified lower bound',
  onlyDominationAvailable: 'A >= -B (route 1): spectrum not solvable, second eigenvalue negative',
  circularityNote:
    'a solvable A0 <= A with POSITIVE second eigenvalue would itself certify lambda_2(A) > 0 -- the very ' +
    'positivity certificate the program is missing, so assuming it is circular',
  usable: false,
});

export const IMP97415_VERDICT = Object.freeze({
  ticket: 'imp-97415',
  question:
    'can a certified a-priori lower bound rho <= lambda_2 be produced for the imp-97400 m=1 Lehmann-Maehly gate at 2a=ln3, and does it exceed the lambda_1 upper bracket 0.581059 so the enclosure becomes usable?',
  answer:
    'no. The three standard routes to a certified lower bound on lambda_2 of A = P_a M_sigma2 P_a all fail to ' +
    'clear 0.581059. ROUTE 1 (operator domination A >= -B) reaches the certified but useless rho >= -4336.198 ' +
    '(the imp-97335 symbol infimum, one index up) and provably cannot cross zero because B = P_a M_{sigma2^-} P_a ' +
    'carries the confined-well mass. ROUTE 2 (Lehmann-Maehly for lambda_2) needs an a-priori rho2 <= lambda_3 -- ' +
    'an unbounded regress -- and still consumes the full-projector second moment imp-97400/97399 leave open. ' +
    'ROUTE 3 (Weinstein-Aronszajn) needs a solvable base A0 <= A with positive second eigenvalue, which would ' +
    'itself already be the missing positivity certificate. So the reachable certified rho is -4336.198, four ' +
    'orders below the required 0.581059, and the m=1 enclosure stays UNUSABLE at 2a=ln3.',
  binding_2a: LN3,
  reachableCertifiedRho: -4336.198026,
  requiredRhoExceeds: 0.581059,
  m1EnclosureUsable: false,
  lambda2LowerBoundSharesConcentrationWall: true,
  route1CrossesZero: false,
  route2UnboundedRegress: true,
  route3CircularOrRoute1: true,
  // program state
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97415_LAMBDA2_LOWER_BOUND_SHARES_CONCENTRATION_WALL -- a certified a-priori lower bound rho <= lambda_2 ' +
    'for the imp-97400 m=1 Lehmann-Maehly gate at 2a=ln3 is NOT an independent lever: operator domination reaches ' +
    'only the imp-97335 symbol infimum -4336.198 (one index up, cannot cross zero), the Lehmann-Maehly recursion ' +
    'defers to an a-priori bound on lambda_3 and still needs the full-projector second moment, and the ' +
    'Weinstein-Aronszajn route needs a solvable base A0 <= A with positive second eigenvalue that would itself ' +
    'be the missing positivity certificate. The reachable certified rho (-4336.198) is four orders below the ' +
    'required 0.581059, so the m=1 enclosure remains unusable; the lower bound on lambda_2 is subject to the ' +
    'SAME band-limited concentration wall as the lower bound on lambda_1.',
  qed: false,
});

export const IMP97415_ASSERTIONS = [
  {
    id: 'imp97415-route1-symbol-infimum',
    holds: () =>
      Math.abs(IMP97415_ROUTE1_OPERATOR_DOMINATION.reachableRho - IMP97415_GATE_INPUTS.symbolInfimum) < 1e-3 &&
      IMP97415_ROUTE1_OPERATOR_DOMINATION.crossesZero === false &&
      IMP97415_ROUTE1_OPERATOR_DOMINATION.usable === false,
    why: 'Route 1: operator domination lambda_2(A) >= -||B|| reaches only the imp-97335 symbol infimum -4336.198 (one index up) and cannot cross zero.',
  },
  {
    id: 'imp97415-routes-2-3-unusable',
    holds: () =>
      IMP97415_ROUTE2_LEHMANN_RECURSION.usable === false &&
      IMP97415_ROUTE2_LEHMANN_RECURSION.stillNeedsFullProjectorSecondMoment === true &&
      IMP97415_ROUTE3_WEINSTEIN_ARONSZAJN.usable === false,
    why: 'Routes 2 and 3: the Lehmann-Maehly recursion defers to an a-priori bound on lambda_3 and still needs the full-projector second moment; Weinstein-Aronszajn needs a solvable base A0 <= A that would itself be the missing positivity certificate.',
  },
  {
    id: 'imp97415-reachable-rho-below-required',
    holds: () =>
      IMP97415_VERDICT.reachableCertifiedRho < IMP97415_VERDICT.requiredRhoExceeds &&
      IMP97415_VERDICT.reachableCertifiedRho < 0 &&
      IMP97415_VERDICT.m1EnclosureUsable === false &&
      IMP97415_VERDICT.lambda2LowerBoundSharesConcentrationWall === true,
    why: 'the reachable certified rho (-4336.198) is far below the required 0.581059, so the m=1 enclosure stays unusable and the lambda_2 lower bound shares the concentration wall.',
  },
  {
    id: 'imp97415-assessment-only-no-qed',
    holds: () =>
      IMP97415_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97415_VERDICT.operatorPositivityProved === false &&
      IMP97415_VERDICT.boundMoves === false &&
      IMP97415_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97415_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97415_BINDING_2A - LN3) < 1e-12 &&
      IMP97415_VERDICT.qed === false,
    why: 'derivation/assessment only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97415_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97415-krein-lambda2-certified-lower-bound-assessment assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
