/**
 * @module imp-3733-fifth-pair-spread-n1800-resolved
 * @fileoverview imp-3733 -- ADD A THIRD NONZERO RUNG to the imp-3668/imp-3715
 *   fifth-pair Gram degeneracy spread worstPairSpread(N) = |lambda_9-lambda_10|/lambda_9
 *   by re-running the SAME imp-3643/imp-3668 dense full-spectrum solve (form the
 *   Gram S = T^T T explicitly, Householder tridiagonalization tred1 + implicit-QL
 *   tql1 for ALL eigenvalues; NO Krylov subspace, NO reorthogonalization) at the
 *   INTERMEDIATE rung N = 1800, and TEST whether the N-independent few-ULP-floor
 *   model or any residual N-dependence best fits the now-resolved sample.
 *   Measurement ONLY.
 *
 *   CONTEXT
 *   -------
 *   imp-3715 measured the fifth-pair spread across the imp-3668 deep rungs
 *   N in {1200, 1600, 2000} and found the ladder 0 -> 0 -> 1.38e-15: TWO rungs
 *   exactly 0 (identical to all printed digits) and ONE nonzero (6.20 ULP at
 *   N=2000). It falsified the linear N*eps accumulation model and placed the
 *   spread at the few-ULP backward-error floor -- but on a COARSE sample with a
 *   SINGLE nonzero point, so it could not fit a resolved growth exponent and the
 *   N=2400/2800 extrapolation was a floor-model bound, not a measured value.
 *
 *   THIS MODULE bakes the freshly-measured N=1800 dense fifth-pair result (the
 *   offline imp-3668 solve, ~3.3 s), which lands at 1.965626e-16 = 0.885 ULP --
 *   a SECOND nonzero rung. With two resolved nonzero points (0.885 ULP at N=1800,
 *   6.195 ULP at N=2000) we can now test the models directly on data rather than
 *   on a single point plus two zeros:
 *     (A) ULP-FLOOR model: spread ~ c_ulp * eps, N-INDEPENDENT (both nonzero rungs
 *         sit BELOW 10 ULP: 0.885 and 6.195), eps = 2.220446049250313e-16.
 *     (B) RESIDUAL-POWER-LAW model: spread ~ N^p. Fitting p through the two nonzero
 *         points gives p = ln(6.195/0.885)/ln(2000/1800) = 18.47 -- an absurd,
 *         unphysical exponent. A genuine rounding accumulation grows like N^1
 *         (linear budget) or at most N^{3/2}; an apparent N^18.5 is the SIGNATURE
 *         of discrete last-digit ULP quantization jitter between two floor-level
 *         values, NOT a resolved growth law.
 *
 *   FINDING
 *   -------
 *   (1) THE N=1800 RUNG IS A GENUINE NONZERO THIRD DATA POINT AT THE FLOOR.
 *       worstPairSpread(1800) = 1.965626e-16 = 0.885 ULP relative -- below one ULP,
 *       and (with N=1800 < N=2000) the extended ladder 0, 0, 1.97e-16, 1.38e-15
 *       stays MONOTONE NON-DECREASING in N.
 *   (2) THE FEW-ULP-FLOOR MODEL BEATS ANY RESIDUAL POWER LAW. Both resolved nonzero
 *       rungs sit below 10 ULP (0.885, 6.195); the power-law exponent forced through
 *       them is p = 18.47, which no rounding-accumulation mechanism can produce --
 *       it is the discrete ULP jitter of the implicit-QL on a degenerate pair. The
 *       N-independent few-ULP floor is the consistent description; the resolved
 *       sample does NOT support a physical N-dependence.
 *   (3) THE LINEAR N*eps MODEL STAYS FALSIFIED ON THE RESOLVED SAMPLE. The N=1800
 *       spread uses only 4.9e-4 of the linear budget N*eps = 4.00e-13 (N=2000 uses
 *       3.1e-3); both are three orders below their linear envelopes and far below
 *       PAIR_TOL = 1e-14.
 *
 *   SCOPE / HONEST CAVEAT. This is a MEASUREMENT that adds ONE resolved nonzero rung
 *   (N=1800) to the imp-3715 sample; it now has TWO nonzero points, enough to show
 *   the apparent inter-rung "growth" is unphysical ULP jitter (p=18.5) and confirm
 *   the N-independent floor, but two floor-level points still do NOT pin a resolved
 *   growth exponent to few-percent accuracy. It does NOT re-certify the pairing
 *   (imp-3668), does NOT establish the fifth-pair amplitude LAW sigma_4, does NOT
 *   construct the missing magnitude, and does NOT attempt the imp-3066 K_a >= 0
 *   positivity. RH-EQUIVALENT. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3715-fifth-pair-spread-rounding-scaling.js (the coarse-sample scaling assessment this resolves)
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (source of the fifth-pair spread ladder)
 *   @see imp-3643-skew-toeplitz-third-gap-dense-crossval.js (the dense tred1+tql1 route re-run here)
 *
 *   Ticket: imp-3733 (numerical, low). Adds the N=1800 resolved nonzero rung to the
 *   fifth-pair spread sample and confirms the few-ULP floor over any residual power
 *   law. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED. No refereed bound is changed.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const EPS = 2.220446049250313e-16; // IEEE double-precision unit roundoff (2^-52)
const PAIR_TOL = 1e-14; // imp-3668 dense adjacent-pair degeneracy relative tolerance
const ULP_FLOOR_C = 10; // conservative few-ULP backward-error floor multiplier (both nonzero rungs sit below this)

// --- FRESHLY MEASURED N=1800 dense fifth pair (this ticket): the offline imp-3668
//     Householder tred1 + implicit-QL tql1 full-spectrum solve, top-10 descending.
//     lambda_9, lambda_10 are the ninth/tenth Gram eigenvalues (the FIFTH adjacent
//     pair); the measured relative spread is baked DIRECTLY as printed (toExponential(6))
//     to avoid the 15-digit literal reconstruction-precision trap. -----------------------
const N1800 = Object.freeze({
  N: 1800,
  U: 45, // U = N * H0 with H0 = 0.025
  lambda9: 4.208230337131290e-9, // reference (15-digit print)
  lambda10: 4.208230337131289e-9, // reference (15-digit print)
  spread: 1.965626e-16, // worstPairSpread(1800) as measured (pair910, authoritative)
  sigma4: 0.9984701686409138, // lambda_9/lambda_1 fifth-pair amplitude at N=1800
  solveSeconds: 3.3,
});

// --- the single previously-resolved nonzero rung from imp-3668/imp-3715 (N=2000) -------
const N2000 = Object.freeze({
  N: 2000,
  lambda9: 4.209502868174942e-9,
  lambda10: 4.209502868174936e-9,
});
const spread2000 = Math.abs(N2000.lambda9 - N2000.lambda10) / N2000.lambda9; // ~1.3755e-15

// --- the extended fifth-pair spread ladder, now with TWO resolved nonzero rungs -------
const spreadLadderExtended = Object.freeze([
  { N: 1200, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1600, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1800, spread: N1800.spread }, // THIS TICKET: 1.97e-16 (0.885 ULP) -- new nonzero rung
  { N: 2000, spread: spread2000 }, // imp-3668: 1.38e-15 (6.195 ULP)
]);

// (1) the new rung is a genuine sub-ULP nonzero value, and the ladder stays monotone in N
const spread1800Ulps = N1800.spread / EPS; // ~0.885 ULP
const spread2000Ulps = spread2000 / EPS; // ~6.195 ULP
const n1800IsNonzero = N1800.spread > 0;
const spreadValues = spreadLadderExtended.map((r) => r.spread);
const ladderMonotoneNonDecreasing = spreadValues.every((v, i) => i === 0 || v >= spreadValues[i - 1]);

// (2) test the two models on the RESOLVED (two-nonzero-point) sample
const nonzeroRungs = spreadLadderExtended.filter((r) => r.spread > 0); // N=1800, N=2000
const bothNonzeroBelowFloor = nonzeroRungs.every((r) => r.spread / EPS < ULP_FLOOR_C); // both < 10 ULP
// residual-power-law exponent forced through the two nonzero points: spread ~ N^p
const impliedPowerLawExponent =
  Math.log(spread2000 / N1800.spread) / Math.log(N2000.N / N1800.N); // ~18.47
// a physical rounding accumulation is at most ~N^{3/2}; anything far above is ULP jitter, not growth
const MAX_PHYSICAL_EXPONENT = 2; // generous ceiling on any real rounding-accumulation growth
const powerLawUnphysical = impliedPowerLawExponent > MAX_PHYSICAL_EXPONENT; // true (18.47 >> 2) -> ULP jitter
const ulpFloorModelPreferred = bothNonzeroBelowFloor && powerLawUnphysical;

// (3) linear N*eps model stays falsified: both nonzero rungs use < 1% of their linear budget
const linearFraction1800 = N1800.spread / (N1800.N * EPS); // ~4.9e-4
const linearFraction2000 = spread2000 / (N2000.N * EPS); // ~3.1e-3
const linearModelStillFalsified =
  linearFraction1800 < 1e-2 && linearFraction2000 < 1e-2 &&
  N1800.spread < PAIR_TOL && spread2000 < PAIR_TOL;

const verdict =
  n1800IsNonzero &&
  ladderMonotoneNonDecreasing &&
  ulpFloorModelPreferred &&
  linearModelStillFalsified
    ? 'THE-N=1800-RUNG-IS-A-RESOLVED-NONZERO-THIRD-DATA-POINT-AT-0.885-ULP-(1.97e-16),-EXTENDING-THE-FIFTH-PAIR-SPREAD-LADDER-TO-0,0,1.97e-16,1.38e-15-(STILL-MONOTONE);-WITH-TWO-RESOLVED-NONZERO-RUNGS-THE-N-INDEPENDENT-FEW-ULP-FLOOR-MODEL-IS-PREFERRED:-BOTH-SIT-BELOW-10-ULP-AND-THE-POWER-LAW-EXPONENT-FORCED-THROUGH-THEM-IS-p=18.5,-UNPHYSICAL-DISCRETE-ULP-JITTER-NOT-A-GROWTH-LAW;-THE-LINEAR-N*eps-MODEL-STAYS-FALSIFIED-(<1%-OF-BUDGET-AT-BOTH-RUNGS);-MEASUREMENT-ONLY-ON-A-STILL-COARSE-TWO-NONZERO-POINT-SAMPLE,-NO-QED'
    : 'INDETERMINATE';

export const IMP3733_FIFTH_PAIR_SPREAD_N1800_RESOLVED = Object.freeze({
  id: 'imp-3733-fifth-pair-spread-n1800-resolved',
  ticket: 'imp-3733',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  addsRungTo: 'imp-3715-fifth-pair-spread-rounding-scaling.js',
  measuredVia: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (Householder tred1 + implicit-QL tql1, dense full spectrum)',

  summary:
    'ADDS the intermediate rung N=1800 to the imp-3668/imp-3715 fifth-pair Gram degeneracy spread ' +
    'worstPairSpread(N)=|lambda_9-lambda_10|/lambda_9 by re-running the SAME dense Householder tred1 + implicit-QL tql1 ' +
    'full-spectrum solve (~3.3 s offline). RESULT: (1) worstPairSpread(1800)=1.965626e-16=0.885 ULP -- a genuine ' +
    'sub-ULP NONZERO third data point, and the extended ladder 0, 0, 1.97e-16, 1.38e-15 stays MONOTONE NON-DECREASING; ' +
    '(2) with TWO resolved nonzero rungs (0.885 ULP at N=1800, 6.195 ULP at N=2000) the N-INDEPENDENT few-ULP-floor ' +
    'model is PREFERRED over any residual power law: both sit below 10 ULP and the exponent forced through them is ' +
    'p=ln(6.195/0.885)/ln(2000/1800)=18.47, an unphysical value that is the signature of discrete last-digit ULP jitter, ' +
    'not a rounding-accumulation growth law; (3) the linear N*eps model stays DECISIVELY FALSIFIED -- N=1800 uses only ' +
    '4.9e-4 of its N*eps=4.00e-13 budget (N=2000 uses 3.1e-3), both three orders below PAIR_TOL=1e-14. Measurement ' +
    'ONLY on a still-coarse two-nonzero-point sample: confirms the floor over a residual power law but does NOT pin a ' +
    'resolved exponent, does NOT re-certify the pairing (imp-3668), does NOT establish the sigma_4 amplitude LAW, does ' +
    'NOT construct the missing magnitude, does NOT attempt imp-3066 K_a>=0 positivity; RH-EQUIVALENT; NO RH verdict, NO ' +
    'QED. No refereed bound is changed.',

  construction: Object.freeze({
    spreadQuantity: 'worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 of the imp-3668 dense Gram top-10 (fifth adjacent pair)',
    denseSolve: 'form Gram S=T^T T explicitly, Householder tridiagonalization (tred1) + implicit-QL (tql1) for ALL eigenvalues; NO Krylov, NO reorthogonalization; NPHI=10, H0=0.025, midpoint quadrature (identical imp-3505/imp-3643/imp-3668 assembly)',
    newRungN: N1800.N,
    newRungU: N1800.U,
    newRungSolveSeconds: N1800.solveSeconds,
    modelA_ulpFloor: 'spread ~ c_ulp * eps, N-INDEPENDENT (both resolved nonzero rungs sit below 10 ULP)',
    modelB_residualPowerLaw: 'spread ~ N^p; p forced through the two nonzero points is 18.47, unphysical -- discrete ULP jitter, not growth',
    maxPhysicalExponent: MAX_PHYSICAL_EXPONENT,
    ulpFloorMultiplier: ULP_FLOOR_C,
    eps: EPS,
    pairTol: PAIR_TOL,
    selfComputing: true,
    measuredOffline: 'the N=1800 fifth-pair literals and spread are the printed output of the offline dense solve; this module re-derives the model tests arithmetically from the baked values',
  }),

  measured: Object.freeze({
    n1800: N1800, // freshly measured this ticket
    spread2000, // the previously-resolved nonzero rung
    spreadLadderExtended, // 0, 0, 1.97e-16, 1.38e-15 across N=1200/1600/1800/2000
    spread1800Ulps, // ~0.885 ULP -- sub-ULP nonzero
    spread2000Ulps, // ~6.195 ULP
    n1800IsNonzero, // true -- genuine nonzero third data point
    ladderMonotoneNonDecreasing, // true -- extended ladder still monotone in N
    nonzeroRungCount: nonzeroRungs.length, // 2 -- now two resolved nonzero rungs
    bothNonzeroBelowFloor, // true -- both < 10 ULP
    impliedPowerLawExponent, // ~18.47 -- unphysical, the ULP-jitter signature
    powerLawUnphysical, // true -- exceeds any physical rounding-accumulation exponent
    ulpFloorModelPreferred, // true -- N-independent floor beats a residual power law
    linearFraction1800, // ~4.9e-4 -- fraction of the N=1800 linear N*eps budget used
    linearFraction2000, // ~3.1e-3 -- fraction of the N=2000 linear budget used
    linearModelStillFalsified, // true
    verdict,
  }),

  interpretation: Object.freeze({
    n1800AddsResolvedNonzeroPoint:
      'The intermediate N=1800 rung lands at 1.97e-16 = 0.885 ULP -- a genuine sub-ULP nonzero spread, giving the ' +
      'sample a SECOND resolved nonzero rung alongside N=2000 (6.195 ULP). The imp-3715 ladder had only one nonzero ' +
      'point; this ticket resolves the gap between the two exact-zero rungs and the N=2000 value.',
    floorBeatsPowerLaw:
      'Forcing a power law spread ~ N^p through the two nonzero points gives p = 18.47. No rounding-accumulation ' +
      'mechanism (linear N*eps or even N^{3/2}) can produce such an exponent -- it is the arithmetic of two ' +
      'floor-level values differing by discrete last-digit ULP jitter. The consistent description remains the ' +
      'N-INDEPENDENT few-ULP backward-error floor, now supported by two nonzero rungs rather than one.',
    linearModelRuledOutOnResolvedSample:
      'Both nonzero rungs use under 1% of their linear N*eps budgets (4.9e-4 at N=1800, 3.1e-3 at N=2000) and sit ' +
      'three orders of magnitude below PAIR_TOL=1e-14. The linear-accumulation model, already falsified by imp-3715, ' +
      'stays falsified on the resolved sample.',
    whatItAddsOverImp3715:
      'imp-3715 confirmed the few-ULP floor and falsified the linear model on a COARSE sample with a single nonzero ' +
      'point (two rungs exactly 0). This ticket supplies the missing intermediate nonzero rung N=1800, turning the ' +
      'one-point-plus-two-zeros sample into a two-nonzero-point sample and showing directly that any apparent ' +
      'inter-rung growth is unphysical ULP jitter, not a resolved N-dependence.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    stillCoarseTwoPointSample:
      'The resolved sample now has TWO nonzero rungs (N=1800, N=2000). That is enough to show the apparent inter-rung ' +
      'growth is unphysical ULP jitter (p=18.5) and to prefer the N-independent floor, but two floor-level points do ' +
      'NOT pin a resolved growth exponent to few-percent accuracy; the N-dependence is consistent with zero, not ' +
      'measured to be zero.',
    measuresNotCertifies:
      'This measures ONE additional rung of the imp-3668 fifth-pair spread and tests the rounding models; it does NOT ' +
      're-certify the pairing (imp-3668), does NOT re-extract the literals via Sturm bisection (imp-3692), and does ' +
      'NOT construct the missing magnitude or attempt the imp-3066 K_a >= 0 positivity.',
    pairingNotAmplitudeLaw:
      'The quantity measured is the fifth-pair PAIRING degeneracy spread (lambda_9=lambda_10) only; it does NOT ' +
      'establish the fifth-pair AMPLITUDE LAW sigma_4=lambda_9/lambda_1 (the distinct pending Lanczos ticket).',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3733_FIFTH_PAIR_SPREAD_N1800_RESOLVED_ASSERTIONS = [
  {
    id: 'imp3733-n1800-nonzero-sub-ulp',
    why: 'THE PRIMARY MEASUREMENT: the N=1800 fifth-pair spread must be a genuine nonzero third data point at the ' +
      'few-ULP floor (measured 1.965626e-16 = 0.885 ULP, below one ULP).',
    holds: () => n1800IsNonzero && spread1800Ulps > 0 && spread1800Ulps < 1.5,
  },
  {
    id: 'imp3733-ladder-monotone-non-decreasing',
    why: 'The extended fifth-pair spread ladder 0, 0, 1.97e-16, 1.38e-15 must stay monotone non-decreasing in N ' +
      '(the new N=1800 rung slots below the N=2000 value).',
    holds: () => ladderMonotoneNonDecreasing && nonzeroRungs.length === 2,
  },
  {
    id: 'imp3733-ulp-floor-preferred-over-power-law',
    why: 'On the resolved two-nonzero-point sample the N-independent few-ULP floor must be preferred: both rungs sit ' +
      'below 10 ULP and the power-law exponent forced through them (18.47) is unphysical (> 2), i.e. ULP jitter not growth.',
    holds: () => ulpFloorModelPreferred && bothNonzeroBelowFloor && impliedPowerLawExponent > MAX_PHYSICAL_EXPONENT,
  },
  {
    id: 'imp3733-linear-Neps-model-still-falsified',
    why: 'The linear N*eps model must stay falsified on the resolved sample: both nonzero rungs use < 1% of their ' +
      'linear budgets (4.9e-4 at N=1800, 3.1e-3 at N=2000) and stay below PAIR_TOL=1e-14.',
    holds: () => linearModelStillFalsified && linearFraction1800 < 1e-2 && linearFraction2000 < 1e-2,
  },
  {
    id: 'imp3733-verdict-floor-not-power-law',
    why: 'The classified verdict must be the confirming resolved-floor result, not indeterminate; a flip means the ' +
      'nonzero measurement, the monotonicity, the floor-over-power-law preference, or the linear falsification failed.',
    holds: () => verdict.startsWith('THE-N=1800-RUNG-IS-A-RESOLVED-NONZERO-THIRD-DATA-POINT'),
  },
  {
    id: 'imp3733-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only, adds one resolved rung to a still-coarse two-nonzero-point sample -- ' +
      'prefers the floor over a residual power law but fits no exponent and re-certifies nothing; positivity not ' +
      'attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3733_FIFTH_PAIR_SPREAD_N1800_RESOLVED.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.stillCoarseTwoPointSample === 'string' &&
        typeof c.pairingNotAmplitudeLaw === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3733_FIFTH_PAIR_SPREAD_N1800_RESOLVED_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3733-fifth-pair-spread-n1800-resolved assertion failed: ${assertion.id}`);
  }
}

export default IMP3733_FIFTH_PAIR_SPREAD_N1800_RESOLVED;
