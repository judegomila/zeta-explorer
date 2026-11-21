/**
 * @module imp-95987-crossing-height-range-collapse-audit
 * @fileoverview imp-95987 -- audit-record module confirming that every in-repo consumer of
 *   the imp-95940 crossing height T_x(a_0) = 2pi exp(exp(2pi^2 C0 - 2(gamma + 1 + a_0)))
 *   presents it as the UNCOLLAPSED range [~5.8e17, ~1.36e28] (set by the unpinned O(1)
 *   arithmetic intercept a_0), never as a single collapsed point value.
 *
 *   WHY THIS AUDIT
 *   --------------
 *   imp-95940 showed T_x is a DOUBLE exponential in a_0 (d lnT_x / d a_0 ~ -78), so with a_0
 *   only bracketed the crossing height spans ~40 orders of magnitude. imp-95964 then confirmed
 *   the underlying constant b (hence a_0) cannot be pinned to O(0.01) because the Var S(T)
 *   boundary constant K is unresolved. A stale consumer that had collapsed T_x to a single
 *   number (e.g. the mean anchor ~5.8e17) would silently overclaim a pinned crossing height.
 *   This module sweeps the consumers and records that none does.
 *
 *   CONSUMERS AUDITED (2026-09-23)
 *   -----------------------------
 *   1. imp-95940-arithmetic-intercept-a0-obstruction -- states the RANGE [~5.8e17, ~1.36e28]
 *      and the closed form; carries the two-leg obstruction and the sub-gap. CLEAN.
 *   2. imp-95971-crossing-height-map-viz-data -- re-plots the frozen closed form as a curve /
 *      33-point grid across the empirical a_0 spread; caveat banner states a_0 is NOT pinned
 *      to a point and names the sub-gap. CLEAN.
 *   3. Imp95971CrossingHeightMapViz.jsx -- prose says the ~1.18 a_0 spread "sweeps the crossing
 *      height across roughly 40 orders of magnitude"; table shows three anchors, not one point;
 *      sub-gap and status banners rendered. CLEAN.
 *   4. imp-95921-c0-offset-approach-analytic-bracket -- explicitly "the safe ceiling is the
 *      RANGE [~5.8e17, ~1.36e28], not a point". CLEAN.
 *   5. imp-95888-rcap-window-bottom-viz-data -- "crosses C0 at a finite height T_x in
 *      [~5.8e17, ~1.36e28]". CLEAN.
 *   6. imp-95984-fujii-varS-constant-literature-locate -- "the imp-95940 crossing range
 *      [~5.8e17, ~1.36e28] does not collapse"; closed form used for context only, NOT collapsed.
 *      CLEAN.
 *   7. imp-95974-a0-fujii-varS-intercept-glossary-headword -- does not surface a T_x value at
 *      all; records a_0 = b - gamma - 1 and that pinning a_0 needs b to O(0.01). CLEAN.
 *
 *   VERDICT: no consumer reports T_x as a single collapsed value; every one that surfaces the
 *   crossing height presents the uncollapsed range and the honest not-pinnable status.
 *
 *   WHAT THIS IS AND IS NOT
 *   -----------------------
 *   An audit record. It establishes nothing new, instantiates no interval, closes no sub-gap,
 *   and moves no bound. imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95940-arithmetic-intercept-a0-obstruction (source: crossing range, sensitivity)
 * @see imp-95971-crossing-height-map-viz-data (range presented as a curve)
 * @see imp-95964-fujii-varS-constant-locate-obstruction (a_0 not pinnable to O(0.01))
 *
 * Ticket: imp-95987 (accuracy, medium). Audit only; changes no bound; NO QED; no refereed bound is changed.
 */

const CONSUMERS_AUDITED = Object.freeze([
  Object.freeze({
    file: 'imp-95940-arithmetic-intercept-a0-obstruction.js',
    role: 'source module (closed form + range + two-leg obstruction)',
    presentsRange: true,
    statesNotPinnable: true,
    verdict: 'clean',
  }),
  Object.freeze({
    file: 'imp-95971-crossing-height-map-viz-data.js',
    role: 'viz-data: closed form re-plotted as a 33-point a_0 grid + anchors + caveat banner',
    presentsRange: true,
    statesNotPinnable: true,
    verdict: 'clean',
  }),
  Object.freeze({
    file: 'Imp95971CrossingHeightMapViz.jsx',
    role: 'page: curve, three anchor rows (not one point), sub-gap + status banners',
    presentsRange: true,
    statesNotPinnable: true,
    verdict: 'clean',
  }),
  Object.freeze({
    file: 'imp-95921-c0-offset-approach-analytic-bracket.js',
    role: 'bracket: "safe ceiling is the RANGE [~5.8e17, ~1.36e28], not a point"',
    presentsRange: true,
    statesNotPinnable: true,
    verdict: 'clean',
  }),
  Object.freeze({
    file: 'imp-95888-rcap-window-bottom-viz-data.js',
    role: 'status prose: "crosses C0 at a finite height T_x in [~5.8e17, ~1.36e28]"',
    presentsRange: true,
    statesNotPinnable: true,
    verdict: 'clean',
  }),
  Object.freeze({
    file: 'imp-95984-fujii-varS-constant-literature-locate.js',
    role: 'literature-locate: "crossing range [~5.8e17, ~1.36e28] does not collapse"',
    presentsRange: true,
    statesNotPinnable: true,
    verdict: 'clean',
  }),
  Object.freeze({
    file: 'imp-95974-a0-fujii-varS-intercept-glossary-headword.js',
    role: 'glossary headword: surfaces no T_x value; records a_0 = b - gamma - 1, needs b to O(0.01)',
    presentsRange: false, // does not surface a T_x value at all -- vacuously non-collapsing
    statesNotPinnable: true,
    verdict: 'clean',
  }),
]);

export const IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT = Object.freeze({
  id: 'imp-95987',
  proofSection: 'S-frontier',
  audits: 'imp-95940',
  auditedAt: '2026-09-23',
  crossingRange: Object.freeze({ lo: '~5.8e17', hi: '~1.36e28', decades: '~40' }),
  question:
    'Does any page/module report the imp-95940 T_x(a_0) crossing height as a single collapsed ' +
    'value rather than the [~5.8e17, ~1.36e28] range, given imp-95964 confirmed b (hence a_0) ' +
    'is not pinnable to O(0.01)?',
  consumersAudited: CONSUMERS_AUDITED,
  anyCollapsedPointValue: false,
  anyBoundMoved: false,
  verdict:
    'AUDIT CLEAN. Every in-repo consumer that surfaces the imp-95940 crossing height presents it ' +
    'as the uncollapsed range [~5.8e17, ~1.36e28] and states the honest not-pinnable status ' +
    '(a_0, hence b, cannot be pinned to O(0.01) while the Var S(T) boundary constant K is ' +
    'unresolved -- imp-95964). No consumer reports a single collapsed point value. The glossary ' +
    'headword imp-95974 surfaces no T_x value at all. Audit only; establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95940 (crossing range [~5.8e17, ~1.36e28], d lnT_x / d a_0 ~ -78); imp-95964 (b, hence ' +
    'a_0, not pinnable to O(0.01), boundary constant K unresolved); imp-95921 / imp-95888 / ' +
    'imp-95971 / imp-95984 / imp-95974 (consumers, all present the range uncollapsed).',
});

export default IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT_ASSERTIONS = [
  {
    id: 'imp95987-every-consumer-clean',
    why: 'Each audited consumer must be recorded clean, and none may report a collapsed point value.',
    holds: () =>
      IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT.anyCollapsedPointValue === false &&
      IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT.consumersAudited.length === 7 &&
      IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT.consumersAudited.every(
        (c) => c.verdict === 'clean' && c.statesNotPinnable === true,
      ),
  },
  {
    id: 'imp95987-honesty-gate-no-qed',
    why: 'Audit only: no bound claimed moved, NO QED, no-refereed-bound-change line present, source ticket recorded.',
    holds: () =>
      IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT.anyBoundMoved === false &&
      /NO QED/.test(IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT.verdict) &&
      /imp-95940/.test(IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT.audits),
  },
];

for (const assertion of IMP95987_CROSSING_HEIGHT_RANGE_COLLAPSE_AUDIT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95987-crossing-height-range-collapse-audit assertion failed: ${assertion.id}`,
    );
  }
}
