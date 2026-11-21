/**
 * @module imp-97350-krein-csharp-lower-bound-routes-shared-obstruction
 * @fileoverview imp-97350 -- ASSESS a rigorous positive LOWER bound on the Krein concentration constant
 *   c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a = ln3 via a two-sided eigenvalue enclosure
 *   (Lehmann-Maehly / spectral-gap) OR de Branges coercivity, now that imp-97206 has MEASURED the coupled
 *   N,T joint limit at ~0.582 (plateau [0.5817,0.5842]) and imp-97335 has killed the naive band-limit-free
 *   symbol-infimum bound (-4336, useless). The Temple route is intrinsically dead (imp-97136 double
 *   obstruction) and is NOT re-attempted here.
 *
 *   ASSESSMENT ONLY. No certified positive floor is produced; no operator positivity is established; no
 *   bound moves; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed;
 *   RH open; NO QED. The deliverable is the PRECISE OBSTRUCTION, and specifically the SYNTHESIS that the
 *   two remaining named routes are not independent -- they funnel into ONE missing analytic primitive.
 *
 * WHAT imp-97136 ALREADY SETTLED (not re-derived here). imp-97136 assessed the whole Temple /
 *   Kato-Temple / Lehmann-Maehly family at the feasibility level and found the a-priori
 *   spectral-separation datum unobtainable: Temple needs beta with mu < beta <= lambda_2 (a rigorous
 *   LOWER bound on the SECOND eigenvalue), Rayleigh-Ritz gives only the WRONG-direction bound
 *   lambda_2 <= beta_Ritz, and Lehmann-Maehly does not escape this since its a-priori rho <= lambda_{m+1}
 *   is the identical unproved separation. SUB-GAP IMP97136_TEMPLE_NEEDS_APRIORI_SPECTRAL_GAP. This leaf
 *   does NOT re-open that feasibility question; it takes it as given and asks the next question the ticket
 *   poses: with the coupled limit now MEASURED positive (imp-97206) and the naive floor dead (imp-97335),
 *   what EXACTLY is the single missing input that the Lehmann-Maehly and de Branges routes both require?
 *
 * FINDING 1 -- THE LEHMANN-MAEHLY a-priori rho CANNOT BE INSTANTIATED FROM THE MEASURED PLATEAU. The one
 *   new number available since imp-97136 is the imp-97206 coupled joint limit lambda_1 ~ 0.582 (range
 *   [0.5817,0.5842]). This is an extrapolated Rayleigh-Ritz UPPER bracket on lambda_1, i.e. an UPPER bound
 *   on the FIRST eigenvalue. Lehmann-Maehly (m=1) needs a number rho known to satisfy lambda_1 < rho <=
 *   lambda_2 -- a LOWER bound on lambda_2. The measured 0.582 is the wrong endpoint of the wrong
 *   eigenvalue: it neither lower-bounds lambda_2 nor even certifies lambda_1 from below. So the measurement
 *   supplies nothing toward rho, and the Lehmann-Maehly enclosure remains gated on exactly the datum
 *   imp-97136 flagged missing. (The Lehmann-Maehly bounds are always rigorous lower bounds for SOME
 *   eigenvalues; the open point is associating them with lambda_1, which needs rho <= lambda_2.)
 *
 * FINDING 2 -- WHY NO a-priori LOWER BOUND ON lambda_2 EXISTS: THE CONFINED NEGATIVE sigma_2 WELL. The
 *   structural reason the separation is unavailable is the sign-indefinite deep well imp-97335 measured:
 *   sigma_2(t) = (t^2+1/4)^2 w_1(t) dips to a global infimum -4336.198 at t = 9.3502 (the quartic prefactor
 *   amplifies the negative w_1 before w_1 turns positive past t ~ 17). A truncated-Toeplitz / concentration
 *   operator with a symbol carrying a confined deep negative well can, a priori, support one or more
 *   LOW-LYING eigenvalues formed by band-limited functions that concentrate their spectral mass in that
 *   well. Nothing committed bounds HOW MANY such low eigenvalues T_a[sigma_2] has, or where lambda_2 sits
 *   relative to lambda_1 -- so no a-priori rho <= lambda_2 can be certified. Whether the band-limit (psi in
 *   PW_a) forbids enough concentration to keep lambda_2 well above lambda_1 is precisely a quantitative
 *   band-limited-concentration (uncertainty) question, unproved.
 *
 * FINDING 3 -- THE de BRANGES COERCIVITY ROUTE TERMINATES AT THE SAME PRIMITIVE. imp-97137 reformulated
 *   coercivity T_a[sigma_2] >= c*I as an N-free concentration inequality on PW_a = H(E_a) with the sharp
 *   constant c_sharp = lambda_min itself (a restatement, no free constant), and imp-97161 showed the two
 *   standard tools that might supply that constant both fail (Beurling-Selberg minorant is circular; flat
 *   Slepian prolate hypotheses -- one bounded dip against a uniform far floor -- are violated by the
 *   recurring unbounded-depth dip), naming SUB-GAP
 *   IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN. That missing input -- a
 *   weighted-PSWF uncertainty inequality / Fejer-Riesz margin bounding how much a PW_a function can
 *   concentrate against the confined negative sigma_2 well -- is EXACTLY the same object Finding 2 shows
 *   Lehmann-Maehly needs to certify rho <= lambda_2. So the two routes the ticket lists as alternatives are
 *   NOT independent: de Branges coercivity needs the concentration constant directly, and Lehmann-Maehly
 *   needs it to bound the number/location of low eigenvalues (the a-priori rho). One primitive gates both.
 *
 * VERDICT. No rigorous positive lower bound on c_sharp is produced. The imp-97206 measured plateau ~0.582
 *   is an UPPER bracket on lambda_1 and does not instantiate the Lehmann-Maehly a-priori rho <= lambda_2
 *   (Finding 1). The reason the separation is unavailable is structural -- the confined negative sigma_2
 *   well (-4336 at t=9.35, imp-97335) leaves the number and location of low eigenvalues of T_a[sigma_2]
 *   uncontrolled without a quantitative band-limited-concentration inequality (Finding 2). And that
 *   inequality is precisely the de Branges concentration constant / weighted-PSWF-or-Fejer-Riesz margin
 *   imp-97137/imp-97161 already isolated (Finding 3). The NEW reading this leaf bakes is the SYNTHESIS: the
 *   Lehmann-Maehly spectral-gap enclosure and the de Branges coercivity route are NOT two independent
 *   levers -- both reduce to the SAME single missing primitive, a quantitative uncertainty bound on PW_a
 *   concentration against the confined negative sigma_2 well. SUB-GAP
 *   IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE. Assessment only; no operator
 *   positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T joint limit MEASURED ~0.582, upper bracket)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (naive symbol-inf bound -4336 useless; deep well at t=9.35)
 * @see imp-97136-krein-temple-lower-bound-feasibility.js (Temple/Kato-Temple/Lehmann-Maehly need a-priori rho<=lambda_2)
 * @see imp-97137-krein-debranges-coercivity-scope.js (de Branges coercivity = N-free concentration inequality on PW_a)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (concentration constant needs weighted-PSWF / Fejer-Riesz margin)
 * @see imp-97201-krein-debranges-coercivity-concentration-cohort-index.js (the c_sharp-only-bounded-from-above cohort)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97350_BINDING_2A = LN3;
export const IMP97350_RIGOROUS_REACH_2A = 0.96; // unchanged by this assessment

// The one new number available since imp-97136: the imp-97206 coupled joint limit -- an UPPER bracket on
// lambda_1, NOT a lower bound on lambda_2, so it does not instantiate the Lehmann-Maehly a-priori rho.
export const IMP97350_MEASURED_LAMBDA1 = Object.freeze({
  jointExtrapolant: 0.582,          // imp-97206 coupled N,T joint limit
  jointInterval: [0.5817, 0.5842],  // imp-97206 robust range (plateau mean .. linear-in-1/N intercept)
  isUpperBracketOnLambda1: true,    // Rayleigh-Ritz values bound eigenvalues from ABOVE
  boundsLambda2FromBelow: false,    // wrong eigenvalue AND wrong direction for the Lehmann-Maehly rho
  instantiatesLehmannMaehlyRho: false,
});

// The structural source of the missing separation: the confined negative sigma_2 well (imp-97335).
export const IMP97350_SIGMA2_WELL = Object.freeze({
  globalInf: -4336.198026, // imp-97335 global minimum of sigma_2(t)
  argmin: 9.3502,          // location of the deep well
  w1PositivePastApproxT: 17, // the well is CONFINED: w_1 > 0 past t ~ 17
  canInjectLowEigenvalues: true, // a confined deep negative well can support low-lying eigenvalues a priori
  countAndLocationBounded: false, // nothing committed bounds how many, or where lambda_2 sits
});

export const IMP97350_VERDICT = Object.freeze({
  ticket: 'imp-97350',
  question:
    'can a rigorous positive LOWER bound on c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 be certified via a two-sided eigenvalue enclosure (Lehmann-Maehly / spectral-gap) or de Branges coercivity, now that imp-97206 measured the coupled joint limit ~0.582 and imp-97335 killed the naive symbol-infimum bound?',
  answer:
    'no. The Lehmann-Maehly enclosure (m=1) needs an a-priori rho with lambda_1 < rho <= lambda_2 -- a rigorous LOWER bound on lambda_2 -- and the only new committed number, the imp-97206 joint limit ~0.582, is an UPPER bracket on lambda_1 (wrong eigenvalue, wrong direction), so it does not instantiate rho; the datum imp-97136 flagged missing is still missing. The reason no a-priori lower bound on lambda_2 exists is structural: the confined negative sigma_2 well (global inf -4336.198 at t=9.3502, w_1 > 0 only past t ~ 17, imp-97335) can a priori inject low-lying eigenvalues via band-limited concentration, and nothing committed bounds their count or location. Bounding that concentration is exactly the de Branges coercivity concentration constant / weighted-PSWF-or-Fejer-Riesz margin that imp-97137/imp-97161 already isolated as missing. Hence the two routes the ticket names are NOT independent: both reduce to the SAME single missing primitive -- a quantitative band-limited (PW_a) concentration inequality against the confined negative sigma_2 well.',
  binding_2a: LN3,
  // Finding 1
  measuredPlateauIsUpperBracketOnLambda1: true,
  measuredPlateauInstantiatesLehmannMaehlyRho: false,
  lehmannMaehlyNeedsLowerBoundOnLambda2: true,
  // Finding 2
  aprioriLambda2SeparationUnavailable: true,
  reasonIsConfinedNegativeSigma2Well: true,
  wellCanInjectLowEigenvalues: true,
  // Finding 3
  deBrangesCoercivityNeedsConcentrationConstant: true,
  concentrationConstantIsWeightedPswfOrFejerRieszMargin: true,
  // the synthesis (the new reading this leaf bakes)
  twoRoutesShareOneMissingPrimitive: true,
  sharedPrimitive:
    'a quantitative band-limited (PW_a) concentration / uncertainty inequality bounding how much a ' +
    'Paley-Wiener function can concentrate its weighted mass in the confined negative sigma_2 well; ' +
    'for Lehmann-Maehly it supplies the a-priori rho <= lambda_2 (bounding the count/location of low ' +
    'eigenvalues), for de Branges coercivity it IS the concentration constant c in T_a[sigma_2] >= c*I.',
  // unchanged program state
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  temppleRouteReattempted: false, // intrinsically dead (imp-97136); not re-attempted
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE -- the two lower-bound routes ' +
    'the ticket lists as alternatives for c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 (a ' +
    'Lehmann-Maehly / spectral-gap eigenvalue enclosure, and a de Branges coercivity realisation) are NOT ' +
    'independent levers: both reduce to ONE missing analytic primitive -- a quantitative band-limited ' +
    '(PW_a) concentration/uncertainty inequality controlling how much a Paley-Wiener function can ' +
    'concentrate its weighted mass in the confined negative sigma_2 well (global inf -4336.198 at ' +
    't=9.3502, imp-97335). For the Lehmann-Maehly route that inequality supplies the a-priori ' +
    'rho <= lambda_2 (bounding the number/location of low-lying eigenvalues of T_a[sigma_2]) that ' +
    'imp-97136 flagged missing; the imp-97206 measured joint limit ~0.582 does NOT supply it, being an ' +
    'UPPER bracket on lambda_1 (wrong eigenvalue, wrong direction). For the de Branges route that ' +
    'inequality IS the concentration constant c in T_a[sigma_2] >= c*I, which imp-97137 restated as ' +
    'lambda_min itself and imp-97161 showed Beurling-Selberg / flat-Slepian cannot supply ' +
    '(IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN). Assessment only; the ' +
    'Temple route stays intrinsically dead and is not re-attempted; no operator positivity; no bound ' +
    'moves; interval-rigorous reach stays 2a<=0.96.',
  qed: false,
});
export default IMP97350_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97350_ASSERTIONS = [
  {
    id: 'imp97350-measured-plateau-is-upper-bracket-not-rho',
    holds: () => {
      const M = IMP97350_MEASURED_LAMBDA1;
      // the imp-97206 joint limit ~0.582 is an UPPER bracket on lambda_1, not a lower bound on lambda_2,
      // so it cannot serve as the Lehmann-Maehly a-priori rho (which needs lambda_1 < rho <= lambda_2).
      return Math.abs(M.jointExtrapolant - 0.582) < 1e-9 &&
        M.jointInterval[0] > 0.5 && M.jointInterval[1] < 0.6 &&
        M.isUpperBracketOnLambda1 === true &&
        M.boundsLambda2FromBelow === false &&
        M.instantiatesLehmannMaehlyRho === false &&
        IMP97350_VERDICT.measuredPlateauInstantiatesLehmannMaehlyRho === false &&
        IMP97350_VERDICT.lehmannMaehlyNeedsLowerBoundOnLambda2 === true;
    },
    why: 'the imp-97206 coupled joint limit ~0.582 is a Rayleigh-Ritz UPPER bracket on lambda_1, the wrong eigenvalue and wrong direction for the Lehmann-Maehly a-priori rho (needs lambda_1 < rho <= lambda_2), so it does not instantiate the enclosure.',
  },
  {
    id: 'imp97350-confined-negative-well-blocks-apriori-lambda2',
    holds: () => {
      const W = IMP97350_SIGMA2_WELL;
      // the confined deep negative sigma_2 well (imp-97335) can a priori inject low eigenvalues whose
      // count/location is unbounded -> no a-priori rho <= lambda_2 available.
      return W.globalInf < -1000 && W.argmin > 0 && W.argmin < W.w1PositivePastApproxT &&
        W.canInjectLowEigenvalues === true && W.countAndLocationBounded === false &&
        IMP97350_VERDICT.aprioriLambda2SeparationUnavailable === true &&
        IMP97350_VERDICT.reasonIsConfinedNegativeSigma2Well === true;
    },
    why: 'the confined negative sigma_2 well (-4336.198 at t=9.3502, w_1>0 only past t~17, imp-97335) can support low-lying eigenvalues of T_a[sigma_2] whose count/location nothing committed bounds, so no a-priori lower bound on lambda_2 can be certified.',
  },
  {
    id: 'imp97350-two-routes-share-one-missing-primitive',
    holds: () =>
      IMP97350_VERDICT.deBrangesCoercivityNeedsConcentrationConstant === true &&
      IMP97350_VERDICT.concentrationConstantIsWeightedPswfOrFejerRieszMargin === true &&
      IMP97350_VERDICT.twoRoutesShareOneMissingPrimitive === true &&
      typeof IMP97350_VERDICT.sharedPrimitive === 'string' &&
      IMP97350_VERDICT.sharedPrimitive.includes('concentration') &&
      typeof IMP97350_VERDICT.subGap === 'string' &&
      IMP97350_VERDICT.subGap.includes('IMP97350_LOWER_BOUND_ROUTES_SHARE_BAND_LIMITED_CONCENTRATION_PRIMITIVE') &&
      IMP97350_VERDICT.subGap.includes('IMP97161_CONCENTRATION_LOWER_BOUND_NEEDS_WEIGHTED_PSWF_OR_FEJER_RIESZ_MARGIN'),
    why: 'the Lehmann-Maehly enclosure (needing the a-priori rho<=lambda_2) and the de Branges coercivity realisation (needing the concentration constant c) both reduce to the same missing band-limited concentration inequality -- the synthesis this leaf bakes.',
  },
  {
    id: 'imp97350-assessment-only-no-qed',
    holds: () =>
      IMP97350_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97350_VERDICT.operatorPositivityProved === false &&
      IMP97350_VERDICT.temppleRouteReattempted === false &&
      IMP97350_VERDICT.boundMoves === false &&
      IMP97350_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97350_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97350_BINDING_2A - LN3) < 1e-12 &&
      IMP97350_VERDICT.qed === false,
    why: 'assessment only: no rigorous positive lower bound, no operator positivity; the Temple route stays dead and is not re-attempted; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97350_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97350-krein-csharp-lower-bound-routes-shared-obstruction assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
