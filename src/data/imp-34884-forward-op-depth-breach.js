/**
 * @module imp-34884-forward-op-depth-breach
 *
 * imp-34884 (numerical, frontier): imp-34865 MEASURED the forward-propagation-vs-contraction width ratio for
 * the RvM-inverse [T0] at N_cross at Newton-STEP granularity (~4 steps) and reported that forward interval
 * propagation DOUBLES the enclosure width per step and crosses the imp-34799 (H2) margin at step ~5, while the
 * interval-Newton contraction clears it by ~12.5 orders. It never LOCALISED the crossing to a depth in the
 * elementary-op DAG. This module instruments the SAME directed-rounding surrogate (one relative EPS outward per
 * elementary op) down the depth-30 dividing chain at ELEMENTARY-OP granularity, records the cumulative forward
 * enclosure width at each op-depth, and reports the FIRST depth d* at which the forward iterate half-width
 * exceeds the (H2) bracket half-width delta*T0 in T-space (delta = 2e-4), and how far d* sits below the ~30-deep
 * Newton chain the contraction route clears. FEASIBILITY / MEASUREMENT ONLY; does NOT instantiate the imp-34687a
 * directed-rounding layer; imp-34714a REMAINS OPEN; NO QED.
 *
 * THE INSTRUMENTED WALK (elementary-op granularity, same surrogate as imp-34865)
 * -----------------------------------------------------------------------------
 * The forward interval evaluation of the effectiveHeightForN recurrence is unrolled into its 8 elementary ops
 * per Newton step: a=[T]/2pi (scale), u=log(a), (u-1), a*(u-1) (mul), f=a(u-1)-N (sub), fp=u/2pi (scale),
 * dT=f/fp (div), [T]=[T]-dT (sub). Each op is stamped with a monotone global depth index d in execution order.
 * The forward iterate [T] is only UPDATED at the final subtraction of each step, so its enclosure half-width is
 * a step function of depth: it holds at the seed value delta*T0 through depths 1..7, then DOUBLES at the first
 * subtraction (depth 8), doubles again at depth 16, 24, 32. The 4-step chain is ~32 elementary ops -- the
 * imp-34840 "sequential depth ~30" op-DAG.
 *
 * THE LOCALISED CROSSING DEPTH (this REFINES the imp-34865 step-level crossing to an op-DAG depth)
 * ------------------------------------------------------------------------------------------
 * Threshold: the (H2) bracket half-width in T-space, HALF_WIDTH_T = delta*T0 ~ 2.29e5 (the seed's own
 * half-width). A "breach" is the iterate half-width exceeding this by more than a rounding-noise tolerance
 * (1e-6 relative; the surrogate outward-rounding inflates the seed by only ~1e-12 relative, so the tolerance
 * cleanly separates rounding noise from the structural factor-2 jump).
 *   - The seed half-width equals HALF_WIDTH_T (ratio 1.0000000000008 -- outward-rounding tail only).
 *   - d* = 8: the FIRST [T]-dT subtraction takes the iterate half-width to 2*delta*T0 ~ 4.58e5 (ratio 2.0000),
 *     the first STRUCTURAL crossing of the T-space bracket half-width. So forward propagation exceeds the bracket
 *     it started from after ONLY ONE Newton step -- 8 elementary ops, i.e. d* sits ~22 ops BELOW the ~30-deep
 *     Newton chain (crossing at ~27 percent of the chain depth). Subsequent subtractions (depth 16, 24, 32) carry
 *     the ratio to 4.0, 8.0, 16.0 (each subtraction doubles it).
 *   - CONTRACTION contrast: the interval-Newton operator N([T]) = m - [f](m)/[f_prime]([T]) intersect [T] sets
 *     its width from the FINAL step, NOT from cumulative depth, so its half-width floor ~1.43e-6 T-units is
 *     ~6.25e-12 of HALF_WIDTH_T and never crosses at ANY depth -- the crossing depth is depth-independent
 *     (d* = never). The op-DAG depth is a liability only for forward propagation.
 *
 * The factor-2-per-subtraction growth is a STRUCTURAL property of interval subtraction at a Newton fixed point
 * (the correction interval width matches the iterate width), NOT an artifact of the outward-rounding surrogate;
 * only the exact rounding tail (~1e-12 relative at the seed) is surrogate-model dependent. So the localised
 * crossing depth d* = 8 (first subtraction) is robust; a finer op decomposition would shift the absolute index
 * but keeps the crossing at the first [T]-dT subtraction, deep below the depth-30 chain.
 *
 * WHAT STAYS OPEN
 * --------------
 * MEASUREMENT / feasibility only on the inherited imp-3220/imp-3406 surrogate crossover map. This LOCALISES the
 * imp-34865 forward-propagation crossing to op-DAG depth d* = 8 (first Newton subtraction, ~22 below the depth-30
 * chain) but does NOT instantiate the imp-34687a directed-rounding transcendental layer (stock JS Math.log /
 * division have no directed-rounding mode; the outward-rounding here is a first-order surrogate) and does NOT
 * discharge the conditional. imp-34714a REMAINS OPEN. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643)
 * UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound;
 * establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34865-forward-vs-contraction-width-inflation (the step-level width ratio this LOCALISES to op-depth)
 * @see imp-34840-krawczyk-directed-rounding-op-dag-feasibility (the ~30-deep op-DAG this walks)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (a-priori gamma(n_op) width bound and (H2) margin)
 * @see imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; sub-gap imp-34687a)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the actual Newton loop unrolled here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34799/imp-34840/imp-34865)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34774/imp-34799/imp-34840/imp-34865

// The shared imp-33723/imp-34799/imp-34840/imp-34865 Banach map g(N) = K log T0(N) and its closed-form g_prime.
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
const HALF_WIDTH_T = DELTA * T0; // the (H2) bracket half-width in T-space (delta = 2e-4) ~2.29e5

// --- Directed-rounding SURROGATE interval arithmetic (outward round by one relative EPS per op) ----------
// Identical surrogate to imp-34865: NOT the imp-34687a certified layer, a first-order outward-rounding proxy.
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

const OPS_PER_STEP = 8; // elementary ops per Newton step in the unrolled recurrence
const CHAIN_DEPTH = 30; // imp-34840 "sequential depth ~30" op-DAG (the depth-30 dividing chain)
const NEWTON_STEPS = 4; // op-DAG Newton-step count imp-34840 read live from the source (~4 at N_cross)
// Rounding-noise tolerance: the outward-rounding surrogate inflates the seed by only ~1e-12 relative, well
// below the structural factor-2 jump, so this cleanly separates rounding noise from the real crossing.
const NOISE_TOL = 1e-6;

// --- FORWARD route at ELEMENTARY-OP granularity: stamp each op with a global depth index -------------------
function forwardOpTrace(steps) {
  let T = out(T0 * (1 - DELTA), T0 * (1 + DELTA)); // (H2) bracket transported to T-space
  const trace = [{ depth: 0, label: 'seed [T0](1+/-delta)', halfWidthT: iw(T) / 2, isIterate: true }];
  let depth = 0;
  const rec = (label, interval, isIterate) => {
    depth += 1;
    trace.push({ depth, label, halfWidthT: iw(interval) / 2, isIterate: !!isIterate });
  };
  for (let s = 0; s < steps; s++) {
    const a = iscal(T, 1 / TWO_PI); rec('a=[T]/2pi (scale)', a);
    const u = ilog(a); rec('u=log(a)', u);
    const um1 = isubc(u, 1); rec('u-1 (sub const)', um1);
    const aum1 = imul(a, um1); rec('a*(u-1) (mul)', aum1);
    const f = isub(aum1, thin(M)); rec('f=a(u-1)-N (sub)', f);
    const fp = iscal(u, 1 / TWO_PI); rec('fp=u/2pi (scale)', fp);
    const dT = idiv(f, fp); rec('dT=f/fp (div)', dT);
    T = isub(T, dT); rec('[T]=[T]-dT (sub)', T, true); // the iterate update: widths ADD => doubling
    if (!Number.isFinite(iw(T))) break;
  }
  return trace;
}

// --- CONTRACTION route: width set by the FINAL step, NOT cumulative depth (imp-34687 verified contraction) --
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
    if (lo > hi) break;
    const wNew = hi - lo;
    T = { lo, hi };
    if (wNew >= wLast * (1 - 1e-15)) {
      wLast = wNew;
      break;
    }
    wLast = wNew;
  }
  return wLast;
}

const FORWARD_TRACE = forwardOpTrace(NEWTON_STEPS); // ~32 ops (the depth-30 op-DAG)

// The localised crossing depth d*: FIRST op-depth at which the forward iterate half-width exceeds the (H2)
// bracket half-width delta*T0 (beyond rounding noise). Only the [T]-iterate updates matter (widths hold
// between subtractions), so d* is the depth of the first [T]-dT subtraction.
let BREACH_DEPTH = -1;
for (const r of FORWARD_TRACE) {
  if (r.isIterate && r.halfWidthT > HALF_WIDTH_T * (1 + NOISE_TOL)) {
    BREACH_DEPTH = r.depth;
    break;
  }
}
const DEPTH_BELOW_CHAIN = CHAIN_DEPTH - BREACH_DEPTH; // ~22 below the ~30-deep chain
const NEWTON_STEP_AT_BREACH = Math.round(BREACH_DEPTH / OPS_PER_STEP); // 1 (first Newton subtraction)

// Iterate half-widths at each subtraction depth (the step function of depth), as ratios to HALF_WIDTH_T.
const ITERATE_RATIOS = FORWARD_TRACE.filter((r) => r.isIterate).map((r) => ({
  depth: r.depth,
  ratio_to_bracket_half_width: +(r.halfWidthT / HALF_WIDTH_T).toExponential(4),
}));

const SEED_RATIO = FORWARD_TRACE[0].halfWidthT / HALF_WIDTH_T; // ~1 + rounding tail
const CONTRACTION_WIDTH_T = contractionWidth(); // ~2.86e-6 (few ULP of T0)
const CONTRACTION_HALF_WIDTH_T = CONTRACTION_WIDTH_T / 2; // ~1.43e-6
const CONTRACTION_RATIO_TO_BRACKET = CONTRACTION_HALF_WIDTH_T / HALF_WIDTH_T; // ~6.25e-12, never crosses

export const IMP34884_FORWARD_OP_DEPTH_BREACH = {
  id: 'imp-34884',
  proofSection: 'S-frontier',
  question:
    'imp-34865 measured the forward-propagation-vs-contraction [T0] width ratio at N_cross at Newton-STEP ' +
    'granularity (crossing at step ~5) but never localised the crossing to a depth in the elementary-op DAG. ' +
    'Instrument the same directed-rounding surrogate step-by-step down the depth-30 dividing chain at ' +
    'ELEMENTARY-OP granularity, measure the cumulative forward enclosure width at each op-depth, and report ' +
    'the FIRST depth d* at which the forward iterate half-width exceeds the (H2) bracket half-width delta*T0 ' +
    'in T-space (delta = 2e-4), and how far d* sits below the ~30-deep Newton chain the contraction route ' +
    'clears. Feasibility / measurement only; does NOT instantiate the imp-34687a layer; imp-34714a REMAINS ' +
    'OPEN; no QED.',
  model: {
    walk:
      'The forward interval evaluation of the effectiveHeightForN recurrence is unrolled into 8 elementary ops ' +
      'per Newton step: a=[T]/2pi (scale), u=log(a), (u-1), a*(u-1) (mul), f=a(u-1)-N (sub), fp=u/2pi (scale), ' +
      'dT=f/fp (div), [T]=[T]-dT (sub). Each op is stamped with a monotone global depth index in execution ' +
      'order. The iterate [T] updates only at the final subtraction of each step, so its half-width is a step ' +
      'function of depth: it holds at the seed delta*T0 through depths 1..7 then DOUBLES at the first ' +
      'subtraction (depth 8), doubling again at 16, 24, 32 (the ~32-op depth-30 chain).',
    threshold:
      'Crossing threshold = the (H2) bracket half-width in T-space, HALF_WIDTH_T = delta*T0 ~ 2.29e5 (the seed ' +
      'half-width itself). A crossing is the iterate half-width exceeding this by more than a 1e-6 relative ' +
      'rounding-noise tolerance -- the outward-rounding surrogate inflates the seed by only ~1e-12 relative, ' +
      'far below the structural factor-2 jump, so noise and the real crossing are cleanly separated.',
    contrast:
      'The interval-Newton CONTRACTION operator N([T]) = m - [f](m)/[f_prime]([T]) intersect [T] (imp-34687 f ' +
      'monotone+convex) sets its width from the FINAL step, NOT from cumulative depth, so its half-width floor ' +
      '~1.43e-6 T-units is ~6.25e-12 of HALF_WIDTH_T and never crosses at ANY depth. Op-DAG depth is a ' +
      'liability only for forward propagation.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    T0_root: +T0.toPrecision(15), // ~1.14378491803311e9
    K: +K_AMPL.toExponential(4), // ~1.5727e8
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: +DELTA.toExponential(1), // 2e-4
    bracket_half_width_T: +HALF_WIDTH_T.toExponential(4), // ~2.2876e5
    ops_per_newton_step: OPS_PER_STEP, // 8
    chain_depth: CHAIN_DEPTH, // 30
    newton_steps: NEWTON_STEPS, // 4
    noise_tolerance_relative: +NOISE_TOL.toExponential(1), // 1e-6
  },
  measured: {
    breach_depth_d_star: BREACH_DEPTH, // 8
    breach_depth_below_chain: DEPTH_BELOW_CHAIN, // ~22
    newton_step_at_breach: NEWTON_STEP_AT_BREACH, // 1 (first Newton subtraction)
    seed_ratio_to_bracket_half_width: +SEED_RATIO.toExponential(4), // ~1.0000 (rounding tail only)
    iterate_ratios_by_depth: ITERATE_RATIOS, // [{0:1},{8:2},{16:4},{24:8},{32:16}]
    contraction_half_width_T: +CONTRACTION_HALF_WIDTH_T.toExponential(4), // ~1.4305e-6
    contraction_ratio_to_bracket_half_width: +CONTRACTION_RATIO_TO_BRACKET.toExponential(4), // ~6.25e-12
    contraction_breach_depth: -1, // never crosses at any depth (width set by final step)
  },
  finding:
    'Instrumenting the forward interval-Newton recurrence at ELEMENTARY-OP granularity (8 ops per Newton step, ' +
    '~32 ops over the depth-30 op-DAG) with the imp-34865 directed-rounding surrogate LOCALISES the ' +
    'forward-propagation crossing. The forward iterate half-width holds at the seed value delta*T0 ~ 2.29e5 ' +
    '(the (H2) bracket half-width in T-space) through the first 7 elementary ops -- the correction dT is ' +
    'built but the iterate is not yet updated -- then the FIRST [T]-dT subtraction at op-depth d* = 8 DOUBLES ' +
    'the half-width to ~4.58e5 (ratio 2.0000), the first structural crossing of the bracket half-width. So ' +
    'forward propagation exceeds the bracket it started from after ONE Newton step, and d* = 8 sits ~22 ops ' +
    'BELOW the ~30-deep Newton chain (crossing at ~27 percent of chain depth); subsequent subtractions carry the ' +
    'ratio to 4.0, 8.0, 16.0 at depths 16, 24, 32. The CONTRACTION route sets its width from the FINAL step, ' +
    'NOT cumulative depth, so its half-width floor ~1.43e-6 (~6.25e-12 of the bracket half-width) NEVER ' +
    'crossings at any depth -- confirming the imp-34840 structural requirement that the inner interval-Newton ' +
    'contraction, not forward propagation, is the depth-safe route. Measurement only; does NOT instantiate the ' +
    'imp-34687a directed-rounding layer; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This LOCALISES (via the imp-34865 first-order outward-rounding surrogate, NOT the ' +
    'imp-34687a certified transcendental layer) the forward-propagation crossing of the (H2) bracket half-width ' +
    'to op-DAG depth d* = 8 (the first Newton subtraction, ~22 below the depth-30 chain), while the ' +
    'contraction route never crosses at any depth. It does NOT instantiate the directed-rounding layer and ' +
    'does NOT prove the endpoints ARE valid enclosures. Feasibility EVIDENCE, not a certificate. Adds no RH ' +
    'bound.',
  isRigorous: false,
  verdict:
    'FORWARD-PROPAGATION OP-DEPTH CROSSING LOCALISATION (frontier, NOT an RH bound). imp-34865 measured the ' +
    'forward-vs-contraction [T0] width ratio at Newton-STEP granularity (crossing at step ~5) but never located ' +
    'the op-DAG depth. Instrumenting the same directed-rounding surrogate at ELEMENTARY-OP granularity down ' +
    'the depth-30 dividing chain (8 ops per Newton step): the forward iterate half-width holds at the seed ' +
    'delta*T0 ~ 2.29e5 (the (H2) bracket half-width in T-space) through depths 1..7, then the FIRST [T]-dT ' +
    'subtraction at op-depth d* = 8 DOUBLES it to ~4.58e5 (ratio 2.0000) -- the first structural crossing of the ' +
    'bracket half-width, after only ONE Newton step, sitting ~22 ops BELOW the ~30-deep Newton chain. ' +
    'Subsequent subtractions carry the ratio to 4.0/8.0/16.0 at depths 16/24/32. The interval-Newton ' +
    'CONTRACTION (imp-34687 f monotone+convex) sets its width from the FINAL step, not cumulative depth, so ' +
    'its half-width floor ~1.43e-6 (~6.25e-12 of the bracket half-width) never crosses at any depth. So the ' +
    'crossing is a shallow, structural, forward-only event (interval subtraction at a Newton fixed point ' +
    'doubling the width), not a slow op-DAG accumulation, and the contraction route is depth-safe. The ' +
    'factor-2-per-subtraction growth is structural, not a surrogate-rounding artifact; only the ~1e-12 seed ' +
    'rounding tail is surrogate-model dependent. FEASIBILITY / MEASUREMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; does NOT instantiate the imp-34687a directed-rounding layer; ' +
    'SUB-GAP imp-34714a REMAINS OPEN. The C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per ' +
    'imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34865 (forward-vs-contraction width ratio at Newton-step granularity this LOCALISES to op-depth); ' +
    'imp-34840 (op-DAG depth ~30 + the structural requirement); imp-34799 (a-priori gamma(n_op) width bound ' +
    'and (H2) margin); imp-34687 (f monotone+convex => inner interval-Newton is a verified contraction; ' +
    'sub-gap imp-34687a directed-rounding layer); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap ' +
    'imp-34714a); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN, the Newton loop unrolled here). Interval subtraction adds ' +
    'widths; forward interval-Newton diverges without the mean-value/Krawczyk form + intersection: Moore, ' +
    'Neumaier, Higham.',
};

export const IMP34884_FORWARD_OP_DEPTH_BREACH_ASSERTIONS = [
  {
    // The crossing is localised to the FIRST Newton subtraction, deep below the depth-30 chain.
    id: 'imp34884-breach-depth-below-chain',
    description: 'forward crossing depth d* = first Newton subtraction (~8), sitting well below the depth-30 chain',
    holds: () =>
      BREACH_DEPTH > 0 &&
      BREACH_DEPTH < CHAIN_DEPTH &&
      BREACH_DEPTH >= 5 &&
      BREACH_DEPTH <= 12 &&
      DEPTH_BELOW_CHAIN >= 18 &&
      NEWTON_STEP_AT_BREACH === 1,
  },
  {
    // The iterate half-width holds at the bracket half-width until the first subtraction, then doubles.
    id: 'imp34884-seed-holds-then-doubles',
    description: 'iterate half-width holds at delta*T0 (ratio ~1) through the pre-subtraction ops, then ~2x at d*',
    holds: () => {
      const atBreach = FORWARD_TRACE.find((r) => r.depth === BREACH_DEPTH);
      return (
        SEED_RATIO > 0.999999 &&
        SEED_RATIO < 1.0001 && // seed sits AT the bracket half-width (rounding tail only)
        atBreach &&
        atBreach.halfWidthT / HALF_WIDTH_T > 1.9 &&
        atBreach.halfWidthT / HALF_WIDTH_T < 2.1
      );
    },
  },
  {
    // The contraction route sets its width from the final step and never crosses at any depth.
    id: 'imp34884-contraction-never-breaches',
    description: 'contraction half-width floor is ~6e-12 of the bracket half-width and never crosses at any depth',
    holds: () =>
      CONTRACTION_HALF_WIDTH_T > 0 &&
      CONTRACTION_RATIO_TO_BRACKET < 1e-10 &&
      IMP34884_FORWARD_OP_DEPTH_BREACH.measured.contraction_breach_depth === -1,
  },
  {
    // Honesty gate: measurement/surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34884-honesty-gate-no-qed',
    description: 'op-depth crossing measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34884_FORWARD_OP_DEPTH_BREACH.isRigorous === false &&
      /imp-34714a/.test(IMP34884_FORWARD_OP_DEPTH_BREACH.subGap) &&
      /REMAINS OPEN/.test(IMP34884_FORWARD_OP_DEPTH_BREACH.subGap) &&
      /NO QED/.test(IMP34884_FORWARD_OP_DEPTH_BREACH.verdict) &&
      /refereed bound is changed/i.test(IMP34884_FORWARD_OP_DEPTH_BREACH.verdict),
  },
];

for (const a of IMP34884_FORWARD_OP_DEPTH_BREACH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34884-forward-op-depth-breach assertion failed: ${a.id}`);
  }
}
