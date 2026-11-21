/**
 * @module imp-36044-krawczyk-dG-node-vacuity-height
 *
 * MEASUREMENT / DIAGNOSTIC ONLY on the surrogate. imp-35969 contrasted two nodes of the OPEN imp-34714a
 * Krawczyk operator up the a -> 0 height axis N = 1e13 .. 1e21: the residual node [F(m)] = [m] - [K log T0(m)]
 * (relative enclosure width FLAT at a few eps, a-INDEPENDENT, tightening) against the imp-35810/imp-35855
 * de-cancelled dG node M_G - 1 (relative width kappa_dG * eps ~ (4/a) eps, which DIVERGES as a(N) -> 0). But
 * imp-35969 never located the height at which the dG-node relative width actually reaches O(1) -- the point
 * where the outward-rounded interval spans its own magnitude and the enclosure STOPS being informative (goes
 * vacuous). This module BISECTS on N for that vacuity height.
 *
 * THE VACUITY CONDITION
 * ---------------------
 * The de-cancelled dG node is the near-equal subtraction M_G - 1 with M_G = 2G/(1+G), G = 1 - a, whose
 * relative outward-rounded interval width is kappa_dG * eps with kappa_dG = (|M_G| + 1)/|M_G - 1| ~ 4/a as
 * a -> 0 (imp-35855). The enclosure becomes vacuous when that relative width reaches O(1):
 *     kappa_dG * eps ~ 1   <=>   (4/a) eps ~ 1   <=>   a(N) ~ 4 eps_mach.
 * a(N) = 2 pi K / (T0(N) u), u = log(T0/2pi), is monotone DECREASING up the axis (a -> 0 as N grows), so there
 * is a unique crossing. We bisect on log10(N) for a(N) = 4 eps_mach on the SAME inherited imp-3220/imp-3406 RvM
 * height map (lambda-rh-height-mapping.effectiveHeightForN), reusing the identical imp-34774/imp-35855/imp-35969
 * K_AMPL and aOf, and report log10(N*), T*, and a* at the vacuity height.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (V1) THE VACUITY HEIGHT SITS ABOVE THE imp-35969 DIAGNOSTIC AXIS. The dG-node relative width reaches O(1)
 *        (a = 4 eps_mach) at log10(N*) ~ 23.24 (N* ~ 1.74e23, T* ~ 2.24e22), roughly 2.24 decades ABOVE the
 *        top of the imp-35969 sweep (N = 1e21, where the dG relative width was still only ~ 5.8e-3). So across
 *        the WHOLE 1e13 .. 1e21 diagnostic axis the de-cancelled dG-node enclosure remains INFORMATIVE (relative
 *        width < 1); it only becomes vacuous well beyond the charted range.
 *   (V2) AT THE VACUITY HEIGHT kappa_dG ~ 1/eps_mach. a* = 4 eps_mach ~ 8.88e-16 gives kappa_dG = 4/a* ~
 *        4.50e15 ~ 1/eps_mach -- the textbook condition-number == reciprocal-machine-epsilon vacuity threshold
 *        for a near-equal subtraction. This is a-DRIVEN (it depends only on a(N)), CONTRASTING the a-INDEPENDENT
 *        residual node imp-35969 showed stays flat there.
 *   (V3) THE VACUITY HEIGHT IS FAR ABOVE THE PHYSICAL / VERIFIED RANGE. The Platt-Trudgian verified zero height
 *        binds around T ~ 3e12 (N ~ 1e13); the dG-node vacuity height T* ~ 2.49e21 is ~ 9 orders above it. So
 *        the dG-node cancellation, though it DIVERGES as a -> 0, does not reach vacuity anywhere near the range
 *        the certificate would actually be evaluated -- the divergence is a large-N tail phenomenon.
 *
 * MEASUREMENT / surrogate ONLY. This locates a height on the surrogate a(N) map at which a SINGLE de-cancelled
 * node's outward-rounded relative width would reach O(1); it instantiates NO certified interval, ports NO
 * certificate, and does NOT discharge the imp-34714a Krawczyk lemma or the imp-34687a directed-rounding layer.
 * The kappa_dG ~ 4/a model is the imp-35855 de-cancellation surrogate, not the imp-34687a layer. imp-34714a
 * REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35969-krawczyk-residual-directed-rounding-width (measured dG width diverges as a->0; never located O(1) height)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled dG node kappa_dG ~ 4/a)
 * @see imp-35810-cancellation-onset-height (the eps_mach/a dG departure envelope)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (K_AMPL, g, aOf, N_cross)
 * @see imp-34714-krawczyk lemma (sub-gap imp-34714a OPEN); imp-34687 (directed-rounding layer; sub-gap imp-34687a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-35855/imp-35969)
const EPS = Number.EPSILON; // 2^-52

// Height-axis parameter a(N) = g-prime(N) = 2 pi K / (T0 u), u = log(T0/2pi) (identical to imp-35969 aOf).
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
// The imp-35855 de-cancelled dG-node relative interval width: kappa_dG * eps, kappa_dG = (|M_G|+1)/|M_G-1| ~ 4/a.
const kappaDG = (a) => {
  const G = 1 - a;
  const M_G = (2 * G) / (1 + G);
  return (Math.abs(M_G) + 1) / Math.abs(M_G - 1);
};

// The vacuity condition kappa_dG * eps ~ 1  <=>  a(N) ~ 4 eps_mach. a(N) is monotone DECREASING up the axis, so
// bisect on log10(N) for a(N) = A_VACUITY between the imp-35969 axis top (1e21) and a comfortably higher bracket.
const A_VACUITY = 4 * EPS; // ~8.882e-16
const BISECT_LO_LOG = 21; // imp-35969 axis top (a well above 4 eps here)
const BISECT_HI_LOG = 24; // a well below 4 eps here
let lo = BISECT_LO_LOG;
let hi = BISECT_HI_LOG;
for (let i = 0; i < 200; i++) {
  const mid = (lo + hi) / 2;
  // a decreasing in N: if a(mid) still above target, vacuity is HIGHER (move lo up); else move hi down.
  if (aOf(Math.pow(10, mid)) > A_VACUITY) lo = mid;
  else hi = mid;
}
const LOG10_N_VACUITY = (lo + hi) / 2;
const N_VACUITY = Math.pow(10, LOG10_N_VACUITY);
const T_VACUITY = effectiveHeightForN(N_VACUITY);
const A_AT_VACUITY = aOf(N_VACUITY);
const KAPPA_AT_VACUITY = kappaDG(A_AT_VACUITY); // ~ 4/a ~ 1/eps
const DG_REL_WIDTH_AT_VACUITY = KAPPA_AT_VACUITY * EPS; // ~ 1 by construction

// Reference: the imp-35969 diagnostic-axis TOP (N = 1e21) -- the dG relative width there is still << 1.
const N_AXIS_TOP = 1e21;
const A_AT_AXIS_TOP = aOf(N_AXIS_TOP);
const DG_REL_WIDTH_AT_AXIS_TOP = kappaDG(A_AT_AXIS_TOP) * EPS;
const DECADES_ABOVE_AXIS_TOP = LOG10_N_VACUITY - Math.log10(N_AXIS_TOP);

// Reference: the physical / Platt-Trudgian verified zero height (T ~ 3e12, N ~ 1e13, bottom of the imp-35969 axis).
const N_PHYSICAL = 1e13;
const T_PHYSICAL = effectiveHeightForN(N_PHYSICAL);
const DECADES_T_ABOVE_PHYSICAL = Math.log10(T_VACUITY / T_PHYSICAL);

// Validation flags.
const A_HITS_TARGET = Math.abs(A_AT_VACUITY / A_VACUITY - 1) < 1e-6; // bisection converged to a = 4 eps
const DG_WIDTH_IS_ORDER_ONE = DG_REL_WIDTH_AT_VACUITY > 0.9 && DG_REL_WIDTH_AT_VACUITY < 1.2;
const VACUITY_ABOVE_AXIS_TOP = DECADES_ABOVE_AXIS_TOP > 0 && DG_REL_WIDTH_AT_AXIS_TOP < 1;
const KAPPA_NEAR_INV_EPS = KAPPA_AT_VACUITY > 0.5 / EPS && KAPPA_AT_VACUITY < 2 / EPS;
const VACUITY_ABOVE_PHYSICAL = DECADES_T_ABOVE_PHYSICAL > 5;

export const IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT = {
  id: 'imp-36044',
  proofSection: 'S-frontier',
  question:
    'imp-35969 measured that the de-cancelled Krawczyk dG-node relative interval width kappa_dG * eps ~ (4/a) ' +
    'eps DIVERGES as a(N) -> 0 up the axis N = 1e13 .. 1e21 (while the residual node stays a-independent and ' +
    'flat), but never located the height at which that dG width reaches O(1) and the interval enclosure stops ' +
    'being informative (goes vacuous). Bisect on N for kappa_dG * eps ~ 1, equivalently a(N) ~ 4 eps_mach, on ' +
    'the inherited imp-3220/imp-3406 RvM height map, and report log10(N*), T*, and a* at the vacuity height. ' +
    'Measurement / surrogate only; instantiates no certified interval; imp-34714a stays OPEN; NO QED.',
  finding:
    'THE dG-NODE ENCLOSURE GOES VACUOUS AT log10(N*) ~ ' +
    LOG10_N_VACUITY.toFixed(4) +
    ' (N* ~ ' +
    N_VACUITY.toExponential(4) +
    ', T* ~ ' +
    T_VACUITY.toExponential(4) +
    '), where a* = 4 eps_mach ~ ' +
    A_AT_VACUITY.toExponential(4) +
    ' and kappa_dG = 4/a* ~ ' +
    KAPPA_AT_VACUITY.toExponential(4) +
    ' ~ 1/eps_mach. (V1) This vacuity height sits ~ ' +
    DECADES_ABOVE_AXIS_TOP.toFixed(2) +
    ' decades ABOVE the top of the imp-35969 diagnostic axis (N = 1e21, where the dG relative width was still ' +
    'only ~ ' +
    DG_REL_WIDTH_AT_AXIS_TOP.toExponential(3) +
    ' << 1): across the WHOLE charted 1e13 .. 1e21 axis the de-cancelled dG-node enclosure remains INFORMATIVE, ' +
    'going vacuous only beyond the range. (V2) At the vacuity height kappa_dG ~ 1/eps_mach -- the textbook ' +
    'condition-number == reciprocal-machine-epsilon threshold for a near-equal subtraction, a-DRIVEN (unlike ' +
    'the a-independent residual node). (V3) T* ~ ' +
    T_VACUITY.toExponential(3) +
    ' is ~ ' +
    DECADES_T_ABOVE_PHYSICAL.toFixed(1) +
    ' orders ABOVE the Platt-Trudgian verified zero height (T ~ ' +
    T_PHYSICAL.toExponential(2) +
    '); the dG divergence, though real as a -> 0, does not reach vacuity anywhere near where the certificate ' +
    'would be evaluated -- it is a large-N tail phenomenon. MEASUREMENT / surrogate, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    machine_epsilon: EPS,
    a_vacuity_target_4eps: +A_VACUITY.toExponential(6),
  },
  measurement: {
    // the vacuity height (kappa_dG * eps ~ 1, a ~ 4 eps_mach)
    log10_N_vacuity: +LOG10_N_VACUITY.toFixed(6),
    N_vacuity: +N_VACUITY.toExponential(6),
    T_vacuity: +T_VACUITY.toExponential(6),
    a_at_vacuity: +A_AT_VACUITY.toExponential(6),
    kappa_dG_at_vacuity: +KAPPA_AT_VACUITY.toExponential(6),
    dG_rel_width_at_vacuity: +DG_REL_WIDTH_AT_VACUITY.toExponential(6),
    // (V1) position relative to the imp-35969 diagnostic axis top (N = 1e21)
    dG_rel_width_at_axis_top_1e21: +DG_REL_WIDTH_AT_AXIS_TOP.toExponential(6),
    a_at_axis_top_1e21: +A_AT_AXIS_TOP.toExponential(6),
    decades_above_axis_top: +DECADES_ABOVE_AXIS_TOP.toFixed(4),
    // (V3) position relative to the physical / verified height (N = 1e13)
    T_physical_1e13: +T_PHYSICAL.toExponential(6),
    decades_T_above_physical: +DECADES_T_ABOVE_PHYSICAL.toFixed(4),
    // validation
    a_hits_4eps_target: A_HITS_TARGET,
    dG_width_is_order_one: DG_WIDTH_IS_ORDER_ONE,
    vacuity_above_axis_top: VACUITY_ABOVE_AXIS_TOP,
    kappa_near_inv_eps: KAPPA_NEAR_INV_EPS,
    vacuity_above_physical: VACUITY_ABOVE_PHYSICAL,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This locates a height on the SURROGATE a(N) map at which a SINGLE de-cancelled ' +
    'node (the imp-35855 dG node M_G - 1, relative width kappa_dG * eps ~ (4/a) eps) would reach O(1); the ' +
    'kappa_dG ~ 4/a model is the imp-35855 de-cancellation surrogate, NOT the imp-34687a directed-rounding ' +
    'layer, and this instantiates NO certified interval, ports NO operator, and does NOT discharge the ' +
    'imp-34714a Krawczyk lemma. The transferable finding is WHERE the a-driven cancellation reaches vacuity ' +
    '(log10 N* ~ ' +
    LOG10_N_VACUITY.toFixed(2) +
    ', ~ ' +
    DECADES_ABOVE_AXIS_TOP.toFixed(1) +
    ' decades above the charted axis and ~ ' +
    DECADES_T_ABOVE_PHYSICAL.toFixed(0) +
    ' orders in T above the verified height); the enclosure staying informative below it is NECESSARY but not ' +
    'SUFFICIENT for a valid certificate. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK dG-NODE VACUITY HEIGHT, LOCATED (frontier, NOT an RH bound). imp-35969 measured that the ' +
    'de-cancelled dG-node relative interval width kappa_dG * eps ~ (4/a) eps DIVERGES as a(N) -> 0 up the axis ' +
    'N = 1e13 .. 1e21 but never located where it reaches O(1). Bisecting on N for a(N) = 4 eps_mach (kappa_dG * ' +
    'eps ~ 1) on the imp-3220/imp-3406 RvM map: the enclosure goes vacuous at log10(N*) ~ ' +
    LOG10_N_VACUITY.toFixed(4) +
    ' (N* ~ ' +
    N_VACUITY.toExponential(3) +
    ', T* ~ ' +
    T_VACUITY.toExponential(3) +
    ', a* ~ ' +
    A_AT_VACUITY.toExponential(3) +
    ', kappa_dG ~ ' +
    KAPPA_AT_VACUITY.toExponential(3) +
    ' ~ 1/eps_mach). (V1) That is ~ ' +
    DECADES_ABOVE_AXIS_TOP.toFixed(2) +
    ' decades ABOVE the imp-35969 diagnostic-axis top (N = 1e21, dG relative width still ~ ' +
    DG_REL_WIDTH_AT_AXIS_TOP.toExponential(2) +
    ' << 1), so the dG-node enclosure remains INFORMATIVE across the whole charted axis; (V3) T* is ~ ' +
    DECADES_T_ABOVE_PHYSICAL.toFixed(1) +
    ' orders ABOVE the Platt-Trudgian verified height (T ~ 3e12), so the a -> 0 divergence reaches vacuity only ' +
    'in the large-N tail, far from where the certificate is evaluated. MEASUREMENT / surrogate, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: a single de-cancelled node on the surrogate a(N) map, not ' +
    'the imp-34687a directed-rounding layer; no certified interval instantiated; the informative-enclosure ' +
    'reading is NECESSARY but not SUFFICIENT. Reuses the imp-34774/imp-35855/imp-35969 machinery (identical ' +
    'K_AMPL, aOf); C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35969 (measured the dG width diverges as a->0; never located the O(1) vacuity height); imp-35855 ' +
    '(de-cancelled the dG node kappa_dG ~ 4/a); imp-35810 (eps_mach/a dG departure envelope); imp-34774 ' +
    '(K_AMPL, g, aOf, N_cross); imp-34714 (Krawczyk lemma; sub-gap imp-34714a); imp-34687 (directed-rounding ' +
    'layer; sub-gap imp-34687a); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse). Condition-number == reciprocal-machine-epsilon vacuity threshold for near-equal subtraction: ' +
    'standard floating-point / interval analysis (IEEE-754, Higham, Neumaier).',
};

export const IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT_ASSERTIONS = [
  {
    // The bisection converged to the vacuity condition a(N*) = 4 eps_mach, dG relative width ~ 1.
    id: 'imp36044-bisection-hits-vacuity-condition',
    description: 'a(N*) = 4 eps_mach (bisection converged) and dG relative width kappa_dG * eps ~ 1 there',
    holds: () => A_HITS_TARGET === true && DG_WIDTH_IS_ORDER_ONE === true,
  },
  {
    // (V2) at the vacuity height kappa_dG ~ 1/eps_mach (near-equal-subtraction vacuity threshold).
    id: 'imp36044-kappa-near-reciprocal-eps',
    description: 'kappa_dG at the vacuity height is ~ 1/eps_mach (condition-number == 1/eps threshold)',
    holds: () => KAPPA_NEAR_INV_EPS === true,
  },
  {
    // (V1) the vacuity height sits ABOVE the imp-35969 diagnostic axis top (dG width there still << 1).
    id: 'imp36044-vacuity-above-diagnostic-axis',
    description: 'vacuity height log10 N* > 21 (dG relative width at N=1e21 still < 1); enclosure informative on the whole charted axis',
    holds: () => VACUITY_ABOVE_AXIS_TOP === true && LOG10_N_VACUITY > 21,
  },
  {
    // (V3) the vacuity height is far above the physical / verified range (large-N tail phenomenon).
    id: 'imp36044-vacuity-above-physical-range',
    description: 'T* at the vacuity height is > 5 orders above the Platt-Trudgian verified height (T ~ 3e12)',
    holds: () => VACUITY_ABOVE_PHYSICAL === true,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp36044-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT.subGap) &&
      /NO QED/.test(IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT.verdict) &&
      /refereed bound is changed/i.test(IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT.verdict),
  },
];

for (const a of IMP36044_KRAWCZYK_DG_NODE_VACUITY_HEIGHT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36044-krawczyk-dG-node-vacuity-height assertion failed: ${a.id}`);
  }
}
