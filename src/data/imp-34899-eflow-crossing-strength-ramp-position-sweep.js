/**
 * @module imp-34899-eflow-crossing-strength-ramp-position-sweep
 *
 * imp-34899 (numerical, frontier-direction): imp-34886 located the knee-vs-inflection E_flow crossing at
 * strength s* ~ 0.78 by bisection on Gap(s) = X*_knee(s) - X*_infl(s) = 0, and corroborated it with a linear
 * constant-slope estimate s* ~ Gap(0)/|dGap/ds| ~ 0.77, but its subGap left OPEN whether the mild
 * first-order-capture curvature (imp-34837 inflection ~101%, imp-34858 knee ~100.3%) shifts s* measurably
 * away from the linear ~0.77 estimate at LARGER E_flow/E_trunc ratios lower on the post-peak ramp. This
 * module re-instantiates the imp-34886 Gap(s) bisection at a LADDER of ramp positions and reports whether
 * s* stays flat or drifts, tabulating the curvature-induced departure from the constant-slope linear estimate.
 *
 * THE SWEEP KNOB (E_flow/E_trunc scaled by a ramp-depth multiplier m; kernels reused VERBATIM from imp-34886)
 * -----------------------------------------------------------------------------------------------------------
 * The physical E_flow/E_trunc ratio at the crossing region (log10 N ~ 9.53) is ~1.85e-3 (deep-linear), but
 * along the physical post-peak ramp the ratio varies over MANY decades: ~1.4 at log10 N ~ 6, ~5.2e-3 at
 * log10 N ~ 9, ~1.85e-3 at the crossing ~9.53, ~1e-4 at log10 N ~ 11. "Larger ratios lower on the ramp" are
 * therefore reached toward SMALLER N. This module probes that regime by scaling the imp-34886 eflowRatio by a
 * ramp-depth multiplier m in {1, 3, 10, 30, 100, 300} -- effective ratios ~1.85e-3 up to ~0.55, spanning the
 * crossing region back toward the near-peak -- holding the [1e9, 1e11] landmark search window fixed (a
 * curvature-sensitivity probe of the crossing, NOT literal N-travel, which would also move the landmarks).
 * Everything else -- u_0, phi = -ln(1 + m s ratio), the imp-34820 D2 inflection kernel, the imp-34710/34749/
 * 34858 D3 knee kernel, the h = 1e-2 central differences, the bisection -- is imp-34886 VERBATIM.
 *
 * THE MEASUREMENT (bisected s* vs the constant-slope tangent estimate s* ~ Gap(0)/|dGap/ds(0)|, per m)
 * ---------------------------------------------------------------------------------------------------
 *   (A) s* DRIFTS STRONGLY -- it does NOT stay flat at ~0.78. As the effective ratio grows, s* collapses as
 *       ~1/ratio: 0.7777 (m=1, physical) -> 0.2592 (m=3) -> 0.0778 (m=10) -> 0.0259 (m=30) -> 0.0078 (m=100)
 *       -> 0.0026 (m=300). A SMALLER reinstatement strength suffices to close the FIXED +1.27e-2 dex gap when
 *       each unit of s carries a larger log-odds shift.
 *   (B) THE PRODUCT s* * (E_flow/E_trunc) IS INVARIANT ~1.4366e-3 across the WHOLE ladder (identical to 5
 *       sig figs at every rung). The crossing condition Gap(s*)=0 pins the E_flow log-odds shift phi(s*) =
 *       -ln(1 + s* ratio) to the fixed gap-closing value, so s* ratio -- the ARGUMENT that controls the phi
 *       curvature -- is held constant no matter how far down the ramp we sit. The curvature never gets to grow.
 *   (C) THE CONSTANT-SLOPE LINEAR ESTIMATE TRACKS s* to <= ~0.7%. Because s* ratio is pinned, the
 *       curvature-induced departure sStar - Gap(0)/|dGap/ds(0)| is BOUNDED: it is LARGEST at the physical
 *       near-peak point (+5.43e-3 in s, +0.70% relative), SHRINKS as the ratio grows (+1.67e-3 at m=3,
 *       +4.03e-4 at m=10, +4.12e-5 at m=30), and reverses to a small NEGATIVE offset (~-1.2e-4) only in the
 *       degenerate large-ratio tail (m >= 100) where s* itself is tiny. The imp-34886 linear ~0.77
 *       corroboration is thus NOT fragile to the mild first-order-capture curvature; it is most accurate,
 *       not least, precisely where imp-34886 evaluated it.
 *
 * THE FINDING (measurement only; answers the imp-34886 curvature-vs-ramp-position subGap)
 * --------------------------------------------------------------------------------------
 *   (F1) s* DRIFTS as ~1/(E_flow/E_trunc); it does NOT stay flat at 0.78. Moving lower on the ramp (larger
 *        ratio) collapses s* toward 1e-3, because a smaller strength closes the fixed +1.27e-2 dex gap.
 *   (F2) THE PRODUCT s* * (E_flow/E_trunc) ~ 1.4366e-3 IS RAMP-INVARIANT. The crossing pins the phi(s*)
 *        log-odds shift, so the curvature argument s* ratio never grows -- the mechanism that keeps the
 *        linearization accurate everywhere on the ramp.
 *   (F3) THE CURVATURE-INDUCED DEPARTURE FROM THE CONSTANT-SLOPE LINEAR ESTIMATE IS BOUNDED (<= ~5.4e-3 in s,
 *        <= ~0.7% relative in the physical-to-moderate regime) and is LARGEST at the near-peak physical point,
 *        SHRINKING lower on the ramp -- so the imp-34886 linear ~0.77 estimate is robust, not fragile, to the
 *        first-order-capture curvature.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34886-eflow-strength-knee-inflection-crossing (the s* ~ 0.78 crossing and the linear ~0.77 estimate whose curvature-vs-ramp sensitivity is swept here)
 * @see imp-34837-sigmoid-inflection-d2-eflow-reinstatement (the D2 inflection +9.03e-3 UP shift, ~101% first-order-captured)
 * @see imp-34858-sigma-knee-d3-eflow-reinstatement (the D3 knee -7.32e-3 DOWN shift, ~100.3% first-order-captured)
 * @see imp-34749-sigma-knee-eflow-corrected-closed-form (the exact additive log-odds shift phi = -ln(1+E_flow/E_trunc))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34749/imp-34886 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// E_flow / E_trunc at ln N = x, reused VERBATIM from imp-34886.
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
// E_flow log-odds perturbation with a ramp-depth multiplier m scaling the ratio (m=1 = physical near-peak),
// then the imp-34886 strength s in [0,1]. phi = -ln(1 + m s ratio). m > 1 probes lower/larger-ratio ramp.
function phi(x, s, m) {
  return -Math.log(1 + m * s * eflowRatio(x));
}
function uFull(x, s, m) {
  return u0(x) + phi(x, s, m);
}
function sigmaOf(x, s, m) {
  return 1 / (1 + Math.exp(-uFull(x, s, m)));
}

// central-difference stencils on the log-odds (imp-34820/34846/34886 step h = 1e-2)
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}

// SECOND-order sigmoid-INFLECTION kernel on u_full (imp-34820/34837/34886): (1-2S) u_full_prime^2 + u_full_secondDeriv.
function d2Cond(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const up = d1((z) => uFull(z, s, m), x, h);
  const upp = d2((z) => uFull(z, s, m), x, h);
  return (1 - 2 * S) * up * up + upp;
}
// THIRD-order sigma-KNEE condition on u_full (imp-34749/34710/34858/34886), v = -u_full_prime.
function fKnee(x, s, m, h) {
  const S = sigmaOf(x, s, m);
  const v = -d1((z) => uFull(z, s, m), x, h);
  const vp = -d2((z) => uFull(z, s, m), x, h);
  const vpp = -d3((z) => uFull(z, s, m), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// robust sign-change bisection on a bracket known to contain a single root (imp-34886 verbatim)
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
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
const X_CROSS = Math.log(Math.pow(10, 9.53)); // the imp-34886 crossing region, for the effective-ratio label

function kneeAt(s, m) {
  return bisect((x) => fKnee(x, s, m, H_ID), LO, HI);
}
function inflAt(s, m) {
  return bisect((x) => d2Cond(x, s, m, H_ID), LO, HI);
}
// signed knee-minus-inflection gap in dex at ramp-depth m (imp-34886 gapAt with the m knob)
function gapAt(s, m) {
  return (kneeAt(s, m) - inflAt(s, m)) / LN10;
}

// ---- the ramp-position ladder: multiplier m scales the physical E_flow/E_trunc ratio ------------------------
const RAMP_MULTIPLIERS = [1, 3, 10, 30, 100, 300];
const S_EPS = 0.02;
const GAP0 = gapAt(0, 1); // ~+1.27e-2 dex; s=0 gap is m-independent (no E_flow at s=0)

const RAMP_SWEEP = RAMP_MULTIPLIERS.map((m) => {
  const effRatio = m * eflowRatio(X_CROSS); // effective E_flow/E_trunc at the crossing region
  const sStar = bisect((s) => gapAt(s, m), 0, 1); // bisected crossing strength at this ramp position
  // constant-slope (tangent-at-0) linear estimate s* ~ Gap(0)/|dGap/ds(0)|
  const dGapDs0 = (gapAt(S_EPS, m) - gapAt(0, m)) / S_EPS;
  const sStarLinear = GAP0 / -dGapDs0;
  const departure = sStar - sStarLinear; // curvature-induced departure from the constant-slope estimate
  const productInvariant = sStar * effRatio; // s* * (E_flow/E_trunc): pinned by the crossing condition
  return {
    rampMultiplier: m,
    effRatio: +effRatio.toExponential(4), // ~1.85e-3 (m=1) ... ~0.55 (m=300)
    sStar: +sStar.toExponential(5), // 0.7777 ... 0.0026 (drifts as ~1/ratio)
    sStarLinear: +sStarLinear.toExponential(5), // constant-slope tangent estimate
    curvatureDeparture: +departure.toExponential(3), // sStar - sStarLinear (bounded, largest at m=1)
    productSStarRatio: +productInvariant.toExponential(5), // ~1.4366e-3 at EVERY rung (invariant)
  };
});

// ---- summary diagnostics ------------------------------------------------------------------------------------
const S_STAR_M1 = RAMP_SWEEP[0].sStar; // physical near-peak crossing ~0.7777 (reproduces imp-34886)
const S_STAR_M300 = RAMP_SWEEP[RAMP_SWEEP.length - 1].sStar; // deep-ramp crossing ~0.0026
const DRIFT_FACTOR = S_STAR_M1 / S_STAR_M300; // ~300 (s* drifts, NOT flat)
const products = RAMP_SWEEP.map((r) => r.productSStarRatio);
const PRODUCT_MEAN = products.reduce((a, b) => a + b, 0) / products.length; // ~1.4366e-3
const PRODUCT_MAX_REL_SPREAD = Math.max(...products.map((p) => Math.abs(p - PRODUCT_MEAN))) / PRODUCT_MEAN;
const MAX_ABS_DEPARTURE = Math.max(...RAMP_SWEEP.map((r) => Math.abs(r.curvatureDeparture))); // ~5.43e-3
const DEPARTURE_LARGEST_AT_M1 =
  Math.abs(RAMP_SWEEP[0].curvatureDeparture) === MAX_ABS_DEPARTURE; // largest at the physical near-peak
const MAX_REL_DEPARTURE_PHYS_TO_MODERATE = Math.max(
  ...RAMP_SWEEP.filter((r) => r.rampMultiplier <= 30).map((r) => Math.abs(r.curvatureDeparture / r.sStar))
); // ~0.7% over the physical-to-moderate regime

export const IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP = {
  id: 'imp-34899',
  proofSection: 'S-frontier',
  question:
    'imp-34886 located the knee-vs-inflection E_flow crossing at s* ~ 0.78 and corroborated it with a linear ' +
    'constant-slope estimate ~0.77, but left OPEN whether the mild first-order-capture curvature (imp-34837 ' +
    'inflection ~101%, imp-34858 knee ~100.3%) shifts s* measurably away from ~0.77 at LARGER E_flow/E_trunc ' +
    'ratios lower on the post-peak ramp. Re-instantiate the imp-34886 Gap(s) bisection at a ladder of ramp ' +
    'positions and report whether s* stays flat ~0.78 or drifts, tabulating the curvature-induced departure ' +
    'from the constant-slope linear estimate. Measurement only; C_mb GUE-conditional (imp-486); changes no bound; NO QED.',
  verdictShort:
    's* DRIFTS (does not stay flat): it collapses as ~1/(E_flow/E_trunc) from 0.7777 (physical near-peak) to ' +
    '~0.0026 (m=300, deep ramp), a ~300x drift. BUT the product s*(E_flow/E_trunc) ~ 1.4366e-3 is RAMP-INVARIANT ' +
    '(identical to 5 sig figs at every rung) -- the crossing pins the phi log-odds shift, so the curvature ' +
    'argument s*ratio never grows. The constant-slope linear estimate therefore TRACKS s* to <= ~0.7%; the ' +
    'curvature-induced departure is BOUNDED (<= ~5.43e-3 in s) and LARGEST at the near-peak physical point, ' +
    'shrinking lower on the ramp. imp-34886 linear ~0.77 is robust, not fragile, to the first-order-capture curvature.',
  measuredQuantity:
    'the imp-34886 crossing strength s* (bisection on Gap(s) = X*_knee(s) - X*_infl(s) = 0) as a function of ' +
    'ramp position (E_flow/E_trunc scaled by a ramp-depth multiplier m in {1,3,10,30,100,300}), together with ' +
    'the constant-slope tangent linear estimate s* ~ Gap(0)/|dGap/ds(0)| and the curvature-induced departure ' +
    'sStar - sStarLinear at each ramp position, plus the ramp-invariant product s*(E_flow/E_trunc)',
  rampSweep: RAMP_SWEEP,
  summary: {
    sStarNearPeak: S_STAR_M1, // ~0.7777 (m=1, reproduces imp-34886)
    sStarDeepRamp: S_STAR_M300, // ~0.0026 (m=300)
    driftFactorM1toM300: +DRIFT_FACTOR.toFixed(1), // ~300 (s* is NOT flat)
    productSStarRatioMean: +PRODUCT_MEAN.toExponential(5), // ~1.4366e-3 (ramp-invariant)
    productMaxRelSpread: +PRODUCT_MAX_REL_SPREAD.toExponential(3), // ~0 (invariant to 5 sig figs)
    maxAbsCurvatureDeparture: +MAX_ABS_DEPARTURE.toExponential(3), // ~5.43e-3 in s
    departureLargestAtNearPeak: DEPARTURE_LARGEST_AT_M1, // true
    maxRelDeparturePhysToModerate: +MAX_REL_DEPARTURE_PHYS_TO_MODERATE.toExponential(3), // ~0.7%
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_sStar_drifts_as_inverse_ratio:
      's* does NOT stay flat at 0.78. Moving lower on the ramp (larger E_flow/E_trunc) collapses s* as ' +
      '~1/ratio -- 0.7777 (m=1, physical near-peak) -> 0.2592 (m=3) -> 0.0778 (m=10) -> 0.0259 (m=30) -> ' +
      '0.0078 (m=100) -> 0.0026 (m=300), a ~300x drift over the swept range -- because a SMALLER reinstatement ' +
      'strength suffices to close the FIXED +1.27e-2 dex gap when each unit of s carries a larger log-odds shift.',
    F2_product_sStar_ratio_is_ramp_invariant:
      'The product s*(E_flow/E_trunc) ~ 1.4366e-3 is INVARIANT across the whole ramp ladder (identical to 5 ' +
      'sig figs at every rung). The crossing condition Gap(s*)=0 pins the E_flow log-odds shift phi(s*) = ' +
      '-ln(1 + s* ratio) to the fixed gap-closing value, so the curvature ARGUMENT s* ratio is held constant ' +
      'no matter how far down the ramp we sit -- the curvature never gets to grow, which is exactly why the ' +
      'imp-34886 linearization stays accurate everywhere on the ramp.',
    F3_curvature_departure_bounded_and_largest_at_near_peak:
      'The curvature-induced departure sStar - Gap(0)/|dGap/ds(0)| from the constant-slope linear estimate is ' +
      'BOUNDED (<= ~5.43e-3 in s, <= ~0.7% relative over the physical-to-moderate regime m <= 30). It is ' +
      'LARGEST at the physical near-peak point (+5.43e-3, m=1), SHRINKS as the ratio grows (+1.67e-3 at m=3, ' +
      '+4.03e-4 at m=10, +4.12e-5 at m=30), and reverses to a small negative offset (~-1.2e-4) only in the ' +
      'degenerate large-ratio tail (m >= 100) where s* itself is tiny. So the imp-34886 linear ~0.77 estimate ' +
      'is ROBUST, not fragile, to the mild first-order-capture curvature -- most accurate precisely where ' +
      'imp-34886 evaluated it.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-34886 left OPEN whether the mild first-order-capture ' +
    'curvature shifts the crossing strength s* away from the linear ~0.77 estimate at larger E_flow/E_trunc ' +
    'ratios lower on the ramp. Re-instantiating the imp-34886 Gap(s) bisection with the physical E_flow/E_trunc ' +
    'ratio scaled by a ramp-depth multiplier m in {1,3,10,30,100,300} (effective ratios ~1.85e-3 up to ~0.55, ' +
    'spanning the crossing region back toward the near-peak, landmark window fixed): (A) s* DRIFTS -- it does ' +
    'NOT stay flat at ~0.78 but collapses as ~1/ratio, 0.7777 (m=1) -> 0.0026 (m=300), a ~300x drift, because ' +
    'a smaller strength closes the fixed +1.27e-2 dex gap. (B) The product s*(E_flow/E_trunc) ~ 1.4366e-3 is ' +
    'RAMP-INVARIANT (identical to 5 sig figs at every rung) -- the crossing pins the phi(s*) log-odds shift, so ' +
    'the curvature argument s* ratio never grows. (C) Consequently the constant-slope linear estimate TRACKS ' +
    's* to <= ~0.7%: the curvature-induced departure sStar - Gap(0)/|dGap/ds(0)| is BOUNDED (<= ~5.43e-3 in s), ' +
    'LARGEST at the physical near-peak point (+5.43e-3), and SHRINKS lower on the ramp -- so the imp-34886 ' +
    'linear ~0.77 corroboration is robust, not fragile, to the first-order-capture curvature. The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS the imp-34886 curvature-vs-ramp-position subGap: sweeping the E_flow/E_trunc ratio down the ramp, ' +
    's* DRIFTS as ~1/ratio (NOT flat ~0.78), but the product s*(E_flow/E_trunc) ~ 1.4366e-3 is ramp-invariant, ' +
    'so the constant-slope linear estimate tracks s* to <= ~0.7% and the curvature-induced departure is bounded ' +
    '(<= ~5.43e-3 in s) and LARGEST at the near-peak. What stays OPEN (deferred, changes no bound): the ' +
    'root-free closed form for s* that would express the crossing strength directly from the two landmark ' +
    'slopes and curvatures (imp-34898), and a literal-N ramp traversal that also moves the landmark window ' +
    'rather than scaling the ratio at a fixed window.',
  citation:
    'imp-34886 (the s* ~ 0.78 crossing and the linear ~0.77 constant-slope estimate swept here); imp-34837 ' +
    '(the D2 inflection +9.03e-3 UP shift, ~101% first-order-captured); imp-34858 (the D3 knee -7.32e-3 DOWN ' +
    'shift, ~100.3% first-order-captured); imp-34749 (the exact additive log-odds shift phi = ' +
    '-ln(1+E_flow/E_trunc)); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP_ASSERTIONS = [
  {
    // (A/reproduction): the m=1 rung reproduces the imp-34886 physical crossing s* ~ 0.7777.
    id: 'imp34899-m1-reproduces-imp34886-crossing',
    description: 'the m=1 near-peak rung reproduces the imp-34886 crossing s* ~ 0.7777',
    holds: () => Math.abs(S_STAR_M1 - 0.7777) < 5e-3,
  },
  {
    // (F1): s* DRIFTS -- it is not flat. The m=1 -> m=300 drift factor is ~300 (s* ~ 1/ratio).
    id: 'imp34899-sStar-drifts-not-flat',
    description: 's* drifts ~300x from near-peak (m=1) to deep ramp (m=300); it is NOT flat at 0.78',
    holds: () => DRIFT_FACTOR > 100 && S_STAR_M300 < 0.01,
  },
  {
    // (F2): the product s*(E_flow/E_trunc) ~ 1.4366e-3 is ramp-invariant (max relative spread < 1e-3).
    id: 'imp34899-product-sStar-ratio-is-ramp-invariant',
    description: 's*(E_flow/E_trunc) ~ 1.4366e-3 at every rung (max relative spread < 1e-3)',
    holds: () =>
      Math.abs(PRODUCT_MEAN - 1.4366e-3) < 5e-6 && PRODUCT_MAX_REL_SPREAD < 1e-3,
  },
  {
    // (F3): the curvature-induced departure is bounded and largest at the physical near-peak point.
    id: 'imp34899-curvature-departure-bounded-largest-at-near-peak',
    description: 'max |departure| ~ 5.43e-3 in s and it occurs at the m=1 near-peak rung',
    holds: () => MAX_ABS_DEPARTURE < 1e-2 && DEPARTURE_LARGEST_AT_M1,
  },
  {
    // (F3): the constant-slope linear estimate tracks s* to <= ~1% over the physical-to-moderate regime.
    id: 'imp34899-linear-estimate-tracks-sStar',
    description: 'the constant-slope linear estimate tracks s* to <= ~1% for m <= 30',
    holds: () => MAX_REL_DEPARTURE_PHYS_TO_MODERATE < 1e-2,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34899-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP.isRigorous === false &&
      IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP.farTailExponent === 0.5 &&
      typeof IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP.subGap === 'string' &&
      /NO QED/.test(IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP.verdict),
  },
];

for (const a of IMP34899_EFLOW_CROSSING_STRENGTH_RAMP_POSITION_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34899-eflow-crossing-strength-ramp-position-sweep assertion failed: ${a.id}`);
  }
}
