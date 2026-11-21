/**
 * @module imp-36045-perN-translation-route-readiness-assessment
 * @fileoverview imp-36045 -- Assess which of the THREE roadmap Step-5
 *   G5-perN-translation candidate routes is CLOSEST to yielding a usable per-N
 *   rate r(N) on |t_c(N)| that the Step-4 E(N) bridge constants can consume,
 *   starting from the Step-3 UNCONDITIONAL lim sup_{N->infty} |t_c(N)| <= 0
 *   (imp-341 + imp-344 Koksma-Hlawka, no GUE). Assessment / scoping ONLY:
 *   closes NOTHING, discharges no gap, respects the imp-2519 no-overclaim guard.
 *
 *   THE OBLIGATION (roadmap lambda-roadmap.js Step 5, key G5-perN-translation)
 *   -------------------------------------------------------------------------
 *   The Step-3 lim-sup is UNCONDITIONAL but ASYMPTOTIC. Per imp-2564 the per-N
 *   translation controls the Step-4 BRIDGE CONSTANTS E(N), not the headline
 *   Lambda <= E(N) inequality. To be usable, the bridge needs a genuine per-N
 *   bound r(N) with |t_c(N)| <= r(N) for each finite N -- and, to keep the
 *   assembled Step-5 statement UNCONDITIONAL, r(N) must not smuggle in a
 *   GUE / local-law / Erdos-Schlein-Yau hypothesis. Three candidate routes are
 *   recorded, ALL OPEN.
 *
 *   ROUTE A -- imp-336 monotonicity (M)  [status: conditional-on-gue-universality]
 *   ------------------------------------------------------------------------------
 *   If |t_c(N+1)| <= |t_c(N)| eventually, then lim sup = inf_N |t_c(N)|, so
 *   a <= |t_c(N_max)| for every recorded N_max -- a genuine per-N FORM. imp-456
 *   proved UMon in unfolded coordinates, imp-462 bridged raw <==> unfolded via a
 *   positive RvM Jacobian, G1/G2 closed by imp-450. BUT the sole residual is the
 *   many-body Calogero-Moser correction C_mb, which imp-486 proved IRREDUCIBLE:
 *   no unconditional C_mb bound exists; it requires GUE universality. So Route A
 *   yields the right per-N SHAPE but is disqualified for UNCONDITIONAL bridge
 *   consumption -- it is permanently GUE-conditional.
 *
 *   ROUTE B -- imp-341 Burgers uniformity (PRIMARY)  [status: rigorous lim-sup]
 *   --------------------------------------------------------------------------
 *   Route B is the SOURCE of the unconditional lim-sup itself (Koksma-Hlawka on
 *   the empirical Stieltjes transform, only Selberg |S(T)| input). imp-348
 *   tightened the ABSOLUTE rate at the MICROSCOPIC scale. But a microscopic-scale
 *   absolute tightening is NOT a translatable per-N r(N): the lim-sup is by
 *   construction asymptotic, and the O(1/N) per-N upgrade named for Route B
 *   requires LOCAL-LAW RIGIDITY -- which reintroduces exactly the GUE/ESY
 *   dependence the lim-sup was engineered to avoid. Route B thus supplies the
 *   unconditional starting point but is the FARTHEST from a usable per-N rate.
 *
 *   ROUTE C -- imp-337 / imp-342 / imp-343 density squeeze  [status: numerical]
 *   --------------------------------------------------------------------------
 *   The density squeeze bypasses the lim-sup ENTIRELY: if S_{k star}(t) >= c(N)/B(t)^2
 *   with c(N) > 2 from the Weyl density and the argmin site k*(t) is backward-flow
 *   stable, the boundary identity gives dg_{k*}/dt < 0 strictly and INTEGRATES to
 *   a per-N upper bound on |t_c(N)| directly -- neither monotonicity (M) nor a
 *   lim-sup is needed. Two of three sub-gaps are CLOSED UNCONDITIONALLY from pure
 *   Weyl input: G4_argmin_drift (imp-343, drift length 0) and G3b_weyl_tail
 *   (imp-342, c_tail ~ 1.290 < 2 from Riemann-von Mangoldt leading density). The
 *   SOLE open sub-gap is G3a_max_gap: extremal max-gap statistics at the argmin
 *   site, beyond pure Weyl-law input -- but NOT proven irreducible (unlike C_mb).
 *
 *   VERDICT (assessment, NO QED)
 *   ----------------------------
 *   ROUTE C is CLOSEST to a usable UNCONDITIONAL per-N rate. Reasons: (1) it
 *   produces a per-N bound BY CONSTRUCTION (integrating the strict drift), with no
 *   asymptotic lim-sup detour; (2) two of its three sub-gaps are already closed
 *   unconditionally from pure Weyl density; (3) its single residual G3a_max_gap is
 *   a concrete extremal-statistics target that is NOT proven irreducible. Route A
 *   supplies the correct per-N SHAPE but is permanently GUE-conditional (C_mb
 *   irreducible, imp-486), so it can never feed an UNCONDITIONAL bridge. Route B
 *   is the unconditional lim-sup source but delivers only a microscopic ABSOLUTE
 *   rate; its per-N upgrade needs local-law rigidity that re-imports GUE. Between
 *   the two also-rans B EDGES OUT A: B already satisfies the non-negotiable
 *   UNCONDITIONAL requirement (its gap is the missing per-N form, not proven
 *   impossible), whereas A is a PROVEN dead-end for unconditionality (C_mb
 *   irreducible, imp-486). Ranking by readiness-to-usable-unconditional-per-N:
 *   C > B > A. This closes NOTHING;
 *   G3a_max_gap (Route C) stays the nearest named residual. C_mb stays GUE-
 *   conditional (imp-486). No refereed bound is changed.
 *
 *   @see src/data/lambda-roadmap.js (Step 3 need field; Step 5 G5-perN-translation obligation; VERIFICATION_EFFORTS routes A/B/C)
 *
 *   Ticket: imp-36045 (proof, medium).
 */

const ROADMAP_REF = 'src/data/lambda-roadmap.js';

/**
 * Structural readiness axes for a usable UNCONDITIONAL per-N rate r(N). Each axis
 * is scored 0 (absent) / 1 (partial) / 2 (present), baked from the roadmap record.
 *   - perNForm:        route delivers a per-N (not merely asymptotic) statement
 *   - unconditional:   the delivered per-N ingredient carries no GUE / local-law hypothesis
 *   - gapsClosed:      fraction of the route sub-gaps already discharged (scaled to 0..2)
 *   - residualTractable: the single open residual is a concrete target, NOT proven irreducible
 */
const ROUTES = Object.freeze([
  Object.freeze({
    key: 'A',
    id: 'route-A-monotonicity',
    label: 'imp-336 monotonicity (M)',
    roadmapStatus: 'conditional-on-gue-universality',
    delivers: 'a <= |t_c(N_max)| for every recorded N_max (per-N FORM via inf_N = lim sup under M)',
    openResidual: 'C_mb many-body Calogero-Moser correction (imp-486: IRREDUCIBLE, needs GUE universality)',
    scores: Object.freeze({ perNForm: 2, unconditional: 0, gapsClosed: 2, residualTractable: 0 }),
    // per-N shape is present, but the C_mb residual is a permanent GUE conditional,
    // so the route cannot feed an UNCONDITIONAL bridge no matter how much bookkeeping.
    disqualifierForUnconditional: 'C_mb irreducibly GUE-conditional (imp-486)',
  }),
  Object.freeze({
    key: 'B',
    id: 'route-B-burgers',
    label: 'imp-341 Burgers uniformity (PRIMARY)',
    roadmapStatus: 'rigorous (lim-sup); per-N translation OPEN',
    delivers: 'the UNCONDITIONAL lim sup |t_c(N)| <= 0 itself (Koksma-Hlawka) + imp-348 microscopic ABSOLUTE rate',
    openResidual: 'per-N O(1/N) upgrade requires LOCAL-LAW RIGIDITY (re-imports GUE/ESY the lim-sup avoided)',
    scores: Object.freeze({ perNForm: 0, unconditional: 2, gapsClosed: 0, residualTractable: 1 }),
    // supplies the unconditional starting point but only an asymptotic statement;
    // the per-N rate is entirely open and its named upgrade route is GUE-flavored.
    disqualifierForUnconditional: 'no per-N rate yet; O(1/N) upgrade needs local-law rigidity',
  }),
  Object.freeze({
    key: 'C',
    id: 'route-C-density',
    label: 'imp-337 / imp-342 / imp-343 density squeeze',
    roadmapStatus: 'numerical; 2 of 3 sub-gaps CLOSED unconditionally',
    delivers: 'per-N upper bound on |t_c(N)| BY CONSTRUCTION (integrate strict drift dg_{k*}/dt < 0, no lim-sup)',
    openResidual: 'G3a_max_gap: extremal max-gap statistics at the argmin site (beyond Weyl; NOT proven irreducible)',
    scores: Object.freeze({ perNForm: 2, unconditional: 2, gapsClosed: 1, residualTractable: 2 }),
    // the only route that produces per-N without a lim-sup detour AND keeps the two
    // closed sub-gaps unconditional (pure Weyl density); single tractable residual.
    disqualifierForUnconditional: null,
  }),
]);

// Weighted readiness score. unconditional is weighted highest because the Step-5
// obligation demands the per-N rate be consumable WITHOUT a GUE hypothesis; a
// route that is not unconditional cannot feed an unconditional bridge at all.
const WEIGHTS = Object.freeze({ perNForm: 3, unconditional: 4, gapsClosed: 2, residualTractable: 3 });

function readinessScore(route) {
  const s = route.scores;
  return (
    WEIGHTS.perNForm * s.perNForm +
    WEIGHTS.unconditional * s.unconditional +
    WEIGHTS.gapsClosed * s.gapsClosed +
    WEIGHTS.residualTractable * s.residualTractable
  );
}

const SCORED = ROUTES.map((r) => Object.freeze({ key: r.key, id: r.id, score: readinessScore(r) }));
const RANKED = [...SCORED].sort((a, b) => b.score - a.score);
const WINNER = RANKED[0];

// Route C must strictly win; Route A (per-N shape but GUE-conditional) second;
// Route B (unconditional but asymptotic-only) last.
const CLOSEST_KEY = WINNER.key;
const RANK_ORDER = RANKED.map((r) => r.key).join(' > ');

export const IMP36045_PERN_TRANSLATION_ROUTE_READINESS_ASSESSMENT = Object.freeze({
  id: 'imp-36045-perN-translation-route-readiness-assessment',
  ticket: 'imp-36045',
  roadmapSourcePath: ROADMAP_REF,
  obligationKey: 'G5-perN-translation',
  feedsInto: 'Step-4 E(N) bridge constants (NOT the headline inequality) per imp-2564',

  summary:
    'Assesses which of the three roadmap G5-perN-translation candidate routes is CLOSEST to a usable per-N rate ' +
    'r(N) on |t_c(N)| that the Step-4 E(N) bridge can consume, starting from the Step-3 UNCONDITIONAL lim-sup ' +
    '(imp-341/imp-344, no GUE). VERDICT: ROUTE C (imp-337/342/343 density squeeze) is closest. It produces a ' +
    'per-N bound BY CONSTRUCTION (integrating the strict drift dg_{k*}/dt < 0, bypassing the lim-sup entirely), ' +
    'has two of three sub-gaps already closed unconditionally from pure Weyl density (G4_argmin_drift imp-343, ' +
    'G3b_weyl_tail imp-342 c_tail ~ 1.290 < 2), and its sole residual G3a_max_gap (extremal max-gap statistics at ' +
    'the argmin site) is a concrete target NOT proven irreducible. Route A (imp-336 monotonicity) gives the right ' +
    'per-N SHAPE (a <= |t_c(N_max)|) but is permanently GUE-conditional -- its residual C_mb is IRREDUCIBLE ' +
    '(imp-486) -- so it can never feed an UNCONDITIONAL bridge. Route B (imp-341 Burgers) is the unconditional ' +
    'lim-sup SOURCE but delivers only a microscopic ABSOLUTE rate (imp-348); its per-N O(1/N) upgrade needs ' +
    'local-law rigidity that re-imports GUE. Readiness ranking C > B > A. Assessment/scoping ONLY; closes ' +
    'NOTHING; discharges no gap; G3a_max_gap stays the nearest named residual; C_mb stays GUE-conditional ' +
    '(imp-486); respects the imp-2519 no-overclaim guard; NO QED; no refereed bound is changed.',

  axes: Object.freeze({
    perNForm: 'Route delivers a per-N (not merely asymptotic) statement on |t_c(N)|',
    unconditional: 'The delivered per-N ingredient carries no GUE / local-law / Erdos-Schlein-Yau hypothesis',
    gapsClosed: 'Fraction of the route sub-gaps already discharged',
    residualTractable: 'The single open residual is a concrete target, NOT proven irreducible',
    weights: WEIGHTS,
    weightRationale:
      'unconditional is weighted highest: the Step-5 obligation requires the per-N rate be consumable WITHOUT ' +
      'a GUE hypothesis, so a route that is not unconditional cannot feed an unconditional bridge at all.',
  }),

  routes: ROUTES,
  scored: Object.freeze(SCORED.map((r) => Object.freeze({ ...r }))),
  ranking: Object.freeze({
    order: RANK_ORDER,
    closestKey: CLOSEST_KEY,
    closestId: WINNER.id,
    nearestResidual: 'G3a_max_gap (Route C) -- extremal max-gap statistics at the argmin site',
  }),

  interpretation: Object.freeze({
    whyC:
      'Route C is the ONLY candidate that produces a per-N bound by construction (integrate dg_{k*}/dt < 0), so ' +
      'it never routes through an asymptotic lim-sup; and its two closed sub-gaps are unconditional (pure Weyl ' +
      'density). Its single residual G3a_max_gap is a definite extremal-statistics target not proven irreducible.',
    whyNotA:
      'Route A yields the correct per-N SHAPE a <= |t_c(N_max)| under monotonicity, but its residual is the ' +
      'many-body C_mb correction, proven IRREDUCIBLE (imp-486): it requires GUE universality, so Route A can ' +
      'never feed an UNCONDITIONAL bridge regardless of further bookkeeping.',
    whyNotB:
      'Route B is the SOURCE of the unconditional lim-sup, but a lim-sup is asymptotic; imp-348 gives only a ' +
      'microscopic ABSOLUTE rate, not a translatable per-N r(N). Its named per-N upgrade (O(1/N)) requires ' +
      'local-law rigidity, which re-imports the GUE/ESY dependence the lim-sup was engineered to avoid.',
    consumptionCaveat:
      'Per imp-2564 any translated r(N) feeds the Step-4 E(N) BRIDGE CONSTANTS, not the headline Lambda <= E(N) ' +
      'inequality; even a closed Route C leaves the Step-4 G6a_shock_lipschitz sub-gap and the Step-5 assembly open.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    closesAnyGap: false,
    dischargesG5PerNTranslation: false,
    identifiesClosestRoute: true,
    routeCClosesG3aMaxGap: false,
    routeAStaysGueConditional: true,
    routeBStaysAsymptotic: true,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Assessment of which of the three G5-perN-translation routes is closest to a usable UNCONDITIONAL per-N ' +
      'rate r(N). Verdict: Route C (density squeeze), residual G3a_max_gap. Closes nothing; discharges no gap; ' +
      'C_mb stays GUE-conditional (imp-486); respects the imp-2519 no-overclaim guard.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP36045_PERN_TRANSLATION_ROUTE_READINESS_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp36045-three-routes-present',
    why: 'The G5-perN-translation obligation lists exactly three candidate routes (A imp-336, B imp-341, C ' +
         'imp-337/342/343); the assessment must score all three.',
    holds: () => ROUTES.length === 3 && ROUTES.map((r) => r.key).join('') === 'ABC',
  },
  {
    id: 'imp36045-route-C-is-closest',
    why: 'VERDICT: Route C (density squeeze) must strictly win the readiness score -- it is the only route that ' +
         'produces per-N by construction AND keeps its closed sub-gaps unconditional. A tie or a different ' +
         'winner would contradict the assessment.',
    holds: () => CLOSEST_KEY === 'C' && WINNER.score > RANKED[1].score,
  },
  {
    id: 'imp36045-ranking-C-over-B-over-A',
    why: 'Readiness ranking must be C > B > A: Route C (per-N AND unconditional) wins; Route B (already ' +
         'unconditional, gap = missing per-N form) edges out Route A (per-N shape but a PROVEN dead-end for ' +
         'unconditionality via the irreducible C_mb, imp-486).',
    holds: () => RANK_ORDER === 'C > B > A',
  },
  {
    id: 'imp36045-routeA-gue-conditional-not-unconditional',
    why: 'Route A scores 0 on the unconditional axis: its residual C_mb is irreducibly GUE-conditional ' +
         '(imp-486), so it can never feed an unconditional bridge even though its per-N form score is 2.',
    holds: () => {
      const a = ROUTES.find((r) => r.key === 'A');
      return a.scores.unconditional === 0 && a.scores.perNForm === 2 && a.disqualifierForUnconditional !== null;
    },
  },
  {
    id: 'imp36045-routeB-no-perN-form',
    why: 'Route B scores 0 on the perNForm axis: it supplies the unconditional lim-sup itself plus a microscopic ' +
         'absolute rate, but no translatable per-N r(N).',
    holds: () => {
      const b = ROUTES.find((r) => r.key === 'B');
      return b.scores.perNForm === 0 && b.scores.unconditional === 2;
    },
  },
  {
    id: 'imp36045-routeC-tractable-residual',
    why: 'Route C is the only route with residualTractable = 2: its sole open sub-gap G3a_max_gap is a concrete ' +
         'extremal-statistics target NOT proven irreducible, unlike Route A C_mb.',
    holds: () => {
      const c = ROUTES.find((r) => r.key === 'C');
      return c.scores.residualTractable === 2 && c.scores.unconditional === 2 && c.disqualifierForUnconditional === null;
    },
  },
  {
    id: 'imp36045-honest-no-closure-no-qed',
    why: 'Mandatory honesty: an ASSESSMENT that closes NOTHING, discharges no gap, does not close G3a_max_gap, ' +
         'keeps C_mb GUE-conditional, carries NO RH verdict, no refereed bound is changed. If any flip the module over-claims.',
    holds: () => {
      const h = IMP36045_PERN_TRANSLATION_ROUTE_READINESS_ASSESSMENT.honestCaveat;
      return (
        h.isProof === false &&
        h.closesAnyGap === false &&
        h.dischargesG5PerNTranslation === false &&
        h.identifiesClosestRoute === true &&
        h.routeCClosesG3aMaxGap === false &&
        h.routeAStaysGueConditional === true &&
        h.isReductionBelowRH === false &&
        h.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(h.sota)
      );
    },
  },
];

for (const assertion of IMP36045_PERN_TRANSLATION_ROUTE_READINESS_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36045-perN-translation-route-readiness-assessment assertion failed: ${assertion.id}`);
  }
}

export default IMP36045_PERN_TRANSLATION_ROUTE_READINESS_ASSESSMENT;
