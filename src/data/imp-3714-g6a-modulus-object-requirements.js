/**
 * @module imp-3714-g6a-modulus-object-requirements
 *
 * imp-3714 (proof, frontier-direction): DERIVE the JOINT requirement-set any admissible
 * G6a_shock_lipschitz Hoelder-1/2 modulus object must satisfy, synthesizing the TWO independent
 * imp-3671 obstructions that the sibling drill-down tickets characterized separately, and ENUMERATE
 * candidate constructions consistent with BOTH -- stating for each whether the repo already contains
 * the ingredients or they would be new. Scoping / derivation only, no construction shipped, NO QED.
 *
 * imp-3671 ruled the imp-3642 mesoscopic density floor V0 STRUCTURALLY SILENT on the open Step-4
 * Polymath15-bridge sub-gap G6a_shock_lipschitz (the Hoelder-1/2 spatial modulus C_Lip in
 * |tau_c(x) - tau_c(x_prime)| <= C_Lip |x - x_prime|^{1/2}) via two INDEPENDENT obstructions:
 *   (S1) wrong TYPE  -- a strip-SUP scalar has no (x - x_prime) x-difference structure (imp-3693 drilled S1);
 *   (S2) wrong SCALE -- the mesoscopic reading is Gronwall-VACUOUS at the nearest-pair shock scale
 *        (imp-3708 drilled S2, verdict INTRINSIC to the y -> 0 limit).
 * Those two tickets each addressed ONE obstruction. This module DISTINCTLY derives the JOINT
 * requirement-set an object must meet to clear both AT ONCE, and enumerates candidate constructions.
 *
 * THE TWO REQUIREMENTS, DERIVED
 * -----------------------------
 * REQ-i  TWO-POINT x-DIFFERENCE DEPENDENCE (from S1, imp-3693).
 *   The object must be x-RESOLVED: a two-point function of a characteristic pair (a dependence on the
 *   separation |x - x_prime|), so the modulus C_Lip can be read across a RANGE of separations. A strip-sup
 *   scalar (imp-3693 R1) and a single extremum min_k g_k (imp-3693 R2) both FAIL; the per-characteristic
 *   gap field g_k(t) = gamma_{k+1}(t) - gamma_k(t) (imp-3693 R3) is the MINIMAL repo object that clears it.
 *
 * REQ-ii NEAREST-PAIR-SCALE NON-VACUOUS GRONWALL FLOOR (from S2, imp-3708).
 *   The object must be evaluated where tau_c is DEFINED -- at the collision, g_k -> 0, strip height y -> 0 --
 *   and there the Lemma B floor exp(-2 s / y^2) must stay bounded away from 0. imp-3708 showed that with a
 *   single FIXED flow depth the floor collapses as floor_meso^{k^2}, so REQ-ii demands a per-pair
 *   (self-similar) y2-ADAPTED flow depth s(y) ~ y^2 pinning 2 s(y) / y^2 = E_meso at every scale.
 *
 * WHY THE TWO REQUIREMENTS ARE COUPLED, NOT INDEPENDENT KNOBS
 * ----------------------------------------------------------
 * imp-3693 already observed that the ONLY right-TYPE repo object (the per-gap field g_k, clearing REQ-i)
 * defines its collision time tau_c(k) at EXACTLY g_k -> 0, i.e. y -> 0 -- the very scale where imp-3708
 * shows the fixed-depth floor is vacuous. So clearing REQ-i FORCES evaluation at the REQ-ii vacuous scale:
 * the two requirements cannot be met by separate objects. An admissible G6a modulus object must SIMULTANEOUSLY
 * carry (i) a two-point x-difference profile AND (ii) a per-pair y2-adapted flow depth on the SAME object.
 *
 * CANDIDATE CONSTRUCTIONS, ENUMERATED AGAINST BOTH REQUIREMENTS
 * ------------------------------------------------------------
 * (K1) PER-PAIR COLLISION-TIME TWO-POINT CORRELATION FIELD. Build tau_c(k) off the per-gap field g_k and
 *      correlate it over pair separation, C(x, x_prime), with each pair-s backward flow run only to depth
 *      ~ (local gap)^2. Satisfies BOTH by construction. Ingredients: g_k field EXISTS (imp-322 / imp-325);
 *      the two-point pair-separation correlation structure is NEW; the y2-adapted per-pair depth is NEW
 *      (= the imp-3708 named sub-gap). PARTIAL: anchor object present, two of three ingredients new.
 * (K2) SCALE-COVARIANT COLLISION-TIME FIELD VIA GAP-ADAPTED FLOW DEPTH. Run the imp-3642 backward Dyson
 *      RK4 flow with a PER-SITE depth s_k ~ g_k^2 instead of one global depth: x-resolved (per site) AND
 *      y2-adapted. Satisfies BOTH. Ingredients: CM / Dyson RK4 flow EXISTS (imp-3642), g_k EXISTS; the
 *      per-site adaptive-depth reparameterization is NEW (the imp-3708 sub-gap in flow form). PARTIAL.
 * (K3) EQUAL-TIME TWO-POINT GAP STRUCTURE FUNCTION S_2(r) = mean of (g_{k+r} - g_k)^2. x-resolved two-point
 *      object (clears REQ-i) but a purely equal-time statistic attaching NO flow depth -- like the imp-3708
 *      R3 per-pair gap statistics it LOCATES the scale, supplies no s(y). FAILS REQ-ii. Ingredients present.
 *      NEAR-MISS: right type, no adapted depth.
 * (K4) DIRECT ENTROPY-SOLUTION HOELDER REGULARITY BOUND on tau_c(x). Certify C_Lip from a Burgers / CM
 *      entropy-solution spatial-regularity estimate that does NOT route through the mesoscopic Gronwall
 *      floor at all, bypassing both obstructions by NOT being a reading of an existing field. Satisfies BOTH
 *      (different mechanism) but is WHOLLY NEW: the repo contains no such regularity estimate. NEW: no ingredients.
 *
 * VERDICT: the joint requirement-set is (i) two-point x-difference dependence AND (ii) a nearest-pair-scale
 * non-vacuous Gronwall floor; because clearing (i) via the only right-type repo object (g_k) forces evaluation
 * at the g_k -> 0 vacuous scale, (ii) is NOT an independent condition but must be secured THERE by a per-pair
 * y2-adapted flow depth. Of four enumerated candidate constructions, three (K1, K2, K4) are consistent with
 * BOTH requirements and one (K3) fails REQ-ii. NONE is fully present in the repo: the g_k field and the CM
 * flow exist, but every admissible construction additionally needs the imp-3708-named sub-gap
 * G6a_shock_lipschitz::y2-adapted-flow-depth plus a two-point pair-separation extension (K1, K2), or an
 * entirely new entropy-regularity route (K4). Scoping / derivation only; no construction shipped, no
 * positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 * positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3671-mesoscopic-v0-vs-g6a-shock-lipschitz-assessment (parent: names both S1 type and S2 scale)
 * @see imp-3693-microscopic-xdiff-route-scoping (drills S1: per-gap field g_k is the right-TYPE object)
 * @see imp-3708-s2-gronwall-vacuity-intrinsic-assessment (drills S2: y2-adapted depth s(y) ~ y^2 required)
 * @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck (direct RK4 attractive-Dyson flow; strip-sup V0)
 * @see dyson-collision-lower-bound (per-gap ODE dg_k over dt = 4/g_k - 2 g_k S_k; B = min_k g_k)
 * @see lambda-roadmap (Step 4 Polymath15 bridge, open sub-gap G6a_shock_lipschitz)
 */

// The two independent imp-3671 obstructions, restated as the JOINT requirement-set an admissible object must meet.
const REQUIREMENTS = [
  {
    id: 'REQ-i',
    obstruction: 'S1',
    source: 'imp-3693',
    name: 'two-point x-difference dependence',
    statement:
      'The object must be x-RESOLVED -- a two-point function of a characteristic pair (dependence on the ' +
      'separation |x - x_prime|), so C_Lip can be read across a RANGE of separations. Strip-sup scalars ' +
      'and single extrema fail; the per-gap field g_k = gamma_{k+1} - gamma_k is the minimal right-type object.',
  },
  {
    id: 'REQ-ii',
    obstruction: 'S2',
    source: 'imp-3708',
    name: 'nearest-pair-scale non-vacuous Gronwall floor',
    statement:
      'Evaluated where tau_c is defined (g_k -> 0, strip height y -> 0), the Lemma B floor exp(-2 s / y^2) ' +
      'must stay bounded away from 0. With a fixed depth it collapses as floor_meso^{k^2}, so a per-pair ' +
      'y2-adapted flow depth s(y) ~ y^2 (pinning 2 s(y) / y^2 = E_meso at every scale) is required.',
  },
];

// The coupling: clearing REQ-i via the only right-type repo object (g_k) FORCES evaluation at the REQ-ii
// vacuous scale, so the two requirements must be met SIMULTANEOUSLY on the same object, not by separate objects.
const REQUIREMENTS_COUPLED = true;

// Candidate constructions, each scoped against BOTH requirements plus its repo-ingredient status.
const CANDIDATES = [
  {
    id: 'K1',
    construction: 'per-pair collision-time two-point correlation field C(x, x_prime) built off the g_k collision times',
    satisfiesReqI: true,
    satisfiesReqII: true,
    satisfiesBoth: true,
    ingredients: {
      inRepo: ['per-gap field g_k = gamma_{k+1} - gamma_k (imp-322 / imp-325)'],
      new: [
        'two-point pair-separation correlation structure',
        'per-pair y2-adapted flow depth (= imp-3708 sub-gap G6a_shock_lipschitz::y2-adapted-flow-depth)',
      ],
    },
    status: 'partial',
    note: 'anchor object present; two of three ingredients new',
  },
  {
    id: 'K2',
    construction: 'scale-covariant collision-time field via a per-site gap-adapted flow depth s_k ~ g_k^2 on the imp-3642 RK4 flow',
    satisfiesReqI: true,
    satisfiesReqII: true,
    satisfiesBoth: true,
    ingredients: {
      inRepo: [
        'attractive Calogero-Moser / Dyson RK4 backward-flow machinery (imp-3642)',
        'per-gap field g_k (imp-322 / imp-325)',
      ],
      new: ['per-site adaptive-depth reparameterization s_k ~ g_k^2 (the imp-3708 sub-gap in flow form)'],
    },
    status: 'partial',
    note: 'flow machinery present; adaptive-depth reparameterization new',
  },
  {
    id: 'K3',
    construction: 'equal-time two-point gap structure function S_2(r) = mean of (g_{k+r} - g_k)^2',
    satisfiesReqI: true,
    satisfiesReqII: false, // purely equal-time: attaches NO flow depth, cannot secure the non-vacuous floor
    satisfiesBoth: false,
    ingredients: {
      inRepo: ['per-gap field g_k (imp-322 / imp-325)'],
      new: [],
    },
    status: 'near-miss',
    note: 'right type (clears REQ-i) but no adapted flow depth -- like imp-3708 R3, locates the scale, fails REQ-ii',
  },
  {
    id: 'K4',
    construction: 'direct Burgers / CM entropy-solution Hoelder-1/2 spatial-regularity bound on tau_c(x), not routed through the mesoscopic Gronwall floor',
    satisfiesReqI: true,
    satisfiesReqII: true, // bypasses S2 by NOT being a reading of the mesoscopic floor
    satisfiesBoth: true,
    ingredients: {
      inRepo: [],
      new: ['an entropy-solution / PDE-regularity estimate on the collision-time field tau_c(x)'],
    },
    status: 'new',
    note: 'consistent with both by a different mechanism, but wholly new -- repo carries no such regularity estimate',
  },
];

const CANDIDATES_SATISFYING_BOTH = CANDIDATES.filter((c) => c.satisfiesBoth).map((c) => c.id);
const ANY_CANDIDATE_FULLY_IN_REPO = CANDIDATES.some(
  (c) => c.satisfiesBoth && c.ingredients.new.length === 0,
);

export const IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS = {
  id: 'imp-3714',
  proofSection: 'S-frontier',
  question:
    'What JOINT requirement-set must any admissible G6a_shock_lipschitz Hoelder-1/2 modulus object satisfy ' +
    'per the two independent imp-3671 obstructions -- (i) two-point x-difference spatial dependence (S1) and ' +
    '(ii) evaluation at the nearest-pair scale where the Gronwall floor stays bounded away from 0 (S2) -- ' +
    'and which candidate constructions are consistent with BOTH? Scoping / derivation only, no construction, no QED.',
  requirements: REQUIREMENTS,
  requirementsCoupled: REQUIREMENTS_COUPLED,
  couplingReason:
    'The only right-type repo object clearing REQ-i (the per-gap field g_k) defines tau_c(k) at exactly ' +
    'g_k -> 0, y -> 0 -- the very scale where imp-3708 shows the fixed-depth floor is vacuous. So clearing ' +
    'REQ-i FORCES evaluation at the REQ-ii scale: the two must be met simultaneously on the same object.',
  candidates: CANDIDATES,
  candidatesSatisfyingBoth: CANDIDATES_SATISFYING_BOTH, // ['K1','K2','K4']
  anyCandidateFullyInRepo: ANY_CANDIDATE_FULLY_IN_REPO, // false: every admissible construction needs a new ingredient
  minimalMissingObject: 'G6a_shock_lipschitz::y2-adapted-flow-depth (imp-3708) plus a two-point pair-separation extension',
  g6aStillOpen: true,
  isRigorous: false,
  verdict:
    'DERIVATION / SCOPING (frontier-direction, NOT rigorous): an admissible G6a_shock_lipschitz modulus ' +
    'object must jointly satisfy (i) two-point x-difference dependence (S1, imp-3693) AND (ii) a ' +
    'nearest-pair-scale non-vacuous Gronwall floor (S2, imp-3708). These are NOT independent knobs: the ' +
    'only right-type repo object clearing (i), the per-gap field g_k, defines tau_c(k) at exactly g_k -> 0, ' +
    'y -> 0 -- the scale where imp-3708 shows the fixed-depth floor collapses as floor_meso^{k^2} -- so ' +
    'clearing (i) FORCES evaluation at the (ii) vacuous scale, and (ii) must be secured THERE by a per-pair ' +
    'y2-adapted flow depth s(y) ~ y^2. Of four enumerated candidate constructions, three are consistent with ' +
    'BOTH: (K1) a per-pair collision-time two-point correlation field off g_k with per-pair depth ~ gap^2; ' +
    '(K2) a scale-covariant collision-time field running the imp-3642 RK4 flow with per-site depth s_k ~ ' +
    'g_k^2; (K4) a direct Burgers / CM entropy-solution Hoelder-1/2 regularity bound on tau_c(x) that ' +
    'bypasses the mesoscopic floor entirely. One candidate (K3), the equal-time two-point gap structure ' +
    'function, clears (i) but FAILS (ii) -- it attaches no flow depth, like the imp-3708 R3 gap statistics. ' +
    'NONE is fully present in the repo: the g_k field (imp-322 / imp-325) and the CM / Dyson RK4 flow ' +
    '(imp-3642) exist, but every admissible construction additionally requires the imp-3708-named sub-gap ' +
    'G6a_shock_lipschitz::y2-adapted-flow-depth plus a two-point pair-separation extension (K1, K2), or an ' +
    'entirely new entropy-regularity route (K4). So the joint requirement-set is derived and the missing ' +
    'ingredients are named, but no construction is shipped and G6a_shock_lipschitz stays OPEN. Scoping / ' +
    'derivation only; no positivity, no bridge closure, no RH claim, NO QED. imp-3066 off-diagonal ' +
    'endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.',
  citation:
    'imp-3671 (parent: obstruction S1 type/dimension mismatch and S2 Gronwall-vacuous nearest-pair scale); ' +
    'imp-3693 (drills S1: per-gap field g_k = gamma_{k+1} - gamma_k is the minimal right-type object); ' +
    'imp-3708 (drills S2: vacuity INTRINSIC, escape is the named sub-gap y2-adapted-flow-depth s(y) ~ y^2); ' +
    'imp-3642 (direct RK4 attractive-Dyson flow; strip-sup V0); dyson-collision-lower-bound (imp-325; ' +
    'per-gap ODE dg_k over dt = 4/g_k - 2 g_k S_k); lambda-roadmap Step 4 (Polymath15 bridge, open sub-gap ' +
    'G6a_shock_lipschitz).',
};

export const IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS_ASSERTIONS = [
  {
    // The joint requirement-set is exactly the two imp-3671 obstructions, sourced to their drill-down tickets.
    id: 'imp3714-two-requirements-sourced',
    description: 'REQ-i (S1, imp-3693) and REQ-ii (S2, imp-3708) are the two joint requirements',
    holds: () =>
      REQUIREMENTS.length === 2 &&
      REQUIREMENTS[0].obstruction === 'S1' &&
      REQUIREMENTS[0].source === 'imp-3693' &&
      REQUIREMENTS[1].obstruction === 'S2' &&
      REQUIREMENTS[1].source === 'imp-3708',
  },
  {
    // The two requirements are COUPLED: clearing (i) forces evaluation at the (ii) vacuous scale.
    id: 'imp3714-requirements-coupled',
    description: 'REQ-i and REQ-ii are coupled through the g_k -> 0 collision scale, not independent knobs',
    holds: () =>
      IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.requirementsCoupled === true &&
      /FORCES evaluation/.test(IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.couplingReason),
  },
  {
    // Exactly three of four candidates satisfy BOTH; K3 is the one that fails REQ-ii.
    id: 'imp3714-three-candidates-satisfy-both',
    description: 'K1, K2, K4 satisfy both requirements; K3 (equal-time structure function) fails REQ-ii',
    holds: () =>
      CANDIDATES.length === 4 &&
      CANDIDATES_SATISFYING_BOTH.join(',') === 'K1,K2,K4' &&
      CANDIDATES.find((c) => c.id === 'K3').satisfiesReqI === true &&
      CANDIDATES.find((c) => c.id === 'K3').satisfiesReqII === false,
  },
  {
    // No admissible construction is fully present in the repo: each satisfying-both candidate needs a new ingredient.
    id: 'imp3714-no-candidate-fully-in-repo',
    description: 'every candidate satisfying both requirements needs at least one new ingredient',
    holds: () =>
      IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.anyCandidateFullyInRepo === false &&
      CANDIDATES.filter((c) => c.satisfiesBoth).every((c) => c.ingredients.new.length >= 1) &&
      /y2-adapted-flow-depth/.test(IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.minimalMissingObject),
  },
  {
    // Honesty gate: derivation/scoping only, no QED, no refereed bound is changed, imp-3066 untouched, G6a still open.
    id: 'imp3714-honesty-gate-no-qed',
    description: 'Derivation/scoping only: no QED, no refereed bound is changed, imp-3066 untouched, G6a open',
    holds: () =>
      IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.isRigorous === false &&
      IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.g6aStillOpen === true &&
      /NO QED/.test(IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.verdict) &&
      /refereed bound is changed/i.test(IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS.verdict),
  },
];

for (const a of IMP3714_G6A_MODULUS_OBJECT_REQUIREMENTS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3714-g6a-modulus-object-requirements assertion failed: ${a.id}`);
  }
}
