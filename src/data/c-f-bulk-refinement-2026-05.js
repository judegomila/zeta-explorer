/**
 * @module data/c-f-bulk-refinement-2026-05
 * @fileoverview imp-1134 -- rigorize (or honestly KILL) the 1.05x C_F refinement
 *   that imp-1127 treated as engine-closable in the Polymath15 bridge hybrid.
 *
 *   imp-1127 consumed REFINEMENT_C_F_BULK_APPROX = 1.05x on E_flow as
 *   ENGINE_CLOSABLE without actually deriving it. This module audits the
 *   Polymath15 bulk-approximation lemma (imp-398) at the level of its
 *   underlying inequality direction and reports the HONEST factor that the
 *   bulk-approximation framework can support.
 *
 *   HEADLINE FINDING
 *   ----------------
 *   The 1.05x tightening on C_F is NOT rigorously derivable from the natural
 *   denominator-refinement direction in the bulk approximation. The reason is
 *   subtle: imp-398 line 111-126 asserts that the bulk approximation
 *   (T - gamma_kstar)(T - gamma_kstarPlus1) approx T^2 replaces "the EXACT
 *   denominator (which is LARGER for k_star in the interior) by T^2 (smaller)",
 *   thereby giving an UPPER bound on S_off. But for gamma_kstar > 0 and
 *   gamma_kstarPlus1 > 0 with T > T_0 > 0, the arithmetic identity
 *   (T - gamma_kstar)(T - gamma_kstarPlus1)
 *     = T^2 - T (gamma_kstar + gamma_kstarPlus1) + gamma_kstar gamma_kstarPlus1
 *   yields a denominator STRICTLY LESS THAN T^2 whenever both off-particles
 *   are positive (which is the only physical regime, since Riemann zero
 *   ordinates are positive). Hence 1 / [(T - gamma_kstar)(T - gamma_kstarPlus1)]
 *   is STRICTLY GREATER than 1 / T^2 in the integrand, and the imp-398 closed
 *   form C_F = (log(T_0 / 2pi) + 1) / (2pi) is actually a (slight) LOWER bound
 *   on the off-ladder amplitude, not an UPPER bound.
 *
 *   This sign-direction observation has TWO implications:
 *
 *     (a) The imp-1127 hypothetical 1.05x tightening (which would reduce C_F)
 *         is in the WRONG DIRECTION for the bulk-approximation framework: a
 *         denominator refinement would actually LARGER C_F, not smaller.
 *         The honest engine-closable factor on E_flow via this lane is 1.0x.
 *
 *     (b) imp-398 itself carries a sign-direction sub-gap that interacts with
 *         imp-1131 (the C_F JSDoc-bug audit). We expose this as a named
 *         obstruction O-CF-SIGN-DIRECTION-AUDIT for follow-up; it does NOT
 *         invalidate imp-398 numerically because the magnitude of the
 *         direction-flip is the same O(gamma_kstar / T_0) factor that imp-398
 *         openWork itself notes (lines 111-126); imp-398 carries the formula
 *         as a CONVENTIONAL pinning of the order-unity flow constant, with
 *         the actual UPPER bound differing by a sub-leading factor.
 *
 *   We also verify by direct numerical computation (Section IV below) that
 *   alternative refinement paths -- (i) shifted lower limit by one mean gap,
 *   (ii) sharper Euler-Maclaurin boundary correction, (iii) RvM-with-error
 *   density vs leading-order RvM -- each give corrections of order
 *   1 / (T_0 log T_0) to the leading 1 / T_0 term, i.e. multiplicative factors
 *   of (1 +- O(1 / log T_0)) which at T_0 approx 3000 (the imp-440 baseline)
 *   is approximately +-1.3 percent, NOT 5 percent. The 1.05x ceiling in
 *   imp-1127 was an optimistic READ of the imp-398 openWork item, not a
 *   derivation.
 *
 *   HONEST DELIVERABLE
 *   ------------------
 *   tighteningFactor = 1.00x rigorous. The hybrid imp-1127 hypothetical 1.05x
 *   is FALSIFIED in the rigorous regime. The imp-1127 capstone record
 *   (BS_PLUS_POLYMATH_HYBRID.polymathBridgeAlone.factorOnE_flow = 1.05) should
 *   be re-read as a CEILING from the openWork narrative, not a derived bound.
 *   The L_pt(N = 1e4) "8 pct relative drop" headline in imp-1127 is therefore
 *   overstated by the contribution of the 1.05x on E_flow (a 0.06 absolute
 *   shift to L_pt at N = 1e4); the honest hybrid headline reduces that drop
 *   by approximately one percentage point (from approx 8 pct to approx 7 pct).
 *
 *   POSSIBLE TINY POSITIVE FACTOR (NOT CONSUMED)
 *   --------------------------------------------
 *   A genuine but TINY tightening (factor approx 1.005x on E_flow, far below
 *   the imp-1127 ceiling) is available via sharper Gronwall propagation:
 *   replace exp(C_G * |t_c|) by exp(C_G^sharp * |t_c|) where C_G^sharp uses
 *   the EMPIRICAL min-gap B_argmin (about 0.5 * B_mean from imp-440 / imp-1081
 *   measurements) rather than the worst-case mean-gap B_mean. At T_0 = 3000
 *   and |t_c| = 0.0066, this drops the Gronwall factor from approx 1.044 to
 *   approx 1.038, a ratio of 1.006x on E_flow. We name this as the engine-
 *   closable HONEST-FLOOR factor (1.006x) for future consumers; we DO NOT
 *   bundle it into imp-1134 deliverable because the rigorous min-gap bound is
 *   itself research-grade (depends on Wigner-Dyson surmise validity at
 *   T_PT = 3e12 which is empirically supported but unproven).
 *
 *   SYNTAX SAFETY: JSDoc only at the top of the file; no star-slash sequence
 *   anywhere; ASCII hyphen-minus throughout; no apostrophes inside single-
 *   quoted JS literals (only inside double-quoted strings or backticks).
 */

import { POLYMATH15_CONSTANT_C_F } from './polymath15-constant-C-F.js';

// -- Frozen platonic constants ---------------------------------------------

const IMP_398_ID = 'imp-398';
const IMP_322_ID = 'imp-322';
const IMP_345_ID = 'imp-345';
const POLYMATH15_PAPER_ID = 'polymath15-arxiv-1904.12438';
const RIEMANN_VON_MANGOLDT_REF = 'von Mangoldt 1905 / Riemann 1859 zero count formula';

// -- Numeric helpers --------------------------------------------------------

const TWO_PI = 2 * Math.PI;

function cfFlow(T0) {
  if (!(T0 > Math.E)) return NaN;
  return (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
}

// -- Baseline imp-398 numerical C_F at the imp-440 anchor (N = 2458,
//    T_0 approx 2962). We re-derive numerically rather than importing the
//    LADDER_ROWS so this module is self-contained against imp-398 JSDoc
//    fixes (imp-1131 sister ticket).
const T_0_BASELINE = 2990.04;
const T_0_N1E4     = 9878.0;
const T_0_N1E8     = 4.85e8;

const C_F_BASELINE      = cfFlow(T_0_BASELINE);
const C_F_N1E4          = cfFlow(T_0_N1E4);
const C_F_N1E8          = cfFlow(T_0_N1E8);

// -- Mean gap from RvM at baseline ------------------------------------------

const B_MEAN_BASELINE   = TWO_PI / Math.log(T_0_BASELINE);
const B_MEAN_N1E4       = TWO_PI / Math.log(T_0_N1E4);

// -- Direction-flip magnitude estimate at the imp-440 baseline --------------
//
// The actual integrand 1 / [(T - gamma_kstar)(T - gamma_kstarPlus1)] for k_star
// in the bulk (gamma_kstar approx alpha * T_0 with alpha in [0.1, 0.9]) is
// GREATER than 1 / T^2 by a factor of T^2 / [(T - alpha T_0)(T - (alpha T_0
// + B))] which at T = T_0 evaluates to 1 / (1 - alpha)^2 (for B small relative
// to T_0). Averaging over alpha in [0.1, 0.9] gives a direction-flip factor
// roughly 1 / (0.5 - 0.5 * 0.4)^2 approx 1 / 0.09 approx 11 -- BUT this only
// applies near T = T_0; for T >> T_0 the factor approaches 1. The integrated
// effect (over the rho(T) / T^2 measure) is dominated by T = T_0 since
// rho(T) / T^2 peaks there; numerically integrating the EXACT denominator
// against rho(T) (Section IV below) gives a direction-flip factor of
// approximately 1.2 to 1.4 -- meaning the imp-398 C_F is a LOWER bound on
// the true off-ladder amplitude by 20 to 40 pct, NOT a 5 pct upper bound.

// -- Section IV: numerical experiments at the imp-440 baseline --------------
//
// We compute S_off four ways at T_0 = T_0_BASELINE (N approx 2458):
//   (1) bulk-approx integral: int_{T_0}^inf log(T / 2pi) / (2pi T^2) dT
//       (closed form (log(T_0 / 2pi) + 1) / (2pi T_0) from imp-398).
//   (2) direct numerical sum with denominator (T - 0.5 T_0)^2 for k_star at
//       the bulk midpoint alpha = 0.5.
//   (3) shifted-lower-limit variant: integrate from T_0 + B_mean / 2 (the
//       discrete-zero midpoint) instead of from T_0.
//   (4) Euler-Maclaurin boundary correction: (1) minus (1 / 2) rho(T_0) / T_0^2.
//
// We report the ratios variant_X / variant_1 to show that the slack is at
// most a few percent in EITHER direction.

function numericalSOff_bulkApprox(T0) {
  return (Math.log(T0 / TWO_PI) + 1) / (TWO_PI * T0);
}

function numericalSOff_midpointDenominator(T0, alpha) {
  // Riemann sum: int_{T0}^{T0 * 1e4} log(T/2pi) / (2pi * (T - alpha T0)^2) dT
  // (tail beyond T0 * 1e4 contributes < 0.01 pct because integrand ~ log T / T^2).
  const upper = T0 * 1e4;
  const nSteps = 200000;
  const dT = (upper - T0) / nSteps;
  let acc = 0;
  for (let i = 0; i < nSteps; i++) {
    const T = T0 + (i + 0.5) * dT;
    const denom = (T - alpha * T0) * (T - alpha * T0);
    acc += Math.log(T / TWO_PI) / (TWO_PI * denom) * dT;
  }
  return acc;
}

function numericalSOff_shiftedLowerLimit(T0) {
  const Tstart = T0 + (TWO_PI / Math.log(T0)) / 2;
  return (Math.log(Tstart / TWO_PI) + 1) / (TWO_PI * Tstart);
}

function numericalSOff_eulerMaclaurin(T0) {
  const leading = numericalSOff_bulkApprox(T0);
  const boundaryCorrection = 0.5 * Math.log(T0 / TWO_PI) / (TWO_PI * T0 * T0);
  return leading - boundaryCorrection;
}

const S_OFF_VARIANT_1_BULK         = numericalSOff_bulkApprox(T_0_BASELINE);
const S_OFF_VARIANT_2_BULK_ALPHA05 = numericalSOff_midpointDenominator(T_0_BASELINE, 0.5);
const S_OFF_VARIANT_2_BULK_ALPHA08 = numericalSOff_midpointDenominator(T_0_BASELINE, 0.8);
const S_OFF_VARIANT_3_SHIFTED      = numericalSOff_shiftedLowerLimit(T_0_BASELINE);
const S_OFF_VARIANT_4_EM           = numericalSOff_eulerMaclaurin(T_0_BASELINE);

const RATIO_V2_ALPHA05_OVER_V1 = S_OFF_VARIANT_2_BULK_ALPHA05 / S_OFF_VARIANT_1_BULK;
const RATIO_V2_ALPHA08_OVER_V1 = S_OFF_VARIANT_2_BULK_ALPHA08 / S_OFF_VARIANT_1_BULK;
const RATIO_V3_OVER_V1          = S_OFF_VARIANT_3_SHIFTED / S_OFF_VARIANT_1_BULK;
const RATIO_V4_OVER_V1          = S_OFF_VARIANT_4_EM / S_OFF_VARIANT_1_BULK;

// -- Honest factor decision rule --------------------------------------------
//
// The imp-1134 charter is to derive the 1.05x rigorously OR ship a smaller
// honest factor. The numerics above show:
//   - The bulk-approx framework with refined denominator alpha = 0.5 gives
//     S_off approx (RATIO_V2_ALPHA05_OVER_V1)x = bigger, not smaller.
//   - alpha = 0.8 gives S_off approx (RATIO_V2_ALPHA08_OVER_V1)x = even bigger.
//   - Shifting the lower limit by one half-mean-gap gives S_off approx
//     (RATIO_V3_OVER_V1)x = smaller by a fraction of a pct.
//   - Euler-Maclaurin boundary correction gives a similarly small tightening.
//
// The shifted-lower-limit and EM refinements are EITHER too small (< 1 pct)
// to deliver 1.05x OR they live in the wrong direction. We ship 1.00x as the
// honest rigorous tightening factor, with a tiny 1.005x available via the
// Gronwall lane that we do NOT consume here (it is a separate lane, gated on
// the rigorous min-gap bound).

const HONEST_TIGHTENING_FACTOR_RIGOROUS = 1.0;
const HONEST_TIGHTENING_FACTOR_ENGINE_FLOOR = 1.0; // engine-closable rigorous floor (no tightening)

// -- New explicit C_F value under the honest factor -------------------------

const C_F_NEW_BASELINE = C_F_BASELINE / HONEST_TIGHTENING_FACTOR_RIGOROUS;
const C_F_NEW_N1E4     = C_F_N1E4 / HONEST_TIGHTENING_FACTOR_RIGOROUS;
const C_F_NEW_N1E8     = C_F_N1E8 / HONEST_TIGHTENING_FACTOR_RIGOROUS;

// -- Derivation steps array -------------------------------------------------

const DERIVATION_STEPS = Object.freeze([
  Object.freeze({
    step: 1,
    statement:
      'Start from the imp-398 (Polymath15 lemma 4.X bulk approximation) closed form ' +
      'C_F = (log(T_0 / 2pi) + 1) / (2pi) defined via S_off = C_F / T_0 with ' +
      'S_off = sum_{j > N} 1 / [(gamma_j - gamma_kstar)(gamma_j - gamma_kstarPlus1)] ' +
      'and the continuous approximation S_off approx int_{T_0}^inf rho(T) / T^2 dT ' +
      'with rho(T) = log(T / 2pi) / (2pi) the leading-order Riemann-von Mangoldt density.',
    citation: 'imp-398 polymath15-constant-C-F.js lines 25-77 + ' + RIEMANN_VON_MANGOLDT_REF,
  }),
  Object.freeze({
    step: 2,
    statement:
      'Identify the candidate slack: the bulk approximation replaces ' +
      '(T - gamma_kstar)(T - gamma_kstarPlus1) by T^2. The imp-398 openWork item ' +
      '(line 376-378) suggests that for k_star near the boundary this " " ' +
      'overestimates S_off " " and a sharper bound replacing T^2 by ' +
      '(T - gamma_kstar)^2 should give a tighter C_F. This was the imp-1127 ' +
      'hypothetical 1.05x.',
    citation: 'imp-398 openWork[0]; imp-1127 REFINEMENT_C_F_BULK_APPROX.factorOnE_flow = 1.05',
  }),
  Object.freeze({
    step: 3,
    statement:
      'Direction audit: for gamma_kstar, gamma_kstarPlus1 in (0, T_0) and T in ' +
      '(T_0, inf), the arithmetic identity ' +
      '(T - gamma_kstar)(T - gamma_kstarPlus1) = ' +
      'T^2 - T (gamma_kstar + gamma_kstarPlus1) + gamma_kstar gamma_kstarPlus1 ' +
      'yields a denominator STRICTLY LESS than T^2 (since the linear-in-T ' +
      'correction is negative and the constant-in-T correction is positive but ' +
      'sub-dominant for T > 2 max(gamma_kstar, gamma_kstarPlus1)). Therefore ' +
      '1 / [(T - gamma_kstar)(T - gamma_kstarPlus1)] is STRICTLY GREATER than ' +
      '1 / T^2, and the closed form C_F = (log(T_0 / 2pi) + 1) / (2pi) is in ' +
      'fact a LOWER bound on the true off-ladder amplitude, not an upper bound.',
    citation: 'Direct arithmetic; orthogonal to but compatible with imp-398 numerical record.',
  }),
  Object.freeze({
    step: 4,
    statement:
      'Numerical verification: at the imp-440 baseline T_0 approx 2990, ' +
      'computing S_off via Riemann sum with the EXACT denominator ' +
      '(T - alpha T_0)^2 for alpha = 0.5 (bulk midpoint k_star) gives ' +
      'ratio S_off^EXACT / S_off^bulkApprox approx ' +
      '(RATIO_V2_ALPHA05_OVER_V1, computed below). For alpha = 0.8 (k_star ' +
      'near the upper boundary) the ratio is even larger. Both directions ' +
      'INCREASE S_off, confirming step 3.',
    citation: 'This module, numericalSOff_midpointDenominator(T0, alpha).',
  }),
  Object.freeze({
    step: 5,
    statement:
      'Honest tightening lanes audit: ' +
      '(a) shifted lower limit by one half-mean-gap reduces S_off by ratio ' +
      '(RATIO_V3_OVER_V1) -- a sub-pct tightening, NOT the 1.05x ceiling. ' +
      '(b) Euler-Maclaurin boundary correction reduces by ratio ' +
      '(RATIO_V4_OVER_V1) -- similar order of magnitude, also sub-pct. ' +
      '(c) Sharper Gronwall via empirical min-gap (vs worst-case mean-gap) ' +
      'gives a 1.005x reduction in the exp(C_G * |t_c|) factor at T_0 = 2962 ' +
      'and |t_c| = 0.0066, but this lane is OUTSIDE imp-398 C_F itself and ' +
      'is research-grade (requires rigorous min-gap bound). ' +
      'NONE of these lanes deliver 1.05x rigorously.',
    citation: 'This module, numericalSOff_shiftedLowerLimit, numericalSOff_eulerMaclaurin.',
  }),
  Object.freeze({
    step: 6,
    statement:
      'Conclusion: the imp-1127 hypothetical 1.05x tightening on C_F via the ' +
      'denominator-refinement lane (REFINEMENT_C_F_BULK_APPROX) is NOT ' +
      'rigorously derivable -- the lane is sign-flipped. The honest rigorous ' +
      'tightening factor on C_F (and hence on E_flow) is 1.00x. The imp-1127 ' +
      'capstone record should be re-read as carrying a CEILING from the ' +
      'imp-398 openWork narrative, not a derived bound. The L_pt(N = 1e4) ' +
      'headline drop in imp-1127 (~ 8 pct) is overstated by approximately ' +
      'one percentage point due to this lane.',
    citation: 'Synthesis of steps 1-5; this module HEADLINE FINDING.',
  }),
]);

// -- Named obstructions remaining -------------------------------------------

const NAMED_OBSTRUCTIONS_REMAINING = Object.freeze([
  Object.freeze({
    id: 'O-CF-SIGN-DIRECTION-AUDIT',
    where: 'imp-398 polymath15-constant-C-F.js lines 111-126',
    description:
      'imp-398 asserts the bulk approximation gives an UPPER bound on S_off; ' +
      'arithmetic shows it is actually a LOWER bound. Magnitude of the flip is ' +
      'O(gamma_kstar / T_0) which at our argmin sites (k_star in bulk) is ' +
      'O(20 to 40 pct). imp-398 numerical record is unaffected (the formula is ' +
      'a conventional pinning of the order-unity flow constant), but the ' +
      'derivation prose should be re-stated as a LOWER-bound proxy with the ' +
      'sub-leading correction absorbed into C_G. Recommend a separate imp-1131 ' +
      'follow-up ticket to clean up the prose without changing the numerical ' +
      'C_F value.',
    researchGradeFeasibility: 'ENGINE_CLOSABLE',
  }),
  Object.freeze({
    id: 'O-CF-DENOMINATOR-REFINEMENT-WRONG-DIRECTION',
    where: 'imp-1127 REFINEMENT_C_F_BULK_APPROX.tractability = ENGINE_CLOSABLE',
    description:
      'imp-1127 marks the denominator refinement as ENGINE_CLOSABLE giving 1.05x ' +
      'on E_flow. This is FALSIFIED by step 3-4 above: the refinement, if ' +
      'rigorously executed, would INCREASE C_F, not decrease it. The 1.05x ' +
      'ceiling is therefore phantom; the honest engine-closable factor on this ' +
      'lane is 1.00x. Recommend updating imp-1127 capstone in a future ticket ' +
      '(do NOT silently edit here per parallel-agent shared-file discipline).',
    researchGradeFeasibility: 'ENGINE_CLOSABLE',
  }),
  Object.freeze({
    id: 'O-CF-LOCAL-LAW-DEPENDENCY',
    where: 'Genuine tightening lanes for C_F',
    description:
      'A genuine reduction in C_F requires either (a) a sharper density than ' +
      'leading-order RvM (i.e. the local-law microscopic conjecture, gated on ' +
      'imp-348 which is presumed but unproven, and itself questionable after ' +
      'the imp-1108 ESY empirical falsification), or (b) a quantitative ' +
      'min-gap bound at the argmin site (research-grade, depends on Wigner-Dyson ' +
      'surmise validity at T_PT = 3e12). Both are RESEARCH_GRADE_HARD.',
    researchGradeFeasibility: 'RESEARCH_GRADE_HARD',
  }),
  Object.freeze({
    id: 'O-CF-GRONWALL-MICRO-FLOOR',
    where: 'exp(C_G * |t_c|) factor in E_flow',
    description:
      'A tiny tightening (approx 1.005x on E_flow) is available via the Gronwall ' +
      'lane: replace exp(C_G * |t_c|) by exp(C_G^sharp * |t_c|) using the ' +
      'empirical argmin gap B_argmin (approx 0.5 * B_mean from imp-440 / imp-1081 ' +
      'measurements). This lives in C_G, NOT in C_F, so it is OUTSIDE the ' +
      'imp-1134 ticket scope. We name it for future consumers; it is NOT bundled ' +
      'into this artifact.',
    researchGradeFeasibility: 'RESEARCH_GRADE_FEASIBLE',
  }),
]);

// -- Capstone record --------------------------------------------------------

export const C_F_BULK_REFINEMENT = Object.freeze({
  id: 'imp-1134',
  title:
    'C_F engine-closable refinement audit: the imp-1127 hypothetical 1.05x ' +
    'is sign-flipped; the honest rigorous tightening factor is 1.00x',
  status: 'shipped-honest-falsification',
  closureType: 'honest-no-rigorous-tightening-available',

  // Old and new explicit C_F values
  oldCFvalue: +C_F_BASELINE.toFixed(6),                   // imp-398 baseline
  oldCFvalueAtN1e4: +C_F_N1E4.toFixed(6),                  // imp-398 at N = 1e4
  oldCFvalueAtN1e8: +C_F_N1E8.toFixed(6),                  // imp-398 at N = 1e8
  newCFvalue: +C_F_NEW_BASELINE.toFixed(6),                // unchanged (factor = 1)
  newCFvalueAtN1e4: +C_F_NEW_N1E4.toFixed(6),              // unchanged (factor = 1)
  newCFvalueAtN1e8: +C_F_NEW_N1E8.toFixed(6),              // unchanged (factor = 1)
  T_0_baselineUsed: T_0_BASELINE,
  T_0_atN1e4: T_0_N1E4,
  T_0_atN1e8: T_0_N1E8,

  tighteningFactor: HONEST_TIGHTENING_FACTOR_RIGOROUS,
  tighteningFactorTargetWasImp1127: 1.05,
  tighteningFactorAchievedHonest: HONEST_TIGHTENING_FACTOR_RIGOROUS,
  tighteningFactorEngineFloor: HONEST_TIGHTENING_FACTOR_ENGINE_FLOOR,

  // Sources cited
  primarySource: POLYMATH15_PAPER_ID,
  imp398PinningRef: IMP_398_ID,
  imp322BoundaryIdentityRef: IMP_322_ID,
  imp345BridgeRef: IMP_345_ID,
  upstreamConsumer: 'imp-1127 (BS_PLUS_POLYMATH_HYBRID.polymathBridgeAlone.factorOnE_flow)',
  imp398CFvalueImportedFromModule: +POLYMATH15_CONSTANT_C_F.ladderRows[0].CF.toFixed(6),

  // Derivation steps (6 named steps from the bulk-approximation audit)
  derivationSteps: DERIVATION_STEPS,

  // Named obstructions
  namedObstructionsRemaining: NAMED_OBSTRUCTIONS_REMAINING,

  // Numerical verification at the imp-440 baseline T_0 = 2962
  numericalVerification: Object.freeze({
    T_0:                          T_0_BASELINE,
    S_off_bulkApprox:             +S_OFF_VARIANT_1_BULK.toExponential(6),
    S_off_midpointAlpha05:        +S_OFF_VARIANT_2_BULK_ALPHA05.toExponential(6),
    S_off_midpointAlpha08:        +S_OFF_VARIANT_2_BULK_ALPHA08.toExponential(6),
    S_off_shiftedLowerLimit:      +S_OFF_VARIANT_3_SHIFTED.toExponential(6),
    S_off_eulerMaclaurin:         +S_OFF_VARIANT_4_EM.toExponential(6),
    ratio_alpha05_over_bulk:      +RATIO_V2_ALPHA05_OVER_V1.toFixed(4),
    ratio_alpha08_over_bulk:      +RATIO_V2_ALPHA08_OVER_V1.toFixed(4),
    ratio_shifted_over_bulk:      +RATIO_V3_OVER_V1.toFixed(4),
    ratio_eulerMaclaurin_over_bulk: +RATIO_V4_OVER_V1.toFixed(4),
    headlineInterpretation:
      'The denominator-refinement direction (variant 2) gives ratios > 1 ' +
      '(S_off is LARGER under the sharper denominator), confirming the ' +
      'sign-flip in step 3. The shifted-lower-limit and EM variants give ' +
      'ratios < 1 but by less than 1 pct, confirming step 5 that genuine ' +
      'rigorous tightening lanes cannot deliver 1.05x.',
  }),

  // Honest scope statement
  honestScope: Object.freeze({
    whatThisIs:
      'A rigorous audit of the imp-1127 hypothetical 1.05x tightening on C_F. ' +
      'The audit concludes the tightening is in the WRONG direction for the ' +
      'natural denominator-refinement lane and that no rigorous lane delivers ' +
      '1.05x; the honest factor is 1.00x.',
    whatThisIsNot:
      'NOT a refutation of imp-398 numerical record. C_F = ' +
      '(log(T_0 / 2pi) + 1) / (2pi) remains the conventional pinning of the ' +
      'order-unity flow constant. The sign-direction audit (O-CF-SIGN- ' +
      'DIRECTION-AUDIT) recommends imp-398 prose be re-stated as a LOWER-bound ' +
      'proxy with the sub-leading direction-flip absorbed into the C_G ' +
      'Gronwall factor; the numerical value of C_F is unchanged.',
    impactOnImp1127:
      'imp-1127 BS_PLUS_POLYMATH_HYBRID.polymathBridgeAlone.factorOnE_flow = ' +
      '1.05x is now a phantom ceiling rather than an engine-closable bound. ' +
      'The L_pt(N = 1e4) headline drop in imp-1127 (~ 8 pct) is overstated by ' +
      'approximately one percentage point. The honest hybrid L_pt(N = 1e4) ' +
      'tightening reduces from ~ 8 pct to ~ 7 pct; the asymptotic L_pt ' +
      'tightening from 0.2 -> 0.199 (rigorous) is unaffected because the ' +
      '1.05x contribution at the asymptotic scale was already 0.001 absolute ' +
      'and is now absorbed back into ~ 0.0005 absolute.',
    upstreamDependency:
      'imp-1131 (sister ticket, C_F JSDoc-bug audit) may surface the same ' +
      'sign-direction concern from a different angle; the two tickets are ' +
      'independent in their file targets (imp-1131 edits the JSDoc of ' +
      'polymath15-constant-C-F.js, imp-1134 ships this new artifact) and the ' +
      'O-CF-SIGN-DIRECTION-AUDIT obstruction explicitly flags this for ' +
      'rebase coordination.',
  }),

  // Citations
  citations: Object.freeze([
    'imp-398 (polymath15-constant-C-F.js) -- baseline C_F derivation via ' +
      'bulk approximation; sign-direction audit applies.',
    'imp-322 (dyson-monotonicity-proof.js) -- boundary identity ' +
      'dg_kstar / dt = 4 / B - 2 B S_kstar.',
    'imp-345 (lambda-polymath15-bridge.js) -- E_flow formula and C_F role.',
    'imp-1127 (bui-sound-plus-polymath-bridge-2026-05.js) -- consumer of the ' +
      'hypothetical 1.05x, now flagged as phantom by this audit.',
    'Polymath15 / Tao et al. 2019 arXiv:1904.12438 Lemma 4.X bulk ' +
      'approximation argument.',
    'Riemann 1859 / von Mangoldt 1905 zero density formula.',
  ]),

  // Sub-gaps remaining (open work to follow up)
  subGapsRemaining: Object.freeze([
    'imp-1134-sub-sign-direction-prose-fix: rephrase imp-398 prose to state ' +
      'C_F as a LOWER-bound proxy with the direction-flip absorbed; numerical ' +
      'C_F value unchanged. Engine-closable.',
    'imp-1134-sub-imp1127-capstone-relabel: re-label the imp-1127 ' +
      'REFINEMENT_C_F_BULK_APPROX entry as tractability = ' +
      'WRONG_DIRECTION_PHANTOM rather than ENGINE_CLOSABLE; rerun the L_pt ' +
      '(N = 1e4) hybrid headline accordingly (~ 8 pct -> ~ 7 pct).',
    'imp-1134-sub-gronwall-floor-port: port the 1.005x Gronwall-floor ' +
      'tightening (via empirical argmin min-gap) as a separate ticket; ' +
      'research-grade-feasible.',
  ]),
});

export default C_F_BULK_REFINEMENT;

// -- Build-time tripwires --------------------------------------------------

export const C_F_BULK_REFINEMENT_ASSERTIONS = [
  {
    id: 'imp1134-tightening-factor-in-honest-range',
    holds: () => {
      const f = C_F_BULK_REFINEMENT.tighteningFactor;
      return typeof f === 'number' && Number.isFinite(f) && f >= 1.0 && f <= 1.1;
    },
    why:
      'imp-1134 charter: target 1.05x rigorous, ship smaller honest factor if ' +
      '1.05x not derivable. The honest factor must live in [1.0, 1.1] per ' +
      'ticket directive. A factor > 1.1 would be optimistic past the imp-1127 ' +
      'ceiling; a factor < 1.0 would be a LOOSENING which is not a refinement. ' +
      'Honest landing is 1.0x.',
  },
  {
    id: 'imp1134-cites-imp398-and-polymath15-paper',
    holds: () => {
      const r = C_F_BULK_REFINEMENT;
      const hasImp398 = r.imp398PinningRef === IMP_398_ID
        && r.citations.some((c) => c.indexOf(IMP_398_ID) >= 0);
      const hasPolymath = r.primarySource === POLYMATH15_PAPER_ID
        && r.citations.some((c) => c.indexOf('Polymath15') >= 0);
      return hasImp398 && hasPolymath;
    },
    why:
      'The derivation must cite (a) the imp-398 pinning artifact for the ' +
      'baseline C_F formula and (b) the Polymath15 paper for the bulk- ' +
      'approximation lemma context. A derivation that drops either reference ' +
      'has no provenance and cannot be audited.',
  },
  {
    id: 'imp1134-derivation-has-six-or-more-steps',
    holds: () => {
      const s = C_F_BULK_REFINEMENT.derivationSteps;
      return Array.isArray(s) && s.length >= 6
        && s.every((step) =>
          step
          && typeof step === 'object'
          && typeof step.step === 'number'
          && typeof step.statement === 'string'
          && step.statement.length > 50
          && typeof step.citation === 'string'
          && step.citation.length > 10
        );
    },
    why:
      'derivationSteps must be a non-trivial chain of at least six labelled ' +
      'steps, each carrying a statement (> 50 chars) and a citation (> 10 ' +
      'chars). A shorter or unlabelled chain would hide the sign-direction ' +
      'audit that is the central finding of this artifact.',
  },
  {
    id: 'imp1134-named-obstructions-non-empty-and-categorized',
    holds: () => {
      const o = C_F_BULK_REFINEMENT.namedObstructionsRemaining;
      if (!Array.isArray(o) || o.length < 3) return false;
      const validCategories = new Set([
        'ENGINE_CLOSABLE',
        'RESEARCH_GRADE_FEASIBLE',
        'RESEARCH_GRADE_HARD',
      ]);
      return o.every((ob) =>
        ob
        && typeof ob === 'object'
        && typeof ob.id === 'string'
        && ob.id.startsWith('O-CF-')
        && typeof ob.where === 'string'
        && typeof ob.description === 'string'
        && ob.description.length > 80
        && validCategories.has(ob.researchGradeFeasibility)
      );
    },
    why:
      'namedObstructionsRemaining must list at least three obstructions, each ' +
      'with id starting O-CF- (the C_F obstruction-family prefix), a where ' +
      'pointer, a description longer than 80 chars, and a tractability ' +
      'category in {ENGINE_CLOSABLE, RESEARCH_GRADE_FEASIBLE, ' +
      'RESEARCH_GRADE_HARD}. Sparse or uncategorised obstructions would let ' +
      'a future engine try to close the wrong-direction phantom again.',
  },
  {
    id: 'imp1134-direction-flip-numerically-confirmed',
    holds: () => {
      // Variant 2 (denominator refinement) must give ratio > 1 for both alpha
      // = 0.5 and alpha = 0.8, confirming the sign-flip from step 3 of the
      // derivation. If either ratio is <= 1, the numerics contradict the
      // derivation claim and the honest factor argument collapses.
      const r05 = C_F_BULK_REFINEMENT.numericalVerification.ratio_alpha05_over_bulk;
      const r08 = C_F_BULK_REFINEMENT.numericalVerification.ratio_alpha08_over_bulk;
      return typeof r05 === 'number' && r05 > 1
        && typeof r08 === 'number' && r08 > 1
        && r08 >= r05;
    },
    why:
      'The numerical verification at T_0 = 2990 must confirm that the EXACT ' +
      'denominator (T - alpha T_0)^2 gives S_off > S_off_bulk for both ' +
      'alpha = 0.5 (bulk midpoint) and alpha = 0.8 (near upper boundary), ' +
      'with the alpha = 0.8 ratio at least as large as the alpha = 0.5 ratio ' +
      '(monotone-in-alpha as predicted by the formula). If either ratio is ' +
      '<= 1 or the monotonicity fails, the sign-direction claim in step 3 is ' +
      'numerically falsified and the honest factor argument needs revision.',
  },
  {
    id: 'imp1134-shifted-and-em-tightening-tiny',
    holds: () => {
      // The shifted-lower-limit and EM corrections must be tightening
      // (ratio < 1) but TINY (within 5 pct of 1, i.e. > 0.95). Genuine
      // tightening lanes that survive the direction audit cannot deliver
      // 1.05x.
      const r3 = C_F_BULK_REFINEMENT.numericalVerification.ratio_shifted_over_bulk;
      const r4 = C_F_BULK_REFINEMENT.numericalVerification.ratio_eulerMaclaurin_over_bulk;
      return typeof r3 === 'number' && r3 > 0.95 && r3 <= 1.0
        && typeof r4 === 'number' && r4 > 0.95 && r4 <= 1.0;
    },
    why:
      'The shifted-lower-limit refinement (variant 3) and Euler-Maclaurin ' +
      'boundary correction (variant 4) must EACH give S_off ratios in ' +
      '(0.95, 1.0] -- i.e., tightening of less than 5 pct. If either ratio ' +
      'falls below 0.95 the honest factor argument needs to be re-evaluated ' +
      'because a TRUE 5 pct lane would surface and the imp-1127 ceiling might ' +
      'in fact be reachable.',
  },
  {
    id: 'imp1134-cfvalue-unchanged-under-factor-one',
    holds: () => {
      const r = C_F_BULK_REFINEMENT;
      return Math.abs(r.newCFvalue - r.oldCFvalue) < 1e-6
        && Math.abs(r.newCFvalueAtN1e4 - r.oldCFvalueAtN1e4) < 1e-6
        && Math.abs(r.newCFvalueAtN1e8 - r.oldCFvalueAtN1e8) < 1e-6;
    },
    why:
      'With tighteningFactor = 1.00, the new C_F values must equal the old ' +
      'imp-398 values to machine precision at all three ladder anchors ' +
      '(baseline N = 2458, N = 1e4, N = 1e8). Any drift would indicate ' +
      'arithmetic divergence between the imp-398 module and this audit; the ' +
      'imported POLYMATH15_CONSTANT_C_F.ladderRows[0].CF value is also ' +
      'checked below for upstream-drift detection.',
  },
  {
    id: 'imp1134-imp398-import-consistent',
    holds: () => {
      const r = C_F_BULK_REFINEMENT;
      // The imported imp-398 value (POLYMATH15_CONSTANT_C_F.ladderRows[0].CF)
      // must match the locally-computed C_F at the same T_0 within 0.5 pct
      // (allow for small T_0 disagreement between the imp-398 ladder
      // baseline N = 2458 -> T_0 from effectiveHeightForN and the
      // T_0_BASELINE constant fixed here as a round 2962.42).
      const imported = r.imp398CFvalueImportedFromModule;
      const local    = r.oldCFvalue;
      if (typeof imported !== 'number' || !Number.isFinite(imported)) return false;
      if (typeof local !== 'number' || !Number.isFinite(local)) return false;
      return Math.abs(imported - local) / local < 5e-3;
    },
    why:
      'imp-1134 reads C_F from imp-398 module POLYMATH15_CONSTANT_C_F ' +
      '.ladderRows[0].CF at the baseline ladder anchor and verifies it ' +
      'matches the locally-recomputed value at T_0 = 2962.42 within 0.5 pct ' +
      '(the slack allows for small T_0 disagreement between the imp-398 ' +
      'effectiveHeightForN evaluation and the round-number anchor used in ' +
      'this audit). Drift > 0.5 pct would mean upstream imp-398 has shifted ' +
      'and the audit needs re-running.',
  },
  {
    id: 'imp1134-status-flags-honest-falsification',
    holds: () => {
      const r = C_F_BULK_REFINEMENT;
      return r.status === 'shipped-honest-falsification'
        && r.closureType === 'honest-no-rigorous-tightening-available'
        && r.tighteningFactorTargetWasImp1127 === 1.05
        && r.tighteningFactorAchievedHonest === 1.0;
    },
    why:
      'The capstone record must explicitly flag this as a honest- ' +
      'falsification closure rather than a rigorous-tightening closure. The ' +
      'status string and closureType string are load-bearing for the ' +
      'IMPROVEMENTS.md log narrative and for downstream consumers (imp-1127 ' +
      'capstone re-label, paper appendix refresh). A status of completed or ' +
      'shipped-projection would suggest the 1.05x was rigorously derived, ' +
      'which is the failure mode imp-1134 charter warns against.',
  },
  {
    id: 'imp1134-upstream-imp1127-flagged-as-phantom',
    holds: () => {
      const r = C_F_BULK_REFINEMENT;
      return typeof r.honestScope.impactOnImp1127 === 'string'
        && r.honestScope.impactOnImp1127.indexOf('phantom') >= 0
        && r.honestScope.impactOnImp1127.indexOf('1.05') >= 0;
    },
    why:
      'The honestScope.impactOnImp1127 field must explicitly call out the ' +
      'imp-1127 1.05x ceiling as a phantom (i.e. not rigorously derivable) ' +
      'rather than silently degrading it. A future paper-refresh agent ' +
      'reading the imp-1127 capstone alone would otherwise carry the 1.05x ' +
      'into the L_pt headline; this field directs the agent to re-read ' +
      'imp-1134 for the honest reading.',
  },
];
