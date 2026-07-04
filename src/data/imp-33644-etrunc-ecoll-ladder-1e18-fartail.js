/**
 * @module imp-33644-etrunc-ecoll-ladder-1e18-fartail
 *
 * imp-33644 (numerical, frontier-direction): imp-33620 extended the imp-33602 SEPARATED
 * E_trunc(N)/E_coll(N) component ladder from N=1e12 to N=1e15 and found the E_coll local
 * exponent d log E_coll / d log N approaches -1/2 MONOTONELY FROM ABOVE with NO overshoot
 * (still ~-0.4848 at 1e15, residual ~0.0152), located sigma < 0.01 at N ~ 4.62e13, but
 * STOPPED at 1e15 with the sigma < 0.001 threshold unlocated. This module EXTENDS the
 * identical inherited imp-3220/imp-3406 component model three more decades to N=1e18 and
 * MEASURES:
 *   (a) the N at which sigma first falls below 0.001, located by log10 bisection,
 *   (b) how much of the residual exponent gap to -1/2 (~0.0152 at 1e15) the slowly
 *       saturating log T0(N) factor STILL HOLDS OPEN in the far tail, and whether the
 *       exponent ever reaches -1/2 to within a fixed tolerance on the tested range,
 *   (c) the E_coll/E_trunc deep-tail ratio at N=1e18.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-33602 / imp-33620)
 * ----------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5                           (N-INDEPENDENT fixed strip, imp-2631)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0       = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 * NO re-derivation and NO fresh model: the same parts() as imp-33620, evaluated on the
 * extended decade grid {1e12 .. 1e18}. The head decades reproduce imp-33620 verbatim.
 *
 * THE EXTENDED LADDER (imp-33620 head 1e12..1e15 + the three new far-tail decades)
 * -------------------------------------------------------------------------------
 *   N       E_trunc     E_coll      E_flow      sigma        d log E_coll / d log N
 *   1e12    3.060e-5    1.969e-6    3.99e-10    0.0604404    -0.4810
 *   1e13    3.060e-5    6.481e-7    5.14e-11    0.0207414    -0.4825
 *   1e14    3.060e-5    2.128e-7    6.50e-12    0.0069056    -0.4837
 *   1e15    3.060e-5    6.968e-8    8.09e-13    0.0022720    -0.4848  (residual ~0.0152)
 *   1e16    3.060e-5    2.277e-8    9.92e-14    0.0007435    -0.4858  <- NEW (sigma<0.001)
 *   1e17    3.060e-5    7.425e-9    1.20e-14    0.0002426    -0.4866  <- NEW
 *   1e18    3.060e-5    2.417e-9    1.44e-15    0.0000790    -0.4874  <- NEW (residual ~0.0126)
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (a) sigma < 0.001 THRESHOLD AT N ~ 5.43e15. sigma crosses 0.001 between N=1e15
 *       (sigma ~ 0.002272) and N=1e16 (sigma ~ 0.000744); a bisection on log10 N locates
 *       the crossing at N ~ 5.432e15 (log10 N ~ 15.735). This sits ~2.07 decades past the
 *       imp-33620 sigma < 0.01 landmark (N ~ 4.624e13, reproduced here) -- the same ~2.1
 *       decade spacing that separates the earlier landmarks, consistent with the ~1/2
 *       sqrt-decay slope of sigma against log10 N deep in the E_trunc-dominated tail.
 *   (b) THE LOG T0 SATURATION STILL HOLDS ~83% OF THE RESIDUAL EXPONENT GAP OPEN AT 1e18.
 *       The local exponent continues its monotone descent -- -0.4848 (1e15) -> -0.4858 ->
 *       -0.4866 -> -0.4874 (1e18) -- and is STILL strictly above -1/2 (never crosses or
 *       overshoots). The residual to -1/2 shrinks only from ~0.0152 (1e15) to ~0.0126
 *       (1e18): the slow log T0(N) growth has closed just ~0.0026 (~17%) of the gap over
 *       three more decades and still HOLDS ~83% of it open. The exponent does NOT reach
 *       -1/2 to within a 0.01 tolerance anywhere on the tested range {1e12..1e18} -- the
 *       verdict remains MONOTONE-FROM-ABOVE-STILL-SATURATING, not convergence-within-tol.
 *   (c) E_coll/E_trunc DEEP IN THE TAIL. The ratio falls by ~1/sqrt(10) (~0.316) per decade:
 *       0.002277 (1e15) -> 0.000744 -> 0.000243 -> 0.0000790 (1e18). By N=1e18 the vanishing
 *       collapse term sits at ~0.0079% of the flat E_trunc floor -- nearly four orders of
 *       magnitude below E_trunc -- so the denominator is overwhelmingly the fixed floor and
 *       sigma ~ E_coll/E_trunc to ~0.008% deep in the far tail.
 *
 * The punchline: extending the imp-33620 separated ladder to 1e18 locates the sigma < 0.001
 * threshold at N ~ 5.43e15 (~2.07 decades past sigma < 0.01), shows the E_coll local
 * exponent still approaches -1/2 monotonely FROM ABOVE with the slow log T0 saturation
 * HOLDING ~83% of the ~0.0152 residual gap open even at 1e18 (residual still ~0.0126, never
 * within a 0.01 tolerance), and drives the collapse term to ~0.008% of the flat E_trunc
 * floor -- nearly four orders of magnitude below it.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the E_trunc route is GUE-conditional-free but the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (ladder 1e6..1e15; head reproduced here)
 * @see imp-33602-etrunc-ecoll-component-ladder (separated ladder 1e6..1e12)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma<0.1 at N~3.21e11)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX; component model source)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33620)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33602/imp-33620 exactly

// EXACT imp-3406/imp-33620 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_trunc = E_TRUNC_PT; // N-independent fixed strip
  const E_N = E_trunc + E_flow + E_coll;
  return { T0, L, E_trunc, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The imp-33620 post-peak ladder EXTENDED three decades: the head {1e12..1e15} reproduces
// imp-33620 verbatim, the tail {1e16, 1e17, 1e18} is the new far-tail measurement window.
const DECADE_EXPONENTS = [12, 13, 14, 15, 16, 17, 18];
const LADDER = DECADE_EXPONENTS.map((e, i) => {
  const N = Math.pow(10, e);
  const p = parts(N);
  let ecollLocalExponent = null;
  if (i > 0) {
    const Nprev = Math.pow(10, DECADE_EXPONENTS[i - 1]);
    const Pprev = parts(Nprev);
    ecollLocalExponent = Math.log(p.E_coll / Pprev.E_coll) / Math.log(N / Nprev);
  }
  return {
    N: +N.toExponential(0),
    T0: +p.T0.toExponential(4),
    E_trunc: +p.E_trunc.toExponential(4),
    E_coll: +p.E_coll.toExponential(4),
    E_flow: +p.E_flow.toExponential(4),
    sigma: +p.sigma.toFixed(7),
    ecoll_local_exponent: ecollLocalExponent === null ? null : +ecollLocalExponent.toFixed(4),
    ecoll_over_etrunc: +(p.E_coll / E_TRUNC_PT).toFixed(6),
    residual_to_minus_half:
      ecollLocalExponent === null ? null : +(ecollLocalExponent + 0.5).toFixed(4),
    isNewTailDecade: e >= 16,
  };
});

// (b) The residual exponent gap to -1/2: how much of it the log T0 saturation still holds.
const EXPONENTS = LADDER.slice(1).map((r) => r.ecoll_local_exponent);
const EXP_AT_1E15 = LADDER.find((r) => r.N === 1e15).ecoll_local_exponent; // -0.4848
const EXP_AT_1E18 = LADDER.find((r) => r.N === 1e18).ecoll_local_exponent; // -0.4874
const EXP_MONOTONE_DOWN = EXPONENTS.every((x, k) => k === 0 || x <= EXPONENTS[k - 1]);
const EXP_STILL_ABOVE_HALF = EXPONENTS.every((x) => x > -0.5); // never crosses / overshoots
const RESIDUAL_1E15 = +(EXP_AT_1E15 + 0.5).toFixed(4); // ~0.0152
const RESIDUAL_1E18 = +(EXP_AT_1E18 + 0.5).toFixed(4); // ~0.0126 (still positive)
// Fraction of the 1e15 residual gap that the log T0 saturation STILL HOLDS open at 1e18.
const GAP_FRACTION_HELD = +(RESIDUAL_1E18 / RESIDUAL_1E15).toFixed(3); // ~0.829 (~83%)
const GAP_FRACTION_CLOSED = +(1 - GAP_FRACTION_HELD).toFixed(3); // ~0.171 (~17%)
// Does the exponent reach -1/2 to within a fixed 0.01 tolerance anywhere on the range?
const REACHES_HALF_WITHIN_001 = EXPONENTS.some((x) => Math.abs(x + 0.5) < 0.01); // false

// (c) The deep-tail E_coll/E_trunc ratio.
const RATIO_AT_1E15 = LADDER.find((r) => r.N === 1e15).ecoll_over_etrunc; // 0.002277
const RATIO_AT_1E18 = LADDER.find((r) => r.N === 1e18).ecoll_over_etrunc; // 0.000079

// (a) Locate the sigma < 0.001 threshold N by bisection on log10 N (sigma decreasing in N).
function sigmaAt(N) {
  return parts(N).sigma;
}
function thresholdLog10(target, loExp, hiExp) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (sigmaAt(Math.pow(10, mid)) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const SIGMA_0001_LOG10 = thresholdLog10(0.001, 15, 18); // ~15.735
const SIGMA_0001_N = +Math.pow(10, SIGMA_0001_LOG10).toExponential(3); // ~5.432e15
const SIGMA_001_LOG10 = thresholdLog10(0.01, 12, 15); // ~13.665
const SIGMA_001_N = +Math.pow(10, SIGMA_001_LOG10).toExponential(3); // ~4.624e13 (imp-33620)
const THRESHOLD_GAP_DECADES = +(SIGMA_0001_LOG10 - SIGMA_001_LOG10).toFixed(3); // ~2.07

export const IMP33644_ETRUNC_ECOLL_LADDER_1E18_FARTAIL = {
  id: 'imp-33644',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33620 separated E_trunc(N)/E_coll(N) ladder past N=1e15 to N=1e18 under the ' +
    'identical inherited imp-3220/imp-3406 component model, and measure (a) the N at which sigma ' +
    'first falls below 0.001, (b) how much of the residual exponent gap to -1/2 (~0.0152 at 1e15) ' +
    'the saturating log T0 factor still holds in the far tail, (c) the E_coll/E_trunc deep-tail ' +
    'ratio at 1e18. Measurement only; conditional-share diagnostic, NOT an RH bound; no QED.',
  componentModel:
    'sigma(N) = E_coll/(E_trunc + E_flow + E_coll); E_trunc = 3.06e-5 (fixed strip, imp-2631); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); E_flow = C_F (log T0 / T0) Gronwall. ' +
    'Identical parts() to imp-33620 on the extended decade grid {1e12 .. 1e18}.',
  ladder: LADDER,
  findings: {
    A_sigma_below_0001_threshold: {
      claim:
        'sigma first falls below 0.001 at N ~ 5.43e15, ~2.07 decades past the imp-33620 sigma<0.01 ' +
        'landmark (N ~ 4.62e13), matching the ~2.1-decade landmark spacing',
      sigma_lt_0001_N: SIGMA_0001_N, // ~5.432e15
      sigma_lt_0001_log10_N: +SIGMA_0001_LOG10.toFixed(4), // ~15.735
      sigma_lt_001_N_reproduced: SIGMA_001_N, // ~4.624e13 (imp-33620 landmark)
      gap_decades: THRESHOLD_GAP_DECADES, // ~2.07
    },
    B_log_t0_saturation_holds_residual_gap: {
      claim:
        'The log T0 saturation still HOLDS ~83% of the ~0.0152 residual exponent gap to -1/2 open ' +
        'at 1e18 (residual still ~0.0126); the exponent stays monotone-from-above, never within a ' +
        '0.01 tolerance of -1/2 on {1e12..1e18}',
      verdict: 'monotone-from-above-still-saturating',
      residual_at_1e15: RESIDUAL_1E15, // ~0.0152
      residual_at_1e18: RESIDUAL_1E18, // ~0.0126
      gap_fraction_held_at_1e18: GAP_FRACTION_HELD, // ~0.829
      gap_fraction_closed_over_three_decades: GAP_FRACTION_CLOSED, // ~0.171
      monotone_decreasing: EXP_MONOTONE_DOWN,
      never_crosses_minus_half: EXP_STILL_ABOVE_HALF,
      reaches_minus_half_within_001_tol: REACHES_HALF_WITHIN_001, // false
    },
    C_deep_tail_ecoll_over_etrunc: {
      claim:
        'E_coll/E_trunc falls by ~1/sqrt(10) per decade; by N=1e18 the collapse term sits at ' +
        '~0.0079% of the flat E_trunc floor (nearly four orders of magnitude below it)',
      ratio_at_1e15: RATIO_AT_1E15, // 0.002277
      ratio_at_1e18: RATIO_AT_1E18, // 0.000079
      per_decade_factor_target: +(1 / Math.sqrt(10)).toFixed(4), // 0.3162
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33620 separated component ' +
    'ladder three decades to N=1e18 under the identical inherited model resolves the three ' +
    'imp-33644 questions: (a) sigma first drops below 0.001 at N ~ 5.43e15 (log10 N ~ 15.735), ' +
    '~2.07 decades past the imp-33620 sigma<0.01 point N ~ 4.62e13 (reproduced here), matching the ' +
    '~2.1-decade landmark spacing; (b) the E_coll local exponent d log E_coll / d log N stays ' +
    'MONOTONE-FROM-ABOVE -- -0.4848 (1e15) -> -0.4858 -> -0.4866 -> -0.4874 (1e18), still strictly ' +
    'above -1/2 -- and the slow log T0(N) saturation still HOLDS ~83% of the ~0.0152 residual gap ' +
    'open at 1e18 (residual only shrinks to ~0.0126, closing just ~17% over three decades and ' +
    'never reaching -1/2 to within a 0.01 tolerance on the tested range); (c) the E_coll/E_trunc ' +
    'ratio falls by ~1/sqrt(10) per decade to ~0.0000790 at N=1e18 -- the collapse term is ' +
    '~0.0079% of the flat E_trunc floor (nearly four orders of magnitude below), so sigma ~ ' +
    'E_coll/E_trunc to ~0.008% deep in the far tail. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the E_trunc route is ' +
    'GUE-conditional-free but the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO ' +
    'QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33620 (separated E_trunc/E_coll ladder 1e6..1e15, extended here); imp-33602 (ladder ' +
    '1e6..1e12); imp-33582 (sigma<0.1 at N~3.21e11); imp-3406 (interior MAX, component model ' +
    'source); imp-2631 (E_trunc fixed-strip route); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33644_ETRUNC_ECOLL_LADDER_1E18_FARTAIL_ASSERTIONS = [
  {
    // Reuse gate: the extended-ladder head reproduces the imp-33620 rungs verbatim.
    id: 'imp33644-reproduces-imp33620-head',
    description: 'sigma(1e12) ~ 0.0604 and sigma(1e15) ~ 0.002272 match the imp-33620 ladder head',
    holds: () =>
      Math.abs(LADDER[0].sigma - 0.0604404) < 5e-4 &&
      Math.abs(LADDER.find((r) => r.N === 1e15).sigma - 0.0022720) < 5e-5,
  },
  {
    // (a): the sigma<0.001 threshold is bracketed by the new tail decades [1e15,1e16] and sits
    // ~2.07 decades past the reproduced imp-33620 sigma<0.01 landmark.
    id: 'imp33644-sigma-below-0001-threshold-located',
    description: 'sigma<0.001 at N~5.43e15, bracketed by [1e15,1e16], ~2.07 decades past sigma<0.01',
    holds: () => {
      const s15 = LADDER.find((r) => r.N === 1e15).sigma;
      const s16 = LADDER.find((r) => r.N === 1e16).sigma;
      return (
        s15 > 0.001 &&
        s16 < 0.001 &&
        SIGMA_0001_LOG10 > 15 &&
        SIGMA_0001_LOG10 < 16 &&
        Math.abs(SIGMA_001_N - 4.624e13) / 4.624e13 < 0.02 &&
        THRESHOLD_GAP_DECADES > 2.0
      );
    },
  },
  {
    // (b): the exponent stays monotone-from-above and the log T0 saturation holds the MAJORITY
    // (>~80%) of the 1e15 residual gap open at 1e18, never within a 0.01 tolerance of -1/2.
    id: 'imp33644-log-t0-saturation-holds-residual-gap',
    description: 'exponent monotone above -1/2; ~83% of the ~0.0152 residual gap held open at 1e18',
    holds: () =>
      EXP_MONOTONE_DOWN &&
      EXP_STILL_ABOVE_HALF &&
      EXP_AT_1E18 < EXP_AT_1E15 &&
      RESIDUAL_1E18 > 0.012 &&
      GAP_FRACTION_HELD > 0.8 &&
      REACHES_HALF_WITHIN_001 === false,
  },
  {
    // (c): the deep-tail collapse term is nearly four orders of magnitude below the flat floor and
    // the per-decade shrink still tracks 1/sqrt(10).
    id: 'imp33644-deep-tail-ecoll-far-below-etrunc',
    description: 'E_coll/E_trunc ~ 0.000079 at 1e18 (~0.008%), falling ~1/sqrt(10) per decade',
    holds: () =>
      RATIO_AT_1E18 < 1e-4 &&
      RATIO_AT_1E18 < RATIO_AT_1E15 &&
      Math.abs(RATIO_AT_1E18 / RATIO_AT_1E15 - Math.pow(1 / Math.sqrt(10), 3)) < 0.01,
  },
  {
    // Honesty gate: measurement only, no QED, PT stays SOTA.
    id: 'imp33644-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33644_ETRUNC_ECOLL_LADDER_1E18_FARTAIL.isRigorous === false &&
      /NO QED/.test(IMP33644_ETRUNC_ECOLL_LADDER_1E18_FARTAIL.verdict) &&
      /remains SOTA/.test(IMP33644_ETRUNC_ECOLL_LADDER_1E18_FARTAIL.verdict),
  },
];

for (const a of IMP33644_ETRUNC_ECOLL_LADDER_1E18_FARTAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33644-etrunc-ecoll-ladder-1e18-fartail assertion failed: ${a.id}`);
  }
}
