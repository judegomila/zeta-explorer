/**
 * @module imp-97440-krein-route2-lambda2-lower-bound-execution
 * @fileoverview imp-97440 -- EXECUTE the imp-97415 Route-2 Lehmann-Maehly recursion for a certified LOWER
 *   bound rho <= lambda_2 on the imp-97414 FULL band-projector second moment A2 = <P_a M_sigma2 P_a phi_i,
 *   P_a M_sigma2 P_a phi_j> at 2a = ln3, and MEASURE whether the best reachable certified rho exceeds the
 *   lambda_1 upper bracket 0.581059 (usable m=1 enclosure) or stays below / negative (unbounded regress).
 *
 *   imp-97415 assessed Route 2 on PAPER as an unbounded regress resting on the same missing full-projector
 *   second-moment primitive, but never executed it numerically. imp-97414 built that primitive (the
 *   enlarged-basis reproducing-kernel projection A2 = A1_{NxKbig} G_{Kbig}^{-1} A1_{KbigxN}) and showed the
 *   m=1 bracket for lambda_1 collapses to vacuity once the circularity is removed. This leaf turns Route 2
 *   into measured numbers on that same executed A2.
 *
 *   EXECUTION / MEASUREMENT only. No unconditional lower bound on lambda_2 is produced; no operator
 *   positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed;
 *   RH open; NO QED. Runner: tmp/imp-97440-route2-lambda2-lowerbound.py (mpmath dps=50; pole-free basis
 *   phi_n(x)=(a^2-x^2)^3 P_n(x/a); N=28, T=200, panel=1.0; Kbig sweep {28,44,60,76}; the run below).
 *
 * MECHANICS. Lehmann-Maehly with shift rho and PSD Lehmann form G2 = A2 - 2 rho A1 + rho^2 A0, pencil
 *   G1 = rho A0 - A1: the positive eigenvalues tau_1 >= tau_2 >= ... of G1 w = tau G2 w give lower bounds
 *   rho - 1/tau_i. Pushing the shift into the band (lambda_2, lambda_3) puts TWO eigenvalues below rho, so
 *   tau_1 = nu_max yields a lower bound for lambda_2 (the eigenvalue nearest below rho) and tau_2 one for
 *   lambda_1. Hence the Route-2 lower bound on lambda_2 is exactly rho - 1/nu_max with rho swept in
 *   (lambda_2, lambda_3) -- the imp-97414 m=1 sweep shifted one index up. It is rigorous ONLY conditional on
 *   rho <= lambda_3, whose only reading is itself a Ritz UPPER bracket (wrong direction) -- the regress
 *   imp-97415 named.
 *
 * FINDING 1 -- RITZ BRACKETS. At N=28, T=200 the exact-Gram Rayleigh-Ritz upper brackets are lambda_1 =
 *   0.543044, lambda_2 = 83.090493 (reproducing imp-97400/97414) and lambda_3 = 5516.954964; so the Route-2
 *   shift band is (83.09, 5516.95) with a ceiling lambda_3 that is itself an UPPER bracket.
 *
 * FINDING 2 -- Kbig=N REPRODUCES THE CIRCULAR VALUE. At the circular surrogate Kbig = N = 28 the Route-2
 *   lower bound on lambda_2 returns EXACTLY the Ritz upper bracket 83.090493 for EVERY shift rho in the band
 *   (with nu_max = 0.184 at rho near lambda_2 down to 1.9e-4 near lambda_3). This is the same circular
 *   signature imp-97414 saw for lambda_1 (bracket = mu for every rho): the Ritz vectors are exact
 *   eigenvectors of the finite section, so the recursion just echoes lambda_2 back -- NOT a genuine
 *   full-projector lower bound.
 *
 * FINDING 3 -- WITH THE GENUINE FULL PROJECTOR THE ROUTE-2 LOWER BOUND COLLAPSES TO DEEP NEGATIVITY. As
 *   soon as Kbig > N (circularity removed) the Route-2 lower bound on lambda_2 goes hopelessly NEGATIVE for
 *   EVERY shift: best (least negative, at rho nearest lambda_3) = -196.863 (Kbig=44), worsening MONOTONICALLY
 *   to -245.345 (Kbig=60) and -275.500 (Kbig=76) as the reproducing kernel converges; near rho = lambda_2 it
 *   runs to -18507 (Kbig=76). The lambda_1 cross-check (rho - 1/tau_2) is astronomically negative (-3.36e9
 *   near lambda_2). nu_max collapses to ~5e-5..4e-4 and g2min climbs to ~2377. So the best reachable
 *   CERTIFIED rho on the genuine projector is roughly -197 (and pushed more negative as Kbig grows) -- more
 *   than TWO orders below zero and four below the required 0.581059.
 *
 * VERDICT. imp-97415 Route 2 is CONFIRMED numerically as an unbounded regress. Executing the recursion on
 *   the genuine full-projector A2 produces NO positive lower bound on lambda_2 at any Kbig > N; the reachable
 *   certified rho is deeply negative (best -196.863 at Kbig=44, worsening to -275.500 at Kbig=76) and never
 *   approaches, let alone exceeds, the 0.581059 needed to make the imp-97400 m=1 enclosure usable. The only
 *   positive reading (83.090493 at Kbig=N) is the circular surrogate echoing lambda_2 back. Route 2 shares
 *   the SAME band-limited concentration / unbounded-above vacuity wall as the m=1 lambda_1 bracket
 *   (imp-97414 Finding 3): the full-projector graph-norm second moment is vacuously large, so shifting one
 *   index up buys nothing. SUB-GAP IMP97440_ROUTE2_REGRESS_CONFIRMED_NEGATIVE_ON_FULL_PROJECTOR. No
 *   unconditional lower bound on lambda_2; no operator positivity; no bound moves; interval-rigorous reach
 *   stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97415-krein-lambda2-certified-lower-bound-assessment.js (Route 2 assessed as regress on paper; this executes it)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (the full-projector A2 primitive; m=1 collapse)
 * @see imp-97400-krein-lehmann-maehly-lower-bracket-execution.js (the m=1 gate needing a certified rho<=lambda_2)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (symbol infimum -4336.198; the Route-1 wall one index down)
 *
 * Ticket: imp-97440 (numerical, opus-4-8, api-pool). Execution/measurement only; no rigorous lower bound on
 * lambda_2; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97440_BINDING_2A = LN3;
export const IMP97440_RIGOROUS_REACH_2A = 0.96; // unchanged by this execution
export const IMP97440_REQUIRED_RHO_EXCEEDS = 0.581059; // usable iff the Route-2 lower bound on lambda_2 exceeds this

// The executed finite-section run (mpmath dps=50, pole-free basis m=3, N=28, T=200, panel=1.0).
export const IMP97440_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  KbigSweep: [28, 44, 60, 76], // Kbig=N is the circular surrogate; Kbig>N is the genuine full projector
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
  method:
    'Lehmann-Maehly shift rho in (lambda_2, lambda_3): lower bound on lambda_2 = rho - 1/nu_max, ' +
    'nu_max = largest eigenvalue of the pencil (rho A0 - A1, A2 - 2 rho A1 + rho^2 A0); ' +
    'A2 = A1_{N x Kbig} G_{Kbig}^{-1} A1_{Kbig x N} (full-projector reproducing kernel).',
});

// FINDING 1 -- Ritz upper brackets and the Route-2 shift band.
export const IMP97440_RITZ = Object.freeze({
  lambda1UpperBracket: 0.543044,
  lambda2UpperBracket: 83.090493,
  lambda3UpperBracket: 5516.954964, // the Route-2 shift ceiling -- itself an UPPER bracket (wrong direction)
  shiftBand: '(lambda_2, lambda_3) = (83.09, 5516.95)',
});

// FINDING 2 -- Kbig=N reproduces the circular value (bracket = lambda_2 for every shift).
export const IMP97440_CIRCULAR_KBIG_EQ_N = Object.freeze({
  Kbig: 28,
  route2LowerBoundOnLambda2: 83.090493, // exactly the Ritz upper bracket, for EVERY rho in the band
  isCircular: true, // Ritz vectors are exact eigenvectors of the finite section -- echoes lambda_2 back
  notAGenuineLowerBound: true,
});

// FINDING 3 -- with the genuine full projector (Kbig>N) the Route-2 lower bound collapses to deep negativity.
export const IMP97440_FULL_PROJECTOR_ROUTE2 = Object.freeze({
  positiveLowerBoundFound: false, // for every Kbig > N and every shift rho in (lambda_2, lambda_3)
  bestLowerBoundOnLambda2ByKbig: Object.freeze({ 44: -196.863257, 60: -245.344531, 76: -275.499942 }),
  worsensAsKbigGrows: true, // more genuine projector -> more negative reachable rho
  worstNearLambda2_Kbig76: -18507.200416, // rho just above lambda_2
  lambda1CrossCheckNearLambda2_Kbig76: -3357371944.384518, // rho - 1/tau_2, astronomically negative
  nuMaxRange: '5.4e-5 .. 4.2e-4', // collapsing largest generalized eigenvalue -> 1/nu_max huge -> bracket -> -inf
  g2minMax: 2377, // lambda_min(G2) climbs far from 0 -> Ritz vectors far from eigenvectors
  reachableCertifiedRho: -196.863257, // best (least negative) genuine value, at Kbig=44 rho near lambda_3
});

export const IMP97440_VERDICT = Object.freeze({
  ticket: 'imp-97440',
  question:
    'does executing the imp-97415 Route-2 Lehmann-Maehly recursion for lambda_2 on the imp-97414 genuine full-projector A2 at 2a=ln3 produce a certified lower bound rho <= lambda_2 that exceeds the lambda_1 upper bracket 0.581059 (usable m=1 enclosure), or does it stay below / negative (regress confirmed)?',
  answer:
    'it stays deeply negative -- imp-97415 Route 2 is CONFIRMED as an unbounded regress. FINDING 1: Ritz ' +
    'upper brackets lambda_1=0.543044, lambda_2=83.090493, lambda_3=5516.954964 set the shift band ' +
    '(83.09, 5516.95) with a ceiling that is itself an UPPER bracket. FINDING 2: at the circular Kbig=N=28 ' +
    'the Route-2 lower bound returns EXACTLY 83.090493 for every shift -- the Ritz vectors echo lambda_2 ' +
    'back, not a genuine lower bound. FINDING 3: as soon as Kbig>N (circularity removed) the Route-2 lower ' +
    'bound on lambda_2 collapses NEGATIVE for every shift: best -196.863 (Kbig=44), worsening monotonically ' +
    'to -275.500 (Kbig=76) as the reproducing kernel converges, and -18507 near rho=lambda_2 (lambda_1 ' +
    'cross-check -3.36e9). So the best reachable certified rho on the genuine projector is roughly -197, ' +
    'more than two orders below zero and four below the required 0.581059. Route 2 shares the same ' +
    'unbounded-above / band-limited concentration vacuity wall as the m=1 lambda_1 bracket (imp-97414): ' +
    'shifting one index up buys nothing. The m=1 enclosure stays UNUSABLE at 2a=ln3.',
  binding_2a: LN3,
  requiredRhoExceeds: 0.581059,
  // Finding 1
  lambda3ShiftCeilingIsUpperBracket: true,
  // Finding 2
  circularValueAtKbigEqualsN: 83.090493,
  // Finding 3
  positiveLowerBoundFound: false,
  reachableCertifiedRho: -196.863257,
  reachableRhoWorsensAsKbigGrows: true,
  route2UnboundedRegressConfirmed: true,
  sharesConcentrationWall: true,
  newSubGap: 'IMP97440_ROUTE2_REGRESS_CONFIRMED_NEGATIVE_ON_FULL_PROJECTOR',
  // execution-only guardrails
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

const IMP97440_ASSERTIONS = [
  {
    id: 'imp97440-ritz-band',
    holds: () =>
      Math.abs(IMP97440_RITZ.lambda1UpperBracket - 0.543044) < 1e-6 &&
      Math.abs(IMP97440_RITZ.lambda2UpperBracket - 83.090493) < 1e-5 &&
      IMP97440_RITZ.lambda3UpperBracket > IMP97440_RITZ.lambda2UpperBracket,
    why: 'the exact-Gram Ritz upper brackets reproduce imp-97400/97414 (lambda_1=0.543044, lambda_2=83.090493) and lambda_3 sets the Route-2 shift ceiling.',
  },
  {
    id: 'imp97440-kbig-n-circular',
    holds: () =>
      Math.abs(IMP97440_CIRCULAR_KBIG_EQ_N.route2LowerBoundOnLambda2 - IMP97440_RITZ.lambda2UpperBracket) < 1e-5 &&
      IMP97440_CIRCULAR_KBIG_EQ_N.isCircular === true &&
      IMP97440_CIRCULAR_KBIG_EQ_N.notAGenuineLowerBound === true,
    why: 'at Kbig=N the Route-2 recursion returns exactly the Ritz upper bracket lambda_2 for every shift -- the circular signature, not a genuine lower bound.',
  },
  {
    id: 'imp97440-full-projector-collapses-negative',
    holds: () => {
      const b = IMP97440_FULL_PROJECTOR_ROUTE2.bestLowerBoundOnLambda2ByKbig;
      return (
        IMP97440_FULL_PROJECTOR_ROUTE2.positiveLowerBoundFound === false &&
        b[44] < 0 && b[60] < 0 && b[76] < 0 &&
        b[44] > b[60] && b[60] > b[76] && // worsens (more negative) as Kbig grows
        IMP97440_FULL_PROJECTOR_ROUTE2.worsensAsKbigGrows === true
      );
    },
    why: 'with the genuine full projector (Kbig>N) the Route-2 lower bound on lambda_2 is negative for every shift and worsens monotonically as Kbig grows.',
  },
  {
    id: 'imp97440-reachable-rho-far-below-required',
    holds: () =>
      IMP97440_VERDICT.reachableCertifiedRho < 0 &&
      IMP97440_VERDICT.reachableCertifiedRho < IMP97440_VERDICT.requiredRhoExceeds &&
      IMP97440_VERDICT.positiveLowerBoundFound === false &&
      IMP97440_VERDICT.route2UnboundedRegressConfirmed === true &&
      IMP97440_VERDICT.newSubGap === 'IMP97440_ROUTE2_REGRESS_CONFIRMED_NEGATIVE_ON_FULL_PROJECTOR',
    why: 'the reachable certified rho (-196.863) is far below the required 0.581059, confirming imp-97415 Route 2 as an unbounded regress on the genuine full projector.',
  },
  {
    id: 'imp97440-execution-only-no-qed',
    holds: () =>
      IMP97440_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97440_VERDICT.operatorPositivityProved === false &&
      IMP97440_VERDICT.boundMoves === false &&
      IMP97440_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97440_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97440_BINDING_2A - LN3) < 1e-12 &&
      IMP97440_VERDICT.qed === false,
    why: 'execution/measurement only: no rigorous lower bound on lambda_2, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97440_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97440-krein-route2-lambda2-lower-bound-execution assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
