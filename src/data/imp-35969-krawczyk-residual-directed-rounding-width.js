/**
 * @module imp-35969-krawczyk-residual-directed-rounding-width
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. imp-35885 (NODE B) catalogued the difference nodes of the OPEN imp-34714a
 * Krawczyk operator K(m) = m - [F-prime]^{-1} F(m), F(N) = N - g(N), g(N) = K log T0(N), and classified the
 * residual-at-root F(m) (exactly 0 in double precision at the certificate centre m = N_cross) as the KNOWN
 * a-INDEPENDENT F(m) = 0 artifact. imp-35885 ASSERTED that a directed-rounding F(m) "would be a small NONZERO
 * interval, tightening the image, not an a-driven inflation" -- but never QUANTIFIED that width. imp-35928
 * measured the residual VALUE magnitude |F(m)| at the located root (a few ULP of the value, a-independent).
 * This module measures a DIFFERENT quantity: the outward-rounded interval WIDTH the directed-rounding LAYER
 * would emit for [F(m)] = [m] - [K log T0(m)] -- the accumulated rounding-error width of the enclosure, which
 * the imp-34687a layer produces regardless of the VALUE being ~ 0 (the residual value and the enclosure width
 * are distinct: interval subtraction width = width([m]) + width([g]) does NOT depend on the result magnitude).
 *
 * THE MEASUREMENT (double-precision surrogate of the directed-rounding layer)
 * --------------------------------------------------------------------------
 * A faithful bit-level nextafter (nextUp/nextDown on the Float64 representation) implements outward-directed
 * rounding. Each elementary op of F(m) = m - K log T0(m) is evaluated round-to-nearest then outward-rounded:
 *   [L]  = log([T0]),         Llo = nextDown(log Tlo),  Lhi = nextUp(log Thi)
 *   [G]  = K * [L],           Glo = nextDown(K Llo),     Ghi = nextUp(K Lhi)     (K > 0)
 *   [F]  = [m] - [G],         Flo = nextDown(m - Ghi),   Fhi = nextUp(m - Glo)
 * and W(N) = Fhi - Flo is the outward-rounded interval width of the residual node [F(m)]. This is evaluated at
 * the certificate CENTRE m = N_cross and up the SAME imp-35885 height axis N = 1e13 .. 1e21.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (W1) THE ENCLOSURE WIDTH IS A SMALL NONZERO INTERVAL. Even where the VALUE F(m) collapses to exactly 0
 *        (the N_cross fixed point), the outward-rounded [F(m)] has a small NONZERO width -- a few ULP of the
 *        OPERAND magnitude m (not of the ~ 0 result). This is the quantitative content of the imp-35885
 *        "small nonzero interval" assertion: interval subtraction width = width([m]) + width([g]) ~ few ULP(m).
 *   (W2) THE WIDTH IS a-INDEPENDENT (TIGHTENING, NOT a-DRIVEN INFLATION). The width RELATIVE to the operand
 *        magnitude, W(N)/m, is essentially FLAT at a few machine epsilon across the whole 1e13 .. 1e21 axis;
 *        it does NOT scale with 1/a as a(N) -> 0. The absolute width grows only because ULP(m) grows with m,
 *        the value scale -- NOT because of any a -> 0 cancellation. So the residual enclosure the certificate
 *        must bound is CHEAP and a-independent, confirming imp-35885 numerically.
 *   (W3) IT SITS FAR BELOW THE eps_mach/a dG ENVELOPE, AND THE MARGIN WIDENS. The relative width W/m stays at
 *        ~ few eps while the imp-35810 dG-node departure envelope eps_mach/a GROWS up the axis; the decades of
 *        margin WIDEN. CONTRAST: the (imp-35855-de-cancelled) dG node interval width DOES inflate -- its
 *        relative width ~ kappa_dG * eps ~ (4/a) eps DIVERGES as a -> 0. So the residual node tightens where
 *        the dG node inflated -- exactly the imp-35885 assertion, now measured.
 *
 * MEASUREMENT / surrogate ONLY on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN); reuses the imp-34774/imp-35855/imp-35885 machinery verbatim
 * (identical K, g, aOf, N_cross, axis). The outward-rounding here is a double-precision bit-level surrogate of
 * the imp-34687a directed-rounding layer, NOT that layer; it instantiates NO certified interval, ports NO
 * certificate, and does NOT discharge the F(m) = 0 residual-at-root artifact -- it only QUANTIFIES the width
 * imp-35885 asserted. The a-DEPENDENCE (flat / a-independent, far below eps/a) is the transferable finding; the
 * absolute width is surrogate-limited. imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb
 * GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35885-krawczyk-node-cancellation-audit (NODE B: asserts F(m) is a small tightening nonzero interval; never measured)
 * @see imp-35928-krawczyk-residual-at-root-envelope (measured the residual VALUE magnitude |F(m)|; this measures the enclosure WIDTH)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled the dG node kappa ~ 4/a; F(m)=0 artifact)
 * @see imp-35810-cancellation-onset-height (the eps_mach/a departure envelope for the dG node)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(N)=N-g(N); "F(m) exactly 0 in double precision"; root N_cross)
 * @see imp-34687-krawczyk-directed-rounding (the directed-rounding layer this surrogates; sub-gap imp-34687a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-35855/imp-35885)
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown on the IEEE-754 double representation -- the outward-directed rounding primitive.
const F64 = new Float64Array(1);
const I64 = new BigInt64Array(F64.buffer);
function nextUp(x) {
  if (Number.isNaN(x) || x === Infinity) return x;
  if (x === 0) { F64[0] = 0; I64[0] = 1n; return F64[0]; } // smallest positive denormal
  F64[0] = x;
  I64[0] = x > 0 ? I64[0] + 1n : I64[0] - 1n;
  return F64[0];
}
const nextDown = (x) => -nextUp(-x);
const ulpOf = (v) => Math.pow(2, Math.floor(Math.log2(Math.abs(v)))) * EPS;

// The shared imp-34774/imp-35855/imp-35885 Banach map g(N) = K log T0(N), residual F(N) = N - g(N), and the
// height-axis parameter a(N) = g-prime(N) = 2 pi K / (T0 u), u = log(T0/2pi) (identical to imp-35885 aOf).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9

// Outward-rounded interval evaluation of the residual node [F(m)] = [m] - [K log T0(m)].
// Input m is an exact point; T0 = effectiveHeightForN(m) enters as a point; the log/mult/subtract ops each
// outward-round. The returned width is what the directed-rounding LAYER would emit at this node.
function residualIntervalWidth(m) {
  const T0 = effectiveHeightForN(m); // located double-precision root (point enclosure)
  // [L] = log([T0])
  const Llo = nextDown(Math.log(T0));
  const Lhi = nextUp(Math.log(T0));
  // [G] = K * [L], K > 0 so it preserves order
  const Glo = nextDown(K_AMPL * Llo);
  const Ghi = nextUp(K_AMPL * Lhi);
  // [F] = [m] - [G]
  const Flo = nextDown(m - Ghi);
  const Fhi = nextUp(m - Glo);
  return { Flo, Fhi, width: Fhi - Flo, straddlesZero: Flo <= 0 && Fhi >= 0 };
}

// dG-node CONTRAST width surrogate (the imp-35855-de-cancelled node M_G - 1, M_G = 2G/(1+G), G = 1 - a):
// the outward-rounded near-equal subtraction M_G - 1 has RELATIVE width ~ kappa_sub * eps = (4/a) eps, which
// GROWS as a -> 0 (the textbook cancellation inflation, kappa_sub = (|M_G|+1)/|M_G-1|).
function dGRelativeWidth(a) {
  const G = 1 - a;
  const M_G = (2 * G) / (1 + G);
  const kappaSub = (Math.abs(M_G) + 1) / Math.abs(M_G - 1); // ~ 4/a
  return kappaSub * EPS; // relative interval width of the outward-rounded near-equal subtraction
}

// Sweep the SAME imp-35885 height axis a -> 0 (N = 10^13 .. 10^21).
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.25;
const SWEEP = [];
for (let L = LOG_MIN; L <= LOG_MAX + 1e-9; L += STEP) {
  const N = Math.pow(10, L);
  const a = aOf(N);
  const iv = residualIntervalWidth(N);
  const relWidth = iv.width / N; // width relative to the OPERAND magnitude m
  const envEpsOverA = EPS / a; // the imp-35810 eps_mach/a dG departure envelope reference
  SWEEP.push({
    N,
    a,
    width: iv.width,
    widthInUlpsOfM: iv.width / ulpOf(N),
    relWidth,
    envEpsOverA,
    relOverEnv: relWidth / envEpsOverA,
    straddlesZero: iv.straddlesZero,
    dGRelWidth: dGRelativeWidth(a),
  });
}
const BOTTOM = SWEEP[0]; // N ~ 1e13
const TOP = SWEEP[SWEEP.length - 1]; // N ~ 1e21, deepest a -> 0

// At the certificate CENTRE m = N_cross: the VALUE collapses to 0 but the enclosure has a small nonzero width.
const CROSS_IV = residualIntervalWidth(N_CROSS);
const WIDTH_AT_CROSS = CROSS_IV.width;
const WIDTH_AT_CROSS_IN_ULPS = WIDTH_AT_CROSS / ulpOf(N_CROSS);
const CROSS_STRADDLES_ZERO = CROSS_IV.straddlesZero;

// (W1) the enclosure width is a small NONZERO interval everywhere (a few ULP of the operand magnitude m).
const ALL_NONZERO = SWEEP.every((r) => r.width > 0) && WIDTH_AT_CROSS > 0;
const MAX_WIDTH_IN_ULPS = Math.max(...SWEEP.map((r) => r.widthInUlpsOfM));
const WIDTH_IS_SMALL_NONZERO = ALL_NONZERO && MAX_WIDTH_IN_ULPS < 16; // within a handful of ULP everywhere
// (W2) the relative width W/m is a-INDEPENDENT: flat at a few eps, NOT scaling with 1/a as a -> 0.
const MAX_REL_WIDTH = Math.max(...SWEEP.map((r) => r.relWidth));
const MIN_REL_WIDTH = Math.min(...SWEEP.map((r) => r.relWidth));
const REL_WIDTH_FLAT = MAX_REL_WIDTH < 16 * EPS && MAX_REL_WIDTH / MIN_REL_WIDTH < 8; // bounded, small dynamic range
const REL_WIDTH_NOT_1_OVER_A = TOP.relWidth < 8 * EPS; // deepest a -> 0 point still ~ few eps (no 1/a blow-up)
// (W3) it sits below the eps_mach/a dG envelope everywhere and the margin WIDENS up the axis.
const BELOW_ENVELOPE = SWEEP.every((r) => r.relWidth < r.envEpsOverA);
const MARGIN_DECADES_BOTTOM = Math.log10(BOTTOM.envEpsOverA / BOTTOM.relWidth);
const MARGIN_DECADES_TOP = Math.log10(TOP.envEpsOverA / TOP.relWidth);
const MARGIN_WIDENS = MARGIN_DECADES_TOP > MARGIN_DECADES_BOTTOM && TOP.envEpsOverA > BOTTOM.envEpsOverA;
// CONTRAST: the dG node relative width GROWS up the same axis (~ 4 eps/a) and dwarfs the residual node's flat
// relative width -- inflation, not tightening (reproduces the imp-35855 ~4/a divergence at the width level).
const DG_TO_RESIDUAL_RATIO_TOP = TOP.dGRelWidth / TOP.relWidth; // how far the dG width outgrows the residual width
const DG_WIDTH_DIVERGES = TOP.dGRelWidth > BOTTOM.dGRelWidth && DG_TO_RESIDUAL_RATIO_TOP > 1e6;

export const IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH = {
  id: 'imp-35969',
  proofSection: 'S-frontier',
  question:
    'imp-35885 (NODE B) classified the residual F(m) = m - g(m) at the certificate centre N_cross (exactly 0 ' +
    'in double precision) as the KNOWN a-independent F(m) = 0 artifact and ASSERTED a directed-rounding F(m) ' +
    'would be "a small NONZERO interval, tightening the image, not an a-driven inflation" -- but never ' +
    'QUANTIFIED that width. Measure, in a bit-level nextafter (outward-directed rounding) surrogate of the ' +
    'imp-34687a directed-rounding layer, the outward-rounded interval WIDTH of [F(m)] = [m] - [K log T0(m)] ' +
    'at m = N_cross and up the height axis N = 1e13 .. 1e21, reporting width vs a(N) and whether it stays ' +
    'bounded (tightening) rather than diverging like the dG node. Measurement only; instantiates no interval; ' +
    'ports no certificate; imp-34714a stays OPEN; NO QED.',
  finding:
    'THE OUTWARD-ROUNDED RESIDUAL ENCLOSURE WIDTH IS A SMALL NONZERO INTERVAL, a-INDEPENDENT, FAR BELOW THE ' +
    'eps_mach/a dG ENVELOPE -- imp-35885 CONFIRMED numerically. (W1) At the certificate centre m = N_cross ~ ' +
    N_CROSS.toExponential(4) +
    ', although the VALUE F(m) collapses to exactly 0, the outward-rounded [F(m)] has a small NONZERO width ~ ' +
    WIDTH_AT_CROSS.toExponential(3) +
    ' (~ ' +
    WIDTH_AT_CROSS_IN_ULPS.toFixed(2) +
    ' ULP of the operand m, straddling 0: ' +
    CROSS_STRADDLES_ZERO +
    ') -- because interval subtraction width = width([m]) + width([g]) does NOT depend on the ~ 0 result ' +
    'magnitude. (W2) Up the axis the width relative to the operand magnitude W(N)/m is FLAT at ~ ' +
    MAX_REL_WIDTH.toExponential(2) +
    ' (max, ~ ' +
    (MAX_REL_WIDTH / EPS).toFixed(1) +
    ' eps; ~ ' +
    MAX_WIDTH_IN_ULPS.toFixed(1) +
    ' ULP of m at most) across 1e13 .. 1e21; it does NOT scale with 1/a as a(N) -> 0 -- the absolute width ' +
    'grows only because ULP(m) grows with the value scale (width from ~ ' +
    BOTTOM.width.toExponential(2) +
    ' at N~1e13 to ~ ' +
    TOP.width.toExponential(2) +
    ' at N~1e21), NOT from any a -> 0 cancellation. So the residual enclosure the certificate must bound is ' +
    'CHEAP and a-independent (tightening, not inflation). (W3) The relative width sits FAR BELOW the imp-35810 ' +
    'eps_mach/a dG departure envelope (eps/a ~ ' +
    BOTTOM.envEpsOverA.toExponential(2) +
    ' at N~1e13 to ~ ' +
    TOP.envEpsOverA.toExponential(2) +
    ' at N~1e21), the decades of margin WIDENING from ~ ' +
    MARGIN_DECADES_BOTTOM.toFixed(1) +
    ' to ~ ' +
    MARGIN_DECADES_TOP.toFixed(1) +
    '. CONTRAST: the (imp-35855-de-cancelled) dG node relative width INFLATES ~ (4/a) eps, from ~ ' +
    BOTTOM.dGRelWidth.toExponential(2) +
    ' at N~1e13 to ~ ' +
    TOP.dGRelWidth.toExponential(2) +
    ' at N~1e21. So the residual node TIGHTENS where the dG node inflated -- exactly the imp-35885 assertion, ' +
    'now measured. MEASUREMENT / surrogate, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_cross: +N_CROSS.toPrecision(15),
    a_at_bottom: +BOTTOM.a.toExponential(6),
    a_at_top: +TOP.a.toExponential(6),
    machine_epsilon: EPS,
  },
  measurement: {
    // (W1) enclosure width at the certificate centre (value = 0, width nonzero)
    width_at_N_cross: +WIDTH_AT_CROSS.toExponential(4),
    width_at_N_cross_in_ulps_of_m: +WIDTH_AT_CROSS_IN_ULPS.toFixed(4),
    cross_straddles_zero: CROSS_STRADDLES_ZERO,
    // (W2) width vs the operand scale across the axis -- flat, a-independent
    width_at_bottom: +BOTTOM.width.toExponential(4),
    width_at_top: +TOP.width.toExponential(4),
    rel_width_at_bottom: +BOTTOM.relWidth.toExponential(4),
    rel_width_at_top: +TOP.relWidth.toExponential(4),
    rel_width_max_over_sweep: +MAX_REL_WIDTH.toExponential(4),
    rel_width_max_in_eps: +(MAX_REL_WIDTH / EPS).toFixed(3),
    width_max_in_ulps_of_m: +MAX_WIDTH_IN_ULPS.toFixed(4),
    // (W3) comparison to the imp-35810 eps_mach/a dG envelope, and the dG contrast
    eps_over_a_at_bottom: +BOTTOM.envEpsOverA.toExponential(4),
    eps_over_a_at_top: +TOP.envEpsOverA.toExponential(4),
    margin_decades_below_envelope_at_bottom: +MARGIN_DECADES_BOTTOM.toFixed(3),
    margin_decades_below_envelope_at_top: +MARGIN_DECADES_TOP.toFixed(3),
    dG_rel_width_at_bottom: +BOTTOM.dGRelWidth.toExponential(4),
    dG_rel_width_at_top: +TOP.dGRelWidth.toExponential(4),
    dG_to_residual_rel_width_ratio_at_top: +DG_TO_RESIDUAL_RATIO_TOP.toExponential(4),
    width_is_small_nonzero: WIDTH_IS_SMALL_NONZERO,
    rel_width_a_independent: REL_WIDTH_FLAT && REL_WIDTH_NOT_1_OVER_A,
    width_below_eps_over_a_envelope: BELOW_ENVELOPE,
    margin_below_envelope_widens: MARGIN_WIDENS,
    dG_width_diverges: DG_WIDTH_DIVERGES,
  },
  subGap:
    'imp-34714a REMAINS OPEN. The outward rounding here is a double-precision bit-level nextafter surrogate of ' +
    'the imp-34687a directed-rounding layer, NOT that layer; the absolute width is surrogate-limited (it tracks ' +
    'the surrogate op-DAG for a single node, not the full K(m) enclosure). The a-DEPENDENCE (flat / ' +
    'a-independent relative width, far below eps/a, tightening not inflating) is the transferable finding. It ' +
    'instantiates NO certified interval, ports NO operator, and does NOT discharge the F(m) = 0 residual-at-root ' +
    'artifact -- it only QUANTIFIES the width imp-35885 asserted. Bounded a-independent enclosure width is ' +
    'NECESSARY but not SUFFICIENT for a valid certificate; the full K(m) operator over the imp-34687a layer is ' +
    'not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE DIRECTED-ROUNDING WIDTH, MEASURED (frontier, NOT an RH bound). imp-35885 asserted ' +
    'the residual F(m) at N_cross (value exactly 0 in double precision) would, under directed rounding, be a ' +
    'small NONZERO interval tightening the image rather than an a-driven inflation, but never measured its ' +
    'width. Using a bit-level nextafter outward-rounding surrogate to evaluate [F(m)] = [m] - [K log T0(m)]: ' +
    '(W1) at m = N_cross the enclosure has a small NONZERO width ~ ' +
    WIDTH_AT_CROSS.toExponential(3) +
    ' (~ ' +
    WIDTH_AT_CROSS_IN_ULPS.toFixed(2) +
    ' ULP of the operand m) even though the VALUE is 0, because interval subtraction width = width([m]) + ' +
    'width([g]) is independent of the ~ 0 result; (W2) across 1e13 .. 1e21 the relative width W(N)/m is FLAT ' +
    'at ~ ' +
    MAX_REL_WIDTH.toExponential(2) +
    ' (~ ' +
    MAX_WIDTH_IN_ULPS.toFixed(1) +
    ' ULP of m), a-INDEPENDENT, NOT scaling with 1/a as a -> 0 -- the absolute width grows only with ULP(m); ' +
    '(W3) it sits FAR BELOW the imp-35810 eps_mach/a dG envelope, the margin WIDENING from ~ ' +
    MARGIN_DECADES_BOTTOM.toFixed(1) +
    ' to ~ ' +
    MARGIN_DECADES_TOP.toFixed(1) +
    ' decades, whereas the de-cancelled dG node relative width INFLATES ~ (4/a) eps to ~ ' +
    TOP.dGRelWidth.toExponential(2) +
    ' at N~1e21. So the residual node TIGHTENS where the dG node inflated, confirming imp-35885 numerically. ' +
    'MEASUREMENT / surrogate, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: a bit-level ' +
    'nextafter surrogate of the imp-34687a directed-rounding layer, not that layer; no certified interval is ' +
    'instantiated, the F(m) = 0 artifact is quantified not discharged, a-independent enclosure width is ' +
    'NECESSARY but not SUFFICIENT. Reuses the imp-34774/imp-35855/imp-35885 machinery (identical K_AMPL, g, ' +
    'aOf, N_cross, axis); C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35885 (NODE B: asserts a directed-rounding F(m) is a small tightening nonzero interval; never ' +
    'measured); imp-35928 (measured the residual VALUE magnitude |F(m)|; this measures the enclosure WIDTH); ' +
    'imp-35855 (de-cancelled the dG node kappa ~ 4/a; F(m)=0 artifact); imp-35810 (eps_mach/a dG departure ' +
    'envelope); imp-34774 ("F(m) exactly 0 in double precision"; root N_cross; directed-rounding F(m) a small ' +
    'nonzero interval); imp-34714 (Krawczyk lemma; sub-gap imp-34714a); imp-34687 (directed-rounding layer; ' +
    'sub-gap imp-34687a); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse). Bit-level nextafter outward rounding and interval-subtraction width: standard floating-point / ' +
    'interval analysis (IEEE-754, Moore, Neumaier).',
};

export const IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH_ASSERTIONS = [
  {
    // (W1) the outward-rounded enclosure width is a small NONZERO interval even where the VALUE F(m) is 0.
    id: 'imp35969-enclosure-width-is-small-nonzero',
    description: 'width([F(m)]) > 0 everywhere and at N_cross (value 0), bounded to a handful of ULP of the operand m',
    holds: () => ALL_NONZERO === true && WIDTH_IS_SMALL_NONZERO === true && CROSS_STRADDLES_ZERO === true,
  },
  {
    // (W2) the relative width W/m is a-INDEPENDENT: flat at a few eps, NOT scaling with 1/a as a -> 0.
    id: 'imp35969-relative-width-a-independent',
    description: 'relative width W(N)/m flat (< 16 eps, dynamic range < 8x) across 1e13..1e21; not a 1/a blow-up',
    holds: () => REL_WIDTH_FLAT === true && REL_WIDTH_NOT_1_OVER_A === true,
  },
  {
    // (W3) the width sits below the imp-35810 eps_mach/a dG envelope and the margin widens up the axis.
    id: 'imp35969-width-below-eps-over-a-envelope',
    description: 'relative width < eps_mach/a everywhere; decades of margin widen from bottom to top of the axis',
    holds: () => BELOW_ENVELOPE === true && MARGIN_WIDENS === true && MARGIN_DECADES_TOP > MARGIN_DECADES_BOTTOM,
  },
  {
    // CONTRAST: the de-cancelled dG node relative width DOES diverge up the same axis (tightening vs inflation).
    id: 'imp35969-dG-node-width-inflates',
    description: 'the dG-node relative width ~ (4/a) eps diverges up the same axis (>1e6 at top), unlike the residual node',
    holds: () => DG_WIDTH_DIVERGES === true && TOP.dGRelWidth > BOTTOM.dGRelWidth,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35969-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH.subGap) &&
      /NO QED/.test(IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH.verdict) &&
      /refereed bound is changed/i.test(IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH.verdict),
  },
];

for (const a of IMP35969_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_WIDTH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35969-krawczyk-residual-directed-rounding-width assertion failed: ${a.id}`);
  }
}
