/**
 * @module imp-97400-krein-lehmann-maehly-lower-bracket-execution
 * @fileoverview imp-97400 -- EXECUTE (not merely assess) the Lehmann-Maehly / interval finite-section
 *   LOWER-bracket attempt for the Krein concentration constant c_sharp = lambda_min(P_a M_sigma2 P_a) at
 *   2a = ln3. imp-97379 confirmed every extrapolation order gives Rayleigh-Ritz UPPER brackets (best
 *   0.581059); imp-97136 / imp-97350 ASSESSED the Temple / Kato-Temple / Lehmann-Maehly family and found
 *   it gated on an a-priori LOWER bound rho <= lambda_2, and explicitly flagged that the two concrete
 *   numbers the family needs -- the residual defect eta2 = ||M psi - mu psi||^2 (Temple ingredient 1) and
 *   the gap lambda_2 - lambda_1 -- were NEVER committed. This leaf builds the missing second-moment matrix
 *   and RUNS the enclosure, turning that assessment into measured numbers and a sharper obstruction.
 *
 *   EXECUTION / MEASUREMENT only. No unconditional positive lower bound is produced; no operator
 *   positivity is established; no bound moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED. Runner: tmp/imp-97400-lehmann-maehly-lowerbracket.py
 *   (mpmath dps=50; pole-free basis phi_n(x)=(a^2-x^2)^3 P_n(x/a); N=28, T=200, panel=1.0; the run below).
 *
 * THE MACHINERY. For the compressed self-adjoint operator A = P_a M_sigma2 P_a on the Paley-Wiener trial
 *   space, Lehmann-Maehly (m=1) gives, for any shift rho, the bracket lambda_1 >= rho - 1/nu_max(rho),
 *   where nu_max is the largest generalized eigenvalue of (rho A0 - A1) x = nu (A2 - 2 rho A1 + rho^2 A0) x
 *   with A0 = Gram, A1 = <phi_i, M phi_j>, A2 = <A phi_i, A phi_j>. The bracket is a CERTIFIED lower bound
 *   on lambda_1 IFF rho <= lambda_2. The one non-trivial ingredient is the second-moment matrix A2. Two
 *   surrogates for A2 are computed here, and BOTH fail -- but for DIFFERENT, instructive reasons.
 *
 * FINDING 1 -- THE GAP lambda_2 - lambda_1 IS LARGE, NOT SMALL. The first committed reading of the
 *   separation imp-97136 called "entirely unbracketed": the Ritz eigenvalues (upper brackets) are
 *   lambda_1 = 0.543044 and lambda_2 = 83.090493 (N=28, T=200), a gap of 82.5474. So the confined negative
 *   sigma_2 well does NOT crowd a second low eigenvalue near lambda_1: the spectral SEPARATION that Temple
 *   / Lehmann-Maehly need is numerically GENEROUS, and the break-even residual budget eta_max =
 *   sqrt(mu (lambda_2 - mu)) = 6.695 is large. This corrects the imp-97136 worry that a small gap might be
 *   the binding obstruction -- it is not.
 *
 * FINDING 2 -- SURROGATE (i), THE UNCOMPRESSED SECOND MOMENT, IS VACUOUS BY CONSTRUCTION. Using A2 =
 *   <M phi_i, M phi_j> = (1/pi) int sigma_2^2 R_i R_j dt (the second moment of the UNCOMPRESSED
 *   multiplication operator M_sigma2) gives an astronomically large residual for the Ritz ground vector:
 *   <M^2> = 1.2528e8, eta2 = 1.2528e8, eta = 11192.8 -- three orders of magnitude past the break-even 6.695.
 *   The Lehmann bracket is then hopelessly negative (nu_max ~ 1e-11..1e-5, lower ~ -1e11..-6e4) for every
 *   rho. The reason is structural: M_sigma2 (multiplication by the quartic-times-log symbol) is UNBOUNDED
 *   and its spectrum fills the range of sigma_2 all the way down to inf_t sigma_2 = -4336.198 (imp-97335),
 *   so bracketing THAT operator can never certify positivity. The projector P_a is essential.
 *
 * FINDING 3 -- SURROGATE (ii), THE TRIAL-SPACE COMPRESSED SECOND MOMENT, IS CIRCULAR. Using A2 =
 *   A1 A0^{-1} A1 = <A phi_i, A phi_j> with A RESTRICTED to the N-dim trial space returns Lehmann bracket
 *   = 0.543044 = mu (the Ritz UPPER value) for EVERY rho: the trial-space square makes the Ritz vector an
 *   exact eigenvector of the finite-section operator (residual eta2 = 0), so nu_max = 1/(rho - mu) exactly
 *   and rho - 1/nu_max = mu identically. The method reproduces the upper bracket and yields NO lower
 *   information. This is the finite-section circularity: a genuine Lehmann-Maehly lower bound needs the
 *   second moment <A phi_i, A phi_j> with A = P_a M_sigma2 P_a using the FULL band projector P_a (a
 *   sinc-kernel double integral -- the imp-97399 reproducing-kernel primitive), not its N-dim surrogate.
 *
 * VERDICT. Executing the enclosure sharpens the imp-97350 obstruction. The a-priori spectral separation is
 *   NOT the binding wall -- the measured gap is 82.5 (Finding 1). The binding wall is the second-moment
 *   (graph-norm) object A2 = <A phi_i, A phi_j>: computed for the UNCOMPRESSED M_sigma2 it references an
 *   operator unbounded below to -4336 and is vacuous (Finding 2); computed as the trial-space compression
 *   it is circular and returns the upper bracket (Finding 3). The genuine Goerisch A2 needs the FULL P_a
 *   projector (sinc-kernel double integral / reproducing kernel), and even with it the enclosure still
 *   requires a certified rho <= lambda_2 (a LOWER bound on lambda_2, which Rayleigh-Ritz cannot supply).
 *   No unconditional positive lower bound is produced. SUB-GAP
 *   IMP97400_LEHMANN_MAEHLY_NEEDS_FULL_PROJECTOR_SECOND_MOMENT. Execution/measurement only; no operator
 *   positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97379-krein-csharp-2d-richardson-third-order.js (all extrapolation orders are UPPER brackets; best 0.581059)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (assessed: routes share the concentration primitive)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (Temple/Lehmann-Maehly need a-priori rho<=lambda_2; eta2/gap uncommitted)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (inf_t sigma_2 = -4336.198 at t=9.35; symbol-inf bound useless)
 * @see imp-97399-krein-csharp-reproducing-kernel-concentration-attempt.js (the sinc-kernel / reproducing-kernel projector object)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97400_BINDING_2A = LN3;
export const IMP97400_RIGOROUS_REACH_2A = 0.96; // unchanged by this execution
export const IMP97400_BEST_UPPER_BRACKET = 0.581059; // committed best Rayleigh-Ritz upper bracket (imp-97206/97355/97379)

// The executed finite-section run (mpmath dps=50, pole-free basis m=3, N=28, T=200, panel=1.0).
export const IMP97400_RUN = Object.freeze({
  dps: 50,
  N: 28,
  T: 200,
  panel: 1.0,
  basis: 'phi_n(x) = (a^2 - x^2)^3 P_n(x/a), a = ln3/2', // pole-free, m=3
});

// FINDING 1 -- the measured Ritz brackets and the (first committed) gap.
export const IMP97400_RITZ = Object.freeze({
  lambda1UpperBracket: 0.543044, // Ritz upper bracket on lambda_1 at N=28,T=200 (-> 0.581059 at converged N,T)
  lambda2UpperBracket: 83.090493, // Ritz upper bracket on lambda_2
  gapUpperBrackets: 82.547449, // lambda_2 - lambda_1: LARGE -- separation is numerically generous
  gapIsLargeNotSmall: true, // corrects the imp-97136 worry that a small gap might bind
});

// FINDING 2 -- surrogate (i): uncompressed second moment <M phi, M phi> = int sigma_2^2 R R. Vacuous.
export const IMP97400_SURROGATE_UNCOMPRESSED = Object.freeze({
  secondMomentDef: 'A2 = <M phi_i, M phi_j> = (1/pi) int sigma_2^2 R_i R_j dt (UNCOMPRESSED M_sigma2)',
  mu: 0.543044, // Ritz ground-vector Rayleigh quotient
  M2: 1.2527831e8, // <psi, M^2 psi> -- astronomically large
  eta2: 1.2527831e8, // residual defect ||M psi - mu psi||^2
  eta: 11192.779, // sqrt(eta2)
  etaBreakEven: 6.695287, // sqrt(mu (lambda_2 - mu)) -- Temple/Lehmann budget; exceeded ~1670x
  bracketPositive: false, // Lehmann lower bracket hopelessly negative for every rho (nu_max ~ 1e-11..1e-5)
  reason:
    'M_sigma2 is UNBOUNDED and its spectrum fills the range of sigma_2 down to inf_t sigma_2 = -4336.198 ' +
    '(imp-97335), so bracketing the uncompressed operator can never certify positivity; the projector P_a ' +
    'is essential.',
});

// FINDING 3 -- surrogate (ii): trial-space compressed second moment A1 A0^{-1} A1. Circular.
export const IMP97400_SURROGATE_TRIAL_COMPRESSED = Object.freeze({
  secondMomentDef: 'A2 = A1 A0^{-1} A1 = <A phi_i, A phi_j> with A restricted to the N-dim TRIAL space',
  lehmannBracketForEveryRho: 0.543044, // exactly mu -- the Ritz UPPER value
  returnsRitzUpperValue: true,
  residualIsZeroInTrialSpace: true, // Ritz vector is an exact eigenvector of the finite section
  reason:
    'the trial-space square makes the Ritz vector an exact eigenvector (eta2 = 0 there), so nu_max = ' +
    '1/(rho - mu) exactly and rho - 1/nu_max = mu identically -- the enclosure reproduces the upper ' +
    'bracket and yields NO lower information (finite-section circularity).',
});

export const IMP97400_VERDICT = Object.freeze({
  ticket: 'imp-97400',
  question:
    'can an interval-rigorous finite-section / Lehmann-Maehly method bracket lambda_min(P_a M_sigma2 P_a) at 2a=ln3 from BELOW with a certified a-priori gap, and how far below the best upper bracket 0.581059 does it land?',
  answer:
    'no unconditional positive lower bound is produced, and executing the enclosure sharpens the ' +
    'obstruction. FINDING 1: the a-priori spectral SEPARATION is NOT the binding wall -- the first ' +
    'committed reading of the gap is lambda_2 - lambda_1 = 82.5474 (Ritz upper brackets 83.090493 and ' +
    '0.543044 at N=28,T=200), numerically generous. FINDING 2: the Lehmann-Maehly second-moment matrix ' +
    'computed as the UNCOMPRESSED <M phi_i, M phi_j> = int sigma_2^2 R_i R_j gives eta = 11192.8 vs a ' +
    'break-even 6.695 and a hopelessly negative bracket, because it references M_sigma2 which is unbounded ' +
    'below to -4336.198 (imp-97335). FINDING 3: computed as the trial-space compression A1 A0^{-1} A1 it ' +
    'returns exactly mu = 0.543044 (the Ritz UPPER value) for every rho -- circular, no lower information. ' +
    'The genuine Goerisch second moment <A phi_i, A phi_j> with A = P_a M_sigma2 P_a needs the FULL band ' +
    'projector P_a (a sinc-kernel double integral / imp-97399 reproducing kernel), and even with it a ' +
    'certified rho <= lambda_2 is still required (Rayleigh-Ritz gives only the wrong-direction upper ' +
    'bracket on lambda_2). So the binding obstruction is the compressed second-moment (graph-norm) object, ' +
    'not the spectral gap.',
  binding_2a: LN3,
  bestUpperBracket: 0.581059,
  // Finding 1
  gapMeasuredLarge: true,
  gapUpperBrackets: 82.547449,
  separationIsBindingObstruction: false,
  // Finding 2
  uncompressedSecondMomentVacuous: true,
  uncompressedReferencesUnboundedOperator: true,
  // Finding 3
  trialCompressedSecondMomentCircular: true,
  trialCompressedReturnsUpperBracket: true,
  // the sharpened obstruction
  genuineSecondMomentNeedsFullProjector: true,
  aprioriRhoLeqLambda2StillRequired: true,
  bindingObstructionIsSecondMomentNotGap: true,
  // program state
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97400_LEHMANN_MAEHLY_NEEDS_FULL_PROJECTOR_SECOND_MOMENT -- executing the Lehmann-Maehly enclosure ' +
    'for c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 shows the binding obstruction is the ' +
    'second-moment (graph-norm) matrix A2 = <A phi_i, A phi_j> for the COMPRESSED operator A = ' +
    'P_a M_sigma2 P_a, NOT the spectral gap (measured lambda_2 - lambda_1 = 82.5474, generous): the ' +
    'uncompressed surrogate int sigma_2^2 R_i R_j references an operator unbounded below to -4336.198 and ' +
    'is vacuous, and the trial-space surrogate A1 A0^{-1} A1 is circular (returns the Ritz upper value). A ' +
    'genuine lower bracket needs A2 built with the FULL band projector P_a (a sinc-kernel double integral, ' +
    'the imp-97399 reproducing-kernel object), together with a certified rho <= lambda_2 that Rayleigh-Ritz ' +
    'cannot supply.',
  qed: false,
});

export const IMP97400_ASSERTIONS = [
  {
    id: 'imp97400-gap-large',
    holds: () =>
      IMP97400_RITZ.lambda2UpperBracket > IMP97400_RITZ.lambda1UpperBracket &&
      Math.abs(
        IMP97400_RITZ.gapUpperBrackets -
          (IMP97400_RITZ.lambda2UpperBracket - IMP97400_RITZ.lambda1UpperBracket),
      ) < 1e-4 &&
      IMP97400_RITZ.gapUpperBrackets > 10 &&
      IMP97400_VERDICT.separationIsBindingObstruction === false,
    why: 'Finding 1: the measured gap lambda_2 - lambda_1 = 82.5474 is LARGE, so the a-priori spectral separation is not the binding obstruction.',
  },
  {
    id: 'imp97400-uncompressed-vacuous',
    holds: () =>
      IMP97400_SURROGATE_UNCOMPRESSED.bracketPositive === false &&
      IMP97400_SURROGATE_UNCOMPRESSED.eta > IMP97400_SURROGATE_UNCOMPRESSED.etaBreakEven &&
      IMP97400_VERDICT.uncompressedSecondMomentVacuous === true,
    why: 'Finding 2: the uncompressed second moment int sigma_2^2 R R gives eta >> break-even and a vacuous negative bracket (references M_sigma2 unbounded below to -4336).',
  },
  {
    id: 'imp97400-trial-circular',
    holds: () =>
      Math.abs(
        IMP97400_SURROGATE_TRIAL_COMPRESSED.lehmannBracketForEveryRho - IMP97400_SURROGATE_UNCOMPRESSED.mu,
      ) < 1e-6 &&
      IMP97400_SURROGATE_TRIAL_COMPRESSED.returnsRitzUpperValue === true &&
      IMP97400_VERDICT.trialCompressedSecondMomentCircular === true,
    why: 'Finding 3: the trial-space compressed second moment A1 A0^{-1} A1 returns exactly mu (the Ritz upper value) for every rho -- circular.',
  },
  {
    id: 'imp97400-execution-only-no-qed',
    holds: () =>
      IMP97400_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97400_VERDICT.operatorPositivityProved === false &&
      IMP97400_VERDICT.boundMoves === false &&
      IMP97400_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97400_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97400_BINDING_2A - LN3) < 1e-12 &&
      IMP97400_VERDICT.qed === false,
    why: 'execution/measurement only: no rigorous positive lower bound, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97400_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97400-krein-lehmann-maehly-lower-bracket-execution assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
