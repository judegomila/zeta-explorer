/**
 * @module imp-95639-eflow-zero-inversion-wedge
 *
 * imp-95639 (numerical, frontier-direction): imp-95598 F2 (cited by imp-95617) established that the
 * imp-34694 exponent-ramp ACCELERATION KNEE is NOT a pure function of A = C_C/E_trunc, because the
 * absolute additive E_flow = C_F (log T0 / T0) * Gronwall term (imp-398) breaks pure-A scaling -- which
 * is exactly what lets the imp-95617 G1 INVERSION WEDGE exist (the transition-before-knee ordering dips
 * to gap = log10 N_knee - log10 N_cross ~ -0.00468 in the low-C_C / high-E_trunc corner of the nominal
 * [0.5x, 1.5x] x [0.5x, 1.5x] box). imp-95598 F2 NAMED E_flow as the pure-A-scaling breaker but never
 * measured its ISOLATED contribution to the inversion. This module re-runs the exact imp-95617 joint
 * (C_C, E_trunc) sweep with E_flow set identically to zero, re-locates the gap = 0 inversion contour,
 * and quantifies the fraction of the inversion attributable to E_flow vs to the E_coll/E_trunc balance
 * alone.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-34694 / imp-95582 / imp-95598 / imp-95617)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C * sqrt(L / N),   L = log T0(N)      (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398, absolute additive term),
 *     E_trunc  = 3.06e-5                                 (N-independent fixed-strip floor),
 *     p(N)     = -d ln sigma / d ln N,  knee: p double-prime(ln N) = 0.
 * The ONLY manipulation here is the boolean includeFlow: with includeFlow=true the functions are
 * byte-for-byte the imp-95617 model (used as a self-check reproduction); with includeFlow=false the
 * E_flow term is dropped so sigma = E_coll / (E_trunc + E_coll), leaving the pure E_coll/E_trunc balance.
 * The crossover r = E_coll/E_trunc = 1 fixed point N = A^2 log T0(N), A = C_C/E_trunc, never involved
 * E_flow to begin with, so only the KNEE location changes when E_flow is zeroed.
 *
 * WHAT IS NEW (vs imp-95617, which measured the wedge WITH E_flow but never isolated its contribution)
 * ----------------------------------------------------------------------------------------------------
 *   (H1) ZEROING E_flow REMOVES THE INVERSION WEDGE ENTIRELY. With E_flow = 0 the minimum gap over the
 *        full [0.5x, 1.5x] x [0.5x, 1.5x] box rises from ~ -0.00468 (imp-95617, inverting) to ~ +0.01708
 *        and the box minimum MIGRATES to the OPPOSITE corner (C_C 1.5x, E_trunc 0.5x). anyInvertInBox
 *        flips true -> false: with the absolute additive term gone the pure E_coll/E_trunc balance NEVER
 *        inverts anywhere in the nominal +/-50% box.
 *   (H2) THE gap = 0 CONTOUR LEAVES THE SEARCH WINDOW. With E_flow the inversion contour is a rising
 *        curve C_C_invert(E_trunc) ~ 0.399 -> 0.499 -> 0.565 sitting well inside the box; with E_flow = 0
 *        the gap stays strictly positive down to the C_C = 0.1x bisection floor for EVERY E_trunc mult,
 *        so the contour is pushed below C_C = 0.1x -- out of the searched [0.1x, 1.5x] window. The
 *        pinned-point multiplier-space distance to the (floor-clamped) contour jumps from ~0.501 to
 *        >= 0.9, and the A-at-floor values (~836 to ~2508) are NOT real crossings, only the clamp.
 *   (H3) THE INVERSION IS ESSENTIALLY 100% E_flow-DRIVEN WITHIN THE BOX; E_flow ALSO WIDENS THE BASE GAP.
 *        Since the E_coll/E_trunc balance alone (E_flow = 0) leaves min gap ~ +0.01708 > 0 across the
 *        whole box, the entire imp-95617 wedge is attributable to the absolute additive E_flow term, not
 *        to the E_coll/E_trunc balance. Consistently, the pinned-point base gap rises from ~0.01315 (with
 *        E_flow) to ~0.02047 (E_flow = 0), a ~ +0.00732 dex widening: E_flow shrinks sigma (adds to the
 *        denominator), pulls the knee down toward the crossover, and thereby makes the ordering fragile.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is
 * the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint sweep WITH E_flow, reproduced here as a self-check)
 * @see imp-95598-transition-knee-ordering-robustness (F2 named E_flow as the pure-A-scaling breaker)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (ramp-acceleration knee p double-prime = 0)
 * @see imp-398 (E_flow = C_F (log T0 / T0) Gronwall absolute additive term)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi), imp-2714)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34694/imp-95582/imp-95598/imp-95617 exactly

// EXACT full-model ln sigma in ln-N space; includeFlow=true reproduces imp-95617 byte-for-byte,
// includeFlow=false drops the absolute additive E_flow term (the only manipulation of this module).
function lnSigma(x, C_C, E_trunc, includeFlow) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = includeFlow ? C_F * (L / T0) * GRONWALL : 0; // absolute additive term, zeroed when false
  const E_coll = C_C * Math.sqrt(L / N); // GUE-conditional (C_H)
  return Math.log(E_coll / (E_trunc + E_flow + E_coll));
}
function pLocal(x, h, C_C, E_trunc, f) {
  return -(lnSigma(x + h, C_C, E_trunc, f) - lnSigma(x - h, C_C, E_trunc, f)) / (2 * h);
}
function pSecond(x, h, C_C, E_trunc, f) {
  return (pLocal(x + h, h, C_C, E_trunc, f) - 2 * pLocal(x, h, C_C, E_trunc, f) + pLocal(x - h, h, C_C, E_trunc, f)) / (h * h);
}
function bisect(fn, a, b, iters = 200) {
  let fa = fn(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = fn(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}
// TRANSITION (crossover r = 1): E_coll = E_trunc => N = A^2 log T0(N), A = C_C/E_trunc; E_flow-free.
function crossoverLog10(C_C, E_trunc) {
  const A = C_C / E_trunc;
  let N = 3e9;
  for (let i = 0; i < 300; i++) N = A * A * Math.log(effectiveHeightForN(N));
  return Math.log10(N);
}
// KNEE: direct root-find of p double-prime(ln N) = 0 (imp-34694 route); E_flow toggled through f.
function kneeLog10(C_C, E_trunc, f) {
  const x = bisect((xx) => pSecond(xx, 1e-3, C_C, E_trunc, f), Math.log(1e5), Math.log(1e14));
  return x / Math.LN10;
}
const gap = (C_C, E_trunc, f) => kneeLog10(C_C, E_trunc, f) - crossoverLog10(C_C, E_trunc);

const BAND = [0.5, 0.7, 0.85, 1.0, 1.15, 1.3, 1.5];

// contour: for each E_trunc mult, the C_C mult where gap crosses 0 (gap rises with C_C); clamped floor 0.1.
function cCInvertMult(me, f) {
  let lo = 0.1;
  let hi = 1.5;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (gap(C_C_PINNED * m, E_TRUNC_PT * me, f) < 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

function runSweep(f) {
  const grid = BAND.map((mc) => BAND.map((me) => +gap(C_C_PINNED * mc, E_TRUNC_PT * me, f).toFixed(6)));
  let minGap = Infinity;
  let minAt = null;
  let anyInvert = false;
  BAND.forEach((mc, i) =>
    BAND.forEach((me, j) => {
      const g = grid[i][j];
      if (g < minGap) {
        minGap = g;
        minAt = { cC_mult: mc, eTrunc_mult: me };
      }
      if (g <= 0) anyInvert = true;
    }),
  );
  const contour = BAND.map((me) => {
    const c = cCInvertMult(me, f);
    return {
      eTrunc_mult: me,
      cC_invert_mult: +c.toFixed(5),
      A_at_invert: +((C_C_PINNED * c) / (E_TRUNC_PT * me)).toFixed(1),
    };
  });
  let dMin = Infinity;
  let dAt = null;
  for (const me of BAND) {
    const c = cCInvertMult(me, f);
    const d = Math.hypot(c - 1.0, me - 1.0);
    if (d < dMin) {
      dMin = d;
      dAt = { cC_mult: +c.toFixed(5), eTrunc_mult: me };
    }
  }
  return {
    baseGap: +gap(C_C_PINNED, E_TRUNC_PT, f).toFixed(6),
    grid,
    minGap: +minGap.toFixed(6),
    minAt,
    anyInvert,
    contour,
    contourClampedToFloor: contour.every((r) => r.cC_invert_mult <= 0.1001),
    pinnedDistance: +dMin.toFixed(5),
    nearestBoundaryPoint: dAt,
  };
}

const WITH_FLOW = runSweep(true); // reproduces imp-95617
const NO_FLOW = runSweep(false); // E_flow identically zero

const BASE_GAP_WIDENING = +(NO_FLOW.baseGap - WITH_FLOW.baseGap).toFixed(6); // ~ +0.00732
const MIN_GAP_SHIFT = +(NO_FLOW.minGap - WITH_FLOW.minGap).toFixed(6); // ~ +0.02176
const WEDGE_REMOVED = WITH_FLOW.anyInvert === true && NO_FLOW.anyInvert === false;

export const IMP95639_EFLOW_ZERO_INVERSION_WEDGE = {
  id: 'imp-95639',
  proofSection: 'S-frontier',
  question:
    'Re-run the imp-95617 joint [0.5x, 1.5x] x [0.5x, 1.5x] (C_C, E_trunc) sweep with the absolute ' +
    'additive E_flow = C_F (log T0 / T0) Gronwall term (imp-398) set identically to zero, re-locate the ' +
    'gap = log10 N_knee - log10 N_cross = 0 inversion contour, and quantify the fraction of the ' +
    'imp-95617 G1 inversion wedge attributable to E_flow vs to the E_coll/E_trunc balance alone. ' +
    'Sensitivity/measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the 7x7 gap grid, min gap and its corner, anyInvertInBox, the gap = 0 contour, and the pinned-point ' +
    'multiplier-space distance -- each computed both WITH E_flow (self-check reproduction of imp-95617) ' +
    'and with E_flow = 0, plus the base-gap widening and min-gap shift between them',
  withFlow: {
    baseGap: WITH_FLOW.baseGap, // ~0.01315 (matches imp-95617 base gap)
    minGap: WITH_FLOW.minGap, // ~ -0.004682
    minAt: WITH_FLOW.minAt, // { cC_mult: 0.5, eTrunc_mult: 1.5 }
    anyInvertInBox: WITH_FLOW.anyInvert, // true
    pinnedDistance: WITH_FLOW.pinnedDistance, // ~0.501
    reproducesImp95617: true,
  },
  eFlowZero: {
    baseGap: NO_FLOW.baseGap, // ~0.020465
    minGap: NO_FLOW.minGap, // ~ +0.017076
    minAt: NO_FLOW.minAt, // { cC_mult: 1.5, eTrunc_mult: 0.5 } -- OPPOSITE corner
    anyInvertInBox: NO_FLOW.anyInvert, // false
    contourClampedToFloor: NO_FLOW.contourClampedToFloor, // true: contour pushed below C_C = 0.1x
    pinnedDistance: NO_FLOW.pinnedDistance, // >= 0.9 (floor-clamped, not a real crossing)
  },
  deltas: {
    baseGapWidening: BASE_GAP_WIDENING, // ~ +0.00732 (E_flow shrinks the gap; zeroing widens it)
    minGapShift: MIN_GAP_SHIFT, // ~ +0.02176 (from inverting to strictly positive)
    wedgeRemoved: WEDGE_REMOVED, // true
  },
  finding: {
    H1_zeroing_eflow_removes_the_wedge:
      'With E_flow = 0 the minimum gap over the full [0.5x, 1.5x] x [0.5x, 1.5x] box rises from ~ -0.00468 ' +
      '(imp-95617, inverting) to ~ +0.01708, and the box minimum MIGRATES to the opposite corner ' +
      '(C_C 1.5x, E_trunc 0.5x). anyInvertInBox flips true -> false: the pure E_coll/E_trunc balance ' +
      'never inverts anywhere in the nominal +/-50% box.',
    H2_contour_leaves_the_search_window:
      'With E_flow the inversion contour is a rising curve C_C_invert(E_trunc) ~ 0.399 -> 0.499 -> 0.565 ' +
      'inside the box; with E_flow = 0 the gap stays strictly positive down to the C_C = 0.1x bisection ' +
      'floor for every E_trunc mult, so the contour is pushed below C_C = 0.1x, out of the searched ' +
      '[0.1x, 1.5x] window. The pinned-point multiplier-space distance jumps from ~0.501 to >= 0.9, and ' +
      'the A-at-floor values (~836 to ~2508) are the clamp, not real crossings.',
    H3_inversion_is_essentially_100pct_eflow_driven:
      'Since the E_coll/E_trunc balance alone (E_flow = 0) leaves min gap ~ +0.01708 > 0 across the whole ' +
      'box, the entire imp-95617 wedge is attributable to the absolute additive E_flow term, not to the ' +
      'E_coll/E_trunc balance. Consistently, the pinned-point base gap rises from ~0.01315 to ~0.02047, ' +
      'a ~ +0.00732 dex widening: E_flow shrinks sigma (adds to the denominator), pulls the knee toward ' +
      'the crossover, and thereby makes the transition-before-knee ordering fragile.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). Zeroing the absolute additive E_flow ' +
    'term (imp-398) REMOVES the imp-95617 G1 inversion wedge entirely: the box min gap goes from ' +
    '~ -0.00468 (inverting, low-C_C / high-E_trunc corner) to ~ +0.01708 (strictly positive, opposite ' +
    'corner), anyInvertInBox flips true -> false, and the gap = 0 contour is pushed out of the ' +
    '[0.1x, 1.5x] search window. The inversion is therefore essentially 100% attributable to E_flow ' +
    'within the nominal +/-50% box -- the pure E_coll/E_trunc balance never inverts. E_flow also widens ' +
    'the pinned base gap by ~ +0.00732 dex when removed, confirming it is the fragility source that ' +
    'imp-95598 F2 named. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95617 (joint 2-D sweep WITH E_flow, reproduced here as a self-check); imp-95598 (F2 named ' +
    'E_flow as the pure-A-scaling breaker); imp-34694 (ramp-acceleration knee p double-prime = 0); ' +
    'imp-398 (E_flow absolute additive term); imp-2631 (E_trunc fixed-strip floor); imp-2714 ' +
    '(C_C_PINNED = (1/8) sqrt(3 pi)); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP95639_EFLOW_ZERO_INVERSION_WEDGE_ASSERTIONS = [
  {
    // Self-check: with E_flow the sweep reproduces the imp-95617 wedge (min gap < 0 at the corner).
    id: 'imp95639-withflow-reproduces-imp95617-wedge',
    description: 'includeFlow=true reproduces imp-95617: min gap < 0 at (C_C 0.5x, E_trunc 1.5x), anyInvert true',
    holds: () =>
      WITH_FLOW.anyInvert === true &&
      WITH_FLOW.minGap < 0 &&
      WITH_FLOW.minGap > -0.01 &&
      WITH_FLOW.minAt.cC_mult === 0.5 &&
      WITH_FLOW.minAt.eTrunc_mult === 1.5 &&
      Math.abs(WITH_FLOW.baseGap - 0.01315) < 5e-4,
  },
  {
    // (H1) zeroing E_flow removes the wedge: min gap goes positive and the box minimum migrates corners.
    id: 'imp95639-eflow-zero-removes-wedge',
    description: 'E_flow = 0: min gap ~ +0.0171 > 0, minimum at opposite corner (C_C 1.5x, E_trunc 0.5x), anyInvert false',
    holds: () =>
      NO_FLOW.anyInvert === false &&
      NO_FLOW.minGap > 0.01 &&
      NO_FLOW.minAt.cC_mult === 1.5 &&
      NO_FLOW.minAt.eTrunc_mult === 0.5 &&
      WEDGE_REMOVED === true,
  },
  {
    // (H2) the gap = 0 contour leaves the search window (clamped to the 0.1x floor for every E_trunc mult).
    id: 'imp95639-eflow-zero-contour-leaves-window',
    description: 'E_flow = 0: contour clamped below C_C = 0.1x for all E_trunc; pinned distance jumps to >= 0.9',
    holds: () =>
      NO_FLOW.contourClampedToFloor === true &&
      NO_FLOW.pinnedDistance >= 0.85 &&
      WITH_FLOW.pinnedDistance > 0.45 &&
      WITH_FLOW.pinnedDistance < 0.55,
  },
  {
    // (H3) E_flow also widens the base gap when removed (fragility source), and min-gap shift is positive.
    id: 'imp95639-eflow-widens-base-gap',
    description: 'E_flow = 0 widens pinned base gap by ~ +0.0073 dex; min-gap shift ~ +0.0218 (inverting -> positive)',
    holds: () =>
      BASE_GAP_WIDENING > 0.006 &&
      BASE_GAP_WIDENING < 0.009 &&
      MIN_GAP_SHIFT > 0.018 &&
      MIN_GAP_SHIFT < 0.026,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95639-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95639_EFLOW_ZERO_INVERSION_WEDGE.isRigorous === false &&
      /NO QED/.test(IMP95639_EFLOW_ZERO_INVERSION_WEDGE.verdict) &&
      /refereed bound is changed/i.test(IMP95639_EFLOW_ZERO_INVERSION_WEDGE.verdict),
  },
];

for (const a of IMP95639_EFLOW_ZERO_INVERSION_WEDGE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95639-eflow-zero-inversion-wedge assertion failed: ${a.id}`);
  }
}
