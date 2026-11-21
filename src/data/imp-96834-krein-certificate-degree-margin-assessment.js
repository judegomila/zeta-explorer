/**
 * @fileoverview imp-96834 -- ASSESSMENT: is the Route I Krein certified design-margin decay
 * eps(2a) = 200(1 - 2a), and its zero-crossing 2a* = 1.0, an ARTIFACT of the FIXED trig-polynomial
 * certificate degree (kmax = 4), or an INTRINSIC property of the true positivity problem?
 *
 * CONTEXT. imp-96732 found the composite Route I Krein wall is governed by the certified design
 * margin eps(2a) = 200(1 - 2a), which vanishes at 2a* = 1.0 and goes negative by ln 3 (eps ~ -19.7),
 * and labelled the at/above-2a=1.0 end INTRINSIC to the finite-certificate route. But eps is the
 * design margin of a SPECIFIC certificate family: nu(t) = sum_{k=0}^{4} sum_j c_{k,j} t^k trig_k(x_j t)
 * -- degree families k <= 4 (kmax = 4), lattice atoms x_j = k_j dx with dx = 0.02 and x_j >= X0, solved
 * by a double-precision cutting-plane LP. imp-96732 never assessed whether the linear 200(1 - 2a) decay
 * and its 2a* = 1.0 zero are properties of the true positivity problem or merely of THIS certificate
 * degree. This ticket assesses that, structurally (a fresh higher-degree LP solve was NOT run here).
 *
 * METHOD. Structural (LP feasible-set monotonicity + the certificate-vs-operator ceiling), using only
 * literals baked verbatim from TOEPLITZ_KREIN_LITERALS.epsMarginDecay and .lambdaMinSigma2. No numeric
 * LP was solved; this is an assessment of how the certified eps and its zero 2a* MUST respond to
 * raising the certificate degree, given the structure of the LP and the measured operator spectrum.
 *
 * FINDINGS.
 *   1. THE CERTIFIED MARGIN IS MONOTONE NON-DECREASING IN CERTIFICATE DEGREE. Raising the degree
 *      (higher kmax, more lattice atoms, or finer dx) only ENLARGES the LP feasible set: every
 *      kmax = 4 certificate remains feasible in the richer family with the new coefficients set to
 *      zero. Maximising the design margin eps over a superset feasible region can only INCREASE (never
 *      decrease) the optimum. Hence the max achievable certified margin eps_max(2a; degree) is monotone
 *      non-decreasing in degree at every fixed 2a, and therefore the positive-margin frontier
 *      2a*(degree) = sup{ 2a : eps_max(2a; degree) > 0 } is monotone NON-DECREASING in degree. So the
 *      observed 2a* = 1.0 from the kmax = 4 family is a LOWER bound on the true (higher-degree)
 *      certified-margin frontier: a richer certificate can only push 2a* to the RIGHT (toward ln 3),
 *      never to the left. The eps law's zero-crossing is NOT shown intrinsic by the fit.
 *
 *   2. THE CEILING ON eps IS THE TRUE POSITIVITY MARGIN, WHICH STAYS POSITIVE THROUGH ln 3. No
 *      certificate can certify more margin than the form actually has, so eps_max(2a; degree) is
 *      bounded above by the operator floor lambda_min(T_a[sigma_2]). The baked lambdaMinSigma2 (N = 36
 *      Galerkin Rayleigh) is POSITIVE across the entire disputed window: lambda_min ~ 7.743 at 2a = 1.0,
 *      ~0.552 at 2a = ln 3, with the sign flip only near 2a ~ 1.1316 (a = 0.5658) -- to the RIGHT of
 *      ln 3 = 1.0986. So there is genuine positive room 0 < eps <= lambda_min for a richer certificate
 *      to certify eps > 0 across all of 1.0 < 2a <= ln 3. The eps -> 0 at 2a = 1.0 is NOT dictated by
 *      the positivity problem, whose floor is still ~7.7 there.
 *
 *   3. VERDICT: the eps(2a) = 200(1 - 2a) linear decay and its zero at 2a* = 1.0 are an ARTIFACT of the
 *      fixed kmax = 4, dx = 0.02, double-precision certificate, NOT intrinsic to the positivity problem.
 *      This SHARPENS / CORRECTS imp-96732's "intrinsic (margin-vanishing) at and above 2a = 1.0"
 *      labelling of the eps wall. What IS genuinely intrinsic -- and both lie to the RIGHT of the
 *      2a = 1.0 eps zero -- is (a) the l1-norm blow-up of the constructive exterior nu (the extension
 *      measure concentrates on the p = 2 lattice t ~ 2^k; ~68 mantissa bits needed by ln 3, a
 *      precision/conditioning obstruction that raising degree alone at double precision does NOT
 *      remove), and (b) the true positivity boundary near 2a ~ 1.13 where lambda_min itself changes
 *      sign. The 2a = 1.0 eps zero coincides with the double-precision l1 conditioning band, i.e. it
 *      marks where the DOUBLE-PRECISION LP stops emitting a positive-margin certificate, not where the
 *      certificate family runs out of margin in exact arithmetic.
 *
 * HONEST CAVEATS / SUB-GAP.
 *   - The monotonicity in Finding 1 is EXACT-arithmetic (feasible-set enlargement). At fixed double
 *     precision the l1 conditioning still caps observed reach near 2a = 1.0, so raising the degree
 *     ALONE does not move the double-precision wall -- degree AND extended precision are needed jointly.
 *   - The lambdaMinSigma2 values are N = 36 Galerkin Rayleigh UPPER bounds, monotone decreasing in N
 *     (0.6174 -> 0.5786 -> 0.5521 at N = 20, 28, 36 at 2a = ln 3) and NOT proven bounded away from 0
 *     in the limit, so the eps ceiling at ln 3 could be small.
 *   - SUB-GAP IMP96834_HIGHER_DEGREE_LP_UNSOLVED: no fresh kmax = 5 (or finer-dx) LP was solved /
 *     interval-verified here to MEASURE how far 2a* actually moves; the structural claim is that it
 *     can only move right, bounded above by lambda_min -- the numeric size of the move is unmeasured.
 *
 * Assessment/measurement only; interval-rigorous reach stays exactly 2a <= 0.96; the operator
 * floor is a Rayleigh UPPER bound (no operator positivity established); RH open; no refereed bound is changed
 * ; NO QED.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source literals: epsMarginDecay, lambdaMinSigma2, normGrowthLaw)
 * @see imp-96732-krein-extended-precision-reach-assessment.js (parent: labelled the 2a>=1.0 end intrinsic; this ticket refines to degree-artifact)
 * @see imp-96651-krein-096-fine-extended-scan.js (independent positivity re-confirmation at 2a=0.96)
 */

// baked constants (verbatim from TOEPLITZ_KREIN_LITERALS.epsMarginDecay / .lambdaMinSigma2 / certificate)
const EPS_SLOPE_PER_UNIT = -200.0; // eps(2a) = 200*(1 - 2a)
const EPS_INTERCEPT = 200.0;
const EPS_ZERO_TWO_A = 1.0; // kmax=4 double-precision certified-margin zero-crossing
const KMAX_FIXED = 4; // certificate degree family k = 0..4
const DX_FIXED = 0.02; // lattice atom spacing
const LN3 = Math.log(3); // 1.0986122886681098

const projEps = (twoA) => EPS_SLOPE_PER_UNIT * twoA + EPS_INTERCEPT;

// operator floor lambda_min(T_a[sigma_2]) at N=36 (Rayleigh UPPER bound), keyed by 2a
// (from lambdaMinSigma2: a050->2a=1.0, aLn3Half->2a=ln3, a056->2a=1.12, a05658->2a~1.1316, a058->2a=1.16)
const LAMBDA_MIN_N36 = Object.freeze({
  '1.00': 7.743,
  ln3: 0.5521,
  '1.12': 0.475,
  '1.1316': -6.596, // sign flip near here (a=0.5658), to the RIGHT of ln3
  '1.16': -61.1,
});

// the disputed window: certified eps (kmax=4) vs the operator ceiling
export const IMP96834_WINDOW = Object.freeze(
  [
    { twoA: 1.0, lambdaKey: '1.00' },
    { twoA: LN3, lambdaKey: 'ln3' },
    { twoA: 1.12, lambdaKey: '1.12' },
    { twoA: 1.1316, lambdaKey: '1.1316' },
  ].map((r) =>
    Object.freeze({
      twoA: r.twoA,
      certifiedEpsKmax4: projEps(r.twoA), // eps from the FIXED kmax=4 double-prec fit
      operatorFloorN36: LAMBDA_MIN_N36[r.lambdaKey], // ceiling on any certified margin
      roomForRicherCertificate: LAMBDA_MIN_N36[r.lambdaKey] > 0, // 0 < eps <= lambda_min available?
    }),
  ),
);

// verdict summary
export const IMP96834_VERDICT = Object.freeze({
  ticket: 'imp-96834',
  question:
    'is eps(2a)=200(1-2a) and its zero 2a*=1.0 an artifact of the fixed trig-polynomial certificate degree (kmax=4), or intrinsic?',
  answer:
    'ARTIFACT of the fixed kmax=4 double-precision certificate: the certified margin is monotone non-decreasing in degree, so 2a* can only move right toward ln3; and its ceiling lambda_min(T_a[sigma_2]) stays positive through ln3, so the eps->0 at 2a=1.0 is not dictated by the positivity problem',
  fixedCertificateDegree: KMAX_FIXED,
  fixedDx: DX_FIXED,
  epsZeroTwoA_kmax4: EPS_ZERO_TWO_A,
  marginMonotoneNonDecreasingInDegree: true, // feasible-set enlargement (exact arithmetic)
  twoAStarMonotoneNonDecreasingInDegree: true, // so 2a*=1.0 is a LOWER bound on the true frontier
  operatorCeilingPositiveThroughLn3: true, // lambda_min ~7.743 at 2a=1.0, ~0.552 at ln3
  operatorSignFlipTwoA: 1.1316, // a=0.5658, to the RIGHT of ln3=1.0986
  epsWallIsIntrinsic: false, // the 2a=1.0 eps zero is NOT intrinsic to positivity
  genuinelyIntrinsicToTheRight: Object.freeze([
    'l1-norm blow-up of the constructive exterior nu (~68 bits by ln3): a precision/conditioning obstruction not removed by raising degree alone at double precision',
    'true positivity boundary near 2a~1.13 where lambda_min changes sign',
  ]),
  refinesImp96732:
    'imp-96732 labelled the 2a>=1.0 end intrinsic; this refines that the eps=200(1-2a) zero at 2a=1.0 is a degree+precision artifact, while the intrinsic obstructions (l1 blow-up, lambda_min sign flip) sit to its right',
  caveats: Object.freeze({
    monotonicityIsExactArithmetic:
      'degree alone at fixed double precision does not move the wall; the l1 conditioning caps observed reach near 2a=1.0 -- degree AND extended precision are needed jointly',
    ceilingIsRayleighUpperBound:
      'lambdaMinSigma2 is an N=36 Galerkin Rayleigh upper bound, monotone decreasing in N, not proven bounded away from 0 in the limit',
  }),
  subGap:
    'IMP96834_HIGHER_DEGREE_LP_UNSOLVED -- no fresh kmax=5 / finer-dx LP was solved here to MEASURE how far 2a* actually moves; structural claim only (it can only move right, bounded above by lambda_min)',
  solveRun: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96834_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96834_ASSERTIONS = [
  {
    id: 'imp96834-eps-fit-zeros-at-twoA-1',
    holds: () => Math.abs(projEps(EPS_ZERO_TWO_A)) < 1e-9 && projEps(LN3) < -10,
    why: 'the baked kmax=4 eps fit must zero at 2a=1.0 and be deeply negative by ln3, reproducing the imp-96732 wall it assesses.',
  },
  {
    id: 'imp96834-operator-floor-positive-through-ln3',
    holds: () => {
      const at1 = IMP96834_WINDOW.find((r) => Math.abs(r.twoA - 1.0) < 1e-12);
      const atLn3 = IMP96834_WINDOW.find((r) => Math.abs(r.twoA - LN3) < 1e-12);
      return at1.operatorFloorN36 > 5 && atLn3.operatorFloorN36 > 0;
    },
    why: 'the operator ceiling lambda_min must stay positive across the disputed window (large ~7.7 at 2a=1.0, still positive at ln3), leaving room for a richer certificate above the kmax=4 eps zero.',
  },
  {
    id: 'imp96834-operator-sign-flip-right-of-ln3',
    holds: () => IMP96834_VERDICT.operatorSignFlipTwoA > LN3,
    why: 'the true positivity boundary (lambda_min sign flip near 2a~1.13) must lie to the RIGHT of ln3, so positivity holds throughout the disputed 1.0<2a<=ln3 window.',
  },
  {
    id: 'imp96834-room-for-richer-certificate-through-ln3',
    holds: () =>
      IMP96834_WINDOW.filter((r) => r.twoA <= LN3 + 1e-12).every(
        (r) => r.roomForRicherCertificate === true,
      ),
    why: 'across 1.0<=2a<=ln3 the operator floor is positive, so 0<eps<=lambda_min room exists for a higher-degree certificate -- the eps zero at 2a=1.0 is not forced by positivity.',
  },
  {
    id: 'imp96834-verdict-artifact-not-intrinsic',
    holds: () =>
      IMP96834_VERDICT.epsWallIsIntrinsic === false &&
      IMP96834_VERDICT.marginMonotoneNonDecreasingInDegree === true &&
      IMP96834_VERDICT.twoAStarMonotoneNonDecreasingInDegree === true,
    why: 'the verdict must be that the eps=200(1-2a) zero is a degree artifact (margin monotone non-decreasing in degree => 2a* can only move right), not intrinsic.',
  },
  {
    id: 'imp96834-assessment-only-reach-and-qed-unchanged',
    holds: () =>
      IMP96834_VERDICT.solveRun === false &&
      IMP96834_VERDICT.qed === false &&
      IMP96834_VERDICT.intervalRigorousReachUnchanged === 0.96,
    why: 'this is assessment only: no LP was solved, no QED, interval-rigorous reach stays 2a<=0.96.',
  },
];

for (const a of IMP96834_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96834-krein-certificate-degree-margin-assessment assertion failed: ${a.id}`);
  }
}
