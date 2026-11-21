/**
 * @module imp-36136-krawczyk-residual-directed-rounding-layer-construction-scope
 *
 * imp-36136 (proof/scoping, S-frontier): enumerate the CONCRETE construction steps required to turn
 * the imp-34687a directed-rounding LAYER for the Krawczyk residual node [F(m)] = [m] - [K log T0(m)]
 * from an a-priori MODEL into an ACTUAL machine certificate -- the analog, for the residual node, of
 * imp-36101's mechanical certified-sum step scoping and imp-36120's KBN-floor-to-interval scoping.
 *
 * imp-36066 records the honest status plainly: BOTH width figures for the residual node are a-priori
 * MODELS, not machine certificates. The imp-35969 nextafter (nextUp/nextDown) SURROGATE pushes both
 * endpoints one ULP outward per op (~2 ULP slack/op); the imp-36017 a-priori LAYER model is the
 * TIGHTEST correctly-rounded directed op (~1 ULP slack/op), so the surrogate over-estimates the layer
 * width a clean 2x (~1.84x at m = N_cross, locking to exactly 2.0 up the 1e13..1e21 axis, a-INDEPENDENT).
 * Neither is a machine certificate: stock JS Math has no directed-rounding mode and Math.log carries no
 * proven ULP bound, so the imp-34687a layer stays UNIMPLEMENTED and the imp-34714a Krawczyk
 * existence/uniqueness sub-gap stays OPEN.
 *
 * SCOPING / ASSESSMENT ONLY. Instantiates no interval; ports nothing; evaluates no residual; certifies
 * no enclosure; closes no sub-gap; imp-34687a stays UNIMPLEMENTED; imp-34714a stays OPEN. C_C = 1/8
 * (imp-2642/2643) and C_mb GUE-conditional (imp-486) untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE RESIDUAL NODE AND ITS OP-DAG
 * -----------------------------------------------------------------------------
 * F(m) = m - g(m), g(m) = K log T0(m), K = (C_C / E_trunc)^2 ~ 1.5727e8, T0 the Riemann-von Mangoldt
 * height inverse effectiveHeightForN(m). At the certificate centre m = N_cross ~ 3.28e9 the VALUE
 * F(m) collapses to 0 in double precision (the F(m) = 0 fixed-point artifact), but the certified
 * ENCLOSURE [F(m)] has a small NONZERO width (interval subtraction width = width([m]) + width([g]),
 * independent of the ~0 result). The op-DAG is three elementary ops:
 *      (op1) L = log(T0)     (op2) G = K * L      (op3) F = m - G
 * so a directed-rounding certificate for the node is a directed evaluation of exactly these three ops
 * over certified interval inputs.
 *
 * CONSTRUCTION STEPS (C1-C6): what a machine certificate for [F(m)] concretely requires
 * -----------------------------------------------------------------------------
 * C1  ROUNDING-MODE CONTROL PRIMITIVES. A directed-rounding op brackets its EXACT real result between
 *     the two adjacent representables (the imp-36017 LAYER model). Stock JS has no fesetround; two
 *     realizations exist. (a) The imp-35969 nextafter surrogate (nextUp/nextDown on the Float64 bit
 *     pattern) -- AVAILABLE, but pushes BOTH endpoints one ULP out per op (~2 ULP/op), so it is a
 *     CONSERVATIVE UPPER model, a clean 2x looser than the correctly-rounded layer (imp-36017). (b) A
 *     correctly-rounded / provably-outward primitive (TwoSum/TwoProduct residual tracking for +,-,*,
 *     and a proven-ULP transcendental log) -- GREENFIELD: the tight 1-ULP/op layer needs the
 *     correctly-rounded op, not the surrogate.
 * C2  INTERVAL log T0 ENCLOSURE. T0 = effectiveHeightForN(m) is itself the Newton inverse of the RvM
 *     count; the certificate needs a certified [T0] = [T_lo, T_hi] (the imp-34687 interval-Newton /
 *     Krawczyk contraction on f(T) = (T/2pi)(log(T/2pi)-1) - N, which imp-34687 SCOPED and imp-34714
 *     formalized as an exact lemma). log is monotone increasing, so [log T0] = [log T_lo, log T_hi]
 *     with directed rounding at the two endpoints -- STRUCTURE AVAILABLE (monotone endpoint map),
 *     but the correctly-rounded log itself is the C1(b) GREENFIELD primitive.
 * C3  K-SCALING INTERVAL. K = (C_C / E_trunc)^2 is a computed constant; the certificate carries a
 *     certified enclosure [K] (a short mechanical constant-folding of the pinned C_C = 1/8 and the
 *     E_trunc strip constant under directed rounding). K > 0 preserves order, so [G] = [K] * [log T0]
 *     = [K_lo * L_lo, K_hi * L_hi] is ONE directed interval multiply -- MECHANICAL / AVAILABLE.
 * C4  SUBTRACTION NODE. [F] = [m] - [G] = [m_lo - G_hi, m_hi - G_lo] with directed rounding; m enters
 *     as a point (or a one-ULP point interval). ONE directed interval subtract -- AVAILABLE. This is
 *     the near-cancellation node (F ~ 0), but the WIDTH is width([m]) + width([G]), blind to the ~0
 *     result, so there is NO cancellation inflation here (contrast the imp-35855 dG node, kappa ~ 4/a).
 * C5  ERROR-TERM ACCOUNTING. The a-priori LAYER width the certificate must ATTAIN is w_L = ulp(L),
 *     w_G = K * w_L + ulp(G), w_F = w_G + ulp(F) ~ w_G (imp-36017): ~1 ULP directed slack per op on
 *     top of the propagated operand width (K * w_L dominates). The surrogate ATTAINS ~2x that
 *     (imp-35969/imp-36017). Instantiating C1(b) is exactly what lets the certified width MEET the
 *     1-ULP/op model rather than the 2-ULP/op surrogate -- the accounting is standard, no OPEN math.
 * C6  INTERFACE TO imp-34714a (the operator, not the node). A certified [F(m)] is ONE input to the
 *     Krawczyk operator K(m) = m - [F-prime(m)]^{-1} [F(m)]; existence/uniqueness needs ALSO the
 *     enclosed derivative [F-prime] and the strict self-map inclusion K([m]) subset int([m]) (the
 *     imp-34714 (H1)-(H2) hypotheses). So a certified residual node is NECESSARY but NOT SUFFICIENT:
 *     it feeds the numerator; imp-34714a's full-operator existence/uniqueness stays OPEN.
 *
 * GREENFIELD vs AVAILABLE
 * -----------------------------------------------------------------------------
 * AVAILABLE (mechanical, no open math): the three-op op-DAG structure; the nextafter surrogate
 * primitive (C1a, conservative 2x); the monotone-endpoint log enclosure structure (C2); the K > 0
 * order-preserving interval multiply and the [K] constant fold (C3); the directed interval subtract
 * (C4); the a-priori LAYER error accounting (C5); the imp-34687-scoped / imp-34714-formalized RvM
 * interval-Newton contraction that supplies [T0].
 * GREENFIELD (not implemented): a correctly-rounded / provably-outward transcendental log primitive
 * (C1b -- the only route to the tight 1-ULP/op layer width; stock Math.log has no proven ULP bound);
 * a machine directed-rounding mode in the JS runtime; and wiring the certified [F(m)] into the full
 * imp-34714a K(m) operator with a certified [F-prime] and the strict-inclusion self-map test.
 *
 * READING: the residual-node enclosure is CHEAP and a-independent, and every arithmetic step (C3-C5)
 * is mechanical. The certificate is NOT blocked by arithmetic precision -- the width sits far below any
 * binding scale and the surrogate is a valid 2x-conservative upper model. The genuine obstructions are
 * (i) a correctly-rounded log primitive to attain the tight layer width, and (ii) closing imp-34714a's
 * full-operator existence/uniqueness, for which a certified node is only a necessary input. This module
 * NAMES those steps; it instantiates no interval and ports nothing.
 *
 * @see imp-36066-residual-node-no-machine-certificate-honest-status (both width figures are MODELS; layer UNIMPLEMENTED, imp-34714a OPEN)
 * @see imp-35969-krawczyk-residual-directed-rounding-width (nextafter SURROGATE width; ~2 ULP/op; a-independent, tightening not inflating)
 * @see imp-36017-krawczyk-residual-surrogate-vs-layer-discrepancy (surrogate over-estimates the layer 2x; ~1.84x at N_cross, -> 2.0 up the axis)
 * @see imp-34687-crossover-interval-arithmetic-scope (RvM inverse interval-Newton enclosure; the C2 [T0] source; directed-rounding sub-gap)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (exact Krawczyk existence/uniqueness lemma; sub-gap imp-34714a = the C6 machine step)
 * @see imp-36101-w1-certified-sum-construction-steps-scope (mechanical certified-sum step scoping this parallels)
 * @see imp-36120-kbn-floor-to-interval-certificate-scope (KBN-floor-to-interval directed-rounding scoping this parallels)
 * @see Moore/Neumaier interval analysis; IEEE-754 directed rounding; crlibm correctly-rounded transcendentals
 */

// -- Anchor + operative constants (import-light; matching imp-35969 / imp-36017 / imp-36120) ---------
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // ~0.3837 ansatz (coefficient 1/8, imp-2642/2643/2714)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34774/imp-35855/imp-35969)
const N_CROSS = 3.28029435165241e9; // certificate centre, the F(m)=0 fixed point (imp-34774/imp-35969)

// The residual-node op-DAG: three elementary ops (log, multiply, subtract).
const RESIDUAL_OP_COUNT = 3; // op1 L=log(T0); op2 G=K*L; op3 F=m-G

// Per-op directed-rounding slack the two width MODELS attain (imp-35969 surrogate vs imp-36017 layer).
const SURROGATE_ULP_PER_OP = 2; // nextUp/nextDown pushes BOTH endpoints out per op
const LAYER_ULP_PER_OP = 1; // correctly-rounded directed op: one ULP bracket per op
const SURROGATE_OVER_LAYER_LIMIT = SURROGATE_ULP_PER_OP / LAYER_ULP_PER_OP; // = 2.0 (imp-36017 axis limit)
const SURROGATE_OVER_LAYER_AT_NCROSS = 1.84; // imp-36017 D2: ~1.84x at m=N_cross (finite ulp(G) share)

export const IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE = {
  id: 'imp-36136',
  proofSection: 'S-frontier',
  question:
    'Enumerate the concrete construction steps to implement the imp-34687a directed-rounding LAYER for ' +
    'the Krawczyk residual node [F(m)] = [m] - [K log T0(m)] at a reduced prototype, converting the ' +
    'imp-35969 nextafter surrogate and the imp-36017 a-priori LAYER model into an actual machine ' +
    'certificate: the rounding-mode control primitives, the interval log T0 enclosure, the K-scaling ' +
    'interval, error-term accounting, and the interface to imp-34714a -- and identify which are ' +
    'greenfield vs available. Scoping only; instantiates no interval; closes no sub-gap; NO QED.',
  bothWidthsAreModelsNotCertificates: {
    surrogateUlpPerOp: SURROGATE_ULP_PER_OP,
    layerUlpPerOp: LAYER_ULP_PER_OP,
    surrogateOverLayerAtNcross: SURROGATE_OVER_LAYER_AT_NCROSS,
    surrogateOverLayerLimit: SURROGATE_OVER_LAYER_LIMIT,
    clarification:
      'imp-36066: BOTH the imp-35969 nextafter surrogate (~2 ULP/op, conservative UPPER model) and the ' +
      'imp-36017 a-priori correctly-rounded LAYER (~1 ULP/op, the tightest achievable) are MODELS, not ' +
      'machine certificates; the surrogate over-estimates the layer ~1.84x at N_cross, locking to exactly ' +
      '2.0 up the 1e13..1e21 axis (a-INDEPENDENT). The imp-34687a layer stays UNIMPLEMENTED.',
  },
  opDag: {
    center: N_CROSS,
    valueCollapsesToZero:
      'F(m) = m - K log T0(m) collapses to 0 in double precision at m = N_cross, but the ENCLOSURE ' +
      '[F(m)] has a small nonzero width = width([m]) + width([g]), blind to the ~0 result',
    ops: 'op1: L = log(T0); op2: G = K * L; op3: F = m - G',
    opCount: RESIDUAL_OP_COUNT,
  },
  constructionSteps: {
    C1_roundingModePrimitives:
      'directed-rounding op brackets its exact real result between adjacent representables. (a) nextafter ' +
      'surrogate (nextUp/nextDown on the Float64 bit pattern) is AVAILABLE but ~2 ULP/op (conservative 2x); ' +
      '(b) a correctly-rounded / provably-outward primitive (TwoSum/TwoProduct + proven-ULP log) is ' +
      'GREENFIELD and is the ONLY route to the tight 1 ULP/op layer width',
    C2_intervalLogT0Enclosure:
      'the certificate needs a certified [T0] = [T_lo, T_hi] from the imp-34687-scoped / imp-34714-formalized ' +
      'RvM interval-Newton contraction; log monotone increasing gives [log T0] = [log T_lo, log T_hi] with ' +
      'directed endpoints (STRUCTURE available), but the correctly-rounded log itself is the C1(b) GREENFIELD',
    C3_kScalingInterval:
      'K = (C_C / E_trunc)^2 folds to a certified [K] under directed rounding (mechanical constant fold of ' +
      'pinned C_C=1/8 and the E_trunc strip constant); K > 0 preserves order so [G] = [K] * [log T0] is ONE ' +
      'directed interval multiply -- MECHANICAL / AVAILABLE',
    C4_subtractionNode:
      '[F] = [m] - [G] with directed rounding, m a point; ONE directed interval subtract -- AVAILABLE. Width ' +
      '= width([m]) + width([G]) is blind to the ~0 result, so NO cancellation inflation (contrast the ' +
      'imp-35855 dG node kappa ~ 4/a)',
    C5_errorTermAccounting:
      'a-priori LAYER width to ATTAIN: w_L = ulp(L), w_G = K*w_L + ulp(G), w_F = w_G + ulp(F) ~ w_G ' +
      '(imp-36017) -- ~1 ULP directed slack/op over the propagated operand width; standard error analysis, ' +
      'no OPEN math; C1(b) is what lets the certified width MEET the 1 ULP/op model, not the 2x surrogate',
    C6_interfaceToImp34714a:
      'a certified [F(m)] is ONE input to K(m) = m - [F-prime(m)]^{-1} [F(m)]; existence/uniqueness needs ' +
      'ALSO the enclosed [F-prime] and the strict self-map inclusion K([m]) subset int([m]) (imp-34714 ' +
      '(H1)-(H2)). Certified residual node is NECESSARY but NOT SUFFICIENT; imp-34714a stays OPEN',
  },
  greenfieldVsAvailable: {
    available: [
      'three-op op-DAG structure (log, multiply, subtract)',
      'nextafter surrogate primitive (C1a, conservative 2x upper model)',
      'monotone-endpoint interval log enclosure structure (C2)',
      'K > 0 order-preserving interval multiply and the [K] constant fold (C3)',
      'directed interval subtract at the F ~ 0 node (C4)',
      'a-priori LAYER error accounting (C5)',
      'imp-34687-scoped / imp-34714-formalized RvM interval-Newton contraction supplying [T0]',
    ],
    greenfield: [
      'correctly-rounded / provably-outward transcendental log primitive (C1b; the only route to the tight 1 ULP/op layer width)',
      'a machine directed-rounding mode in the JS runtime (no fesetround)',
      'wiring the certified [F(m)] into the full imp-34714a K(m) operator with certified [F-prime] and the strict-inclusion self-map test (C6)',
    ],
  },
  conclusion: {
    precisionNonBinding:
      'the residual-node enclosure width is CHEAP and a-independent (far below any binding scale), and the ' +
      'surrogate is a valid 2x-conservative upper model -- arithmetic precision is NOT the binding constraint',
    obstructionIsPrimitiveAndOperator:
      'the genuine obstructions are (i) a correctly-rounded log primitive to attain the tight layer width and ' +
      '(ii) closing imp-34714a full-operator existence/uniqueness, for which a certified node is only a ' +
      'necessary input -- NOT arithmetic precision',
    staysUnimplementedAndOpen:
      'this module scopes the steps; it instantiates no interval and ports nothing, so imp-34687a stays ' +
      'UNIMPLEMENTED and imp-34714a stays OPEN',
  },
  isRigorous: false,
  verdict:
    'KRAWCZYK RESIDUAL-NODE DIRECTED-ROUNDING LAYER, CONSTRUCTION STEPS SCOPED (frontier, NOT rigorous). ' +
    'imp-36066 records that BOTH width figures for [F(m)] = [m] - [K log T0(m)] are a-priori MODELS: the ' +
    'imp-35969 nextafter SURROGATE (~2 ULP/op, conservative) and the imp-36017 correctly-rounded LAYER ' +
    '(~1 ULP/op), the surrogate over-estimating the layer ~1.84x at N_cross and locking to exactly 2.0 up ' +
    'the axis (a-INDEPENDENT). The certificate is the three-op op-DAG log/multiply/subtract over certified ' +
    'inputs; construction steps: C1 rounding-mode primitives (nextafter surrogate AVAILABLE at 2x; a ' +
    'correctly-rounded log GREENFIELD), C2 interval log T0 enclosure (structure available from the ' +
    'imp-34687/imp-34714 RvM interval-Newton contraction; the log primitive is C1b greenfield), C3 K-scaling ' +
    'interval (mechanical [K] fold + one order-preserving multiply, AVAILABLE), C4 subtraction node (one ' +
    'directed subtract, no cancellation inflation, AVAILABLE), C5 error-term accounting (a-priori LAYER width ' +
    'w_F ~ w_G, standard, no open math), C6 interface to imp-34714a (certified node is NECESSARY but NOT ' +
    'SUFFICIENT for the full K(m) existence/uniqueness). Arithmetic precision is NON-binding (cheap, ' +
    'a-independent width; surrogate a valid 2x-conservative upper model); the genuine obstructions are a ' +
    'correctly-rounded log primitive and closing imp-34714a. SCOPING / ASSESSMENT ONLY: instantiates no ' +
    'interval; ports nothing; evaluates no residual; certifies no enclosure; closes no sub-gap; imp-34687a ' +
    'stays UNIMPLEMENTED; imp-34714a stays OPEN. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional ' +
    '(imp-486) untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36066 (both width figures are MODELS; layer UNIMPLEMENTED, imp-34714a OPEN); imp-35969 (nextafter ' +
    'surrogate width ~2 ULP/op, a-independent, tightening); imp-36017 (surrogate over-estimates layer 2x; ' +
    '~1.84x at N_cross -> 2.0 up the axis); imp-34687 (RvM inverse interval-Newton enclosure, C2 [T0] source; ' +
    'directed-rounding sub-gap); imp-34714 (Krawczyk existence/uniqueness lemma; sub-gap imp-34714a = C6 ' +
    'machine step); imp-36101 (mechanical certified-sum step scoping); imp-36120 (KBN-floor-to-interval ' +
    'scoping); imp-2642 (C_C 1/8 ansatz). Moore/Neumaier interval analysis; IEEE-754 directed rounding; ' +
    'crlibm correctly-rounded transcendentals; Platt-Trudgian 2021 (barrier base).',
};

export const IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE_ASSERTIONS = [
  {
    // The residual node is the three-op op-DAG log/multiply/subtract, centred at N_cross with K ~ 1.5727e8.
    id: 'imp36136-op-dag-three-ops',
    description: 'residual node F(m)=m-K log T0(m) is a 3-op DAG (log, multiply, subtract); K=(C_C_pinned/E_trunc)^2 ~ 1.5727e8',
    holds: () =>
      RESIDUAL_OP_COUNT === 3 &&
      Math.abs(K_AMPL - ((1 / 8) * Math.sqrt(3 * Math.PI) / 3.06e-5) ** 2) < 1 &&
      K_AMPL > 1.57e8 && K_AMPL < 1.58e8 &&
      N_CROSS > 3.2e9 && N_CROSS < 3.3e9,
  },
  {
    // Both width figures are MODELS: surrogate ~2 ULP/op over-estimates the ~1 ULP/op layer, limit 2.0 (imp-36017).
    id: 'imp36136-surrogate-over-layer-2x',
    description: 'surrogate ~2 ULP/op vs layer ~1 ULP/op: over-estimate ~1.84x at N_cross, limit exactly 2.0 (imp-36017)',
    holds: () =>
      SURROGATE_ULP_PER_OP === 2 && LAYER_ULP_PER_OP === 1 &&
      SURROGATE_OVER_LAYER_LIMIT === 2 &&
      SURROGATE_OVER_LAYER_AT_NCROSS > 1.8 && SURROGATE_OVER_LAYER_AT_NCROSS < 2.0,
  },
  {
    // Six construction steps C1-C6 are enumerated, each naming a concrete primitive / obligation.
    id: 'imp36136-six-construction-steps',
    description: 'C1-C6 enumerated: primitives, interval log T0, K-scaling, subtraction, error accounting, imp-34714a interface',
    holds: () => {
      const s = IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE.constructionSteps;
      return Object.keys(s).length === 6 &&
        /GREENFIELD/.test(s.C1_roundingModePrimitives) &&
        /interval-Newton/.test(s.C2_intervalLogT0Enclosure) &&
        /order/.test(s.C3_kScalingInterval) &&
        /NO cancellation inflation/.test(s.C4_subtractionNode) &&
        /no OPEN math/.test(s.C5_errorTermAccounting) &&
        /NECESSARY but NOT SUFFICIENT/.test(s.C6_interfaceToImp34714a);
    },
  },
  {
    // The greenfield/available partition is populated and correctly places the correctly-rounded log in greenfield.
    id: 'imp36136-greenfield-vs-available-partition',
    description: 'both partition lists non-empty; correctly-rounded log primitive is GREENFIELD; op-DAG structure AVAILABLE',
    holds: () => {
      const g = IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE.greenfieldVsAvailable;
      return Array.isArray(g.available) && Array.isArray(g.greenfield) &&
        g.available.length >= 5 && g.greenfield.length >= 3 &&
        g.greenfield.some((x) => /correctly-rounded.*log/.test(x)) &&
        g.available.some((x) => /op-DAG/.test(x));
    },
  },
  {
    // Honesty gate: scoping only; precision non-binding; layer unimplemented; imp-34714a open; no QED; no refereed bound is changed.
    id: 'imp36136-honesty-gate-no-qed',
    description: 'scoping only; precision non-binding; imp-34687a UNIMPLEMENTED; imp-34714a OPEN; no QED; no refereed bound is changed',
    holds: () =>
      IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /UNIMPLEMENTED/.test(IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE.conclusion.staysUnimplementedAndOpen) &&
      /imp-34714a stays OPEN/.test(IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE.conclusion.staysUnimplementedAndOpen) &&
      /NO QED/.test(IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE.verdict),
  },
];

for (const a of IMP36136_KRAWCZYK_RESIDUAL_DIRECTED_ROUNDING_LAYER_CONSTRUCTION_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36136-krawczyk-residual-directed-rounding-layer-construction-scope assertion failed: ${a.id}`);
  }
}
