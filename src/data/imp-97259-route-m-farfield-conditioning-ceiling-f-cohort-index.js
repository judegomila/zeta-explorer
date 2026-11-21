/**
 * @module imp-97259-route-m-farfield-conditioning-ceiling-f-cohort-index
 * @fileoverview imp-97259 -- META cross-reference index note grouping the Route M far-field
 *   CONDITIONING-CEILING F cohort (imp-96750 slope lemma reduction / imp-96771 H2 slope-factor
 *   reconciliation / imp-97160 additive-term spread / imp-97207 intercept structural derivation)
 *   as a single ARC, so future work reads the four together as "reduce the slope to one lemma,
 *   reconcile the slope readouts, discover the additive term dominates, then derive the additive
 *   term's structure -- landing on ONE still-unevaluated sub-leading constant" instead of four
 *   isolated leaves. Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All four act on the imp-96667 interior Frobenius second moment
 *   Int(N) = s* log N + c1 + o(1) that feeds the imp-97081/imp-97142 far-field conditioning
 *   ceiling F (a slope-derived placement F_center = 3.775e7 at s* = 5.76, alongside the rigorous
 *   trace ceiling T = 2.594e7).
 *     imp-96750 -- REDUCES a one-sided upper asymptotic Int(N) <= s* log N to a SINGLE uniform
 *       lemma Q(b) <= s0* b + O(1) via an exact symmetric regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2
 *       (checkpoint T(250) reproduced exactly); MEASURES the leading slope s0 -> 1.75 (window
 *       means rising 1.690/1.729/1.745/1.751); and RULES OUT the obvious term-splitting attack,
 *       which overshoots to polynomial M log^2 M growth (measured 2801 vs true 17.2 at M=1200).
 *     imp-96771 -- embedded in the imp-96750 module as a numerical RECONCILIATION: the induced
 *       T-slope (2 s0 ~ 3.50) and the imp-96708 measured T-slope (3.495) agree to 0.2%, and the
 *       H2-weighted interior/total Int-slopes (5.66/5.80) sit at/just-above zeta(2) times the
 *       T-slope (5.749) -- exactly the imp-96708 H2-weight sandwich factor, not a mis-scaling; the
 *       total slope exceeds the ceiling only by the a=1 border term (+0.0555). Closes a potential
 *       "the slope numbers disagree" false alarm.
 *     imp-97160 -- MEASURES the SECOND, separate O(1) additive-intercept residual the slope band
 *       leaves open: the near-field OLS fit intercepts (interior a=-14.929, total a=-5.484, both
 *       negative) contribute -14.86%/-5.46% to F -- 2.25x..6.11x the ENTIRE imp-97142 slope band
 *       (2.43pp), a ratio shown MODEL-INDEPENDENT (same in the proportional and sqrt-log crossing
 *       models). The COMBINED slope+additive spread (~7.89..17.29pp) is comparable to or WIDER
 *       than the original imp-96982 band (6.99pp) the far-field discriminator was meant to narrow
 *       -- but because both intercepts are negative, the outside-low verdict is REINFORCED, not
 *       threatened.
 *     imp-97207 -- DERIVES the additive intercept c1 in closed STRUCTURAL form via the imp-96750
 *       regrouping: c1_T = 2 s0 (gamma-3/2) + 2 cQ (zeta(2)-5/4) + 2R, a linear functional of the
 *       leading slope s0 and two sub-leading Q-functionals (cQ, R) with EXACT harmonic/zeta
 *       coefficients. Shows the intercept is not an independent free parameter, but the VALUE
 *       stays unpinned because the DOMINANT constituent is 2 cQ (zeta(2)-5/4) -- and cQ is exactly
 *       the sub-leading constant term of Q(b) that the imp-96750 lemma BOUNDS but never EVALUATES.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-96750 reads as a completed slope-lemma
 *   reduction, imp-96771 as an unrelated numerical sanity check, imp-97160 as a standalone
 *   sensitivity measurement, and imp-97207 as a separate structural derivation. Read together, the
 *   four TELESCOPE onto one object: imp-96750 pins the LEADING slope s0 and rules out the naive
 *   splitting attack; imp-96771 confirms the resulting slope readouts are mutually consistent (no
 *   hidden scaling bug); imp-97160 then shows that pinning the slope is NOT enough -- the additive
 *   intercept dominates the far-field uncertainty on F; and imp-97207 shows WHY: the intercept's
 *   only unpinned piece is the SAME sub-leading constant cQ of Q(b) that imp-96750's lemma left as
 *   an unevaluated O(1). A scout stopping after imp-96750+imp-96771 would wrongly conclude the
 *   far-field ceiling F is well-pinned once the slope is measured and reconciled; imp-97160+
 *   imp-97207 show the true residual is one level deeper, and it is the SAME unevaluated constant
 *   in both the "is F pinned as a value" question and the "is the upper asymptotic proved" question.
 *
 *   MEASURED / DERIVED (what each leaf actually establishes).
 *   - the one-sided upper asymptotic reduces (rigorously) to Q(b) <= s0* b + O(1); measured s0 ~
 *     1.75-1.76 (five cross-checked readouts, imp-96750/imp-97207/imp-97243); term-splitting is
 *     proved to overshoot polynomially and is ruled out (imp-96750).
 *   - the T-slope and Int-slope readouts are mutually consistent through the known H2 in
 *     [1, zeta(2)] weight factor; the ~1.6x gap between the unweighted and weighted slopes is
 *     exactly that weight, not a mis-scaling; the interior sandwich interiorSlope <= zeta(2) *
 *     tSlope HOLDS (5.6564 <= 5.7493) (imp-96771, measurement).
 *   - the additive intercept DOMINATES the slope band by 2.25x-6.11x (model-independent ratio);
 *     the combined slope+additive spread (~7.89..17.29pp) reaches/exceeds the original imp-96982
 *     band (6.99pp); both intercepts are negative, reinforcing (not threatening) the outside-low
 *     verdict (imp-97160, measurement, no bound moved).
 *   - the intercept's harmonic/zeta STRUCTURE is derivable in closed form with exact coefficients
 *     (gamma-3/2) and (zeta(2)-5/4); the intercept is a linear functional of s0 and two sub-leading
 *     Q-functionals (cQ, R), dominated by the unpinned cQ (imp-97207, rigorous reduction).
 *
 *   NOT ESTABLISHED (what stays open).
 *   - the sub-leading constant cQ and remainder tail-sum R of Q(b) = s0 b + cQ + r(b) are NOT
 *     evaluated (only coarsely fit, cQ ~ -13.4); pinning them would fix F as a value, not just a
 *     slope-derived placement (imp-97207's own named sub-gap).
 *   - the H2-weight intercept correction between the unweighted c1_T and the H2-weighted Int
 *     intercept is a further unpinned constant (imp-97207).
 *   - the imp-96750 one-sided upper lemma Q(b) <= s0* b + O(1) itself remains MEASURED, not proved.
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No
 *   bound changes: T = 2.594e7 stays the rigorous trace-ceiling anchor; F = 3.775e7 stays a
 *   slope-derived placement, not a value; compute (N ~ 9916, imp-96352) binds first by >2600x
 *   regardless. No refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (slope lemma; also carries imp-96771)
 * @see imp-97160-route-m-farfield-additive-term-spread.js (sizes the additive-term residual)
 * @see imp-97207-route-m-farfield-intercept-derivation.js (derives the additive intercept's structure)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic.js (the measured OLS fit intercepts/slopes)
 * @see imp-96708-route-m-interior-second-moment-dichotomy.js (the H2 sandwich Int<=zeta(2)T)
 * @see imp-97239-route-m-arith-remainder-uniformity-cohort-index.js (sibling index: the arithmetic-leaf cohort)
 * @see project_route_m_lower_companion_first_moment (Route M first-moment program, memory)
 *
 * Ticket: imp-97259 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

const GAMMA = 0.5772156649015329;
const ZETA2 = (Math.PI * Math.PI) / 6.0; // 1.6449340668482264

const ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-96750',
    role: 'reduces the one-sided upper asymptotic Int(N)<=s* log N to a single uniform lemma',
    result:
      'exact symmetric regrouping T(M) = 2 Sum_{b<=M} Q(b)/b^2 (checkpoint reproduced exactly) ' +
      'reduces the log-upper-bound to Q(b) <= s0* b + O(1); measured s0 -> 1.75; the obvious ' +
      'term-splitting attack is proved to overshoot polynomially (M log^2 M) and is ruled out.',
  }),
  Object.freeze({
    id: 'imp-96771',
    role: 'reconciles the induced/T-slope readouts against the interior/total Int-slope readouts',
    result:
      'the ~1.6x gap between the unweighted T-slope and the H2-weighted interior/total Int-slopes ' +
      'is exactly the imp-96708 H2 in [1,zeta(2)] weight factor, not a mis-scaling; the interior ' +
      'sandwich interiorSlope <= zeta(2)*tSlope holds (5.6564 <= 5.7493); the total slope exceeds ' +
      'it only by the a=1 border contribution (+0.0555).',
  }),
  Object.freeze({
    id: 'imp-97160',
    role: 'sizes the O(1) additive-intercept residual separately from the slope band',
    result:
      'the measured OLS fit intercepts (interior -14.929, total -5.484, both negative) contribute ' +
      '2.25x..6.11x the entire slope band to F (a model-independent ratio); the combined ' +
      'slope+additive spread (~7.89..17.29pp) reaches/exceeds the original imp-96982 band (6.99pp); ' +
      'the outside-low verdict is REINFORCED, not threatened, since the shift is downward.',
  }),
  Object.freeze({
    id: 'imp-97207',
    role: 'derives the additive intercept in closed structural form',
    result:
      'c1_T = 2 s0 (gamma-3/2) + 2 cQ (zeta(2)-5/4) + 2R, a linear functional of the leading slope ' +
      's0 and two sub-leading Q-functionals (cQ, R) with EXACT harmonic/zeta coefficients; the ' +
      'intercept is dominated by the unpinned cQ -- the SAME sub-leading constant the imp-96750 ' +
      'lemma bounds but never evaluates -- so the value stays unpinned though the structure is derived.',
  }),
]);

export const IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX = Object.freeze({
  id: 'imp-97259',
  proofSection: 'Route-M',
  cohort: ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT,
  measuredSignal:
    'the far-field conditioning-ceiling F residual telescopes onto ONE unevaluated constant: the ' +
    'sub-leading term cQ of the two-variable Vasyunin/Bettin-Conrey cotangent second moment Q(b), ' +
    'which imp-96750 bounds (not evaluates), imp-97160 shows dominates the value-level uncertainty ' +
    'on F, and imp-97207 shows is the dominant constituent of the intercept in closed structural form.',
  namedResiduals: [
    'IMP96750_ONE_SIDED_UPPER_LEMMA_Q_LE_S0_B_PLUS_O1_OPEN',
    'IMP97207_SUBLEADING_COTANGENT_CONSTANT_CQ_AND_TAIL_R_OPEN',
    'IMP97207_H2_WEIGHT_INTERCEPT_CORRECTION_OPEN',
  ],
  gamma: GAMMA,
  zeta2: ZETA2,
  h2SandwichFactor: 2 * ZETA2, // 3.289868133696453 (imp-96771: Int-slope = 2 zeta(2) s0; T-slope = 2 s0)
  interiorSandwichHolds: 5.6564 <= ZETA2 * 3.495176, // true (5.6564 <= 5.7493), imp-96771
  additiveDominatesSlopeBandRatio: Object.freeze({ lo: 2.25, hi: 6.11 }), // imp-97160
  combinedSpreadPp: Object.freeze({ lo: 7.89, hi: 17.29 }), // imp-97160
  originalBandWidthPp: 6.987, // imp-96982, 8.356-1.369
  interceptStructureDerivable: true, // imp-97207
  interceptValuePinnable: false, // imp-97207: dominated by unpinned cQ
  fCenterSlopeDerivedOnly: true, // F = 3.775e7 is a placement, not a certified value
  rigorousTraceCeiling: 2.594e7, // T, the only certified anchor
  anyBoundMoved: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x regardless
  question:
    'The Route M far-field conditioning-ceiling F cohort (imp-96750/imp-96771/imp-97160/imp-97207) ' +
    'reads as four separate tickets -- a slope reduction, a sanity-check reconciliation, a ' +
    'sensitivity measurement, and a structural derivation. Grouped, do they converge on a single ' +
    'residual, or do they leave F pinned by independent obstructions?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-96750 reduces the one-sided upper asymptotic to ' +
    'a single slope lemma and measures s0 -> 1.75, ruling out the naive term-splitting attack; ' +
    'imp-96771 confirms the resulting slope readouts (unweighted T vs H2-weighted Int) are mutually ' +
    'consistent through the known H2 in [1,zeta(2)] weight, not a mis-scaling; imp-97160 then shows ' +
    'pinning the slope is NOT enough -- the O(1) additive intercept dominates the far-field ' +
    'uncertainty on F by 2.25x-6.11x, widening the true spread to ~7.89-17.29pp (reinforcing, not ' +
    'threatening, the outside-low verdict); imp-97207 shows WHY -- the intercept is derivable in ' +
    'closed structural form but its dominant constituent is the SAME sub-leading constant cQ of ' +
    'Q(b) that the imp-96750 lemma bounds but never evaluates. Together the four show the entire ' +
    'far-field-F residual, at every level (slope, cross-check, value-sensitivity, structure), ' +
    'telescopes onto ONE still-unevaluated constant. Establishes nothing new; moves no bound; F ' +
    'stays a slope-derived placement, not a certified value; the rigorous anchor remains T = ' +
    '2.594e7; compute N ~ 9916 binds first by >2600x regardless; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96750 (slope lemma reduction + term-splitting obstruction); imp-96771 (H2 slope-factor ' +
    'reconciliation); imp-97160 (additive-term spread, dominates the slope band); imp-97207 ' +
    '(intercept structural derivation, dominated by unpinned cQ).',
});

export default IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp97259-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-96750', 'imp-96771', 'imp-97160', 'imp-97207'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp97259-h2-sandwich-factor-exact',
    why: 'The index quotes the imp-96771 H2 slope-factor reconciliation; it must equal 2*zeta(2) ' +
      'bit-for-bit, and the interior sandwich inequality it establishes must hold.',
    holds: () => {
      const idx = IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX;
      return (
        Math.abs(idx.h2SandwichFactor - 2 * ZETA2) < 1e-12 &&
        idx.interiorSandwichHolds === true
      );
    },
  },
  {
    id: 'imp97259-additive-dominates-and-combined-spread-reaches-original-band',
    why: 'The whole point of grouping imp-97160 in is that the additive term dominates the slope ' +
      'band and the combined spread reaches/exceeds the original imp-96982 band; a flipped or ' +
      'shrunk figure would silently misrepresent the settled measurement.',
    holds: () => {
      const idx = IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX;
      return (
        idx.additiveDominatesSlopeBandRatio.lo >= 2.0 &&
        idx.additiveDominatesSlopeBandRatio.hi >= 6.0 &&
        idx.combinedSpreadPp.lo > idx.originalBandWidthPp &&
        idx.combinedSpreadPp.hi > idx.combinedSpreadPp.lo
      );
    },
  },
  {
    id: 'imp97259-intercept-structure-derivable-value-not-pinnable',
    why: 'The whole point of grouping imp-97207 in is the derivable-structure/unpinnable-value ' +
      'split; flipping either flag would misrepresent the settled answer.',
    holds: () => {
      const idx = IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX;
      return idx.interceptStructureDerivable === true && idx.interceptValuePinnable === false;
    },
  },
  {
    id: 'imp97259-named-residuals-present',
    why: 'The index exists to surface the open sub-gaps by name, so future work can find them ' +
      'without re-reading all four tickets.',
    holds: () => {
      const idx = IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX;
      return (
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.includes('IMP96750_ONE_SIDED_UPPER_LEMMA_Q_LE_S0_B_PLUS_O1_OPEN') &&
        idx.namedResiduals.includes('IMP97207_SUBLEADING_COTANGENT_CONSTANT_CQ_AND_TAIL_R_OPEN') &&
        idx.namedResiduals.includes('IMP97207_H2_WEIGHT_INTERCEPT_CORRECTION_OPEN') &&
        idx.anyBoundMoved === false &&
        idx.fCenterSlopeDerivedOnly === true
      );
    },
  },
  {
    id: 'imp97259-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      /NO QED/.test(IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX.verdict) &&
      /RH open/.test(IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP97259_ROUTE_M_FARFIELD_CONDITIONING_CEILING_F_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97259-route-m-farfield-conditioning-ceiling-f-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
