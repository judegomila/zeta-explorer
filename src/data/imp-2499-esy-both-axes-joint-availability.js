// @module imp-2499-esy-both-axes-joint-availability
// imp-2499 (improvement for ticket imp-370, high, proof): JOINT synthesis across
// the two per-axis input-availability audits. imp-2491 (coupling matrix) reduced
// imp-370 angle (b) to >= 2 independent inputs across 2 orthogonal axes and
// ASSUMED both idealized inputs available as black boxes. The two sibling audits
// then decomposed each idealized input against what is proven today:
//   arithmetic axis -> imp-2497 : GUE-equidistribution input is support-restricted
//                                 + conditional (Montgomery RH; Rudnick-Sarnak GRH)
//   pde axis        -> imp-2498 : backward-stability input is circular-conditional
//                                 + logarithmic-modulus-weak (Hadamard-unconditional false)
// Each audit notes in prose that, combined with its sibling, BOTH inputs are
// unavailable -- but neither builds the explicit JOINT record, and neither pins
// the structural consequence of the two unavailabilities being INDEPENDENT. This
// module reads both sibling verdicts programmatically and computes the joint
// availability picture, the same way imp-2491 joined the three obstacle audits.
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'both-required-inputs-unavailable-and-independent-distance-is-their-conjunction'
//
// The two required inputs are not merely both-unavailable; their unavailabilities
// are INDEPENDENT. imp-2497 anchors its residual to the ARITHMETIC sub-gaps
// {O1, O3}; imp-2498 anchors its residual to the PDE sub-gap {O2}. These anchor
// sets are DISJOINT, so neither residual is a consequence of the other and
// progress on one axis cannot shorten the other. The route therefore needs BOTH
// breakthroughs to land -- a logical CONJUNCTION, not an either/or -- so the
// distance-to-closure is the JOIN (the harder-of-two / both-required) of two
// independent research-grade gaps, not the minimum. Decision consequence: the
// imp-2491 highest-leverage-first ordering (arithmetic input first) yields NO
// sequential payoff toward conditionality -- closing the arithmetic axis still
// leaves a fully research-grade PDE-axis route, never a one-input-conditional one.
// Among the catalogued ESY-closure routes, angle (b) is the only one that demands
// TWO independent orthogonal breakthroughs simultaneously, so its expected cost is
// strictly worse than any single-input route and it should be deprioritized
// accordingly. This UPGRADES the imp-2491 lower bound (">= 2 inputs, assuming the
// idealized inputs exist") into a realized statement (">= 2 inputs, and BOTH of
// those idealized inputs are themselves currently unavailable").
//
// HONESTY: this does NOT close O1, O2, O3, or imp-370 angle (b). It is the
// availability-layer counterpart of the imp-2491 coupling-layer synthesis: it
// converts two separate "input unavailable" verdicts into one decision-relevant
// statement about the conjunctive, independent structure of the remaining
// distance. The ticket stays research-grade open on both axes.
//
// SYNTAX SAFETY: no star-slash sequences in comments; single-quoted strings
// contain no apostrophes; subscripts written as k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-2491  -- esy-obstacle-coupling-matrix.js (the >= 2-inputs lower bound)
// @see imp-2497  -- arithmetic-axis input-availability audit (one sibling)
// @see imp-2498  -- pde-axis input-availability audit (the other sibling)

import { IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT } from './imp-2497-esy-highest-leverage-input-availability-audit.js';
import { IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY } from './imp-2498-esy-o2-backward-stability-availability-audit.js';

// =========================================================================
// SECTION (a) -- The two axes, each with its proven-vs-needed availability flag
// read directly from the sibling audit (so this synthesis cannot drift away
// from the audits it summarizes).
// =========================================================================

const ARITHMETIC = IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT;
const PDE = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;

// Availability per axis, derived (not hand-copied) from each sibling verdict.
const arithmeticInputAvailableToday = ARITHMETIC.highestLeverageInputAvailableToday; // false
// imp-2498 has no single boolean; an available PDE input would require NEITHER
// shortfall (conditionality, modulus) and SOME unconditional version to exist.
const pdeInputAvailableToday =
  PDE.gap.conditionalityShortfall === false &&
  PDE.gap.modulusShortfall === false &&
  PDE.gap.unconditionalVersionExists === true; // false

const AXES = Object.freeze({
  arithmetic: {
    audit: 'imp-2497',
    inputName: 'GUE-equidistribution / Bourgade rigidity for {gamma_k}',
    availableToday: arithmeticInputAvailableToday,
    anchoredSubGaps: ARITHMETIC.namedSubGap.anchorsExistingSubGaps, // [O1, O3]
    residualSubGapId: ARITHMETIC.namedSubGap.id,
  },
  pde: {
    audit: 'imp-2498',
    inputName: 'Backward-stability / unique-continuation for the de Bruijn-Newman flow',
    availableToday: pdeInputAvailableToday,
    anchoredSubGaps: [PDE.subGap.anchors], // [O2]
    residualSubGapId: PDE.subGap.id,
  },
});

// =========================================================================
// SECTION (b) -- Independence: the two residual anchor sets are DISJOINT.
// Disjoint anchors => neither residual is reducible to the other => the two
// unavailabilities are independent and the route needs BOTH (a conjunction).
// =========================================================================

function intersect(a, b) {
  const setB = new Set(b);
  return a.filter((x) => setB.has(x));
}

const anchorOverlap = intersect(AXES.arithmetic.anchoredSubGaps, AXES.pde.anchoredSubGaps);
const residualsAreIndependent = anchorOverlap.length === 0;

// =========================================================================
// SECTION (c) -- The joint availability picture.
// =========================================================================
//
// bothInputsUnavailable: neither axis input is available today.
// distanceIsConjunction: because the residuals are independent AND both inputs
//   are required (imp-2491 lower bound 2), the route needs them simultaneously --
//   distance-to-closure is the JOIN (both-required), not the minimum.
// orderingYieldsNoConditionalShortcut: even closing the highest-leverage
//   (arithmetic) axis first leaves a fully research-grade PDE route, never a
//   one-input-conditional one, because the residuals do not overlap.

const bothInputsUnavailable =
  AXES.arithmetic.availableToday === false && AXES.pde.availableToday === false;

const requiredInputCountLowerBound = 2; // matches imp-2491 minimumIndependentInputsLowerBound.

const distanceIsConjunction = bothInputsUnavailable && residualsAreIndependent;

const orderingYieldsNoConditionalShortcut = residualsAreIndependent;

const VERDICT = 'both-required-inputs-unavailable-and-independent-distance-is-their-conjunction';

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY = Object.freeze({
  id: 'imp-2499',
  ticket: 'imp-370',
  synthesisOf: Object.freeze(['imp-2497 (arithmetic axis)', 'imp-2498 (pde axis)']),
  layer: 'availability (counterpart of the imp-2491 coupling layer)',
  question:
    'Each per-axis audit shows its input unavailable and notes in prose that, ' +
    'jointly, both are unavailable. Built explicitly: are the two unavailabilities ' +
    'INDEPENDENT, and what does that make the distance-to-closure -- a conjunction ' +
    '(both required) or a choice (either suffices)?',
  axes: AXES,
  anchorOverlap,
  residualsAreIndependent,
  bothInputsUnavailable,
  requiredInputCountLowerBound,
  distanceIsConjunction,
  orderingYieldsNoConditionalShortcut,
  verdict: VERDICT,
  closesTicket: false,
  finding:
    'Both required inputs are unavailable today (arithmetic per imp-2497, pde per ' +
    'imp-2498) AND their residual sub-gaps anchor DISJOINT obstacle sets ' +
    '(arithmetic -> {O1, O3}; pde -> {O2}). So the two unavailabilities are ' +
    'independent: neither reduces to the other, and the route needs BOTH ' +
    'breakthroughs simultaneously. Distance-to-closure is therefore the JOIN ' +
    '(both-required conjunction) of two independent research-grade gaps, not the ' +
    'minimum. The imp-2491 highest-leverage-first ordering gives no shortcut to a ' +
    'one-input-conditional route -- closing the arithmetic axis leaves a fully ' +
    'research-grade pde route. Among the catalogued ESY-closure routes angle (b) ' +
    'is the only one demanding two independent orthogonal breakthroughs at once, ' +
    'so it should be deprioritized relative to single-input routes.',
  upgradesImp2491:
    'imp-2491 gave the lower bound ">= 2 independent inputs" ASSUMING the two ' +
    'idealized inputs exist as black boxes. Combined with imp-2497 + imp-2498 this ' +
    'synthesis realizes that bound: not only are >= 2 inputs required, BOTH of ' +
    'those idealized inputs are themselves currently unavailable, so the realized ' +
    'distance is two independent research-grade breakthroughs, not zero or one.',
  honestScope: Object.freeze([
    'This synthesis does NOT close O1, O2, O3, or imp-370 angle (b). It is the ' +
    'availability-layer counterpart of imp-2491: it converts two separate ' +
    '"input unavailable" verdicts into one statement about the conjunctive, ' +
    'independent structure of the remaining distance-to-closure.',
    'The defensible core is the INDEPENDENCE claim, which follows purely from the ' +
    'two residual sub-gaps anchoring disjoint obstacle sets ({O1, O3} arithmetic ' +
    'vs {O2} pde) -- read directly from the sibling audits, not re-asserted here. ' +
    'Given independence and the imp-2491 lower bound of 2, the distance being a ' +
    'conjunction (both required) rather than a choice is forced.',
    'Decision-relevance: the highest-leverage-first ordering from imp-2491 does ' +
    'not shorten the orthogonal axis, so angle (b) cannot be made ' +
    'one-input-conditional by any single breakthrough; it is the unique catalogued ' +
    'route requiring two independent orthogonal inputs and should be ranked below ' +
    'single-input routes (e.g. the Bui-Soundararajan density port) on expected cost.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-2491', 'imp-2497', 'imp-2498']),
});

export default IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY_ASSERTIONS = [
  {
    id: 'imp2499-both-inputs-unavailable',
    holds: () => {
      const r = IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;
      return (
        r.axes.arithmetic.availableToday === false &&
        r.axes.pde.availableToday === false &&
        r.bothInputsUnavailable === true
      );
    },
    why:
      'The joint picture rests on NEITHER axis input being available today ' +
      '(arithmetic per imp-2497, pde per imp-2498). If either availableToday flag ' +
      'flipped to true without a real new theorem, the both-axes-open conclusion ' +
      'would silently collapse and the conjunction structure would be wrong.',
  },
  {
    id: 'imp2499-availability-flags-track-sibling-audits',
    holds: () => {
      // The per-axis flags must be DERIVED from the sibling verdicts, not
      // hand-set, so this synthesis cannot drift away from the audits it joins.
      const a = IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT;
      const p = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;
      const r = IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;
      const arithExpected = a.highestLeverageInputAvailableToday;
      const pdeExpected =
        p.gap.conditionalityShortfall === false &&
        p.gap.modulusShortfall === false &&
        p.gap.unconditionalVersionExists === true;
      return (
        r.axes.arithmetic.availableToday === arithExpected &&
        r.axes.pde.availableToday === pdeExpected
      );
    },
    why:
      'The arithmetic / pde availability flags are computed from the sibling ' +
      'audit records (imp-2497 highestLeverageInputAvailableToday; imp-2498 gap ' +
      'shortfalls). If a future edit desynchronizes them from the siblings, the ' +
      'joint verdict would no longer faithfully summarize the per-axis audits.',
  },
  {
    id: 'imp2499-residuals-anchor-disjoint-obstacle-sets',
    holds: () => {
      const r = IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;
      const arith = r.axes.arithmetic.anchoredSubGaps;
      const pde = r.axes.pde.anchoredSubGaps;
      const set = new Set(pde);
      const overlap = arith.filter((x) => set.has(x));
      // Arithmetic anchors the O1/O3 sub-gaps; pde anchors the O2 sub-gap.
      return (
        overlap.length === 0 &&
        r.anchorOverlap.length === 0 &&
        r.residualsAreIndependent === true &&
        arith.includes('esy-port-O1-unconditional-rigidity') &&
        arith.includes('esy-port-O3-derandomization') &&
        pde.includes('esy-port-O2-backward-flow-coupling')
      );
    },
    why:
      'INDEPENDENCE is the load-bearing claim: the two residual sub-gaps must ' +
      'anchor DISJOINT obstacle sets (arithmetic {O1, O3} vs pde {O2}). If the ' +
      'anchor sets overlapped, one residual could be a consequence of the other ' +
      'and the conjunctive / independent distance structure would be unjustified.',
  },
  {
    id: 'imp2499-distance-is-conjunction-not-minimum',
    holds: () => {
      const r = IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;
      return (
        r.distanceIsConjunction === true &&
        r.requiredInputCountLowerBound === 2 &&
        r.orderingYieldsNoConditionalShortcut === true
      );
    },
    why:
      'Because both inputs are required (imp-2491 lower bound 2) and their ' +
      'residuals are independent, the distance-to-closure is a CONJUNCTION (both ' +
      'needed), so the highest-leverage-first ordering gives no shortcut to a ' +
      'one-input-conditional route. Demoting this to a minimum / either-suffices ' +
      'structure would falsely imply a single breakthrough could make angle (b) ' +
      'conditional on one thing.',
  },
  {
    id: 'imp2499-does-not-close-ticket',
    holds: () => {
      const r = IMP2499_ESY_BOTH_AXES_JOINT_AVAILABILITY;
      // Both sibling audits must still report not-closed, and this synthesis must
      // not overclaim closure of the obstacles or the ticket.
      return (
        r.closesTicket === false &&
        IMP2497_ESY_HIGHEST_LEVERAGE_INPUT_AVAILABILITY_AUDIT.highestLeverageInputAvailableToday === false &&
        IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY.closesO2 === false &&
        IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY.closesTicket === false
      );
    },
    why:
      'This is an availability-layer synthesis, not a closure. closesTicket must ' +
      'stay false and the underlying sibling audits must continue to report their ' +
      'inputs unavailable / O2 unclosed; flipping any to closed here would ' +
      'overclaim a result imp-2497 / imp-2498 do not support.',
  },
];
