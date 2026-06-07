// @module imp-2502-esy-bs-route-floor-audit
// imp-2502 (improvement for ticket imp-370, high, proof): PERFORMS the comparison-
// route floor audit that imp-2501 named as the single open verification gating the
// strict upgrade of the imp-2500 breakthrough-floor ranking. imp-2501 recorded that
// the imp-2500 reference single-input floor of 1 was a STIPULATION about an idealized
// route, not an audited floor of the concrete Bui-Soundararajan density port
// (imp-1123), and that discharging the imp-2500 UNLESS escape clause requires
// auditing the BS route distance-to-closure to confirm it is a SINGLE required input
// (floor exactly 1, no hidden independent second research-grade breakthrough). This
// module does that audit by reading the documented BS obstruction set and deriving
// the floor, then records the consequence for the ranking.
//
// THE AUDIT (read from the imp-1123 documented obstruction set)
// ------------------------------------------------------------
// imp-1123 (the rigorous BS port) closed PARTIAL with FOUR named obstructions to full
// rigor, each tagged with a tractability tier in its own closureNote:
//   O-BS-A  implicit constant C_BS in BS 2008 is non-effective
//           -> research-grade, needs a Heath-Brown style explicit-constants follow-up
//   O-BS-B  (log T)^A factor with unspecified A blocks the integral
//           -> research-grade, SAME follow-up as O-BS-A
//   O-BS-C  BS valid only on sigma in [1/2, 1]; edge at sigma -> 1 needs separate work
//           -> partly engine-closable (via imp-1124)
//   O-BS-D  downstream imp-447 chain shape audit required
//           -> engine-closable
//
// COUNTING INDEPENDENT RESEARCH-GRADE BREAKTHROUGHS (the floor)
// ------------------------------------------------------------
// breakthroughCountFloor counts the minimum number of INDEPENDENT research-grade
// breakthroughs that must ALL land before the route can close rigorously. Apply it to
// the BS obstruction set:
//   (1) O-BS-C and O-BS-D are engine-closable, NOT research-grade breakthroughs, so
//       they contribute 0 to the floor.
//   (2) O-BS-A and O-BS-B are both research-grade, BUT the imp-1123 closureNote
//       characterizes them as COUPLED: O-BS-B is discharged by the SAME Heath-Brown
//       style explicit-constants follow-up that discharges O-BS-A (one effective-
//       constants programme makes C_BS explicit AND pins the (log T)^A exponent).
//       Coupled obstructions discharged by a single breakthrough count ONCE, not
//       twice. So the two research-grade obstructions collapse to ONE independent
//       required breakthrough.
// Therefore breakthroughCountFloorBS = 1: the BS density port is a genuine single-
// (research-grade-breakthrough) route, exactly as imp-2500 stipulated but had not
// verified.
//
// CONSEQUENCE FOR THE RANKING
// ---------------------------
// imp-2500 proved WEAK domination of imp-370 angle (b) (floor 2, a conjunction of two
// INDEPENDENT inputs across two orthogonal axes per imp-2499) over a single-input
// route (floor 1), strictly costlier UNLESS the single-input route itself hides a
// >= 2-independent-breakthrough input. The floor-1 audit verdict resolves that UNLESS
// clause FALSE for the BS route: it hides no second independent research-grade
// breakthrough (its only two research-grade obstructions are coupled). So against the
// concrete BS comparison route specifically, 2 > 1 holds as AUDITED (not stipulated)
// floors, and the imp-2500 WEAK domination UPGRADES to STRICT domination AGAINST THIS
// ROUTE. The imp-2501 residual sub-gap imp-2501-sub-comparison-route-floor-unaudited
// is thereby DISCHARGED.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'bs-route-floor-audited-equals-1-strict-domination-now-proven-against-the-bs-route'
//
// HONESTY: this does NOT close O1, O2, O3, or imp-370 angle (b). The strict claim is
// AGAINST THE BS ROUTE SPECIFICALLY -- it is NOT the unconditional overclaim that
// angle (b) is the single most expensive catalogued route (the other catalogued
// routes remain unaudited). And the floor-1 verdict INHERITS the imp-1123 coupling
// characterization (O-BS-A and O-BS-B share one follow-up); it does not independently
// re-derive that two obstructions reduce to one paper. If that characterization were
// wrong -- if making C_BS explicit and pinning the (log T)^A exponent turned out to
// need two separate research programmes -- the BS floor would be 2 and the two routes
// would be floor-incomparable again. That inherited dependency is named as a new,
// survey-grade residual sub-gap below; it is strictly weaker than the discharged one
// (it questions a documented coupling rather than asking for a fresh audit).
//
// SYNTAX SAFETY: no star-slash sequences in comments; single-quoted strings contain
// no apostrophes; subscripts written as k_{max} / C_BS in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-1123  -- Bui-Soundararajan rigorous port (source of the O-BS-A..D obstruction set)
// @see imp-2499  -- esy-both-axes-joint-availability.js (angle (b) is a 2-input conjunction)
// @see imp-2500  -- esy-angle-b-breakthrough-floor-ranking.js (the WEAK-domination ceiling)
// @see imp-2501  -- esy-weak-domination-strict-upgrade-gate.js (named this audit as the open gate)

import { IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING } from './imp-2500-esy-angle-b-breakthrough-floor-ranking.js';
import { IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE } from './imp-2501-esy-weak-domination-strict-upgrade-gate.js';

// =========================================================================
// SECTION (a) -- The imp-2501 gate, read directly (so this audit stays bound to the
// exact open verification it discharges).
// =========================================================================

const GATE = IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE;
const RANKING = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;

// imp-2501 recorded the BS-route floor audit as NOT performed and STRICT domination as
// NOT proven. This module is the audit; it consumes that open state and resolves it.
const auditWasOpenAtImp2501 =
  GATE.comparisonRouteFloorAudited === false &&
  GATE.strictDominationProven === false &&
  GATE.residualSubGap.id === 'imp-2501-sub-comparison-route-floor-unaudited';

// =========================================================================
// SECTION (b) -- The BS obstruction set, read from the imp-1123 documented
// characterization, with each obstruction tagged research-grade vs engine-closable
// and its coupling partner (if any).
// =========================================================================

const BS_OBSTRUCTIONS = Object.freeze([
  Object.freeze({
    id: 'O-BS-A',
    statement: 'implicit constant C_BS in Bui-Sound 2008 is non-effective',
    tier: 'research-grade',
    dischargedBy: 'heath-brown-style-explicit-constants-follow-up',
  }),
  Object.freeze({
    id: 'O-BS-B',
    statement: 'the (log T)^A factor with unspecified A blocks the integral',
    tier: 'research-grade',
    // Documented by imp-1123 as the SAME follow-up that discharges O-BS-A.
    dischargedBy: 'heath-brown-style-explicit-constants-follow-up',
    coupledWith: 'O-BS-A',
  }),
  Object.freeze({
    id: 'O-BS-C',
    statement: 'BS valid only on sigma in [1/2, 1]; the sigma -> 1 edge needs separate analysis',
    tier: 'engine-closable',
    dischargedBy: 'imp-1124-edge-sigma-handling',
  }),
  Object.freeze({
    id: 'O-BS-D',
    statement: 'downstream imp-447 chain shape audit required',
    tier: 'engine-closable',
    dischargedBy: 'engine-closable-chain-audit',
  }),
]);

// =========================================================================
// SECTION (c) -- Derive the floor: count INDEPENDENT research-grade breakthroughs.
// =========================================================================

// Research-grade obstructions only (engine-closable ones are not breakthroughs).
const researchGradeObstructions = BS_OBSTRUCTIONS.filter((o) => o.tier === 'research-grade');

// Collapse coupled obstructions: group research-grade obstructions by the breakthrough
// that discharges them; each distinct dischargedBy programme is ONE independent
// research-grade breakthrough.
const distinctResearchGradeBreakthroughs = new Set(
  researchGradeObstructions.map((o) => o.dischargedBy),
);

// The audited floor of the BS route.
const breakthroughCountFloorBS = distinctResearchGradeBreakthroughs.size; // = 1

// The two research-grade obstructions are coupled (same follow-up) iff collapsing them
// yields strictly fewer breakthroughs than obstructions.
const researchGradeObstructionsAreCoupled =
  researchGradeObstructions.length === 2 && breakthroughCountFloorBS === 1;

// =========================================================================
// SECTION (d) -- Resolve the imp-2500 UNLESS clause and the imp-2501 gate.
// =========================================================================

// imp-2500 strict upgrade against route R holds iff R has floor exactly 1 (no hidden
// >= 2-independent-breakthrough input). The audit confirms floor 1 for the BS route.
const bsRouteHidesSecondIndependentBreakthrough = breakthroughCountFloorBS >= 2; // false
const imp2500UnlessClauseResolvesFalseForBS = bsRouteHidesSecondIndependentBreakthrough === false;

// With the WEAK premise from imp-2500 and the audited floor 1, STRICT domination of
// angle (b) (floor 2) over the BS route (floor 1) is now PROVEN against this route.
const angleBFloor = RANKING.angleB.breakthroughCountFloor; // 2 (DERIVED from imp-2499)
const weakDominationPremise = GATE.weakDominationProven === true;
const strictDominationProvenAgainstBsRoute =
  weakDominationPremise &&
  imp2500UnlessClauseResolvesFalseForBS &&
  angleBFloor > breakthroughCountFloorBS;

// The imp-2501 open verification is discharged by this audit.
const dischargesImp2501SubGap =
  auditWasOpenAtImp2501 && strictDominationProvenAgainstBsRoute;

// =========================================================================
// SECTION (e) -- The new (strictly weaker) residual sub-gap: the floor-1 verdict
// inherits the imp-1123 coupling characterization rather than re-deriving it.
// =========================================================================

const RESIDUAL_SUB_GAP = Object.freeze({
  id: 'imp-2502-sub-bs-coupling-inherited-from-imp1123',
  statement:
    'The BS-route floor of 1 rests on the imp-1123 documented characterization that ' +
    'O-BS-A (effective C_BS) and O-BS-B (the (log T)^A exponent) are discharged by a ' +
    'single Heath-Brown style explicit-constants follow-up. This module consumes that ' +
    'coupling rather than independently proving that one paper suffices for both. If a ' +
    'closer reading showed the two need two separate research programmes, the BS floor ' +
    'would rise to 2 and strict domination over the BS route would collapse back to ' +
    'floor-incomparable.',
  isResidual: true,
  closesAngleB: false,
  // Strictly weaker than the discharged imp-2501 gap: it questions a documented
  // coupling, it does not ask for a fresh audit that does not exist.
  difficulty: 'inherited-characterization (survey-grade, strictly weaker than the discharged imp-2501 audit)',
  weakerThanDischarged: 'imp-2501-sub-comparison-route-floor-unaudited',
});

const VERDICT =
  'bs-route-floor-audited-equals-1-strict-domination-now-proven-against-the-bs-route';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2502_ESY_BS_ROUTE_FLOOR_AUDIT = Object.freeze({
  id: 'imp-2502',
  ticket: 'imp-370',
  bounds: 'imp-2501 (weak-domination strict-upgrade gate) -- performs its named open audit',
  layer: 'comparison-route floor audit (discharges the single verification imp-2501 left open)',
  question:
    'imp-2501 named one open verification: audit the Bui-Soundararajan density port ' +
    '(imp-1123) distance-to-closure and confirm its breakthroughCountFloor is exactly ' +
    '1, to discharge the imp-2500 UNLESS clause and upgrade WEAK to STRICT domination ' +
    'against that route. What is the BS-route floor, and does it discharge the clause?',
  auditWasOpenAtImp2501,
  bsObstructions: BS_OBSTRUCTIONS,
  researchGradeObstructionIds: Object.freeze(researchGradeObstructions.map((o) => o.id)),
  distinctResearchGradeBreakthroughs: Object.freeze([...distinctResearchGradeBreakthroughs]),
  researchGradeObstructionsAreCoupled,
  breakthroughCountFloorBS,
  angleBFloor,
  bsRouteHidesSecondIndependentBreakthrough,
  imp2500UnlessClauseResolvesFalseForBS,
  strictDominationProvenAgainstBsRoute,
  dischargesImp2501SubGap,
  residualSubGap: RESIDUAL_SUB_GAP,
  verdict: VERDICT,
  closesTicket: false,
  finding:
    'The BS density port (imp-1123) closed PARTIAL with four named obstructions. Two ' +
    'are engine-closable (O-BS-C edge handling via imp-1124, O-BS-D chain shape audit) ' +
    'and contribute nothing to the breakthrough-count floor. The other two are ' +
    'research-grade BUT coupled: imp-1123 documents O-BS-B as discharged by the SAME ' +
    'Heath-Brown style explicit-constants follow-up as O-BS-A, so they collapse to ONE ' +
    'independent research-grade breakthrough. Hence breakthroughCountFloorBS = 1: the ' +
    'BS route is a genuine single-breakthrough route, as imp-2500 stipulated but had ' +
    'not verified. This resolves the imp-2500 UNLESS clause FALSE for the BS route and ' +
    'upgrades the imp-2500 WEAK domination of angle (b) (floor 2) to STRICT domination ' +
    'AGAINST THE BS ROUTE, discharging the imp-2501 residual sub-gap.',
  dischargesImp2501Gate:
    'imp-2501 recorded comparisonRouteFloorAudited === false and strictDominationProven ' +
    '=== false, gating the strict upgrade on this exact audit. This module performs it ' +
    'and finds floor 1, so strictDominationProvenAgainstBsRoute === true. imp-2501 stays ' +
    'a faithful record of the state BEFORE the audit; imp-2502 records the state after.',
  honestScope: Object.freeze([
    'This audit does NOT close O1, O2, O3, or imp-370 angle (b). It only resolves the ' +
    'ranking-layer comparison between angle (b) and the BS route, and the ticket stays ' +
    'research-grade open on both orthogonal axes.',
    'The STRICT domination claim is AGAINST THE BS ROUTE SPECIFICALLY. It is NOT the ' +
    'unconditional overclaim that angle (b) is the single most expensive catalogued ' +
    'route; every other catalogued route remains unaudited and could itself hide a ' +
    '>= 2-independent-breakthrough input, leaving it floor-incomparable with angle (b).',
    'The floor-1 verdict INHERITS the imp-1123 coupling characterization (O-BS-A and ' +
    'O-BS-B share one follow-up); it does not independently re-derive that one paper ' +
    'discharges both. That inherited dependency is the new residual sub-gap, which is ' +
    'strictly weaker than the imp-2501 audit it discharges.',
    'breakthroughCountFloor remains a LOWER-BOUND proxy on research-grade breakthrough ' +
    'count, not total difficulty (carried from imp-2500). A floor-1 route could still ' +
    'individually be harder in wall-clock than a floor-2 route; strict domination here ' +
    'is strictly about the count of independent required breakthroughs.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-1123', 'imp-2499', 'imp-2500', 'imp-2501']),
});

export default IMP2502_ESY_BS_ROUTE_FLOOR_AUDIT;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2502_ESY_BS_ROUTE_FLOOR_AUDIT_ASSERTIONS = [
  {
    id: 'imp2502-bs-floor-derived-from-coupled-obstruction-set',
    holds: () => {
      const r = IMP2502_ESY_BS_ROUTE_FLOOR_AUDIT;
      // The floor must be DERIVED by collapsing coupled research-grade obstructions,
      // not hand-set: exactly two research-grade obstructions, coupled into one
      // distinct breakthrough, giving floor 1.
      return (
        r.researchGradeObstructionIds.length === 2 &&
        r.researchGradeObstructionsAreCoupled === true &&
        r.distinctResearchGradeBreakthroughs.length === 1 &&
        r.breakthroughCountFloorBS === 1
      );
    },
    why:
      'The whole audit turns on the BS floor being exactly 1, derived from the two ' +
      'research-grade obstructions O-BS-A / O-BS-B collapsing to a single follow-up ' +
      'paper. If a future edit added an independent research-grade obstruction or ' +
      'broke the coupling, the floor would rise to 2 and strict domination would no ' +
      'longer follow; pinning the derivation makes that visible.',
  },
  {
    id: 'imp2502-discharges-imp2501-open-audit',
    holds: () => {
      const r = IMP2502_ESY_BS_ROUTE_FLOOR_AUDIT;
      const g = IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE;
      // This module must discharge the exact verification imp-2501 left open, reading
      // the open state live from imp-2501 (so it cannot drift from the gate).
      return (
        g.comparisonRouteFloorAudited === false &&
        g.strictDominationProven === false &&
        r.auditWasOpenAtImp2501 === true &&
        r.dischargesImp2501SubGap === true &&
        r.residualSubGap.weakerThanDischarged === g.residualSubGap.id
      );
    },
    why:
      'imp-2502 only makes sense as the discharge of the imp-2501 open audit. Reading ' +
      'the open state live from imp-2501 (still false there) and asserting the new ' +
      'residual is the weaker successor of the discharged one keeps the two records ' +
      'consistent: imp-2501 is the before-state, imp-2502 the after-state.',
  },
  {
    id: 'imp2502-strict-domination-against-bs-route-only',
    holds: () => {
      const r = IMP2502_ESY_BS_ROUTE_FLOOR_AUDIT;
      const k = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;
      // Strict domination is proven AGAINST THE BS ROUTE (floor 2 > floor 1, UNLESS
      // clause resolved false) and the angle (b) floor is still the imp-2500 value 2.
      return (
        r.strictDominationProvenAgainstBsRoute === true &&
        r.imp2500UnlessClauseResolvesFalseForBS === true &&
        r.bsRouteHidesSecondIndependentBreakthrough === false &&
        r.angleBFloor === 2 &&
        k.angleB.breakthroughCountFloor === 2 &&
        r.angleBFloor > r.breakthroughCountFloorBS
      );
    },
    why:
      'The ranking advance is exactly STRICT domination against the BS route, resting ' +
      'on angle (b) floor 2 (read from imp-2500) strictly exceeding the audited BS ' +
      'floor 1 with the UNLESS clause resolved false. If the angle (b) floor were ' +
      'weakened upstream or the UNLESS resolution flipped, the strict claim must fall ' +
      'with it.',
  },
  {
    id: 'imp2502-does-not-close-ticket-or-overclaim-global-maximum',
    holds: () => {
      const r = IMP2502_ESY_BS_ROUTE_FLOOR_AUDIT;
      // Honesty pin: still not a closure of the ticket, and the strict claim is scoped
      // to the BS route -- NOT a global most-expensive-route overclaim. A new, weaker
      // residual sub-gap (the inherited coupling) must remain named and open.
      return (
        r.closesTicket === false &&
        IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING.closesTicket === false &&
        IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE.closesTicket === false &&
        r.residualSubGap.isResidual === true &&
        r.residualSubGap.closesAngleB === false &&
        r.residualSubGap.id === 'imp-2502-sub-bs-coupling-inherited-from-imp1123'
      );
    },
    why:
      'The audit upgrades a ranking comparison; it does not close imp-370 and does not ' +
      'prove angle (b) is the globally most expensive route. Pinning closesTicket ' +
      'false on all three records and keeping the inherited-coupling residual named ' +
      'prevents a future reader from reading the strict-domination result as either a ' +
      'ticket closure or an unconditional global-maximum claim.',
  },
];
