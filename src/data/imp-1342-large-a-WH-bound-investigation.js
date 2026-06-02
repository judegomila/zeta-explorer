// @module data/imp-1342-large-a-WH-bound-investigation
// imp-1342 -- CRITICAL rigor-honesty audit: reconcile the imp-1287
// Wiener-Hopf (WH) bound, which claimed ||V_{a,Phi}|| <= ||Phi||^2_inf / a for
// ALL a > 0 (closure of Conj 27.2 for a >= 0.1996), with the imp-1316 large-a
// empirical sweep, which found ||V_{50,Phi}|| >= 53.16 > 1 -- a contradiction
// of ~10^4.
//
// PARENT TICKETS
// --------------
// imp-1287 (WH route 4): claimed ||K_a|| <= 1/a from the imaginary-axis value
//   of the Laplace symbol L[k_a](z) = a/(z^2 - a^2), hence
//   ||V_{a,Phi}|| <= ||Phi||^2_inf / a, closing Conj 27.2 for a >= ||Phi||^2_inf
//   ~ 0.1996, and (combined with the HS bound for a <= 37.66) for ALL a > 0.
// imp-1316 (large-a empirical sweep): rigorous Galerkin LOWER bounds give
//   ||V_{50,Phi}|| >= 53.16 and ||V_{100,Phi}|| >= 2.76e11 -- both > 1.
//
// The two cannot both be right. The ticket asks: is it (i) the WH bound has an
// error, (ii) the empirical computation has numerical issues, or (iii) the
// bound holds but is loose? This audit walks (a) re-derive the WH bound,
// (b) assess the empirical computation, (c) deliver an honest verdict.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'wh-bound-invalid-Ka-unbounded-conj272-false-for-large-a'
//
//   CASE (i) CONFIRMED -- THE WH BOUND HAS A REAL ERROR, and additionally
//   Conj 27.2 itself is FALSE for large a. NOT case (ii) and NOT case (iii).
//
//   (a) THE WH BOUND IS INVALID. Its load-bearing step ||K_a|| <= 1/a is FALSE.
//       K_a is the CAUSAL (Volterra) convolution
//           (K_a f)(t) = integral_0^t sinh(a(t-s)) f(s) ds.
//       Its kernel k_a(tau) = sinh(a tau) GROWS like e^{a tau}/2 as tau -> inf.
//       The Laplace transform L[k_a](z) = a/(z^2 - a^2) converges ONLY for
//       Re(z) > a, so its value on the imaginary axis, -a/(t^2 + a^2), is an
//       ANALYTIC CONTINUATION, NOT the Fourier transform of an integrable
//       difference kernel. The Krein 1958 / Gohberg-Krein 1958 Toeplitz norm
//       estimate ||T_phi|| <= ||phi||_{Linf(iR)} REQUIRES phi to be the genuine
//       bounded Fourier symbol of an L^1 (or measure) difference kernel; it
//       does NOT apply to a one-sided exponentially growing kernel. In fact
//       K_a is UNBOUNDED on L^2([0,inf)): for f = 1_{[0,eps]}, (K_a f)(t) grows
//       like e^{at} and is not in L^2. So ||K_a|| = infinity, and the chain
//       ||V|| <= ||M_Phi||^2 ||K_a|| is vacuous. imp-1266 and imp-1316 had this
//       right; the imp-1287 REMARK that tried to refute the "K_a unbounded"
//       observation is itself the error.
//
//   (b) THE EMPIRICAL RESULT IS ROBUST, NOT A NUMERICAL ARTIFACT. The imp-1316
//       Galerkin matrix 2-norms are RIGOROUS LOWER bounds: ||A_N|| <= ||V|| for
//       any Galerkin truncation A_N, and they converge from BELOW as N -> inf.
//       So ||V_{50,Phi}|| >= 53.16 is rigorous, and higher precision only
//       INCREASES it. The WH bound predicted ||V_{50,Phi}|| <= 0.1996/50 ~ 4.0e-3;
//       the rigorous lower bound is >= 53.16. The discrepancy is ~1.3e4, far too
//       large for a "loose constant" (case iii). A DECISIVE structural tell:
//       the WH bound 0.1996/a is monotonically DECREASING in a, while the true
//       norm is monotonically INCREASING in a (4.5e-3 at a=10 -> 53 at a=50 ->
//       2.8e11 at a=100). Opposite trends -- the WH expression cannot be an
//       upper bound for the true norm at any large a.
//
//   (c) HONEST CORRECTION. Conj 27.2 as stated ("||V|| <= 1 for ALL a > 0") is
//       FALSE; it fails for a >= ~50 and ||V_{a,Phi}|| -> inf. The "proven for
//       all a > 0" headline (HS union WH) is RETRACTED: WH proves NOTHING (K_a
//       unbounded), so the ONLY rigorous coverage is the Hilbert-Schmidt bound
//       (imp-1267), good for a in (0, ~37.66]. RH/LAMBDA APPLICATION UNAFFECTED:
//       the program needs only a <= 0.5 (App-S range; physically Lambda <= 0.2,
//       Polymath15), deep inside HS coverage. Named sub-gap WH-KA-UNBOUNDED.
//
// HONEST BOTTOM LINE
// ------------------
// The imp-1287 WH bound is withdrawn: K_a is unbounded on L^2, so ||K_a|| <= 1/a
// is false and the WH closure for large a never existed. Conj 27.2 is false for
// large a (imp-1316, rigorous Galerkin lower bound). The corrected rigorous
// statement is ||V_{a,Phi}|| <= 1 for a in (0, ~37.66] via Hilbert-Schmidt only.
// The RH/Lambda attack (a <= 0.5) is entirely within this range and is unmoved.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash anywhere). Single-quoted strings
// only; no apostrophes inside single-quoted strings.

// -----------------------------------------------------------------------------
// Pinned numerics (re-derived here so the module is standalone-citable).
// -----------------------------------------------------------------------------

// ||Phi||_inf = Phi(0), frozen from imp-1266 PHI_NORMS (h=1e-5 trapezoid on [0,3]).
const PHI_SUP_NORM = 0.44669690046712346;
const PHI_SUP_NORM_SQUARED = PHI_SUP_NORM * PHI_SUP_NORM; // ~0.19953617

// The WH closed-form (the claim under audit) and the HS coverage edge.
function whClaimedBound(a) {
  return PHI_SUP_NORM_SQUARED / a; // imp-1287 (WH-bd); INVALID -- see verdict.
}
const HS_COVERAGE_A_MAX = 37.66; // imp-1267 / imp-1260 exact-HS crossover.

// imp-1316 rigorous Galerkin lower bounds (||A_N|| <= ||V_{a,Phi}||).
const EMPIRICAL_LOWER_BOUNDS = Object.freeze([
  Object.freeze({ a: 10,  galerkinLowerBound: 4.507317918022011e-3, exceedsOne: false }),
  Object.freeze({ a: 50,  galerkinLowerBound: 53.15756119151508,     exceedsOne: true  }),
  Object.freeze({ a: 100, galerkinLowerBound: 275984576183.0967,     exceedsOne: true  }),
]);

// RH / Lambda application range.
const APP_S_A_MAX = 0.5;       // App-S operator range.
const LAMBDA_UPPER = 0.2;      // Polymath15 2019 (physically relevant a-scale).

// -----------------------------------------------------------------------------
// Sub-question (a): re-derive the WH bound -- locate the error.
// -----------------------------------------------------------------------------

const WH_REDERIVATION = Object.freeze({
  claimUnderAudit: 'imp-1287: ||K_a||_{L2([0,inf))} <= 1/a, hence ||V_{a,Phi}|| <= ||Phi||^2_inf / a for all a > 0.',
  causalKernel: 'k_a(tau) = sinh(a tau) for tau >= 0; (K_a f)(t) = integral_0^t sinh(a(t-s)) f(s) ds.',
  kernelGrowth: 'sinh(a tau) ~ e^{a tau} / 2 as tau -> inf (one-sided exponential growth).',
  laplaceConvergenceHalfPlane: 'L[k_a](z) = a/(z^2 - a^2) converges ONLY for Re(z) > a.',
  imaginaryAxisIsAnalyticContinuation: true,
  imaginaryAxisValueIsFourierSymbol: false,
  kreinTheoremApplies: false,
  kreinTheoremHypothesis: 'Krein 1958 / Gohberg-Krein 1958 require phi to be the genuine bounded Fourier symbol of an integrable (L^1 / measure) difference kernel; an exponentially growing one-sided kernel has no such symbol.',
  kAUnbounded: true,
  unboundednessWitness: 'For f = 1_{[0,eps]}, (K_a f)(t) ~ (e^{at}/(2a))(1 - e^{-a eps}) grows exponentially in t, so K_a f is NOT in L^2([0,inf)); thus ||K_a|| = infinity.',
  errorLocation: 'The step ||K_a|| <= 1/a is FALSE. The imp-1287 REMARK refuting imp-1266 (which had correctly noted K_a is unbounded) is the actual mistake.',
  consequenceForV: 'V_{a,Phi} = M_Phi K_a M_Phi IS bounded (even Hilbert-Schmidt) because Phi decays super-exponentially and tames the e^{at} growth, but the SUBMULTIPLICATIVE bound ||V|| <= ||M_Phi||^2 ||K_a|| is vacuous since ||K_a|| = infinity. The WH route gives NO bound on ||V||.',
});

// -----------------------------------------------------------------------------
// Sub-question (b): assess the empirical computation (numerical artifact?).
// -----------------------------------------------------------------------------

const EMPIRICAL_ASSESSMENT = Object.freeze({
  galerkinIsRigorousLowerBound: 'For any Galerkin truncation A_N of V, ||A_N|| <= ||V||; the imp-1316 power-iteration norms are therefore rigorous LOWER bounds, converging from below as N -> inf.',
  higherPrecisionOnlyIncreases: 'A finer mesh / higher precision can only RAISE the Galerkin lower bound, never push it below 1. The exceedsOne finding is monotone-robust.',
  whVsEmpiricalAtA50: Object.freeze({
    whPredicted: whClaimedBound(50),                 // ~3.99e-3
    empiricalLowerBound: 53.15756119151508,
    ratioEmpiricalOverWh: 53.15756119151508 / whClaimedBound(50), // ~1.3e4
  }),
  rulesOutLooseConstant: 'A ~1.3e4 gap (and ~1.4e12 at a=100) cannot be explained by a loose constant in front of 1/a; the FORM 1/a is wrong, not the constant.',
  monotonicityContradiction: 'WH claim 0.1996/a DECREASES in a; the true norm INCREASES in a (4.5e-3 @10 -> 53 @50 -> 2.8e11 @100). Opposite trends prove 0.1996/a is not an upper bound at large a.',
  isNumericalArtifact: false,
});

// -----------------------------------------------------------------------------
// Sub-question (c): honest verdict + corrected coverage.
// -----------------------------------------------------------------------------

const DIAGNOSIS = Object.freeze({
  caseI_whBoundHasError: true,
  caseII_empiricalNumericalIssue: false,
  caseIII_boundHoldsButLoose: false,
  selected: 'case-i-wh-bound-has-error',
});

const CORRECTED_COVERAGE = Object.freeze({
  conj272ForAllAPositive: false,
  conj272FalseForLargeA: true,
  firstEmpiricalFailureA: 50,
  normDivergesWithA: true,
  rigorousCoverage: 'a in (0, ~37.66] via the Hilbert-Schmidt bound (imp-1267) ONLY.',
  whContributesNothingRigorous: true,
  headlineProvenForAllARetracted: true,
});

const RH_IMPACT = Object.freeze({
  rhApplicationUnaffected: true,
  appSRangeAMax: APP_S_A_MAX,        // a <= 0.5
  lambdaUpper: LAMBDA_UPPER,         // Lambda <= 0.2
  reason: 'The RH/Lambda program only needs a <= 0.5 (App-S; physically Lambda <= 0.2), deep inside the HS coverage a in (0, 37.66]. The large-a failure of Conj 27.2 is outside the relevant range.',
});

const LAMBDA_LINK = Object.freeze({
  movedByThisTicket: false,
  note: 'This is a rigor-honesty correction (a withdrawn bound + a falsified over-general conjecture), not a new Lambda lever. Bracket 0 <= Lambda <= 0.2 unmoved.',
});

const ALLOWED_VERDICTS = Object.freeze([
  'wh-bound-invalid-Ka-unbounded-conj272-false-for-large-a',
  'wh-bound-valid-empirical-was-numerical-artifact',
  'wh-bound-loose-but-correct-conj272-holds',
]);

const VERDICT = 'wh-bound-invalid-Ka-unbounded-conj272-false-for-large-a';

const VERDICT_DETAIL =
  'wh-bound-invalid-Ka-unbounded-conj272-false-for-large-a: Case (i). The imp-1287 ' +
  'Wiener-Hopf bound is INVALID -- its step ||K_a|| <= 1/a is false because the causal ' +
  'convolution K_a by the exponentially growing kernel sinh(a tau) is UNBOUNDED on ' +
  'L^2([0,inf)); the Laplace symbol a/(z^2 - a^2) converges only for Re(z) > a and its ' +
  'imaginary-axis value is an analytic continuation, not the Fourier symbol of an ' +
  'integrable kernel, so the Krein / Gohberg-Krein Toeplitz norm estimate does not apply. ' +
  'The imp-1316 Galerkin norms are rigorous LOWER bounds (||A_N|| <= ||V||) that converge ' +
  'from below, so ||V_{50,Phi}|| >= 53.16 > 1 is robust (higher precision only increases ' +
  'it); the ~1.3e4 gap to the WH prediction and the opposite a-monotonicity rule out cases ' +
  '(ii) and (iii). Conj 27.2 as stated (for ALL a > 0) is therefore FALSE, failing for ' +
  'a >= ~50 with ||V|| -> inf. The "proven for all a > 0" headline is RETRACTED: WH proves ' +
  'nothing, leaving only the Hilbert-Schmidt coverage a in (0, ~37.66] (imp-1267). The ' +
  'RH/Lambda application (a <= 0.5; Lambda <= 0.2) is entirely inside HS coverage and is ' +
  'UNAFFECTED. Named sub-gap WH-KA-UNBOUNDED.';

const RECOMMENDED_FOLLOWUP = Object.freeze({
  id: 'imp-1342-followup-wh-ka-unbounded',
  title:
    'Propagate the WH-bound withdrawal: correct every downstream claim that cites imp-1287 ' +
    'as proving Conj 27.2 for a >= 0.1996 or for all a > 0 (notably the imp-1258 collapse ' +
    'narrative and any "proven for all a > 0" headline), restating the rigorous coverage as ' +
    'a in (0, ~37.66] via Hilbert-Schmidt only, and flag Conj 27.2 as false for large a.',
  subGapId: 'WH-KA-UNBOUNDED',
  priority: 'high',
});

// -----------------------------------------------------------------------------
// Frozen export record.
// -----------------------------------------------------------------------------

export const IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION = Object.freeze({
  id: 'imp-1342',
  ticket: 'imp-1342',
  title: 'Large-a WH-bound rigor-honesty audit -- WH bound invalid (K_a unbounded), Conj 27.2 false for large a',
  proofSection: 'S7',
  shippedBy: 'opus-4-7 (subscription)',

  pinnedNumerics: Object.freeze({
    phiSupNorm: PHI_SUP_NORM,
    phiSupNormSquared: PHI_SUP_NORM_SQUARED,
    whThresholdClaimed: PHI_SUP_NORM_SQUARED, // imp-1287 claimed a >= this closes (INVALID)
    hsCoverageAMax: HS_COVERAGE_A_MAX,
    appSAMax: APP_S_A_MAX,
    lambdaUpper: LAMBDA_UPPER,
  }),

  empiricalLowerBounds: EMPIRICAL_LOWER_BOUNDS,

  whRederivation: WH_REDERIVATION,        // sub-question (a)
  empiricalAssessment: EMPIRICAL_ASSESSMENT, // sub-question (b)
  diagnosis: DIAGNOSIS,                   // sub-question (c) classification
  correctedCoverage: CORRECTED_COVERAGE,
  rhImpact: RH_IMPACT,
  lambdaLink: LAMBDA_LINK,

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  verdictDetail: VERDICT_DETAIL,
  recommendedFollowup: RECOMMENDED_FOLLOWUP,

  crossReferences: Object.freeze({
    'imp-1287': 'src/data/imp-1287-volterra-wiener-hopf.js (the WH bound withdrawn by this audit).',
    'imp-1316': 'src/data/imp-1316-volterra-large-a-sweep.js (rigorous Galerkin lower bounds; empirical failure for a >= 50).',
    'imp-1266': 'src/data/imp-1266-volterra-mellin-symbol.js (correctly noted K_a unbounded; vindicated here).',
    'imp-1267': 'src/data/imp-1267-volterra-hs-bound.js (the ONLY rigorous coverage: a in (0, ~37.66]).',
    'imp-1258': 'src/data/imp-1258-volterra-cdb-bridge.js (collapse narrative whose "proven for all a > 0" headline needs correction).',
  }),
});

export default IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION;

// -----------------------------------------------------------------------------
// BUILD-TIME TRIPWIRES (10 shipped; ticket spec requires 10).
// -----------------------------------------------------------------------------

export const IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION_ASSERTIONS = [

  // Tripwire 1: the WH bound is flagged INVALID via the K_a unboundedness.
  {
    id: 'imp1342-wh-bound-invalid-Ka-unbounded',
    why:
      'The core finding is that imp-1287 step ||K_a|| <= 1/a is false because K_a is ' +
      'unbounded on L^2. If kAUnbounded silently flipped to false, the audit would lose ' +
      'its entire basis and re-endorse a withdrawn bound.',
    holds: () => {
      const w = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.whRederivation;
      return w.kAUnbounded === true && w.kreinTheoremApplies === false;
    },
  },

  // Tripwire 2: imaginary-axis symbol is an analytic continuation, NOT a Fourier symbol.
  {
    id: 'imp1342-imaginary-axis-is-analytic-continuation',
    why:
      'The precise error is conflating the analytic continuation of a/(z^2-a^2) to the ' +
      'imaginary axis with a genuine bounded Fourier symbol. Both flags must hold or the ' +
      'mechanism of the error is mis-stated.',
    holds: () => {
      const w = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.whRederivation;
      return w.imaginaryAxisIsAnalyticContinuation === true && w.imaginaryAxisValueIsFourierSymbol === false;
    },
  },

  // Tripwire 3: Laplace transform converges only for Re(z) > a (off the imaginary axis).
  {
    id: 'imp1342-laplace-converges-only-re-gt-a',
    why:
      'sinh(a tau) grows like e^{a tau}, so its Laplace integral converges only for ' +
      'Re(z) > a -- the structural reason no bounded imaginary-axis symbol exists. The ' +
      'recorded convergence half-plane must say so.',
    holds: () => /Re\(z\) > a/.test(IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.whRederivation.laplaceConvergenceHalfPlane),
  },

  // Tripwire 4: empirical Galerkin values are rigorous LOWER bounds, not artifacts.
  {
    id: 'imp1342-empirical-is-rigorous-lower-bound',
    why:
      'The empirical violation must be classified as a rigorous lower bound (||A_N|| <= ||V||), ' +
      'not a numerical artifact -- otherwise case (ii) could not be ruled out.',
    holds: () => IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.empiricalAssessment.isNumericalArtifact === false,
  },

  // Tripwire 5: the WH prediction at a=50 is ~4e-3 while the rigorous lower bound is >= 53.
  {
    id: 'imp1342-wh-vs-empirical-gap-at-a50',
    why:
      'The numeric contradiction must hold: WH predicts ~0.1996/50 ~ 4e-3 yet the rigorous ' +
      'lower bound is >= 53. If these numbers drift into agreement, the contradiction (and ' +
      'thus the whole audit) is unfounded.',
    holds: () => {
      const c = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.empiricalAssessment.whVsEmpiricalAtA50;
      return (
        c.whPredicted > 0 && c.whPredicted < 0.01 &&
        c.empiricalLowerBound > 1 &&
        c.ratioEmpiricalOverWh > 1e3
      );
    },
  },

  // Tripwire 6: opposite monotonicity in a rules out a loose-constant explanation.
  {
    id: 'imp1342-opposite-monotonicity-rules-out-loose',
    why:
      'WH bound 0.1996/a decreases in a; the true norm increases in a (4.5e-3 @10 -> 53 @50 -> ' +
      '2.8e11 @100). The empirical lower bounds must be strictly increasing so this decisive ' +
      'structural tell holds, ruling out case (iii) loose-but-correct.',
    holds: () => {
      const e = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.empiricalLowerBounds;
      return (
        e[0].galerkinLowerBound < e[1].galerkinLowerBound &&
        e[1].galerkinLowerBound < e[2].galerkinLowerBound &&
        e[1].exceedsOne === true && e[2].exceedsOne === true &&
        IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.empiricalAssessment.isNumericalArtifact === false
      );
    },
  },

  // Tripwire 7: diagnosis selects case (i) exclusively.
  {
    id: 'imp1342-diagnosis-is-case-i',
    why:
      'The ticket poses three cases; the honest diagnosis is exactly case (i) (WH bound has ' +
      'an error). Cases (ii) and (iii) must be false, or the verdict is internally inconsistent.',
    holds: () => {
      const d = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.diagnosis;
      return d.caseI_whBoundHasError === true && d.caseII_empiricalNumericalIssue === false && d.caseIII_boundHoldsButLoose === false;
    },
  },

  // Tripwire 8: Conj 27.2 "for all a > 0" is retracted; rigorous coverage is a in (0, 37.66].
  {
    id: 'imp1342-conj272-corrected-coverage',
    why:
      'The headline "proven for all a > 0" must be retracted: Conj 27.2 is false for large a, ' +
      'and the only rigorous coverage is the HS bound a in (0, ~37.66]. A silent re-assertion ' +
      'of all-a coverage would re-introduce the overstated claim this audit exists to fix.',
    holds: () => {
      const c = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.correctedCoverage;
      return (
        c.conj272ForAllAPositive === false &&
        c.conj272FalseForLargeA === true &&
        c.headlineProvenForAllARetracted === true &&
        c.whContributesNothingRigorous === true &&
        Math.abs(IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.pinnedNumerics.hsCoverageAMax - 37.66) < 1e-9
      );
    },
  },

  // Tripwire 9: RH / Lambda application explicitly unaffected (a <= 0.5; Lambda <= 0.2).
  {
    id: 'imp1342-rh-application-unaffected',
    why:
      'The correction must NOT be misread as breaking the RH attack. The program needs only ' +
      'a <= 0.5 (Lambda <= 0.2), inside HS coverage. rhApplicationUnaffected must stay true ' +
      'with the App-S range and Lambda bound recorded.',
    holds: () => {
      const r = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.rhImpact;
      return (
        r.rhApplicationUnaffected === true &&
        Math.abs(r.appSRangeAMax - 0.5) < 1e-12 &&
        Math.abs(r.lambdaUpper - 0.2) < 1e-12 &&
        r.appSRangeAMax < IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION.pinnedNumerics.hsCoverageAMax
      );
    },
  },

  // Tripwire 10: verdict allowed + the honest one, follow-up names WH-KA-UNBOUNDED.
  {
    id: 'imp1342-verdict-allowed-and-followup-named',
    why:
      'The verdict must be one of the three allowed strings and specifically the honest ' +
      'invalid-bound one, and the follow-up must route the cleanup by naming sub-gap ' +
      'WH-KA-UNBOUNDED. Without it the audit identifies the error but fails to propagate it.',
    holds: () => {
      const r = IMP_1342_LARGE_A_WH_BOUND_INVESTIGATION;
      return (
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'wh-bound-invalid-Ka-unbounded-conj272-false-for-large-a' &&
        r.recommendedFollowup.subGapId === 'WH-KA-UNBOUNDED'
      );
    },
  },
];
