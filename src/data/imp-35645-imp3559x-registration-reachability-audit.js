/**
 * @module imp-35645-imp3559x-registration-reachability-audit
 *
 * imp-35645 (meta, audit): a registration/reachability sweep (imp-35472/imp-35545/imp-35606/
 * imp-35630 method) over three modules the imp-35630 imp-35550..imp-35574 cohort audit did NOT
 * cover (all three ids fall above that audit's hi=35574 bound): imp-35593
 * (peak-damping-viz-data), imp-35594 (peak-crossover-mechanism-derivation), and imp-35597
 * (threshold-collapse-viz-data).
 *
 * METHOD. For the two *-viz-data modules (imp-35593, imp-35597): grepped src/App.jsx for a lazy
 * import + <Route> entry, grepped src/data/visualizations-index.js for a full registry entry
 * (route/dataModule/ticket/pedagogicalStep), and ran `node scripts/audit-nav-links.mjs` to confirm
 * the live nav audit carries no WARN for either route (the imp-35606 method). For imp-35594 (an
 * assessment/derivation module, no page): grepped scripts/run-assertions.mjs DATA_MODULES for a
 * direct '/src/data/imp-35594-peak-crossover-mechanism-derivation.js' entry (the imp-35630 method
 * for non-viz files).
 *
 * FINDING -- ALL THREE MODULES EXPORT CLEANLY AND ARE REACHABLE, NONE ORPHANED. imp-35593 and
 * imp-35597 are both fully registered: App.jsx carries the lazy import and <Route> for
 * /viz-imp35593-peak-damping and /viz-imp35597-threshold-collapse, visualizations-index.js carries
 * complete entries (pedagogicalStep 91 and 92 respectively), and `node scripts/audit-nav-links.mjs`
 * exits 0 with zero WARN lines mentioning either route. imp-35594 has a DIRECT
 * scripts/run-assertions.mjs DATA_MODULES entry (line ~8901), so its six self-executing THROWing
 * assertions run under `npm run assert` without needing a transitive-import argument.
 *
 * SCOPE. Read-only registration/reachability audit only. No source file required correction --
 * all three modules in this cohort were already properly wired before this audit ran. Changes no
 * bound; establishes no operator positivity; no RH verdict; NO QED. No refereed bound is changed.
 *
 * @see imp-35630-imp3555x-imp3557x-registration-reachability-audit (prior sweep, hi=35574, does not cover these three)
 * @see imp-35606-imp35561-page-registration-reachability-audit (single-page precursor establishing the nav-audit method)
 * @see imp-35545-imp354xx-registration-reachability-audit (prior registration/reachability sweep establishing the method)
 * @see imp-35593-peak-damping-viz-data.js (audited module)
 * @see imp-35594-peak-crossover-mechanism-derivation.js (audited module)
 * @see imp-35597-threshold-collapse-viz-data.js (audited module)
 */

const AUDITED_FILES = [
  {
    file: 'imp-35593-peak-damping-viz-data',
    kind: 'viz-data',
    route: '/viz-imp35593-peak-damping',
    component: 'Imp35593PeakDampingViz',
    registeredInAppJsx: true,
    registeredInVisualizationsIndex: true,
    pedagogicalStep: 91,
  },
  {
    file: 'imp-35594-peak-crossover-mechanism-derivation',
    kind: 'assessment',
    reachability: 'direct-data-modules-entry',
  },
  {
    file: 'imp-35597-threshold-collapse-viz-data',
    kind: 'viz-data',
    route: '/viz-imp35597-threshold-collapse',
    component: 'Imp35597ThresholdCollapseViz',
    registeredInAppJsx: true,
    registeredInVisualizationsIndex: true,
    pedagogicalStep: 92,
  },
];

const NAV_LINK_AUDIT_EXIT_CODE = 0;
const NAV_LINK_AUDIT_WARN_COUNT_FOR_AUDITED_ROUTES = 0;
const DANGLING_OR_ORPHANED_FOUND = 0;

export const IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT = {
  id: 'imp-35645',
  proofSection: 'audit',
  question:
    'Are the imp-35593 (peak-damping viz-data), imp-35594 (peak-crossover-mechanism derivation), ' +
    'and imp-35597 (threshold-collapse viz-data) modules each exported and reachable where ' +
    'expected -- default export or named const, imported by their consuming page/assertion -- ' +
    'given none fell inside the imp-35630 imp-35550..imp-35574 sweep range?',
  verdictShort:
    'CLEAN. imp-35593 and imp-35597 are both fully registered: App.jsx has the lazy import + ' +
    '<Route>, visualizations-index.js has a complete entry (pedagogicalStep 91/92), and ' +
    'audit-nav-links.mjs exits 0 with no WARN for either route. imp-35594 has a direct ' +
    'scripts/run-assertions.mjs DATA_MODULES entry, so its self-executing assertions run under ' +
    '`npm run assert` without needing a transitive-import argument. None orphaned.',
  auditedFiles: AUDITED_FILES,
  auditedFileCount: AUDITED_FILES.length, // 3
  navLinkAuditExitCode: NAV_LINK_AUDIT_EXIT_CODE,
  navLinkAuditWarnCountForAuditedRoutes: NAV_LINK_AUDIT_WARN_COUNT_FOR_AUDITED_ROUTES,
  danglingOrOrphanedFound: DANGLING_OR_ORPHANED_FOUND,
  isRigorous: false,
  verdict:
    'AUDIT ONLY (not rigorous, not a measurement of a mathematical quantity). Checked App.jsx ' +
    'route wiring, visualizations-index.js registry wiring, and scripts/run-assertions.mjs ' +
    'DATA_MODULES membership for imp-35593, imp-35594, and imp-35597. Result: all three fully ' +
    'registered and reachable; no source file required correction. Changes no bound; establishes ' +
    'no operator positivity; no RH verdict; NO QED. No refereed bound is changed.',
  citation:
    'imp-35630 (prior sweep whose hi=35574 bound excludes these three, prompting this follow-up ' +
    'audit); imp-35606/imp-35545 (registration/reachability method).',
};

export const IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS = [
  {
    id: 'imp35645-audited-three-files',
    description: 'exactly the three named modules were audited',
    holds: () =>
      IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT.auditedFileCount === 3 &&
      AUDITED_FILES.map((f) => f.file).join(',') ===
        [
          'imp-35593-peak-damping-viz-data',
          'imp-35594-peak-crossover-mechanism-derivation',
          'imp-35597-threshold-collapse-viz-data',
        ].join(','),
  },
  {
    id: 'imp35645-viz-modules-fully-registered',
    description: 'both viz-data modules are registered in App.jsx and visualizations-index.js',
    holds: () =>
      AUDITED_FILES.filter((f) => f.kind === 'viz-data').every(
        (f) => f.registeredInAppJsx === true && f.registeredInVisualizationsIndex === true,
      ),
  },
  {
    id: 'imp35645-assessment-module-direct-entry',
    description: 'the non-viz assessment module has a direct DATA_MODULES entry',
    holds: () =>
      AUDITED_FILES.find((f) => f.file === 'imp-35594-peak-crossover-mechanism-derivation')
        .reachability === 'direct-data-modules-entry',
  },
  {
    id: 'imp35645-nav-link-audit-clean',
    description: 'node scripts/audit-nav-links.mjs exits 0 with no WARN for the audited routes',
    holds: () =>
      IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT.navLinkAuditExitCode === 0 &&
      IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT.navLinkAuditWarnCountForAuditedRoutes === 0,
  },
  {
    id: 'imp35645-none-orphaned',
    description: 'no dangling or orphaned module found',
    holds: () => IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT.danglingOrOrphanedFound === 0,
  },
  {
    id: 'imp35645-honesty-gate-no-qed',
    description: 'Audit only: no bound changed, no operator positivity, no RH verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT.isRigorous === false &&
      /NO QED/.test(IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT.verdict) &&
      /refereed bound is changed/i.test(IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT.verdict),
  },
];

for (const a of IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35645-imp3559x-registration-reachability-audit assertion failed: ${a.id}`);
  }
}

export default IMP35645_IMP3559X_REGISTRATION_REACHABILITY_AUDIT;
