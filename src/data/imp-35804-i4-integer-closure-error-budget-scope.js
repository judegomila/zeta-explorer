/**
 * @module imp-35804-i4-integer-closure-error-budget-scope
 *
 * imp-35804 (proof/assessment, S-frontier): SCOPE the imp-35727 ingredient I4 -- the CLOSURE
 * of the accumulated per-segment argument increment around dR = boundary of R = [T_PT,
 * T_PT + Delta] x [-h, h] to a UNIQUE integer N within a strict error budget, at T_PT = 3e12.
 * The argument principle reads N = (1/2pi) * (total change of arg f around dR); the held
 * experimental unwrap (imp-2696) instead returns a NON-INTEGER real (W_pp = 6.413) that a
 * human rounds by eye. imp-35727 named I4 GREENFIELD but never enumerated the error-budget
 * ingredients that turn that human read into a machine-decided integer. This module supplies
 * that enumeration and its ONE structural finding: the I4 <pi budget is a GLOBAL accumulated-
 * error budget, a DIFFERENT quantity from the I2 per-panel <pi increment cap that shares its
 * numeric threshold.
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; certifies no count; sums no increments; allocates
 * no real budget; rounds no total; evaluates no A, B, or C; fixes no Delta or h; changes no
 * bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * INTEGRALITY IS A FREE EXACT FACT; I4 ONLY RESOLVES WHICH INTEGER
 * -----------------------------------------------------------------------------
 * By the argument principle, for f = H_t analytic in R with NO zero ON dR (the I3 precondition),
 * the TRUE total change of arg f around the closed contour dR is EXACTLY 2pi * N with N a
 * non-negative integer -- a theorem, not an approximation. So the only thing standing between
 * the certificate and N is numerical PRECISION: the accumulated interval must isolate which
 * multiple of 2pi the exact total equals. I4 uses integrality -- it never has to compute the
 * total to high absolute accuracy, only tightly enough to name the integer.
 *
 * THE ERROR BUDGET: HALF-WIDTH < pi (interval WIDTH < 2pi)
 * -----------------------------------------------------------------------------
 * Let the certificate accumulate the per-panel argument increments into an interval
 *     total_arg in [S - E, S + E],   E = accumulated interval half-width (error).
 * The exact total is some 2pi * N inside that interval. Dividing by 2pi,
 *     N in [S/2pi - E/2pi, S/2pi + E/2pi].
 * Consecutive integers are spaced 1 apart, so this interval contains AT MOST one integer iff its
 * full width 2E/2pi < 1, i.e. E < pi (equivalently the argument-error interval WIDTH 2E < 2pi).
 * Since the exact 2pi*N is guaranteed inside, "at most one" becomes "exactly one": N = round(S/2pi)
 * is then pinned with NO interpretation. E < pi is the whole I4 requirement.
 *
 * THE STRUCTURAL FINDING: TWO DISTINCT pi THRESHOLDS, NOT ONE
 * -----------------------------------------------------------------------------
 * The winding scope now carries TWO separate "< pi" conditions on the argument, and they are
 * NOT the same requirement despite the shared number:
 *   I2 (imp-35777)  a LOCAL per-panel INCREMENT cap: argwidth F(Z) < pi per panel, so f turns by
 *                   less than a half-plane across each panel and the unwrap cannot alias (skip a
 *                   half-turn). This bounds the increment ITSELF, panel by panel.
 *   I4 (this scope) a GLOBAL accumulated ERROR budget: sum over ALL panels of the per-panel
 *                   argument UNCERTAINTY < pi, so round(S/2pi) resolves a unique integer. This
 *                   bounds the accumulated ERROR on the total, not the increment.
 * The accumulated true increment is 2pi*N and may be MANY multiples of 2pi (large N); that is
 * fine -- I4 caps the uncertainty, never the increment. Flagging the collision is the point:
 * satisfying I2 per panel does NOT give I4, and I4 is not "I2 summed". (Cf. the imp-35803 naming
 * flag that the imp-35725 cap C_t is not the term C -- same discipline, different collision.)
 *
 * PER-EDGE ALLOCATION ACROSS THE FOUR EDGES
 * -----------------------------------------------------------------------------
 * dR has four edges (bottom y=-h, right x=T_PT+Delta, top y=h, left x=T_PT). The accumulated
 * error splits additively:
 *     E = E_bottom + E_right + E_top + E_left  <  pi.
 * The simplest sound allocation is EQUAL: demand E_edge < pi/4 on each edge (a weighted split by
 * edge length or by winding share is equally valid). Each E_edge is the sum over that edge's
 * panels of the per-panel argument uncertainty, which is exactly the argwidth of the I1 argument
 * projection (imp-35803: Delta arg_panel = argwidth F(Z)). So I4 consumes the SAME per-panel boxes
 * I1 produces and I2 / I3 read out -- it is a FUNCTIONAL of I1 (a sum plus a rounding decision),
 * not a new geometric construction.
 *
 * I4 SHARPENS THE PER-PANEL PRECISION DEMAND FROM O(1) TO O(1/P)
 * -----------------------------------------------------------------------------
 * If dR carries P panels total and the budget is split evenly, each panel may contribute argument
 * uncertainty at most ~ pi / P. That is TIGHTER than the I2 per-panel range cap (argwidth F(Z) < pi)
 * by the full panel count P: I2 asks each panel to turn f by less than a half-plane; I4 asks each
 * panel's enclosure to PIN its increment to within ~ pi/P. This is where the I1 convergence property
 * earns its keep -- diam F(Z) -> 0 as a panel subdivides, and faster than P grows, so a fine enough
 * grid drives the summed uncertainty below pi. Illustrative OOM (robust regime, density ~ w/pi ~ 4.28
 * per unit height from imp-35777, so P dominated by the two long edges): for half-height h ~ 1 the two
 * long edges carry ~ 4.28 * 2 * (2h) ~ 17 panels, giving a per-panel demand ~ pi/17 ~ 0.185 rad -- an
 * order of magnitude below the I2 cap pi. P (hence the demand) scales with h and Delta; no h / Delta is
 * fixed here.
 *
 * THE ARTIFACT I4 REMOVES
 * -----------------------------------------------------------------------------
 * imp-2696 measured W_pp = 6.413 (phase-plane unwrapped angle / 2pi) on N = 6000 double-precision
 * samples -- a non-integer real a human reads as "6". That eyeball rounding is exactly the
 * interpretation step a certificate cannot contain. Under the I4 budget E < pi, round(S/2pi) is
 * provably the unique integer, so the count is MACHINE-decided. I4 is the ingredient that converts
 * the imp-2696 human-interpreted real into a certified integer.
 *
 * WHERE I4 SITS
 * -----------------------------------------------------------------------------
 * Downstream of I1 (the per-panel argument-projection increments it sums) and gated by I3 (no zero
 * on dR, so the exact total IS 2pi*N) and I5 (the four edge increments must actually compose into one
 * closed-loop total across the corners). I4's OWN new content is only the error-budget allocation and
 * the rounding decision -- it is the read-out step, the last ingredient before the certified N.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Scoping only. It writes the integrality fact, the E < pi budget (width < 2pi), the four-edge
 * allocation, the O(1/P) per-panel precision sharpening, and the distinction from the I2 per-panel
 * cap. It sums no increments, allocates no real budget, rounds no total, computes no P, evaluates no
 * A / B / C, fixes no Delta or h, certifies no count, changes no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I4 named GREENFIELD, un-scoped)
 * @see imp-35803-i1-interval-enclosure-per-edge-scope (I1 base engine; Delta arg_panel = argwidth F(Z))
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 = LOCAL per-panel increment cap argwidth F < pi)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 = no zero on dR, so exact total is 2pi*N)
 * @see imp-35805 (sibling: I5 corner composition of the four edge increments) -- pending
 * @see imp-2696-winding-lyapunov-experiment (W_pp = 6.413 non-integer human-read count, isRigorous:false)
 * @see imp-35725-w1-effective-error-cap-budget (C_t = E_A + E_B + E_C0; the enclosure error I1 rests on)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35803 / imp-35777) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const TWO_PI = 2 * Math.PI;
const HALF_TURN = Math.PI; // shared numeric threshold of BOTH the I2 cap and the I4 budget
const CLOSURE_ERROR_BUDGET = Math.PI; // I4: accumulated argument HALF-WIDTH must stay under this
const CLOSURE_WIDTH_BUDGET = 2 * Math.PI; // equivalently the argument-error interval WIDTH must stay under this
const EDGE_COUNT = 4; // dR = bottom, right, top, left
const EQUAL_EDGE_BUDGET = Math.PI / 4; // simplest sound allocation: E_edge < pi/4

// Mean winding geometry inherited from imp-35777 / imp-35803 (I4 consumes the same panels).
const LOG_T_OVER_2PI = Math.log(T_PT / TWO_PI); // ~ 26.892
const WINDING_RATE = 0.5 * LOG_T_OVER_2PI; // w(T_PT) ~ 13.446
const PANELS_PER_UNIT_HEIGHT = WINDING_RATE / HALF_TURN; // ~ 4.28 (imp-35777 density)

// The imp-2696 experimental artifact I4 removes: a non-integer real read by eye.
const W_PP_ARTIFACT = 6.413; // imp-2696 phase-plane unwrapped angle / 2pi (non-integer, human-rounded)

// Illustrative OOM per-panel precision demand at half-height h ~ 1 (long edges dominate P).
const ILLUSTRATIVE_H = 1;
const ILLUSTRATIVE_LONG_EDGE_PANELS = PANELS_PER_UNIT_HEIGHT * 2 * (2 * ILLUSTRATIVE_H); // ~ 17
const ILLUSTRATIVE_PER_PANEL_DEMAND = HALF_TURN / ILLUSTRATIVE_LONG_EDGE_PANELS; // ~ pi/17 ~ 0.185 rad

export const IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE = {
  id: 'imp-35804',
  proofSection: 'S-frontier',
  question:
    'Scope what the imp-35727 ingredient I4 -- closure of the accumulated per-segment argument increment around ' +
    'dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h] to a UNIQUE integer N within a strict error budget so no ' +
    'human interpretation of a non-integer real (the imp-2696 W_pp = 6.413) is needed -- requires at T_PT = 3e12. ' +
    'Scoping only; sums no increments; rounds no total; certifies no count; changes no bound; NO QED.',
  integralityFact: {
    theorem:
      'By the argument principle, for f = H_t analytic in R with NO zero on dR (the I3 precondition), the TRUE total ' +
      'change of arg f around the closed contour is EXACTLY 2pi * N, N a non-negative integer -- a theorem, exact.',
    consequence:
      'The only obstacle to N is numerical PRECISION: the accumulated interval must isolate WHICH multiple of 2pi the ' +
      'exact total equals. I4 never needs high absolute accuracy on the total, only enough to name the integer.',
  },
  errorBudget: {
    form:
      'Accumulate the per-panel argument increments into total_arg in [S - E, S + E]; dividing by 2pi, N lies in an ' +
      'interval of full width 2E/2pi. It isolates at most one integer iff 2E/2pi < 1, i.e. E < pi.',
    halfWidthRequirement:
      'Accumulated argument HALF-WIDTH E < pi (equivalently the error interval WIDTH 2E < 2pi); the exact 2pi*N is ' +
      'guaranteed inside, so "at most one" becomes "exactly one" and N = round(S/2pi) is pinned with NO interpretation.',
    halfWidthBudget: CLOSURE_ERROR_BUDGET,
    widthBudget: CLOSURE_WIDTH_BUDGET,
  },
  structuralFinding: {
    finding:
      'The winding scope now carries TWO distinct "< pi" conditions on the argument that share a number but are NOT ' +
      'the same requirement: the I2 (imp-35777) LOCAL per-panel INCREMENT cap argwidth F(Z) < pi (anti-aliasing, bounds ' +
      'the increment per panel) and the I4 GLOBAL accumulated ERROR budget E < pi (integer resolution, bounds the ' +
      'uncertainty on the total).',
    whyNotTheSame:
      'The accumulated TRUE increment is 2pi*N and may be many multiples of 2pi (large N) -- I4 caps the uncertainty, ' +
      'never the increment. So satisfying I2 per panel does NOT give I4, and I4 is not "I2 summed".',
    i2Threshold: 'LOCAL per-panel increment cap: argwidth F(Z) < pi',
    i4Threshold: 'GLOBAL accumulated argument-error budget: E < pi',
    sharedNumber: HALF_TURN,
  },
  perEdgeAllocation: {
    edges: 'bottom (y=-h), right (x=T_PT+Delta), top (y=h), left (x=T_PT); the accumulated error splits additively.',
    split: 'E = E_bottom + E_right + E_top + E_left < pi; simplest sound allocation is EQUAL, E_edge < pi/4 each.',
    functionalOfI1:
      'Each E_edge is the sum over that edge of the per-panel argument uncertainty = argwidth of the I1 argument ' +
      'projection (imp-35803 Delta arg_panel = argwidth F(Z)); I4 consumes the SAME boxes I1 produces -- it is a ' +
      'FUNCTIONAL of I1 (a sum plus a rounding decision), not a new geometric construction.',
    edgeCount: EDGE_COUNT,
    equalEdgeBudget: EQUAL_EDGE_BUDGET,
  },
  perPanelSharpening: {
    demand:
      'With P panels on dR and an even split, each panel may contribute argument uncertainty at most ~ pi/P -- TIGHTER ' +
      'than the I2 per-panel range cap (argwidth F(Z) < pi) by the full panel count P. This is where I1 convergence ' +
      'earns its keep: diam F(Z) -> 0 under subdivision faster than P grows, so a fine enough grid drives E below pi.',
    illustrativeOOM:
      'Robust regime density ~ w/pi ~ 4.28 per unit height (imp-35777), P dominated by the two long edges: for h ~ 1 ' +
      'the long edges carry ~ 4.28 * 2 * (2h) ~ 17 panels, per-panel demand ~ pi/17 ~ 0.185 rad, an OOM below the I2 ' +
      'cap pi. P scales with h and Delta; no h / Delta is fixed here.',
    illustrativeLongEdgePanels: ILLUSTRATIVE_LONG_EDGE_PANELS,
    illustrativePerPanelDemand: ILLUSTRATIVE_PER_PANEL_DEMAND,
    panelsPerUnitHeight: PANELS_PER_UNIT_HEIGHT,
  },
  artifactRemoved: {
    heldArtifact:
      'imp-2696 measured W_pp = 6.413 (phase-plane unwrapped angle / 2pi) on N = 6000 double-precision samples -- a ' +
      'NON-integer real a human reads as "6" (isRigorous:false).',
    i4Fix:
      'Under E < pi, round(S/2pi) is provably the unique integer, so the count is MACHINE-decided; I4 converts the ' +
      'imp-2696 human-interpreted real into a certified integer.',
    wppArtifact: W_PP_ARTIFACT,
  },
  dependencies: {
    upstream: 'Downstream of I1 (the per-panel argument-projection increments it sums; imp-35803).',
    gatedBy:
      'Gated by I3 (no zero on dR so the exact total IS 2pi*N; imp-35758) and I5 (the four edge increments must compose ' +
      'into one closed-loop total across the corners; imp-35805).',
    ownContent: 'I4 own new content is only the error-budget allocation and the rounding decision -- the read-out step.',
  },
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). The imp-35727 ingredient I4 closes the accumulated ' +
    'per-panel argument increment around dR to a UNIQUE integer N. Integrality is a FREE EXACT fact: by the argument ' +
    'principle, with no zero on dR (the I3 precondition) the true total change of arg f is EXACTLY 2pi*N, so I4 needs ' +
    'only PRECISION, not accuracy -- the accumulated interval [S - E, S + E] must isolate one multiple of 2pi, which ' +
    'holds iff the HALF-WIDTH E < pi (error interval WIDTH < 2pi), making N = round(S/2pi) unique with NO ' +
    'interpretation. STRUCTURAL FINDING: this is a SECOND distinct "< pi" condition, NOT the I2 cap -- I2 (imp-35777) ' +
    'is a LOCAL per-panel INCREMENT cap (argwidth F(Z) < pi, anti-aliasing), I4 is a GLOBAL accumulated ERROR budget ' +
    '(E < pi, integer resolution); the true increment is 2pi*N and may be large, so I4 bounds the uncertainty, never ' +
    'the increment, and I4 is not "I2 summed". The error splits over the four edges (E = E_bottom + E_right + E_top + ' +
    'E_left < pi; equal split E_edge < pi/4), each E_edge a sum of the I1 argument-projection argwidths -- so I4 is a ' +
    'FUNCTIONAL of I1 (a sum plus a rounding decision), consuming the same panels I2 / I3 read out. It SHARPENS the ' +
    'per-panel demand from the I2 O(1) cap pi to O(pi/P), met by I1 convergence under subdivision (illustrative h ~ 1: ' +
    'P ~ 17 long-edge panels, demand ~ pi/17 ~ 0.185 rad). I4 converts the imp-2696 W_pp = 6.413 human-read non-integer ' +
    'into a machine-decided certified integer. It sums no increments; allocates no real budget; rounds no total; ' +
    'computes no P; evaluates no A / B / C; fixes no Delta or h; certifies no count; changes no bound; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-35727 (I4 named GREENFIELD, un-scoped); imp-35803 (I1 base engine, Delta arg_panel = argwidth F(Z)); ' +
    'imp-35777 (I2 LOCAL per-panel increment cap argwidth F < pi); imp-35758 (I3 no zero on dR so exact total = 2pi*N); ' +
    'imp-35805 (I5 corner composition, pending); imp-2696 (W_pp = 6.413 non-integer human-read count, isRigorous:false); ' +
    'imp-35725 (effective-error cap C_t = E_A + E_B + E_C0); Polymath15 2019 (H_t = A + B - C; barrier method); ' +
    'Platt-Trudgian 2021.',
};

export const IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE_ASSERTIONS = [
  {
    // Integrality is an exact free fact: true total = 2pi*N; I4 needs precision, not accuracy.
    id: 'imp35804-integrality-exact-free-fact',
    description: 'Argument principle gives exact total = 2pi*N (I3 precondition: no zero on dR); I4 only resolves WHICH integer',
    holds: () =>
      /EXACTLY 2pi \* N/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.integralityFact.theorem) &&
      /no zero on dR/i.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.integralityFact.theorem) &&
      /PRECISION/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.integralityFact.consequence),
  },
  {
    // The budget: half-width E < pi, equivalently error interval width < 2pi; round(S/2pi) unique.
    id: 'imp35804-error-budget-half-width-under-pi',
    description: 'Accumulated argument half-width E < pi (width < 2pi) pins N = round(S/2pi) uniquely',
    holds: () =>
      Math.abs(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.errorBudget.halfWidthBudget - Math.PI) < 1e-15 &&
      Math.abs(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.errorBudget.widthBudget - 2 * Math.PI) < 1e-15 &&
      /E < pi/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.errorBudget.halfWidthRequirement) &&
      /round\(S\/2pi\)/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.errorBudget.halfWidthRequirement),
  },
  {
    // Structural finding: I4 GLOBAL error budget is a DIFFERENT pi from the I2 LOCAL increment cap.
    id: 'imp35804-two-distinct-pi-thresholds',
    description: 'I2 pi = LOCAL per-panel increment cap; I4 pi = GLOBAL accumulated error budget; same number, different quantity',
    holds: () =>
      /LOCAL per-panel INCREMENT cap/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.structuralFinding.finding) &&
      /GLOBAL accumulated ERROR budget/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.structuralFinding.finding) &&
      /not "I2 summed"/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.structuralFinding.whyNotTheSame) &&
      Math.abs(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.structuralFinding.sharedNumber - Math.PI) < 1e-15,
  },
  {
    // Per-edge allocation over 4 edges (equal pi/4) and the O(1/P) per-panel sharpening vs the I2 cap.
    id: 'imp35804-four-edge-allocation-and-per-panel-sharpening',
    description: 'E = sum over 4 edges < pi (equal pi/4); per-panel demand ~ pi/P tighter than I2 cap; illustrative pi/17 ~ 0.185',
    holds: () =>
      IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.perEdgeAllocation.edgeCount === 4 &&
      Math.abs(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.perEdgeAllocation.equalEdgeBudget - Math.PI / 4) < 1e-15 &&
      /FUNCTIONAL of I1/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.perEdgeAllocation.functionalOfI1) &&
      Math.abs(PANELS_PER_UNIT_HEIGHT - WINDING_RATE / Math.PI) < 1e-15 &&
      Math.abs(ILLUSTRATIVE_LONG_EDGE_PANELS - PANELS_PER_UNIT_HEIGHT * 4) < 1e-12 &&
      Math.abs(ILLUSTRATIVE_PER_PANEL_DEMAND - Math.PI / ILLUSTRATIVE_LONG_EDGE_PANELS) < 1e-15 &&
      Math.abs(ILLUSTRATIVE_PER_PANEL_DEMAND - 0.18354) < 1e-3,
  },
  {
    // Artifact removed: imp-2696 W_pp = 6.413 non-integer human-read count -> machine-decided integer.
    id: 'imp35804-removes-imp2696-noninteger-artifact',
    description: 'I4 replaces the imp-2696 W_pp = 6.413 human-rounded non-integer with a machine-decided unique integer',
    holds: () =>
      Math.abs(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.artifactRemoved.wppArtifact - 6.413) < 1e-9 &&
      Number.isInteger(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.artifactRemoved.wppArtifact) === false &&
      /MACHINE-decided/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.artifactRemoved.i4Fix),
  },
  {
    // Honesty gate: scoping only, sums nothing, certifies no count, NO QED, no refereed bound is changed.
    id: 'imp35804-honesty-gate-no-qed',
    description: 'Scoping only; sums no increments; rounds no total; certifies no count; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /certifies no count/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.verdict) &&
      /NO QED/.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE.verdict),
  },
];

for (const a of IMP35804_I4_INTEGER_CLOSURE_ERROR_BUDGET_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35804-i4-integer-closure-error-budget-scope assertion failed: ${a.id}`);
  }
}
