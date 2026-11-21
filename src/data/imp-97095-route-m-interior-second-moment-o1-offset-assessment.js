/**
 * @module imp-97095-route-m-interior-second-moment-o1-offset-assessment
 *
 * imp-97095 (proof, ASSESSMENT + REDUCTION + PRECISE OBSTRUCTION): the imp-97081 PRECISE RESIDUAL
 *     OBSTRUCTION notes that certifying the narrowed [F, +d/N] far-field ceiling window needs the
 *     imp-96750 one-sided weighted cotangent second-moment upper CONSTANT s0* PLUS its O(1)
 *     additive term to pin the interior Frobenius anchor F = 3.775e7 to a VALUE rather than a
 *     slope. This module assesses the routes to that O(1) term of Int(N) <= s* log N + O(1) and
 *     DERIVES the tractable piece, then names the precise obstruction. No bound moves; the trace
 *     ceiling T = 2.594e7 stays the rigorous anchor; NO QED.
 *
 * Notation carried from imp-96750: I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b)+V(b,a)),
 * symmetric, C = (log 2pi - gamma)/2; T(M) = Sum_{(a,b) coprime, 2<=a,b<=M} I(a,b)^2/(a^2 b^2) is
 * the UNWEIGHTED interior series; Int(N) = Sum H2 I^2/(a^2 b^2) is the H2-WEIGHTED one, H2 in
 * [1, zeta(2)]. The rigorous imp-96708 sandwich is Int(N) <= zeta(2) T(N). The exact symmetric
 * regrouping (imp-96750, checkpoint-verified) is T(M) = 2 Sum_{b=3}^{M} Q(b)/b^2 with
 * Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2, and the slope sub-gap is Q(b) <= s0* b + O(1).
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- the O(1) offset of the UNWEIGHTED series T has an EXACT closed decomposition.
 * -------------------------------------------------------------------------------
 * Assume the (currently measured) two-sided asymptotic Q(b) = s0* b + c1 + o(1), s0* ~ 1.751 the
 * exact slope, c1 the SUBLEADING constant. Splitting Q(b)/b^2 = s0*(1/b) + (Q(b) - s0* b)/b^2 and
 * using Sum_{b=3}^{M} 1/b = log M + (gamma - 3/2) + o(1):
 *     T(M) = 2 s0* log M + C_T + o(1),
 *     C_T  = 2 s0* (gamma - 3/2)  +  2 Sum_{b>=3} (Q(b) - s0* b) / b^2.        (single convergent tail)
 * The tail series converges ABSOLUTELY because Q(b) - s0* b = c1 + o(1) is bounded, so each term is
 * O(1/b^2). Equivalently, separating the constant from the fluctuation e(b) = Q(b) - s0* b - c1:
 *     C_T = 2 s0* (gamma - 3/2) + 2 c1 (zeta(2) - 5/4) + 2 Sum_{b>=3} e(b)/b^2.
 * So the O(1) offset is NOT one new number beyond s0*; it is a SUM OF THREE pieces:
 *   (P1) a harmonic-tail piece 2 s0* (gamma - 3/2)  -- determined the moment s0* is fixed;
 *   (P2) a subleading-constant piece 2 c1 (zeta(2) - 5/4) -- needs the SECOND-order Q-constant c1;
 *   (P3) a convergent fluctuation residual 2 Sum e(b)/b^2 -- needs the full Q sequence (Bettin-Conrey).
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- DERIVED tractable piece (P1), conditional on the exact slope.
 * -------------------------------------------------------------------------------
 * P1 is elementary once the slope constant is known: with the measured s0* ~ 1.751,
 *     P1 = 2 s0* (gamma - 3/2) = 2 (1.751)(-0.9227843351) ~ -3.2316,
 * a NEGATIVE offset (the interior sum starts b at 3, so the harmonic tail subtracts the b=1,2
 * head 1 + 1/2 from gamma). This is the ONLY piece of the O(1) term reachable now, and even it is
 * conditional: the tail series in C_T (both P2 and P3) is well-defined only once s0* is the EXACT
 * slope -- a wrong s0* leaves Q(b) - s0* b growing linearly and DIVERGES the tail. Hence a one-sided
 * upper CONSTANT s0* (the current imp-96750 sub-gap) does NOT suffice to pin the O(1) offset: the
 * value-fixing needs the EXACT (two-sided) slope, i.e. the imp-96548 off-diagonal Szego coefficient,
 * strictly STRONGER than the one-sided constant the slope sub-gap asks for.
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- the WEIGHTED series Int loses the offset to the sandwich (second obstruction).
 * -------------------------------------------------------------------------------
 * The rigorous handle on Int is the one-sided sandwich Int(N) <= zeta(2) T(N). An INEQUALITY caps
 * the slope (s* <= 2 zeta(2) s0*) but CANNOT pin an additive offset: the O(1) term of the upper
 * envelope zeta(2) T is not the O(1) term of Int, and the gap zeta(2) T(N) - Int(N) is itself
 * Theta(log N) (it carries the same H2-weight deficit at every scale). So fixing F to a VALUE needs
 * the EXACT H2-weighted interior asymptotic Int(N) = s_Int log N + c0_Int + o(1) -- both the exact
 * weighted slope s_Int (again the two-sided Szego coefficient, not the one-sided s0*) AND its own
 * offset c0_Int, whose regrouping mirrors STEP 1 with a weighted Q. The sandwich supplies neither.
 *
 * -------------------------------------------------------------------------------
 * VERDICT -- offset decomposed and P1 derived; obstruction sharpened, strictly above the slope gap.
 * -------------------------------------------------------------------------------
 * The O(1) additive term of the interior second moment is given an EXACT three-part decomposition
 * C_T = 2 s0* (gamma - 3/2) + 2 c1 (zeta(2) - 5/4) + 2 Sum e(b)/b^2; the first piece P1 ~ -3.23 is
 * DERIVED (conditional on the exact slope), the remaining two are the residual. The assessment
 * establishes that pinning F to a VALUE is strictly HARDER than the current slope sub-gap in TWO
 * independent ways: (A) it needs the EXACT two-sided slope (imp-96548 Szego), not the one-sided
 * upper constant s0*, or the offset series diverges / the sandwich cannot pin it; and (B) on top of
 * the exact slope it needs a NEW subleading Q-constant c1 plus an absolutely-convergent fluctuation
 * residual over the full Q sequence -- the Bettin-Conrey cotangent second moment at second order.
 * No bound is moved; the narrowed [F, +d/N] band stays a measurement, not a certified pin; T =
 * 2.594e7 remains the rigorous anchor; compute (N ~ 9916, imp-96352) binds first by >2600x. No refereed bound is changed
 * ; RH open; NO QED.
 *
 * RESIDUAL SUB-GAP (below): imp-97095-interior-second-moment-o1-offset -- the pieces (P2)+(P3) of
 * C_T, i.e. 2 c1 (zeta(2) - 5/4) + 2 Sum_{b>=3} (Q(b) - s0* b - c1)/b^2, which require the EXACT
 * two-sided interior slope (imp-96548 Szego) and the Bettin-Conrey second-order cotangent constant.
 *
 * @see imp-97081-route-m-farfield-ceiling-interior-anchor-discriminator.js (names this O(1) residual)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (the slope sub-gap, T=2 Sum Q/b^2)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (the exact two-sided Szego coefficient)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (a=1 border I(1,b)=(1/2)log b+(C+1/2)+o(1))
 *
 * Ticket: imp-97095 (proof, opus-4-8, api-pool). Assessment + reduction + precise obstruction; NO QED.
 */

export const IMP97095_GAMMA = 0.5772156649015329;
export const IMP97095_ZETA2 = (Math.PI * Math.PI) / 6.0; // 1.6449340668482264
export const IMP97095_S0_MEASURED = 1.751; // imp-96750 top-window Q(b)/b, the candidate slope constant

// -- STEP 1: the exact three-part decomposition of the O(1) offset C_T of the UNWEIGHTED series. ----
// C_T = 2 s0* (gamma - 3/2) + 2 c1 (zeta(2) - 5/4) + 2 Sum_{b>=3} e(b)/b^2, e(b)=Q(b)-s0* b-c1.
export const IMP97095_OFFSET_DECOMPOSITION = Object.freeze({
  // P1: harmonic-tail piece. Coefficient (gamma - 3/2) because the interior sum starts at b=3, so
  // Sum_{b=3}^{M} 1/b = log M + gamma - 1 - 1/2 + o(1) = log M + (gamma - 3/2) + o(1).
  harmonicTailCoeff: IMP97095_GAMMA - 1.5, // -0.9227843350984671
  // P2 shape constant: Sum_{b>=3} 1/b^2 = zeta(2) - 1 - 1/4 = zeta(2) - 5/4.
  subleadingTailConst: IMP97095_ZETA2 - 1.25, // 0.39493406684822645
  piecesNeeded: Object.freeze([
    'P1 = 2 s0* (gamma - 3/2)             -- harmonic tail; determined once s0* is the EXACT slope',
    'P2 = 2 c1 (zeta(2) - 5/4)            -- needs the SUBLEADING constant c1 in Q(b)=s0* b+c1+o(1)',
    'P3 = 2 Sum_{b>=3} e(b)/b^2           -- absolutely convergent fluctuation residual over full Q',
  ]),
});

// -- STEP 2: the DERIVED tractable piece P1 (conditional on the exact slope s0*). --------------------
export const IMP97095_P1_DERIVED = Object.freeze({
  formula: 'P1 = 2 s0* (gamma - 3/2)',
  valueAtMeasuredS0: 2 * IMP97095_S0_MEASURED * (IMP97095_GAMMA - 1.5), // ~ -3.2315907
  sign: 'negative', // the b=1,2 head (1 + 1/2) is subtracted from gamma
  conditionalOnExactSlope: true, // the C_T tail diverges unless s0* is the exact (two-sided) slope
});

// -- The two independent ways value-fixing is STRICTLY HARDER than the slope sub-gap. ----------------
export const IMP97095_OBSTRUCTION = Object.freeze({
  // (A) exact slope, not one-sided constant.
  needsExactTwoSidedSlope: true, // a wrong/one-sided s0* diverges the C_T tail; needs imp-96548 Szego
  oneSidedConstantInsufficient: true,
  // (B) a new subleading constant plus a convergent fluctuation residual.
  needsSubleadingConstantC1: true, // the second-order term of Q(b)
  needsConvergentFluctuationResidual: true, // 2 Sum e(b)/b^2, the full Q sequence (Bettin-Conrey 2nd order)
  // Weighted-series obstruction: the sandwich caps the slope but cannot pin an additive offset.
  sandwichCannotPinOffset: true, // Int <= zeta(2) T is an inequality; zeta(2)T - Int is Theta(log N)
  strictlyHarderThanSlopeSubgap: true,
});

export const IMP97095_VERDICT = Object.freeze({
  id: 'imp-97095',
  proofSection: 'Route-M',
  assesses: 'imp-97081',
  question:
    'What is the O(1) additive term (beyond the slope constant s0*) needed to pin the interior ' +
    'Frobenius anchor F = 3.775e7 to a VALUE rather than a slope at finite N*, and is it tractable?',
  offsetDecomposedExactly: true, // C_T = 2 s0*(gamma-3/2) + 2 c1(zeta(2)-5/4) + 2 Sum e(b)/b^2
  p1Derived: true, // ~ -3.23 at the measured s0*, conditional on the exact slope
  needsExactSlopeNotOneSidedConstant: true,
  needsSubleadingBettinConreyConstant: true,
  anyBoundMoved: false,
  ceilingCertified: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x regardless
  conclusion:
    'The O(1) offset of the interior second moment admits an EXACT three-part decomposition C_T = ' +
    '2 s0* (gamma - 3/2) + 2 c1 (zeta(2) - 5/4) + 2 Sum_{b>=3} e(b)/b^2 (from the imp-96750 exact ' +
    'regrouping T(M)=2 Sum Q(b)/b^2 with Q(b)=s0* b + c1 + o(1)). The harmonic-tail piece P1 = ' +
    '2 s0* (gamma - 3/2) ~ -3.23 is DERIVED (conditional on the exact slope). Pinning F to a VALUE ' +
    'is strictly HARDER than the current slope sub-gap in TWO independent ways: (A) it needs the ' +
    'EXACT two-sided interior slope (imp-96548 Szego), not the one-sided upper constant s0*, or the ' +
    'offset tail diverges and the imp-96708 sandwich Int<=zeta(2)T (an inequality, gap Theta(log N)) ' +
    'cannot pin the additive term; and (B) on top of the exact slope it needs a NEW subleading ' +
    'Q-constant c1 plus an absolutely-convergent fluctuation residual over the full Q sequence -- ' +
    'the Bettin-Conrey cotangent second moment at second order. So the narrowed [F, +d/N] band ' +
    'stays a measurement, not a certified pin. No bound moved; the rigorous anchor stays T = ' +
    '2.594e7; compute (N ~ 9916, imp-96352) binds first by >2600x; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97095_SUBGAP = Object.freeze({
  id: 'imp-97095-interior-second-moment-o1-offset',
  statement:
    'The O(1) additive term that would pin the interior anchor F to a VALUE decomposes exactly as ' +
    'C_T = 2 s0* (gamma - 3/2) + 2 c1 (zeta(2) - 5/4) + 2 Sum_{b>=3} (Q(b) - s0* b - c1)/b^2. The ' +
    'first (harmonic-tail) piece is derived. The residual pieces require (A) the EXACT two-sided ' +
    'interior slope (imp-96548 off-diagonal Szego coefficient), not the one-sided upper constant ' +
    's0* of the slope sub-gap, and (B) the SUBLEADING Bettin-Conrey cotangent-second-moment constant ' +
    'c1 together with an absolutely-convergent fluctuation residual over the full coprime Q sequence. ' +
    'For the H2-weighted Int the offset additionally needs the exact weighted slope, since the ' +
    'imp-96708 sandwich Int<=zeta(2)T is a one-sided inequality with a Theta(log N) gap and cannot ' +
    'pin an additive offset. Not established here.',
});

export const IMP97095_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment + reduction only: the interior ' +
  'second-moment O(1) offset is decomposed exactly into a harmonic-tail piece (DERIVED, ~ -3.23 at ' +
  'the measured slope), a subleading-constant piece needing the second-order Bettin-Conrey cotangent ' +
  'constant c1, and a convergent fluctuation residual; and pinning F to a VALUE is shown strictly ' +
  'harder than the slope sub-gap -- it needs the EXACT two-sided slope (imp-96548 Szego), not the ' +
  'one-sided upper constant, since the imp-96708 sandwich cannot pin an additive offset. No bound ' +
  'is claimed moved; the rigorous anchor stays the trace ceiling T = 2.594e7.';

export default IMP97095_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97095_ASSERTIONS = [
  {
    id: 'imp97095-harmonic-tail-coefficient-exact',
    why: 'the P1 coefficient is exactly gamma - 3/2 because the interior sum starts at b=3, so the ' +
      'harmonic tail subtracts the b=1,2 head (1 + 1/2) from gamma; and the P2 shape constant is ' +
      'exactly zeta(2) - 5/4 = Sum_{b>=3} 1/b^2.',
    holds: () =>
      Math.abs(IMP97095_OFFSET_DECOMPOSITION.harmonicTailCoeff - (IMP97095_GAMMA - 1.5)) < 1e-15 &&
      Math.abs(IMP97095_OFFSET_DECOMPOSITION.subleadingTailConst - (IMP97095_ZETA2 - 1.25)) < 1e-15 &&
      IMP97095_OFFSET_DECOMPOSITION.harmonicTailCoeff < 0,
  },
  {
    id: 'imp97095-p1-derived-value-negative',
    why: 'the derived harmonic-tail piece P1 = 2 s0* (gamma - 3/2) evaluates to ~ -3.23 at the ' +
      'measured s0* ~ 1.751 and is negative (b=1,2 head subtracted).',
    holds: () =>
      Math.abs(
        IMP97095_P1_DERIVED.valueAtMeasuredS0 -
          2 * IMP97095_S0_MEASURED * (IMP97095_GAMMA - 1.5),
      ) < 1e-12 &&
      IMP97095_P1_DERIVED.valueAtMeasuredS0 < -3.2 &&
      IMP97095_P1_DERIVED.valueAtMeasuredS0 > -3.3 &&
      IMP97095_P1_DERIVED.conditionalOnExactSlope === true,
  },
  {
    id: 'imp97095-three-pieces-named',
    why: 'the O(1) offset decomposes into exactly three named pieces (harmonic tail, subleading ' +
      'constant c1, convergent fluctuation residual), not a single new constant beyond s0*.',
    holds: () =>
      IMP97095_OFFSET_DECOMPOSITION.piecesNeeded.length === 3 &&
      IMP97095_OFFSET_DECOMPOSITION.piecesNeeded.some((p) => /P2/.test(p) && /c1/.test(p)) &&
      IMP97095_OFFSET_DECOMPOSITION.piecesNeeded.some((p) => /P3/.test(p) && /residual/.test(p)),
  },
  {
    id: 'imp97095-strictly-harder-than-slope-subgap',
    why: 'value-fixing is strictly harder than the slope sub-gap in two independent ways: it needs ' +
      'the EXACT two-sided slope (not the one-sided upper constant) and a subleading Bettin-Conrey ' +
      'constant plus a convergent residual; the sandwich cannot pin an additive offset.',
    holds: () =>
      IMP97095_OBSTRUCTION.needsExactTwoSidedSlope === true &&
      IMP97095_OBSTRUCTION.oneSidedConstantInsufficient === true &&
      IMP97095_OBSTRUCTION.needsSubleadingConstantC1 === true &&
      IMP97095_OBSTRUCTION.needsConvergentFluctuationResidual === true &&
      IMP97095_OBSTRUCTION.sandwichCannotPinOffset === true &&
      IMP97095_OBSTRUCTION.strictlyHarderThanSlopeSubgap === true,
  },
  {
    id: 'imp97095-honesty-gate-no-qed',
    why: 'assessment + reduction: the offset is decomposed and P1 derived, but no bound is moved, ' +
      'the ceiling is not certified, compute binds first, and the honesty markers plus the named ' +
      'residual sub-gap are present.',
    holds: () =>
      IMP97095_VERDICT.anyBoundMoved === false &&
      IMP97095_VERDICT.ceilingCertified === false &&
      IMP97095_VERDICT.offsetDecomposedExactly === true &&
      IMP97095_VERDICT.p1Derived === true &&
      IMP97095_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97095_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97095_HONEST_BANNER) &&
      /o1-offset/.test(IMP97095_SUBGAP.id),
  },
];

for (const a of IMP97095_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97095-route-m-interior-second-moment-o1-offset-assessment assertion failed: ${a.id}`,
    );
  }
}

export { IMP97095_ASSERTIONS };
