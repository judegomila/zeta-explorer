/**
 * @module imp-36213-step2-g-step-error-localized-witness-scope
 *
 * imp-36213 (proof/scoping, S-frontier): imp-36192 enumerated the FIVE analytic
 * ingredients I1-I5 a CERTIFIED a-priori RK4/DP5 step-budget truncation bound
 * (obligation G-step-error) would require, and showed two of them COINCIDE with
 * the SEPARATE open Step-2 obligations -- I3 accumulated-Gronwall with G-gronwall
 * (imp-2520, Gronwall-vacuous at the nearest-pair front) and I4 certified-gap-floor
 * with G-interval-enclosure (imp-362 single-N interval-RK4 witness). This module
 * ASSESSES the natural follow-up: at the SINGLE N where imp-362 already supplies an
 * interval enclosure, do those two coincident obligations LOCALIZE, and if so can
 * the RESIDUAL FIRST ingredient -- the pure local-truncation constant of the RK4/DP5
 * step (I2, the crux) -- be pinned IN ISOLATION there? And enumerate exactly which
 * analytic input it STILL lacks once the other two are localized to that N.
 *
 * SCOPING / ASSESSMENT ONLY. Certifies nothing; bounds no truncation error;
 * integrates no flow; verifies no inequality; discharges no obligation; changes no
 * bound; establishes no positivity; C_mb GUE-conditional (imp-486) untouched;
 * respects imp-2519 no-overclaim guard; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE TWO COINCIDENT OBLIGATIONS DO LOCALIZE AT THE imp-362 WITNESS N
 * -----------------------------------------------------------------------------
 * The obstruction in I3 and I4 was N-UNIFORMITY, not a fixed-N value:
 *  - I4 (certified gap floor delta_lo(t)): DELIVERED at the witness N. The imp-362
 *    LAMBDA_INTERVAL_DYSON interval-RK4 run already carries a certified interval
 *    enclosure of the trajectory up to just-before t_c at that single N (one-ULP
 *    outward inflation, width < 0.01 heuristic, 4 of 5 PATH_C rows closed; N=2458
 *    row out of scope). A certified min-gap floor delta_lo(t) is read directly off
 *    that enclosure. So at the witness N, I4 is not open -- it is supplied.
 *  - I3 (accumulated error via discrete Gronwall): LOCALIZES trivially. The
 *    N-uniform Lipschitz constant that G-gronwall must supply is no longer needed;
 *    a single-N tube Lipschitz L ~ 1/delta_lo^2 is read off the SAME enclosure, and
 *    the discrete-Gronwall accumulation factor (exp(L*T) - 1)/L becomes a FINITE
 *    computable number at that N. The Gronwall-vacuity of imp-2520 was about the
 *    N-uniform / front-limit reading, and it dissolves at a fixed interior N.
 * So the two OTHER Step-2 obligations are NOT the residual obstruction at the
 * witness N: both localize to finite computable objects there.
 *
 * BUT THE FIRST INGREDIENT I2 IS NOT FREE: THREE RESIDUAL SUB-OBLIGATIONS
 * -----------------------------------------------------------------------------
 * With delta_lo(t) in hand, the local-truncation SCALE dt^5 * delta_lo^{-9} is a
 * finite number -- but a SCALE is not the constant. The RK4 local truncation error
 * per step is C * dt^5 * (order-5 ELEMENTARY DIFFERENTIALS of f), and pinning it
 * needs three inputs imp-362 does NOT carry:
 *  J1 (order-5 elementary-differential enclosure): a certified enclosure of the
 *     order-5 elementary differentials of the Dyson field f_k = -sum 1/(x_k - x_j)
 *     ALONG the tube -- the specific sum over the 9 order-5 rooted trees of products
 *     of partial-derivative tensors of f. imp-362 encloses the SOLUTION and the four
 *     RK stage values, NOT this derivative-tensor composite. This is a new object.
 *  J2 (partial-derivative-tensor enclosure to order 5): outward-rounded interval
 *     bounds on every partial-derivative tensor entry d^m f_k up to m = 5 on the
 *     tube -- a NEW op-DAG distinct from the stage-evaluation DAG imp-362 runs. For
 *     a pole 1/(x_k - x_j) the m-th derivative is (-1)^m m! (x_k - x_j)^{-(m+1)}, so
 *     the order-5 per-pole entry scales like delta^{-6}; the elementary-differential
 *     COMPOSITION lifts this to the delta^{-9} solution-derivative scale (2m-1 at
 *     m=5), consistent with imp-36192's crux exponent.
 *  J3 (certified Butcher residual coefficients): the rational coefficient C is the
 *     sum over the 9 order-5 rooted trees of the RK4 tableau residuals weighted by
 *     tree density -- a finite but non-trivial certified rational assembly, so far
 *     only symbolic. (DP5 embedded RK5(4) adds the order-6 differentials, whose tree
 *     count is 20, for its own local-truncation constant.)
 *
 * READING: at the single imp-362 witness N the TWO coincident Step-2 obligations
 * (I3 G-gronwall, I4 G-interval-enclosure) DO localize -- N-uniformity was their
 * obstruction and it dissolves at a fixed interior N. The residual FIRST ingredient
 * I2 does NOT thereby become free: it still requires a certified order-5
 * elementary-differential enclosure of the Dyson field on the tube (J1), an
 * outward-rounded partial-derivative-tensor enclosure to order 5 (J2), and the
 * certified Butcher residual coefficients on the 9 order-5 rooted trees (J3) --
 * NONE of which imp-362's solution+stage enclosure carries. Even fully assembled,
 * the resulting constant scales delta_lo^{-9}, so it is FINITE at the interior
 * witness N but STILL front-vacuous and NOT N-uniform: pinning it at one N
 * demonstrates finite-computability at that N, discharges NO obligation, and moves
 * NO Lambda bound (Step 2 feeds the E(N) bridge constants at Step 4, not the
 * headline inequality).
 *
 * @see imp-36192-step2-g-step-error-apriori-truncation-scope (parent five-ingredient I1-I5 scope)
 * @see imp-36193-step2-g-interval-enclosure-nuniform-scope (companion; the N-uniform lift of the imp-362 witness)
 * @see lambda-roadmap.js Step-2 rigorousUpgradeGap obligations G-step-error / G-gronwall / G-interval-enclosure
 * @see interval-dyson-collision.js / imp-362 (LAMBDA_INTERVAL_DYSON single-N interval-RK4 witness; one-ULP outward inflation)
 * @see backward-flow-stability-gronwall.js (imp-2520; Gronwall-vacuous at the nearest-pair front)
 * @see Hairer-Norsett-Wanner, Solving ODEs I (RK local truncation via elementary differentials; rooted-tree order counts)
 * @see Platt-Trudgian 2021 (verified height / SOTA barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-36192 / imp-36193) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 ordinate count anchor at T_PT (target N-uniform scale)

const EPS_DOUBLE = 2 ** -52; // binary64 machine epsilon (~2.22e-16)

// RK4 (classical): order p = 4; local truncation error per step is O(dt^{p+1}) = O(dt^5),
// carried by the order-(p+1) = order-5 elementary differentials of the vector field.
const RK4_ORDER = 4;
const RK4_LOCAL_ORDER = RK4_ORDER + 1; // 5
const DP5_LOCAL_ORDER = 6; // embedded RK5(4)/Dormand-Prince local order-6 differentials

// Number of rooted trees of order n (1,1,2,4,9,20,...): the count of order-5 elementary
// differentials the RK4 residual C sums over is 9; DP5's order-6 count is 20.
const ROOTED_TREES = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 9, 6: 20 };
const ORDER5_ELEMENTARY_DIFFERENTIALS = ROOTED_TREES[RK4_LOCAL_ORDER]; // 9
const ORDER6_ELEMENTARY_DIFFERENTIALS = ROOTED_TREES[DP5_LOCAL_ORDER]; // 20

// Pole-derivative scaling for f_k = -sum 1/(x_k - x_j): the m-th derivative of a single
// pole (x_k - x_j)^{-1} is (-1)^m m! (x_k - x_j)^{-(m+1)}, so the per-pole order-m partial
// scales like delta^{-(m+1)}; the elementary-differential COMPOSITION lifts the order-m
// SOLUTION derivative to delta^{-(2m-1)} (imp-36192 crux exponent).
const PER_POLE_PARTIAL_EXPONENT = (m) => m + 1; // order-5 per-pole partial ~ delta^{-6}
const SOLUTION_DERIV_EXPONENT = (m) => 2 * m - 1; // order-5 solution derivative ~ delta^{-9}
const CRUX_DELTA_POWER = SOLUTION_DERIV_EXPONENT(RK4_LOCAL_ORDER); // 9 (matches imp-36192)
const ORDER5_PER_POLE_POWER = PER_POLE_PARTIAL_EXPONENT(RK4_LOCAL_ORDER); // 6

// Illustrative interior-witness local-truncation SCALE: with a certified gap floor delta_lo
// in hand at the witness N (from imp-362), dt^5 * delta_lo^{-9} is a FINITE number, unlike the
// delta -> 0 front limit. This is a SCALE, not the constant (the constant needs J1-J3).
const DT_ILLUSTRATIVE = 1e-5; // one rung of the imp-36077 dt ladder
const DELTA_LO_WITNESS = 1e-2; // representative interior gap floor at the witness N (>> front 1e-4)
const LOCAL_TRUNC_SCALE_WITNESS =
  DT_ILLUSTRATIVE ** RK4_LOCAL_ORDER * DELTA_LO_WITNESS ** -CRUX_DELTA_POWER; // finite at the witness N
// Single-N tube Lipschitz read off delta_lo (L ~ 1/delta^2 for a 1/delta field): finite here.
const L_WITNESS = DELTA_LO_WITNESS ** -2; // ~1e4, a finite computable single-N Lipschitz constant

export const IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE = {
  id: 'imp-36213',
  proofSection: 'S-frontier',
  question:
    'At the single N where imp-362 already supplies an interval enclosure, do the two coincident ' +
    'Step-2 obligations (I3 G-gronwall, I4 G-interval-enclosure) LOCALIZE, and can the residual FIRST ' +
    'ingredient (I2, the pure RK4/DP5 local-truncation constant) then be pinned IN ISOLATION -- ' +
    'enumerating exactly which analytic input it still lacks once the other two are localized. Scoping ' +
    'only; discharges no obligation; changes no bound; NO QED.',
  twoCoincidentObligationsLocalize: {
    I4_gapFloorDelivered:
      'imp-362 LAMBDA_INTERVAL_DYSON interval-RK4 already carries a certified trajectory enclosure at ' +
      'the witness N, so a certified min-gap floor delta_lo(t) up to just-before t_c is read off it ' +
      '(one-ULP outward inflation, width < 0.01 heuristic, 4 of 5 PATH_C rows closed; N=2458 out of scope)',
    I3_gronwallLocalizes:
      'the N-uniform Lipschitz constant is no longer needed; a single-N tube L ~ 1/delta_lo^2 is read off ' +
      'the SAME enclosure and (exp(L*T) - 1)/L becomes a FINITE computable number -- the imp-2520 ' +
      'Gronwall-vacuity was an N-uniform / front-limit reading that dissolves at a fixed interior N',
    reading:
      'N-uniformity was the obstruction in BOTH I3 and I4; at a fixed interior witness N both localize to ' +
      'finite computable objects, so neither is the residual obstruction there',
  },
  residualFirstIngredient: {
    J1_elementaryDifferentialEnclosure:
      'a certified enclosure of the order-5 elementary differentials of f_k = -sum 1/(x_k - x_j) along ' +
      'the tube -- the sum over the 9 order-5 rooted trees of products of partial-derivative tensors of ' +
      'f; imp-362 encloses the SOLUTION and the four RK stage values, NOT this derivative-tensor composite',
    J2_partialDerivativeTensorEnclosure:
      'outward-rounded interval bounds on every partial-derivative tensor entry d^m f_k up to m = 5 on ' +
      'the tube -- a NEW op-DAG distinct from the stage-evaluation DAG imp-362 runs; per-pole order-5 ' +
      'partial ~ delta^{-6}, composition lifts the order-5 solution derivative to the delta^{-9} scale',
    J3_butcherResidualCoefficients:
      'the certified rational coefficient C summing the RK4 tableau residuals over the 9 order-5 rooted ' +
      'trees (DP5 adds the 20 order-6 differentials for its own constant) -- finite but so far only symbolic',
  },
  cruxNumbers: {
    order5ElementaryDifferentials: ORDER5_ELEMENTARY_DIFFERENTIALS, // 9 rooted trees of order 5
    order6ElementaryDifferentials: ORDER6_ELEMENTARY_DIFFERENTIALS, // 20 rooted trees of order 6 (DP5)
    order5PerPolePower: ORDER5_PER_POLE_POWER, // per-pole partial ~ delta^{-6}
    cruxDeltaPower: CRUX_DELTA_POWER, // solution derivative ~ delta^{-9}
    localTruncScaleWitness: LOCAL_TRUNC_SCALE_WITNESS, // FINITE at the interior witness N (delta_lo ~ 1e-2)
    tubeLipschitzWitness: L_WITNESS, // ~1e4, a finite single-N Lipschitz constant off delta_lo
    note:
      'these are SCALES exhibiting finite-computability at the interior witness N (delta_lo bounded away ' +
      'from 0), NOT the certified local-truncation constant, which still needs J1-J3',
  },
  conclusion: {
    othersLocalizeFirstDoesNot:
      'the two coincident obligations (I3, I4) localize at the witness N; the residual FIRST ingredient ' +
      'I2 does NOT thereby become free -- it needs J1 the order-5 elementary-differential enclosure, J2 ' +
      'the partial-derivative-tensor enclosure to order 5, and J3 the certified Butcher residual coefficients',
    finiteButNotUniformAndFrontVacuous:
      'even fully assembled the constant scales delta_lo^{-9}: FINITE at the interior witness N, but STILL ' +
      'front-vacuous as delta -> 0 at t_c and NOT N-uniform -- pinning it at one N shows finite-computability ' +
      'at that N, nothing more',
    noBoundMovesOnItsOwn:
      'discharging G-step-error even fully changes NO Lambda bound directly -- Step 2 feeds the E(N) bridge ' +
      'constants at Step 4, not the headline inequality',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT rigorous). At the single imp-362 interval-RK4 witness ' +
    'N the TWO coincident Step-2 obligations DO localize: I4 (certified gap floor delta_lo(t)) is DELIVERED ' +
    'by the imp-362 trajectory enclosure, and I3 (accumulated-Gronwall) LOCALIZES because a single-N tube ' +
    'Lipschitz L ~ 1/delta_lo^2 replaces the N-uniform constant and (exp(L*T)-1)/L is then finite -- the ' +
    'imp-2520 Gronwall-vacuity was an N-uniform / front-limit reading that dissolves at a fixed interior N. ' +
    'But the residual FIRST ingredient I2 (the pure RK4/DP5 local-truncation constant, C * dt^5 * order-5 ' +
    'elementary differentials) is NOT thereby pinnable in isolation: it STILL lacks J1 a certified enclosure ' +
    'of the order-5 elementary differentials of the Dyson field f_k = -sum 1/(x_k-x_j) along the tube (the ' +
    'sum over the 9 order-5 rooted trees), J2 an outward-rounded partial-derivative-tensor enclosure to ' +
    'order 5 (a NEW op-DAG; per-pole ~ delta^{-6}, composition ~ delta^{-9}), and J3 the certified Butcher ' +
    'residual coefficients on those 9 trees (DP5 adds 20 order-6 trees) -- none of which imp-362 solution+' +
    'stage enclosure carries. Even fully assembled the constant scales delta_lo^{-9}: finite at the interior ' +
    'witness N but STILL front-vacuous as delta -> 0 at t_c and NOT N-uniform. Certifies nothing; bounds no ' +
    'truncation error; integrates no flow; verifies no inequality; discharges no obligation; changes no ' +
    'bound; establishes no positivity; C_mb GUE-conditional (imp-486) untouched; respects imp-2519; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36192 (parent five-ingredient I1-I5 G-step-error scope); imp-36193 (companion G-interval-enclosure ' +
    'N-uniform lift); lambda-roadmap.js Step-2 rigorousUpgradeGap (G-step-error / G-gronwall / ' +
    'G-interval-enclosure); imp-362 (LAMBDA_INTERVAL_DYSON single-N interval-RK4 witness); imp-2520 (Gronwall ' +
    'propagation lemma, vacuous at the front); Hairer-Norsett-Wanner (RK local truncation via elementary ' +
    'differentials; rooted-tree order counts); Platt-Trudgian 2021 (barrier base / SOTA).',
};

export const IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-36192 / imp-36193.
    id: 'imp36213-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 ordinate count anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Rooted-tree counts: order 5 -> 9 elementary differentials (RK4 residual), order 6 -> 20 (DP5),
    // and the crux exponents must match imp-36192: per-pole order-5 partial ~ delta^{-6}, solution ~ delta^{-9}.
    id: 'imp36213-rooted-tree-and-crux-exponents',
    description: 'Order-5 trees = 9, order-6 trees = 20; per-pole partial ~ delta^{-6}, solution ~ delta^{-9}',
    holds: () =>
      ORDER5_ELEMENTARY_DIFFERENTIALS === 9 &&
      ORDER6_ELEMENTARY_DIFFERENTIALS === 20 &&
      ORDER5_PER_POLE_POWER === 6 &&
      CRUX_DELTA_POWER === 9 &&
      SOLUTION_DERIV_EXPONENT(5) === 2 * 5 - 1 &&
      PER_POLE_PARTIAL_EXPONENT(5) === 6,
  },
  {
    // At the interior witness N the two coincident obligations localize to FINITE numbers: a finite
    // tube Lipschitz off delta_lo and a finite (non-vacuous) local-truncation scale, unlike the front.
    id: 'imp36213-witness-localization-finite',
    description: 'At the interior witness N delta_lo ~ 1e-2 gives a finite tube Lipschitz and a finite trunc scale',
    holds: () =>
      Number.isFinite(L_WITNESS) && L_WITNESS > 0 &&
      Number.isFinite(LOCAL_TRUNC_SCALE_WITNESS) && LOCAL_TRUNC_SCALE_WITNESS > 0 &&
      DELTA_LO_WITNESS > 1e-4, // interior gap floor strictly above the front stopping scale
  },
  {
    // Exactly three residual sub-obligations J1-J3 for the FIRST ingredient, and the two OTHER
    // obligations are named as localizing (I3 -> G-gronwall, I4 -> G-interval-enclosure).
    id: 'imp36213-three-residual-sub-obligations',
    description: 'Three residual sub-obligations J1-J3; I3/I4 named as localizing at the witness N',
    holds: () => {
      const r = IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.residualFirstIngredient;
      const loc = IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.twoCoincidentObligationsLocalize;
      return (
        Object.keys(r).length === 3 &&
        /imp-362/.test(loc.I4_gapFloorDelivered) &&
        /delta_lo/.test(loc.I4_gapFloorDelivered) &&
        /Lipschitz/.test(loc.I3_gronwallLocalizes)
      );
    },
  },
  {
    // Honesty gate: scoping only; discharges no obligation; front-vacuous / not-N-uniform stated;
    // no bound moved; no QED; no refereed bound is changed.
    id: 'imp36213-honesty-gate',
    description: 'Scoping only; discharges no obligation; still front-vacuous / not N-uniform; no QED; no refereed bound is changed',
    holds: () =>
      IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /front-vacuous/.test(IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.conclusion.finiteButNotUniformAndFrontVacuous) &&
      /NOT N-uniform/.test(IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.conclusion.finiteButNotUniformAndFrontVacuous) &&
      /changes NO Lambda bound/.test(IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.conclusion.noBoundMovesOnItsOwn) &&
      /NO QED/.test(IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE.verdict),
  },
];

for (const a of IMP36213_STEP2_G_STEP_ERROR_LOCALIZED_WITNESS_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36213-step2-g-step-error-localized-witness-scope assertion failed: ${a.id}`);
  }
}
