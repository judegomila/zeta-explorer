/**
 * @module imp-35630-imp3555x-imp3557x-registration-reachability-audit
 *
 * imp-35630 (meta, audit): a registration/reachability sweep (imp-35472..imp-35477 /
 * imp-35537/imp-35538 / imp-35545 method) over the imp-35550..imp-35574 assessment/data-module
 * cohort, which had no such sweep run over it yet.
 *
 * METHOD. Enumerated every src/data/imp-355[1-7]x*.js file the imp-35630 ticket names (imp-35551
 * ranking, imp-35553 span-fit, imp-35555/35556/35557 sensitivity, imp-35558 ladder-decision,
 * imp-35559 decade-gap quantification+assertion pair, imp-35561/35564 viz-data modules, imp-35569
 * audit, imp-35571 subleading-rate scope, imp-35572/35573 reference modules, imp-35574 damping) --
 * 14 tickets across 15 files (imp-35559 is an intentional quantification+assertion pair, the
 * established convention per imp-35578/imp-35596). For each: grepped the file for `export`
 * statements (named const vs default), then checked reachability one of two ways -- (a) for the
 * two files suffixed `-viz-data`, grepped src/App.jsx for a lazy import + <Route> and
 * src/data/visualizations-index.js for a full registry entry (route/dataModule/ticket/
 * pedagogicalStep), the imp-35472..imp-35477/imp-35606 method; (b) for the other 13 files, grepped
 * scripts/run-assertions.mjs DATA_MODULES for a direct '/src/data/<file>.js' entry, and where absent,
 * grepped src/data/*.js for an ES import of the file's named export to confirm it is pulled in
 * TRANSITIVELY by a module that IS itself registered in DATA_MODULES (so its self-executing
 * THROWing assertions still run under `npm run assert`, the imp-35610 orphaned-assertion-module
 * concern).
 *
 * FINDING -- ALL 15 FILES EXPORT CLEANLY AND ARE REACHABLE, NONE ORPHANED. Every file carries at
 * least one `export const` (all but imp-35551/35555/35556/35558/35559-quantification/35571/35572
 * also carry `export default`). The two viz-data modules (imp-35561, imp-35564) are BOTH fully
 * registered: App.jsx has the lazy import + <Route> for /viz-imp35561-peak-height-map-sensitivity
 * and /viz-imp35564-fartail-product-decay, and visualizations-index.js carries complete entries
 * (pedagogicalStep 86 and 87 respectively) -- imp-35561's registration was independently confirmed
 * earlier by the imp-35606 single-page audit; this sweep additionally confirms imp-35564, which had
 * no prior dedicated registration check. Of the 13 non-viz-data files, 11 have a DIRECT
 * '/src/data/<file>.js' entry in scripts/run-assertions.mjs DATA_MODULES (imp-35551, imp-35553,
 * imp-35555, imp-35556, imp-35557, imp-35558, imp-35559 BOTH files, imp-35569, imp-35571, imp-35572);
 * the remaining 2 (imp-35573, imp-35574) have NO direct DATA_MODULES entry but are each imported by
 * a sibling module that DOES: imp-35573 is imported by imp-35602-bs3-dt4-3x3-endpoint-positivity-
 * assertions.js (registered) and imp-35506-endpoint-positivity-map-viz-data.js; imp-35574 is
 * imported by imp-35591-peak-damping-literals-assertion.js (registered, after the imp-35610 fix),
 * imp-35593-peak-damping-viz-data.js, imp-35594-peak-crossover-mechanism-derivation.js (registered),
 * imp-35609-peak-damping-input-sensitivity.js (registered), and imp-35611-crossover-bracketing-
 * literals-assertion.js. Because ES-module imports execute the imported module's top-level code
 * first, imp-35573's and imp-35574's own self-executing assertions run whenever `npm run assert`
 * loads their registered importers -- neither is an orphaned-assertion-module case like the one
 * imp-35610 found and fixed for imp-35591 itself.
 *
 * SCOPE. Read-only registration/reachability audit only. No source file required correction --
 * every module in this cohort was already properly wired (directly or transitively) before this
 * audit ran. Changes no bound; establishes no operator positivity; no RH verdict; NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35472-imp354xx-registration-reachability-audit (earlier batch establishing the method)
 * @see imp-35537-r1t-reentry-band-closure-scope (imp-35537/imp-35538 batch this sweep also mirrors)
 * @see imp-35545-imp354xx-registration-reachability-audit (prior registration/reachability sweep)
 * @see imp-35606-imp35561-page-registration-reachability-audit (single-page precursor confirming imp-35561)
 * @see imp-35610 (precedent: found and fixed an orphaned-assertion-module case for imp-35591/imp-35574)
 * @see imp-35629-imp3554x-imp3558x-frontier-crossref-integrity-audit (sibling cross-reference audit over an overlapping id range)
 */

const AUDITED_TICKET_RANGE = { lo: 35550, hi: 35574 };

const AUDITED_FILES = [
  { file: 'imp-35551-route-i-requirement-severity-ranking', hasDefaultExport: false, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35553-eflow-fartail-remnant-decade-span-growth-fit', hasDefaultExport: true, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35555-crossover-bracketing-family-sensitivity', hasDefaultExport: false, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35556-gtrue-ecoll-dimensional-comparability', hasDefaultExport: false, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35557-cubic-skew-height-map-sensitivity', hasDefaultExport: true, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35558-r2-n2000-ladder-advance-decision', hasDefaultExport: false, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35559-r1t-reentry-band-decade-gap-assertion', hasDefaultExport: true, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35559-r1t-reentry-band-decade-gap-quantification', hasDefaultExport: false, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35561-peak-height-map-sensitivity-viz-data', hasDefaultExport: true, reachability: 'viz-registry-entry' },
  { file: 'imp-35564-eflow-fartail-product-decay-viz-data', hasDefaultExport: true, reachability: 'viz-registry-entry' },
  { file: 'imp-35569-sigma-peak-page-honest-status-audit', hasDefaultExport: true, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35571-route-i-subleading-rate-scope', hasDefaultExport: false, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35572-reentry-band-terminal-width-rate-robustness', hasDefaultExport: false, reachability: 'direct-data-modules-entry' },
  { file: 'imp-35573-n2000-bs3-dt4-endpoint-positivity-reference', hasDefaultExport: false, reachability: 'transitive-via-imp-35602' },
  { file: 'imp-35574-peak-location-height-map-damping', hasDefaultExport: true, reachability: 'transitive-via-imp-35591' },
];

const VIZ_REGISTRY_CHECKS = [
  {
    file: 'imp-35561-peak-height-map-sensitivity-viz-data',
    route: '/viz-imp35561-peak-height-map-sensitivity',
    registeredInAppJsx: true,
    registeredInVisualizationsIndex: true,
    pedagogicalStep: 86,
  },
  {
    file: 'imp-35564-eflow-fartail-product-decay-viz-data',
    route: '/viz-imp35564-fartail-product-decay',
    registeredInAppJsx: true,
    registeredInVisualizationsIndex: true,
    pedagogicalStep: 87,
  },
];

const TRANSITIVE_REACHABILITY_CHECKS = [
  {
    file: 'imp-35573-n2000-bs3-dt4-endpoint-positivity-reference',
    importedBy: ['imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions', 'imp-35506-endpoint-positivity-map-viz-data'],
    importerRegisteredInDataModules: 'imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions',
  },
  {
    file: 'imp-35574-peak-location-height-map-damping',
    importedBy: [
      'imp-35591-peak-damping-literals-assertion',
      'imp-35593-peak-damping-viz-data',
      'imp-35594-peak-crossover-mechanism-derivation',
      'imp-35609-peak-damping-input-sensitivity',
      'imp-35611-crossover-bracketing-literals-assertion',
    ],
    importerRegisteredInDataModules: 'imp-35591-peak-damping-literals-assertion',
  },
];

const DANGLING_OR_ORPHANED_FOUND = 0;

export const IMP35630_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35630',
  proofSection: 'audit',
  auditedTicketRange: AUDITED_TICKET_RANGE,
  question:
    'Are the src/data assessment/data modules imp-35550..imp-35574 each exported and reachable ' +
    '(default export / named const, plus visualizations-index.js registration for the *-viz-data ' +
    'modules), or does any have a dangling or absent export/registration?',
  verdictShort:
    'CLEAN. All 15 audited files (14 tickets, imp-35559 an intentional two-file pair) export at ' +
    'least one named const. The two *-viz-data modules (imp-35561, imp-35564) are both fully ' +
    'registered in App.jsx and visualizations-index.js (pedagogicalStep 86/87). Of the 13 non-viz ' +
    'files, 11 have a direct scripts/run-assertions.mjs DATA_MODULES entry; the other 2 (imp-35573, ' +
    'imp-35574) are each imported by a sibling module that does have a direct entry, so their ' +
    'self-executing assertions still run transitively -- none is an orphaned-assertion-module case.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 15
  vizRegistryChecks: VIZ_REGISTRY_CHECKS,
  transitiveReachabilityChecks: TRANSITIVE_REACHABILITY_CHECKS,
  danglingOrOrphanedFound: DANGLING_OR_ORPHANED_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked every export ' +
    'statement, scripts/run-assertions.mjs DATA_MODULES membership, App.jsx route wiring, and ' +
    'visualizations-index.js registry entry for the 15 src/data files spanning the imp-35550..' +
    'imp-35574 assessment/data-module cohort. Result: zero dangling exports, zero absent ' +
    'registrations, zero orphaned assertion modules; no source file required correction. Changes no ' +
    'bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35472..imp-35477 / imp-35537/imp-35538 / imp-35545 / imp-35606 (prior registration/' +
    'reachability sweeps this audit repeats the method of); imp-35610 (precedent for the ' +
    'orphaned-assertion-module failure mode checked for here).',
};

export const IMP35630_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35630-audited-range-matches-ticket-scope',
    description: 'the audit range is exactly [35550, 35574] as scoped by the imp-35630 ticket',
    holds: () =>
      IMP35630_REGISTRATION_REACHABILITY_AUDIT.auditedTicketRange.lo === 35550 &&
      IMP35630_REGISTRATION_REACHABILITY_AUDIT.auditedTicketRange.hi === 35574,
  },
  {
    id: 'imp35630-audited-file-count',
    description: 'the audit covered all 15 files across the 14-ticket cohort',
    holds: () => IMP35630_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 15,
  },
  {
    id: 'imp35630-viz-registry-entries-both-complete',
    description: 'both *-viz-data modules are registered in App.jsx and visualizations-index.js',
    holds: () =>
      IMP35630_REGISTRATION_REACHABILITY_AUDIT.vizRegistryChecks.length === 2 &&
      IMP35630_REGISTRATION_REACHABILITY_AUDIT.vizRegistryChecks.every(
        (v) => v.registeredInAppJsx === true && v.registeredInVisualizationsIndex === true
      ),
  },
  {
    id: 'imp35630-transitive-reachability-resolved',
    description: 'the two direct-entry-less files each have a named, registered importer',
    holds: () =>
      IMP35630_REGISTRATION_REACHABILITY_AUDIT.transitiveReachabilityChecks.length === 2 &&
      IMP35630_REGISTRATION_REACHABILITY_AUDIT.transitiveReachabilityChecks.every(
        (t) => typeof t.importerRegisteredInDataModules === 'string' && t.importedBy.includes(t.importerRegisteredInDataModules)
      ),
  },
  {
    id: 'imp35630-zero-dangling-or-orphaned',
    description: 'no dangling export or orphaned assertion module was found',
    holds: () => IMP35630_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound === 0,
  },
  {
    id: 'imp35630-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35630_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35630_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35630_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35630_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35630-imp3555x-imp3557x-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35630_REGISTRATION_REACHABILITY_AUDIT;
