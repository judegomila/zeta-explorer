// @module imp-2498-esy-o2-backward-stability-availability-audit
// imp-2498 (improvement for ticket imp-370, high, proof): AVAILABILITY audit of
// the PDE-axis input the imp-2491 coupling matrix isolates as the unique lever
// for obstacle O2. imp-2491 concludes imp-370 angle (b) needs >= 2 independent
// inputs across 2 orthogonal axes: an ARITHMETIC equidistribution input (spans
// O1 + O3) and a PDE backward-stability input (reaches O2 alone). imp-2497
// already audited the ARITHMETIC input and found it support-restricted plus
// conditional. This audit does the COMPLEMENTARY job on the orthogonal axis: is
// the backward-stability / unique-continuation input for the de Bruijn-Newman
// flow AVAILABLE TODAY, or does it decompose into a proven part plus an open
// part the way the arithmetic input did?
//
// QUESTION
// --------
// imp-2492 pinned O2 as a PDE ill-posedness obstruction: the backward de
// Bruijn-Newman heat flow amplifies wavenumber-k data by exp(+t k^2) (the
// backward heat equation, classically ill-posed), maximal at the microscopic
// scale k_{max} ~ log(gamma_N) the ESY rigidity bound controls. The coupling
// matrix credits an idealized "backward-stability / unique-continuation" input
// (Tao-Vu time-reversal; Carleman / logarithmic-convexity) with closing O2 in
// full and assumes it as a black box. What is actually PROVEN for backward heat
// flows today, and how far short of the O2 requirement does it fall?
//
// HEADLINE VERDICT
// ----------------
// VERDICT: 'o2-backward-stability-input-only-available-conditional-and-log-weak'
//
// The backward-control theory that exists today delivers two things, neither of
// which is the O2 input. (1) BACKWARD UNIQUENESS via logarithmic convexity
// (Agmon-Nirenberg; Lions-Malgrange): if a backward-heat solution vanishes at
// the final time it vanished throughout. This is UNIQUENESS, not stability -- it
// gives no quantitative transfer of a fluctuation bound. (2) CONDITIONAL
// stability via Carleman estimates / John prescribed-bound theory: under an a
// priori bound on the solution in a stronger norm, the backward map obeys a
// stability estimate, but its modulus of continuity is only LOGARITHMIC, and the
// a priori bound it consumes is a microscopic-scale control on the backward flow
// -- which is exactly the rigidity O2 is trying to establish (circularity).
// Unconditional continuous dependence is FALSE (Hadamard ill-posedness), so no
// unconditional version exists. The O2 input ESY needs is the UNCONDITIONAL,
// POWER-LAW-strength transfer of a forward Gronwall / Lipschitz rigidity bound to
// the backward flow at k_{max}; the proven inputs are conditional-on-a-circular-
// a-priori-bound and only logarithmic-modulus. So the PDE-axis lever, like the
// arithmetic-axis lever (imp-2497), is strictly stronger than anything available
// today.
//
// JOINT CONSEQUENCE (with imp-2497): BOTH required inputs are unavailable.
// ------------------------------------------------------------------------
// imp-2491 reduced angle (b) to >= 2 independent inputs, one per axis. imp-2497
// showed the arithmetic input is support-restricted + conditional; this audit
// shows the PDE input is conditional + logarithmic-weak. Hence NEITHER of the two
// orthogonal inputs the route needs is available in usable form today: the
// distance-to-closure is nonzero on BOTH axes simultaneously, not just one. This
// completes the availability picture the coupling matrix left open.
//
// RELATION TO PRIOR imp-370 AUDITS (refines, does not contradict)
// ---------------------------------------------------------------
// imp-2492 (O2 backward-flow)  -- WHY O2 is open: backward heat is ill-posed.
// imp-2491 (coupling matrix)   -- names the backward-stability input the unique
//   O2 lever and assumes it as a black box.
// imp-2497 (arithmetic avail.) -- audits the OTHER axis input (GUE-equidist.).
// THIS audit (imp-2498)        -- audits the PDE-axis input: decomposes it into
//   proven (backward uniqueness; conditional log-stability) vs needed
//   (unconditional power-law-strength transfer at k_{max}) and pins the residual.
//
// SYNTAX SAFETY: no star-slash sequences inside comments; single-quoted strings
// contain no apostrophes; subscripts written as k_{max} in prose.
//
// @see imp-370   -- the ticket (close imp-348 angle (b) via local-law rigidity)
// @see imp-407   -- esy-rigidity-port.js (approachSuggestions; obstacle2)
// @see imp-2492  -- O2 backward-flow ill-posedness audit (the obstacle this targets)
// @see imp-2491  -- esy-obstacle-coupling-matrix.js (names this the O2 lever)
// @see imp-2497  -- arithmetic-axis availability audit (the sibling on the other axis)

// =========================================================================
// SECTION (a) -- What backward-flow control is PROVEN today.
// =========================================================================
//
// Each row records: what the result delivers (uniqueness vs stability), whether
// it is conditional on an a priori bound, and the modulus of continuity it gives
// (none / logarithmic / power-law). modulusStrength is an ordinal handle:
//   0 = no quantitative transfer (uniqueness only)
//   1 = logarithmic modulus (vanishing-derivative-at-0; effectively no usable rate)
//   2 = power-law / Hoelder modulus (the strength a rigidity transfer would need)

const PROVEN_INPUTS = Object.freeze({
  backwardUniqueness: {
    name: 'Backward uniqueness via logarithmic convexity (Agmon-Nirenberg / Lions-Malgrange)',
    references: 'Agmon-Nirenberg 1967; Lions-Malgrange 1960',
    delivers: 'uniqueness',
    conditional: false,
    requiresAPrioriBound: false,
    modulus: 'none',
    modulusStrength: 0,
    note:
      'If a backward-heat solution vanishes at the final time it vanished ' +
      'throughout. Pure uniqueness; supplies NO quantitative transfer of a ' +
      'fluctuation / rigidity bound, so it cannot move a forward ESY estimate ' +
      'onto the backward flow.',
  },
  conditionalLogStability: {
    name: 'Conditional stability under an a priori bound (Carleman / John prescribed-bound)',
    references: 'F. John 1960 prescribed-bound stability; Carleman-estimate continuation',
    delivers: 'stability',
    conditional: true,
    requiresAPrioriBound: true,
    modulus: 'logarithmic',
    modulusStrength: 1,
    note:
      'Under an a priori bound on the solution in a stronger norm, the backward ' +
      'map is stable -- but only with a LOGARITHMIC modulus of continuity, and ' +
      'the a priori bound it consumes is a microscopic-scale control on the ' +
      'backward de Bruijn flow, which is precisely the rigidity O2 seeks ' +
      '(circularity).',
  },
  hadamardUnconditional: {
    name: 'Unconditional continuous dependence for the backward heat equation',
    references: 'Hadamard ill-posedness (classical)',
    delivers: 'none',
    conditional: false,
    requiresAPrioriBound: false,
    modulus: 'none',
    modulusStrength: 0,
    exists: false,
    note:
      'FALSE: the backward heat equation has no unconditional continuous ' +
      'dependence on data (high-k modes amplify by exp(+t k^2) without bound). ' +
      'Listed to record that the unconditional version O2 needs does not exist.',
  },
});

// =========================================================================
// SECTION (b) -- What obstacle O2 actually REQUIRES of this input.
// =========================================================================
//
// O2 needs to TRANSFER the forward ESY rigidity (a Gronwall / Lipschitz-strength,
// power-law fluctuation bound at the microscopic scale k_{max} ~ log(gamma_N))
// onto the BACKWARD de Bruijn collision flow, UNCONDITIONALLY (the zeros are a
// fixed deterministic sequence with no externally-supplied a priori bound), with
// a modulus strong enough that the transferred bound still yields psi_N ~ 1/N.

const O2_REQUIREMENT = Object.freeze({
  mustTransfer: 'forward ESY rigidity (power-law fluctuation bound at k_{max})',
  ontoFlow: 'backward de Bruijn-Newman collision flow',
  unconditional: true, // no external a priori microscopic bound is available for the fixed zeros
  requiredModulus: 'power-law',
  requiredModulusStrength: 2, // must survive into a 1/N-strength spacing bound
  scale: 'microscopic local-spacing k_{max} ~ log(gamma_N) / (2 pi)',
});

// =========================================================================
// SECTION (c) -- The gap: best proven input vs the O2 requirement.
// =========================================================================
//
// Two independent shortfalls, EITHER of which alone keeps O2 open:
//   (i)  CONDITIONALITY: the only proven stability is conditional on an a priori
//        microscopic bound that is itself the rigidity O2 wants (circular); O2
//        needs it unconditionally for the fixed deterministic zeros.
//   (ii) MODULUS: the proven conditional stability is logarithmic-modulus
//        (strength 1); O2 needs power-law strength (strength 2) for psi_N ~ 1/N.
// The best proven stability input is conditionalLogStability.

const BEST_PROVEN = 'conditionalLogStability';

function bestProvenStabilityRow() {
  return PROVEN_INPUTS[BEST_PROVEN];
}

const GAP = Object.freeze({
  conditionalityShortfall:
    bestProvenStabilityRow().requiresAPrioriBound === true && O2_REQUIREMENT.unconditional === true,
  modulusShortfall:
    bestProvenStabilityRow().modulusStrength < O2_REQUIREMENT.requiredModulusStrength,
  unconditionalVersionExists: PROVEN_INPUTS.hadamardUnconditional.exists === true, // false
});

const VERDICT = 'o2-backward-stability-input-only-available-conditional-and-log-weak';

// Named residual sub-gap anchored to the O2 coupling sub-gap from imp-2491.
const O2_AVAILABILITY_SUB_GAP = Object.freeze({
  id: 'imp-2498-sub-O2-backward-stability-conditional-log-weak',
  anchors: 'esy-port-O2-backward-flow-coupling',
  difficulty: 'research-grade',
  statement:
    'The PDE-axis input that would close O2 -- an unconditional, power-law-strength ' +
    'transfer of forward ESY rigidity onto the backward de Bruijn flow at k_{max} ' +
    '-- exceeds what is proven: backward uniqueness gives no quantitative transfer, ' +
    'and conditional Carleman / John stability is both circular (needs the very ' +
    'microscopic bound it would prove) and only logarithmic-modulus. Closing O2 ' +
    'needs a genuinely new unconditional backward-stability estimate (e.g. an ' +
    'established Tao-Vu time-reversal coupling), which does not exist today.',
});

// =========================================================================
// FROZEN EXPORTED RECORD
// =========================================================================

export const IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY = Object.freeze({
  id: 'imp-2498',
  ticket: 'imp-370',
  axis: 'pde (backward-flow well-posedness)',
  siblingOf: 'imp-2497 (arithmetic-axis availability audit)',
  question:
    'Is the backward-stability / unique-continuation input that imp-2491 names ' +
    'the unique O2 lever available today, or does it decompose into a proven ' +
    'part (backward uniqueness; conditional log-stability) plus an open part ' +
    '(unconditional power-law-strength transfer at k_{max})?',
  provenInputs: PROVEN_INPUTS,
  o2Requirement: O2_REQUIREMENT,
  bestProvenInput: BEST_PROVEN,
  gap: GAP,
  verdict: VERDICT,
  subGap: O2_AVAILABILITY_SUB_GAP,
  closesO2: false,
  closesTicket: false,
  finding:
    'Today the backward de Bruijn flow admits only (1) backward UNIQUENESS (log ' +
    'convexity; no quantitative transfer) and (2) CONDITIONAL stability (Carleman ' +
    '/ John) with a LOGARITHMIC modulus and an a priori bound equal to the ' +
    'rigidity sought (circular). O2 needs an UNCONDITIONAL, POWER-LAW-strength ' +
    'transfer at k_{max}; unconditional continuous dependence is Hadamard-false. ' +
    'So the PDE-axis lever, like the arithmetic-axis lever audited in imp-2497, ' +
    'is strictly stronger than anything proven -- the route stays conditional on ' +
    'BOTH orthogonal axes.',
  jointWithImp2497:
    'Combined with imp-2497 (arithmetic input support-restricted + conditional), ' +
    'this shows NEITHER of the >= 2 independent inputs imp-2491 requires is ' +
    'available today: distance-to-closure is nonzero on both axes simultaneously.',
  honestScope: Object.freeze([
    'This audit does NOT close O2 or imp-370 angle (b). It decomposes the O2 ' +
    'lever into proven vs needed and pins the residual sub-gap; the obstacle ' +
    'stays research-grade open.',
    'The defensible core is the two named shortfalls (conditionality + ' +
    'logarithmic modulus) plus the Hadamard fact that no unconditional backward ' +
    'continuous-dependence exists. Whether a future Tao-Vu time-reversal coupling ' +
    'supplies the unconditional power-law transfer is exactly the open question.',
    'Decision-relevance: with imp-2497, this establishes that BOTH required ' +
    'inputs are currently unavailable, so the highest-leverage research ordering ' +
    'from imp-2491 (arithmetic input first) does not shorten the PDE-axis ' +
    'distance -- O2 needs its own separate unconditional backward-stability input.',
  ]),
  parallelTickets: Object.freeze(['imp-370', 'imp-407', 'imp-2491', 'imp-2492', 'imp-2497']),
});

export default IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;

// =========================================================================
// BUILD-TIME TRIPWIRES
// =========================================================================

export const IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY_ASSERTIONS = [
  {
    id: 'imp2498-no-unconditional-backward-stability-exists',
    holds: () => {
      const r = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;
      // The Hadamard row must record that the unconditional version does NOT exist.
      return r.provenInputs.hadamardUnconditional.exists === false && r.gap.unconditionalVersionExists === false;
    },
    why:
      'O2 requires an UNCONDITIONAL backward-stability input, but the backward ' +
      'heat equation has no unconditional continuous dependence (Hadamard). If ' +
      'this row were flipped to exists=true the audit would falsely assert a ' +
      'usable unconditional input is available, collapsing the O2 obstacle.',
  },
  {
    id: 'imp2498-best-proven-is-conditional',
    holds: () => {
      const r = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;
      const best = r.provenInputs[r.bestProvenInput];
      return best.requiresAPrioriBound === true && best.conditional === true && r.gap.conditionalityShortfall === true;
    },
    why:
      'The best proven stability input is conditional on an a priori microscopic ' +
      'bound (which is the rigidity O2 seeks -- circular). If it were marked ' +
      'unconditional the conditionality shortfall would vanish and the audit ' +
      'would overclaim availability.',
  },
  {
    id: 'imp2498-modulus-shortfall-log-vs-power-law',
    holds: () => {
      const r = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;
      const best = r.provenInputs[r.bestProvenInput];
      return (
        best.modulusStrength < r.o2Requirement.requiredModulusStrength &&
        r.o2Requirement.requiredModulusStrength === 2 &&
        r.gap.modulusShortfall === true
      );
    },
    why:
      'The proven conditional stability is logarithmic-modulus (strength 1) while ' +
      'O2 needs power-law strength (strength 2) to survive into psi_N ~ 1/N. ' +
      'Demoting the requirement to strength <= 1 would falsely claim the proven ' +
      'modulus suffices.',
  },
  {
    id: 'imp2498-uniqueness-is-not-stability',
    holds: () => {
      const r = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;
      const u = r.provenInputs.backwardUniqueness;
      // Backward uniqueness must stay tagged as uniqueness with zero modulus strength.
      return u.delivers === 'uniqueness' && u.modulusStrength === 0;
    },
    why:
      'Backward uniqueness (log convexity) delivers no quantitative transfer of a ' +
      'rigidity bound. If it were relabeled as stability with positive modulus ' +
      'strength the audit would credit it with a transfer it cannot perform.',
  },
  {
    id: 'imp2498-does-not-close-o2-or-ticket',
    holds: () => {
      const r = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;
      return (
        r.closesO2 === false &&
        r.closesTicket === false &&
        r.subGap.difficulty.includes('research-grade') &&
        r.subGap.anchors === 'esy-port-O2-backward-flow-coupling'
      );
    },
    why:
      'This is a negative availability audit, not a closure. closesO2 and ' +
      'closesTicket must stay false and the residual sub-gap must remain ' +
      'research-grade and anchored to the O2 coupling sub-gap; flipping any of ' +
      'these would overclaim a result the underlying O2 audit (imp-2492) does ' +
      'not support.',
  },
  {
    id: 'imp2498-both-axes-unavailable-joint-with-2497',
    holds: () => {
      const r = IMP2498_ESY_O2_BACKWARD_STABILITY_AVAILABILITY;
      // The joint statement must record BOTH shortfalls on this (PDE) axis, which
      // together with imp-2497 (arithmetic axis) yields the both-axes-open picture.
      return r.gap.conditionalityShortfall === true && r.gap.modulusShortfall === true && r.siblingOf.includes('imp-2497');
    },
    why:
      'The decision-relevant value is that BOTH required inputs (arithmetic via ' +
      'imp-2497, PDE via this audit) are unavailable. If either PDE-axis shortfall ' +
      'were cleared here without a real new theorem, the joint both-axes-open ' +
      'conclusion would be silently weakened.',
  },
];
