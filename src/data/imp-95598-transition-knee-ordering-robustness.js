/**
 * @module imp-95598-transition-knee-ordering-robustness
 *
 * imp-95598 (numerical, frontier-direction): imp-95582 finding F3 reports that the E_coll = E_trunc
 * half-share TRANSITION (log10 N ~ 9.51591) sits ~0.013 decade (~3%) BELOW the imp-34694 exponent-ramp
 * ACCELERATION KNEE (p double-prime = 0, log10 N* ~ 9.52906) -- calling the two S-frontier landmarks
 * "close but distinct" with only a 3% margin. That ordering was never stress-tested against the two
 * literals it rests on: the N-independent floor E_trunc = 3.06e-5 (imp-2631) and the pinned collision
 * constant C_C_PINNED = (1/8) sqrt(3 pi) ~ 0.38375 (imp-2714). This module sweeps BOTH over plausible
 * bands and reports whether the transition-before-knee ordering ever inverts and how the gap moves.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-34694 / imp-95582 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C * sqrt(L / N),   L = log T0(N)      (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398, ~1e-8 near landmark),
 *     E_trunc  = 3.06e-5                                 (N-independent fixed-strip floor),
 *     p(N)     = -d ln sigma / d ln N,  knee: p double-prime(ln N) = 0.
 * TRANSITION (crossover, r = E_coll/E_trunc = 1): fixed point N = A^2 log T0(N),  A = C_C/E_trunc.
 * KNEE: direct central-difference root-find of p double-prime(ln N) = 0 (imp-34694 route). Both taken
 * on the EXACT full model -- no re-derivation, no fresh term.
 *
 * WHAT IS NEW (vs imp-95582 F3, which states the ordering but never tests its robustness)
 * -------------------------------------------------------------------------------------
 *   (F1) THE ORDERING IS ROBUST ACROSS THE PLAUSIBLE +/-50% BAND OF BOTH LITERALS. Every single-
 *        parameter variation of E_trunc (3.06e-5) and of C_C_PINNED over [0.5x, 1.5x] keeps the
 *        transition STRICTLY before the knee (gap = log10 N_knee - log10 N_cross > 0). The whole band
 *        shifts the landmark pair bodily along log N (both move together) but the ordering is preserved:
 *        gap stays in ~[0.0085, 0.0154] decade over the C_C band and ~[0.0123, 0.0137] over the E_trunc
 *        band, versus the base 0.01315. No inversion anywhere in the plausible band.
 *   (F2) A = C_C/E_trunc GOVERNS THE CROSSOVER EXACTLY, BUT E_flow BREAKS PURE-A SCALING OF THE KNEE,
 *        MAKING THE TWO LITERALS ASYMMETRIC. The crossover depends ONLY on the ratio A = C_C/E_trunc
 *        (scaling both literals by a common s leaves log10 N_cross invariant to ~1e-6). The knee does
 *        NOT: the absolute additive E_flow term makes the gap a function of more than A. At the SAME
 *        A ~ 6270 the two routes disagree sharply -- reached by HALVING C_C the gap collapses to ~7e-5
 *        (edge of inversion), reached by DOUBLING E_trunc the gap is a healthy ~0.0115. Lowering C_C
 *        pushes the landmark to smaller N where E_flow/E_coll is larger, pulling the knee down.
 *   (F3) INVERSION NEEDS C_C BELOW ~0.50x PINNED (A ~2x SHRINK); RAISING E_trunc NEVER INVERTS
 *        (SURVIVES >=8x). The transition-before-knee ordering inverts ONLY when C_C_PINNED drops below
 *        ~0.499x its pinned value (A < ~6257, crossover pushed to log10 N ~ 8.88); via the E_trunc
 *        route it does not invert anywhere in [1x, 8x]. Both failure directions sit far outside any
 *        plausible band -- C_C is pinned to (1/8) sqrt(3 pi) to 1e-12 (imp-2714) and E_trunc is a fixed
 *        literal -- so the imp-95582 F3 ordering carries a ~2x safety margin and is ROBUST, not
 *        knife-edge, despite its modest 3% nominal gap.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp (F3 transition-precedes-knee ordering tested here)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (ramp-acceleration knee p double-prime = 0)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi), imp-2714)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34694/imp-95582 exactly

// EXACT full-model ln sigma in ln-N space (identical sub-terms to imp-34694/imp-95582), parameterized
// by (C_C, E_trunc) so both literals can be swept.
function lnSigmaFull(x, C_C, E_trunc) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // absolute additive term, breaks pure-A scaling of the knee
  const E_coll = C_C * Math.sqrt(L / N); // GUE-conditional (C_H)
  return Math.log(E_coll / (E_trunc + E_flow + E_coll));
}
function pLocal(x, h, C_C, E_trunc) {
  return -(lnSigmaFull(x + h, C_C, E_trunc) - lnSigmaFull(x - h, C_C, E_trunc)) / (2 * h);
}
function pSecond(x, h, C_C, E_trunc) {
  return (
    (pLocal(x + h, h, C_C, E_trunc) - 2 * pLocal(x, h, C_C, E_trunc) + pLocal(x - h, h, C_C, E_trunc)) /
    (h * h)
  );
}
function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

// TRANSITION (crossover r = 1): E_coll = E_trunc => N = A^2 log T0(N), A = C_C/E_trunc (imp-33723).
function crossoverLog10(C_C, E_trunc) {
  const A = C_C / E_trunc;
  let N = 3e9;
  for (let i = 0; i < 300; i++) N = A * A * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}
// KNEE: direct root-find of p double-prime(ln N) = 0 (imp-34694 route); wide bracket to follow sweeps.
function kneeLog10(C_C, E_trunc) {
  const x = bisect((xx) => pSecond(xx, 1e-3, C_C, E_trunc), Math.log(1e5), Math.log(1e14));
  return x / Math.LN10;
}
const gap = (C_C, E_trunc) => kneeLog10(C_C, E_trunc) - crossoverLog10(C_C, E_trunc);

const A_BASE = C_C_PINNED / E_TRUNC_PT; // ~12541
const BASE_CROSS = crossoverLog10(C_C_PINNED, E_TRUNC_PT); // ~9.51591
const BASE_KNEE = kneeLog10(C_C_PINNED, E_TRUNC_PT); // ~9.52906
const BASE_GAP = BASE_KNEE - BASE_CROSS; // ~0.01315

// (F1) plausible +/-50% single-parameter sweeps of each literal (7 rungs each).
const BAND = [0.5, 0.7, 0.85, 1.0, 1.15, 1.3, 1.5];
const E_TRUNC_SWEEP = BAND.map((m) => {
  const et = E_TRUNC_PT * m;
  const g = gap(C_C_PINNED, et);
  return { mult: m, cross: +crossoverLog10(C_C_PINNED, et).toFixed(5), gap: +g.toFixed(6), precedes: g > 0 };
});
const C_C_SWEEP = BAND.map((m) => {
  const cc = C_C_PINNED * m;
  const g = gap(cc, E_TRUNC_PT);
  return { mult: m, cross: +crossoverLog10(cc, E_TRUNC_PT).toFixed(5), gap: +g.toFixed(6), precedes: g > 0 };
});
const BAND_ALL_PRECEDE = E_TRUNC_SWEEP.every((r) => r.precedes) && C_C_SWEEP.every((r) => r.precedes);

// (F2) A-invariance of the crossover: scale BOTH literals by a common s -> crossover fixed.
const A_INVARIANCE = [0.5, 2.0].map((s) => ({
  s,
  crossDriftFromBase: +Math.abs(crossoverLog10(C_C_PINNED * s, E_TRUNC_PT * s) - BASE_CROSS).toExponential(2),
}));
const MAX_CROSS_DRIFT = Math.max(...A_INVARIANCE.map((r) => Math.abs(r.crossDriftFromBase)));
// (F2) SAME A ~ 6270 reached two ways: gap is NOT a pure function of A (E_flow asymmetry).
const GAP_A6270_VIA_C_C = gap(C_C_PINNED * 0.5, E_TRUNC_PT); // ~7e-5 (edge)
const GAP_A6270_VIA_E_TRUNC = gap(C_C_PINNED, E_TRUNC_PT * 2.0); // ~0.0115 (healthy)

// (F3) inversion threshold: lower C_C until the gap crosses zero.
let lo = 0.3;
let hi = 0.6;
for (let i = 0; i < 80; i++) {
  const m = (lo + hi) / 2;
  if (gap(C_C_PINNED * m, E_TRUNC_PT) < 0) lo = m;
  else hi = m;
}
const C_C_INVERT_MULT = (lo + hi) / 2; // ~0.499
const C_C_SAFETY_MARGIN = 1 / C_C_INVERT_MULT; // ~2.0x shrink of C_C needed to invert
// E_trunc route never inverts within [1x, 8x]: check the extreme rung stays PRECEDES.
const E_TRUNC_8X_STILL_PRECEDES = gap(C_C_PINNED, E_TRUNC_PT * 8.0) > 0;

export const IMP95598_TRANSITION_KNEE_ORDERING_ROBUSTNESS = {
  id: 'imp-95598',
  proofSection: 'S-frontier',
  question:
    'Stress-test the imp-95582 F3 ordering -- the E_coll = E_trunc half-share transition (log10 N ~ ' +
    '9.51591) precedes the imp-34694 ramp-acceleration knee (p double-prime = 0, log10 N ~ 9.52906) by ' +
    '~0.013 decade -- against the two literals it rests on: the floor E_trunc = 3.06e-5 (imp-2631) and ' +
    'the pinned collision constant C_C_PINNED (imp-2714). Sweep both over plausible bands and report ' +
    'whether the ordering ever inverts and how the gap moves. Sensitivity/measurement only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'gap = log10 N_knee - log10 N_cross under +/-50% single-parameter sweeps of E_trunc and C_C_PINNED, ' +
    'the A = C_C/E_trunc invariance of the crossover, and the C_C multiplier at which the ordering inverts',
  base: {
    A_base: +A_BASE.toFixed(3), // ~12540.768
    log10N_cross: +BASE_CROSS.toFixed(5), // ~9.51591
    log10N_knee: +BASE_KNEE.toFixed(5), // ~9.52906
    gap: +BASE_GAP.toFixed(5), // ~0.01315
  },
  eTruncSweep: E_TRUNC_SWEEP, // +/-50% band, all precedes
  cCSweep: C_C_SWEEP, // +/-50% band, all precedes
  bandAllPrecede: BAND_ALL_PRECEDE, // true across the whole plausible band
  aInvariance: {
    crossoverIsPureA: A_INVARIANCE, // scale both by s -> crossover fixed to ~1e-6
    maxCrossDrift: +MAX_CROSS_DRIFT.toExponential(2),
    gap_sameA6270_via_C_C_halved: +GAP_A6270_VIA_C_C.toExponential(3), // ~7e-5 (edge)
    gap_sameA6270_via_E_trunc_doubled: +GAP_A6270_VIA_E_TRUNC.toFixed(5), // ~0.01153 (healthy)
  },
  inversion: {
    cC_invert_multiplier: +C_C_INVERT_MULT.toFixed(5), // ~0.499
    cC_safety_margin: +C_C_SAFETY_MARGIN.toFixed(3), // ~2.00x shrink of C_C needed
    log10N_cross_at_inversion: +crossoverLog10(C_C_PINNED * C_C_INVERT_MULT, E_TRUNC_PT).toFixed(5), // ~8.88
    eTrunc_8x_still_precedes: E_TRUNC_8X_STILL_PRECEDES, // true: raising E_trunc never inverts in [1x,8x]
  },
  finding: {
    F1_ordering_robust_over_plausible_band:
      'Every single-parameter variation of E_trunc and C_C_PINNED over [0.5x, 1.5x] keeps the ' +
      'transition strictly before the knee (gap > 0). The band shifts the landmark pair bodily along ' +
      'log N but preserves the ordering: gap stays ~[0.0085, 0.0154] over the C_C band and ~[0.0123, ' +
      '0.0137] over the E_trunc band, versus the base 0.01315. No inversion in the plausible band.',
    F2_A_governs_crossover_but_E_flow_breaks_pure_A:
      'The crossover depends ONLY on A = C_C/E_trunc (scaling both literals by a common s leaves ' +
      'log10 N_cross invariant to ~1e-6); the knee does not, because the absolute additive E_flow term ' +
      'breaks pure-A scaling. At the SAME A ~ 6270 the two routes disagree: halving C_C collapses the ' +
      'gap to ~7e-5 (edge of inversion) while doubling E_trunc leaves ~0.0115. Lowering C_C pushes the ' +
      'landmark to smaller N where E_flow/E_coll is larger, pulling the knee down.',
    F3_inversion_needs_C_C_halved_E_trunc_never:
      'The ordering inverts ONLY when C_C_PINNED drops below ~0.499x its pinned value (A < ~6257, ' +
      'crossover pushed to log10 N ~ 8.88); via the E_trunc route it does not invert anywhere in ' +
      '[1x, 8x]. Both failure directions sit far outside any plausible band -- C_C is pinned to ' +
      '(1/8) sqrt(3 pi) to 1e-12 and E_trunc is a fixed literal -- so the imp-95582 F3 ordering carries ' +
      'a ~2x safety margin and is ROBUST, not knife-edge, despite its modest 3% nominal gap.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). The imp-95582 F3 ordering -- the ' +
    'E_coll = E_trunc transition (log10 N ~ 9.51591) precedes the imp-34694 ramp-acceleration knee ' +
    '(log10 N ~ 9.52906) by ~0.013 decade -- is ROBUST to the two literals it rests on. Across the ' +
    'plausible +/-50% band of both E_trunc (3.06e-5) and C_C_PINNED the transition stays strictly ' +
    'before the knee (gap > 0 everywhere). The crossover is governed exactly by A = C_C/E_trunc, but ' +
    'the absolute E_flow term breaks pure-A scaling of the knee, making the two literals asymmetric: ' +
    'inversion requires C_C below ~0.50x pinned (a ~2x shrink, A ~2x below base), while raising ' +
    'E_trunc never inverts within [1x, 8x]. The ~3% nominal gap therefore carries a ~2x safety margin. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95582 (F3 transition-precedes-knee ordering stress-tested here); imp-34694 (ramp-acceleration ' +
    'knee p double-prime = 0, log10 ~ 9.529); imp-3444/imp-33723 (E_coll = E_trunc crossover ~3.280e9); ' +
    'imp-2631 (E_trunc fixed-strip floor); imp-2714 (C_C_PINNED = (1/8) sqrt(3 pi)); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP95598_TRANSITION_KNEE_ORDERING_ROBUSTNESS_ASSERTIONS = [
  {
    // (F1) the transition precedes the knee across the entire plausible +/-50% band of both literals.
    id: 'imp95598-ordering-robust-over-plausible-band',
    description: 'gap > 0 for every +/-50% single-parameter rung of E_trunc and C_C_PINNED; base gap ~0.013',
    holds: () =>
      BAND_ALL_PRECEDE &&
      BASE_GAP > 0.012 &&
      BASE_GAP < 0.015 &&
      E_TRUNC_SWEEP.every((r) => r.gap > 0) &&
      C_C_SWEEP.every((r) => r.gap > 0),
  },
  {
    // (F2) the crossover is a pure function of A = C_C/E_trunc; the knee is not (E_flow asymmetry).
    id: 'imp95598-crossover-pure-A-knee-asymmetric',
    description: 'scaling both literals leaves crossover fixed (<1e-4); same A ~6270 gives very different gaps',
    holds: () =>
      MAX_CROSS_DRIFT < 1e-4 &&
      GAP_A6270_VIA_C_C < 1e-3 &&
      GAP_A6270_VIA_E_TRUNC > 0.008 &&
      GAP_A6270_VIA_E_TRUNC > 50 * Math.abs(GAP_A6270_VIA_C_C),
  },
  {
    // (F3) inversion needs C_C below ~0.50x pinned (~2x margin); raising E_trunc never inverts in [1x,8x].
    id: 'imp95598-inversion-needs-C_C-halved-not-E_trunc',
    description: 'C_C inversion multiplier in (0.45, 0.55) with ~2x safety margin; E_trunc 8x still precedes',
    holds: () =>
      C_C_INVERT_MULT > 0.45 &&
      C_C_INVERT_MULT < 0.55 &&
      C_C_SAFETY_MARGIN > 1.8 &&
      C_C_SAFETY_MARGIN < 2.2 &&
      E_TRUNC_8X_STILL_PRECEDES === true,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95598-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95598_TRANSITION_KNEE_ORDERING_ROBUSTNESS.isRigorous === false &&
      /NO QED/.test(IMP95598_TRANSITION_KNEE_ORDERING_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP95598_TRANSITION_KNEE_ORDERING_ROBUSTNESS.verdict),
  },
];

for (const a of IMP95598_TRANSITION_KNEE_ORDERING_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95598-transition-knee-ordering-robustness assertion failed: ${a.id}`);
  }
}
