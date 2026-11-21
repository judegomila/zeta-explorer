/**
 * @module imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. imp-36017 measured the surrogate-over-layer enclosure-width RATIO
 * W_surr/W_layer of the Krawczyk residual node [F(m)] = [m] - [K log T0(m)] and reported it as
 * "a-INDEPENDENT ~2x" (imp-36066 records the same clean a-independent 2x). But imp-36017 swept the
 * HEIGHT axis (N = 1e13 .. 1e21) at a POINT input -- it never actually varied the certificate half-width
 * a (the radius of the candidate box [X] = [N_cross - a, N_cross + a] the Krawczyk test brackets). Its
 * "a-independent" claim meant only "the ratio does NOT scale as 1/a / does NOT blow up as a -> 0". This
 * module tests the stronger reading directly: sweep a across a fine geometric grid at a FIXED height and
 * measure whether the 2x factor HOLDS at every a or DRIFTS with the certificate half-width.
 *
 * THE INTERVAL-INPUT RESIDUAL NODE (same op-DAG, box input of half-width a)
 * ------------------------------------------------------------------------
 * With [X] = [m0 - a, m0 + a] the node evaluates op-by-op on the interval endpoints. Both width models
 * inherit the IDENTICAL real-math PROPAGATED-INPUT width -- the input box contributes ~ 2a directly to
 * the final subtraction F = m - G, plus K*(log T0(mhi) - log T0(mlo)) ~ K*(T0'/T0)*2a through the product.
 * The two models differ ONLY in the per-operation rounding slack: the imp-35969 nextafter SURROGATE pushes
 * BOTH endpoints one ULP outward at every op (~2 ULP/op); the a-priori correctly-rounded directed LAYER
 * brackets each exact result between adjacent representables (~1 ULP/op). So, schematically,
 *     W_surr  ~  W_prop(a) + slack_surr ,   W_layer ~ W_prop(a) + slack_layer ,   slack_surr ~ 2*slack_layer
 * and the ratio W_surr/W_layer interpolates between slack_surr/slack_layer (~2, the imp-36017 point limit)
 * when W_prop(a) is at the ULP floor, and 1 when the SHARED W_prop(a) swamps the slack gap.
 *
 * WHAT THE FINER a-GRID FINDS (at m0 = N_cross ~ 3.28e9, and cross-checked at N = 1e13, 1e17)
 * -----------------------------------------------------------------------------------------
 *   (F1) THE 2x FACTOR IS THE a -> 0 TIGHT-CERTIFICATE LIMIT ONLY. For a below the local rounding-slack
 *        scale (~5e-7 at N_cross) the ratio pins to the imp-36017 recorded POINT value ~1.8418 (2.0000 at
 *        the high-N end); it does not exceed the 2x ceiling.
 *   (F2) THE RATIO DRIFTS -- IT IS NOT a-INDEPENDENT ACROSS FINITE a. It decays STRICTLY MONOTONICALLY
 *        toward EXACTLY 1.0 as a grows (1.842 -> 1.30 at a=1e-6 -> 1.05 at a=1e-5 -> 1.005 at a=1e-4 ->
 *        ~1.000 for a >= 1e-2 at N_cross), because the a-proportional propagated-input width 2a(1 + g') is
 *        IDENTICAL in surrogate and layer and dilutes the per-op rounding-slack gap to nothing.
 *   (F3) THE CROSSOVER HALF-WIDTH SCALES WITH ULP(N). At N_cross the drift begins near a ~ 5e-7; at
 *        N = 1e17 (ULP ~ 16) the ratio still reads ~2.0 out to a ~ 1e3 and only then decays. So the 2x
 *        survives to LARGER a at greater height -- it is a fixed rounding-primitive property visible only
 *        while the certificate box is at the ULP floor of its height, NOT a global constant of a.
 *
 * REFINEMENT OF imp-36066: the "clean a-independent ~2x" is the a -> 0 (point / ULP-floor) reading and is
 * correct in THAT sense (the ratio is bounded and flat as a -> 0, it never scales as 1/a). It is NOT a
 * global a-independence: for any macroscopic certificate half-width a >> ULP(N) the shared propagated-input
 * width dominates and the surrogate and layer widths coincide (ratio -> 1). Nothing imp-36017/imp-36066
 * concluded is threatened -- the surrogate stays a CONSERVATIVE upper model at every a (ratio >= 1) -- the
 * "2x conservatism headroom" simply shrinks to zero as the box widens.
 *
 * MEASUREMENT / surrogate ONLY on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN); reuses the imp-36017/imp-35969 machinery verbatim
 * (identical K_AMPL, g, N_cross, nextUp/nextDown, the a-priori correctly-rounded LAYER formula). The LAYER
 * width is an a-priori correctly-rounded directed-rounding MODEL, NOT the imp-34687a layer (which remains
 * unimplemented); it instantiates NO certified interval, ports NO operator, and does NOT discharge the
 * F(m) = 0 residual-at-root artifact. imp-34714a and imp-34687a REMAIN OPEN; C_C = 1/8 (imp-2642/2643) and
 * C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (source: the point-input surrogate/layer sweep and the 2x claim)
 * @see imp-36066-residual-node-no-machine-certificate-honest-status (records the "a-independent 2x" this refines)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE machinery reused here)
 * @see imp-34687-crossover-interval-arithmetic-scope (directed-rounding layer scope; sub-gap imp-34687a unimplemented)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (Krawczyk lemma; sub-gap imp-34714a open; a = candidate-box half-width)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-36017/imp-35969)
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

// Shared imp-36017/imp-34774 Banach map g(N) = K log T0(N) and the located crossover fixed point N_cross.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435e9

// (A) SURROGATE width of the INTERVAL-input residual node [F([X])], [X] = [m0-a, m0+a]. imp-35969
// nextafter outward rounding on the interval endpoints (a = 0 recovers the imp-36017 point surrogate).
function surrogateWidth(m0, a) {
  const mlo = m0 - a;
  const mhi = m0 + a;
  const T0lo = effectiveHeightForN(mlo);
  const T0hi = effectiveHeightForN(mhi); // T0 is monotone increasing in N
  const Llo = nextDown(Math.log(T0lo));
  const Lhi = nextUp(Math.log(T0hi));
  const Glo = nextDown(K_AMPL * Llo);
  const Ghi = nextUp(K_AMPL * Lhi);
  const Flo = nextDown(mlo - Ghi);
  const Fhi = nextUp(mhi - Glo);
  return Fhi - Flo;
}

// (B) LAYER width: a-priori correctly-rounded directed-rounding MODEL of the SAME op-DAG on the box input.
// Propagate the real interval width op-by-op and add one ULP of directed rounding per result (a = 0
// recovers the imp-36017 point layer). This is the TIGHTEST width the imp-34687a layer could emit.
function layerWidth(m0, a) {
  const mlo = m0 - a;
  const mhi = m0 + a;
  const Llo = Math.log(effectiveHeightForN(mlo));
  const Lhi = Math.log(effectiveHeightForN(mhi));
  const wL = (Lhi - Llo) + ulpOf(Math.max(Math.abs(Llo), Math.abs(Lhi))); // propagated + 1 ULP
  const G = K_AMPL * ((Llo + Lhi) / 2);
  const wG = K_AMPL * wL + ulpOf(G); // K * operand width + 1 ULP of the product
  const wIn = mhi - mlo; // = 2a, the input box propagated straight through the subtraction
  const F = m0 - G;
  const wF = wIn + wG + (F === 0 ? 0 : ulpOf(F)); // subtraction: propagate widths + 1 ULP
  return wF;
}

// Fine geometric a-grid at m0 = N_cross: a = 0 then 10^-12 .. 10^2 in quarter-decade steps.
const A_LOG_MIN = -12;
const A_LOG_MAX = 2;
const A_STEP = 0.25;
const A_GRID = [0];
for (let e = A_LOG_MIN; e <= A_LOG_MAX + 1e-9; e += A_STEP) A_GRID.push(Math.pow(10, e));

const SWEEP = A_GRID.map((a) => {
  const wSurr = surrogateWidth(N_CROSS, a);
  const wLayer = layerWidth(N_CROSS, a);
  return { a, wSurr, wLayer, ratio: wSurr / wLayer };
});

const RATIO_AT_ZERO = SWEEP[0].ratio; // a -> 0 tight-certificate limit (should reproduce imp-36017 ~1.8418)
const RATIO_AT_A1 = SWEEP.find((r) => Math.abs(r.a - 1) < 1e-12).ratio; // a = 1 (macroscopic box)
const MIN_RATIO = Math.min(...SWEEP.map((r) => r.ratio));
const MAX_RATIO = Math.max(...SWEEP.map((r) => r.ratio));

// (F2) monotone non-increasing in a (small tolerance for float noise near the a=0 ULP-floor plateau).
const RATIO_MONOTONE_DOWN = SWEEP.every((r, i, arr) => i === 0 || r.ratio <= arr[i - 1].ratio + 1e-9);
// (F2) the ratio DRIFTS: full-grid spread is large (NOT a-independent across finite a).
const RATIO_DRIFTS = MAX_RATIO - MIN_RATIO > 0.5;
// (F1) never exceeds the 2x ceiling; (conservatism) never drops below 1 (surrogate stays an upper model).
const RATIO_BOUNDED = MIN_RATIO > 1 - 1e-9 && MAX_RATIO <= 2 + 1e-9;

// Located crossover half-width a_half at N_cross: where the ratio falls to (ratio(0) + 1)/2.
const RATIO_HALF = (RATIO_AT_ZERO + 1) / 2;
const A_HALF = SWEEP.filter((r) => r.a > 0 && r.ratio >= RATIO_HALF).map((r) => r.a).pop() || 0;

// (F3) cross-check at higher heights: the crossover half-width scales up with ULP(N).
const CHECK_HEIGHTS = [1e13, 1e17];
const HEIGHT_CROSSOVER = CHECK_HEIGHTS.map((N) => {
  const ratioZero = surrogateWidth(N, 0) / layerWidth(N, 0);
  const half = (ratioZero + 1) / 2;
  // smallest a on a coarse decade grid at which the ratio has fallen below the local half point
  let aHalf = 0;
  for (let e = -6; e <= 12; e += 1) {
    const a = Math.pow(10, e);
    if (surrogateWidth(N, a) / layerWidth(N, a) < half) { aHalf = a; break; }
  }
  return { N, ratioZero, ulp: ulpOf(N), aHalf };
});
// a_half rises with height: 1e17 crossover half-width strictly exceeds the 1e13 one.
const CROSSOVER_SCALES_WITH_ULP =
  HEIGHT_CROSSOVER[1].aHalf > HEIGHT_CROSSOVER[0].aHalf && HEIGHT_CROSSOVER[1].ulp > HEIGHT_CROSSOVER[0].ulp;

// A few representative rungs of the N_cross a-grid, for the record.
const rungAt = (target) => {
  const r = SWEEP.reduce((best, x) =>
    Math.abs(Math.log10(x.a || 1e-300) - Math.log10(target)) <
    Math.abs(Math.log10(best.a || 1e-300) - Math.log10(target)) ? x : best);
  return { a: +r.a.toExponential(2), ratio: +r.ratio.toFixed(6) };
};

export const IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE = {
  id: 'imp-36153',
  proofSection: 'S-frontier',
  question:
    'imp-36017 measured the Krawczyk residual-node surrogate-over-layer width ratio W_surr/W_layer for ' +
    '[F(m)] = [m] - [K log T0(m)] and reported it as "a-INDEPENDENT ~2x" (imp-36066 records the same), but ' +
    'that sweep varied the HEIGHT axis at a POINT input and never varied the certificate half-width a. ' +
    'Sweep a across a fine geometric grid at fixed height and measure whether the 2x factor HOLDS at every ' +
    'a or DRIFTS with the box half-width. Measurement only; instantiates no interval; imp-34714a/imp-34687a ' +
    'stay OPEN; NO QED.',
  finding:
    'THE 2x FACTOR IS THE a -> 0 TIGHT-CERTIFICATE LIMIT ONLY -- IT IS NOT a-INDEPENDENT ACROSS FINITE a. ' +
    '(F1) At m0 = N_cross (~' +
    N_CROSS.toExponential(4) +
    ') the ratio pins to the imp-36017 point value ~' +
    RATIO_AT_ZERO.toFixed(4) +
    ' for a below the local rounding-slack scale (~' +
    A_HALF.toExponential(1) +
    '), never exceeding the 2x ceiling. (F2) It then DRIFTS: the ratio decays STRICTLY MONOTONICALLY toward ' +
    'EXACTLY 1.0 as a grows (a=1e-6: ~' +
    rungAt(1e-6).ratio.toFixed(3) +
    ', a=1e-5: ~' +
    rungAt(1e-5).ratio.toFixed(3) +
    ', a=1e-4: ~' +
    rungAt(1e-4).ratio.toFixed(4) +
    ', a=1: ~' +
    RATIO_AT_A1.toFixed(4) +
    '), because the a-proportional propagated-input width 2a(1 + g′) is IDENTICAL in surrogate and layer ' +
    'and dilutes the per-op rounding-slack gap. Full-grid spread ~' +
    (MAX_RATIO - MIN_RATIO).toFixed(2) +
    ' (a real drift, NOT flat). (F3) The crossover half-width SCALES WITH ULP(N): at N=1e13 the ratio only ' +
    'falls below its half point near a~' +
    HEIGHT_CROSSOVER[0].aHalf.toExponential(0) +
    ', at N=1e17 (ULP~' +
    HEIGHT_CROSSOVER[1].ulp.toExponential(0) +
    ') near a~' +
    HEIGHT_CROSSOVER[1].aHalf.toExponential(0) +
    ' -- so the 2x survives to LARGER a at greater height. REFINEMENT: imp-36066 "a-independent 2x" is the ' +
    'a -> 0 / ULP-floor reading (bounded, never 1/a) and is correct THERE; it is not a global a-invariance. ' +
    'The surrogate stays a CONSERVATIVE upper model at every a (ratio >= 1); its 2x conservatism headroom ' +
    'simply shrinks to zero as the box widens. MEASUREMENT / surrogate, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_cross: +N_CROSS.toPrecision(15),
    machine_epsilon: EPS,
    a_grid_points: A_GRID.length,
  },
  measurement: {
    ratio_at_a_zero: +RATIO_AT_ZERO.toFixed(6), // reproduces imp-36017 point value ~1.8418
    ratio_at_a_1: +RATIO_AT_A1.toFixed(6),
    ratio_min_over_grid: +MIN_RATIO.toFixed(6),
    ratio_max_over_grid: +MAX_RATIO.toFixed(6),
    ratio_grid_spread: +(MAX_RATIO - MIN_RATIO).toFixed(6),
    crossover_half_width_at_N_cross: +A_HALF.toExponential(3),
    rung_a_1em6: rungAt(1e-6),
    rung_a_1em5: rungAt(1e-5),
    rung_a_1em4: rungAt(1e-4),
    rung_a_1em2: rungAt(1e-2),
    ratio_monotone_down_in_a: RATIO_MONOTONE_DOWN,
    ratio_drifts_not_a_independent: RATIO_DRIFTS,
    ratio_bounded_1_to_2: RATIO_BOUNDED,
    crossover_scales_with_ulp: CROSSOVER_SCALES_WITH_ULP,
    height_crossovers: HEIGHT_CROSSOVER.map((h) => ({
      N: +h.N.toExponential(0),
      ratio_at_a_zero: +h.ratioZero.toFixed(6),
      ulp: +h.ulp.toExponential(3),
      crossover_half_width: +h.aHalf.toExponential(3),
    })),
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. The LAYER width is an a-priori correctly-rounded ' +
    'directed-rounding MODEL of the residual node, NOT the imp-34687a layer (which JS lacks and which is ' +
    'unimplemented); the surrogate is the imp-35969 bit-level nextafter proxy. This measures how the ratio ' +
    'of two double-precision MODELS varies with the candidate-box half-width a, not a machine value. It ' +
    'instantiates NO certified interval, ports NO operator, and does NOT discharge the F(m) = 0 ' +
    'residual-at-root artifact. That the surrogate stays a conservative upper model at every a (ratio >= 1) ' +
    'is NECESSARY but not SUFFICIENT for a valid certificate; the full K(m) operator over a real ' +
    'directed-rounding layer is not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE SURROGATE-OVER-LAYER RATIO a-DEPENDENCE, MEASURED (frontier, NOT an RH bound). ' +
    'imp-36017/imp-36066 reported the ratio W_surr/W_layer of [F(m)] = [m] - [K log T0(m)] as ' +
    '"a-independent ~2x", but from a HEIGHT sweep at a POINT input -- the certificate half-width a was ' +
    'never varied. Sweeping a on a fine geometric grid at fixed height: (F1) the 2x/1.84x factor is the ' +
    'a -> 0 TIGHT-CERTIFICATE limit only, pinned to the imp-36017 point value ~' +
    RATIO_AT_ZERO.toFixed(4) +
    ' at N_cross for a below the ~' +
    A_HALF.toExponential(1) +
    ' rounding-slack scale; (F2) the ratio DRIFTS -- it decays STRICTLY MONOTONICALLY to EXACTLY 1.0 as a ' +
    'grows (grid spread ~' +
    (MAX_RATIO - MIN_RATIO).toFixed(2) +
    '), because the a-proportional propagated-input width 2a(1 + g′) is IDENTICAL in surrogate and layer ' +
    'and dilutes the per-op rounding-slack gap; (F3) the crossover half-width SCALES WITH ULP(N) (a~' +
    HEIGHT_CROSSOVER[0].aHalf.toExponential(0) +
    ' at N=1e13 vs a~' +
    HEIGHT_CROSSOVER[1].aHalf.toExponential(0) +
    ' at N=1e17), so the 2x survives to larger a at greater height. REFINEMENT of imp-36066: the ' +
    '"a-independent 2x" is the a -> 0 / ULP-floor reading (bounded, never 1/a) and is correct THERE, but it ' +
    'is NOT a global a-invariance; the surrogate stays a CONSERVATIVE upper model at every a (ratio >= 1) ' +
    'while its 2x conservatism headroom shrinks to zero as the box widens. MEASUREMENT / surrogate, NOT a ' +
    'machine certificate. SUB-GAPS imp-34714a AND imp-34687a REMAIN OPEN: the LAYER is an a-priori ' +
    'correctly-rounded formula, not the imp-34687a layer; no certified interval is instantiated, the ' +
    'F(m) = 0 artifact is not discharged, conservatism is NECESSARY but not SUFFICIENT. Reuses the ' +
    'imp-36017/imp-35969 machinery (identical K_AMPL, g, N_cross, nextUp/nextDown, LAYER formula); C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36017 (point-input surrogate/layer width sweep; the "a-independent 2x" claim); imp-36066 ' +
    '(residual-node no-machine-certificate honest status; records the a-independent 2x); imp-35969 ' +
    '(bit-level nextafter SURROGATE width machinery); imp-34687 (directed-rounding layer scope; sub-gap ' +
    'imp-34687a unimplemented); imp-34774 (root N_cross; "F(m) exactly 0 in double precision"); imp-34714 ' +
    '(Krawczyk lemma; sub-gap imp-34714a; a = candidate-box half-width); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Interval-arithmetic width propagation and ' +
    'bit-level vs correctly-rounded directed rounding: standard floating-point / interval analysis ' +
    '(IEEE-754, Moore, Neumaier).',
};

export const IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE_ASSERTIONS = [
  {
    // (F1) the a -> 0 tight-certificate limit reproduces the imp-36017 recorded point ratio (~1.8418).
    id: 'imp36153-a-zero-limit-reproduces-imp36017-point-ratio',
    description: 'ratio(a -> 0) at N_cross reproduces the imp-36017 point value ~1.8418 (within 1e-3)',
    holds: () => Math.abs(RATIO_AT_ZERO - 1.841825) < 1e-3,
  },
  {
    // (F2) the ratio DRIFTS: monotone non-increasing in a and decays to ~1 -- NOT a-independent.
    id: 'imp36153-ratio-drifts-monotone-down-to-one',
    description: 'ratio monotone non-increasing in a, decays to ~1 at a=1, grid spread > 0.5 (drift, not flat)',
    holds: () =>
      RATIO_MONOTONE_DOWN === true &&
      RATIO_DRIFTS === true &&
      Math.abs(RATIO_AT_A1 - 1) < 1e-3,
  },
  {
    // (F1/conservatism) the ratio stays inside [1, 2]: surrogate never under-estimates, never exceeds 2x.
    id: 'imp36153-ratio-bounded-one-to-two',
    description: 'every ratio on the grid is >= 1 (conservative upper model) and <= 2 (never exceeds 2x ceiling)',
    holds: () => RATIO_BOUNDED === true,
  },
  {
    // (F3) the crossover half-width scales up with ULP(N) -- the 2x survives to larger a at greater height.
    id: 'imp36153-crossover-scales-with-ulp',
    description: 'crossover half-width at N=1e17 exceeds that at N=1e13 as ULP(N) grows',
    holds: () => CROSSOVER_SCALES_WITH_ULP === true,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gaps open, no interval, no QED, no refereed bound is changed.
    id: 'imp36153-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a/imp-34687a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE.subGap) &&
      /NO QED/.test(IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE.verdict) &&
      /refereed bound is changed/i.test(IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE.verdict),
  },
];

for (const a of IMP36153_KRAWCZYK_RESIDUAL_SURROGATE_LAYER_RATIO_A_DEPENDENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence assertion failed: ${a.id}`);
  }
}
