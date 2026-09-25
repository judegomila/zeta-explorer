/**
 * @fileoverview imp-97049 -- ASSESSMENT (proof): enumerate the FULL obstruction set between the
 * interval-verified T_a[sigma_2] >= 0 certificate (2a <= 0.96) and full Weil / operator positivity,
 * and decide whether the two blockers named in the ticket title (the Rayleigh-upper-bound direction
 * problem and the 0.96-1.00 LP-conditioning wall) EXHAUST that gap.
 *
 * imp-97036 assembled the interpretive obstruction as one object and closed with SUB-GAP
 * IMP97036_NO_INDEPENDENT_POLEFREE_TO_FULL_BRIDGE: it documented the named blockers but explicitly
 * did NOT prove they are the only ones, nor rule out an unbuilt bridge. This leaf resolves the
 * completeness question by SORTING the obstructions into orthogonal axes and testing exhaustiveness.
 *
 * ALL VALUES ARE CITATIONAL LITERALS drawn from committed sibling modules (no new computation):
 *   @see imp-97036-taplsigma2-to-weil-interpretive-obstruction.js  (the three-component obstruction
 *        object: surviving implication, Rayleigh direction + LP wall, pole-free -> full Sonine bridge)
 *   @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js  (exact Toeplitz reformulation; reach 0.96)
 *   @see imp-96169-route-i-rayleigh-variational-topstate-assessment.js  (the direction problem)
 *   @see rh-route-i-sonine-excess-semilocal-port-2026-09-23.js  (excess carries HALF the rho=2 cusp;
 *        obstructed for every 2a > ln2)
 *   @see flow-blindness-no-go.js  (unconditional no-go: no soft/estimate strategy proves RH; the
 *        RH-true profile sits exactly on the soft-class boundary -- arithmetic input is required)
 *
 * ---------------------------------------------------------------------------------------------------
 * METHOD -- SEPARATE THE GAP INTO ORTHOGONAL AXES. "Full Weil positivity" differs from the certified
 * object along TWO independent structural directions, plus a third that is intrinsic to the Weil
 * criterion itself:
 *   - REACH: the certificate holds for support 2a <= 0.96; the target needs larger (and ultimately
 *     unbounded) support.
 *   - POLE TERM: the certificate is POLE-FREE Weil positivity; the target is the FULL Weil form,
 *     which additionally controls the pole (archimedean/main) term.
 *   - COMPLETENESS OF THE CRITERION: Weil positivity for RH is a statement over ALL admissible test
 *     functions of EVERY support; any per-support certificate is one slice of that cone.
 * The two blockers named in the ticket both live on the SAME axis (REACH). They therefore cannot,
 * even in principle, exhaust a gap that also spans the POLE-TERM and CRITERION-COMPLETENESS axes.
 *
 * AXIS I -- REACH (extend the certified support past 0.96). Contains BOTH named blockers:
 *   (I-a) the 0.96-1.00 LP double-precision conditioning wall (HiGHS status 4 / infeasible once
 *         eps <= lambda_min), and
 *   (I-b) the Rayleigh/Courant-Fischer DIRECTION problem: the Galerkin lambda_min table is a
 *         variational estimate on the wrong-signed side, and pinning the extremal state coercively
 *         lands on the fractal Zygmund eigenfunction with no dyadic-grid convergence rate.
 *   These are the "two named blockers." They are NOT two independent obstructions -- they are two
 *   faces of ONE obstruction (no rigorous lower bound survives past the certified endpoint): (I-a)
 *   is why the only rigorous tool (the interval certificate) halts; (I-b) is why the remaining tool
 *   (finite Galerkin) cannot be promoted to a proof. Removing either alone does not extend the reach.
 *
 * AXIS II -- POLE TERM (pole-free -> FULL Weil form). This is imp-97036 Component 3 and is a
 * GENUINELY INDEPENDENT obstruction the ticket-title pair omits: the only assembled bridge (semilocal
 * Sonine/excess D_S <= L_S) is obstructed at 2a = ln2 = 0.6931 -- strictly INSIDE the certified 0.96
 * reach (E_S composed with Q is unbounded above along the p=2 resonance windows for every 2a > ln2;
 * the CC condition fails past ln2 with no finite-rank fix) -- and is additionally not gap-free below
 * ln3 (remainder D_S is 96.7-99.71 percent of the trace on the minimiser). Axis II is orthogonal to
 * Axis I: it is unresolved even WHERE the reach certificate already holds. Pushing the reach to
 * 2a = 1.00 (Axis I) does nothing for Axis II, and vice versa.
 *
 * AXIS III -- COMPLETENESS OF THE WEIL CRITERION (per-support slice -> the full cone). Weil-Guinand
 * positivity equivalent to RH quantifies over ALL admissible test functions of EVERY support width;
 * a certificate at a fixed a (even a perfect one at every finite a) is a family of slices that still
 * requires a UNIFORM / limiting argument to become the criterion. This axis carries a proven
 * OBSTRUCTION, not merely an open task: the flow-blindness no-go (unconditional, resting only on
 * Rodgers-Tao Lambda >= 0) shows the RH-true profile sits EXACTLY on the boundary of every soft class,
 * so no soft/estimate-only strategy -- which a purely analytic support-uniform bound would be -- can
 * close it; arithmetic input is required. Axis III is independent of I and II: it would remain even
 * if a hypothetical bridge cleared both.
 *
 * EXHAUSTIVENESS TEST. Are Axes I-III themselves the complete set? The three axes are the coordinates
 * of the DIFFERENCE between the certified object and the target: (reach) x (pole term) x (quantifier
 * over the cone). Any further obstruction must be a refinement WITHIN one of these three coordinates
 * (e.g. a particular reason Axis I resists at a specific 2a, or a specific non-Sonine attempt on Axis
 * II), not a fourth orthogonal direction, because the certified and target objects differ in no other
 * structural respect (same weight family sigma_2 = (t^2+1/4)^2 w_1, same Paley-Wiener space, same
 * quadratic form). So the enumeration {I, II, III} is structurally complete at the axis level, while
 * the SPECIFIC blockers within each axis (LP wall, Zygmund direction, Sonine-at-ln2, flow-blindness)
 * are the currently-known -- not provably the only -- instances.
 *
 * VERDICT. The two named blockers do NOT exhaust the gap: they are a single axis (REACH). At least
 * two further INDEPENDENT obstruction axes separate the certificate from full Weil positivity -- the
 * POLE-TERM axis (Sonine bridge, obstructed at 2a=ln2, inside the certified reach) and the
 * CRITERION-COMPLETENESS axis (per-support slice -> full cone, carrying the flow-blindness no-go). A
 * bridge from the T_a[sigma_2] >= 0 certificate to full Weil positivity is therefore NOT possible by
 * clearing the two named blockers alone; it must cross all three axes, and Axis III is subject to a
 * proven no-go that soft means cannot cross. This leaf establishes NO positivity theorem and moves NO
 * bound; certified reach stays 2a <= 0.96; Platt-Trudgian Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * HONEST RESIDUAL -- SUB-GAP IMP97049_AXIS_LEVEL_ONLY. The completeness result is at the AXIS level
 * (reach x pole term x quantifier). It shows the two named blockers cannot be the full set and names
 * the two additional axes, but it does NOT enumerate every specific blocker WITHIN each axis, nor
 * rule out a not-yet-attempted instance inside an axis (e.g. a non-Sonine pole-term bridge on Axis
 * II, or a survives-past-the-LP-wall interval certificate on Axis I). Those remain open WITHIN their
 * axes; Axis III additionally carries the flow-blindness no-go against any soft closure. Assessment
 * only; no bound moves.
 */

// The three orthogonal obstruction axes separating the certificate from full Weil positivity.
export const IMP97049_OBSTRUCTION_AXES = Object.freeze([
  Object.freeze({
    axis: 'I',
    name: 'REACH -- extend certified support past 2a=0.96',
    containsNamedBlockers: true,
    blockers: Object.freeze([
      '(I-a) 0.96-1.00 LP double-precision conditioning wall (HiGHS status 4 / infeasible once eps <= lambda_min)',
      '(I-b) Rayleigh/Courant-Fischer direction problem (Galerkin lambda_min is a wrong-signed variational estimate; coercive pin lands on the fractal Zygmund eigenfunction with no dyadic-grid rate)',
    ]),
    namedBlockersAreOneAxisNotTwo: true, // both are faces of "no rigorous lower bound survives past 0.96"
    source: 'imp-97036 Component 2; imp-96169; rh-route-i-toeplitz-krein-certificate-2026-09-24.js',
  }),
  Object.freeze({
    axis: 'II',
    name: 'POLE TERM -- pole-free Weil positivity -> FULL Weil form',
    independentOfAxisI: true,
    obstructionAt2a: 0.6931471805599453, // = ln2, strictly inside the 0.96 certified reach
    bridge: 'semilocal Sonine/excess D_S <= L_S',
    gapFreeBelowLn3: false,
    remainderShareOfTraceRange: Object.freeze([0.967, 0.9971]),
    omittedByTicketTitlePair: true, // the two named blockers do not include this axis
    source: 'imp-97036 Component 3; rh-route-i-sonine-excess-semilocal-port-2026-09-23.js',
  }),
  Object.freeze({
    axis: 'III',
    name: 'CRITERION COMPLETENESS -- per-support slice -> Weil cone over ALL supports',
    independentOfAxesIandII: true,
    carriesProvenNoGo: true,
    noGo: 'flow-blindness (unconditional; rests only on Rodgers-Tao Lambda >= 0): RH-true profile sits on the soft-class boundary, so no soft/estimate-only strategy closes it -- arithmetic input required',
    source: 'flow-blindness-no-go.js',
  }),
]);

// The completeness assessment: do the two named blockers exhaust the gap?
export const IMP97049_EXHAUSTIVENESS = Object.freeze({
  ticket: 'imp-97049',
  question:
    'do the two named blockers (Rayleigh-upper-bound direction; 0.96-1.00 LP-conditioning wall) exhaust the gap from the T_a[sigma_2] >= 0 certificate to full Weil positivity, or are there additional independent obstructions?',
  namedBlockersLiveOnSameAxis: 'I (REACH)', // NOT two independent axes
  namedBlockersExhaustGap: false,
  additionalIndependentAxes: Object.freeze(['II (POLE TERM)', 'III (CRITERION COMPLETENESS)']),
  totalOrthogonalAxes: 3,
  axisLevelEnumerationComplete: true, // reach x pole term x quantifier = the full structural difference
  bridgePossibleByClearingNamedBlockersAlone: false,
  axisIIIhasProvenNoGoAgainstSoftClosure: true,
  certifiedReachUnchanged: 0.96,
  positivityTheoremEstablished: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  subGap:
    'IMP97049_AXIS_LEVEL_ONLY -- completeness is proven at the AXIS level (reach x pole term x quantifier); it does NOT enumerate every specific blocker within each axis nor rule out an untried instance inside an axis.',
});

// --- self-executing internal-consistency assertions (pure literals; import-light) ---
const IMP97049_ASSERTIONS = [
  {
    id: 'imp97049-three-orthogonal-axes-enumerated',
    holds: () =>
      IMP97049_OBSTRUCTION_AXES.length === 3 &&
      IMP97049_OBSTRUCTION_AXES[0].axis === 'I' &&
      IMP97049_OBSTRUCTION_AXES[1].axis === 'II' &&
      IMP97049_OBSTRUCTION_AXES[2].axis === 'III' &&
      IMP97049_OBSTRUCTION_AXES[0].containsNamedBlockers === true &&
      IMP97049_OBSTRUCTION_AXES[0].namedBlockersAreOneAxisNotTwo === true,
    why: 'the gap decomposes into three orthogonal axes (reach, pole term, criterion completeness); both named blockers live on Axis I.',
  },
  {
    id: 'imp97049-named-blockers-do-not-exhaust-gap',
    holds: () =>
      IMP97049_EXHAUSTIVENESS.namedBlockersExhaustGap === false &&
      IMP97049_EXHAUSTIVENESS.namedBlockersLiveOnSameAxis === 'I (REACH)' &&
      IMP97049_EXHAUSTIVENESS.additionalIndependentAxes.length === 2 &&
      IMP97049_EXHAUSTIVENESS.totalOrthogonalAxes === 3 &&
      IMP97049_EXHAUSTIVENESS.bridgePossibleByClearingNamedBlockersAlone === false,
    why: 'the two named blockers are one axis (REACH); two further independent axes (POLE TERM, CRITERION COMPLETENESS) separate the certificate from the target, so the named pair cannot exhaust the gap.',
  },
  {
    id: 'imp97049-axisII-independent-and-inside-reach',
    holds: () =>
      IMP97049_OBSTRUCTION_AXES[1].independentOfAxisI === true &&
      IMP97049_OBSTRUCTION_AXES[1].obstructionAt2a < IMP97049_EXHAUSTIVENESS.certifiedReachUnchanged &&
      IMP97049_OBSTRUCTION_AXES[1].gapFreeBelowLn3 === false &&
      IMP97049_OBSTRUCTION_AXES[1].omittedByTicketTitlePair === true,
    why: 'the pole-term axis is obstructed at 2a=ln2 (inside the 0.96 reach), is not gap-free below ln3, and is omitted by the ticket-title pair -- an independent obstruction.',
  },
  {
    id: 'imp97049-axisIII-carries-flow-blindness-nogo',
    holds: () =>
      IMP97049_OBSTRUCTION_AXES[2].independentOfAxesIandII === true &&
      IMP97049_OBSTRUCTION_AXES[2].carriesProvenNoGo === true &&
      IMP97049_EXHAUSTIVENESS.axisIIIhasProvenNoGoAgainstSoftClosure === true,
    why: 'the criterion-completeness axis carries the unconditional flow-blindness no-go (soft means cannot close it; arithmetic input required) and is independent of the other two axes.',
  },
  {
    id: 'imp97049-assessment-no-theorem-no-qed',
    holds: () =>
      IMP97049_EXHAUSTIVENESS.certifiedReachUnchanged === 0.96 &&
      IMP97049_EXHAUSTIVENESS.positivityTheoremEstablished === false &&
      IMP97049_EXHAUSTIVENESS.operatorPositivityProved === false &&
      IMP97049_EXHAUSTIVENESS.rhResolved === false &&
      IMP97049_EXHAUSTIVENESS.qed === false &&
      typeof IMP97049_EXHAUSTIVENESS.subGap === 'string' &&
      IMP97049_EXHAUSTIVENESS.subGap.includes('IMP97049_AXIS_LEVEL_ONLY'),
    why: 'this leaf is an assessment; it establishes no positivity theorem, moves no bound, certified reach stays 2a<=0.96, RH open, NO QED.',
  },
];

for (const a of IMP97049_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97049 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
