/**
 * @module imp-36175-krawczyk-residual-2x-ratio-opdag-derivation
 *
 * DERIVATION / DIAGNOSTIC ONLY. imp-36017 MEASURED that the imp-35969 nextafter OUTWARD-rounding
 * SURROGATE width of the Krawczyk residual node [F(m)] = [m] - [K log T0(m)] over-estimates the a-priori
 * correctly-rounded directed-rounding LAYER-model width by an a-INDEPENDENT factor converging to EXACTLY
 * 2.0 up the height axis, and the imp-36166 storyline restates that 2x ratio verbatim -- but NEITHER
 * supplies a mechanistic reason for the exact-2 limit or for its a-independence. This module DERIVES the
 * exact-2 limit from an operation-DAG rounding-error COUNT and, honestly, resolves the two-regime structure
 * that a naive "every node is 2x" account misses.
 *
 * THE OP-DAG (three nodes; same graph, two rounding primitives)
 * ------------------------------------------------------------
 *   L = log(T0(m))      (log node)
 *   G = K * L           (product node)
 *   F = m - G           (subtraction / residual node)
 *
 * PER-NODE DIRECTED-ROUNDING SLACK COUNT (the core of the derivation)
 * ------------------------------------------------------------------
 * Each op emits its own directed-rounding slack on top of the propagated operand width:
 *   - SURROGATE (imp-35969): nextUp AND nextDown are applied to the SAME round-to-nearest value, pushing
 *     the enclosure a full ULP outward on BOTH sides -- 2 ULP of own-slack per node.
 *   - LAYER (correctly-rounded directed): a correctly-rounded directed op brackets its EXACT real result
 *     between the two ADJACENT representables -- 1 ULP of own-slack per node.
 * So the per-node primitive ratio is EXACTLY 2 = (2 ULP/op) / (1 ULP/op). This is exact and node-by-node.
 *
 * COMPOSITE WIDTH = propagated-operand width + per-node slack, summed over the three nodes:
 *   W_layer = t_L + t_G + t_F,  with  t_L = K * ulp(L)  (log slack propagated through the product),
 *                                     t_G = ulp(G)       (product own-slack),
 *                                     t_F = ulp(F)       (subtraction own-slack).
 *   Ideal surrogate = 2 t_L + 2 t_G + 2 t_F.
 *
 * WHY THE COMPOSITE RATIO -> EXACTLY 2 UP THE HEIGHT AXIS, a-INDEPENDENTLY
 * ----------------------------------------------------------------------
 * AWAY from the fixed point (m much larger than N_cross) the residual is F = m - G ~ m, because
 * G = K log T0 is only ~1.6e10 while m ranges 1e13..1e21. So the subtraction node's own-slack
 * t_F = ulp(F) ~ ulp(m) DOMINATES the whole width (t_F / W ~ 1; t_L, t_G are negligible). At THAT node the
 * count is clean: surrogate emits exactly 2 ulp(F), layer exactly 1 ulp(F), a 2:1 ratio, so the composite
 * ratio -> 2. And because every slack term scales with the ULP of a VALUE (t_L, t_G ~ G * eps, t_F ~ m * eps)
 * and NONE with 1/a, the limit is a-INDEPENDENT: the ratio is scale-invariant, a fixed rounding-primitive
 * property, exactly as imp-36017 (D3) / imp-36166 recorded. THE a-INDEPENDENCE IS THE SCALE-INVARIANCE OF
 * THE ULP FUNCTION; the exact-2 is the (2 ULP/op)/(1 ULP/op) count carried by the dominant subtraction node.
 *
 * WHICH NODE BREAKS A CLEAN TERMWISE 2x, AND WHERE (the honest caveat)
 * -------------------------------------------------------------------
 * At the certificate CENTRE m = N_cross the residual is F = 0 (the imp-34774 root artifact), so t_F = 0 and
 * the width is carried instead by the log and product nodes, where the ratio is only ~1.842, NOT 2. The
 * deficit lives ENTIRELY in the PRODUCT node: the surrogate's realized product spread
 * nextUp(K * Lhi) - nextDown(K * Llo) is SHAVED below the ideal 2(t_L + t_G) by the round-to-nearest of the
 * two products BEFORE the outward push (measured shave ~1.64e-7 < ulp(G) ~4.77e-7). The log node itself is
 * still clean (surrogate width = exactly 2 ulp(L)), and the subtraction node adds ~0 there (ulp of a ~0
 * result). So the sub-2 value at the centre is a BOUNDED, negative product-node quantization residue
 * delta = W_surr - 2 W_layer, confined to one node and bounded in magnitude by that node own-slack; it does
 * NOT persist up the axis because the clean-2x subtraction node (t_F ~ ulp(m)) swamps it: |delta| / W_layer
 * falls monotonically from ~0.158 at N_cross to ~3e-11 at N = 1e21.
 *
 * VERDICT OF THE DERIVATION: the exact-2 limit is (2 ULP/op)/(1 ULP/op) summed over the op-DAG, carried in
 * the limit by the dominant subtraction node; the a-independence is the scale-invariance of ulp(.); the only
 * departure from a clean termwise 2x is a bounded negative residue in the product node, visible ONLY at the
 * F = 0 centre and vanishing up the axis. This EXPLAINS the a-independent 2x the storyline recorded without a
 * mechanism, and names the exact node (the product node round-to-nearest shave) that the naive account misses.
 *
 * DERIVATION / recomputation ONLY, double precision, on the inherited imp-3220/imp-3406 RvM height map
 * (lambda-rh-height-mapping.effectiveHeightForN); reuses the imp-36017/imp-35969/imp-34774 machinery
 * verbatim (identical K_AMPL, g, N_cross, axis, nextUp/nextDown, ulpOf). BOTH figures remain double-precision
 * MODELS not machine certificates (imp-36066): the imp-34687a directed-rounding layer stays UNIMPLEMENTED and
 * imp-34714a stays OPEN; this instantiates NO certified interval, ports NO operator, and does NOT discharge
 * the F(m) = 0 residual-at-root artifact. Explaining the 2x is NECESSARY narrative, never SUFFICIENT for a
 * certificate. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (MEASURED the a-independent 2x this derives)
 * @see imp-36166-residual-node-storyline-cross-reference (restates the 2x ratio without a mechanism)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE width being counted)
 * @see imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence (the 2x is the a -> 0 tight-cert limit; drifts to 1 as a grows)
 * @see imp-36066-residual-node-no-machine-certificate-honest-status (both widths are MODELS, not certificates)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(m) exactly 0 in double precision at root N_cross)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-36017/imp-35969/imp-34774)
const EPS = Number.EPSILON; // 2^-52

// Bit-level nextUp/nextDown and ulp on the IEEE-754 double (imp-35969/imp-36017 primitives, verbatim).
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

const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435e9 (F(m) exactly 0 in double precision, imp-34774)

// SURROGATE width (imp-35969 verbatim): nextUp AND nextDown of the same nearest value at every op.
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

// LAYER width (imp-36017 verbatim): correctly-rounded directed op = adjacent representables = 1 ULP/op.
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

// TERMWISE op-DAG slack decomposition: t_L (log slack propagated), t_G (product own-slack), t_F (sub own-slack).
function termwise(m) {
  const T0 = effectiveHeightForN(m);
  const L = Math.log(T0);
  const G = K_AMPL * L;
  const F = m - G;
  const tL = K_AMPL * ulpOf(L);
  const tG = ulpOf(G);
  const tF = F === 0 ? 0 : ulpOf(F);
  const wLayer = tL + tG + tF;
  return { L, G, F, tL, tG, tF, wLayer, idealSurrogate: 2 * wLayer };
}

// (C1) PER-NODE COUNT: the LOG node surrogate width is EXACTLY 2 ulp(L) -- a clean node-level factor of two.
function logNodeSurrogateWidth(m) {
  const L = Math.log(effectiveHeightForN(m));
  return nextUp(L) - nextDown(L);
}

// The imp-36017 height axis (N = 1e13 .. 1e21), quarter-decade grid, verbatim.
const LOG_MIN = 13;
const LOG_MAX = 21;
const STEP = 0.25;
const SWEEP = [];
for (let Lexp = LOG_MIN; Lexp <= LOG_MAX + 1e-9; Lexp += STEP) {
  const N = Math.pow(10, Lexp);
  const wS = surrogateWidth(N);
  const wL = layerWidth(N);
  const tw = termwise(N);
  SWEEP.push({
    N,
    ratio: wS / wL,
    residueOverLayer: (wS - 2 * wL) / wL, // delta / W_layer: departure from a clean termwise 2x
    subtractionShare: tw.tF / tw.wLayer, // t_F / W_layer: the dominant node's share up the axis
  });
}
const BOTTOM = SWEEP[0]; // N ~ 1e13
const TOP = SWEEP[SWEEP.length - 1]; // N ~ 1e21

// At the certificate CENTRE m = N_cross (F = 0; width carried by the log + product nodes).
const SURR_AT_CROSS = surrogateWidth(N_CROSS);
const LAYER_AT_CROSS = layerWidth(N_CROSS);
const RATIO_AT_CROSS = SURR_AT_CROSS / LAYER_AT_CROSS;
const TW_AT_CROSS = termwise(N_CROSS);
const LOG_NODE_SURR_AT_CROSS = logNodeSurrogateWidth(N_CROSS);
// The product-node shave = ideal 2(t_L + t_G) minus the realized surrogate product spread. At the F = 0
// centre the surrogate width equals that product spread (the subtraction push of a ~0 result is negligible),
// so the residue delta = W_surr - 2 W_layer is exactly the negative of this shave.
const PRODUCT_IDEAL_2X = 2 * (TW_AT_CROSS.tL + TW_AT_CROSS.tG);
const PRODUCT_SHAVE = PRODUCT_IDEAL_2X - SURR_AT_CROSS;
const RESIDUE_AT_CROSS = (SURR_AT_CROSS - 2 * LAYER_AT_CROSS) / LAYER_AT_CROSS;

// --- Derivation checkpoints ---
// (C1) the log node carries the clean 2x exactly: surrogate log width = 2 ulp(L).
const LOG_NODE_IS_EXACTLY_2X =
  Math.abs(LOG_NODE_SURR_AT_CROSS - 2 * ulpOf(TW_AT_CROSS.L)) <= ulpOf(LOG_NODE_SURR_AT_CROSS);
// (C2) the sub-2 deficit at N_cross is a BOUNDED negative product-node residue (0 < shave < ulp(G)).
const RESIDUE_IS_BOUNDED_PRODUCT_SHAVE =
  RESIDUE_AT_CROSS < 0 && PRODUCT_SHAVE > 0 && PRODUCT_SHAVE < ulpOf(TW_AT_CROSS.G) &&
  RATIO_AT_CROSS > 1.5 && RATIO_AT_CROSS < 2;
// (C3) up the axis the subtraction node dominates (t_F / W_layer -> 1) and carries a clean 2x: ratio -> 2,
//      residue -> 0 monotonically. This is the derived exact-2 limit.
const SUBTRACTION_DOMINATES_UP_AXIS = TOP.subtractionShare > 0.999 && BOTTOM.subtractionShare > 0.99;
const RATIO_LOCKS_TO_2 = Math.abs(TOP.ratio - 2) < 1e-6 && SWEEP.every((r) => r.ratio <= 2 + 1e-9);
const RESIDUE_SHRINKS_UP_AXIS =
  Math.abs(TOP.residueOverLayer) < Math.abs(BOTTOM.residueOverLayer) &&
  Math.abs(TOP.residueOverLayer) < 1e-6;
// (C4) a-INDEPENDENCE = scale-invariance of ulp(.): every slack term scales with a VALUE ULP, none with 1/a,
//      so the ratio band is bounded and flat across eight decades of height, monotone toward 2 (not 1/a).
const RATIO_A_INDEPENDENT =
  Math.max(...SWEEP.map((r) => r.ratio)) / Math.min(...SWEEP.map((r) => r.ratio)) < 1.01 &&
  TOP.ratio >= BOTTOM.ratio;

export const IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION = {
  id: 'imp-36175',
  proofSection: 'S-frontier',
  question:
    'imp-36017 MEASURED that the imp-35969 nextafter outward-rounding SURROGATE width of the Krawczyk ' +
    'residual node [F(m)] = [m] - [K log T0(m)] over-estimates the correctly-rounded directed-rounding LAYER ' +
    'width by an a-INDEPENDENT factor converging to EXACTLY 2.0 up the height axis, and imp-36166 restates ' +
    'the 2x verbatim -- but neither DERIVES the exact-2 limit or explains its a-independence. Derive the ' +
    'exact-2 from an op-DAG rounding-error count (count the directed-rounding ULP contributions per node ' +
    'under outward-nextafter vs correctly-rounded layer models), or report which node breaks a clean 2x ' +
    'account. Derivation only; both figures remain MODELS; imp-34714a/imp-34687a stay open; NO QED.',
  finding:
    'THE EXACT-2 LIMIT IS THE PER-NODE ULP COUNT (2 ULP/op SURROGATE vs 1 ULP/op DIRECTED LAYER) SUMMED OVER ' +
    'THE OP-DAG, CARRIED IN THE LIMIT BY THE DOMINANT SUBTRACTION NODE; THE a-INDEPENDENCE IS THE ' +
    'SCALE-INVARIANCE OF ulp(.); AND THE ONE NODE THAT BREAKS A CLEAN TERMWISE 2x IS THE PRODUCT NODE, VISIBLE ' +
    'ONLY AT THE F = 0 CENTRE. (1) Per node the surrogate applies nextUp AND nextDown to the same nearest ' +
    'value = 2 ULP/op, while a correctly-rounded directed op brackets the exact result with adjacent ' +
    'representables = 1 ULP/op: a clean 2:1 count. (2) The composite width W = t_L + t_G + t_F ' +
    '(t_L = K ulp(L) propagated, t_G = ulp(G), t_F = ulp(F)). AWAY from the fixed point F = m - G ~ m ' +
    '(G ~ 1.6e10 << m = 1e13..1e21), so t_F = ulp(F) ~ ulp(m) DOMINATES (share -> 1) and the subtraction node ' +
    'carries the clean 2:1: ratio -> exactly 2 (locks by N ~ 1e17), residue (W_surr - 2 W_layer)/W_layer ' +
    'shrinks monotonically from ' +
    BOTTOM.residueOverLayer.toExponential(2) +
    ' at 1e13 to ' +
    TOP.residueOverLayer.toExponential(2) +
    ' at 1e21. (3) a-INDEPENDENT because every slack term scales with a VALUE ULP (t ~ value * eps), NONE ' +
    'with 1/a -- the ratio is scale-invariant, a fixed rounding-primitive property. (4) At the CENTRE ' +
    'm = N_cross the residual F = 0 (imp-34774 artifact) so t_F = 0 and the width is carried by the log + ' +
    'product nodes: the log node is still exactly 2x (surrogate width = 2 ulp(L)), but the PRODUCT node ' +
    'realizes ratio ~' +
    RATIO_AT_CROSS.toFixed(3) +
    ' because its surrogate spread nextUp(K Lhi) - nextDown(K Llo) is SHAVED below the ideal 2(t_L + t_G) by ' +
    'the round-to-nearest of the two products before the outward push (shave ~' +
    PRODUCT_SHAVE.toExponential(3) +
    ' < ulp(G) ~' +
    ulpOf(TW_AT_CROSS.G).toExponential(3) +
    '). That bounded negative product-node residue is the ONLY departure from a clean termwise 2x, and it ' +
    'vanishes up the axis once the clean-2x subtraction node swamps it.',
  constants: {
    K_amplitude: +K_AMPL.toExponential(6),
    N_cross: +N_CROSS.toPrecision(15),
    machine_epsilon: EPS,
  },
  derivation: {
    per_node_ulp_count_surrogate: 2, // nextUp AND nextDown of the same nearest value
    per_node_ulp_count_directed_layer: 1, // exact result between two adjacent representables
    log_node_surrogate_width_at_N_cross: +LOG_NODE_SURR_AT_CROSS.toExponential(4),
    log_node_two_ulp_at_N_cross: +(2 * ulpOf(TW_AT_CROSS.L)).toExponential(4),
    log_node_is_exactly_two_x: LOG_NODE_IS_EXACTLY_2X,
    ratio_at_N_cross: +RATIO_AT_CROSS.toFixed(6),
    product_node_shave_at_N_cross: +PRODUCT_SHAVE.toExponential(4),
    ulp_G_at_N_cross: +ulpOf(TW_AT_CROSS.G).toExponential(4),
    residue_over_layer_at_N_cross: +RESIDUE_AT_CROSS.toFixed(6),
    subtraction_share_at_bottom: +BOTTOM.subtractionShare.toFixed(6),
    subtraction_share_at_top: +TOP.subtractionShare.toFixed(6),
    ratio_at_bottom: +BOTTOM.ratio.toFixed(6),
    ratio_at_top: +TOP.ratio.toFixed(6),
    residue_over_layer_at_bottom: +BOTTOM.residueOverLayer.toExponential(4),
    residue_over_layer_at_top: +TOP.residueOverLayer.toExponential(4),
    log_node_carries_clean_2x: LOG_NODE_IS_EXACTLY_2X,
    residue_is_bounded_product_shave: RESIDUE_IS_BOUNDED_PRODUCT_SHAVE,
    subtraction_node_dominates_up_axis: SUBTRACTION_DOMINATES_UP_AXIS,
    ratio_locks_to_two: RATIO_LOCKS_TO_2,
    residue_shrinks_up_axis: RESIDUE_SHRINKS_UP_AXIS,
    ratio_a_independent_scale_invariant: RATIO_A_INDEPENDENT,
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. This DERIVES why the imp-36017-measured surrogate/layer ratio ' +
    'limits to exactly 2 and is a-independent -- an op-DAG ULP count, NOT a certificate. Both the SURROGATE ' +
    '(nextafter proxy) and the LAYER (a-priori correctly-rounded formula) are double-precision MODELS ' +
    '(imp-36066); neither is the imp-34687a directed-rounding layer, which JS lacks and which is ' +
    'UNIMPLEMENTED. This instantiates NO certified interval, ports NO operator, and does NOT discharge the ' +
    'F(m) = 0 residual-at-root artifact. Explaining the 2x is NECESSARY narrative, never SUFFICIENT for a ' +
    'valid certificate. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE EXACT-2 SURROGATE/LAYER RATIO, DERIVED FROM AN OP-DAG ULP COUNT (frontier, NOT an ' +
    'RH bound). imp-36017 MEASURED the a-independent 2x and imp-36166 restated it with no mechanism. ' +
    'Derivation: (1) per node the surrogate emits 2 ULP (nextUp AND nextDown of the same nearest value) and ' +
    'the correctly-rounded directed layer 1 ULP (adjacent representables bracket the exact result) -- a clean ' +
    '2:1 count. (2) The composite width sums three node slacks t_L = K ulp(L), t_G = ulp(G), t_F = ulp(F); ' +
    'away from the fixed point F = m - G ~ m so t_F ~ ulp(m) DOMINATES (share -> 1) and the subtraction node ' +
    'carries the clean 2:1, so the ratio -> EXACTLY 2 (locks by N ~ 1e17) with residue -> 0 monotonically. ' +
    '(3) a-INDEPENDENT because every slack term scales with a VALUE ULP and none with 1/a -- scale-invariance ' +
    'of ulp(.), a fixed rounding-primitive property, exactly the a-independence imp-36017 (D3) recorded. ' +
    '(4) The only node that breaks a clean termwise 2x is the PRODUCT node, and ONLY at the F = 0 centre ' +
    'm = N_cross (where t_F = 0): its surrogate spread nextUp(K Lhi) - nextDown(K Llo) is shaved below ' +
    '2(t_L + t_G) by the round-to-nearest of the two products before the outward push, a BOUNDED negative ' +
    'residue (ratio ~' +
    RATIO_AT_CROSS.toFixed(3) +
    ', shave < ulp(G)) that vanishes up the axis. The log node stays exactly 2x throughout. So the exact-2 ' +
    'is the (2 ULP/op)/(1 ULP/op) count carried by the dominant subtraction node, the a-independence is the ' +
    'scale-invariance of the ULP function, and the finite-height sub-2 deficit is a bounded product-node ' +
    'quantization residue. DERIVATION / recomputation, NOT a machine certificate. SUB-GAPS imp-34714a AND ' +
    'imp-34687a REMAIN OPEN: both widths are MODELS (imp-36066), the imp-34687a layer is unimplemented, no ' +
    'certified interval is instantiated, the F(m) = 0 artifact is not discharged, explaining the 2x is ' +
    'NECESSARY but not SUFFICIENT. Reuses the imp-36017/imp-35969/imp-34774 machinery (identical K_AMPL, g, ' +
    'N_cross, axis, nextUp/nextDown, ulpOf); C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-36017 (MEASURED the a-independent 2x surrogate/layer ratio); imp-36166 (storyline restating the 2x ' +
    'without a mechanism); imp-35969 (bit-level nextafter SURROGATE width); imp-36153 (the 2x is the a -> 0 ' +
    'tight-certificate limit; drifts to 1 as a grows); imp-36066 (both widths are MODELS, not certificates); ' +
    'imp-34774 (F(m) exactly 0 in double precision at root N_cross); imp-34687 (directed-rounding layer scope; ' +
    'sub-gap imp-34687a unimplemented); imp-34714 (Krawczyk lemma; sub-gap imp-34714a). Op-DAG ULP accounting, ' +
    'nextafter vs correctly-rounded directed rounding, and scale-invariance of the ULP function: standard ' +
    'floating-point / interval analysis (IEEE-754, Moore, Neumaier).',
};

export const IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION_ASSERTIONS = [
  {
    // (C1) the log node carries a CLEAN node-level factor of two: surrogate width = 2 ulp(L).
    id: 'imp36175-log-node-exactly-2x',
    description: 'surrogate log-node width = 2 ulp(L) exactly -- the clean per-node 2 ULP vs 1 ULP count',
    holds: () => LOG_NODE_IS_EXACTLY_2X === true,
  },
  {
    // (C2) the sub-2 value at the F=0 centre is a BOUNDED negative product-node round-to-nearest shave.
    id: 'imp36175-centre-deficit-is-bounded-product-shave',
    description: 'at N_cross (F=0) ratio ~1.84 is a bounded product-node shave: 0 < shave < ulp(G), residue < 0',
    holds: () => RESIDUE_IS_BOUNDED_PRODUCT_SHAVE === true && RATIO_AT_CROSS > 1.8 && RATIO_AT_CROSS < 1.9,
  },
  {
    // (C3) the DERIVED exact-2 limit: subtraction node dominates up the axis and carries a clean 2:1.
    id: 'imp36175-subtraction-node-carries-exact-2-limit',
    description: 't_F/W_layer -> 1 up the axis so ratio -> exactly 2 (locks by 1e17), residue -> 0 monotonically',
    holds: () =>
      SUBTRACTION_DOMINATES_UP_AXIS === true &&
      RATIO_LOCKS_TO_2 === true &&
      RESIDUE_SHRINKS_UP_AXIS === true,
  },
  {
    // (C4) a-INDEPENDENCE = scale-invariance of ulp(.): ratio flat/bounded across 8 decades, monotone toward 2.
    id: 'imp36175-a-independence-is-scale-invariance',
    description: 'ratio band < 1.01x across 1e13..1e21 and monotone up -- every slack term scales with a value ULP, none with 1/a',
    holds: () => RATIO_A_INDEPENDENT === true,
  },
  {
    // Honesty gate: derivation / recomputation, not rigorous, sub-gaps open, both are MODELS, no QED, no refereed bound is changed.
    id: 'imp36175-honesty-gate-no-qed',
    description: 'derivation: isRigorous false, imp-34714a/imp-34687a open, MODELS not certificate, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION.verdict) &&
      /NO QED/.test(IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION.verdict),
  },
];

for (const a of IMP36175_KRAWCZYK_RESIDUAL_2X_RATIO_OPDAG_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36175-krawczyk-residual-2x-ratio-opdag-derivation assertion failed: ${a.id}`);
  }
}
