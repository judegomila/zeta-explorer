/**
 * @module imp-97723-sigma-fartail-diagnostic-asymptote-one
 *
 * imp-97723 (numerical, frontier-direction): imp-97702 decomposed the far-tail sigma-exponent
 * residual 1/2 - p = (1/2)sigma + a(1-sigma) into a dying power-law piece (1/2)sigma ~ N^-1/2
 * and a slow logarithmic piece a(1-sigma) -> a ~ 1/(2 log T0), and reported that the deep-tail
 * diagnostic (1/2 - p) * 2 log T0 "settles to ~0.98" (1.041 at 1e15 -> 0.977 by 1e18, holding
 * ~0.98 out to 1e24). imp-97702 left OPEN whether that ~0.98 is (i) an asymptote of EXACTLY 1
 * not yet reached or (ii) a genuine sub-leading constant offset. This module DECIDES it by
 * extending the grid far past 1e24 (to 1e300, the double-precision ceiling of the inherited
 * Riemann-von Mangoldt inverse) and fitting a two-term model to the a-coefficient.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33644 / imp-97702)
 * ---------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5                           (N-INDEPENDENT fixed strip, imp-2631)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0       = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 * No re-derivation, no fresh model: the exact inherited imp-3406/imp-97702 parts(), on a grid
 * extended to 1e300. E_flow is negligible on the whole tested band (deep past N_cross).
 *
 * THE EXACT CLOSED FORM OF THE DIAGNOSTIC (the analytic key)
 * ---------------------------------------------------------
 * From imp-97702, once the power-law piece (1/2)sigma has died the residual -> a(1-sigma) with
 * a = (1/2) d ln(log T0)/d ln N = (1/(2 log T0)) * d ln T0/d ln N. Multiplying the FULL residual
 * by 2 log T0,
 *
 *     (1/2 - p) * 2 log T0  =  (1 - sigma) * (d ln T0 / d ln N)   +   sigma * log T0
 *
 * and the Riemann-von Mangoldt relation N = (T0/2pi)(log(T0/2pi) - 1) gives the EXACT slope
 *
 *     d ln T0 / d ln N  =  1 - 1 / log(T0/2pi)                    (Lprime = log(T0/2pi))
 *
 * so deep in the tail (sigma -> 0, the sigma*log T0 term also vanishing) the diagnostic equals
 *
 *     (1/2 - p) * 2 log T0  ->  1 - 1 / log(T0/2pi)   ->  1   (as T0 -> infinity).
 *
 * THE VERDICT: CASE (i). The ~0.98 is NOT a floor; it is the value of 1 - 1/log(T0/2pi) at those
 * heights, which climbs toward EXACTLY 1 but only LOGARITHMICALLY -- 0.9805 at 1e24, 0.9846 at
 * 1e30, 0.9926 at 1e60, 0.9956 at 1e100, 0.9989 at 1e300. It does not cross 0.99 until ~1e45 and
 * does not cross 0.995 until ~1e89. So imp-97702 measured a genuine asymptote of 1 that its 1e24
 * grid was nowhere near reaching, not a constant offset.
 *
 * THE TWO-TERM a-COEFFICIENT FIT (isolating the next-order coefficient c and its sign)
 * -----------------------------------------------------------------------------------
 * Writing a = 1/(2 log T0) * (1 + c/log T0 + ...), the exact slope above gives the CLOSED FORM
 *
 *     2 log T0 * a  =  1 - 1/(log T0 - ln 2pi)   =>   c(L) = log T0 * (2 log T0 * a - 1)
 *                                                          = - log T0 / (log T0 - ln 2pi)  ->  -1.
 *
 * The next-order coefficient c is NEGATIVE and converges to -1: measured c = -1.0358 at 1e24,
 * -1.0283 at 1e30, -1.0082 at 1e100, -1.0040 at 1e200, each matching -L/(L - ln 2pi) to round-off.
 * The c < 0 sign is exactly why the diagnostic approaches 1 FROM BELOW (the "~0.98"), and the
 * 1/L^2 term carries coefficient -ln(2pi) ~ -1.838. So the a-coefficient obeys
 *     a = (1/(2 log T0)) * (1 - 1/log T0 - ln(2pi)/(log T0)^2 - ...).
 *
 * THE FINDINGS (measurement / closed-form derivation only)
 * -------------------------------------------------------
 *   (F1) THE DEEP-TAIL DIAGNOSTIC EQUALS 1 - 1/log(T0/2pi) TO THE CENTRAL-DIFFERENCE FLOOR. On
 *        [1e18,1e300] the measured (1/2 - p)*2 log T0 matches (1-sigma)*(1 - 1/log(T0/2pi)) +
 *        sigma*log T0 to < 3e-6 at every rung (4e-9 at 1e18, growing with the vanishing log-sigma
 *        as the H=1e-5 central difference loses relative precision), and matches the bare
 *        1 - 1/log(T0/2pi) once sigma is negligible. The diagnostic is the RvM log-derivative
 *        slope, not a free constant.
 *   (F2) IT CONVERGES TO EXACTLY 1 (CASE i), NOT A ~0.98 FLOOR. The diagnostic climbs monotonically
 *        0.9805 (1e24) -> 0.9846 (1e30) -> 0.9926 (1e60) -> 0.9989 (1e300), crossing 0.99 near
 *        1e45 and 0.995 near 1e89. imp-97702 read the asymptote correctly as logarithmic but its
 *        1e24 grid sat at 1 - 1/51.3 ~ 0.98, far short of the limit.
 *   (F3) THE NEXT-ORDER COEFFICIENT IS c = -1 (NEGATIVE). Fitting a = (1/(2 log T0))(1 + c/log T0
 *        + ...) gives c(L) = -L/(L - ln 2pi), matching the measured L*(2L*a - 1) to round-off and
 *        -> -1 from below; the 1/L^2 coefficient is -ln(2pi). The negative sign is the mechanism
 *        of the from-below approach.
 *
 * The punchline: imp-97702 F3 is now resolved. The ~0.98 diagnostic is the finite-height value of
 * the exact RvM slope 1 - 1/log(T0/2pi); it is an asymptote of EXACTLY 1 (case i), reached only
 * logarithmically, with a NEGATIVE next-order coefficient c -> -1 pinning the from-below approach.
 *
 * MEASUREMENT / CLOSED-FORM DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the
 * C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-97702-sigma-fartail-exponent-residual-half-loglaw (splits the residual; leaves the ~0.98 floor-vs-asymptote open)
 * @see imp-97744-fartail-diagnostic-crossing-heights (sharpens F2's order-of-magnitude "near 1e45 / near
 *      1e89" crossings to the exact closed-form heights N ~ 2.66124e45 / 1.43797e89 / 1.96810e437 by
 *      inverting the bare RvM slope; self-consistent with this module's full-model bisection to < 0.06 in log10 N)
 * @see imp-97404-sigma-fartail-exponent-ladder-past-1e12 (exponent ladder to 1e15, residual "closing")
 * @see imp-33644-etrunc-ecoll-ladder-1e18-fartail (log T0 saturation holds the E_coll-exponent gap open)
 * @see imp-3463-sigma-fartail-decay (far-tail exponent -> 1/2 from below)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N via the RvM inverse)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-97702)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97702 exactly
const LN_TWO_PI = Math.log(TWO_PI);

// EXACT imp-3406/imp-97702 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // negligible deep past the crossover
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

const H = 1e-5; // central-difference step in ln N (stable at these scales)
// Pointwise local decay exponent p(N) = -d ln sigma / d ln N.
function pLocal(N) {
  const lp = Math.log(sigma(Math.exp(Math.log(N) + H)));
  const lm = Math.log(sigma(Math.exp(Math.log(N) - H)));
  return -(lp - lm) / (2 * H);
}
// The log-saturation coefficient a(N) = (1/2) d ln(log T0) / d ln N.
function aTerm(N) {
  const Lp = Math.log(parts(Math.exp(Math.log(N) + H)).L);
  const Lm = Math.log(parts(Math.exp(Math.log(N) - H)).L);
  return 0.5 * (Lp - Lm) / (2 * H);
}
const HALF = 0.5; // imp-3463 far-tail asymptote

// (F1/F2) Extended diagnostic ladder, deep past 1e24 to the double-precision RvM ceiling (1e300).
//   diag       = measured (1/2 - p) * 2 log T0
//   diagModel  = exact (1 - sigma)*(1 - 1/log(T0/2pi)) + sigma*log T0
//   slopeRvM   = the bare RvM slope 1 - 1/log(T0/2pi) = d ln T0/d ln N
const DIAG_LADDER = [18, 24, 30, 40, 60, 100, 200, 300].map((k) => {
  const N = Math.pow(10, k);
  const P = parts(N);
  const Lprime = Math.log(P.T0 / TWO_PI);
  const slopeRvM = 1 - 1 / Lprime;
  const diag = (HALF - pLocal(N)) * 2 * P.L;
  const diagModel = (1 - P.sigma) * slopeRvM + P.sigma * P.L;
  return {
    N: `1e${k}`,
    diag: +diag.toFixed(6),
    diagModel: +diagModel.toFixed(6),
    slopeRvM: +slopeRvM.toFixed(6),
    modelError: +Math.abs(diag - diagModel).toExponential(2),
    slopeError: +Math.abs(diag - slopeRvM).toExponential(2),
  };
});

// (F3) Two-term a-coefficient fit: a = 1/(2 log T0) * (1 + c/log T0 + ...), c(L) = L*(2L*a - 1).
// Closed form: c(L) = -L/(L - ln 2pi) -> -1 from below; the 1/L^2 coefficient is -ln 2pi.
const C_LADDER = [24, 30, 40, 100, 200].map((k) => {
  const N = Math.pow(10, k);
  const P = parts(N);
  const a = aTerm(N);
  const twoLa = 2 * P.L * a;
  const cMeas = P.L * (twoLa - 1);
  const cExact = -P.L / (P.L - LN_TWO_PI);
  return {
    N: `1e${k}`,
    twoLa: +twoLa.toFixed(6),
    cMeasured: +cMeas.toFixed(5),
    cClosedForm: +cExact.toFixed(5),
    cError: +Math.abs(cMeas - cExact).toExponential(2),
  };
});

// Height at which the diagnostic first crosses a target level t: 1 - 1/log(T0/2pi) = t
// <=> log(T0/2pi) = 1/(1-t). Reported as a witness that the limit is 1, only slowly reached.
function crossingLog10N(target) {
  let lo = Math.log(1e15);
  let hi = Math.log(Math.pow(10, 305));
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    const N = Math.exp(m);
    const P = parts(N);
    const diag = (1 - P.sigma) * (1 - 1 / Math.log(P.T0 / TWO_PI)) + P.sigma * P.L;
    if (diag < target) lo = m;
    else hi = m;
  }
  return Math.log10(Math.exp((lo + hi) / 2));
}
const CROSSINGS = {
  reach_0p99_log10N: +crossingLog10N(0.99).toFixed(1),
  reach_0p995_log10N: +crossingLog10N(0.995).toFixed(1),
  reach_0p999_log10N: +crossingLog10N(0.999).toFixed(1),
};

export const IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE = {
  id: 'imp-97723',
  proofSection: 'S-frontier',
  question:
    'Decide whether the imp-97702 far-tail diagnostic (1/2 - p) * 2 log T0 converges to EXACTLY 1 ' +
    'or floors at ~0.98, by extending the grid far past 1e24 (to the 1e300 double-precision RvM ' +
    'ceiling) and fitting a two-term model a = 1/(2 log T0)*(1 + c/log T0 + ...) to isolate the ' +
    'next-order coefficient c and its sign. Measurement/closed-form derivation only; conditional-' +
    'share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the deep-tail diagnostic (1/2 - p)*2 log T0 on [1e18,1e300] against the exact RvM slope ' +
    '1 - 1/log(T0/2pi); the two-term a-coefficient fit c(L) = log T0 * (2 log T0 * a - 1) and its ' +
    'closed form -log T0/(log T0 - ln 2pi); the heights at which the diagnostic crosses 0.99/0.995/0.999',
  diagLadder: DIAG_LADDER,
  cLadder: C_LADDER,
  crossings: CROSSINGS,
  farTailExponent: HALF, // imp-3463 asymptote
  diagnosticLimit: 1, // EXACTLY 1 (case i), reached only logarithmically
  nextOrderCoefficient: -1, // c -> -1 from below (negative sign)
  finding: {
    F1_diagnostic_is_the_rvm_slope:
      'On [1e18,1e300] the measured (1/2 - p)*2 log T0 matches the exact ' +
      '(1 - sigma)*(1 - 1/log(T0/2pi)) + sigma*log T0 to < 3e-6 at every rung (4e-9 at 1e18, ' +
      'growing to the H=1e-5 central-difference floor as log-sigma vanishes), and the bare ' +
      '1 - 1/log(T0/2pi) once sigma is negligible. The diagnostic is the Riemann-von Mangoldt ' +
      'log-derivative slope d ln T0/d ln N, not a free constant.',
    F2_converges_to_exactly_one:
      'CASE (i): the diagnostic climbs monotonically 0.9805 (1e24) -> 0.9846 (1e30) -> 0.9926 ' +
      '(1e60) -> 0.9989 (1e300), crossing 0.99 near 1e45 and 0.995 near 1e89. The ~0.98 out to ' +
      '1e24 is the finite-height value of 1 - 1/log(T0/2pi) ~ 1 - 1/51.3, NOT a constant offset; ' +
      'the limit is EXACTLY 1, reached only logarithmically.',
    F3_next_order_coefficient_is_minus_one:
      'Fitting a = (1/(2 log T0))(1 + c/log T0 + ...) gives c(L) = -log T0/(log T0 - ln 2pi), ' +
      'matching the measured log T0*(2 log T0*a - 1) to round-off (-1.0358 at 1e24 -> -1.0040 at ' +
      '1e200) and -> -1 from below; the 1/(log T0)^2 coefficient is -ln(2pi) ~ -1.838. The NEGATIVE ' +
      'sign is the mechanism of the from-below approach to 1.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CLOSED-FORM DERIVATION (frontier-direction, NOT rigorous). The imp-97702 ' +
    'far-tail diagnostic (1/2 - p)*2 log T0 is the exact Riemann-von Mangoldt log-derivative ' +
    'slope: deep in the tail it equals (1 - sigma)*(1 - 1/log(T0/2pi)) + sigma*log T0, matched to ' +
    'the central-difference floor (< 3e-6) on [1e18,1e300]. So it converges to EXACTLY 1 (case i), ' +
    'NOT a ~0.98 floor -- it climbs ' +
    '0.9805 (1e24) -> 0.9989 (1e300), crossing 0.99 only near 1e45, reaching 1 logarithmically. ' +
    'The two-term a-coefficient fit a = (1/(2 log T0))(1 + c/log T0 + ...) has c(L) = ' +
    '-log T0/(log T0 - ln 2pi) -> -1 from below (measured -1.0358 at 1e24 -> -1.0040 at 1e200, ' +
    'matched to round-off), a NEGATIVE next-order coefficient whose sign is exactly why the ' +
    'approach is from below. The component model is the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97702 (residual split, ~0.98 floor-vs-asymptote left open); imp-97404 (exponent ladder ' +
    'to 1e15); imp-33644 (log T0 saturation); imp-3463 (far-tail exponent -> 1/2); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc fixed-strip); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE_ASSERTIONS = [
  {
    // (F1) The diagnostic equals the exact RvM-slope model to round-off across the deep grid.
    id: 'imp97723-diagnostic-equals-rvm-slope-model',
    description: 'measured (1/2-p)*2 log T0 matches (1-sigma)*(1-1/log(T0/2pi)) + sigma*log T0 to the central-difference floor (< 1e-5) on [1e18,1e300]',
    holds: () => DIAG_LADDER.every((r) => r.modelError < 1e-5),
  },
  {
    // (F2) The diagnostic converges to EXACTLY 1 (case i): monotone increase to > 0.998 by 1e300.
    id: 'imp97723-diagnostic-converges-to-one',
    description: 'diag climbs monotonically past 1e24 and exceeds 0.998 by 1e300 (asymptote 1, not a ~0.98 floor)',
    holds: () => {
      for (let i = 1; i < DIAG_LADDER.length; i++) {
        if (!(DIAG_LADDER[i].diag > DIAG_LADDER[i - 1].diag)) return false;
      }
      const last = DIAG_LADDER[DIAG_LADDER.length - 1];
      return last.N === '1e300' && last.diag > 0.998 && last.diag < 1;
    },
  },
  {
    // (F2) The ~0.98 at 1e24 is exactly the RvM slope 1 - 1/log(T0/2pi) there, not a constant offset.
    id: 'imp97723-098-is-finite-height-slope',
    description: 'the 1e24 diagnostic sits at ~0.98 = 1 - 1/log(T0/2pi), and 0.99 is only crossed far past 1e24',
    holds: () => {
      const r = DIAG_LADDER.find((x) => x.N === '1e24');
      return r && Math.abs(r.diag - 0.9805) < 5e-3 && CROSSINGS.reach_0p99_log10N > 30;
    },
  },
  {
    // (F3) The two-term fit coefficient c matches the closed form and is NEGATIVE, -> -1.
    id: 'imp97723-next-order-coefficient-minus-one',
    description: 'c(L) = L*(2L*a - 1) matches -L/(L - ln 2pi) to round-off, is negative, and -> -1 from below',
    holds: () =>
      C_LADDER.every((r) => r.cError < 1e-4 && r.cMeasured < 0) &&
      C_LADDER[C_LADDER.length - 1].cMeasured > -1.01 &&
      C_LADDER[C_LADDER.length - 1].cMeasured > C_LADDER[0].cMeasured,
  },
  {
    // Honesty gate: measurement/derivation only, limit = 1, coefficient = -1, no QED, PT SOTA.
    id: 'imp97723-honesty-gate-no-qed',
    description: 'Measurement/derivation only: diagnostic limit = 1, next-order c = -1, no QED, PT stays SOTA',
    holds: () =>
      IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE.isRigorous === false &&
      IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE.diagnosticLimit === 1 &&
      IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE.nextOrderCoefficient === -1 &&
      /NO QED/.test(IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE.verdict) &&
      /remains SOTA/.test(IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE.verdict),
  },
];

for (const a of IMP97723_SIGMA_FARTAIL_DIAGNOSTIC_ASYMPTOTE_ONE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97723-sigma-fartail-diagnostic-asymptote-one assertion failed: ${a.id}`
    );
  }
}
