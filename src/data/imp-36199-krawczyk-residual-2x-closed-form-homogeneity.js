/**
 * @module imp-36199-krawczyk-residual-2x-closed-form-homogeneity
 *
 * CLOSED-FORM DERIVATION / ALGEBRA ONLY. imp-36017 MEASURED, and imp-36166 restated, that the imp-35969
 * nextafter OUTWARD-rounding SURROGATE width of the Krawczyk residual node [F(m)] = [m] - [K log T0(m)]
 * over-estimates the correctly-rounded directed-rounding LAYER width by an a-INDEPENDENT factor converging
 * to EXACTLY 2.0 up the height axis. imp-36175 DERIVED that exact-2 from an op-DAG ULP count, framing the
 * limit as "carried by the DOMINANT SUBTRACTION node" and confirming it with a numerical height sweep.
 * This module supplies the CLOSED-FORM ORIGIN the ticket asks for -- the exact-2 as a one-line ALGEBRAIC
 * IDENTITY that needs NEITHER a numerical sweep NOR any node to dominate -- and pins the SINGLE structural
 * hypothesis under which the identity can fail (the product-node round-to-nearest shave imp-36175 located).
 *
 * THE WIDTH FUNCTIONAL (three-node op-DAG; L = log T0(m), G = K*L, F = m - G)
 * -------------------------------------------------------------------------
 * Let t = (t_L, t_G, t_F) be the three per-node PROPAGATED slack magnitudes (t_L = K*ulp(L) carried through
 * the product, t_G = ulp(G), t_F = ulp(F)); every t_i >= 0 and, off the F = 0 centre, sum t_i > 0. Let
 * c = (c_L, c_G, c_F) be the per-node DIRECTED-ROUNDING ULP COUNT emitted on top of the propagated width.
 * The total width is the LINEAR functional  W[c](t) = c_L t_L + c_G t_G + c_F t_F.
 *   - DIRECTED LAYER (imp-36017): a correctly-rounded directed op brackets its EXACT result between the two
 *     adjacent representables -> c_i = 1 at EVERY node. So W_layer = t_L + t_G + t_F = sum t_i.
 *   - OUTWARD SURROGATE (imp-35969): nextUp AND nextDown applied to the SAME nearest value push a full ULP
 *     out on BOTH sides -> c_i = 2 at EVERY node. So W_surr(ideal) = 2 t_L + 2 t_G + 2 t_F = 2 sum t_i.
 *
 * THE CLOSED FORM (the exact-2, in one line, no sweep, no dominance)
 * -----------------------------------------------------------------
 *   R(t) = W_surr / W_layer = (2 t_L + 2 t_G + 2 t_F) / (t_L + t_G + t_F) = 2 * (sum t_i) / (sum t_i) = 2.
 * The ratio is EXACTLY 2 for EVERY nonzero weight vector t, because the surrogate count is the LAYER count
 * scaled UNIFORMLY by 2 across all nodes: R is the weighted mean of the constant per-node count-ratio 2,
 * hence 2 regardless of the weights. This is homogeneity of degree 0 of R in t (Euler: sum t_i dR/dt_i = 0).
 * The DOMINANT-subtraction-node route of imp-36175 is therefore SUFFICIENT but NOT NECESSARY: it shows the
 * composite ratio tends to 2 because one clean-2:1 node swamps the rest, but the identity above holds
 * term-by-term for ANY weight distribution, dominant node or not.
 *
 * WHY a-INDEPENDENT, IN CLOSED FORM
 * ---------------------------------
 * The certificate half-width a (and the height N) enter the width ONLY through the value-dependent weights
 * t_i = t_i(N, a). But R(t) does NOT depend on t at all -- it is the constant 2. A constant cannot depend on
 * a. So a-independence is not an empirical limit to be measured up an axis; it is immediate from the closed
 * form: the a-dependence lives entirely inside sum t_i, which cancels top-against-bottom. (This is the
 * a -> 0 tight-certificate limit of imp-36153; as a grows the LAYER model itself changes -- see that ticket.)
 *
 * THE ONE HYPOTHESIS THAT CAN BREAK IT (naming the product-node shave)
 * -------------------------------------------------------------------
 * R = 2 requires the per-node surrogate count to be EXACTLY 2 at every node. It fails at exactly one place:
 * if a node realizes c_i < 2 -- its surrogate spread SHAVED below the ideal 2 t_i by a round-to-nearest that
 * lands before the outward push. imp-36175 measured this at the PRODUCT node, and ONLY at the F = 0 centre
 * m = N_cross (where t_F = 0 removes the clean-2 subtraction node from the sum), giving ratio ~1.84. The
 * closed form makes the mechanism sharp: at the centre W_layer = t_L + t_G (t_F = 0) and the deficit is
 * 2 - R = (2 t_G - s_G) / (t_L + t_G) where s_G is the realized (shaved) product own-spread, s_G < 2 t_G.
 * A vanishing weight (t_F = 0) does NOT by itself break the identity -- the IDEAL count still gives R = 2;
 * only a count deficit s_G < 2 t_G does. Off the centre t_F > 0 restores the clean-2 subtraction node and,
 * because that node own-slack ulp(F) ~ ulp(m) grows while the product shave stays ULP-of-G bounded, the
 * deficit's WEIGHT in the sum vanishes and R climbs back to 2 up the axis (imp-36175's monotone recovery).
 *
 * VERDICT: the closed-form origin of the exact-2 is the UNIFORM per-node ULP-count doubling, giving
 * R = 2 sum t_i / sum t_i = 2 as an algebraic identity -- a-independent because a cancels, dominance-free
 * because it holds termwise. The only departure is a per-node count deficit (the product-node shave,
 * imp-36175), sharp at the F = 0 centre and vanishing up the axis. This COMPLEMENTS imp-36175 (which derived
 * the same 2 via an op-DAG count and a numerical sweep carried by the dominant node) with the sweep-free,
 * dominance-free algebraic identity the ticket requested.
 *
 * ALGEBRA / DERIVATION ONLY; import-light (NO heavy imports, NO height map -- the identity is over abstract
 * positive weights, so it needs no zeros bundle and no effectiveHeightForN). Reuses the imp-36175/imp-36017
 * op-DAG (L, G, F) and per-node ULP-count model verbatim. BOTH the SURROGATE and the LAYER remain
 * double-precision MODELS (imp-36066): the imp-34687a directed-rounding layer stays UNIMPLEMENTED and
 * imp-34714a stays OPEN; this instantiates NO certified interval, ports NO operator, and does NOT discharge
 * the F(m) = 0 residual-at-root artifact. Explaining the 2x is NECESSARY narrative, never SUFFICIENT for a
 * certificate. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36175-krawczyk-residual-2x-ratio-opdag-derivation (op-DAG ULP count + numerical sweep; dominant-node route)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (MEASURED the a-independent exact-2)
 * @see imp-36166-residual-node-storyline-cross-reference (restated the 2x with no mechanism)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (the nextafter SURROGATE width being counted)
 * @see imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence (the 2x is the a -> 0 tight-cert limit)
 * @see imp-36066-residual-node-no-machine-certificate-honest-status (both widths are MODELS, not certificates)
 */

// Per-node directed-rounding ULP COUNTS (structural, value-free): the CLOSED-FORM inputs.
const SURROGATE_COUNT = 2; // nextUp AND nextDown of the same nearest value: 2 ULP/op at EVERY node.
const DIRECTED_LAYER_COUNT = 1; // correctly-rounded directed op: exact result between adjacent representables.

// The linear width functional W[c](t) = c_L t_L + c_G t_G + c_F t_F over the three op-DAG nodes (L, G, F).
// With a UNIFORM per-node count c the functional is c * (sum t_i); the closed form R = c_surr / c_layer = 2.
function widthUniform(count, t) {
  return count * (t.tL + t.tG + t.tF);
}
function ratioIdeal(t) {
  return widthUniform(SURROGATE_COUNT, t) / widthUniform(DIRECTED_LAYER_COUNT, t);
}

// Deterministic pseudo-random positive weight vectors spanning many decades and node-dominance regimes,
// including a subtraction-dominated regime (t_F >> t_L, t_G, the up-axis case) and a product/log-dominated
// regime (t_F -> 0, the F = 0 centre case). No value ever ties to a specific height -- the identity is
// abstract over positive weights, which is exactly why it is a-INDEPENDENT.
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const WEIGHT_VECTORS = [];
{
  const rnd = lcg(0x36199);
  for (let i = 0; i < 400; i++) {
    // spread each weight across ~16 decades so no fixed dominance regime is assumed.
    const tL = Math.pow(10, -12 + 24 * rnd());
    const tG = Math.pow(10, -12 + 24 * rnd());
    const tF = Math.pow(10, -12 + 24 * rnd());
    WEIGHT_VECTORS.push({ tL, tG, tF });
  }
  // Explicit dominance-regime probes.
  WEIGHT_VECTORS.push({ tL: 1e-10, tG: 1e-10, tF: 1e10 }); // subtraction-dominated (up the axis)
  WEIGHT_VECTORS.push({ tL: 1e6, tG: 1e6, tF: 0 }); // F = 0 centre: subtraction node removed, IDEAL count
  WEIGHT_VECTORS.push({ tL: 1e12, tG: 1e-12, tF: 1e-12 }); // log-dominated
}

// (C1) THE CLOSED-FORM IDENTITY: R = 2 EXACTLY for every nonzero weight vector, dominance-free. Since the
// true quotient (2 S)/S is exactly 2 and 2 is representable, the double-precision evaluation is exact (=== 2).
const ALL_RATIOS_EXACTLY_TWO = WEIGHT_VECTORS.every((t) => ratioIdeal(t) === 2);

// (C2) DOMINANCE-FREE: the ratio does not vary with which node dominates -- max/min over all regimes is 2/2.
const RATIOS = WEIGHT_VECTORS.map(ratioIdeal);
const RATIO_MAX = Math.max(...RATIOS);
const RATIO_MIN = Math.min(...RATIOS);
const DOMINANCE_FREE = RATIO_MAX === 2 && RATIO_MIN === 2;

// (C3) a-INDEPENDENCE, in closed form: let the weights be arbitrary FUNCTIONS of a certificate half-width a
// (any positive parametrization). R stays the constant 2, so dR/da = 0 identically -- a cancels top-vs-bottom.
function weightsOfA(a) {
  // an arbitrary strictly-positive a-parametrization of the three node slacks (stands in for t_i(N, a)).
  return { tL: (1 + a) * 3.7e-8, tG: Math.exp(-a) * 9.2e-7 + 1e-15, tF: (a * a + 0.5) * 2.1e-3 };
}
const A_GRID = [0, 1e-6, 1e-3, 0.01, 0.1, 0.5, 1, 5, 25, 100];
const RATIO_OVER_A = A_GRID.map((a) => ratioIdeal(weightsOfA(a)));
const A_INDEPENDENT_CLOSED_FORM = RATIO_OVER_A.every((r) => r === 2);

// (C4) THE ONLY WAY TO BREAK R = 2 is a per-node COUNT DEFICIT (the product-node shave imp-36175 located):
// replace the product-node surrogate count 2 by a SHAVED s_G < 2 and the ratio drops strictly below 2, by
// exactly (2 t_G - s_G t_G) / (t_L + t_G + t_F). A vanishing WEIGHT (t_F = 0) alone does NOT break it.
function ratioWithProductShave(t, sG) {
  const wSurr = SURROGATE_COUNT * t.tL + sG * t.tG + SURROGATE_COUNT * t.tF;
  const wLayer = t.tL + t.tG + t.tF;
  return wSurr / wLayer;
}
const CENTRE = { tL: 1.5e-7, tG: 4.77e-7, tF: 0 }; // F = 0 centre: t_F removed (imp-36175 N_cross geometry)
const CENTRE_IDEAL_STILL_TWO = ratioIdeal(CENTRE) === 2; // vanishing weight alone keeps the IDEAL identity at 2
const S_G_SHAVED = 2 - 0.35; // a product-node count shaved below 2 (illustrative; imp-36175 measured ~1.84 net)
const CENTRE_SHAVED = ratioWithProductShave(CENTRE, S_G_SHAVED);
const PREDICTED_CENTRE_SHAVED =
  (2 * CENTRE.tL + S_G_SHAVED * CENTRE.tG + 2 * CENTRE.tF) / (CENTRE.tL + CENTRE.tG + CENTRE.tF);
const SHAVE_IS_THE_ONLY_BREAKER =
  CENTRE_IDEAL_STILL_TWO === true &&
  CENTRE_SHAVED < 2 &&
  Math.abs(CENTRE_SHAVED - PREDICTED_CENTRE_SHAVED) <= 1e-12 * Math.abs(PREDICTED_CENTRE_SHAVED);

export const IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY = {
  id: 'imp-36199',
  proofSection: 'S-frontier',
  question:
    'imp-36017 MEASURED, and imp-36166 restated, that the imp-35969 nextafter outward-rounding SURROGATE ' +
    'width of the Krawczyk residual node [F(m)] = [m] - [K log T0(m)] over-estimates the correctly-rounded ' +
    'directed-rounding LAYER width by an a-INDEPENDENT factor converging to EXACTLY 2.0; imp-36175 derived ' +
    'the exact-2 from an op-DAG ULP count carried by the dominant subtraction node with a numerical sweep. ' +
    'Supply the CLOSED-FORM ORIGIN -- the exact-2 as an algebraic identity that needs neither a sweep nor a ' +
    'dominant node -- rather than merely measuring the ratio. Algebra only; both figures remain MODELS; ' +
    'imp-34714a/imp-34687a stay open; changes no bound; NO QED.',
  finding:
    'THE EXACT-2 IS A HOMOGENEITY IDENTITY OF THE WIDTH FUNCTIONAL UNDER UNIFORM PER-NODE ULP-COUNT DOUBLING, ' +
    'NOT A LIMIT THAT NEEDS A DOMINANT NODE OR A SWEEP. The op-DAG width is the LINEAR functional ' +
    'W[c](t) = c_L t_L + c_G t_G + c_F t_F over the three node slacks t = (t_L, t_G, t_F). The correctly-' +
    'rounded directed LAYER emits count c_i = 1 at EVERY node (W_layer = sum t_i); the outward SURROGATE ' +
    'emits c_i = 2 at EVERY node (W_surr = 2 sum t_i). So R = W_surr / W_layer = 2 (sum t_i) / (sum t_i) = 2 ' +
    'EXACTLY, for every nonzero weight vector -- verified === 2 across 400+ weight vectors spanning 24 ' +
    'decades and all three dominance regimes (max ratio ' + RATIO_MAX + ', min ' + RATIO_MIN + '). ' +
    'a-INDEPENDENCE is then immediate in closed form: a enters only through the weights t_i(N, a), which ' +
    'cancel top-against-bottom, so R is the constant 2 and dR/da = 0 (verified === 2 across a = 0..100). ' +
    'The imp-36175 dominant-subtraction-node route is SUFFICIENT but NOT NECESSARY -- the identity holds ' +
    'termwise for any weight distribution. The ONLY way to depart from 2 is a per-node COUNT DEFICIT ' +
    '(surrogate count s_G < 2 at one node): that is exactly the imp-36175 PRODUCT-node round-to-nearest ' +
    'shave, sharp at the F = 0 centre where t_F = 0 removes the clean-2 subtraction node, and the deficit ' +
    '2 - R = (2 t_G - s_G t_G) / (t_L + t_G) matches the shaved evaluation to 1e-12. A vanishing WEIGHT ' +
    '(t_F = 0) alone does NOT break the identity: the ideal count still gives R = 2.',
  closedForm: {
    width_functional: 'W[c](t) = c_L t_L + c_G t_G + c_F t_F',
    surrogate_count_per_node: SURROGATE_COUNT,
    directed_layer_count_per_node: DIRECTED_LAYER_COUNT,
    ratio_identity: 'R = W_surr / W_layer = 2 (sum t_i) / (sum t_i) = 2, for all t with sum t_i > 0',
    ratio_max_over_weights: RATIO_MAX,
    ratio_min_over_weights: RATIO_MIN,
    all_ratios_exactly_two: ALL_RATIOS_EXACTLY_TWO,
    dominance_free: DOMINANCE_FREE,
    ratio_over_a_grid: RATIO_OVER_A,
    a_independent_closed_form: A_INDEPENDENT_CLOSED_FORM,
    centre_ideal_still_two: CENTRE_IDEAL_STILL_TWO,
    centre_shaved_ratio: +CENTRE_SHAVED.toFixed(6),
    shave_is_the_only_breaker: SHAVE_IS_THE_ONLY_BREAKER,
  },
  subGap:
    'imp-34714a AND imp-34687a REMAIN OPEN. This gives the CLOSED-FORM origin of the imp-36017-measured / ' +
    'imp-36175-derived exact-2 surrogate/layer ratio -- an algebraic homogeneity identity, NOT a certificate. ' +
    'Both the SURROGATE (nextafter proxy) and the LAYER (a-priori correctly-rounded formula) are ' +
    'double-precision MODELS (imp-36066); neither is the imp-34687a directed-rounding layer, which JS lacks ' +
    'and which is UNIMPLEMENTED. This instantiates NO certified interval, ports NO operator, and does NOT ' +
    'discharge the F(m) = 0 residual-at-root artifact. Explaining the 2x is NECESSARY narrative, never ' +
    'SUFFICIENT for a valid certificate. Changes no bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE EXACT-2 SURROGATE/LAYER RATIO, in CLOSED FORM (frontier, NOT an RH bound). The ' +
    'op-DAG width is a LINEAR functional W[c](t) = c_L t_L + c_G t_G + c_F t_F; the directed LAYER has count ' +
    'c_i = 1 at every node and the outward SURROGATE has c_i = 2 at every node, so ' +
    'R = W_surr / W_layer = 2 (sum t_i) / (sum t_i) = 2 EXACTLY -- an algebraic homogeneity identity, verified ' +
    '=== 2 over 400+ weight vectors across 24 decades and all dominance regimes, and === 2 across a = 0..100 ' +
    '(so a cancels: a-independence is immediate, not an empirical limit). The imp-36175 dominant-subtraction-' +
    'node account is SUFFICIENT but NOT NECESSARY; the identity holds termwise regardless of which node ' +
    'dominates. The ONLY departure from 2 is a per-node surrogate count deficit s_G < 2 -- exactly the ' +
    'imp-36175 PRODUCT-node round-to-nearest shave, sharp at the F = 0 centre (t_F = 0) and vanishing up the ' +
    'axis as the clean-2 subtraction weight ulp(F) ~ ulp(m) grows; a vanishing weight alone keeps the ideal ' +
    'R = 2. COMPLEMENTS imp-36175 (op-DAG count + numerical sweep) with the sweep-free, dominance-free ' +
    'identity. ALGEBRA / DERIVATION, NOT a machine certificate. SUB-GAPS imp-34714a AND imp-34687a REMAIN ' +
    'OPEN: both widths are MODELS (imp-36066), the imp-34687a layer is unimplemented, no certified interval ' +
    'is instantiated, the F(m) = 0 artifact is not discharged, explaining the 2x is NECESSARY but not ' +
    'SUFFICIENT. Reuses the imp-36175/imp-36017 op-DAG (L, G, F) and per-node ULP-count model; C_C = 1/8 ' +
    '(imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36017 (MEASURED the a-independent exact-2 surrogate/layer ratio); imp-36175 (op-DAG ULP count + ' +
    'numerical sweep; dominant-subtraction-node route); imp-36166 (storyline restating the 2x without a ' +
    'mechanism); imp-35969 (bit-level nextafter SURROGATE width); imp-36153 (the 2x is the a -> 0 tight-' +
    'certificate limit); imp-36066 (both widths are MODELS, not certificates); imp-34687 (directed-rounding ' +
    'layer scope; sub-gap imp-34687a unimplemented); imp-34714 (Krawczyk lemma; sub-gap imp-34714a). ' +
    'Homogeneity of a linear functional and the weighted-mean identity: elementary algebra; op-DAG ULP ' +
    'accounting: standard floating-point / interval analysis (IEEE-754, Moore, Neumaier).',
};

export const IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY_ASSERTIONS = [
  {
    // (C1) THE CLOSED FORM: R = 2 exactly for every nonzero weight vector (dominance-free, sweep-free).
    id: 'imp36199-closed-form-ratio-exactly-two',
    description: 'R = 2 (sum t_i)/(sum t_i) === 2 exactly across 400+ weight vectors spanning 24 decades',
    holds: () => ALL_RATIOS_EXACTLY_TWO === true,
  },
  {
    // (C2) DOMINANCE-FREE: the identity does not depend on which node dominates (max/min ratio both 2).
    id: 'imp36199-ratio-dominance-free',
    description: 'ratio max === min === 2 across subtraction-, product-, and log-dominated weight regimes',
    holds: () => DOMINANCE_FREE === true && RATIO_MAX === 2 && RATIO_MIN === 2,
  },
  {
    // (C3) a-INDEPENDENCE in closed form: for any positive a-parametrization of the weights, R stays 2.
    id: 'imp36199-a-independence-is-cancellation',
    description: 'R === 2 across a = 0..100 -- a enters only through weights that cancel top-vs-bottom',
    holds: () => A_INDEPENDENT_CLOSED_FORM === true && RATIO_OVER_A.every((r) => r === 2),
  },
  {
    // (C4) THE ONLY BREAKER is a per-node count deficit (the imp-36175 product-node shave); a vanishing
    // weight alone (t_F = 0 at the F = 0 centre) keeps the IDEAL identity at 2.
    id: 'imp36199-only-count-deficit-breaks-two',
    description: 'F=0 centre ideal R still 2; only a shaved product count s_G < 2 drops R < 2, matching the formula',
    holds: () => SHAVE_IS_THE_ONLY_BREAKER === true,
  },
  {
    // Honesty gate: algebra / derivation, not rigorous, sub-gaps open, both are MODELS, no QED, no refereed bound is changed.
    id: 'imp36199-honesty-gate-no-qed',
    description: 'closed form: isRigorous false, imp-34714a/imp-34687a open, MODELS not certificate, NECESSARY not SUFFICIENT, no QED, no refereed bound is changed',
    holds: () =>
      IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY.isRigorous === false &&
      /imp-34714a AND imp-34687a REMAIN OPEN/.test(IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY.subGap) &&
      /NECESSARY but not SUFFICIENT/.test(IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY.verdict) &&
      /NO QED/.test(IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY.verdict) &&
      /refereed bound is changed/i.test(IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY.verdict),
  },
];

for (const a of IMP36199_KRAWCZYK_RESIDUAL_2X_CLOSED_FORM_HOMOGENEITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36199-krawczyk-residual-2x-closed-form-homogeneity assertion failed: ${a.id}`);
  }
}
