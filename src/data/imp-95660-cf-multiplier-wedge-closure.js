/**
 * @module imp-95660-cf-multiplier-wedge-closure
 *
 * imp-95660 (numerical, frontier-direction): imp-95639 isolated the absolute additive E_flow term
 * (imp-398) as the ~100% driver of the imp-95617 G1 inversion wedge, but did so with a BINARY toggle
 * (E_flow present vs E_flow identically zero) while holding the imp-398 prefactor
 * C_F = (log(T0/2pi)+1)/2pi fixed at its nominal value. Since E_flow = C_F (L/T0) Gronwall carries the
 * whole wedge, the natural sensitivity question is CONTINUOUS: how far can C_F move inside its own
 * provenance band before the wedge closes? This module sweeps a C_F MULTIPLIER cf across [0, 1.5]
 * (the imp-95617-style +/-50% band plus the toggle endpoint cf=0), re-runs the exact imp-95617 joint
 * (C_C, E_trunc) sweep at each cf, re-locates the box-min gap and the gap = 0 inversion contour, and
 * bisects the multiplier cf* at which anyInvertInBox flips true -> false.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-34694 / imp-95598 / imp-95617 / imp-95639)
 * ------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C * sqrt(L / N),   L = log T0(N)      (dominant, GUE-conditional C_H),
 *     E_flow   = cf * C_F (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398 nominal prefactor),
 *     E_trunc  = 3.06e-5                                 (N-independent fixed-strip floor),
 *     gap      = log10 N_knee - log10 N_cross,  knee: p double-prime(ln N) = 0, p = -d ln sigma / d ln N.
 * The ONLY manipulation here is the scalar cf multiplying the imp-398 C_F prefactor: cf=1 reproduces the
 * imp-95617 model byte-for-byte, cf=0 reproduces the imp-95639 E_flow = 0 branch, and 0 < cf < 1
 * interpolates continuously. The crossover r = E_coll/E_trunc = 1 fixed point N = A^2 log T0(N),
 * A = C_C/E_trunc never involved E_flow, so only the KNEE location (hence the gap) moves with cf.
 *
 * WHAT IS NEW (vs imp-95639, which used a binary on/off toggle and never varied C_F continuously)
 * ----------------------------------------------------------------------------------------------
 *   (K1) THE WEDGE CLOSES AT A C_F MULTIPLIER cf* ~ 0.839, WELL INSIDE THE PROVENANCE BAND. The box-min
 *        gap rises monotonically as cf falls: cf=1.0 -> -0.00468 (imp-95617), cf=0.90 -> -0.00178,
 *        cf=0.85 -> -0.00032 (still inverting), cf=0.75 -> +0.00260, cf=0.50 -> +0.00997, cf=0 ->
 *        +0.01708 (imp-95639). Bisecting the box-min gap to zero gives cf* ~ 0.8389: for cf < cf* the
 *        pure ordering never inverts anywhere in the +/-50% (C_C, E_trunc) box. Since cf* < 1 sits inside
 *        even a modest imp-398 provenance band, the wedge is FRAGILE to a ~16% downward revision of C_F.
 *   (K2) THE gap = 0 CONTOUR RETREATS TOWARD THE BOX FLOOR AS cf FALLS, AND EXITS AT cf*. At cf=1 the
 *        inversion contour C_C_invert(E_trunc) rises 0.399 -> 0.499 -> 0.565 (matching imp-95639); at
 *        cf=cf* it has retreated to 0.354 -> 0.442 -> 0.500, so the contour just touches the C_C = 0.5x
 *        box edge at the E_trunc = 1.5x corner -- exactly the imp-95617 wedge corner -- and drops below
 *        the searched box for any cf < cf*. Below cf* the box-min corner migrates from (C_C 0.5x,
 *        E_trunc 1.5x) toward the opposite (C_C 1.5x, E_trunc 0.5x) imp-95639 corner.
 *   (K3) THE WEDGE DEPTH IS APPROXIMATELY LINEAR IN cf NEAR NOMINAL. Over cf in [0.75, 1.5] the box-min
 *        gap tracks cf near-linearly at roughly d(minGap)/d(cf) ~ -0.029 dex per unit cf, so the whole
 *        imp-95617 inversion depth (~0.00468 dex at cf=1) is spanned by a C_F swing of only ~0.16 in cf.
 *        The pinned base gap moves the other way (0.01315 at cf=1 -> 0.01432 at cf*), reconfirming the
 *        imp-95598 F2 / imp-95639 H3 reading: E_flow shrinks sigma and pulls the knee toward the
 *        crossover, and it is precisely that pull that both narrows the base gap and opens the wedge.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Continuous-prefactor diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0
 * untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-95639-eflow-zero-inversion-wedge (binary E_flow on/off toggle; this module makes it continuous)
 * @see imp-95617-transition-knee-ordering-joint-2d (the joint sweep WITH E_flow at cf=1)
 * @see imp-95598-transition-knee-ordering-robustness (F2 named E_flow as the pure-A-scaling breaker)
 * @see imp-34694-sigma-exponent-knee-closed-form-location (ramp-acceleration knee p double-prime = 0)
 * @see imp-398 (E_flow = C_F (log T0 / T0) Gronwall absolute additive term; C_F = (log(T0/2pi)+1)/2pi)
 * @see polymath15-constant-C-C (C_C_PINNED = (1/8) sqrt(3 pi), imp-2714)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34694/imp-95582/imp-95598/imp-95617/imp-95639

// EXACT full-model ln sigma in ln-N space; cfMult scales ONLY the imp-398 C_F prefactor of E_flow.
// cfMult=1 reproduces imp-95617 byte-for-byte; cfMult=0 reproduces the imp-95639 E_flow = 0 branch.
function lnSigma(x, C_C, E_trunc, cfMult) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 nominal prefactor
  const E_flow = cfMult * C_F * (L / T0) * GRONWALL; // absolute additive term, scaled by cfMult
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
// KNEE: direct root-find of p double-prime(ln N) = 0 (imp-34694 route); C_F scaled through cf.
function kneeLog10(C_C, E_trunc, f) {
  const x = bisect((xx) => pSecond(xx, 1e-3, C_C, E_trunc, f), Math.log(1e5), Math.log(1e14));
  return x / Math.LN10;
}
const gap = (C_C, E_trunc, f) => kneeLog10(C_C, E_trunc, f) - crossoverLog10(C_C, E_trunc);

const BAND = [0.5, 0.7, 0.85, 1.0, 1.15, 1.3, 1.5];

// Box-min gap, its corner, and anyInvert over the +/-50% (C_C, E_trunc) box at a given cf multiplier.
function boxStats(cfMult) {
  let minGap = Infinity;
  let minAt = null;
  let anyInvert = false;
  for (const mc of BAND)
    for (const me of BAND) {
      const g = +gap(C_C_PINNED * mc, E_TRUNC_PT * me, cfMult).toFixed(6);
      if (g < minGap) {
        minGap = g;
        minAt = { cC_mult: mc, eTrunc_mult: me };
      }
      if (g <= 0) anyInvert = true;
    }
  return { cfMult, minGap: +minGap.toFixed(6), minAt, anyInvert };
}
// raw (unrounded) box-min gap, for the threshold bisection
function minGapRaw(cfMult) {
  let mg = Infinity;
  for (const mc of BAND)
    for (const me of BAND) {
      const g = gap(C_C_PINNED * mc, E_TRUNC_PT * me, cfMult);
      if (g < mg) mg = g;
    }
  return mg;
}
// inversion contour: C_C mult where gap crosses 0 for each E_trunc mult (gap rises with C_C), floor 0.1.
function cCInvertMult(me, cf) {
  let lo = 0.1;
  let hi = 1.5;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (gap(C_C_PINNED * m, E_TRUNC_PT * me, cf) < 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const CF_BAND = [0.0, 0.25, 0.5, 0.75, 0.85, 0.9, 1.0, 1.15, 1.3, 1.5];
const SWEEP = CF_BAND.map((cf) => boxStats(cf));

// Bisect the C_F multiplier at which the box-min gap crosses 0 (anyInvertInBox flips true -> false).
// minGapRaw decreases as cf increases, so root is where it changes sign on [0, 1].
let lo = 0.0;
let hi = 1.0;
for (let i = 0; i < 80; i++) {
  const m = (lo + hi) / 2;
  if (minGapRaw(m) > 0) lo = m;
  else hi = m;
}
const CF_STAR = +((lo + hi) / 2).toFixed(5); // ~0.83891

const CONTOUR_NOMINAL = BAND.map((me) => +cCInvertMult(me, 1.0).toFixed(4)); // matches imp-95639: 0.399 -> 0.565
const CONTOUR_AT_STAR = BAND.map((me) => +cCInvertMult(me, CF_STAR).toFixed(4)); // retreated, touches 0.5 floor at 1.5x

const BASE_GAP_NOMINAL = +gap(C_C_PINNED, E_TRUNC_PT, 1.0).toFixed(6); // ~0.01315
const BASE_GAP_AT_STAR = +gap(C_C_PINNED, E_TRUNC_PT, CF_STAR).toFixed(6); // ~0.01432
// near-nominal slope d(minGap)/d(cf) over [0.75, 1.5]
const MINGAP_SLOPE = +((minGapRaw(1.5) - minGapRaw(0.75)) / (1.5 - 0.75)).toFixed(5); // ~ -0.029

export const IMP95660_CF_MULTIPLIER_WEDGE_CLOSURE = {
  id: 'imp-95660',
  proofSection: 'S-frontier',
  question:
    'Vary the imp-398 absolute-additive prefactor C_F = (log(T0/2pi)+1)/2pi by a scalar multiplier cf ' +
    'across [0, 1.5] (the imp-95617 +/-50% band plus the cf=0 toggle endpoint), re-run the exact ' +
    'imp-95617 joint (C_C, E_trunc) sweep at each cf, re-locate the box-min gap and the gap = 0 ' +
    'inversion contour, and bisect the multiplier cf* at which anyInvertInBox flips true -> false. ' +
    'Sensitivity/measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'the box-min gap, its corner, and anyInvertInBox across the cf sweep; the C_F multiplier cf* where ' +
    'the box-min gap crosses zero; the gap = 0 contour at cf=1 vs cf=cf*; and the pinned base gap and ' +
    'near-nominal minGap-vs-cf slope',
  cfSweep: SWEEP.map((s) => ({
    cfMult: s.cfMult,
    minGap: s.minGap,
    anyInvertInBox: s.anyInvert,
    minAt: s.minAt,
  })),
  cfStar: CF_STAR, // ~0.83891
  wedgeClosesInsideBand: CF_STAR < 1.0, // true: a ~16% downward C_F revision closes the wedge
  contour: {
    eTrunc_mults: BAND,
    cC_invert_mult_at_cf1: CONTOUR_NOMINAL, // 0.399 -> 0.565 (matches imp-95639 with-flow contour)
    cC_invert_mult_at_cfStar: CONTOUR_AT_STAR, // retreated; touches the 0.5x box edge at E_trunc 1.5x
  },
  baseGap: {
    at_cf1: BASE_GAP_NOMINAL, // ~0.01315
    at_cfStar: BASE_GAP_AT_STAR, // ~0.01432 (widens as cf falls; E_flow narrows it)
  },
  minGapSlopeNearNominal: MINGAP_SLOPE, // ~ -0.029 dex per unit cf over [0.75, 1.5]
  finding: {
    K1_wedge_closes_at_cf_star_inside_band:
      'The box-min gap rises monotonically as cf falls (cf=1.0 -> -0.00468, cf=0.90 -> -0.00178, ' +
      'cf=0.85 -> -0.00032 still inverting, cf=0.75 -> +0.00260, cf=0 -> +0.01708). Bisecting the ' +
      'box-min gap to zero gives cf* ~ 0.839: for cf < cf* the ordering never inverts anywhere in the ' +
      '+/-50% (C_C, E_trunc) box. Since cf* < 1 sits inside a modest imp-398 provenance band, the ' +
      'imp-95617 wedge is fragile to a ~16% downward revision of the C_F prefactor.',
    K2_contour_retreats_and_exits_at_cf_star:
      'At cf=1 the inversion contour C_C_invert(E_trunc) rises 0.399 -> 0.499 -> 0.565 (matching ' +
      'imp-95639); at cf=cf* it has retreated to 0.354 -> 0.442 -> 0.500, so it just touches the ' +
      'C_C = 0.5x box edge at the E_trunc = 1.5x corner -- the imp-95617 wedge corner -- and drops ' +
      'below the searched box for any cf < cf*.',
    K3_wedge_depth_linear_in_cf_near_nominal:
      'Over cf in [0.75, 1.5] the box-min gap tracks cf near-linearly at d(minGap)/d(cf) ~ -0.029 dex ' +
      'per unit cf, so the whole imp-95617 inversion depth (~0.00468 dex at cf=1) is spanned by a C_F ' +
      'swing of only ~0.16 in cf. The pinned base gap moves oppositely (0.01315 at cf=1 -> 0.01432 at ' +
      'cf*), reconfirming imp-95598 F2 / imp-95639 H3: E_flow shrinks sigma and pulls the knee toward ' +
      'the crossover, which both narrows the base gap and opens the wedge.',
  },
  isRigorous: false,
  verdict:
    'SENSITIVITY / MEASUREMENT (frontier-direction, NOT rigorous). Sweeping a scalar multiplier cf on ' +
    'the imp-398 C_F prefactor continuously interpolates the imp-95639 binary toggle: the box-min gap ' +
    'rises monotonically from ~ -0.00468 (cf=1, imp-95617 inverting) to ~ +0.01708 (cf=0, imp-95639), ' +
    'and anyInvertInBox flips true -> false at a C_F multiplier cf* ~ 0.839. The imp-95617 G1 inversion ' +
    'wedge therefore closes under only a ~16% downward revision of C_F -- well inside a modest imp-398 ' +
    'provenance band -- and the gap = 0 contour retreats from ~0.399 -> 0.565 to ~0.354 -> 0.500, ' +
    'exiting the searched box at cf*. This makes the E_flow-driven wedge quantitatively fragile in the ' +
    'C_F direction, not just the on/off sense imp-95639 established. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-95639 (binary E_flow on/off toggle, made continuous here); imp-95617 (joint 2-D sweep WITH ' +
    'E_flow at cf=1); imp-95598 (F2 named E_flow as the pure-A-scaling breaker); imp-34694 ' +
    '(ramp-acceleration knee p double-prime = 0); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc ' +
    'fixed-strip floor); imp-2714 (C_C_PINNED = (1/8) sqrt(3 pi)); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping.',
};

export const IMP95660_CF_MULTIPLIER_WEDGE_CLOSURE_ASSERTIONS = [
  {
    // cf=1 reproduces imp-95617/imp-95639: box-min gap < 0 at the (C_C 0.5x, E_trunc 1.5x) wedge corner.
    id: 'imp95660-cf1-reproduces-imp95617-wedge',
    description: 'cf=1: box-min gap < 0 at (C_C 0.5x, E_trunc 1.5x), anyInvertInBox true',
    holds: () => {
      const s = SWEEP.find((r) => r.cfMult === 1.0);
      return (
        s.anyInvert === true &&
        s.minGap < 0 &&
        s.minGap > -0.01 &&
        s.minAt.cC_mult === 0.5 &&
        s.minAt.eTrunc_mult === 1.5
      );
    },
  },
  {
    // cf=0 reproduces imp-95639 E_flow = 0: box-min gap > 0.01 at the opposite corner, no inversion.
    id: 'imp95660-cf0-reproduces-imp95639-noflow',
    description: 'cf=0: box-min gap ~ +0.0171 > 0 at opposite corner (C_C 1.5x, E_trunc 0.5x), anyInvertInBox false',
    holds: () => {
      const s = SWEEP.find((r) => r.cfMult === 0.0);
      return (
        s.anyInvert === false &&
        s.minGap > 0.01 &&
        s.minAt.cC_mult === 1.5 &&
        s.minAt.eTrunc_mult === 0.5
      );
    },
  },
  {
    // (K1) the wedge closes at a C_F multiplier cf* strictly inside (0, 1); measured ~0.839.
    id: 'imp95660-cf-star-closes-wedge-inside-band',
    description: 'cf* ~ 0.839 in (0,1): anyInvertInBox flips true -> false as cf drops below cf*',
    holds: () =>
      CF_STAR > 0.82 &&
      CF_STAR < 0.86 &&
      IMP95660_CF_MULTIPLIER_WEDGE_CLOSURE.wedgeClosesInsideBand === true &&
      minGapRaw(CF_STAR * 0.99) > 0 &&
      minGapRaw(CF_STAR * 1.01) < 0,
  },
  {
    // Monotonicity: box-min gap is strictly decreasing in cf across the sweep (the interpolation is clean).
    id: 'imp95660-boxmin-gap-monotone-in-cf',
    description: 'box-min gap is strictly decreasing in cf across the [0, 1.5] sweep',
    holds: () => {
      for (let i = 1; i < SWEEP.length; i++) {
        if (!(SWEEP[i].minGap < SWEEP[i - 1].minGap)) return false;
      }
      return true;
    },
  },
  {
    // (K2)/(K3) contour retreats toward the box floor and the base gap widens as cf falls to cf*.
    id: 'imp95660-contour-retreats-base-gap-widens',
    description: 'contour retreats (cf=1 top ~0.565 -> cf* top ~0.500) and pinned base gap widens (0.01315 -> 0.01432)',
    holds: () =>
      CONTOUR_NOMINAL[CONTOUR_NOMINAL.length - 1] > CONTOUR_AT_STAR[CONTOUR_AT_STAR.length - 1] &&
      Math.abs(CONTOUR_NOMINAL[CONTOUR_NOMINAL.length - 1] - 0.5654) < 5e-3 &&
      Math.abs(CONTOUR_AT_STAR[CONTOUR_AT_STAR.length - 1] - 0.5) < 5e-3 &&
      BASE_GAP_AT_STAR > BASE_GAP_NOMINAL &&
      MINGAP_SLOPE < 0,
  },
  {
    // Honesty gate: sensitivity/measurement only, no bound moved, no QED, no refereed bound is changed.
    id: 'imp95660-honesty-gate-no-qed',
    description: 'Sensitivity/measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP95660_CF_MULTIPLIER_WEDGE_CLOSURE.isRigorous === false &&
      /NO QED/.test(IMP95660_CF_MULTIPLIER_WEDGE_CLOSURE.verdict) &&
      /refereed bound is changed/i.test(IMP95660_CF_MULTIPLIER_WEDGE_CLOSURE.verdict),
  },
];

for (const a of IMP95660_CF_MULTIPLIER_WEDGE_CLOSURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95660-cf-multiplier-wedge-closure assertion failed: ${a.id}`);
  }
}
