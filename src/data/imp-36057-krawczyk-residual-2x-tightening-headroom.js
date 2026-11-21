/**
 * @module imp-36057-krawczyk-residual-2x-tightening-headroom
 *
 * ASSESSMENT / DIAGNOSTIC ONLY. imp-36017 measured that the imp-35969 bit-level nextafter OUTWARD-ROUNDING
 * surrogate OVER-estimates the Krawczyk residual-node enclosure width of [F(m)] = [m] - [K log T0(m)] by a
 * clean factor converging to exactly 2x versus an a-priori correctly-rounded directed-rounding LAYER model,
 * and flagged that the imp-34687a layer that would realize that tightening is unimplemented (imp-34714a
 * OPEN). This module quantifies what that 2x width reduction concretely BUYS toward a MACHINE certificate of
 * the residual node at N_cross: does halving the residual-node width move any verified-height or
 * safety-factor margin, or is the residual node already so far from binding (a-independent, few-ULP, per
 * imp-35969) that the 2x is immaterial?
 *
 * WHAT "2x TIGHTENING" IS, DIMENSIONALLY
 * --------------------------------------
 * A factor-of-two reduction in an enclosure width is, on a log axis, a UNIFORM downward shift of exactly
 * log10(2) ~ 0.30103 DECADES, a-INDEPENDENTLY (imp-36017 D3: the surrogate/layer ratio is flat ~1.84..2.00,
 * not 1/a). So the entire margin-headroom the 2x can ever buy on the residual channel is 0.30 decades. The
 * question is whether 0.30 decades matters against the separations that actually govern a machine
 * certificate.
 *
 * THREE MARGINS A MACHINE CERTIFICATE DEPENDS ON, AND WHAT THE 2x MOVES
 * --------------------------------------------------------------------
 *   (H1) RESIDUAL-NODE MARGIN BELOW THE dG DEPARTURE ENVELOPE (imp-35969). The residual-node relative width
 *        is a-independent ~2 eps; the de-cancelled dG-node relative width kappa_dG * eps ~ (4/a) eps
 *        INFLATES as a(N) -> 0 up the axis. imp-35969 found the residual node sits FAR BELOW the dG envelope
 *        with the margin WIDENING up the axis. Measured here in decades: the margin is ~D_bottom at N = 1e13
 *        and ~D_top at N = 1e21 (D_top > D_bottom). Halving the residual width ADDS exactly log10(ratio) ~
 *        0.30 decades to that margin -- a few-percent nudge on a multi-decade, WIDENING separation. IMMATERIAL.
 *
 *   (H2) dG-NODE VACUITY HEIGHT (imp-36044) -- THE BINDING CHANNEL. The certificate goes vacuous when the
 *        dG-node relative width reaches O(1), at log10(N*) ~ 23.24 (a* = 4 eps), ~10 orders in T ABOVE the
 *        Platt-Trudgian verified zero height. The 2x tightening imp-36017 measured is on the RESIDUAL node;
 *        it does NOT enter the dG-node width, so it moves the binding vacuity height by EXACTLY ZERO. Even in
 *        the BEST case -- applying the same 2x to the dG node itself (its width halves, so vacuity slips from
 *        kappa_dG eps ~ 1 to ~ 2, i.e. a* : 4 eps -> 2 eps) -- the vacuity height moves up by only ~
 *        DELTA_VACUITY_DECADES decades, still ~10 orders above the verified height. IMMATERIAL.
 *
 *   (H3) THE imp-34687 CONTRACTION / EDGE WALLS (L < 1, g(a) >= a). imp-34687 scoped the interval-arithmetic
 *        upgrade of the crossover and found it FEASIBLE and NOT margin-limited: L sits ~0.85 below the L < 1
 *        wall (~10^15x slack) and g(a) sits ~2.1e9 above the g(a) >= a wall. Those walls are bounded by the
 *        VALUE margins, not by the residual-node enclosure WIDTH; the 2x width reduction does not enter them,
 *        so it moves them by EXACTLY ZERO.
 *
 * WHAT THE ASSESSMENT FINDS
 * -------------------------
 *   (A1) THE 2x IS A UNIFORM log10(2) ~ 0.30 DECADE SHIFT, a-INDEPENDENT. That is the total width headroom it
 *        can ever buy on the residual channel.
 *   (A2) THE RESIDUAL NODE IS NOT THE BINDING CHANNEL. It sits many decades below the dG departure envelope
 *        (margin WIDENING up the axis), so the 0.30-decade gain is a few-percent nudge on a separation that
 *        is already growing far faster; the residual-node relative width is a-INDEPENDENT and never reaches
 *        vacuity at all. IMMATERIAL to any verified-height margin.
 *   (A3) THE 2x MOVES THE BINDING dG-NODE VACUITY HEIGHT BY ZERO (it is on the residual node); even applied
 *        to the dG node itself it slips the vacuity height by only ~ DELTA_VACUITY_DECADES decades, leaving
 *        it ~10 orders in T above the Platt-Trudgian verified zero height. IMMATERIAL to the safety factor.
 *
 * CONSEQUENCE (assessment, not a certificate): halving the residual-node width buys NO usable headroom
 * toward a machine certificate. The residual node is a-independent and few-ULP (imp-35969) -- it is not the
 * channel that binds; the binding channel is the a-driven dG-node vacuity (imp-36044), which the residual-node
 * 2x does not touch, and which even a hypothetical 2x on the dG node would move by only ~0.3 decades far above
 * the verified height. The genuine gap toward a machine certificate is UNCHANGED: the imp-34687a
 * directed-rounding layer is still unimplemented and imp-34714a is still OPEN. The 2x is a correctness nicety
 * of the width MODEL, not a lever on any bound.
 *
 * ASSESSMENT / surrogate ONLY on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN); reuses the imp-36017/imp-35969/imp-36044 machinery verbatim
 * (identical K_AMPL, g, N_cross, aOf, kappaDG, nextUp/nextDown, axis). No interval is instantiated; no
 * operator is ported; the F(m) = 0 residual-at-root artifact is NOT discharged; halving a non-binding width
 * is NECESSARY at most, never SUFFICIENT. imp-34714a AND imp-34687a REMAIN OPEN; C_C = 1/8 (imp-2642/2643)
 * and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator positivity; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (the 2x surrogate-over-layer width factor this weighs)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (residual node a-independent few-ULP, far below the dG envelope)
 * @see imp-36044-krawczyk-dG-node-vacuity-height (the binding a-driven vacuity height log10 N* ~ 23.24)
 * @see imp-34687-crossover-interval-arithmetic-scope (contraction/edge walls FEASIBLE, NOT margin-limited; sub-gap imp-34687a)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (K_AMPL, g, aOf, N_cross; F(m) exactly 0 in double precision)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (Krawczyk lemma; sub-gap imp-34714a OPEN)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-36017/imp-35969/imp-36044)
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown (imp-35969/imp-36017 outward-rounding primitive), verbatim.
const F64 = new Float64Array(1);
const I64 = new BigInt64Array(F64.buffer);
function nextUp(x) {
  if (Number.isNaN(x) || x === Infinity) return x;
  if (x === 0) { F64[0] = 0; I64[0] = 1n; return F64[0]; }
  F64[0] = x;
  I64[0] = x > 0 ? I64[0] + 1n : I64[0] - 1n;
  return F64[0];
}
const nextDown = (x) => -nextUp(-x);
const ulpOf = (v) => Math.pow(2, Math.floor(Math.log2(Math.abs(v)))) * EPS;

// Shared imp-36017/imp-34774 Banach map and located crossover fixed point.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435e9

// (A) SURROGATE residual-node width (imp-35969 nextafter, verbatim); (B) LAYER width (imp-36017 correctly-rounded).
function surrogateWidth(m) {
  const T0 = effectiveHeightForN(m);
  const Llo = nextDown(Math.log(T0));
  const Lhi = nextUp(Math.log(T0));
  const Glo = nextDown(K_AMPL * Llo);
  const Ghi = nextUp(K_AMPL * Lhi);
  const Flo = nextDown(m - Ghi);
  const Fhi = nextUp(m - Glo);
  return Fhi - Flo;
}
function layerWidth(m) {
  const T0 = effectiveHeightForN(m);
  const L = Math.log(T0);
  const wL = ulpOf(L);
  const G = K_AMPL * L;
  const wG = K_AMPL * wL + ulpOf(G);
  const F = m - G;
  const wF = wG + (F === 0 ? 0 : ulpOf(F));
  return wF;
}

// imp-36044 dG-node channel: a(N) height parameter and the de-cancelled dG relative width kappa_dG * eps ~ (4/a) eps.
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
const kappaDG = (a) => {
  const G = 1 - a;
  const M_G = (2 * G) / (1 + G);
  return (Math.abs(M_G) + 1) / Math.abs(M_G - 1);
};

// (A1) the 2x tightening is a uniform log10(2) decade shift, a-independent.
const TIGHTEN_DECADES = Math.log10(2); // ~0.30103 -- the total width headroom a 2x can ever buy

// (H1) residual-node margin below the dG departure envelope, in decades, at the axis endpoints, before/after halving.
function marginDecades(N, widthFn) {
  const dgRel = kappaDG(aOf(N)) * EPS; // dG-node relative width envelope
  const resRel = widthFn(N) / N; // residual-node relative width
  return Math.log10(dgRel / resRel); // decades the residual node sits BELOW the dG envelope
}
const N_BOTTOM = 1e13; // imp-35969 axis bottom ~ Platt-Trudgian verified height
const N_TOP = 1e21; // imp-35969 axis top
const MARGIN_BOTTOM_SURR = marginDecades(N_BOTTOM, surrogateWidth);
const MARGIN_TOP_SURR = marginDecades(N_TOP, surrogateWidth);
const MARGIN_BOTTOM_LAYER = marginDecades(N_BOTTOM, layerWidth);
const MARGIN_TOP_LAYER = marginDecades(N_TOP, layerWidth);
// The gain the 2x buys on the residual margin = log10(surrogate/layer ratio) ~ log10(2) at the top.
const MARGIN_GAIN_BOTTOM = MARGIN_BOTTOM_LAYER - MARGIN_BOTTOM_SURR;
const MARGIN_GAIN_TOP = MARGIN_TOP_LAYER - MARGIN_TOP_SURR;
// Fraction of the (widening) separation the 2x gain represents -- a few-percent nudge.
const GAIN_FRACTION_TOP = MARGIN_GAIN_TOP / MARGIN_TOP_LAYER;

// (H2) binding dG-node vacuity height, surrogate (a = 4 eps) vs a hypothetical 2x-tightened dG node (a = 2 eps).
function findNforA(targetA) {
  // a(N) is monotone DECREASING in N; bisect on log10(N).
  let lo = 21;
  let hi = 25;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (aOf(Math.pow(10, mid)) > targetA) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const LOG10_N_VACUITY_SURR = findNforA(4 * EPS); // ~23.24 (imp-36044)
const LOG10_N_VACUITY_LAYER = findNforA(2 * EPS); // dG node halved => tolerate 2x-larger kappa => a halves
const DELTA_VACUITY_DECADES = LOG10_N_VACUITY_LAYER - LOG10_N_VACUITY_SURR; // how far a BEST-case 2x slips vacuity
const T_VACUITY_SURR = effectiveHeightForN(Math.pow(10, LOG10_N_VACUITY_SURR));
const T_PHYSICAL = effectiveHeightForN(N_BOTTOM); // ~3e12 Platt-Trudgian verified zero height
const DECADES_T_ABOVE_PHYSICAL = Math.log10(T_VACUITY_SURR / T_PHYSICAL);

// Validation flags.
const TIGHTEN_IS_LOG2 = Math.abs(TIGHTEN_DECADES - 0.30103) < 1e-4;
// Residual margin far exceeds the tightening, and WIDENS up the axis -- 2x is a few-percent nudge, not a lever.
const RESIDUAL_FAR_BELOW_ENVELOPE = MARGIN_BOTTOM_SURR > 4 && MARGIN_TOP_SURR > MARGIN_BOTTOM_SURR;
const GAIN_IMMATERIAL = MARGIN_GAIN_TOP < 0.302 && GAIN_FRACTION_TOP < 0.05;
// Even a BEST-case 2x on the binding dG node slips the vacuity height by ~0.3 decades and stays far above verified height.
const VACUITY_SHIFT_SMALL = DELTA_VACUITY_DECADES > 0.2 && DELTA_VACUITY_DECADES < 0.45;
const VACUITY_FAR_ABOVE_PHYSICAL = DECADES_T_ABOVE_PHYSICAL > 5;

export const IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM = {
  id: 'imp-36057',
  proofSection: 'S-frontier',
  question:
    'imp-36017 found the imp-35969 nextafter surrogate OVER-estimates the Krawczyk residual-node enclosure ' +
    'width by a factor converging to exactly 2x versus an a-priori correctly-rounded directed-rounding LAYER, ' +
    'but flagged that the imp-34687a layer realizing that tightening is unimplemented and imp-34714a is OPEN. ' +
    'Quantify what the 2x width reduction concretely buys toward a MACHINE certificate of the residual node ' +
    'at N_cross: does halving the residual-node width move any verified-height or safety-factor margin, or is ' +
    'the residual node already so far from binding (a-independent, few-ULP per imp-35969) that the 2x is ' +
    'immaterial? Assessment only; no interval instantiated; no bound changed; imp-34714a stays OPEN; NO QED.',
  finding:
    'THE 2x TIGHTENING IS IMMATERIAL: HALVING THE RESIDUAL-NODE WIDTH MOVES NO VERIFIED-HEIGHT OR SAFETY-FACTOR ' +
    'MARGIN. (A1) A factor of two is a UNIFORM log10(2) ~ ' +
    TIGHTEN_DECADES.toFixed(4) +
    ' DECADE downward shift of the width, a-INDEPENDENT (imp-36017 D3) -- that 0.30 decades is the TOTAL ' +
    'headroom the 2x can ever buy. (A2) The residual node is NOT the binding channel: it sits ~ ' +
    MARGIN_BOTTOM_SURR.toFixed(1) +
    ' decades below the imp-35969 dG departure envelope at N = 1e13, WIDENING to ~ ' +
    MARGIN_TOP_SURR.toFixed(1) +
    ' decades at N = 1e21 (its relative width is a-INDEPENDENT ~2 eps and never reaches vacuity), so the 2x ' +
    'gain of ~ ' +
    MARGIN_GAIN_TOP.toFixed(3) +
    ' decades is only ~ ' +
    (GAIN_FRACTION_TOP * 100).toFixed(1) +
    '% of a separation that is already growing far faster. (A3) The 2x is on the RESIDUAL node, so it moves the ' +
    'BINDING imp-36044 dG-node vacuity height (log10 N* ~ ' +
    LOG10_N_VACUITY_SURR.toFixed(2) +
    ', ~ ' +
    DECADES_T_ABOVE_PHYSICAL.toFixed(1) +
    ' orders in T ABOVE the Platt-Trudgian verified zero height) by EXACTLY ZERO; even a hypothetical 2x on ' +
    'the dG node itself slips that vacuity height up by only ~ ' +
    DELTA_VACUITY_DECADES.toFixed(3) +
    ' decades, still far above the verified height. The imp-34687 contraction/edge walls (L < 1, g(a) >= a) ' +
    'are VALUE-margin-bounded, not width-bounded, so the 2x moves them by zero too. CONSEQUENCE: the 2x buys ' +
    'NO usable headroom toward a machine certificate; the genuine gap (imp-34687a layer unimplemented, ' +
    'imp-34714a OPEN) is UNCHANGED. ASSESSMENT / surrogate, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_cross: +N_CROSS.toPrecision(15),
    machine_epsilon: EPS,
    tighten_decades_log10_2: +TIGHTEN_DECADES.toFixed(6),
  },
  measurement: {
    // (A1) the 2x is a uniform log10(2) decade shift
    tighten_decades: +TIGHTEN_DECADES.toFixed(6),
    tighten_is_a_independent: true, // imp-36017 D3 (ratio flat, not 1/a)
    // (A2) residual-node margin below the dG envelope, before/after halving, and the gain fraction
    residual_margin_decades_at_bottom_surrogate: +MARGIN_BOTTOM_SURR.toFixed(4),
    residual_margin_decades_at_top_surrogate: +MARGIN_TOP_SURR.toFixed(4),
    residual_margin_decades_at_bottom_layer: +MARGIN_BOTTOM_LAYER.toFixed(4),
    residual_margin_decades_at_top_layer: +MARGIN_TOP_LAYER.toFixed(4),
    margin_gain_from_2x_at_bottom: +MARGIN_GAIN_BOTTOM.toFixed(4),
    margin_gain_from_2x_at_top: +MARGIN_GAIN_TOP.toFixed(4),
    gain_fraction_of_separation_at_top: +GAIN_FRACTION_TOP.toFixed(6),
    // (A3) binding dG-node vacuity height, surrogate vs best-case-2x, and its distance above the verified height
    log10_N_vacuity_surrogate: +LOG10_N_VACUITY_SURR.toFixed(4),
    log10_N_vacuity_best_case_2x: +LOG10_N_VACUITY_LAYER.toFixed(4),
    vacuity_shift_decades_best_case: +DELTA_VACUITY_DECADES.toFixed(4),
    residual_2x_moves_vacuity_by: 0, // the 2x is on the residual node, not the dG node
    T_decades_vacuity_above_verified_height: +DECADES_T_ABOVE_PHYSICAL.toFixed(4),
    // verdict flags
    tighten_is_log2: TIGHTEN_IS_LOG2,
    residual_far_below_envelope: RESIDUAL_FAR_BELOW_ENVELOPE,
    gain_immaterial: GAIN_IMMATERIAL,
    vacuity_shift_small: VACUITY_SHIFT_SMALL,
    vacuity_far_above_physical: VACUITY_FAR_ABOVE_PHYSICAL,
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. This assessment weighs the imp-36017 2x width factor against the ' +
    'imp-35969 residual-node margin and the imp-36044 dG-node vacuity height on the double-precision surrogate ' +
    'maps; it instantiates NO certified interval, ports NO operator, and does NOT discharge the F(m) = 0 ' +
    'residual-at-root artifact. Finding the 2x immaterial is a statement about a non-binding width, not a ' +
    'certificate -- halving a non-binding width is at most NECESSARY, never SUFFICIENT. The machine certificate ' +
    'still requires the imp-34687a directed-rounding layer (unimplemented; JS has no directed-rounding mode) ' +
    'and the imp-34714a Krawczyk lemma (OPEN). Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE 2x-TIGHTENING HEADROOM, ASSESSED (frontier, NOT an RH bound). imp-36017 measured ' +
    'the imp-35969 nextafter surrogate over-estimates the residual-node width by a clean 2x versus a ' +
    'correctly-rounded directed-rounding LAYER, but never quantified what that buys. This assessment finds the ' +
    '2x IMMATERIAL to a machine certificate: (A1) a factor of two is a uniform log10(2) ~ ' +
    TIGHTEN_DECADES.toFixed(4) +
    ' decade downward width shift, a-INDEPENDENT -- 0.30 decades is the whole headroom it can buy; (A2) the ' +
    'residual node sits ~ ' +
    MARGIN_BOTTOM_SURR.toFixed(1) +
    ' decades below the imp-35969 dG departure envelope at N = 1e13, WIDENING to ~ ' +
    MARGIN_TOP_SURR.toFixed(1) +
    ' decades at N = 1e21 (its relative width is a-independent ~2 eps, never vacuous), so the 2x gain of ~ ' +
    MARGIN_GAIN_TOP.toFixed(3) +
    ' decades is only ~ ' +
    (GAIN_FRACTION_TOP * 100).toFixed(1) +
    '% of an already-widening separation; (A3) the 2x is on the residual node, so it moves the BINDING ' +
    'imp-36044 dG-node vacuity height (log10 N* ~ ' +
    LOG10_N_VACUITY_SURR.toFixed(2) +
    ', ~ ' +
    DECADES_T_ABOVE_PHYSICAL.toFixed(1) +
    ' orders in T above the verified zero height) by EXACTLY ZERO, and even a hypothetical 2x on the dG node ' +
    'itself slips vacuity up by only ~ ' +
    DELTA_VACUITY_DECADES.toFixed(3) +
    ' decades; the imp-34687 contraction/edge walls are value-margin-bounded, not width-bounded, so the 2x ' +
    'moves them by zero. CONSEQUENCE: halving the residual-node width buys NO usable headroom toward a machine ' +
    'certificate; the binding channel is the a-driven dG-node vacuity, which the residual 2x does not touch. ' +
    'ASSESSMENT / surrogate, NOT a machine certificate. SUB-GAPS imp-34714a AND imp-34687a REMAIN OPEN: no ' +
    'certified interval is instantiated, the F(m) = 0 artifact is not discharged, halving a non-binding width ' +
    'is NECESSARY at most, never SUFFICIENT. Reuses the imp-36017/imp-35969/imp-36044 machinery (identical ' +
    'K_AMPL, g, N_cross, aOf, kappaDG, nextUp/nextDown, axis); C_C = 1/8 (imp-2642/2643) and C_mb ' +
    'GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-36017 (residual-node surrogate over-estimates the directed-rounding layer by a clean 2x); imp-35969 ' +
    '(residual node a-independent few-ULP, far below the dG departure envelope); imp-36044 (binding dG-node ' +
    'vacuity height log10 N* ~ 23.24, ~10 orders in T above the verified height); imp-34687 (crossover ' +
    'interval-arithmetic scope; walls FEASIBLE and NOT margin-limited; sub-gap imp-34687a unimplemented); ' +
    'imp-34774 (K_AMPL, g, aOf, N_cross; F(m) exactly 0 in double precision); imp-34714 (Krawczyk lemma; ' +
    'sub-gap imp-34714a OPEN); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse). Enclosure-width / decade accounting and interval-arithmetic condition-number vacuity: standard ' +
    'floating-point / interval analysis (IEEE-754, Moore, Neumaier).',
};

export const IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM_ASSERTIONS = [
  {
    // (A1) the 2x is a uniform log10(2) ~ 0.30 decade width shift, a-independent.
    id: 'imp36057-2x-is-log2-decade-shift',
    description: 'a factor of two is a uniform log10(2) ~ 0.30103 decade width shift (a-independent per imp-36017 D3)',
    holds: () => TIGHTEN_IS_LOG2 === true,
  },
  {
    // (A2) the residual node sits many decades below the dG envelope (widening), so the 2x gain is a few-percent nudge.
    id: 'imp36057-residual-not-binding-2x-immaterial',
    description: 'residual node > 4 decades below dG envelope and WIDENING; 2x gain < 0.302 decades and < 5% of the separation',
    holds: () => RESIDUAL_FAR_BELOW_ENVELOPE === true && GAIN_IMMATERIAL === true,
  },
  {
    // (A3) the 2x moves the binding dG-node vacuity height by ~0.3 decades at best, far above the verified height.
    id: 'imp36057-vacuity-height-barely-moves',
    description: 'best-case 2x on the dG node slips vacuity by ~0.3 decades; vacuity stays > 5 orders in T above verified height',
    holds: () => VACUITY_SHIFT_SMALL === true && VACUITY_FAR_ABOVE_PHYSICAL === true,
  },
  {
    // Honesty gate: assessment / surrogate, not rigorous, sub-gaps open, no interval, no QED, no refereed bound is changed.
    id: 'imp36057-honesty-gate-no-qed',
    description: 'assessment: isRigorous false, imp-34714a/imp-34687a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM.subGap) &&
      /at most NECESSARY, never SUFFICIENT/.test(IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM.subGap) &&
      /NO QED/.test(IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM.verdict) &&
      /refereed bound is changed/i.test(IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM.verdict),
  },
];

for (const a of IMP36057_KRAWCZYK_RESIDUAL_2X_TIGHTENING_HEADROOM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36057-krawczyk-residual-2x-tightening-headroom assertion failed: ${a.id}`);
  }
}
