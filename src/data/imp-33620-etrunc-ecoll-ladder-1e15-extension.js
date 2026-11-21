/**
 * @module imp-33620-etrunc-ecoll-ladder-1e15-extension
 *
 * imp-33620 (numerical, frontier-direction): imp-33602 tabulates the SEPARATED
 * E_trunc(N) (flat 3.06e-5 fixed strip) and E_coll(N) (~sqrt(1/N) GUE-conditional)
 * across the post-peak decades N in {1e6 .. 1e12}, with the E_coll local exponent
 * d log E_coll / d log N ramping from ~-0.468 to ~-0.481 toward -1/2 from above, and
 * reports sigma < 0.1 at N ~ 3.21e11. It stops at 1e12: the local exponent is not yet
 * -1/2 and the sigma < 0.01 threshold is unlocated. This module EXTENDS the identical
 * inherited imp-3220/imp-3406 component model three more decades to N=1e15 and MEASURES:
 *   (M1) whether the E_coll local exponent keeps approaching -1/2 MONOTONELY from above
 *        or crosses/overshoots as the slow log T0(N) factor saturates,
 *   (M2) the E_coll/E_trunc ratio deep in the tail (how far below the flat floor the
 *        vanishing collapse term has fallen by N=1e15),
 *   (M3) the N at which sigma first falls below 0.01, beyond the imp-33582 sigma < 0.1
 *        point (~3.21e11).
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33602)
 * ---------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5                           (N-INDEPENDENT fixed strip, imp-2631)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)     (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0       = effectiveHeightForN(N)            (Riemann-von Mangoldt inverse)
 * NO re-derivation and NO fresh model: the same parts() as imp-33602, evaluated on the
 * extended decade grid {1e6 .. 1e15}. The head decades reproduce imp-33602 verbatim.
 *
 * THE EXTENDED LADDER (imp-33602 head 1e6..1e12 + the three new tail decades)
 * --------------------------------------------------------------------------
 *   N       E_trunc     E_coll      E_flow      sigma       d log E_coll / d log N
 *   1e6     3.060e-5    1.400e-3    4.40e-5     0.949408      --      (interior peak)
 *   1e7     3.060e-5    4.766e-4    7.17e-6     0.926562    -0.4679
 *   1e8     3.060e-5    1.609e-4    1.10e-6     0.835378    -0.4717
 *   1e9     3.060e-5    5.391e-5    1.60e-7     0.636702    -0.4748
 *   1e10    3.060e-5    1.797e-5    2.23e-8     0.369742    -0.4772  (E_coll < E_trunc)
 *   1e11    3.060e-5    5.959e-6    3.02e-9     0.162971    -0.4793
 *   1e12    3.060e-5    1.969e-6    3.99e-10    0.060440    -0.4810
 *   1e13    3.060e-5    6.481e-7    5.14e-11    0.020741    -0.4825  <- NEW
 *   1e14    3.060e-5    2.128e-7    6.50e-12    0.006906    -0.4837  <- NEW (sigma<0.01)
 *   1e15    3.060e-5    6.968e-8    8.09e-13    0.002272    -0.4848  <- NEW
 *
 * THE FINDINGS (measurement only)
 * -------------------------------
 *   (M1) THE LOCAL EXPONENT KEEPS APPROACHING -1/2 MONOTONELY FROM ABOVE, NO OVERSHOOT.
 *        d log E_coll / d log N continues its monotone descent in magnitude across the
 *        three new decades: -0.4810 (1e11->1e12), -0.4825, -0.4837, -0.4848 (1e14->1e15).
 *        It is still strictly ABOVE -1/2 at N=1e15 (never crosses or overshoots) and the
 *        residual to -1/2 has only shrunk from ~0.019 to ~0.0152 -- the slow log T0(N)
 *        growth is saturating but has NOT vanished, so E_coll approaches N^{-1/2} from
 *        above without ever reaching it on the tested range. There is no crossover: the
 *        answer to the ticket dichotomy is MONOTONE-FROM-ABOVE, not overshoot.
 *   (M2) E_coll/E_trunc DEEP IN THE TAIL. The ratio E_coll/E_trunc falls by ~1/sqrt(10)
 *        (~0.316) per decade: 0.0643 (1e12), 0.0212, 0.00695, 0.00228 (1e15). By N=1e15
 *        the vanishing collapse term sits at ~0.23% of the flat truncation floor -- more
 *        than two orders of magnitude below E_trunc -- so the denominator E_trunc+E_flow+
 *        E_coll is overwhelmingly the fixed floor and sigma ~ E_coll/E_trunc to ~0.2%.
 *   (M3) sigma < 0.01 THRESHOLD AT N ~ 4.62e13. sigma crosses 0.01 between N=1e13
 *        (sigma ~ 0.02074) and N=1e14 (sigma ~ 0.006906); a bisection on log10 N locates
 *        the crossing at N ~ 4.624e13 (log10 N ~ 13.665). This sits ~2.16 decades past the
 *        imp-33582 sigma < 0.1 landmark (N ~ 3.213e11, reproduced here) -- the same ~2.2
 *        decade spacing that separates the earlier landmarks, consistent with the ~1/2
 *        sqrt-decay slope of sigma against log10 N deep in the E_trunc-dominated tail.
 *
 * The punchline: extending the imp-33602 separated ladder to 1e15 shows the E_coll local
 * exponent approaches -1/2 monotonely FROM ABOVE with no overshoot (residual still ~0.015
 * at 1e15 as log T0 saturates), the collapse term falls to ~0.23% of the flat E_trunc
 * floor, and the sigma < 0.01 threshold sits at N ~ 4.62e13 -- ~2.16 decades beyond the
 * imp-33582 sigma < 0.1 point, matching the landmark spacing.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation,
 * NOT a rigorous asymptotic; the E_trunc route is GUE-conditional-free but the C_mb
 * GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34130-ecoll-local-exponent-residual-close-vs-floor (RESOLVES the close-vs-floor question this
 *      module leaves open: the ~0.0152 residual above KEEPS CLOSING as ~1/(2 log T0), does NOT floor)
 * @see imp-34187-ecoll-residual-milestone-ladder (tabulates the imp-34130 closing residual as a seven-rung
 *      N-milestone ladder, same shared 1/(2 log T0) law)
 * @see imp-33602-etrunc-ecoll-component-ladder (separated ladder 1e6..1e12; head reproduced here)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma<0.1 at N~3.21e11)
 * @see imp-33606-sigma-postpeak-threshold-model-sensitivity (ansatz sensitivity band of the landmarks)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX; component model source)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33602)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33602 exactly

// EXACT imp-3406/imp-33602 sub-terms (no re-derivation, no fresh model).
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

// The imp-33602 post-peak ladder EXTENDED three decades: the head {1e6..1e12} reproduces
// imp-33602 verbatim, the tail {1e13, 1e14, 1e15} is the new measurement window.
const DECADE_EXPONENTS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
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
    sigma: +p.sigma.toFixed(6),
    ecoll_local_exponent: ecollLocalExponent === null ? null : +ecollLocalExponent.toFixed(4),
    ecoll_over_etrunc: +(p.E_coll / E_TRUNC_PT).toFixed(5),
    isNewTailDecade: e >= 13,
  };
});

// (M1) The local exponent sequence: does it keep approaching -1/2 from above, or overshoot?
const EXPONENTS = LADDER.slice(1).map((r) => r.ecoll_local_exponent);
const EXP_AT_1E12 = LADDER.find((r) => r.N === 1e12).ecoll_local_exponent; // -0.4810
const EXP_AT_1E15 = LADDER.find((r) => r.N === 1e15).ecoll_local_exponent; // -0.4848
const EXP_MONOTONE_DOWN = EXPONENTS.every((x, k) => k === 0 || x <= EXPONENTS[k - 1]);
const EXP_STILL_ABOVE_HALF = EXPONENTS.every((x) => x > -0.5); // never crosses / overshoots
const EXP_RESIDUAL_TO_HALF_1E15 = +(EXP_AT_1E15 + 0.5).toFixed(4); // ~0.0152 (still positive)

// (M2) The deep-tail E_coll/E_trunc ratio: how far below the flat floor by 1e15.
const RATIO_AT_1E12 = LADDER.find((r) => r.N === 1e12).ecoll_over_etrunc; // 0.06433
const RATIO_AT_1E15 = LADDER.find((r) => r.N === 1e15).ecoll_over_etrunc; // 0.00228

// (M3) Locate the sigma < 0.01 threshold N by bisection on log10 N (sigma decreasing in N).
function sigmaAt(N) {
  return parts(N).sigma;
}
function thresholdLog10(target, loExp, hiExp) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 100; it++) {
    const mid = (lo + hi) / 2;
    if (sigmaAt(Math.pow(10, mid)) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const SIGMA_001_LOG10 = thresholdLog10(0.01, 12, 15); // ~13.665
const SIGMA_001_N = +Math.pow(10, SIGMA_001_LOG10).toExponential(3); // ~4.624e13
const SIGMA_01_LOG10 = thresholdLog10(0.1, 10, 13); // ~11.507
const SIGMA_01_N = +Math.pow(10, SIGMA_01_LOG10).toExponential(3); // ~3.213e11 (imp-33582)
const THRESHOLD_GAP_DECADES = +(SIGMA_001_LOG10 - SIGMA_01_LOG10).toFixed(3); // ~2.16

export const IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION = {
  id: 'imp-33620',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33602 separated E_trunc(N)/E_coll(N) post-peak ladder past N=1e12 to N=1e15 ' +
    'under the identical inherited imp-3220/imp-3406 component model, and measure (M1) whether the ' +
    'E_coll local exponent d log E_coll / d log N keeps approaching -1/2 monotonely from above or ' +
    'overshoots as the slow log T0 factor saturates, (M2) the E_coll/E_trunc ratio deep in the tail, ' +
    '(M3) the N at which sigma first falls below 0.01. Measurement only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  componentModel:
    'sigma(N) = E_coll/(E_trunc + E_flow + E_coll); E_trunc = 3.06e-5 (fixed strip, imp-2631); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H); E_flow = C_F (log T0 / T0) Gronwall. ' +
    'Identical parts() to imp-33602 on the extended decade grid {1e6 .. 1e15}.',
  ladder: LADDER,
  findings: {
    M1_local_exponent_monotone_from_above: {
      claim:
        'The E_coll local exponent keeps approaching -1/2 MONOTONELY from above with NO overshoot: ' +
        'it is still strictly above -1/2 at N=1e15 and never crosses as log T0 saturates',
      verdict: 'monotone-from-above',
      exponent_at_1e12: EXP_AT_1E12, // -0.4810
      exponent_at_1e15: EXP_AT_1E15, // -0.4848
      residual_to_minus_half_at_1e15: EXP_RESIDUAL_TO_HALF_1E15, // ~0.0152 (still positive)
      monotone_decreasing: EXP_MONOTONE_DOWN,
      never_crosses_minus_half: EXP_STILL_ABOVE_HALF,
    },
    M2_deep_tail_ecoll_over_etrunc: {
      claim:
        'E_coll/E_trunc falls by ~1/sqrt(10) per decade; by N=1e15 the collapse term sits at ' +
        '~0.23% of the flat E_trunc floor (>2 orders of magnitude below it)',
      ratio_at_1e12: RATIO_AT_1E12, // 0.06433
      ratio_at_1e15: RATIO_AT_1E15, // 0.00228
      per_decade_factor_target: +(1 / Math.sqrt(10)).toFixed(4), // 0.3162
    },
    M3_sigma_below_001_threshold: {
      claim:
        'sigma first falls below 0.01 at N ~ 4.62e13, ~2.16 decades past the imp-33582 sigma<0.1 ' +
        'landmark (N ~ 3.21e11), matching the ~2.2-decade landmark spacing',
      sigma_lt_001_N: SIGMA_001_N, // ~4.624e13
      sigma_lt_001_log10_N: +SIGMA_001_LOG10.toFixed(4), // ~13.665
      sigma_lt_01_N_reproduced: SIGMA_01_N, // ~3.213e11 (imp-33582 landmark)
      gap_decades: THRESHOLD_GAP_DECADES, // ~2.16
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33602 separated component ' +
    'ladder three decades to N=1e15 under the identical inherited model resolves the three ' +
    'imp-33620 questions: (M1) the E_coll local exponent d log E_coll / d log N keeps approaching ' +
    '-1/2 MONOTONELY FROM ABOVE -- -0.4810 (1e12) -> -0.4825 -> -0.4837 -> -0.4848 (1e15), still ' +
    'strictly above -1/2 with residual ~0.0152, NO crossover or overshoot, because the slow ' +
    'log T0(N) growth is saturating but has not vanished; (M2) the E_coll/E_trunc ratio falls by ' +
    '~1/sqrt(10) per decade to ~0.00228 at N=1e15 -- the collapse term is ~0.23% of the flat ' +
    'E_trunc floor, so sigma ~ E_coll/E_trunc to ~0.2% deep in the tail; (M3) sigma first drops ' +
    'below 0.01 at N ~ 4.62e13 (log10 N ~ 13.665), ~2.16 decades past the imp-33582 sigma<0.1 ' +
    'point N ~ 3.21e11 (reproduced here), matching the ~2.2-decade landmark spacing. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'E_trunc route is GUE-conditional-free but the C_mb GUE-conditional share per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33602 (separated E_trunc/E_coll ladder 1e6..1e12, extended here); imp-33582 (sigma<0.1 at ' +
    'N~3.21e11); imp-33606 (landmark ansatz-sensitivity band); imp-3444 (E_coll=E_trunc crossover ' +
    'N~3.280e9); imp-3406 (interior MAX, component model source); imp-2631 (E_trunc fixed-strip ' +
    'route); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION_ASSERTIONS = [
  {
    // Reuse gate: the extended-ladder head reproduces the imp-33602 rungs verbatim.
    id: 'imp33620-reproduces-imp33602-head',
    description: 'sigma(1e6) ~ 0.9494 and sigma(1e12) ~ 0.0604 match the imp-33602 ladder head',
    holds: () =>
      Math.abs(LADDER[0].sigma - 0.9494) < 5e-4 &&
      Math.abs(LADDER.find((r) => r.N === 1e12).sigma - 0.0604) < 5e-4,
  },
  {
    // (M1): the local exponent keeps descending in magnitude toward -1/2 from above, never
    // crossing -- monotone-from-above, not overshoot.
    id: 'imp33620-exponent-monotone-from-above-no-overshoot',
    description: 'E_coll local exponent monotone decreasing, still above -1/2 at 1e15 (no overshoot)',
    holds: () =>
      EXP_MONOTONE_DOWN &&
      EXP_STILL_ABOVE_HALF &&
      EXP_AT_1E15 < EXP_AT_1E12 &&
      EXP_RESIDUAL_TO_HALF_1E15 > 0,
  },
  {
    // (M2): the deep-tail collapse term is >2 orders of magnitude below the flat floor and the
    // per-decade shrink tracks 1/sqrt(10).
    id: 'imp33620-deep-tail-ecoll-far-below-etrunc',
    description: 'E_coll/E_trunc ~ 0.00228 at 1e15 (<1%), falling ~1/sqrt(10) per decade',
    holds: () =>
      RATIO_AT_1E15 < 0.01 &&
      RATIO_AT_1E15 < RATIO_AT_1E12 &&
      Math.abs(RATIO_AT_1E15 / RATIO_AT_1E12 - Math.pow(1 / Math.sqrt(10), 3)) < 0.01,
  },
  {
    // (M3): the sigma<0.01 threshold is bracketed by the two new tail decades and sits ~2.16
    // decades past the reproduced imp-33582 sigma<0.1 landmark.
    id: 'imp33620-sigma-below-001-threshold-located',
    description: 'sigma<0.01 at N~4.62e13, bracketed by [1e13,1e14], ~2.16 decades past sigma<0.1',
    holds: () => {
      const s13 = LADDER.find((r) => r.N === 1e13).sigma;
      const s14 = LADDER.find((r) => r.N === 1e14).sigma;
      return (
        s13 > 0.01 &&
        s14 < 0.01 &&
        SIGMA_001_LOG10 > 13 &&
        SIGMA_001_LOG10 < 14 &&
        Math.abs(SIGMA_01_N - 3.21e11) / 3.21e11 < 0.02 &&
        THRESHOLD_GAP_DECADES > 2.0
      );
    },
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp33620-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION.isRigorous === false &&
      /NO QED/.test(IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION.verdict),
  },
];

for (const a of IMP33620_ETRUNC_ECOLL_LADDER_1E15_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33620-etrunc-ecoll-ladder-1e15-extension assertion failed: ${a.id}`);
  }
}
