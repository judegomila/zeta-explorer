/**
 * @module imp-97567-krein-lambda3-m2-gate-successor-cohort-index
 * @fileoverview imp-97567 -- META cross-reference index grouping the Krein lambda_3 / m=2-gate lower-bound
 *   SUCCESSOR thread: three tickets (imp-97495, imp-97514, imp-97536) that pick up the imp-97492
 *   c_sharp = lambda_min(P_a M_{sigma_2} P_a) floor-sharpening cohort ONE INDEX UP, moving from bounding
 *   lambda_1/lambda_2 to bounding lambda_2/lambda_3 at the same binding half-width 2a = ln3. Read together
 *   these three form one continuous arc: tighten the Route-2 floor on lambda_2 (imp-97495), show that
 *   tighter floor still cannot feed an m=2 window because the window lives in the wrong (much wider) gap
 *   and needs a certified LOWER bound on lambda_3 instead (imp-97514), then assess every alternative route
 *   to that certified lower bound on lambda_3 and find the m=2 gate structurally unreachable by all of them
 *   (imp-97536). Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (three tickets, chronological, one continuous "one index up" thread).
 *     imp-97495 -- EXTENDS the direct Route-2 A2 reproducing-kernel build to Kbig in {300,340,380},
 *       tightening the rigorous upper edge on the converged Route-2 lower-bound floor for lambda_2 to
 *       -309.931066 (bracket [-313.756, -309.931066]) and REFUTING the imp-97482 geometric-tail estimate
 *       -309.781 (measured delta ratios RISE 0.63 -> 0.70, not the assumed 0.54).
 *     imp-97514 -- ASSESSES whether the m=2 Lehmann-Maehly window enclosure becomes any less vacuous once
 *       fed the generous lambda_1/lambda_2 gap (82.547450) and the imp-97495 finite Route-2 floor. FINDS
 *       both feeds miss: the m=2 shift rho_2 lives in the ~5434-wide (lambda_2, lambda_3) gap, not the
 *       82.547 gap, and the finite Route-2 floor only demonstrates the concentration-wall regress rather
 *       than breaking it -- the m=2 gate needs a certified LOWER bound on lambda_3 exceeding 83.090493.
 *     imp-97536 -- ASSESSES every alternative route to that certified lower bound on lambda_3: min-max on
 *       a positive test subspace and truncated positive-definite compression are both Rayleigh-Ritz UPPER
 *       brackets (wrong direction); Weyl/Lidskii interlacing is the one genuinely distinct handle (it
 *       subtracts B's third-largest eigenvalue rather than the index-blind ||B||=4336.198) but REDUCES to a
 *       certified upper bound on that third-largest eigenvalue -- an unresolved band-limited concentration
 *       estimate for the confined well (fractal/Zygmund eigenfunctions, no certified shoulder). VERDICT:
 *       the m=2 gate is structurally unreachable by min-max/compression/Weyl at 2a=ln3; the productive
 *       residual is named as a certified sub-top spectral bound on B (sub-gap
 *       IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM).
 *
 *   WHY GROUP THESE (not re-derive). Read separately, these three tickets look like a numeric refinement
 *   (imp-97495), a window-placement assessment (imp-97514), and a route survey (imp-97536) across
 *   different sessions. Read together they are ONE thread one index up from imp-97492: each ticket
 *   narrows what would be needed to open the m=2 gate, and the final verdict (imp-97536) closes off every
 *   assessed alternative, naming the one remaining productive residual (a certified sub-top spectral bound
 *   on B) so a future scout does not re-attempt min-max, PD compression, or Weyl/Lidskii expecting a
 *   different outcome, and does not re-attempt Route-2 on lambda_3 expecting it to escape the imp-97415
 *   concentration wall that already blocks it on lambda_2.
 *
 * @see imp-97492-krein-csharp-lower-bound-obstruction-cohort-index.js (the lambda_1/lambda_2 predecessor cohort this thread continues one index up)
 * @see imp-97495-krein-route2-kbig300-380-direct-floor.js (Route-2 floor tightened to -309.931066, imp-97482 geometric tail refuted)
 * @see imp-97514-krein-m2-window-enclosure-assessment.js (m=2 window needs certified lower on lambda_3, not the 82.547 gap or the finite Route-2 floor)
 * @see imp-97536-krein-lambda3-lower-bound-alt-routes-assessment.js (every alternative route to a certified lambda_3 lower bound assessed; m=2 gate structurally unreachable)
 *
 * Ticket: imp-97567 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

const KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97495',
    step: 'extend the direct Route-2 A2 reproducing-kernel build to Kbig in {300,340,380}',
    result:
      'tightens the rigorous upper edge on the Route-2 lower-bound floor for lambda_2 to -309.931066 ' +
      '(bracket [-313.756, -309.931066]); REFUTES the imp-97482 geometric-tail estimate -309.781.',
  }),
  Object.freeze({
    id: 'imp-97514',
    step: 'assess whether the m=2 window enclosure becomes less vacuous fed the 82.547 gap and the imp-97495 floor',
    result:
      'both feeds miss the gate: the m=2 shift lives in the ~5434-wide (lambda_2, lambda_3) gap, and the ' +
      'finite Route-2 floor only demonstrates the concentration-wall regress. The gate needs a certified ' +
      'LOWER bound on lambda_3 exceeding 83.090493.',
  }),
  Object.freeze({
    id: 'imp-97536',
    step: 'assess every alternative route (min-max, Weyl/Lidskii, truncated PD compression) to that bound',
    result:
      'min-max and PD compression are Rayleigh-Ritz UPPER brackets (wrong direction); Weyl/Lidskii is ' +
      'distinct but REDUCES to a certified upper bound on B third-largest eigenvalue. The m=2 gate is ' +
      'structurally unreachable by all assessed alternatives at 2a=ln3.',
  }),
]);

export const IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX = Object.freeze({
  id: 'imp-97567',
  proofSection: 'S-frontier',
  predecessorCohort: 'imp-97492',
  cohort: KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT,
  measuredSignal:
    'three tickets one index up from the imp-97492 lambda_1/lambda_2 cohort narrow the m=2 gate ' +
    'requirement step by step: tighten the Route-2 lambda_2 floor to -309.931066 (imp-97495), show the ' +
    'gate needs a certified lower bound on lambda_3 rather than either newer reading in hand (imp-97514), ' +
    'and close off every assessed alternative route to that bound, naming the one remaining productive ' +
    'residual (imp-97536).',
  namedResiduals: [
    'IMP97495_ROUTE2_FLOOR_TIGHTENED_STILL_FAR_BELOW_REQUIRED',
    'IMP97514_M2_WINDOW_SHIFT_IN_WRONG_GAP_AMPLIFIES_UNBOUNDED_TAIL',
    'IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM',
  ],
  certifiedReach: 0.96,
  lambda2RitzUpperBracket: 83.090493,
  lambda2Route2FloorBracket: [-313.756, -309.931066],
  m2GateOpenedByAnyRoute: false,
  lowerBoundOnLambda3Proved: false,
  question:
    'The Krein lambda_3/m=2-gate successor thread (imp-97495/97514/97536) reads as a numeric refinement, ' +
    'a window-placement assessment, and a route survey across separate sessions. Read together as one ' +
    'thread one index up from the imp-97492 lambda_1/lambda_2 cohort, does the record show the m=2 gate ' +
    'reducing to a certified sub-top spectral bound on B, unreached by every assessed alternative?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). Three tickets form one continuous "one index up" thread from ' +
    'the imp-97492 lambda_1/lambda_2 floor-sharpening cohort: imp-97495 tightens the Route-2 lower-bound ' +
    'floor on lambda_2 to -309.931066 and refutes the imp-97482 geometric-tail estimate; imp-97514 shows ' +
    'neither the generous lambda_1/lambda_2 gap nor that tighter floor feeds the m=2 window, which instead ' +
    'needs a certified lower bound on lambda_3 exceeding the Ritz upper bracket 83.090493; imp-97536 assesses ' +
    'every alternative route to that bound (min-max, Weyl/Lidskii, truncated PD compression) and finds the ' +
    'm=2 gate structurally unreachable by all of them, reducing to a certified sub-top spectral bound on B ' +
    'as the one remaining productive residual. No certified positive lower bound on lambda_3 exists anywhere ' +
    'in this cohort; interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged. Establishes nothing ' +
    'new; moves no bound; RH open; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97495 (Route-2 lambda_2 floor tightened to -309.931066, geometric tail refuted); imp-97514 (m=2 ' +
    'window needs certified lower on lambda_3, wrong gap and finite floor both miss); imp-97536 (every ' +
    'alternative route assessed; m=2 gate structurally unreachable; sub-gap ' +
    'IMP97536_LAMBDA3_LOWER_REDUCES_TO_CERTIFIED_B_SUBTOP_SPECTRUM).',
  ln3: LN3,
});

export default IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97567-cohort-has-all-three-members-in-order',
    why: 'The whole point of the index is grouping exactly these three tickets in chronological order; a ' +
      'missing or reordered member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX.cohort.map((c) => c.id);
      return (
        ids.length === 3 &&
        ids[0] === 'imp-97495' &&
        ids[1] === 'imp-97514' &&
        ids[2] === 'imp-97536'
      );
    },
  },
  {
    id: 'imp97567-named-residuals-and-brackets-present',
    why: 'The index exists to surface the open sub-gaps and the best brackets by name, so future work can ' +
      'find them without re-reading all three tickets.',
    holds: () => {
      const idx = IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 3 &&
        idx.predecessorCohort === 'imp-97492' &&
        idx.m2GateOpenedByAnyRoute === false &&
        idx.lowerBoundOnLambda3Proved === false &&
        idx.lambda2Route2FloorBracket[1] === -309.931066 &&
        idx.lambda2Route2FloorBracket[1] > idx.lambda2Route2FloorBracket[0] &&
        idx.lambda2RitzUpperBracket === 83.090493 &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3
      );
    },
  },
  {
    id: 'imp97567-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX.verdict) &&
      /remains SOTA/.test(IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97567_KREIN_LAMBDA3_M2_GATE_SUCCESSOR_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97567-krein-lambda3-m2-gate-successor-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
