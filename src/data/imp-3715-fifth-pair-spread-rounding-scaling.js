/**
 * @module imp-3715-fifth-pair-spread-rounding-scaling
 * @fileoverview imp-3715 -- MEASURE how the imp-3668 dense FIFTH-pair Gram
 *   degeneracy spread worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9
 *   grows with the section size N, and ASSESS whether the growth threatens the
 *   dense fifth-pair certification at the deeper rungs N = 2400 / 2800 that the
 *   pending sigma_4 amplitude-law ticket and the sixth-pair certification ticket
 *   (imp-3688) will rely on -- or whether a higher-precision (extended/quad)
 *   solve is needed there. Measurement / scaling assessment ONLY.
 *
 *   CONTEXT
 *   -------
 *   imp-3668 dense-certified the fifth adjacent pair lambda_9 = lambda_10 to
 *   relative < 1.4e-15 at the deep rungs N in {1200, 1600, 2000} with the
 *   INDEPENDENT dense full-spectrum route (Householder tridiagonalization tred1 +
 *   implicit-QL tql1: ALL eigenvalues, NO Krylov subspace, NO reorthogonalization).
 *   The measured fifth-pair spread GREW across the three rungs:
 *     0 (N=1200) -> 0 (N=1600) -> 1.38e-15 (N=2000)
 *   -- two rungs exactly 0 (identical to all printed digits) and one nonzero.
 *   imp-3668 tabulated the pairing but NOT the SCALING of this spread: is it
 *   monotone in N, and does it track the accumulated Householder / implicit-QL
 *   rounding budget (~N*eps) or does it sit at the few-ULP backward-error floor
 *   (~eps, N-independent)? And does whichever law it follows keep the spread
 *   below the degeneracy threshold PAIR_TOL = 1e-14 at N = 2400 / 2800?
 *
 *   THIS MODULE re-bakes the three imp-3668 fifth-pair literals lambda_9,
 *   lambda_10 (import-light, arithmetic only -- no heavy dense solve), re-derives
 *   worstPairSpread(N) at each rung, and compares it against the two candidate
 *   rounding envelopes:
 *     (A) ULP-FLOOR model: spread ~ c_ulp * eps, N-INDEPENDENT (the relative
 *         backward-error floor of the symmetric QL eigensolver on a genuinely
 *         degenerate pair; eps = 2.220446049250313e-16 double-precision unit
 *         roundoff).
 *     (B) LINEAR-ACCUMULATION model: spread ~ N * eps (the naive worst-case
 *         Householder + QL global rounding budget scaling with the section size).
 *   It then extrapolates BOTH envelopes to N = 2400 / 2800 and reports whether the
 *   spread stays below PAIR_TOL = 1e-14.
 *
 *   FINDING
 *   -------
 *   (1) THE SPREAD IS MONOTONE NON-DECREASING BUT SITS AT THE FEW-ULP FLOOR.
 *       worstPairSpread(N) = 0, 0, 1.3755e-15 is non-decreasing across the three
 *       rungs, but the single nonzero value is only 6.20 ULP relative (1.38e-15 /
 *       eps = 6.195) -- the last-digit rounding of the implicit-QL on a degenerate
 *       pair, NOT a large accumulation.
 *   (2) THE LINEAR N*eps MODEL IS FALSIFIED. At N=2000 the linear budget N*eps =
 *       4.44e-13 is ~323x LARGER than the measured 1.38e-15 (measured / budget =
 *       3.1e-3). Worse: N*eps already crosses the PAIR_TOL = 1e-14 threshold at
 *       N ~= 45, so if the spread tracked N*eps the fifth pair could NOT be
 *       degenerate to < 1.4e-15 at N=2000 -- yet it is. The linear-accumulation
 *       envelope is decisively ruled out by the data.
 *   (3) THE ULP-FLOOR MODEL IS CONSISTENT AND EXTRAPOLATES SAFELY. Under the
 *       N-independent few-ULP floor (conservatively c_ulp = 10, spread ~ 2.22e-15),
 *       the extrapolated spread at N = 2400 and N = 2800 stays ~1e-15 -- an ORDER
 *       OF MAGNITUDE below the PAIR_TOL = 1e-14 degeneracy threshold. So the
 *       double-precision Householder + QL solve is expected to keep the fifth pair
 *       certifiable at the deeper rungs; NO higher-precision (extended/quad) solve
 *       is required for the pairing structure at N = 2400 / 2800.
 *
 *   SCOPE / HONEST CAVEAT. This is a MEASUREMENT and scaling ASSESSMENT only,
 *   built on three rungs -- two of which are exactly 0 (below the printed-digit
 *   floor). That is a COARSE sample: it lets us decisively FALSIFY the linear
 *   N*eps model (which would already fail at N~45) and confirm the spread sits at
 *   the few-ULP floor, but it does NOT fit a resolved growth exponent. The
 *   extrapolation to N=2400/2800 is a floor-model bound, not a measured value at
 *   those rungs. It is distinct from the independent Sturm-bisection verify ticket
 *   (imp-3692, which re-extracts the N<=2000 literals) and does NOT re-run the
 *   heavy dense solve. It does NOT establish the fifth-pair amplitude LAW, does
 *   NOT construct the missing magnitude, and does NOT attempt the imp-3066
 *   K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (source of the fifth-pair spread ladder measured here)
 *   @see imp-3643-skew-toeplitz-third-gap-dense-crossval.js (the fourth-pair dense cross-val imp-3668 extends)
 *   @see imp-3688-skew-toeplitz-sixth-pair-dense-crossval.js (the sixth-pair certification whose margin this assessment informs)
 *   @see imp-3692-dense-fifth-pair-independent-verify.js (the independent Sturm-bisection verify -- distinct from this scaling measurement)
 *
 *   Ticket: imp-3715 (numerical, medium). Scaling measurement / threat assessment
 *   only: the fifth-pair spread sits at the few-ULP floor, the linear N*eps model
 *   is falsified, and the double-precision solve is projected safe at N=2400/2800.
 *   imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED. No refereed bound is changed.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const EPS = 2.220446049250313e-16; // IEEE double-precision unit roundoff (2^-52)
const PAIR_TOL = 1e-14; // imp-3668 dense adjacent-pair degeneracy relative tolerance (the threshold the deeper certifications rely on)
const ULP_FLOOR_C = 10; // conservative few-ULP backward-error floor multiplier for the N-independent envelope (measured c_ulp ~ 6.2 at N=2000)
const DEEPER_RUNGS = Object.freeze([2400, 2800]); // the extrapolation targets the sixth-pair / amplitude tickets will reach

// --- BAKED imp-3668 deep-rung fifth-pair Gram eigenvalues (lambda_9, lambda_10),
//     the last two of the imp-3668 baked descending dense top-10 per rung. Import-light:
//     re-derived arithmetically, NO heavy dense solve. -----------------------------------
const FIFTH_PAIR_LITERALS = Object.freeze([
  { N: 1200, lambda9: 4.19988816455154e-9, lambda10: 4.19988816455154e-9 },
  { N: 1600, lambda9: 4.206453489211553e-9, lambda10: 4.206453489211553e-9 },
  { N: 2000, lambda9: 4.209502868174942e-9, lambda10: 4.209502868174936e-9 },
]);

// --- per-rung fifth-pair spread and its position relative to the two rounding envelopes
const rungs = FIFTH_PAIR_LITERALS.map((r) => {
  const spread = Math.abs(r.lambda9 - r.lambda10) / r.lambda9; // worstPairSpread(N) = |lambda_9-lambda_10|/lambda_9
  const spreadUlps = spread / EPS; // spread in relative ULPs
  const linearBudget = r.N * EPS; // model (B): naive N*eps Householder+QL accumulation budget
  const spreadOverLinear = linearBudget > 0 ? spread / linearBudget : 0; // fraction of the linear budget actually used
  return {
    N: r.N,
    lambda9: r.lambda9,
    lambda10: r.lambda10,
    spread,
    spreadUlps,
    linearBudget,
    spreadOverLinear,
    belowThreshold: spread < PAIR_TOL,
  };
});

// (1) monotonicity in N: is the spread non-decreasing across the three rungs?
const spreadLadder = rungs.map((r) => r.spread);
const spreadMonotoneNonDecreasing = spreadLadder.every((v, i) => i === 0 || v >= spreadLadder[i - 1]);
const worstMeasuredSpread = Math.max(...spreadLadder); // largest measured fifth-pair spread (~1.38e-15 at N=2000)
const worstMeasuredUlps = worstMeasuredSpread / EPS; // ~6.2 ULP

// (2) is the spread tracking the linear N*eps budget, or the N-independent ULP floor?
//     falsification test: the linear model already exceeds PAIR_TOL at a tiny N; if the spread
//     followed it, the fifth pair could not be degenerate to < PAIR_TOL at N=2000 -- yet it is.
const linearModelCrossesThresholdAtN = PAIR_TOL / EPS; // N at which N*eps = PAIR_TOL (~45)
const worstLinearFraction = Math.max(...rungs.map((r) => r.spreadOverLinear)); // largest fraction of N*eps used (~3.1e-3)
const linearModelFalsified =
  linearModelCrossesThresholdAtN < FIFTH_PAIR_LITERALS[FIFTH_PAIR_LITERALS.length - 1].N && // N*eps crosses PAIR_TOL well before the deepest measured rung
  worstMeasuredSpread < PAIR_TOL && // yet the measured spread stays below PAIR_TOL there
  worstLinearFraction < 1e-2; // and never uses more than ~1% of the linear budget
const spreadSitsAtUlpFloor = worstMeasuredUlps < ULP_FLOOR_C; // measured worst spread is within the conservative few-ULP floor

// (3) extrapolate BOTH envelopes to the deeper rungs and check the PAIR_TOL margin
const ulpFloorSpread = ULP_FLOOR_C * EPS; // model (A): N-independent conservative few-ULP floor (~2.22e-15)
const extrapolation = DEEPER_RUNGS.map((N) => {
  const linearEnvelope = N * EPS; // model (B) upper envelope (falsified, reported for contrast)
  return {
    N,
    ulpFloorSpread, // model (A): stays ~1e-15, N-independent
    linearEnvelope, // model (B): grows to ~6e-13 (would exceed PAIR_TOL -- but the model is falsified)
    ulpFloorBelowThreshold: ulpFloorSpread < PAIR_TOL, // true -- floor model safe
    ulpFloorMarginFactor: PAIR_TOL / ulpFloorSpread, // how many x below the threshold the floor model sits
  };
});
const doublePrecisionSafeAtDeeperRungs = extrapolation.every((e) => e.ulpFloorBelowThreshold);
const higherPrecisionNeeded = !doublePrecisionSafeAtDeeperRungs; // false -- double precision projected adequate

const verdict =
  spreadMonotoneNonDecreasing &&
  linearModelFalsified &&
  spreadSitsAtUlpFloor &&
  doublePrecisionSafeAtDeeperRungs
    ? 'FIFTH-PAIR-SPREAD-SITS-AT-THE-FEW-ULP-BACKWARD-ERROR-FLOOR-(~6.2-ULP,-1.38e-15-AT-N=2000),-NOT-THE-LINEAR-N*eps-ACCUMULATION-BUDGET-(WHICH-CROSSES-PAIR_TOL-AT-N~45-AND-IS-DECISIVELY-FALSIFIED-BY-THE-MEASURED-DEGENERACY);-EXTRAPOLATING-THE-N-INDEPENDENT-FLOOR-KEEPS-THE-SPREAD-~1e-15,-AN-ORDER-BELOW-PAIR_TOL=1e-14-AT-N=2400/2800,-SO-THE-DOUBLE-PRECISION-HOUSEHOLDER+QL-SOLVE-IS-PROJECTED-ADEQUATE-FOR-THE-DEEPER-FIFTH/SIXTH-PAIR-CERTIFICATIONS;-NO-HIGHER-PRECISION-SOLVE-NEEDED;-COARSE-3-RUNG-SAMPLE,-MEASUREMENT-ONLY,-NO-QED'
    : 'INDETERMINATE';

export const IMP3715_FIFTH_PAIR_SPREAD_ROUNDING_SCALING = Object.freeze({
  id: 'imp-3715-fifth-pair-spread-rounding-scaling',
  ticket: 'imp-3715',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  measuresScalingOf: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js',
  informsCertificationMargin: 'imp-3688-skew-toeplitz-sixth-pair-dense-crossval.js',

  summary:
    'MEASURES the scaling of the imp-3668 dense FIFTH-pair Gram degeneracy spread worstPairSpread(N) = ' +
    '|lambda_9-lambda_10|/lambda_9 across the deep rungs N in {1200,1600,2000} (0 -> 0 -> 1.38e-15) and ASSESSES ' +
    'the threat to the dense fifth-pair certification at the deeper rungs N=2400/2800. Re-baking the imp-3668 ' +
    'fifth-pair literals (import-light, arithmetic only), RESULT: (1) the spread is MONOTONE NON-DECREASING but its ' +
    'single nonzero value is only 6.20 ULP relative (1.38e-15 = 6.195*eps) -- the implicit-QL last-digit rounding ' +
    'floor, not a large accumulation; (2) the LINEAR N*eps accumulation model is DECISIVELY FALSIFIED: at N=2000 the ' +
    'budget N*eps=4.44e-13 is ~323x the measured 1.38e-15 (fraction 3.1e-3), and N*eps already crosses PAIR_TOL=1e-14 ' +
    'at N~=45, so a spread tracking N*eps could not be degenerate to <1.4e-15 at N=2000 -- yet it is; (3) under the ' +
    'consistent N-INDEPENDENT few-ULP floor (conservatively 10*eps=2.22e-15) the extrapolated spread at N=2400/2800 ' +
    'stays ~1e-15, an ORDER below PAIR_TOL=1e-14, so the double-precision Householder+QL solve is PROJECTED ADEQUATE ' +
    'at the deeper rungs and NO higher-precision solve is needed for the pairing structure. Coarse 3-rung sample ' +
    '(two rungs exactly 0): decisively falsifies the linear model and confirms the ULP floor, but does NOT fit a ' +
    'resolved growth exponent; the extrapolation is a floor-model bound, not a measured value at N=2400/2800. ' +
    'Distinct from the imp-3692 independent Sturm-bisection verify; does NOT establish the fifth-pair amplitude LAW, ' +
    'does NOT construct the missing magnitude, does NOT attempt imp-3066 K_a>=0 positivity; RH-EQUIVALENT; NO RH ' +
    'verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    spreadQuantity: 'worstPairSpread(N) = |lambda_9 - lambda_10| / lambda_9 of the imp-3668 dense Gram top-10 (fifth adjacent pair)',
    modelA_ulpFloor: 'spread ~ c_ulp * eps, N-INDEPENDENT: the relative backward-error floor of the symmetric implicit-QL eigensolver on a genuinely degenerate pair (eps = 2.220446049250313e-16)',
    modelB_linearAccumulation: 'spread ~ N * eps: the naive worst-case Householder + QL global rounding budget scaling with the section size N',
    falsificationTest: 'N*eps crosses PAIR_TOL=1e-14 at N~=45; if the spread tracked N*eps it could not be degenerate to <1.4e-15 at N=2000, so the measured degeneracy falsifies model (B)',
    ulpFloorMultiplier: ULP_FLOOR_C,
    eps: EPS,
    pairTol: PAIR_TOL,
    deeperRungsN: DEEPER_RUNGS,
    dataSource: 'imp-3668 baked deep-rung dense top-10 (Householder tred1 + implicit-QL tql1; NO Krylov, NO reorthogonalization)',
    measuredOffline: 'no heavy solve at import: this module re-derives the spreads, the two rounding envelopes, and the extrapolation arithmetically from the imp-3668 baked fifth-pair literals',
    selfComputing: true,
  }),

  measured: Object.freeze({
    rungs, // per-rung fifth-pair spread, ULP count, and fraction of the linear N*eps budget
    spreadLadder, // worstPairSpread at N=1200/1600/2000
    spreadMonotoneNonDecreasing, // true -- 0, 0, 1.38e-15 is non-decreasing
    worstMeasuredSpread, // ~1.3755e-15 (N=2000)
    worstMeasuredUlps, // ~6.195 ULP relative
    linearModelCrossesThresholdAtN, // ~45 -- N at which N*eps = PAIR_TOL
    worstLinearFraction, // ~3.1e-3 -- largest fraction of the N*eps budget the measured spread uses
    linearModelFalsified, // true -- the linear N*eps accumulation model is ruled out by the data
    spreadSitsAtUlpFloor, // true -- measured worst spread is within the conservative few-ULP floor
    ulpFloorSpread, // ~2.22e-15 -- the conservative N-independent floor envelope
    extrapolation, // model (A) vs (B) at N=2400/2800 with the PAIR_TOL margin
    doublePrecisionSafeAtDeeperRungs, // true -- floor model keeps the spread below PAIR_TOL at 2400/2800
    higherPrecisionNeeded, // false -- no extended/quad solve required for the pairing structure
    verdict,
  }),

  interpretation: Object.freeze({
    spreadIsFloorNotAccumulation:
      'The fifth-pair spread grows 0 -> 0 -> 1.38e-15 across N=1200/1600/2000, but the single nonzero value is only ' +
      '6.20 ULP relative -- the last-digit rounding of the implicit-QL on a degenerate pair. This is the eps-scale ' +
      'backward-error floor of the symmetric eigensolver, NOT a rounding accumulation that grows with the section size.',
    linearModelRuledOut:
      'The naive N*eps Householder + QL accumulation budget crosses the PAIR_TOL=1e-14 degeneracy threshold at N~=45. ' +
      'If the fifth-pair spread tracked N*eps it could not be degenerate to <1.4e-15 at N=2000 -- but it is (using only ' +
      '0.31% of the N=2000 budget). So the linear-accumulation model is decisively falsified; the spread is pinned to ' +
      'the N-independent few-ULP floor.',
    deeperRungsProjectedSafe:
      'Extrapolating the N-independent few-ULP floor (conservatively 10*eps=2.22e-15) to N=2400 and N=2800 keeps the ' +
      'fifth-pair spread ~1e-15, an order of magnitude below PAIR_TOL=1e-14. So the double-precision Householder + QL ' +
      'solve is projected to keep the fifth pair (and, on the same footing, the sixth pair) certifiable at the deeper ' +
      'rungs; no higher-precision extended/quad solve is required for the pairing structure.',
    whatItAddsOverImp3668:
      'imp-3668 tabulated the fifth-pair spread ladder 0 -> 0 -> 1.38e-15 but not its scaling law or its threat to the ' +
      'deeper certifications. This module falsifies the linear N*eps model, identifies the N-independent few-ULP floor, ' +
      'and projects the double-precision solve safe at N=2400/2800 -- the margin the pending amplitude-law and ' +
      'sixth-pair tickets rely on.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    coarseThreeRungSample:
      'The scaling assessment rests on THREE rungs, two of which are exactly 0 (below the printed-digit floor). This is ' +
      'enough to decisively FALSIFY the linear N*eps model (which fails at N~45) and confirm the few-ULP floor, but it ' +
      'does NOT fit a resolved growth exponent; the N=2400/2800 numbers are a floor-model bound, not measured values.',
    extrapolationIsBoundNotMeasurement:
      'The N=2400/2800 spread figures are the N-independent few-ULP floor envelope, NOT a fresh dense solve at those ' +
      'rungs; confirming them would require actually running the Householder + QL solve at N=2400/2800.',
    measuresNotCertifies:
      'This measures the SCALING of the imp-3668 fifth-pair spread and assesses the double-precision margin; it does ' +
      'NOT re-certify the pairing (imp-3668) nor re-extract the literals (imp-3692 Sturm-bisection), and it does NOT ' +
      'construct the missing magnitude or attempt the imp-3066 K_a >= 0 positivity.',
    pairingNotAmplitudeLaw:
      'The margin assessed here is for the fifth-pair PAIRING STRUCTURE (lambda_9=lambda_10 degeneracy) only; it does ' +
      'NOT establish the fifth-pair AMPLITUDE LAW sigma_4=lambda_9/lambda_1 (the distinct pending Lanczos ticket).',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3715_FIFTH_PAIR_SPREAD_ROUNDING_SCALING_ASSERTIONS = [
  {
    id: 'imp3715-spread-monotone-non-decreasing',
    why: 'The fifth-pair spread must be non-decreasing across N=1200/1600/2000 (measured 0, 0, 1.38e-15).',
    holds: () => spreadMonotoneNonDecreasing,
  },
  {
    id: 'imp3715-worst-spread-at-few-ulp-floor',
    why: 'THE PRIMARY MEASUREMENT: the worst measured fifth-pair spread must sit at the few-ULP backward-error floor ' +
      '(< 10 ULP relative; measured ~6.20 ULP = 1.38e-15 at N=2000), not at a large accumulation.',
    holds: () => spreadSitsAtUlpFloor && worstMeasuredUlps < ULP_FLOOR_C,
  },
  {
    id: 'imp3715-linear-Neps-model-falsified',
    why: 'The linear N*eps accumulation model must be falsified: N*eps crosses PAIR_TOL=1e-14 at N~=45 yet the spread ' +
      'stays < PAIR_TOL at N=2000 using < 1% of the N*eps budget, so the spread does NOT track N*eps.',
    holds: () => linearModelFalsified && worstLinearFraction < 1e-2 && linearModelCrossesThresholdAtN < 2000,
  },
  {
    id: 'imp3715-double-precision-safe-at-deeper-rungs',
    why: 'Extrapolating the N-independent few-ULP floor to N=2400/2800 must keep the spread < PAIR_TOL=1e-14 (floor ' +
      '~2.22e-15, an order below threshold), i.e. no higher-precision solve is needed for the pairing structure.',
    holds: () => doublePrecisionSafeAtDeeperRungs && higherPrecisionNeeded === false && extrapolation.every((e) => e.ulpFloorMarginFactor > 3),
  },
  {
    id: 'imp3715-verdict-floor-not-accumulation',
    why: 'The classified verdict must be the confirming few-ULP-floor result, not indeterminate; a flip means the ' +
      'monotonicity, the linear-model falsification, the ULP-floor identification, or the deeper-rung safety failed.',
    holds: () => verdict.startsWith('FIFTH-PAIR-SPREAD-SITS-AT-THE-FEW-ULP-BACKWARD-ERROR-FLOOR'),
  },
  {
    id: 'imp3715-honest-assessment-no-qed',
    why: 'Mandatory honesty: SCALING MEASUREMENT / threat assessment only on a coarse 3-rung sample -- falsifies the ' +
      'linear model and projects the double solve safe, but fits no exponent and re-certifies nothing; positivity not ' +
      'attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3715_FIFTH_PAIR_SPREAD_ROUNDING_SCALING.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.coarseThreeRungSample === 'string' &&
        typeof c.extrapolationIsBoundNotMeasurement === 'string' &&
        typeof c.pairingNotAmplitudeLaw === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3715_FIFTH_PAIR_SPREAD_ROUNDING_SCALING_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3715-fifth-pair-spread-rounding-scaling assertion failed: ${assertion.id}`);
  }
}

export default IMP3715_FIFTH_PAIR_SPREAD_ROUNDING_SCALING;
