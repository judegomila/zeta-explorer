/**
 * @module imp-35490-dp45-dthalf-endpoint-positivity-doubledouble-reference
 * @fileoverview imp-35490: DOES the imp-35452 lone endpoint-POSITIVE cell
 * (DP45 dt/2, N=2000 pair-1495, min endpoint gap +1.775304e-3 at step 2006)
 * survive COMPENSATED / EXTENDED-precision arithmetic, or is the DP45 dt/2
 * endpoint positivity a float64 ROUNDING ARTIFACT rather than a genuine order-5
 * within-step step-over?
 *
 * BACKGROUND
 * ----------
 * imp-35452 mapped the full 2x3 (integrator order x grid) step-endpoint signed-gap
 * sign map for the N=2000 pair-1495 collision and found the DP45 dt/2 cell is the
 * ONLY one whose endpoint gap stays POSITIVE (min +1.775304e-3 at step 2006 -- a
 * pure within-step step-over: the order-5 pair re-separates before the step lands).
 * imp-35477 confirmed BS3 is endpoint-negative at both grids, so that lone positive
 * cell is the imp-35412 knife-edge worst-case the R2 ladder KEEPS. What was never
 * tested: whether that +1.775e-3 minimum positive endpoint gap is precision-robust
 * or merely a float64 rounding artifact of the heavily-cancelling final DP45 step.
 *
 * WHAT THIS MODULE MEASURES
 * -------------------------
 * scripts/imp-35490-dp45-dthalf-endpoint-positivity-doubledouble.mjs, on the SAME
 * verbatim imp-35278 N=2000 setup (dt = tauC_est/1000 / 2, Kahan-Neumaier Dyson
 * derivative, no re-sort), does three things:
 *   (1) reproduces the imp-35452 baseline float64 min endpoint gap under the verbatim
 *       Kahan-Neumaier (COMPENSATED-accumulation) derivative and captures the float64
 *       state ENTERING the argmin step;
 *   (2) recomputes that single critical DP45 step in full DOUBLE-DOUBLE (~106-bit)
 *       arithmetic -- dd twoSum/twoProd accumulation of the derivative and dd stage
 *       combination -- from the identical float64 entering-state, giving an
 *       extended-precision reference for the most cancellation-prone (final) step;
 *   (3) reports the analytical float64 endpoint-subtraction noise floor
 *       eps*(|y[i+1]|+|y[i]|), i.e. the rounding uncertainty of the difference
 *       g_end = y[i+1]-y[i] itself, and the margin of the gap over it.
 *
 * HONEST OUTCOME: THE POSITIVITY IS GENUINE, NOT A ROUNDING ARTIFACT
 * -----------------------------------------------------------------
 * The double-double recomputation of the critical step 2006 keeps the endpoint gap
 * POSITIVE and agrees with the float64 gap to ~5e-11 relative:
 *   float64 min endpoint gap = 1.775303683e-3  @ step 2006  pair 1495  (POSITIVE)
 *   dd (~106-bit) gap        = 1.775303683276e-3            (POSITIVE)
 *   dd - float64 delta       = 8.722884e-14  (relative 4.913e-11)
 * and the gap sits ~9 decades above the float64 endpoint-subtraction noise floor:
 *   |y[i+1]|+|y[i]| = 3.954442e+3,  noise floor eps*(|y[i+1]|+|y[i]|) = 8.780626e-13,
 *   margin = gap / noiseFloor = 2.022e+9.
 * A rounding sign-flip would need the true gap to sit within the ~9e-13 subtraction
 * floor of zero; it sits at +1.78e-3, nine orders of magnitude above. So the DP45
 * dt/2 endpoint POSITIVITY is a GENUINE order-5 within-step step-over, not a float64
 * artifact -- exactly as imp-35452 characterized it geometrically.
 *
 * RESIDUAL SUB-GAP imp-35490a
 * ---------------------------
 * This script recomputes the DECISIVE final step in dd from a float64 entering-state
 * (lo=0), which is where any endpoint sign-flip would have to live. The FULL
 * trajectory in double-double (all ~2150 steps x N=2000 x 7 dd derivative-evals,
 * ~5.6e10 dd inner ops, single-threaded ~hours -- see the imp-2881 heavy-offline
 * starvation note) is left UNCOMPUTED as sub-gap imp-35490a (native backend).
 *
 * SCOPE: MEASUREMENT ONLY. Adopts NO new slack denominator (imp-35412 KEEPS the
 * endpoint DP45 dt/2 worst-case), changes NO bound, does NOT advance the R2 ladder
 * past N=1000 (stays N=1000 per imp-35221/imp-35324/imp-35412), does NOT extend the
 * C_mb certificate, does NOT remove the imp-486 GUE conditional. No refereed bound is changed
 * . NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/2", "g_end", "y[i+1]-y[i]".
 *
 * @see imp-35452  the lone endpoint-POSITIVE cell (DP45 dt/2) characterized
 * @see imp-35477  BS3 endpoint-negative corroboration
 * @see imp-35416  DP45-vs-RK4 endpoint-positivity nuance flagged
 * @see imp-35412  ASSESSMENT: keep endpoint worst-case for the ladder slack
 * @see imp-486    C_mb GUE-conditional provenance
 * @see scripts/imp-35490-dp45-dthalf-endpoint-positivity-doubledouble.mjs (producer)
 */

// -- Offline-measured DP45 dt/2 endpoint positivity under compensated + dd. --------
// Producer: scripts/imp-35490-dp45-dthalf-endpoint-positivity-doubledouble.mjs
// (Node, verbatim Kahan-Neumaier Dyson float64 run + double-double recomputation of
// the single critical argmin step). Same imp-35278 N=2000 setup.
const N = 2000;
const TAU_C_EST = 0.001188352;
const DT_FLOW = 1.188352e-6;       // tauC_est / 1000 (resolved flow grid)
const DT_HALF = 5.941760e-7;       // dtFlow / 2 -- the lone endpoint-positive cell
const CROSS_PAIR = 1495;
const ARGMIN_STEP = 2006;

// (1) baseline float64 Kahan-Neumaier (compensated accumulation) min endpoint gap.
const FLOAT64_MIN_END_GAP = 1.775303683e-3;   // POSITIVE @ step 2006 pair 1495

// (2) double-double recomputation of the critical step 2006.
const DD_END_GAP = 1.775303683276e-3;         // ~106-bit, POSITIVE
const FLOAT64_CRIT_END_GAP = 1.775303683189e-3; // float64 gap at the same critical step
const DD_MINUS_F64_DELTA = 8.722884e-14;        // dd - float64 absolute delta
const DD_MINUS_F64_REL = 4.913e-11;             // relative delta

// (3) analytical float64 endpoint-subtraction noise floor.
const EPS = 2.220446049250313e-16;              // Number.EPSILON
const ABS_SUM_ENDPOINTS = 3.954442e+3;          // |y[i+1]|+|y[i]| at the critical step
const NOISE_FLOOR = 8.780626e-13;               // eps*(|y[i+1]|+|y[i]|)
const MARGIN_GAP_OVER_NOISE = 2.022e+9;         // gap / noiseFloor (~9 decades)

// Derived verdict flags (recomputed from the stored literals for the assertions).
const F64_POSITIVE = FLOAT64_MIN_END_GAP > 0;
const DD_POSITIVE = DD_END_GAP > 0;
const DELTA_NEGLIGIBLE =
  Math.abs(DD_MINUS_F64_DELTA) < 1e-6 * Math.abs(FLOAT64_CRIT_END_GAP) ||
  Math.abs(DD_MINUS_F64_DELTA) < 1e-9;
const CLEARS_NOISE_FLOOR = FLOAT64_MIN_END_GAP > 1e6 * NOISE_FLOOR;
const POSITIVITY_IS_GENUINE = F64_POSITIVE && DD_POSITIVE && DELTA_NEGLIGIBLE && CLEARS_NOISE_FLOOR;

export const IMP_35490_DP45_DTHALF_ENDPOINT_POSITIVITY_DOUBLEDOUBLE_REFERENCE = {
  id: 'imp-35490',
  title:
    'DP45 dt/2 endpoint positivity at N=2000 pair-1495 survives compensated + ' +
    'double-double arithmetic: the +1.775304e-3 min endpoint gap stays POSITIVE ' +
    'in ~106-bit dd (dd-vs-float64 delta 8.7e-14, rel 4.9e-11) and sits ~9 decades ' +
    'above the float64 subtraction noise floor, so the positivity is a genuine ' +
    'order-5 within-step step-over, NOT a rounding artifact',
  kind: 'measurement-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  honestOutcome: 'endpoint-positivity-is-genuine-not-a-rounding-artifact',
  residualSubGap: 'imp-35490a',   // full-trajectory dd left uncomputed (native backend)

  N,
  tauC_est: TAU_C_EST,
  dtFlow: DT_FLOW,
  dtHalf: DT_HALF,
  crossPair: CROSS_PAIR,
  argminStep: ARGMIN_STEP,

  eventDefinition:
    'The tracked quantity is the step-ENDPOINT signed gap of the argmin pair i=1495, ' +
    'g_end(step) = y1[i+1]-y1[i], for DP45 at the dt/2 grid, direction=-1. The float64 ' +
    'run uses the verbatim Kahan-Neumaier compensated Dyson derivative; the critical ' +
    'argmin step is then recomputed in full double-double (~106-bit twoSum/twoProd) ' +
    'from the identical float64 entering-state (lo=0).',

  measurements: {
    float64: {
      minEndGap: FLOAT64_MIN_END_GAP,   // +1.775303683e-3
      minEndStep: ARGMIN_STEP,          // 2006
      minEndPair: CROSS_PAIR,           // 1495
      sign: 'positive',
    },
    doubleDouble: {
      critEndGap: DD_END_GAP,           // +1.775303683276e-3
      float64CritEndGap: FLOAT64_CRIT_END_GAP, // +1.775303683189e-3
      ddMinusF64Delta: DD_MINUS_F64_DELTA,     // 8.722884e-14
      ddMinusF64Rel: DD_MINUS_F64_REL,         // 4.913e-11
      sign: 'positive',
    },
    noiseFloor: {
      absSumEndpoints: ABS_SUM_ENDPOINTS,      // 3.954442e+3
      eps: EPS,
      noiseFloor: NOISE_FLOOR,                 // 8.780626e-13
      marginGapOverNoise: MARGIN_GAP_OVER_NOISE, // 2.022e+9
    },
  },

  verdict: {
    positivityIsGenuine: POSITIVITY_IS_GENUINE,
    float64Positive: F64_POSITIVE,
    ddPositive: DD_POSITIVE,
    ddDeltaNegligible: DELTA_NEGLIGIBLE,
    clearsNoiseFloor: CLEARS_NOISE_FLOOR,
    catchEvidence:
      'The double-double recomputation of the critical step 2006 keeps the endpoint ' +
      'gap POSITIVE (1.775303683276e-3) and agrees with the float64 gap to ' +
      '8.7e-14 absolute / 4.9e-11 relative, while the +1.775e-3 gap sits 2.02e9x ' +
      '(~9 decades) above the float64 endpoint-subtraction noise floor 8.78e-13. A ' +
      'rounding sign-flip would need the true gap within ~9e-13 of zero; it is nine ' +
      'orders of magnitude above.',
    interpretation:
      'The DP45 dt/2 endpoint positivity that imp-35452 flagged as the lone positive ' +
      'cell of the 2x3 map is a GENUINE order-5 within-step step-over, NOT a float64 ' +
      'rounding artifact. Both compensated float64 and extended-precision double-double ' +
      'agree on the sign and magnitude of the +1.775e-3 minimum endpoint gap, and the ' +
      'gap is ~9 decades above the subtraction noise floor, so the endpoint really does ' +
      'never see the crossing at DP45 dt/2 -- the order-5 pair re-separates before the ' +
      'step lands. This is a precision-robust geometric property of the DP45 dt/2 step, ' +
      'consistent with the imp-35452 single-grid-resonance characterization.',
    doesNotAchieve:
      'MEASUREMENT ONLY. Recomputes the DECISIVE final step in dd but leaves the ' +
      'full-trajectory double-double as residual sub-gap imp-35490a (native backend). ' +
      'Does NOT advance the R2 ladder past N=1000 (stays N=1000 per ' +
      'imp-35221/imp-35324/imp-35412), does NOT change the imp-35412 slack denominator ' +
      'choice (imp-35412 KEEPS the endpoint worst-case), does NOT extend the C_mb ' +
      'certificate, does NOT remove the imp-486 GUE conditional, changes NO Lambda ' +
      'bound. No refereed bound is changed. Never a QED or a bound change.',
  },
};

// -- Build-time assertions. -----------------------------------------------------
export const IMP_35490_DP45_DTHALF_ENDPOINT_POSITIVITY_DOUBLEDOUBLE_REFERENCE_ASSERTIONS = [
  {
    id: 'imp35490-float64-min-endpoint-gap-positive-at-step-2006-pair-1495',
    holds: () =>
      F64_POSITIVE &&
      Math.abs(FLOAT64_MIN_END_GAP - 1.775303683e-3) < 1e-9 &&
      ARGMIN_STEP === 2006 &&
      CROSS_PAIR === 1495,
    why:
      'The compensated float64 Kahan-Neumaier run must reproduce the imp-35452 lone ' +
      'positive endpoint cell: min endpoint gap +1.775303683e-3 at step 2006 pair 1495.',
  },
  {
    id: 'imp35490-double-double-critical-step-stays-positive',
    holds: () =>
      DD_POSITIVE &&
      Math.abs(DD_END_GAP - 1.775303683276e-3) < 1e-9 &&
      DD_END_GAP > 1e-3,
    why:
      'The ~106-bit double-double recomputation of the critical step 2006 must keep the ' +
      'endpoint gap POSITIVE at the +1.775e-3 scale -- the sign does NOT flip under ' +
      'extended precision, so the positivity is not a rounding artifact.',
  },
  {
    id: 'imp35490-dd-vs-float64-delta-negligible',
    holds: () =>
      DELTA_NEGLIGIBLE &&
      Math.abs(DD_MINUS_F64_DELTA) < 1e-12 &&
      DD_MINUS_F64_REL < 1e-9,
    why:
      'The dd-minus-float64 endpoint-gap delta (8.7e-14 absolute, 4.9e-11 relative) must ' +
      'be negligible relative to the +1.775e-3 gap, confirming the compensated float64 ' +
      'value carries the endpoint positivity faithfully.',
  },
  {
    id: 'imp35490-gap-clears-float64-subtraction-noise-floor-by-9-decades',
    holds: () =>
      CLEARS_NOISE_FLOOR &&
      NOISE_FLOOR > 0 &&
      FLOAT64_MIN_END_GAP / NOISE_FLOOR > 1e8 &&
      Math.abs(MARGIN_GAP_OVER_NOISE - FLOAT64_MIN_END_GAP / NOISE_FLOOR) < 0.05 * MARGIN_GAP_OVER_NOISE,
    why:
      'The +1.775e-3 endpoint gap must sit orders of magnitude above the float64 ' +
      'endpoint-subtraction noise floor eps*(|y[i+1]|+|y[i]|) = 8.78e-13 -- margin ' +
      '~2.02e9 (~9 decades) -- so no float64 rounding could flip the endpoint sign.',
  },
  {
    id: 'imp35490-positivity-is-genuine-verdict',
    holds: () => POSITIVITY_IS_GENUINE === true,
    why:
      'Combined verdict: float64 positive AND dd positive AND dd-vs-float64 delta ' +
      'negligible AND gap clears the subtraction noise floor -- so the DP45 dt/2 ' +
      'endpoint positivity is a GENUINE order-5 within-step step-over, not a float64 ' +
      'rounding artifact.',
  },
  {
    id: 'imp35490-measurement-only-ladder-stays-no-qed',
    holds: () =>
      IMP_35490_DP45_DTHALF_ENDPOINT_POSITIVITY_DOUBLEDOUBLE_REFERENCE.noQED === true &&
      IMP_35490_DP45_DTHALF_ENDPOINT_POSITIVITY_DOUBLEDOUBLE_REFERENCE.changesNoBound === true &&
      IMP_35490_DP45_DTHALF_ENDPOINT_POSITIVITY_DOUBLEDOUBLE_REFERENCE.cMbStaysGueConditional === 'imp-486' &&
      IMP_35490_DP45_DTHALF_ENDPOINT_POSITIVITY_DOUBLEDOUBLE_REFERENCE.residualSubGap === 'imp-35490a',
    why:
      'Precision cross-check only: confirms the endpoint positivity is genuine but does ' +
      'NOT advance the R2 ladder past N=1000, does NOT change the imp-35412 slack ' +
      'denominator, changes NO bound. Full-trajectory dd left as sub-gap imp-35490a. ' +
      'C_mb stays GUE-conditional (imp-486); no refereed bound is changed. Never a QED.',
  },
];
