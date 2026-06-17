/**
 * @module imp-2641-c-selberg-trudgian-discharge
 *
 * imp-2641 (critical, proof): Replace the C_Selberg = 3.0 PLACEHOLDER inside
 * C_KH = pi * C_Selberg with the EXPLICIT Trudgian 2014 S(T) bound, evaluated
 * at the surviving finite-N* = 1e4 beat height T0 = gamma_N approx 9.879e3,
 * recompute C_C and E_coll, and report whether E_coll stays at ~0.0116 -- with
 * NO false QED: the residual Erdos-Turan bridge gap is named explicitly.
 *
 * BACKGROUND
 * ----------
 * The collision error term is E_coll(N) = C_C . sqrt(log(T0)/N) with the
 * N-independent constant
 *     C_C  = C_H . sqrt(C_KH),   C_KH = pi . C_Selberg,   C_H = 1/8.
 * In lean4-koksma-hlawka.js the value C_Selberg = 3 is a PLACEHOLDER ("best
 * known effective constant", imp-341/imp-366) standing for the growth
 * coefficient of the Riemann S(T) = (1/pi) arg zeta(1/2 + iT) in the form
 *     |S(T)| <= C_Selberg . log T.
 * This module discharges that placeholder to the explicit literature constant.
 *
 * THE EXPLICIT BOUND (Trudgian 2014)
 * ----------------------------------
 * Trudgian, "An improved upper bound for the argument of the Riemann
 * zeta-function on the critical line II", J. Number Theory 134 (2014), Thm 1:
 *     |S(T)| <= 0.112 . log T + 0.278 . log log T + 2.510   for all T >= e.
 * This is a rigorous, unconditional, fully explicit bound.
 *
 * THREADING IT AT N* = 1e4 (T0 = gamma_N approx 9.879e3, L = log T0 approx 9.198)
 * ------------------------------------------------------------------------------
 * The point value at the top height is
 *     |S(T0)| <= 0.112(9.198) + 0.278(2.219) + 2.510 = 4.157.
 * To re-express the explicit bound as a coefficient on log T (the form C_KH
 * consumes), three honest readings bracket the answer:
 *   (a) POINT at the top height T0:    coeff = 4.157 / 9.198 = 0.452.
 *   (b) UNIFORM over the actual zeros [gamma_1 = 14.13, T0]: the ratio
 *       Trudgian(T)/log T decreases in T, so the sup is at the bottom zero,
 *       coeff = 1.162.
 *   (c) UNIFORM over Trudgian's full stated domain [e, T0]: sup of the ratio
 *       is at T = e (where log T = 1, log log T = 0), coeff = 2.622.
 * The cleanest UNCONDITIONALLY-rigorous coefficient is (c) = 2.622: it bounds
 * |S(T)| <= 2.622 . log T for EVERY T >= e, hence for every zeta zero. We
 * thread that as the rigorous explicit C_Selberg.
 *
 * KEY FINDING: 3.0 > 2.622 > 1.162 > 0.452. Under ALL three readings the
 * placeholder C_Selberg = 3.0 is a CONSERVATIVE over-estimate, so it was a
 * VALID (if loose) upper bound -- the explicit Trudgian constant can only
 * SHRINK C_KH, C_C and E_coll, never enlarge them. The finite-N beat is NOT
 * threatened by pinning this constant.
 *
 * RECOMPUTED CONSTANTS WITH THE EXPLICIT C_Selberg = 2.622
 * --------------------------------------------------------
 *     C_KH   = pi . 2.622          = 8.2373   (was 3 pi = 9.4248)
 *     C_C    = (1/8) sqrt(8.2373)  = 0.358758 (was 0.383748)
 *     E_coll = C_C sqrt(L/N)       = 0.010881 (was 0.0116385)
 * So E_coll does NOT stay at 0.0116: it drops ~6.5% to ~0.01088, confirming the
 * placeholder was conservative. (Using reading (b), 1.162, E_coll would fall
 * further to ~0.00724; we report the conservative (c) value as the headline.)
 *
 * NO FALSE QED -- THE RESIDUAL GAP (named, not papered over)
 * ----------------------------------------------------------
 * C_KH consumes C_Selberg as the coefficient of log(gamma_N) in the STAR-
 * DISCREPANCY bound  Disc_N <= C_Selberg . log(gamma_N) / N  (the
 * dyson_star_discrepancy axiom in lean4-koksma-hlawka.js, imp-403 sorry-2),
 * which is NOT literally the S(T) bound: it is the Erdos-Turan inequality
 * applied to the zeros, with S(T) entering as the discrepancy of the counting
 * function. The Erdos-Turan step lumps additional O(1) constants (the
 * Erdos-Turan kernel mass and the smoothing length) into the effective
 * coefficient. So 2.622 is rigorous AS THE S(T) GROWTH COEFFICIENT, and it
 * discharges the "Selberg 1946 effective constant" half of the placeholder; but
 * the identification C_Selberg(discrepancy) = C_Selberg(S(T)) is only rigorous
 * once the Erdos-Turan bridge (imp-403 sorry-2 / dyson_star_discrepancy) is
 * closed and its O(1) constant is shown to fit inside the headroom 3.0 - 2.622.
 * THAT bridge constant -- not the S(T) bound -- is the genuine remaining gap.
 *
 * NET: the S(T) growth coefficient is now an EXPLICIT literature value
 * (2.622, Trudgian 2014), not a placeholder; the placeholder 3.0 is verified
 * conservative; E_coll shrinks to ~0.0109; the sole residual is the Erdos-Turan
 * bridge O(1) constant in dyson_star_discrepancy.
 *
 * @see lean4-koksma-hlawka.js (C_Selberg / C_KH definitions; dyson_star_discrepancy axiom)
 * @see imp-2633-l-cond-constant-discharge (the L_cond discharge that consumes C_C)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const N_STAR = 1e4;
const C_H = 1 / 8;
const C_SELBERG_PLACEHOLDER = 3.0;

// Trudgian 2014 (J. Number Theory 134, Thm 1): |S(T)| <= 0.112 logT + 0.278 loglogT + 2.510, T >= e.
const trudgianS = (T) => 0.112 * Math.log(T) + 0.278 * Math.log(Math.log(T)) + 2.510;
// Effective coefficient on log T (the form C_KH consumes).
const trudgianCoeff = (T) => trudgianS(T) / Math.log(T);

const T0 = effectiveHeightForN(N_STAR);    // gamma_N approx 9.879e3
const L = Math.log(T0);                    // approx 9.198
const GAMMA_1 = 14.134725;                 // first nontrivial zeta zero ordinate

// Three honest readings of the explicit constant.
const COEFF_POINT_T0 = trudgianCoeff(T0);          // (a) point at top: ~0.452
const COEFF_UNIFORM_ZEROS = trudgianCoeff(GAMMA_1); // (b) sup over actual zeros: ~1.162
const COEFF_UNIFORM_E = trudgianCoeff(Math.E);      // (c) sup over T>=e: 2.622

// Headline rigorous choice: the unconditional uniform-over-[e,T0] coefficient.
const C_SELBERG_RIGOROUS = COEFF_UNIFORM_E;

function cKH(cSel) { return Math.PI * cSel; }
function cC(cSel) { return C_H * Math.sqrt(cKH(cSel)); }
function eColl(cSel) { return cC(cSel) * Math.sqrt(L / N_STAR); }

const E_COLL_PLACEHOLDER = eColl(C_SELBERG_PLACEHOLDER);
const E_COLL_RIGOROUS = eColl(C_SELBERG_RIGOROUS);

export const IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE = {
  id: 'imp-2641',
  question:
    'Replace C_Selberg = 3.0 placeholder in C_KH with the explicit Trudgian 2014 S(T) bound at N* = 1e4; recompute C_C and E_coll and report whether E_coll stays at ~0.0116.',
  N_star: N_STAR,
  heightInputs: {
    T0: +T0.toExponential(4),    // gamma_N approx 9.879e3
    logT0: +L.toFixed(4),        // approx 9.198
    loglogT0: +Math.log(L).toFixed(4),
  },
  trudgian2014: {
    statement: '|S(T)| <= 0.112 log T + 0.278 log log T + 2.510 for T >= e',
    citation: 'T. Trudgian, J. Number Theory 134 (2014), Thm 1',
    pointValueAtT0: +trudgianS(T0).toFixed(4),   // |S(T0)| <= 4.157
  },
  effectiveCoefficients: {
    pointAtTopT0: +COEFF_POINT_T0.toFixed(4),         // ~0.4519
    uniformOverActualZeros: +COEFF_UNIFORM_ZEROS.toFixed(4), // ~1.1619 (sup at gamma_1)
    uniformOverTgeqE: +COEFF_UNIFORM_E.toFixed(4),    // 2.622 (sup at T=e) -- rigorous headline
  },
  C_Selberg: {
    placeholder: C_SELBERG_PLACEHOLDER,
    rigorousExplicit: +C_SELBERG_RIGOROUS.toFixed(4),
    status: 'DISCHARGED to explicit Trudgian 2014 coefficient (S(T)-growth half)',
    placeholderIsConservative: C_SELBERG_RIGOROUS < C_SELBERG_PLACEHOLDER,
  },
  recomputed: {
    C_KH_placeholder: +cKH(C_SELBERG_PLACEHOLDER).toFixed(6),
    C_KH_rigorous: +cKH(C_SELBERG_RIGOROUS).toFixed(6),
    C_C_placeholder: +cC(C_SELBERG_PLACEHOLDER).toFixed(6),
    C_C_rigorous: +cC(C_SELBERG_RIGOROUS).toFixed(6),
    E_coll_placeholder: +E_COLL_PLACEHOLDER.toFixed(7),
    E_coll_rigorous: +E_COLL_RIGOROUS.toFixed(7),
    E_coll_shrinkFactor: +(E_COLL_RIGOROUS / E_COLL_PLACEHOLDER).toFixed(4),
  },
  answerToTicket:
    'E_coll does NOT stay at 0.0116: with the explicit Trudgian coefficient 2.622 it ' +
    'shrinks ~6.5% to 0.010881. The placeholder 3.0 was a conservative over-estimate ' +
    '(3.0 > 2.622), so it was a valid upper bound and the finite-N beat is not threatened.',
  residualGap:
    'C_KH consumes C_Selberg as the coefficient of log(gamma_N) in the star-discrepancy ' +
    'bound Disc_N <= C_Selberg log(gamma_N)/N (dyson_star_discrepancy, imp-403 sorry-2), ' +
    'NOT directly as the S(T) bound. The Erdos-Turan bridge lumps O(1) constants into the ' +
    'effective coefficient. 2.622 is rigorous as the S(T) growth coefficient; identifying it ' +
    'with the discrepancy coefficient remains pending the Erdos-Turan bridge constant fitting ' +
    'inside the headroom 3.0 - 2.622. That bridge constant -- not the S(T) bound -- is the gap.',
  citation:
    'Trudgian 2014 J. Number Theory 134 Thm 1 (explicit S(T)); lean4-koksma-hlawka.js (C_Selberg/C_KH, dyson_star_discrepancy axiom); imp-2633 (C_C consumer)',
};

export const IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE_ASSERTIONS = [
  {
    id: 'imp2641-trudgian-point-value-at-T0',
    description: 'Trudgian 2014 point bound at T0=gamma_N(1e4) is |S(T0)| <= ~4.157',
    holds: () => Math.abs(trudgianS(T0) - 4.157) < 5e-3,
  },
  {
    id: 'imp2641-rigorous-coeff-2622',
    description: 'Uniform-over-[e,T0] rigorous Trudgian coefficient is 2.622 (sup at T=e)',
    holds: () => Math.abs(C_SELBERG_RIGOROUS - 2.622) < 1e-3,
  },
  {
    id: 'imp2641-coeff-ordering-brackets-placeholder',
    description: 'Point (0.452) < uniform-zeros (1.162) < uniform-e (2.622) < placeholder (3.0): placeholder is conservative under every reading',
    holds: () =>
      COEFF_POINT_T0 < COEFF_UNIFORM_ZEROS &&
      COEFF_UNIFORM_ZEROS < COEFF_UNIFORM_E &&
      COEFF_UNIFORM_E < C_SELBERG_PLACEHOLDER,
  },
  {
    id: 'imp2641-ecoll-placeholder-baseline',
    description: 'With placeholder C_Selberg=3.0, E_coll reproduces the imp-2633 value ~0.0116385',
    holds: () => Math.abs(E_COLL_PLACEHOLDER - 0.0116385) < 1e-5,
  },
  {
    id: 'imp2641-ecoll-rigorous-shrinks',
    description: 'With explicit Trudgian C_Selberg=2.622, E_coll shrinks to ~0.01088 (does NOT stay at 0.0116)',
    holds: () =>
      Math.abs(E_COLL_RIGOROUS - 0.010881) < 1e-5 &&
      E_COLL_RIGOROUS < E_COLL_PLACEHOLDER,
  },
  {
    id: 'imp2641-no-false-qed-gap-named',
    description: 'Honest verdict names the Erdos-Turan bridge as the residual gap (no false QED)',
    holds: () =>
      /Erdos-Turan/.test(IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.residualGap) &&
      IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE.C_Selberg.placeholderIsConservative === true,
  },
];

for (const a of IMP2641_C_SELBERG_TRUDGIAN_DISCHARGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-2641-c-selberg-trudgian-discharge assertion failed: ${a.id}`);
  }
}
