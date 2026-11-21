/**
 * @module imp-35213-i2-order-preservation-assessment
 * @fileoverview imp-35213: ASSESS the imp-35197 I2 obligation -- the discrete
 * order-preservation / monotone-comparison lemma that would lift a certified
 * per-step RK4 lag (imp-35197 I1) to a COLLISION-TIME ordering
 * t_c_flow(N) <= t_c_map(N). The imp-35197 promotion of the map-to-flow overshoot
 * sign (S) chains as t_c_flow <= t_c_map <= t_c_hi to discharge R2 up the imp-857
 * map ladder, but ONLY if a per-step ordering actually propagates to a later
 * collision. That propagation is not free: it needs the discrete backward Dyson
 * map and the exact flow to be order-preserving in the relevant collision scalar.
 * This module identifies that scalar, tests whether the map is a monotone
 * operator on the collision-approach set, and names the modulus that would lift
 * the per-step lag to a t_c ordering. SCOPING / ASSESSMENT ONLY: certifies
 * nothing, establishes NO bound, removes NO conditional (C_mb stays
 * GUE-conditional per imp-486), claims NO QED. R2 stays OPEN past N=200.
 *
 * THE SCALAR IN WHICH MONOTONICITY WOULD HAVE TO HOLD
 * --------------------------------------------------
 * The collision is the first zero of the GLOBAL squared min gap
 *     U(s) = min_p r_p(s)^2,     r_p = x_{p+1} - x_p,     s = -t >= 0,
 * so t_c(N) = inf{ s : U(s) = 0 }. This is the natural comparison scalar: a
 * certified ordering U_flow(s) <= U_map(s) for all s (the map keeps a WIDER min
 * gap than the flow) would give t_c_flow <= t_c_map directly, since U hits zero
 * first on the smaller trajectory. So I2 is exactly the claim: a per-step min-gap
 * lead (I1: one RK4 step lands on the wider-gap / later-colliding side) PROPAGATES
 * to an all-s min-gap lead. That propagation is a comparison principle on U.
 *
 * WHY THE SCALAR COMPARISON IS NOT FREE -- U IS DRIVEN, NOT AUTONOMOUS
 * -------------------------------------------------------------------
 * The imp-2563 gap ODE gives, for an adjacent pair with gap r and background
 * field B(s) = sum_{j not in pair} 1 / ((b - x_j)(a - x_j)), with u = r^2,
 *     du/ds = -8 + 4 B(s) u.                                                   (U)
 * The Dini derivative of the global U inherits the same form, D_- U = -8 + 4 B U.
 * B(s) depends on ALL N particle positions, so (U) is NOT a closed autonomous
 * scalar ODE: two configurations with the SAME min gap U but different global
 * arrangements evolve U at different rates. A one-dimensional comparison
 * principle (the tool that would turn a per-step lead into an all-s lead) needs a
 * scalar ODE whose right side depends on U alone. Here the exogenous driver B(s)
 * blocks that -- there is no autonomous scalar dynamics to compare against.
 *
 * WHY THE FULL-VECTOR MAP IS NOT MONOTONE (KAMKE-MULLER FAILS)
 * -----------------------------------------------------------
 * The alternative to a scalar comparison is order-preservation of the full
 * N-particle map in the componentwise (product) order on R^N, from which a
 * min-gap ordering could be extracted. That requires Kamke-Muller
 * quasimonotonicity: off-diagonal Jacobian entries of one sign. For the backward
 * Dyson field f_k = -2 sum_{j != k} 1 / (x_k - x_j),
 *     d f_k / d x_j = -2 / (x_k - x_j)^2 < 0     for every j != k.
 * So the system is COMPETITIVE (off-diagonal strictly negative), NOT cooperative.
 * Competitive systems are order-preserving only under time reversal or, in
 * dimension 2, a flipped order; for N >= 3 they are NOT monotone in the standard
 * order. A one-step RK4 map inherits this off-diagonal sign at leading order in
 * dt (its Jacobian is I + dt Df + O(dt^2)), so the discrete map is likewise not a
 * monotone operator on R^N for N >= 3. Hence a per-COMPONENT per-step ordering
 * does not lift to a min-gap ordering through vector monotonicity.
 *
 * A THIRD OBSTRUCTION -- THE ARGMIN SWITCHES
 * ------------------------------------------
 * U = min_p r_p^2 is a non-smooth functional whose realizing pair (the argmin)
 * can CHANGE between steps as the field redistributes. So even a per-PAIR
 * ordering r_p,flow <= r_p,map holding for the currently-binding pair does not
 * give a min ordering unless it holds SIMULTANEOUSLY over all pairs at every
 * step -- an all-pairs uniform per-step bound, strictly stronger than I1.
 *
 * THE MODULUS THAT WOULD LIFT PER-STEP LAG TO A t_c ORDERING
 * ---------------------------------------------------------
 * The only route that restores a comparison principle is to CLOSE the scalar (U):
 * bound the driver B(s) by an N-uniform two-sided constant beta = sup_{p,s<t_c}
 * |B_p(s)| with beta g^2 < 2 (exactly the imp-35194 / imp-2563 M2 background-field
 * sup). Under that closure, D_- U >= -8 - 4 beta U sandwiches U below by the
 * AUTONOMOUS comparison ODE m' = -8 - 4 beta m, m(0) = g^2, and a per-step min-gap
 * lead persists as a comparison-ODE lead, giving t_c_flow <= t_c_map on the
 * sub-horizon window s < T_-(g, beta) = (1/(4 beta)) log(1 + beta g^2 / 2).
 * So I2 does NOT open a new lever: its modulus IS the imp-35194 N-uniform beta
 * plus an imp-35167 M5 horizon extension, inheriting the SAME self-referential
 * beta ~ 1/g_min near-front coupling (imp-35194 F2) and the SAME M5 horizon
 * obstruction. I2 REDUCES to (M2 + M5); it is a comparison-principle obligation
 * that collapses onto the already-binding min-gap machinery, not an independent
 * hurdle and not a free lemma.
 *
 * VERDICT (honest partial)
 * ------------------------
 * A discrete monotone-comparison lemma does NOT hold for the backward Dyson map
 * as a free / autonomous principle: the collision scalar U is driven (not
 * autonomous), the full-vector map is competitive (not cooperative, so not
 * Kamke-Muller monotone for N >= 3), and the min functional has a switching
 * argmin. I2 is therefore NOT supplied. It CAN be recovered, but only by closing
 * (U) through the imp-35194 N-uniform beta and an imp-35167 M5 horizon extension
 * -- so I2 relocates onto, rather than bypasses, the binding M2/M5 obstruction.
 * Establishes NO bound; certifies NO ordering; R2 stays OPEN past N=200; C_mb
 * stays GUE-conditional (imp-486); NO QED. No refereed bound is changed.
 *
 * SYNTAX NOTE: avoid star-slash sequences in JSDoc; use "dt^2" / "t_c_flow" etc.
 *
 * @see imp-35197  R2 sign-promotion assessment (names I1/I2/I3; I2 is scoped here)
 * @see imp-35167  g_min non-collision certificate scope (M1..M5; supplies scalar U and horizon T_-)
 * @see imp-35194  background-field sup N-uniformity (the beta that closes (U); F2 beta ~ 1/g_min)
 * @see imp-2563   min-gap sandwich theorem (exact gap ODE (U); lower comparison branch)
 * @see imp-362    desingularized pole form of the backward Dyson field
 * @see imp-857    one-ULP interval map bracket (supplies t_c_map <= t_c_hi, ingredient I4)
 */

// -- The collision scalar and the ordering I2 must establish. ------------------
const COLLISION_SCALAR = {
  symbol: 'U(s) = min_p r_p(s)^2',
  collisionTime: 't_c(N) = inf{ s : U(s) = 0 }',
  orderingWanted: 'U_flow(s) <= U_map(s) for all s  (map keeps the wider min gap)',
  givesTcOrdering: 't_c_flow(N) <= t_c_map(N)  (U hits zero first on the smaller trajectory)',
  drivenNotAutonomous:
    'D_- U = -8 + 4 B(s) U with B(s) depending on ALL N positions; (U) is NOT a closed scalar ODE.',
};

// -- The three obstructions to a FREE order-preservation lemma. ----------------
const OBSTRUCTIONS = [
  {
    id: 'O1',
    name: 'driven-scalar-no-autonomous-comparison',
    statement:
      'The collision scalar U obeys D_- U = -8 + 4 B(s) U with an exogenous driver B(s); ' +
      'a 1-D comparison principle needs a right side depending on U alone, which B blocks.',
  },
  {
    id: 'O2',
    name: 'competitive-field-fails-kamke-muller',
    statement:
      'd f_k / d x_j = -2 / (x_k - x_j)^2 < 0 for j != k: the field is COMPETITIVE, not ' +
      'cooperative, so the flow and its O(dt) RK4 map are NOT monotone operators on R^N for N >= 3.',
  },
  {
    id: 'O3',
    name: 'switching-argmin-of-min-functional',
    statement:
      'U = min_p r_p^2 has a realizing pair that can switch between steps; a per-pair ordering ' +
      'gives a min ordering only if it holds simultaneously over ALL pairs (stronger than I1).',
  },
];

// -- The modulus that WOULD lift a per-step lag to a collision-time ordering. --
const LIFTING_MODULUS = {
  route: 'close the scalar (U) via an N-uniform two-sided background-field bound',
  requires: 'beta = sup_{p, s < t_c} |B_p(s)| with beta g^2 < 2  (imp-35194 / imp-2563 M2)',
  thenComparisonODE: 'D_- U >= -8 - 4 beta U  sandwiched below by  m\' = -8 - 4 beta m, m(0) = g^2',
  yieldsOrderingOn: 's < T_-(g, beta) = (1 / (4 beta)) log(1 + beta g^2 / 2)  (sub-horizon window)',
  inheritedObstructions: [
    'imp-35194 F2 self-referential beta ~ 1/g_min near-front coupling',
    'imp-35167 M5 horizon extension past s = T_-',
  ],
  opensNewLever: false,
  reducesTo: 'I2 collapses onto the already-binding M2 (N-uniform beta) + M5 (horizon) obstruction.',
};

export const IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT = {
  id: 'imp-35213',
  title:
    'Assess the imp-35197 I2 order-preservation / monotone-comparison lemma lifting a per-step ' +
    'RK4 lag to a collision-time ordering t_c_flow <= t_c_map on the imp-362 backward Dyson map',
  kind: 'assessment-scoping-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,

  collisionScalar: COLLISION_SCALAR,
  obstructions: OBSTRUCTIONS,
  liftingModulus: LIFTING_MODULUS,

  verdict: {
    freeMonotoneComparisonLemmaHolds: false,
    scalarIsAutonomous: false,
    mapIsMonotoneOperator: false,
    whyNotFree:
      'Three obstructions: O1 the collision scalar U is DRIVEN by the exogenous background field ' +
      'B(s) (no autonomous 1-D comparison ODE), O2 the backward Dyson field is COMPETITIVE ' +
      '(off-diagonal Jacobian -2/(x_k-x_j)^2 < 0) so the flow and its O(dt) RK4 map are not ' +
      'Kamke-Muller monotone for N >= 3, and O3 the min functional has a switching argmin.',
    whatWouldLiftIt:
      'Closing (U) via an N-uniform two-sided beta (imp-35194 M2, beta g^2 < 2) plus an imp-35167 ' +
      'M5 horizon extension: then U is sandwiched by the autonomous ODE m\' = -8 - 4 beta m and a ' +
      'per-step min-gap lead persists to t_c_flow <= t_c_map on s < T_-.',
    netEffect:
      'I2 does NOT open a new lever -- its modulus IS the imp-35194 beta plus the imp-35167 M5 ' +
      'horizon, so I2 RELOCATES onto, rather than bypasses, the already-binding M2/M5 obstruction ' +
      '(with the same self-referential beta ~ 1/g_min front-coupling).',
    doesNotAchieve:
      'Does NOT certify any ordering; does NOT close R2 at N >= 500; does NOT extend the C_mb ' +
      'certificate; does NOT remove the imp-486 GUE conditional; changes NO Lambda bound. R2 ' +
      'stays OPEN past N=200. No refereed bound is changed.',
  },
};

// -- Build-time assertions (honest-scope tripwires). ---------------------------
export const IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp35213-no-free-monotone-lemma',
    holds: () =>
      IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.verdict.freeMonotoneComparisonLemmaHolds === false &&
      IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.verdict.mapIsMonotoneOperator === false,
    why:
      'HONEST-SCOPE TRIPWIRE: the discrete order-preservation lemma (I2) does NOT hold as a free ' +
      'principle -- the backward Dyson map is competitive, not a monotone operator. Flipping either ' +
      'flag to true would falsely assert I2 supplied and let the sign (S) discharge R2 without it.',
  },
  {
    id: 'imp35213-three-obstructions',
    holds: () =>
      IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.obstructions.length === 3 &&
      ['O1', 'O2', 'O3'].every((k) =>
        IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.obstructions.some((o) => o.id === k)),
    why:
      'Exactly three obstructions block a free comparison lemma: O1 driven scalar, O2 competitive ' +
      'field (Kamke-Muller fails), O3 switching argmin. If this count drifts an obstruction was ' +
      'silently dropped.',
  },
  {
    id: 'imp35213-modulus-reduces-to-m2-m5',
    holds: () =>
      IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.liftingModulus.opensNewLever === false &&
      IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.liftingModulus.inheritedObstructions.length === 2,
    why:
      'The modulus that would lift the per-step lag REDUCES I2 to the imp-35194 M2 N-uniform beta ' +
      'plus the imp-35167 M5 horizon; it opens NO new lever. Marking opensNewLever true would ' +
      'falsely claim I2 bypasses the binding min-gap obstruction.',
  },
  {
    id: 'imp35213-no-qed-no-bound-change',
    holds: () =>
      IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.noQED === true &&
      IMP_35213_I2_ORDER_PRESERVATION_ASSESSMENT.changesNoBound === true,
    why:
      'This ticket is assessment/scoping only: it must never assert a QED or a bound change. ' +
      'C_mb stays GUE-conditional (imp-486); no refereed bound is changed.',
  },
];
