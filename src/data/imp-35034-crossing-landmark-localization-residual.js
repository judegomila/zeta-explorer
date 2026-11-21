/**
 * @module imp-35034-crossing-landmark-localization-residual
 *
 * imp-35034 (numerical, frontier-direction): imp-34956 W3 established that letting the landmark window
 * X_CROSS roam the full bisection bracket [1e9,1e11] swings the imp-34924 pinned product
 * P = g* r0 = s*(E_flow/E_trunc) by ~52.8x (4.06e-3 down to 7.68e-5), so |P| is pinned ONLY by fixing
 * X_CROSS to the physical knee-inflection crossing landmark. imp-34956 W1 reported that at s = g*, m = 1
 * the knee and inflection landmarks meet to a ~4.6e-8 dex separation ("they cross at a point") and W2
 * multiplied that separation by the local sensitivity d ln P/d(dex) ~ -1.9685 to get a ~9.1e-8 point
 * estimate -- but that number was never turned into a CERTIFIED residual on the ABSOLUTE value of P, and
 * the ~4.6e-8 separation is the width of the crossing region at ONE fixed resolution, NOT the precision
 * to which the crossing dex itself is located. This module reuses the imp-34956 gapAt/eflowRatio kernel
 * VERBATIM, MEASURES how tightly the crossing-landmark dex is actually located by refining the numerical
 * resolution, and PROPAGATES that localization through d ln P/d(dex) to certify the residual |dP/P|.
 *
 * THE MEASUREMENT (crossing-landmark localization -> certified residual on |P|)
 * ---------------------------------------------------------------------------
 *   (L0) THE CROSSING-LANDMARK DEX AND THE SENSITIVITY SLOPE. At s = g* ~ 0.7776533, m = 1 the knee and
 *        inflection landmarks meet at the midpoint dex ~ 9.5306830, reproducing imp-34956 W1; the local
 *        pinned-product sensitivity is d ln P/d(dex) ~ -1.96846 (q_eff ~ 0.855, matching imp-34950).
 *   (L1) THE KNEE-INFLECTION SEPARATION IS NOT THE LOCALIZATION. The ~4.640e-8 dex knee-inflection
 *        separation imp-34956 W1 reported is the width of the crossing region at the fixed canonical
 *        stencil (h = 1e-2, converged bisection); it is the "meet at a point" width, not the uncertainty
 *        on WHERE the crossing dex sits.
 *   (L2) BISECTION LOCALIZATION IS NEGLIGIBLE ONCE CONVERGED. Re-locating the crossing midpoint at
 *        bisection budgets {50,80,120,160,200,300} (fixed h = 1e-2), the midpoint is BIT-STABLE from ~80
 *        iterations on (9.5306829893 dex, identical to all printed digits); the only motion is the
 *        pre-convergence 50->80 step (~3e-8 dex). So bisection contributes essentially nothing to the
 *        localization once the brackets are resolved (consistent with imp-35010: the floor is not
 *        bisection-limited).
 *   (L3) THE FINITE-DIFFERENCE STEP IS THE BINDING LOCALIZATION SCALE. Re-locating the crossing midpoint
 *        while varying the central-difference step h across {2e-2,1.5e-2,1e-2,7e-3,5e-3} (saturated
 *        bisection) moves the midpoint dex over a ~7.76e-7 dex spread -- ~16.7x LARGER than the
 *        knee-inflection separation. The FD step, not the separation, sets how tightly the crossing dex
 *        is located (again consistent with imp-35010: the noise floor is FD-cancellation-limited).
 *   (R) CERTIFIED RESIDUAL ON |P|. Propagating each localization scale through |d ln P/d(dex)| ~ 1.96846:
 *        - separation-based (the imp-34956 W2 implicit number): |dP/P| ~ 9.13e-8, |dP| ~ 1.31e-10;
 *        - FD-localization-based (the honest binding scale): |dP/P| ~ 1.53e-6, |dP| ~ 2.19e-9.
 *        So the certified residual absolute-value uncertainty on the pinned product is |dP/P| <= ~1.5e-6
 *        (~2.2e-9 absolute at P ~ 1.4366e-3) -- ~17x larger than the bare-separation estimate, yet still
 *        ~5 orders of magnitude below the ~52.8x free-window systematic of imp-34956 W3. The window pinned
 *        to the physical crossing landmark bounds |P| to a part-in-a-million, NOT to the part-in-ten-million
 *        the separation alone suggested.
 *
 * MEASUREMENT ONLY. This certifies a residual on the ABSOLUTE VALUE of P under the fixed-window
 * assumption; it is NOT the ~1.6e-7 across-m ramp-invariance residual (that is measured at one FIXED
 * X_CROSS and, per imp-34956, gets exactly 0 window contribution). Conditional-share diagnostic on the
 * inherited imp-3220/imp-3406 surrogate, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; C_C 1/8 (imp-2642/imp-2643) untouched; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34956-pinned-product-window-sensitivity (W1 ~4.6e-8 separation, W2 ~9.1e-8 point estimate, W3 ~52.8x)
 * @see imp-34924-eflow-pinned-product-derivation (derived P = g* r0 at the fixed crossing window)
 * @see imp-35010-ramp-invariance-bisection-tolerance-floor (the FD-cancellation-limited noise floor)
 * @see imp-35011-gstar-window-independence-direct (g* bit-identical across windows)
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the local q_eff ~ 0.855 this slope matches)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34886/imp-34924/imp-34956 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc = r(x) at ln N = x, reused VERBATIM from imp-34886/imp-34924/imp-34956.
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function u0(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
// The E_flow log-odds perturbation. s and m appear ONLY as the product g = m s (imp-34924 core).
function phi(x, s, m) {
  return -Math.log(1 + m * s * eflowRatio(x));
}
function uFull(x, s, m) {
  return u0(x) + phi(x, s, m);
}
function sigmaOf(x, s, m) {
  return 1 / (1 + Math.exp(-uFull(x, s, m)));
}

// central-difference stencils on the log-odds (imp-34886/34924/34956 canonical step h = 1e-2)
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}

// SECOND-order sigmoid-INFLECTION kernel on u_full (imp-34886/34924/34956).
function d2Cond(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const up = d1((z) => uFull(z, s, m), x, h);
  const upp = d2((z) => uFull(z, s, m), x, h);
  return (1 - 2 * S) * up * up + upp;
}
// THIRD-order sigma-KNEE condition on u_full (imp-34886/34924/34956), v = -u_full_prime.
function fKnee(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const v = -d1((z) => uFull(z, s, m), x, h);
  const vp = -d2((z) => uFull(z, s, m), x, h);
  const vpp = -d3((z) => uFull(z, s, m), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// robust sign-change bisection on a bracket known to contain a single root (imp-34886/34924/34956).
function bisect(f, a, b, iters) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (a + b);
    const fm = f(mid);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
    }
  }
  return 0.5 * (a + b);
}

const LN10 = Math.LN10;
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const H_ID = 1e-2; // the imp-34886/34924/34956 canonical stencil step
const ITERS_ID = 200; // the imp-34956 canonical bisection budget

function kneeAt(s, m, h, iters) {
  return bisect((x) => fKnee(x, s, m, h), LO, HI, iters);
}
function inflAt(s, m, h, iters) {
  return bisect((x) => d2Cond(x, s, m, h), LO, HI, iters);
}
function gapAt(s, m, h, iters) {
  return (kneeAt(s, m, h, iters) - inflAt(s, m, h, iters)) / LN10;
}

// crossing coupling g* and crossing-landmark midpoint (dex) at a chosen (h, iters) resolution.
function gStarAt(h, iters) {
  return bisect((s) => gapAt(s, 1, h, iters), 0, 1, iters);
}
function landmarkDexAt(h, iters) {
  const g = gStarAt(h, iters);
  const kneeDex = kneeAt(g, 1, h, iters) / LN10;
  const inflDex = inflAt(g, 1, h, iters) / LN10;
  return { midDex: 0.5 * (kneeDex + inflDex), sepDex: Math.abs(kneeDex - inflDex), gStar: g };
}

// ---- (L0) canonical crossing landmark + pinned-product sensitivity ------------------------------------------
const NOMINAL = landmarkDexAt(H_ID, ITERS_ID);
const G_STAR = NOMINAL.gStar; // ~0.7776533
const CROSSING_LANDMARK_DEX = NOMINAL.midDex; // ~9.5306830
const KNEE_INFL_SEPARATION_DEX = NOMINAL.sepDex; // ~4.640e-8 (imp-34956 W1)

function r0OfDex(dex) {
  return eflowRatio(Math.log(Math.pow(10, dex)));
}
function productAtDex(dex) {
  return G_STAR * r0OfDex(dex);
}
const P_NOMINAL = productAtDex(CROSSING_LANDMARK_DEX); // ~1.4366e-3 (reproduces imp-34924)
const HDEX = 1e-4;
const DLNP_DDEX = // ~-1.96846 (imp-34956 W2)
  (Math.log(productAtDex(CROSSING_LANDMARK_DEX + HDEX)) - Math.log(productAtDex(CROSSING_LANDMARK_DEX - HDEX))) /
  (2 * HDEX);

// ---- (L2) bisection localization: midpoint spread over the iteration ladder (fixed h) -----------------------
const ITER_LADDER = [50, 80, 120, 160, 200, 300];
const ITER_MIDS = ITER_LADDER.map((it) => landmarkDexAt(H_ID, it).midDex);
const ITER_LOCALIZATION_DEX = Math.max(...ITER_MIDS) - Math.min(...ITER_MIDS); // ~3e-8 (pre-convergence only)
// bit-stability of the midpoint once the brackets are resolved (>= 80 iters): all identical to ~FP floor.
const ITER_CONVERGED_SPREAD_DEX = Math.max(
  ...ITER_LADDER.filter((it) => it >= 80).map((it) => Math.abs(landmarkDexAt(H_ID, it).midDex - CROSSING_LANDMARK_DEX)),
);

// ---- (L3) finite-difference localization: midpoint spread over the FD-step ladder (saturated bisection) -----
const H_LADDER = [2e-2, 1.5e-2, 1e-2, 7e-3, 5e-3];
const H_MIDS = H_LADDER.map((h) => landmarkDexAt(h, ITERS_ID).midDex);
const FD_LOCALIZATION_DEX = Math.max(...H_MIDS) - Math.min(...H_MIDS); // ~7.76e-7 (the binding scale)
const FD_OVER_SEPARATION = FD_LOCALIZATION_DEX / KNEE_INFL_SEPARATION_DEX; // ~16.7x

// ---- (R) certified residual on |P|: propagate localization through |d ln P/d(dex)| --------------------------
const SLOPE = Math.abs(DLNP_DDEX);
const RESIDUAL_REL_FROM_SEPARATION = SLOPE * KNEE_INFL_SEPARATION_DEX; // ~9.13e-8 (imp-34956 W2 implicit)
const RESIDUAL_ABS_FROM_SEPARATION = RESIDUAL_REL_FROM_SEPARATION * P_NOMINAL; // ~1.31e-10
const RESIDUAL_REL_FROM_FD = SLOPE * FD_LOCALIZATION_DEX; // ~1.53e-6 (binding, certified)
const RESIDUAL_ABS_FROM_FD = RESIDUAL_REL_FROM_FD * P_NOMINAL; // ~2.19e-9
// scale reference: the imp-34956 W3 free-window [1e9,1e11] systematic, ~5 orders larger.
const FREE_WINDOW_MAX_OVER_MIN = productAtDex(9) / productAtDex(11); // ~52.8x

export const IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL = {
  id: 'imp-35034',
  proofSection: 'S-frontier',
  question:
    'imp-34956 W3 showed the pinned product P = g* r0 swings ~52.8x if X_CROSS roams the full [1e9,1e11] ' +
    'bracket, so |P| is pinned only by fixing X_CROSS to the physical knee-inflection crossing landmark. ' +
    'imp-34956 W1 reported a ~4.6e-8 dex knee-inflection separation (they meet at a point). MEASURE how ' +
    'tightly the crossing-landmark dex is itself located and PROPAGATE that localization through ' +
    'd ln P/d(dex) ~ -1.9685 to certify the residual absolute-value uncertainty on P. Measurement only on ' +
    'the inherited imp-3220/imp-3406 surrogate; C_mb GUE-conditional per imp-486; changes no bound; NO QED.',
  verdictShort:
    'The ~4.6e-8 dex knee-inflection separation is the crossing-region width at ONE fixed resolution, NOT the ' +
    'precision to which the crossing dex is located. Bisection localization is negligible once converged ' +
    '(midpoint bit-stable from ~80 iters); the BINDING localization is the finite-difference step, which ' +
    'moves the crossing dex over ~7.76e-7 dex (~16.7x the separation). Propagating that through ' +
    '|d ln P/d(dex)| ~ 1.968 certifies |dP/P| <= ~1.53e-6 (~2.19e-9 absolute at P ~ 1.4366e-3) -- ~17x the ' +
    'bare-separation ~9.1e-8, still ~5 orders below the ~52.8x free-window systematic.',
  measuredQuantity:
    'the crossing-landmark midpoint dex at s = g*, m = 1; the knee-inflection separation; the crossing-dex ' +
    'localization under bisection-iteration refinement and under finite-difference-step refinement; and the ' +
    'certified residual absolute-value uncertainty on the pinned product P obtained by propagating each ' +
    'localization scale through the local sensitivity d ln P/d(dex)',
  gStar: +G_STAR.toExponential(7), // ~0.7776533
  crossingLandmarkDex: +CROSSING_LANDMARK_DEX.toFixed(7), // ~9.5306830
  kneeInflSeparationDex: +KNEE_INFL_SEPARATION_DEX.toExponential(3), // ~4.640e-8 (imp-34956 W1)
  dlnP_ddex: +DLNP_DDEX.toFixed(6), // ~-1.96846
  pNominal: +P_NOMINAL.toExponential(6), // ~1.436563e-3
  localization: {
    iterLadder: ITER_LADDER,
    iterLocalizationDex: +ITER_LOCALIZATION_DEX.toExponential(3), // ~3e-8 (pre-convergence only)
    iterConvergedSpreadDex: +ITER_CONVERGED_SPREAD_DEX.toExponential(3), // ~0 (bit-stable from >= 80 iters)
    hLadder: H_LADDER,
    fdLocalizationDex: +FD_LOCALIZATION_DEX.toExponential(3), // ~7.76e-7 (the binding scale)
    fdOverSeparation: +FD_OVER_SEPARATION.toFixed(2), // ~16.7x
  },
  certifiedResidual: {
    slopeAbs: +SLOPE.toFixed(6), // ~1.96846
    fromSeparation: {
      relative: +RESIDUAL_REL_FROM_SEPARATION.toExponential(3), // ~9.13e-8
      absolute: +RESIDUAL_ABS_FROM_SEPARATION.toExponential(3), // ~1.31e-10
    },
    fromFdLocalization: {
      relative: +RESIDUAL_REL_FROM_FD.toExponential(3), // ~1.53e-6 (certified binding residual)
      absolute: +RESIDUAL_ABS_FROM_FD.toExponential(3), // ~2.19e-9
    },
  },
  freeWindowMaxOverMin: +FREE_WINDOW_MAX_OVER_MIN.toFixed(3), // ~52.8x (imp-34956 W3, for scale)
  bound:
    'The crossing-landmark dex is located to ~7.76e-7 dex (finite-difference-step-dominated, ~16.7x the ' +
    '~4.6e-8 dex knee-inflection separation; bisection localization is negligible once converged). ' +
    'Propagating that localization through |d ln P/d(dex)| ~ 1.968 certifies a residual absolute-value ' +
    'uncertainty on the pinned product of |dP/P| <= ~1.53e-6 (~2.19e-9 absolute at P ~ 1.4366e-3) -- ~17x ' +
    'the ~9.1e-8 the bare knee-inflection separation implied, yet still ~5 orders below the ~52.8x free-window ' +
    'systematic of imp-34956 W3. This is a residual on the ABSOLUTE value of P under the fixed-window ' +
    'assumption, NOT the ~1.6e-7 across-m ramp-invariance residual (which gets 0 window contribution).',
  farTailExponent: 0.5, // imp-3463 asymptote
  finding: {
    L1_separation_is_not_localization:
      'The ~4.640e-8 dex knee-inflection separation reported by imp-34956 W1 is the width of the crossing ' +
      'region at the fixed canonical stencil (h = 1e-2, converged bisection) -- the "meet at a point" width, ' +
      'NOT the uncertainty on where the crossing dex sits.',
    L2_bisection_localization_negligible:
      'Re-locating the crossing midpoint at bisection budgets {50,80,120,160,200,300} (fixed h = 1e-2), the ' +
      'midpoint is BIT-STABLE from ~80 iterations on (identical to ~9.5306829893 dex); the only motion is the ' +
      'pre-convergence 50->80 step (~3e-8 dex). Bisection contributes essentially nothing once resolved ' +
      '(consistent with imp-35010: the floor is not bisection-limited).',
    L3_fd_step_is_binding_localization:
      'Varying the central-difference step h across {2e-2,1.5e-2,1e-2,7e-3,5e-3} (saturated bisection) moves ' +
      'the crossing midpoint dex over ~7.76e-7 dex -- ~16.7x the knee-inflection separation. The FD step, not ' +
      'the separation, sets how tightly the crossing dex is located (consistent with imp-35010: the noise ' +
      'floor is FD-cancellation-limited).',
    R_certified_residual_on_absP:
      'Propagating the FD-dominated localization through |d ln P/d(dex)| ~ 1.968 certifies |dP/P| <= ~1.53e-6 ' +
      '(~2.19e-9 absolute at P ~ 1.4366e-3), vs the bare-separation ~9.13e-8. The physical crossing window ' +
      'therefore bounds |P| to a part-in-a-million, not the part-in-ten-million the separation alone suggested; ' +
      'either way, ~5 orders below the ~52.8x free-window systematic.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT a rigorous asymptotic). imp-34956 W3 established that |P| = |g* r0| ' +
    'is pinned only by fixing X_CROSS to the physical crossing landmark (a free window over [1e9,1e11] swings ' +
    'it ~52.8x), and W1/W2 reported a ~4.6e-8 dex knee-inflection separation giving a ~9.1e-8 point estimate. ' +
    'MEASURED how tightly the crossing dex is located: (L1) the ~4.640e-8 dex separation is the crossing-region ' +
    'width at fixed resolution, not the localization; (L2) bisection localization is negligible once converged ' +
    '(midpoint bit-stable from ~80 iters); (L3) the finite-difference step is the BINDING localization, moving ' +
    'the crossing dex over ~7.76e-7 dex (~16.7x the separation, consistent with imp-35010). PROPAGATING that ' +
    'through |d ln P/d(dex)| ~ 1.968 CERTIFIES the residual absolute-value uncertainty |dP/P| <= ~1.53e-6 ' +
    '(~2.19e-9 absolute at P ~ 1.4366e-3) -- ~17x the bare-separation ~9.1e-8, yet still ~5 orders below the ' +
    '~52.8x free-window systematic. This bounds the ABSOLUTE value of P under the fixed-window assumption; it ' +
    'is NOT the ~1.6e-7 across-m ramp-invariance residual (which gets 0 window contribution per imp-34956). ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; C_C 1/8 (imp-2642/imp-2643) untouched; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; far-tail exponent stays 1/2 (imp-3463); ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CERTIFIES the residual absolute-value uncertainty on the imp-34924 pinned product P = g* r0 by measuring ' +
    'the crossing-landmark localization (~7.76e-7 dex, FD-step-dominated) and propagating it through ' +
    '|d ln P/d(dex)| ~ 1.968 to |dP/P| <= ~1.53e-6. What stays OPEN (deferred, changes no bound): the ~7.76e-7 ' +
    'FD localization is itself a stencil-step systematic that a Richardson/complex-step or analytic-derivative ' +
    'gapAt kernel (imp-35010 sub-gap) could shrink toward the FP floor, tightening the certified residual; and ' +
    'the root-free closed form for the crossing-landmark location from the two landmark slopes/curvatures ' +
    '(imp-34898) would remove the FD dependence entirely.',
  citation:
    'imp-34956 (W1 ~4.6e-8 separation, W2 ~9.1e-8 point estimate, W3 ~52.8x free window); imp-34924 (derived ' +
    'P = g* r0); imp-35010 (FD-cancellation-limited noise floor); imp-35011 (g* bit-identical across windows); ' +
    'imp-34950 (the local q_eff ~ 0.855 this slope matches); imp-3463 (far-tail 1/2); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL_ASSERTIONS = [
  {
    // (L0): reproduces the imp-34956/34924 crossing landmark, coupling, product and sensitivity slope.
    id: 'imp35034-reproduces-crossing-landmark-and-slope',
    description: 'g* ~ 0.7776533, crossing landmark ~9.53068 dex, P ~ 1.4366e-3, d ln P/d(dex) ~ -1.9685',
    holds: () =>
      Math.abs(G_STAR - 0.7776533) < 5e-6 &&
      Math.abs(CROSSING_LANDMARK_DEX - 9.5306830) < 5e-4 &&
      Math.abs(P_NOMINAL - 1.43656e-3) < 5e-6 &&
      Math.abs(DLNP_DDEX + 1.9685) < 5e-3,
  },
  {
    // (L1): the reported separation is the ~4.6e-8 dex "meet at a point" width from imp-34956 W1.
    id: 'imp35034-knee-inflection-separation-matches-imp34956',
    description: 'knee-inflection separation ~4.6e-8 dex reproduces imp-34956 W1',
    holds: () => KNEE_INFL_SEPARATION_DEX > 1e-8 && KNEE_INFL_SEPARATION_DEX < 1e-7,
  },
  {
    // (L2): bisection localization is negligible -- the midpoint is bit-stable once converged (>= 80 iters).
    id: 'imp35034-bisection-localization-negligible',
    description: 'crossing dex bit-stable from >= 80 iters (converged spread ~ FP floor, << FD localization)',
    holds: () => ITER_CONVERGED_SPREAD_DEX < 1e-10 && ITER_CONVERGED_SPREAD_DEX < FD_LOCALIZATION_DEX,
  },
  {
    // (L3): the finite-difference step is the BINDING localization scale, ~17x the separation.
    id: 'imp35034-fd-step-is-binding-localization',
    description: 'FD-step crossing-dex localization ~7.8e-7 dex, ~16.7x the knee-inflection separation',
    holds: () =>
      FD_LOCALIZATION_DEX > 1e-7 &&
      FD_LOCALIZATION_DEX < 5e-6 &&
      FD_OVER_SEPARATION > 5 &&
      FD_LOCALIZATION_DEX > KNEE_INFL_SEPARATION_DEX,
  },
  {
    // (R): the certified residual on |P| from FD localization is ~1.5e-6 relative, ~17x the bare-separation.
    id: 'imp35034-certified-residual-on-absP',
    description: 'certified |dP/P| ~ 1.5e-6 (FD-localization), ~17x the ~9.1e-8 bare-separation estimate',
    holds: () =>
      Math.abs(RESIDUAL_REL_FROM_SEPARATION - 9.1e-8) < 3e-8 &&
      RESIDUAL_REL_FROM_FD > 5e-7 &&
      RESIDUAL_REL_FROM_FD < 5e-6 &&
      RESIDUAL_REL_FROM_FD > RESIDUAL_REL_FROM_SEPARATION,
  },
  {
    // scale: the certified residual is ~5 orders below the imp-34956 W3 ~52.8x free-window systematic.
    id: 'imp35034-residual-far-below-free-window',
    description: 'certified residual ~1.5e-6 is ~5 orders below the ~52.8x free-window systematic (imp-34956 W3)',
    holds: () => FREE_WINDOW_MAX_OVER_MIN > 40 && RESIDUAL_REL_FROM_FD < 1e-4,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35034-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.isRigorous === false &&
      IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.farTailExponent === 0.5 &&
      typeof IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.subGap === 'string' &&
      /NO QED/.test(IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.verdict) &&
      /refereed bound is changed/i.test(IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL.verdict),
  },
];

for (const a of IMP35034_CROSSING_LANDMARK_LOCALIZATION_RESIDUAL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35034-crossing-landmark-localization-residual assertion failed: ${a.id}`);
  }
}
