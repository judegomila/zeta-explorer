/**
 * @module imp-34865-forward-vs-contraction-width-inflation
 *
 * imp-34865 (numerical, frontier): imp-34840 SCOPED the op-DAG cost of a directed-rounding interval
 * evaluation of the crossover endpoints [g](m) and [F_prime] (n_op ~ 49, sequential depth ~30, ~4 Newton
 * steps each with 3 interval divisions) and ARGUED -- without measuring -- that the flat gamma(n_op) width
 * model is faithful ONLY IF the inner Riemann-von Mangoldt inverse [T0] solve is instantiated as a
 * self-validating interval-Newton / Krawczyk CONTRACTION (width set by the final step), because naive
 * FORWARD-propagation of the input interval through the depth-30 dividing chain COMPOUNDS and can inflate
 * the width, in which case the flat gamma(n_op) bound UNDERSTATES. This module MEASURES that inflation: it
 * instantiates BOTH routes numerically with a directed-rounding surrogate (interval endpoints outward-rounded
 * by one relative EPS per elementary operation) and reports the forward-propagation-vs-contraction width
 * ratio for [T0] at N_cross, then checks whether forward-propagation crosses the imp-34799 (H2) bracket
 * margin the contraction route clears. FEASIBILITY / MEASUREMENT ONLY; does NOT instantiate the imp-34687a
 * directed-rounding layer; imp-34714a REMAINS OPEN; NO QED.
 *
 * THE TWO ROUTES (both seeded from the SAME (H2) bracket transported to T-space)
 * -----------------------------------------------------------------------------
 * The a-priori (H2) bracket is m(1 +/- delta) in N-index (delta = 2e-4). Transported through the RvM inverse
 * it is [T0](1 +/- delta) in T-space -- the common seed for both routes, so the comparison is apples-to-apples.
 *   FORWARD route: replicate the actual effectiveHeightForN recurrence as a forward interval evaluation --
 *     a=[T]/2pi, u=log(a), f=a*(u-1)-N, fp=u/2pi, dT=f/fp, [T]=[T]-dT -- for the ~4 Newton steps the op-DAG
 *     counts. Interval SUBTRACTION [T]-dT adds widths, and near the fixed point the correction interval dT has
 *     width ~ width([T]) (fp is nearly constant, so w(dT)=w(f/fp) ~ f_prime*w([T])/fp ~ w([T])). So each step
 *     roughly DOUBLES the enclosure width: the measured per-step growth factor is 2.0000 (exact to 4 dp).
 *   CONTRACTION route: the interval-Newton operator N([T]) = m - [f](m)/[f_prime]([T]) intersected with [T],
 *     where m = mid([T]) is a POINT. imp-34687 established f monotone-increasing and convex on T > 2pi, so this
 *     operator is a verified contraction to the unique T0; its enclosure width is set by the FINAL step
 *     (the point residual [f](m) width ~ few ULP, divided by fp), collapsing to ~2.9e-6 in T-units (a few ULP
 *     of T0 ~ 1.14e9) in a single step and holding there.
 *
 * THE MEASURED INFLATION (this VALIDATES the imp-34840 structural requirement quantitatively)
 * ------------------------------------------------------------------------------------------
 * From the common seed (T-width ~4.58e5, ~5.0 percent of the (H2) margin) the routes diverge sharply:
 *   - FORWARD width doubles per step: 4.58e5 -> 9.15e5 -> 1.83e6 -> 3.66e6 -> 7.32e6 (T-units) over the ~4
 *     Newton steps of the op-DAG. Mapped to the N-index endpoint image half-width (r_F = K*(w_T/2)/T0, then
 *     r_image = r_F/FP_LO) that is 3.30e4 -> ... -> 5.27e5 after 4 steps: ALREADY ~80 percent of the (H2)
 *     margin delta*N_cross ~ 6.56e5, and it Crosses the margin at step 5 (ratio 1.61). So the depth-30 chain
 *     leaves essentially no head-room and one further step OVERRUNS the bracket.
 *   - CONTRACTION width collapses to ~2.9e-6 in T-units, i.e. an N-index endpoint image half-width ~2.06e-7 --
 *     ~3.1e-13 of the (H2) margin, ~12.5 orders BELOW it (consistent with the imp-34840 ~10-orders head-room
 *     from the gamma(n_op) model).
 *   - The forward/contraction WIDTH RATIO for [T0] at N_cross (after the ~4-step chain) is ~2.56e12: forward
 *     propagation is ~12.4 orders WIDER than the contraction floor. Relative to the imp-34840 flat gamma(49)
 *     endpoint estimate (~3.7e-5), the forward-propagated half-width (~5.27e5) is ~10 orders LARGER -- exactly
 *     the "the flat gamma bound would then UNDERSTATE the width" imp-34840 warned of, now quantified.
 *
 * The doubling factor 2 is a STRUCTURAL property of interval subtraction at a Newton fixed point (the
 * correction interval width matches the iterate width), NOT an artifact of the outward-rounding surrogate --
 * the surrogate rounding contributes only the sub-ULP tail. So the qualitative verdict (forward propagation
 * compounds and crossings; contraction does not) is robust; only the exact ~2.56e12 ratio is surrogate-model
 * dependent.
 *
 * WHAT STAYS OPEN
 * --------------
 * MEASUREMENT / feasibility only on the inherited imp-3220/imp-3406 surrogate crossover map. This confirms the
 * imp-34840 structural requirement (use the inner interval-Newton contraction, NOT forward propagation) but
 * does NOT instantiate the imp-34687a directed-rounding transcendental layer (stock JS Math.log/division have
 * no directed-rounding mode; the outward-rounding here is a first-order surrogate) and does NOT discharge the
 * conditional. imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34840-krawczyk-directed-rounding-op-dag-feasibility (the op-DAG + structural requirement this MEASURES)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (a-priori gamma(n_op) width bound and (H2) margin)
 * @see imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the actual Newton loop replicated here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34799/imp-34840)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34774/imp-34799/imp-34840

// The shared imp-33723/imp-34799/imp-34840 Banach map g(N) = K log T0(N) and its closed-form g_prime.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const M = N_CROSS;
const T0 = effectiveHeightForN(M); // ~1.1437849e9 (the RvM-inverse root at N_cross)
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.954568 = Krawczyk quotient denominator floor
const BRACKET_MARGIN = DELTA * N_CROSS; // a-priori (H2) margin on each side (~6.56e5)

// --- Directed-rounding SURROGATE interval arithmetic (outward round by one relative EPS per op) ----------
// NOT the imp-34687a certified layer: a first-order outward-rounding surrogate to MEASURE width propagation.
const TINY = Number.MIN_VALUE;
const rd = (x) => (x > 0 ? x * (1 - EPS) : x * (1 + EPS)) - TINY; // round toward -inf
const ru = (x) => (x > 0 ? x * (1 + EPS) : x * (1 - EPS)) + TINY; // round toward +inf
const out = (lo, hi) => ({ lo: rd(lo), hi: ru(hi) });
const iw = (A) => A.hi - A.lo; // interval width
const imid = (A) => 0.5 * (A.lo + A.hi);
const thin = (x) => out(x, x);
const iscal = (A, c) => (c >= 0 ? out(A.lo * c, A.hi * c) : out(A.hi * c, A.lo * c));
const isub = (A, B) => out(A.lo - B.hi, A.hi - B.lo); // interval subtraction: widths ADD
const isubc = (A, c) => out(A.lo - c, A.hi - c);
const imul = (A, B) => {
  const p = [A.lo * B.lo, A.lo * B.hi, A.hi * B.lo, A.hi * B.hi];
  return out(Math.min(...p), Math.max(...p));
};
const idiv = (A, B) => {
  // assumes B does not straddle 0 (fp = log(T/2pi)/2pi > 0 on the bracket)
  const p = [A.lo / B.lo, A.lo / B.hi, A.hi / B.lo, A.hi / B.hi];
  return out(Math.min(...p), Math.max(...p));
};
const ilog = (A) => out(Math.log(A.lo), Math.log(A.hi)); // log monotone increasing

// Map a T-space enclosure half-width to the N-index endpoint image half-width (imp-34799 Krawczyk quotient).
// r_F = K * d(log T0) = K * (w_T / 2) / T0 ; r_image = r_F / FP_LO.
const toImageHalfWidth = (wT) => (K_AMPL * (wT / 2) / T0) / FP_LO;

const NEWTON_STEPS = 4; // the op-DAG Newton-step count imp-34840 read live from the source (~4 at N_cross)

// --- FORWARD route: forward interval evaluation of the Newton recurrence (widths compound) ----------------
function forwardWidths(steps) {
  let T = out(T0 * (1 - DELTA), T0 * (1 + DELTA)); // (H2) bracket transported to T-space
  const rows = [{ step: 0, wT: iw(T) }];
  for (let i = 0; i < steps; i++) {
    const a = iscal(T, 1 / TWO_PI);
    const u = ilog(a);
    const f = isub(imul(a, isubc(u, 1)), thin(M));
    const fp = iscal(u, 1 / TWO_PI);
    const dT = idiv(f, fp);
    T = isub(T, dT);
    rows.push({ step: i + 1, wT: iw(T) });
    if (!Number.isFinite(iw(T))) break;
  }
  return rows;
}

// --- CONTRACTION route: interval-Newton operator N([T]) = m - [f](m)/[f_prime]([T]) intersect [T] ---------
function contractionWidth() {
  let T = out(T0 * (1 - DELTA), T0 * (1 + DELTA)); // same seed bracket
  let wLast = iw(T);
  for (let i = 0; i < 12; i++) {
    const m = imid(T);
    const am = m / TWO_PI;
    const fm = isubc(imul(thin(am), isubc(ilog(thin(am)), 1)), M); // [f](m): POINT residual
    const fpI = iscal(ilog(iscal(T, 1 / TWO_PI)), 1 / TWO_PI); // [f_prime]([T])
    const Nop = isub(thin(m), idiv(fm, fpI));
    const lo = Math.max(T.lo, Nop.lo);
    const hi = Math.min(T.hi, Nop.hi);
    if (lo > hi) break; // empty intersection (should not happen for a valid enclosure)
    const wNew = hi - lo;
    T = { lo, hi };
    if (wNew >= wLast * (1 - 1e-15)) {
      wLast = wNew;
      break;
    } // converged to the width floor
    wLast = wNew;
  }
  return wLast;
}

const FORWARD_ROWS = forwardWidths(NEWTON_STEPS + 3); // run past the DAG depth to expose the crossing step
const SEED_WIDTH_T = FORWARD_ROWS[0].wT; // ~4.58e5 T-units
const FORWARD_WIDTH_T = FORWARD_ROWS[NEWTON_STEPS].wT; // ~7.32e6 after the ~4-step chain
const CONTRACTION_WIDTH_T = contractionWidth(); // ~2.86e-6 (few ULP of T0)

const WIDTH_RATIO = FORWARD_WIDTH_T / CONTRACTION_WIDTH_T; // ~2.56e12 (forward wider than contraction floor)

// per-step growth factor (the interval-subtraction doubling)
const PER_STEP_GROWTH = FORWARD_ROWS[NEWTON_STEPS].wT / FORWARD_ROWS[NEWTON_STEPS - 1].wT; // ~2.0000

// N-index endpoint image half-widths and their ratio to the (H2) margin.
const SEED_IMAGE_HW = toImageHalfWidth(SEED_WIDTH_T); // ~3.30e4
const FORWARD_IMAGE_HW = toImageHalfWidth(FORWARD_WIDTH_T); // ~5.27e5
const CONTRACTION_IMAGE_HW = toImageHalfWidth(CONTRACTION_WIDTH_T); // ~2.06e-7
const FORWARD_RATIO_TO_MARGIN = FORWARD_IMAGE_HW / BRACKET_MARGIN; // ~0.804 (consumes ~80% at 4 steps)
const CONTRACTION_RATIO_TO_MARGIN = CONTRACTION_IMAGE_HW / BRACKET_MARGIN; // ~3.14e-13
const CONTRACTION_HEADROOM_ORDERS = Math.log10(BRACKET_MARGIN / CONTRACTION_IMAGE_HW); // ~12.5

// The forward-propagation crossing step: first step whose image half-width exceeds the (H2) margin.
let FORWARD_BREACH_STEP = -1;
for (const r of FORWARD_ROWS) {
  if (toImageHalfWidth(r.wT) > BRACKET_MARGIN) {
    FORWARD_BREACH_STEP = r.step;
    break;
  }
}
const FORWARD_BREACHES = FORWARD_BREACH_STEP > 0; // true (crossings at step ~5)

export const IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION = {
  id: 'imp-34865',
  proofSection: 'S-frontier',
  question:
    'imp-34840 ARGUED (without measuring) that the flat gamma(n_op) width model for the directed-rounding ' +
    'endpoints [g](m) and [F_prime] is faithful ONLY IF the inner RvM-inverse [T0] solve is a self-validating ' +
    'interval-Newton contraction, because naive forward-propagation of the input interval through the depth-30 ' +
    'dividing Newton chain COMPOUNDS and can inflate the width (in which case the flat gamma bound understates). ' +
    'MEASURE it: instantiate both routes numerically (directed-rounding surrogate), report the ' +
    'forward-propagation-vs-contraction width ratio for [T0] at N_cross, and confirm whether ' +
    'forward-propagation crosses the imp-34799 (H2) bracket margin the contraction route clears. ' +
    'Feasibility / measurement only; does NOT instantiate the imp-34687a layer; imp-34714a REMAINS OPEN; no QED.',
  model: {
    routes:
      'Both routes seed from the (H2) bracket m(1 +/- delta) transported to T-space as [T0](1 +/- delta) ' +
      '(delta = 2e-4). FORWARD: forward interval evaluation of the source recurrence a=[T]/2pi, u=log(a), ' +
      'f=a*(u-1)-N, fp=u/2pi, dT=f/fp, [T]=[T]-dT for the ~4 Newton steps of the op-DAG -- interval ' +
      'subtraction adds widths, and near the fixed point w(dT) ~ w([T]), so each step DOUBLES the width. ' +
      'CONTRACTION: the interval-Newton operator N([T]) = m - [f](m)/[f_prime]([T]) intersect [T] with ' +
      'm = mid([T]) a POINT (imp-34687: f monotone+convex => verified contraction), width set by the final step.',
    inflation:
      'Measured per-step forward growth factor 2.0000 (exact interval-subtraction doubling). From the common ' +
      'seed (T-width ~4.58e5, ~5% of the (H2) margin) the forward route reaches ~7.32e6 in T-units after 4 ' +
      'steps (image half-width ~5.27e5, ~80% of the margin) and Crosses the margin at step ~5; the ' +
      'contraction route collapses to ~2.86e-6 in T-units (image half-width ~2.06e-7, ~3.1e-13 of the margin, ' +
      '~12.5 orders below). Forward/contraction width ratio for [T0] at N_cross ~2.56e12.',
    interpretation:
      'This QUANTIFIES the imp-34840 structural requirement: the flat gamma(n_op) endpoint estimate (~3.7e-5) ' +
      'is faithful ONLY for the contraction route; forward propagation is ~10 orders LARGER (~5.27e5) and ' +
      'overruns the (H2) bracket, exactly the understatement imp-34840 warned of. The doubling factor 2 is a ' +
      'structural property of interval subtraction at a Newton fixed point, not a surrogate-rounding artifact.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    T0_root: +T0.toPrecision(15), // ~1.14378491803311e9
    K: +K_AMPL.toExponential(4), // ~1.5727e8
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: +DELTA.toExponential(1), // 2e-4
    bracket_margin_each_side: +BRACKET_MARGIN.toExponential(4), // ~6.5606e5
    newton_steps: NEWTON_STEPS, // 4 (op-DAG chain length)
  },
  measured: {
    seed_width_T_units: +SEED_WIDTH_T.toExponential(4), // ~4.575e5
    forward_width_T_units_after_chain: +FORWARD_WIDTH_T.toExponential(4), // ~7.321e6
    contraction_width_T_units: +CONTRACTION_WIDTH_T.toExponential(4), // ~2.861e-6
    forward_over_contraction_width_ratio: +WIDTH_RATIO.toExponential(4), // ~2.559e12
    per_step_forward_growth_factor: +PER_STEP_GROWTH.toFixed(4), // ~2.0000
    seed_image_half_width: +SEED_IMAGE_HW.toExponential(4), // ~3.295e4
    forward_image_half_width: +FORWARD_IMAGE_HW.toExponential(4), // ~5.273e5
    contraction_image_half_width: +CONTRACTION_IMAGE_HW.toExponential(4), // ~2.061e-7
    forward_ratio_to_margin: +FORWARD_RATIO_TO_MARGIN.toExponential(4), // ~8.037e-1
    contraction_ratio_to_margin: +CONTRACTION_RATIO_TO_MARGIN.toExponential(4), // ~3.141e-13
    contraction_headroom_orders_below_margin: +CONTRACTION_HEADROOM_ORDERS.toFixed(2), // ~12.50
    forward_breach_step: FORWARD_BREACH_STEP, // ~5
    forward_breaches_margin: FORWARD_BREACHES, // true
  },
  finding:
    'Instantiating BOTH routes with a directed-rounding surrogate (outward round by one relative EPS per op) ' +
    'from the common (H2) bracket [T0](1 +/- 2e-4) at N_cross MEASURES the imp-34840 forward-propagation ' +
    'inflation directly. FORWARD interval evaluation of the effectiveHeightForN Newton recurrence DOUBLES the ' +
    'enclosure width per step (measured factor 2.0000: interval subtraction [T]-dT adds widths and near the ' +
    'fixed point w(dT) ~ w([T])), so over the ~4-step op-DAG the [T0] width grows from ~4.58e5 to ~7.32e6 in ' +
    'T-units. Mapped to the N-index endpoint image half-width that is ~5.27e5 -- ALREADY ~80% of the (H2) ' +
    'margin ~6.56e5, and it Crosses the margin at step ~5 (ratio ~1.61). The CONTRACTION route (interval-' +
    'Newton operator with intersection, per imp-34687) instead collapses the width to ~2.86e-6 in T-units ' +
    '(image half-width ~2.06e-7, ~3.1e-13 of the margin, ~12.5 orders below, consistent with the imp-34840 ' +
    '~10-orders gamma(n_op) head-room). The forward/contraction width ratio for [T0] at N_cross is ~2.56e12, ' +
    'and the forward-propagated half-width is ~10 orders LARGER than the imp-34840 flat gamma(49) estimate ' +
    '(~3.7e-5) -- exactly the "flat gamma bound would UNDERSTATE" warning, now quantified. So the structural ' +
    'requirement is CONFIRMED: only the inner interval-Newton contraction keeps the endpoints inside (H2); ' +
    'naive forward-propagation overruns the bracket. Measurement only; does NOT instantiate the imp-34687a ' +
    'directed-rounding layer; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This MEASURES (via a first-order outward-rounding surrogate, NOT the imp-34687a ' +
    'certified transcendental layer) that forward-propagation compounds the [T0] width ~2.56e12x over the ' +
    'contraction floor and crosses the (H2) margin, while the interval-Newton contraction clears it by ' +
    '~12.5 orders. It does NOT instantiate the directed-rounding layer and does NOT prove the endpoints ARE ' +
    'valid enclosures -- it confirms the imp-34840 structural requirement that the contraction route (not ' +
    'forward-propagation) is the one under which the flat gamma(n_op) bound is faithful. Feasibility ' +
    'EVIDENCE, not a certificate. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'FORWARD-VS-CONTRACTION WIDTH INFLATION (frontier, NOT an RH bound). imp-34840 ARGUED the flat gamma(n_op) ' +
    'endpoint width model is faithful ONLY under an inner interval-Newton CONTRACTION, since naive forward-' +
    'propagation through the depth-30 dividing chain compounds; it never measured this. Instantiating both ' +
    'routes with a directed-rounding surrogate from the common (H2) bracket [T0](1 +/- 2e-4) at N_cross: the ' +
    'FORWARD route DOUBLES the enclosure width per step (measured factor 2.0000 -- interval subtraction adds ' +
    'widths, w(dT) ~ w([T]) near the fixed point), growing [T0] from ~4.58e5 to ~7.32e6 in T-units over the ' +
    '~4-step op-DAG; the N-index image half-width reaches ~5.27e5 (~80% of the (H2) margin ~6.56e5) and ' +
    'Crosses the margin at step ~5. The CONTRACTION route (interval-Newton operator + intersection, imp-34687 ' +
    'f monotone+convex) collapses the width to ~2.86e-6 in T-units (image half-width ~2.06e-7, ~3.1e-13 of the ' +
    'margin, ~12.5 orders below). Forward/contraction [T0] width ratio ~2.56e12, and the forward half-width is ' +
    '~10 orders LARGER than the imp-34840 flat gamma(49) estimate (~3.7e-5) -- exactly the understatement it ' +
    'warned of. So the structural requirement is CONFIRMED quantitatively: only the inner contraction keeps ' +
    'the endpoints inside (H2). The doubling factor 2 is structural (interval subtraction at a Newton fixed ' +
    'point), not a surrogate-rounding artifact; only the exact ratio is surrogate-model dependent. FEASIBILITY ' +
    '/ MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the ' +
    'imp-34687a directed-rounding layer; SUB-GAP imp-34714a REMAINS OPEN. The C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34840 (op-DAG feasibility + the structural requirement this MEASURES); imp-34799 (a-priori ' +
    'gamma(n_op) width bound and (H2) margin); imp-34687 (f monotone+convex => inner interval-Newton is a ' +
    'verified contraction; sub-gap imp-34687a directed-rounding layer); imp-34714 (Krawczyk existence-' +
    'uniqueness lemma; sub-gap imp-34714a); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ' +
    'ansatz); lambda-rh-height-mapping (effectiveHeightForN, the Newton loop replicated here). Interval ' +
    'subtraction adds widths; forward interval-Newton diverges without the mean-value/Krawczyk form + ' +
    'intersection: Moore, Neumaier, Higham.',
};

export const IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION_ASSERTIONS = [
  {
    // Forward interval evaluation DOUBLES the enclosure width per Newton step (interval subtraction adds widths).
    id: 'imp34865-forward-per-step-doubling',
    description: 'forward interval-Newton width grows by ~2x per step (interval subtraction [T]-dT adds widths)',
    holds: () => PER_STEP_GROWTH > 1.9 && PER_STEP_GROWTH < 2.1,
  },
  {
    // The forward route inflates [T0] by many orders over the contraction floor after the ~4-step op-DAG chain.
    id: 'imp34865-forward-over-contraction-ratio-huge',
    description: 'forward/contraction [T0] width ratio at N_cross is ~2.56e12 (forward >> contraction floor)',
    holds: () =>
      FORWARD_WIDTH_T > CONTRACTION_WIDTH_T &&
      WIDTH_RATIO > 1e11 &&
      WIDTH_RATIO < 1e14 &&
      CONTRACTION_WIDTH_T > 0 &&
      Number.isFinite(FORWARD_WIDTH_T),
  },
  {
    // Forward propagation Crosses the (H2) margin; the contraction route clears it by ~12.5 orders.
    id: 'imp34865-forward-breaches-contraction-clears',
    description: 'forward image half-width crosses the (H2) margin (at step ~5); contraction clears by ~12.5 orders',
    holds: () =>
      FORWARD_BREACHES &&
      FORWARD_BREACH_STEP >= 4 &&
      FORWARD_BREACH_STEP <= 6 &&
      FORWARD_RATIO_TO_MARGIN > 0.5 && // already ~80% of the margin at the 4-step chain
      FORWARD_RATIO_TO_MARGIN < 1 &&
      CONTRACTION_RATIO_TO_MARGIN < 1e-11 &&
      CONTRACTION_HEADROOM_ORDERS > 11 &&
      CONTRACTION_HEADROOM_ORDERS < 14,
  },
  {
    // Honesty gate: measurement/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34865-honesty-gate-no-qed',
    description: 'width-inflation measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION.isRigorous === false &&
      /imp-34714a/.test(IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION.subGap) &&
      /REMAINS OPEN/.test(IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION.subGap) &&
      /NO QED/.test(IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION.verdict) &&
      /refereed bound is changed/i.test(IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION.verdict),
  },
];

for (const a of IMP34865_FORWARD_VS_CONTRACTION_WIDTH_INFLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34865-forward-vs-contraction-width-inflation assertion failed: ${a.id}`);
  }
}
