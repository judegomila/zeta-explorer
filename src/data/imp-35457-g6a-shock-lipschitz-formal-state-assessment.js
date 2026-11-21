/**
 * @module imp-35457-g6a-shock-lipschitz-formal-state-assessment
 *
 * imp-35457 (proof, frontier-direction): ASSESS the present formal state of the OPEN
 * Step-4 Polymath15-bridge sub-gap G6a_shock_lipschitz named in lambda-roadmap
 * currentStatus (Step 4 graded NUMERICAL), enumerate which existing repo lemmas bear
 * on it, and state the MINIMAL additional statement a rigorous discharge would require.
 * Scoping / assessment ONLY -- proves nothing, closes no gap, changes no grade, NO QED.
 *
 * THE OBSTRUCTION, RESTATED
 * -------------------------
 * G6a_shock_lipschitz is the Step-4 conditional carried by the Polymath15 bridge: the
 * per-N collision-time field must be spatially Hoelder-1/2,
 *     |tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2},
 * with a FINITE-N-UNIFORM modulus C_Lip. This is a shock-regularity statement: at a
 * gap collapse the collision-time field develops a square-root (fold-catastrophe) edge,
 * and the bridge needs the modulus of that edge controlled uniformly in N. The known
 * negative result (imp-2640) is that C_H, the W_1 / measure-space shock modulus, is
 * PROVABLY divergent (three independent impossibility proofs), so the classical
 * Hoelder-1/2 object cannot be certified in the W_1 channel. That divergence is exactly
 * why lambda-roadmap grades Step 4 NUMERICAL and states RH does NOT follow
 * unconditionally while this bridge stays open.
 *
 * WHICH EXISTING REPO LEMMAS BEAR ON IT (the two surviving discharge routes)
 * -------------------------------------------------------------------------
 * ROUTE M (mesoscopic modulus object). The imp-3671/imp-3714 line derives the JOINT
 * requirement-set an admissible Hoelder-1/2 modulus object must satisfy:
 *   (i) two-point x-difference dependence (S1, imp-3693) AND
 *   (ii) a nearest-pair-scale non-vacuous Gronwall floor (S2, imp-3708),
 * coupled because the only right-type repo object (the per-gap field g_k) defines
 * tau_c at exactly g_k -> 0, the scale where the fixed-depth floor is vacuous. Its
 * minimal missing ingredient is the imp-3708-named sub-gap
 * G6a_shock_lipschitz::y2-adapted-flow-depth s(y) ~ y^2 plus a two-point pair-separation
 * extension. Bears directly, but NO construction is shipped -- the modulus object is
 * still missing an ingredient.
 *
 * ROUTE F (field-channel reroute). imp-2520 (Backward-flow stability, the Gronwall
 * propagation lemma promoted to a standalone theorem) and its imp-3725/imp-3933
 * descendants supply a DIFFERENT object. imp-3933 certifies a finite, N-uniform,
 * DETERMINISTIC collision-time transfer modulus in the VECTOR-FIELD-ERROR channel: for
 * any two flows in the class dx_k/dt = F_k(x) + e_k(t) sharing initial data, with the
 * local-difference field bound |e_{l+1} - e_l| <= eps_prime * g_l, the first-collision
 * times lie in the SAME interval [tLo(eps_prime), tHi(eps_prime)], so
 *     |t_c^{true} - t_c^{model}| <= W(eps_prime) = tHi - tLo,  dW/deps_prime ~ 3 H^4/64,
 * with NO W_1 modulus, NO Gronwall flow-Jacobian, NO GUE/PCC input. This REROUTES the
 * C_Lip wall: the finite-N chain never needed the (divergent) W_1 measure-space modulus;
 * the model-to-true transfer it actually uses is an initial-data functional of the zero
 * table, certified on every H_raw plateau of N in [1e4, 1e6].
 *
 * THE MINIMAL MISSING STATEMENT, PER ROUTE
 * ----------------------------------------
 * ROUTE M residual: construct an object carrying BOTH a two-point x-difference profile
 *   AND a per-pair y2-adapted flow depth on the SAME object (imp-3714 K1/K2), or an
 *   entirely new entropy-solution regularity route (K4). None is in the repo.
 * ROUTE F residual (the NARROWER one): the imp-3933 transfer modulus is unconditional in
 *   eps_prime, but bridging model -> true xi heat-flow needs a CERTIFIED N-uniform bound
 *   eps_prime_true <= eps_prime_grid on the omitted-field local-difference (field-Lipschitz)
 *   constant of the TRUE xi backward heat-flow zero dynamics -- i.e. that the
 *   window-truncation + mirror-zero tail error e_k = E(x_k, t) satisfies
 *   |dE/dx| <= eps_prime_true with eps_prime_true inside the certified plateau grid
 *   (eps_prime Max ranges 22.9 .. 1216.6 across the ten plateaus). This "eps_prime-certificate",
 *   plus the imp-3933-flagged bracket rearchitecture, is the MINIMAL additional statement.
 *   It is STRICTLY NARROWER than the classical G6a Hoelder-1/2 shock modulus: it asks for a
 *   spatial-DERIVATIVE bound on a KNOWN analytic error field, not a square-root shock modulus
 *   on the collision-time field, and it is deterministic / RH-free / GUE-free.
 *
 * VERDICT: G6a_shock_lipschitz is NOT a single monolithic missing modulus. The W_1-channel
 * C_Lip is provably divergent (imp-2640, do not re-attempt). Two repo routes survive: the
 * mesoscopic modulus-object route (Route M), whose minimal residual is the
 * y2-adapted-flow-depth sub-gap plus a two-point extension, and the field-channel reroute
 * (Route F, imp-2520 -> imp-3933), whose minimal residual is a certified N-uniform
 * eps_prime-certificate for the true xi heat-flow field-error. Route F is the NARROWER
 * discharge target: a spatial-derivative bound on a known error field, already backed by a
 * deterministic N-uniform transfer modulus certified on N in [1e4, 1e6]. Assessment /
 * scoping ONLY: nothing is proved, no construction is shipped, no grade changes,
 * G6a_shock_lipschitz stays OPEN, imp-3066 off-diagonal endpoint-Hankel positivity
 * UNTOUCHED, NO QED, no refereed bound is changed.
 *
 * @see imp-3714-g6a-modulus-object-requirements (Route M joint requirement-set)
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (S1 type / S2 scale obstructions)
 * @see backward-flow-stability-gronwall (imp-2520 backward-flow stability theorem, Route F anchor)
 * @see imp-3933-eps-field-robust-bootstrap (field-channel transfer modulus, Route F)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// The obstruction: a finite-N-uniform Hoelder-1/2 spatial modulus on the collision-time field.
const OBSTRUCTION = {
  name: 'G6a_shock_lipschitz',
  statement:
    '|tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2} with a finite-N-uniform C_Lip; ' +
    'a shock-regularity (square-root fold-catastrophe) modulus on the collision-time field.',
  knownNegative:
    'imp-2640: the W_1 / measure-space shock modulus C_H is PROVABLY divergent (three ' +
    'independent impossibility proofs); the classical object cannot be certified in the W_1 channel.',
  roadmapGrade: 'Step 4 (Polymath15 bridge) graded NUMERICAL; RH does NOT follow unconditionally while open.',
};

// The two surviving repo discharge routes and, for each, the minimal missing statement.
const ROUTES = [
  {
    id: 'M',
    name: 'mesoscopic modulus object',
    bearingLemmas: ['imp-3671', 'imp-3693', 'imp-3708', 'imp-3714'],
    object: 'admissible Hoelder-1/2 modulus object built off the per-gap field g_k',
    minimalMissing:
      'a single object carrying BOTH a two-point x-difference profile AND a per-pair ' +
      'y2-adapted flow depth s(y) ~ y^2 (imp-3708 sub-gap G6a_shock_lipschitz::y2-adapted-flow-depth), ' +
      'or an entirely new entropy-solution regularity route',
    inRepo: false,
    narrower: false,
  },
  {
    id: 'F',
    name: 'field-channel reroute',
    bearingLemmas: ['imp-2520', 'imp-3725', 'imp-3933'],
    object:
      'deterministic N-uniform collision-time transfer modulus W(eps_prime) in the vector-field-error ' +
      'channel, certified on every H_raw plateau of N in [1e4, 1e6]',
    minimalMissing:
      'a certified N-uniform bound eps_prime_true <= eps_prime_grid on the omitted-field local-difference ' +
      '(field-Lipschitz) constant of the TRUE xi backward heat-flow zero dynamics (the eps_prime-certificate), ' +
      'plus the imp-3933-flagged bracket rearchitecture',
    inRepo: false,
    narrower: true,
  },
];

const W1_CHANNEL_DIVERGENT = true; // imp-2640: do not re-attempt the W_1-channel C_Lip
const NARROWER_ROUTE = ROUTES.find((r) => r.narrower).id; // 'F'
const G6A_STILL_OPEN = true;

export const IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT = {
  id: 'imp-35457',
  proofSection: 'S-frontier',
  question:
    'What is the present formal state of the OPEN Step-4 Polymath15-bridge sub-gap ' +
    'G6a_shock_lipschitz, which existing repo lemmas bear on it, and what is the MINIMAL ' +
    'additional statement a rigorous discharge would require? Assessment / scoping only, no QED.',
  obstruction: OBSTRUCTION,
  w1ChannelDivergent: W1_CHANNEL_DIVERGENT,
  routes: ROUTES,
  narrowerRoute: NARROWER_ROUTE,
  minimalMissingLemma:
    'ROUTE F eps_prime-certificate: a certified N-uniform spatial-derivative bound |dE/dx| <= ' +
    'eps_prime_true on the true xi heat-flow window-truncation + mirror-zero tail error field, with ' +
    'eps_prime_true inside the imp-3933 certified plateau grid -- strictly NARROWER than the classical ' +
    'G6a Hoelder-1/2 shock modulus, deterministic, RH-free, GUE-free.',
  g6aStillOpen: G6A_STILL_OPEN,
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous): G6a_shock_lipschitz is NOT a single ' +
    'monolithic missing modulus. The W_1-channel C_Lip is provably divergent (imp-2640; do not ' +
    're-attempt). Two repo routes survive. ROUTE M (mesoscopic modulus object, imp-3671/imp-3714) ' +
    'has minimal residual the imp-3708 y2-adapted-flow-depth sub-gap plus a two-point pair-separation ' +
    'extension -- no construction in the repo. ROUTE F (field-channel reroute, imp-2520 backward-flow ' +
    'stability -> imp-3933 transfer modulus) already carries a deterministic N-uniform collision-time ' +
    'transfer modulus certified on N in [1e4, 1e6], so the finite-N chain never needed the divergent ' +
    'W_1 modulus; its minimal residual is a certified N-uniform eps_prime-certificate on the true xi ' +
    'heat-flow field-error Lipschitz constant plus the flagged bracket rearchitecture. Route F is the ' +
    'NARROWER discharge target: a spatial-derivative bound on a KNOWN analytic error field, not a ' +
    'square-root shock modulus on the collision-time field. Assessment only: nothing proved, no ' +
    'construction shipped, no grade changed, G6a_shock_lipschitz stays OPEN, imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 positivity UNTOUCHED, NO QED, no refereed bound is changed' +
    '.',
  citation:
    'lambda-roadmap currentStatus (Step 4 Polymath15 bridge, NUMERICAL, open G6a_shock_lipschitz); ' +
    'imp-2640 (W_1 shock modulus C_H provably divergent); imp-3671/imp-3693/imp-3708/imp-3714 ' +
    '(Route M mesoscopic modulus-object requirement-set and its y2-adapted-flow-depth residual); ' +
    'imp-2520 backward-flow-stability-gronwall + imp-3725 + imp-3933 (Route F field-channel transfer ' +
    'modulus and its eps_prime-certificate residual).',
};

export const IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT_ASSERTIONS = [
  {
    // The W_1-channel C_Lip is recorded as provably divergent (imp-2640): do not re-attempt.
    id: 'imp35457-w1-channel-divergent',
    description: 'W_1-channel C_Lip is provably divergent (imp-2640); the classical object is off the table',
    holds: () =>
      IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT.w1ChannelDivergent === true &&
      /provably divergent/i.test(OBSTRUCTION.knownNegative),
  },
  {
    // Exactly two surviving routes, anchored to the lemmas the ticket names (imp-2520, C_Lip field-channel).
    id: 'imp35457-two-routes-named-lemmas',
    description: 'Route M (imp-3714) and Route F (imp-2520 -> imp-3933) are the two bearing routes',
    holds: () =>
      ROUTES.length === 2 &&
      ROUTES.find((r) => r.id === 'M').bearingLemmas.includes('imp-3714') &&
      ROUTES.find((r) => r.id === 'F').bearingLemmas.includes('imp-2520') &&
      ROUTES.find((r) => r.id === 'F').bearingLemmas.includes('imp-3933'),
  },
  {
    // The field-channel route is the narrower discharge target; its residual is the eps_prime-certificate.
    id: 'imp35457-field-channel-narrower',
    description: 'Route F is the narrower target; minimal missing lemma is the eps_prime-certificate',
    holds: () =>
      NARROWER_ROUTE === 'F' &&
      ROUTES.find((r) => r.id === 'F').narrower === true &&
      ROUTES.find((r) => r.id === 'M').narrower === false &&
      /eps_prime-certificate/.test(IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT.minimalMissingLemma),
  },
  {
    // Neither route ships a construction: G6a stays open, both residuals are not-in-repo.
    id: 'imp35457-no-construction-shipped',
    description: 'both routes still miss an ingredient; G6a_shock_lipschitz stays OPEN',
    holds: () =>
      ROUTES.every((r) => r.inRepo === false) &&
      IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT.g6aStillOpen === true,
  },
  {
    // Honesty gate: assessment only, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp35457-honesty-gate-no-qed',
    description: 'Assessment/scoping only: no QED, no refereed bound is changed, imp-3066 untouched, G6a open',
    holds: () =>
      IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT.verdict),
  },
];

for (const a of IMP35457_G6A_SHOCK_LIPSCHITZ_FORMAL_STATE_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35457-g6a-shock-lipschitz-formal-state-assessment assertion failed: ${a.id}`);
  }
}
