/**
 * @module imp-3726-y2-adapted-flow-depth-schedule
 *
 * imp-3726 (proof, frontier-direction): DERIVE the imp-3714 named sub-gap
 * G6a_shock_lipschitz::y2-adapted-flow-depth. imp-3708 showed that the Lemma B Gronwall floor
 * exp(-2 s / y^2) with a SINGLE global backward-flow depth s collapses as floor_meso^{k^2} at the
 * nearest-pair scale (y -> 0), and named the escape as a still-missing object: a per-pair
 * (self-similar) depth s(y) ~ y^2 pinning 2 s(y) / y^2 = E_meso at every scale. imp-3714 then found
 * that BOTH surviving candidate constructions K1 and K2 require exactly this reparameterization. This
 * module STATES the self-similar depth schedule s_k(g_k) explicitly, checks whether running the
 * imp-3642 backward-Dyson RK4 with a PER-SITE depth s_k ~ g_k^2 (instead of one global depth) keeps
 * the floor bounded away from 0 uniformly as g_k -> 0, and identifies what remains NEW vs already in
 * the repo. Derivation / scoping only; no construction shipped, no bridge closure, no positivity, NO QED.
 *
 * THE SELF-SIMILAR DEPTH SCHEDULE, STATED
 * ---------------------------------------
 * The natural microscopic strip height at pair k is the LOCAL gap itself, y = g_k (the scale at which
 * pair k -s collision time tau_c(k) is read, per imp-3693: tau_c(k) is defined at g_k -> 0). The
 * imp-3708 escape condition s(y) ~ s (y / y_star)^2 becomes, per site,
 *   s_k(g_k) = c * g_k^2,
 * a self-similar schedule: run pair k -s backward flow only as deep as the LOCAL gap squared. The
 * Lemma B floor read at that pair is then
 *   floor(k) = exp(-2 s_k / g_k^2) = exp(-2 c),   INDEPENDENT of g_k.
 * Because the depth tracks g_k^2, the exponent 2 s_k / g_k^2 is a CONSTANT 2c at every scale, so the
 * floor is scale-INVARIANT -- it does NOT collapse as g_k -> 0. Contrast the fixed global depth, which
 * reads the SAME s at every height and gives exponent E_meso (y_star / g_k)^2 = E_meso k^2 -> infinity.
 *
 * TWO NATURAL CHOICES OF THE SELF-SIMILAR CONSTANT c (and why the reparameterization is consistent)
 * -------------------------------------------------------------------------------------------------
 * (a) FLOOR-PINNING constant (the imp-3708 escape, matched to the mesoscopic reading):
 *       c_pin = E_meso / 2 = 0.004520,   floor = exp(-E_meso) = 0.991  (the imp-3642 mesoscopic floor).
 * (b) FRONT-REACHING constant (the depth needed to actually flow to the collision): the imp-325
 *     dyson-collision-lower-bound gives d(g_k^2)/dtau >= -8 with the retardation summand positive, so
 *     g_k(tau)^2 >= g_k(0)^2 - 8 tau and the collision time obeys tau_c >= g_k^2 / 8; with the leading
 *     -8 drift this scale is sharp, tau_c ~ g_k^2 / 8. So reaching the front needs depth
 *       s_k ~ tau_c ~ g_k^2 / 8,   i.e.  c_front = 1/8 = 0.125,   floor = exp(-1/4) = 0.7788.
 * KEY FINDING: the collision time tau_c AND the floor-pinning depth BOTH scale as g_k^2, with
 * c_pin = 0.004520 < c_front = 0.125. So a per-site self-similar depth s_k = c g_k^2 with any fixed
 * c in [c_pin, c_front] SIMULTANEOUSLY (i) is deep enough to reach the collision front (c >= c_front)
 * and (ii) keeps the floor exp(-2c) bounded away from 0 UNIFORMLY as g_k -> 0. Choosing the minimal
 * front-reaching depth c = c_front gives a floor exp(-1/4) ~ 0.779 at every pair, including g_k -> 0.
 * The fixed-depth floor_meso^{k^2} collapse of imp-3708 is therefore a REPARAMETERIZATION ARTIFACT of
 * holding s global: the self-similar per-site depth removes it and the floor becomes scale-invariant.
 *
 * WHAT REMAINS NEW vs ALREADY IN THE REPO
 * ---------------------------------------
 * IN REPO (ingredients the schedule reuses):
 *   - the per-gap field g_k = gamma_{k+1} - gamma_k (imp-322 / imp-325) -- supplies the local scale g_k;
 *   - the imp-325 collision-time lower bound tau_c >= g_k^2 / 8 -- fixes the front-reaching constant;
 *   - the imp-3642 backward-Dyson RK4 flow machinery -- integrates ONE global-depth flow;
 *   - the imp-3708 escape condition s(y) ~ y^2 -- the scaling this schedule instantiates.
 * STILL NEW (the residual sub-gap; why this is derivation, not construction):
 *   - N1  HETEROGENEOUS-DEPTH CONTRACTION: Lemma B was derived / measured for one GLOBAL depth. A
 *         rigorous Gronwall contraction with a DIFFERENT depth s_k per pair, composed across the range
 *         of separations (the REQ-i two-point structure), is not established -- the pinned per-pair
 *         floor exp(-2c) is NECESSARY (removes the collapse) but not SUFFICIENT (composition unproven).
 *   - N2  ADAPTIVE-DEPTH INTEGRATOR: the imp-3642 RK4 integrates a single global flow; a genuinely
 *         per-site variable-depth integrator (depth s_k = c g_k^2 per pair) is a NEW numerical object,
 *         not a reading of the existing field. The floor values 0.991 / 0.779 are SCALING estimates
 *         from the exponent 2 s / y^2, NOT outputs of an actual per-site RK4 run.
 *   - N3  TWO-POINT EXTENSION: the K1 / K2 pair-separation two-point profile on top of the per-site
 *         depth (REQ-i) is still not built; this module supplies the depth schedule (REQ-ii) only.
 *
 * VERDICT: the self-similar schedule is s_k(g_k) = c g_k^2, pinning the floor at exp(-2c) uniformly in
 * g_k. Because the collision time tau_c ~ g_k^2 / 8 and the floor-pinning depth both scale as g_k^2
 * (c_pin < c_front), a fixed self-similar constant reaches the front AND keeps the floor bounded away
 * from 0 as g_k -> 0 -- so the imp-3708 fixed-depth collapse is a reparameterization artifact, removed
 * by the per-site depth. The g_k field, the tau_c >= g_k^2/8 bound, and the RK4 machinery are IN REPO;
 * still NEW are the heterogeneous-depth contraction composition (N1), a per-site adaptive-depth
 * integrator (N2), and the two-point pair-separation extension (N3). So the sub-gap
 * G6a_shock_lipschitz::y2-adapted-flow-depth is DERIVED (schedule + scale-consistency) but no
 * construction is shipped and G6a stays OPEN. Derivation / scoping only; no positivity, no bridge
 * closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED.
 * No refereed bound is changed.
 *
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (names the sub-gap; fixed-depth collapse floor_meso^{k^2})
 * @see imp-3714-g6a-modulus-object-requirements (K1, K2 both require this y2-adapted per-pair depth)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (backward-Dyson RK4 flow; mesoscopic floor 0.991)
 * @see dyson-collision-lower-bound (imp-325: d(g_k^2)/dtau >= -8, so tau_c >= g_k^2 / 8)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// imp-3642 measured worst mesoscopic Gronwall floor 0.991 at y_star = 4 d (via imp-3708).
const IMP3642_MESO_FLOOR = 0.991;
const E_MESO = -Math.log(IMP3642_MESO_FLOOR); // 0.009041 = 2 s / y_star^2 (mesoscopic exponent)
const Y_STAR_OVER_D = 4; // imp-3642 baseline mesoscopic strip height, units d = 1

// Self-similar per-site depth schedule: s_k = c * g_k^2 (run only as deep as the local gap squared).
function selfSimilarDepth(g, c) {
  return c * g * g;
}
// Floor read at pair k with strip height y = g_k under the per-site depth: exp(-2 s_k / g_k^2) = exp(-2c),
// INDEPENDENT of g_k (scale-invariant). This is the whole point: the depth tracks g_k^2.
function adaptedFloor(c) {
  return Math.exp(-2 * c);
}
// Fixed global-depth floor (imp-3708 baseline): same s read at y = g gives exp(-E_meso (y_star/g)^2).
function fixedDepthFloor(g) {
  const ratio = Y_STAR_OVER_D / g;
  return Math.exp(-E_MESO * ratio * ratio);
}

// The two natural self-similar constants.
const C_PIN = E_MESO / 2; // 0.004520: pins the floor at the mesoscopic 0.991 (imp-3708 escape)
const C_FRONT = 1 / 8; // 0.125: the imp-325 collision-time depth tau_c >= g^2/8 (reaches the front)

// g_k ladder from mesoscopic (g = y_star = 4 d) down toward the nearest-pair scale (g -> 0),
// matching the imp-3708 k-ladder k = y_star / g.
const G_LADDER = [4, 2, 1, 0.5, 0.25, 0.125, 0.08];
const SCHEDULE_TABLE = G_LADDER.map((g) => ({
  g_over_d: g,
  k: +(Y_STAR_OVER_D / g).toFixed(2), // strip-height ratio y_star / g
  s_pin: +selfSimilarDepth(g, C_PIN).toExponential(4), // floor-pinning per-site depth, shrinks like g^2
  s_front: +selfSimilarDepth(g, C_FRONT).toExponential(4), // front-reaching per-site depth ~ tau_c
  fixedDepthFloor: +fixedDepthFloor(g).toExponential(4), // collapses as g -> 0 (imp-3708 obstruction)
  adaptedFloorPin: +adaptedFloor(C_PIN).toFixed(6), // constant 0.991 (self-similar, floor-pinning)
  adaptedFloorFront: +adaptedFloor(C_FRONT).toFixed(6), // constant 0.7788 (self-similar, front-reaching)
}));

// The self-similar exponent 2 s_k / g_k^2 is the CONSTANT 2c at every scale (independent of g_k).
const PINNED_EXPONENT = 2 * C_PIN; // = E_meso
const FRONT_EXPONENT = 2 * C_FRONT; // = 1/4

const RESIDUAL_NEW_INGREDIENTS = [
  {
    id: 'N1',
    name: 'heterogeneous-depth Gronwall contraction composition',
    statement:
      'Lemma B was derived for one GLOBAL depth; a rigorous contraction with a DIFFERENT depth s_k per ' +
      'pair, composed across the range of separations (REQ-i), is not established. The pinned per-pair ' +
      'floor exp(-2c) is NECESSARY (removes the collapse) but NOT sufficient (composition unproven).',
  },
  {
    id: 'N2',
    name: 'per-site adaptive-depth RK4 integrator',
    statement:
      'The imp-3642 RK4 integrates a single global flow; a per-site variable-depth integrator (depth ' +
      's_k = c g_k^2 per pair) is a NEW object. The floor values 0.991 / 0.7788 are SCALING estimates ' +
      'from the exponent 2 s / y^2, not outputs of an actual per-site RK4 run.',
  },
  {
    id: 'N3',
    name: 'two-point pair-separation extension',
    statement:
      'The K1 / K2 pair-separation two-point profile on top of the per-site depth (REQ-i) is still not ' +
      'built; this module supplies the depth schedule (REQ-ii) only.',
  },
];

const REPO_INGREDIENTS = [
  'per-gap field g_k = gamma_{k+1} - gamma_k (imp-322 / imp-325) -- the local scale g_k',
  'collision-time lower bound tau_c >= g_k^2 / 8 (imp-325 dyson-collision-lower-bound) -- fixes c_front',
  'backward-Dyson RK4 flow machinery (imp-3642) -- integrates one global-depth flow',
  'escape condition s(y) ~ y^2 (imp-3708) -- the scaling this schedule instantiates',
];

const ANY_CONSTRUCTION_SHIPPED = false;

export const IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE = {
  id: 'imp-3726',
  proofSection: 'S-frontier',
  question:
    'Derive the imp-3714 named sub-gap G6a_shock_lipschitz::y2-adapted-flow-depth: state the ' +
    'self-similar per-site backward-flow depth schedule s_k(g_k) explicitly, check whether running the ' +
    'imp-3642 backward-Dyson RK4 with per-site depth s_k ~ g_k^2 keeps the Lemma B floor bounded away ' +
    'from 0 uniformly as g_k -> 0, and identify what remains new vs already in the repo. Derivation / ' +
    'scoping only, no construction, no bridge closure, no positivity, NO QED.',
  schedule: 's_k(g_k) = c * g_k^2 (per-site self-similar backward-flow depth; run as deep as the local gap squared)',
  floorUnderSchedule:
    'floor(k) = exp(-2 s_k / g_k^2) = exp(-2 c), INDEPENDENT of g_k -- the depth tracks g_k^2 so the ' +
    'exponent is the constant 2c at every scale, and the floor is scale-invariant, not collapsing as g_k -> 0.',
  selfSimilarConstants: {
    c_pin: +C_PIN.toFixed(6), // 0.004520: floor-pinning (imp-3708 escape), floor exp(-E_meso) = 0.991
    c_front: +C_FRONT.toFixed(6), // 0.125: front-reaching (imp-325 tau_c >= g^2/8), floor exp(-1/4) = 0.7788
    floor_pin: +adaptedFloor(C_PIN).toFixed(6), // 0.991
    floor_front: +adaptedFloor(C_FRONT).toFixed(6), // 0.778801
  },
  keyFinding:
    'The collision time tau_c ~ g_k^2 / 8 (imp-325) and the floor-pinning depth BOTH scale as g_k^2, ' +
    'with c_pin < c_front. A per-site self-similar depth s_k = c g_k^2 with fixed c in [c_pin, c_front] ' +
    'thus both reaches the collision front (c >= c_front) and keeps the floor exp(-2c) bounded away from ' +
    '0 uniformly as g_k -> 0. The imp-3708 fixed-depth collapse floor_meso^{k^2} is a reparameterization ' +
    'artifact of holding s global; the per-site depth removes it.',
  scaleTable: SCHEDULE_TABLE,
  pinnedExponent: +PINNED_EXPONENT.toFixed(6), // = E_meso, scale-invariant
  frontExponent: +FRONT_EXPONENT.toFixed(6), // = 0.25, scale-invariant
  repoIngredients: REPO_INGREDIENTS,
  residualNewIngredients: RESIDUAL_NEW_INGREDIENTS,
  anyConstructionShipped: ANY_CONSTRUCTION_SHIPPED, // false
  subGapStillOpen: true,
  g6aStillOpen: true,
  isRigorous: false,
  verdict:
    'DERIVATION / SCOPING (frontier-direction, NOT rigorous): the imp-3714 sub-gap ' +
    'G6a_shock_lipschitz::y2-adapted-flow-depth is the per-site self-similar schedule s_k(g_k) = c g_k^2 ' +
    '(run pair k -s backward flow only as deep as the local gap squared). Reading the Lemma B floor at ' +
    'that pair gives exp(-2 s_k / g_k^2) = exp(-2 c), INDEPENDENT of g_k -- the depth tracks g_k^2, so the ' +
    'exponent is the constant 2c at every scale and the floor is scale-invariant, unlike the fixed global ' +
    'depth whose exponent E_meso (y_star / g_k)^2 = E_meso k^2 diverges. KEY FINDING: the collision time ' +
    'tau_c ~ g_k^2 / 8 (imp-325: d(g_k^2)/dtau >= -8 gives tau_c >= g_k^2/8) AND the floor-pinning depth ' +
    'both scale as g_k^2, with c_pin = E_meso/2 = 0.004520 < c_front = 1/8 = 0.125. So a per-site depth ' +
    's_k = c g_k^2 with fixed c in [c_pin, c_front] SIMULTANEOUSLY reaches the collision front and keeps ' +
    'the floor exp(-2c) bounded away from 0 uniformly as g_k -> 0 (at the minimal front-reaching depth, ' +
    'floor exp(-1/4) ~ 0.779 at every pair). The imp-3708 fixed-depth collapse floor_meso^{k^2} is a ' +
    'reparameterization artifact of holding s global; the per-site depth removes it and the floor becomes ' +
    'scale-invariant. IN REPO: the g_k field (imp-322/325), the tau_c >= g_k^2/8 bound (imp-325), the ' +
    'imp-3642 RK4 machinery, the imp-3708 s(y) ~ y^2 escape condition. STILL NEW: (N1) a heterogeneous ' +
    'per-site-depth Gronwall contraction composed across the range of separations -- the pinned per-pair ' +
    'floor is necessary but not sufficient; (N2) a per-site adaptive-depth RK4 integrator (the floor ' +
    'values are scaling estimates, not outputs of an actual per-site run); (N3) the two-point ' +
    'pair-separation extension (REQ-i). So the schedule is DERIVED and shown scale-consistent, but no ' +
    'construction is shipped and G6a_shock_lipschitz stays OPEN. Derivation / scoping only; no positivity, ' +
    'no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity ' +
    'UNTOUCHED. No refereed bound is changed.',
  citation:
    'imp-3708 (names the sub-gap; fixed-depth floor collapse floor_meso^{k^2}, escape s(y) ~ y^2); ' +
    'imp-3714 (K1, K2 both require the y2-adapted per-pair depth); imp-3642 (backward-Dyson RK4 flow; ' +
    'mesoscopic floor 0.991 at y_star = 4 d); imp-325 dyson-collision-lower-bound (d(g_k^2)/dtau >= -8, ' +
    'so tau_c >= g_k^2 / 8); lambda-roadmap Step 4 (Polymath15 bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE_ASSERTIONS = [
  {
    // The self-similar schedule pins the exponent 2 s_k / g_k^2 = 2c CONSTANT at every scale (independent of g_k).
    id: 'imp3726-self-similar-exponent-scale-invariant',
    description: '2 s_k / g_k^2 = 2c is constant across the whole g_k ladder for both c_pin and c_front',
    holds: () =>
      G_LADDER.every((g) => Math.abs((2 * selfSimilarDepth(g, C_PIN)) / (g * g) - 2 * C_PIN) < 1e-12) &&
      G_LADDER.every((g) => Math.abs((2 * selfSimilarDepth(g, C_FRONT)) / (g * g) - 2 * C_FRONT) < 1e-12) &&
      Math.abs(PINNED_EXPONENT - E_MESO) < 1e-12 &&
      Math.abs(FRONT_EXPONENT - 0.25) < 1e-12,
  },
  {
    // Floor-pinning constant reproduces the imp-3642 mesoscopic floor 0.991.
    id: 'imp3726-pin-constant-reproduces-meso-floor',
    description: 'c_pin = E_meso/2 gives adapted floor exp(-E_meso) = 0.991 (imp-3642 mesoscopic floor)',
    holds: () =>
      Math.abs(adaptedFloor(C_PIN) - IMP3642_MESO_FLOOR) < 1e-12 &&
      Math.abs(C_PIN - E_MESO / 2) < 1e-15,
  },
  {
    // Front-reaching depth matches the imp-325 collision-time lower bound tau_c >= g^2/8 and stays non-vacuous.
    id: 'imp3726-front-depth-matches-collision-time',
    description: 'c_front = 1/8 gives s_front(g) = g^2/8 = tau_c lower bound; floor exp(-1/4) ~ 0.779 bounded away from 0',
    holds: () =>
      Math.abs(C_FRONT - 1 / 8) < 1e-15 &&
      G_LADDER.every((g) => Math.abs(selfSimilarDepth(g, C_FRONT) - (g * g) / 8) < 1e-12) &&
      Math.abs(adaptedFloor(C_FRONT) - Math.exp(-0.25)) < 1e-12 &&
      adaptedFloor(C_FRONT) > 0.7,
  },
  {
    // The adapted floor is bounded away from 0 across the ladder while the fixed-depth floor collapses.
    id: 'imp3726-adapted-bounded-fixed-collapses',
    description: 'adapted floors constant (>= 0.77) at every g_k; fixed-depth floor > 0.98 at g=4d but < 1e-8 at g=0.08d',
    holds: () => {
      const adaptedConstant = SCHEDULE_TABLE.every(
        (row) =>
          Math.abs(row.adaptedFloorPin - IMP3642_MESO_FLOOR) < 1e-6 &&
          row.adaptedFloorFront > 0.77 &&
          Math.abs(row.adaptedFloorFront - SCHEDULE_TABLE[0].adaptedFloorFront) < 1e-9,
      );
      const fixedCollapses =
        fixedDepthFloor(4) > 0.98 && fixedDepthFloor(0.08) < 1e-8;
      return adaptedConstant && fixedCollapses;
    },
  },
  {
    // The floor-pinning depth is SHALLOWER than the front-reaching depth: nonempty admissible window, both ~ g^2.
    id: 'imp3726-nonempty-self-similar-window',
    description: 'c_pin < c_front so depth reaching the front keeps the floor bounded; per-site depths shrink like g^2',
    holds: () =>
      C_PIN < C_FRONT &&
      ANY_CONSTRUCTION_SHIPPED === false &&
      // both depths shrink toward 0 as g -> 0 (self-similar), never fixed
      selfSimilarDepth(0.08, C_FRONT) < selfSimilarDepth(4, C_FRONT) &&
      selfSimilarDepth(0.08, C_PIN) < selfSimilarDepth(4, C_PIN),
  },
  {
    // Residual gap named: repo ingredients listed, still-new ingredients enumerated, nothing shipped, sub-gap open.
    id: 'imp3726-residual-gap-named-nothing-shipped',
    description: 'repo ingredients and 3 still-new ingredients (N1/N2/N3) enumerated; no construction shipped; sub-gap open',
    holds: () =>
      REPO_INGREDIENTS.length === 4 &&
      RESIDUAL_NEW_INGREDIENTS.length === 3 &&
      RESIDUAL_NEW_INGREDIENTS.map((n) => n.id).join(',') === 'N1,N2,N3' &&
      IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE.anyConstructionShipped === false &&
      IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE.subGapStillOpen === true &&
      IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE.g6aStillOpen === true,
  },
  {
    // Honesty gate: derivation/scoping only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3726-honesty-gate-no-qed',
    description: 'Derivation/scoping only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE.isRigorous === false &&
      /NO QED/.test(IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE.verdict) &&
      /refereed bound is changed/i.test(IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE.verdict),
  },
];

for (const a of IMP3726_Y2_ADAPTED_FLOW_DEPTH_SCHEDULE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3726-y2-adapted-flow-depth-schedule assertion failed: ${a.id}`);
  }
}
