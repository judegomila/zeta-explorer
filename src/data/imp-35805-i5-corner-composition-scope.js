/**
 * @module imp-35805-i5-corner-composition-scope
 *
 * imp-35805 (proof/assessment, S-frontier): SCOPE the imp-35727 ingredient I5 -- CONTINUOUS
 * CORNER COMPOSITION of the four edge argument-increments around the closed rectangle boundary
 * dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h], at T_PT = 3e12. The argument principle
 * reads N = (1/2pi) * (total change of arg f as dR is traversed ONCE); the certificate builds
 * that total as a SUM of four separately-computed edge increments (bottom, right, top, left).
 * For that sum to equal the true closed-loop total, the phase must be tracked CONTINUOUSLY
 * across the four corners -- adjacent-edge enclosures must overlap at each shared corner.
 * imp-35727 named I5 GREENFIELD, noting the held experimental single-window / single-axis
 * sweeps (imp-2696 / imp-33923 / imp-33968) never traverse a closed rectangle, so corner
 * composition is untested. This module supplies that scope and its ONE structural finding:
 * I5 adds NO new enclosure -- given I1 determinism at the shared corner and the I2 corner-panel
 * cap, corner overlap is AUTOMATIC, so I5 own irreducible new content is only the closed-loop
 * TOPOLOGY (consistent orientation + loop-closure back to the start corner).
 *
 * ASSESSMENT / SCOPING ONLY. Ports nothing; composes no increments; evaluates no corner value;
 * checks no overlap; fixes no orientation; traverses no contour; evaluates no A, B, or C; fixes
 * no Delta or h; changes no bound; no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE FOUR CORNERS AND THE SINGLE CLOSED TRAVERSAL
 * -----------------------------------------------------------------------------
 * dR is the boundary of R = [T_PT, T_PT + Delta] x [-h, h], a Jordan curve traversed ONCE,
 * counterclockwise (keeping R on the left so the winding number carries the correct sign):
 *     C1 = (T_PT,           -h)  --bottom-->  C2 = (T_PT + Delta, -h)
 *     C2 = (T_PT + Delta,   -h)  --right -->  C3 = (T_PT + Delta,  h)
 *     C3 = (T_PT + Delta,    h)  --top   -->  C4 = (T_PT,          h)
 *     C4 = (T_PT,            h)  --left  -->  C1 = (T_PT,         -h)  (loop-closure)
 * Four edges, four corners, FOUR hand-offs (one per corner, the last being the loop-closure
 * back to the start C1). The total argument change is the sum of the four edge increments:
 *     total_arg = Delta arg_bottom + Delta arg_right + Delta arg_top + Delta arg_left.
 * I5 is the ingredient that certifies this SUM equals the true continuous change around dR.
 *
 * WHY CORNER OVERLAP IS AUTOMATIC (the finding)
 * -----------------------------------------------------------------------------
 * At each corner C_k the incoming edge ENDS and the outgoing edge STARTS -- both edges include
 * the SAME complex point C_k. Run through the same I1 interval evaluator, the terminal box of
 * the incoming edge and the initial box of the outgoing edge both ENCLOSE the identical true
 * value f(C_k) (indeed, evaluated at an identical coordinate, the I1 corner boxes are the same
 * deterministic interval, not merely overlapping). So the imp-35727 "adjacent enclosures must
 * overlap at each shared corner" requirement is discharged for FREE by I1 inclusion + shared
 * coordinate. The continuation then carries the accumulated phase from the incoming edge to the
 * outgoing edge THROUGH that shared corner argument, inserting NO spurious 2pi jump, PROVIDED
 * the corner argument is pinned to a single branch -- which is exactly the I2 per-panel cap
 * (argwidth F(Z) < pi) applied to the two panels adjacent to the corner, under the I3 floor
 * (|f| >= delta > 0 at the corner, so arg f is well-defined). I5 therefore reads out the SAME
 * corner boxes I1 produces and I2 / I3 already cap -- it builds no new enclosure.
 *
 * THE STRUCTURAL FINDING: I5 IS TOPOLOGY, NOT ANALYSIS
 * -----------------------------------------------------------------------------
 * With overlap automatic (I1 determinism) and the branch pinned (I2 corner-panel cap under the
 * I3 floor), I5 own irreducible new content is only the CLOSED-LOOP BOOKKEEPING that the four
 * edge increments compose into one loop:
 *   (a) ORIENTATION consistency -- all four edges traversed counterclockwise (R on the left) so
 *       the increments add with a consistent sign and total_arg / 2pi is the signed winding /
 *       enclosed-zero count, not a cancellation of mismatched orientations.
 *   (b) LOOP-CLOSURE -- the traversal returns to its start corner C1 (the fourth hand-off is
 *       left-edge-end == bottom-edge-start), so the accumulated phase telescopes into a single
 *       closed change and there is no dangling endpoint.
 * Neither is a new geometric construction or a new evaluation; both are discipline on the ORDER
 * and DIRECTION in which the already-built I1 edge boxes are chained. So I5 is the LIGHTEST of
 * the five ingredients: a gluing / topology layer strictly DOWNSTREAM of I1 (boxes), I2 (branch
 * cap) and I3 (floor), contributing the closed-loop identity rather than any new analysis.
 * (Cf. imp-35804: I4 is likewise a FUNCTIONAL of I1, not a new construction -- same discipline.)
 *
 * RELATION TO I4 (they are the two halves of "make the sum a certified integer")
 * -----------------------------------------------------------------------------
 * I4 (imp-35804) and I5 both act on the accumulated total but answer DIFFERENT questions:
 *   I5  makes the four edge increments a VALID closed-loop sum at all (continuity + orientation
 *       + closure) -- WITHOUT I5 the sum need not be a single winding around dR.
 *   I4  then pins that valid sum to a UNIQUE INTEGER within the < pi accumulated-error budget.
 * I5 is logically PRIOR to I4: composition first (there is one closed total), rounding second
 * (that total is 2pi*N for a unique N). Both consume the same I1 per-panel boxes.
 *
 * WHAT THE HELD SCAFFOLDING LACKS
 * -----------------------------------------------------------------------------
 * imp-2696 / imp-33923 / imp-33968 sweep a SINGLE window or a SINGLE axis and unwrap a sampled
 * phase along it; none traverses a CLOSED rectangle, so none ever composes across a corner or
 * closes a loop -- corner composition is entirely untested (isRigorous:false). I5 is the
 * ingredient that turns four open-arc phase reads into one certified closed-loop winding.
 *
 * WHAT THIS DOES NOT DO
 * -----------------------------------------------------------------------------
 * Scoping only. It writes the four-corner / four-hand-off traversal, the automatic-overlap
 * finding (I1 determinism + I2 corner cap under I3 floor), the topology-not-analysis structural
 * finding (orientation + loop-closure as I5 own content), and the I5-prior-to-I4 ordering. It
 * composes no increments, evaluates no corner value, checks no overlap, fixes no orientation,
 * traverses no contour, evaluates no A / B / C, fixes no Delta or h, certifies no count, changes
 * no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-35727-w2-certified-winding-count-ingredients-scope (I5 named GREENFIELD, un-scoped)
 * @see imp-35803-i1-interval-enclosure-per-edge-scope (I1 base engine; the shared corner boxes I5 chains)
 * @see imp-35777-i2-logderivative-panel-cap-scope (I2 = per-panel branch cap argwidth F < pi; pins the corner branch)
 * @see imp-35758-i3-modulus-floor-margin-tie-scope (I3 = no zero on dR; arg f well-defined at the corner)
 * @see imp-35804-i4-integer-closure-error-budget-scope (I4 = round the valid sum to a unique integer; logically AFTER I5)
 * @see imp-2696-winding-lyapunov-experiment (single-window unwrap, never a closed rectangle, isRigorous:false)
 * @see imp-33923-off-axis-phase-winding-quadrature (single-axis sweep, model cusp, isRigorous:false)
 * @see imp-33968-winding-rate-vs-alpha-curve (single-axis least-squares slope, isRigorous:false)
 * @see Polymath15 2019 (effective approximation H_t = A + B - C; barrier method); Platt-Trudgian 2021
 */

// -- Anchor + operative constants (import-light; matching imp-35803 / imp-35804) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scoping
const HALF_TURN = Math.PI; // the I2 corner-panel branch cap threshold (pins the continuation branch)
const EDGE_COUNT = 4; // dR = bottom, right, top, left
const CORNER_COUNT = 4; // C1, C2, C3, C4
const HANDOFF_COUNT = 4; // one composition per corner; the fourth is the loop-closure back to C1
const ORIENTATION = 'counterclockwise'; // R kept on the left so total_arg / 2pi is the signed count

export const IMP35805_I5_CORNER_COMPOSITION_SCOPE = {
  id: 'imp-35805',
  proofSection: 'S-frontier',
  question:
    'Scope what the imp-35727 ingredient I5 -- continuous CORNER COMPOSITION of the four edge argument-increments ' +
    'around the closed rectangle boundary dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h] into ONE closed-loop ' +
    'total (adjacent-edge enclosures must overlap at each shared corner) -- requires at T_PT = 3e12, given the held ' +
    'experimental single-window / single-axis sweeps never traverse a closed rectangle. Scoping only; composes no ' +
    'increments; fixes no orientation; certifies no count; changes no bound; NO QED.',
  traversal: {
    description:
      'dR is a Jordan curve traversed ONCE counterclockwise (R on the left): C1 = (T_PT, -h) --bottom--> C2 = ' +
      '(T_PT+Delta, -h) --right--> C3 = (T_PT+Delta, h) --top--> C4 = (T_PT, h) --left--> C1 (loop-closure). Four ' +
      'edges, four corners, four hand-offs (the last being left-edge-end == bottom-edge-start).',
    totalArg:
      'total_arg = Delta arg_bottom + Delta arg_right + Delta arg_top + Delta arg_left; I5 certifies this SUM equals ' +
      'the true continuous change of arg f around dR.',
    edgeCount: EDGE_COUNT,
    cornerCount: CORNER_COUNT,
    handoffCount: HANDOFF_COUNT,
    orientation: ORIENTATION,
  },
  overlapAutomatic: {
    finding:
      'At each corner C_k the incoming edge ENDS and the outgoing edge STARTS at the SAME complex point; run through ' +
      'the same I1 evaluator, the terminal box of the incoming edge and the initial box of the outgoing edge both ' +
      'ENCLOSE the identical true value f(C_k) (identical coordinate -> the same deterministic interval, not merely ' +
      'overlapping). So the imp-35727 "adjacent enclosures must overlap at each shared corner" requirement is ' +
      'discharged for FREE by I1 inclusion + shared coordinate.',
    branchPinned:
      'The continuation carries the accumulated phase through that shared corner argument with NO spurious 2pi jump ' +
      'PROVIDED the corner argument is pinned to a single branch -- exactly the I2 per-panel cap (argwidth F(Z) < pi) ' +
      'on the two panels adjacent to the corner, under the I3 floor (|f| >= delta > 0 so arg f is well-defined). I5 ' +
      'reads out the SAME corner boxes I1 produces and I2 / I3 already cap -- it builds no new enclosure.',
  },
  structuralFinding: {
    finding:
      'I5 is TOPOLOGY, NOT ANALYSIS. With overlap automatic (I1 determinism) and the branch pinned (I2 corner-panel ' +
      'cap under the I3 floor), I5 own irreducible new content is only the closed-loop bookkeeping that the four edge ' +
      'increments compose into one loop -- it builds no new enclosure and adds no new evaluation.',
    orientation:
      'ORIENTATION consistency: all four edges traversed counterclockwise (R on the left) so the increments add with ' +
      'a consistent sign and total_arg / 2pi is the SIGNED winding / enclosed-zero count, not a cancellation.',
    loopClosure:
      'LOOP-CLOSURE: the traversal returns to its start corner C1 (the fourth hand-off is left-edge-end == ' +
      'bottom-edge-start), so the accumulated phase telescopes into a single closed change with no dangling endpoint.',
    lightestIngredient:
      'I5 is the LIGHTEST of the five ingredients: a gluing / topology layer strictly DOWNSTREAM of I1 (boxes), I2 ' +
      '(branch cap) and I3 (floor), contributing the closed-loop identity rather than any new analysis. Cf. imp-35804: ' +
      'I4 is likewise a FUNCTIONAL of I1, not a new construction -- same discipline.',
  },
  relationToI4: {
    i5Role:
      'I5 makes the four edge increments a VALID closed-loop sum at all (continuity + orientation + closure); WITHOUT ' +
      'I5 the sum need not be a single winding around dR.',
    i4Role:
      'I4 (imp-35804) then pins that valid sum to a UNIQUE INTEGER within the < pi accumulated-error budget.',
    ordering:
      'I5 is logically PRIOR to I4: composition first (there is ONE closed total), rounding second (that total is ' +
      '2pi*N for a unique N). Both consume the same I1 per-panel boxes.',
  },
  heldScaffoldingLacks:
    'imp-2696 / imp-33923 / imp-33968 sweep a SINGLE window or a SINGLE axis and unwrap a sampled phase along it; none ' +
    'traverses a CLOSED rectangle, so none ever composes across a corner or closes a loop -- corner composition is ' +
    'entirely untested (isRigorous:false). I5 turns four open-arc phase reads into one certified closed-loop winding.',
  isRigorous: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier-direction, NOT rigorous). The imp-35727 ingredient I5 composes the four edge ' +
    'argument-increments (bottom, right, top, left) around dR = boundary of R = [T_PT, T_PT + Delta] x [-h, h] into ' +
    'ONE closed-loop total, so total_arg = sum of the four increments equals the true continuous change of arg f as ' +
    'the Jordan curve is traversed ONCE counterclockwise (four corners, four hand-offs, the fourth being the ' +
    'loop-closure back to the start corner C1). STRUCTURAL FINDING: I5 adds NO new enclosure -- at each corner the ' +
    'incoming and outgoing edges share the SAME complex point, so their I1 boxes enclose the identical value f(C_k) ' +
    '(the imp-35727 corner-overlap requirement is discharged for FREE by I1 inclusion + shared coordinate), and the ' +
    'continuation branch is pinned by the I2 per-panel cap (argwidth F(Z) < pi) on the corner-adjacent panels under ' +
    'the I3 floor (|f| >= delta > 0). I5 own irreducible new content is therefore only the closed-loop TOPOLOGY: ' +
    'ORIENTATION consistency (all edges counterclockwise, R on the left, so total_arg / 2pi is the signed count) and ' +
    'LOOP-CLOSURE (the traversal returns to C1, telescoping the phase into a single closed change). So I5 is TOPOLOGY, ' +
    'NOT ANALYSIS -- the LIGHTEST ingredient, a gluing layer strictly downstream of I1 / I2 / I3, reading out the same ' +
    'corner boxes. I5 is logically PRIOR to I4 (imp-35804): I5 makes the sum a VALID closed loop, I4 rounds that valid ' +
    'sum to a unique integer. The held scaffolding (imp-2696 / imp-33923 / imp-33968) sweeps a single window or axis ' +
    'and never traverses a closed rectangle, so corner composition is entirely untested. It composes no increments; ' +
    'evaluates no corner value; checks no overlap; fixes no orientation; traverses no contour; evaluates no A / B / C; ' +
    'fixes no Delta or h; certifies no count; changes no bound; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35727 (I5 named GREENFIELD, un-scoped); imp-35803 (I1 base engine, the shared corner boxes I5 chains); ' +
    'imp-35777 (I2 per-panel branch cap argwidth F < pi, pins the corner branch); imp-35758 (I3 no zero on dR, arg f ' +
    'well-defined at the corner); imp-35804 (I4 round the valid sum to a unique integer, logically AFTER I5); imp-2696 ' +
    '(single-window unwrap, never a closed rectangle, isRigorous:false); imp-33923 (single-axis sweep, model cusp); ' +
    'imp-33968 (single-axis least-squares slope); Polymath15 2019 (H_t = A + B - C; barrier method); Platt-Trudgian 2021.',
};

export const IMP35805_I5_CORNER_COMPOSITION_SCOPE_ASSERTIONS = [
  {
    // Traversal: one closed Jordan curve, four edges / corners / hand-offs, counterclockwise, sum of increments.
    id: 'imp35805-four-corner-closed-traversal',
    description: 'dR traversed once CCW; four edges, four corners, four hand-offs; total_arg = sum of the four edge increments',
    holds: () =>
      IMP35805_I5_CORNER_COMPOSITION_SCOPE.traversal.edgeCount === 4 &&
      IMP35805_I5_CORNER_COMPOSITION_SCOPE.traversal.cornerCount === 4 &&
      IMP35805_I5_CORNER_COMPOSITION_SCOPE.traversal.handoffCount === 4 &&
      IMP35805_I5_CORNER_COMPOSITION_SCOPE.traversal.orientation === 'counterclockwise' &&
      /loop-closure/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.traversal.description) &&
      /Delta arg_bottom \+ Delta arg_right \+ Delta arg_top \+ Delta arg_left/.test(
        IMP35805_I5_CORNER_COMPOSITION_SCOPE.traversal.totalArg
      ),
  },
  {
    // Overlap is automatic: same corner point -> identical I1 box enclosing f(C_k); branch pinned by I2 under I3.
    id: 'imp35805-corner-overlap-automatic',
    description: 'Shared corner point -> identical I1 corner box (overlap free); branch pinned by the I2 corner cap under I3',
    holds: () =>
      /identical true value f\(C_k\)/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.overlapAutomatic.finding) &&
      /discharged for FREE by I1 inclusion/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.overlapAutomatic.finding) &&
      /argwidth F\(Z\) < pi/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.overlapAutomatic.branchPinned) &&
      /builds no new enclosure/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.overlapAutomatic.branchPinned),
  },
  {
    // Structural finding: I5 is topology (orientation + loop-closure), not analysis; the lightest ingredient.
    id: 'imp35805-topology-not-analysis',
    description: 'I5 own content is only orientation + loop-closure (closed-loop topology), NOT a new enclosure or evaluation',
    holds: () =>
      /TOPOLOGY, NOT ANALYSIS/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.structuralFinding.finding) &&
      /counterclockwise/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.structuralFinding.orientation) &&
      /SIGNED winding/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.structuralFinding.orientation) &&
      /returns to its start corner C1/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.structuralFinding.loopClosure) &&
      /LIGHTEST/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.structuralFinding.lightestIngredient),
  },
  {
    // I5 is logically prior to I4: compose a valid closed loop first, then round to a unique integer.
    id: 'imp35805-prior-to-i4',
    description: 'I5 makes the sum a VALID closed loop (before I4 rounds it to a unique integer); both consume the same I1 boxes',
    holds: () =>
      /VALID closed-loop sum/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.relationToI4.i5Role) &&
      /UNIQUE INTEGER/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.relationToI4.i4Role) &&
      /logically PRIOR to I4/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.relationToI4.ordering) &&
      /same I1 per-panel boxes/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.relationToI4.ordering),
  },
  {
    // Held scaffolding never traverses a closed rectangle -> corner composition untested (isRigorous:false).
    id: 'imp35805-held-scaffolding-never-closes-a-loop',
    description: 'imp-2696 / imp-33923 / imp-33968 sweep a single window/axis, never a closed rectangle; corner composition untested',
    holds: () =>
      /SINGLE window or a SINGLE axis/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.heldScaffoldingLacks) &&
      /never a closed rectangle|none\s+traverses a CLOSED rectangle/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.heldScaffoldingLacks) &&
      /isRigorous:false/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.heldScaffoldingLacks),
  },
  {
    // Honesty gate: scoping only, composes nothing, certifies no count, NO QED, no refereed bound is changed.
    id: 'imp35805-honesty-gate-no-qed',
    description: 'Scoping only; composes no increments; fixes no orientation; certifies no count; changes no bound; NO QED; no refereed bound is changed',
    holds: () =>
      IMP35805_I5_CORNER_COMPOSITION_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      T_PT === 3e12 &&
      Math.abs(HALF_TURN - Math.PI) < 1e-15 &&
      /certifies no count/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.verdict) &&
      /NO QED/.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP35805_I5_CORNER_COMPOSITION_SCOPE.verdict),
  },
];

for (const a of IMP35805_I5_CORNER_COMPOSITION_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35805-i5-corner-composition-scope assertion failed: ${a.id}`);
  }
}
