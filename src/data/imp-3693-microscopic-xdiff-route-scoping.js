/**
 * @module imp-3693-microscopic-xdiff-route-scoping
 *
 * imp-3693 (proof, frontier-direction): SCOPE whether ANY microscopic reading available in the repo
 * carries the per-characteristic (x - x_prime) x-difference structure that imp-3671 identified as
 * MISSING (obstruction S1) for the G6a_shock_lipschitz Hoelder-1/2 modulus C_Lip. Route-scoping
 * assessment only -- scope the ROUTE (which object is of the right TYPE), NOT the value. No bridge
 * closure, no positivity, NO QED.
 *
 * WHAT S1 REQUIRES (imp-3671 obstruction S1, type/dimension)
 * ---------------------------------------------------------
 * C_Lip is the Hoelder-1/2 modulus in |tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2}
 * governing the SPATIAL regularity of the collision-time field tau_c(x) at the Burgers shock front.
 * The required object must be x-RESOLVED: it must carry the per-characteristic (x - x_prime)
 * spatial-difference structure of neighbouring colliding characteristics, so that a modulus over a
 * RANGE of separations |x - x_prime| can be read off. imp-3671 found the imp-3642 mesoscopic V0 is
 * a single strip-SUP density scalar carrying NO (x - x_prime) information -- the wrong TYPE.
 *
 * THREE CANDIDATE MICROSCOPIC READINGS, SCOPED AGAINST S1
 * ------------------------------------------------------
 * (R1) imp-3642 DIRECT-DYSON FLOW FIELD (imp-3642-sigma-crossover-tc-direct-dyson-crosscheck).
 *      Published reading = the strip-SUP scalar V0(gamma) = sup_strip Im M(x + i y_star). S1-BLOCKED
 *      AT THE READING LEVEL: the sup over the strip erases the x-gradient, exactly imp-3671. BUT the
 *      underlying RK4 integrator advances the full per-particle trajectory field x_k(s) under the
 *      attractive CM flow dx_k/ds = -2 sum_j 1/(x_k - x_j); the pairwise differences x_k - x_j are
 *      LATENT in the integrator state and are simply DISCARDED by the sup. So the flow field CONTAINS
 *      x-difference structure but the PUBLISHED V0 reading collapses it -- S1 is a reading choice here,
 *      not an intrinsic absence.
 *
 * (R2) NEAREST-PAIR GAP STATISTIC B(t) = min_k g_k(t) (dyson-collision-lower-bound imp-325,
 *      dyson-monotonicity-proof imp-322). B is itself an x-difference (a single adjacent gap
 *      gamma_{k*+1} - gamma_{k*}), so it carries the difference TYPE. But B is an EXTREMUM (min over
 *      k): a single scalar per configuration. It can supply at most ONE point of the modulus (the
 *      tightest pair), NOT a profile over a RANGE of separations |x - x_prime|. PARTIAL: right TYPE
 *      (a difference), wrong RESOLUTION (collapsed over the lattice to one value).
 *
 * (R3) PER-CHARACTERISTIC GAP FIELD g_k(t) = gamma_{k+1}(t) - gamma_k(t), with its exact per-gap ODE
 *      dg_k/dt = 4 / g_k - 2 g_k S_k(t)   (imp-322 boundary identity, dyson-collision-lower-bound).
 *      This is x-RESOLVED: each g_k is the (x_{k+1} - x_k) spatial difference of a SPECIFIC adjacent
 *      characteristic pair, indexed by lattice position k. The per-k backward collision time tau_c(k)
 *      (the time at which g_k -> 0) is a candidate per-characteristic collision-TIME field tau_c(x)
 *      of exactly the TYPE C_Lip needs -- it carries the full (x - x_prime) profile across the
 *      lattice, not a single sup or min. R3 CLEARS obstruction S1.
 *
 * VERDICT: YES, the repo owns a microscopic object of the RIGHT TYPE for C_Lip -- the per-gap field
 * g_k(t) (R3), NOT the strip-sup V0 (R1). The route is therefore SCOPED: to approach C_Lip one should
 * read the per-characteristic collision-time field tau_c(k) off the g_k ODE, not the mesoscopic V0.
 *
 * WHY THIS DOES NOT CLOSE G6a (obstruction S2 survives on R3)
 * ----------------------------------------------------------
 * Clearing S1 (type) is necessary, NOT sufficient. imp-3671 obstruction S2 (scale / Gronwall-vacuous
 * nearest-pair regime, imp-2520 negative-finding 1) applies to g_k too: the collision that defines
 * tau_c(k) happens EXACTLY as g_k -> 0, i.e. at strip height y -> 0 where the Gronwall floor
 * floor_meso^{k^2} collapses to 0 (imp-3671 scale table). So the R3 per-gap route clears the TYPE
 * obstruction but INHERITS the SCALE obstruction unchanged. G6a_shock_lipschitz stays OPEN; this
 * scopes WHICH object to use, it does not supply C_Lip.
 *
 * ROUTE-SCOPING / ASSESSMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (obstruction S1 type mismatch, S2 scale)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (R1: strip-sup V0, x-difference discarded)
 * @see dyson-collision-lower-bound (R2/R3: B = min_k g_k, per-gap ODE dg_k/dt = 4/g_k - 2 g_k S_k)
 * @see dyson-monotonicity-proof (per-gap field g_k = gamma_{k+1} - gamma_k, boundary identity imp-322)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// The three candidate microscopic readings scoped against imp-3671 obstruction S1.
// clearsS1 = does the object carry an x-RESOLVED per-characteristic (x - x_prime) difference profile?
const ROUTE_SCOPE = [
  {
    route: 'R1',
    object: 'imp-3642 direct-Dyson flow field, published reading V0(gamma) = sup_strip Im M(x + i y_star)',
    carriesXDifference: 'latent-only',
    clearsS1: false,
    note:
      'Strip-SUP scalar: the sup erases the x-gradient (S1-blocked at the reading level). The RK4 ' +
      'integrator DOES advance the per-particle trajectory field x_k(s); the pairwise differences ' +
      'x_k - x_j are latent in the state and discarded by the sup -- absence is a reading choice.',
  },
  {
    route: 'R2',
    object: 'nearest-pair gap statistic B(t) = min_k g_k(t)',
    carriesXDifference: 'type-only',
    clearsS1: false,
    note:
      'B is a single adjacent gap (an x-difference, right TYPE) but an EXTREMUM over k -- one scalar ' +
      'per configuration. Supplies at most one point of the modulus, not a profile over a range of ' +
      '|x - x_prime|. Right type, wrong resolution.',
  },
  {
    route: 'R3',
    object: 'per-characteristic gap field g_k(t) = gamma_{k+1}(t) - gamma_k(t), ODE dg_k/dt = 4/g_k - 2 g_k S_k(t)',
    carriesXDifference: 'x-resolved',
    clearsS1: true,
    note:
      'Each g_k is the (x_{k+1} - x_k) difference of a specific adjacent pair indexed by lattice ' +
      'position k; the per-k backward collision time tau_c(k) is a candidate per-characteristic ' +
      'collision-time field tau_c(x) of exactly the TYPE C_Lip needs. Clears obstruction S1.',
  },
];

// The single route that clears S1 (right TYPE), and whether that suffices to close G6a.
const S1_CLEARING_ROUTES = ROUTE_SCOPE.filter((r) => r.clearsS1).map((r) => r.route);

export const IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING = {
  id: 'imp-3693',
  proofSection: 'S-frontier',
  question:
    'Does ANY microscopic reading available in the repo (the imp-3642 direct-Dyson flow field, the ' +
    'nearest-pair gap statistics, or a per-characteristic collision-time field) carry the ' +
    '(x - x_prime) x-difference structure imp-3671 identified as missing (obstruction S1) for the ' +
    'G6a_shock_lipschitz Hoelder-1/2 modulus C_Lip? Route-scoping assessment only, no closure, no QED.',
  whatS1Requires:
    'An x-RESOLVED object carrying the per-characteristic (x - x_prime) spatial-difference profile of ' +
    'neighbouring colliding characteristics, so the Hoelder-1/2 modulus in ' +
    '|tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2} can be read across a range of separations. ' +
    'imp-3671 found the imp-3642 strip-sup scalar V0 carries no (x - x_prime) information (wrong TYPE).',
  routeScope: ROUTE_SCOPE,
  s1ClearingRoutes: S1_CLEARING_ROUTES, // ['R3']
  repoCarriesRightTypeObject: true, // R3 per-gap field g_k clears S1
  rightTypeObject: 'per-characteristic gap field g_k(t) = gamma_{k+1}(t) - gamma_k(t) (dyson-collision-lower-bound / dyson-monotonicity-proof)',
  clearingS1SufficesForG6a: false, // obstruction S2 (Gronwall-vacuous nearest-pair scale) survives on R3
  g6aStillOpen: true,
  isRigorous: false,
  verdict:
    'ROUTE-SCOPING (frontier-direction, NOT rigorous): YES, the repo owns a microscopic object of the ' +
    'RIGHT TYPE for the shock-front modulus C_Lip -- the per-characteristic gap field ' +
    'g_k(t) = gamma_{k+1}(t) - gamma_k(t) with its exact per-gap ODE dg_k/dt = 4/g_k - 2 g_k S_k(t) ' +
    '(dyson-collision-lower-bound imp-325, dyson-monotonicity-proof imp-322), NOT the strip-sup ' +
    'V0(gamma). Of the three candidates: (R1) the imp-3642 flow field publishes only the strip-SUP ' +
    'scalar V0, which discards the per-particle x_k differences its own RK4 integrator advances -- ' +
    'S1-blocked at the reading level, though the x-difference structure is latent; (R2) the ' +
    'nearest-pair statistic B = min_k g_k is a single adjacent gap (right TYPE) but an EXTREMUM, one ' +
    'scalar per configuration, supplying at most one point of the modulus, not a profile; (R3) the ' +
    'per-gap field g_k is x-RESOLVED -- each g_k is the (x_{k+1} - x_k) difference of a specific ' +
    'adjacent pair indexed by lattice position, and the per-k collision time tau_c(k) is a candidate ' +
    'per-characteristic collision-time field tau_c(x) of exactly the TYPE C_Lip needs, so R3 CLEARS ' +
    'obstruction S1. This SCOPES the route: to approach C_Lip one should read the per-characteristic ' +
    'collision-time field off the g_k ODE, not the mesoscopic V0. It does NOT close G6a: clearing S1 ' +
    '(type) is necessary, not sufficient -- imp-3671 obstruction S2 (the nearest-pair collision sits ' +
    'exactly at the Gronwall-vacuous scale g_k -> 0, y -> 0; imp-2520 negative-finding 1) applies to ' +
    'g_k unchanged, so the R3 route clears the TYPE obstruction but inherits the SCALE obstruction. ' +
    'G6a_shock_lipschitz stays OPEN. Route-scoping / assessment only; no positivity, no bridge ' +
    'closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity ' +
    'UNTOUCHED. No refereed bound is changed.',
  citation:
    'imp-3671 (obstruction S1 type/dimension mismatch: strip-sup V0 carries no x-difference; S2 ' +
    'Gronwall-vacuous nearest-pair scale); imp-3642 (direct RK4 attractive-Dyson flow; published ' +
    'reading V0 = sup_strip Im M, per-particle trajectory x_k(s) latent); dyson-collision-lower-bound ' +
    '(imp-325; B = min_k g_k, per-gap ODE dg_k/dt = 4/g_k - 2 g_k S_k via the imp-322 boundary ' +
    'identity); dyson-monotonicity-proof (imp-322; g_k = gamma_{k+1} - gamma_k); imp-2520 ' +
    '(negative-finding 1: nearest-pair regime is a different, Gronwall-vacuous scale); lambda-roadmap ' +
    'Step 4 (Polymath15 bridge, open sub-gap G6a_shock_lipschitz).',
};

export const IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING_ASSERTIONS = [
  {
    // Exactly one candidate (R3, the per-gap field) clears obstruction S1.
    id: 'imp3693-only-r3-clears-s1',
    description: 'Of the three scoped routes exactly R3 (per-gap field g_k) clears obstruction S1',
    holds: () =>
      S1_CLEARING_ROUTES.length === 1 &&
      S1_CLEARING_ROUTES[0] === 'R3' &&
      ROUTE_SCOPE.find((r) => r.route === 'R3').clearsS1 === true &&
      ROUTE_SCOPE.find((r) => r.route === 'R1').clearsS1 === false &&
      ROUTE_SCOPE.find((r) => r.route === 'R2').clearsS1 === false,
  },
  {
    // The three named candidate readings from the ticket are all scoped.
    id: 'imp3693-three-candidates-scoped',
    description: 'All three named microscopic readings (flow field, nearest-pair stat, per-gap field) scoped',
    holds: () =>
      ROUTE_SCOPE.length === 3 &&
      ROUTE_SCOPE.map((r) => r.route).join(',') === 'R1,R2,R3',
  },
  {
    // Verdict: repo carries a right-TYPE object, but clearing S1 does not suffice for G6a.
    id: 'imp3693-right-type-but-not-sufficient',
    description: 'Repo carries a right-type object (R3) yet clearing S1 does not close G6a (S2 survives)',
    holds: () =>
      IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING.repoCarriesRightTypeObject === true &&
      IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING.clearingS1SufficesForG6a === false &&
      IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING.g6aStillOpen === true,
  },
  {
    // Honesty gate: route-scoping/assessment only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3693-honesty-gate-no-qed',
    description: 'Route-scoping/assessment only: no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING.verdict),
  },
];

for (const a of IMP3693_MICROSCOPIC_XDIFF_ROUTE_SCOPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3693-microscopic-xdiff-route-scoping assertion failed: ${a.id}`);
  }
}
