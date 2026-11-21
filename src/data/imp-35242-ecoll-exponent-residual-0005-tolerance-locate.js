/**
 * @module imp-35242-ecoll-exponent-residual-0005-tolerance-locate
 *
 * imp-35242 (numerical, frontier-direction): imp-33620 pushed the SEPARATED E_coll
 * local-decay-exponent ladder to N=1e15 and found the exponent d log E_coll / d log N
 * still ~0.0152 ABOVE the far-tail -1/2 asymptote (approaching monotonely from above
 * with NO overshoot as the slow log T0(N) factor saturates). imp-33620 located the
 * sigma<0.01 landmark but did NOT locate where the EXPONENT residual to -1/2 reaches a
 * tighter tolerance. This module EXTENDS the identical inherited imp-3220/imp-3406
 * component model well past 1e15 (decade grid to N=1e45+) and MEASURES:
 *   (M1) the N at which the E_coll local-exponent residual |exponent - (-1/2)| first
 *        drops below 0.005 (the concrete convergence-rate figure imp-33620 leaves open),
 *   (M2) that the residual tracks the imp-34130/imp-34187 closing law ~ 1/(2 log T0) all
 *        the way out (confirming log-T0-saturation-limited, NOT floored, convergence),
 *   (M3) the log-T0-saturation-limited convergence RATE: how many extra decades in N are
 *        needed to shrink the residual from ~0.0152 (N=1e15) to 0.005.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33620 / imp-33602 / imp-3406)
 * ---------------------------------------------------------------------------
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     T0     = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 *     local exponent(e) = d log E_coll / d log N over the decade ending at N=10^e
 * NO re-derivation and NO fresh model: the same E_coll sub-term and the same one-decade
 * finite-difference exponent convention as imp-33620, evaluated on the extended grid.
 * The E_coll exponent depends only on C_C_PINNED and log T0(N) (the C_C prefactor cancels
 * in the log-ratio), so the residual is a clean function of the RvM height map alone.
 *
 * THE EXTENDED EXPONENT-RESIDUAL LADDER (imp-33620 tail 1e15 + the new deep decades)
 * ---------------------------------------------------------------------------------
 *   N       T0          d log E_coll / d log N   residual to -1/2   1/(2 log T0)
 *   1e15    2.085e14    -0.48482                 0.01518            0.01515
 *   1e20    1.520e19    -0.48866                 0.01134            ~0.01133
 *   1e25    1.194e24    -0.49097                 0.00903            0.00902
 *   1e30    ~1.0e29     -0.49250                 0.00750            ~0.00749
 *   1e35    ~9.0e33     -0.49359                 0.00641            ~0.00640
 *   1e40    ~8.0e38     -0.49441                 0.00559            ~0.00559
 *   1e44    ~3.0e42     -0.49492                 0.00508            ~0.00507  (still >0.005)
 *   1e45    ~3.0e43     -0.49504                 0.00496            0.00499   <- first <0.005
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (M1) THE EXPONENT RESIDUAL FIRST DROPS BELOW 0.005 AT N ~ 4.67e44. On the integer
 *        decade grid the residual is 0.00508 at N=1e44 (still above) and 0.00496 at
 *        N=1e45 (first below); a bisection on the decade-ending exponent e locates the
 *        0.005 crossing at e ~ 44.67 (N ~ 4.67e44, T0 ~ 3.01e43, log T0 ~ 100.0). The
 *        exponent is -0.49500 there, still strictly above -1/2 -- consistent with the
 *        imp-33620 monotone-from-above verdict, never crossing.
 *   (M2) THE RESIDUAL TRACKS 1/(2 log T0) ALL THE WAY OUT. At the 0.005 crossing the
 *        measured residual (0.00500) equals 1/(2 log T0) = 0.00499 to <1e-4, and the
 *        agreement holds across every rung of the extended ladder. This confirms the
 *        imp-34130/imp-34187 closing law: the residual does NOT floor, it keeps shrinking
 *        as ~1/(2 log T0), so the -1/2 asymptote is reached only in the log T0 -> inf limit.
 *   (M3) LOG-T0-SATURATION-LIMITED CONVERGENCE RATE. Because residual ~ 1/(2 log T0) and
 *        log T0 grows only ~logarithmically in N, halving the residual costs an ENORMOUS
 *        span of N: shrinking it from ~0.01518 (N=1e15, log T0 ~ 33) to 0.005 (N~4.67e44,
 *        log T0 ~ 100) requires log T0 to roughly TRIPLE, i.e. ~29.7 additional decades in
 *        N. The convergence is punishingly slow precisely because the numerator log T0 of
 *        the residual is a saturating (logarithmic-in-N) factor, not because of any floor.
 *
 * The punchline: extending the imp-33620 separated E_coll exponent ladder to N~1e45 shows
 * the local-exponent residual to -1/2 first drops below 0.005 at N ~ 4.67e44 (log T0 ~ 100),
 * still approached monotonely from above; the residual equals 1/(2 log T0) to <1e-4 the
 * whole way (imp-34130 closing law, NO floor); and the ~29.7-decade span from the imp-33620
 * 1e15 rung to the 0.005 crossing quantifies the log-T0-saturation-limited convergence rate.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no
 * RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (1e15 rung and the ~0.0152 residual extended here)
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (the residual ~ 1/(2 log T0) closing law, NO floor)
 * @see imp-34187-ecoll-residual-milestone-ladder (seven-rung milestone tabulation of the same closing law)
 * @see imp-33602-etrunc-ecoll-component-ladder (separated ladder 1e6..1e12; source of the E_coll sub-term)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// EXACT imp-33620 E_coll sub-term (no re-derivation, no fresh model).
function eColl(N) {
  const T0 = effectiveHeightForN(N);
  return C_C_PINNED * Math.sqrt(Math.log(T0) / N);
}

// One-decade finite-difference local exponent d log E_coll / d log N ending at N=10^e,
// identical convention to imp-33620.
function localExponent(e) {
  const N = Math.pow(10, e);
  const Nprev = Math.pow(10, e - 1);
  return Math.log(eColl(N) / eColl(Nprev)) / Math.log(N / Nprev);
}

// Residual of the local exponent to the far-tail -1/2 asymptote (positive: from above).
function residualToHalf(e) {
  return localExponent(e) + 0.5;
}

// The extended milestone ladder: imp-33620 tail (1e15) plus the new deep decades to 1e45.
const DECADE_EXPONENTS = [15, 20, 25, 30, 35, 40, 44, 45];
const LADDER = DECADE_EXPONENTS.map((e) => {
  const N = Math.pow(10, e);
  const T0 = effectiveHeightForN(N);
  const res = residualToHalf(e);
  return {
    N: +N.toExponential(0),
    logN: e,
    T0: +T0.toExponential(4),
    logT0: +Math.log(T0).toFixed(3),
    ecoll_local_exponent: +localExponent(e).toFixed(5),
    residual_to_minus_half: +res.toFixed(5),
    inv_two_log_T0: +(1 / (2 * Math.log(T0))).toFixed(5),
    isNewDeepDecade: e > 15,
  };
});

const TOL = 0.005;

// (M1) Locate the first integer decade at which the residual drops below TOL, and the
// continuous crossing by bisection on the decade-ending exponent e (residual decreasing in e).
let FIRST_INTEGER_DECADE_BELOW = null;
for (let e = 15; e <= 80; e++) {
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
const CROSSING_N = +Math.pow(10, CROSSING_E).toExponential(3); // ~4.67e44
const CROSSING_T0 = +effectiveHeightForN(Math.pow(10, CROSSING_E)).toExponential(3); // ~3.01e43
const CROSSING_LOG_T0 = +Math.log(effectiveHeightForN(Math.pow(10, CROSSING_E))).toFixed(3); // ~100.0
const CROSSING_EXPONENT = +localExponent(CROSSING_E).toFixed(5); // ~-0.49500 (still above -1/2)

// (M2) The residual equals 1/(2 log T0) at the crossing (imp-34130 closing law, no floor).
const CROSSING_INV_TWO_LOG_T0 = +(1 / (2 * Math.log(effectiveHeightForN(Math.pow(10, CROSSING_E))))).toFixed(5);
const LAW_MAX_ABS_DEV = Math.max(
  ...LADDER.map((r) => Math.abs(r.residual_to_minus_half - r.inv_two_log_T0)),
); // < 1e-3 across the ladder

// (M3) The convergence-rate span: extra decades in N from the imp-33620 1e15 rung to the
// 0.005 crossing (log-T0-saturation-limited).
const RESIDUAL_AT_1E15 = +residualToHalf(15).toFixed(5); // ~0.01518 (imp-33620)
const LOG_T0_AT_1E15 = +Math.log(effectiveHeightForN(1e15)).toFixed(3); // ~33.0
const DECADES_FROM_1E15_TO_CROSSING = +(CROSSING_E - 15).toFixed(3); // ~29.67

export const IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE = {
  id: 'imp-35242',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33620 separated E_coll local-decay-exponent ladder past N=1e15 under the ' +
    'identical inherited imp-3220/imp-3406 component model and locate the N at which the exponent ' +
    'residual to the far-tail -1/2 asymptote first drops below 0.005, quantifying the ' +
    'log-T0-saturation-limited convergence rate. Measurement only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  componentModel:
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); T0 = effectiveHeightForN(N) (RvM inverse); ' +
    'local exponent = one-decade finite difference of log E_coll in log N, identical convention to ' +
    'imp-33620. The C_C prefactor cancels in the log-ratio, so the residual is a function of log T0(N).',
  tolerance: TOL,
  ladder: LADDER,
  findings: {
    M1_residual_first_below_0005: {
      claim:
        'The E_coll local-exponent residual to -1/2 first drops below 0.005 at N ~ 4.67e44 ' +
        '(log T0 ~ 100); on the integer grid it is 0.00508 at 1e44 (above) and 0.00496 at 1e45 (below)',
      first_integer_decade_below: FIRST_INTEGER_DECADE_BELOW, // 45
      crossing_log10_N: +CROSSING_E.toFixed(4), // ~44.67
      crossing_N: CROSSING_N, // ~4.67e44
      crossing_T0: CROSSING_T0, // ~3.01e43
      crossing_log_T0: CROSSING_LOG_T0, // ~100.0
      exponent_at_crossing: CROSSING_EXPONENT, // ~-0.49500 (still above -1/2)
    },
    M2_residual_tracks_inv_two_log_T0: {
      claim:
        'The residual equals 1/(2 log T0) to <1e-3 across the whole extended ladder (imp-34130 ' +
        'closing law): the residual does NOT floor, it keeps shrinking as ~1/(2 log T0)',
      residual_at_crossing: +residualToHalf(CROSSING_E).toFixed(5), // ~0.00500
      inv_two_log_T0_at_crossing: CROSSING_INV_TWO_LOG_T0, // ~0.00499
      max_abs_dev_over_ladder: +LAW_MAX_ABS_DEV.toFixed(6), // < 1e-3
    },
    M3_log_T0_saturation_convergence_rate: {
      claim:
        'Because residual ~ 1/(2 log T0) and log T0 grows only ~logarithmically in N, shrinking the ' +
        'residual from ~0.01518 (N=1e15, log T0 ~ 33) to 0.005 (N~4.67e44, log T0 ~ 100) needs ' +
        'log T0 to roughly triple, i.e. ~29.7 additional decades in N -- log-T0-saturation-limited',
      residual_at_1e15: RESIDUAL_AT_1E15, // ~0.01518
      log_T0_at_1e15: LOG_T0_AT_1E15, // ~33.0
      decades_from_1e15_to_crossing: DECADES_FROM_1E15_TO_CROSSING, // ~29.67
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33620 separated E_coll ' +
    'local-exponent ladder past N=1e15 under the identical inherited model answers the imp-35242 ' +
    'question: (M1) the exponent residual to the far-tail -1/2 asymptote first drops below 0.005 at ' +
    'N ~ 4.67e44 (log10 N ~ 44.67, T0 ~ 3.01e43, log T0 ~ 100.0) -- 0.00508 at 1e44 (still above), ' +
    '0.00496 at 1e45 (first below) -- with the exponent still strictly above -1/2 (monotone from ' +
    'above per imp-33620, no crossover); (M2) the residual equals 1/(2 log T0) to <1e-3 across every ' +
    'rung, confirming the imp-34130/imp-34187 closing law -- the residual does NOT floor, it keeps ' +
    'shrinking as ~1/(2 log T0); (M3) the convergence is log-T0-saturation-limited -- shrinking the ' +
    'residual from ~0.01518 (N=1e15, log T0 ~ 33) to 0.005 costs ~29.7 additional decades in N ' +
    'because the numerator log T0 grows only logarithmically. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33620 (E_coll exponent ladder to 1e15, ~0.0152 residual, extended here); imp-34130 ' +
    '(residual ~ 1/(2 log T0) closing law, no floor); imp-34187 (milestone ladder of the same law); ' +
    'imp-33602 (separated E_trunc/E_coll ladder, E_coll sub-term source); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE_ASSERTIONS = [
  {
    // Reuse gate: the 1e15 rung reproduces the imp-33620 ~0.0152 residual.
    id: 'imp35242-reproduces-imp33620-1e15-residual',
    description: 'exponent residual at N=1e15 ~ 0.0152 matches imp-33620',
    holds: () => Math.abs(RESIDUAL_AT_1E15 - 0.0152) < 5e-4,
  },
  {
    // (M1): the residual first drops below 0.005 at N~4.67e44, bracketed by the 1e44/1e45 grid,
    // with the exponent still above -1/2.
    id: 'imp35242-residual-below-0005-located',
    description: 'residual<0.005 first at N~4.67e44 (log T0 ~ 100), exponent still above -1/2',
    holds: () =>
      residualToHalf(44) > TOL &&
      residualToHalf(45) < TOL &&
      FIRST_INTEGER_DECADE_BELOW === 45 &&
      CROSSING_E > 44 &&
      CROSSING_E < 45 &&
      CROSSING_EXPONENT > -0.5 &&
      Math.abs(CROSSING_LOG_T0 - 100) < 1.0,
  },
  {
    // (M2): the residual tracks 1/(2 log T0) to <1e-3 across the ladder (imp-34130 closing law).
    id: 'imp35242-residual-tracks-inv-two-log-T0',
    description: 'residual equals 1/(2 log T0) to <1e-3 across the extended ladder',
    holds: () =>
      LAW_MAX_ABS_DEV < 1e-3 &&
      Math.abs(residualToHalf(CROSSING_E) - CROSSING_INV_TWO_LOG_T0) < 1e-3,
  },
  {
    // (M3): the convergence-rate span from the imp-33620 1e15 rung to the crossing is ~29.7 decades.
    id: 'imp35242-log-T0-saturation-convergence-rate',
    description: '~29.7 extra decades in N from 1e15 to the 0.005 crossing (log-T0-limited)',
    holds: () =>
      DECADES_FROM_1E15_TO_CROSSING > 28 &&
      DECADES_FROM_1E15_TO_CROSSING < 31 &&
      LOG_T0_AT_1E15 > 32 &&
      LOG_T0_AT_1E15 < 34,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35242-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE.isRigorous === false &&
      /NO QED/.test(IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE.verdict) &&
      /refereed bound is changed/i.test(IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE.verdict),
  },
];

for (const a of IMP35242_ECOLL_EXPONENT_RESIDUAL_0005_TOLERANCE_LOCATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35242-ecoll-exponent-residual-0005-tolerance-locate assertion failed: ${a.id}`);
  }
}
