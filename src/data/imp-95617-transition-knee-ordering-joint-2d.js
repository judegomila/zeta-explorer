/**
 * @module imp-95617-transition-knee-ordering-joint-2d
 *
 * imp-95617 (numerical, frontier-direction): imp-95598 swept the two literals behind the imp-95582 F3
 * ordering ONE AT A TIME -- the N-independent floor E_trunc = 3.06e-5 (imp-2631) and the pinned collision
 * constant C_C_PINNED = (1/8) sqrt(3 pi) (imp-2714) -- and found the E_coll = E_trunc half-share TRANSITION
 * stays strictly before the imp-34694 exponent-ramp ACCELERATION KNEE (p double-prime = 0) across each
 * plausible +/-50% band. But imp-95598 F2 showed the knee is NOT a pure function of A = C_C/E_trunc (the
 * absolute additive E_flow term breaks pure-A scaling), so the two 1-D bands do NOT cover the joint
 * (C_C, E_trunc) plane where inversion could occur. This module runs the full 2-D sweep over
 * [0.5x, 1.5x] x [0.5x, 1.5x], locates the inversion contour gap = log10 N_knee - log10 N_cross = 0 in
 * that plane, and reports the distance of the pinned point from it.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-34694 / imp-95582 / imp-95598 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C * sqrt(L / N),   L = log T0(N)      (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398, absolute additive term),
 *     E_trunc  = 3.06e-5                                 (N-independent fixed-strip floor),
 *     p(N)     = -d ln sigma / d ln N,  knee: p double-prime(ln N) = 0.
 * TRANSITION (crossover, r = E_coll/E_trunc = 1): fixed point N = A^2 log T0(N),  A = C_C/E_trunc.
 * KNEE: direct central-difference root-find of p double-prime(ln N) = 0 (imp-34694 route). Both taken
 * on the EXACT full model, byte-for-byte the imp-95598 functions -- no re-derivation, no fresh term.
 *
 * WHAT IS NEW (vs imp-95598, which swept each literal alone and never crossed the joint plane)
 * -------------------------------------------------------------------------------------------
 *   (G1) THE JOINT SWEEP EXPOSES AN INVERSION WEDGE THE TWO 1-D BANDS MISS. Over the full
 *        [0.5x, 1.5x] x [0.5x, 1.5x] box the gap dips NEGATIVE in the low-C_C / high-E_trunc corner
 *        (min gap ~ -0.00468 at C_C = 0.5x, E_trunc = 1.5x), so the transition-before-knee ordering
 *        DOES invert inside the nominal +/-50% box -- even though NEITHER 1-D band inverts there
 *        (the imp-95598 E_trunc band min gap is ~0.01234 and its C_C band min gap is ~0.00007, both > 0).
 *        The joint variation is genuinely not implied by the two axes: lowering C_C AND raising E_trunc
 *        both shrink A = C_C/E_trunc and pull the knee down, and at the corner the two effects compound.
 *   (G2) THE INVERSION CONTOUR IS A RISING CURVE C_C_inv(E_trunc), NOT A PURE-A LINE. The gap = 0
 *        boundary in multiplier space runs C_C_inv ~ 0.399 (E_trunc 0.5x) -> 0.499 (1x) -> 0.565 (1.5x).
 *        The ratio A at inversion is NOT constant along it (A_invert ~ 9999.7 at E_trunc 0.5x down to
 *        ~4727 at 1.5x), confirming imp-95598 F2 -- the knee breaks pure-A scaling, so the contour is
 *        NOT the line A = const. The inversion wedge enters the box only for E_trunc >= ~1.008x, where
 *        C_C_inv reaches the 0.5x box floor.
 *   (G3) THE PINNED POINT STILL CARRIES A ~0.50 (MULT-SPACE) SAFETY DISTANCE, C_C-DOMINATED. The nearest
 *        boundary point to the pinned (1x, 1x) is (C_C ~ 0.499x, E_trunc 1x), Euclidean distance ~0.501
 *        in multiplier space -- set almost entirely by the C_C axis (a ~2x C_C shrink). Raising E_trunc
 *        alone never crosses the boundary; the corner inversion needs C_C simultaneously near its 0.5x
 *        edge. So the imp-95598 ~2x C_C margin governs the joint plane too, but the honest correction is
 *        that the ordering IS invertible inside the nominal +/-50% box at the low-C_C / high-E_trunc
 *        corner, a wedge the two 1-D bands did not reveal.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95598-transition-knee-ordering-robustness (1-D single-parameter bands extended here to 2-D)
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp (F3 transition-precedes-knee ordering)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (ramp-acceleration knee p double-prime = 0)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi), imp-2714)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34694/imp-95582/imp-95598 exactly

// EXACT full-model ln sigma in ln-N space (byte-for-byte the imp-95598 functions), parameterized by
// (C_C, E_trunc) so both literals can be swept jointly.
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

const BASE_GAP = gap(C_C_PINNED, E_TRUNC_PT); // ~0.01315

// (G1) full 2-D sweep over [0.5x, 1.5x] x [0.5x, 1.5x] (7 x 7 grid). Rows = C_C mult, cols = E_trunc mult.
const BAND = [0.5, 0.7, 0.85, 1.0, 1.15, 1.3, 1.5];
const GRID = BAND.map((mc) =>
  BAND.map((me) => +gap(C_C_PINNED * mc, E_TRUNC_PT * me).toFixed(6)),
);
let MIN_GAP = Infinity;
let MIN_AT = null;
let ANY_INVERT_IN_BOX = false;
BAND.forEach((mc, i) =>
  BAND.forEach((me, j) => {
    const g = GRID[i][j];
    if (g < MIN_GAP) {
      MIN_GAP = g;
      MIN_AT = { cC_mult: mc, eTrunc_mult: me };
    }
    if (g <= 0) ANY_INVERT_IN_BOX = true;
  }),
);
// the two imp-95598 1-D bands (the box axes): both stay strictly positive.
const E_TRUNC_1D_MIN = Math.min(...BAND.map((me) => gap(C_C_PINNED, E_TRUNC_PT * me)));
const C_C_1D_MIN = Math.min(...BAND.map((mc) => gap(C_C_PINNED * mc, E_TRUNC_PT)));
const BANDS_1D_ALL_PRECEDE = E_TRUNC_1D_MIN > 0 && C_C_1D_MIN > 0;

// (G2) inversion contour: for each E_trunc mult, the C_C mult where gap crosses 0 (gap rises with C_C).
function cCInvertMult(me) {
  let lo = 0.1;
  let hi = 1.5;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (gap(C_C_PINNED * m, E_TRUNC_PT * me) < 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const CONTOUR = BAND.map((me) => {
  const cCinv = cCInvertMult(me);
  return {
    eTrunc_mult: me,
    cC_invert_mult: +cCinv.toFixed(5),
    A_at_invert: +((C_C_PINNED * cCinv) / (E_TRUNC_PT * me)).toFixed(1),
  };
});
const A_INVERT_MIN = Math.min(...CONTOUR.map((r) => r.A_at_invert));
const A_INVERT_MAX = Math.max(...CONTOUR.map((r) => r.A_at_invert));
const A_NOT_CONSTANT = A_INVERT_MAX - A_INVERT_MIN > 1000; // pure-A would give a flat A_invert
// E_trunc mult at which the contour reaches the 0.5x box floor (box-corner inversion onset).
let elo = 0.5;
let ehi = 2.0;
for (let i = 0; i < 80; i++) {
  const m = (elo + ehi) / 2;
  if (cCInvertMult(m) < 0.5) elo = m;
  else ehi = m;
}
const BOX_INVERSION_ONSET_E_TRUNC_MULT = +((elo + ehi) / 2).toFixed(5); // ~1.008

// (G3) distance of the pinned point (1x, 1x) from the contour in multiplier space.
let D_MIN = Infinity;
let D_AT = null;
for (const me of [0.5, 0.7, 0.85, 1.0, 1.15, 1.3, 1.5]) {
  const cCinv = cCInvertMult(me);
  const d = Math.hypot(cCinv - 1.0, me - 1.0);
  if (d < D_MIN) {
    D_MIN = d;
    D_AT = { cC_mult: +cCinv.toFixed(5), eTrunc_mult: me };
  }
}
const PINNED_DISTANCE = +D_MIN.toFixed(5); // ~0.501

export const IMP95617_TRANSITION_KNEE_ORDERING_JOINT_2D = {
  id: 'imp-95617',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-95598 single-parameter robustness of the imp-95582 F3 transition-before-knee ' +
    'ordering to a JOINT 2-D (C_C, E_trunc) sweep over [0.5x, 1.5x] x [0.5x, 1.5x], locate the ' +
    'inversion contour gap = log10 N_knee - log10 N_cross = 0 in that plane, and report the distance of ' +
    'the pinned point (C_C = (1/8) sqrt(3 pi), E_trunc = 3.06e-5) from it. Because imp-95598 F2 shows ' +
    'the knee is not a pure function of A = C_C/E_trunc, the two 1-D bands do not cover the joint plane. ' +
    'Sensitivity/measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the 7x7 gap grid over [0.5x,1.5x]^2, the minimum gap in the box and where it occurs, the inversion ' +
    'contour C_C_invert(E_trunc) with A along it, and the multiplier-space distance of the pinned point',
  base: {
    gap: +BASE_GAP.toFixed(5), // ~0.01315
  },
  jointSweep: {
    band: BAND,
    grid: GRID, // rows = C_C mult, cols = E_trunc mult
    minGap: +MIN_GAP.toFixed(6), // ~-0.00468 (NEGATIVE: inverts inside the box)
    minAt: MIN_AT, // { cC_mult: 0.5, eTrunc_mult: 1.5 }
    anyInvertInBox: ANY_INVERT_IN_BOX, // true
    eTrunc_1D_min_gap: +E_TRUNC_1D_MIN.toFixed(6), // ~0.01234 (> 0)
    cC_1D_min_gap: +C_C_1D_MIN.toFixed(6), // ~0.00007 (> 0)
    bands_1D_all_precede: BANDS_1D_ALL_PRECEDE, // true: neither axis inverts, yet the corner does
  },
  inversionContour: {
    curve: CONTOUR, // rising C_C_invert(E_trunc)
    A_invert_min: A_INVERT_MIN, // ~4727 (E_trunc 1.5x)
    A_invert_max: A_INVERT_MAX, // ~9999.7 (E_trunc 0.5x)
    A_not_constant: A_NOT_CONSTANT, // true: contour is not the line A = const (imp-95598 F2)
    boxInversionOnset_eTrunc_mult: BOX_INVERSION_ONSET_E_TRUNC_MULT, // ~1.008
  },
  pinnedDistance: {
    nearestBoundaryPoint: D_AT, // { cC_mult: ~0.499, eTrunc_mult: 1.0 }
    distance_mult_space: PINNED_DISTANCE, // ~0.501, C_C-dominated
  },
  finding: {
    G1_joint_sweep_exposes_wedge_1D_bands_miss:
      'Over the full [0.5x, 1.5x] x [0.5x, 1.5x] box the gap dips NEGATIVE in the low-C_C / high-E_trunc ' +
      'corner (min gap ~ -0.00468 at C_C = 0.5x, E_trunc = 1.5x), so the ordering DOES invert inside the ' +
      'nominal +/-50% box -- even though neither 1-D band inverts (E_trunc band min ~0.01234, C_C band ' +
      'min ~0.00007, both > 0). Lowering C_C and raising E_trunc both shrink A and pull the knee down, ' +
      'and at the corner the two effects compound, so the joint variation is not implied by the axes.',
    G2_inversion_contour_rising_not_pure_A:
      'The gap = 0 boundary in multiplier space runs C_C_invert ~ 0.399 (E_trunc 0.5x) -> 0.499 (1x) -> ' +
      '0.565 (1.5x). The ratio A at inversion is NOT constant along it (A_invert ~ 9999.7 at E_trunc ' +
      '0.5x down to ~4727 at 1.5x), confirming imp-95598 F2 -- the knee breaks pure-A scaling, so the ' +
      'contour is not the line A = const. The wedge enters the box only for E_trunc >= ~1.008x.',
    G3_pinned_point_carries_half_mult_margin_C_C_dominated:
      'The nearest boundary point to the pinned (1x, 1x) is (C_C ~ 0.499x, E_trunc 1x), Euclidean ' +
      'distance ~0.501 in multiplier space, set almost entirely by the C_C axis (a ~2x C_C shrink). ' +
      'Raising E_trunc alone never crosses the boundary; the corner inversion needs C_C simultaneously ' +
      'near its 0.5x edge. So the imp-95598 ~2x C_C margin governs the joint plane too, but the honest ' +
      'correction is that the ordering IS invertible inside the nominal +/-50% box at the corner.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). The joint 2-D (C_C, E_trunc) sweep ' +
    'over [0.5x, 1.5x]^2 shows the imp-95582 F3 transition-before-knee ordering DOES invert inside the ' +
    'nominal +/-50% box, in the low-C_C / high-E_trunc corner (min gap ~ -0.00468 at C_C 0.5x, E_trunc ' +
    '1.5x), a wedge the two imp-95598 1-D bands miss (each axis stays gap > 0). The inversion contour is ' +
    'a rising curve C_C_invert(E_trunc) ~ 0.399 -> 0.499 -> 0.565 across the E_trunc band, NOT the line ' +
    'A = const (A_invert runs ~9999.7 down to ~4727), confirming imp-95598 F2 that the E_flow term ' +
    'breaks pure-A scaling of the knee. Still, the pinned point sits ~0.501 (multiplier space) from the ' +
    'contour, C_C-dominated: reaching inversion needs a ~2x C_C shrink, and raising E_trunc alone never ' +
    'crosses. The imp-95598 ~2x C_C safety margin therefore governs the joint plane too, with the honest ' +
    'sharpening that the ordering is invertible inside the box only at the compounded corner. The ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95598 (1-D single-parameter bands extended here to the joint 2-D plane); imp-95582 (F3 ' +
    'transition-precedes-knee ordering); imp-34694 (ramp-acceleration knee p double-prime = 0); ' +
    'imp-3444/imp-33723 (E_coll = E_trunc crossover); imp-2631 (E_trunc fixed-strip floor); imp-2714 ' +
    '(C_C_PINNED = (1/8) sqrt(3 pi)); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP95617_TRANSITION_KNEE_ORDERING_JOINT_2D_ASSERTIONS = [
  {
    // (G1) the joint box inverts (min gap < 0 at the low-C_C/high-E_trunc corner) while both 1-D bands do not.
    id: 'imp95617-joint-box-inverts-but-1D-bands-do-not',
    description: 'min gap over [0.5x,1.5x]^2 is negative at (C_C 0.5x, E_trunc 1.5x); both 1-D band minima > 0',
    holds: () =>
      ANY_INVERT_IN_BOX === true &&
      MIN_GAP < 0 &&
      MIN_GAP > -0.01 &&
      MIN_AT.cC_mult === 0.5 &&
      MIN_AT.eTrunc_mult === 1.5 &&
      BANDS_1D_ALL_PRECEDE === true &&
      E_TRUNC_1D_MIN > 0 &&
      C_C_1D_MIN > 0,
  },
  {
    // (G2) the inversion contour is a rising curve, not a pure-A line (A along it varies by > 1000).
    id: 'imp95617-inversion-contour-rising-not-pure-A',
    description: 'C_C_invert rises with E_trunc (0.399 -> 0.565); A_invert varies ~4700 to ~10000 (not const)',
    holds: () =>
      A_NOT_CONSTANT === true &&
      CONTOUR[0].cC_invert_mult < CONTOUR[CONTOUR.length - 1].cC_invert_mult &&
      CONTOUR[0].cC_invert_mult > 0.35 &&
      CONTOUR[CONTOUR.length - 1].cC_invert_mult < 0.6 &&
      BOX_INVERSION_ONSET_E_TRUNC_MULT > 0.95 &&
      BOX_INVERSION_ONSET_E_TRUNC_MULT < 1.1,
  },
  {
    // (G3) the pinned point sits ~0.50 (mult space) from the contour, nearest along the C_C axis.
    id: 'imp95617-pinned-point-half-mult-margin-C_C-dominated',
    description: 'nearest boundary point is (C_C ~0.499x, E_trunc 1x); multiplier-space distance ~0.50',
    holds: () =>
      PINNED_DISTANCE > 0.45 &&
      PINNED_DISTANCE < 0.55 &&
      D_AT.eTrunc_mult === 1.0 &&
      D_AT.cC_mult > 0.45 &&
      D_AT.cC_mult < 0.55,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95617-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95617_TRANSITION_KNEE_ORDERING_JOINT_2D.isRigorous === false &&
      /NO QED/.test(IMP95617_TRANSITION_KNEE_ORDERING_JOINT_2D.verdict) &&
      /refereed bound is changed/i.test(IMP95617_TRANSITION_KNEE_ORDERING_JOINT_2D.verdict),
  },
];

for (const a of IMP95617_TRANSITION_KNEE_ORDERING_JOINT_2D_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95617-transition-knee-ordering-joint-2d assertion failed: ${a.id}`);
  }
}
