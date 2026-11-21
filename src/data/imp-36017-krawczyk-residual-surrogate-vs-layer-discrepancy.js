/**
 * @module imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. imp-35969 measured the Krawczyk residual-node enclosure width of
 * [F(m)] = [m] - [K log T0(m)] with a bit-level nextafter (nextUp/nextDown) OUTWARD-ROUNDING SURROGATE,
 * and its own verdict flags that width as "MEASUREMENT / surrogate, NOT a machine certificate" with the
 * sub-gap imp-34714a REMAINING OPEN. That surrogate was never compared to the actual imp-34687a
 * directed-rounding layer it stands in for. This module quantifies the signed relative discrepancy
 * between the two: does the bit-level nextafter surrogate UNDER- or OVER-estimate the enclosure width a
 * correctly-rounded directed-rounding layer would emit for the SAME residual node?
 *
 * THE TWO WIDTH MODELS (both double-precision; same op-DAG, different rounding primitive)
 * -------------------------------------------------------------------------------------
 * The residual node is [F(m)] = [m] - [K log T0(m)], m a point, evaluated op-by-op: L = log(T0),
 * G = K * L, F = m - G.
 *
 *   (A) SURROGATE (imp-35969, verbatim). Round-to-nearest each op, then push BOTH endpoints one ULP
 *       outward with nextUp/nextDown:
 *         Llo = nextDown(log T0),  Lhi = nextUp(log T0)
 *         Glo = nextDown(K Llo),   Ghi = nextUp(K Lhi)
 *         Flo = nextDown(m - Ghi), Fhi = nextUp(m - Glo)
 *       Because nextUp and nextDown are applied to the SAME nearest value at every op, each op inflates
 *       the enclosure by a full ULP on BOTH sides -- roughly 2 ULP of slack per operation.
 *
 *   (B) LAYER (a-priori correctly-rounded directed-rounding model -- the TIGHTEST width the imp-34687a
 *       layer could emit). A correctly-rounded directed op brackets its EXACT real result between the two
 *       ADJACENT representables, so a POINT input (log of the point T0) yields width exactly one ULP, and
 *       each downstream op propagates the operand width plus at most one ULP of directed rounding of its
 *       own result:
 *         w_L = ulp(L),   w_G = K * w_L + ulp(G),   w_F = w_G + ulp(F)  (~ w_G, since F ~ 0)
 *       This is roughly 1 ULP of slack per operation -- half the surrogate.
 *
 * The two models share the identical propagated-operand term (K * w_L dominates); they differ ONLY in the
 * per-operation rounding slack, so their RATIO isolates the rounding-primitive discrepancy.
 *
 * WHAT THE MEASUREMENT FINDS
 * --------------------------
 *   (D1) THE SURROGATE OVER-ESTIMATES EVERYWHERE (it is CONSERVATIVE, never under-estimates). W_surrogate
 *        > W_layer at m = N_cross and at every node of the 1e13 .. 1e21 axis: the signed relative
 *        discrepancy (W_surrogate - W_layer) / W_layer is strictly POSITIVE throughout.
 *   (D2) THE DISCREPANCY IS ~ +84% AT N_cross AND CONVERGES TO EXACTLY +100% (a 2x FACTOR) UP THE AXIS.
 *        At m = N_cross the surrogate is ~ 1.84x the layer width (the sub-2x value reflects the finite
 *        ulp(G) share); by N = 1e17 .. 1e21 the ratio locks to exactly 2.0000 -- each op contributes
 *        2 ULP (surrogate) vs 1 ULP (layer), so the composite is a clean factor of two.
 *   (D3) THE DISCREPANCY IS a-INDEPENDENT (a ROUNDING-MODEL constant, NOT an a -> 0 effect). The ratio is
 *        FLAT (~ 1.84 .. 2.00, a small monotone approach to 2) across the whole axis; it does NOT scale
 *        with 1/a. Both widths scale with ULP(m) (the value scale), so their ratio is scale-invariant --
 *        the surrogate-vs-layer gap is a fixed property of the rounding primitive, not of the height.
 *
 * CONSEQUENCE (measurement, not a certificate): the imp-35969 nextafter surrogate is a valid UPPER model
 * of the correctly-rounded directed-rounding enclosure width -- its "small nonzero width" conclusion is
 * CONSERVATIVE (the true directed-rounding layer would be about twice as tight), so nothing imp-35969
 * concluded about the residual node is threatened by having used the surrogate. This does NOT close any
 * gap: the LAYER model here is itself an a-priori correctly-rounded model, NOT the imp-34687a layer (which
 * remains unimplemented); it instantiates no certified interval and discharges no artifact.
 *
 * MEASUREMENT / surrogate ONLY on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN); reuses the imp-35969 machinery verbatim (identical
 * K_AMPL, g, N_cross, axis, nextUp/nextDown). The LAYER width is the a-priori correctly-rounded
 * directed-rounding formula, NOT the imp-34687a layer; it instantiates NO certified interval, ports NO
 * certificate, and does NOT discharge the F(m) = 0 residual-at-root artifact -- it only measures which of
 * two surrogates is tighter and by how much. imp-34714a and imp-34687a REMAIN OPEN; C_C = 1/8
 * (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE width this compares against the layer)
 * @see imp-34687-crossover-interval-arithmetic-scope (scopes the directed-rounding layer; sub-gap imp-34687a unimplemented)
 * @see imp-35885-krawczyk-node-cancellation-audit (NODE B: asserted F(m) is a small tightening nonzero interval)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(N)=N-g(N); root N_cross; F(m) exactly 0 in double precision)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (Krawczyk lemma; sub-gap imp-34714a open)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35969/imp-34774)
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown on the IEEE-754 double representation (imp-35969 outward-rounding primitive).
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

// Shared imp-35969/imp-34774 Banach map g(N) = K log T0(N) and the located crossover fixed point N_cross.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435e9

// (A) SURROGATE width: imp-35969 bit-level nextafter outward rounding, verbatim, of [F(m)]=[m]-[K log T0(m)].
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

// (B) LAYER width: a-priori correctly-rounded directed-rounding model of the SAME op-DAG. A correctly
// rounded directed op brackets its exact real result between adjacent representables, so a point input
// (log of the point T0) yields one ULP, and each op adds at most one ULP of directed rounding of its own
// result on top of the propagated operand width. This is the TIGHTEST width the imp-34687a layer could emit.
function layerWidth(m) {
  const T0 = effectiveHeightForN(m);
  const L = Math.log(T0);
  const wL = ulpOf(L); // log of a point: exact real value bracketed by two adjacent representables (1 ULP)
  const G = K_AMPL * L;
  const wG = K_AMPL * wL + ulpOf(G); // propagate operand width + one ULP directed rounding of the product
  const F = m - G;
  const wF = wG + (F === 0 ? 0 : ulpOf(F)); // subtraction: propagate width + one ULP (result ~ 0, so ~ wG)
  return wF;
}

// Sweep the SAME imp-35969 height axis (N = 10^13 .. 10^21).
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
    ratio: wSurr / wLayer, // surrogate over layer (> 1 means surrogate is looser)
    signedRelDiscrepancy: (wSurr - wLayer) / wLayer, // > 0 means surrogate OVER-estimates
  });
}
const BOTTOM = SWEEP[0]; // N ~ 1e13
const TOP = SWEEP[SWEEP.length - 1]; // N ~ 1e21

// At the certificate CENTRE m = N_cross (value F(m) = 0; enclosure width nonzero in both models).
const SURR_AT_CROSS = surrogateWidth(N_CROSS);
const LAYER_AT_CROSS = layerWidth(N_CROSS);
const RATIO_AT_CROSS = SURR_AT_CROSS / LAYER_AT_CROSS;
const DISC_AT_CROSS = (SURR_AT_CROSS - LAYER_AT_CROSS) / LAYER_AT_CROSS;

// (D1) the surrogate OVER-estimates everywhere (conservative, never under-estimates).
const SURROGATE_OVER_EVERYWHERE =
  SWEEP.every((r) => r.signedRelDiscrepancy > 0) && DISC_AT_CROSS > 0;
const MIN_RATIO = Math.min(...SWEEP.map((r) => r.ratio), RATIO_AT_CROSS);
const MAX_RATIO = Math.max(...SWEEP.map((r) => r.ratio), RATIO_AT_CROSS);
// (D2) the discrepancy is ~ +84% at N_cross and converges to exactly +100% (a 2x factor) up the axis.
const DISC_AT_TOP = TOP.signedRelDiscrepancy;
const CONVERGES_TO_2X = Math.abs(TOP.ratio - 2) < 1e-6 && MAX_RATIO <= 2 + 1e-9;
// (D3) the discrepancy is a-INDEPENDENT: the ratio is flat (small band, monotone approach to 2), not 1/a.
const RATIO_FLAT = MAX_RATIO / MIN_RATIO < 1.4 && MIN_RATIO > 1.5; // bounded, no blow-up
const RATIO_MONOTONE_UP = TOP.ratio >= BOTTOM.ratio; // approaches 2 from below up the axis

export const IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY = {
  id: 'imp-36017',
  proofSection: 'S-frontier',
  question:
    'imp-35969 measured the Krawczyk residual-node enclosure width of [F(m)] = [m] - [K log T0(m)] with a ' +
    'bit-level nextafter OUTWARD-ROUNDING surrogate and flagged it as "surrogate, NOT a machine ' +
    'certificate" with sub-gap imp-34714a OPEN, but never compared that surrogate to the actual imp-34687a ' +
    'directed-rounding layer. Evaluate the residual-node width through the a-priori correctly-rounded ' +
    'directed-rounding LAYER model (not the nextafter proxy) at m = N_cross and across 1e13 .. 1e21, and ' +
    'measure the signed relative discrepancy surrogate-vs-layer -- does the bit-level surrogate UNDER- or ' +
    'OVER-estimate the certified enclosure width? Measurement only; instantiates no interval; imp-34714a ' +
    'stays OPEN; NO QED.',
  finding:
    'THE BIT-LEVEL NEXTAFTER SURROGATE OVER-ESTIMATES THE CORRECTLY-ROUNDED DIRECTED-ROUNDING LAYER WIDTH ' +
    'BY ~ +84% AT N_cross, CONVERGING TO EXACTLY +100% (A 2x FACTOR) UP THE AXIS -- IT IS CONSERVATIVE, ' +
    'NEVER UNDER-ESTIMATES. (D1) The signed relative discrepancy (W_surr - W_layer)/W_layer is strictly ' +
    'POSITIVE at m = N_cross (~ ' +
    N_CROSS.toExponential(4) +
    ': W_surr ~ ' +
    SURR_AT_CROSS.toExponential(3) +
    ' vs W_layer ~ ' +
    LAYER_AT_CROSS.toExponential(3) +
    ', discrepancy ~ +' +
    (DISC_AT_CROSS * 100).toFixed(1) +
    '%) and at every node of the 1e13 .. 1e21 axis. (D2) The ratio W_surr/W_layer is ~ ' +
    RATIO_AT_CROSS.toFixed(3) +
    ' at N_cross and LOCKS TO EXACTLY ' +
    TOP.ratio.toFixed(4) +
    ' by N ~ 1e21: each op contributes 2 ULP of outward slack in the surrogate (nextUp AND nextDown on ' +
    'the same nearest value) vs ~ 1 ULP in the correctly-rounded directed layer (adjacent representables ' +
    'bracketing the exact result), so the composite is a clean factor of two. (D3) The discrepancy is ' +
    'a-INDEPENDENT: the ratio is FLAT (~ ' +
    MIN_RATIO.toFixed(2) +
    ' .. ' +
    MAX_RATIO.toFixed(2) +
    ', a small monotone approach to 2), NOT scaling with 1/a -- both widths scale with ULP(m) so the ' +
    'ratio is scale-invariant, a fixed rounding-primitive property. CONSEQUENCE: the imp-35969 surrogate ' +
    'is a valid UPPER model of the directed-rounding enclosure width, so its "small nonzero width" ' +
    'conclusion is CONSERVATIVE (the true layer would be about twice as tight). MEASUREMENT / surrogate, ' +
    'NOT a machine certificate.',
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
    // (D2) the ratio across the axis converges to exactly 2 (a clean factor-of-two over-estimation)
    surrogate_width_at_bottom: +BOTTOM.wSurr.toExponential(4),
    layer_width_at_bottom: +BOTTOM.wLayer.toExponential(4),
    ratio_at_bottom: +BOTTOM.ratio.toFixed(6),
    signed_rel_discrepancy_at_bottom: +BOTTOM.signedRelDiscrepancy.toFixed(6),
    surrogate_width_at_top: +TOP.wSurr.toExponential(4),
    layer_width_at_top: +TOP.wLayer.toExponential(4),
    ratio_at_top: +TOP.ratio.toFixed(6),
    signed_rel_discrepancy_at_top: +DISC_AT_TOP.toFixed(6),
    // (D3) band across the whole sweep -- flat, a-independent
    ratio_min_over_sweep: +MIN_RATIO.toFixed(6),
    ratio_max_over_sweep: +MAX_RATIO.toFixed(6),
    surrogate_over_estimates_everywhere: SURROGATE_OVER_EVERYWHERE,
    converges_to_two_x: CONVERGES_TO_2X,
    ratio_a_independent: RATIO_FLAT && RATIO_MONOTONE_UP,
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. The LAYER width here is an a-priori correctly-rounded ' +
    'directed-rounding MODEL of the residual node, NOT the imp-34687a directed-rounding layer (which JS ' +
    'lacks and which is unimplemented); the surrogate is the imp-35969 bit-level nextafter proxy. This ' +
    'measures which of two double-precision MODELS of the same layer is tighter, and by how much (~2x), ' +
    'not a machine value. It instantiates NO certified interval, ports NO operator, and does NOT discharge ' +
    'the F(m) = 0 residual-at-root artifact. That the surrogate over-estimates (a safe upper model) is ' +
    'NECESSARY but not SUFFICIENT for a valid certificate; the full K(m) operator over a real ' +
    'directed-rounding layer is not ported. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE SURROGATE-VS-LAYER WIDTH DISCREPANCY, MEASURED (frontier, NOT an RH bound). ' +
    'imp-35969 measured the residual-node enclosure width of [F(m)] = [m] - [K log T0(m)] with a bit-level ' +
    'nextafter outward-rounding surrogate and flagged it as "NOT a machine certificate"; it never compared ' +
    'that surrogate to the imp-34687a directed-rounding layer. Evaluating the SAME op-DAG through an ' +
    'a-priori correctly-rounded directed-rounding LAYER model: (D1) the signed relative discrepancy ' +
    '(W_surr - W_layer)/W_layer is strictly POSITIVE at m = N_cross (~ +' +
    (DISC_AT_CROSS * 100).toFixed(1) +
    '%) and everywhere on 1e13 .. 1e21 -- the surrogate OVER-estimates, it is conservative and never ' +
    'under-estimates; (D2) the ratio W_surr/W_layer is ~ ' +
    RATIO_AT_CROSS.toFixed(3) +
    ' at N_cross and locks to exactly ' +
    TOP.ratio.toFixed(4) +
    ' up the axis, because the surrogate applies nextUp AND nextDown to the same nearest value (2 ULP/op) ' +
    'while a correctly-rounded directed layer brackets the exact result with adjacent representables ' +
    '(~1 ULP/op) -- a clean factor of two; (D3) the discrepancy is a-INDEPENDENT (ratio flat ~ ' +
    MIN_RATIO.toFixed(2) +
    ' .. ' +
    MAX_RATIO.toFixed(2) +
    ', not 1/a) since both widths scale with ULP(m). CONSEQUENCE: the imp-35969 surrogate is a valid UPPER ' +
    'model of the directed-rounding enclosure width, so its "small nonzero width" conclusion is ' +
    'CONSERVATIVE (the true layer is about twice as tight). MEASUREMENT / surrogate, NOT a machine ' +
    'certificate. SUB-GAPS imp-34714a AND imp-34687a REMAIN OPEN: the LAYER model is an a-priori ' +
    'correctly-rounded formula, not the imp-34687a layer; no certified interval is instantiated, the ' +
    'F(m) = 0 artifact is not discharged, over-estimation is NECESSARY but not SUFFICIENT. Reuses the ' +
    'imp-35969/imp-34774 machinery (identical K_AMPL, g, N_cross, axis, nextUp/nextDown); C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35969 (bit-level nextafter SURROGATE residual-node width; "NOT a machine certificate"); imp-34687 ' +
    '(directed-rounding layer scope; sub-gap imp-34687a unimplemented); imp-35885 (NODE B: residual F(m) a ' +
    'small tightening nonzero interval); imp-34774 ("F(m) exactly 0 in double precision"; root N_cross); ' +
    'imp-34714 (Krawczyk lemma; sub-gap imp-34714a); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Bit-level nextafter vs correctly-rounded directed rounding and ' +
    'interval-arithmetic width accounting: standard floating-point / interval analysis (IEEE-754, Moore, ' +
    'Neumaier).',
};

export const IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY_ASSERTIONS = [
  {
    // (D1) the surrogate OVER-estimates the layer width everywhere (conservative, never under-estimates).
    id: 'imp36017-surrogate-over-estimates-everywhere',
    description: 'signed rel discrepancy (W_surr - W_layer)/W_layer > 0 at N_cross and across 1e13..1e21',
    holds: () => SURROGATE_OVER_EVERYWHERE === true && DISC_AT_CROSS > 0.5 && DISC_AT_CROSS < 1.2,
  },
  {
    // (D2) the ratio W_surr/W_layer converges to exactly 2 up the axis (a clean factor-of-two over-estimation).
    id: 'imp36017-ratio-converges-to-two-x',
    description: 'W_surr/W_layer -> exactly 2.0 by N~1e21 (2 ULP/op surrogate vs 1 ULP/op directed layer)',
    holds: () => CONVERGES_TO_2X === true && Math.abs(TOP.ratio - 2) < 1e-6,
  },
  {
    // (D3) the discrepancy is a-INDEPENDENT: the ratio is flat (small band, monotone up), not a 1/a effect.
    id: 'imp36017-discrepancy-a-independent',
    description: 'ratio flat (< 1.4x dynamic range, > 1.5 floor) and monotone up the axis -- a rounding-model constant',
    holds: () => RATIO_FLAT === true && RATIO_MONOTONE_UP === true && MAX_RATIO <= 2 + 1e-9,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gaps open, no interval, no QED, no refereed bound is changed.
    id: 'imp36017-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a/imp-34687a open, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY.subGap) &&
      /NO QED/.test(IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY.verdict) &&
      /refereed bound is changed/i.test(IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY.verdict),
  },
];

for (const a of IMP36017_KRAWCZYK_RESIDUAL_SURROGATE_VS_LAYER_DISCREPANCY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy assertion failed: ${a.id}`);
  }
}
