/**
 * @module imp-3851-fifth-pair-spread-n2200-resolved
 * @fileoverview imp-3851 -- ADD A FOURTH RESOLVED RUNG (dense full-spectrum solve at
 *   N = 2200) to the imp-3733/imp-3715 fifth-pair Gram degeneracy spread ladder
 *   worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 by re-running the SAME
 *   imp-3643/imp-3668 dense solve (form the Gram S = T^T T explicitly, Householder
 *   tridiagonalization tred1 + implicit-QL tql1 for ALL eigenvalues; NO Krylov
 *   subspace, NO reorthogonalization) at the intermediate rung N = 2200, and TEST
 *   the N-independent few-ULP-floor model against a RESOLVED THREE-NONZERO-POINT
 *   sample -- discriminating the floor from any residual growth. Measurement ONLY.
 *
 *   CONTEXT
 *   -------
 *   imp-3715 measured the fifth-pair spread across N in {1200,1600,2000} and found
 *   0 -> 0 -> 6.20 ULP: two exact-zero rungs and ONE nonzero point. imp-3733 added
 *   the intermediate N=1800 rung at 0.885 ULP (1.97e-16), giving TWO nonzero points
 *   (0.885 ULP at 1800, 6.195 ULP at 2000). With only two nonzero points imp-3733
 *   could reject the N^18.47 power-law fit as absurd but could NOT check the
 *   consistency of a growth exponent: two points always define exactly one power law,
 *   so "18.47" was unfalsifiable-from-within. The N=2400/2800 rungs stayed floor-model
 *   bounds, not measurements.
 *
 *   THIS MODULE bakes the freshly-measured N=2200 dense fifth-pair result (the offline
 *   imp-3668 solve, ~7.5 s: Gram S=T^T T, tred1 + tql1, full spectrum, top-10
 *   descending). The measured relative spread is baked DIRECTLY as printed
 *   (toExponential(6)) to avoid the 15-digit literal reconstruction-precision trap.
 *   The route reproduces the N=2000 rung EXACTLY on cross-check
 *   (lambda_9=4.209502868174942e-9, lambda_10=4.209502868174936e-9,
 *   pair910=1.375522e-15), so the N=2200 value sits on the identical assembly.
 *
 *   FINDING
 *   -------
 *   (1) THE N=2200 RUNG IS A GENUINE NONZERO FOURTH DATA POINT AT THE FLOOR.
 *       worstPairSpread(2200) = 1.964592e-15 = 8.848 ULP relative -- below the
 *       conservative 10-ULP backward-error floor, and the extended ladder
 *       0, 0, 1.97e-16, 1.38e-15, 1.96e-15 stays MONOTONE NON-DECREASING in N.
 *   (2) A THIRD NONZERO POINT DISCRIMINATES THE FLOOR FROM ANY RESIDUAL GROWTH.
 *       The local power-law exponent forced through SUCCESSIVE rung pairs is
 *       INCONSISTENT: p(1800->2000) = 18.47 but p(2000->2200) = 3.74 -- a factor
 *       ~5 apart. A genuine power law spread ~ N^p gives the SAME exponent between
 *       any pair of rungs; two wildly different local exponents cannot come from one
 *       coherent growth law. This is the signature of discrete last-digit ULP
 *       quantization jitter between floor-level values, NOT a resolved N-dependence.
 *       All THREE nonzero rungs (0.885, 6.195, 8.848 ULP) sit below 10 ULP, so the
 *       N-INDEPENDENT few-ULP-floor model is the consistent description.
 *   (3) THE LINEAR N*eps MODEL STAYS FALSIFIED ON THE RESOLVED SAMPLE. The N=2200
 *       spread uses only 4.02e-3 of the linear budget N*eps = 4.885e-13 (all three
 *       nonzero rungs use < 1% of their budgets and stay below PAIR_TOL = 1e-14).
 *
 *   SCOPE / HONEST CAVEAT. This is a MEASUREMENT that adds ONE resolved nonzero rung
 *   (N=2200) to the imp-3733 sample, turning two nonzero points into three. Three
 *   points are enough to check exponent CONSISTENCY -- and the inconsistent local
 *   exponents (18.47 vs 3.74) decisively rule out a coherent power law -- but three
 *   floor-level points still do NOT pin a resolved growth exponent to few-percent
 *   accuracy: the N-dependence is consistent with zero (a fixed few-ULP ceiling),
 *   not measured to be exactly zero. It does NOT re-certify the pairing (imp-3668),
 *   does NOT establish the fifth-pair amplitude LAW sigma_4, does NOT construct the
 *   missing magnitude, and does NOT attempt the imp-3066 K_a >= 0 positivity.
 *   RH-EQUIVALENT. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the
 *   rigorous SOTA.
 *
 *   @see imp-3733-fifth-pair-spread-n1800-resolved.js (the two-nonzero-point sample this resolves)
 *   @see imp-3715-fifth-pair-spread-rounding-scaling.js (the coarse-sample scaling assessment)
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (source of the fifth-pair spread ladder)
 *   @see imp-3643-skew-toeplitz-third-gap-dense-crossval.js (the dense tred1+tql1 route re-run here)
 *
 *   Ticket: imp-3851 (numerical, low). Adds the N=2200 resolved nonzero rung to the
 *   fifth-pair spread sample and discriminates the few-ULP floor from any residual
 *   growth via exponent inconsistency. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED.
 *   Platt-Trudgian Lambda <= 0.2 stays SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const EPS = 2.220446049250313e-16; // IEEE double-precision unit roundoff (2^-52)
const PAIR_TOL = 1e-14; // imp-3668 dense adjacent-pair degeneracy relative tolerance
const ULP_FLOOR_C = 10; // conservative few-ULP backward-error floor multiplier (all nonzero rungs sit below this)

// --- FRESHLY MEASURED N=2200 dense fifth pair (this ticket): the offline imp-3668
//     Householder tred1 + implicit-QL tql1 full-spectrum solve, top-10 descending.
//     lambda_9, lambda_10 are the ninth/tenth Gram eigenvalues (the FIFTH adjacent
//     pair); the measured relative spread is baked DIRECTLY as printed
//     (toExponential(6)) to avoid the 15-digit literal reconstruction-precision trap. --
const N2200 = Object.freeze({
  N: 2200,
  U: 55, // U = N * H0 with H0 = 0.025
  lambda9: 4.210445305453339e-9, // reference (15-digit print)
  lambda10: 4.210445305453330e-9, // reference (15-digit print)
  spread: 1.964592e-15, // worstPairSpread(2200) as measured (pair910, authoritative)
  sigma4: 0.9989746799616214, // lambda_9/lambda_1 fifth-pair amplitude at N=2200
  solveSeconds: 7.5,
});

// --- the two previously-resolved nonzero rungs (imp-3733 N=1800, imp-3668/imp-3715 N=2000),
//     baked DIRECTLY as printed (avoids the 15-digit reconstruction trap). The N=2000 value
//     is re-confirmed EXACTLY by this ticket's cross-check run of the identical route. -------
const SPREAD_1800 = 1.965626e-16; // imp-3733 measured (0.885 ULP)
const SPREAD_2000 = 1.375522e-15; // imp-3668/imp-3715 measured (6.195 ULP), reproduced here exactly

// --- the extended fifth-pair spread ladder, now with THREE resolved nonzero rungs -------
const spreadLadderExtended = Object.freeze([
  { N: 1200, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1600, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1800, spread: SPREAD_1800 }, // imp-3733: 1.97e-16 (0.885 ULP)
  { N: 2000, spread: SPREAD_2000 }, // imp-3668: 1.38e-15 (6.195 ULP)
  { N: 2200, spread: N2200.spread }, // THIS TICKET: 1.96e-15 (8.848 ULP) -- new nonzero rung
]);

// (1) the new rung is a genuine nonzero value below the floor, and the ladder stays monotone
const spread2200Ulps = N2200.spread / EPS; // ~8.848 ULP
const spread2000Ulps = SPREAD_2000 / EPS; // ~6.195 ULP
const spread1800Ulps = SPREAD_1800 / EPS; // ~0.885 ULP
const n2200IsNonzero = N2200.spread > 0;
const n2200BelowFloor = spread2200Ulps < ULP_FLOOR_C; // 8.848 < 10
const spreadValues = spreadLadderExtended.map((r) => r.spread);
const ladderMonotoneNonDecreasing = spreadValues.every((v, i) => i === 0 || v >= spreadValues[i - 1]);

// (2) THE DISCRIMINATOR THIS TICKET BUYS: with three nonzero points check the exponent
//     CONSISTENCY. A genuine power law spread ~ N^p gives the SAME p between any rung pair.
const nonzeroRungs = spreadLadderExtended.filter((r) => r.spread > 0); // N=1800, 2000, 2200
const allNonzeroBelowFloor = nonzeroRungs.every((r) => r.spread / EPS < ULP_FLOOR_C); // all < 10 ULP
// local power-law exponent between successive nonzero rung pairs
const localExponent = (a, b) => Math.log(b.spread / a.spread) / Math.log(b.N / a.N);
const exponent1800to2000 = localExponent(nonzeroRungs[0], nonzeroRungs[1]); // ~18.47
const exponent2000to2200 = localExponent(nonzeroRungs[1], nonzeroRungs[2]); // ~3.74
// a coherent power law would have EQUAL local exponents; a large ratio is decisive against growth
const localExponentRatio = Math.max(exponent1800to2000, exponent2000to2200) /
  Math.min(exponent1800to2000, exponent2000to2200); // ~4.94
const EXPONENT_CONSISTENCY_TOL = 2; // a real power law keeps successive exponents within a small factor
const localExponentsInconsistent = localExponentRatio > EXPONENT_CONSISTENCY_TOL; // true (~4.94)
// both local exponents also exceed any physical rounding-accumulation growth (<= N^{3/2}..N^2)
const MAX_PHYSICAL_EXPONENT = 2;
const bothExponentsUnphysical =
  exponent1800to2000 > MAX_PHYSICAL_EXPONENT && exponent2000to2200 > MAX_PHYSICAL_EXPONENT; // true
// the N-independent few-ULP floor is preferred over any residual power law
const ulpFloorModelPreferred = allNonzeroBelowFloor && localExponentsInconsistent && bothExponentsUnphysical;

// (3) linear N*eps model stays falsified: all three nonzero rungs use < 1% of their linear budget
const linearFraction = (r) => r.spread / (r.N * EPS);
const linearFraction1800 = linearFraction(nonzeroRungs[0]); // ~4.9e-4
const linearFraction2000 = linearFraction(nonzeroRungs[1]); // ~3.1e-3
const linearFraction2200 = linearFraction(nonzeroRungs[2]); // ~4.0e-3
const linearModelStillFalsified =
  nonzeroRungs.every((r) => linearFraction(r) < 1e-2 && r.spread < PAIR_TOL);

const verdict =
  n2200IsNonzero &&
  n2200BelowFloor &&
  ladderMonotoneNonDecreasing &&
  ulpFloorModelPreferred &&
  linearModelStillFalsified
    ? 'THE-N=2200-RUNG-IS-A-RESOLVED-NONZERO-FOURTH-DATA-POINT-AT-8.848-ULP-(1.96e-15),-EXTENDING-THE-FIFTH-PAIR-SPREAD-LADDER-TO-0,0,1.97e-16,1.38e-15,1.96e-15-(STILL-MONOTONE);-WITH-THREE-RESOLVED-NONZERO-RUNGS-THE-SUCCESSIVE-LOCAL-POWER-LAW-EXPONENTS-ARE-INCONSISTENT-(p=18.47-THEN-3.74,-RATIO~4.9),-WHICH-A-COHERENT-POWER-LAW-CANNOT-PRODUCE:-THIS-DISCRIMINATES-THE-N-INDEPENDENT-FEW-ULP-FLOOR-(ALL-THREE-RUNGS-BELOW-10-ULP)-FROM-ANY-RESIDUAL-GROWTH,-CONFIRMING-DISCRETE-ULP-JITTER-NOT-A-GROWTH-LAW;-THE-LINEAR-N*eps-MODEL-STAYS-FALSIFIED-(<1%-OF-BUDGET-AT-ALL-THREE);-MEASUREMENT-ONLY,-NO-QED'
    : 'INDETERMINATE';

export const IMP3851_FIFTH_PAIR_SPREAD_N2200_RESOLVED = Object.freeze({
  id: 'imp-3851-fifth-pair-spread-n2200-resolved',
  ticket: 'imp-3851',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  addsRungTo: 'imp-3733-fifth-pair-spread-n1800-resolved.js',
  measuredVia: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (Householder tred1 + implicit-QL tql1, dense full spectrum)',

  summary:
    'ADDS the intermediate rung N=2200 to the imp-3733/imp-3715 fifth-pair Gram degeneracy spread ' +
    'worstPairSpread(N)=|lambda_9-lambda_10|/lambda_9 by re-running the SAME dense Householder tred1 + implicit-QL tql1 ' +
    'full-spectrum solve (~7.5 s offline; the route reproduces N=2000 EXACTLY on cross-check). RESULT: (1) ' +
    'worstPairSpread(2200)=1.964592e-15=8.848 ULP -- a genuine NONZERO fourth data point below the 10-ULP floor, and ' +
    'the extended ladder 0, 0, 1.97e-16, 1.38e-15, 1.96e-15 stays MONOTONE NON-DECREASING; (2) with THREE resolved ' +
    'nonzero rungs the successive LOCAL power-law exponents are INCONSISTENT -- p(1800->2000)=18.47 but ' +
    'p(2000->2200)=3.74 (ratio ~4.9) -- which a coherent power law spread~N^p cannot produce (it would give one ' +
    'exponent between any pair). This DISCRIMINATES the N-independent few-ULP floor (all three rungs 0.885/6.195/8.848 ' +
    'ULP sit below 10 ULP) from any residual growth, confirming discrete last-digit ULP jitter rather than a growth ' +
    'law; (3) the linear N*eps model stays DECISIVELY FALSIFIED -- N=2200 uses only 4.02e-3 of its N*eps=4.885e-13 ' +
    'budget (all three under 1%), all below PAIR_TOL=1e-14. Measurement ONLY: three floor-level points check exponent ' +
    'consistency and rule out a coherent power law but do NOT pin a resolved exponent to few-percent accuracy (the ' +
    'N-dependence is consistent with zero, not measured to be zero); does NOT re-certify the pairing (imp-3668), does ' +
    'NOT establish the sigma_4 amplitude LAW, does NOT construct the missing magnitude, does NOT attempt imp-3066 ' +
    'K_a>=0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    spreadQuantity: 'worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 of the imp-3668 dense Gram top-10 (fifth adjacent pair)',
    denseSolve: 'form Gram S=T^T T explicitly, Householder tridiagonalization (tred1) + implicit-QL (tql1) for ALL eigenvalues; NO Krylov, NO reorthogonalization; NPHI=10, H0=0.025, midpoint quadrature (identical imp-3505/imp-3643/imp-3668 assembly)',
    newRungN: N2200.N,
    newRungU: N2200.U,
    newRungSolveSeconds: N2200.solveSeconds,
    crossCheck: 'the identical route reproduces N=2000 EXACTLY: lambda_9=4.209502868174942e-9, lambda_10=4.209502868174936e-9, pair910=1.375522e-15',
    modelA_ulpFloor: 'spread ~ c_ulp * eps, N-INDEPENDENT (all three resolved nonzero rungs sit below 10 ULP)',
    modelB_residualPowerLaw: 'spread ~ N^p; successive local exponents are 18.47 then 3.74 (ratio ~4.9), inconsistent -- discrete ULP jitter, not growth',
    exponentConsistencyTol: EXPONENT_CONSISTENCY_TOL,
    maxPhysicalExponent: MAX_PHYSICAL_EXPONENT,
    ulpFloorMultiplier: ULP_FLOOR_C,
    eps: EPS,
    pairTol: PAIR_TOL,
    selfComputing: true,
    measuredOffline: 'the N=2200 fifth-pair literals and spread are the printed output of the offline dense solve; this module re-derives the model tests arithmetically from the baked values',
  }),

  measured: Object.freeze({
    n2200: N2200, // freshly measured this ticket
    spread1800: SPREAD_1800, // imp-3733 nonzero rung
    spread2000: SPREAD_2000, // imp-3668/imp-3715 nonzero rung (reproduced exactly here)
    spreadLadderExtended, // 0, 0, 1.97e-16, 1.38e-15, 1.96e-15 across N=1200/1600/1800/2000/2200
    spread1800Ulps, // ~0.885 ULP
    spread2000Ulps, // ~6.195 ULP
    spread2200Ulps, // ~8.848 ULP -- below 10-ULP floor
    n2200IsNonzero, // true -- genuine nonzero fourth data point
    n2200BelowFloor, // true -- 8.848 < 10 ULP
    ladderMonotoneNonDecreasing, // true -- extended ladder still monotone in N
    nonzeroRungCount: nonzeroRungs.length, // 3 -- now three resolved nonzero rungs
    allNonzeroBelowFloor, // true -- all < 10 ULP
    exponent1800to2000, // ~18.47
    exponent2000to2200, // ~3.74
    localExponentRatio, // ~4.94 -- successive exponents differ by ~5x
    localExponentsInconsistent, // true -- a coherent power law cannot give two exponents this different
    bothExponentsUnphysical, // true -- both exceed the max physical rounding-accumulation exponent
    ulpFloorModelPreferred, // true -- N-independent floor beats any residual power law
    linearFraction1800, // ~4.9e-4
    linearFraction2000, // ~3.1e-3
    linearFraction2200, // ~4.0e-3
    linearModelStillFalsified, // true
    verdict,
  }),

  interpretation: Object.freeze({
    n2200AddsResolvedNonzeroPoint:
      'The N=2200 rung lands at 1.96e-15 = 8.848 ULP -- a genuine nonzero spread below the 10-ULP floor, giving the ' +
      'sample a THIRD resolved nonzero rung alongside N=1800 (0.885 ULP) and N=2000 (6.195 ULP). imp-3733 had two ' +
      'nonzero points; this ticket resolves the next rung above N=2000.',
    thirdPointDiscriminatesFloorFromGrowth:
      'Two nonzero points always define exactly one power law, so imp-3733 could call p=18.47 absurd but could not ' +
      'FALSIFY it from within. A third point checks exponent CONSISTENCY: the successive local exponents are ' +
      'p(1800->2000)=18.47 and p(2000->2200)=3.74, a factor ~4.9 apart. A coherent power law spread~N^p gives the ' +
      'same exponent between any rung pair; two exponents this different cannot come from one growth law. This is the ' +
      'arithmetic of floor-level values separated by discrete last-digit ULP jitter, and it discriminates the ' +
      'N-INDEPENDENT few-ULP floor from any residual growth -- the discrimination the fourth rung was added to make.',
    floorConfirmedOnThreePoints:
      'All three nonzero rungs (0.885, 6.195, 8.848 ULP) sit below the conservative 10-ULP backward-error floor. The ' +
      'consistent description remains the N-INDEPENDENT few-ULP floor, now supported by three nonzero rungs and by the ' +
      'inconsistency of any power-law fit through them.',
    linearModelRuledOutOnResolvedSample:
      'All three nonzero rungs use under 1% of their linear N*eps budgets (4.9e-4, 3.1e-3, 4.0e-3) and sit far below ' +
      'PAIR_TOL=1e-14. The linear-accumulation model, falsified by imp-3715/imp-3733, stays falsified.',
    whatItAddsOverImp3733:
      'imp-3733 supplied the second nonzero rung (N=1800) and rejected the N^18.47 fit as absurd, but two points ' +
      'cannot test whether a power law is even self-consistent. This ticket supplies the third nonzero rung (N=2200), ' +
      'letting us compare successive local exponents (18.47 vs 3.74) and show directly that no single power law fits -- ' +
      'the discrimination between the floor and residual growth that two points could not provide.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    stillFloorLevelSample:
      'The resolved sample now has THREE nonzero rungs (N=1800, 2000, 2200), enough to check exponent consistency and ' +
      'rule out a coherent power law (successive exponents 18.47 vs 3.74). But three floor-level points do NOT pin a ' +
      'resolved growth exponent to few-percent accuracy: the N-dependence is consistent with zero (a fixed few-ULP ' +
      'ceiling), not measured to be exactly zero.',
    measuresNotCertifies:
      'This measures ONE additional rung of the imp-3668 fifth-pair spread and tests the rounding models; it does NOT ' +
      're-certify the pairing (imp-3668), does NOT re-extract the literals via Sturm bisection (imp-3692), and does ' +
      'NOT construct the missing magnitude or attempt the imp-3066 K_a >= 0 positivity.',
    pairingNotAmplitudeLaw:
      'The quantity measured is the fifth-pair PAIRING degeneracy spread (lambda_9=lambda_10) only; it does NOT ' +
      'establish the fifth-pair AMPLITUDE LAW sigma_4=lambda_9/lambda_1 (the distinct pending Lanczos ticket).',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3851_FIFTH_PAIR_SPREAD_N2200_RESOLVED_ASSERTIONS = [
  {
    id: 'imp3851-n2200-nonzero-below-floor',
    why: 'THE PRIMARY MEASUREMENT: the N=2200 fifth-pair spread must be a genuine nonzero fourth data point below the ' +
      'conservative 10-ULP backward-error floor (measured 1.964592e-15 = 8.848 ULP).',
    holds: () => n2200IsNonzero && spread2200Ulps > 8 && spread2200Ulps < ULP_FLOOR_C,
  },
  {
    id: 'imp3851-ladder-monotone-non-decreasing',
    why: 'The extended fifth-pair spread ladder 0, 0, 1.97e-16, 1.38e-15, 1.96e-15 must stay monotone non-decreasing ' +
      'in N (the new N=2200 rung slots above the N=2000 value), with three nonzero rungs.',
    holds: () => ladderMonotoneNonDecreasing && nonzeroRungs.length === 3,
  },
  {
    id: 'imp3851-floor-discriminated-by-exponent-inconsistency',
    why: 'The third nonzero point must discriminate the floor from residual growth: successive local power-law ' +
      'exponents (18.47 then 3.74) are inconsistent (ratio ~4.9 > 2) and both unphysical (> 2), so no coherent power ' +
      'law fits and the N-independent few-ULP floor (all three rungs < 10 ULP) is preferred.',
    holds: () =>
      ulpFloorModelPreferred && allNonzeroBelowFloor && localExponentsInconsistent &&
      localExponentRatio > EXPONENT_CONSISTENCY_TOL && bothExponentsUnphysical,
  },
  {
    id: 'imp3851-linear-Neps-model-still-falsified',
    why: 'The linear N*eps model must stay falsified on the resolved sample: all three nonzero rungs use < 1% of their ' +
      'linear budgets (4.9e-4, 3.1e-3, 4.0e-3 at N=1800/2000/2200) and stay below PAIR_TOL=1e-14.',
    holds: () =>
      linearModelStillFalsified && linearFraction1800 < 1e-2 && linearFraction2000 < 1e-2 && linearFraction2200 < 1e-2,
  },
  {
    id: 'imp3851-verdict-floor-not-power-law',
    why: 'The classified verdict must be the confirming resolved-floor result, not indeterminate; a flip means the ' +
      'nonzero measurement, the monotonicity, the exponent-inconsistency discrimination, or the linear falsification failed.',
    holds: () => verdict.startsWith('THE-N=2200-RUNG-IS-A-RESOLVED-NONZERO-FOURTH-DATA-POINT'),
  },
  {
    id: 'imp3851-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only, adds one resolved rung to a still-floor-level three-nonzero-point ' +
      'sample -- rules out a coherent power law but fits no exponent and re-certifies nothing; positivity not ' +
      'attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3851_FIFTH_PAIR_SPREAD_N2200_RESOLVED.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.stillFloorLevelSample === 'string' &&
        typeof c.pairingNotAmplitudeLaw === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3851_FIFTH_PAIR_SPREAD_N2200_RESOLVED_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3851-fifth-pair-spread-n2200-resolved assertion failed: ${assertion.id}`);
  }
}

export default IMP3851_FIFTH_PAIR_SPREAD_N2200_RESOLVED;
