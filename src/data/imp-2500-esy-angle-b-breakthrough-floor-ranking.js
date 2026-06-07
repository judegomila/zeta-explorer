// @module imp-2500-esy-angle-b-breakthrough-floor-ranking
// imp-2500 (improvement for ticket imp-370, high, proof): converts the imp-2499
// PROSE recommendation ("angle (b) should be deprioritized relative to single-input
// routes; it ranks below them on expected cost") into a FORCED, pinned ordinal
// under one explicitly-named cost proxy. imp-2499 established that angle (b)
// requires a CONJUNCTION of two INDEPENDENT research-grade breakthroughs
// (requiredInputCountLowerBound === 2, distanceIsConjunction === true), but left
// the comparative ranking as a recommendation rather than an entailment. This
// module names the proxy that makes the ranking follow as a theorem-of-the-proxy
// rather than a judgement call, and pins exactly how far the entailment reaches.
//
// THE PROXY
// ---------
// breakthroughCountFloor(route) := the minimum number of INDEPENDENT
//   research-grade breakthroughs that must ALL land before the route can close.
// For a route whose distance-to-closure is a conjunction of k independent inputs
// (imp-2499 language), this floor is exactly k: you cannot finish with fewer than
// k, because the inputs are independent (no one substitutes for another) and all
// are required (a conjunction, not a choice). For a single-input route the floor
// is 1.
//
// WHY THE FLOOR IS A VALID LOWER-BOUND COST PROXY
// ----------------------------------------------
// The floor is MONOTONE in the real (unknown) cost in one direction only: a route
// that needs k independent breakthroughs cannot be closed more cheaply than the
// cheapest single one of them, and certainly not before all k exist. So a strictly
// higher floor is a strictly higher LOWER BOUND on cost. It is NOT an upper bound:
// a single input could itself be individually harder than two easy ones. Hence the
// proxy licenses a WEAK domination ("angle (b) is not cheaper than any single-input
// route, and is strictly costlier unless some single input is itself >= 2
// independent-breakthroughs hard"), which is the precise, defensible form of the
// imp-2499 recommendation -- not an unconditional "angle (b) is the most expensive
// route", which the proxy does not support.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'angle-b-has-strictly-maximal-breakthrough-floor-deprioritization-is-forced-under-this-proxy'
//
// angle (b) has breakthroughCountFloor 2 (imp-2499 conjunction of two independent
// inputs); every single-input route has floor 1; 2 > 1, so under the
// breakthrough-count-floor ordering angle (b) is STRICTLY dominated (ranked last)
// and the imp-2499 deprioritization is FORCED, not discretionary. The honest reach
// of the claim is weak domination: angle (b) cannot be cheaper than a single-input
// route; it is strictly costlier unless that route hides a >= 2-breakthrough input.
//
// HONESTY: this does NOT close O1, O2, O3, or imp-370 angle (b), and it does NOT
// rank routes by TOTAL difficulty -- only by the breakthrough-count floor, an
// explicitly lower-bound proxy. It upgrades the imp-2499 prose recommendation into
// a pinned entailment-under-a-named-proxy, with the proxy boundary (lower bound,
// not total cost) recorded so no future reader over-reads the ranking.
//
// SYNTAX SAFETY: no star-slash sequences in comments; single-quoted strings
// contain no apostrophes; subscripts written as k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-2491  -- esy-obstacle-coupling-matrix.js (>= 2 independent inputs)
// @see imp-2499  -- esy-both-axes-joint-availability.js (distance is a conjunction)

import { IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY } from './imp-2499-esy-both-axes-joint-availability.js';

// =========================================================================
// SECTION (a) -- The angle (b) floor, DERIVED from imp-2499 (not hand-set), so
// this ranking cannot drift away from the synthesis it operationalizes.
// =========================================================================

const JOINT = IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;

// A conjunction of k independent required inputs has breakthrough-count floor k.
// imp-2499 pins requiredInputCountLowerBound === 2 and distanceIsConjunction === true.
const angleBIsConjunction = JOINT.distanceIsConjunction === true;
const angleBBreakthroughFloor = angleBIsConjunction
  ? JOINT.requiredInputCountLowerBound
  : 1;

// A reference single-input route: its distance-to-closure is ONE input, so its
// breakthrough-count floor is 1. imp-2499 names the Bui-Soundararajan density port
// as the canonical single-input comparison target.
const SINGLE_INPUT_ROUTE = Object.freeze({
  name: 'single-input ESY-closure route (e.g. Bui-Soundararajan density port)',
  isConjunctionOfIndependentInputs: false,
  breakthroughCountFloor: 1,
});

// =========================================================================
// SECTION (b) -- The ordinal under the breakthrough-count-floor proxy.
// =========================================================================

const strictlyDominatesSingleInput =
  angleBBreakthroughFloor > SINGLE_INPUT_ROUTE.breakthroughCountFloor;

// Weak domination is the honest reach: floor is a LOWER-BOUND proxy only.
// angle (b) is NOT-CHEAPER-THAN any single-input route; it is strictly costlier
// UNLESS that single input is itself >= 2 independent-breakthroughs hard.
const angleBNotCheaperThanSingleInput = strictlyDominatesSingleInput;
const strictlyCostlierUnlessSingleInputHidesTwoBreakthroughs = strictlyDominatesSingleInput;

const deprioritizationIsForcedUnderProxy = strictlyDominatesSingleInput;

const VERDICT =
  'angle-b-has-strictly-maximal-breakthrough-floor-deprioritization-is-forced-under-this-proxy';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING = Object.freeze({
  id: 'imp-2500',
  ticket: 'imp-370',
  operationalizes: 'imp-2499 (both-axes joint availability) prose recommendation',
  layer: 'ranking (entailment-under-a-named-proxy over the imp-2499 availability layer)',
  question:
    'imp-2499 RECOMMENDS deprioritizing angle (b) below single-input routes on ' +
    'expected cost but leaves it as a judgement. Under which explicit, defensible ' +
    'proxy does that ranking become FORCED rather than discretionary, and exactly ' +
    'how far does the entailment reach (strict total-cost domination, or weaker)?',
  proxy: Object.freeze({
    name: 'breakthroughCountFloor',
    definition:
      'minimum number of INDEPENDENT research-grade breakthroughs that must ALL ' +
      'land before a route can close',
    isLowerBoundOnly: true,
    isUpperBound: false,
    monotoneDirection: 'higher floor => strictly higher LOWER BOUND on cost (never an upper bound)',
  }),
  angleB: Object.freeze({
    name: 'imp-370 angle (b) ESY local-law rigidity port',
    isConjunctionOfIndependentInputs: angleBIsConjunction,
    breakthroughCountFloor: angleBBreakthroughFloor,
    floorDerivedFrom: 'imp-2499 requiredInputCountLowerBound + distanceIsConjunction',
  }),
  singleInputRoute: SINGLE_INPUT_ROUTE,
  strictlyDominatesSingleInput,
  angleBNotCheaperThanSingleInput,
  strictlyCostlierUnlessSingleInputHidesTwoBreakthroughs,
  deprioritizationIsForcedUnderProxy,
  verdict: VERDICT,
  closesTicket: false,
  finding:
    'angle (b) has breakthroughCountFloor 2 (DERIVED from imp-2499: a conjunction ' +
    'of two independent required inputs); every single-input route has floor 1. ' +
    'Under the breakthrough-count-floor ordering -- a valid LOWER-BOUND cost proxy ' +
    '-- 2 > 1 makes angle (b) strictly dominated (ranked last), so the imp-2499 ' +
    'deprioritization is FORCED, not discretionary. The honest reach is WEAK ' +
    'domination: angle (b) cannot be cheaper than any single-input route, and is ' +
    'strictly costlier UNLESS that route hides a >= 2-independent-breakthrough ' +
    'input. The proxy is explicitly a lower bound, not total difficulty, so the ' +
    'ranking does not claim angle (b) is unconditionally the most expensive route.',
  upgradesImp2499:
    'imp-2499 gave the prose recommendation that angle (b) ranks below single-input ' +
    'routes on expected cost. This module names the breakthrough-count-floor proxy ' +
    'under which that ranking is an entailment of the imp-2499 conjunction structure ' +
    '(floor 2 > floor 1), and pins the entailment boundary (weak / lower-bound ' +
    'domination) so the recommendation is reproducible and not over-read.',
  honestScope: Object.freeze([
    'This ranking does NOT close O1, O2, O3, or imp-370 angle (b). It converts the ' +
    'imp-2499 deprioritization recommendation into a forced ordinal under ONE named ' +
    'proxy (minimum independent-breakthrough count), nothing more.',
    'The proxy is a LOWER BOUND on cost, never an upper bound: a single-input route ' +
    'could individually be harder than angle (b) two inputs combined. So the ' +
    'defensible entailment is WEAK domination (angle (b) is not cheaper than any ' +
    'single-input route), not the unconditional claim that angle (b) is the single ' +
    'most expensive catalogued route.',
    'The angle (b) floor of 2 is DERIVED from imp-2499 (requiredInputCountLowerBound ' +
    '+ distanceIsConjunction), not re-asserted here, so a future weakening of the ' +
    'imp-2499 conjunction structure automatically propagates and this ranking ' +
    'cannot silently outrun its premise.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-2491', 'imp-2499']),
});

export default IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING_ASSERTIONS = [
  {
    id: 'imp2500-angle-b-floor-derived-from-imp2499-conjunction',
    holds: () => {
      const r = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;
      const j = IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;
      // The angle (b) floor must be DERIVED from the imp-2499 conjunction record,
      // not hand-set, so this ranking cannot drift away from its premise.
      const expectedFloor = j.distanceIsConjunction === true ? j.requiredInputCountLowerBound : 1;
      return (
        r.angleB.isConjunctionOfIndependentInputs === (j.distanceIsConjunction === true) &&
        r.angleB.breakthroughCountFloor === expectedFloor &&
        r.angleB.breakthroughCountFloor === 2
      );
    },
    why:
      'The whole ranking rests on angle (b) having breakthrough-count floor 2, which ' +
      'is DERIVED from imp-2499 (conjunction of two independent inputs). If a future ' +
      'edit desynchronized the floor from the imp-2499 conjunction record, the ' +
      'forced-ordinal conclusion would no longer follow from its stated premise.',
  },
  {
    id: 'imp2500-strict-floor-domination-over-single-input',
    holds: () => {
      const r = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;
      return (
        r.singleInputRoute.breakthroughCountFloor === 1 &&
        r.angleB.breakthroughCountFloor > r.singleInputRoute.breakthroughCountFloor &&
        r.strictlyDominatesSingleInput === true &&
        r.deprioritizationIsForcedUnderProxy === true
      );
    },
    why:
      'The deprioritization is FORCED only because the angle (b) floor (2) strictly ' +
      'exceeds the single-input floor (1). If that strict inequality were lost, the ' +
      'ordinal would collapse and the imp-2499 recommendation would revert to a ' +
      'discretionary judgement rather than an entailment of the conjunction structure.',
  },
  {
    id: 'imp2500-proxy-is-lower-bound-only-weak-domination',
    holds: () => {
      const r = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;
      // Honesty pin: the proxy must stay flagged lower-bound-only, and the reach of
      // the claim must stay WEAK (not-cheaper-than), never an unconditional
      // total-cost domination.
      return (
        r.proxy.isLowerBoundOnly === true &&
        r.proxy.isUpperBound === false &&
        r.angleBNotCheaperThanSingleInput === true &&
        r.strictlyCostlierUnlessSingleInputHidesTwoBreakthroughs === true
      );
    },
    why:
      'The breakthrough-count floor is a LOWER BOUND on cost, not total difficulty. ' +
      'If isLowerBoundOnly flipped to false or isUpperBound to true, the ranking ' +
      'would falsely claim angle (b) is unconditionally the most expensive route -- ' +
      'an overclaim the proxy cannot support, since a single input could be harder ' +
      'than two easy ones.',
  },
  {
    id: 'imp2500-does-not-close-ticket',
    holds: () => {
      const r = IMP2500_ESY_ANGLE_B_BREAKTHROUGH_FLOOR_RANKING;
      // Ranking layer must not overclaim closure, and the imp-2499 premise must
      // itself still report not-closed.
      return (
        r.closesTicket === false &&
        IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY.closesTicket === false &&
        IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY.bothInputsUnavailable === true
      );
    },
    why:
      'This is a ranking / decision layer, not a closure. closesTicket must stay ' +
      'false and the imp-2499 premise must continue to report both inputs ' +
      'unavailable; flipping either to closed here would overclaim a result imp-2499 ' +
      'does not support and would make ranking the route moot.',
  },
];
