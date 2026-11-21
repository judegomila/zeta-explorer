/**
 * @module imp-33231-fifth-pair-spread-n2800-resolved
 * @fileoverview imp-33231 -- ADD A FIFTH RESOLVED NONZERO RUNG (dense full-spectrum solve at
 *   N = 2800) to the imp-3733/imp-3851/imp-33209 fifth-pair Gram degeneracy spread ladder
 *   worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 by re-running the SAME imp-3668
 *   dense solve (form the Gram S = T^T T explicitly, Householder tridiagonalization tred1 +
 *   implicit-QL tql1 for ALL eigenvalues; NO Krylov subspace, NO reorthogonalization) at the
 *   rung N = 2800 that imp-33209/imp-3851 left as a FLOOR-MODEL BOUND, not a measurement --
 *   turning the four-nonzero-point sample into FIVE nonzero points and re-testing the local
 *   power-law exponent consistency of the N-independent few-ULP-floor model. Measurement ONLY.
 *
 *   CONTEXT
 *   -------
 *   imp-3715 measured the fifth-pair spread across N in {1200,1600,2000} (0, 0, 6.20 ULP: two
 *   exact-zero rungs and one nonzero point). imp-3733 added N=1800 (0.885 ULP), imp-3851 added
 *   N=2200 (8.848 ULP), and imp-33209 added N=2400 (8.846 ULP), giving FOUR nonzero points and
 *   showing the successive local power-law exponents through them (18.47, 3.74, -0.002) are
 *   inconsistent -- ruling out a coherent power law, with the top exponent essentially zero and
 *   the ladder dipping at N=2400. But imp-33209 explicitly LEFT the N=2800 rung as a
 *   floor-model BOUND, not a measurement: "N=2800 rung still an unmeasured floor-model bound".
 *
 *   THIS MODULE bakes the freshly-measured N=2800 dense fifth-pair result (the offline imp-3668
 *   solve, ~12.9 s: Gram S=T^T T, tred1 + tql1, full spectrum, top-10 descending). The measured
 *   relative spread is baked DIRECTLY as printed (toExponential(6)) to avoid the 15-digit
 *   literal reconstruction-precision trap. The route reproduces BOTH prior nonzero cross-check
 *   rungs EXACTLY (N=2000: lambda_9=4.209502868174942e-9, lambda_10=4.209502868174936e-9,
 *   pair910=1.375522e-15; N=2200: lambda_9=4.210445305453339e-9,
 *   lambda_10=4.210445305453330e-9, pair910=1.964592e-15), so the N=2800 value sits on the
 *   identical assembly.
 *
 *   FINDING
 *   -------
 *   (1) THE N=2800 RUNG IS A GENUINE NONZERO FIFTH DATA POINT AT THE FLOOR.
 *       worstPairSpread(2800) = 1.963790e-16 = 0.884 ULP relative -- far below the conservative
 *       10-ULP backward-error floor (lambda_9=4.212164784022832e-9,
 *       lambda_10=4.212164784022831e-9).
 *   (2) THE LADDER DIPS BY AN ORDER OF MAGNITUDE. The extended ladder
 *       0, 0, 1.97e-16, 1.38e-15, 1.96e-15, 1.96e-15, 1.96e-16 has the N=2800 spread collapse
 *       ~10x BELOW N=2400 (1.963790e-16 vs 1.964257e-15) -- back down to the N=1800 level
 *       (0.884 ULP). A genuine growth law spread ~ N^p (p > 0) cannot fall an order of
 *       magnitude with increasing N; a floor of discrete last-digit ULP jitter can. This
 *       order-of-magnitude dip is decisive positive evidence for the N-independent floor,
 *       stronger than the tiny 3.4e-19 dip imp-33209 saw at N=2400.
 *   (3) A FIFTH NONZERO POINT MAKES THE EXPONENT INCONSISTENCY DECISIVE.
 *       The successive local power-law exponents forced through the five nonzero rungs are
 *       p(1800->2000)=18.47, p(2000->2200)=3.74, p(2200->2400)=-0.002, p(2400->2800)=-14.94 --
 *       spanning positive-huge to strongly-negative. A coherent power law spread ~ N^p gives the
 *       SAME exponent between any pair of rungs; four wildly different local exponents (spanning
 *       +18 to -15) cannot come from one growth law. The spread rises then FALLS, oscillating
 *       inside the ULP floor with no trend. All FIVE nonzero rungs (0.885, 6.195, 8.848, 8.846,
 *       0.884 ULP) sit below 10 ULP, so the N-INDEPENDENT few-ULP-floor model is the consistent
 *       description.
 *   (4) THE LINEAR N*eps MODEL STAYS FALSIFIED. The N=2800 spread uses only 3.16e-4 of the
 *       linear budget N*eps = 6.217e-13 (all five nonzero rungs use < 1% of their budgets and
 *       stay below PAIR_TOL = 1e-14).
 *   (5) THE FIFTH-PAIR AMPLITUDE sigma_4 = lambda_9/lambda_1 KEEPS CLIMBING TOWARD 1.
 *       sigma_4 = 0.9993663241144551 at N=2800, above 0.9991380726848307 (N=2400),
 *       0.9989746799616214 (N=2200) and 0.9987600189865782 (N=2000) -- the same monotone
 *       approach-to-1 the lower gaps show. (Pairing amplitude only; the amplitude LAW is a
 *       distinct pending ticket.)
 *
 *   SCOPE / HONEST CAVEAT. This is a MEASUREMENT that resolves the N=2800 rung imp-33209 left as
 *   a bound, adding ONE resolved nonzero point (turning four into five). Five points make the
 *   exponent-INCONSISTENCY discrimination decisive -- the spread rises then dips an order of
 *   magnitude, both direct evidence for the floor -- but five floor-level points still do NOT
 *   pin a resolved growth exponent to few-percent accuracy: the N-dependence is consistent with
 *   zero (a fixed few-ULP ceiling), not measured to be exactly zero. It adds NO new Lambda
 *   bound, does NOT re-certify the pairing (imp-3668), does NOT establish the fifth-pair
 *   amplitude LAW sigma_4, does NOT construct the missing magnitude, and does NOT attempt the
 *   imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-33209-fifth-pair-spread-n2400-resolved.js (the four-nonzero-point sample this resolves the next rung of)
 *   @see imp-3851-fifth-pair-spread-n2200-resolved.js (the three-nonzero-point sample)
 *   @see imp-3733-fifth-pair-spread-n1800-resolved.js (the two-nonzero-point sample)
 *   @see imp-3715-fifth-pair-spread-rounding-scaling.js (the coarse-sample scaling assessment)
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (source of the fifth-pair spread ladder and dense route)
 *
 *   Ticket: imp-33231 (numerical, medium). Adds the N=2800 resolved nonzero rung to the
 *   fifth-pair spread sample, resolving what imp-33209 left a bound, and sharpens the
 *   few-ULP-floor discrimination via an order-of-magnitude dip and a strongly-negative top local
 *   exponent. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED. No refereed bound is changed.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const EPS = 2.220446049250313e-16; // IEEE double-precision unit roundoff (2^-52)
const PAIR_TOL = 1e-14; // imp-3668 dense adjacent-pair degeneracy relative tolerance
const ULP_FLOOR_C = 10; // conservative few-ULP backward-error floor multiplier (all nonzero rungs sit below this)

// --- FRESHLY MEASURED N=2800 dense fifth pair (this ticket): the offline imp-3668
//     Householder tred1 + implicit-QL tql1 full-spectrum solve, top-10 descending.
//     lambda_9, lambda_10 are the ninth/tenth Gram eigenvalues (the FIFTH adjacent
//     pair); the measured relative spread is baked DIRECTLY as printed
//     (toExponential(6)) to avoid the 15-digit literal reconstruction-precision trap. --
const N2800 = Object.freeze({
  N: 2800,
  U: 70, // U = N * H0 with H0 = 0.025
  lambda9: 4.212164784022832e-9, // reference (15-digit print)
  lambda10: 4.212164784022831e-9, // reference (15-digit print)
  spread: 1.963790e-16, // worstPairSpread(2800) as measured (pair910, authoritative)
  sigma4: 0.9993663241144551, // lambda_9/lambda_1 fifth-pair amplitude at N=2800
  solveSeconds: 12.9,
});

// --- the four previously-resolved nonzero rungs (imp-3733 N=1800, imp-3668/imp-3715 N=2000,
//     imp-3851 N=2200, imp-33209 N=2400), baked DIRECTLY as printed (avoids the 15-digit
//     reconstruction trap). The N=2000 and N=2200 values are re-confirmed EXACTLY by this
//     ticket cross-check run of the identical route. -------------------------------------
const SPREAD_1800 = 1.965626e-16; // imp-3733 measured (0.885 ULP)
const SPREAD_2000 = 1.375522e-15; // imp-3668/imp-3715 measured (6.195 ULP), reproduced here exactly
const SPREAD_2200 = 1.964592e-15; // imp-3851 measured (8.848 ULP), reproduced here exactly
const SPREAD_2400 = 1.964257e-15; // imp-33209 measured (8.846 ULP)

// --- the extended fifth-pair spread ladder, now with FIVE resolved nonzero rungs -------
const spreadLadderExtended = Object.freeze([
  { N: 1200, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1600, spread: 0 }, // exactly 0 to all printed digits (imp-3668)
  { N: 1800, spread: SPREAD_1800 }, // imp-3733: 1.97e-16 (0.885 ULP)
  { N: 2000, spread: SPREAD_2000 }, // imp-3668: 1.38e-15 (6.195 ULP)
  { N: 2200, spread: SPREAD_2200 }, // imp-3851: 1.96e-15 (8.848 ULP)
  { N: 2400, spread: SPREAD_2400 }, // imp-33209: 1.96e-15 (8.846 ULP)
  { N: 2800, spread: N2800.spread }, // THIS TICKET: 1.96e-16 (0.884 ULP) -- new nonzero rung, DIPS ~10x below 2400
]);

// (1) the new rung is a genuine nonzero value below the floor
const spread2800Ulps = N2800.spread / EPS; // ~0.884 ULP
const spread2400Ulps = SPREAD_2400 / EPS; // ~8.846 ULP
const spread2200Ulps = SPREAD_2200 / EPS; // ~8.848 ULP
const spread2000Ulps = SPREAD_2000 / EPS; // ~6.195 ULP
const spread1800Ulps = SPREAD_1800 / EPS; // ~0.885 ULP
const n2800IsNonzero = N2800.spread > 0;
const n2800BelowFloor = spread2800Ulps < ULP_FLOOR_C; // 0.884 < 10

// (2) THE ORDER-OF-MAGNITUDE DIP: the N=2800 spread collapses ~10x below N=2400 -- a growth law cannot fall
const n2800DipsBelow2400 = N2800.spread < SPREAD_2400; // true (1.963790e-16 < 1.964257e-15)
const dipFactor2400to2800 = SPREAD_2400 / N2800.spread; // ~10.0x
const dipIsOrderOfMagnitude = dipFactor2400to2800 > 5; // true -- decisive floor signature
const spreadValues = spreadLadderExtended.map((r) => r.spread);
const ladderMonotoneNonDecreasing = spreadValues.every((v, i) => i === 0 || v >= spreadValues[i - 1]); // FALSE (big dip)
const ladderOscillatesInFloor = !ladderMonotoneNonDecreasing && n2800DipsBelow2400; // rises then falls: the floor signature

// (3) FIVE nonzero points: check exponent CONSISTENCY. A genuine power law spread ~ N^p
//     gives the SAME p between any rung pair.
const nonzeroRungs = spreadLadderExtended.filter((r) => r.spread > 0); // N=1800, 2000, 2200, 2400, 2800
const allNonzeroBelowFloor = nonzeroRungs.every((r) => r.spread / EPS < ULP_FLOOR_C); // all < 10 ULP
// local power-law exponent between successive nonzero rung pairs
const localExponent = (a, b) => Math.log(b.spread / a.spread) / Math.log(b.N / a.N);
const exponent1800to2000 = localExponent(nonzeroRungs[0], nonzeroRungs[1]); // ~18.47
const exponent2000to2200 = localExponent(nonzeroRungs[1], nonzeroRungs[2]); // ~3.74
const exponent2200to2400 = localExponent(nonzeroRungs[2], nonzeroRungs[3]); // ~-0.002
const exponent2400to2800 = localExponent(nonzeroRungs[3], nonzeroRungs[4]); // ~-14.94 (strongly negative)
const localExponents = [exponent1800to2000, exponent2000to2200, exponent2200to2400, exponent2400to2800];
// a coherent power law would have EQUAL local exponents; a huge span is decisive against growth
const localExponentSpan = Math.max(...localExponents) - Math.min(...localExponents); // ~33.4 (+18.47 to -14.94)
const EXPONENT_CONSISTENCY_TOL = 2; // a real power law keeps successive exponents within a small factor
const localExponentsInconsistent = localExponentSpan > EXPONENT_CONSISTENCY_TOL; // true (~33.4)
// the top local exponent is strongly NEGATIVE -- the spread fell, which a growth law cannot do
const topExponentNegative = exponent2400to2800 < 0; // true (~-14.94)
// the N-independent few-ULP floor is preferred over any residual power law
const ulpFloorModelPreferred =
  allNonzeroBelowFloor && localExponentsInconsistent && topExponentNegative && dipIsOrderOfMagnitude;

// (4) linear N*eps model stays falsified: all five nonzero rungs use < 1% of their linear budget
const linearFraction = (r) => r.spread / (r.N * EPS);
const linearFraction1800 = linearFraction(nonzeroRungs[0]); // ~4.9e-4
const linearFraction2000 = linearFraction(nonzeroRungs[1]); // ~3.1e-3
const linearFraction2200 = linearFraction(nonzeroRungs[2]); // ~4.0e-3
const linearFraction2400 = linearFraction(nonzeroRungs[3]); // ~3.7e-3
const linearFraction2800 = linearFraction(nonzeroRungs[4]); // ~3.2e-4
const linearModelStillFalsified =
  nonzeroRungs.every((r) => linearFraction(r) < 1e-2 && r.spread < PAIR_TOL);

// (5) the fifth-pair amplitude sigma_4 = lambda_9/lambda_1 keeps climbing monotonically toward 1
const sigma4Ladder = Object.freeze([
  0.9987600189865782, // N=2000
  0.9989746799616214, // N=2200
  0.9991380726848307, // N=2400
  N2800.sigma4, // N=2800
]);
const sigma4MonotoneUp = sigma4Ladder.every((v, i) => i === 0 || v > sigma4Ladder[i - 1]);
const sigma4AllBelow1 = sigma4Ladder.every((v) => v < 1);

const verdict =
  n2800IsNonzero &&
  n2800BelowFloor &&
  ladderOscillatesInFloor &&
  dipIsOrderOfMagnitude &&
  ulpFloorModelPreferred &&
  linearModelStillFalsified &&
  sigma4MonotoneUp &&
  sigma4AllBelow1
    ? 'THE-N=2800-RUNG-IS-A-RESOLVED-NONZERO-FIFTH-DATA-POINT-AT-0.884-ULP-(1.963790e-16),-RESOLVING-WHAT-imp-33209-LEFT-A-FLOOR-MODEL-BOUND;-THE-EXTENDED-LADDER-0,0,1.97e-16,1.38e-15,1.96e-15,1.96e-15,1.96e-16-DIPS-~10x-(worstPairSpread(2800)-COLLAPSES-AN-ORDER-OF-MAGNITUDE-BELOW-worstPairSpread(2400),-BACK-TO-THE-N=1800-LEVEL),-WHICH-A-GROWTH-LAW-N^p-(p>0)-CANNOT-DO;-WITH-FIVE-RESOLVED-NONZERO-RUNGS-THE-SUCCESSIVE-LOCAL-EXPONENTS-SPAN-18.47->3.74->-0.002->-14.94-(TOP-STRONGLY-NEGATIVE),-SO-NO-COHERENT-POWER-LAW-FITS:-THIS-MAKES-THE-N-INDEPENDENT-FEW-ULP-FLOOR-DISCRIMINATION-DECISIVE-(ALL-FIVE-RUNGS-BELOW-10-ULP,-THE-SPREAD-RISES-THEN-FALLS)-OVER-ANY-RESIDUAL-GROWTH;-THE-LINEAR-N*eps-MODEL-STAYS-FALSIFIED-(<1%-OF-BUDGET-AT-ALL-FIVE)-AND-sigma_4-KEEPS-CLIMBING-TOWARD-1;-MEASUREMENT-ONLY,-NO-NEW-LAMBDA-BOUND,-NO-QED'
    : 'INDETERMINATE';

export const IMP33231_FIFTH_PAIR_SPREAD_N2800_RESOLVED = Object.freeze({
  id: 'imp-33231-fifth-pair-spread-n2800-resolved',
  ticket: 'imp-33231',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  addsRungTo: 'imp-33209-fifth-pair-spread-n2400-resolved.js',
  measuredVia: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (Householder tred1 + implicit-QL tql1, dense full spectrum)',

  summary:
    'RESOLVES the N=2800 rung imp-33209 left as a FLOOR-MODEL BOUND, adding it to the imp-3733/imp-3851/imp-33209 ' +
    'fifth-pair Gram degeneracy spread worstPairSpread(N)=|lambda_9-lambda_10|/lambda_9 by re-running the SAME dense ' +
    'Householder tred1 + implicit-QL tql1 full-spectrum solve (~12.9 s offline; the route reproduces N=2000 AND N=2200 ' +
    'EXACTLY on cross-check). RESULT: (1) worstPairSpread(2800)=1.963790e-16=0.884 ULP -- a genuine NONZERO fifth data ' +
    'point far below the 10-ULP floor; (2) THE LADDER DIPS AN ORDER OF MAGNITUDE -- 0, 0, 1.97e-16, 1.38e-15, 1.96e-15, ' +
    '1.96e-15, 1.96e-16: worstPairSpread(2800) collapses ~10x BELOW worstPairSpread(2400)=1.964257e-15, back to the ' +
    'N=1800 level, which a growth law spread~N^p (p>0) cannot do -- decisive positive evidence for the N-independent ' +
    'floor; (3) with FIVE resolved nonzero rungs the successive local exponents span p(1800->2000)=18.47, ' +
    'p(2000->2200)=3.74, p(2200->2400)=-0.002, p(2400->2800)=-14.94 (top strongly negative), so no coherent power law ' +
    'fits -- making the few-ULP-floor discrimination decisive (all five rungs 0.885/6.195/8.848/8.846/0.884 ULP below ' +
    '10 ULP, spread rises then falls); (4) the linear N*eps model stays DECISIVELY FALSIFIED -- N=2800 uses only ' +
    '3.16e-4 of its N*eps=6.217e-13 budget (all five under 1%); (5) the fifth-pair amplitude sigma_4=lambda_9/lambda_1 ' +
    'keeps climbing monotonically toward 1 (0.99876, 0.99897, 0.99914, 0.99937 at N=2000/2200/2400/2800). Measurement ' +
    'ONLY: five floor-level points make the exponent-consistency discrimination decisive (order-of-magnitude dip + ' +
    'rise-then-fall) but do NOT pin a resolved growth exponent to few-percent accuracy (the N-dependence is consistent ' +
    'with zero, not measured to be zero); adds NO new Lambda bound; does NOT re-certify the pairing (imp-3668), does ' +
    'NOT establish the sigma_4 amplitude LAW, does NOT construct the missing magnitude, does NOT attempt imp-3066 ' +
    'K_a>=0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    spreadQuantity: 'worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 of the imp-3668 dense Gram top-10 (fifth adjacent pair)',
    denseSolve: 'form Gram S=T^T T explicitly, Householder tridiagonalization (tred1) + implicit-QL (tql1) for ALL eigenvalues; NO Krylov, NO reorthogonalization; NPHI=10, H0=0.025, midpoint quadrature (identical imp-3505/imp-3643/imp-3668 assembly)',
    newRungN: N2800.N,
    newRungU: N2800.U,
    newRungSolveSeconds: N2800.solveSeconds,
    crossCheck: 'the identical route reproduces BOTH prior nonzero rungs EXACTLY: N=2000 pair910=1.375522e-15 (lambda_9=4.209502868174942e-9, lambda_10=4.209502868174936e-9) and N=2200 pair910=1.964592e-15 (lambda_9=4.210445305453339e-9, lambda_10=4.210445305453330e-9)',
    modelA_ulpFloor: 'spread ~ c_ulp * eps, N-INDEPENDENT (all five resolved nonzero rungs sit below 10 ULP; the ladder rises then dips an order of magnitude at N=2800)',
    modelB_residualPowerLaw: 'spread ~ N^p; successive local exponents span 18.47, 3.74, -0.002, -14.94 (top strongly negative), inconsistent -- discrete ULP jitter, not growth',
    exponentConsistencyTol: EXPONENT_CONSISTENCY_TOL,
    ulpFloorMultiplier: ULP_FLOOR_C,
    eps: EPS,
    pairTol: PAIR_TOL,
    selfComputing: true,
    measuredOffline: 'the N=2800 fifth-pair literals and spread are the printed output of the offline dense solve (scripts/imp-3668-dense-fifth-pair-offline.mjs re-run at N=2800); this module re-derives the model tests arithmetically from the baked values',
  }),

  measured: Object.freeze({
    n2800: N2800, // freshly measured this ticket
    spread1800: SPREAD_1800, // imp-3733 nonzero rung
    spread2000: SPREAD_2000, // imp-3668/imp-3715 nonzero rung (reproduced exactly here)
    spread2200: SPREAD_2200, // imp-3851 nonzero rung (reproduced exactly here)
    spread2400: SPREAD_2400, // imp-33209 nonzero rung
    spreadLadderExtended, // 0, 0, 1.97e-16, 1.38e-15, 1.96e-15, 1.96e-15, 1.96e-16 across N=1200..2800
    spread1800Ulps, // ~0.885 ULP
    spread2000Ulps, // ~6.195 ULP
    spread2200Ulps, // ~8.848 ULP
    spread2400Ulps, // ~8.846 ULP
    spread2800Ulps, // ~0.884 ULP -- below 10-ULP floor, and ~10x below the 2400 value
    n2800IsNonzero, // true -- genuine nonzero fifth data point
    n2800BelowFloor, // true -- 0.884 < 10 ULP
    n2800DipsBelow2400, // true -- the order-of-magnitude dip a growth law cannot produce
    dipFactor2400to2800, // ~10.0x
    dipIsOrderOfMagnitude, // true
    ladderMonotoneNonDecreasing, // false -- the ladder dips ~10x at N=2800
    ladderOscillatesInFloor, // true -- rises then falls: the floor signature
    nonzeroRungCount: nonzeroRungs.length, // 5 -- now five resolved nonzero rungs
    allNonzeroBelowFloor, // true -- all < 10 ULP
    exponent1800to2000, // ~18.47
    exponent2000to2200, // ~3.74
    exponent2200to2400, // ~-0.002
    exponent2400to2800, // ~-14.94 -- strongly negative: the spread fell
    localExponents, // [18.47, 3.74, -0.002, -14.94]
    localExponentSpan, // ~33.4 -- successive exponents span +18 to -15
    localExponentsInconsistent, // true -- a coherent power law cannot give exponents this different
    topExponentNegative, // true -- the top local exponent is negative (the spread fell), not a growth exponent
    ulpFloorModelPreferred, // true -- N-independent floor beats any residual power law
    linearFraction1800, // ~4.9e-4
    linearFraction2000, // ~3.1e-3
    linearFraction2200, // ~4.0e-3
    linearFraction2400, // ~3.7e-3
    linearFraction2800, // ~3.2e-4
    linearModelStillFalsified, // true
    sigma4Ladder, // 0.99876, 0.99897, 0.99914, 0.99937 at N=2000/2200/2400/2800
    sigma4MonotoneUp, // true -- keeps climbing toward 1
    sigma4AllBelow1, // true
    verdict,
  }),

  interpretation: Object.freeze({
    n2800ResolvesTheImp33209Bound:
      'imp-33209 explicitly left N=2800 as a floor-model BOUND, not a measurement. This ticket resolves it: the N=2800 ' +
      'rung lands at 1.963790e-16 = 0.884 ULP -- a genuine nonzero spread far below the 10-ULP floor, giving the sample ' +
      'a FIFTH resolved nonzero rung alongside N=1800 (0.885 ULP), N=2000 (6.195 ULP), N=2200 (8.848 ULP), and N=2400 ' +
      '(8.846 ULP).',
    orderOfMagnitudeDipIsDecisiveFloorEvidence:
      'The decisive new datum: worstPairSpread(2800)=1.963790e-16 collapses ~10x BELOW worstPairSpread(2400)=' +
      '1.964257e-15, all the way back down to the N=1800 level (0.884 ULP). The extended ladder rises to a plateau ' +
      'around N=2200/2400 and then FALLS an order of magnitude. A genuine growth law spread ~ N^p with p > 0 CANNOT ' +
      'fall an order of magnitude with increasing N; a floor of discrete last-digit ULP jitter can. This is stronger ' +
      'positive evidence for the N-independent floor than the tiny 3.4e-19 dip imp-33209 observed at N=2400.',
    fifthPointMakesDiscriminationDecisive:
      'Four nonzero points let imp-33209 show the successive local exponents (18.47, 3.74, -0.002) were inconsistent. ' +
      'The fifth point adds p(2400->2800)=-14.94 -- strongly negative. The four successive local exponents now span ' +
      '+18.47 to -14.94; a coherent power law gives one exponent between any pair, so no power law fits, and the ' +
      'strongly-negative top exponent (the spread fell) is the arithmetic of a ULP floor rather than a resolved ' +
      'N-dependence.',
    floorConfirmedOnFivePoints:
      'All five nonzero rungs (0.885, 6.195, 8.848, 8.846, 0.884 ULP) sit below the conservative 10-ULP backward-error ' +
      'floor, and the spread returns to its low-N level (N=1800 and N=2800 both ~0.88 ULP). The consistent description ' +
      'remains the N-INDEPENDENT few-ULP floor, now supported by five nonzero rungs, an order-of-magnitude dip, and the ' +
      'inconsistency of any power-law fit through them.',
    linearModelRuledOutOnResolvedSample:
      'All five nonzero rungs use under 1% of their linear N*eps budgets (4.9e-4, 3.1e-3, 4.0e-3, 3.7e-3, 3.2e-4) and ' +
      'sit far below PAIR_TOL=1e-14. The linear-accumulation model, falsified by imp-3715/imp-3733/imp-3851/imp-33209, ' +
      'stays falsified.',
    whatItAddsOverImp33209:
      'imp-33209 supplied the fourth nonzero rung (N=2400) and showed the top local exponent was essentially zero with ' +
      'a tiny dip, but explicitly left N=2800 a bound. This ticket resolves N=2800, turning four nonzero points into ' +
      'five, and the new rung DIPS AN ORDER OF MAGNITUDE (a growth law cannot) with a strongly-negative top local ' +
      'exponent -- turning the plateau-and-tiny-dip evidence into a decisive rise-then-fall inside the floor.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    addsNoLambdaBound: true,
    stillFloorLevelSample:
      'The resolved sample now has FIVE nonzero rungs (N=1800, 2000, 2200, 2400, 2800), enough to check exponent ' +
      'consistency and observe an order-of-magnitude dip that rules out a coherent power law. But five floor-level ' +
      'points do NOT pin a resolved growth exponent to few-percent accuracy: the N-dependence is consistent with zero ' +
      '(a fixed few-ULP ceiling), not measured to be exactly zero.',
    measuresNotCertifies:
      'This measures ONE additional rung of the imp-3668 fifth-pair spread and re-tests the rounding models; it does ' +
      'NOT re-certify the pairing (imp-3668), does NOT re-extract the literals via Sturm bisection (imp-3692), and ' +
      'does NOT construct the missing magnitude or attempt the imp-3066 K_a >= 0 positivity.',
    pairingNotAmplitudeLaw:
      'The quantity measured is the fifth-pair PAIRING degeneracy spread (lambda_9=lambda_10) only; the sigma_4 ' +
      'amplitude reported is a raw pairing-certified input, NOT the fifth-pair AMPLITUDE LAW sigma_4=lambda_9/lambda_1 ' +
      '(the distinct pending Lanczos ticket).',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP33231_FIFTH_PAIR_SPREAD_N2800_RESOLVED_ASSERTIONS = [
  {
    id: 'imp33231-n2800-nonzero-below-floor',
    why: 'THE PRIMARY MEASUREMENT: the N=2800 fifth-pair spread must be a genuine nonzero fifth data point below the ' +
      'conservative 10-ULP backward-error floor (measured 1.963790e-16 = 0.884 ULP).',
    holds: () => n2800IsNonzero && spread2800Ulps > 0.5 && spread2800Ulps < ULP_FLOOR_C,
  },
  {
    id: 'imp33231-ladder-dips-order-of-magnitude',
    why: 'The extended fifth-pair spread ladder must DIP an order of magnitude: worstPairSpread(2800)=1.963790e-16 ' +
      'sits ~10x below worstPairSpread(2400)=1.964257e-15, so the ladder is no longer monotone non-decreasing -- a ' +
      'growth law cannot fall an order of magnitude, so this is decisive positive evidence for the N-independent ' +
      'floor, with five nonzero rungs.',
    holds: () =>
      n2800DipsBelow2400 && dipIsOrderOfMagnitude && dipFactor2400to2800 > 5 &&
      !ladderMonotoneNonDecreasing && ladderOscillatesInFloor && nonzeroRungs.length === 5,
  },
  {
    id: 'imp33231-floor-discriminated-by-negative-top-exponent',
    why: 'The fifth nonzero point must sharpen the floor discrimination: the successive local power-law exponents ' +
      'span 18.47, 3.74, -0.002, -14.94 (span > 2 tol) with the top strongly negative (the spread fell), so no ' +
      'coherent power law fits and the N-independent few-ULP floor (all five rungs < 10 ULP) is preferred.',
    holds: () =>
      ulpFloorModelPreferred && allNonzeroBelowFloor && localExponentsInconsistent &&
      localExponentSpan > EXPONENT_CONSISTENCY_TOL && topExponentNegative,
  },
  {
    id: 'imp33231-linear-Neps-model-still-falsified',
    why: 'The linear N*eps model must stay falsified on the resolved sample: all five nonzero rungs use < 1% of their ' +
      'linear budgets (4.9e-4, 3.1e-3, 4.0e-3, 3.7e-3, 3.2e-4 at N=1800/2000/2200/2400/2800) and stay below ' +
      'PAIR_TOL=1e-14.',
    holds: () =>
      linearModelStillFalsified && linearFraction1800 < 1e-2 && linearFraction2000 < 1e-2 &&
      linearFraction2200 < 1e-2 && linearFraction2400 < 1e-2 && linearFraction2800 < 1e-2,
  },
  {
    id: 'imp33231-sigma4-keeps-climbing-toward-one',
    why: 'The fifth-pair amplitude sigma_4=lambda_9/lambda_1 must stay < 1 and keep climbing monotonically across ' +
      'N=2000/2200/2400/2800 (0.99876, 0.99897, 0.99914, 0.99937) -- the same approach-to-1 the lower gaps show.',
    holds: () => sigma4MonotoneUp && sigma4AllBelow1,
  },
  {
    id: 'imp33231-verdict-floor-not-power-law',
    why: 'The classified verdict must be the confirming resolved-floor result, not indeterminate; a flip means the ' +
      'nonzero measurement, the order-of-magnitude dip, the negative-top-exponent discrimination, the linear ' +
      'falsification, or the sigma_4 climb failed.',
    holds: () => verdict.startsWith('THE-N=2800-RUNG-IS-A-RESOLVED-NONZERO-FIFTH-DATA-POINT'),
  },
  {
    id: 'imp33231-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only, resolves what imp-33209 left a bound and adds one rung to a still-floor-' +
      'level five-nonzero-point sample -- rules out a coherent power law but fits no exponent, adds no Lambda bound, ' +
      'and re-certifies nothing; positivity not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP33231_FIFTH_PAIR_SPREAD_N2800_RESOLVED.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.addsNoLambdaBound === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.stillFloorLevelSample === 'string' &&
        typeof c.pairingNotAmplitudeLaw === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33231_FIFTH_PAIR_SPREAD_N2800_RESOLVED_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33231-fifth-pair-spread-n2800-resolved assertion failed: ${assertion.id}`);
  }
}

export default IMP33231_FIFTH_PAIR_SPREAD_N2800_RESOLVED;
