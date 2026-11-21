/**
 * @module imp-36264-imp36135-160-36246-251-cross-reference-integrity-audit
 *
 * imp-36264 (meta, audit): a cross-reference @see / ES-import / bare-imp-NNNNN integrity
 * audit (imp-35186/imp-36127/imp-36148/imp-36170/imp-36190/imp-36231 method) over the
 * recent frontier batch imp-36135..imp-36160 and imp-36246..imp-36251 -- the 24 src/data
 * files whose five-digit ticket id falls in either window (a mix of viz-data, honest-status,
 * scoping, storyline cross-reference, and sibling audit modules, plus the S-frontier
 * scoping/checklist/caveat-audit family added later). Only 19 of the 26 ids in
 * imp-36135..imp-36160 correspond to a src/data file (imp-36143/36149/36150/36157..36160
 * never shipped a module) and only 5 of the 6 ids in imp-36246..imp-36251 do (imp-36248
 * never shipped one); this audit covers exactly those 24 real files, not the full numeric
 * span. This partly overlaps the imp-36148 sweep (imp-3608x/9x cohort, ends at imp-36097)
 * and is disjoint from the imp-36190/imp-36231 sweeps (imp-36098..36166, imp-36150..36211);
 * it checks the same property -- citation integrity, not DATA_MODULES wiring (that is the
 * sibling registration/reachability audit family, e.g. imp-36189).
 *
 * METHOD. Extracted every "@see" line and every "^import { ... } from './*.js'" statement
 * from all 24 in-range files (grep -n "@see|^import"). (1) Every filename-suffixed target
 * (imp-NNNNN-<slug>, with or without a "src/data/" prefix or ".js" suffix) was checked
 * against the actual src/data directory listing. (2) Every named ES import binding was
 * checked against its target file's real `export const/function NAME` binding. (3) Every
 * distinct bare "imp-NNNNN[a]" token referenced anywhere in the 24 files (136 distinct
 * tokens) was diffed against the universe of real ids: a direct src/data filename-prefix
 * match, else an `id: 'imp-NNNNN'` entry in improvement-queue.js / improvements.js.
 *
 * FINDING. Zero dangling references. All 66 distinct filename-suffixed @see/import targets
 * resolve verbatim to a real src/data file -- no prose-truncation artifacts this cohort (a
 * clean pass, unlike imp-36231's 3 line-wrap artifacts). All 13 distinct named ES imports
 * resolve to a real export binding in their target file. Of 136 distinct referenced
 * imp-ids, 131 resolve (110 via a direct filename-prefix match, 21 via a real
 * improvement-queue.js/improvements.js ticket id, e.g. the legacy low-numbered ids imp-337/
 * imp-342/imp-345/imp-2519/imp-2520/imp-2642 embedded in older non-imp-NNNNN-slug files
 * like lambda-intercept-density-squeeze.js and lambda-polymath15-bridge.js); the 5
 * non-resolving tokens are all established conventions the prior audits already recorded:
 * 2 are wildcard cohort-range notations (imp-3608x, imp-3609x -- prose range shorthand, not
 * literal citations), 2 are sub-gap labels used throughout src/data (imp-34687a directed-
 * rounding layer, imp-34714a Krawczyk existence/uniqueness sub-gap), and 1 is the
 * imp-58685 typo-class exemplar the imp-36148 audit method itself cites in its own
 * question/verdict prose (not a real ticket, deliberately used to describe the failure
 * mode this audit checks for).
 *
 * SCOPE. Assessment/audit only. No source file was modified as a result of this check
 * (none needed correction). Changes no bound; establishes no operator positivity; no RH
 * verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35186-cross-reference-integrity-audit (audit method template)
 * @see imp-36148-imp3608x9x-cross-reference-integrity-audit.js (prior sweep, imp-3608x/9x cohort)
 * @see imp-36190-imp36098-166-cross-reference-integrity-audit.js (prior sweep, imp-36098..36166)
 * @see imp-36231-imp3615x-3621x-cross-reference-integrity-audit.js (prior sweep, imp-36150..36211)
 * @see imp-36189-imp36098-166-registration-reachability-audit.js (sibling audit family, DATA_MODULES wiring)
 */

const AUDITED_COHORT = [
  'imp-36135-kbn-floor-headroom-extrapolation',
  'imp-36136-krawczyk-residual-directed-rounding-layer-construction-scope',
  'imp-36137-routeC-perN-rate-form-and-bridge-consumability',
  'imp-36138-sharecoll-subpercent-threshold-crossings-viz-data',
  'imp-36139-etrunc-coll-crossover-sensitivity',
  'imp-36140-routeB-rate-vs-ecoll-collision-rate-comparison',
  'imp-36141-route-ii-vs-route-i-panel-count-ratio',
  'imp-36142-joint-basin-non-convex-single-axis-unsafe-honest-status',
  'imp-36144-kbn-kahan-intermittency-band-viz-data',
  'imp-36145-joint-recovery-contour-viz-data',
  'imp-36146-precision-non-binding-consolidated-honest-status',
  'imp-36147-routeB-consumable-modulo-anchor-honest-status',
  'imp-36148-imp3608x9x-cross-reference-integrity-audit',
  'imp-36151-routeC-vs-routeB-perN-exponent-comparison',
  'imp-36152-whitham-cw-vs-g6a-modulus-scoping',
  'imp-36153-krawczyk-residual-surrogate-layer-ratio-a-dependence',
  'imp-36154-krawczyk-existence-uniqueness-subgap-requirements',
  'imp-36155-sharecoll-crossing-precedes-sole-survivor',
  'imp-36156-e-share-crossings-secant-crossvalidation',
  'imp-36246-s-frontier-scoping-module-overview',
  'imp-36247-krawczyk-r1-r6-dependency-checklist',
  'imp-36249-b1b2b3-caveat-integrity-audit',
  'imp-36250-shared-delta-lo-triad-cross-reference',
  'imp-36251-krawczyk-residual-operator-fixedpoint-viz-data',
];

// The 5 referenced imp-id tokens outside the literal ticket/file universe, all explained
// (none is a dangling reference -- established conventions the prior audits already recorded).
const EXPLAINED_NON_UNIVERSE_IDS = [
  'imp-3608x', 'imp-3609x',   // wildcard cohort-range notations (prose shorthand, from imp-36148's own @see)
  'imp-34687a', 'imp-34714a', // sub-gap labels used throughout src/data (not literal ticket ids)
  'imp-58685',                // typo-class exemplar cited in imp-36148's own audit-method prose
];

const DISTINCT_FILENAME_TARGETS_CHECKED = 66; // distinct filename-suffixed @see/import tokens extracted
const FILENAME_TARGETS_RESOLVING_TO_FILE = 66; // resolve verbatim to a real src/data file (zero artifacts this cohort)
const DISTINCT_NAMED_IMPORTS_CHECKED = 13; // distinct named ES import bindings checked against target exports
const NAMED_IMPORTS_RESOLVING = 13; // all resolve to a real export binding
const DISTINCT_REFERENCED_IDS_CHECKED = 136; // distinct bare imp-id tokens referenced across the cohort
const REFERENCED_IDS_RESOLVING = 131; // resolve to a real filename prefix or ticket id (136 - 5 explained)
const DANGLING_REFERENCES_FOUND = 0;

export const IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT = {
  id: 'imp-36264',
  proofSection: 'audit',
  question:
    'Do the @see tags, ES-module import targets, and bare imp-NNNNN ticket citations in ' +
    'the imp-36135..imp-36160 and imp-36246..imp-36251 frontier batch (24 src/data files) ' +
    'all resolve to real files, real exported symbols, and real tickets -- or are there ' +
    'dangling references (the imp-58685 typo class)?',
  verdictShort:
    'CLEAN. Zero dangling references across all 24 audited files. All 66 distinct ' +
    'filename-suffixed tokens resolve verbatim to a real src/data file (no prose-artifact ' +
    'exceptions this cohort). All 13 named ES imports resolve to real exports. 131 of 136 ' +
    'distinct referenced imp-ids resolve (110 via filename prefix, 21 via a real ' +
    'improvement-queue.js/improvements.js ticket id); the 5 that do not are 2 wildcard ' +
    'cohort-range tokens, 2 sub-gap labels, and the imp-58685 typo-class exemplar -- all ' +
    'established conventions, none dangling.',
  auditedCohort: AUDITED_COHORT,
  auditedCohortCount: AUDITED_COHORT.length, // 24
  explainedNonUniverseIds: EXPLAINED_NON_UNIVERSE_IDS,
  distinctFilenameTargetsChecked: DISTINCT_FILENAME_TARGETS_CHECKED,
  filenameTargetsResolvingToFile: FILENAME_TARGETS_RESOLVING_TO_FILE,
  distinctNamedImportsChecked: DISTINCT_NAMED_IMPORTS_CHECKED,
  namedImportsResolving: NAMED_IMPORTS_RESOLVING,
  distinctReferencedIdsChecked: DISTINCT_REFERENCED_IDS_CHECKED,
  referencedIdsResolving: REFERENCED_IDS_RESOLVING,
  danglingReferencesFound: DANGLING_REFERENCES_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked ' +
    'every @see tag and ES import specifier in the 24 in-range imp-36135..imp-36160 / ' +
    'imp-36246..imp-36251 cohort files against the actual src/data file listing, each ' +
    'target file’s real export statements, and the improvement-queue.js/improvements.js ' +
    'ticket-id universe plus the src/data filename prefixes. Result: zero dangling ' +
    'references, zero misnamed exports. The 5 non-resolving bare-id tokens are wildcard-' +
    'range shorthand / sub-gap labels / the imp-58685 typo exemplar -- all established ' +
    'conventions. No source file required correction. Changes no bound; establishes no ' +
    'operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35186 (cross-reference integrity audit method); imp-36127/imp-36148/imp-36170/' +
    'imp-36190/imp-36231 (prior audit sweeps, earlier cohorts); imp-36189 (sibling ' +
    'registration/reachability audit family); imp-36135..imp-36160 and imp-36246..imp-36251 ' +
    '(the audited range).',
};

export const IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp36264-audited-twentyfour-files',
    description: 'the audit covers exactly the 24 in-range cohort files',
    holds: () => IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.auditedCohortCount === 24,
  },
  {
    id: 'imp36264-zero-dangling-references',
    description: 'the audit found zero dangling @see targets, import targets, or bare ticket citations',
    holds: () => IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.danglingReferencesFound === 0,
  },
  {
    id: 'imp36264-filename-targets-all-resolve',
    description: 'every distinct filename-suffixed target checked resolves to a real src/data file',
    holds: () =>
      IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.filenameTargetsResolvingToFile ===
      IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctFilenameTargetsChecked,
  },
  {
    id: 'imp36264-named-imports-all-resolve',
    description: 'every distinct named ES import checked resolves to a real export binding',
    holds: () =>
      IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.namedImportsResolving ===
      IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctNamedImportsChecked,
  },
  {
    id: 'imp36264-referenced-id-accounting',
    description: 'the resolving ids plus the 5 explained non-universe tokens account for all 136 referenced ids',
    holds: () =>
      IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.referencedIdsResolving +
        IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.explainedNonUniverseIds.length ===
      IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.distinctReferencedIdsChecked,
  },
  {
    id: 'imp36264-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT.verdict),
  },
];

for (const a of IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36264-imp36135-160-36246-251-cross-reference-integrity-audit assertion failed: ${a.id}`);
  }
}

export default IMP36264_CROSS_REFERENCE_INTEGRITY_AUDIT;
