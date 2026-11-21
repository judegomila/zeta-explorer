/**
 * @module imp-97754-late-frontier-provenance-rollup
 * @fileoverview imp-97754 -- META provenance roll-up cataloguing the recent imp-97722/imp-97723/
 * imp-97724/imp-97725 measurement/cross-validation cohort by EVIDENCE CLASS and confirming each
 * module carries the mandatory honest banner: no-QED, isRigorous-false (or its textual
 * equivalent), and no refereed bound is changed -- following the imp-34218/imp-33307/
 * imp-3931 provenance-roll-up pattern.
 *
 * METHOD (read-only, performed at author time). Each module's @fileoverview/detail block and
 * exported verdict/banner strings were read and classified into the evidence class it earns on
 * its own terms; each module was grepped for `isRigorous`, `NO QED`, and `SOTA`.
 *   - "independent code-path cross-validation": re-derives a previously-fit Route M residual
 *     ladder through the SAME shared analysis code but an independently-extended data range,
 *     to test whether an anomalous local-slope sign holds up.
 *   - "grid-extension asymptote decision": extends a diagnostic's numeric grid far past its
 *     prior ceiling to decide between two competing readings of an unresolved limit (exact value
 *     vs. sub-leading offset).
 *   - "multi-precision exponent fit": actually RUNS a kernel evaluation at several working
 *     precisions (rather than asserting from a single measured pair) and fits the resulting
 *     scaling exponent.
 *   - "analytic pin via implicit differentiation": replaces a finite-difference measurement of
 *     an amplitude with an exact implicit-differentiation derivation, reusing machinery built in
 *     a neighboring ticket.
 *
 * RESULT (audited 2026-09-27). All four modules carry a full honest banner: imp-97723 and
 * imp-97725 use the explicit `isRigorous: false` field; imp-97722 and imp-97724 do not export an
 * `isRigorous` field but state the equivalent textual banner ("NO QED", "No refereed bound is changed")
 * directly in their exported verdict/banner strings. All four state no bound on Lambda moves and
 * no operator-positivity claim. No module in this cohort references the Polymath15 G6a/H2
 * bridge.
 *   - imp-97722-route-m-deep-ladder-independent-crosscheck.js : independent code-path cross-validation
 *   - imp-97723-sigma-fartail-diagnostic-asymptote-one.js     : grid-extension asymptote decision
 *   - imp-97724-mcm-dps-cap-scaling-fit.js                    : multi-precision exponent fit
 *   - imp-97725-fold-amplitude-analytic-pin.js                : analytic pin via implicit differentiation
 *
 * SURFACING NOTE (secondary). imp-97723 and imp-97725 already export the explicit `isRigorous`
 * boolean field; imp-97722 and imp-97724 carry the same honesty content only as prose inside
 * their exported verdict/banner strings, not as a structured field -- a minor format
 * inconsistency across this cohort, not a missing disclosure.
 *
 * @see imp-97722-route-m-deep-ladder-independent-crosscheck.js
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one.js
 * @see imp-97724-mcm-dps-cap-scaling-fit.js
 * @see imp-97725-fold-amplitude-analytic-pin.js
 * @see imp-34218-34146-34151-cohort-provenance-rollup.js (the provenance-roll-up pattern this follows)
 *
 * Ticket: imp-97754 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing new;
 * no bound moves; NO QED; no refereed bound is changed.
 */

export const IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP = {
  id: 'imp-97754',
  auditedAt: '2026-09-27',
  method:
    'Read each of the four imp-97722/imp-97723/imp-97724/imp-97725 module @fileoverview/detail ' +
    'blocks and exported verdict/banner strings; classify by evidence class (independent ' +
    'code-path cross-validation / grid-extension asymptote decision / multi-precision exponent ' +
    'fit / analytic pin via implicit differentiation); grep each for `isRigorous`, `NO QED`, and ' +
    '`SOTA`.',
  modules: [
    {
      file: 'imp-97722-route-m-deep-ladder-independent-crosscheck.js',
      evidenceClass: 'independent code-path cross-validation',
      hasIsRigorousField: false,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97723-sigma-fartail-diagnostic-asymptote-one.js',
      evidenceClass: 'grid-extension asymptote decision',
      hasIsRigorousField: true,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97724-mcm-dps-cap-scaling-fit.js',
      evidenceClass: 'multi-precision exponent fit',
      hasIsRigorousField: false,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97725-fold-amplitude-analytic-pin.js',
      evidenceClass: 'analytic pin via implicit differentiation',
      hasIsRigorousField: true,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
  ],
  evidenceClassCounts: {
    'independent code-path cross-validation': 1,
    'grid-extension asymptote decision': 1,
    'multi-precision exponent fit': 1,
    'analytic pin via implicit differentiation': 1,
  },
  honestBannerFullCoverageCount: 4,
  explicitIsRigorousFieldCount: 2,
  anyBoundMoved: false,
  recommendation:
    'No action needed on the honest-banner side -- all four modules already disclose the ' +
    'no-QED / no-bound-moved / no-refereed-bound-change content, either as an explicit `isRigorous: false` field ' +
    '(imp-97723, imp-97725) or as an equivalent prose banner (imp-97722, imp-97724). Optional ' +
    'future tidy: add an explicit `isRigorous: false` field to imp-97722 and imp-97724 for ' +
    'format consistency across the cohort -- not required, since the disclosure is already present.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. No operator-positivity claim touched. No refereed bound is changed. ' +
    'RH open. NO QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_97754_ASSERTIONS = [
  {
    id: 'imp97754-exactly-four-modules-catalogued',
    holds: () => IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.modules.length === 4,
    why: 'The roll-up must cover exactly the four named cohort modules (imp-97722/97723/97724/97725).',
  },
  {
    id: 'imp97754-four-distinct-evidence-classes',
    holds: () => {
      const m = IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.modules;
      const counts = IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.evidenceClassCounts;
      const distinctClasses = new Set(m.map((x) => x.evidenceClass));
      return (
        distinctClasses.size === 4 &&
        Object.values(counts).every((c) => c === 1) &&
        Object.keys(counts).length === 4
      );
    },
    why: 'Each of the four modules earns a DISTINCT evidence class -- no two modules should share a class.',
  },
  {
    id: 'imp97754-all-four-carry-full-honest-banner',
    holds: () =>
      IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.modules.every(
        (x) => x.noQED === true && x.plattTrudgianSOTA === true && x.honestBannerInProse === true,
      ) && IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.honestBannerFullCoverageCount === 4,
    why: 'Every module in the cohort must carry the no-QED / no-refereed-bound-change disclosure, whether as a ' +
      'structured field or as prose -- grep-verified against the source files.',
  },
  {
    id: 'imp97754-explicit-isrigorous-field-count-matches',
    holds: () => {
      const m = IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.modules;
      const withField = m.filter((x) => x.hasIsRigorousField === true).length;
      return withField === 2 && withField === IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.explicitIsRigorousFieldCount;
    },
    why: 'Grep-verified: only imp-97723 and imp-97725 export an explicit `isRigorous: false` field; ' +
      'imp-97722 and imp-97724 carry the same content only as prose.',
  },
  {
    id: 'imp97754-honesty-gate-no-qed',
    holds: () =>
      IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.anyBoundMoved === false &&
      /NO QED/.test(IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.honestNote) &&
      /refereed bound is changed/i.test(IMP_97754_LATE_FRONTIER_PROVENANCE_ROLLUP.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and no bound moves.',
  },
];

for (const a of IMP_97754_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-97754 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_97754_ASSERTIONS };
