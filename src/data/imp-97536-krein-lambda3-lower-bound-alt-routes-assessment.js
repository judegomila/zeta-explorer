/**
 * @module imp-97536-krein-lambda3-lower-bound-alt-routes-assessment
 * @fileoverview imp-97536 -- is a certified LOWER bound on lambda_3 of A = P_a M_sigma2 P_a exceeding the
 *   Ritz upper bracket 83.090493 (the m=2 Lehmann-Maehly gate at 2a = ln3) reachable by ANY route other than
 *   the index-blind Route-2 recursion, e.g. a min-max on a certified-positive test subspace, a Weyl/Lidskii
 *   interlacing bound, or a truncated positive-definite compression? imp-97514 (sub-gap
 *   IMP97514_M2_WINDOW_SHIFT_IN_WRONG_GAP_AMPLIFIES_UNBOUNDED_TAIL) showed the m=2 window shift rho_2 must live
 *   in the ~5434-wide (lambda_2, lambda_3) gap and needs exactly this certified-lower-on-lambda_3, but the
 *   Route-2 Lehmann recursion shares the imp-97415 concentration wall one index up (index-blind symbol infimum
 *   -4336.198, never a positive rho_2). This leaf assesses whether a DIFFERENT route escapes that wall.
 *
 *   ASSESSMENT / DERIVATION only. No certified positive lower bound on lambda_3 is produced; no operator
 *   positivity is established; the m=2 gate stays unreachable at 2a = ln3; no bound on Lambda moves; interval-
 *   rigorous reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * SETUP -- WHAT THE m=2 GATE REQUIRES. A = P_a M_sigma2 P_a is self-adjoint, unbounded ABOVE (sigma_2 ~ t^4 log t,
 *   imp-97414), with a CONFINED negative well on [0, 3.306] u [6.945, 10.532] (right edge 10.532, imp-97501) and a
 *   rigorously-positive far field beyond t0 = 27. Write A = C - B with C = P_a M_{sigma2^+} P_a >= 0 and
 *   B = P_a M_{sigma2^-} P_a >= 0; ||B|| <= sup_t sigma_2^-(t) = -inf_t sigma_2(t) = 4336.198 (imp-97335, argmin
 *   t = 9.3502). The m=2 gate needs a CERTIFIED lower bound on lambda_3(A) exceeding the Ritz upper bracket on
 *   lambda_2, 83.090493, so that a valid shift rho_2 in (lambda_2, lambda_3) exists.
 *
 * ROUTE A -- MIN-MAX ON A CERTIFIED-POSITIVE TEST SUBSPACE. The Courant-Fischer LOWER form is
 *   lambda_3(A) = max over 2-dim W of min_{f perp W} R_A(f). A certified lower bound therefore requires
 *   controlling the Rayleigh quotient on the ORTHOGONAL COMPLEMENT of a chosen 2-dim W -- an
 *   infinite-dimensional band-limited family that still contains functions concentrated on the confined well
 *   near t ~ 9.35, so inf_{f perp W} R_A(f) >= -||B|| = -4336.198 and no better. Choosing instead a POSITIVE
 *   test subspace and evaluating R_A on it delivers the min-max UPPER form (lambda_3(A) <= max over a 3-dim V of
 *   min ... ) -- i.e. a Rayleigh-Ritz UPPER bracket, the WRONG direction (this is exactly what already produced
 *   lambda_2 <= 83.090493). Route A yields upper brackets, never a certified lower bound.
 *
 * ROUTE B -- WEYL / LIDSKII INTERLACING (the one genuinely distinct structural handle). Weyl's inequality for
 *   A = C + (-B) in increasing-order convention gives lambda_{i+j-1}(A) >= lambda_i(C) + lambda_j(-B). To lower
 *   bound lambda_3(A) one may take (i=1, j=3): lambda_3(A) >= lambda_1(C) + lambda_3(-B) = lambda_1(C) -
 *   lambda_third-largest(B). This is NOT index-blind: it subtracts the THIRD-LARGEST eigenvalue of B, not ||B||.
 *   Because the negative well is CONFINED (total width 3.306 + 3.587 = 6.893) and the 2a = ln3 band limit caps
 *   the effective dimension at the time-bandwidth product (2a/pi) * 6.893 ~ 2.41, B has only ~2-3 well-carrying
 *   eigenvalues; skipping past them via j=3 could in principle leave a much smaller subtraction. THIS IS THE MOST
 *   PROMISING alternative. BUT it is not currently reachable: it needs a CERTIFIED upper bound on the
 *   third-largest eigenvalue of B, i.e. a rigorous band-limited concentration (prolate-spectrum) estimate for the
 *   confined well. The band-limited eigenfunctions are fractal/Zygmund (dyadic-truncated grids unusable), and no
 *   |lambda| shoulder cut-off has been certified, so lambda_third-largest(B) is bracketed only by ||B|| = 4336.198.
 *   Route B thus DEFERS to the same missing primitive -- the concentration wall accessed through B's sub-top
 *   spectrum -- rather than escaping it.
 *
 * ROUTE C -- TRUNCATED POSITIVE-DEFINITE COMPRESSION. A finite-dim compression A_S = P_S A P_S obeys Cauchy
 *   interlacing lambda_k(A) <= mu_k(A_S) <= lambda_{k + codim}(A): its eigenvalues are UPPER bounds on lambda_k,
 *   not lower. That the compressed block is positive-definite certifies the form is positive on S (a Ritz upper
 *   bracket on the lowest eigenvalues), NOT a lower bound on lambda_3. Recovering a lower bound would require
 *   bounding the DISCARDED complement, which carries both the unbounded-above tail and the negative well --
 *   reintroducing the wall. Route C points the wrong direction.
 *
 * COMMON OBSTRUCTION. Every lower bound on any eigenvalue of A = C - B must control the negative part B, whose
 *   spectrum carries the confined-well mass. Routes A and C are Ritz-type and produce UPPER brackets (wrong
 *   direction). Route B (Weyl/Lidskii) is the only structurally distinct handle -- it refines operator domination
 *   by index and could exploit B's O(1) effective dimension -- but reduces to a certified upper bound on B's
 *   sub-top (third-largest) eigenvalue, the same band-limited concentration/prolate estimate the program lacks.
 *   Any route that DID certify lambda_3 > 83.09 (hence lambda_2 <= lambda_3 with lambda_2 Ritz-upper 83.09, gating
 *   m=2) would constitute the operator-positivity certificate on the well the whole program is missing -- circular
 *   in the imp-97415 ROUTE 3 sense.
 *
 * VERDICT. No route other than the index-blind Route-2 recursion currently certifies lambda_3(A) > 83.090493 at
 *   2a = ln3. The min-max-positive-subspace and truncated-PD-compression routes are Rayleigh-Ritz upper brackets
 *   (wrong direction). Weyl/Lidskii interlacing is the one genuinely distinct structural handle -- it subtracts
 *   the third-largest eigenvalue of B rather than ||B||, and the confined well plus 2a = ln3 band limit caps B at
 *   ~2-3 well-carrying modes -- but it defers to a CERTIFIED upper bound on B's third-largest eigenvalue, i.e. a
 *   rigorous band-limited concentration estimate for the confined well, which is the same concentration wall one
 *   step over. The m=2 gate is therefore structurally unreachable by the assessed alternatives; the productive
 *   residual is not Route-2 but a certified sub-top spectral bound on B. SUB-GAP
 *   IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM. No operator positivity; no bound moves;
 *   interval-rigorous reach stays 2a <= 0.96; RH open; NO QED.
 *
 * @see imp-97514-krein-m2-window-enclosure-assessment.js (m=2 window needs certified lower on lambda_3; sub-gap source)
 * @see imp-97415-krein-lambda2-certified-lower-bound-assessment.js (Route 1/2/3 for lambda_2; concentration wall)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (symbol infimum inf_t sigma_2 = -4336.198 at t=9.3502)
 * @see imp-97501-sigma2-far-field-positivity-rigorous-margin.js (confined well [0,3.306]u[6.945,10.532], right edge 10.532)
 * @see imp-97414-krein-full-projector-second-moment-execution.js (sigma_2 ~ t^4 log t, unbounded above)
 *
 * Ticket: imp-97536 (proof, opus-4-8, api-pool). Assessment/derivation only; no certified lower bound on
 * lambda_3; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681096 -- the binding 2a for the Krein / c_sharp floor
export const IMP97536_BINDING_2A = LN3;
export const IMP97536_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// The gate inputs the m=2 window turns on (Ritz brackets N=28, T=200; symbol infimum imp-97335).
export const IMP97536_GATE_INPUTS = Object.freeze({
  lambda2UpperBracket: 83.090493, // Ritz UPPER bracket on lambda_2 -- any rho_2 > this is above the true lambda_2
  lambda3UpperBracket: 5516.954964, // Ritz UPPER bracket on lambda_3 (imp-97495)
  requiredLambda3Exceeds: 83.090493, // the m=2 gate: a CERTIFIED lower bound on lambda_3 must exceed this
  symbolInfimum: -4336.198026, // inf_t sigma_2(t) at t=9.3502 (imp-97335); = -||M_{sigma2^-}|| = -||B|| ceiling
  wellIntervals: '[0, 3.306] u [6.945, 10.532]', // confined negative well (imp-97501)
  wellTotalWidth: 3.306 + (10.532 - 6.945), // 6.893
  bandLimit2a: LN3, // 2a = ln3
  wellTimeBandwidthProduct: (LN3 / Math.PI) * (3.306 + (10.532 - 6.945)), // ~2.41 -> B has ~2-3 well-carrying modes
});

// ROUTE A -- min-max on a certified-positive test subspace. Lower form controls the COMPLEMENT (wall); positive
// test subspace gives the UPPER form (Ritz bracket, wrong direction).
export const IMP97536_ROUTE_A_MINMAX_POSITIVE_SUBSPACE = Object.freeze({
  lowerForm: 'lambda_3(A) = max over 2-dim W of min_{f perp W} R_A(f) -- controls the complement, not a chosen subspace',
  complementReachesWall: true, // f perp W still contains well-concentrated band-limited functions -> inf R_A >= -||B||
  positiveSubspaceGivesUpperBracket: true, // evaluating R_A on a chosen positive subspace = Rayleigh-Ritz upper form
  direction: 'upper', // wrong direction for a lower bound
  usable: false,
});

// ROUTE B -- Weyl / Lidskii interlacing. The ONE genuinely distinct handle: subtracts B's third-largest
// eigenvalue, not ||B||, and could exploit B's O(1) effective dimension -- but needs a certified sub-top bound on B.
export const IMP97536_ROUTE_B_WEYL_LIDSKII = Object.freeze({
  inequality: 'lambda_{i+j-1}(A) >= lambda_i(C) + lambda_j(-B); (i=1,j=3): lambda_3(A) >= lambda_1(C) - lambda_3rd-largest(B)',
  indexBlind: false, // subtracts the THIRD-LARGEST eigenvalue of B, not the operator norm ||B||
  exploitsConfinedWellDimension: true, // 2a=ln3 band limit caps B at ~2-3 well-carrying modes (TBW ~ 2.41)
  mostPromisingAlternative: true,
  requiresCertifiedBSubTopBound: true, // needs a certified UPPER bound on lambda_3rd-largest(B)
  reducesToConcentrationEstimate: true, // = rigorous band-limited prolate-spectrum estimate for the confined well
  bandLimitedEigenfunctionsFractal: true, // fractal/Zygmund; dyadic-truncated grids unusable; no |lambda| shoulder certified
  currentlyReachable: false, // absent that certificate, lambda_3rd-largest(B) is bracketed only by ||B||=4336.198
  usable: false,
});

// ROUTE C -- truncated positive-definite compression. Cauchy interlacing -> UPPER bounds; PD block = Ritz bracket.
export const IMP97536_ROUTE_C_PD_COMPRESSION = Object.freeze({
  cauchyInterlacing: 'lambda_k(A) <= mu_k(P_S A P_S) <= lambda_{k+codim}(A) -- compression eigenvalues are UPPER bounds',
  pdBlockMeaning: 'positive-definite block certifies the form is positive on S (Ritz upper bracket), NOT a lower bound',
  discardedComplementCarriesWall: true, // recovering a lower bound needs bounding the tail + well = the wall
  direction: 'upper', // wrong direction
  usable: false,
});

export const IMP97536_VERDICT = Object.freeze({
  ticket: 'imp-97536',
  question:
    'is a certified lower bound on lambda_3 of A = P_a M_sigma2 P_a exceeding 83.090493 (the m=2 Lehmann-Maehly gate at 2a=ln3) reachable by any route other than the index-blind Route-2 recursion -- min-max on a certified-positive test subspace, a Weyl/Lidskii interlacing bound, or a truncated positive-definite compression?',
  answer:
    'no route currently reaches it. ROUTE A (min-max on a positive test subspace) and ROUTE C (truncated ' +
    'positive-definite compression) are both Rayleigh-Ritz constructions that produce UPPER brackets on the low ' +
    'eigenvalues (the wrong direction): the min-max LOWER form controls the orthogonal complement, which still ' +
    'contains well-concentrated band-limited functions (inf R_A >= -||B|| = -4336.198), and Cauchy interlacing ' +
    'makes a compression an upper bound. ROUTE B (Weyl/Lidskii interlacing) is the ONE genuinely distinct handle: ' +
    'lambda_3(A) >= lambda_1(C) - lambda_third-largest(B) subtracts B third-largest eigenvalue rather than ' +
    '||B||, and the confined well (width 6.893) under the 2a=ln3 band limit (time-bandwidth product ~2.41) leaves ' +
    'B with only ~2-3 well-carrying modes, so skipping past them via j=3 could shrink the subtraction. But it ' +
    'DEFERS to a certified upper bound on B third-largest eigenvalue -- a rigorous band-limited concentration ' +
    '(prolate-spectrum) estimate for the confined well, whose eigenfunctions are fractal/Zygmund and whose ' +
    'spectral shoulder has never been certified -- so lambda_third-largest(B) stays bracketed only by ||B|| = ' +
    '4336.198. Any route that DID certify lambda_3 > 83.09 would itself be the missing operator-positivity ' +
    'certificate on the well (circular, imp-97415 ROUTE 3). The m=2 gate is thus structurally unreachable by the ' +
    'assessed alternatives; the productive residual is a certified sub-top spectral bound on B, not Route-2.',
  binding_2a: LN3,
  requiredLambda3Exceeds: 83.090493,
  routeAUpperBracketWrongDirection: true,
  routeCUpperBracketWrongDirection: true,
  routeBIsDistinctHandle: true,
  routeBReducesToCertifiedBSubTopSpectrum: true,
  anyRouteReachesGate: false,
  m2GateStructurallyUnreachableByAlternatives: true,
  productiveResidualIsBSubTopSpectrum: true,
  subGap:
    'IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM -- certifying lambda_3(A) > 83.09 for the m=2 ' +
    'gate at 2a=ln3 is not reachable by min-max on a positive test subspace or a truncated PD compression (both ' +
    'Ritz UPPER brackets, wrong direction). Weyl/Lidskii interlacing is the one structurally distinct handle -- it ' +
    'subtracts B THIRD-LARGEST eigenvalue, not ||B||, and the confined well under the ln3 band limit leaves B ' +
    'with only ~2-3 well-carrying modes -- but it reduces to a CERTIFIED upper bound on B third-largest ' +
    'eigenvalue, i.e. a rigorous band-limited concentration/prolate estimate for the confined well (fractal/Zygmund ' +
    'eigenfunctions, no certified shoulder). That is the concentration wall one step over; the productive residual ' +
    'is B sub-top spectrum, not the index-blind Route-2 recursion.',
  // program state
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

export const IMP97536_HONEST_BANNER =
  'imp-97536 assessment: a certified lower bound on lambda_3 exceeding 83.09 (the m=2 Lehmann-Maehly gate at ' +
  '2a=ln3) is NOT reachable by any assessed route other than the index-blind Route-2 recursion. Min-max on a ' +
  'positive test subspace and a truncated positive-definite compression are Rayleigh-Ritz UPPER brackets (wrong ' +
  'direction). Weyl/Lidskii interlacing is the one genuinely distinct handle -- it subtracts B third-largest ' +
  'eigenvalue rather than ||B||=4336.198, and the confined well under the ln3 band limit leaves B with only ~2-3 ' +
  'well-carrying modes -- but it reduces to a CERTIFIED upper bound on B third-largest eigenvalue, a rigorous ' +
  'band-limited concentration estimate for the confined well (fractal/Zygmund eigenfunctions, no certified ' +
  'shoulder). That is the concentration wall one step over. The productive residual is B sub-top spectrum, not ' +
  'Route-2. No operator positivity; no bound on Lambda moves; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97536_ASSERTIONS = [
  {
    id: 'imp97536-routes-A-C-are-upper-brackets',
    holds: () =>
      IMP97536_ROUTE_A_MINMAX_POSITIVE_SUBSPACE.direction === 'upper' &&
      IMP97536_ROUTE_A_MINMAX_POSITIVE_SUBSPACE.positiveSubspaceGivesUpperBracket === true &&
      IMP97536_ROUTE_A_MINMAX_POSITIVE_SUBSPACE.usable === false &&
      IMP97536_ROUTE_C_PD_COMPRESSION.direction === 'upper' &&
      IMP97536_ROUTE_C_PD_COMPRESSION.discardedComplementCarriesWall === true &&
      IMP97536_ROUTE_C_PD_COMPRESSION.usable === false,
    why: 'min-max on a positive test subspace and a truncated PD compression are both Rayleigh-Ritz upper brackets on the low eigenvalues -- the wrong direction for a certified lower bound on lambda_3.',
  },
  {
    id: 'imp97536-weyl-distinct-but-reduces-to-B-subtop',
    holds: () =>
      IMP97536_ROUTE_B_WEYL_LIDSKII.indexBlind === false &&
      IMP97536_ROUTE_B_WEYL_LIDSKII.exploitsConfinedWellDimension === true &&
      IMP97536_ROUTE_B_WEYL_LIDSKII.mostPromisingAlternative === true &&
      IMP97536_ROUTE_B_WEYL_LIDSKII.requiresCertifiedBSubTopBound === true &&
      IMP97536_ROUTE_B_WEYL_LIDSKII.reducesToConcentrationEstimate === true &&
      IMP97536_ROUTE_B_WEYL_LIDSKII.currentlyReachable === false &&
      IMP97536_ROUTE_B_WEYL_LIDSKII.usable === false,
    why: 'Weyl/Lidskii subtracts B third-largest eigenvalue not ||B|| and could exploit B O(1) effective dimension, but reduces to a certified sub-top bound on B (a band-limited concentration estimate) that is not currently reachable.',
  },
  {
    id: 'imp97536-confined-well-tbw-order-one',
    holds: () =>
      Math.abs(IMP97536_GATE_INPUTS.wellTotalWidth - 6.893) < 1e-9 &&
      IMP97536_GATE_INPUTS.wellTimeBandwidthProduct > 2 &&
      IMP97536_GATE_INPUTS.wellTimeBandwidthProduct < 3 &&
      IMP97536_GATE_INPUTS.symbolInfimum < 0,
    why: 'the confined well (total width 6.893) under the 2a=ln3 band limit has time-bandwidth product ~2.41 -> B has only ~2-3 well-carrying modes, motivating (but not certifying) the Weyl index-skip.',
  },
  {
    id: 'imp97536-verdict-no-alternative-reaches-gate',
    holds: () =>
      IMP97536_VERDICT.anyRouteReachesGate === false &&
      IMP97536_VERDICT.routeAUpperBracketWrongDirection === true &&
      IMP97536_VERDICT.routeCUpperBracketWrongDirection === true &&
      IMP97536_VERDICT.routeBReducesToCertifiedBSubTopSpectrum === true &&
      IMP97536_VERDICT.m2GateStructurallyUnreachableByAlternatives === true &&
      IMP97536_VERDICT.productiveResidualIsBSubTopSpectrum === true &&
      IMP97536_VERDICT.requiredLambda3Exceeds === IMP97536_GATE_INPUTS.lambda2UpperBracket &&
      /IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM/.test(IMP97536_VERDICT.subGap),
    why: 'the verdict must record that no assessed alternative reaches the gate, routes A/C are upper brackets, Weyl/Lidskii reduces to a certified B sub-top spectral bound, and the named sub-gap is present.',
  },
  {
    id: 'imp97536-assessment-only-no-qed',
    holds: () =>
      IMP97536_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97536_VERDICT.operatorPositivityProved === false &&
      IMP97536_VERDICT.boundMoves === false &&
      IMP97536_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97536_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97536_BINDING_2A - LN3) < 1e-12 &&
      IMP97536_VERDICT.qed === false &&
      /NO QED/.test(IMP97536_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97536_HONEST_BANNER) &&
      /RH open/.test(IMP97536_HONEST_BANNER),
    why: 'assessment/derivation only: no certified lower bound on lambda_3, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; no-refereed-bound-change line present; RH open; NO QED.',
  },
];

for (const a of IMP97536_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97536-krein-lambda3-lower-bound-alt-routes-assessment assertion FAILED: ${a.id} -- ${a.why}`);
  }
}

export default { verdict: IMP97536_VERDICT, banner: IMP97536_HONEST_BANNER };
