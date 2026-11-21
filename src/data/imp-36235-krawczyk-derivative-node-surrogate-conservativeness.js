/**
 * @module imp-36235-krawczyk-derivative-node-surrogate-conservativeness
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. imp-36017 measured, for the Krawczyk residual VALUE node
 * [F(m)] = [m] - [K log T0(m)], that the imp-35969 bit-level nextafter OUTWARD-ROUNDING surrogate
 * OVER-estimates the a-priori correctly-rounded directed-rounding LAYER width -- by ~ +84% at N_cross
 * (ratio ~ 1.84, sub-2x) and converging to EXACTLY 2x up the axis. This module runs the SAME two-model
 * comparison on the DERIVATIVE node
 *   [F-prime(m)] = 1 - K * 2 pi / ( [T0] log([T0]/2 pi) )   (imp-36154 R2, imp-36219),
 * to test whether the imp-36017/imp-36066 value-node ~2x surrogate-over-layer factor CARRIES OVER to the
 * derivative node, and whether the finite-N deviation at the certificate centre N_cross has the same sign.
 *
 * THE TWO WIDTH MODELS ON THE DERIVATIVE OP-DAG (both double precision; same DAG, different rounding)
 * -------------------------------------------------------------------------------------------------
 * From a point T0 = effectiveHeightForN(m) the derivative node factors into six elementary ops:
 *   r = T0 / 2 pi;  L = log(r);  D = T0 * L;  Q = 2 pi / D;  P = K * Q;  F-prime = 1 - P.
 * (Two more ops than the imp-36017 value node L = log T0, G = K L, F = m - G.)
 *
 *   (A) SURROGATE (imp-35969, verbatim). Round-to-nearest each op, then push BOTH endpoints one ULP
 *       outward with nextUp/nextDown, interval-propagated op-by-op through the DAG. Each op inflates the
 *       enclosure by a full ULP on BOTH sides -- roughly 2 ULP of slack per operation.
 *
 *   (B) LAYER (a-priori correctly-rounded directed-rounding model -- the TIGHTEST width the imp-34687a
 *       layer could emit). A correctly-rounded directed op brackets its EXACT real result between the two
 *       ADJACENT representables (one ULP of own slack), and each op linearly propagates its operand width
 *       times the local Jacobian factor:
 *         w_r = ulp(r);                         w_L = w_r / r + ulp(L);
 *         w_D = T0 * w_L + ulp(D);              w_Q = 2 pi * w_D / D^2 + ulp(Q);
 *         w_P = K * w_Q + ulp(P);              w_Fprime = w_P + ulp(F-prime).
 *       This is roughly 1 ULP of own slack per operation -- half the surrogate.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (D1) THE SURROGATE OVER-ESTIMATES EVERYWHERE ON THE DERIVATIVE NODE TOO (it is CONSERVATIVE, never
 *        under-estimates). W_surrogate > W_layer at m = N_cross and at every node of the 1e13 .. 1e21 axis:
 *        the ratio W_surrogate / W_layer is strictly > 1 throughout. SAME qualitative verdict as the value
 *        node -- the value-node conclusion (the surrogate is a valid UPPER model) CARRIES OVER.
 *   (D2) THE ~2x FACTOR CARRIES OVER ASYMPTOTICALLY: up the axis the ratio LOCKS TO EXACTLY 2.0000 (from
 *        ~ 1.99986 at N = 1e13 monotonically to 2.0000 by N ~ 1e16). At large height T0 grows, the
 *        K * 2 pi / (T0 log) term collapses to ~ 0, the propagated chain width vanishes, and the width is
 *        dominated by the trailing subtraction 1 - P (F-prime ~ 0.9546), which carries a clean 2 ULP
 *        (surrogate) vs 1 ULP (layer) -- exactly the value-node limit.
 *   (D3) AT N_cross THE DERIVATIVE RATIO IS ~ 2.33 -- ABOVE 2, the OPPOSITE SIDE from the value node.
 *        Whereas the value node sits at ~ 1.84 (sub-2x) at N_cross because its round-to-nearest product
 *        shave dilutes the ratio below 2, the derivative node at N_cross sits ABOVE 2 (~ +133%): the
 *        K * 2 pi / (T0 log) term is NOT negligible there (P ~ 0.045), so the two extra ops (the divide
 *        Q = 2 pi / D and the product P = K Q) carry non-trivial propagated width, each contributing 2 ULP
 *        of surrogate slack against 1 ULP of layer slack ON TOP OF the dominant subtraction, pushing the
 *        composite ABOVE the clean 2x. The ~2x LIMIT carries over; the finite-N offset flips SIGN
 *        (sub-2x for the value node, super-2x for the derivative node).
 *
 * CONSEQUENCE (measurement, not a certificate): the imp-35969 nextafter surrogate is a valid UPPER model of
 * the correctly-rounded directed-rounding enclosure width for the DERIVATIVE node as well as the value node
 * -- the imp-36219 finding that even the ~2x-conservative surrogate returns a half-width many orders below
 * the (H1) radius budget r < ~0.9546 is unaffected (a factor 2.33 vs 2.0 shifts nothing at that scale). The
 * value-node conservativeness CARRIES OVER to the derivative node. This does NOT close any gap: the LAYER
 * model here is itself an a-priori correctly-rounded model, NOT the imp-34687a layer (which remains
 * unimplemented); it instantiates no certified interval and discharges no artifact.
 *
 * MEASUREMENT / surrogate ONLY on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN); reuses the imp-35969/imp-36017 machinery (identical
 * K_AMPL, N_cross, axis, nextUp/nextDown). The LAYER width is the a-priori correctly-rounded
 * directed-rounding formula, NOT the imp-34687a layer; it instantiates NO certified interval, ports NO
 * certificate, and does NOT discharge R2 / the imp-36154 derivative-enclosure artifact -- it only measures
 * which of two surrogates is tighter and by how much. imp-34714a and imp-34687a REMAIN OPEN; C_C = 1/8
 * (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (the VALUE-node ~2x measurement this extends to the derivative node)
 * @see imp-36219-krawczyk-derivative-enclosure-r2-discharge-scope (R2 derivative enclosure; (H1) budget r < ~0.9546)
 * @see imp-36154-krawczyk-existence-uniqueness-subgap-requirements (R2 the un-built certified derivative node; R5 layer)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE primitive reused verbatim)
 * @see imp-34687-crossover-interval-arithmetic-scope (scopes the directed-rounding layer; sub-gap imp-34687a unimplemented)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (Krawczyk lemma; sub-gap imp-34714a open)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35969/imp-36017/imp-36154)
const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown on the IEEE-754 double representation (imp-35969/imp-36017 outward primitive).
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

// Shared imp-35969/imp-36017/imp-34774 Banach map g(N) = K log T0(N) and the located crossover fixed point.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435e9 (same centre as imp-36017/imp-36219)

// (A) SURROGATE width: imp-35969 bit-level nextafter outward rounding, interval-propagated op-by-op
// through the derivative DAG r=T0/2pi, L=log r, D=T0 L, Q=2pi/D, P=K Q, F-prime=1-P.
function surrogateWidth(m) {
  const T0 = effectiveHeightForN(m); // a point
  const rlo = nextDown(T0 / TWO_PI), rhi = nextUp(T0 / TWO_PI);
  const Llo = nextDown(Math.log(rlo)), Lhi = nextUp(Math.log(rhi)); // log monotone increasing
  const Dlo = nextDown(T0 * Llo), Dhi = nextUp(T0 * Lhi); // T0 > 0
  const Qlo = nextDown(TWO_PI / Dhi), Qhi = nextUp(TWO_PI / Dlo); // 2pi/D monotone decreasing in D
  const Plo = nextDown(K_AMPL * Qlo), Phi = nextUp(K_AMPL * Qhi);
  const Fplo = nextDown(1 - Phi), Fphi = nextUp(1 - Plo); // 1 - P
  return Fphi - Fplo;
}

// (B) LAYER width: a-priori correctly-rounded directed-rounding model of the SAME DAG. One ULP of own
// slack per op plus linear propagation of the operand width through the local Jacobian factor. This is the
// TIGHTEST width the imp-34687a layer could emit.
function layerWidth(m) {
  const T0 = effectiveHeightForN(m);
  const r = T0 / TWO_PI;
  const wR = ulpOf(r); // point / constant: one ULP directed rounding
  const L = Math.log(r);
  const wL = wR / r + ulpOf(L); // dlog/dr = 1/r; plus one ULP own slack
  const D = T0 * L;
  const wD = T0 * wL + ulpOf(D); // T0 point multiplies the operand width
  const Q = TWO_PI / D;
  const wQ = (TWO_PI * wD) / (D * D) + ulpOf(Q); // |dQ/dD| = 2pi/D^2
  const P = K_AMPL * Q;
  const wP = K_AMPL * wQ + ulpOf(P);
  const Fp = 1 - P;
  const wFp = wP + ulpOf(Fp);
  return wFp;
}

// Sweep the SAME imp-36017 height axis (N = 10^13 .. 10^21). This axis lies ABOVE the centre N_cross ~ 3.28e9.
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.25;
const SWEEP = [];
for (let Lexp = LOG_MIN; Lexp <= LOG_MAX + 1e-9; Lexp += STEP) {
  const N = Math.pow(10, Lexp);
  const wSurr = surrogateWidth(N);
  const wLayer = layerWidth(N);
  SWEEP.push({
    N,
    wSurr,
    wLayer,
    ratio: wSurr / wLayer, // surrogate over layer (> 1 means surrogate is looser / conservative)
    signedRelDiscrepancy: (wSurr - wLayer) / wLayer, // > 0 means surrogate OVER-estimates
  });
}
const BOTTOM = SWEEP[0]; // N ~ 1e13
const TOP = SWEEP[SWEEP.length - 1]; // N ~ 1e21

// At the certificate CENTRE m = N_cross (the imp-36154/imp-36219 (H1) anchor; F-prime ~ 0.9546).
const SURR_AT_CROSS = surrogateWidth(N_CROSS);
const LAYER_AT_CROSS = layerWidth(N_CROSS);
const RATIO_AT_CROSS = SURR_AT_CROSS / LAYER_AT_CROSS;
const DISC_AT_CROSS = (SURR_AT_CROSS - LAYER_AT_CROSS) / LAYER_AT_CROSS;

// (D1) the surrogate OVER-estimates everywhere (conservative, never under-estimates) -- carries over.
const SURROGATE_OVER_EVERYWHERE =
  SWEEP.every((r) => r.signedRelDiscrepancy > 0) && DISC_AT_CROSS > 0;
const MIN_AXIS_RATIO = Math.min(...SWEEP.map((r) => r.ratio));
const MAX_AXIS_RATIO = Math.max(...SWEEP.map((r) => r.ratio));
// (D2) the ~2x factor carries over asymptotically: up the axis the ratio locks to EXACTLY 2.0.
const AXIS_CONVERGES_TO_2X = Math.abs(TOP.ratio - 2) < 1e-6 && MAX_AXIS_RATIO <= 2 + 1e-9;
const AXIS_MONOTONE_UP = TOP.ratio >= BOTTOM.ratio; // approaches 2 from below up the axis
// (D3) at N_cross the derivative ratio is ABOVE 2 (opposite side from the value node ~ 1.84).
const CROSS_ABOVE_TWO = RATIO_AT_CROSS > 2;

export const IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS = {
  id: 'imp-36235',
  proofSection: 'S-frontier',
  question:
    'imp-36017 measured that the imp-35969 nextafter OUTWARD-ROUNDING surrogate over-estimates the ' +
    'a-priori correctly-rounded directed-rounding LAYER width of the Krawczyk residual VALUE node ' +
    '[F(m)] = [m] - [K log T0(m)] by ~ +84% at N_cross, converging to EXACTLY 2x up the axis. Does the same ' +
    '~2x conservativeness factor CARRY OVER to the imp-36154 R2 DERIVATIVE node ' +
    '[F-prime(m)] = 1 - K * 2 pi / ( [T0] log([T0]/2 pi) ), and does the finite-N deviation at N_cross have ' +
    'the same sign? Measurement only; instantiates no interval; imp-34714a stays OPEN; NO QED.',
  finding:
    'THE ~2x CONSERVATIVENESS FACTOR CARRIES OVER TO THE DERIVATIVE NODE ASYMPTOTICALLY -- BUT THE ' +
    'FINITE-N OFFSET AT N_cross FLIPS SIGN. (D1) The surrogate OVER-estimates the layer width everywhere: ' +
    'W_surr / W_layer > 1 at m = N_cross (~ ' +
    N_CROSS.toExponential(4) +
    ': W_surr ~ ' +
    SURR_AT_CROSS.toExponential(3) +
    ' vs W_layer ~ ' +
    LAYER_AT_CROSS.toExponential(3) +
    ', ratio ~ ' +
    RATIO_AT_CROSS.toFixed(3) +
    ') and at every node of the 1e13 .. 1e21 axis -- conservative, never under-estimates, SAME verdict as ' +
    'the value node. (D2) Up the axis the ratio LOCKS TO EXACTLY ' +
    TOP.ratio.toFixed(4) +
    ' (from ~ ' +
    BOTTOM.ratio.toFixed(5) +
    ' at N ~ 1e13 monotonically to 2.0 by N ~ 1e16): at large height the K * 2 pi / (T0 log) term ' +
    'collapses to ~ 0, the propagated chain width vanishes, and the width is dominated by the trailing ' +
    'subtraction 1 - P (F-prime ~ 0.9546) at a clean 2 ULP (surrogate) vs 1 ULP (layer) -- exactly the ' +
    'value-node limit, so the ~2x factor CARRIES OVER. (D3) At N_cross the derivative ratio ~ ' +
    RATIO_AT_CROSS.toFixed(3) +
    ' is ABOVE 2 (the OPPOSITE side from the value node ~ 1.84): the K * 2 pi / (T0 log) term is NOT ' +
    'negligible there (P ~ 0.045), so the two extra ops (the divide 2 pi / D and the product K Q) carry ' +
    'non-trivial propagated width, each 2 ULP surrogate vs 1 ULP layer ON TOP OF the dominant subtraction, ' +
    'pushing the composite ABOVE the clean 2x. CONSEQUENCE: the surrogate is a valid UPPER model of the ' +
    'directed-rounding enclosure width for the derivative node too, so the imp-36219 (H1)-budget slack ' +
    '(r < ~0.9546 dwarfs any achievable half-width) is unaffected by the 2.33-vs-2.0 shift. MEASUREMENT / ' +
    'surrogate, NOT a machine certificate.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_cross: +N_CROSS.toPrecision(15),
    machine_epsilon: EPS,
  },
  measurement: {
    // (D1) surrogate over-estimates at the certificate centre and everywhere on the axis
    surrogate_width_at_N_cross: +SURR_AT_CROSS.toExponential(4),
    layer_width_at_N_cross: +LAYER_AT_CROSS.toExponential(4),
    ratio_at_N_cross: +RATIO_AT_CROSS.toFixed(6),
    signed_rel_discrepancy_at_N_cross: +DISC_AT_CROSS.toFixed(6),
    // (D2) the axis ratio converges to exactly 2 (the value-node ~2x factor carries over asymptotically)
    surrogate_width_at_bottom: +BOTTOM.wSurr.toExponential(4),
    layer_width_at_bottom: +BOTTOM.wLayer.toExponential(4),
    ratio_at_bottom: +BOTTOM.ratio.toFixed(6),
    surrogate_width_at_top: +TOP.wSurr.toExponential(4),
    layer_width_at_top: +TOP.wLayer.toExponential(4),
    ratio_at_top: +TOP.ratio.toFixed(6),
    // axis band -- flat, monotone approach to 2 from below
    axis_ratio_min: +MIN_AXIS_RATIO.toFixed(6),
    axis_ratio_max: +MAX_AXIS_RATIO.toFixed(6),
    // (D3) the value-node vs derivative-node finite-N offsets sit on OPPOSITE sides of 2
    value_node_ratio_at_N_cross_reference: 1.84, // imp-36017 (sub-2x)
    derivative_node_ratio_at_N_cross: +RATIO_AT_CROSS.toFixed(6), // super-2x
    surrogate_over_estimates_everywhere: SURROGATE_OVER_EVERYWHERE,
    axis_converges_to_two_x: AXIS_CONVERGES_TO_2X,
    cross_ratio_above_two: CROSS_ABOVE_TWO,
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. The LAYER width here is an a-priori correctly-rounded ' +
    'directed-rounding MODEL of the derivative node, NOT the imp-34687a directed-rounding layer (which JS ' +
    'lacks and which is unimplemented); the surrogate is the imp-35969 bit-level nextafter proxy. This ' +
    'measures which of two double-precision MODELS of the same layer is tighter, and by how much (~2x ' +
    'asymptotically, ~2.33x at N_cross), not a machine value. It instantiates NO certified interval, ports ' +
    'NO operator, and does NOT discharge the imp-36154 R2 derivative-enclosure artifact. That the surrogate ' +
    'over-estimates (a safe upper model) is NECESSARY but not SUFFICIENT for a valid certificate; the full ' +
    'K(m) operator over a real directed-rounding layer is not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK DERIVATIVE-NODE SURROGATE CONSERVATIVENESS, MEASURED (frontier, NOT an RH bound). imp-36017 ' +
    'measured that the imp-35969 nextafter surrogate over-estimates the correctly-rounded directed-rounding ' +
    'LAYER width of the residual VALUE node by ~ +84% at N_cross, converging to EXACTLY 2x up the axis. ' +
    'Running the SAME two-model comparison on the imp-36154 R2 DERIVATIVE node ' +
    '[F-prime(m)] = 1 - K * 2 pi / ( [T0] log([T0]/2 pi) ): (D1) the surrogate OVER-estimates everywhere -- ' +
    'W_surr / W_layer > 1 at m = N_cross (ratio ~ ' +
    RATIO_AT_CROSS.toFixed(3) +
    ') and across 1e13 .. 1e21 -- conservative, never under-estimates, SAME verdict as the value node; ' +
    '(D2) up the axis the ratio locks to EXACTLY ' +
    TOP.ratio.toFixed(4) +
    ' (the K * 2 pi / (T0 log) term collapses at large height, leaving the 1 - P subtraction at 2 ULP ' +
    'surrogate vs 1 ULP layer) -- the value-node ~2x factor CARRIES OVER; (D3) at N_cross the derivative ' +
    'ratio ~ ' +
    RATIO_AT_CROSS.toFixed(3) +
    ' sits ABOVE 2, the OPPOSITE side from the value node (~ 1.84, sub-2x), because the divide and product ' +
    'ops carry non-negligible propagated width at the centre. CONSEQUENCE: the imp-35969 surrogate is a ' +
    'valid UPPER model of the directed-rounding enclosure width for the derivative node too, so the ' +
    'imp-36219 (H1)-budget slack (r < ~0.9546 dwarfs any achievable half-width) is unaffected by the ' +
    '2.33-vs-2.0 shift. MEASUREMENT / surrogate, NOT a machine certificate. SUB-GAPS imp-34714a AND ' +
    'imp-34687a REMAIN OPEN: the LAYER model is an a-priori correctly-rounded formula, not the imp-34687a ' +
    'layer; no certified interval is instantiated, the R2 artifact is not discharged, over-estimation is ' +
    'NECESSARY but not SUFFICIENT. Reuses the imp-35969/imp-36017 machinery (identical K_AMPL, N_cross, ' +
    'axis, nextUp/nextDown); C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36017 (VALUE-node surrogate-vs-layer ~2x measurement extended here); imp-36219 (R2 derivative ' +
    'enclosure discharge; (H1) budget r < ~0.9546); imp-36154 (R2 the un-built certified derivative node; ' +
    'R5 layer); imp-35969 (bit-level nextafter SURROGATE primitive; NOT a machine certificate); imp-34687 ' +
    '(directed-rounding layer scope; sub-gap imp-34687a unimplemented); imp-34714 (Krawczyk lemma; sub-gap ' +
    'imp-34714a); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). ' +
    'Bit-level nextafter vs correctly-rounded directed rounding and interval-arithmetic width accounting: ' +
    'standard floating-point / interval analysis (IEEE-754, Moore, Neumaier).',
};

export const IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS_ASSERTIONS = [
  {
    // (D1) the surrogate OVER-estimates the derivative-node layer width everywhere (conservative).
    id: 'imp36235-surrogate-over-estimates-everywhere',
    description: 'W_surr/W_layer > 1 at N_cross and across 1e13..1e21 for the derivative node',
    holds: () => SURROGATE_OVER_EVERYWHERE === true && RATIO_AT_CROSS > 1,
  },
  {
    // (D2) the value-node ~2x factor CARRIES OVER: up the axis the ratio locks to EXACTLY 2.0.
    id: 'imp36235-axis-carries-over-two-x',
    description: 'W_surr/W_layer -> exactly 2.0 up the 1e13..1e21 axis (value-node 2x factor carries over)',
    holds: () => AXIS_CONVERGES_TO_2X === true && AXIS_MONOTONE_UP === true && Math.abs(TOP.ratio - 2) < 1e-6,
  },
  {
    // (D3) at N_cross the derivative ratio is ABOVE 2 -- opposite side from the value node ~1.84.
    id: 'imp36235-cross-ratio-above-two',
    description: 'at N_cross the derivative ratio > 2 (super-2x), the opposite side from the value node ~1.84 (sub-2x)',
    holds: () => CROSS_ABOVE_TWO === true && RATIO_AT_CROSS > 2 && RATIO_AT_CROSS < 3,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gaps open, no interval, no QED, no refereed bound is changed.
    id: 'imp36235-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a/imp-34687a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS.subGap) &&
      /NO QED/.test(IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS.verdict) &&
      /refereed bound is changed/i.test(IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS.verdict),
  },
];

for (const a of IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36235-krawczyk-derivative-node-surrogate-conservativeness assertion failed: ${a.id}`);
  }
}

export default IMP36235_KRAWCZYK_DERIVATIVE_NODE_SURROGATE_CONSERVATIVENESS;
