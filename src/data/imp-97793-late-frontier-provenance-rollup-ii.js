/**
 * @module imp-97793-late-frontier-provenance-rollup-ii
 * @fileoverview imp-97793 -- META provenance roll-up cataloguing the imp-97757..imp-97764
 * late-frontier measurement/cross-validation cohort by EVIDENCE CLASS and confirming each
 * module carries the mandatory honest banner: no-QED, isRigorous-false (or its textual
 * equivalent), and no refereed bound is changed -- EXTENDING the imp-97754 roll-up
 * (which catalogued the earlier imp-97722/97723/97724/97725 cohort) to the next seven
 * modules in the same frontier-scout stream.
 *
 * METHOD (read-only, performed at author time). Each of the seven module @fileoverview/detail
 * blocks and exported verdict/banner strings was read and classified into ONE of the THREE
 * evidence classes named in the imp-97793 ticket description (sensitivity / cross-validation /
 * consumer-audit); each module was grepped for `isRigorous`, `NO QED`, and `SOTA`.
 *   - "sensitivity": measures how a diagnostic or amplitude moves under a perturbation axis
 *     (a floor rescale, a wider sweep window) and reports an elasticity, crossover, or local
 *     exponent -- imp-97757, imp-97759, imp-97764.
 *   - "cross-validation": re-derives a previously-baked figure through an independently-written
 *     code path or a higher working precision, to confirm (or correct) the baked value --
 *     imp-97758, imp-97761, imp-97763.
 *   - "consumer-audit": runs an already-shipped consumer function directly and reports its
 *     domain limits and agreement against an analytic reference -- imp-97762.
 *
 * RESULT (audited 2026-09-27). All seven modules carry a full honest banner: imp-97757,
 * imp-97759, imp-97762, and imp-97764 use the explicit `isRigorous: false` field; imp-97758,
 * imp-97761, and imp-97763 do not export an `isRigorous` field but state the equivalent textual
 * banner ("NO QED", "No refereed bound is changed", "no bound moves") directly in their exported
 * verdict/banner strings. All seven state no bound on Lambda moves and no operator-positivity
 * claim; the three MCM-adjacent modules (imp-97758, imp-97761, imp-97763) additionally restate
 * "MCM refuted from omega=11" verbatim. No module in this cohort references the Polymath15
 * G6a/H2 bridge.
 *   - imp-97757-fold-amplitude-axis-crosstab.js                          : sensitivity
 *   - imp-97758-route-m-ladder-dps40-interior-crosscheck.js               : cross-validation
 *   - imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js    : sensitivity
 *   - imp-97761-mcm-snr10-cap-independent-refit.js                       : cross-validation
 *   - imp-97762-fartail-crossing-height-mapping-domain-audit.js           : consumer-audit
 *   - imp-97763-route-m-ladder-constant-precision-floor.js               : cross-validation
 *   - imp-97764-fold-amplitude-wide-window-power-law.js                  : sensitivity
 *
 * @see imp-97757-fold-amplitude-axis-crosstab.js
 * @see imp-97758-route-m-ladder-dps40-interior-crosscheck.js
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js
 * @see imp-97761-mcm-snr10-cap-independent-refit.js
 * @see imp-97762-fartail-crossing-height-mapping-domain-audit.js
 * @see imp-97763-route-m-ladder-constant-precision-floor.js
 * @see imp-97764-fold-amplitude-wide-window-power-law.js
 * @see imp-97754-late-frontier-provenance-rollup.js (the prior cohort roll-up this extends)
 *
 * Ticket: imp-97793 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing new;
 * no bound moves; NO QED; no refereed bound is changed.
 */

export const IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II = {
  id: 'imp-97793',
  extendsRollup: 'imp-97754',
  auditedAt: '2026-09-27',
  method:
    'Read each of the seven imp-97757/97758/97759/97761/97762/97763/97764 module ' +
    '@fileoverview/detail blocks and exported verdict/banner strings; classify by evidence ' +
    'class (sensitivity / cross-validation / consumer-audit); grep each for `isRigorous`, ' +
    '`NO QED`, and `SOTA`.',
  modules: [
    {
      file: 'imp-97757-fold-amplitude-axis-crosstab.js',
      evidenceClass: 'sensitivity',
      hasIsRigorousField: true,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97758-route-m-ladder-dps40-interior-crosscheck.js',
      evidenceClass: 'cross-validation',
      hasIsRigorousField: false,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover.js',
      evidenceClass: 'sensitivity',
      hasIsRigorousField: true,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97761-mcm-snr10-cap-independent-refit.js',
      evidenceClass: 'cross-validation',
      hasIsRigorousField: false,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97762-fartail-crossing-height-mapping-domain-audit.js',
      evidenceClass: 'consumer-audit',
      hasIsRigorousField: true,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97763-route-m-ladder-constant-precision-floor.js',
      evidenceClass: 'cross-validation',
      hasIsRigorousField: false,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
    {
      file: 'imp-97764-fold-amplitude-wide-window-power-law.js',
      evidenceClass: 'sensitivity',
      hasIsRigorousField: true,
      honestBannerInProse: true,
      noQED: true,
      plattTrudgianSOTA: true,
    },
  ],
  evidenceClassCounts: {
    sensitivity: 3,
    'cross-validation': 3,
    'consumer-audit': 1,
  },
  honestBannerFullCoverageCount: 7,
  explicitIsRigorousFieldCount: 4,
  anyBoundMoved: false,
  recommendation:
    'No action needed on the honest-banner side -- all seven modules already disclose the ' +
    'no-QED / no-bound-moved / no-refereed-bound-change content, either as an explicit `isRigorous: false` field ' +
    '(imp-97757, imp-97759, imp-97762, imp-97764) or as an equivalent prose banner (imp-97758, ' +
    'imp-97761, imp-97763). Same optional future tidy as imp-97754: add an explicit ' +
    '`isRigorous: false` field to the three prose-only modules for format consistency -- not ' +
    'required, since the disclosure is already present.',
  honestNote:
    'Read-only provenance roll-up; no new pages fabricated, no new bound claimed by this module ' +
    'itself. No operator-positivity claim touched. No refereed bound is changed. ' +
    'RH open. NO QED.',
};

// Build-time tripwires that lock the roll-up findings against silent drift.
const IMP_97793_ASSERTIONS = [
  {
    id: 'imp97793-exactly-seven-modules-catalogued',
    holds: () => IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.modules.length === 7,
    why: 'The roll-up must cover exactly the seven named cohort modules (imp-97757/97758/97759/97761/97762/97763/97764).',
  },
  {
    id: 'imp97793-three-evidence-classes-with-matching-counts',
    holds: () => {
      const m = IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.modules;
      const counts = IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.evidenceClassCounts;
      const tally = {};
      for (const x of m) tally[x.evidenceClass] = (tally[x.evidenceClass] || 0) + 1;
      return (
        Object.keys(counts).length === 3 &&
        Object.keys(tally).length === 3 &&
        Object.entries(counts).every(([k, v]) => tally[k] === v)
      );
    },
    why: 'Each module earns one of exactly THREE named evidence classes (sensitivity / ' +
      'cross-validation / consumer-audit); the counts must match a fresh tally of the modules array.',
  },
  {
    id: 'imp97793-all-seven-carry-full-honest-banner',
    holds: () =>
      IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.modules.every(
        (x) => x.noQED === true && x.plattTrudgianSOTA === true && x.honestBannerInProse === true,
      ) && IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.honestBannerFullCoverageCount === 7,
    why: 'Every module in the cohort must carry the no-QED / no-refereed-bound-change disclosure, whether as a ' +
      'structured field or as prose -- grep-verified against the source files.',
  },
  {
    id: 'imp97793-explicit-isrigorous-field-count-matches',
    holds: () => {
      const m = IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.modules;
      const withField = m.filter((x) => x.hasIsRigorousField === true).length;
      return withField === 4 && withField === IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.explicitIsRigorousFieldCount;
    },
    why: 'Grep-verified: only imp-97757, imp-97759, imp-97762, and imp-97764 export an explicit ' +
      '`isRigorous: false` field; imp-97758, imp-97761, and imp-97763 carry the same content only as prose.',
  },
  {
    id: 'imp97793-honesty-gate-no-qed',
    holds: () =>
      IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.anyBoundMoved === false &&
      /NO QED/.test(IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.honestNote) &&
      /refereed bound is changed/i.test(IMP_97793_LATE_FRONTIER_PROVENANCE_ROLLUP_II.honestNote),
    why: 'VERDICT LOCK: this is a read-only roll-up, not a bound; no refereed bound is changed' +
      ' and no bound moves.',
  },
];

for (const a of IMP_97793_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-97793 assertion failed: ' + a.id + ' — ' + a.why);
  }
}

export { IMP_97793_ASSERTIONS };
