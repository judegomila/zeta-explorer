// @module imp-2501-esy-weak-domination-strict-upgrade-gate
// imp-2501 (improvement for ticket imp-370, high, proof): pins the EXACT boundary
// of the imp-2500 breakthrough-floor ranking. imp-2500 proved WEAK domination of
// angle (b) over a single-input route under the breakthrough-count-floor proxy:
// angle (b) (floor 2) is NOT-CHEAPER-THAN any single-input route (floor 1), and is
// strictly costlier UNLESS that single-input route itself hides a >= 2-independent-
// breakthrough input. imp-2500 was explicit that this is the honest ceiling and did
// NOT claim STRICT (unconditional) domination, precisely because of that UNLESS
// escape clause. This module names what it would take to discharge the escape clause
// for the canonical catalogued comparison route, and records that the needed step
// has NOT been performed -- so the current ceiling stays WEAK domination, with the
// strict upgrade GATED on a precisely-named, currently-open verification.
//
// THE ESCAPE CLAUSE imp-2500 LEFT OPEN
// ------------------------------------
// imp-2500.strictlyCostlierUnlessSingleInputHidesTwoBreakthroughs === true encodes:
// the weak-to-strict upgrade against a specific single-input route R holds IFF R has
// breakthroughCountFloor exactly 1 (no hidden conjunction). imp-2500 set the
// reference singleInputRoute.breakthroughCountFloor = 1 BY DEFINITION (it named the
// row a single-input route), NOT by auditing the distance-to-closure of an actual
// catalogued route. So the "1" is a STIPULATION about an idealized single-input
// route, not a VERIFIED floor of the concrete Bui-Soundararajan density port
// (imp-1123) that imp-2499 / imp-2500 cite as the canonical comparison target.
//
// WHAT WOULD DISCHARGE IT
// -----------------------
// To upgrade weak -> strict domination AGAINST the BS density port specifically,
// one must AUDIT the BS route the way imp-2497 / imp-2498 audited the two angle (b)
// inputs: decompose its distance-to-closure and confirm it is a SINGLE required
// input (floor exactly 1, no hidden independent second breakthrough). That audit
// does not exist in the project today. Without it, the BS route could -- for all we
// have verified -- itself be a >= 2-input conjunction, which would land it inside
// the imp-2500 UNLESS clause and leave the two routes floor-incomparable rather than
// angle (b) strictly dominated.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'weak-domination-is-the-current-ceiling-strict-upgrade-gated-on-unperformed-comparison-route-floor-audit'
//
// The imp-2500 weak domination stands. The strict (unconditional) upgrade against
// the named BS comparison route is GATED on a comparison-route floor audit that has
// NOT been performed; until it is, claiming STRICT domination would overclaim past
// the imp-2500 honest ceiling. Residual sub-gap named below.
//
// HONESTY: this does NOT close O1, O2, O3, or imp-370 angle (b), and it does NOT
// upgrade the ranking. It sharpens the imp-2500 boundary by naming the single
// verification that separates the proven WEAK domination from the unproven STRICT
// domination, and records that verification as OPEN. Net effect: the ranking layer
// is now honest about exactly why it stops at weak domination.
//
// SYNTAX SAFETY: no star-slash sequences in comments; single-quoted strings contain
// no apostrophes; subscripts written as k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-2499  -- esy-both-axes-joint-availability.js (the conjunction premise)
// @see imp-2500  -- esy-angle-b-breakthrough-floor-ranking.js (the weak-domination ceiling)
// @see imp-1123  -- Bui-Soundararajan density port (the canonical single-input comparison route)

import { IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING } from './imp-2500-esy-angle-b-breakthrough-floor-ranking.js';

// =========================================================================
// SECTION (a) -- The imp-2500 ceiling, read directly (so this gate cannot drift
// away from the ranking it bounds).
// =========================================================================

const RANKING = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;

// The proven ceiling: WEAK domination (not-cheaper-than), with the strict upgrade
// left conditional on the UNLESS clause.
const weakDominationProven =
  RANKING.strictlyDominatesSingleInput === true &&
  RANKING.angleBNotCheaperThanSingleInput === true;

// imp-2500 explicitly did NOT claim unconditional strict total-cost domination.
const imp2500DidNotClaimStrict = RANKING.proxy.isLowerBoundOnly === true;

// =========================================================================
// SECTION (b) -- The gate: the strict upgrade requires a comparison-route floor
// audit that has NOT been performed.
// =========================================================================

// imp-2500 set the comparison route floor = 1 BY STIPULATION (it called the row a
// single-input route), not by auditing a concrete catalogued route. So the "1" is a
// definitional value, not an audited one.
const comparisonRouteFloorIsStipulatedNotAudited =
  RANKING.singleInputRoute.breakthroughCountFloor === 1 &&
  RANKING.singleInputRoute.isConjunctionOfIndependentInputs === false;

// The concrete catalogued comparison target whose floor would have to be AUDITED to
// discharge the imp-2500 UNLESS clause.
const COMPARISON_ROUTE = Object.freeze({
  ticket: 'imp-1123',
  name: 'Bui-Soundararajan density port',
  citedAsCanonicalSingleInputBy: ['imp-2499', 'imp-2500'],
  // Whether its distance-to-closure is genuinely ONE input (floor exactly 1) has not
  // been decomposed the way imp-2497 / imp-2498 decomposed the two angle (b) inputs.
  floorAuditedAgainstConcreteRoute: false,
});

// The strict upgrade is GATED on that unperformed audit.
const strictUpgradeRequiresComparisonFloorAudit = true;
const comparisonRouteFloorAudited = COMPARISON_ROUTE.floorAuditedAgainstConcreteRoute;
const strictDominationProven =
  weakDominationProven &&
  comparisonRouteFloorAudited; // false today => strict NOT proven.

// =========================================================================
// SECTION (c) -- The named residual sub-gap (the single open verification).
// =========================================================================

const RESIDUAL_SUB_GAP = Object.freeze({
  id: 'imp-2501-sub-comparison-route-floor-unaudited',
  statement:
    'To upgrade the imp-2500 WEAK domination to STRICT (unconditional) domination ' +
    'against the Bui-Soundararajan density port, audit that route distance-to-' +
    'closure and confirm its breakthroughCountFloor is exactly 1 (a single required ' +
    'input, no hidden independent second breakthrough), analogous to the imp-2497 / ' +
    'imp-2498 input-availability audits of the two angle (b) inputs.',
  isResidual: true,
  closesAngleB: false,
  difficulty: 'audit-pending (research-survey-grade, not research-frontier-grade)',
  anchorsRankingClaim: 'imp-2500 strictlyCostlierUnlessSingleInputHidesTwoBreakthroughs',
});

const VERDICT =
  'weak-domination-is-the-current-ceiling-strict-upgrade-gated-on-unperformed-comparison-route-floor-audit';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE = Object.freeze({
  id: 'imp-2501',
  ticket: 'imp-370',
  bounds: 'imp-2500 (breakthrough-floor ranking) weak-domination ceiling',
  layer: 'boundary pin (names the single verification separating proven WEAK from unproven STRICT domination)',
  question:
    'imp-2500 proved WEAK domination (angle (b) not-cheaper-than any single-input ' +
    'route) and explicitly stopped short of STRICT domination because of an UNLESS ' +
    'escape clause. What single verification would discharge that clause against the ' +
    'canonical catalogued comparison route, and has it been performed?',
  weakDominationProven,
  imp2500DidNotClaimStrict,
  comparisonRouteFloorIsStipulatedNotAudited,
  comparisonRoute: COMPARISON_ROUTE,
  strictUpgradeRequiresComparisonFloorAudit,
  comparisonRouteFloorAudited,
  strictDominationProven,
  residualSubGap: RESIDUAL_SUB_GAP,
  verdict: VERDICT,
  closesTicket: false,
  finding:
    'imp-2500 proved WEAK domination of angle (b) (floor 2) over a single-input ' +
    'route (floor 1) and was explicit that the strict upgrade is conditional on the ' +
    'single-input route NOT hiding a >= 2-breakthrough input. The reference floor of ' +
    '1 was set by STIPULATION (the row was named a single-input route), not by ' +
    'auditing the distance-to-closure of the concrete Bui-Soundararajan density port ' +
    '(imp-1123) it cites. Discharging the UNLESS clause against that route requires a ' +
    'floor audit -- decompose the BS route and confirm exactly one required input -- ' +
    'which has NOT been performed. So STRICT domination is NOT proven; the honest ' +
    'ceiling remains WEAK domination, with the strict upgrade gated on the named ' +
    'residual sub-gap.',
  sharpensImp2500:
    'imp-2500 named the UNLESS escape clause but left it abstract. This module ' +
    'concretizes it: the clause is dischargeable by a single comparison-route floor ' +
    'audit against the named BS density port, and that audit is currently OPEN, so ' +
    'the ranking honestly stops at weak domination rather than silently drifting to ' +
    'a strict claim it has not earned.',
  honestScope: Object.freeze([
    'This boundary pin does NOT close O1, O2, O3, or imp-370 angle (b), and it does ' +
    'NOT upgrade the imp-2500 ranking. It only names the one verification that ' +
    'separates the proven weak domination from an unproven strict domination, and ' +
    'records that verification as not-yet-performed.',
    'The comparison-route floor of 1 used by imp-2500 is a DEFINITIONAL stipulation ' +
    'about an idealized single-input route, not an audited floor of the concrete BS ' +
    'density port. Treating the two as equal would silently assume away the UNLESS ' +
    'clause imp-2500 deliberately left open.',
    'The residual sub-gap is survey-grade (decompose one catalogued route), NOT ' +
    'research-frontier-grade like O1 / O2 / O3; naming it here does not assert it is ' +
    'as hard as the angle (b) obstacles, only that it is currently un-done.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-1123', 'imp-2499', 'imp-2500']),
});

export default IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE_ASSERTIONS = [
  {
    id: 'imp2501-weak-domination-premise-read-from-imp2500',
    holds: () => {
      const r = IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE;
      const k = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;
      // The gate must read its WEAK-domination premise directly from imp-2500, not
      // re-assert it, so it cannot outlive a future weakening of the ranking.
      return (
        r.weakDominationProven === true &&
        k.strictlyDominatesSingleInput === true &&
        k.angleBNotCheaperThanSingleInput === true
      );
    },
    why:
      'This boundary pin only makes sense on top of a proven WEAK domination. If the ' +
      'imp-2500 weak-domination premise were lost, the gate would be bounding a claim ' +
      'that no longer exists, so the premise is read live from imp-2500.',
  },
  {
    id: 'imp2501-strict-upgrade-gated-on-unperformed-audit',
    holds: () => {
      const r = IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE;
      // The core claim: strict domination is NOT proven, because the comparison-route
      // floor audit that would discharge the imp-2500 UNLESS clause is not performed.
      return (
        r.strictUpgradeRequiresComparisonFloorAudit === true &&
        r.comparisonRouteFloorAudited === false &&
        r.comparisonRoute.floorAuditedAgainstConcreteRoute === false &&
        r.strictDominationProven === false
      );
    },
    why:
      'The whole point is that STRICT domination remains unproven until the BS-route ' +
      'floor is audited. If comparisonRouteFloorAudited or strictDominationProven ' +
      'silently flipped to true without that audit existing, the ranking would ' +
      'overclaim past the imp-2500 honest WEAK ceiling.',
  },
  {
    id: 'imp2501-comparison-floor-is-stipulated-not-audited',
    holds: () => {
      const r = IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE;
      // Honesty pin: the imp-2500 single-input floor of 1 is a DEFINITIONAL value,
      // and that distinction (stipulated vs audited) must stay explicit.
      return (
        r.comparisonRouteFloorIsStipulatedNotAudited === true &&
        r.residualSubGap.isResidual === true &&
        r.residualSubGap.closesAngleB === false &&
        r.residualSubGap.id === 'imp-2501-sub-comparison-route-floor-unaudited'
      );
    },
    why:
      'The imp-2500 reference floor of 1 was set by stipulation, not by auditing a ' +
      'concrete route. Pinning that distinction (and the residual sub-gap that would ' +
      'close it) prevents a future reader from treating the stipulated 1 as a ' +
      'verified floor and silently assuming away the UNLESS clause.',
  },
  {
    id: 'imp2501-does-not-close-ticket',
    holds: () => {
      const r = IMP2501_ESY_WEAK_DOMINATION_STRICT_UPGRADE_GATE;
      return (
        r.closesTicket === false &&
        IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING.closesTicket === false
      );
    },
    why:
      'This is a boundary-pin / honesty layer, not a closure. closesTicket must stay ' +
      'false and the imp-2500 premise must continue to report not-closed; flipping ' +
      'either would overclaim a result neither module supports.',
  },
];
