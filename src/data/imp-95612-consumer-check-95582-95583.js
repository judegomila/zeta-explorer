/**
 * @module imp-95612-consumer-check-95582-95583
 *
 * imp-95612 (bug, audit): consumer check for the two most recent frontier finding
 * modules, imp-95582-sigma-postpeak-fine-exponent-ramp.js and imp-95583-discrepancy-
 * tail-evt.js -- are they reachable from a page/route or a data index, or are they
 * orphaned/dead code, and does either transitively import the 16.7MB zeros-to-1e6.js
 * bundle (both claim to be import-light)?
 *
 * METHOD. Grepped src/ for each module's import specifier outside its own file, then
 * grepped src/App.jsx and src/data/visualizations-index.js for a route/index entry.
 * A hit inside src/data/improvements.js is a text-log mention (the module name appears
 * inside a logged "files" array or summary string), not a real `import` statement, and
 * does not count as reachability. For the zeros-bundle check, walked each module's own
 * `import` chain one or more levels (module -> its imports -> their imports -> ...)
 * looking for a literal "zeros-to-1e6" specifier anywhere in the chain.
 *
 * FINDING -- SPLIT VERDICT, ONE WIRED, ONE ORPHANED, NEITHER PULLS THE ZEROS BUNDLE.
 *
 * imp-95583-discrepancy-tail-evt.js: WIRED. It is imported directly by
 * src/pages/Imp95607GumbelZBandViz.jsx (shipped by imp-95607, already routed in
 * App.jsx and indexed in visualizations-index.js). Zero `import` statements of its
 * own -- fully self-contained, so trivially zeros-bundle-free.
 *
 * imp-95582-sigma-postpeak-fine-exponent-ramp.js: ORPHANED. Its only external
 * references outside itself are three sibling data modules that are themselves not
 * imported by any page or visualizations-index.js entry -- imp-95598-transition-knee-
 * ordering-robustness.js, imp-95602-sigma-exponent-ramp-past-1e12.js, and imp-95606-
 * sigma-postpeak-fine-exponent-ramp-viz-data.js (imp-95606's own header says it exists
 * so "a future viz page can chart the ramp", confirming no such page exists yet). Every
 * other match is a text-log mention inside src/data/improvements.js, not an import. It
 * imports lambda-rh-height-mapping.js and polymath15-constant-C-C.js; walking that
 * chain (through g6a-sub-constant-value.js, polymath15-lemma52-shock-holder.js,
 * lambda-intercept-burgers-uniformity.js, bridge-lambda-rh.js, dyson-scaling-N5000.js,
 * dyson-burgers-shock.js, lambda-intercept-analytic.js) finds no "zeros-to-1e6"
 * specifier at any depth -- import-light claim holds despite the orphan status.
 *
 * No fix applied this run: wiring imp-95582 into a page is a distinct (already-queued,
 * low-priority) viz-page task, not this audit ticket's scope. Read-only confirmation;
 * changes no bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-95582-sigma-postpeak-fine-exponent-ramp.js (audited: ORPHANED)
 * @see imp-95583-discrepancy-tail-evt.js (audited: WIRED via imp-95607)
 * @see imp-95607 (page that wired up imp-95583)
 * @see imp-95606-sigma-postpeak-fine-exponent-ramp-viz-data.js (import-light sibling of imp-95582, itself also unrouted)
 * @see imp-36169-imp3606x82x95x96x97x-registration-reachability-audit.js (prior audit, same method)
 */

const AUDITED_FILES = [
  {
    file: 'imp-95582-sigma-postpeak-fine-exponent-ramp',
    reachability: 'orphaned',
    reachedVia: null,
    importsZerosBundle: false,
  },
  {
    file: 'imp-95583-discrepancy-tail-evt',
    reachability: 'routed-page',
    reachedVia: 'src/pages/Imp95607GumbelZBandViz.jsx',
    importsZerosBundle: false,
  },
];

const ZEROS_BUNDLE_IMPORTERS_FOUND = 0;
const ORPHANED_FOUND = 1;

export const IMP95612_CONSUMER_CHECK_95582_95583 = {
  id: 'imp-95612',
  proofSection: 'S-frontier',
  question:
    'Are imp-95582-sigma-postpeak-fine-exponent-ramp.js and imp-95583-discrepancy-tail-evt.js ' +
    'imported by a page/route or a data index, or are they orphaned, and does either ' +
    'transitively import the 16.7MB zeros-to-1e6.js bundle?',
  verdictShort:
    'SPLIT VERDICT. imp-95583 is WIRED (routed page Imp95607GumbelZBandViz.jsx, shipped by ' +
    'imp-95607). imp-95582 is ORPHANED -- its only referrers are three unrouted sibling data ' +
    'modules (imp-95598, imp-95602, imp-95606), none of which are themselves consumed by any ' +
    'page or visualizations-index.js entry. Neither module, nor the imp-95582 import chain, ' +
    'references the zeros-to-1e6.js bundle at any depth checked.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 2
  zerosBundleImportersFound: ZEROS_BUNDLE_IMPORTERS_FOUND,
  orphanedFound: ORPHANED_FOUND,
  orphanFixedInThisCommit: false,
  isRigorous: false,
  verdict:
    'AUDIT ONLY, ONE ORPHAN FLAGGED, NO FIX APPLIED THIS RUN (not rigorous, not a measurement ' +
    'of a mathematical quantity). imp-95583 is reachable pre-audit via the imp-95607 routed page. ' +
    'imp-95582 is confirmed orphaned: wiring it into a viz page is separate, already-queued, ' +
    'lower-priority work, out of scope for this consumer-check ticket. Both modules are ' +
    'confirmed zeros-bundle-free by dependency-chain walk. Changes no bound; establishes no ' +
    'operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-36169/imp-35982/imp-35905 (registration/reachability + import-light guard audit ' +
    'method); imp-95607 (page that wired up imp-95583); imp-95606 (unrouted viz-data sibling ' +
    'of imp-95582).',
};

export const IMP95612_CONSUMER_CHECK_95582_95583_ASSERTIONS = [
  {
    id: 'imp95612-audited-two-files',
    description: 'exactly two modules were audited',
    holds: () => IMP95612_CONSUMER_CHECK_95582_95583.auditedFileCount === 2,
  },
  {
    id: 'imp95612-split-verdict',
    description: 'one module is routed, the other is orphaned',
    holds: () =>
      AUDITED_FILES.filter((f) => f.reachability === 'routed-page').length === 1 &&
      AUDITED_FILES.filter((f) => f.reachability === 'orphaned').length === 1,
  },
  {
    id: 'imp95612-orphan-count-matches',
    description: 'orphanedFound matches the number of orphaned entries',
    holds: () =>
      IMP95612_CONSUMER_CHECK_95582_95583.orphanedFound ===
      AUDITED_FILES.filter((f) => f.reachability === 'orphaned').length,
  },
  {
    id: 'imp95612-no-heavy-bundle-imports',
    description: 'neither audited file transitively imports the 16.7MB zeros-to-1e6.js bundle',
    holds: () =>
      IMP95612_CONSUMER_CHECK_95582_95583.zerosBundleImportersFound === 0 &&
      AUDITED_FILES.every((f) => f.importsZerosBundle === false),
  },
  {
    id: 'imp95612-no-fix-flag-set',
    description: 'no wiring fix was applied in this audit-only commit',
    holds: () => IMP95612_CONSUMER_CHECK_95582_95583.orphanFixedInThisCommit === false,
  },
];

for (const assertion of IMP95612_CONSUMER_CHECK_95582_95583_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95612-consumer-check-95582-95583 assertion failed: ${assertion.id}`);
  }
}
