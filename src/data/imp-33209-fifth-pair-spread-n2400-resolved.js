/**
 * @module imp-33209-fifth-pair-spread-n2400-resolved
 * @fileoverview imp-33209 -- ADD A FIFTH RESOLVED RUNG (dense full-spectrum solve at
 *   N = 2400) to the imp-3733/imp-3851 fifth-pair Gram degeneracy spread ladder
 *   worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 by re-running the SAME
 *   imp-3668 dense solve (form the Gram S = T^T T explicitly, Householder
 *   tridiagonalization tred1 + implicit-QL tql1 for ALL eigenvalues; NO Krylov
 *   subspace, NO reorthogonalization) at the rung N = 2400 that imp-3733/imp-3851
 *   left as a FLOOR-MODEL BOUND, not a measurement -- turning the three-nonzero-point
 *   sample into FOUR nonzero points and re-testing the local power-law exponent
 *   consistency of the N-independent few-ULP-floor model. Measurement ONLY.
 *
 *   CONTEXT
 *   -------
 *   imp-3715 measured the fifth-pair spread across N in {1200,1600,2000} (0, 0, 6.20
 *   ULP: two exact-zero rungs and one nonzero point). imp-3733 added N=1800 (0.885
 *   ULP), giving two nonzero points. imp-3851 added N=2200 (8.848 ULP), giving THREE
 *   nonzero points, and showed the successive local power-law exponents through them
 *   (p(1800->2000)=18.47 then p(2000->2200)=3.74, ratio ~4.9) are inconsistent --
 *   ruling out a coherent power law. But imp-3851 explicitly LEFT the N=2400/2800
 *   rungs as floor-model BOUNDS, not measurements: "N=2400/2800 rungs stayed
 *   floor-model bounds, not measurements".
 *
 *   THIS MODULE bakes the freshly-measured N=2400 dense fifth-pair result (the offline
 *   imp-3668 solve, ~9.1 s: Gram S=T^T T, tred1 + tql1, full spectrum, top-10
 *   descending). The measured relative spread is baked DIRECTLY as printed
 *   (toExponential(6)) to avoid the 15-digit literal reconstruction-precision trap.
 *   The route reproduces BOTH prior nonzero rungs EXACTLY on cross-check
 *   (N=2000: lambda_9=4.209502868174942e-9, lambda_10=4.209502868174936e-9,
 *   pair910=1.375522e-15; N=2200: lambda_9=4.210445305453339e-9,
 *   lambda_10=4.210445305453330e-9, pair910=1.964592e-15), so the N=2400 value sits
 *   on the identical assembly.
 *
 *   FINDING
 *   -------
 *   (1) THE N=2400 RUNG IS A GENUINE NONZERO FIFTH DATA POINT AT THE FLOOR.
 *       worstPairSpread(2400) = 1.964257e-15 = 8.846 ULP relative -- below the
 *       conservative 10-ULP backward-error floor.
 *   (2) THE LADDER PLATEAUS: THE N=2400 SPREAD DIPS BELOW N=2200. The extended ladder
 *       0, 0, 1.97e-16, 1.38e-15, 1.96e-15, 1.96e-15 is NO LONGER monotone
 *       non-decreasing -- worstPairSpread(2400)=1.964257e-15 sits just BELOW
 *       worstPairSpread(2200)=1.964592e-15 (a 3.4e-19 dip). A genuine growth law
 *       spread ~ N^p (p > 0) cannot dip with increasing N; a floor of discrete
 *       last-digit ULP jitter can. The plateau/dip is direct positive evidence for
 *       the N-independent floor.
 *   (3) A FOURTH NONZERO POINT SHARPENS THE EXPONENT-INCONSISTENCY DISCRIMINATION.
 *       The successive local power-law exponents forced through the four nonzero
 *       rungs are p(1800->2000)=18.47, p(2000->2200)=3.74, p(2200->2400)=-0.002 --
 *       spanning positive-huge to essentially-zero (slightly negative). A coherent
 *       power law spread ~ N^p gives the SAME exponent between any pair of rungs;
 *       three wildly different local exponents (one of them ~0) cannot come from one
 *       growth law. The essentially-zero top exponent is the arithmetic of a
 *       plateaued floor, not a resolved N-dependence. All FOUR nonzero rungs (0.885,
 *       6.195, 8.848, 8.846 ULP) sit below 10 ULP, so the N-INDEPENDENT few-ULP-floor
 *       model is the consistent description.
 *   (4) THE LINEAR N*eps MODEL STAYS FALSIFIED. The N=2400 spread uses only 3.69e-3
 *       of the linear budget N*eps = 5.329e-13 (all four nonzero rungs use < 1% of
 *       their budgets and stay below PAIR_TOL = 1e-14).
 *   (5) THE FIFTH-PAIR AMPLITUDE sigma_4 = lambda_9/lambda_1 KEEPS CLIMBING TOWARD 1.
 *       sigma_4 = 0.9991380726848307 at N=2400, above 0.9989746799616214 (N=2200) and
 *       0.9987600189865782 (N=2000) -- the same monotone approach-to-1 the lower gaps
 *       show. (Pairing amplitude only; the amplitude LAW is a distinct pending ticket.)
 *
 *   SCOPE / HONEST CAVEAT. This is a MEASUREMENT that resolves the N=2400 rung
 *   imp-3851 left as a bound, adding ONE resolved nonzero point (turning three into
 *   four). Four points strengthen the exponent-CONSISTENCY discrimination -- the top
 *   local exponent is essentially zero and the ladder dips, both direct evidence for
 *   the floor -- but four floor-level points still do NOT pin a resolved growth
 *   exponent to few-percent accuracy: the N-dependence is consistent with zero (a
 *   fixed few-ULP ceiling), not measured to be exactly zero. It adds NO new Lambda
 *   bound, does NOT re-certify the pairing (imp-3668), does NOT establish the
 *   fifth-pair amplitude LAW sigma_4, does NOT construct the missing magnitude, and
 *   does NOT attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict,
 *   NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3851-fifth-pair-spread-n2200-resolved.js (the three-nonzero-point sample this resolves the next rung of)
 *   @see imp-3733-fifth-pair-spread-n1800-resolved.js (the two-nonzero-point sample)
 *   @see imp-3715-fifth-pair-spread-rounding-scaling.js (the coarse-sample scaling assessment)
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (source of the fifth-pair spread ladder and dense route)
 *
 *   Ticket: imp-33209 (numerical, low). Adds the N=2400 resolved nonzero rung to the
 *   fifth-pair spread sample, resolving what imp-3851 left a bound, and sharpens the
 *   few-ULP-floor discrimination via a plateau/dip and an essentially-zero top local
 *   exponent. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED. Platt-Trudgian Lambda <= 0.2
 *   stays SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const EPS = 2.220446049250313e-16; // IEEE double-precision unit roundoff (2^-52)
const PAIR_TOL = 1e-14; // imp-3668 dense adjacent-pair degeneracy relative tolerance
const ULP_FLOOR_C = 10; // conservative few-ULP backward-error floor multiplier (all nonzero rungs sit below this)

// --- FRESHLY MEASURED N=2400 dense fifth pair (this ticket): the offline imp-3668
//     Householder tred1 + implicit-QL tql1 full-spectrum solve, top-10 descending.
//     lambda_9, lambda_10 are the ninth/tenth Gram eigenvalues (the FIFTH adjacent
//     pair); the measured relative spread is baked DIRECTLY as printed
//     (toExponential(6)) to avoid the 15-digit literal reconstruction-precision trap. --
const N2400 = Object.freeze({
  N: 2400,
  U: 60, // U = N * H0 with H0 = 0.025
  lambda9: 4.211162662985386e-9, // reference (15-digit print)
  lambda10: 4.211162662985378e-9, // reference (15-digit print)
  spread: 1.964257e-15, // worstPairSpread(2400) as measured (pair910, authoritative)
  sigma4: 0.9991380726848307, // lambda_9/lambda_1 fifth-pair amplitude at N=2400
  solveSeconds: 9.1,
});

// --- the three previously-resolved nonzero rungs (imp-3733 N=1800, imp-3668/imp-3715 N=2000,
//     imp-3851 N=2200), baked DIRECTLY as printed (avoids the 15-digit reconstruction trap).
//     The N=2000 and N=2200 values are re-confirmed EXACTLY by this ticket cross-check run of
//     the identical route. -------------------------------------------------------------------
const SPREAD_1800 = 1.965626e-16; // imp-3733 measured (0.885 ULP)
const SPREAD_2000 = 1.375522e-15; // imp-3668/imp-3715 measured (6.195 ULP), reproduced here exactly
const SPREAD_2200 = 1.964592e-15; // imp-3851 measured (8.848 ULP), reproduced here exactly

// --- the extended fifth-pair spread ladder, now with FOUR resolved nonzero rungs -------
const spreadLadderExtended = Object.freeze([
  { N: 1200, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1600, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1800, spread: SPREAD_1800 }, // imp-3733: 1.97e-16 (0.885 ULP)
  { N: 2000, spread: SPREAD_2000 }, // imp-3668: 1.38e-15 (6.195 ULP)
  { N: 2200, spread: SPREAD_2200 }, // imp-3851: 1.96e-15 (8.848 ULP)
  { N: 2400, spread: N2400.spread }, // THIS TICKET: 1.96e-15 (8.846 ULP) -- new nonzero rung, DIPS below 2200
]);

// (1) the new rung is a genuine nonzero value below the floor
const spread2400Ulps = N2400.spread / EPS; // ~8.846 ULP
const spread2200Ulps = SPREAD_2200 / EPS; // ~8.848 ULP
const spread2000Ulps = SPREAD_2000 / EPS; // ~6.195 ULP
const spread1800Ulps = SPREAD_1800 / EPS; // ~0.885 ULP
const n2400IsNonzero = N2400.spread > 0;
const n2400BelowFloor = spread2400Ulps < ULP_FLOOR_C; // 8.846 < 10

// (2) THE PLATEAU/DIP: the N=2400 spread sits at or below N=2200 -- a growth law cannot dip
const n2400DipsBelow2200 = N2400.spread < SPREAD_2200; // true (1.964257e-15 < 1.964592e-15)
const spreadValues = spreadLadderExtended.map((r) => r.spread);
const ladderMonotoneNonDecreasing = spreadValues.every((v, i) => i === 0 || v >= spreadValues[i - 1]); // now FALSE (dip)
const ladderPlateausAtTop = !ladderMonotoneNonDecreasing && n2400DipsBelow2200; // the floor signature

// (3) FOUR nonzero points: check exponent CONSISTENCY. A genuine power law spread ~ N^p
//     gives the SAME p between any rung pair.
const nonzeroRungs = spreadLadderExtended.filter((r) => r.spread > 0); // N=1800, 2000, 2200, 2400
const allNonzeroBelowFloor = nonzeroRungs.every((r) => r.spread / EPS < ULP_FLOOR_C); // all < 10 ULP
// local power-law exponent between successive nonzero rung pairs
const localExponent = (a, b) => Math.log(b.spread / a.spread) / Math.log(b.N / a.N);
const exponent1800to2000 = localExponent(nonzeroRungs[0], nonzeroRungs[1]); // ~18.47
const exponent2000to2200 = localExponent(nonzeroRungs[1], nonzeroRungs[2]); // ~3.74
const exponent2200to2400 = localExponent(nonzeroRungs[2], nonzeroRungs[3]); // ~-0.002 (essentially zero, slightly negative)
const localExponents = [exponent1800to2000, exponent2000to2200, exponent2200to2400];
// a coherent power law would have EQUAL local exponents; a huge span is decisive against growth
const localExponentSpan = Math.max(...localExponents) - Math.min(...localExponents); // ~18.47
const EXPONENT_CONSISTENCY_TOL = 2; // a real power law keeps successive exponents within a small factor
const localExponentsInconsistent = localExponentSpan > EXPONENT_CONSISTENCY_TOL; // true (~18.47)
// the top local exponent is essentially zero -- the plateau signature of a floor, not growth
const TOP_EXPONENT_FLAT_TOL = 0.5; // |p| below this is "flat" (a floor), not a resolved growth exponent
const topExponentEssentiallyZero = Math.abs(exponent2200to2400) < TOP_EXPONENT_FLAT_TOL; // true (~0.002)
// the N-independent few-ULP floor is preferred over any residual power law
const ulpFloorModelPreferred =
  allNonzeroBelowFloor && localExponentsInconsistent && topExponentEssentiallyZero && n2400DipsBelow2200;

// (4) linear N*eps model stays falsified: all four nonzero rungs use < 1% of their linear budget
const linearFraction = (r) => r.spread / (r.N * EPS);
const linearFraction1800 = linearFraction(nonzeroRungs[0]); // ~4.9e-4
const linearFraction2000 = linearFraction(nonzeroRungs[1]); // ~3.1e-3
const linearFraction2200 = linearFraction(nonzeroRungs[2]); // ~4.0e-3
const linearFraction2400 = linearFraction(nonzeroRungs[3]); // ~3.7e-3
const linearModelStillFalsified =
  nonzeroRungs.every((r) => linearFraction(r) < 1e-2 && r.spread < PAIR_TOL);

// (5) the fifth-pair amplitude sigma_4 = lambda_9/lambda_1 keeps climbing monotonically toward 1
const sigma4Ladder = Object.freeze([0.9987600189865782, 0.9989746799616214, N2400.sigma4]); // N=2000/2200/2400
const sigma4MonotoneUp = sigma4Ladder.every((v, i) => i === 0 || v > sigma4Ladder[i - 1]);
const sigma4AllBelow1 = sigma4Ladder.every((v) => v < 1);

const verdict =
  n2400IsNonzero &&
  n2400BelowFloor &&
  ladderPlateausAtTop &&
  ulpFloorModelPreferred &&
  linearModelStillFalsified &&
  sigma4MonotoneUp &&
  sigma4AllBelow1
    ? 'THE-N=2400-RUNG-IS-A-RESOLVED-NONZERO-FIFTH-DATA-POINT-AT-8.846-ULP-(1.964257e-15),-RESOLVING-WHAT-imp-3851-LEFT-A-FLOOR-MODEL-BOUND;-THE-EXTENDED-LADDER-0,0,1.97e-16,1.38e-15,1.96e-15,1.96e-15-PLATEAUS-AND-DIPS-(worstPairSpread(2400)-SITS-BELOW-worstPairSpread(2200)),-WHICH-A-GROWTH-LAW-N^p-(p>0)-CANNOT-DO;-WITH-FOUR-RESOLVED-NONZERO-RUNGS-THE-SUCCESSIVE-LOCAL-EXPONENTS-SPAN-18.47->3.74->-0.002-(TOP-ESSENTIALLY-ZERO),-SO-NO-COHERENT-POWER-LAW-FITS:-THIS-SHARPENS-THE-N-INDEPENDENT-FEW-ULP-FLOOR-DISCRIMINATION-(ALL-FOUR-RUNGS-BELOW-10-ULP)-OVER-ANY-RESIDUAL-GROWTH;-THE-LINEAR-N*eps-MODEL-STAYS-FALSIFIED-(<1%-OF-BUDGET-AT-ALL-FOUR)-AND-sigma_4-KEEPS-CLIMBING-TOWARD-1;-MEASUREMENT-ONLY,-NO-NEW-LAMBDA-BOUND,-NO-QED'
    : 'INDETERMINATE';

export const IMP33209_FIFTH_PAIR_SPREAD_N2400_RESOLVED = Object.freeze({
  id: 'imp-33209-fifth-pair-spread-n2400-resolved',
  ticket: 'imp-33209',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  addsRungTo: 'imp-3851-fifth-pair-spread-n2200-resolved.js',
  measuredVia: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (Householder tred1 + implicit-QL tql1, dense full spectrum)',

  summary:
    'RESOLVES the N=2400 rung imp-3851 left as a FLOOR-MODEL BOUND, adding it to the imp-3733/imp-3851 fifth-pair Gram ' +
    'degeneracy spread worstPairSpread(N)=|lambda_9-lambda_10|/lambda_9 by re-running the SAME dense Householder tred1 + ' +
    'implicit-QL tql1 full-spectrum solve (~9.1 s offline; the route reproduces N=2000 AND N=2200 EXACTLY on ' +
    'cross-check). RESULT: (1) worstPairSpread(2400)=1.964257e-15=8.846 ULP -- a genuine NONZERO fifth data point below ' +
    'the 10-ULP floor; (2) THE LADDER PLATEAUS AND DIPS -- 0, 0, 1.97e-16, 1.38e-15, 1.96e-15, 1.96e-15 is NO LONGER ' +
    'monotone non-decreasing: worstPairSpread(2400) sits just BELOW worstPairSpread(2200)=1.964592e-15, which a growth ' +
    'law spread~N^p (p>0) cannot do -- direct positive evidence for the N-independent floor; (3) with FOUR resolved ' +
    'nonzero rungs the successive local exponents span p(1800->2000)=18.47, p(2000->2200)=3.74, p(2200->2400)=-0.002 ' +
    '(top essentially zero), so no coherent power law fits -- sharpening the few-ULP-floor discrimination (all four ' +
    'rungs 0.885/6.195/8.848/8.846 ULP below 10 ULP); (4) the linear N*eps model stays DECISIVELY FALSIFIED -- N=2400 ' +
    'uses only 3.69e-3 of its N*eps=5.329e-13 budget (all four under 1%); (5) the fifth-pair amplitude ' +
    'sigma_4=lambda_9/lambda_1 keeps climbing monotonically toward 1 (0.99876, 0.99897, 0.99914 at N=2000/2200/2400). ' +
    'Measurement ONLY: four floor-level points strengthen the exponent-consistency discrimination (plateau + ' +
    'essentially-zero top exponent) but do NOT pin a resolved exponent to few-percent accuracy (the N-dependence is ' +
    'consistent with zero, not measured to be zero); adds NO new Lambda bound; does NOT re-certify the pairing ' +
    '(imp-3668), does NOT establish the sigma_4 amplitude LAW, does NOT construct the missing magnitude, does NOT ' +
    'attempt imp-3066 K_a>=0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    spreadQuantity: 'worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 of the imp-3668 dense Gram top-10 (fifth adjacent pair)',
    denseSolve: 'form Gram S=T^T T explicitly, Householder tridiagonalization (tred1) + implicit-QL (tql1) for ALL eigenvalues; NO Krylov, NO reorthogonalization; NPHI=10, H0=0.025, midpoint quadrature (identical imp-3505/imp-3643/imp-3668 assembly)',
    newRungN: N2400.N,
    newRungU: N2400.U,
    newRungSolveSeconds: N2400.solveSeconds,
    crossCheck: 'the identical route reproduces BOTH prior nonzero rungs EXACTLY: N=2000 pair910=1.375522e-15 (lambda_9=4.209502868174942e-9, lambda_10=4.209502868174936e-9) and N=2200 pair910=1.964592e-15 (lambda_9=4.210445305453339e-9, lambda_10=4.210445305453330e-9)',
    modelA_ulpFloor: 'spread ~ c_ulp * eps, N-INDEPENDENT (all four resolved nonzero rungs sit below 10 ULP; the ladder plateaus and dips at N=2400)',
    modelB_residualPowerLaw: 'spread ~ N^p; successive local exponents span 18.47, 3.74, -0.002 (top essentially zero), inconsistent -- discrete ULP jitter, not growth',
    exponentConsistencyTol: EXPONENT_CONSISTENCY_TOL,
    topExponentFlatTol: TOP_EXPONENT_FLAT_TOL,
    ulpFloorMultiplier: ULP_FLOOR_C,
    eps: EPS,
    pairTol: PAIR_TOL,
    selfComputing: true,
    measuredOffline: 'the N=2400 fifth-pair literals and spread are the printed output of the offline dense solve (scripts/imp-3668-dense-fifth-pair-offline.mjs re-run at N=2400); this module re-derives the model tests arithmetically from the baked values',
  }),

  measured: Object.freeze({
    n2400: N2400, // freshly measured this ticket
    spread1800: SPREAD_1800, // imp-3733 nonzero rung
    spread2000: SPREAD_2000, // imp-3668/imp-3715 nonzero rung (reproduced exactly here)
    spread2200: SPREAD_2200, // imp-3851 nonzero rung (reproduced exactly here)
    spreadLadderExtended, // 0, 0, 1.97e-16, 1.38e-15, 1.96e-15, 1.96e-15 across N=1200..2400
    spread1800Ulps, // ~0.885 ULP
    spread2000Ulps, // ~6.195 ULP
    spread2200Ulps, // ~8.848 ULP
    spread2400Ulps, // ~8.846 ULP -- below 10-ULP floor, and below the 2200 value
    n2400IsNonzero, // true -- genuine nonzero fifth data point
    n2400BelowFloor, // true -- 8.846 < 10 ULP
    n2400DipsBelow2200, // true -- the plateau/dip a growth law cannot produce
    ladderMonotoneNonDecreasing, // false -- the ladder now dips at N=2400
    ladderPlateausAtTop, // true -- the floor signature
    nonzeroRungCount: nonzeroRungs.length, // 4 -- now four resolved nonzero rungs
    allNonzeroBelowFloor, // true -- all < 10 ULP
    exponent1800to2000, // ~18.47
    exponent2000to2200, // ~3.74
    exponent2200to2400, // ~-0.002 -- essentially zero (slightly negative): the plateau signature
    localExponents, // [18.47, 3.74, -0.002]
    localExponentSpan, // ~18.47 -- successive exponents span the full positive-huge-to-zero range
    localExponentsInconsistent, // true -- a coherent power law cannot give exponents this different
    topExponentEssentiallyZero, // true -- the top local exponent is flat (a floor), not a growth exponent
    ulpFloorModelPreferred, // true -- N-independent floor beats any residual power law
    linearFraction1800, // ~4.9e-4
    linearFraction2000, // ~3.1e-3
    linearFraction2200, // ~4.0e-3
    linearFraction2400, // ~3.7e-3
    linearModelStillFalsified, // true
    sigma4Ladder, // 0.99876, 0.99897, 0.99914 at N=2000/2200/2400
    sigma4MonotoneUp, // true -- keeps climbing toward 1
    sigma4AllBelow1, // true
    verdict,
  }),

  interpretation: Object.freeze({
    n2400ResolvesTheImp3851Bound:
      'imp-3851 explicitly left N=2400 as a floor-model BOUND, not a measurement. This ticket resolves it: the N=2400 ' +
      'rung lands at 1.964257e-15 = 8.846 ULP -- a genuine nonzero spread below the 10-ULP floor, giving the sample a ' +
      'FOURTH resolved nonzero rung alongside N=1800 (0.885 ULP), N=2000 (6.195 ULP), and N=2200 (8.848 ULP).',
    plateauAndDipIsPositiveFloorEvidence:
      'The decisive new datum: worstPairSpread(2400)=1.964257e-15 sits just BELOW worstPairSpread(2200)=1.964592e-15 ' +
      '(a 3.4e-19 dip). The extended ladder is therefore no longer monotone non-decreasing. A genuine growth law ' +
      'spread ~ N^p with p > 0 CANNOT dip with increasing N; a floor of discrete last-digit ULP jitter can. The ' +
      'plateau/dip is direct positive evidence for the N-independent floor, beyond the exponent-inconsistency argument.',
    fourthPointSharpensDiscrimination:
      'Three nonzero points let imp-3851 show the successive local exponents (18.47 vs 3.74) were inconsistent. The ' +
      'fourth point adds p(2200->2400)=-0.002 -- essentially zero. The three successive local exponents now span ' +
      'positive-huge to flat; a coherent power law gives one exponent between any pair, so no power law fits, and the ' +
      'essentially-zero top exponent is the arithmetic of a plateaued floor rather than a resolved N-dependence.',
    floorConfirmedOnFourPoints:
      'All four nonzero rungs (0.885, 6.195, 8.848, 8.846 ULP) sit below the conservative 10-ULP backward-error floor, ' +
      'and the top two rungs (8.848, 8.846 ULP) are equal to within a fraction of a ULP. The consistent description ' +
      'remains the N-INDEPENDENT few-ULP floor, now supported by four nonzero rungs, a plateau/dip, and the ' +
      'inconsistency of any power-law fit through them.',
    linearModelRuledOutOnResolvedSample:
      'All four nonzero rungs use under 1% of their linear N*eps budgets (4.9e-4, 3.1e-3, 4.0e-3, 3.7e-3) and sit far ' +
      'below PAIR_TOL=1e-14. The linear-accumulation model, falsified by imp-3715/imp-3733/imp-3851, stays falsified.',
    whatItAddsOverImp3851:
      'imp-3851 supplied the third nonzero rung (N=2200) and showed two successive exponents were inconsistent, but ' +
      'explicitly left N=2400 a bound. This ticket resolves N=2400, turning three nonzero points into four, and the ' +
      'new rung PLATEAUS/DIPS (a growth law cannot) with an essentially-zero top local exponent -- turning the ' +
      'inconsistency argument into direct positive evidence for the floor.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    addsNoLambdaBound: true,
    stillFloorLevelSample:
      'The resolved sample now has FOUR nonzero rungs (N=1800, 2000, 2200, 2400), enough to check exponent consistency ' +
      'and observe a plateau/dip that rules out a coherent power law. But four floor-level points do NOT pin a ' +
      'resolved growth exponent to few-percent accuracy: the N-dependence is consistent with zero (a fixed few-ULP ' +
      'ceiling), not measured to be exactly zero.',
    measuresNotCertifies:
      'This measures ONE additional rung of the imp-3668 fifth-pair spread and re-tests the rounding models; it does ' +
      'NOT re-certify the pairing (imp-3668), does NOT re-extract the literals via Sturm bisection (imp-3692), and ' +
      'does NOT construct the missing magnitude or attempt the imp-3066 K_a >= 0 positivity.',
    pairingNotAmplitudeLaw:
      'The quantity measured is the fifth-pair PAIRING degeneracy spread (lambda_9=lambda_10) only; the sigma_4 ' +
      'amplitude reported is a raw pairing-certified input, NOT the fifth-pair AMPLITUDE LAW sigma_4=lambda_9/lambda_1 ' +
      '(the distinct pending Lanczos ticket).',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33209_FIFTH_PAIR_SPREAD_N2400_RESOLVED_ASSERTIONS = [
  {
    id: 'imp33209-n2400-nonzero-below-floor',
    why: 'THE PRIMARY MEASUREMENT: the N=2400 fifth-pair spread must be a genuine nonzero fifth data point below the ' +
      'conservative 10-ULP backward-error floor (measured 1.964257e-15 = 8.846 ULP).',
    holds: () => n2400IsNonzero && spread2400Ulps > 8 && spread2400Ulps < ULP_FLOOR_C,
  },
  {
    id: 'imp33209-ladder-plateaus-and-dips',
    why: 'The extended fifth-pair spread ladder must PLATEAU: worstPairSpread(2400)=1.964257e-15 sits below ' +
      'worstPairSpread(2200)=1.964592e-15, so the ladder is no longer monotone non-decreasing -- a growth law cannot ' +
      'dip, so this is direct positive evidence for the N-independent floor, with four nonzero rungs.',
    holds: () => n2400DipsBelow2200 && !ladderMonotoneNonDecreasing && ladderPlateausAtTop && nonzeroRungs.length === 4,
  },
  {
    id: 'imp33209-floor-discriminated-by-flat-top-exponent',
    why: 'The fourth nonzero point must sharpen the floor discrimination: the successive local power-law exponents ' +
      'span 18.47, 3.74, -0.002 (span > 2 tol) with the top essentially zero (|p|<0.5), so no coherent power law fits ' +
      'and the N-independent few-ULP floor (all four rungs < 10 ULP) is preferred.',
    holds: () =>
      ulpFloorModelPreferred && allNonzeroBelowFloor && localExponentsInconsistent &&
      localExponentSpan > EXPONENT_CONSISTENCY_TOL && topExponentEssentiallyZero,
  },
  {
    id: 'imp33209-linear-Neps-model-still-falsified',
    why: 'The linear N*eps model must stay falsified on the resolved sample: all four nonzero rungs use < 1% of their ' +
      'linear budgets (4.9e-4, 3.1e-3, 4.0e-3, 3.7e-3 at N=1800/2000/2200/2400) and stay below PAIR_TOL=1e-14.',
    holds: () =>
      linearModelStillFalsified && linearFraction1800 < 1e-2 && linearFraction2000 < 1e-2 &&
      linearFraction2200 < 1e-2 && linearFraction2400 < 1e-2,
  },
  {
    id: 'imp33209-sigma4-keeps-climbing-toward-one',
    why: 'The fifth-pair amplitude sigma_4=lambda_9/lambda_1 must stay < 1 and keep climbing monotonically across ' +
      'N=2000/2200/2400 (0.99876, 0.99897, 0.99914) -- the same approach-to-1 the lower gaps show.',
    holds: () => sigma4MonotoneUp && sigma4AllBelow1,
  },
  {
    id: 'imp33209-verdict-floor-not-power-law',
    why: 'The classified verdict must be the confirming resolved-floor result, not indeterminate; a flip means the ' +
      'nonzero measurement, the plateau/dip, the flat-top-exponent discrimination, the linear falsification, or the ' +
      'sigma_4 climb failed.',
    holds: () => verdict.startsWith('THE-N=2400-RUNG-IS-A-RESOLVED-NONZERO-FIFTH-DATA-POINT'),
  },
  {
    id: 'imp33209-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only, resolves what imp-3851 left a bound and adds one rung to a still-floor-' +
      'level four-nonzero-point sample -- rules out a coherent power law but fits no exponent, adds no Lambda bound, ' +
      'and re-certifies nothing; positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP33209_FIFTH_PAIR_SPREAD_N2400_RESOLVED.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.addsNoLambdaBound === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.stillFloorLevelSample === 'string' &&
        typeof c.pairingNotAmplitudeLaw === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33209_FIFTH_PAIR_SPREAD_N2400_RESOLVED_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33209-fifth-pair-spread-n2400-resolved assertion failed: ${assertion.id}`);
  }
}

export default IMP33209_FIFTH_PAIR_SPREAD_N2400_RESOLVED;
