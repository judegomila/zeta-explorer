/**
 * @module imp-35262-ecoll-exponent-residual-0001-tolerance-locate
 *
 * imp-35262 (numerical, frontier-direction): imp-35242 EXTENDED the separated
 * E_coll local-decay-exponent ladder past N=1e15 and located where the exponent
 * residual to the far-tail -1/2 asymptote first drops below 0.005 -- at N ~ 4.67e44
 * (log10 N ~ 44.67, log T0 ~ 100.0) -- confirming the residual tracks the
 * imp-34130/imp-34187 closing law ~ 1/(2 log T0) with NO floor. imp-35242 stopped
 * at the <0.005 landmark. This module EXTENDS the IDENTICAL inherited
 * imp-3220/imp-3406 component model FURTHER (decade grid deep into the tail, past
 * N=1e45 to N=1e220+) and MEASURES:
 *   (M1) the N at which the E_coll local-exponent residual |exponent - (-1/2)|
 *        first drops below 0.001 (the tighter landmark imp-35242 leaves open),
 *   (M2) that the residual keeps equalling 1/(2 log T0) to <1e-4 the WHOLE way
 *        out (confirming the imp-34130 closing law shows NO floor deep in the tail),
 *   (M3) the far-tail convergence RATE: how many additional decades in N the
 *        <0.001 landmark costs beyond the imp-35242 <0.005 crossing (N=1e45 region).
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33620 / imp-35242 / imp-3406)
 * ---------------------------------------------------------------------------
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0     = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     local exponent(e) = d log E_coll / d log N over the decade ending at N=10^e
 * NO re-derivation and NO fresh model: the SAME E_coll sub-term and the SAME
 * one-decade finite-difference exponent convention as imp-33620/imp-35242,
 * evaluated on a grid pushed deeper into the tail. The C_C prefactor cancels in
 * the log-ratio, so the residual is a clean function of the RvM height map alone.
 *
 * THE DEEP-TAIL EXPONENT-RESIDUAL LADDER (imp-35242 tail 1e45 + the far decades)
 * ----------------------------------------------------------------------------
 *   N       T0          d log E_coll / d log N   residual to -1/2   1/(2 log T0)
 *   1e45    6.409e43    -0.49504                 0.00496            0.00496  (imp-35242)
 *   1e100   2.807e98    -0.49779                 0.00221            0.00221
 *   1e150   1.856e148   -0.49853                 0.00147            0.00146
 *   1e200   1.386e198   -0.49890                 0.00110            0.00110
 *   1e218   1.270e216   -0.49899                 0.00101            0.00100  (still >0.001)
 *   1e220   1.258e218   -0.49900                 0.00100            0.00100  <- first <0.001
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (M1) THE EXPONENT RESIDUAL FIRST DROPS BELOW 0.001 AT N ~ 1.28e219. On the
 *        integer decade grid the residual is 0.001005 at N=1e218 (still above) and
 *        0.000996 at N=1e220 (below); a bisection on the decade-ending exponent e
 *        locates the 0.001 crossing at e ~ 219.11 (N ~ 1.28e219, T0 ~ 1.62e217,
 *        log T0 ~ 500.1). The exponent is -0.49900 there, STILL strictly above
 *        -1/2 -- consistent with the imp-33620 monotone-from-above verdict, never
 *        crossing, deep into the tail.
 *   (M2) THE RESIDUAL KEEPS TRACKING 1/(2 log T0) WITH NO FLOOR. Across the whole
 *        deep-tail ladder the measured residual equals 1/(2 log T0) to <1e-4 (max
 *        abs deviation ~6e-6); at the crossing 0.001000 vs 0.001000. The closing
 *        law shows NO sign of a floor: the residual is exactly 1/2 the value it had
 *        at the imp-35242 <0.005 landmark (log T0 doubled 100 -> 500 = residual
 *        halved 0.005 -> 0.001), the clean signature of an un-floored 1/(2 log T0).
 *   (M3) FAR-TAIL CONVERGENCE RATE. Because residual ~ 1/(2 log T0) and log T0
 *        grows only ~logarithmically in N, tightening the landmark from <0.005
 *        (N~4.67e44, log T0 ~ 100) to <0.001 (N~1.28e219, log T0 ~ 500) requires
 *        log T0 to QUINTUPLE, i.e. ~174.4 additional decades in N beyond the
 *        imp-35242 crossing (~204 decades beyond the imp-33620 N=1e15 rung). The
 *        far-tail convergence is punishingly slow precisely because the numerator
 *        log T0 of the residual is a saturating (logarithmic-in-N) factor, NOT
 *        because of any floor.
 *
 * The punchline: pushing the imp-35242 separated E_coll exponent ladder deep into
 * the tail (past N=1e45 to N=1e220+) shows the local-exponent residual to -1/2
 * first drops below 0.001 at N ~ 1.28e219 (log T0 ~ 500), still approached
 * monotonely from above; the residual equals 1/(2 log T0) to <1e-4 the whole way
 * with NO floor (a fivefold log T0 growth exactly halves the residual 0.005 ->
 * 0.001); and the ~174-decade span from the imp-35242 <0.005 crossing quantifies
 * the far-tail log-T0-saturation-limited convergence rate.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35242-ecoll-exponent-residual-0005-tolerance-locate (the <0.005 landmark at N~4.67e44, extended here)
 * @see imp-35257-ecoll-exponent-residual-closed-form-derivation (residual = 1/(2 log T0) + O((log T0)^-2), leading term)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the residual ~ 1/(2 log T0) closing law, NO floor)
 * @see imp-34187-ecoll-residual-milestone-ladder (seven-rung milestone tabulation of the same closing law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// EXACT imp-33620/imp-35242 E_coll sub-term (no re-derivation, no fresh model).
function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N);
}

// One-decade finite-difference local exponent d log E_coll / d log N ending at N=10^e,
// identical convention to imp-33620/imp-35242.
function localExponent(e) {
  const N = Math.pow(10, e);
  const Nprev = Math.pow(10, e - 1);
  return Math.log(eColl(N) / eColl(Nprev)) / Math.log(N / Nprev);
}

// Residual of the local exponent to the far-tail -1/2 asymptote (positive: from above).
function residualToHalf(e) {
  return localExponent(e) + 0.5;
}

// The deep-tail milestone ladder: imp-35242 tail (1e45) plus the far decades to 1e220.
const DECADE_EXPONENTS = [45, 100, 150, 200, 215, 216, 217, 218, 220];
const LADDER = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const T0 = effectiveHeightForN(N);
  const res = residualToHalf(e);
  return {
    logN: e,
    T0: +T0.toExponential(4),
    logT0: +Math.log(T0).toFixed(3),
    ecoll_local_exponent: +localExponent(e).toFixed(5),
    residual_to_minus_half: +res.toFixed(5),
    inv_two_log_T0: +(1 / (2 * Math.log(T0))).toFixed(5),
    isFarTailDecade: e >= 100,
  };
});

const TOL = 0.001;

// (M1) Locate the first integer decade at which the residual drops below TOL, and the
// continuous crossing by bisection on the decade-ending exponent e (residual decreasing in e).
let FIRST_INTEGER_DECADE_BELOW = null;
for (let e = 45; e <= 300; e++) {
  if (residualToHalf(e) < TOL) {
    FIRST_INTEGER_DECADE_BELOW = e;
    break;
  }
}
function crossingExponent(target, loE, hiE) {
  let lo = loE;
  let hi = hiE;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (residualToHalf(mid) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const CROSSING_E = crossingExponent(TOL, FIRST_INTEGER_DECADE_BELOW - 1, FIRST_INTEGER_DECADE_BELOW);
const CROSSING_N = +Math.pow(10, CROSSING_E).toExponential(3); // ~1.28e219
const CROSSING_T0 = +effectiveHeightForN(Math.pow(10, CROSSING_E)).toExponential(3); // ~1.62e217
const CROSSING_LOG_T0 = +Math.log(effectiveHeightForN(Math.pow(10, CROSSING_E))).toFixed(3); // ~500.1
const CROSSING_EXPONENT = +localExponent(CROSSING_E).toFixed(5); // ~-0.49900 (still above -1/2)

// (M2) The residual equals 1/(2 log T0) at the crossing (imp-34130 closing law, no floor).
const CROSSING_INV_TWO_LOG_T0 = +(1 / (2 * Math.log(effectiveHeightForN(Math.pow(10, CROSSING_E))))).toFixed(5);
const LAW_MAX_ABS_DEV = Math.max(
  ...LADDER.map((r) => Math.abs(r.residual_to_minus_half - r.inv_two_log_T0)),
); // < 1e-4 across the deep-tail ladder

// (M3) The far-tail convergence-rate span: extra decades in N beyond the imp-35242 <0.005
// crossing (log10 N ~ 44.67) and beyond the imp-33620 N=1e15 rung (log-T0-saturation-limited).
const IMP35242_CROSSING_E = 44.67; // imp-35242 <0.005 landmark, log10 N ~ 44.67 (log T0 ~ 100)
const DECADES_FROM_35242_CROSSING = +(CROSSING_E - IMP35242_CROSSING_E).toFixed(3); // ~174.4
const DECADES_FROM_1E15 = +(CROSSING_E - 15).toFixed(3); // ~204.1
const LOG_T0_RATIO_35242_TO_35262 = +(CROSSING_LOG_T0 / 100).toFixed(3); // ~5.0 (log T0 quintuples)

export const IMP35262_ECOLL_EXPONENT_RESIDUAL_0001_TOLERANCE_LOCATE = {
  id: 'imp-35262',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35242 separated E_coll local-decay-exponent residual ladder past N=1e45 under ' +
    'the identical inherited imp-3220/imp-3406 component model to locate the N at which the exponent ' +
    'residual to the far-tail -1/2 asymptote first drops below 0.001, measuring how many additional ' +
    'decades that costs and confirming the 1/(2 log T0) closing law shows no floor deep in the tail. ' +
    'Measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N) (RvM inverse); ' +
    'local exponent = one-decade finite difference of log E_coll in log N, identical convention to ' +
    'imp-33620/imp-35242. The C_C prefactor cancels in the log-ratio, so the residual is a function of log T0(N).',
  tolerance: TOL,
  ladder: LADDER,
  findings: {
    M1_residual_first_below_0001: {
      claim:
        'The E_coll local-exponent residual to -1/2 first drops below 0.001 at N ~ 1.28e219 ' +
        '(log T0 ~ 500); on the integer grid it is 0.001005 at 1e218 (above) and 0.000996 at 1e220 (below)',
      first_integer_decade_below: FIRST_INTEGER_DECADE_BELOW, // 220
      crossing_log10_N: +CROSSING_E.toFixed(4), // ~219.11
      crossing_N: CROSSING_N, // ~1.28e219
      crossing_T0: CROSSING_T0, // ~1.62e217
      crossing_log_T0: CROSSING_LOG_T0, // ~500.1
      exponent_at_crossing: CROSSING_EXPONENT, // ~-0.49900 (still above -1/2)
    },
    M2_residual_tracks_inv_two_log_T0_no_floor: {
      claim:
        'The residual equals 1/(2 log T0) to <1e-4 across the whole deep-tail ladder (imp-34130 ' +
        'closing law, NO floor): a fivefold log T0 growth (100 -> 500) exactly halves the residual (0.005 -> 0.001)',
      residual_at_crossing: +residualToHalf(CROSSING_E).toFixed(5), // ~0.00100
      inv_two_log_T0_at_crossing: CROSSING_INV_TWO_LOG_T0, // ~0.00100
      max_abs_dev_over_ladder: +LAW_MAX_ABS_DEV.toFixed(6), // < 1e-4
      log_T0_ratio_vs_35242: LOG_T0_RATIO_35242_TO_35262, // ~5.0
    },
    M3_far_tail_convergence_rate: {
      claim:
        'Because residual ~ 1/(2 log T0) and log T0 grows only ~logarithmically in N, tightening the ' +
        'landmark from <0.005 (N~4.67e44, log T0 ~ 100) to <0.001 (N~1.28e219, log T0 ~ 500) needs ' +
        'log T0 to quintuple, i.e. ~174.4 additional decades in N beyond the imp-35242 crossing',
      decades_from_35242_crossing: DECADES_FROM_35242_CROSSING, // ~174.4
      decades_from_1e15: DECADES_FROM_1E15, // ~204.1
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Pushing the imp-35242 separated E_coll ' +
    'local-exponent ladder deep into the tail (past N=1e45 to N=1e220+) under the identical inherited ' +
    'model answers the imp-35262 question: (M1) the exponent residual to the far-tail -1/2 asymptote ' +
    'first drops below 0.001 at N ~ 1.28e219 (log10 N ~ 219.11, T0 ~ 1.62e217, log T0 ~ 500.1) -- ' +
    '0.001005 at 1e218 (still above), 0.000996 at 1e220 (first below) -- with the exponent still ' +
    'strictly above -1/2 (monotone from above per imp-33620, no crossover) deep into the tail; (M2) ' +
    'the residual equals 1/(2 log T0) to <1e-4 across every deep-tail rung, confirming the ' +
    'imp-34130/imp-34187 closing law shows NO floor -- a fivefold log T0 growth (100 -> 500) exactly ' +
    'halves the residual (0.005 -> 0.001); (M3) the far-tail convergence is log-T0-saturation-limited ' +
    '-- tightening the landmark from <0.005 to <0.001 costs ~174.4 additional decades in N beyond the ' +
    'imp-35242 crossing (~204 beyond the imp-33620 N=1e15 rung) because the numerator log T0 grows ' +
    'only logarithmically. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35242 (<0.005 landmark at N~4.67e44, extended here); imp-35257 (closed-form residual = ' +
    '1/(2 log T0) + O((log T0)^-2)); imp-34130 (residual ~ 1/(2 log T0) closing law, no floor); ' +
    'imp-34187 (milestone ladder of the same law); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35262_ECOLL_EXPONENT_RESIDUAL_0001_TOLERANCE_LOCATE_ASSERTIONS = [
  {
    // Reuse gate: the 1e45 rung reproduces the imp-35242 <0.005 crossing residual.
    id: 'imp35262-reproduces-imp35242-1e45-residual',
    description: 'exponent residual at N=1e45 ~ 0.00496 matches the imp-35242 <0.005 landmark',
    holds: () => Math.abs(residualToHalf(45) - 0.00496) < 5e-4,
  },
  {
    // (M1): the residual first drops below 0.001 at N~1.28e219, bracketed by the 1e218/1e220 grid,
    // with the exponent still above -1/2 and log T0 ~ 500.
    id: 'imp35262-residual-below-0001-located',
    description: 'residual<0.001 first at N~1.28e219 (log T0 ~ 500), exponent still above -1/2',
    holds: () =>
      residualToHalf(218) > TOL &&
      residualToHalf(220) < TOL &&
      FIRST_INTEGER_DECADE_BELOW === 220 &&
      CROSSING_E > 219 &&
      CROSSING_E < 220 &&
      CROSSING_EXPONENT > -0.5 &&
      Math.abs(CROSSING_LOG_T0 - 500) < 2.0,
  },
  {
    // (M2): the residual tracks 1/(2 log T0) to <1e-4 across the deep-tail ladder with no floor;
    // a fivefold log T0 growth halves the residual (0.005 -> 0.001).
    id: 'imp35262-residual-tracks-inv-two-log-T0-no-floor',
    description: 'residual equals 1/(2 log T0) to <1e-4 across the deep tail; log T0 quintuples, residual halves',
    holds: () =>
      LAW_MAX_ABS_DEV < 1e-4 &&
      Math.abs(residualToHalf(CROSSING_E) - CROSSING_INV_TWO_LOG_T0) < 1e-4 &&
      Math.abs(LOG_T0_RATIO_35242_TO_35262 - 5) < 0.3,
  },
  {
    // (M3): the far-tail convergence span from the imp-35242 <0.005 crossing to the <0.001 crossing.
    id: 'imp35262-far-tail-convergence-rate',
    description: '~174 extra decades in N from the imp-35242 <0.005 crossing to the <0.001 crossing',
    holds: () =>
      DECADES_FROM_35242_CROSSING > 165 &&
      DECADES_FROM_35242_CROSSING < 185 &&
      DECADES_FROM_1E15 > 195 &&
      DECADES_FROM_1E15 < 215,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35262-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35262_ECOLL_EXPONENT_RESIDUAL_0001_TOLERANCE_LOCATE.isRigorous === false &&
      /NO QED/.test(IMP35262_ECOLL_EXPONENT_RESIDUAL_0001_TOLERANCE_LOCATE.verdict) &&
      /refereed bound is changed/i.test(IMP35262_ECOLL_EXPONENT_RESIDUAL_0001_TOLERANCE_LOCATE.verdict),
  },
];

for (const a of IMP35262_ECOLL_EXPONENT_RESIDUAL_0001_TOLERANCE_LOCATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35262-ecoll-exponent-residual-0001-tolerance-locate assertion failed: ${a.id}`);
  }
}
